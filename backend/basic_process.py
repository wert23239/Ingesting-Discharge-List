import tabula
import pandas as pd
import math

def parse_pdf_to_json(pdf_path: str):
    """
    Parse the discharge PDF using pdfplumber,
    return JSON array of discharge records.
    """
    records = []

    # Open the PDF with pdfplumber
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            # Extract table data from the page
            table = page.extract_table()
            if table:
                # Convert the table into a DataFrame
                df = pd.DataFrame(table[1:], columns=table[0])  # First row is column names

                # Standardize column names
                df.columns = [
                    "Name",
                    "EpicId",
                    "PhoneNumber",
                    "AttendingPhysician",
                    "Date",
                    "PrimaryCareProvider",
                    "Insurance",
                    "Disposition"
                ]

                # Clean / strip whitespace
                for col in df.columns:
                    if pd.api.types.is_string_dtype(df[col]):
                        df[col] = df[col].str.strip()

                # Append to the records list
                records.extend(df.to_dict(orient="records"))

    # Handle missing or invalid numeric values (NaN or Inf)
    for record in records:
        for key, value in record.items():
            if isinstance(value, float):
                if math.isnan(value) or math.isinf(value):
                    record[key] = None

    return records

def is_record_complete(record: dict):
    return (
        "Name" in record and record["Name"]
        and "EpicId" in record and record["EpicId"]
        and "PhoneNumber" in record and record["PhoneNumber"]
        and "Insurance" in record and record["Insurance"]
    )

def parse_and_label_record(raw_record: dict):
    # Normalize keys if needed (lowercase, etc.)
    # record = {k.lower(): v for k, v in raw_record.items()}


    # Decide status
    print(raw_record,is_record_complete(raw_record))
    if is_record_complete(raw_record):
        print("passed")
        raw_record["Status"] = "non-verified"   # all fields present
    else:
        raw_record["Status"] = "needs_review"   # some fields missing or invalid
    return raw_record
