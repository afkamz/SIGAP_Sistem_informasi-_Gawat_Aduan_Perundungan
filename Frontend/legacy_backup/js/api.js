/**
 * SIGAP - API Client untuk Sinkronisasi dengan Backend FastAPI
 * File ini menyediakan fungsi-fungsi untuk berkomunikasi dengan
 * REST API Backend di http://localhost:8000/api
 *
 * Cara penggunaan:
 *   import { apiClient } from './api.js';
 *   const token = await apiClient.loginAdmin('198001012026', 'admin123');
 */

// Base URL backend FastAPI (ganti sesuai environment production)
export const API_BASE_URL = 'http://localhost:8000/api';

// ----------------------------------------------------------------
// Helper: Buat header Authorization dengan Bearer token
// ----------------------------------------------------------------
function authHeader(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// ----------------------------------------------------------------
// Helper: Handle response API → throw Error jika gagal
// ----------------------------------------------------------------
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

// ================================================================
//  API CLIENT SIGAP — Fungsi per modul
// ================================================================
export const apiClient = {

  // ==============================================================
  //  AUTH
  // ==============================================================

  /**
   * Login Admin (Guru BK / Satgas PPKSP)
   * @param {string} nip
   * @param {string} password
   * @returns {Promise<{access_token: string, role: string}>}
   */
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

  /**
   * Register akun Siswa baru
   * @param {{nisn: string, nama: string, sekolah?: string, password: string}} payload
   * @returns {Promise<{id: number, nisn: string, nama: string}>}
   */
  async registerSiswa(payload) {
    const response = await fetch(`${API_BASE_URL}/auth/siswa/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  /**
   * Login Siswa via NISN
   * @param {string} nisn
   * @param {string} password
   * @returns {Promise<{access_token: string, role: string}>}
   */
  async loginSiswa(nisn, password) {
    const response = await fetch(`${API_BASE_URL}/auth/siswa/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nisn, password }),
    });
    return handleResponse(response);
  },

  /**
   * Profil admin yang sedang login
   * @param {string} token
   */
  async getMe(token) {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: authHeader(token),
    });
    return handleResponse(response);
  },

  // ==============================================================
  //  KATEGORI
  // ==============================================================

  /**
   * Daftar 7 kategori resmi Permendikbudristek No. 46/2023
   * @returns {Promise<Array<{id: number, nama: string}>>}
   */
  async getKategori() {
    const response = await fetch(`${API_BASE_URL}/pengaduan/kategori`);
    return handleResponse(response);
  },

  // ==============================================================
  //  PENGADUAN (Siswa / Publik)
  // ==============================================================

  /**
   * Buat laporan pengaduan baru (AI pipeline berjalan otomatis di backend)
   * @param {{kategori_id: number, deskripsi: string, mode_anonim?: boolean, siswa_id?: number}} payload
   * @returns {Promise<{ticket_code: string, status: string, kategori_nama: string, created_at: string}>}
   */
  async buatPengaduan(payload) {
    const response = await fetch(`${API_BASE_URL}/pengaduan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  /**
   * Upload bukti pendukung ke laporan (multipart/form-data)
   * @param {string} ticketCode
   * @param {File} file
   */
  async uploadBukti(ticketCode, file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(
      `${API_BASE_URL}/pengaduan/${ticketCode}/bukti`,
      { method: 'POST', body: formData }
    );
    return handleResponse(response);
  },

  /**
   * Lacak status laporan via kode tiket (tanpa login, endpoint publik)
   * @param {string} ticketCode
   */
  async cekStatus(ticketCode) {
    const response = await fetch(
      `${API_BASE_URL}/pengaduan/${encodeURIComponent(ticketCode)}/status`
    );
    return handleResponse(response);
  },

  /**
   * Riwayat laporan milik siswa yang sedang login
   * @param {number} siswaId
   * @param {string} token
   */
  async riwayatSiswa(siswaId, token) {
    const response = await fetch(
      `${API_BASE_URL}/pengaduan/siswa/${siswaId}/riwayat`,
      { headers: authHeader(token) }
    );
    return handleResponse(response);
  },

  // ==============================================================
  //  PENGADUAN (Admin — wajib token Bearer)
  // ==============================================================

  /**
   * Daftar semua pengaduan — opsional filter status & kategori
   * @param {string} token
   * @param {{status?: string, kategori_id?: number}} opts
   */
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

  /**
   * Detail laporan pengaduan lengkap (termasuk bukti & audit trail)
   * @param {number} id
   * @param {string} token
   */
  async detailPengaduan(id, token) {
    const response = await fetch(`${API_BASE_URL}/pengaduan/${id}`, {
      headers: authHeader(token),
    });
    return handleResponse(response);
  },

  /**
   * Update status laporan (state machine: hanya boleh maju satu tahap)
   * Status valid: menunggu → diverifikasi → ditindaklanjuti → selesai
   * @param {number} id
   * @param {string} statusBaru  — salah satu dari enum StatusLaporan
   * @param {string|null} catatan
   * @param {string} token
   */
  async ubahStatus(id, statusBaru, catatan, token) {
    const response = await fetch(`${API_BASE_URL}/pengaduan/${id}/status`, {
      method: 'PATCH',
      headers: authHeader(token),
      body: JSON.stringify({ status_baru: statusBaru, catatan }),
    });
    return handleResponse(response);
  },

  /**
   * Validasi / Override kategori laporan oleh Admin
   * @param {number} id
   * @param {number} kategoriId
   * @param {'ai_disetujui'|'manual_override'} sumber
   * @param {string} token
   */
  async validasiKategori(id, kategoriId, sumber, token) {
    const response = await fetch(`${API_BASE_URL}/pengaduan/${id}/kategori`, {
      method: 'PATCH',
      headers: authHeader(token),
      body: JSON.stringify({ kategori_id: kategoriId, sumber }),
    });
    return handleResponse(response);
  },

  // ==============================================================
  //  DASHBOARD (Admin — wajib token Bearer)
  // ==============================================================

  /** Ringkasan metrik utama dashboard admin */
  async getDashboardSummary(token) {
    const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
      headers: authHeader(token),
    });
    return handleResponse(response);
  },

  /** Statistik klasterisasi HDBSCAN (kejadian berulang) */
  async getDashboardClusters(token) {
    const response = await fetch(`${API_BASE_URL}/dashboard/clusters`, {
      headers: authHeader(token),
    });
    return handleResponse(response);
  },

  /** Metrik performa AI (confidence score & tingkat validasi admin) */
  async getDashboardAIMetrics(token) {
    const response = await fetch(`${API_BASE_URL}/dashboard/ai-metrics`, {
      headers: authHeader(token),
    });
    return handleResponse(response);
  },

  /** Data benchmark eksternal daerah & nasional (Aceh, Kaltim, PPKA, PPA) */
  async getDashboardExternalComparison(token) {
    const response = await fetch(`${API_BASE_URL}/dashboard/external-comparison`, {
      headers: authHeader(token),
    });
    return handleResponse(response);
  },
};

// ================================================================
//  TOKEN MANAGER — Simpan & ambil JWT dari localStorage
// ================================================================
const TOKEN_KEY = 'SIGAP_AUTH_TOKEN';
const ROLE_KEY  = 'SIGAP_AUTH_ROLE';

export const tokenManager = {
  /** Simpan token dan role setelah login berhasil */
  save(token, role) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
  },
  /** Ambil access token yang tersimpan */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  /** Ambil role pengguna ('admin' | 'siswa') */
  getRole() {
    return localStorage.getItem(ROLE_KEY);
  },
  /** Cek apakah pengguna sudah login */
  isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
  },
  /** Hapus token saat logout */
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  },
};

