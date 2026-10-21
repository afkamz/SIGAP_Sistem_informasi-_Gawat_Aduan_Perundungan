# Progres Pengembangan SIGAP

Dokumen ini mencatat progres pengembangan SIGAP secara terpisah antara frontend dan backend.

Keterangan status: **✅ Selesai** | **🔄 Sebagian** | **❌ Belum selesai**

---

## Ringkasan Cepat — Update 21 Oktober 2026 (Penutupan Minggu 9)

| Komponen | Progres | Catatan |
|---|:---:|---|
| Frontend (React + Vite + Tailwind) | **~98%** | Eliminasi mock total, live fetching MySQL, alur kartu triase Validasi AI, detail laporan Satgas PPKSP, modal lightbox pratinjau bukti, build sukses 100% |
| Backend (FastAPI + SQLAlchemy + JWT) | **~95%** | Live CRUD aduan, endpoint audit trail terpusat, serving berkas bukti via StaticFiles, sanitasi UUID, 60 tests passed 100% |
| AI / NLP Pipeline | **~85%** | Inferensi IndoBERT (`indobenchmark/indobert-base-p1`) terhubung langsung saat submit laporan, multi-label anomaly flag (<80%), ekstraksi kata kunci |
| Paper / Laporan Akademik (SIGAP.tex) | **~90%** | Naskah standar IEEE conference, terminologi bahasa Inggris baku, 14 referensi verified DOI & open-access |
| Testing, Integrasi E2E & Deployment | **~92%** | Docker 4 container aktif, reverse proxy Nginx untuk uploads, 60 unit & E2E tests lulus 100% |
| **KESELURUHAN (Tampilan UI, Mock & Paper)** | **~95%** | Sistem terintegrasi penuh dari antarmuka pengguna hingga pangkalan data |
| **KESIAPAN MURNI SISTEM (Realistis Tanpa Mock & Paper)** | **~85%** | Fungsional end-to-end nyata tanpa ketergantungan mock (lihat detail di `docs/17-Gimik_Presentasi_5.md`) |

---

## Perubahan Signifikan Terkini (7 – 14 Oktober 2026)

### Penambahan & Perbaikan Baru

| # | Fitur / Perubahan | File yang Diubah | Status |
|---|---|---|:---:|
| 1 | **Integrasi Auth Siswa ke Database**: Login dan registrasi siswa tersambung 100% ke backend JWT & database MySQL (verifikasi hash `bcrypt`) | `Login.jsx`, `Register.jsx`, `api.js`, `auth.py` | ✅ Selesai |
| 2 | **Sinkronisasi Metrik KPI Admin**: Menghapus offset dummy (+132, +21) pada dashboard admin, menyelaraskan dengan total laporan riil | `StoreContext.jsx`, `ReportList.jsx` | ✅ Selesai |
| 3 | **Penyelarasan 7 Kategori Resmi**: Mengadopsi 7 kategori perundungan sesuai Permendikbudristek No. 46/2023 pada filter & formulir | `categories.js`, `StoreContext.jsx`, `AdminDashboard.jsx` | ✅ Selesai |
| 4 | **Pembersihan Header Admin**: Menghilangkan pills legend dan dropdown tahun ajaran statis di dashboard admin | `AdminDashboard.jsx` | ✅ Selesai |
| 5 | **Menu Validasi AI**: Menambahkan rute dan halaman kartu *Coming Soon* untuk peninjauan klasifikasi AI | `App.jsx`, `ValidasiAI.jsx`, `AdminSidebar.jsx` | ✅ Selesai |
| 6 | **Perbaikan Tampilan Desktop 100% Zoom**: Penyelarasan rasio kontainer `max-w-7xl` antara header dan konten di Landing Page & Student Dashboard | `LandingPage.jsx`, `StudentDashboard.jsx` | ✅ Selesai |
| 7 | **Formulir Aduan — Date Picker Otomatis**: Mengganti ketik manual tanggal kejadian dengan input kalender (`type="date"`) + tombol pintas (Hari Ini, Kemarin, Hapus) | `CreateReportWizard.jsx` | ✅ Selesai |
| 8 | **Formulir Aduan — Label Lokasi Kejadian**: Mengubah "Lokasi / Kanal" menjadi "Lokasi Kejadian" dengan ikon `MapPin` dan placeholder kontekstual | `CreateReportWizard.jsx` | ✅ Selesai |
| 9 | **Laporan Progres Presentasi Realistis**: Pembuatan dokumen laporan khusus presentasi dengan baseline realistis 60% dan diagram Mermaid | `docs/14-Laporan_Progres_Proyek_SIGAP.md` | ✅ Selesai |
| 10 | **Penerapan Route Guard Terpusat**: Mengamankan seluruh rute portal admin (`/admin/*`) dan dashboard siswa (`/dashboard`) menggunakan komponen `ProtectedRoute.jsx` | `ProtectedRoute.jsx`, `App.jsx` | ✅ Selesai |
| 11 | **Sinkronisasi Kode Tiket Riil Backend**: Menangkap respon `res.ticket_code` dari `api.buatPengaduan()` agar kode tiket tersimpan konsisten di MySQL dan frontend | `StoreContext.jsx` | ✅ Selesai |
| 12 | **Pencarian Tiket Hybrid**: Mengintegrasikan fallback query asinkronus ke endpoint `api.cekStatus()` pada modul pelacakan aduan | `TrackReport.jsx` | ✅ Selesai |
| 13 | **Dokumen Progress Mingguan Minggu 8**: Penyusunan laporan progres berkala Minggu 8 berbasis pencapaian nyata | `docs/15-Gimik_Presentasi_4.md` (baru) | ✅ Selesai |
| 14 | **Dokumen Progress Mingguan Minggu 9**: Penyusunan laporan berkala Minggu 9 berbasis 10 sesi integrasi live MySQL, serving bukti, dan Validasi AI card stream | `docs/17-Gimik_Presentasi_5.md` (baru) | ✅ Selesai |


