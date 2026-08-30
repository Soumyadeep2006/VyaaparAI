from pydantic import BaseModel, EmailStr


class User(BaseModel):
    name: str
    email: EmailStr | None = None
    phone: str | None = None
    password: str | None = None
    google_id: str | None = None
