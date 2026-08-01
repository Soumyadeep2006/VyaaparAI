from bson.objectid import ObjectId

from app.database import db
from app.models.customer import customer_document

collection = db.customers


async def create_customer(data: dict):

    customer = customer_document(data)

    result = await collection.insert_one(customer)

    customer["id"] = str(result.inserted_id)

    del customer["_id"]

    return customer


async def get_customers():

    customers = []

    async for customer in collection.find():

        customer["id"] = str(customer["_id"])

        del customer["_id"]

        customers.append(customer)

    return customers