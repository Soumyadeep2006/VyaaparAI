from datetime import datetime


def supplier_document(data: dict, owner_email: str):
    return {
        "owner_email": owner_email,

        "name": data.get("name", ""),
        "company": data.get("company", ""),
        "email": data.get("email", ""),
        "phone": data.get("phone", ""),
        "address": data.get("address", ""),

        "totalPurchase": float(
            data.get("totalPurchase", 0) or 0
        ),

        "pendingPayment": float(
            data.get("pendingPayment", 0) or 0
        ),

        "paymentStatus": data.get(
            "paymentStatus",
            "paid"
        ),

        "created_at": datetime.utcnow(),
    }