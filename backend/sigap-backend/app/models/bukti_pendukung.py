from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class BuktiPendukung(Base):
    """Referensi file bukti (foto/PDF) yang diunggah siswa. File fisik disimpan di File Storage,
    di sini hanya path/URL-nya."""
    __tablename__ = "bukti_pendukung"

    id = Column(Integer, primary_key=True, index=True)
    pengaduan_id = Column(Integer, ForeignKey("pengaduan.id"), nullable=False)
    file_path = Column(String(255), nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    pengaduan = relationship("Pengaduan", back_populates="bukti")
