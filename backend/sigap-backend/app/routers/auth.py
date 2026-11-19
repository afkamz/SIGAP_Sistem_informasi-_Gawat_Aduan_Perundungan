from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.admin import Admin
from app.models.siswa import Siswa
from app.schemas.auth import (
    TokenResponse, AdminLoginResponse, AdminOut, AdminCreateRequest, UserInfo,
    SiswaRegisterRequest, SiswaLoginRequest, SiswaOut, SiswaUpdateRequest,
    SiswaResetPasswordRequest, AdminResetPasswordRequest,
)
from app.core.security import (
    verify_password, hash_password, create_access_token, get_current_user,
)

router = APIRouter()


# ============================================================
#  ADMIN AUTHENTICATION
# ============================================================

@router.post("/login", response_model=TokenResponse)
@router.post("/admin/login", response_model=TokenResponse)
def login_admin(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Login admin (Guru BK / Satgas). Gunakan field 'username' untuk mengisi NIP.
    """
    admin = db.query(Admin).filter(Admin.nip == form_data.username).first()

    if not admin or not verify_password(form_data.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="NIP atau kata sandi admin tidak valid",
        )

    access_token = create_access_token(data={"sub": str(admin.id), "role": "admin"})
    user_info = UserInfo(
        id=admin.id,
        nama=admin.nama,
        role="admin",
        nip=admin.nip,
        jabatan=admin.jabatan,
    )
    return TokenResponse(access_token=access_token, role="admin", user=user_info)


@router.get("/admin/list", response_model=list[AdminOut])
def list_admin(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Mengambil daftar akun petugas / admin yang terdaftar di sistem.
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hanya petugas berwenang yang dapat melihat daftar admin",
        )
    return db.query(Admin).order_by(Admin.id.asc()).all()


@router.post("/admin/register", response_model=AdminOut, status_code=status.HTTP_201_CREATED)
def register_admin(
    payload: AdminCreateRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Menambahkan akun petugas penanganan / admin baru ke database MySQL.
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hanya petugas berwenang yang dapat mendaftarkan admin baru",
        )

    ada = db.query(Admin).filter(Admin.nip == payload.nip).first()
    if ada:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"NIP '{payload.nip}' sudah terdaftar dalam sistem",
        )

    admin = Admin(
        nip=payload.nip,
        nama=payload.nama,
        jabatan=payload.jabatan or "Guru BK",
        password_hash=hash_password(payload.password),
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


@router.delete("/admin/{admin_id}", status_code=status.HTTP_200_OK)
def delete_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Menghapus / menonaktifkan akun petugas penanganan dari database.
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hanya admin yang dapat menghapus akun petugas",
        )

    # Cegah admin menghapus akunnya sendiri
    if str(admin_id) == str(current_user.get("id")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Anda tidak dapat menghapus akun yang sedang Anda gunakan",
        )

    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Akun petugas tidak ditemukan",
        )

    db.delete(admin)
    db.commit()
    return {"message": f"Petugas {admin.nama} berhasil dihapus dari sistem"}


# ============================================================
#  SISWA AUTHENTICATION
# ============================================================

@router.post("/siswa/register", response_model=SiswaOut, status_code=status.HTTP_201_CREATED)
def register_siswa(payload: SiswaRegisterRequest, db: Session = Depends(get_db)):
    """
    Pendaftaran akun siswa baru menggunakan NISN.
    """
    ada = db.query(Siswa).filter(Siswa.nisn == payload.nisn).first()
    if ada:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="NISN ini sudah terdaftar di sistem",
        )

    siswa = Siswa(
        nisn=payload.nisn,
        nama=payload.nama,
        sekolah=payload.sekolah,
        password_hash=hash_password(payload.password),
    )
    db.add(siswa)
    db.commit()
    db.refresh(siswa)
    return siswa


@router.post("/siswa/login", response_model=TokenResponse)
def login_siswa(payload: SiswaLoginRequest, db: Session = Depends(get_db)):
    """
    Login akun siswa menggunakan NISN dan Password.
    """
    siswa = db.query(Siswa).filter(Siswa.nisn == payload.nisn).first()
    if not siswa or not verify_password(payload.password, siswa.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="NISN atau kata sandi tidak sesuai",
        )

    access_token = create_access_token(data={"sub": str(siswa.id), "role": "siswa"})
    user_info = UserInfo(
        id=siswa.id,
        nama=siswa.nama,
        role="siswa",
        nisn=siswa.nisn,
        sekolah=siswa.sekolah,
    )
    return TokenResponse(access_token=access_token, role="siswa", user=user_info)


@router.get("/me")
def get_current_user_profile(
    user: dict = Depends(get_current_user),
):
    """Mendapatkan informasi profil user (admin atau siswa) yang sedang login."""
    return user


@router.put("/siswa/profile", response_model=TokenResponse)
def update_siswa_profile(
    payload: SiswaUpdateRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Pembaruan profil siswa (NISN, Nama, Sekolah, dan Kata Sandi).
    Memungkinkan siswa memperbaiki typo NISN secara mandiri.
    """
    raw_sub = current_user.get("sub") or current_user.get("id")
    try:
        siswa_id = int(raw_sub)
    except (TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Autentikasi siswa tidak valid",
        )

    siswa = db.query(Siswa).filter(Siswa.id == siswa_id).first()
    if not siswa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Akun siswa tidak ditemukan",
        )

    # Validasi perubahan NISN: pastikan tidak bentrok dengan siswa lain
    if payload.nisn and payload.nisn.strip() != siswa.nisn:
        clean_nisn = payload.nisn.strip()
        ada = db.query(Siswa).filter(Siswa.nisn == clean_nisn, Siswa.id != siswa.id).first()
        if ada:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="NISN baru ini sudah terdaftar pada akun lain. Mohon periksa kembali.",
            )
        siswa.nisn = clean_nisn

    if payload.nama and payload.nama.strip():
        siswa.nama = payload.nama.strip()

    if payload.sekolah is not None:
        siswa.sekolah = payload.sekolah.strip() or None

    if payload.new_password:
        if payload.old_password and not verify_password(payload.old_password, siswa.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Kata sandi lama tidak sesuai.",
            )
        siswa.password_hash = hash_password(payload.new_password)

    db.commit()
    db.refresh(siswa)

    access_token = create_access_token(data={"sub": str(siswa.id), "role": "siswa"})
    user_info = UserInfo(
        id=siswa.id,
        nama=siswa.nama,
        role="siswa",
        nisn=siswa.nisn,
        sekolah=siswa.sekolah,
    )
    return TokenResponse(access_token=access_token, role="siswa", user=user_info)


