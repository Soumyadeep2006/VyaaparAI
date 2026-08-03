from app.database import db
from app.models.supplier import supplier_document

collection = db.suppliers


async def create_supplier(
    data: dict,
    user_email: str,
):
    supplier = supplier_document(
        data,
        user_email,
    )

    result = await collection.insert_one(supplier)

    supplier["id"] = str(result.inserted_id)
    del supplier["_id"]

    return supplier


async def get_suppliers(
    user_email: str,
):
    suppliers = []

    cursor = collection.find({
        "owner_email": user_email
    })

    async for supplier in cursor:
        supplier["id"] = str(supplier["_id"])
        del supplier["_id"]
        suppliers.append(supplier)

    return suppliers