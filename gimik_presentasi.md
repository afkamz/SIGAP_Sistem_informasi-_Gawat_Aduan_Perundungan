# Progress Mingguan Pengembangan SIGAP

---

## 🗓️ Time Line Pengembangan Proyek

### 🔍 Minggu 1–3 : Persiapan & Fondasi
* Finalisasi PRD, ERD database, dan kontrak API.
* Setup FastAPI + MySQL + auth JWT di backend.
* Setup React + wireframe tampilan di frontend.
* Seeding data awal dari CSV.

### 🎯 Minggu 4–7 : Pengembangan Inti
* Implementasi endpoint inti pengaduan, login admin, pelacakan tiket, validasi input, dan audit trail.
* Penyelesaian halaman utama siswa dan admin.
* Integrasi awal frontend dengan backend.

### 💻 Minggu 8–11 : Dashboard, AI, Clustering, dan Pengujian Integrasi
* Implementasi dashboard dan visualisasi data.
* Integrasi rekomendasi kategori berbasis AI serta clustering laporan.
* Penyempurnaan penggabungan data seed dengan laporan aktif.
* Pengujian unit dan integrasi.

### 🔗 Minggu 12–14 : Testing, UAT, Perbaikan Bug, Keamanan, Finalisasi Konfigurasi, dan Deployment
* Testing akhir meliputi pengujian end-to-end, UAT, validasi keamanan, dan pemeriksaan hak akses.
* Perbaikan bug berdasarkan hasil testing, finalisasi konfigurasi, lalu deployment aplikasi ke server/lingkungan produksi.

---

## 📌 Progress Mingguan : Backend

### Task 1 ✅
* **Audit, pembersihan, dan penyelarasan dataset**
  * Membersihkan data kosong, duplikat, serta penyeragaman format dan delimiter CSV pada folder `dataset/`.
  * Menyiapkan seed narasi untuk 7 kategori kasus perundungan.

### Task 2 ✅
* **Konfigurasi lingkungan dan penguatan basis data core**
  * Setup struktur proyek FastAPI dan konfigurasi environment.
  * Pembuatan model relasional tabel admin, siswa, pengaduan, kategori, bukti, dan audit trail (MySQL/SQLite).

---

## 📌 Progress Mingguan : Frontend

### Task 1 ✅
* **Setup React, Vite, Tailwind, dan struktur proyek**
  * Inisialisasi proyek React Vite, Tailwind CSS, serta struktur folder modular.
  * Konfigurasi routing dasar untuk halaman siswa dan admin.

### Task 2 ✅
* **Design system tampilan dan UI Kit**
  * Menentukan palet warna, tipografi, komponen tombol, badge status, form input, dan layout responsif.

### Task 3 ✅
* **Implementasi halaman siswa:**
  * Pengaduan kasus baru (pilihan kategori, deskripsi, mode anonim, upload bukti).
  * Pelacakan proses pengaduan secara real-time via kode tiket.
  * Landing page dan dashboard riwayat pengaduan siswa.

### Task 4 ✅
* **Implementasi halaman admin:**
  * Halaman login admin.
  * Dashboard ringkasan laporan, statistik, verifikasi rekomendasi AI, dan audit trail.

---

## ⚠️ Kendala dan Keputusan

### Frontend

**Kendala:**
1. Portal siswa dan admin memiliki alur serta kebutuhan tampilan berbeda.
2. Banyak halaman membutuhkan navigasi dan pembatasan akses.
3. Sebagian alur masih dapat menggunakan mock data / localStorage saat backend gagal.

**Keputusan:**
1. Memisahkan `pages/student`, `pages/admin`, `layout`, `context`, `services`, dan `charts`.
2. Menggunakan React Router dengan route guard terpisah antara siswa dan admin.
3. Fallback mock data dipakai sementara untuk development agar UI tetap dapat diuji.

---

### Backend

**Kendala:**
1. Admin dan siswa memiliki hak akses berbeda.
2. Router dapat menjadi terlalu besar jika memuat seluruh logika sistem.
3. Siswa berisiko mengakses laporan milik siswa lain (IDOR).

**Keputusan:**
1. Menggunakan JWT, bcrypt untuk hashing password, dan role pada token.
2. Memisahkan modul `router`, `security`, `schema`, `model`, `AI`, dan `ETL`.
3. Menggunakan pemeriksaan role dan ownership data (identitas siswa diambil dari JWT, bukan parameter URL).

---

## 🎯 Rencana Pengembangan Minggu Depan

### Frontend

1. Merapikan ringkasan laporan, riwayat, status tiket, navigasi, dan tombol buat laporan.
2. Merapikan kartu statistik, tabel/daftar laporan, kategori, status, dan navigasi detail pada dashboard admin.
3. Memeriksa susunan form, ukuran input, label, tombol, pesan error, dan kemudahan penggunaan (UX).
4. Menyiapkan tampilan loading, error, data kosong (*empty state*), berhasil, dan session kedaluwarsa.
5. Menyamakan field mock data dengan data yang nantinya dikirim oleh backend.

---

### Backend

1. Menentukan field form login/register dan informasi yang harus ditampilkan pada setiap dashboard.
2. Data siswa divalidasi, password di-hash bcrypt, dan NISN tidak boleh duplikat.
3. Token, role, dan profil user dapat digunakan untuk membatasi akses dashboard.
4. Menyesuaikan response dashboard admin: mengembalikan statistik, status, kategori, laporan terbaru, dan data yang diperlukan UI.
5. Menyesuaikan response dashboard user: mengembalikan profil, ringkasan, riwayat laporan, dan status tiket sesuai UI final.
