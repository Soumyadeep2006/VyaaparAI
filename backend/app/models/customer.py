from datetime import datetime


def customer_document(data: dict):

    return {
        "name": data["name"],
        "email": data["email"],
        "phone": data["phone"],
        "address": data["address"],
        "created_at": datetime.utcnow(),
    }