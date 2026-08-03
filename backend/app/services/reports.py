from datetime import datetime

from app.database import db


async def sales_report(
    user_email: str,
):
    total_sales = 0
    total_orders = 0

    async for invoice in db.invoices.find(
        {"owner_email": user_email}
    ):
        total_orders += 1
        total_sales += float(
            invoice.get("total", 0)
        )

    return {
        "total_orders": total_orders,
        "total_sales": total_sales,
    }


async def daily_sales(
    user_email: str,
):
    today = datetime.utcnow().date()

    total = 0
    orders = 0

    async for invoice in db.invoices.find(
        {"owner_email": user_email}
    ):
        created_at = invoice.get("created_at")

        if not created_at:
            continue

        if created_at.date() == today:
            total += float(
                invoice.get("total", 0)
            )
            orders += 1

    return {
        "date": str(today),
        "orders": orders,
        "sales": total,
    }


async def monthly_sales(
    user_email: str,
):
    now = datetime.utcnow()

    total = 0
    orders = 0

    async for invoice in db.invoices.find(
        {"owner_email": user_email}
    ):
        created_at = invoice.get("created_at")

        if not created_at:
            continue

        if (
            created_at.month == now.month
            and created_at.year == now.year
        ):
            total += float(
                invoice.get("total", 0)
            )
            orders += 1

    return {
        "month": now.strftime("%B %Y"),
        "orders": orders,
        "sales": total,
    }