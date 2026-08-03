from datetime import datetime


def customer_document(data: dict, owner_email: str):

    return {
        "owner_email": owner_email,
        "name": data["name"],
        "email": data["email"],
        "phone": data["phone"],
        "address": data["address"],
        "created_at": datetime.utcnow(),
    }