from pydantic import BaseModel, EmailStr


class RegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginSchema(BaseModel):
    email: EmailStr
    password: str


class UserSchema(BaseModel):
    name: str
    email: EmailStr


class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserSchema


class ForgotPasswordSchema(BaseModel):
    email: EmailStr


class ResetPasswordSchema(BaseModel):
    token: str
    password: str