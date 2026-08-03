from typing import Optional, Any

from app.database import get_database
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_password_reset_token,
)


async def register_user(
    name: str,
    email: str,
    password: str,
):
    db = get_database()

    email = str(email).lower().strip()
    name = name.strip()

    if len(name) < 2:
        return None

    if len(password) < 6:
        return None

    existing_user = await db.users.find_one(
        {"email": email}
    )

    if existing_user:
        return None

    user = {
        "name": name,
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

    email = str(email).lower().strip()

    user = await db.users.find_one(
        {"email": email}
    )

    if not user:
        return None

    if not verify_password(
        password,
        user["password"],
    ):
        return None

    token = create_access_token({
        "sub": email
    })

    return {
        "token": token,
        "user": {
            "name": user["name"],
            "email": user["email"],
        },
    }


async def create_reset_token(email: str):

    db = get_database()

    email = str(email).lower().strip()

    user = await db.users.find_one(
        {"email": email}
    )

    if not user:
        return None

    return create_password_reset_token(email)


async def reset_user_password(
    email: str,
    new_password: str,
):

    db = get_database()

    email = str(email).lower().strip()

    user = await db.users.find_one(
        {"email": email}
    )

    if not user:
        return False

    await db.users.update_one(
        {"email": email},
        {
            "$set": {
                "password": hash_password(
                    new_password
                )
            }
        },
    )

    return True