import re
from typing import Optional, Any

import requests
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

from app.config import settings
from app.database import get_database
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_password_reset_token,
)


def normalize_phone(phone: str) -> str:
    """Return a compact E.164 phone number.

    VyaparAI accepts an E.164 number directly. For convenience, a plain
    10-digit Indian mobile number is also accepted and gets +91 added.
    """
    raw = phone.strip()
    digits = re.sub(r"\D", "", raw)

    if raw.startswith("+"):
        if not digits or len(digits) < 8 or len(digits) > 15:
            raise ValueError("Invalid phone number")
        return f"+{digits}"

    if raw.startswith("00"):
        digits = digits[2:]
        if len(digits) < 8 or len(digits) > 15:
            raise ValueError("Invalid phone number")
        return f"+{digits}"

    if len(digits) == 10:
        return f"+91{digits}"

    raise ValueError(
        "Enter a valid phone number with country code, e.g. +91 9876543210"
    )


def _token_for_identity(identity: str) -> str:
    return create_access_token({"sub": identity})


def _user_response(user: dict) -> dict:
    return {
        "name": user.get("name") or "VyaparAI User",
        "email": user.get("email"),
        "phone": user.get("phone"),
    }


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

    if not user or not user.get("password"):
        return None

    if not verify_password(
        password,
        user["password"],
    ):
        return None

    token = _token_for_identity(email)

    return {
        "token": token,
        "user": _user_response(user),
    }


async def login_with_google(credential: str) -> Optional[dict[str, Any]]:
    if not settings.GOOGLE_CLIENT_ID:
        raise RuntimeError("Google login is not configured on the backend")

    try:
        google_user = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except ValueError:
        return None

    google_id = str(google_user.get("sub", "")).strip()
    email = str(google_user.get("email", "")).lower().strip()
    email_verified = bool(google_user.get("email_verified"))
    name = str(google_user.get("name") or "Google User").strip()

    if not google_id or not email or not email_verified:
        return None

    db = get_database()

    # Google `sub` is the stable Google account identifier.
    user = await db.users.find_one({"google_id": google_id})

    if not user:
        # Google documents Gmail and Google Workspace verified emails as
        # authoritative. This lets us safely link an existing account.
        is_authoritative_email = (
            email.endswith("@gmail.com")
            or bool(google_user.get("hd"))
        )

        if is_authoritative_email:
            user = await db.users.find_one({"email": email})

        if user:
            await db.users.update_one(
                {"_id": user["_id"]},
                {"$set": {"google_id": google_id}},
            )
            user["google_id"] = google_id
        else:
            user = {
                "name": name,
                "email": email,
                "google_id": google_id,
            }
            result = await db.users.insert_one(user)
            user["_id"] = result.inserted_id

    token = _token_for_identity(user.get("email") or user["phone"])

    return {
        "token": token,
        "user": _user_response(user),
    }


async def send_phone_otp(phone: str) -> str:
    """Send a real OTP through MSG91.

    MSG91's OTP API expects the mobile number in international format and
    requires the account auth key plus an approved OTP template ID.
    """
    if not all([
        settings.MSG91_AUTH_KEY,
        settings.MSG91_TEMPLATE_ID,
    ]):
        raise RuntimeError("Phone OTP is not configured on the backend")

    phone = normalize_phone(phone)

    try:
        response = requests.post(
            "https://control.msg91.com/api/v5/otp",
            params={
                "template_id": settings.MSG91_TEMPLATE_ID,
                "mobile": phone,
                "authkey": settings.MSG91_AUTH_KEY,
            },
            headers={
                "Content-Type": "application/json",
            },
            timeout=10,
        )
    except requests.RequestException as exc:
        raise RuntimeError("Unable to contact the OTP service") from exc

    if not response.ok:
        raise RuntimeError("Unable to send OTP")

    return phone


async def verify_phone_otp(
    phone: str,
    otp: str,
) -> Optional[dict[str, Any]]:
    """Verify an OTP through MSG91, then issue the existing VyaparAI JWT."""
    if not settings.MSG91_AUTH_KEY:
        raise RuntimeError("Phone OTP is not configured on the backend")

    phone = normalize_phone(phone)
    otp = otp.strip()

    try:
        response = requests.get(
            "https://control.msg91.com/api/v5/otp/verify",
            params={
                "otp": otp,
                "mobile": phone,
            },
            headers={
                "authkey": settings.MSG91_AUTH_KEY,
            },
            timeout=10,
        )
    except requests.RequestException as exc:
        raise RuntimeError("Unable to contact the OTP service") from exc

    if not response.ok:
        return None

    try:
        result = response.json()
    except ValueError:
        return None

    # MSG91 returns a successful OTP verification as type=success.
    if str(result.get("type", "")).lower() != "success":
        return None

    db = get_database()
    user = await db.users.find_one({"phone": phone})

    if not user:
        user = {
            "name": "VyaparAI User",
            "phone": phone,
        }
        inserted = await db.users.insert_one(user)
        user["_id"] = inserted.inserted_id

    # Keep the existing application architecture intact: all business
    # documents use the JWT subject as their owner key. For phone-only users,
    # the normalized phone number is that owner key.
    token = _token_for_identity(user.get("email") or phone)

    return {
        "token": token,
        "user": _user_response(user),
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
