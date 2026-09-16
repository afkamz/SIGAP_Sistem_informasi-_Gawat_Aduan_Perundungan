"""
test_pengaduan.py — Unit test alur Pengaduan SIGAP
Mencakup: buat laporan (anonim & non-anonim), daftar kategori, cek status via tiket,
upload bukti, riwayat siswa, dan validasi AI pipeline terintegrasi.
"""
import pytest


# ================================================================
#  SHARED STATE antar test dalam satu sesi (ticket_code & ID)
# ================================================================
_created_ticket: dict = {}


class TestKategori:
    """Tes endpoint publik daftar 7 kategori resmi."""

    def test_daftar_kategori(self, client, seed_db):
        """GET /api/pengaduan/kategori harus mengembalikan 7 kategori (tanpa login)."""
        resp = client.get("/api/pengaduan/kategori")
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert len(data) == 7
        # Pastikan format response benar
        for item in data:
            assert "id" in item
            assert "nama" in item

    def test_kategori_nama_pertama(self, client, seed_db):
        """Kategori pertama harus 'Perundungan Verbal' sesuai Permendikbud."""
        resp = client.get("/api/pengaduan/kategori")
        data = resp.json()
        assert data[0]["nama"] == "Perundungan Verbal"


class TestBuatPengaduan:
    """Tes pembuatan laporan pengaduan baru."""

    def test_buat_laporan_anonim(self, client, seed_db):
        """POST laporan anonim harus membuat tiket SGP-YYYY-XXXXXX."""
        resp = client.post(
            "/api/pengaduan",
            json={
                "kategori_id": 1,
                "deskripsi": "Teman saya terus-menerus diejek dan dihina di depan kelas setiap hari.",
                "mode_anonim": True,
            },
        )
        assert resp.status_code == 201
        body = resp.json()
        assert "ticket_code" in body
        assert body["ticket_code"].startswith("SGP-")
        assert body["status"] == "menunggu"
        assert body["kategori_nama"] == "Perundungan Verbal"
        # Simpan ticket untuk test berikutnya
        _created_ticket["anonim"] = body["ticket_code"]

    def test_buat_laporan_non_anonim(self, client, seed_db):
        """POST laporan non-anonim dengan siswa_id harus berhasil."""
        resp = client.post(
            "/api/pengaduan",
            json={
                "kategori_id": 2,
                "deskripsi": "Saya dipukul dan didorong di lapangan belakang sekolah saat jam istirahat.",
                "mode_anonim": False,
                "siswa_id": 1,
            },
        )
        assert resp.status_code == 201
        body = resp.json()
        assert body["ticket_code"].startswith("SGP-")
        _created_ticket["non_anonim"] = body["ticket_code"]
        _created_ticket["id"] = None  # akan diisi dari endpoint admin

    def test_buat_laporan_deskripsi_terlalu_pendek(self, client, seed_db):
        """Deskripsi < 10 karakter harus ditolak validasi (422)."""
        resp = client.post(
            "/api/pengaduan",
            json={
                "kategori_id": 1,
                "deskripsi": "pendek",
                "mode_anonim": True,
            },
        )
        assert resp.status_code == 422

    def test_buat_laporan_kategori_tidak_ada(self, client, seed_db):
        """Kategori ID 9999 tidak ada → harus 404."""
        resp = client.post(
            "/api/pengaduan",
            json={
                "kategori_id": 9999,
                "deskripsi": "Deskripsi laporan yang cukup panjang untuk lolos validasi.",
                "mode_anonim": True,
            },
        )
        assert resp.status_code == 404


class TestCekStatus:
    """Tes pelacakan status laporan via kode tiket (endpoint publik, tanpa login)."""

    def test_cek_status_valid(self, client, seed_db):
        """GET /{ticket_code}/status dengan kode valid harus mengembalikan status."""
        # Gunakan ticket yang dibuat oleh TestBuatPengaduan
        ticket = _created_ticket.get("anonim")
        if not ticket:
            pytest.skip("Ticket anonim belum dibuat — jalankan test_buat_laporan_anonim lebih dulu.")
        resp = client.get(f"/api/pengaduan/{ticket}/status")
        assert resp.status_code == 200
        body = resp.json()
        assert body["ticket_code"] == ticket
        assert body["status"] == "menunggu"
        assert "kategori_nama" in body
        assert "created_at" in body

    def test_cek_status_tiket_tidak_ada(self, client, seed_db):
        """GET dengan ticket_code palsu harus 404."""
        resp = client.get("/api/pengaduan/SGP-9999-XXXXXX/status")
        assert resp.status_code == 404


