from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime, timezone
from app.database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, index=True)
    role = Column(String, index=True)
    match_score = Column(Float)
    distance = Column(Float)
    applied_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    status = Column(String, default="New") # New, Reviewed, Applied, Rejected
    cover_letter_version = Column(String, nullable=True)
    job_link = Column(String)
    location = Column(String)
