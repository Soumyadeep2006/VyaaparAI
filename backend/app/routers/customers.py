from fastapi import APIRouter

from app.schemas.customer import CustomerCreate
from app.services.customer import (
    create_customer,
    get_customers,
)

router = APIRouter(
    prefix="/api/customers",
    tags=["Customers"],
)


@router.post("/")
async def add_customer(
    data: CustomerCreate,
):

    return await create_customer(
        data.model_dump()
    )


@router.get("/")
async def all_customers():

    return await get_customers()