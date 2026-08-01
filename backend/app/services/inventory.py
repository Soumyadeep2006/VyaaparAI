from bson.objectid import ObjectId

from app.database import db
from app.models.product import product_document

collection = db.products


# -----------------------------
# Create Product
# -----------------------------
async def create_product(data: dict):

    product = product_document(data)

    result = await collection.insert_one(product)

    product["_id"] = result.inserted_id

    product["id"] = str(result.inserted_id)

    del product["_id"]

    return product


# -----------------------------
# Get All Products
# -----------------------------
async def get_products():

    products = []

    async for product in collection.find():

        product["id"] = str(product["_id"])

        del product["_id"]

        products.append(product)

    return products


# -----------------------------
# Get Single Product
# -----------------------------
async def get_product(product_id: str):

    product = await collection.find_one(
        {
            "_id": ObjectId(product_id)
        }
    )

    if not product:
        return None

    product["id"] = str(product["_id"])

    del product["_id"]

    return product


# -----------------------------
# Update Product
# -----------------------------
async def update_product(product_id: str, data: dict):

    result = await collection.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": data},
    )

    if result.matched_count == 0:
        return None

    return await get_product(product_id)


# -----------------------------
# Delete Product
# -----------------------------
async def delete_product(product_id: str):

    result = await collection.delete_one(
        {
            "_id": ObjectId(product_id)
        }
    )

    return result.deleted_count


# -----------------------------
# Search Products
# -----------------------------
async def search_products(query: str):

    products = []

    cursor = collection.find(
        {
            "name": {
                "$regex": query,
                "$options": "i",
            }
        }
    )

    async for product in cursor:

        product["id"] = str(product["_id"])

        del product["_id"]

        products.append(product)

    return products


# -----------------------------
# Low Stock Products
# -----------------------------
async def low_stock_products():

    products = []

    cursor = collection.find(
        {
            "quantity": {
                "$lt": 10
            }
        }
    )

    async for product in cursor:

        product["id"] = str(product["_id"])

        del product["_id"]

        products.append(product)

    return products