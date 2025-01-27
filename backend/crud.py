from sqlalchemy.orm import Session
from models import Record
import datetime
from schemas import VerifyRequest


def create_record(db: Session, name: str, epic_id: str, phone_number: str, insurance: str, status:str):
    print("create record")
    new_record = Record(name=name, epic_id=epic_id, phone_number=phone_number, insurance=insurance, status=status)
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

def get_records(db: Session, status: str = None):
    query = db.query(Record)
    if status:
        query = query.filter(Record.status == status)
    return query.all()

def update_record_status(db: Session, record_id: int, payload: VerifyRequest):
    record = db.query(Record).filter(Record.id == record_id).first()
    print(record)

    # For each field in payload, update if it's not None
    if record:
      if payload.name is not None:
          record.name = payload.name
      if payload.phone_number is not None:
          record.phone_number = payload.phone_number
      if payload.insurance is not None:
          record.insurance = payload.insurance
      if payload.status is not None:
          record.status = payload.status
      if payload.verified_by is not None:
          record.verified_by = payload.verified_by
          record.verified_at = datetime.datetime.now()
      db.commit()
      db.refresh(record)
    return record
