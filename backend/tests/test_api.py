"""Backend API tests — verifies all endpoints return correct shapes and data."""
from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


# ──────────── Root / Health ────────────

def test_root():
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


# ──────────── Market ────────────

def test_mandis():
    r = client.get("/api/market/mandis?crop=onion")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 4
    m = data[0]
    assert "id" in m
    assert "marketPrice" in m
    assert "netInHand" in m
    assert m["isRecommended"] is True
    assert m["rank"] == 1


def test_mandis_ranking():
    r = client.get("/api/market/mandis?crop=onion")
    data = r.json()
    nets = [m["netInHand"] for m in data]
    assert nets[0] >= nets[1], "First mandi should have highest netInHand"


def test_sell_decision():
    r = client.get("/api/market/sell-decision?crop=onion&quantity=40")
    assert r.status_code == 200
    d = r.json()
    assert d["decision"] == "sell_now"
    assert d["quantity"] == 40
    assert "reasons" in d and len(d["reasons"]) > 0
    assert d["crop"]["id"] == "onion"
    assert d["totalNet"] == d["netAmount"] * 40


def test_sell_decision_wheat_waits():
    r = client.get("/api/market/sell-decision?crop=wheat&quantity=80")
    d = r.json()
    assert d["decision"] == "wait"
    assert d["quantity"] == 80


def test_price_trend():
    r = client.get("/api/market/price-trend?crop=onion")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) == 7
    assert data[-1]["day"] == "Today"


# ──────────── Buyers ────────────

def test_buyers():
    r = client.get("/api/buyers?crop=onion")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 4
    assert "offeredPrice" in data[0]
    assert "verified" in data[0]


# ──────────── Notifications ────────────

def test_notifications():
    r = client.get("/api/notifications")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 4
    assert "tone" in data[0]
    assert "type" in data[0]


# ──────────── AI Chat ────────────

def test_ai_chat_price_question():
    r = client.post("/api/ai/chat", json={
        "message": "आज प्याज़ का भाव क्या है?",
        "language": "hi",
        "farmerContext": {"crop": "onion", "quantity": 40},
    })
    assert r.status_code == 200
    reply = r.json()["reply"]
    assert "₹" in reply
    assert "Qtl" in reply


def test_ai_chat_where_to_sell():
    r = client.post("/api/ai/chat", json={
        "message": "कहां बेचूं?",
        "language": "hi",
        "farmerContext": {"crop": "onion", "quantity": 40},
    })
    assert r.status_code == 200
    assert "कमाई" in r.json()["reply"]


def test_ai_chat_sell_wait():
    r = client.post("/api/ai/chat", json={
        "message": "बेचूं या रुकूं?",
        "language": "hi",
        "farmerContext": {"crop": "onion", "quantity": 40},
    })
    assert r.status_code == 200
    assert "बेचें" in r.json()["reply"]


def test_ai_chat_quantity():
    r = client.post("/api/ai/chat", json={
        "message": "मेरे पास 40 क्विंटल है, कितना मिलेगा?",
        "language": "hi",
        "farmerContext": {"crop": "onion", "quantity": 40},
    })
    assert r.status_code == 200
    assert "₹" in r.json()["reply"]


def test_ai_chat_fallback():
    r = client.post("/api/ai/chat", json={
        "message": "hello",
        "language": "hi",
        "farmerContext": {"crop": "onion", "quantity": 40},
    })
    assert r.status_code == 200
    assert "समझ गया" in r.json()["reply"]


# ──────────── Farmer Auth ────────────

def test_otp_send():
    r = client.post("/api/farmer/otp/send", json={"phone": "9876543210"})
    assert r.status_code == 200
    assert r.json()["sent"] is True


def test_otp_verify_valid():
    r = client.post("/api/farmer/otp/verify", json={"phone": "9876543210", "otp": "123456"})
    assert r.status_code == 200
    farmer = r.json()
    assert farmer["id"] == "fm-88219"
    assert "onion" in farmer["crops"]


def test_otp_verify_invalid():
    r = client.post("/api/farmer/otp/verify", json={"phone": "9876543210", "otp": "0000"})
    assert r.status_code == 400


def test_profile():
    r = client.get("/api/farmer/profile")
    assert r.status_code == 200


# ──────────── Weather ────────────

def test_weather():
    r = client.get("/api/weather?city=Nashik")
    assert r.status_code == 200
    w = r.json()
    assert "temp" in w
    assert "condition" in w
    assert "city" in w
    assert w["city"] == "Nashik"
    # No API key should be in the response
    assert "key" not in str(w).lower() or "apikey" not in str(w).lower()
