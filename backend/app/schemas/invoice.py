from pydantic import BaseModel, Field
from typing import List


class InvoiceItem(BaseModel):
    product: str
    quantity: int = Field(gt=0)
    price: float = Field(ge=0)


class InvoiceCreate(BaseModel):
    customer: str
    items: List[InvoiceItem]
    total: float = Field(ge=0)
    status: str = "Pending"