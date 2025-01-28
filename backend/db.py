from sqlalchemy import Column, Integer, String, Text, Enum, DateTime, func, create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env
DATABASE_URL = os.getenv("DATABASE_URL")
print(DATABASE_URL)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# # Dependency to use in FastAPI routes
def get_db():
    print("get_db")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Record(Base):
    __tablename__ = "records"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    epic_id = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    insurance = Column(String, nullable=True)
    provider = Column(String, nullable=True)
    status = Column(String, default="non-verified" # Possible values: 'verified', 'non-verified', 'needs_review'
    )
    verified_by = Column(String, nullable=True)
    verified_at = Column(DateTime, default=None)
    created_at = Column(DateTime, default=func.now())

def create_tables():
    engine = create_engine(DATABASE_URL)
    conn = engine.connect()
    print("Connected to database!")
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)

# Call the function on startup
if __name__ == "__main__":
    create_tables()
