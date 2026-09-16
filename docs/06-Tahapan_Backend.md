# Roadmap & Tahapan Pengembangan Backend SIGAP
*(Sistem Informasi & Pengaduan Kekerasan di Satuan Pendidikan)*

Dokumen ini merupakan panduan kerja terstruktur dan acuan progres bertahap untuk pengembangan Backend Services sistem SIGAP, mengacu pada arsitektur resmi di `Arsitektur_Sistem_SIGAP.md`, `PRD.md`, dan kesesuaian dataset pada direktori `dataset/`.

Dokumen ini diperbarui secara berkala (`[x]` untuk selesai, `[ ]` untuk dalam proses/belum) setiap kali tahapan selesai diimplementasikan.

---

## Ringkasan Arsitektur Backend Target

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND SERVICES (PYTHON 3)                     │
│                                                                        │
│   ┌────────────────────────┐         ┌──────────────────────────────┐  │
│   │    FastAPI Gateway     │◄───────►│     Basis Data Relasional    │  │
│   │  • REST API Endpoints  │         │  • MySQL / SQLite Dual Engine│  │
│   │  • JWT & Role RBAC     │         │  • Users, Pengaduan, Status  │  │
│   │  • Pydantic Validation │         │  • Kategori, Bukti, Audit    │  │
│   │  • Audit Trail Logger  │         │  • External Benchmark Data   │  │
│   └───────────┬────────────┘         └──────────────────────────────┘  │
│               │                                                        │
│               ▼                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                     MODUL AI PIPELINE (app/ai/)                │   │
│   │                                                                │   │
│   │  1. Preprocessing & Text Normalization                         │   │
│   │  2. Embedding: IndoBERT / Linguistic Stemmed TF-IDF            │   │
│   │  3. Cosine Similarity vs 7 Centroid Kategori Permendikbud      │   │
│   │     └── Output: Rekomendasi Kategori + Confidence Score (0-1)  │   │
│   │  4. HDBSCAN Density-Based Spatial Clustering                   │   │
│   │     └── Output: Cluster ID (pola kejadian berulang) / Noise    │   │
│   └────────────────────────────────────────────────────────────────┘   │
│               ▲                                                        │
│               │                                                        │
│   ┌───────────┴────────────────────────────────────────────────────┐   │
│   │               EXTERNAL DATA & SEED INTEGRATION                 │   │
│   │  • Parser & Normalizer CSV dataset/                            │   │
│   │  • Seed 7 Kategori Resmi Permendikbudristek No. 46/2023        │   │
│   │  • Seed Prototipe Narasi Pengaduan (Centroid Builder)          │   │
│   │  • ETL Data Agregat Daerah/Nasional (Aceh, Kaltim, PPKS, PPA)  │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Status Progres Keseluruhan

| Fase | Deskripsi Tahapan | Status |
| :--- | :--- | :---: |
| **Fase 1** | **Audit, Pembersihan, & Penyelarasan Dataset** | ✅ **Selesai** |
| **Fase 2** | **Konfigurasi Lingkungan & Penguatan Basis Data Core** | ✅ **Selesai** |
| **Fase 3** | **API Core & Business Logic (Siswa, Admin, Audit Trail)** | ✅ **Selesai** |
| **Fase 4** | **Pembangunan Modul AI Pipeline (IndoBERT + Cosine + HDBSCAN)** | ✅ **Selesai** |
| **Fase 5** | **ETL External Data & Dashboard Analytics Service** | ✅ **Selesai** |
| **Fase 6** | **Integrasi End-to-End, Testing & Sinkronisasi Frontend** | ✅ **Selesai** |

---

## Rincian Tahapan & Checklist Pengerjaan

### FASE 1: Audit, Pembersihan, & Penyelarasan Dataset
> **Tujuan**: Memastikan data teks dan data agregat statistik pada `dataset/` siap dikonsumsi oleh modul AI dan Dashboard Analytics.

- [x] **1.1. Audit & Profiling Dataset Eksisting**:
  - `combined_dataset.csv` (2.066 baris, sentimen & binary cyberbullying).
  - `data.csv` (13.169 baris, multi-label Twitter Hate Speech & Abusive).
  - `datasetmediasosial.csv` (650 baris, delimiter titik-koma, binary cyberbullying).
  - Data agregat makro: `kasus-kekerasan-terhadap-anak-di-aceh...csv`, `data-prioritas-nasional-2023...kaltim...csv`, `jumlah-laporan...csv`, `ppks-anak...csv`.