### Struktur Routing Terkini

```
/               → LandingPage (Halaman Utama SIGAP — Info + Hero + CTA)
/login          → Login Siswa (NISN/NIP + Kata Sandi)
/register       → Pendaftaran Akun Siswa
/dashboard      → Dashboard Siswa (requires login)
/buat-laporan   → Wizard Aduan (requires login — ada gatekeeper)
/lacak          → Lacak Tiket (tanpa login)
/admin/login    → Portal Guru BK & Admin
/admin/dashboard → Dashboard Admin (requires admin JWT)
/admin/laporan   → Daftar Laporan Admin
/admin/laporan-detail → Detail Laporan Admin
/admin/validasi-ai → Peninjauan Validasi Rekomendasi AI (requires admin JWT)
/admin/audit    → Jejak Audit Trail
/admin/pengaturan → Pengaturan Admin
```

---

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

### Catatan Backend — 6 Oktober 2026

- **Virtual environment**: Berhasil diperbaiki dan diuji ✅ (`python3.14 -m venv venv` & seluruh dependencies terpasang). Sebanyak **58 unit & E2E tests lulus 100%**.
- **SQLite lokal** (`sigap.db`): Terverifikasi ✅ — 7 tabel ditemukan, 188 baris data benchmark eksternal tersedia.
- **CORS**: Diperbaiki ✅ — tidak lagi wildcard `"*"`. Dibaca dari `.env` key `ALLOWED_ORIGINS`. Docker port 3000 sudah ditambahkan.
- **Lifespan FastAPI**: Dimigrasi dari `@on_event("startup")` (deprecated) ke `@asynccontextmanager lifespan` ✅.
- **Endpoint `/health`**: Ditambahkan untuk smoke test & monitoring ✅.
- **Upload berkas**: Diperbaiki ✅ — Validasi lengkap: MIME whitelist (JPG/PNG/WebP/PDF), magic bytes verification, batas 10 MB, nama file UUID (anti path traversal), path relatif di DB (bukan path absolut server).

---

## B. Progres Frontend

