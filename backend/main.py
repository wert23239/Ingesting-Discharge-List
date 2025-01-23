from fastapi import FastAPI, Request, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
import os
import uuid
import shutil
from basic_process import parse_pdf_to_json
from pathlib import Path

app = FastAPI()

# 1) Mount the React build's static folder
#    e.g., "my-app/frontend/build/static" => served at "/static"
app.mount(
    "/static",
    StaticFiles(directory=Path(__file__).parent.parent / "frontend" / "build" / "static"),
    name="static",
)

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    # Save temporarily
    temp_filename = f"/tmp/{uuid.uuid4()}.pdf"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Parse with tabula
    records = parse_pdf_to_json(temp_filename)

    # Return the structured data
    return {"parsedData": records}

# 2) Optional: define some API endpoints
@app.get("/api/hello")
def read_hello():
    return {"message": "Hello from FastAPI!"}


# 3) Catch-all route to serve index.html
#    so React can handle its own routing in client side
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
