from pydantic import BaseModel, EmailStr, Field
from decimal import Decimal
from enum import IntEnum
from datetime import datetime


class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    identifier: str
    password: str


class ItemTypeCreate(BaseModel):
    name: str


class ItemTypeResponse(BaseModel):
    id: int
    name: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class DailyPriceCreate(BaseModel):
    gold_price_per_tola: float
    silver_price_per_tola: float


class DailyPriceResponse(BaseModel):
    id: int
    gold_price_per_tola: float
    silver_price_per_tola: float
    date: datetime

    class Config:
        from_attributes = True


class KaratType(IntEnum):
    EIGHTEEN = 18
    TWENTYTWO = 22
    TWENTYFOUR = 24


class GoldItemCreate(BaseModel):
    item_type_id: int
    weight_tola: Decimal
    karat: KaratType = KaratType.TWENTYFOUR
    purchase_price: Decimal


class GoldItemSell(BaseModel):
    selling_price: Decimal


class GoldItemResponse(BaseModel):
    id: int
    item_type_id: int
    item_type_name: str | None = None
    weight_tola: Decimal
    karat: int
    purchase_price: Decimal
    is_sold: bool
    selling_price: Decimal | None = None
    sold_at: datetime | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class SilverItemCreate(BaseModel):
    item_type_id: int
    weight_tola: Decimal
    purity_percent: Decimal = Field(default=100.0, gt=0.0, le=100)
    purchase_price: Decimal


class SilverItemSell(BaseModel):
    selling_price: Decimal


class SilverItemResponse(BaseModel):
    id: int
    item_type_id: int
    item_type_name: str | None = None
    weight_tola: Decimal
    purity_percent: Decimal = 100
    is_sold: bool
    selling_price: Decimal | None
    sold_at: datetime | None
    created_at: datetime

    class Config:
        from_attributes = True


class InventoryMetrics(BaseModel):
    total_items: int
    total_value: float
    items_by_types: dict[str, int]


class MonthlySummary(BaseModel):
    gold_sold: int
    gold_profit: float
    silver_sold: int
    silver_profit: float
    total_profit: float


class DashboardResponse(BaseModel):
    today_gold_price: float
    today_silver_price: float
    price_note: str
    gold_inventory: InventoryMetrics
    silver_inventory: InventoryMetrics
    this_month: MonthlySummary
