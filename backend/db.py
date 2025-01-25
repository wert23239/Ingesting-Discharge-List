from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from models import Base

DATABASE_URL = "sqlite:///./test.db"  # Relative path to SQLite file

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the tables in the database
Base.metadata.create_all(bind=engine)

# # Dependency to use in FastAPI routes
def get_db():
    print("get_db")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
