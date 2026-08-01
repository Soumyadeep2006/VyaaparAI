from google import genai

from app.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)


async def ask_ai(prompt: str):
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    return {
        "response": response.text
    }