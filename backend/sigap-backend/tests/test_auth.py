"""
test_auth.py — Unit test modul Autentikasi SIGAP
Mencakup: login admin, login siswa, registrasi siswa, endpoint /me,
dan validasi token JWT (akses ditolak tanpa/token salah).
"""
import pytest


class TestAdminLogin:
    """Tes alur login Admin (Guru BK / Satgas PPKSP)."""

    def test_login_admin_valid(self, client, seed_db):
        """Login dengan NIP dan password valid harus mengembalikan access_token."""
        resp = client.post(
            "/api/auth/admin/login",
            data={"username": "198001012026", "password": "admin123"},
        )
        assert resp.status_code == 200
        body = resp.json()
        assert "access_token" in body
        assert body["token_type"] == "bearer"
        assert body["role"] == "admin"

    def test_login_admin_salah_password(self, client, seed_db):
        """Login dengan password salah harus ditolak 401."""
        resp = client.post(
            "/api/auth/admin/login",
            data={"username": "198001012026", "password": "passwordsalah"},
        )
        assert resp.status_code == 401

    def test_login_admin_nip_tidak_ada(self, client, seed_db):
        """Login dengan NIP tidak terdaftar harus ditolak 401."""
        resp = client.post(
            "/api/auth/admin/login",
            data={"username": "999999999999", "password": "admin123"},
        )
        assert resp.status_code == 401

    def test_login_admin_alias_endpoint(self, client, seed_db):
        """Endpoint alias /api/auth/login harus identik hasilnya."""
        resp = client.post(
            "/api/auth/login",
            data={"username": "198001012026", "password": "admin123"},
        )
        assert resp.status_code == 200
        assert "access_token" in resp.json()


class TestSiswaRegister:
    """Tes alur pendaftaran akun siswa baru."""

    def test_register_siswa_baru(self, client, seed_db):
        """Register siswa dengan NISN baru harus berhasil (201)."""
        resp = client.post(
            "/api/auth/siswa/register",
            json={
                "nisn": "9988776655",
                "nama": "Siswa Baru Uji Coba",
                "sekolah": "SMA Negeri 2 Test",
                "password": "password123",
            },
        )
        assert resp.status_code == 201
        body = resp.json()
        assert body["nisn"] == "9988776655"
        assert body["nama"] == "Siswa Baru Uji Coba"
        assert "id" in body
        # Pastikan password tidak dikembalikan
        assert "password" not in body
        assert "password_hash" not in body

    def test_register_siswa_nisn_duplikat(self, client, seed_db):
        """Register dengan NISN yang sudah terdaftar harus ditolak 400."""
        # NISN 1234567890 sudah di-seed di conftest
        resp = client.post(
            "/api/auth/siswa/register",
            json={
                "nisn": "1234567890",
                "nama": "Duplikat",
                "password": "pass1234",
            },
        )
        assert resp.status_code == 400

    def test_register_siswa_nisn_terlalu_pendek(self, client, seed_db):
        """Register dengan NISN < 4 karakter harus ditolak validasi Pydantic (422)."""
        resp = client.post(
            "/api/auth/siswa/register",
            json={"nisn": "ab", "nama": "Siswa X", "password": "pass1234"},
        )
        assert resp.status_code == 422

    def test_register_siswa_password_terlalu_pendek(self, client, seed_db):
        """Register dengan password < 4 karakter harus ditolak (422)."""
        resp = client.post(
            "/api/auth/siswa/register",
            json={"nisn": "1111222233", "nama": "Siswa Y", "password": "abc"},
        )
        assert resp.status_code == 422


class TestSiswaLogin:
    """Tes alur login Siswa."""

    def test_login_siswa_valid(self, client, seed_db):
        """Login dengan NISN dan password valid harus mengembalikan token."""
        resp = client.post(
            "/api/auth/siswa/login",
            json={"nisn": "1234567890", "password": "siswa123"},
        )
        assert resp.status_code == 200
        body = resp.json()
        assert "access_token" in body
        assert body["role"] == "siswa"

    def test_login_siswa_salah_password(self, client, seed_db):
        """Login siswa dengan password salah harus ditolak 401."""
        resp = client.post(
            "/api/auth/siswa/login",
            json={"nisn": "1234567890", "password": "salahtotal"},
        )
        assert resp.status_code == 401

    def test_login_siswa_tidak_terdaftar(self, client, seed_db):
        """Login dengan NISN tidak dikenal harus ditolak 401."""
        resp = client.post(
            "/api/auth/siswa/login",
            json={"nisn": "0000000000", "password": "siswa123"},
        )
        assert resp.status_code == 401


class TestProtectedEndpoints:
    """Tes kontrol akses JWT di endpoint yang dilindungi."""

    def test_akses_me_tanpa_token(self, client):
        """GET /api/auth/me tanpa token harus ditolak 401."""
        resp = client.get("/api/auth/me")
        assert resp.status_code == 401

    def test_akses_me_token_salah(self, client):
        """GET /api/auth/me dengan token palsu harus ditolak 401."""
        resp = client.get(
            "/api/auth/me",
            headers={"Authorization": "Bearer tokenpalsubanget"},
        )
        assert resp.status_code == 401

    def test_akses_me_token_valid(self, client, auth_admin):
        """GET /api/auth/me dengan token admin valid harus mengembalikan profil."""
        resp = client.get("/api/auth/me", headers=auth_admin)
        assert resp.status_code == 200
        body = resp.json()
        assert "nip" in body
        assert "nama" in body
        assert body["nip"] == "198001012026"

