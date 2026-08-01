from datetime import datetime

from app.database import db

bill_collection = db.bills


async def sales_report():

    total_sales = 0
    total_orders = 0

    async for bill in bill_collection.find():

        total_orders += 1
        total_sales += bill.get("total", 0)

    return {
        "total_orders": total_orders,
        "total_sales": total_sales,
    }


async def daily_sales():

    today = datetime.utcnow().date()

    total = 0
    orders = 0

    async for bill in bill_collection.find():

        if bill["created_at"].date() == today:

            total += bill.get("total", 0)
            orders += 1

    return {
        "date": str(today),
        "orders": orders,
        "sales": total,
    }


async def monthly_sales():

    now = datetime.utcnow()

    total = 0
    orders = 0

    async for bill in bill_collection.find():

        if (
            bill["created_at"].month == now.month
            and bill["created_at"].year == now.year
        ):

            total += bill.get("total", 0)
            orders += 1

    return {
        "month": now.strftime("%B %Y"),
        "orders": orders,
        "sales": total,
    }