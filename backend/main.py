from contextlib import asynccontextmanager
from fastapi import FastAPI
from database import init_db
from routes.auth import auth_router
from routes.item_types import item_types_router
from routes.daily_prices import daily_price_router
from routes.gold_items import gold_items_router
from routes.silver_items import silver_items_router
from routes.dashboard import dashboard_router
from fastapi.middleware.cors import CORSMiddleware
import models.models


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield
    print("shutting down")


app = FastAPI(lifespan=lifespan)
app.include_router(auth_router, prefix="/auth")
app.include_router(item_types_router)
app.include_router(daily_price_router)
app.include_router(gold_items_router)
app.include_router(silver_items_router)
app.include_router(dashboard_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
