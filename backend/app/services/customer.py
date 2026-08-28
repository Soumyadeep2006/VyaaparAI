from bson import ObjectId

from app.database import db
from app.models.customer import customer_document


collection = db.customers


def format_customer(customer: dict):
    customer["id"] = str(customer["_id"])
    del customer["_id"]

    customer["totalPurchase"] = float(
        customer.get("totalPurchase", 0) or 0
    )

    customer["outstanding"] = float(
        customer.get("outstanding", 0) or 0
    )

    customer["paymentStatus"] = customer.get(
        "paymentStatus",
        "paid"
        if customer["outstanding"] == 0
        else "pending"
    )

    return customer


async def create_customer(
    data: dict,
    user_email: str,
):
    customer = customer_document(
        data,
        user_email,
    )

    result = await collection.insert_one(customer)

    customer["id"] = str(result.inserted_id)
    del customer["_id"]

    return customer


async def get_customers(
    user_email: str,
):
    customers = []

    cursor = collection.find({
        "owner_email": user_email
    })

    async for customer in cursor:
        customers.append(
            format_customer(customer)
        )

    return customers


async def update_customer(
    customer_id: str,
    data: dict,
    user_email: str,
):
    if not ObjectId.is_valid(customer_id):
        return None

    clean_data = {
        key: value
        for key, value in data.items()
        if value is not None
    }

    result = await collection.update_one(
        {
            "_id": ObjectId(customer_id),
            "owner_email": user_email,
        },
        {
            "$set": clean_data
        },
    )

    if result.matched_count == 0:
        return None

    customer = await collection.find_one({
        "_id": ObjectId(customer_id),
        "owner_email": user_email,
    })

    if not customer:
        return None

    return format_customer(customer)


async def delete_customer(
    customer_id: str,
    user_email: str,
):
    if not ObjectId.is_valid(customer_id):
        return 0

    result = await collection.delete_one({
        "_id": ObjectId(customer_id),
        "owner_email": user_email,
    })

    return result.deleted_count