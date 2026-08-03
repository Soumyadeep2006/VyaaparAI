from fastapi import APIRouter, Depends

from app.schemas.supplier import SupplierCreate
from app.services.supplier import (
    create_supplier,
    get_suppliers,
)
from app.utils.dependencies import get_current_user


router = APIRouter(
    prefix="/api/suppliers",
    tags=["Suppliers"],
)


@router.post("/")
async def add_supplier(
    data: SupplierCreate,
    current_user: str = Depends(get_current_user),
):
    return await create_supplier(
        data.model_dump(),
        current_user,
    )


@router.get("/")
async def all_suppliers(
    current_user: str = Depends(get_current_user),
):
    return await get_suppliers(
        current_user,
    )