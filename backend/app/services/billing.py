from datetime import datetime, timezone

from bson import ObjectId
from fastapi import HTTPException

from app.database import db


ACTIVE_STATUSES = {"Pending", "Paid"}


def serialize_invoice(invoice):
    invoice["id"] = str(invoice.pop("_id"))
    return invoice


def _object_id(value: str, label: str):
    if not ObjectId.is_valid(value):
        raise HTTPException(status_code=400, detail=f"Invalid {label} ID")
    return ObjectId(value)


async def _get_customer(customer_id: str, user_email: str):
    return await db.customers.find_one({"_id": _object_id(customer_id, "customer"), "owner_email": user_email})


async def _get_product(product_id: str, user_email: str):
    return await db.products.find_one({"_id": _object_id(product_id, "product"), "owner_email": user_email})


async def _validate_items(items, user_email: str):
    validated = []
    for item in items:
        product_id = item.get("product_id")
        if not product_id:
            raise HTTPException(status_code=422, detail="Each invoice item must have a product_id")
        product = await _get_product(product_id, user_email)
        if not product:
            raise HTTPException(status_code=404, detail=f"Product not found: {item.get('product', product_id)}")
        quantity = int(item["quantity"])
        stock = int(product.get("quantity", 0) or 0)
        if stock < quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.get('name', item.get('product', 'product'))}. Available: {stock}")
        price = float(product.get("price", 0) or 0)
        validated.append({
            "product_id": product_id,
            "product": product.get("name", item.get("product", "")),
            "quantity": quantity,
            "price": price,
        })
    return validated


async def _apply_sale(invoice, user_email: str):
    if invoice.get("status") not in ACTIVE_STATUSES:
        return

    # Decrease stock with a conditional update to avoid selling more than is available.
    changed = []
    try:
        for item in invoice.get("items", []):
            result = await db.products.update_one(
                {
                    "_id": _object_id(item["product_id"], "product"),
                    "owner_email": user_email,
                    "quantity": {"$gte": int(item["quantity"])},
                },
                {"$inc": {"quantity": -int(item["quantity"])}},
            )
            if result.modified_count != 1:
                raise HTTPException(status_code=400, detail=f"Insufficient stock for {item.get('product', 'product')}")
            changed.append(item)

        customer_id = invoice.get("customer_id")
        if customer_id:
            amount = float(invoice.get("total", 0) or 0)
            inc = {"totalPurchase": amount}
            if invoice.get("status") == "Pending":
                inc["outstanding"] = amount
            await db.customers.update_one(
                {"_id": _object_id(customer_id, "customer"), "owner_email": user_email},
                {"$inc": inc},
            )
            await _refresh_customer_status(customer_id, user_email)
    except Exception:
        for item in changed:
            await db.products.update_one(
                {"_id": _object_id(item["product_id"], "product"), "owner_email": user_email},
                {"$inc": {"quantity": int(item["quantity"])}},
            )
        raise


async def _reverse_sale(invoice, user_email: str):
    if invoice.get("status") not in ACTIVE_STATUSES:
        return

    for item in invoice.get("items", []):
        await db.products.update_one(
            {"_id": _object_id(item["product_id"], "product"), "owner_email": user_email},
            {"$inc": {"quantity": int(item["quantity"])}},
        )

    customer_id = invoice.get("customer_id")
    if customer_id:
        amount = float(invoice.get("total", 0) or 0)
        inc = {"totalPurchase": -amount}
        if invoice.get("status") == "Pending":
            inc["outstanding"] = -amount
        await db.customers.update_one(
            {"_id": _object_id(customer_id, "customer"), "owner_email": user_email},
            {"$inc": inc},
        )
        await _refresh_customer_status(customer_id, user_email)


async def _refresh_customer_status(customer_id: str, user_email: str):
    customer = await db.customers.find_one({"_id": _object_id(customer_id, "customer"), "owner_email": user_email})
    if not customer:
        return
    outstanding = max(0.0, float(customer.get("outstanding", 0) or 0))
    await db.customers.update_one(
        {"_id": customer["_id"], "owner_email": user_email},
        {"$set": {"outstanding": outstanding, "paymentStatus": "pending" if outstanding > 0 else "paid"}},
    )


