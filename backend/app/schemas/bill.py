from pydantic import BaseModel
from typing import List


class BillItem(BaseModel):
    product_id: str
    quantity: int


class BillCreate(BaseModel):
    customer_id: str
    items: List[BillItem]