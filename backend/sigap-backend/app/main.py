from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
import app.models  # noqa: F401 — wajib diimpor supaya semua tabel dikenali create_all()
from app.routers import auth, pengaduan, dashboard

app = FastAPI(
    title="SIGAP API",
    description="Sistem Informasi Guna Penanganan Aduan Publik — backend FastAPI",
    version="0.1.0",
)

# Untuk pengembangan lokal. Saat production, ganti allow_origins ke domain frontend saja.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


import time
import logging

logger = logging.getLogger(__name__)


@app.on_event("startup")
def buat_tabel_jika_belum_ada():
    max_retries = 10
    for attempt in range(1, max_retries + 1):
        try:
            Base.metadata.create_all(bind=engine)
            logger.info("Tabel database berhasil diinisialisasi.")
            break
        except Exception as e:
            if attempt == max_retries:
                logger.error(f"Gagal menghubungkan ke database setelah {max_retries} percobaan: {e}")
                raise
            logger.warning(f"Menunggu database siap (percobaan {attempt}/{max_retries})...")
            time.sleep(2)


@app.get("/")
def root():
    return {"message": "SIGAP API aktif"}


app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(pengaduan.router, prefix="/api/pengaduan", tags=["Pengaduan"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