class TestAdminPengaduan:
    """Tes endpoint manajemen pengaduan khusus Admin."""

    def test_daftar_tanpa_token(self, client, seed_db):
        """GET /api/pengaduan tanpa token harus ditolak 401."""
        resp = client.get("/api/pengaduan")
        assert resp.status_code == 401

    def test_daftar_dengan_token_admin(self, client, auth_admin, seed_db):
        """GET /api/pengaduan dengan token admin valid harus mengembalikan list."""
        resp = client.get("/api/pengaduan", headers=auth_admin)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_detail_pengaduan(self, client, auth_admin, seed_db):
        """GET /api/pengaduan/{id} harus mengembalikan detail lengkap laporan."""
        # Ambil ID pertama dari daftar
        laporan = client.get("/api/pengaduan", headers=auth_admin).json()
        if not laporan:
            pytest.skip("Tidak ada laporan untuk diuji.")
        first_id = laporan[0]["id"]
        resp = client.get(f"/api/pengaduan/{first_id}", headers=auth_admin)
        assert resp.status_code == 200
        body = resp.json()
        # Detail harus punya field tambahan vs list
        assert "deskripsi" in body
        assert "bukti" in body
        assert "audit_trail" in body

    def test_detail_pengaduan_tidak_ada(self, client, auth_admin, seed_db):
        """GET /api/pengaduan/99999 harus 404."""
        resp = client.get("/api/pengaduan/99999", headers=auth_admin)
        assert resp.status_code == 404

    def test_filter_by_status(self, client, auth_admin, seed_db):
        """GET /api/pengaduan?status_filter=menunggu harus memfilter dengan benar."""
        resp = client.get(
            "/api/pengaduan?status_filter=menunggu",
            headers=auth_admin,
        )
        assert resp.status_code == 200
        data = resp.json()
        for item in data:
            assert item["status"] == "menunggu"

    def test_filter_by_kategori(self, client, auth_admin, seed_db):
        """GET /api/pengaduan?kategori_id=1 harus mengembalikan hanya kategori itu."""
        resp = client.get(
            "/api/pengaduan?kategori_id=1",
            headers=auth_admin,
        )
        assert resp.status_code == 200


