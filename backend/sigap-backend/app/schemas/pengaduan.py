from datetime import datetime
from pydantic import BaseModel, Field

from app.models.enums import StatusLaporan, SumberKategori


# ---------- Kategori ----------

class KategoriOut(BaseModel):
    id: int
    nama: str

    class Config:
        from_attributes = True


# ---------- Bukti & Audit ----------

class BuktiOut(BaseModel):
    id: int
    file_path: str
    uploaded_at: datetime

    class Config:
        from_attributes = True


class AuditTrailOut(BaseModel):
    id: int
    aksi: str
    keterangan: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Input dari Siswa ----------

class PengaduanCreate(BaseModel):
    kategori_id: int
    deskripsi: str = Field(..., min_length=10, description="Kronologi kejadian")
    mode_anonim: bool = True
    siswa_id: int | None = None


# ---------- Output publik (siswa, tanpa login) ----------

class PengaduanTicketOut(BaseModel):
    ticket_code: str
    status: StatusLaporan
    kategori_nama: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Output untuk Admin ----------

class PengaduanAdminOut(BaseModel):
    id: int
    ticket_code: str
    kategori_nama: str
    ai_kategori_rekomendasi_nama: str | None = None
    ai_confidence_score: float | None = None
    sumber_kategori: SumberKategori
    status: StatusLaporan
    mode_anonim: bool
    cluster_label: int | None = None
    is_noise: bool | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class PengaduanDetailOut(PengaduanAdminOut):
    deskripsi: str
    updated_at: datetime
    bukti: list[BuktiOut] = []
    audit_trail: list[AuditTrailOut] = []


# ---------- Update oleh Admin ----------

class StatusUpdateRequest(BaseModel):
    status_baru: StatusLaporan
    catatan: str | None = None


class KategoriUpdateRequest(BaseModel):
    kategori_id: int
    sumber: SumberKategori  # AI_DISETUJUI atau MANUAL_OVERRIDE
