import asyncio

from app.database import db


async def test():
    await db.command("ping")
    print("✅ MongoDB Connected Successfully!")


asyncio.run(test())