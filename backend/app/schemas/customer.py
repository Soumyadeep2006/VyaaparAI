from typing import Optional, Literal

from pydantic import BaseModel, EmailStr, Field


PaymentStatus = Literal["paid", "pending", "cancelled"]


class CustomerCreate(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: str
    address: Optional[str] = None

    totalPurchase: float = Field(default=0, ge=0)
    outstanding: float = Field(default=0, ge=0)
    paymentStatus: PaymentStatus = "paid"


class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    totalPurchase: Optional[float] = Field(default=None, ge=0)
    outstanding: Optional[float] = Field(default=None, ge=0)
    paymentStatus: Optional[PaymentStatus] = None
