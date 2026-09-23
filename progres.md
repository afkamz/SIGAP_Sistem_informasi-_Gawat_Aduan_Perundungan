# Progres Pengembangan SIGAP

Dokumen ini mencatat progres pengembangan SIGAP secara terpisah antara frontend dan backend.

Keterangan status: **✅ Selesai** | **❌ Belum selesai**

## A. Progres Backend

| Fase | Tahapan Pengembangan | Status |
|---|---|:---:|
| Fase 1 | Audit, pembersihan, dan penyelarasan dataset | ✅ |
| Fase 2 | Konfigurasi lingkungan dan penguatan basis data core | ✅ |
| Fase 3 | API core dan business logic siswa, admin, serta audit trail | ✅ |
| Fase 4 | Pembangunan modul AI pipeline: IndoBERT, cosine similarity, dan HDBSCAN | ✅ |
| Fase 5 | ETL external data dan dashboard analytics service | ✅ |
| Fase 6 | Integrasi end-to-end, testing, dan sinkronisasi dengan frontend | ✅ |
| Fase 7 | Deployment backend ke server/lingkungan produksi | ❌ |

### Rincian Backend

### Fase 1 — Audit, Pembersihan, dan Penyelarasan Dataset ✅

**Kata kunci:** dataset, CSV, preprocessing, cleaning, mapping, seed data.

**Poin pekerjaan:**
- Audit dataset agregat kasus dan dataset teks pada folder `dataset/`.
- Membersihkan data kosong, duplikat, format kolom, dan delimiter CSV.
- Menyamakan nama kolom serta format data untuk kebutuhan sistem.
- Menyiapkan seed narasi untuk tujuh kategori kasus.

### Fase 2 — Konfigurasi Lingkungan dan Basis Data Core ✅

**Kata kunci:** FastAPI, MySQL, SQLAlchemy, model, migration, konfigurasi.

**Poin pekerjaan:**
- Menyiapkan struktur proyek FastAPI dan konfigurasi environment.
- Menghubungkan aplikasi dengan MySQL/SQLite.
- Membuat model tabel admin, siswa, kategori, pengaduan, bukti, dan audit trail.
- Menyiapkan konfigurasi database serta pembuatan tabel.

### Fase 3 — API Core dan Business Logic ✅

**Kata kunci:** REST API, JWT, RBAC, pengaduan, status, audit trail.

**Poin pekerjaan:**
- Membuat autentikasi admin dan siswa menggunakan JWT.
- Membuat endpoint registrasi, login, profil, dan hak akses pengguna.
- Membuat endpoint pengaduan, upload bukti, pelacakan tiket, dan riwayat laporan.
- Menerapkan alur status laporan: Menunggu, Diverifikasi, Ditindaklanjuti, dan Selesai.
- Mencatat perubahan status serta validasi kategori ke audit trail.

### Fase 4 — Modul AI Pipeline ✅

**Kata kunci:** NLP, IndoBERT, embedding, cosine similarity, confidence, HDBSCAN.

**Poin pekerjaan:**
- Melakukan preprocessing dan normalisasi teks laporan.
- Membuat embedding teks menggunakan model yang tersedia.
- Menghitung kemiripan teks dengan centroid tujuh kategori.
- Menghasilkan rekomendasi kategori dan skor keyakinan.
- Mengelompokkan laporan serupa menggunakan HDBSCAN serta menandai noise/outlier.

### Fase 5 — ETL External Data dan Dashboard Analytics ✅

**Kata kunci:** ETL, CSV lokal, external data, seed, agregasi, analytics.

**Poin pekerjaan:**
- Membaca dataset CSV lokal dari folder `dataset/`.
- Melakukan cleaning, mapping, dan validasi data eksternal.
- Memasukkan data seed ke database secara idempotent.
- Menyediakan ringkasan, tren, kategori, cluster, dan perbandingan data eksternal.
- Menyediakan endpoint dashboard untuk digunakan frontend admin.

### Fase 6 — Integrasi End-to-End dan Testing Backend ✅

**Kata kunci:** integrasi, API contract, CORS, testing, sinkronisasi, debugging.

