from fastapi import APIRouter, HTTPException, Depends, status
from models.schemas import SilverItemCreate, SilverItemSell, SilverItemResponse
from models.models import SilverItem, ItemType
from dependencies import get_current_user
from sqlalchemy.orm import Session
from database import get_db
from datetime import datetime, timezone
from crud.items_crud import (
    itemAdd,
    itemGet,
    itemGetSold,
    itemGetSingle,
    itemDelete,
    itemSell,
)

silver_items_router = APIRouter(prefix="/silver")


@silver_items_router.post("/", response_model=SilverItemResponse)
def addItem(
    item: SilverItemCreate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return itemAdd(db, item, SilverItem)


@silver_items_router.get("/", response_model=list[SilverItemResponse])
def getItem(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    # items = db.query(SilverItem, ItemType.name).join(SilverItem, SilverItem.id==ItemType.id).filter(SilverItem.is_sold == False).all()
    # response_data=[]
    # for item, item_name in items:
    #     item.item_type_name=item_name
    #     response_data.append(item)
    return itemGet(db, SilverItem)


@silver_items_router.get("/sold", response_model=list[SilverItemResponse])
def getSoldItem(
    user_id: int = Depends(get_current_user), db: Session = Depends(get_db)
):
    # items = db.query(SilverItem, ItemType.name).join(SilverItem, SilverItem.id==ItemType.id).filter(SilverItem.is_sold).all()
    # response_data=[]
    # for item, item_name in items:
    #     item.item_type_name=item_name
    #     response_data.append(item)
    return itemGetSold(db, SilverItem)


@silver_items_router.get("/{item_id}", response_model=SilverItemResponse)
def getSingleItem(
    item_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    to_return = itemGetSingle(db, item_id, SilverItem)

    if to_return is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No such item"
        )
    return to_return


@silver_items_router.put("/{item_id}/sell", response_model=SilverItemResponse)
def sellItem(
    sell_price: SilverItemSell,
    item_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    to_return = itemSell(db, item_id, sell_price, SilverItem)

    if to_return is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No such item"
        )
    if to_return == "ALREADY_SOLD":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item has already been sold"
        )
    return to_return


@silver_items_router.delete("/{item_id}")
def deleteItem(
    item_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    to_return = itemDelete(db, item_id, SilverItem)

    if to_return is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No such item"
        )
    if to_return == "ALREADY_SOLD":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete sold item"
        )

    return to_return
