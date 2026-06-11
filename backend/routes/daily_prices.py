from fastapi import APIRouter, Depends, HTTPException, status
from models.schemas import DailyPriceCreate, DailyPriceResponse
from dependencies import get_current_user
from models.models import DailyPrice, User
from crud.daily_prices_crud import set_price, get_price
from database import get_db
from sqlalchemy.orm import Session
from datetime import date

daily_price_router = APIRouter(prefix="/prices")


@daily_price_router.post("/", response_model=DailyPriceResponse)
def setPrice(
    price: DailyPriceCreate,
    user: User = Depends(get_current_user),
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

    return set_price(db, user.id, price)


@daily_price_router.get("/latest", response_model=DailyPriceResponse)
def getPrice(user: User = Depends(get_current_user), db: Session = Depends(get_db)):

    # region today/yesterday
    # today=date.today()
    # today_price= db.query(DailyPrice).filter(DailyPrice.date==today).first()

    # if not today_price:
    #     yesterday=today-timedelta(days=1)
    #     today_price=db.query(DailyPrice).filter(DailyPrice.date==yesterday).first()
    #     if not today_price:
    #         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Daily prices have not been set for today or yesterday.")

    # endregion

    return get_price(db, user.id)


@daily_price_router.get("/history", response_model=list[DailyPriceResponse])
def getAllPrices(user: User = Depends(get_current_user), db: Session = Depends(get_db)):

    prices = db.query(DailyPrice).filter(DailyPrice.user_id == user.id).all()

    return prices
