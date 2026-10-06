import os
import uuid
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.pengaduan import Pengaduan
from app.models.kategori import Kategori
from app.models.audit_trail import AuditTrail
from app.models.admin import Admin
from app.models.bukti_pendukung import BuktiPendukung
from app.models.enums import StatusLaporan, SumberKategori, URUTAN_STATUS
from app.schemas.pengaduan import (
    PengaduanCreate, PengaduanTicketOut, PengaduanAdminOut, PengaduanDetailOut,
    StatusUpdateRequest, KategoriUpdateRequest, KategoriOut, BuktiOut,
)
from app.core.security import get_current_admin
from app.ai.service import analyze_report

router = APIRouter()

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# ── Konstanta Upload Bukti ──────────────────────────────────────────────────
# Batas ukuran file: 10 MB
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

# MIME type yang diizinkan → ekstensi yang aman
ALLOWED_MIME_TYPES: dict[str, str] = {
    "image/jpeg":       ".jpg",
    "image/png":        ".png",
    "image/webp":       ".webp",
    "application/pdf":  ".pdf",
}

# Ekstensi yang diizinkan (sebagai pengaman tambahan dari nama file asli)
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".pdf"}


def generate_ticket_code() -> str:
    tahun = datetime.now().year
    kode_acak = uuid.uuid4().hex[:6].upper()
    return f"SGP-{tahun}-{kode_acak}"


def _ke_admin_out(p: Pengaduan) -> PengaduanAdminOut:
    """Helper: susun response admin dari objek Pengaduan + relasinya."""
    return PengaduanAdminOut(
        id=p.id,
        ticket_code=p.ticket_code,
        kategori_nama=p.kategori.nama if p.kategori else "-",
        ai_kategori_rekomendasi_nama=p.kategori_rekomendasi.nama if p.kategori_rekomendasi else None,
        ai_confidence_score=p.ai_confidence_score,
        sumber_kategori=p.sumber_kategori,
        status=p.status,
        mode_anonim=p.mode_anonim,
        cluster_label=p.cluster_label,
        is_noise=p.is_noise,
        created_at=p.created_at,
    )


def _validasi_file(file: UploadFile, content: bytes) -> str:
    """
    Validasi file upload. Kembalikan ekstensi aman untuk penyimpanan.
    Raise HTTPException jika file tidak valid.
    """
    # 1. Cek ukuran file
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"Ukuran file melebihi batas maksimal {MAX_FILE_SIZE_BYTES // (1024*1024)} MB.",
        )

    # 2. Cek ukuran minimum (hindari file kosong)
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="File tidak boleh kosong.")

    # 3. Validasi MIME type dari header Content-Type yang dikirim client
    content_type = (file.content_type or "").split(";")[0].strip().lower()
    if content_type not in ALLOWED_MIME_TYPES:
        allowed_display = ", ".join(ALLOWED_MIME_TYPES.keys())
        raise HTTPException(
            status_code=415,
            detail=f"Tipe file '{content_type}' tidak diizinkan. "
                   f"Tipe yang diterima: {allowed_display}",
        )

    # 4. Validasi Magic Bytes (signature file aktual — lebih aman dari sekadar Content-Type)
    magic_valid = _cek_magic_bytes(content, content_type)
    if not magic_valid:
        raise HTTPException(
            status_code=415,
            detail="Isi file tidak sesuai dengan tipe yang dideklarasikan. "
                   "Kemungkinan file telah dimanipulasi.",
        )

    # 5. Validasi ekstensi dari nama file asli (sebagai layer tambahan)
    original_ext = Path(file.filename or "").suffix.lower()
    if original_ext and original_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail=f"Ekstensi file '{original_ext}' tidak diizinkan.",
        )

    # Kembalikan ekstensi aman berdasarkan MIME type (bukan dari nama file client)
    return ALLOWED_MIME_TYPES[content_type]


