"""Buyer routes."""
from __future__ import annotations

from fastapi import APIRouter, Query

from ..models import Buyer, CropId
from ..services.mock_data import BUYERS

router = APIRouter(prefix="/api/buyers", tags=["buyers"])


@router.get("", response_model=list[Buyer])
async def list_buyers(crop: CropId = Query(CropId.onion)):
    """Return buyers for the given crop."""
    return BUYERS
