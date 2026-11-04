from pydantic import BaseModel, Field, ConfigDict


class UserInfo(BaseModel):
    id: int
    nama: str
    role: str
    nisn: str | None = None
    nip: str | None = None
    sekolah: str | None = None
    jabatan: str | None = None

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str = "admin"  # "admin" atau "siswa"
    user: UserInfo | None = None


# Alias untuk backward compatibility
AdminLoginResponse = TokenResponse


class AdminOut(BaseModel):
    id: int
    nip: str
    nama: str
    jabatan: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AdminCreateRequest(BaseModel):
    nip: str = Field(..., min_length=4, max_length=50)
    nama: str = Field(..., min_length=2, max_length=150)
    jabatan: str | None = Field(default="Guru BK", max_length=100)
    password: str = Field(..., min_length=4)


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

    model_config = ConfigDict(from_attributes=True)
