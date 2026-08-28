from fastapi import APIRouter, Depends, HTTPException

from app.schemas.customer import (
    CustomerCreate,
    CustomerUpdate,
)

from app.services.customer import (
    create_customer,
    get_customers,
    update_customer,
    delete_customer,
)

from app.utils.dependencies import get_current_user


router = APIRouter(
    prefix="/api/customers",
    tags=["Customers"],
)


@router.post("/")
async def add_customer(
    data: CustomerCreate,
    current_user: str = Depends(get_current_user),
):
    return await create_customer(
        data.model_dump(),
        current_user,
    )


@router.get("/")
async def all_customers(
    current_user: str = Depends(get_current_user),
):
    return await get_customers(
        current_user
    )


@router.put("/{customer_id}")
async def edit_customer(
    customer_id: str,
    data: CustomerUpdate,
    current_user: str = Depends(get_current_user),
):
    customer = await update_customer(
        customer_id,
        data.model_dump(exclude_none=True),
        current_user,
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    return customer


@router.delete("/{customer_id}")
async def remove_customer(
    customer_id: str,
    current_user: str = Depends(get_current_user),
):
    deleted = await delete_customer(
        customer_id,
        current_user,
    )

    if deleted == 0:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    return {
        "message": "Customer deleted successfully"
    }