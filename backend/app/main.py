from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import engine, Base, get_db
from app.models import Application
from app.schemas import ApplicationResponse, ApplicationCreate

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="JobHunter Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to JobHunter Assistant API"}

@app.get("/applications/", response_model=list[ApplicationResponse])
def get_applications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    applications = db.query(Application).offset(skip).limit(limit).all()
    return applications

@app.post("/applications/", response_model=ApplicationResponse)
def create_application(application: ApplicationCreate, db: Session = Depends(get_db)):
    db_app = Application(**application.model_dump())
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app
