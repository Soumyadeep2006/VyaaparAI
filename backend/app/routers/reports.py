from fastapi import APIRouter

from app.services.reports import (
    sales_report,
    daily_sales,
    monthly_sales,
)

router = APIRouter(
    prefix="/api/reports",
    tags=["Reports"],
)


@router.get("/sales")
async def all_sales():

    return await sales_report()


@router.get("/daily")
async def today_sales():

    return await daily_sales()


@router.get("/monthly")
async def month_sales():

    return await monthly_sales()