def _cek_magic_bytes(content: bytes, content_type: str) -> bool:
    """
    Validasi signature byte pertama file (magic bytes) sesuai tipe yang diklaim.
    Mencegah serangan file spoofing (misal: .exe yang diganti nama jadi .jpg).
    """
    magic_signatures: dict[str, list[bytes]] = {
        "image/jpeg": [b"\xff\xd8\xff"],
        "image/png":  [b"\x89PNG\r\n\x1a\n"],
        "image/webp": [b"RIFF"],       # RIFF....WEBP
        "application/pdf": [b"%PDF"],
    }
    signatures = magic_signatures.get(content_type, [])
    if not signatures:
        # Tipe tidak dikenali dalam whitelist magic bytes — tolak untuk keamanan
        return False
    return any(content.startswith(sig) for sig in signatures)


# ============================================================
#  ENDPOINT PUBLIK & SISWA
# ============================================================

@router.get("/kategori", response_model=list[KategoriOut])
def daftar_kategori(db: Session = Depends(get_db)):
    """Mengambil 7 kategori resmi Permendikbudristek No. 46/2023."""
    return db.query(Kategori).order_by(Kategori.id.asc()).all()


@router.post("", response_model=PengaduanTicketOut, status_code=status.HTTP_201_CREATED)
def buat_pengaduan(payload: PengaduanCreate, db: Session = Depends(get_db)):
    kategori = db.query(Kategori).filter(Kategori.id == payload.kategori_id).first()
    if not kategori:
        raise HTTPException(status_code=404, detail="Kategori tidak ditemukan")

    pengaduan = Pengaduan(
        ticket_code=generate_ticket_code(),
        siswa_id=None if payload.mode_anonim else payload.siswa_id,
        mode_anonim=payload.mode_anonim,
        deskripsi=payload.deskripsi,
        kategori_id=payload.kategori_id,
        status=StatusLaporan.MENUNGGU,
        sumber_kategori=SumberKategori.BELUM_DIVALIDASI,
    )
    db.add(pengaduan)
    db.commit()
    db.refresh(pengaduan)

    # Jalankan AI Pipeline (Embedding IndoBERT + Cosine Similarity + HDBSCAN clustering)
    try:
        analyze_report(pengaduan, db)
    except Exception as err:
        print(f"[Pengaduan] Peringatan: Proses AI Pipeline dilewati ({err})")

    return PengaduanTicketOut(
        ticket_code=pengaduan.ticket_code,
        status=pengaduan.status,
        kategori_nama=kategori.nama,
        created_at=pengaduan.created_at,
    )


