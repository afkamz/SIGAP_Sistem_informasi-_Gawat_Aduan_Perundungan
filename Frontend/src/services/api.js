/**
 * SIGAP - API Service
 * Berkomunikasi dengan FastAPI backend (http://localhost:8000/api)
 */

export const API_BASE_URL = 'http://localhost:8000/api';

function authHeader(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = `HTTP ${response.status}`;
    try {
      const errBody = await response.json();
      errorMsg = errBody.detail || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export const api = {
  // Auth
  async loginAdmin(nip, password) {
    const formData = new URLSearchParams();
    formData.append('username', nip);
    formData.append('password', password);
    const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    return handleResponse(response);
  },

  async registerSiswa(payload) {
    const response = await fetch(`${API_BASE_URL}/auth/siswa/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  async loginSiswa(nisn, password) {
    const response = await fetch(`${API_BASE_URL}/auth/siswa/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nisn, password }),
    });
    return handleResponse(response);
  },

  async getMe(token) {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: authHeader(token),
    });
    return handleResponse(response);
  },

  // Kategori
  async getKategori() {
    const response = await fetch(`${API_BASE_URL}/pengaduan/kategori`);
    return handleResponse(response);
  },

  // Pengaduan Siswa
  async buatPengaduan(payload) {
    const response = await fetch(`${API_BASE_URL}/pengaduan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  async uploadBukti(ticketCode, file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/pengaduan/${ticketCode}/bukti`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },

  async cekStatus(ticketCode) {
    const response = await fetch(
      `${API_BASE_URL}/pengaduan/${encodeURIComponent(ticketCode)}/status`
    );
    return handleResponse(response);
  },

  async riwayatSiswa(siswaId, token) {
    const response = await fetch(`${API_BASE_URL}/pengaduan/siswa/${siswaId}/riwayat`, {
      headers: authHeader(token),
    });
    return handleResponse(response);
  },

  // Pengaduan Admin
  async daftarPengaduan(token, opts = {}) {
    const params = new URLSearchParams();
    if (opts.status) params.append('status_filter', opts.status);
    if (opts.kategori_id) params.append('kategori_id', String(opts.kategori_id));
    const qs = params.toString() ? `?${params}` : '';
    const response = await fetch(`${API_BASE_URL}/pengaduan${qs}`, {
      headers: authHeader(token),
    });
    return handleResponse(response);
  },

  async detailPengaduan(id, token) {
    const response = await fetch(`${API_BASE_URL}/pengaduan/${id}`, {
      headers: authHeader(token),
    });
    return handleResponse(response);
  },

  async ubahStatus(id, statusBaru, catatan, token) {
    const response = await fetch(`${API_BASE_URL}/pengaduan/${id}/status`, {
      method: 'PATCH',
      headers: authHeader(token),
      body: JSON.stringify({ status_baru: statusBaru, catatan }),
    });
    return handleResponse(response);
  },

  async validasiKategori(id, kategoriId, sumber, token) {
    const response = await fetch(`${API_BASE_URL}/pengaduan/${id}/kategori`, {
      method: 'PATCH',
      headers: authHeader(token),
      body: JSON.stringify({ kategori_id: kategoriId, sumber }),
    });
    return handleResponse(response);
  },

  // Dashboard
  async getDashboardSummary(token) {
    const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
      headers: authHeader(token),
    });
    return handleResponse(response);
  },

  async getDashboardClusters(token) {
    const response = await fetch(`${API_BASE_URL}/dashboard/clusters`, {
      headers: authHeader(token),
    });
    return handleResponse(response);
  },

  async getDashboardAIMetrics(token) {
    const response = await fetch(`${API_BASE_URL}/dashboard/ai-metrics`, {
      headers: authHeader(token),
    });
    return handleResponse(response);
  },

  async getDashboardExternalComparison(token) {
    const response = await fetch(`${API_BASE_URL}/dashboard/external-comparison`, {
      headers: authHeader(token),
    });
    return handleResponse(response);
  },
};

