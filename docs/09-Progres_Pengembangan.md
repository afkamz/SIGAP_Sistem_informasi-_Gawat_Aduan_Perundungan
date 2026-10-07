# Progres Pengembangan SIGAP

Dokumen ini mencatat progres pengembangan SIGAP secara terpisah antara frontend dan backend.

Keterangan status: **✅ Selesai** | **🔄 Sebagian** | **❌ Belum selesai**

---

## Ringkasan Cepat — Update 7 Oktober 2026 (Sesi Sore)

| Komponen | Progres | Catatan |
|---|:---:|---|
| Frontend (React + Vite + Tailwind) | **~95%** | Tampilan responsive 100% zoom selaras, sinkronisasi KPI & 7 kategori, Coming Soon Validasi AI, auth login/register real terhubung |
| Backend (FastAPI + SQLAlchemy + JWT) | **~90%** | Auth JWT siswa & admin live di DB, CORS secured, sanitasi upload aktif, 58 tests passed 100% |
| AI / NLP Pipeline | **~75%** | IndoBERT + HDBSCAN sudah terintegrasi pada alur pengaduan backend |
| Paper / Laporan Akademik (SIGAP.tex) | **~65%** | Metodologi & arsitektur siap; belum ada bab Hasil, Pembahasan, Kesimpulan |
| Testing, Integrasi E2E & Deployment | **~85%** | Docker stack 4 container aktif, dev script siap, pengujian layout & auth berhasil |
| **KESELURUHAN (Semua Modul & Paper)** | **~87%** | Core sistem & tampilan UI lengkap, termasuk paper akademik |
| **KESIAPAN MURNI SISTEM (Tanpa Paper & Mock)** | **~70%** | Progres fungsional live end-to-end (lihat detail di `docs/14-Laporan_Progres_Proyek_SIGAP.md`) |

---

## Perubahan Signifikan — 6 Oktober 2026 (Sesi Hari Ini)

### Penambahan Baru

| # | Fitur / Perubahan | File yang Diubah |
|---|---|---|
| 1 | **Landing Page SIGAP** dibuat sebelum menu login | `Frontend/src/pages/LandingPage.jsx` (baru) |
| 2 | **Halaman Login Siswa** dipisahkan dari Landing ke rute `/login` | `Frontend/src/pages/student/Login.jsx` (baru) |
| 3 | **Routing diperbarui**: `/` → LandingPage, `/login` → Login Siswa | `Frontend/src/App.jsx` |
| 4 | **Menu navigasi header dibersihkan**: Hapus link Beranda, 7 Kategori, Alur Aduan, FAQ dari `StudentHeader` | `Frontend/src/components/layout/StudentHeader.jsx` |
| 5 | **Gate autentikasi Buat Aduan**: User wajib login/daftar sebelum akses formulir aduan | `LandingPage.jsx`, `CreateReportWizard.jsx`, `StudentHeader.jsx`, `Login.jsx`, `Register.jsx` |
| 6 | **Redirect otomatis pasca login/daftar**: Setelah login/daftar dari konteks Buat Aduan, langsung diarahkan ke formulir | `Login.jsx`, `Register.jsx` |
| 7 | **Modal autentikasi di Landing Page**: Pop-up informatif muncul saat Buat Aduan diklik tanpa sesi aktif | `LandingPage.jsx` |
| 8 | **Semua file `.md` dirapikan** ke folder `docs/` | Semua `.md` root-level |

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
| Fase 5 | Integrasi frontend dengan API backend dan autentikasi | 🔄 |
| Fase 6 | Integrasi dashboard, data eksternal, dan fitur AI ke tampilan | 🔄 |
| Fase 7 | **Testing frontend, perbaikan bug, validasi responsive** — **FOKUS BERIKUTNYA** | ❌ |
| Fase 8 | Deployment frontend ke server/hosting | ❌ |

### Catatan Frontend — 6 Oktober 2026

- **Build produksi berhasil** ✅ — `vite build` exit code 0 tanpa error.
- **Fallback localStorage/mockData masih aktif** — jika backend tidak jalan, UI masih berfungsi dengan data mock. Perlu dinonaktifkan saat production.
- **Token/session**: Disimpan di `localStorage` (cukup untuk dev). Perlu dipertimbangkan cookie `HttpOnly` untuk production.
- **Integrasi Login Siswa ke Backend**: Form login sudah ada tapi masih mock (`loginUser` dengan data hardcode). Belum memanggil `api.loginSiswa()`.

