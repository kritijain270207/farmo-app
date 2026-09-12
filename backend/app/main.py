"""Farmo FastAPI backend — serves market intelligence to the Next.js frontend."""
from __future__ import annotations

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import ai, buyers, farmer, market, notifications, weather

load_dotenv()  # .env loaded server-side only — secrets never sent to browser

app = FastAPI(
    title="Farmo API",
    description="Farmer-focused market intelligence backend",
    version="1.0.0",
)

# CORS — configurable via CORS_ORIGINS env var (comma-separated)
# Default allows local dev; set CORS_ORIGINS for production
_cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(market.router)
app.include_router(buyers.router)
app.include_router(notifications.router)
app.include_router(ai.router)
app.include_router(farmer.router)
app.include_router(weather.router)


@app.get("/")
async def root():
    return {"status": "ok", "service": "farmo-api"}


@app.get("/api/health")
async def health():
    return {"status": "healthy"}
