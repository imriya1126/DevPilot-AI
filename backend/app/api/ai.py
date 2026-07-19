from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from groq import Groq
import os
from dotenv import load_dotenv

from app.schemas.chat import ChatCreate, ChatResponse
from app.db.database import get_db
from app.db.models import ChatHistory, User
from app.utils.auth import get_current_user

# Import the upload module (IMPORTANT)
import app.api.upload as upload

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY not found in .env file")

client = Groq(api_key=api_key)

router = APIRouter(
    prefix="/ai",
    tags=["AI Assistant"]
)


@router.post("/chat")
def chat(
    data: ChatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:

        # Build prompt using uploaded file if available
        if upload.uploaded_text.strip():

            final_prompt = f"""
You are DevPilot AI.

The user uploaded a document.

Document:

{upload.uploaded_text}

--------------------------------

User Question:

{data.prompt}

Answer ONLY from the uploaded document whenever possible.
If the answer is not present, clearly say so.
"""

        else:
            final_prompt = data.prompt

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": final_prompt
                }
            ]
        )

        ai_response = completion.choices[0].message.content

        chat = ChatHistory(
            user_id=current_user.id,
            prompt=data.prompt,
            response=ai_response
        )

        db.add(chat)
        db.commit()
        db.refresh(chat)

        return {
            "response": ai_response
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/history", response_model=list[ChatResponse])
def get_chat_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    chats = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == current_user.id)
        .order_by(ChatHistory.created_at.desc())
        .all()
    )

    return chats


@router.delete("/chat/{chat_id}")
def delete_chat(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    chat = (
        db.query(ChatHistory)
        .filter(
            ChatHistory.id == chat_id,
            ChatHistory.user_id == current_user.id
        )
        .first()
    )

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found"
        )

    db.delete(chat)
    db.commit()

    return {
        "message": "Chat deleted successfully"
    }