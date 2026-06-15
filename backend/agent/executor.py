from sqlalchemy.orm import Session
from crud import dashboard_crud
from models.models import GoldItem, SilverItem, ItemType, DailyPrice
from datetime import datetime, timezone, date


def execute_tool(tool_name: str, tool_input: dict, db: Session, user_id: int) -> str:
    if tool_name == "get_inventory_summary":
        gold_count, gold_value, gold_by_type = dashboard_crud.get_inventory_summary(
            db, user_id, GoldItem
        )
        silver_count, silver_value, silver_by_type = dashboard_crud.get_inventory_summary(
            db, user_id, SilverItem
        )
        return str(
            {
                "gold": {
                    "total_items": gold_count,
                    "total_value": float(gold_value),
                    "by_type": gold_by_type,
                },
                "silver": {
                    "total_items": silver_count,
                    "total_value": float(silver_value),
                    "by_type": silver_by_type,
                },
            }
        )

    elif tool_name == "get_profit_report":
        today = datetime.now(timezone.utc)
        start = datetime(today.year, today.month, 1, tzinfo=timezone.utc)
        gold_m, silver_m = dashboard_crud.get_monthly_sales_matrics(db,user_id, start, today)
        return str(
            {
                "gold_sold": gold_m.count or 0,
                "gold_profit": float(gold_m.profit or 0),
                "silver_sold": silver_m.count or 0,
                "silver_profit": float(silver_m.profit or 0),
                "total_profit": float((gold_m.profit or 0) + (silver_m.profit or 0)),
            }
        )

    elif tool_name == "get_all_item_types":
        types = db.query(ItemType).filter(ItemType.user_id == user_id).all()
        return str([{"id": t.id, "name": t.name} for t in types])

    elif tool_name == "add_gold_item":
        item = GoldItem(
            user_id=user_id,
            item_type_id=tool_input["item_type_id"],
            weight_tola=tool_input["weight_tola"],
            karat=tool_input["karat"],
            purchase_price=tool_input["purchase_price"],
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        return f"Gold item added successfully with id {item.id}"

    elif tool_name == "add_silver_item":
        item = SilverItem(
            user_id=user_id,
            item_type_id=tool_input["item_type_id"],
            weight_tola=tool_input["weight_tola"],
            purity_percent=tool_input["purity_percent"],
            purchase_price=tool_input["purchase_price"],
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        return f"Silver item added successfully with id {item.id}"

    elif tool_name == "sell_item":
        metal = tool_input["metal"]
        item_id = tool_input["item_id"]
        selling_price = tool_input["selling_price"]
        model = GoldItem if metal == "gold" else SilverItem
        item = (
            db.query(model)
            .filter(model.id == item_id, model.user_id == user_id)
            .first()
        )
        if not item:
            return f"No {metal} item found with id {item_id}"
        if item.is_sold:
            return f"Item {item_id} is already sold"
        item.is_sold = True
        item.selling_price = selling_price
        item.sold_at = datetime.now(timezone.utc)
        db.commit()
        return f"{metal.capitalize()} item {item_id} sold for Rs. {selling_price}"

    elif tool_name == "set_daily_price":
        today = date.today()
        existing = (
            db.query(DailyPrice)
            .filter(DailyPrice.date == today, DailyPrice.user_id == user_id)
            .first()
        )
        if existing:
            existing.gold_price_per_tola = tool_input["gold_price_per_tola"]
            existing.silver_price_per_tola = tool_input["silver_price_per_tola"]
        else:
            price = DailyPrice(
                user_id=user_id,
                date=today,
                gold_price_per_tola=tool_input["gold_price_per_tola"],
                silver_price_per_tola=tool_input["silver_price_per_tola"],
            )
            db.add(price)
        db.commit()
        return f"Prices set — Gold: Rs. {tool_input['gold_price_per_tola']}, Silver: Rs. {tool_input['silver_price_per_tola']}"

    return f"Unknown tool: {tool_name}"
