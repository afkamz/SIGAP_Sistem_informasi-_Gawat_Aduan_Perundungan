# Progress Mingguan Pengembangan SIGAP (Minggu 6)

---

## 🗓️ Time Line Pengembangan Proyek

### 🔍 Minggu 1–3 : Persiapan & Fondasi
* Finalisasi PRD, ERD database, dan kontrak API.
* Setup FastAPI + MySQL + auth JWT di backend.
* Setup React + wireframe tampilan di frontend.
* Seeding data awal dari CSV.

### 🎯 Minggu 4–7 : Pengembangan Inti (📍 Posisi Saat Ini: Minggu 6)
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

## 📌 Progress Mingguan : Backend (Minggu 6)

### Task 1 ✅
* **Finalisasi field form autentikasi dan pemetaan response dashboard**
  * Menentukan field spesifik form login/register siswa (NISN, Nama, Sekolah, Password) dan login admin (NIP, Password).
  * Menentukan struktur data JSON yang dibutuhkan untuk komponen dashboard siswa dan admin.

### Task 2 ✅
* **Validasi data siswa, hashing password bcrypt, dan proteksi duplikasi NISN**
  * Membangun schema validasi Pydantic untuk registrasi siswa dengan pengecekan keunikan NISN.
  * Menerapkan hashing password menggunakan `bcrypt` sebelum disimpan ke database.

### Task 3 ✅
* **Penguatan otentikasi JWT, role-based access control (RBAC), dan profil user**
  * Menyematkan payload `sub`, `role` (siswa/admin), dan waktu kedaluwarsa (`exp`) pada JWT access token.
  * Membuat *dependency* verifikasi token untuk membatasi akses endpoint dashboard dan data privat.

### Task 4 ✅
* **Penyesuaian response endpoint dashboard admin**
  * Endpoint analytics mengembalikan data statistik total laporan, distribusi status, kategori perundungan, dan daftar laporan terbaru.

### Task 5 ✅
* **Penyesuaian response endpoint dashboard user (siswa)**
  * Endpoint mengembalikan informasi profil siswa, ringkasan jumlah laporan aktif, riwayat pengaduan, dan status tiket secara terstruktur.

---

## 📌 Progress Mingguan : Frontend (Minggu 6)

### Task 1 ✅
* **Perapian navigasi, ringkasan laporan, riwayat, dan pelacakan status tiket siswa**
  * Merapikan alur navigasi portal siswa, tampilan ringkasan status pengaduan, dan tombol aksi pembuatan laporan baru.
  * Meningkatkan kejelasan kartu status penjejakan tiket (*ticket tracking*).

### Task 2 ✅
* **Perapian kartu statistik, tabel laporan masuk, filter kategori/status, dan navigasi detail admin**
  * Merapikan komponen dashboard admin: card ringkasan metrik, tabel daftar laporan interaktif, filter status, dan navigasi ke detail kasus.

### Task 3 ✅
* **Evaluasi UX form, ukuran input, label, tombol, dan pesan validasi error**
  * Memeriksa dan menyempurnakan ergonomi form pengaduan: tata letak kolom input, tombol pilihan kategori, mode pelaporan anonim, dan pesan error yang informatif.

### Task 4 ✅
* **Penyediaan feedback state antarmuka (Loading, Error, Empty State, Success, Session Expired)**
  * Menambahkan komponen animasi *loading skeleton*, pesan notifikasi gagal/sukses, tampilan data kosong (*empty state*), dan modal sesi kedaluwarsa.

### Task 5 ✅
* **Penyelarasan field mock data frontend dengan schema backend**
  * Menyeragamkan penamaan field pada `mockData` dan state lokal agar identik dengan schema request/response FastAPI.

---

## ⚠️ Kendala dan Keputusan

### Frontend

