from app.database import db


async def dashboard_stats(
    user_email: str,
):
    owner = {
        "owner_email": user_email
    }

    total_products = await db.products.count_documents(owner)
    total_customers = await db.customers.count_documents(owner)
    total_suppliers = await db.suppliers.count_documents(owner)
    total_invoices = await db.invoices.count_documents(owner)

    revenue = 0

    async for invoice in db.invoices.find(owner):
        revenue += float(
            invoice.get("total", 0)
        )

    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_suppliers": total_suppliers,
        "total_bills": total_invoices,
        "total_revenue": revenue,
    }