**Poin pekerjaan:**
- Menguji alur dari request frontend sampai database dan response API.
- Memastikan kontrak endpoint, schema, dan format response konsisten.
- Menguji autentikasi, hak akses, validasi input, dan transisi status.
- Menguji alur pengaduan, dashboard, AI, ETL, dan audit trail.
- Menyinkronkan kebutuhan API dengan frontend.

### Fase 7 — Deployment Backend ❌

**Kata kunci:** production, server, environment variable, database production, monitoring.

**Poin pekerjaan:**
- Menentukan server atau platform deployment backend.
- Mengatur environment variable dan kredensial database production.
- Menjalankan migration/seeding pada lingkungan deployment.
- Mengatur proses start service, logging, dan koneksi HTTPS.
- Melakukan smoke test setelah deployment.

## B. Progres Frontend

| Fase | Tahapan Pengembangan | Status |
|---|---|:---:|
| Fase 1 | Setup React, Vite, Tailwind, dan struktur proyek | ✅ |
| Fase 2 | Pembuatan wireframe dan design system tampilan | ✅ |
| Fase 3 | Implementasi halaman siswa: landing, registrasi, dashboard, buat laporan, dan lacak laporan | ✅ |
| Fase 4 | Implementasi halaman admin: login, dashboard, daftar laporan, detail laporan, audit trail, dan pengaturan | ✅ |
| Fase 5 | Integrasi frontend dengan API backend dan autentikasi | ❌ |
| Fase 6 | Integrasi dashboard, data eksternal, dan fitur AI ke tampilan | ❌ |
| Fase 7 | Testing frontend, perbaikan bug, dan validasi responsive | ❌ |
| Fase 8 | Deployment frontend ke server/hosting | ❌ |

### Rincian Frontend

### Fase 1 — Setup Project Frontend ✅

**Kata kunci:** React, Vite, Tailwind, routing, struktur folder, environment.

**Poin pekerjaan:**
- Menyiapkan project React berbasis Vite.
- Mengatur Tailwind, PostCSS, entry point, dan konfigurasi build.
- Menyiapkan struktur folder pages, components, context, data, dan services.
- Menyiapkan routing halaman siswa dan admin.

### Fase 2 — Wireframe dan Design System ✅

**Kata kunci:** wireframe, UI/UX, layout, responsive, warna, typography.

**Poin pekerjaan:**
- Membuat rancangan alur tampilan siswa dan admin.
- Menentukan layout header, sidebar, footer, form, tabel, dan dashboard.
- Menerapkan warna, tipografi, komponen tombol, badge, dan status.
- Menyiapkan dasar tampilan responsive.

### Fase 3 — Implementasi Portal Siswa ✅

**Kata kunci:** landing page, registrasi, dashboard siswa, form laporan, tracking.

**Poin pekerjaan:**
- Membuat landing page dan halaman registrasi siswa.
- Membuat dashboard siswa dan riwayat laporan.
- Membuat wizard/form pembuatan laporan.
- Menambahkan pilihan kategori, mode anonim, deskripsi, dan bukti pendukung.
- Membuat halaman pelacakan status menggunakan kode tiket.

### Fase 4 — Implementasi Portal Admin ✅

**Kata kunci:** admin login, dashboard, laporan, verifikasi, audit trail, settings.

**Poin pekerjaan:**
- Membuat halaman login admin.
- Membuat dashboard ringkasan dan visualisasi.
- Membuat daftar serta detail laporan.
- Menampilkan proses validasi kategori dan perubahan status laporan.
- Membuat halaman audit trail dan pengaturan admin.

### Fase 5 — Integrasi API dan Autentikasi ❌

**Kata kunci:** fetch, JWT token, API service, state management, error handling.

**Poin pekerjaan:**
- Menghubungkan form siswa dengan endpoint FastAPI.
- Menghubungkan login dan registrasi dengan backend.
- Menyimpan serta mengirim token JWT pada request yang membutuhkan autentikasi.
- Menampilkan loading, error, dan response API pada setiap alur utama.
- Memastikan proteksi halaman berdasarkan role siswa dan admin.

### Fase 6 — Integrasi Dashboard, External Data, dan AI ❌

