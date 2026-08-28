from collections import defaultdict
from datetime import datetime, timezone

from app.database import db


def safe_float(value) -> float:
    try:
        return float(value or 0)
    except (TypeError, ValueError):
        return 0.0


def get_status(invoice: dict) -> str:
    return str(invoice.get("status", "Pending")).strip().lower()


def invoice_date(invoice: dict):
    value = invoice.get("created_at") or invoice.get("date")
    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            return None
    return value


async def sales_report(user_email: str):
    total_sales = 0.0
    valid_orders = paid_orders = pending_orders = cancelled_orders = 0

    async for invoice in db.invoices.find({"owner_email": user_email}):
        status = get_status(invoice)
        if status == "cancelled":
            cancelled_orders += 1
            continue
        valid_orders += 1
        total_sales += safe_float(invoice.get("total"))
        if status == "paid":
            paid_orders += 1
        elif status == "pending":
            pending_orders += 1

    return {
        "total_orders": valid_orders,
        "total_sales": round(total_sales, 2),
        "paid_orders": paid_orders,
        "pending_orders": pending_orders,
        "cancelled_orders": cancelled_orders,
        "average_order_value": round(total_sales / valid_orders, 2) if valid_orders else 0.0,
    }


async def daily_sales(user_email: str):
    today = datetime.now(timezone.utc).date()
    total = orders = 0
    async for invoice in db.invoices.find({"owner_email": user_email}):
        if get_status(invoice) == "cancelled":
            continue
        created_at = invoice_date(invoice)
        if not created_at:
            continue
        if created_at.date() != today:
            continue
        total += safe_float(invoice.get("total"))
        orders += 1
    return {"date": str(today), "orders": orders, "sales": round(total, 2)}


async def monthly_sales(user_email: str):
    now = datetime.now(timezone.utc)
    total = orders = 0
    async for invoice in db.invoices.find({"owner_email": user_email}):
        if get_status(invoice) == "cancelled":
            continue
        created_at = invoice_date(invoice)
        if not created_at or created_at.month != now.month or created_at.year != now.year:
            continue
        total += safe_float(invoice.get("total"))
        orders += 1
    return {"month": now.strftime("%B %Y"), "orders": orders, "sales": round(total, 2)}


async def monthly_revenue(user_email: str):
    now = datetime.now(timezone.utc)
    months = []
    for offset in range(11, -1, -1):
        total_month = now.month - offset
        year = now.year + (total_month - 1) // 12
        month = (total_month - 1) % 12 + 1
        months.append({
            "year": year,
            "month": month,
            "label": datetime(year, month, 1).strftime("%b %Y"),
            "revenue": 0.0,
            "orders": 0,
        })

    lookup = {(item["year"], item["month"]): item for item in months}
    async for invoice in db.invoices.find({"owner_email": user_email}):
        if get_status(invoice) == "cancelled":
            continue
        created_at = invoice_date(invoice)
        if not created_at:
            continue
        item = lookup.get((created_at.year, created_at.month))
        if item:
            item["revenue"] += safe_float(invoice.get("total"))
            item["orders"] += 1

    return [{"month": item["label"], "revenue": round(item["revenue"], 2), "orders": item["orders"]} for item in months]


async def product_analytics(user_email: str):
    products = defaultdict(lambda: {"quantity": 0, "sales": 0.0})
    async for invoice in db.invoices.find({"owner_email": user_email}):
        if get_status(invoice) == "cancelled":
            continue
        for item in invoice.get("items", []):
            name = str(item.get("product") or item.get("product_name") or "Unknown Product")
            quantity = int(item.get("quantity", 0) or 0)
            price = safe_float(item.get("price"))
            products[name]["quantity"] += quantity
            products[name]["sales"] += quantity * price

    result = [{"product": name, "quantity": data["quantity"], "sales": round(data["sales"], 2)} for name, data in products.items()]
    return sorted(result, key=lambda item: item["sales"], reverse=True)


async def category_analytics(user_email: str):
    categories = defaultdict(float)
    product_categories = {}
    async for product in db.products.find({"owner_email": user_email}):
        product_categories[str(product.get("name", ""))] = str(product.get("category") or "Other")

    async for invoice in db.invoices.find({"owner_email": user_email}):
        if get_status(invoice) == "cancelled":
            continue
        for item in invoice.get("items", []):
            name = str(item.get("product") or item.get("product_name") or "")
            category = str(item.get("category") or product_categories.get(name) or "Other")
            categories[category] += int(item.get("quantity", 0) or 0) * safe_float(item.get("price"))

    return [{"name": name, "value": round(value, 2)} for name, value in sorted(categories.items(), key=lambda x: x[1], reverse=True)]


async def recent_transactions(user_email: str):
    transactions = []
    cursor = db.invoices.find({"owner_email": user_email}).sort("created_at", -1).limit(10)
    async for invoice in cursor:
        transactions.append({
            "id": str(invoice["_id"]),
            "customer": invoice.get("customer", "Unknown Customer"),
            "total": safe_float(invoice.get("total")),
            "status": invoice.get("status", "Pending"),
            "created_at": invoice_date(invoice).isoformat() if invoice_date(invoice) else None,
        })
    return transactions
