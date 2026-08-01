from fastapi import APIRouter, HTTPException

from app.schemas.user import (
    RegisterSchema,
    LoginSchema,
    TokenSchema,
)

from app.services.auth import (
    register_user,
    login_user,
)


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


@router.post("/register")
async def register(
    data: RegisterSchema,
):
    user = await register_user(
        data.name,
        data.email,
        data.password,
    )

    if not user:
        raise HTTPException(
            status_code=400,
            detail="User already exists",
        )

    return {
        "message": "Registration Successful",
        "user": {
            "name": user["name"],
            "email": user["email"],
        },
    }


@router.post(
    "/login",
    response_model=TokenSchema,
)
async def login(
    data: LoginSchema,
):
    result = await login_user(
        data.email,
        data.password,
    )

    if not result:
        raise HTTPException(
            status_code=401,
            detail="Invalid Credentials",
        )

    return {
        "access_token": result["token"],
        "token_type": "bearer",
        "user": {
            "name": result["user"]["name"],
            "email": result["user"]["email"],
        },
    }