**Kata kunci:** analytics, chart, seed data, rekomendasi AI, cluster, dashboard.

**Poin pekerjaan:**
- Mengambil data summary dan tren dari endpoint dashboard.
- Menampilkan data seed CSV dan data laporan aktif secara jelas.
- Menampilkan rekomendasi kategori, confidence score, dan hasil clustering.
- Menghubungkan aksi validasi kategori serta perubahan status ke backend.
- Menangani kondisi data kosong, error API, dan loading dashboard.

### Fase 7 — Testing dan Validasi Frontend ❌

**Kata kunci:** unit test, integration test, E2E, UAT, responsive, usability.

**Poin pekerjaan:**
- Menguji navigasi, form, validasi input, login, dan logout.
- Menguji alur submit laporan sampai pelacakan tiket.
- Menguji alur admin dari login sampai verifikasi laporan.
- Menguji tampilan desktop, tablet, dan mobile.
- Memperbaiki bug UI, error API, dan masalah state.

### Fase 8 — Deployment Frontend ❌

**Kata kunci:** build production, hosting, environment variable, domain, smoke test.

**Poin pekerjaan:**
- Menjalankan build production dan memperbaiki error build.
- Menentukan hosting frontend.
- Mengatur URL API backend pada environment production.
- Melakukan deployment dan mengatur konfigurasi routing SPA.
- Melakukan smoke test pada URL deployment.

## C. Tahap Akhir Bersama

| Tahap | Kegiatan | Status |
|---|---|:---:|
| 1 | Integrasi penuh frontend dan backend | ❌ |
| 2 | Testing end-to-end dan UAT | ❌ |
| 3 | Perbaikan bug dan finalisasi konfigurasi | ❌ |
| 4 | Deployment backend dan frontend | ❌ |
| 5 | Demo, dokumentasi, dan presentasi akhir | ❌ |

### Rincian Tahap Akhir

#### 1. Integrasi Penuh Frontend dan Backend ❌

**Kata kunci:** end-to-end flow, API contract, autentikasi, data consistency.

**Poin pekerjaan:**
- Memastikan seluruh halaman utama terhubung ke endpoint backend.
- Memastikan data yang dikirim, disimpan, dan ditampilkan tetap konsisten.
- Memastikan alur siswa dan admin dapat berjalan tanpa mock data.

#### 2. Testing End-to-End dan UAT ❌

**Kata kunci:** E2E, UAT, acceptance criteria, regression test.

**Poin pekerjaan:**
- Menjalankan skenario pelaporan siswa.
- Menjalankan skenario verifikasi admin.
- Menguji tracking status, audit trail, dashboard, dan AI.
- Mencatat hasil pengujian berdasarkan acceptance criteria.

#### 3. Perbaikan Bug dan Finalisasi Konfigurasi ❌

**Kata kunci:** bug fixing, security check, konfigurasi, dokumentasi.

**Poin pekerjaan:**
- Memperbaiki bug prioritas tinggi dan sedang.
- Memeriksa keamanan, hak akses, CORS, dan validasi input.
- Memfinalisasi konfigurasi backend, frontend, dan database.
- Memperbarui dokumentasi penggunaan dan teknis.

#### 4. Deployment Backend dan Frontend ❌

**Kata kunci:** production, server, hosting, HTTPS, smoke test.

**Poin pekerjaan:**
- Deploy backend dan database ke lingkungan produksi.
- Deploy frontend ke hosting yang ditentukan.
- Menghubungkan frontend production dengan API backend production.
- Melakukan smoke test setelah deployment.

#### 5. Demo, Dokumentasi, dan Presentasi Akhir ❌

**Kata kunci:** demo, laporan, dokumentasi, presentasi, evaluasi.

**Poin pekerjaan:**
- Menyiapkan skenario demo dari sisi siswa dan admin.
- Merapikan dokumentasi arsitektur, API, database, dan deployment.
- Menyusun laporan hasil testing dan keterbatasan sistem.
- Menyiapkan materi presentasi dan pembagian tugas tim.

> Status pada dokumen ini dapat diperbarui setelah setiap fase selesai diverifikasi dan diuji.