@router.post("/{ticket_code}/bukti", response_model=BuktiOut)
async def upload_bukti(
    ticket_code: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload bukti dokumen/foto untuk pengaduan berdasarkan kode tiket.

    - Tipe yang diterima: JPG, PNG, WebP, PDF
    - Ukuran maksimal: 10 MB
    - Nama file disimpan dengan UUID (aman dari path traversal)
    - Magic bytes diverifikasi (mencegah file spoofing)
    """
    pengaduan = db.query(Pengaduan).filter(Pengaduan.ticket_code == ticket_code).first()
    if not pengaduan:
        raise HTTPException(status_code=404, detail="Kode tiket tidak ditemukan")

    # Baca seluruh konten file ke memory terlebih dahulu untuk validasi
    content = await file.read()

    # Validasi MIME, magic bytes, ukuran, dan ekstensi
    safe_ext = _validasi_file(file, content)

    # Nama file: UUID penuh (tidak menggunakan nama asli dari client — mencegah path traversal)
    filename = f"{uuid.uuid4().hex}{safe_ext}"
    dest_path = UPLOAD_DIR / filename

    # Tulis file ke disk
    with open(dest_path, "wb") as f:
        f.write(content)

    # Simpan hanya nama file relatif ke DB (bukan path absolut server)
    bukti = BuktiPendukung(
        pengaduan_id=pengaduan.id,
        file_path=filename,
    )
    db.add(bukti)
    db.commit()
    db.refresh(bukti)
    return bukti


@router.get("/{ticket_code}/status", response_model=PengaduanTicketOut)
def cek_status_laporan(ticket_code: str, db: Session = Depends(get_db)):
    """Endpoint publik pelacakan laporan — tidak perlu login, tidak menampilkan identitas pelapor."""
    pengaduan = db.query(Pengaduan).filter(Pengaduan.ticket_code == ticket_code).first()
    if not pengaduan:
        raise HTTPException(status_code=404, detail="Kode tiket tidak ditemukan")

    return PengaduanTicketOut(
        ticket_code=pengaduan.ticket_code,
        status=pengaduan.status,
        kategori_nama=pengaduan.kategori.nama,
        created_at=pengaduan.created_at,
    )


@router.get("/siswa/{siswa_id}/riwayat", response_model=list[PengaduanAdminOut])
def riwayat_laporan_siswa(siswa_id: int, db: Session = Depends(get_db)):
    """Riwayat laporan yang dibuat oleh siswa terdaftar (hanya miliknya)."""
    laporan = (
        db.query(Pengaduan)
        .filter(Pengaduan.siswa_id == siswa_id)
        .order_by(Pengaduan.created_at.desc())
        .all()
    )
    return [_ke_admin_out(p) for p in laporan]


# ============================================================
#  ENDPOINT ADMIN (wajib login Guru BK / Satgas)
# ============================================================

@router.get("", response_model=list[PengaduanAdminOut])
def daftar_pengaduan(
    status_filter: StatusLaporan | None = None,
    kategori_id: int | None = None,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    query = db.query(Pengaduan)
    if status_filter:
        query = query.filter(Pengaduan.status == status_filter)
    if kategori_id:
        query = query.filter(Pengaduan.kategori_id == kategori_id)

    laporan = query.order_by(Pengaduan.created_at.desc()).all()
    return [_ke_admin_out(p) for p in laporan]


@router.get("/{pengaduan_id}", response_model=PengaduanDetailOut)
def detail_pengaduan(
    pengaduan_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    p = db.query(Pengaduan).filter(Pengaduan.id == pengaduan_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Laporan tidak ditemukan")

    dasar = _ke_admin_out(p)
    return PengaduanDetailOut(
        **dasar.model_dump(),
        deskripsi=p.deskripsi,
        updated_at=p.updated_at,
        bukti=p.bukti,
        audit_trail=p.audit_trail,
    )


@router.patch("/{pengaduan_id}/status", response_model=PengaduanAdminOut)
def ubah_status_pengaduan(
    pengaduan_id: int,
    payload: StatusUpdateRequest,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    p = db.query(Pengaduan).filter(Pengaduan.id == pengaduan_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Laporan tidak ditemukan")

    index_sekarang = URUTAN_STATUS.index(p.status)
    index_baru = URUTAN_STATUS.index(payload.status_baru)

    # State machine: hanya boleh maju satu tahap secara teratur
    if index_baru != index_sekarang + 1:
        raise HTTPException(
            status_code=400,
            detail=f"Status tidak bisa diubah langsung dari '{p.status.value}' ke "
                   f"'{payload.status_baru.value}'. Harus berurutan sesuai alur penanganan.",
        )

    status_lama = p.status
    p.status = payload.status_baru
    db.add(p)

    db.add(AuditTrail(
        pengaduan_id=p.id,
        admin_id=admin.id,
        aksi="ubah_status",
        keterangan=f"{status_lama.value} -> {payload.status_baru.value}"
                   + (f" | Catatan: {payload.catatan}" if payload.catatan else ""),
    ))

    db.commit()
    db.refresh(p)
    return _ke_admin_out(p)


@router.patch("/{pengaduan_id}/kategori", response_model=PengaduanAdminOut)
def validasi_kategori_pengaduan(
    pengaduan_id: int,
    payload: KategoriUpdateRequest,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    p = db.query(Pengaduan).filter(Pengaduan.id == pengaduan_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Laporan tidak ditemukan")

    kategori_baru = db.query(Kategori).filter(Kategori.id == payload.kategori_id).first()
    if not kategori_baru:
        raise HTTPException(status_code=404, detail="Kategori tidak ditemukan")

    kategori_lama = p.kategori.nama if p.kategori else "Belum dikategorikan"
    p.kategori_id = payload.kategori_id
    p.sumber_kategori = payload.sumber
    db.add(p)

    db.add(AuditTrail(
        pengaduan_id=p.id,
        admin_id=admin.id,
        aksi="validasi_kategori",
        keterangan=f"{kategori_lama} -> {kategori_baru.nama} ({payload.sumber.value})",
    ))

    db.commit()
    db.refresh(p)
    return _ke_admin_out(p)
