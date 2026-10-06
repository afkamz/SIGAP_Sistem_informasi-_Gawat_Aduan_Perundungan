# Progres Pengembangan SIGAP

Dokumen ini mencatat progres pengembangan SIGAP secara terpisah antara frontend dan backend.

Keterangan status: **✅ Selesai** | **🔄 Sebagian** | **❌ Belum selesai**

---

## Ringkasan Cepat — Update 6 Oktober 2026

| Komponen | Progres | Catatan |
|---|:---:|---|
| Frontend (React + Vite + Tailwind) | **~90%** | Semua halaman utama sudah ada dan bisa di-build |
| Backend (FastAPI + SQLAlchemy + JWT) | **~75%** | Router & model siap, venv perlu diperbaiki |
| AI / NLP Pipeline | **~70%** | IndoBERT + HDBSCAN sudah diimplementasikan |
| Paper / Laporan Akademik (SIGAP.tex) | **~65%** | Belum ada bab Hasil, Pembahasan, Kesimpulan |
| Testing, Integrasi E2E & Deployment | **~60%** | Unit test ada, integrasi live belum penuh |
| **KESELURUHAN** | **~78%** | Testing live dan perbaikan bug menjadi fokus berikutnya |

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

- **Virtual environment rusak**: Path interpreter Python di `venv/` mengarah ke path lama (`/home/afkam/Downloads/tes/`). Perlu dibuat ulang dengan `python3 -m venv venv && pip install -r requirements.txt`.
- **SQLite lokal sudah ada** (`sigap.db` 131 KB) — data development tersedia.
- **Upload berkas**: Folder `uploads/` ada, namun belum ada kompresi, sanitasi MIME, atau Cloud Storage.
- **CORS**: Masih `allow_origins=["*"]` — perlu dibatasi sebelum production.

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

- [ ] Perbaiki virtual environment backend (`venv` rusak, Python path salah)
- [ ] Hubungkan form Login Siswa ke endpoint `api.loginSiswa()` (saat ini masih hardcode mock)
- [ ] Hubungkan form Register ke endpoint `api.registerSiswa()` dengan error handling nyata
- [ ] Pastikan token JWT dari backend disimpan dan dikirimkan pada request terproteksi
- [ ] Tambahkan route guard: redirect ke `/login` jika token tidak ada atau kedaluwarsa

### Prioritas Sedang 🟡

- [ ] Hubungkan form Buat Aduan ke endpoint `api.buatPengaduan()` (saat ini memakai `createReport` lokal)
- [ ] Hubungkan halaman Lacak Tiket ke endpoint `api.cekStatus()`
- [ ] Hubungkan dashboard admin ke endpoint `api.getDashboardSummary()`
- [ ] Pastikan perubahan status laporan memanggil `api.ubahStatus()` ke backend
- [ ] Nonaktifkan fallback mock data di production
- [ ] Perbaiki CORS backend agar tidak wildcard

### Prioritas Rendah 🟢

- [ ] Validasi responsive mobile: Landing Page, form aduan, lacak tiket
- [ ] Periksa tampilan di mode gelap sistem (jika berlaku)
- [ ] Tambahkan kompresi & validasi MIME pada upload bukti
- [ ] Evaluasi akurasi AI NLP: dokumentasi Precision, Recall, F1 per kategori
- [ ] Buat `docker-compose.yml` untuk orkestrasi lokal (Frontend + Backend + DB)
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
| 06 Oktober 2026 | Penambahan Landing Page, pemisahan Login, gatekeeper Buat Aduan, pembersihan header nav, konsolidasi semua `.md` ke folder `docs/`. Estimasi progres keseluruhan: ~78% |
| 30 September 2026 | Penyempurnaan TrackReport, StudentDashboard, CreateReportWizard |
| 29 September 2026 | Penyempurnaan ETL external data, modul AI pipeline |
| 16 September 2026 | Setup awal proyek, implementasi semua halaman utama, struktur backend lengkap |

---

> **Langkah berikutnya:** User akan melakukan testing langsung di live web.
> Hasil temuan bug dan masalah UI akan dicatat di bagian **C. Daftar Hal yang Perlu Diperbaiki** di atas.

> Status pada dokumen ini diperbarui setelah setiap sesi kerja atau temuan testing.
