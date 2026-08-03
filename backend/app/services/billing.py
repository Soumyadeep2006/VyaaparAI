from datetime import datetime, timezone

from bson import ObjectId

from app.database import db


def serialize_invoice(invoice):
    invoice["id"] = str(invoice.pop("_id"))
    return invoice


async def get_invoices(user_email: str):
    invoices = []

    cursor = db.invoices.find(
        {"owner_email": user_email}
    ).sort("created_at", -1)

    async for invoice in cursor:
        invoices.append(
            serialize_invoice(invoice)
        )

    return invoices


async def create_invoice(
    data: dict,
    user_email: str,
):
    now = datetime.now(timezone.utc)

    invoice = {
        **data,
        "owner_email": user_email,
        "status": data.get("status", "Pending"),
        "created_at": now,
        "updated_at": now,
    }

    result = await db.invoices.insert_one(invoice)

    created_invoice = await db.invoices.find_one(
        {
            "_id": result.inserted_id,
            "owner_email": user_email,
        }
    )

    if not created_invoice:
        return {
            "error": "Invoice could not be created"
        }

    return serialize_invoice(created_invoice)


async def update_invoice(
    invoice_id: str,
    data: dict,
    user_email: str,
):
    if not ObjectId.is_valid(invoice_id):
        return {
            "error": "Invalid invoice ID"
        }

    object_id = ObjectId(invoice_id)

    data["updated_at"] = datetime.now(timezone.utc)

    result = await db.invoices.update_one(
        {
            "_id": object_id,
            "owner_email": user_email,
        },
        {
            "$set": data
        },
    )

    if result.matched_count == 0:
        return {
            "error": "Invoice not found"
        }

    invoice = await db.invoices.find_one(
        {
            "_id": object_id,
            "owner_email": user_email,
        }
    )

    if not invoice:
        return {
            "error": "Invoice not found"
        }

    return serialize_invoice(invoice)


async def delete_invoice(
    invoice_id: str,
    user_email: str,
):
    if not ObjectId.is_valid(invoice_id):
        return {
            "error": "Invalid invoice ID"
        }

    object_id = ObjectId(invoice_id)

    result = await db.invoices.delete_one(
        {
            "_id": object_id,
            "owner_email": user_email,
        }
    )

    if result.deleted_count == 0:
        return {
            "error": "Invoice not found"
        }

    return {
        "message": "Invoice deleted successfully"
    }


async def update_invoice_status(
    invoice_id: str,
    status: str,
    user_email: str,
):
    if not ObjectId.is_valid(invoice_id):
        return {
            "error": "Invalid invoice ID"
        }

    allowed_statuses = {
        "Pending",
        "Paid",
        "Cancelled",
    }

    if status not in allowed_statuses:
        return {
            "error": (
                "Invalid status. "
                "Use Pending, Paid or Cancelled."
            )
        }

    object_id = ObjectId(invoice_id)

    result = await db.invoices.update_one(
        {
            "_id": object_id,
            "owner_email": user_email,
        },
        {
            "$set": {
                "status": status,
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )

    if result.matched_count == 0:
        return {
            "error": "Invoice not found"
        }

    invoice = await db.invoices.find_one(
        {
            "_id": object_id,
            "owner_email": user_email,
        }
    )

    if not invoice:
        return {
            "error": "Invoice not found"
        }

    return serialize_invoice(invoice)