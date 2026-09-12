"""Notification routes."""
from __future__ import annotations

from fastapi import APIRouter

from ..models import FarmNotification
from ..services.mock_data import NOTIFICATIONS

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("", response_model=list[FarmNotification])
async def list_notifications():
    """Return all farm notifications."""
    return NOTIFICATIONS
