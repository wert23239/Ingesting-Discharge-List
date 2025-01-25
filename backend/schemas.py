from pydantic import BaseModel

class VerifyRequest(BaseModel):
    verified_by: str