- [x] **1.2. Evaluasi Kesenjangan (Gap Analysis)**:
  - Dataset teks yang ada belum memiliki label **7 Kategori Resmi Permendikbudristek No. 46/2023**.
  - Gaya bahasa Twitter media sosial berbeda dari kronologi narasi laporan sekolah siswa.
- [x] **1.3. Pembuatan Dataset Seed Narasi Kasus Sekolah (7 Kategori)**:
  - Dibuat di `dataset/seed_narasi_7_kategori.json`: korpus representatif narasi pengaduan sekolah untuk 7 kategori Permendikbudristek No. 46/2023.
- [x] **1.4. Pre-processing & Pembersihan Data Eksternal**:
  - Dibuat di `app/data/etl_external.py`: normalisasi delimiter (`;` vs `,`), perbaikan header, dan penanganan missing values untuk data Aceh, Kaltim, dan Nasional.

---

### FASE 2: Konfigurasi Lingkungan & Penguatan Basis Data Core
> **Tujuan**: Menyiapkan environment backend yang kokoh, konfigurasi `.env`, dan tabel basis data lengkap.

- [x] **2.1. Environment & Dependencies Setup**:
  - Dibuat file `.env` dan `.env.example` dengan konfigurasi siap pakai.
  - Pembaruan `requirements.txt` dengan opsi modular dan library ML opsional.
- [x] **2.2. Pemodelan Database Relasional (SQLAlchemy)**:
  - Model `Siswa` (identitas pelapor terdaftar, kelas, NISN).
  - Model `Admin` (Guru BK / Satgas PPKS, NIP, peran RBAC).
  - Model `Kategori` (7 Kategori Permendikbudristek No. 46/2023).
  - Model `Pengaduan` (ticket_code unik, status, deskripsi, mode anonim, relasi FK, embedding, cluster_label, is_noise).
  - Model `BuktiPendukung` (file path, mime type, upload timestamp).
  - Model `AuditTrail` (pencatatan histori perubahan status & override kategori).
  - Model `ExternalBenchmark` (`app/models/external_benchmark.py` untuk data pembanding makro).
  - Konfigurasi `app/database.py` adaptif mendukung **SQLite** (lokal) dan **MySQL** (produksi).
- [x] **2.3. Seeding Database Otomatis**:
  - `app/seed_kategori.py` diperbarui untuk otomatis mengisi 7 kategori resmi, akun admin demo, akun siswa demo, dan mengeksekusi ETL data eksternal.

---

### FASE 3: API Core & Business Logic (Siswa, Admin, Audit Trail)
> **Tujuan**: Memastikan fungsionalitas CRUD dan alur pelaporan berjalan sempurna sesuai PRD.

- [x] **3.1. Modul Otentikasi & Otorisasi (Auth & RBAC)**:
  - Login Admin Guru BK / Satgas (`/api/auth/admin/login`).
  - Registrasi Siswa (`/api/auth/siswa/register`) dan Login Siswa (`/api/auth/siswa/login`).
  - Profil Pengguna Aktif (`/api/auth/me`).
- [x] **3.2. Endpoint Pengaduan Siswa (Pelapor)**:
  - `POST /api/pengaduan`: Input laporan dengan auto-generate kode tiket (`SGP-YYYY-XXXXXX`) dan pemicu otomatis AI pipeline.
  - `POST /api/pengaduan/{ticket_code}/bukti`: Upload file bukti foto/dokumen pendukung.
  - `GET /api/pengaduan/{ticket_code}/status`: Tracking publik aman tanpa membuka identitas.
  - `GET /api/pengaduan/siswa/{siswa_id}/riwayat`: Riwayat laporan khusus milik siswa login.
  - `GET /api/pengaduan/kategori`: Daftar 7 kategori resmi untuk dropdown input.
- [x] **3.3. Endpoint Manajemen Admin (Guru BK / Satgas)**:
  - `GET /api/admin/pengaduan`: Daftar laporan dengan pagination & filter status/kategori.
  - `GET /api/admin/pengaduan/{id}`: Detail laporan lengkap, bukti lampiran, dan hasil analisis AI.
  - `PATCH /api/admin/pengaduan/{id}/status`: State machine transisi status laporan (`Menunggu` → `Diverifikasi` → `Ditindaklanjuti` → `Selesai`).
  - `PATCH /api/admin/pengaduan/{id}/kategori`: Konfirmasi atau manual override kategori oleh Admin.
- [x] **3.4. Sistem Audit Trail Otomatis**:
  - Logging otomatis histori mutasi status dan revisi kategori ke tabel `audit_trail`.

