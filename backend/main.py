from fastapi import FastAPI, Depends, HTTPException, Request, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from sqlalchemy.orm import Session
from db import Record
import os
import uuid
import shutil
from pathlib import Path
from basic_process import parse_pdf_to_json, parse_and_label_record, validate_phone_number, validate_insurance, validate_provider
from db import engine, Base, get_db
from crud import create_record, get_records, update_record_status
from schemas import VerifyRequest
from dotenv import load_dotenv
import os

load_dotenv()  # Load .env file

IS_LOCAL = os.getenv("IS_LOCAL", "false").lower() == "true"

app = FastAPI()

# Check if running in local development
IS_LOCAL = os.getenv("IS_LOCAL", "true").lower() == "true"

# CORS configuration
# Allow the frontend (React) to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3006",  # React development server
        "http://127.0.0.1:8000",
        "http://127.0.0.1:3006",
        "https://ingesting-discharge-list-1.onrender.com",  # Render Static Site
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# # Serve React app during local development
# if IS_LOCAL:
#     print("Running in local development mode. Serving React app...")
#     app.mount(
#         "/static",
#         StaticFiles(directory=Path(__file__).parent.parent / "frontend" / "build" / "static"),
#         name="static",
#     )

#     @app.get("/")
#     def serve_frontend():
#         return FileResponse(Path(__file__).parent.parent / "frontend" / "build" / "index.html")

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/records/")
def add_record(name: str, epic_id: str, phone_number: str, db: Session = Depends(get_db)):
    return create_record(db, name, epic_id, phone_number)

@app.get("/records/")
def fetch_records(status: str = None, db: Session = Depends(get_db)):
    return get_records(db, status)

@app.get("/records/finalized")
def get_finalized_records(db: Session = Depends(get_db)):
    records = get_records(db, "verified")

    validated_records = []
    for record in records:
        phone_validation = validate_phone_number(record.phone_number)
        validated_records.append({
            "id": record.id,
            "name": record.name,
            "epic_id": record.epic_id,
            "phone_number": phone_validation["formatted"],
            "phone_valid": phone_validation["valid"],
            "insurance": record.insurance,
            "insurance_valid": validate_insurance(record.insurance),
            "provider": record.provider,
            "provider_valid": validate_provider(record.provider),
            "status": record.status,
            "verified_by": record.verified_by,
            "verified_at": record.verified_at,
        })

    return {"records": validated_records}

@app.put("/records/{record_id}")
def update_record(
    record_id: int,
    request: VerifyRequest,
    db: Session = Depends(get_db)
):
    print("update_record")
    record = update_record_status(db, record_id, request)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
    print("File uploaded:", file.filename)


    db.query(Record).delete()
    db.commit()
    print("Cleared the 'records' table.")


    # Save temporarily
    temp_filename = f"/tmp/{uuid.uuid4()}.pdf"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Parse the PDF and get records
        records = parse_pdf_to_json(temp_filename)

        # Save records to the database
        for raw_record in records:
          labeled = parse_and_label_record(raw_record)  # either 'non-verified' or 'needs_review'
          name = labeled.get("Name", "Unknown")
          epic_id = labeled.get("EpicId","Unknown")
          phone_number = labeled.get("PhoneNumber","Unknown")
          insurance = labeled.get("Insurance","Unknown")
          provider = labeled.get("PrimaryCareProvider", "Unknown")
          status = labeled.get("Status","needs_review")
          create_record(db, name, epic_id, phone_number,insurance,provider,status)

        return {"message": f"Successfully uploaded and saved {len(records)} records."}
    except Exception as e:
        print(f"Error processing file: {e}")
        return {"error": "Failed to parse and save records. Please try again."}
#  Catch-all route to serve index.html
#  so React can handle its own routing in client side
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str, request: Request):
    build_path = Path(__file__).parent.parent / "frontend" / "build"
    index_file = build_path / "index.html"
    if index_file.is_file():
        return FileResponse(index_file)
    return HTMLResponse(
        status_code=404,
        content="<h1>404 - Not Found</h1>"
    )