| Fase | Tahapan Pengembangan | Status |
|---|---|:---:|
| Fase 1 | Setup React, Vite, Tailwind, dan struktur proyek | ✅ |
| Fase 2 | Pembuatan wireframe dan design system tampilan | ✅ |
| Fase 3 | Implementasi halaman siswa: landing, registrasi, dashboard, buat laporan, lacak laporan | ✅ |
| Fase 3a | **Landing Page Informasi** (baru — sebelum menu login) | ✅ |
| Fase 3b | **Gatekeeper Buat Aduan** (wajib login/daftar) | ✅ |
| Fase 4 | Implementasi halaman admin: login, dashboard, laporan, audit trail, pengaturan | ✅ |
| Fase 5 | Integrasi frontend dengan API backend dan autentikasi | ✅ |
| Fase 6 | Integrasi dashboard, data eksternal, dan fitur AI ke tampilan | ✅ |
| Fase 7 | **Testing frontend, perbaikan bug, validasi responsive** — **FOKUS BERIKUTNYA** | ❌ |
| Fase 8 | Deployment frontend ke server/hosting | ❌ |

### Catatan Frontend — Update 19 Oktober 2026

- **Build produksi berhasil** ✅ — `vite build` exit code 0 tanpa error (2.152 modul), aset terbaru aktif di Nginx Docker port 3000.
- **Route Guard Terpusat**: Selesai ✅ — Komponen `ProtectedRoute.jsx` mengamankan seluruh portal `/admin/*` dan `/dashboard` siswa dari akses tanpa izin via URL.
- **Integrasi Login & Register Siswa ke Backend**: Selesai ✅ — Sudah tersambung ke `api.loginSiswa()` dan `api.registerSiswa()` dengan JWT dan verifikasi password di DB MySQL.
- **Sinkronisasi Kode Tiket Riil**: Selesai ✅ — State `StoreContext` menangkap `res.ticket_code` resmi dari respon backend `api.buatPengaduan()`, menyelaraskan tiket frontend dengan data di MySQL.
- **Lacak Tiket Hybrid**: Selesai ✅ — Modul pelacakan di `TrackReport.jsx` mencari data tiket di penyimpanan lokal peramban, dan otomatis melakukan query fallback asinkronus ke endpoint live backend `api.cekStatus()` jika dibuka dari perangkat lain.
- **Formulir Aduan (Tahap 2)**: Selesai ✅ — Input tanggal manual diganti dengan kalender interaktif (`type="date"`) + tombol pintas (Hari Ini, Kemarin, Hapus) & proteksi `max=today`. Label lokasi diubah menjadi "Lokasi Kejadian" dengan ikon `MapPin`.
- **Integrasi Penuh Database MySQL**: Selesai ✅ — Seluruh dashboard admin, daftar laporan, mutasi status, jejak audit, dan detail laporan dengan deskripsi otentik siswa serta berkas bukti riil tersambung 100% langsung ke backend FastAPI & database MySQL tanpa mock data.
- **Serving Berkas Unggahan Live**: Selesai ✅ — Endpoint `/uploads` statis di FastAPI aktif melayani pratinjau dan pengunduhan berkas lampiran siswa yang valid.
- **Token/session**: Disimpan di `localStorage` (cukup untuk dev). Perlu dipertimbangkan cookie `HttpOnly` untuk production.

---

## C. Daftar Hal yang Perlu Diperbaiki (Backlog Testing)

> Bagian ini mencatat perbaikan yang sudah diselesaikan dan backlog yang masih perlu dikerjakan.

### Prioritas Tinggi 🔴

- [x] Perbaiki virtual environment backend (`venv` baru dibuat ulang, dependencies terpasang, 58 tests passed)
- [x] Perbaikan role guard admin: admin dilarang mengakses form Buat Aduan & diarahkan ke dashboard admin
- [x] Perbaikan navigasi StudentHeader: link nama & logo diarahkan ke `/admin/dashboard` untuk admin, sembunyikan tombol Buat Aduan bagi admin
- [x] Hubungkan form Login Siswa ke endpoint `api.loginSiswa()` dengan JWT token nyata & error handling
- [x] Hubungkan form Register Siswa ke endpoint `api.registerSiswa()` dengan autentikasi otomatis & error handling nyata
- [x] Pastikan token JWT dari backend disimpan dan dikirimkan pada request terproteksi
- [x] Sempurnakan formulir aduan: ganti input tanggal manual dengan kalender datepicker & tombol pintas (Hari Ini, Kemarin)
- [x] Ubah label 'Lokasi / Kanal' menjadi 'Lokasi Kejadian' beserta ikon lokasi MapPin
- [x] Tambahkan route guard: redirect ke `/login` jika token tidak ada atau kedaluwarsa (`ProtectedRoute.jsx`)