**Kendala:**
1. Pengiriman data laporan membutuhkan upload file bukti fisik bersamaan dengan data teks formulir (kategori, deskripsi, mode anonim).
2. Tampilan dashboard admin memerlukan sinkronisasi visual antara data seed awal (historis) dan laporan real-time yang baru masuk.
3. Penanganan token kedaluwarsa saat user sedang berada di tengah-tengah pengisian formulir pengaduan.

**Keputusan:**
1. Menggunakan format payload `FormData` (`multipart/form-data`) pada `services/api.js` untuk transmisi data teks dan berkas sekaligus.
2. Memisahkan widget visualisasi data historis dengan tabel laporan aktif di sisi UI agar informasi tidak ambigu.
3. Menyimpan draf formulir sementara di `sessionStorage` agar data yang diketik siswa tidak hilang jika sesi terputus.

---

### Backend

**Kendala:**
1. Validasi file upload rawan disusupi file berbahaya atau berukuran terlalu besar yang membebani server lokal.
2. Penanganan CORS saat frontend Vite beralih dari mode mock ke integrasi langsung dengan server FastAPI.
3. Konsistensi relasi foreign key antara siswa anonim dengan catatan laporan di tabel basis data.

**Keputusan:**
1. Membatasi format file yang diizinkan (JPG, PNG, PDF), batas maksimal ukuran 5MB, serta mengubah nama file menjadi UUID hash acak.
2. Mengonfigurasi middleware CORS FastAPI dengan origin lokal frontend (`http://localhost:5173`) secara eksplisit.
3. Menetapkan nilai `siswa_id` tetap tercatat di backend untuk kebutuhan tracking tiket, namun identitas disembunyikan (*masked*) pada response publik/admin jika opsi anonim aktif.

---

## 🎯 Rencana Pengembangan Minggu Depan (Minggu 7 — Persiapan Menuju Fase AI & Dashboard)

### Frontend

1. **Integrasi Langsung API Endpoint Form Pengaduan:**
   * Menghubungkan form pengaduan siswa ke endpoint FastAPI `/api/v1/pengaduan/` (menggantikan mock submit sepenuhnya).
2. **Integrasi Autentikasi Login & Register Real:**
   * Menghubungkan halaman login siswa (NISN) & admin (NIP) dengan endpoint `/api/v1/auth/` serta penyimpanan token di state aplikasi.
3. **Integrasi Real-time Ticket Tracking:**
   * Menghubungkan input pencarian kode tiket langsung ke database backend untuk memantau transisi status terkini.
4. **Penyiapan Komponen Widget AI di Halaman Detail Admin:**
   * Membuat komponen visual untuk menampilkan rekomendasi kategori AI (*Confidence Score* badge) dan kotak klaster laporan serupa.
5. **Pengujian Responsivitas & Alur End-to-End Lokal:**
   * Menguji alur pelaporan mulai dari submit di frontend, penerimaan di backend, hingga verifikasi admin di layar desktop dan mobile.

---

### Backend

1. **Integrasi Modul Preprocessing & Embedding AI pada Endpoint Pengaduan:**
   * Menghubungkan modul NLP IndoBERT agar langsung menggenerasi rekomendasi kategori otomatis saat laporan baru disimpan.
2. **Penyempurnaan Endpoint Detail Kasus & Verifikasi Admin:**
   * Menyediakan endpoint bagi admin untuk menyetujui rekomendasi AI (*approve*) atau mengubah kategori manual (*override*) serta mencatatnya ke `audit_trail`.
3. **Aktivasi Endpoint Clustering Laporan Serupa:**
   * Menjalankan algoritma HDBSCAN untuk mengelompokkan laporan-laporan yang memiliki kemiripan konteks perundungan.
4. **Penguatan Validasi Transisi Status (State Transition Guard):**
   * Menguji penolakan otomatis jika admin mencoba melompati alur status (contoh: langsung dari `Menunggu` ke `Selesai`).
5. **Pengujian Fungsional & API Smoke Test:**
   * Melakukan automated test / Postman collection untuk memastikan seluruh endpoint core stabil sebelum integrasi penuh.

