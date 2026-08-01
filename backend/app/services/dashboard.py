from app.database import db

product_collection = db.products
customer_collection = db.customers
supplier_collection = db.suppliers
bill_collection = db.bills


async def dashboard_stats():

    total_products = await product_collection.count_documents({})

    total_customers = await customer_collection.count_documents({})

    total_suppliers = await supplier_collection.count_documents({})

    total_bills = await bill_collection.count_documents({})

    revenue = 0

    async for bill in bill_collection.find():

        revenue += bill.get("total", 0)

    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_suppliers": total_suppliers,
        "total_bills": total_bills,
        "total_revenue": revenue,
    }