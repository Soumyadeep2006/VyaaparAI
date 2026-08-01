from fastapi import APIRouter

from app.schemas.invoice import InvoiceCreate

from app.services.billing import (
    get_invoices,
    create_invoice,
    update_invoice,
    delete_invoice,
    update_invoice_status,
)


router = APIRouter(
    prefix="/api/billing",
    tags=["Billing"],
)


@router.get("/")
async def all_invoices():
    return await get_invoices()


@router.post("/")
async def add_invoice(
    invoice: InvoiceCreate,
):
    return await create_invoice(
        invoice.model_dump()
    )


@router.put("/{invoice_id}")
async def edit_invoice(
    invoice_id: str,
    invoice: InvoiceCreate,
):
    return await update_invoice(
        invoice_id,
        invoice.model_dump(),
    )


@router.patch("/{invoice_id}/status")
async def change_invoice_status(
    invoice_id: str,
    status: str,
):
    return await update_invoice_status(
        invoice_id,
        status,
    )


@router.delete("/{invoice_id}")
async def remove_invoice(
    invoice_id: str,
):
    return await delete_invoice(
        invoice_id
    )