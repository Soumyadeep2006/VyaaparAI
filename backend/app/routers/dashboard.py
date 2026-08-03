from datetime import datetime

from fastapi import APIRouter, Depends

from app.database import db
from app.utils.dependencies import get_current_user


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"],
)


@router.get("")
async def get_dashboard(
    current_user: str = Depends(get_current_user),
):
    owner = {
        "owner_email": current_user
    }

    total_products = await db.products.count_documents(owner)
    total_customers = await db.customers.count_documents(owner)
    total_invoices = await db.invoices.count_documents(owner)

    revenue = 0.0

    async for invoice in db.invoices.find(owner):
        revenue += float(invoice.get("total", 0))

    return {
        "revenue": revenue,
        "orders": total_invoices,
        "customers": total_customers,
        "products": total_products,
    }


@router.get("/revenue")
async def get_revenue_chart(
    current_user: str = Depends(get_current_user),
):
    months = [
        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec",
    ]

    revenue = {
        month: 0.0
        for month in months
    }

    async for invoice in db.invoices.find(
        {
            "owner_email": current_user
        }
    ):
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

            if month_name in revenue:
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