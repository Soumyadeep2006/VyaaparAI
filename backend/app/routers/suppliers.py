from fastapi import APIRouter

from app.schemas.supplier import SupplierCreate
from app.services.supplier import (
    create_supplier,
    get_suppliers,
)

router = APIRouter(
    prefix="/api/suppliers",
    tags=["Suppliers"],
)


@router.post("/")
async def add_supplier(
    data: SupplierCreate,
):

    return await create_supplier(
        data.model_dump()
    )


@router.get("/")
async def all_suppliers():

    return await get_suppliers()