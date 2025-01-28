# Use Python 3.10 as the base image
FROM python:3.10

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    default-jre \
    tesseract-ocr \
    libpq-dev \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /code

# Copy requirements file and install dependencies
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the backend application code
COPY ./ /code/

# Expose the FastAPI port
EXPOSE 8000

# Start the FastAPI server
CMD ["sh", "-c", "python db.py && uvicorn main:app --host 0.0.0.0 --port 8000"]

