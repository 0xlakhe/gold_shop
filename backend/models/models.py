from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Numeric,
    Date,
    ForeignKey,
    DateTime,
    Enum,
    CheckConstraint,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
from datetime import date
import enum


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ItemType(Base):
    __tablename__ = "item_types"
    id = Column(Integer, primary_key=True)
    name = Column(String, index=True, unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class DailyPrice(Base):
    __tablename__ = "daily_prices"
    id = Column(Integer, primary_key=True)
    date = Column(Date, default=date.today, unique=True, index=True, nullable=False)
    gold_price_per_tola = Column(Numeric, nullable=False)
    silver_price_per_tola = Column(Numeric, nullable=False)


class KaratType(enum.IntEnum):
    EIGHTEEN = 18
    TWENTYTWO = 22
    TWENTYFOUR = 24


class GoldItem(Base):
    __tablename__ = "gold_item"
    id = Column(Integer, primary_key=True)
    item_type_id = Column(
        Integer, ForeignKey("item_types.id", ondelete="RESTRICT"), nullable=False
    )
    weight_tola = Column(Numeric, nullable=False)
    karat = Column(
        Enum(KaratType, native_enum=False, default=KaratType.TWENTYFOUR, nullable=False)
    )
    purchase_price = Column(Numeric, nullable=False)
    item_note = Column(String, nullable=True)
    selling_price = Column(Numeric, nullable=True)
    is_sold = Column(Boolean, index=True, default=False, nullable=False)
    sold_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


class SilverItem(Base):
    __tablename__ = "silver_item"
    id = Column(Integer, primary_key=True)
    item_type_id = Column(
        Integer, ForeignKey("item_types.id", ondelete="RESTRICT"), nullable=False
    )
    weight_tola = Column(Numeric, nullable=False)
    purity_percent = Column(
        Numeric, CheckConstraint("purity_percent<=100.0"), default=100.0, nullable=False
    )
    purchase_price = Column(Numeric, nullable=False)
    item_note = Column(String, nullable=True)
    is_sold = Column(Boolean, index=True, default=False, nullable=False)
    selling_price = Column(Numeric, nullable=True)
    sold_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
