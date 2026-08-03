from bson.objectid import ObjectId

from app.database import db
from app.models.product import product_document


collection = db.products


async def create_product(
    data: dict,
    owner_email: str,
):
    product = product_document(
        data,
        owner_email,
    )

    result = await collection.insert_one(product)

    product["id"] = str(result.inserted_id)

    del product["_id"]

    return product


async def get_products(
    owner_email: str,
):
    products = []

    async for product in collection.find(
        {
            "owner_email": owner_email
        }
    ):
        product["id"] = str(product["_id"])

        del product["_id"]

        products.append(product)

    return products


async def get_product(
    product_id: str,
    owner_email: str,
):
    if not ObjectId.is_valid(product_id):
        return None

    product = await collection.find_one(
        {
            "_id": ObjectId(product_id),
            "owner_email": owner_email,
        }
    )

    if not product:
        return None

    product["id"] = str(product["_id"])

    del product["_id"]

    return product


async def update_product(
    product_id: str,
    data: dict,
    owner_email: str,
):
    if not ObjectId.is_valid(product_id):
        return None

    result = await collection.update_one(
        {
            "_id": ObjectId(product_id),
            "owner_email": owner_email,
        },
        {
            "$set": data
        },
    )

    if result.matched_count == 0:
        return None

    return await get_product(
        product_id,
        owner_email,
    )


async def delete_product(
    product_id: str,
    owner_email: str,
):
    if not ObjectId.is_valid(product_id):
        return 0

    result = await collection.delete_one(
        {
            "_id": ObjectId(product_id),
            "owner_email": owner_email,
        }
    )

    return result.deleted_count


async def search_products(
    query: str,
    owner_email: str,
):
    products = []

    cursor = collection.find(
        {
            "owner_email": owner_email,
            "name": {
                "$regex": query,
                "$options": "i",
            },
        }
    )

    async for product in cursor:
        product["id"] = str(product["_id"])

        del product["_id"]

        products.append(product)

    return products


async def low_stock_products(
    owner_email: str,
):
    products = []

    cursor = collection.find(
        {
            "owner_email": owner_email,
            "quantity": {
                "$lt": 10
            },
        }
    )

    async for product in cursor:
        product["id"] = str(product["_id"])

        del product["_id"]

        products.append(product)

    return products