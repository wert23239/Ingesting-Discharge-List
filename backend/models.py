from sqlalchemy import Column, Integer, String, Text, Enum, DateTime, func
from db import Base


class Record(Base):
    __tablename__ = "records"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    epic_id = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    insurance = Column(String, nullable=True)
    status = Column(String, default="non-verified" # Possible values: 'verified', 'non-verified', 'needs_review'
    )
    verified_by = Column(String, nullable=True)
    verified_at = Column(DateTime, default=None)
    created_at = Column(DateTime, default=func.now())
