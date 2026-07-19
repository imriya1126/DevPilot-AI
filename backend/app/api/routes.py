from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class User(BaseModel):
    name: str
    email: str
    password: str


@router.get("/")
def home():
    return {
        "message": "Welcome to DevPilot AI 🚀"
    }


@router.post("/signup")
def signup(user: User):
    return {
        "message": "User created successfully!",
        "user": user
    }