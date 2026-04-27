from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ApplicationBase(BaseModel):
    company_name: str
    role: str
    match_score: Optional[float] = None
    distance: Optional[float] = None
    status: str = "New"
    cover_letter_version: Optional[str] = None
    job_link: str
    location: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationResponse(ApplicationBase):
    id: int
    applied_at: datetime

    class Config:
        from_attributes = True
