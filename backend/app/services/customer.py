from app.database import db
from app.models.customer import customer_document


collection = db.customers


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
        customer["id"] = str(customer["_id"])
        del customer["_id"]
        customers.append(customer)

    return customers