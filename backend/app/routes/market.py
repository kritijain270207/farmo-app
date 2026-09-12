"""Market routes — mandis, sell decision, price trend."""
from __future__ import annotations

from fastapi import APIRouter, Query

from ..models import CropId, Mandi, SellDecision, TrendPoint
from ..services.mock_data import get_mandis, get_price_trend, get_recommended_mandi, get_sell_decision

router = APIRouter(prefix="/api/market", tags=["market"])


@router.get("/mandis", response_model=list[Mandi])
async def mandis(crop: CropId = Query(CropId.onion)):
    """Return mandis ranked by net in-hand for the given crop."""
    return get_mandis()


@router.get("/sell-decision", response_model=SellDecision)
async def sell_decision(
    crop: CropId = Query(CropId.onion),
    quantity: int = Query(40, ge=1, le=1000),
):
    """Return the sell recommendation for a crop + quantity."""
    return get_sell_decision(crop, quantity)


@router.get("/price-trend", response_model=list[TrendPoint])
async def price_trend(crop: CropId = Query(CropId.onion)):
    """Return 7-day price trend for a crop."""
    return get_price_trend(crop)
