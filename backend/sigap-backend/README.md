# SIGAP Backend Services (FastAPI + AI Pipeline)

Backend REST API untuk **Sistem Informasi Guna Penanganan Aduan Publik (SIGAP)** di lingkungan satuan pendidikan (mengacu pada Permendikbudristek No. 46 Tahun 2023).

---

## Fitur Utama Backend

1. **Dual Database Engine (SQLite & MySQL)**:
   - *Default lokal*: Langsung menggunakan file `sigap.db` (SQLite) tanpa perlu menginstal atau menyalakan server MySQL terpisah.
   - *Production*: Cukup ubah `DATABASE_URL` di `.env` ke `mysql+pymysql://user:pass@host:3306/sigap_db`.
2. **Otentikasi & RBAC (Role-Based Access Control)**:
   - Admin (Guru BK / Satgas PPKS) via NIP & JWT Bearer token.
   - Siswa via NISN & JWT Bearer token (laporan tetap dapat dikirim secara **anonim penuh** tanpa login).
3. **Modul AI Pipeline Terintegrasi (`app/ai/`)**:
   - **Ekstraksi Embedding**: Didukung model IndoBERT transformer dengan *lightweight semantic linguistic vectorizer* berbobot IDF.
   - **Rekomendasi Kategori Otomatis**: Cosine Similarity terhadap 7 Centroid Kategori resmi Permendikbudristek No. 46/2023 + Confidence Score (0.00 – 1.00).
   - **Klasterisasi Kasus Berulang (HDBSCAN)**: Mendeteksi keterkaitan laporan serupa secara otomatis (`cluster_label`) serta menandai kasus berdiri sendiri (`is_noise = True`).
4. **Alur Pelaporan & State Machine Kokoh**:
   - Transisi status: `menunggu -> diverifikasi -> ditindaklanjuti -> selesai` (dilindungi aturan tidak boleh lompat/mundur).
   - Pencatatan **Audit Trail** otomatis untuk setiap perubahan status dan override kategori oleh admin.
   - Dukungan upload bukti foto/dokumen (`/api/pengaduan/{ticket_code}/bukti`).
5. **Dashboard Analytics & External Benchmark**:
   - Agregasi kasus sekolah berdasarkan status, kategori, dan mode pelaporan.
   - Ringkasan klaster insiden berulang.
   - Integrasi data pembanding makro daerah & nasional (Aceh Open Data, DKP3A Kaltim, KemenPPPA, PPKS Kemensos).

---

## Struktur Folder

```text
backend/sigap-backend/
├── app/
│   ├── ai/                      -> Modul AI (IndoBERT, Cosine Similarity, HDBSCAN)
│   │   ├── classifier.py        -> Klasifikasi 7 Kategori & skor confidence
│   │   ├── clustering.py        -> HDBSCAN & deteksi pola berulang
│   │   ├── embedder.py          -> Ekstraksi vektor embedding
│   │   ├── preprocessor.py      -> Pembersihan & normalisasi teks narasi
│   │   └── service.py           -> Penghubung AI pipeline ke lifecycle pengaduan
│   ├── core/
│   │   └── security.py          -> JWT generator & bcrypt password hasher
│   ├── data/
│   │   └── etl_external.py      -> Pipeline ETL pembersih data statistik pemerintah
│   ├── models/                  -> Skema tabel SQLAlchemy (Pengaduan, Kategori, Admin, dll.)
│   ├── routers/
│   │   ├── auth.py              -> Endpoint login/register Admin & Siswa
│   │   ├── dashboard.py         -> Endpoint analitik, klaster, & benchmark eksternal
│   │   └── pengaduan.py         -> Endpoint pengaduan siswa, tracking, & review admin
│   ├── schemas/                 -> Model validasi data input/output Pydantic v2
│   ├── config.py                -> Konfigurasi pembaca .env
│   ├── database.py              -> Engine session database (SQLite / MySQL)
│   ├── main.py                  -> Entrypoint aplikasi FastAPI & CORS
│   └── seed_kategori.py         -> Seeder otomatis 7 kategori, akun demo, & ETL data
├── uploads/                     -> Direktori penyimpanan berkas bukti pendukung
├── .env.example                 -> Contoh konfigurasi variabel lingkungan
├── .env                         -> File konfigurasi aktif
└── requirements.txt             -> Daftar dependensi Python
```

---

## Panduan Menjalankan Backend

