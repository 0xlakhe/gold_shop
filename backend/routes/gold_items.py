from fastapi import APIRouter, Depends, HTTPException, status
from models.schemas import GoldItemCreate, GoldItemSell, GoldItemResponse
from models.models import GoldItem
from sqlalchemy.orm import Session
from dependencies import get_current_user
from database import get_db
from datetime import datetime, timezone


gold_items_router = APIRouter(prefix="/gold")


@gold_items_router.post("/", response_model=GoldItemResponse)
def addItem(
    item: GoldItemCreate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    to_add = GoldItem(
        item_type_id=item.item_type_id,
        weight_tola=item.weight_tola,
        karat=item.karat,
        purchase_price=item.purchase_price,
    )
    db.add(to_add)
    db.commit()
    db.refresh(to_add)
    return to_add


@gold_items_router.get("/", response_model=list[GoldItemResponse])
def getItem(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(GoldItem).filter(GoldItem.is_sold == False).all()
    return items


@gold_items_router.get("/sold", response_model=list[GoldItemResponse])
def getSoldItem(
    user_id: int = Depends(get_current_user), db: Session = Depends(get_db)
):
    items = db.query(GoldItem).filter(GoldItem.is_sold).all()
    return items


@gold_items_router.get("/{item_id}", response_model=GoldItemResponse)
def getSingleItem(
    item_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = db.query(GoldItem).filter(GoldItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No such item"
        )

    return item


@gold_items_router.put("/{item_id}/sell", response_model=GoldItemResponse)
def sellItem(
    sell_price: GoldItemSell,
    item_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = db.query(GoldItem).filter(GoldItem.id == item_id).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No such item"
        )

    if item.is_sold:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Item has already been sold"
        )

    item.selling_price = sell_price.selling_price
    item.is_sold = True
    item.sold_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(item)

    return item


@gold_items_router.delete("/{item_id}")
def deleteItem(
    item_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = db.query(GoldItem).filter(GoldItem.id == item_id).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No such item"
        )

    if item.is_sold:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete sold item"
        )

    db.delete(item)
    db.commit()

    return {"status": "item deleted successfully"}
