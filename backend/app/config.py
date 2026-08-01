from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    APP_NAME = "VyaparAI Backend"

    MONGODB_URI = os.getenv(
        "MONGODB_URI",
        "mongodb://localhost:27017"
    )

    DATABASE_NAME = os.getenv(
        "DATABASE_NAME",
        "vyaparai"
    )

    GEMINI_API_KEY = os.getenv(
        "GEMINI_API_KEY",
        ""
    )

    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "vyaparai-secret-key"
    )

    ALGORITHM = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


settings = Settings()