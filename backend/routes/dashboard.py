from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
from models.models import DailyPrice, GoldItem, ItemType, SilverItem
from datetime import date, datetime, timezone
from sqlalchemy import func
from crud import dashboard_crud
from models.schemas import DashboardResponse, InventoryMetrics, MonthlySummary

dashboard_router = APIRouter(prefix="/dashboard")


@dashboard_router.get("/", response_model=DashboardResponse)
def getInfo(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    # region all in one
    # latest_price = db.query(DailyPrice).order_by(DailyPrice.date.desc()).first()

    # today_gold_price = latest_price.gold_price_per_tola
    # today_silver_price = latest_price.silver_price_per_tola

    # if latest_price.date == date.today():
    #     price_note = "using today's price"
    # else:
    #     price_note = "using latest price (not today's)"

    # gold_unsold_metrics = (
    #     db.query(
    #         func.count(GoldItem.id).label("count"),
    #         func.sum(GoldItem.purchase_price).label("purchase_price"),
    #     )
    #     .filter(GoldItem.is_sold == False)
    #     .first()
    # )

    # gold_total_items = gold_unsold_metrics.count or 0
    # gold_total_value = gold_unsold_metrics.purchase_price or 0

    # gold_item_types = (
    #     db.query(ItemType.name, func.count(GoldItem.id))
    #     .join(GoldItem, ItemType.id == GoldItem.item_type_id)
    #     .filter(GoldItem.is_sold == False)
    #     .group_by(ItemType.name)
    #     .all()
    # )
    # gold_items = dict(gold_item_types)

    # silver_total_items = (
    #     db.query(func.count(SilverItem.id)).filter(SilverItem.is_sold == False).scalar()
    # ) or 0
    # silver_total_value = (
    #     db.query(func.sum(SilverItem.purchase_price))
    #     .filter(SilverItem.is_sold == False)
    #     .scalar()
    # ) or 0
    # silver_item_types = (
    #     db.query(ItemType.name, func.count(SilverItem.id))
    #     .join(SilverItem, ItemType.id == SilverItem.item_type_id)
    #     .filter(SilverItem.is_sold == False)
    #     .group_by(ItemType.name)
    #     .all()
    # )
    # silver_items = dict(silver_item_types)

    # date_now = datetime.now(timezone.utc)
    # start_of_month = datetime(date_now.year, date_now.month, 1, tzinfo=timezone.utc)

    # # region GOLD SOLD brute force
    # # this_month_sold_gold_count = db.query(GoldItem).filter(GoldItem.is_sold == True, GoldItem.sold_at>=start_of_month, GoldItem.sold_at<=date_now).count()

    # # this_month_sold_gold_purchase_price= db.query(func.sum(GoldItem.purchase_price)).filter(GoldItem.is_sold==True, GoldItem.sold_at>=start_of_month, GoldItem.sold_at<=date_now)

    # # this_month_sold_gold_amount_selling_price= db.query(func.sum(GoldItem.selling_price)).filter(GoldItem.is_sold==True, GoldItem.sold_at>=start_of_month, GoldItem.sold_at<=date_now)

    # # this_month_gold_profit= (this_month_sold_gold_purchase_price-this_month_sold_gold_amount_selling_price) or 0
    # # endregion

    # gold_metrics = (
    #     db.query(
    #         func.count(GoldItem.id).label("count"),
    #         func.sum(GoldItem.selling_price).label("total_selling"),
    #         func.sum(GoldItem.purchase_price).label("total_purchase"),
    #         (
    #             func.sum(GoldItem.selling_price) - func.sum(GoldItem.purchase_price)
    #         ).label("profit"),
    #     )
    #     .filter(
    #         GoldItem.is_sold == True,
    #         GoldItem.sold_at >= start_of_month,
    #         GoldItem.sold_at <= date_now,
    #     )
    #     .first()
    # )
    # total_sold_gold = gold_metrics.count or 0
    # total_profit_gold = gold_metrics.profit or 0

    # silver_metrics = (
    #     db.query(
    #         func.count(SilverItem.id).label("count"),
    #         func.sum(SilverItem.selling_price).label("selling_price"),
    #         func.sum(SilverItem.purchase_price).label("purchase_price"),
    #         (
    #             func.sum(SilverItem.selling_price) - func.sum(SilverItem.purchase_price)
    #         ).label("profit"),
    #     )
    #     .filter(
    #         SilverItem.is_sold == True,
    #         SilverItem.sold_at >= start_of_month,
    #         SilverItem.sold_at <= date_now,
    #     )
    #     .first()
    # )
    # total_sold_silver = silver_metrics.count or 0
    # total_profit_silver = silver_metrics.profit or 0

    # total_profit = total_profit_gold + total_profit_silver

    # ans = {
    #     "today_gold_price": today_gold_price,
    #     "today_silver_price": today_silver_price,
    #     "price_note": price_note,
    #     "gold_inventory": {
    #         "total_items": gold_total_items,
    #         "total_value": gold_total_value,
    #         "items_by_types": gold_items,
    #     },
    #     "silver_inventory": {
    #         "total_items": silver_total_items,
    #         "total_value": silver_total_value,
    #         "items_by_types": silver_items,
    #     },
    #     "this_month": {
    #         "gold_sold": total_sold_gold,
    #         "gold_profit": total_profit_gold,
    #         "silver_sold": total_sold_silver,
    #         "silver_profit": total_profit_silver,
    #         "total_profit": total_profit,
    #     },
    # }

    # return ans
    # endregion

    gold_price, silver_price, price_note = dashboard_crud.get_latest_price(db)
    unsold_gold_count, unsold_gold_purchase_price, unsold_gold_items = (
        dashboard_crud.get_inventory_summary(db, GoldItem)
    )
    unsold_silver_count, unsold_silver_purchase_price, unsold_silver_items = (
        dashboard_crud.get_inventory_summary(db,SilverItem)
    )

    date_now = datetime.now(timezone.utc)
    start_of_month = datetime(date_now.year, date_now.month, 1, tzinfo=timezone.utc)
    gold_m, silver_m = dashboard_crud.get_monthly_sales_matrics(db, start_of_month, date_now)

    gold_profit = gold_m.profit or 0
    silver_profit = silver_m.profit or 0

    return {
        "today_gold_price": gold_price,
        "today_silver_price": silver_price,
        "price_note": price_note,
        "gold_inventory": {
            "total_items": unsold_gold_count,
            "total_value": unsold_gold_purchase_price,
            "items_by_types": unsold_gold_items,
        },
        "silver_inventory": {
            "total_items": unsold_silver_count,
            "total_value": unsold_silver_purchase_price,
            "items_by_types": unsold_silver_items,
        },
        "this_month": {
            "gold_sold": gold_m.count or 0,
            "gold_profit": gold_profit,
            "silver_sold": silver_m.count or 0,
            "silver_profit": silver_profit,
            "total_profit": gold_profit + silver_profit,
        },
    }
