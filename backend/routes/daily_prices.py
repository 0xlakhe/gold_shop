from fastapi import APIRouter, Depends, HTTPException, status
from models.schemas import DailyPriceCreate, DailyPriceResponse
from dependencies import get_current_user
from models.models import DailyPrice
from database import get_db
from sqlalchemy.orm import Session
from datetime import date

daily_price_router = APIRouter(prefix="/prices")


@daily_price_router.post("/", response_model=DailyPriceResponse)
def setPrice(
    price: DailyPriceCreate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    # region insert/update
    # today_price= insert(DailyPrice).values(
    #     gold_price_per_tola = price.gold_price_per_tola,
    #     silver_price_per_tola = price.silver_price_per_tola
    # )

    # today_price=today_price.on_conflict_do_update(
    #     index_elements=['date'],
    #     set_={
    #         'gold_price_per_tola': price.gold_price_per_tola,
    #         'silver_price_per_tola': price.silver_price_per_tola
    #     }
    # )

    # result=db.execute(today_price.returning(DailyPrice))
    # db.commit()

    # today_price=result.scalar_one()
    # endregion

    today_date = date.today()

    db_price = db.query(DailyPrice).filter(DailyPrice.date == today_date).first()

    if db_price:
        db_price.gold_price_per_tola = price.gold_price_per_tola
        db_price.silver_price_per_tola = price.silver_price_per_tola
        updated_price = db_price
        status_msg = "price updated successfully"
    else:
        new_price = DailyPrice(
            date=today_date,
            gold_price_per_tola=price.gold_price_per_tola,
            silver_price_per_tola=price.silver_price_per_tola,
        )
        db.add(new_price)
        updated_price = new_price
        status_msg = "price set successfully"

    db.commit()
    db.refresh(updated_price)

    return updated_price


@daily_price_router.get("/latest", response_model=DailyPriceResponse)
def getPrice(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):

    # region today/yesterday
    # today=date.today()
    # today_price= db.query(DailyPrice).filter(DailyPrice.date==today).first()

    # if not today_price:
    #     yesterday=today-timedelta(days=1)
    #     today_price=db.query(DailyPrice).filter(DailyPrice.date==yesterday).first()
    #     if not today_price:
    #         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Daily prices have not been set for today or yesterday.")

    # endregion

    latest_price = db.query(DailyPrice).order_by(DailyPrice.date.desc()).first()

    if not latest_price:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No daily price data exists in the database history",
        )

    return latest_price


@daily_price_router.get("/history", response_model=list[DailyPriceResponse])
def getAllPrices(
    user_id: int = Depends(get_current_user), db: Session = Depends(get_db)
):

    prices = db.query(DailyPrice).all()

    return prices
