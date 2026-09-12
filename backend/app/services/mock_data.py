"""Mock data matching the Next.js frontend's mock-data.ts exactly."""
from __future__ import annotations

from ..models import (
    Buyer,
    BuyerType,
    Crop,
    CropId,
    DecisionType,
    FarmNotification,
    Mandi,
    NotificationType,
    SellDecision,
    TrendPoint,
    Weather,
)

# ──────────── Crops ────────────

CROPS: list[Crop] = [
    Crop(id=CropId.onion, emoji="🧅", names={"hi": "प्याज़", "mr": "कांदा", "en": "Onion", "te": "ఉల్లి", "kn": "ಈರುಳ್ಳಿ", "ta": "வெங்காயம்", "bn": "পেঁয়াজ", "or": "ପିଆଜ", "gu": "ડુંગળી", "as": "পিয়াজ"}),
    Crop(id=CropId.wheat, emoji="🌾", names={"hi": "गेहूं", "mr": "गहू", "en": "Wheat", "te": "గోధుమ", "kn": "ಗೋಧಿ", "ta": "கோதுமை", "bn": "গম", "or": "ଗହମ", "gu": "ઘઉં", "as": "গম"}),
    Crop(id=CropId.soybean, emoji="🌱", names={"hi": "सोयाबीन", "mr": "सोयाबीन", "en": "Soybean", "te": "సోయా", "kn": "ಸೋಯಾಬೀನ್", "ta": "சோயா", "bn": "সয়াবিন", "or": "ସୋୟାବିନ୍", "gu": "સોયાબીન", "as": "সয়াবিন"}),
    Crop(id=CropId.chili, emoji="🌶️", names={"hi": "मिर्च", "mr": "मिरची", "en": "Chili", "te": "మిరప", "kn": "ಮೆಣಸಿನಕಾಯಿ", "ta": "மிளகாய்", "bn": "লঙ্কা", "or": "ଲଙ୍କା", "gu": "મરચું", "as": "জালুক"}),
    Crop(id=CropId.tomato, emoji="🍅", names={"hi": "टमाटर", "mr": "टोमॅटो", "en": "Tomato", "te": "టమాట", "kn": "ಟೊಮೇಟೊ", "ta": "தக்காளி", "bn": "টমেটো", "or": "ଟମାଟୋ", "gu": "ટમેટું", "as": "বিলাহী"}),
    Crop(id=CropId.peanut, emoji="🥜", names={"hi": "मूंगफली", "mr": "शेंगदाणा", "en": "Peanut", "te": "వేరుశెనగ", "kn": "ಕಡಲೆಕಾಯಿ", "ta": "நிலக்கடலை", "bn": "চিনাবাদাম", "or": "ଚିନାବାଦାମ", "gu": "મગફળી", "as": "চিনাবাদাম"}),
    Crop(id=CropId.cotton, emoji="☁️", names={"hi": "कपास", "mr": "कापूस", "en": "Cotton", "te": "పత్తి", "kn": "ಹತ್ತಿ", "ta": "பருத்தி", "bn": "তুলা", "or": "ତୁଳା", "gu": "કપાસ", "as": "কপাহ"}),
    Crop(id=CropId.rice, emoji="🍚", names={"hi": "चावल", "mr": "तांदूळ", "en": "Rice", "te": "వరి", "kn": "ಅಕ್ಕಿ", "ta": "நெல்", "bn": "ধান", "or": "ଧାନ", "gu": "ચોખા", "as": "ধান"}),
]

_CROP_MAP: dict[CropId, Crop] = {c.id: c for c in CROPS}


def get_crop(crop_id: CropId) -> Crop:
    return _CROP_MAP.get(crop_id, CROPS[0])


# ──────────── Mandis ────────────

_BASE_MANDIS = [
    {
        "id": "lasalgaon",
        "name": "लासलगांव APMC / Lasalgaon APMC",
        "distanceKm": 12,
        "minutes": 28,
        "marketPrice": 10000,
        "transportCost": 150,
        "mandiCharges": 150,
        "arrivalToday": 34200,
        "isRecommended": True,
        "rank": 1,
        "priceChange": 180,
    },
    {
        "id": "pimpalgaon",
        "name": "पिंपलगांव APMC / Pimpalgaon",
        "distanceKm": 20,
        "minutes": 40,
        "marketPrice": 9650,
        "transportCost": 120,
        "mandiCharges": 180,
        "arrivalToday": 12800,
        "isRecommended": False,
        "rank": 2,
        "priceChange": 90,
    },
    {
        "id": "nashik",
        "name": "नाशिक मुख्य यार्ड / Nashik Main Yard",
        "distanceKm": 10,
        "minutes": 24,
        "marketPrice": 9100,
        "transportCost": 100,
        "mandiCharges": 200,
        "arrivalToday": 22100,
        "isRecommended": False,
        "rank": 3,
        "priceChange": -50,
    },
    {
        "id": "dindori",
        "name": "डिंडोरी / Dindori",
        "distanceKm": 35,
        "minutes": 65,
        "marketPrice": 9300,
        "transportCost": 180,
        "mandiCharges": 150,
        "arrivalToday": 5600,
        "isRecommended": False,
        "rank": 4,
        "priceChange": 40,
    },
]


