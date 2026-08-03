from datetime import datetime


def supplier_document(data: dict, owner_email: str):

    return {
        "owner_email": owner_email,
        "name": data["name"],
        "company": data["company"],
        "email": data["email"],
        "phone": data["phone"],
        "address": data["address"],
        "created_at": datetime.utcnow(),
    }