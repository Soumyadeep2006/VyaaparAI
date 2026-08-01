from fastapi import APIRouter
from app.schemas.ai import AIRequest
from app.services.ai import ask_ai

router = APIRouter(
    prefix="/api/ai",
    tags=["AI Assistant"],
)

@router.post("/chat")
async def chat(data: AIRequest):
    try:
        result = await ask_ai(data.prompt)
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "error": str(e),
            "type": type(e).__name__
        }