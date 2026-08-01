from pydantic import BaseModel
from typing import List


class InvoiceItem(BaseModel):
    product: str
    quantity: int
    price: float


class Invoice(BaseModel):
    customer: str
    items: List[InvoiceItem]
    total: float
    status: str = "Paid"