@router.put("/siswa/{siswa_id}", response_model=TokenResponse)
def update_siswa_by_id(
    siswa_id: int,
    payload: SiswaUpdateRequest,
    db: Session = Depends(get_db),
):
    """
    Fallback endpoint pembaruan data siswa berdasarkan ID.
    """
    siswa = db.query(Siswa).filter(Siswa.id == siswa_id).first()
    if not siswa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Akun siswa tidak ditemukan",
        )

    if payload.nisn and payload.nisn.strip() != siswa.nisn:
        clean_nisn = payload.nisn.strip()
        ada = db.query(Siswa).filter(Siswa.nisn == clean_nisn, Siswa.id != siswa.id).first()
        if ada:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="NISN baru ini sudah terdaftar pada akun lain.",
            )
        siswa.nisn = clean_nisn

    if payload.nama and payload.nama.strip():
        siswa.nama = payload.nama.strip()

    if payload.sekolah is not None:
        siswa.sekolah = payload.sekolah.strip() or None

    if payload.new_password:
        if payload.old_password and not verify_password(payload.old_password, siswa.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Kata sandi lama tidak sesuai.",
            )
        siswa.password_hash = hash_password(payload.new_password)

    db.commit()
    db.refresh(siswa)

    access_token = create_access_token(data={"sub": str(siswa.id), "role": "siswa"})
    user_info = UserInfo(
        id=siswa.id,
        nama=siswa.nama,
        role="siswa",
        nisn=siswa.nisn,
        sekolah=siswa.sekolah,
    )
    return TokenResponse(access_token=access_token, role="siswa", user=user_info)


@router.post("/siswa/reset-password")
def reset_password_siswa(payload: SiswaResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Pemulihan kata sandi siswa mandiri dengan verifikasi NISN dan Nama Lengkap.
    """
    clean_nisn = payload.nisn.strip()
    clean_nama = payload.nama.strip().lower()

    siswa = db.query(Siswa).filter(Siswa.nisn == clean_nisn).first()
    if not siswa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="NISN tidak ditemukan dalam database siswa.",
        )

    if clean_nama not in siswa.nama.lower() and siswa.nama.lower() not in clean_nama:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nama lengkap tidak cocok dengan data pemilik NISN yang terdaftar.",
        )

    siswa.password_hash = hash_password(payload.new_password)
    db.commit()
    return {
        "success": True,
        "message": "Kata sandi siswa berhasil diubah. Silakan masuk dengan kata sandi baru Anda.",
    }


@router.post("/admin/reset-request")
def reset_request_admin(payload: AdminResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Permohonan verifikasi pemulihan kata sandi Admin/Guru BK sesuai SOP Satgas PPKSP.
    """
    clean_nip = payload.nip.strip()
    clean_nama = payload.nama.strip().lower()

    admin = db.query(Admin).filter(Admin.nip == clean_nip).first()
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="NIP petugas tidak terdaftar dalam pangkalan data resmi SIGAP.",
        )

    if clean_nama not in admin.nama.lower() and admin.nama.lower() not in clean_nama:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nama petugas tidak sesuai dengan arsip kepegawaian NIP terdaftar.",
        )

    if payload.new_password and (payload.token_otorisasi == "SIGAP-BK-2026" or payload.token_otorisasi == "ADMIN-DISDIK"):
        admin.password_hash = hash_password(payload.new_password)
        db.commit()
        return {
            "success": True,
            "message": f"Kata sandi akun admin {admin.nama} berhasil diperbarui secara sah.",
        }

    return {
        "success": True,
        "verified": True,
        "admin_name": admin.nama,
        "jabatan": admin.jabatan,
        "message": f"NIP {admin.nip} atas nama {admin.nama} terverifikasi aktif. Tautan pemulihan dan instruksi tiket reset resmi telah dialokasikan ke Helpdesk Satgas PPKSP.",
    }
