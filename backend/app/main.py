from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

from app.routers.auth import router as auth_router
from app.routers.inventory import router as inventory_router
from app.routers.customers import router as customers_router
from app.routers.suppliers import router as suppliers_router
from app.routers.billing import router as billing_router
from app.routers.dashboard import router as dashboard_router
from app.routers.reports import router as reports_router
from app.routers.ai import router as ai_router


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Local frontend
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        # Vercel production domain
        "https://vyapar-ai-tzzv.vercel.app",
    ],

    # Allow Vercel deployment/preview URLs
    allow_origin_regex=(
        r"https://vyapar-ai-tzzv-[a-z0-9]+-mrking7979s-projects\.vercel\.app"
    ),

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROUTERS
# ============================================================

app.include_router(auth_router)
app.include_router(inventory_router)
app.include_router(customers_router)
app.include_router(suppliers_router)
app.include_router(billing_router)
app.include_router(dashboard_router)
app.include_router(reports_router)
app.include_router(ai_router)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
async def root():
    return {
        "message": "VyaparAI Backend Running",
        "version": "1.0.0",
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
async def health():
    return {
        "status": "healthy",
    }