async def get_invoices(user_email: str):
    invoices = []
    cursor = db.invoices.find({"owner_email": user_email}).sort("created_at", -1)
    async for invoice in cursor:
        invoices.append(serialize_invoice(invoice))
    return invoices


async def create_invoice(data: dict, user_email: str):
    customer_id = data.get("customer_id")
    if not customer_id:
        raise HTTPException(status_code=422, detail="customer_id is required")

    customer = await _get_customer(customer_id, user_email)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    items = await _validate_items(data.get("items", []), user_email)
    total = round(sum(item["quantity"] * item["price"] for item in items), 2)
    status = data.get("status", "Paid")
    now = datetime.now(timezone.utc)

    invoice = {
        "customer_id": customer_id,
        "customer": customer.get("name", data.get("customer", "")),
        "items": items,
        "total": total,
        "status": status,
        "payment_method": data.get("payment_method", "Cash"),
        "owner_email": user_email,
        "created_at": now,
        "updated_at": now,
    }

    result = await db.invoices.insert_one(invoice)
    invoice["_id"] = result.inserted_id

    try:
        await _apply_sale(invoice, user_email)
    except Exception:
        await db.invoices.delete_one({"_id": result.inserted_id, "owner_email": user_email})
        raise

    return serialize_invoice(invoice)


async def update_invoice(invoice_id: str, data: dict, user_email: str):
    # Existing UI currently updates invoice status only. Keep item/customer data immutable here
    # so stock and customer balances cannot become inconsistent.
    return await update_invoice_status(invoice_id, data.get("status", "Pending"), user_email)


async def delete_invoice(invoice_id: str, user_email: str):
    object_id = _object_id(invoice_id, "invoice")
    invoice = await db.invoices.find_one({"_id": object_id, "owner_email": user_email})
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    await _reverse_sale(invoice, user_email)
    result = await db.invoices.delete_one({"_id": object_id, "owner_email": user_email})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return {"message": "Invoice deleted successfully"}


async def update_invoice_status(invoice_id: str, status: str, user_email: str):
    if status not in {"Pending", "Paid", "Cancelled"}:
        raise HTTPException(status_code=422, detail="Invalid status. Use Pending, Paid or Cancelled.")

    object_id = _object_id(invoice_id, "invoice")
    invoice = await db.invoices.find_one({"_id": object_id, "owner_email": user_email})
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    old_status = invoice.get("status", "Pending")
    if old_status == status:
        return serialize_invoice(invoice)

    if old_status in ACTIVE_STATUSES and status == "Cancelled":
        await _reverse_sale(invoice, user_email)
    elif old_status == "Cancelled" and status in ACTIVE_STATUSES:
        new_invoice = {**invoice, "status": status}
        await _apply_sale(new_invoice, user_email)
    elif old_status == "Pending" and status == "Paid":
        customer_id = invoice.get("customer_id")
        if customer_id:
            amount = float(invoice.get("total", 0) or 0)
            await db.customers.update_one(
                {"_id": _object_id(customer_id, "customer"), "owner_email": user_email},
                {"$inc": {"outstanding": -amount}},
            )
            await _refresh_customer_status(customer_id, user_email)
    elif old_status == "Paid" and status == "Pending":
        customer_id = invoice.get("customer_id")
        if customer_id:
            amount = float(invoice.get("total", 0) or 0)
            await db.customers.update_one(
                {"_id": _object_id(customer_id, "customer"), "owner_email": user_email},
                {"$inc": {"outstanding": amount}},
            )
            await _refresh_customer_status(customer_id, user_email)

    await db.invoices.update_one(
        {"_id": object_id, "owner_email": user_email},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc)}},
    )

    updated = await db.invoices.find_one({"_id": object_id, "owner_email": user_email})
    return serialize_invoice(updated)
