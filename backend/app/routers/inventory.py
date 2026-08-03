from fastapi import APIRouter, HTTPException, Query, Depends

from app.schemas.product import ProductCreate, ProductUpdate
from app.services.inventory import (
    create_product,
    get_products,
    get_product,
    delete_product,
    update_product,
    search_products,
    low_stock_products,
)
from app.utils.dependencies import get_current_user


router = APIRouter(
    prefix="/api/inventory",
    tags=["Inventory"],
)


@router.post("/")
async def add_product(
    data: ProductCreate,
    current_user: str = Depends(get_current_user),
):
    return await create_product(
        data.model_dump(),
        current_user,
    )


@router.get("/")
async def all_products(
    current_user: str = Depends(get_current_user),
):
    return await get_products(
        current_user
    )


@router.get("/search")
async def search(
    q: str = Query(...),
    current_user: str = Depends(get_current_user),
):
    return await search_products(
        q,
        current_user,
    )


@router.get("/low-stock")
async def low_stock(
    current_user: str = Depends(get_current_user),
):
    return await low_stock_products(
        current_user
    )


@router.get("/{product_id}")
async def single_product(
    product_id: str,
    current_user: str = Depends(get_current_user),
):
    product = await get_product(
        product_id,
        current_user,
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    return product


@router.put("/{product_id}")
async def update(
    product_id: str,
    data: ProductUpdate,
    current_user: str = Depends(get_current_user),
):
    product = await update_product(
        product_id,
        data.model_dump(exclude_none=True),
        current_user,
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    return product


@router.delete("/{product_id}")
async def remove_product(
    product_id: str,
    current_user: str = Depends(get_current_user),
):
    deleted = await delete_product(
        product_id,
        current_user,
    )

    if deleted == 0:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    return {
        "message": "Product deleted successfully"
    }