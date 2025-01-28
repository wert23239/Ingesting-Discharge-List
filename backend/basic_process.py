import phonenumbers
import tabula
import pandas as pd
import math

def parse_pdf_to_json(pdf_path: str):
    """
    Parse the discharge PDF using tabula,
    return JSON array of discharge records.
    """
    # Read the PDF pages
    # Try stream mode if lattice doesn't work:
    dfs = tabula.read_pdf(pdf_path, pages="all")

    # Combine all dataframes if multiple pages, or just take first
    combined_df = pd.concat(dfs, ignore_index=True)
    combined_df.columns = [
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
    for col in combined_df.columns:
        if pd.api.types.is_string_dtype(combined_df[col]):
            combined_df[col] = combined_df[col].str.strip()

    # Convert to list of dictionaries
    records = combined_df.to_dict(orient="records")
    for record in records:  # assuming 'records' is a list of dicts
      for key, value in record.items():
          if isinstance(value, float):
              if math.isnan(value) or math.isinf(value):
                  # Decide how to handle it
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

def validate_phone_number(phone_number: str, region: str = "US"):
    """
    Validate and format a phone number.
    Args:
        phone_number (str): The raw phone number.
        region (str): Default region for parsing (e.g., "US").
    Returns:
        dict: {"valid": bool, "formatted": str or None}
    """
    try:
        parsed = phonenumbers.parse(phone_number, region)
        is_valid = phonenumbers.is_valid_number(parsed)
        formatted_number = phonenumbers.format_number(
            parsed, phonenumbers.PhoneNumberFormat.E164
        )
        return {"valid": is_valid, "formatted": formatted_number}
    except phonenumbers.NumberParseException:
        return {"valid": False, "formatted": None}

def validate_insurance(insurance: str):
    return bool(insurance and insurance.strip())

def validate_provider(provider: str):
    return bool(provider and provider.strip())
