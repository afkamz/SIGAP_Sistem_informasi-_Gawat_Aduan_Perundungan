from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.admin import Admin
from app.models.siswa import Siswa
from app.schemas.auth import (
    TokenResponse, AdminLoginResponse, AdminOut,
    SiswaRegisterRequest, SiswaLoginRequest, SiswaOut,
)
from app.core.security import (
    verify_password, hash_password, create_access_token, get_current_admin,
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
    return TokenResponse(access_token=access_token, role="admin")


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
    return TokenResponse(access_token=access_token, role="siswa")


@router.get("/me")
def get_current_user_profile(
    admin: Admin = Depends(get_current_admin),
):
    """Mendapatkan informasi profil admin yang sedang login."""
    return AdminOut.model_validate(admin)
