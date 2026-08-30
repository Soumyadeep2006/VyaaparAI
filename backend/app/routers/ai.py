from fastapi import APIRouter, Depends

from app.schemas.ai import AIRequest
from app.services.ai import ask_ai
from app.utils.dependencies import get_current_user


router = APIRouter(
    prefix="/api/ai",
    tags=["AI Assistant"],
)


@router.post("/chat")
async def chat(
    data: AIRequest,
    current_user: str = Depends(get_current_user),
):
    try:
        result = await ask_ai(data.prompt, current_user)
        return result
    except Exception as e:
        import traceback

        traceback.print_exc()

        return {
            "error": str(e),
            "type": type(e).__name__,
        }
