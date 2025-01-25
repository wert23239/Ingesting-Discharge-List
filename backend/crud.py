from sqlalchemy.orm import Session
from models import Record
import datetime


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

def update_record_status(db: Session, record_id: int, status: str, verified_by: str = None):
    record = db.query(Record).filter(Record.id == record_id).first()
    if record:
        record.status = status
        if verified_by:
            record.verified_by = verified_by
        record.verified_at = datetime.datetime.now()
        db.commit()
        db.refresh(record)
    return record
