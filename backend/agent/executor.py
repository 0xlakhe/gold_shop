from sqlalchemy.orm import Session
from crud import dashboard_crud, item_types_crud, items_crud, daily_prices_crud
from models.models import GoldItem, SilverItem
from models.schemas import (
    GoldItemCreate,
    SilverItemCreate,
    GoldItemSell,
    DailyPriceCreate,
    ItemTypeCreate,
)
from datetime import datetime, timezone


def execute_tool(tool_name: str, tool_input: dict, db: Session, user_id: int) -> str:
    if tool_name == "get_inventory_summary":
        gold_count, gold_value, gold_by_type = dashboard_crud.get_inventory_summary(
            db, user_id, GoldItem
        )
        silver_count, silver_value, silver_by_type = (
            dashboard_crud.get_inventory_summary(db, user_id, SilverItem)
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
        gold_m, silver_m = dashboard_crud.get_monthly_sales_matrics(
            db, user_id, start, today
        )
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
        types = item_types_crud.getAllItemTypes(db, user_id)
        return str([{"id": t.id, "name": t.name} for t in types])

    elif tool_name == "add_gold_item":
        item = items_crud.itemAdd(
            db,
            user_id,
            GoldItemCreate(
                item_type_id=tool_input["item_type_id"],
                weight_tola=tool_input["weight_tola"],
                karat=tool_input["karat"],
                purchase_price=tool_input["purchase_price"],
            ),
            GoldItem,
        )
        return f"Gold item added: {item.weight_tola} tola {item.karat}K (id {item.id})"

    elif tool_name == "add_silver_item":
        item = items_crud.itemAdd(
            db,
            user_id,
            SilverItemCreate(
                item_type_id=tool_input["item_type_id"],
                weight_tola=tool_input["weight_tola"],
                purity_percent=tool_input["purity_percent"],
                purchase_price=tool_input["purchase_price"],
            ),
            SilverItem,
        )
        return f"Silver item added: {item.weight_tola} tola {item.purity_percent}% (id {item.id})"

    elif tool_name == "sell_item":
        metal = tool_input["metal"]
        item_id = tool_input["item_id"]
        model = GoldItem if metal == "gold" else SilverItem
        result = items_crud.itemSell(
            db,
            user_id,
            item_id,
            GoldItemSell(selling_price=tool_input["selling_price"]),
            model,
        )
        if result is None:
            return f"No {metal} item found with id {item_id}"
        if result == "ALREADY_SOLD":
            return f"Item {item_id} is already sold"
        return f"{metal.capitalize()} item {item_id} sold for Rs. {tool_input['selling_price']}"

    elif tool_name == "create_item_type":
        new_type = item_types_crud.createNewType(
            db, user_id, ItemTypeCreate(name=tool_input["item_name"])
        )
        return f"Created new type: {new_type.name} (id {new_type.id})"

    elif tool_name == "set_daily_price":
        price = daily_prices_crud.set_price(
            db,
            user_id,
            DailyPriceCreate(
                gold_price_per_tola=tool_input["gold_price_per_tola"],
                silver_price_per_tola=tool_input["silver_price_per_tola"],
            ),
        )
        return f"Prices set — Gold: Rs. {price.gold_price_per_tola}, Silver: Rs. {price.silver_price_per_tola}"

    return f"Unknown tool: {tool_name}"
