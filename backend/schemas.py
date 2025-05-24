from pydantic import BaseModel
from typing import List, Optional

class LineItemBase(BaseModel):
    description: str
    quantity: float
    unit_price: Optional[float] = None   # ← changed
    total: Optional[float] = None        # ← changed
    match_sku: Optional[str] = None
    match_name: Optional[str] = None
    match_score: Optional[float] = None


class LineItem(LineItemBase):
    id: int
    class Config: 
        from_attributes = True 

class PurchaseOrder(BaseModel):
    id: int
    filename: str
    line_items: List[LineItem]
    class Config:
        from_attributes = True
