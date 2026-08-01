from bson.objectid import ObjectId

from app.database import db
from app.models.supplier import supplier_document

collection = db.suppliers


async def create_supplier(data: dict):

    supplier = supplier_document(data)

    result = await collection.insert_one(supplier)

    supplier["id"] = str(result.inserted_id)

    del supplier["_id"]

    return supplier


async def get_suppliers():

    suppliers = []

    async for supplier in collection.find():

        supplier["id"] = str(supplier["_id"])

        del supplier["_id"]

        suppliers.append(supplier)

    return suppliers