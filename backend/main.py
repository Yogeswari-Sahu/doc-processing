# backend/main.py
import os, io, csv, requests
from typing import List, Dict, Tuple, Optional

from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from pathlib import Path
from itertools import zip_longest

from . import database, models, schemas, crud   # <— relative import

# ── env ───────────────────────────────────────────────────────────────
load_dotenv(Path(__file__).resolve().parent / ".env")

EXTRACTION_URL = os.getenv("EXTRACTION_URL")
MATCHING_URL   = os.getenv("MATCHING_URL")

PLACEHOLDER_NAME = "Easy - 1.pdf"   # the extraction API accepts this

# ── DB bootstrap ──────────────────────────────────────────────────────
models.Base.metadata.create_all(bind=database.engine)

# ── FastAPI instance ──────────────────────────────────────────────────
app = FastAPI(title="Endeavor PO Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ── helper: extraction ────────────────────────────────────────────────
def extract_line_items(pdf_bytes: bytes) -> List[Dict]:
    """
    Call extraction endpoint, map to our internal schema.
    """
    resp = requests.post(
        EXTRACTION_URL,
        files={"file": (PLACEHOLDER_NAME, pdf_bytes, "application/pdf")},
        timeout=60,
    )
    resp.raise_for_status()
    raw: List[Dict] = resp.json()

    norm: List[Dict] = []
    for row in raw:
        norm.append(
            {
                "description": row.get("Request Item") or row.get("description", ""),
                "quantity": row.get("Amount") or row.get("quantity", 1),
                "unit_price": row.get("Unit Price"),
                "total": row.get("Total"),
            }
        )
    return norm

# ── helper: matching ──────────────────────────────────────────────────
def match_catalog(descriptions: List[str], limit: int = 10) -> List[Dict]:
    """
    Call the matching endpoint that returns:
    { "results": { query: [{match, score}, ...], ... } }
    Return a flat list aligned with `descriptions`,
    each item → {"sku": None, "name": top_match, "score": top_score}
    """
    resp = requests.post(
        MATCHING_URL,
        params={"limit": limit},
        json={"queries": descriptions},
        timeout=30,
    )
    resp.raise_for_status()
    data = resp.json()

    results = data.get("results", {})
    parsed: List[Dict] = []

    for q in descriptions:
        row = results.get(q, [])
        if row:
            top = row[0]
            parsed.append(
                {
                    "sku": None,
                    "name": top.get("match", ""),
                    "score": float(top.get("score", 0)),
                }
            )
        else:
            parsed.append({"sku": None, "name": "", "score": 0.0})

    return parsed

def unpack_match(m: Dict) -> Tuple[str, str, float]:
    """Return (sku, name, score) even if m came back as plain str."""
    if isinstance(m, str):
        return m, "", 1.0
    return m.get("sku", ""), m.get("name", ""), float(m.get("score", 1.0))

# ── ROUTES ────────────────────────────────────────────────────────────
@app.post("/api/upload", response_model=schemas.PurchaseOrder)
async def upload_po(file: UploadFile = File(...), db: Session = Depends(get_db)):
    pdf_bytes = await file.read()

    # 1. extraction → normalise
    try:
        extracted = extract_line_items(pdf_bytes)
    except requests.HTTPError as e:
        raise HTTPException(502, "Extraction service error") from e

    # 2. matching
    matches = match_catalog([row["description"] for row in extracted])

    # 3. get-or-create PO (implement in crud.py)
    po = crud.get_or_create_po(db, file.filename)

    # 4. build line-items
    li_objs: List[schemas.LineItemBase] = []
    for src, m in zip_longest(extracted, matches, fillvalue={}):
        sku, name, score = unpack_match(m)
        li_objs.append(
            schemas.LineItemBase(
                description=src["description"],
                quantity=src["quantity"],
                unit_price=src.get("unit_price"),
                total=src.get("total"),
                match_sku=sku,
                match_name=name,
                match_score=score,
            )
        )

    crud.replace_line_items(db, po.id, li_objs)
    db.refresh(po)
    return po

@app.put("/api/po/{po_id}", response_model=schemas.PurchaseOrder)
def update_po(po_id: int, payload: schemas.PurchaseOrder, db: Session = Depends(get_db)):
    crud.replace_line_items(db, po_id, payload.line_items)
    return db.get(models.PurchaseOrder, po_id)

@app.get("/api/po/{po_id}/csv")
def download_csv(po_id: int, db: Session = Depends(get_db)):
    po = db.get(models.PurchaseOrder, po_id)
    if not po:
        raise HTTPException(404)

    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(["description", "quantity", "unit_price", "total", "sku", "product_name", "score"])
    for li in po.line_items:
        w.writerow([li.description, li.quantity, li.unit_price, li.total, li.match_sku, li.match_name, li.match_score])
    return {"filename": f"{po.filename}.csv", "content": buf.getvalue()}
