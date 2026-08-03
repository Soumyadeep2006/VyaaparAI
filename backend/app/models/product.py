from datetime import datetime


def product_document(data: dict, owner_email: str):

    return {
        "owner_email": owner_email,
        "name": data["name"],
        "category": data["category"],
        "price": data["price"],
        "quantity": data["quantity"],
        "created_at": datetime.utcnow(),
    }