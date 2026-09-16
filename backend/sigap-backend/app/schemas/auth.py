from pydantic import BaseModel, Field


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str = "admin"  # "admin" atau "siswa"


# Alias untuk backward compatibility
AdminLoginResponse = TokenResponse


class AdminOut(BaseModel):
    id: int
    nip: str
    nama: str
    jabatan: str | None = None

    class Config:
        from_attributes = True


class SiswaRegisterRequest(BaseModel):
    nisn: str = Field(..., min_length=4, max_length=20)
    nama: str = Field(..., min_length=2, max_length=150)
    sekolah: str | None = None
    password: str = Field(..., min_length=4)


class SiswaLoginRequest(BaseModel):
    nisn: str
    password: str


class SiswaOut(BaseModel):
    id: int
    nisn: str
    nama: str
    sekolah: str | None = None

    class Config:
        from_attributes = True
