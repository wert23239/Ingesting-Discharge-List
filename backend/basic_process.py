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

if __name__ == "__main__":
    pdf_file = "discharge_list.pdf"
    output = parse_pdf_to_json(pdf_file)
    # Print or process
    print(output)
