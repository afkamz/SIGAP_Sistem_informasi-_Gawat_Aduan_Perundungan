from sqlalchemy import Column, Integer, String

from app.database import Base


class Kategori(Base):
    """7 kategori resmi pengaduan, diselaraskan dengan indikator Iklim Keamanan Sekolah."""
    __tablename__ = "kategori"

    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String(100), unique=True, nullable=False)