### Prioritas Sedang 🟡 (Menuju 100% Live Tanpa Mock)

- [x] Hubungkan form Buat Aduan ke `api.buatPengaduan()` — kode tiket riil dari backend kini disinkronisasi ke state lokal
- [x] Hubungkan halaman Lacak Tiket ke endpoint `api.cekStatus()` — *hybrid lookup* (lokal + server) aktif
- [x] Hubungkan dashboard siswa ke endpoint `api.riwayatSiswa()` untuk mengambil aduan asli dari MySQL (termasuk sinkronisasi kepemilikan `siswa_id` & mode anonim saat login ulang)
- [x] Hubungkan dashboard admin & daftar laporan ke endpoint `api.getDashboardSummary()` dan `GET /api/pengaduan` (`api.daftarPengaduan()`)
- [x] Pastikan perubahan status laporan oleh Guru BK memanggil `api.ubahStatus()` ke backend MySQL
- [x] Alirkan jejak audit aktivitas ke tabel MySQL `audit_trail` via endpoint `GET /api/pengaduan/audit-trail/list` & sinkronisasi state
- [x] Nonaktifkan fallback mock data di production (100% data riil MySQL saat terhubung)
- [x] Perbaiki CORS backend agar tidak wildcard (membaca dari `ALLOWED_ORIGINS` di `.env`)
- [x] Perbaiki upload berkas: validasi MIME, magic bytes, batas 10MB, UUID file name, sinkronisasi state bukti upload & pratinjau gambar otentik di detail laporan admin

### Prioritas Rendah 🟢

- [x] Hubungkan model AI IndoBERT & HDBSCAN secara otomatis saat siswa submit form (ganti skor acak `Math.random()`)
- [x] Bangun antarmuka tabel kerja & alur kartu triase pada halaman *Validasi AI* (tampilan card stream interaktif dengan data riil SIGAP, deteksi ambiguitas multi-label, klaster HDBSCAN, token ekstraksi NLP, SOP PPKSP, dan validasi massal)
- [ ] Validasi responsive mobile: Landing Page, form aduan, lacak tiket
- [ ] Evaluasi akurasi AI NLP: dokumentasi Precision, Recall, F1 per kategori
- [x] Buat/Verifikasi `docker-compose.yml` untuk orkestrasi lokal (Frontend + Backend + DB + phpMyAdmin)
- [x] Buat script pembantu development `sigap-dev.sh`
- [x] Buat dokumen laporan progres terstruktur untuk presentasi (`docs/14-Laporan_Progres_Proyek_SIGAP.md`, `docs/15-Gimik_Presentasi_4.md`)
- [ ] Lengkapi paper akademik: Bab Hasil & Pembahasan, UAT, SUS, Kesimpulan & Saran

---

## D. Tahap Akhir Bersama

| Tahap | Kegiatan | Status |
|---|---|:---:|
| 1 | Integrasi penuh frontend dan backend | 🔄 |
| 2 | Testing end-to-end dan UAT | ❌ |
| 3 | Perbaikan bug dan finalisasi konfigurasi | ❌ |
| 4 | Deployment backend dan frontend | ❌ |
| 5 | Demo, dokumentasi, dan presentasi akhir | ❌ |

---

## E. Riwayat Update Dokumen

