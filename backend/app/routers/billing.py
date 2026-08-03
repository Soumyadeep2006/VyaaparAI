from fastapi import APIRouter, Depends

from app.schemas.invoice import InvoiceCreate

from app.services.billing import (
    get_invoices,
    create_invoice,
    update_invoice,
    delete_invoice,
    update_invoice_status,
)

from app.utils.dependencies import get_current_user


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