def get_mandis() -> list[Mandi]:
    return [
        Mandi(
            **m,
            netInHand=m["marketPrice"] - m["transportCost"] - m["mandiCharges"],
        )
        for m in _BASE_MANDIS
    ]


def get_recommended_mandi() -> Mandi:
    for m in get_mandis():
        if m.isRecommended:
            return m
    return get_mandis()[0]


# ──────────── Sell Decision ────────────

def get_sell_decision(crop_id: CropId, quantity: int) -> SellDecision:
    crop = get_crop(crop_id)
    mandi = get_recommended_mandi()

    if crop_id == CropId.onion:
        reasons = [
            "आज का भाव सप्ताह के उच्चतम स्तर पर है।",
            "अगले 3 दिनों में आवक बढ़ने से भाव गिरने की संभावना है।",
            "निर्यातकों की मांग आज बहुत अच्छी है।",
            "पास की मंडी में परिवहन खर्च कम है।",
        ]
    elif crop_id == CropId.wheat:
        reasons = [
            "भाव स्थिर है और MSP समर्थन मजबूत है।",
            "सरकारी खरीद खुलते ही स्थिर भाव की उम्मीद है।",
            "गोदाम भंडारण से सड़न का जोखिम कम है।",
        ]
    else:
        reasons = [
            "आज का भाव पिछले सप्ताह से बेहतर है।",
            "बाज़ार में मांग स्थिर बनी हुई है।",
            "पास की मंडी में बेहतर कमाई मिल रही है।",
        ]

    decision = DecisionType.wait if crop_id == CropId.wheat else DecisionType.sell_now

    return SellDecision(
        crop=crop,
        quantity=quantity,
        decision=decision,
        mandi=mandi,
        cropValue=mandi.marketPrice,
        transportCost=mandi.transportCost,
        mandiCharges=mandi.mandiCharges,
        netAmount=mandi.netInHand,
        totalNet=mandi.netInHand * quantity,
        reasons=reasons,
    )


# ──────────── Price Trend ────────────

def get_price_trend(crop_id: CropId) -> list[TrendPoint]:
    base = 1900 if crop_id == CropId.onion else 2450 if crop_id == CropId.wheat else 4800
    mult = 10 if crop_id == CropId.onion else 3
    days = ["S", "M", "T", "W", "Th", "F", "Today"]
    return [
        TrendPoint(day=d, value=base + round(change * (i * (1 + mult)) / 6))
        for i, (d, change) in enumerate(zip(days, [0, 50, 80, 120, 100, 140, 200]))
    ]


# ──────────── Buyers ────────────

BUYERS: list[Buyer] = [
    Buyer(id="abc-foods", name="ABC Foods", type=BuyerType.food_processor, typeKey="food_processor", distanceKm=18, requiredQty=20, offeredPrice=2150, verified=True, phone="1800-202-4455"),
    Buyer(id="gulf-export", name="Gulf Exports Ltd.", type=BuyerType.exporter, typeKey="exporter", distanceKm=34, requiredQty=60, offeredPrice=2080, verified=True, phone="1800-202-7788"),
    Buyer(id="malegaon-fpo", name="Malegaon FPO", type=BuyerType.fpo, typeKey="fpo", distanceKm=9, requiredQty=15, offeredPrice=2025, verified=True, phone="1800-202-1122"),
    Buyer(id="nashik-reta", name="Nashik Fresh Retail", type=BuyerType.retailer, typeKey="retailer", distanceKm=6, requiredQty=8, offeredPrice=1950, verified=False, phone="1800-202-9900"),
]


# ──────────── Notifications ────────────

NOTIFICATIONS: list[FarmNotification] = [
    FarmNotification(id="n1", type=NotificationType.price_up, tone="up", title="प्याज़ का भाव ₹120 बढ़ा", body="लासलगांव में आज प्याज़ ₹2,100/Qtl पर है। बेचने का यह सही समय है।", timeKey="2 min ago", actionKey="देखें"),
    FarmNotification(id="n2", type=NotificationType.forecast, tone="warn", title="3 दिन में भाव गिर सकता है", body="मध्य प्रदेश से आवक बढ़ने से भाव में 12% तक गिरावट की संभावना है।", timeKey="1 hr ago", actionKey="क्यों?"),
    FarmNotification(id="n3", type=NotificationType.weather, tone="info", title="बारिश से परिवहन प्रभावित हो सकता है", body="कल सुबह हल्की बारिश की संभावना है। मंडी जाने का कार्यक्रम पहले करें।", timeKey="3 hrs ago"),
    FarmNotification(id="n4", type=NotificationType.price_down, tone="down", title="नाशिक मंडी में आवक बहुत ज्यादा", body="नाशिक यार्ड में आज आवक 22,100 कट्टे है। भाव दबाव में रह सकता है।", timeKey="5 hrs ago", actionKey="तुलना देखें"),
]


# ──────────── Weather ────────────

def get_weather(city: str = "Nashik") -> Weather:
    return Weather(
        temp=32,
        condition="Sunny",
        humidity=58,
        windSpeed=12,
        icon="☀️",
        label="धूप",
        city=city,
    )
