from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.database import Base


class ExternalBenchmark(Base):
    """
    Tabel data agregat eksternal (Satu Data Indonesia, SIMFONI PPA, BPS/KemenPPPA).
    Digunakan untuk data referensi pembanding pada dashboard analytics admin.
    """
    __tablename__ = "external_benchmark"

    id = Column(Integer, primary_key=True, index=True)
    sumber = Column(String(100), nullable=False, index=True)       # misal: 'Aceh Open Data', 'KemenPPPA'
    wilayah = Column(String(100), nullable=False, index=True)      # misal: 'Nasional', 'Kabupaten Aceh Selatan'
    indikator = Column(String(255), nullable=False)                # nama data / metrik
    tahun = Column(Integer, nullable=False, index=True)            # tahun pencatatan
    nilai = Column(Float, nullable=False)                          # angka nilai
    satuan = Column(String(50), default="Kasus", nullable=False)   # satuan: Kasus, Jiwa, Indeks
    keterangan = Column(String(255), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

