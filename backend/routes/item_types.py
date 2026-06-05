from fastapi import APIRouter, Depends, HTTPException, status
from models.schemas import ItemTypeCreate, ItemTypeResponse
from models.models import ItemType
from database import get_db
from dependencies import get_current_user
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from crud.item_types_crud import createNewType, deleteType, updateType

item_types_router = APIRouter(prefix="/item-types")


@item_types_router.post("/", response_model= ItemTypeResponse)
def create_new_type(
    itemName: ItemTypeCreate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return createNewType(db, itemName)


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
    return deleteType(db, type_id)


@item_types_router.put("/{type_id}", response_model=ItemTypeResponse)
def update_type(
    type_id: int,
    item_name: ItemTypeCreate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return updateType(db,type_id,item_name)