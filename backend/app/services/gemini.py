"""Gemini AI service for AI Saathi — server-side only, key never exposed to browser."""
from __future__ import annotations

import logging
import os
import json

logger = logging.getLogger(__name__)

# Lazy-init: only configure when first called, so missing key doesn't crash startup
_model = None
_configured = False
_config_error: str | None = None


def _get_model():
    """Return the configured Gemini model, or None if unavailable."""
    global _model, _configured, _config_error

    if _configured:
        return _model

    _configured = True
    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    if not api_key:
        _config_error = "no-key"
        logger.warning("GEMINI_API_KEY not set — AI Saathi will use fallback responses")
        return None

    try:
        import google.generativeai as genai

        genai.configure(api_key=api_key)
        _model = genai.GenerativeModel(
            model_name="gemini-3.6-flash",
            system_instruction=_SYSTEM_PROMPT,
        )
        logger.info("Gemini model configured successfully")
        return _model
    except Exception as e:
        _config_error = str(e)
        logger.error(f"Gemini configuration failed: {e}")
        return None


_SYSTEM_PROMPT = """\
आप "AI साथी" हैं — फार्मो का कृषि सलाहकार। आप भारतीय किसानों की मदद करते हैं।

नियम:
- हमेशा हिंदी में उत्तर दें (किसान हिंदी में पूछ रहे हैं)।
- उत्तर छोटा और स्पष्ट रखें — 2-4 वाक्य।
- भाव, मंडी, परिवहन खर्च जैसी जानकारी का उपयोग करें।
- यदि किसान कहता है "कहाँ बेचूं" तो सबसे अच्छी मंडी सुझाएं।
- यदि किसान पूछता है "बेचूं या रुकूं" तो सलाह दें।
- भारतीय मुद्रा (₹) का उपयोग करें।
- उत्तर में कोई तकनीकी शब्द या API जानकारी न दें।
- यदि जानकारी अपर्याप्त हो तो सरल सलाह दें।"""


def _build_context_prompt(message: str, language: str, farmer_context: dict, decision_data: dict) -> str:
    """Build the user prompt with farmer context and market data."""
    crop_name = decision_data.get("crop_name", "फसल")
    quantity = decision_data.get("quantity", 0)
    mandi_name = decision_data.get("mandi_name", "")
    market_price = decision_data.get("market_price", 0)
    net_amount = decision_data.get("net_amount", 0)
    total_net = decision_data.get("total_net", 0)
    decision = decision_data.get("decision", "")
    transport_cost = decision_data.get("transport_cost", 0)
    mandi_charges = decision_data.get("mandi_charges", 0)
    reasons = decision_data.get("reasons", [])

    context_lines = [
        f"किसान का प्रश्न: {message}",
        "",
        "फसल जानकारी:",
        f"- फसल: {crop_name}",
        f"- मात्रा: {quantity} क्विंटल",
        "",
        "मंडी जानकारी:",
        f"- सर्वोत्तम मंडी: {mandi_name}",
        f"- आज का भाव: ₹{market_price}/Qtl",
        f"- परिवहन खर्च: ₹{transport_cost}",
        f"- मंडी शुल्क: ₹{mandi_charges}",
        f"- हाथ में: ₹{net_amount}/Qtl",
        f"- कुल अनुमानित राशि: ₹{total_net}",
        f"- सलाह: {'आज बेचें' if decision == 'sell_now' else 'कुछ दिन रुकें'}",
        "",
        "कारण:",
    ]
    for r in reasons:
        context_lines.append(f"- {r}")

    return "\n".join(context_lines)


def _keyword_fallback(message: str, decision_data: dict) -> str:
    """Keyword-based fallback when Gemini is unavailable."""
    crop_name = decision_data.get("crop_name", "फसल")
    quantity = decision_data.get("quantity", 0)
    mandi_name = decision_data.get("mandi_name", "")
    market_price = decision_data.get("market_price", 0)
    net_amount = decision_data.get("net_amount", 0)
    total_net = decision_data.get("total_net", 0)
    decision = decision_data.get("decision", "")
    mandi_short = mandi_name.split(" /")[0] if mandi_name else "मंडी"

    q = message.lower()

    if any(k in q for k in ["भाव", "price", "क्या", "keya"]):
        return f"आज {crop_name} का भाव {mandi_short} में ₹{market_price}/Qtl है। बेचने पर हाथ में ₹{net_amount}/Qtl मिलेगा।"
    elif any(k in q for k in ["कहां", "kahan", "where"]):
        return f"सबसे अच्छी कमाई आपको {mandi_short} में मिलेगी — ₹{net_amount}/Qtl हाथ में। मंडी तुलना में देखें।"
    elif any(k in q for k in ["बेचूं", "रुकूं", "sell", "wait"]):
        if decision == "sell_now":
            return f"मेरी सलाह: आज ही बेचें। ₹{net_amount}/Qtl मिल रहा है और आने वाले दिनों में भाव गिर सकता है।"
        else:
            return "मेरी सलाह: कुछ दिन रुकें। अभी भाव स्थिर है, सरकारी खरीद खुलने का इंतज़ार करें।"
    elif any(k in q for k in ["क्विंटल", "कितना"]):
        return f"आपके {quantity} क्विंटल {crop_name} पर कुल ₹{total_net} मिल सकते हैं। क्या आप मंडी तुलना देखना चाहेंगे?"
    else:
        return f'समझ गया। मैं आपकी {quantity} क्विंटल {crop_name} के लिए सबसे अच्छा सौदा ढूंढने में मदद कर सकता हूं। कहें "कहां बेचूं?"'


async def chat_with_gemini(
    message: str,
    language: str,
    farmer_context: dict,
    decision_data: dict,
) -> str:
    """Call Gemini API and return the reply. Falls back to keyword matching on any error."""
    model = _get_model()

    if model is None:
        return _keyword_fallback(message, decision_data)

    user_prompt = _build_context_prompt(message, language, farmer_context, decision_data)

    try:
        response = model.generate_content(user_prompt)

        if response.text:
            reply = response.text.strip()
            if reply:
                return reply

        # Empty response — fall back
        logger.warning("Gemini returned empty response, using fallback")
        return _keyword_fallback(message, decision_data)

    except Exception as e:
        error_str = str(e).lower()

        # Log the error type but never expose it to the farmer
        if "api_key" in error_str or "invalid" in error_str or "permission" in error_str:
            logger.error(f"Gemini API key error: {e}")
        elif "rate" in error_str or "quota" in error_str or "429" in error_str:
            logger.warning(f"Gemini rate limit hit: {e}")
        elif "timeout" in error_str or "deadline" in error_str:
            logger.warning(f"Gemini timeout: {e}")
        else:
            logger.error(f"Gemini API error: {e}")

        return _keyword_fallback(message, decision_data)
