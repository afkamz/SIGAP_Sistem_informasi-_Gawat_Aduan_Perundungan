from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
import bcrypt as _bcrypt
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.admin import Admin
from app.models.siswa import Siswa

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")


def hash_password(password: str) -> str:
    return _bcrypt.hashpw(password.encode("utf-8"), _bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return _bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def get_current_admin(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> Admin:
    """Dependency FastAPI: pasang Depends(get_current_admin) di endpoint yang khusus admin."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Kredensial tidak valid atau sesi sudah habis",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        admin_id = payload.get("sub")
        role = payload.get("role", "admin")
        if admin_id is None or role != "admin":
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    admin = db.query(Admin).filter(Admin.id == int(admin_id)).first()
    if admin is None:
        raise credentials_exception
    return admin


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> dict:
    """Dependency FastAPI: mengembalikan profil user yang sedang login (baik admin maupun siswa)."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Kredensial tidak valid atau sesi sudah habis",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        user_id = payload.get("sub")
        role = payload.get("role", "siswa")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    if role == "admin":
        admin = db.query(Admin).filter(Admin.id == int(user_id)).first()
        if admin is None:
            raise credentials_exception
        return {
            "id": admin.id,
            "nama": admin.nama,
            "nip": admin.nip,
            "jabatan": admin.jabatan,
            "role": "admin",
        }
    else:
        siswa = db.query(Siswa).filter(Siswa.id == int(user_id)).first()
        if siswa is None:
            raise credentials_exception
        return {
            "id": siswa.id,
            "nama": siswa.nama,
            "nisn": siswa.nisn,
            "sekolah": siswa.sekolah,
            "role": "siswa",
        }
