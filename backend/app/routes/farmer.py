"""Farmer auth routes — OTP send/verify, profile."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ..models import Farmer, CropId, OtpRequest, OtpVerifyRequest

router = APIRouter(prefix="/api/farmer", tags=["farmer"])

_DEMO_FARMER = Farmer(
    id="fm-88219",
    name="रमेश पाटील",
    phone="9876543210",
    village="नासिक",
    state="महाराष्ट्र",
    accountId="MH-NSK-88219",
    crops=[CropId.onion, CropId.wheat, CropId.soybean],
    quantity=40,
)


@router.post("/otp/send")
async def send_otp(req: OtpRequest):
    """Send OTP to the given phone number. In dev, always returns success."""
    return {"sent": True, "devOtp": "123456"}


@router.post("/otp/verify")
async def verify_otp(req: OtpVerifyRequest):
    """Verify OTP and return farmer profile."""
    if len(req.otp) != 6 or not req.otp.isdigit():
        raise HTTPException(status_code=400, detail="bad-otp")
    return _DEMO_FARMER


@router.get("/profile")
async def get_profile():
    """Return current farmer profile or null."""
    return None
