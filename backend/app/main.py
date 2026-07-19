from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


# Allow Frontend (Vercel) + Local Development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://dev-pilot-ai-seven.vercel.app",
        "https://dev-pilot-ai-git-main-imriya1126s-projects.vercel.app",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "DevPilot AI Backend Running 🚀"
    }