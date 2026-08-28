from bson import ObjectId

from app.database import db
from app.models.supplier import supplier_document


collection = db.suppliers


def format_supplier(supplier: dict):
    supplier["id"] = str(supplier["_id"])
    del supplier["_id"]

    supplier["totalPurchase"] = float(
        supplier.get("totalPurchase", 0) or 0
    )

    supplier["pendingPayment"] = float(
        supplier.get("pendingPayment", 0) or 0
    )

    supplier["paymentStatus"] = supplier.get(
        "paymentStatus",
        "paid"
        if supplier["pendingPayment"] == 0
        else "pending"
    )

    supplier["company"] = supplier.get(
        "company",
        ""
    )

    return supplier


async def create_supplier(
    data: dict,
    user_email: str,
):
    supplier = supplier_document(
        data,
        user_email,
    )

    result = await collection.insert_one(
        supplier
    )

    supplier["id"] = str(
        result.inserted_id
    )

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
        suppliers.append(
            format_supplier(supplier)
        )

    return suppliers


async def update_supplier(
    supplier_id: str,
    data: dict,
    user_email: str,
):
    if not ObjectId.is_valid(supplier_id):
        return None

    clean_data = {
        key: value
        for key, value in data.items()
        if value is not None
    }

    result = await collection.update_one(
        {
            "_id": ObjectId(supplier_id),
            "owner_email": user_email,
        },
        {
            "$set": clean_data
        },
    )

    if result.matched_count == 0:
        return None

    supplier = await collection.find_one({
        "_id": ObjectId(supplier_id),
        "owner_email": user_email,
    })

    if not supplier:
        return None

    return format_supplier(supplier)


async def delete_supplier(
    supplier_id: str,
    user_email: str,
):
    if not ObjectId.is_valid(supplier_id):
        return 0

    result = await collection.delete_one({
        "_id": ObjectId(supplier_id),
        "owner_email": user_email,
    })

    return result.deleted_count