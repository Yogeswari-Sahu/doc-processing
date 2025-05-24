# Endeavor Take-Home (React + FastAPI + MySQL)

## Prereqs
* Node ≥ 18
* Python ≥ 3.10
* MySQL server (local) – we tested with 8.0
* MySQL Workbench (optional, for GUI)

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
