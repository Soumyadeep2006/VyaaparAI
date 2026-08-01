from fastapi import APIRouter, HTTPException, Query

from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
)

from app.services.inventory import (
    create_product,
    get_products,
    get_product,
    delete_product,
    update_product,
    search_products,
    low_stock_products,
)

router = APIRouter(
    prefix="/api/inventory",
    tags=["Inventory"],
)


# -----------------------------
# Add Product
# -----------------------------
@router.post("/")
async def add_product(
    data: ProductCreate,
):

    product = await create_product(
        data.model_dump()
    )

    return product


# -----------------------------
# Get All Products
# -----------------------------
@router.get("/")
async def all_products():

    return await get_products()


# -----------------------------
# Search Products
# Example:
# /api/inventory/search?q=laptop
# -----------------------------
@router.get("/search")
async def search(
    q: str = Query(...)
):

    return await search_products(q)


# -----------------------------
# Low Stock Products
# -----------------------------
@router.get("/low-stock")
async def low_stock():

    return await low_stock_products()


# -----------------------------
# Get Single Product
# -----------------------------
@router.get("/{product_id}")
async def single_product(
    product_id: str,
):

    product = await get_product(product_id)

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    return product


# -----------------------------
# Update Product
# -----------------------------
@router.put("/{product_id}")
async def update(
    product_id: str,
    data: ProductUpdate,
):

    product = await update_product(
        product_id,
        data.model_dump(exclude_none=True),
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    return product


# -----------------------------
# Delete Product
# -----------------------------
@router.delete("/{product_id}")
async def remove_product(
    product_id: str,
):

    deleted = await delete_product(product_id)

    if deleted == 0:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    return {
        "message": "Product deleted successfully"
    }