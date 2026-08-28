from fastapi import APIRouter, Depends
from app.services.reports import sales_report, daily_sales, monthly_sales, monthly_revenue, product_analytics, category_analytics, recent_transactions
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/sales")
async def all_sales(current_user: str = Depends(get_current_user)):
    return await sales_report(current_user)

@router.get("/daily")
async def today_sales(current_user: str = Depends(get_current_user)):
    return await daily_sales(current_user)

@router.get("/monthly")
async def month_sales(current_user: str = Depends(get_current_user)):
    return await monthly_sales(current_user)

@router.get("/revenue")
async def revenue_chart(current_user: str = Depends(get_current_user)):
    return await monthly_revenue(current_user)

@router.get("/products")
async def product_report(current_user: str = Depends(get_current_user)):
    return await product_analytics(current_user)

@router.get("/categories")
async def category_report(current_user: str = Depends(get_current_user)):
    return await category_analytics(current_user)

@router.get("/transactions")
async def transactions_report(current_user: str = Depends(get_current_user)):
    return await recent_transactions(current_user)
