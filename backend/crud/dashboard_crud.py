from datetime import date, datetime
from typing import Protocol, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.models import DailyPrice, GoldItem, SilverItem, ItemType
from crud.daily_prices_crud import get_price
from crud.items_crud import itemGet, itemGetSold
from typing import Type


class MetricsRow(Protocol):
    count: int
    total_selling: float
    total_purchase: float
    profit: float


def get_latest_price(db: Session, user_id: int) -> Tuple[float, float, str]:
    latest_price = get_price(db, user_id)

    today_gold = latest_price.gold_price_per_tola if latest_price else 0
    today_silver = latest_price.silver_price_per_tola if latest_price else 0

    price_note = (
        "using today's price"
        if latest_price and latest_price.date == date.today()
        else "using latest price (not today's)"
    )

    return today_gold, today_silver, price_note


def get_inventory_summary(
    db: Session, user_id: int, db_model: Type[GoldItem] | Type[SilverItem]
) -> Tuple[int, float, dict]:
    unsold = (
        db.query(
            func.count(db_model.id).label("count"),
            func.sum(db_model.purchase_price).label("purchase_price"),
        )
        .filter(db_model.user_id == user_id, db_model.is_sold == False)
        .first()
    )

    breakdown = (
        db.query(ItemType.name, func.count(db_model.id))
        .join(db_model, ItemType.id == db_model.item_type_id)
        .filter(db_model.user_id == user_id, db_model.is_sold == False)
        .group_by(ItemType.name)
        .all()
    )

    return unsold.count or 0, unsold.purchase_price or 0, dict(breakdown)


# region
# def get_silver_inventory_summary(db: Session) -> Tuple[int, float, dict]:
#     unsold = (
#         db.query(
#             func.count(SilverItem.id).label("count"),
#             func.sum(SilverItem.purchase_price).label("purchase_price"),
#         )
#         .filter(SilverItem.is_sold == False)
#         .first()
#     )

#     breakdown = (
#         db.query(ItemType.name, func.count(SilverItem.id))
#         .join(SilverItem, ItemType.id == SilverItem.item_type_id)
#         .filter(SilverItem.is_sold == False)
#         .group_by(ItemType.name)
#         .all()
#     )

#     return unsold.count or 0, unsold.purchase_price or 0, dict(breakdown)
# endregion


def monthly_metrics(
    db: Session,
    user_id: int,
    start_date: datetime,
    end_date: datetime,
    db_model: GoldItem | SilverItem,
) -> MetricsRow:
    item_metrics: MetricsRow = (
        db.query(
            func.count(db_model.id).label("count"),
            func.sum(db_model.selling_price).label("total_selling"),
            func.sum(db_model.purchase_price).label("total_purchase"),
            (
                func.sum(db_model.selling_price) - func.sum(db_model.purchase_price)
            ).label("profit"),
        )
        .filter(
            db_model.user_id == user_id,
            db_model.is_sold == True,
            db_model.sold_at >= start_date,
            db_model.sold_at <= end_date,
        )
        .first()
    )
    return item_metrics


def get_monthly_sales_matrics(
    db: Session, user_id: int, start_date: datetime, end_date: datetime
) -> Tuple[MetricsRow, MetricsRow]:
    gold_metrics = monthly_metrics(db, user_id, start_date, end_date, GoldItem)
    silver_metrics = monthly_metrics(db, user_id, start_date, end_date, SilverItem)
    # region
    # silver_metrics: MetricsRow = (
    #     db.query(
    #         func.count(SilverItem.id).label("count"),
    #         func.sum(SilverItem.selling_price).label("total_selling"),
    #         func.sum(SilverItem.purchase_price).label("total_purchase"),
    #         (
    #             func.sum(SilverItem.selling_price) - func.sum(SilverItem.purchase_price)
    #         ).label("profit"),
    #     )
    #     .filter(
    #         SilverItem.is_sold == True,
    #         SilverItem.sold_at >= start_date,
    #         SilverItem.sold_at <= end_date,
    #     )
    #     .first()
    # )
    # endregion

    return gold_metrics, silver_metrics
