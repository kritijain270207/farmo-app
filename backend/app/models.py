"""Pydantic models matching the Next.js TypeScript types."""
from __future__ import annotations

from enum import Enum
from typing import Optional

from pydantic import BaseModel


# ---------- Enums ----------

class CropId(str, Enum):
    onion = "onion"
    wheat = "wheat"
    soybean = "soybean"
    chili = "chili"
    tomato = "tomato"
    peanut = "peanut"
    cotton = "cotton"
    rice = "rice"


class DecisionType(str, Enum):
    sell_now = "sell_now"
    wait = "wait"
    divert = "divert"


class VehicleType(str, Enum):
    tata_ace = "tata_ace"
    pickup = "pickup"
    truck_10 = "truck_10"


class BuyerType(str, Enum):
    food_processor = "food_processor"
    exporter = "exporter"
    retailer = "retailer"
    fpo = "fpo"
    cooperative = "cooperative"


class NotificationType(str, Enum):
    price_up = "price_up"
    price_down = "price_down"
    forecast = "forecast"
    weather = "weather"
    buyer = "buyer"
    system = "system"


# ---------- Models ----------

class Crop(BaseModel):
    id: CropId
    emoji: str
    names: dict[str, str]


class Mandi(BaseModel):
    id: str
    name: str
    distanceKm: float
    minutes: int
    marketPrice: int
    transportCost: int
    mandiCharges: int
    netInHand: int
    arrivalToday: int
    isRecommended: bool
    rank: int
    priceChange: int


class SellDecision(BaseModel):
    crop: Crop
    quantity: int
    decision: DecisionType
    mandi: Mandi
    cropValue: int
    transportCost: int
    mandiCharges: int
    netAmount: int
    totalNet: int
    reasons: list[str]


class Buyer(BaseModel):
    id: str
    name: str
    type: BuyerType
    typeKey: str
    distanceKm: float
    requiredQty: int
    offeredPrice: int
    verified: bool
    phone: str


class FarmNotification(BaseModel):
    id: str
    type: NotificationType
    tone: str
    title: str
    body: str
    timeKey: str
    actionKey: Optional[str] = None


class TrendPoint(BaseModel):
    day: str
    value: int


class ChatRequest(BaseModel):
    message: str
    language: str = "hi"
    farmerContext: dict


class ChatResponse(BaseModel):
    reply: str


class Weather(BaseModel):
    temp: int
    condition: str
    humidity: int
    windSpeed: int
    icon: str
    label: str
    city: str


class OtpRequest(BaseModel):
    phone: str


class OtpVerifyRequest(BaseModel):
    phone: str
    otp: str


class Farmer(BaseModel):
    id: str
    name: str
    phone: str
    village: str
    state: str
    accountId: str
    crops: list[CropId]
    quantity: int
