from models.schemas import ItemTypeCreate
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.models import ItemType
from fastapi import HTTPException, status


def getAllItemTypes(db: Session, user_id: int):
    return db.query(ItemType).filter(ItemType.user_id == user_id).all()


def createNewType(db: Session, user_id: int, itemName: ItemTypeCreate):
    existing_type = (
        db.query(ItemType)
        .filter(ItemType.user_id == user_id, ItemType.name == itemName.name)
        .first()
    )

    if existing_type:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="This item type already exists"
        )

    new_item = itemName.model_dump()
    new_item["user_id"] = user_id
    db_item = ItemType(**new_item)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def deleteType(db: Session, user_id: int, type_id: int):
    db_type = (
        db.query(ItemType)
        .filter(ItemType.user_id == user_id, ItemType.id == type_id)
        .first()
    )

    if not db_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No such item"
        )

    try:
        db.delete(db_type)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete this item type because it is currently assigned to existing item",
        )

    return {
        "status": "deleted successfully",
        "message": f"item type with id {type_id} has been deleted.",
    }


def updateType(db: Session, user_id: int, type_id: int, item_name: ItemTypeCreate):
    db_item_type = (
        db.query(ItemType)
        .filter(ItemType.user_id == user_id, ItemType.id == type_id)
        .first()
    )

    if not db_item_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No such item"
        )

    name_taken = (
        db.query(ItemType)
        .filter(
            ItemType.user_id == user_id,
            ItemType.name == item_name.name,
            ItemType.id != type_id,
        )
        .first()
    )

    if name_taken:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="name already taken"
        )

    db_item_type.name = item_name.name
    db.commit()
    db.refresh(db_item_type)

    return db_item_type