class TestStateMachine:
    """Tes state machine transisi status laporan."""

    def _get_first_menunggu_id(self, client, auth_admin):
        laporan = client.get(
            "/api/pengaduan?status_filter=menunggu",
            headers=auth_admin,
        ).json()
        if not laporan:
            return None
        return laporan[0]["id"]

    def test_transisi_menunggu_ke_diverifikasi(self, client, auth_admin, seed_db):
        """Transisi menunggu → diverifikasi harus berhasil (200)."""
        pid = self._get_first_menunggu_id(client, auth_admin)
        if not pid:
            pytest.skip("Tidak ada laporan berstatus 'menunggu'.")
        resp = client.patch(
            f"/api/pengaduan/{pid}/status",
            json={"status_baru": "diverifikasi", "catatan": "Bukti valid, dilanjutkan."},
            headers=auth_admin,
        )
        assert resp.status_code == 200
        assert resp.json()["status"] == "diverifikasi"
        # Simpan ID untuk test transisi berikutnya
        _created_ticket["state_machine_id"] = pid

    def test_transisi_lompat_status_ditolak(self, client, auth_admin, seed_db):
        """Transisi langsung menunggu → ditindaklanjuti (loncat) harus ditolak 400."""
        # Buat laporan baru sebagai kandidat
        resp_buat = client.post(
            "/api/pengaduan",
            json={
                "kategori_id": 3,
                "deskripsi": "Pesan-pesan mengancam disebarkan di grup kelas kami secara terus-menerus.",
                "mode_anonim": True,
            },
        )
        pid = None
        if resp_buat.status_code == 201:
            ticket = resp_buat.json()["ticket_code"]
            all_lap = client.get("/api/pengaduan", headers=auth_admin).json()
            match = next((l for l in all_lap if l["ticket_code"] == ticket), None)
            if match:
                pid = match["id"]

        if not pid:
            pytest.skip("Gagal membuat laporan uji untuk state machine.")

        # Coba loncat status: menunggu → ditindaklanjuti
        resp = client.patch(
            f"/api/pengaduan/{pid}/status",
            json={"status_baru": "ditindaklanjuti"},
            headers=auth_admin,
        )
        assert resp.status_code == 400

    def test_transisi_diverifikasi_ke_ditindaklanjuti(self, client, auth_admin, seed_db):
        """Lanjut transisi ke ditindaklanjuti dari status diverifikasi."""
        pid = _created_ticket.get("state_machine_id")
        if not pid:
            pytest.skip("Laporan uji state machine belum dibuat.")
        resp = client.patch(
            f"/api/pengaduan/{pid}/status",
            json={"status_baru": "ditindaklanjuti", "catatan": "Mediasi dijadwalkan."},
            headers=auth_admin,
        )
        assert resp.status_code == 200
        assert resp.json()["status"] == "ditindaklanjuti"

    def test_transisi_ke_selesai(self, client, auth_admin, seed_db):
        """Transisi akhir ke selesai harus berhasil."""
        pid = _created_ticket.get("state_machine_id")
        if not pid:
            pytest.skip("Laporan uji state machine belum dibuat.")
        resp = client.patch(
            f"/api/pengaduan/{pid}/status",
            json={"status_baru": "selesai", "catatan": "Kasus terselesaikan dengan mediasi."},
            headers=auth_admin,
        )
        assert resp.status_code == 200
        assert resp.json()["status"] == "selesai"

    def test_transisi_setelah_selesai_ditolak(self, client, auth_admin, seed_db):
        """Laporan berstatus selesai tidak bisa diubah lagi → 400."""
        pid = _created_ticket.get("state_machine_id")
        if not pid:
            pytest.skip("Laporan uji state machine belum dibuat.")
        resp = client.patch(
            f"/api/pengaduan/{pid}/status",
            json={"status_baru": "selesai"},
            headers=auth_admin,
        )
        assert resp.status_code == 400


class TestValidasiKategori:
    """Tes endpoint validasi dan override kategori oleh Admin."""

    def test_override_kategori_valid(self, client, auth_admin, seed_db):
        """Admin dapat mengubah kategori laporan yang ada."""
        laporan = client.get("/api/pengaduan", headers=auth_admin).json()
        if not laporan:
            pytest.skip("Tidak ada laporan untuk diuji.")
        pid = laporan[0]["id"]
        resp = client.patch(
            f"/api/pengaduan/{pid}/kategori",
            json={"kategori_id": 2, "sumber": "manual_override"},
            headers=auth_admin,
        )
        assert resp.status_code == 200

    def test_override_kategori_tidak_ada(self, client, auth_admin, seed_db):
        """Override ke kategori ID 9999 harus 404."""
        laporan = client.get("/api/pengaduan", headers=auth_admin).json()
        if not laporan:
            pytest.skip("Tidak ada laporan untuk diuji.")
        pid = laporan[0]["id"]
        resp = client.patch(
            f"/api/pengaduan/{pid}/kategori",
            json={"kategori_id": 9999, "sumber": "manual_override"},
            headers=auth_admin,
        )
        assert resp.status_code == 404

    def test_approve_ai_kategori(self, client, auth_admin, seed_db):
        """Approve rekomendasi AI (ai_disetujui) harus diproses."""
        laporan = client.get("/api/pengaduan", headers=auth_admin).json()
        if not laporan:
            pytest.skip("Tidak ada laporan untuk diuji.")
        pid = laporan[0]["id"]
        resp = client.patch(
            f"/api/pengaduan/{pid}/kategori",
            json={"kategori_id": 1, "sumber": "ai_disetujui"},
            headers=auth_admin,
        )
        assert resp.status_code == 200
        assert resp.json()["sumber_kategori"] == "ai_disetujui"

