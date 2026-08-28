from app.database import db


async def dashboard_stats(user_email: str):
    owner = {"owner_email": user_email}

    total_products = await db.products.count_documents(owner)
    total_customers = await db.customers.count_documents(owner)
    total_suppliers = await db.suppliers.count_documents(owner)

    total_invoices = 0
    revenue = 0.0

    async for invoice in db.invoices.find(owner):
        if str(invoice.get("status", "Pending")).strip().lower() == "cancelled":
            continue
        total_invoices += 1
        revenue += float(invoice.get("total", 0) or 0)

    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_suppliers": total_suppliers,
        "total_bills": total_invoices,
        "total_revenue": round(revenue, 2),
    }
