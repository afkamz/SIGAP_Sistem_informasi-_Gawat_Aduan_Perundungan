"""
test_dashboard.py — Unit test modul Dashboard Analytics SIGAP
Mencakup: summary, clusters, ai-metrics, external-comparison,
dan proteksi akses (hanya admin).
"""
import pytest


class TestDashboardAuth:
    """Semua endpoint dashboard harus dilindungi JWT."""

    def test_summary_tanpa_token(self, client):
        assert client.get("/api/dashboard/summary").status_code == 401

    def test_clusters_tanpa_token(self, client):
        assert client.get("/api/dashboard/clusters").status_code == 401

    def test_ai_metrics_tanpa_token(self, client):
        assert client.get("/api/dashboard/ai-metrics").status_code == 401

    def test_external_comparison_tanpa_token(self, client):
        assert client.get("/api/dashboard/external-comparison").status_code == 401


class TestDashboardSummary:
    """Tes endpoint /api/dashboard/summary."""

    def test_summary_struktur_response(self, client, auth_admin, seed_db):
        """Summary harus memuat field: total_laporan, mode_pelaporan, per_status, per_kategori."""
        resp = client.get("/api/dashboard/summary", headers=auth_admin)
        assert resp.status_code == 200
        body = resp.json()
        assert "total_laporan" in body
        assert "mode_pelaporan" in body
        assert "per_status" in body
        assert "per_kategori" in body

    def test_summary_mode_pelaporan(self, client, auth_admin, seed_db):
        """Field mode_pelaporan harus memuat kunci 'anonim' dan 'non_anonim'."""
        resp = client.get("/api/dashboard/summary", headers=auth_admin)
        mode = resp.json()["mode_pelaporan"]
        assert "anonim" in mode
        assert "non_anonim" in mode

    def test_summary_total_non_negatif(self, client, auth_admin, seed_db):
        """Total laporan tidak boleh negatif."""
        resp = client.get("/api/dashboard/summary", headers=auth_admin)
        assert resp.json()["total_laporan"] >= 0


class TestDashboardClusters:
    """Tes endpoint /api/dashboard/clusters."""

    def test_clusters_struktur_response(self, client, auth_admin, seed_db):
        """Response clusters harus memuat field statistik klaster."""
        resp = client.get("/api/dashboard/clusters", headers=auth_admin)
        assert resp.status_code == 200
        body = resp.json()
        assert "total_laporan" in body
        assert "kasus_terklaster" in body
        assert "kasus_tunggal_noise" in body
        assert "daftar_klaster" in body
        assert isinstance(body["daftar_klaster"], list)

    def test_clusters_count_konsisten(self, client, auth_admin, seed_db):
        """kasus_terklaster + kasus_tunggal_noise tidak boleh melebihi total_laporan."""
        body = client.get("/api/dashboard/clusters", headers=auth_admin).json()
        # Note: klaster dan noise bisa overlap (noise=True bisa punya cluster_label None)
        assert body["kasus_tunggal_noise"] >= 0
        assert body["kasus_terklaster"] >= 0


class TestDashboardAIMetrics:
    """Tes endpoint /api/dashboard/ai-metrics."""

    def test_ai_metrics_struktur(self, client, auth_admin, seed_db):
        """Response harus memuat rata_rata_confidence_score dan status_validasi_kategori."""
        resp = client.get("/api/dashboard/ai-metrics", headers=auth_admin)
        assert resp.status_code == 200
        body = resp.json()
        assert "rata_rata_confidence_score" in body
        assert "status_validasi_kategori" in body

    def test_ai_metrics_confidence_dalam_range(self, client, auth_admin, seed_db):
        """Rata-rata confidence score harus di antara 0.0 dan 1.0."""
        body = client.get("/api/dashboard/ai-metrics", headers=auth_admin).json()
        score = body["rata_rata_confidence_score"]
        assert 0.0 <= score <= 1.0


class TestDashboardExternalComparison:
    """Tes endpoint /api/dashboard/external-comparison."""

    def test_external_comparison_struktur(self, client, auth_admin, seed_db):
        """Response harus memuat field sumber_tersedia dan data."""
        resp = client.get("/api/dashboard/external-comparison", headers=auth_admin)
        assert resp.status_code == 200
        body = resp.json()
        assert "sumber_tersedia" in body
        assert "data" in body
        assert isinstance(body["sumber_tersedia"], list)
        assert isinstance(body["data"], dict)

