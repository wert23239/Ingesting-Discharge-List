import phonenumbers

def parse_pdf_to_json(pdf_path: str):
    """
    Parse a scanned PDF using PDFPlumber and Tesseract OCR.
    """
    fake_records = [
        {
            "Name": "Sunshine, Melody",
            "EpicId": "EP001234567",
            "PhoneNumber": "202-555-0152",
            "AttendingPhysician": "Kildare, James MD",
            "Date": "07-04-2023",
            "PrimaryCareProvider": "Bailey, Miranda MD",
            "Insurance": "BCBS",
            "Disposition": "Home"
        },
        {
            "Name": "O’Furniture, Patty",
            "EpicId": "EP001239901",
            "PhoneNumber": "202-555-0148",
            "AttendingPhysician": "Hardy, Steve MD",
            "Date": "07-04-2023",
            "PrimaryCareProvider": "Webber, Richard MD",
            "Insurance": "Aetna Health",
            "Disposition": "HHS"
        },
        {
            "Name": "Bacon, Chris P.",
            "EpicId": "EP001237654",
            "PhoneNumber": "404-727-1234",
            "AttendingPhysician": "Manning, Steward Wallace PA",
            "Date": "07-04-2023",
            "PrimaryCareProvider": "Sloan, MD Mark",
            "Insurance": "Self Pay",
            "Disposition": "SNF"
        },
        {
            "Name": "Mellow, S. Marsha Bayabygirl",
            "EpicId": "EP001239876",
            "PhoneNumber": None,
            "AttendingPhysician": "House, Greg MD",
            "Date": "07-04-2023",
            "PrimaryCareProvider": None,
            "Insurance": "Humana Health",
            "Disposition": "Home"
        },
    ]
    return fake_records


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
