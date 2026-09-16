from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class AuditTrail(Base):
    """Jejak audit: setiap perubahan status atau validasi kategori pada sebuah laporan tercatat di sini."""
    __tablename__ = "audit_trail"

    id = Column(Integer, primary_key=True, index=True)
    pengaduan_id = Column(Integer, ForeignKey("pengaduan.id"), nullable=False)
    admin_id = Column(Integer, ForeignKey("admins.id"), nullable=True)
    aksi = Column(String(150), nullable=False)     # mis. "ubah_status", "validasi_kategori"
    keterangan = Column(Text, nullable=True)        # mis. "Menunggu -> Diverifikasi"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    pengaduan = relationship("Pengaduan", back_populates="audit_trail")
    admin = relationship("Admin")
