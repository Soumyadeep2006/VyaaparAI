from datetime import datetime


def supplier_document(data: dict):

    return {
        "name": data["name"],
        "company": data["company"],
        "email": data["email"],
        "phone": data["phone"],
        "address": data["address"],
        "created_at": datetime.utcnow(),
    }