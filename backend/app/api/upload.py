from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.utils.auth import get_current_user
from app.db.models import User
import os
import shutil
from PyPDF2 import PdfReader

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Stores uploaded document text (v1)
uploaded_text = ""

@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    global uploaded_text

    allowed_extensions = [
        ".pdf",
        ".txt",
        ".png",
        ".jpg",
        ".jpeg"
    ]

    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type."
        )

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    uploaded_text = ""

    if extension == ".txt":
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            uploaded_text = f.read()

    elif extension == ".pdf":
        reader = PdfReader(file_path)

        for page in reader.pages:
            text = page.extract_text()

            if text:
                uploaded_text += text + "\n"

    return {
        "success": True,
        "message": "File uploaded successfully.",
        "filename": file.filename,
        "characters": len(uploaded_text)
    }