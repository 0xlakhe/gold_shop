from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models.schemas import (
    GoldItemCreate,
    SilverItemCreate,
    GoldItemSell,
    SilverItemSell,
)
from models.models import GoldItem, SilverItem, ItemType
from datetime import datetime, timezone
from typing import Type


def itemAdd(
    db: Session,
    user_id: int,
    item_data: GoldItemCreate | SilverItemCreate,
    db_model: Type[GoldItem] | Type[SilverItem],
):
    data_dict = item_data.model_dump()
    data_dict["user_id"] = user_id
    db_item = db_model(**data_dict)

    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    to_return = (
        db.query(db_model, ItemType.name)
        .join(ItemType, db_model.item_type_id == ItemType.id)
        .filter(db_model.id == db_item.id)
        .first()
    )

    item, item_type = to_return
    item.item_type_name = item_type

    return item

# unsold
def itemGet(db: Session, user_id: int, db_model: Type[GoldItem] | Type[SilverItem]):
    db_item = (
        db.query(db_model, ItemType.name)
        .join(ItemType, db_model.item_type_id == ItemType.id)
        .filter(db_model.user_id == user_id, db_model.is_sold == False)
        .all()
    )
    response_data = []
    for item, type_name in db_item:
        item.item_type_name = type_name
        response_data.append(item)

    return response_data


def itemGetSold(db: Session, user_id: int, db_model: Type[GoldItem] | Type[SilverItem]):
    db_item = (
        db.query(db_model, ItemType.name)
        .join(ItemType, db_model.item_type_id == ItemType.id)
        .filter(db_model.user_id == user_id, db_model.is_sold == True)
        .all()
    )
    response_data = []
    for item, type_name in db_item:
        item.item_type_name = type_name
        response_data.append(item)
    return response_data


def itemGetSingle(
    db: Session, user_id: int, item_id: int, db_model: Type[GoldItem] | Type[SilverItem]
):
    db_item = (
        db.query(db_model, ItemType.name)
        .join(ItemType, db_model.item_type_id == ItemType.id)
        .filter(db_model.user_id == user_id, db_model.id == item_id)
        .first()
    )

    if not db_item:
        return None

    item, item_type = db_item
    item.item_type_name = item_type

    return item


def itemSell(
    db: Session,
    user_id: int,
    item_id: int,
    sell_price: GoldItemSell | SilverItemSell,
    db_model: Type[GoldItem] | Type[SilverItem],
):
    db_item = (
        db.query(db_model)
        .filter(db_model.user_id == user_id, db_model.id == item_id)
        .first()
    )

    if not db_item:
        return None

    if db_item.is_sold:
        return "ALREADY_SOLD"

    db_item.selling_price = sell_price.selling_price
    db_item.is_sold = True
    db_item.sold_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_item)

    return itemGetSingle(db, user_id, item_id, db_model)


def itemDelete(
    db: Session, user_id: int, item_id: int, db_model: Type[GoldItem] | Type[SilverItem]
):
    db_item = (
        db.query(db_model)
        .filter(db_model.user_id == user_id, db_model.id == item_id)
        .first()
    )
    if not db_item:
        return None
    if db_item.is_sold:
        return "ALREADY_SOLD"
    db.delete(db_item)
    db.commit()

    return {"status": "item deleted successfully"}
