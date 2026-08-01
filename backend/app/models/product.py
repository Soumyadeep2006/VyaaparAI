from datetime import datetime


def product_document(data: dict):

    return {
        "name": data["name"],
        "category": data["category"],
        "price": data["price"],
        "quantity": data["quantity"],
        "created_at": datetime.utcnow(),
    }