from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.admin import Admin
from app.models.siswa import Siswa
from app.schemas.auth import (
    TokenResponse, AdminLoginResponse, AdminOut, AdminCreateRequest, UserInfo,
    SiswaRegisterRequest, SiswaLoginRequest, SiswaOut,
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
