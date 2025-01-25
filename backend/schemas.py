from pydantic import BaseModel

class VerifyRequest(BaseModel):
    status: str
    verified_by: str
