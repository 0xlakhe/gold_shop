from fastapi import APIRouter, HTTPException, Depends, status
from models.schemas import SilverItemCreate, SilverItemSell, SilverItemResponse
from models.models import SilverItem
from dependencies import get_current_user
from sqlalchemy.orm import Session
from database import get_db
from datetime import datetime, timezone


silver_items_router = APIRouter(prefix="/silver")


@silver_items_router.post("/", response_model=SilverItemResponse)
def addItem(
    item: SilverItemCreate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    to_add = SilverItem(
        item_type_id=item.item_type_id,
        weight_tola=item.weight_tola,
        purchase_price=item.purchase_price,
        purity_percent=item.purity_percent,
    )
    db.add(to_add)
    db.commit()
    db.refresh(to_add)

    return to_add


@silver_items_router.get("/", response_model=list[SilverItemResponse])
def getItem(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(SilverItem).filter(SilverItem.is_sold == False).all()
    return items


@silver_items_router.get("/sold", response_model=list[SilverItemResponse])
def getSoldItem(
    user_id: int = Depends(get_current_user), db: Session = Depends(get_db)
):
    items = db.query(SilverItem).filter(SilverItem.is_sold).all()
    return items


@silver_items_router.get("/{item_id}", response_model=SilverItemResponse)
def getSingleItem(
    item_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = db.query(SilverItem).filter(SilverItem.id == item_id).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No such item"
        )

    return item


@silver_items_router.put("/{item_id}/sell", response_model=SilverItemResponse)
def sellItem(
    sell_price: SilverItemSell,
    item_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = db.query(SilverItem).filter(SilverItem.id == item_id).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No such item"
        )

    if item.is_sold:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Item already sold"
        )

    item.is_sold = True
    item.selling_price = sell_price.selling_price
    item.sold_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(item)

    return item


@silver_items_router.delete("/{item_id}")
def deleteItem(
    item_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = db.query(SilverItem).filter(SilverItem.id == item_id).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No such item"
        )

    if item.is_sold:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Cannot delete sold item"
        )

    db.delete(item)
    db.commit()

    return {"status": "deleted successfully"}
