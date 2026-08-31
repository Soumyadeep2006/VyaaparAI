from datetime import datetime, timezone

from google import genai

from app.config import settings
from app.database import db


client = genai.Client(api_key=settings.GEMINI_API_KEY)


def _as_utc(value):
    """Normalize MongoDB/Python datetimes to timezone-aware UTC datetimes."""
    if not isinstance(value, datetime):
        return None

    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)

    return value.astimezone(timezone.utc)


def _serialize_for_ai(value):
    """Convert MongoDB/Python values into JSON-friendly AI context values."""
    if isinstance(value, datetime):
        return value.isoformat()

    if isinstance(value, dict):
        return {
            str(key): _serialize_for_ai(item)
            for key, item in value.items()
            if key != "_id"
        }

    if isinstance(value, list):
        return [_serialize_for_ai(item) for item in value]

    return value


async def _build_business_context(user_email: str) -> dict:
    """Build a business snapshot for the authenticated owner."""

    now = datetime.now(timezone.utc)

    start_of_day = now.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
    )

    start_of_month = now.replace(
        day=1,
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
    )

    # ============================================================
    # INVOICES
    # ============================================================

    invoices = []

    cursor = db.invoices.find(
        {
            "owner_email": user_email,
        }
    ).sort("created_at", -1)

    async for invoice in cursor:
        invoices.append(invoice)

    # ============================================================
    # PRODUCTS
    # ============================================================

    products = []

    product_cursor = db.products.find(
        {
            "owner_email": user_email,
        }
    )

    async for product in product_cursor:
        products.append(product)

    # ============================================================
    # CUSTOMERS
    # ============================================================

    customers = []

    customer_cursor = db.customers.find(
        {
            "owner_email": user_email,
        }
    )

    async for customer in customer_cursor:
        customers.append(customer)

    # ============================================================
    # SALES CALCULATIONS
    # ============================================================

    active_statuses = {"Pending", "Paid"}

    today_invoices = []
    month_invoices = []

    for invoice in invoices:
        created_at = _as_utc(invoice.get("created_at"))

        if not created_at:
            continue

        if (
            created_at >= start_of_day
            and invoice.get("status") in active_statuses
        ):
            today_invoices.append(invoice)

        if (
            created_at >= start_of_month
            and invoice.get("status") in active_statuses
        ):
            month_invoices.append(invoice)

    today_sales = round(
        sum(
            float(invoice.get("total", 0) or 0)
            for invoice in today_invoices
        ),
        2,
    )

    month_revenue = round(
        sum(
            float(invoice.get("total", 0) or 0)
            for invoice in month_invoices
        ),
        2,
    )

    # ============================================================
    # INVOICE STATUS
    # ============================================================

    pending_invoices = [
        invoice
        for invoice in invoices
        if invoice.get("status") == "Pending"
    ]

    paid_invoices = [
        invoice
        for invoice in invoices
        if invoice.get("status") == "Paid"
    ]

    cancelled_invoices = [
        invoice
        for invoice in invoices
        if invoice.get("status") == "Cancelled"
    ]

    # ============================================================
    # CUSTOMER OUTSTANDING
    # ============================================================

    outstanding = round(
        sum(
            float(customer.get("outstanding", 0) or 0)
            for customer in customers
        ),
        2,
    )

    # ============================================================
    # LOW STOCK
    # ============================================================

    low_stock_products = [
        {
            "name": product.get("name", ""),
            "quantity": int(product.get("quantity", 0) or 0),
            "price": float(product.get("price", 0) or 0),
        }
        for product in products
        if int(product.get("quantity", 0) or 0) < 10
    ]

    # ============================================================
    # COMPLETE CUSTOMER DATA
    #
    # IMPORTANT:
    # Keep every available customer field.
    # _serialize_for_ai() removes only MongoDB _id.
    # ============================================================

    customer_details = [
        _serialize_for_ai(customer)
        for customer in customers
    ]

    # ============================================================
    # TOP CUSTOMERS
    # ============================================================

    customer_summary = [
        {
            "name": customer.get("name", ""),
            "totalPurchase": float(
                customer.get("totalPurchase", 0) or 0
            ),
            "outstanding": float(
                customer.get("outstanding", 0) or 0
            ),
            "paymentStatus": customer.get(
                "paymentStatus",
                "paid",
            ),
        }
        for customer in customers
    ]

    top_customers = sorted(
        customer_summary,
        key=lambda customer: customer["totalPurchase"],
        reverse=True,
    )[:10]

    # ============================================================
    # RECENT INVOICES
    # ============================================================

    recent_invoices = [
        {
            "customer": invoice.get("customer", ""),
            "total": float(invoice.get("total", 0) or 0),
            "status": invoice.get("status", ""),
            "payment_method": invoice.get("payment_method", ""),
            "created_at": invoice.get("created_at"),
        }
        for invoice in invoices[:10]
    ]

    # ============================================================
    # FINAL BUSINESS CONTEXT
    # ============================================================

    return _serialize_for_ai(
        {
            "current_time_utc": now,

            # Sales
            "today_sales": today_sales,
            "today_invoice_count": len(today_invoices),
            "month_revenue": month_revenue,
            "month_invoice_count": len(month_invoices),

            # Invoice statistics
            "total_invoice_count": len(invoices),
            "paid_invoice_count": len(paid_invoices),
            "pending_invoice_count": len(pending_invoices),
            "cancelled_invoice_count": len(cancelled_invoices),

            # Business counts
            "customer_count": len(customers),
            "product_count": len(products),

            # Customer financial summary
            "outstanding_customer_amount": outstanding,

            # Products
            "low_stock_products": low_stock_products,

            # Customer ranking
            "top_customers": top_customers,

            # COMPLETE CUSTOMER RECORDS
            "customer_details": customer_details,

            # Recent invoices
            "recent_invoices": recent_invoices,
        }
    )


