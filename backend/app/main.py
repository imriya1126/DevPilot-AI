from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.users import router as users_router
from app.api.ai import router as ai_router
from app.api.upload import router as upload_router

app = FastAPI(title="DevPilot AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://dev-pilot-ai-seven.vercel.app",
        "https://dev-pilot-mx82qduz8-imriya1126s-projects.vercel.app",
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