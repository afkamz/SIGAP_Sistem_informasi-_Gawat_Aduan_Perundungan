import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
import app.models  # noqa: F401 — wajib diimpor supaya semua tabel dikenali create_all()
from app.routers import auth, pengaduan, dashboard

logger = logging.getLogger(__name__)


def _init_db() -> None:
    """Buat semua tabel di database jika belum ada, dengan retry untuk MySQL."""
    max_retries = 10
    for attempt in range(1, max_retries + 1):
        try:
            Base.metadata.create_all(bind=engine)
            logger.info("Tabel database berhasil diinisialisasi.")
            return
        except Exception as e:
            if attempt == max_retries:
                logger.error(
                    f"Gagal menghubungkan ke database setelah {max_retries} percobaan: {e}"
                )
                raise
            logger.warning(
                f"Menunggu database siap (percobaan {attempt}/{max_retries})..."
            )
            time.sleep(2)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan handler: inisialisasi saat startup, bersihkan saat shutdown."""
    _init_db()
    allowed = settings.get_allowed_origins()
    logger.info(f"SIGAP API aktif. CORS origins: {allowed}")
    yield
    # Cleanup di sini jika diperlukan di masa depan


app = FastAPI(
    title="SIGAP API",
    description="Sistem Informasi Gawat Aduan Perundungan — backend FastAPI",
    version="0.2.0",
    lifespan=lifespan,
)

# CORS — origin dibaca dari .env (ALLOWED_ORIGINS).
# Development: localhost:5173 (Vite) dan localhost:8000.
# Production: isi .env dengan domain frontend resmi, jangan gunakan "*".
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)


@app.get("/", tags=["Health"])
def root():
    return {
        "message": "SIGAP API aktif",
        "version": "0.2.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health_check():
    """Endpoint cek kesehatan server — berguna untuk monitoring dan smoke test."""
    return {"status": "ok", "database": "sqlite"}


app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(pengaduan.router, prefix="/api/pengaduan", tags=["Pengaduan"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