### 1. Buat Virtual Environment & Install Dependensi
```bash
cd backend/sigap-backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Inisialisasi Database & Seeder Awal
Jalankan seeder satu kali untuk membuat seluruh tabel, mengisi 7 kategori resmi, akun admin demo, akun siswa demo, dan mengimpor data eksternal:
```bash
python -m app.seed_kategori
```

*Akun demo yang otomatis dibuat:*
* **Admin (Guru BK)**: `NIP: 198001012026` / `password: admin123`
* **Siswa**: `NISN: 1234567890` / `password: siswa123`

### 3. Menjalankan Server FastAPI
```bash
uvicorn app.main:app --reload --port 8000
```
Buka dokumentasi interaktif Swagger di: **http://127.0.0.1:8000/docs**

---

## Ringkasan Endpoint Utama

| Method | Endpoint | Hak Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/admin/login` | Publik | Login NIP Admin Guru BK/Satgas |
| `POST` | `/api/auth/siswa/register` | Publik | Registrasi akun siswa baru |
| `POST` | `/api/auth/siswa/login` | Publik | Login akun siswa |
| `GET` | `/api/auth/me` | Admin | Profil admin yang sedang login |
| `GET` | `/api/pengaduan/kategori` | Publik | Daftar 7 kategori resmi |
| `POST` | `/api/pengaduan` | Siswa/Publik | Buat laporan aduan (otomatis inferensi AI) |
| `POST` | `/api/pengaduan/{ticket}/bukti` | Siswa/Publik | Upload file bukti foto/dokumen |
| `GET` | `/api/pengaduan/{ticket}/status` | Publik | Lacak status laporan via kode tiket |
| `GET` | `/api/pengaduan/siswa/{id}/riwayat` | Siswa | Riwayat laporan milik siswa login |
| `GET` | `/api/pengaduan` | Admin | Daftar semua pengaduan + filter |
| `GET` | `/api/pengaduan/{id}` | Admin | Detail laporan + AI recommend + audit trail |
| `PATCH`| `/api/pengaduan/{id}/status` | Admin | Update status penanganan berurutan |
| `PATCH`| `/api/pengaduan/{id}/kategori` | Admin | Validasi / override kategori laporan |
| `GET` | `/api/dashboard/summary` | Admin | Metrik statistik umum laporan |
| `GET` | `/api/dashboard/clusters` | Admin | Visualisasi klaster insiden berulang (HDBSCAN) |
| `GET` | `/api/dashboard/ai-metrics` | Admin | Metrik performa validasi AI |
| `GET` | `/api/dashboard/external-comparison`| Admin | Komparasi data tren agregat eksternal |

---

## Menjalankan Unit Test

### Prasyarat
Pastikan `pytest` dan `httpx` sudah terinstal (sudah ada di `requirements.txt`):
```bash
pip install -r requirements.txt
```

### Menjalankan Seluruh Test Suite
```bash
# Dari direktori backend/sigap-backend/
pytest tests/ -v
```

### Menjalankan Test Spesifik
```bash
# Hanya test autentikasi
pytest tests/test_auth.py -v

# Hanya test pengaduan & state machine
pytest tests/test_pengaduan.py -v

# Hanya test dashboard analytics
pytest tests/test_dashboard.py -v

# Test end-to-end (simulasi alur lengkap)
pytest test_e2e.py -v
```

### Cakupan Test
| File | Cakupan |
| :--- | :--- |
| `tests/test_auth.py` | Login admin/siswa, register, JWT invalid, endpoint `/me` |
| `tests/test_pengaduan.py` | Daftar kategori, buat laporan, cek status, state machine, override kategori |
| `tests/test_dashboard.py` | Summary, clusters, AI metrics, external comparison + proteksi auth |
| `test_e2e.py` | Alur lengkap: register → submit → verifikasi → approve AI → dashboard |

> **Catatan**: Semua test menggunakan SQLite in-memory terpisah dari database produksi `sigap.db`. Tidak ada data produksi yang terpengaruh.

---

## Sinkronisasi dengan Frontend

Backend sudah dikonfigurasi CORS untuk mengizinkan koneksi dari frontend lokal. File [`Frontend/assets/js/api.js`](../../Frontend/assets/js/api.js) menyediakan API client lengkap untuk digunakan di JavaScript frontend.

### Cara Menggunakan API Client di Frontend
```javascript
// Di file JS frontend (gunakan import ES module)
import { apiClient, tokenManager } from './api.js';

// Login Admin
const { access_token, role } = await apiClient.loginAdmin('198001012026', 'admin123');
tokenManager.save(access_token, role);

// Buat Laporan Anonim
const laporan = await apiClient.buatPengaduan({
  kategori_id: 1,
  deskripsi: 'Deskripsi kronologi kejadian...',
  mode_anonim: true
});
console.log(laporan.ticket_code); // SGP-2026-XXXXXX

// Cek Status (tanpa login)
const status = await apiClient.cekStatus('SGP-2026-XXXXXX');

// Dashboard (butuh token admin)
const token = tokenManager.getToken();
const summary = await apiClient.getDashboardSummary(token);
```

### Konfigurasi CORS
Untuk development, backend sudah dikonfigurasi `allow_origins=["*"]`.
Untuk **production**, ganti di `app/main.py`:
```python
allow_origins=["https://domain-frontend-anda.com"]
```

---

## Dokumentasi API Interaktif (Swagger)

Setelah server berjalan, buka: **http://127.0.0.1:8000/docs**

- Semua endpoint terdokumentasi lengkap dengan contoh request/response.
- Endpoint yang membutuhkan auth: klik **"Authorize"** → masukkan token Bearer.
- Tersedia juga antarmuka ReDoc di: **http://127.0.0.1:8000/redoc**

