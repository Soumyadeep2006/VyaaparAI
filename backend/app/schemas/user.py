from pydantic import BaseModel, EmailStr, Field


class RegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginSchema(BaseModel):
    email: EmailStr
    password: str


class GoogleLoginSchema(BaseModel):
    credential: str = Field(min_length=20)


class PhoneOTPSendSchema(BaseModel):
    phone: str = Field(min_length=7, max_length=20)


class PhoneOTPVerifySchema(BaseModel):
    phone: str = Field(min_length=7, max_length=20)
    otp: str = Field(min_length=4, max_length=10)


class UserSchema(BaseModel):
    name: str
    email: str | None = None
    phone: str | None = None


class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserSchema


class ForgotPasswordSchema(BaseModel):
    email: EmailStr


class ResetPasswordSchema(BaseModel):
    token: str
    password: str
