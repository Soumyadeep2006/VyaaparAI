from typing import Optional, Literal

from pydantic import BaseModel, EmailStr, Field


PaymentStatus = Literal["paid", "pending", "cancelled"]


class SupplierCreate(BaseModel):
    name: str
    company: str = ""
    email: EmailStr
    phone: str
    address: str

    totalPurchase: float = Field(default=0, ge=0)
    pendingPayment: float = Field(default=0, ge=0)

    paymentStatus: PaymentStatus = "paid"


class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    company: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None

    totalPurchase: Optional[float] = Field(
        default=None,
        ge=0
    )

    pendingPayment: Optional[float] = Field(
        default=None,
        ge=0
    )

    paymentStatus: Optional[PaymentStatus] = None