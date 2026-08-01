from fastapi import APIRouter
from app.database import db
from datetime import datetime

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


# =========================
# Dashboard Summary
# =========================
@router.get("/")
async def get_dashboard():

    total_products = await db.products.count_documents({})
    total_customers = await db.customers.count_documents({})
    total_invoices = await db.invoices.count_documents({})

    revenue = 0

    async for invoice in db.invoices.find():
        revenue += float(invoice.get("total", 0))

    return {
        "revenue": revenue,
        "orders": total_invoices,
        "customers": total_customers,
        "products": total_products,
    }


# =========================
# Revenue Chart
# =========================
@router.get("/revenue")
async def get_revenue_chart():

    months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]

    revenue = {
        month: 0
        for month in months
    }

    async for invoice in db.invoices.find():

        date_value = (
            invoice.get("created_at")
            or invoice.get("date")
        )

        if not date_value:
            continue

        try:
            if isinstance(date_value, str):
                date_value = datetime.fromisoformat(
                    date_value.replace("Z", "+00:00")
                )

            month_name = date_value.strftime("%b")

            revenue[month_name] += float(
                invoice.get("total", 0)
            )

        except (ValueError, TypeError):
            continue

    return [
        {
            "month": month,
            "revenue": revenue[month],
        }
        for month in months
    ]