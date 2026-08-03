from datetime import datetime


def bill_document(
    customer_id,
    items,
    total,
    owner_email: str,
):

    return {
        "owner_email": owner_email,
        "customer_id": customer_id,
        "items": items,
        "total": total,
        "created_at": datetime.utcnow(),
    }