"""AI Saathi chat route."""
from __future__ import annotations

from fastapi import APIRouter

from ..models import ChatRequest, ChatResponse, CropId
from ..services.mock_data import get_sell_decision

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """Process a farmer's question and return an AI reply."""
    crop_id = CropId.onion
    quantity = 40

    if req.farmerContext:
        raw_crop = req.farmerContext.get("crop", "onion")
        try:
            crop_id = CropId(raw_crop)
        except ValueError:
            crop_id = CropId.onion
        quantity = int(req.farmerContext.get("quantity", 40))

    d = get_sell_decision(crop_id, quantity)
    mandi_short = d.mandi.name.split(" /")[0]
    q = req.message.lower()

    if any(k in q for k in ["भाव", "price", "क्या", "keya"]):
        reply = f"आज {d.crop.names.get('hi', 'फसल')} का भाव {mandi_short} में ₹{d.mandi.marketPrice}/Qtl है। बेचने पर हाथ में ₹{d.netAmount}/Qtl मिलेगा।"
    elif any(k in q for k in ["कहां", "kahan", "where"]):
        reply = f"सबसे अच्छी कमाई आपको {mandi_short} में मिलेगी — ₹{d.netAmount}/Qtl हाथ में, {d.mandi.distanceKm} किमी दूर। मंडी तुलना में देखें।"
    elif any(k in q for k in ["बेचूं", "रुकूं", "sell", "wait"]):
        if d.decision.value == "sell_now":
            reply = f"मेरी सलाह: आज ही बेचें। ₹{d.netAmount}/Qtl मिल रहा है और आने वाले दिनों में भाव गिर सकता है।"
        else:
            reply = "मेरी सलाह: कुछ दिन रुकें। अभी भाव स्थिर है, सरकारी खरीद खुलने का इंतज़ार करें।"
    elif any(k in q for k in ["क्विंटल", "कितना"]):
        reply = f"आपके {quantity} क्विंटल {d.crop.names.get('hi', 'फसल')} पर कुल ₹{d.totalNet} मिल सकते हैं। क्या आप मंडी तुलना देखना चाहेंगे?"
    else:
        reply = f'समझ गया। मैं आपकी {quantity} क्विंटल {d.crop.names.get("hi", "फसल")} के लिए सबसे अच्छा सौदा ढूंढने में मदद कर सकता हूं। कहें "कहां बेचूं?"'

    return ChatResponse(reply=reply)