---

## C. Daftar Hal yang Perlu Diperbaiki (Backlog Testing)

> Bagian ini diisi setelah user melakukan testing langsung di live web.

### Prioritas Tinggi 🔴

- [x] Perbaiki virtual environment backend (`venv` baru dibuat ulang, dependencies terpasang, 58 tests passed)
- [x] Perbaikan role guard admin: admin dilarang mengakses form Buat Aduan & diarahkan ke dashboard admin
- [x] Perbaikan navigasi StudentHeader: link nama & logo diarahkan ke `/admin/dashboard` untuk admin, sembunyikan tombol Buat Aduan bagi admin
- [x] Hubungkan form Login Siswa ke endpoint `api.loginSiswa()` dengan JWT token nyata & error handling
- [x] Hubungkan form Register Siswa ke endpoint `api.registerSiswa()` dengan autentikasi otomatis & error handling nyata
- [x] Pastikan token JWT dari backend disimpan dan dikirimkan pada request terproteksi
- [ ] Tambahkan route guard: redirect ke `/login` jika token tidak ada atau kedaluwarsa

### Prioritas Sedang 🟡

- [ ] Hubungkan form Buat Aduan ke endpoint `api.buatPengaduan()` secara penuh (fallback lokal siap)
- [ ] Hubungkan halaman Lacak Tiket ke endpoint `api.cekStatus()`
- [ ] Hubungkan dashboard admin ke endpoint `api.getDashboardSummary()`
- [ ] Pastikan perubahan status laporan memanggil `api.ubahStatus()` ke backend
- [ ] Nonaktifkan fallback mock data di production
- [x] Perbaiki CORS backend agar tidak wildcard (membaca dari `ALLOWED_ORIGINS` di `.env`)
- [x] Perbaiki upload berkas: validasi MIME, magic bytes, batas 10MB, UUID file name

### Prioritas Rendah 🟢

- [ ] Validasi responsive mobile: Landing Page, form aduan, lacak tiket
- [ ] Periksa tampilan di mode gelap sistem (jika berlaku)
- [ ] Evaluasi akurasi AI NLP: dokumentasi Precision, Recall, F1 per kategori
- [x] Buat/Verifikasi `docker-compose.yml` untuk orkestrasi lokal (Frontend + Backend + DB + phpMyAdmin)
- [x] Buat script pembantu development `sigap-dev.sh`
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

| 07 Oktober 2026 (Sore) | Perbaikan auth login siswa (seeding akun & verifikasi kata sandi backend), sinkronisasi metrik laporan dashboard admin ke data nyata (tanpa offset dummy), integrasi 7 kategori resmi Permendikbudristek No. 46/2023, penambahan halaman Coming Soon Validasi AI, perbaikan layout responsif Desktop 100% zoom (Landing Page & Student Dashboard), build sukses ke Docker dist. Estimasi progres keseluruhan: **~87%** |
| 07 Oktober 2026 (Pagi) | Perbaikan 4 prioritas backend (venv, DB, CORS, upload sanitization). Role guard admin & navigasi StudentHeader. Integrasi auth login/register ke real backend API. Estimasi progres: ~85% |
| 06 Oktober 2026 | Penambahan Landing Page, pemisahan Login, gatekeeper Buat Aduan, pembersihan header nav, konsolidasi semua `.md` ke folder `docs/`. Estimasi progres keseluruhan: ~78% |
| 30 September 2026 | Penyempurnaan TrackReport, StudentDashboard, CreateReportWizard |
| 29 September 2026 | Penyempurnaan ETL external data, modul AI pipeline |
| 16 September 2026 | Setup awal proyek, implementasi semua halaman utama, struktur backend lengkap |

---

> **Langkah berikutnya:** User akan melakukan testing langsung di live web.
> Hasil temuan bug dan masalah UI akan dicatat di bagian **C. Daftar Hal yang Perlu Diperbaiki** di atas.

> Status pada dokumen ini diperbarui setelah setiap sesi kerja atau temuan testing.
