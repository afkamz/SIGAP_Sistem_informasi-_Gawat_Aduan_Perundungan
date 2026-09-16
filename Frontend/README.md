# Frontend Web SIGAP (React + Vite)

Aplikasi web modern untuk **SIGAP (Sistem Informasi Pengaduan Pelajar)** yang dibangun menggunakan **React 18**, **Vite**, **Tailwind CSS**, **Lucide Icons**, dan **Apache ECharts** sesuai spesifikasi [PRD.md](../PRD.md), [uiuxspesification.md](../uiuxspesification.md), [Arsitektur_Sistem_SIGAP.md](../Arsitektur_Sistem_SIGAP.md), serta rancangan wireframe.

---

## 🚀 Cara Menjalankan Frontend React

### 1. Prasyarat
Pastikan Node.js (versi 18+) dan npm sudah terinstal pada komputer Anda.

### 2. Instalasi Dependensi
Buka terminal pada folder `Frontend`, lalu jalankan:
```bash
npm install
```

### 3. Menjalankan Server Pengembangan (Vite Dev Server)
```bash
npm run dev
```
Aplikasi akan otomatis berjalan di: **http://localhost:3000** (atau port yang ditentukan Vite).

### 4. Build untuk Produksi
```bash
npm run build
```
Hasil build siap *deploy* akan berada di folder `dist/`.

---

## 🔑 Akun & Kredensial Uji Coba

- **Portal Siswa:**
  - **NISN:** `3125521007` (atau 10 digit angka lainnya)
  - **Kata Sandi:** apa saja (contoh: `siswa123`)
  - **Akses Anonim:** Bisa langsung mengakses tombol *"Lacak status laporan tanpa login"* atau *"Lacak Tiket"* di pojok kanan atas.

- **Portal Petugas / Guru BK (Admin):**
  - **NIP:** `198001012026`
  - **Kata Sandi:** `admin123`
  - Klik tombol *"Masuk ke Panel Admin"*.

- **Kode Tiket Uji Coba (untuk Lacak Laporan):**
  - `SGP-2024-0142` (Perundungan Siber — Status: Diverifikasi)
  - `SGP-2024-0141` (Perundungan Fisik — Status: Diverifikasi)
  - `SGP-2024-0140` (Perundungan Verbal — Status: Menunggu, Low AI)
  - `SGP-2024-0139` (Pemalakan Kantin — Status: Ditindaklanjuti, Klaster)

---

## 🧭 Peta Rute & Komponen React

| Rute Hash | Layar Sesuai Spesifikasi | Komponen React | Deskripsi & Fitur Utama |
|---|---|---|---|
| `#/` | **S-01 Onboarding & Login** | `<Landing />` | Ruang aman siswa, jaminan perlindungan, form login NISN, dan lacak tanpa login. |
| `#/register` | **S-02 Registrasi Siswa** | `<Register />` | Pendaftaran akun siswa dengan validasi asal sekolah. |
| `#/dashboard` | **S-03 Dashboard Siswa** | `<StudentDashboard />` | Stat cards aduan, greeting nama, tombol `+ Buat Laporan Baru`, riwayat, dan kontak darurat Satgas. |
| `#/buat-laporan` | **S-04 s.d S-08 Multi-Step Form** | `<CreateReportWizard />` | Wizard 4 tahap: (1) 7 Kategori, (2) Detail Kejadian & Counter Karakter, (3) Pilihan Mode Anonim/Terbuka & Berkas Bukti, (4) Konfirmasi & Kode Tiket. |
| `#/lacak` | **S-09 & S-10 Pelacakan Tiket** | `<TrackReport />` | Input kode tiket instan, timeline stepper 4 tahap berurutan, dan catatan resmi konselor BK. |
| `#/admin/login` | **A-01 Login Admin / Guru BK** | `<AdminLogin />` | Akses terbatas NIP 18 digit dengan autentikasi terenkripsi JWT. |
| `#/admin/dashboard` | **A-02 Dashboard Statistik** | `<AdminDashboard />` | Visualisasi ECharts tren bulanan vs baseline nasional, bar distribusi 7 kategori, stat cards beban penanganan. |
| `#/admin/laporan` | **A-03 Daftar Pengaduan Masuk** | `<ReportList />` | Filter multi-kondisi (Kategori, Status, Anomali, Klaster), badge akurasi IndoBERT & penanda klaster HDBSCAN. |
| `#/admin/laporan-detail` | **A-04 s.d A-07 Detail & State Machine** | `<ReportDetail />` | Panel analisis AI IndoBERT, setujui AI, override manual kategori, deteksi klaster insiden serupa, dan kontrol transisi status sekuensial. |
| `#/admin/audit` | **A-08 Jejak Audit (Audit Trail)** | `<AuditTrail />` | Log kronologis aktivitas tidak dapat diubah (immutable), verifikasi hash SHA-256, dan riwayat mutasi status laporan. |
| `#/admin/pengaturan` | **Pengaturan Sistem** | `<AdminSettings />` | Konfigurasi parameter satuan pendidikan, ambang batas model AI, dan tombol pemulihan data uji coba. |

---

## 📁 Struktur Direktori React

```text
Frontend/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── context/
│   │   └── StoreContext.jsx
│   ├── data/
│   │   ├── categories.js
│   │   └── mockData.js
│   ├── services/
│   │   └── api.js
│   ├── components/
│   │   ├── layout/
│   │   │   ├── StudentHeader.jsx
│   │   │   ├── StudentFooter.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   └── AdminLayout.jsx
│   │   └── charts/
│   │       └── DashboardCharts.jsx
│   └── pages/
│       ├── student/
│       │   ├── Landing.jsx
│       │   ├── Register.jsx
│       │   ├── StudentDashboard.jsx
│       │   ├── CreateReportWizard.jsx
│       │   └── TrackReport.jsx
│       └── admin/
│           ├── AdminLogin.jsx
│           ├── AdminDashboard.jsx
│           ├── ReportList.jsx
│           ├── ReportDetail.jsx
│           ├── AuditTrail.jsx
│           └── AdminSettings.jsx
└── README.md
```
