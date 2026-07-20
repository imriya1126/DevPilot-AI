from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.users import router as users_router
from app.api.ai import router as ai_router
from app.api.upload import router as upload_router

app = FastAPI(title="DevPilot AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://dev-pilot-ai-seven.vercel.app",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(ai_router)
app.include_router(upload_router)

@app.get("/")
def home():
    return {"message": "DevPilot AI Backend Running 🚀"}