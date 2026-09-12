"""AI Saathi chat route — Gemini with keyword-matching fallback."""
from __future__ import annotations

from fastapi import APIRouter

from ..models import ChatRequest, ChatResponse, CropId
from ..services.mock_data import get_sell_decision
from ..services.gemini import chat_with_gemini

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

    # Build context for Gemini
    decision_data = {
        "crop_name": d.crop.names.get("hi", d.crop.names.get("en", "फसल")),
        "quantity": quantity,
        "mandi_name": d.mandi.name,
        "market_price": d.mandi.marketPrice,
        "net_amount": d.netAmount,
        "total_net": d.totalNet,
        "decision": d.decision.value,
        "transport_cost": d.mandi.transportCost,
        "mandi_charges": d.mandi.mandiCharges,
        "reasons": d.reasons,
    }

    reply = await chat_with_gemini(
        message=req.message,
        language=req.language,
        farmer_context=req.farmerContext,
        decision_data=decision_data,
    )

    return ChatResponse(reply=reply)
