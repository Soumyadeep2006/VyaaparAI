from typing import Optional
from pydantic import BaseModel, EmailStr


class SupplierCreate(BaseModel):
    name: str
    company: str
    email: EmailStr
    phone: str
    address: str


class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    company: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None