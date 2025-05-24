from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from .database import Base

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"
    id        = Column(Integer, primary_key=True, index=True)
    filename  = Column(String(255), index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    line_items = relationship(
        "LineItem",
        back_populates="po",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

class LineItem(Base):
    __tablename__ = "line_items"

    id          = Column(Integer, primary_key=True, index=True)
    po_id       = Column(Integer, ForeignKey("purchase_orders.id", ondelete="CASCADE"))
    description = Column(String(1000))
    quantity    = Column(Float)
    unit_price  = Column(Float, nullable=True)   # ← NEW
    total       = Column(Float, nullable=True)   # ← NEW

    match_sku   = Column(String(255))
    match_name  = Column(String(1000))
    match_score = Column(Float)

    po = relationship("PurchaseOrder", back_populates="line_items")


