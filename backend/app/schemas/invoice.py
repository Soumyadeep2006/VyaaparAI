from typing import List, Literal, Optional

from pydantic import BaseModel, Field


InvoiceStatus = Literal["Pending", "Paid", "Cancelled"]
PaymentMethod = Literal["Cash", "UPI", "Card", "Bank Transfer"]


class InvoiceItem(BaseModel):
    product: str
    product_id: Optional[str] = None
    quantity: int = Field(gt=0)
    price: float = Field(ge=0)


class InvoiceCreate(BaseModel):
    customer: str
    customer_id: Optional[str] = None
    items: List[InvoiceItem] = Field(min_length=1)
    total: float = Field(ge=0)
    status: InvoiceStatus = "Paid"
    payment_method: PaymentMethod = "Cash"
