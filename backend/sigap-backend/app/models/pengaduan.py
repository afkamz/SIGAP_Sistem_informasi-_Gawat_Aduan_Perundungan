from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float, DateTime,
    ForeignKey, Enum as SqlEnum, JSON,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base
from app.models.enums import StatusLaporan, SumberKategori


class Pengaduan(Base):
    """Tabel inti sistem — satu baris = satu laporan kasus."""
    __tablename__ = "pengaduan"

    id = Column(Integer, primary_key=True, index=True)
    ticket_code = Column(String(30), unique=True, nullable=False, index=True)

    # Nullable: laporan anonim tidak menyimpan identitas siswa sama sekali
    siswa_id = Column(Integer, ForeignKey("siswa.id"), nullable=True)
    mode_anonim = Column(Boolean, default=True, nullable=False)

    deskripsi = Column(Text, nullable=False)

    # Kategori final (yang dipakai sistem) vs kategori rekomendasi AI (belum tentu sama)
    kategori_id = Column(Integer, ForeignKey("kategori.id"), nullable=False)
    ai_kategori_rekomendasi_id = Column(Integer, ForeignKey("kategori.id"), nullable=True)
    ai_confidence_score = Column(Float, nullable=True)  # 0.0 - 1.0
    sumber_kategori = Column(
        SqlEnum(SumberKategori), default=SumberKategori.BELUM_DIVALIDASI, nullable=False
    )

    status = Column(SqlEnum(StatusLaporan), default=StatusLaporan.MENUNGGU, nullable=False)

    # Kolom untuk modul AI pipeline (diisi belakangan, bukan di tahap backend inti)
    embedding = Column(JSON, nullable=True)       # vector IndoBERT, disimpan sbg list of float
    cluster_label = Column(Integer, nullable=True)  # hasil HDBSCAN, null = belum diproses
    is_noise = Column(Boolean, nullable=True)       # true = outlier/anomali

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relasi
    siswa = relationship("Siswa", backref="laporan", foreign_keys=[siswa_id])
    kategori = relationship("Kategori", foreign_keys=[kategori_id])
    kategori_rekomendasi = relationship("Kategori", foreign_keys=[ai_kategori_rekomendasi_id])
    bukti = relationship("BuktiPendukung", back_populates="pengaduan", cascade="all, delete-orphan")
    audit_trail = relationship("AuditTrail", back_populates="pengaduan", cascade="all, delete-orphan")
