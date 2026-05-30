from fastapi import APIRouter, Depends, HTTPException, status
from models.schemas import ItemTypeCreate
from models.models import ItemType
from database import get_db
from dependencies import get_current_user
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

item_types_router = APIRouter(prefix="/item-types")


@item_types_router.post("/")
def create_new_type(
    itemName: ItemTypeCreate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing_type = db.query(ItemType).filter(ItemType.name == itemName.name).first()
    if existing_type:
        raise HTTPException(status_code=409, detail="This item type already exists")

    new_item = ItemType(name=itemName.name)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return {
        "status": "item created!",
        "item_name": new_item.name,
        "item_id": new_item.id,
    }


@item_types_router.get("/")
def get_all_types(
    user_id: int = Depends(get_current_user), db: Session = Depends(get_db)
):
    return db.query(ItemType).all()


@item_types_router.delete("/{type_id}")
def delete_type(
    type_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_item_type = db.query(ItemType).filter(ItemType.id == type_id).first()

    if not db_item_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item type not found"
        )

    try:
        db.delete(db_item_type)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete this item type because it is currenly assigned to existing item",
        )

    return {
        "status": "deleted successfully",
        "message": f"Item type with ID {type_id} has been deleted.",
    }


@item_types_router.put("/{type_id}")
def update_type(
    type_id: int,
    item_name: ItemTypeCreate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_item_type = db.query(ItemType).filter(ItemType.id == type_id).first()

    if not db_item_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item type not found"
        )

    name_taken = (
        db.query(ItemType)
        .filter(ItemType.name == item_name.name, ItemType.id != type_id)
        .first()
    )

    if name_taken:
        raise HTTPException(
            status_code=409, detail="Another item type already has this name"
        )

    db_item_type.name = item_name.name

    db.commit()
    db.refresh(db_item_type)

    return {
        "status": "updated successfully",
        "updated_item": {"id": db_item_type.id, "name": db_item_type.name},
    }
