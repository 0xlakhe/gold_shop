from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models.models import DailyPrice
from models.schemas import DailyPriceCreate
from datetime import date, datetime


def set_price(db: Session, user_id: int, price: DailyPriceCreate):
    today_date = date.today()
    db_price = (
        db.query(DailyPrice)
        .filter(DailyPrice.user_id == user_id, DailyPrice.date == today_date)
        .first()
    )

    if db_price:
        db_price.gold_price_per_tola = price.gold_price_per_tola
        db_price.silver_price_per_tola = price.silver_price_per_tola
        updated_price = db_price
    else:
        new_price = DailyPrice(
            user_id=user_id,
            date=today_date,
            gold_price_per_tola=price.gold_price_per_tola,
            silver_price_per_tola=price.silver_price_per_tola,
        )
        db.add(new_price)
        updated_price = new_price

    db.commit()
    db.refresh(updated_price)
    return updated_price


def get_price(db: Session, user_id: int):
    latest_price = (
        db.query(DailyPrice)
        .filter(DailyPrice.user_id == user_id)
        .order_by(DailyPrice.date.desc())
        .first()
    )

    if not latest_price:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No daily price data exists in theh database history",
        )
    
    return latest_price