"""Weather route — server-side only, no API key exposed to frontend."""
from __future__ import annotations

from fastapi import APIRouter, Query

from ..models import Weather
from ..services.mock_data import get_weather

router = APIRouter(prefix="/api/weather", tags=["weather"])


@router.get("", response_model=Weather)
async def weather(city: str = Query("Nashik")):
    """Return weather data for the given city."""
    return get_weather(city)
