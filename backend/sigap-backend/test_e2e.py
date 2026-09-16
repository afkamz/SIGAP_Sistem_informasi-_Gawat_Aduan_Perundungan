"""
test_e2e.py — Entry Point End-to-End Test Suite SIGAP
Menjalankan simulasi alur lengkap: register → login → buat laporan → transisi status → cek dashboard.
Jalankan dengan: pytest test_e2e.py -v
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app
from app.core.security import hash_password

# ----------------------------------------------------------------
# Setup DB in-memory khusus untuk E2E (scope sesi terpisah)
# ----------------------------------------------------------------
SQLALCHEMY_E2E_URL = "sqlite:///:memory:"
engine_e2e = create_engine(
    SQLALCHEMY_E2E_URL,
    connect_args={"check_same_thread": False},
)
E2ESession = sessionmaker(autocommit=False, autoflush=False, bind=engine_e2e)


def e2e_get_db():
    db = E2ESession()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = e2e_get_db


@pytest.fixture(scope="module")
def e2e_client():
    import app.models  # noqa
    Base.metadata.create_all(bind=engine_e2e)

    # Seed minimal
    from app.models.admin import Admin
    from app.models.kategori import Kategori

    db = E2ESession()
    try:
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
            db.add(Kategori(nama=nama))
        db.add(Admin(
            nip="E2E001",
            nama="Admin E2E",
            jabatan="Guru BK",
            password_hash=hash_password("e2e_pass"),
        ))
        db.commit()
    finally:
        db.close()

    with TestClient(app) as c:
        yield c

    Base.metadata.drop_all(bind=engine_e2e)


class TestAlurLengkapE2E:
    """
    Simulasi alur end-to-end:
    1. Registrasi siswa baru
    2. Login siswa → dapat token
    3. Submit laporan anonim → dapat ticket_code
    4. Cek status laporan via ticket_code (tanpa login)
    5. Login admin
    6. Admin melihat daftar laporan
    7. Admin transisi status → diverifikasi
    8. Admin approve kategori AI
    9. Cek dashboard summary
    """

    ticket_code: str = ""
    pengaduan_id: int = 0
    admin_token: str = ""

    def test_01_registrasi_siswa(self, e2e_client):
        """Siswa baru berhasil registrasi."""
        resp = e2e_client.post(
            "/api/auth/siswa/register",
            json={
                "nisn": "E2E1111111",
                "nama": "Budi Santoso E2E",
                "sekolah": "SMA E2E",
                "password": "budi1234",
            },
        )
        assert resp.status_code == 201
        assert resp.json()["nisn"] == "E2E1111111"

    def test_02_login_siswa(self, e2e_client):
        """Siswa dapat login dan mendapat JWT."""
        resp = e2e_client.post(
            "/api/auth/siswa/login",
            json={"nisn": "E2E1111111", "password": "budi1234"},
        )
        assert resp.status_code == 200
        assert "access_token" in resp.json()

    def test_03_submit_laporan_anonim(self, e2e_client):
        """Siswa submit laporan anonim → mendapat kode tiket."""
        resp = e2e_client.post(
            "/api/pengaduan",
            json={
                "kategori_id": 1,
                "deskripsi": (
                    "Saya sering diejek dan diledek nama buruk oleh teman-teman "
                    "kelas hampir setiap hari saat jam istirahat di kantin."
                ),
                "mode_anonim": True,
            },
        )
        assert resp.status_code == 201
        body = resp.json()
        assert body["ticket_code"].startswith("SGP-")
        TestAlurLengkapE2E.ticket_code = body["ticket_code"]
        assert body["status"] == "menunggu"

    def test_04_cek_status_via_ticket(self, e2e_client):
        """Publik bisa lacak status tanpa login menggunakan kode tiket."""
        ticket = TestAlurLengkapE2E.ticket_code
        assert ticket, "Ticket code tidak tersedia dari test sebelumnya."
        resp = e2e_client.get(f"/api/pengaduan/{ticket}/status")
        assert resp.status_code == 200
        assert resp.json()["ticket_code"] == ticket
        assert resp.json()["status"] == "menunggu"

    def test_05_login_admin(self, e2e_client):
        """Admin berhasil login dan mendapat token."""
        resp = e2e_client.post(
            "/api/auth/admin/login",
            data={"username": "E2E001", "password": "e2e_pass"},
        )
        assert resp.status_code == 200
        TestAlurLengkapE2E.admin_token = resp.json()["access_token"]

    def test_06_admin_lihat_laporan(self, e2e_client):
        """Admin melihat daftar laporan dan menemukan laporan yang baru dibuat."""
        headers = {"Authorization": f"Bearer {TestAlurLengkapE2E.admin_token}"}
        resp = e2e_client.get("/api/pengaduan", headers=headers)
        assert resp.status_code == 200
        laporan = resp.json()
        assert len(laporan) >= 1
        match = next(
            (l for l in laporan if l["ticket_code"] == TestAlurLengkapE2E.ticket_code),
            None,
        )
        assert match is not None
        TestAlurLengkapE2E.pengaduan_id = match["id"]

    def test_07_admin_ubah_status_diverifikasi(self, e2e_client):
        """Admin memverifikasi laporan → status berubah ke diverifikasi."""
        pid = TestAlurLengkapE2E.pengaduan_id
        assert pid > 0, "ID pengaduan tidak tersedia."
        headers = {"Authorization": f"Bearer {TestAlurLengkapE2E.admin_token}"}
        resp = e2e_client.patch(
            f"/api/pengaduan/{pid}/status",
            json={"status_baru": "diverifikasi", "catatan": "Laporan valid, bukti cukup."},
            headers=headers,
        )
        assert resp.status_code == 200
        assert resp.json()["status"] == "diverifikasi"

    def test_08_admin_approve_kategori_ai(self, e2e_client):
        """Admin menyetujui rekomendasi kategori dari AI."""
        pid = TestAlurLengkapE2E.pengaduan_id
        headers = {"Authorization": f"Bearer {TestAlurLengkapE2E.admin_token}"}
        resp = e2e_client.patch(
            f"/api/pengaduan/{pid}/kategori",
            json={"kategori_id": 1, "sumber": "ai_disetujui"},
            headers=headers,
        )
        assert resp.status_code == 200
        assert resp.json()["sumber_kategori"] == "ai_disetujui"

    def test_09_dashboard_summary(self, e2e_client):
        """Dashboard summary menunjukkan setidaknya 1 laporan."""
        headers = {"Authorization": f"Bearer {TestAlurLengkapE2E.admin_token}"}
        resp = e2e_client.get("/api/dashboard/summary", headers=headers)
        assert resp.status_code == 200
        assert resp.json()["total_laporan"] >= 1

    def test_10_audit_trail_tercatat(self, e2e_client):
        """Detail laporan harus memuat audit trail setelah perubahan status."""
        pid = TestAlurLengkapE2E.pengaduan_id
        headers = {"Authorization": f"Bearer {TestAlurLengkapE2E.admin_token}"}
        resp = e2e_client.get(f"/api/pengaduan/{pid}", headers=headers)
        assert resp.status_code == 200
        body = resp.json()
        assert "audit_trail" in body
        assert len(body["audit_trail"]) >= 1

