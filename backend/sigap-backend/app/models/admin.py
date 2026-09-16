from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Admin(Base):
    """Akun admin: guru BK / wali kelas / dinas pendidikan."""
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    nip = Column(String(50), unique=True, nullable=False, index=True)
    nama = Column(String(150), nullable=False)
    jabatan = Column(String(100), nullable=True)  # mis. "Guru BK", "Dinas Pendidikan"
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
