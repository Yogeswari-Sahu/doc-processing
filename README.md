# A full-stack purchase order document processing tool. (React + FastAPI + MySQL)

## Tech Stack

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: FastAPI + SQLAlchemy + MySQL
- **Purpose**: Upload PDFs → Extract line items → Match with product catalog → Confirm

## Prereqs
* Node ≥ 18
* Python ≥ 3.10
* MySQL server (local) – we tested with 8.0
* MySQL Workbench (optional, for GUI)

## Loom video :
Demo Video Link:
https://www.loom.com/share/3e1f756e2195435fa576e8c248ad7adb?sid=2b7f3b7f-53e8-4a35-9716-949251255877

## Setup

```bash
# --- Back-end -----------------------------------------------------
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # fill in DB pass & API URLs
mysql -u root -p -e "CREATE DATABASE endeavor_po CHARACTER SET utf8mb4;"
uvicorn main:app --reload       # → localhost:8000

# --- Front-end ----------------------------------------------------
cd ../frontend
npm i
npm run dev                     # → localhost:5173


