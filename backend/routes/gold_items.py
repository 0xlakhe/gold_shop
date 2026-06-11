from fastapi import APIRouter, Depends, HTTPException, status
from models.schemas import GoldItemCreate, GoldItemSell, GoldItemResponse
from models.models import GoldItem, ItemType, User
from sqlalchemy.orm import Session
from dependencies import get_current_user
from database import get_db
from datetime import datetime, timezone
from crud.items_crud import (
    itemAdd,
    itemGet,
    itemGetSold,
    itemGetSingle,
    itemSell,
    itemDelete,
)

gold_items_router = APIRouter(prefix="/gold")


@gold_items_router.post("/", response_model=GoldItemResponse)
def addItem(
    item: GoldItemCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return itemAdd(db, user.id, item, GoldItem)


@gold_items_router.get("/", response_model=list[GoldItemResponse])
def getItem(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return itemGet(db, user.id, GoldItem)


@gold_items_router.get("/sold", response_model=list[GoldItemResponse])
def getSoldItem(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return itemGetSold(db, user.id, GoldItem)


@gold_items_router.get("/{item_id}", response_model=GoldItemResponse)
def getSingleItem(
    item_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    to_return = itemGetSingle(db, user.id, item_id, GoldItem)

    if to_return is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No such item"
        )
    return to_return


@gold_items_router.put("/{item_id}/sell", response_model=GoldItemResponse)
def sellItem(
    sell_price: GoldItemSell,
    item_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    to_return = itemSell(db, user.id, item_id, sell_price, GoldItem)

    if to_return is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No such item"
        )
    if to_return == "ALREADY_SOLD":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item has already been sold"
        )
    return to_return


@gold_items_router.delete("/{item_id}")
def deleteItem(
    item_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    to_return = itemDelete(db, user.id, item_id, GoldItem)

    if to_return is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No such item"
        )
    if to_return == "ALREADY_SOLD":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete sold item"
        )

    return to_return
