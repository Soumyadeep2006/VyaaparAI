from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.schemas.invoice import InvoiceCreate

from app.services.billing import (
    get_invoices,
    create_invoice,
    update_invoice,
    delete_invoice,
    update_invoice_status,
)

from app.utils.dependencies import get_current_user
from app.services.payment import (
    create_order as create_razorpay_order,
    verify_signature,
    fetch_payment,
    capture_payment,
)
from app.database import db


router = APIRouter(
    prefix="/api/billing",
    tags=["Billing"],
)


@router.get("/")
async def all_invoices(
    current_user: str = Depends(get_current_user),
):
    return await get_invoices(
        current_user
    )


@router.post("/")
async def add_invoice(
    invoice: InvoiceCreate,
    current_user: str = Depends(get_current_user),
):
    return await create_invoice(
        invoice.model_dump(),
        current_user,
    )


@router.put("/{invoice_id}")
async def edit_invoice(
    invoice_id: str,
    invoice: InvoiceCreate,
    current_user: str = Depends(get_current_user),
):
    return await update_invoice(
        invoice_id,
        invoice.model_dump(),
        current_user,
    )


@router.patch("/{invoice_id}/status")
async def change_invoice_status(
    invoice_id: str,
    status: str,
    current_user: str = Depends(get_current_user),
):
    return await update_invoice_status(
        invoice_id,
        status,
        current_user,
    )


@router.delete("/{invoice_id}")
async def remove_invoice(
    invoice_id: str,
    current_user: str = Depends(get_current_user),
):
    return await delete_invoice(
        invoice_id,
        current_user,
    )

class PaymentVerification(BaseModel):
    razorpay_order_id: str = Field(min_length=1)
    razorpay_payment_id: str = Field(min_length=1)
    razorpay_signature: str = Field(min_length=1)


@router.post("/{invoice_id}/payment/order")
async def create_payment_order(
    invoice_id: str,
    current_user: str = Depends(get_current_user),
):
    if not ObjectId.is_valid(invoice_id):
        raise HTTPException(400, "Invalid invoice ID")

    invoice = await db.invoices.find_one({"_id": ObjectId(invoice_id), "owner_email": current_user})
    if not invoice:
        raise HTTPException(404, "Invoice not found")
    if invoice.get("status") != "Pending":
        raise HTTPException(400, "Only pending invoices can be paid online")

    order = create_razorpay_order(invoice_id, float(invoice.get("total", 0)), invoice.get("customer", "Customer"))
    await db.invoices.update_one(
        {"_id": invoice["_id"], "owner_email": current_user},
        {"$set": {"razorpay_order_id": order["id"], "updated_at": datetime.now(timezone.utc)}},
    )
    from app.config import settings
    return {
        "key_id": settings.RAZORPAY_KEY_ID,
        "order_id": order["id"],
        "amount": order["amount"],
        "currency": order["currency"],
        "invoice_id": invoice_id,
        "customer": invoice.get("customer", "Customer"),
    }


@router.post("/{invoice_id}/payment/verify")
async def verify_payment(
    invoice_id: str,
    payment: PaymentVerification,
    current_user: str = Depends(get_current_user),
):
    if not ObjectId.is_valid(invoice_id):
        raise HTTPException(400, "Invalid invoice ID")

    invoice = await db.invoices.find_one({"_id": ObjectId(invoice_id), "owner_email": current_user})
    if not invoice:
        raise HTTPException(404, "Invoice not found")

    stored_order_id = invoice.get("razorpay_order_id")
    if not stored_order_id or stored_order_id != payment.razorpay_order_id:
        raise HTTPException(400, "Razorpay order does not match this invoice")

    if invoice.get("status") == "Cancelled":
        raise HTTPException(400, "Cancelled invoices cannot be paid")

    if not verify_signature(payment.razorpay_order_id, payment.razorpay_payment_id, payment.razorpay_signature):
        raise HTTPException(400, "Invalid Razorpay payment signature")

    expected_paise = int(round(float(invoice.get("total", 0)) * 100))
    razor_payment = fetch_payment(payment.razorpay_payment_id)

    if razor_payment.get("order_id") != stored_order_id:
        raise HTTPException(400, "Payment is not linked to this Razorpay order")
    if int(razor_payment.get("amount", -1)) != expected_paise or razor_payment.get("currency") != "INR":
        raise HTTPException(400, "Payment amount does not match the invoice")
    if razor_payment.get("status") == "authorized":
        razor_payment = capture_payment(payment.razorpay_payment_id, expected_paise)

    if razor_payment.get("status") != "captured" or not razor_payment.get("captured", False):
        raise HTTPException(400, "Payment is not captured yet; invoice remains pending")

    await db.invoices.update_one(
        {"_id": invoice["_id"], "owner_email": current_user},
        {"$set": {
            "razorpay_payment_id": payment.razorpay_payment_id,
            "razorpay_signature": payment.razorpay_signature,
            "payment_method": razor_payment.get("method", invoice.get("payment_method", "UPI")),
            "payment_gateway": "Razorpay",
            "payment_status": razor_payment.get("status"),
            "updated_at": datetime.now(timezone.utc),
        }},
    )

    if invoice.get("status") == "Pending":
        updated = await update_invoice_status(invoice_id, "Paid", current_user)
    else:
        updated = await db.invoices.find_one({"_id": invoice["_id"], "owner_email": current_user})
        updated["id"] = str(updated.pop("_id"))

    return updated
