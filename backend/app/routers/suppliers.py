from fastapi import APIRouter, Depends, HTTPException

from app.schemas.supplier import (
    SupplierCreate,
    SupplierUpdate,
)

from app.services.supplier import (
    create_supplier,
    get_suppliers,
    update_supplier,
    delete_supplier,
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


@router.put("/{supplier_id}")
async def edit_supplier(
    supplier_id: str,
    data: SupplierUpdate,
    current_user: str = Depends(get_current_user),
):
    supplier = await update_supplier(
        supplier_id,
        data.model_dump(exclude_none=True),
        current_user,
    )

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found",
        )

    return supplier


@router.delete("/{supplier_id}")
async def remove_supplier(
    supplier_id: str,
    current_user: str = Depends(get_current_user),
):
    deleted = await delete_supplier(
        supplier_id,
        current_user,
    )

    if deleted == 0:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found",
        )

    return {
        "message": "Supplier deleted successfully"
    }