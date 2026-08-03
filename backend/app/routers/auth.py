from fastapi import APIRouter, HTTPException

from app.schemas.user import (
    RegisterSchema,
    LoginSchema,
    TokenSchema,
    ForgotPasswordSchema,
    ResetPasswordSchema,
)

from app.services.auth import (
    register_user,
    login_user,
    create_reset_token,
    reset_user_password,
)

from app.utils.security import (
    verify_password_reset_token,
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
            detail="Invalid email or password",
        )

    return {
        "access_token": result["token"],
        "token_type": "bearer",
        "user": {
            "name": result["user"]["name"],
            "email": result["user"]["email"],
        },
    }


@router.post("/forgot-password")
async def forgot_password(
    data: ForgotPasswordSchema,
):
    token = await create_reset_token(
        data.email
    )

    return {
        "message": (
            "If an account exists with this email, "
            "a password reset link has been generated."
        ),
        "token": token,
    }


@router.post("/reset-password")
async def reset_password(
    data: ResetPasswordSchema,
):
    email = verify_password_reset_token(
        data.token
    )

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset link",
        )

    if len(data.password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters",
        )

    success = await reset_user_password(
        email,
        data.password,
    )

    if not success:
        raise HTTPException(
            status_code=400,
            detail="Unable to reset password",
        )

    return {
        "message": "Password reset successfully"
    }