async def ask_ai(prompt: str, user_email: str):
    business_context = await _build_business_context(user_email)

    system_instruction = """
You are VyaaparAI, the business assistant inside a small-business
management application.

You are answering questions using the authenticated user's VyaaparAI
business data supplied below.

IMPORTANT RULES:

1. Treat the supplied business context as the source of truth for business
   figures and customer information.

2. Never claim that you cannot access the user's VyaaparAI business data
   when the requested information is present in the context.

3. Do not invent sales, revenue, customers, products, invoices, names,
   phone numbers, email addresses, addresses, amounts, or payment details.

4. If the requested information is not present in the context, clearly say
   that the available business data is insufficient to answer precisely.

5. For questions about "today", use the provided today_sales and
   today_invoice_count values.

6. For monthly revenue questions, use month_revenue and
   month_invoice_count.

7. For low-stock questions, use the provided low_stock_products list.

8. For general customer questions, use customer_details.

9. customer_details contains the COMPLETE AVAILABLE CUSTOMER RECORDS
   from the authenticated user's business database.

10. When the user asks for "all customer details", "customer details",
    "show customers", or similar requests, use customer_details and
    present the available fields clearly.

11. When the user asks about a specific customer by name, search
    customer_details for the matching customer and show that customer's
    available information.

12. Do not limit customer answers to top_customers when the user asks for
    complete customer information.

13. If multiple customers have similar names, clearly distinguish them
    using the available information.

14. Keep answers concise, practical, readable, and business-friendly.

15. Currency amounts are in Indian Rupees (INR) unless the user specifies
    otherwise.

16. Never reveal internal implementation details, authentication data,
    database identifiers, secrets, API keys, tokens, or credentials.

17. Never reveal the MongoDB _id field even if it exists internally.

18. Never expose the authenticated user's owner_email or internal
    implementation information.

19. Format customer information clearly. For example:

    Customer Details

    Name: ...
    Phone: ...
    Email: ...
    Address: ...
    Total Purchase: ₹...
    Outstanding: ₹...
    Payment Status: ...

    Only show fields that actually exist in the supplied customer record.

20. Never invent a missing customer field. If a field is not available,
    simply do not display it.

BUSINESS CONTEXT:
"""

    contents = f"""
{system_instruction}

{business_context}

USER QUESTION:
{prompt}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=contents,
    )

    return {
        "response": response.text,
    }
