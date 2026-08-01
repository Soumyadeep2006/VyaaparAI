from typing import Optional, Any

from app.database import get_database
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
)


async def register_user(
    name: str,
    email: str,
    password: str,
):
    db = get_database()

    email = email.lower().strip()

    existing_user = await db.users.find_one({
        "email": email
    })

    if existing_user:
        return None

    user = {
        "name": name.strip(),
        "email": email,
        "password": hash_password(password),
    }

    result = await db.users.insert_one(user)

    user["_id"] = str(result.inserted_id)

    return user


async def login_user(
    email: str,
    password: str,
) -> Optional[dict[str, Any]]:
    db = get_database()

    email = email.lower().strip()

    user = await db.users.find_one({
        "email": email
    })

    if not user:
        return None

    if not verify_password(
        password,
        user["password"],
    ):
        return None

    token = create_access_token({
        "sub": email,
    })

    return {
        "token": token,
        "user": {
            "name": user["name"],
            "email": user["email"],
        },
    }