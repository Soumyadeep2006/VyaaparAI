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
    """Build a compact business snapshot for the authenticated owner."""
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

    invoices = []

    cursor = db.invoices.find(
        {
            "owner_email": user_email,
        }
    ).sort("created_at", -1)

    async for invoice in cursor:
        invoices.append(invoice)

    products = []

    product_cursor = db.products.find(
        {
            "owner_email": user_email,
        }
    )

    async for product in product_cursor:
        products.append(product)

    customers = []

    customer_cursor = db.customers.find(
        {
            "owner_email": user_email,
        }
    )

    async for customer in customer_cursor:
        customers.append(customer)

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
        sum(float(invoice.get("total", 0) or 0) for invoice in today_invoices),
        2,
    )

    month_revenue = round(
        sum(float(invoice.get("total", 0) or 0) for invoice in month_invoices),
        2,
    )

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

    outstanding = round(
        sum(
            float(customer.get("outstanding", 0) or 0)
            for customer in customers
        ),
        2,
    )

    low_stock_products = [
        {
            "name": product.get("name", ""),
            "quantity": int(product.get("quantity", 0) or 0),
            "price": float(product.get("price", 0) or 0),
        }
        for product in products
        if int(product.get("quantity", 0) or 0) < 10
    ]

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

    return _serialize_for_ai(
        {
            "current_time_utc": now,
            "today_sales": today_sales,
            "today_invoice_count": len(today_invoices),
            "month_revenue": month_revenue,
            "month_invoice_count": len(month_invoices),
            "total_invoice_count": len(invoices),
            "paid_invoice_count": len(paid_invoices),
            "pending_invoice_count": len(pending_invoices),
            "cancelled_invoice_count": len(cancelled_invoices),
            "customer_count": len(customers),
            "product_count": len(products),
            "outstanding_customer_amount": outstanding,
            "low_stock_products": low_stock_products,
            "top_customers": top_customers,
            "recent_invoices": recent_invoices,
        }
    )



def _clean_ai_response(text: str) -> str:
    """Remove common Markdown markers for the existing plain-text chat UI."""
    import re

    text = str(text or "").replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"```(?:\w+)?\s*", "", text)
    text = text.replace("```", "")

    cleaned_lines = []
    for line in text.split("\n"):
        stripped = line.lstrip()

        if stripped.startswith(("* ", "- ", "+ ")):
            indent = line[: len(line) - len(stripped)]
            line = f"{indent}• {stripped[2:]}"

        line = re.sub(r"^\s*#{1,6}\s+", "", line)
        line = line.replace("**", "").replace("__", "")
        line = re.sub(r"(?<!\w)\*([^*\n]+)\*(?!\w)", r"\1", line)
        line = re.sub(r"(?<!\w)_([^_\n]+)_(?!\w)", r"\1", line)

        cleaned_lines.append(line)

    return "\n".join(cleaned_lines).strip()


async def ask_ai(prompt: str, user_email: str):
    business_context = await _build_business_context(user_email)

    system_instruction = """
You are VyaaparAI, the business assistant inside a small-business
management application.

You are answering questions using the authenticated user's VyaaparAI
business data supplied below.

IMPORTANT RULES:
1. Treat the supplied business context as the source of truth for business
   figures.
2. Never claim that you cannot access the user's VyaaparAI business data
   when the requested information is present in the context.
3. Do not invent sales, revenue, customers, products, invoices, or amounts.
4. If the requested information is not present in the context, clearly say
   that the available business data is insufficient to answer precisely.
5. For questions about "today", use the provided today_sales and
   today_invoice_count values.
6. For monthly revenue questions, use month_revenue and month_invoice_count.
7. For low-stock questions, use the provided low_stock_products list.
8. For customer questions, use top_customers and outstanding_customer_amount
   where appropriate.
9. Keep answers concise, practical, and business-friendly.
10. Currency amounts are in Indian Rupees (INR) unless the user specifies
    otherwise.
11. Return answers as clean plain text for the existing chat UI.
12. Do not use Markdown formatting such as **bold**, __emphasis__, # headings,
    Markdown tables, fenced code blocks, or Markdown bullet markers.
    Use normal sentences and simple line breaks.
13. Never reveal internal implementation details, authentication data,
    database identifiers, secrets, API keys, tokens, or credentials.

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
        "response": _clean_ai_response(response.text),
    }