---

### FASE 4: Pembangunan Modul AI Pipeline (IndoBERT + Cosine + HDBSCAN)
> **Tujuan**: Membangun modul analitik cerdas pendukung keputusan (decision support system) bagi Admin.

- [x] **4.1. Modul Text Preprocessing (`app/ai/preprocessor.py`)**:
  - Pembersihan teks narasi, case folding, penghapusan mention/URL, dan kamus slang perundungan.
- [x] **4.2. Ekstraksi Vektor Embedding (`app/ai/embedder.py`)**:
  - Pipeline embedding adaptif: mendukung IndoBERT (`transformers` + `torch`) dan linguistic stemmed TF-IDF berbobot IDF yang akurat dan ringan.
- [x] **4.3. Klasifikasi Kategori via Cosine Similarity (`app/ai/classifier.py`)**:
  - Perhitungan Cosine Similarity antara vektor narasi pengaduan dengan 7 Centroid Kategori Permendikbud.
  - Output rekomendasi kategori tertinggi + Confidence Score terkalibrasi (0.50 – 0.96).
- [x] **4.4. Klasterisasi Kasus Berulang via HDBSCAN (`app/ai/clustering.py`)**:
  - Klasterisasi berbasis kepadatan densitas untuk deteksi insiden serupa (`cluster_label`), dan pelabelan kasus tunggal (`is_noise = True`).
- [x] **4.5. Orkestrator AI Lifecycle (`app/ai/service.py`)**:
  - Menghubungkan modul AI langsung saat pengaduan dibuat dan menyimpan hasil embedding, label klaster, serta rekomendasi ke basis data.

---

### FASE 5: ETL External Data & Dashboard Analytics Service
> **Tujuan**: Menghubungkan data eksternal ke dashboard statistik untuk konteks analisis mendalam.

- [x] **5.1. ETL Parser Data Agregat (`app/data/etl_external.py`)**:
  - Parser dan normalizer CSV dataset daerah/nasional (Dinas PPPA Aceh, DKP3A Kaltim, KemenPPPA, PPKS Kemensos).
- [x] **5.2. Endpoint Analytics & Metrik Dashboard (`app/routers/dashboard.py`)**:
  - `GET /api/dashboard/summary`: Total laporan, rasio anonim vs non-anonim, distribusi status & kategori.
  - `GET /api/dashboard/clusters`: Ringkasan klaster insiden berulang (kasus terklaster vs kasus tunggal).
  - `GET /api/dashboard/ai-metrics`: Metrik performa validasi AI dan rata-rata confidence score.
  - `GET /api/dashboard/external-comparison`: Data pembanding makro daerah & nasional.

---

### FASE 6: Integrasi End-to-End, Testing & Sinkronisasi Frontend
> **Tujuan**: Memastikan interoperabilitas penuh antara REST API backend dan UI Frontend yang sudah ada.

- [x] **6.1. Unit Testing & API Validation**:
  - Testing alur tiket anonim, transisi status, otentikasi JWT, dan perhitungan skor similarity.
  - Dibuat `tests/conftest.py`: fixture pytest dengan SQLite in-memory + TestClient terisolasi.
  - Dibuat `tests/test_auth.py`: test login admin/siswa, register, validasi JWT, endpoint `/me`.
  - Dibuat `tests/test_pengaduan.py`: test daftar kategori, buat laporan, state machine transisi, override kategori.
  - Dibuat `tests/test_dashboard.py`: test semua endpoint dashboard + proteksi auth.
  - Diisi `test_e2e.py`: simulasi alur lengkap 10 skenario (register → submit → verifikasi → approve AI → dashboard).
- [x] **6.2. Sinkronisasi Frontend**:
  - Dibuat `Frontend/assets/js/api.js`: API client JavaScript lengkap (apiClient + tokenManager) untuk semua endpoint backend FastAPI.
  - Verifikasi CORS `allow_origins=["*"]` sudah aktif di `app/main.py` untuk development.
  - Panduan integrasi token Bearer di browser didokumentasikan di README.
- [x] **6.3. Dokumentasi & Panduan Menjalankan**:
  - Dokumentasi Swagger OpenAPI tersedia di `/docs` dan ReDoc di `/redoc`.
  - README diperbarui: tabel endpoint lengkap, seksi Testing, panduan pytest, dan panduan sinkronisasi frontend.


---

*Catatan: Dokumen ini diperbarui secara berkala pada setiap checkpoint implementasi fitur backend.*
