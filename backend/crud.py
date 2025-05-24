from sqlalchemy.orm import Session
from . import models, schemas
from typing import List

# backend/crud.py
from sqlalchemy.orm import Session
from . import models, schemas

def get_or_create_po(db: Session, filename: str) -> models.PurchaseOrder:
    po = db.query(models.PurchaseOrder).filter_by(filename=filename).first()
    if po:
        return po
    po = models.PurchaseOrder(filename=filename)
    db.add(po)
    db.commit()
    db.refresh(po)
    return po

def replace_line_items(db: Session, po_id: int, items: List[schemas.LineItemBase]):
    db.query(models.LineItem).filter(models.LineItem.po_id == po_id).delete()
    for li in items:
        db.add(models.LineItem(po_id=po_id, **li.dict()))
    db.commit()
