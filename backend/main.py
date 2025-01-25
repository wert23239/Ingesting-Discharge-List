from fastapi import FastAPI, Depends, HTTPException, Request, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from sqlalchemy.orm import Session
from models import Record
import os
import uuid
import shutil
from pathlib import Path
from basic_process import parse_pdf_to_json
from db import engine, Base, get_db
from crud import create_record, get_records, update_record_status
from schemas import VerifyRequest


app = FastAPI()

# Initialize the database schema
Base.metadata.create_all(bind=engine)

app.mount(
    "/static",
    StaticFiles(directory=Path(__file__).parent.parent / "frontend" / "build" / "static"),
    name="static",
)

@app.post("/records/")
def add_record(name: str, epic_id: str, phone_number: str, db: Session = Depends(get_db)):
    return create_record(db, name, epic_id, phone_number)

@app.get("/records/")
def fetch_records(status: str = None, db: Session = Depends(get_db)):
    return get_records(db, status)

@app.put("/records/{record_id}")
def mark_record_as_verified(
    record_id: int,
    request: VerifyRequest,
    db: Session = Depends(get_db)
):
    record = update_record_status(db, record_id, "verified", request.verified_by)
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
        for record in records:
          name = record.get("Name", "Unknown")
          epic_id = record.get("EpicId","Unknown")
          phone_number = record.get("PhoneNumber","Unknown")
          insurance = record.get("Insurance","Unknown")
          create_record(db, name, epic_id, phone_number,insurance)

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
