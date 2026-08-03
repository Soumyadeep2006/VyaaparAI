from fastapi import APIRouter, Depends

from app.services.reports import (
    sales_report,
    daily_sales,
    monthly_sales,
)

from app.utils.dependencies import get_current_user


router = APIRouter(
    prefix="/api/reports",
    tags=["Reports"],
)


@router.get("/sales")
async def all_sales(
    current_user: str = Depends(get_current_user),
):
    return await sales_report(
        current_user
    )


@router.get("/daily")
async def today_sales(
    current_user: str = Depends(get_current_user),
):
    return await daily_sales(
        current_user
    )


@router.get("/monthly")
async def month_sales(
    current_user: str = Depends(get_current_user),
):
    return await monthly_sales(
        current_user
    )