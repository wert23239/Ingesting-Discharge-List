from sqlalchemy import Column, Integer, String, Text, Enum, DateTime, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Record(Base):
    __tablename__ = "records"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text, nullable=False)
    epic_id = Column(Text, nullable=False)
    phone_number = Column(Text, nullable=True)
    insurance = Column(Text, nullable=True)
    status = Column(
        String, nullable=False, default="non-verified"  # Possible values: 'verified', 'non-verified', 'needs_review'
    )
    added_at = Column(DateTime, server_default=func.now())
    verified_by = Column(Text, nullable=True)  # Null if not verified
    verified_at = Column(DateTime, nullable=True)  # Null if not verified