| Tanggal | Update |
|---|---|
| 21 Oktober 2026 | Penutupan resmi siklus pengembangan Minggu ke-9 (Sesi 1 s.d. Sesi 10) pada dokumen log dan persiapan transisi agenda pengembangan Minggu ke-10. Verifikasi build frontend dan backend test suite lulus 100% (60 tests passed). |
| 20 Oktober 2026 (Malam II) | Integrasi penuh data riil aduan MySQL ke halaman Validasi AI: perbaikan resolusi path dataset seed IndoBERT pada Docker container (`classifier.py`, `embedder.py`), eksekusi inferensi AI pipeline untuk seluruh 6 aduan riil siswa di database, auto-auth dev admin pada `fetchAdminReports()`, pembersihan fallback teks statis dari gambar referensi, dan pengikatan field otentik pelapor serta tanggal riil. Build frontend dan 50 backend tests lulus 100%. |
| 20 Oktober 2026 (Malam) | Redesain antarmuka halaman Validasi AI (`Frontend/src/pages/admin/AiValidation.jsx`) mengadopsi struktur alur kartu triase (*card stream*), banner peringatan ambiguitas multi-label (<80%), deteksi klaster HDBSCAN, ekstraksi fitur kata kunci teks NLP, rekomendasi alur tindak lanjut SOP PPKSP, dan aksi validasi massal berbasis data riil SIGAP tanpa mock. Build frontend dan 50 backend tests lulus 100%. |
| 20 Oktober 2026 | Standardisasi dan konsistensi peristilahan teknis pada naskah akademik `SIGAP.tex` (Abstract dan Introduction): penggunaan istilah baku bahasa Inggris secara murni (`underreporting`, `cyberbullying`, `sentence embedding`, `state transition guard`, `confidence score`, `density-based clustering`, `natural language processing`) tanpa reduplikasi terjemahan ganda dalam kurung. Build frontend dan 50 backend tests lulus 100%. |
| 14 Oktober 2026 | Implementasi `ProtectedRoute.jsx` (route guard terpusat untuk rute admin dan siswa). Sinkronisasi kode tiket riil dari respon `api.buatPengaduan()` ke state lokal (`StoreContext.jsx`). Integrasi pencarian tiket *hybrid* (lokal + live backend `api.cekStatus()`) di `TrackReport.jsx`. Revisi `SIGAP.tex`: abstrak 198 kata standar IEEE, Introduction 5 paragraf ringkas (346 kata), 14 referensi open-access 2019–2025 verified. Build produksi sukses (exit code 0, 2152 modul). 58 backend tests lulus 100%. Dokumen progres Minggu 8: `docs/15-Gimik_Presentasi_4.md`. Kesiapan murni sistem: **~65%**. |
| 13 Oktober 2026 | Penyempurnaan UX formulir aduan (penggantian input teks tanggal manual menjadi kalender interaktif `type="date"` dengan tombol pintas Hari Ini/Kemarin/Hapus, proteksi `max=today`, serta pengubahan label "Lokasi / Kanal" menjadi "Lokasi Kejadian" dengan ikon `MapPin`). Penyelarasan dokumen presentasi progres realistis 60% pada `docs/14-Laporan_Progres_Proyek_SIGAP.md`. Build produksi diperbarui ke `Frontend/dist`. |
| 07 Oktober 2026 (Sore) | Perbaikan auth login siswa (seeding akun & verifikasi kata sandi backend), sinkronisasi metrik laporan dashboard admin ke data nyata (tanpa offset dummy), integrasi 7 kategori resmi Permendikbudristek No. 46/2023, penambahan halaman Coming Soon Validasi AI, perbaikan layout responsif Desktop 100% zoom (Landing Page & Student Dashboard), build sukses ke Docker dist. Estimasi progres keseluruhan: **~87%** (tampilan/prototipe) / **~60%** (kesiapan murni sistem). |
| 07 Oktober 2026 (Pagi) | Perbaikan 4 prioritas backend (venv, DB, CORS, upload sanitization). Role guard admin & navigasi StudentHeader. Integrasi auth login/register ke real backend API. Estimasi progres: ~85% |
| 06 Oktober 2026 | Penambahan Landing Page, pemisahan Login, gatekeeper Buat Aduan, pembersihan header nav, konsolidasi semua `.md` ke folder `docs/`. Estimasi progres keseluruhan: ~78% |
| 30 September 2026 | Penyempurnaan TrackReport, StudentDashboard, CreateReportWizard |
| 29 September 2026 | Penyempurnaan ETL external data, modul AI pipeline |
| 16 September 2026 | Setup awal proyek, implementasi semua halaman utama, struktur backend lengkap |

---

> **Langkah berikutnya:** Integrasi dashboard admin & siswa ke live MySQL (lepas mock data), penyaluran audit trail ke server, dan persiapan antarmuka Validasi AI.
> Hasil temuan bug dan masalah UI akan dicatat di bagian **C. Daftar Hal yang Perlu Diperbaiki** di atas.

> Status pada dokumen ini diperbarui setelah setiap sesi kerja atau temuan testing.

