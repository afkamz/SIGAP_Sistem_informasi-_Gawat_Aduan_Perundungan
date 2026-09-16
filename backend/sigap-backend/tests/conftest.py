"""
conftest.py — Fixture Pytest SIGAP Backend
Menggunakan SQLite in-memory + TestClient FastAPI untuk isolasi test sempurna.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app
from app.core.security import hash_password

# ----------------------------------------------------------------
# Database In-Memory untuk Testing (tidak menimpa sigap.db asli)
# ----------------------------------------------------------------
SQLALCHEMY_TEST_URL = "sqlite:///:memory:"

engine_test = create_engine(
    SQLALCHEMY_TEST_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine_test
)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Override dependency FastAPI ke DB test
app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    """Buat semua tabel di DB in-memory sebelum seluruh test berjalan."""
    import app.models  # noqa — wajib agar semua model terdaftar
    Base.metadata.create_all(bind=engine_test)
    yield
    Base.metadata.drop_all(bind=engine_test)


@pytest.fixture(scope="session")
def client():
    """TestClient FastAPI yang dipakai di seluruh sesi test."""
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="session")
def seed_db(setup_database):
    """
    Seed data minimal (1 admin, 1 siswa, 7 kategori) ke DB in-memory
    agar test auth & pengaduan siap dijalankan.
    """
    from app.models.admin import Admin
    from app.models.siswa import Siswa
    from app.models.kategori import Kategori

    db = TestingSessionLocal()
    try:
        # --- Kategori ---
        kategori_names = [
            "Perundungan Verbal",
            "Perundungan Fisik",
            "Perundungan Siber",
            "Kekerasan Seksual",
            "Hukuman Fisik oleh Tenaga Pendidik",
            "Kekerasan Psikis/Pengucilan Sosial",
            "Penyalahgunaan Narkoba/Rokok/Minuman Keras",
        ]
        for nama in kategori_names:
            if not db.query(Kategori).filter_by(nama=nama).first():
                db.add(Kategori(nama=nama))
        db.commit()

        # --- Admin demo ---
        if not db.query(Admin).filter_by(nip="198001012026").first():
            db.add(Admin(
                nip="198001012026",
                nama="Admin Test",
                jabatan="Guru BK",
                password_hash=hash_password("admin123"),
            ))
            db.commit()

        # --- Siswa demo ---
        if not db.query(Siswa).filter_by(nisn="1234567890").first():
            db.add(Siswa(
                nisn="1234567890",
                nama="Siswa Test",
                sekolah="SMK Negeri 1 Lamongan",
                password_hash=hash_password("siswa123"),
            ))
            db.commit()

    finally:
        db.close()

    return True


@pytest.fixture(scope="session")
def admin_token(client, seed_db):
    """Login admin dan kembalikan Bearer token."""
    resp = client.post(
        "/api/auth/admin/login",
        data={"username": "198001012026", "password": "admin123"},
    )
    assert resp.status_code == 200, f"Login admin gagal: {resp.text}"
    return resp.json()["access_token"]


@pytest.fixture(scope="session")
def siswa_token(client, seed_db):
    """Login siswa dan kembalikan Bearer token."""
    resp = client.post(
        "/api/auth/siswa/login",
        json={"nisn": "1234567890", "password": "siswa123"},
    )
    assert resp.status_code == 200, f"Login siswa gagal: {resp.text}"
    return resp.json()["access_token"]


@pytest.fixture(scope="session")
def auth_admin(admin_token):
    """Header Authorization untuk admin."""
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture(scope="session")
def auth_siswa(siswa_token):
    """Header Authorization untuk siswa."""
    return {"Authorization": f"Bearer {siswa_token}"}

