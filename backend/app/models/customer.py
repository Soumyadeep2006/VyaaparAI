from datetime import datetime


def customer_document(data: dict, owner_email: str):
    return {
        "owner_email": owner_email,
        "name": data["name"],
        "email": data.get("email"),
        "phone": data["phone"],
        "address": data.get("address"),
        "totalPurchase": float(data.get("totalPurchase", 0) or 0),
        "outstanding": float(data.get("outstanding", 0) or 0),
        "paymentStatus": data.get("paymentStatus", "paid"),
        "created_at": datetime.utcnow(),
    }
