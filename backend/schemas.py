from pydantic import BaseModel
from typing import Optional


class VerifyRequest(BaseModel):
    name: Optional[str] = None
    epic_id: Optional[str] = None
    phone_number: Optional[str] = None
    insurance: Optional[str] = None
    status: Optional[str] = None
    verified_by: Optional[str] = None
