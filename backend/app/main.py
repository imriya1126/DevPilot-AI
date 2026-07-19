from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import users
from app.api import ai
from app.api import upload
from app.db.database import Base, engine
from app.db.models import User

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DevPilot AI Backend"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(users.router)
app.include_router(ai.router)
app.include_router(upload.router)

# Home Route
@app.get("/")
def home():
    return {
        "message": "DevPilot AI Backend Running"
    }