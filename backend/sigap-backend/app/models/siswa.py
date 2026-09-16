from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Siswa(Base):
    """Akun siswa. Login bersifat opsional — laporan tetap bisa dikirim tanpa login (anonim penuh)."""
    __tablename__ = "siswa"

    id = Column(Integer, primary_key=True, index=True)
    nisn = Column(String(20), unique=True, nullable=False, index=True)
    nama = Column(String(150), nullable=False)
    sekolah = Column(String(150), nullable=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
