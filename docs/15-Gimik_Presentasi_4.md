# Progress Mingguan Pengembangan SIGAP (Minggu 8)

---

## 🗓️ Time Line Pengembangan Proyek

### 🔍 Minggu 1–3 : Persiapan & Fondasi
* Finalisasi PRD, ERD database, dan kontrak API.
* Setup FastAPI + MySQL + auth JWT di backend.
* Setup React + wireframe tampilan di frontend.
* Seeding data awal dari CSV.

### 🎯 Minggu 4–7 : Pengembangan Inti & Refinement UI/UX
* Implementasi endpoint inti pengaduan, login admin, pelacakan tiket, validasi input, dan audit trail.
* Penyelesaian halaman utama siswa dan admin sesuai standar referensi resmi.
* Pemantapan infrastruktur container Docker (MySQL, FastAPI, Frontend, phpMyAdmin).
* Pembersihan tampilan desktop 100% zoom dan penyelarasan rasio kontainer.

### 💻 Minggu 8–11 : Integrasi Live API, Penguatan Keamanan, & Pipeline AI (📍 Posisi Saat Ini: Minggu 8 — Route Guard, Sinkronisasi Tiket Nyata, & Validasi Hybrid Lacak Tiket)
* Implementasi proteksi rute terpusat (*Route Guard*) pada portal admin dan siswa.
* Sinkronisasi kode tiket aduan riil dari database MySQL ke antarmuka pengguna.
* Pencarian status laporan hybrid (pencarian lokal + verifikasi langsung ke server backend).
* Pembaruan formulir aduan siswa dengan kalender interaktif dan pelabelan lokasi terstandarisasi.
* Verifikasi 58 pengujian otomatis backend (*test suite*) lulus 100%.

### 🔗 Minggu 12–14 : Testing End-to-End, UAT, Keamanan, & Final Deployment
* Pengujian end-to-end bersama pihak sekolah/konselor BK, validasi keamanan, dan audit hak akses.
* Evaluasi performa klasifikasi NLP IndoBERT dan klasterisasi HDBSCAN pada data aduan riil.
* Finalisasi konfigurasi lingkungan produksi dan deployment ke server publik.

---

## 📌 Progress Mingguan : Frontend (Minggu 8)

### Task 1 ✅
* **Implementasi Route Guard Terpusat (`ProtectedRoute.jsx`)**
  * Membangun komponen penjaga rute (`ProtectedRoute.jsx`) untuk memvalidasi hak akses (*Role-Based Access Control*) sebelum komponen halaman dirender.
  * Mengamankan seluruh rute portal admin Guru BK (`/admin/dashboard`, `/admin/laporan`, `/admin/laporan-detail`, `/admin/validasi-ai`, `/admin/audit`, `/admin/pengaturan`) agar secara otomatis mengarahkan (*redirect*) ke `/admin/login` jika token JWT admin tidak ditemukan.
  * Mengamankan rute `/dashboard` siswa agar hanya dapat diakses setelah siswa berhasil melakukan autentikasi dengan akun resmi.

### Task 2 ✅
* **Sinkronisasi Kode Tiket Riil Backend pada State Management (`StoreContext.jsx`)**
  * Memperbarui logika penyerahan aduan (`createReport`) agar menangkap dan menggunakan nilai respon `res.ticket_code` yang digenerasi secara unik oleh server backend FastAPI.
  * Menghilangkan perbedaan antara kode tiket yang ditampilkan pada layar bukti tanda terima siswa dengan kode tiket yang tersimpan pada tabel MySQL `pengaduan`.
  * Menjaga mekanisme *fallback* lokal yang aman agar proses pengajuan tetap dapat diselesaikan dengan mulus apabila koneksi jaringan mengalami gangguan sementara.

### Task 3 ✅
* **Pencarian Status Laporan Cerdas & Terverifikasi Server (*Hybrid Ticket Lookup*)**
  * Memperbarui fungsi pencarian pada `TrackReport.jsx` menjadi asinkronus (`async/await`).
  * Jika kode tiket tidak ditemukan pada penyimpanan lokal peramban (misalnya saat siswa membuka pelacakan dari perangkat/komputer lain), sistem secara otomatis melakukan permintaan HTTP ke endpoint `api.cekStatus(ticket_code)`.
  * Memetakan data status terverifikasi dari pangkalan data pusat secara langsung ke tampilan progres 4 tahap: `Menunggu` -> `Diverifikasi` -> `Ditindaklanjuti` -> `Selesai`.

### Task 4 ✅
* **Penyempurnaan Formulir Pengaduan (Date Picker Kalender & Label Lokasi Kejadian)**
  * Mengganti pengisian tanggal kejadian yang semula diketik manual menjadi pemilih tanggal kalender interaktif (`type="date"`) pada `CreateReportWizard.jsx`.
  * Menyediakan tombol pintas cepat: **"Hari Ini"**, **"Kemarin"**, dan **"Hapus"** untuk mempercepat proses pelaporan.
  * Menerapkan validasi batasan waktu maksimum (`max={today}`) untuk mencegah kekeliruan penginputan tanggal kejadian di masa depan.
  * Mengubah label bidang formulir dari *"Lokasi / Kanal"* menjadi *"Lokasi Kejadian"* yang dilengkapi ikon lokasi `MapPin` dan panduan tempat yang jelas.

### Task 5 ✅
* **Verifikasi Build Produksi Frontend**
  * Menjalankan build optimasi bundel (`npm run build` dengan Vite) dengan status keluar sukses (exit code 0).
  * Seluruh modul (2.152 modul) berhasil ditransformasi tanpa *syntax error* dan aset terbaru siap disajikan oleh Nginx container.

---

## 📌 Progress Mingguan : Backend & Database (Minggu 8)

### Task 1 ✅
* **Verifikasi Otomasi Pengujian Backend (58 Unit & E2E Tests Lulus 100%)**
  * Menjalankan seluruh rangkaian tes otomatis menggunakan `pytest` di dalam virtual environment backend.
  * Seluruh 58 skenario pengujian berhasil lulus 100% tanpa kegagalan:
    * `test_e2e.py` (10 skenario alur kerja lengkap dari registrasi hingga penutupan aduan).
    * `tests/test_auth.py` (14 skenario autentikasi JWT, hashing kata sandi bcrypt, dan validasi role).
    * `tests/test_dashboard.py` (12 skenario kalkulasi metrik, agregasi KPI, dan data komparasi).
    * `tests/test_pengaduan.py` (22 skenario validasi payload, unggah bukti, transisi status, dan cek tiket publik).

### Task 2 ✅
* **Penguatan Sanitasi Upload Berkas & Pencegahan Eksploitasi**
  * Memvalidasi modul penerimaan bukti dokumen/foto aduan pada endpoint `POST /api/pengaduan/{ticket_code}/bukti`.
  * Menerapkan 4 lapis perlindungan: pembatasan ukuran maksimal 10 MB, *whitelist* tipe MIME (JPG, PNG, WebP, PDF), verifikasi *magic bytes* biner (mencegah penyamaran ekstensi berkas), dan penyimpanan nama berkas berbasis UUID acak (mencegah *path traversal*).

### Task 3 ✅
* **Pengetatan Keamanan CORS & Konfigurasi Lingkungan**
  * Memastikan middleware CORS backend tidak lagi menggunakan wildcard (`*`).
  * Backend hanya mengizinkan permintaan lintas domain dari domain yang secara eksplisit terdaftar pada variabel `ALLOWED_ORIGINS` di berkas `.env` (Port 3000 Nginx/Docker dan Port 5173 Vite local dev).

---

## ⚠️ Kendala dan Keputusan

### Frontend

**Kendala:**
1. Sebelumnya, pengguna yang belum melakukan login dapat mengakses langsung URL terproteksi seperti `/admin/dashboard` atau `/dashboard` hanya dengan mengetikkan tautan di bilah alamat peramban.
2. Kode tiket acak yang dibuat oleh simulasi frontend (`SGP-2026-XXX`) berpotensi berbeda dengan kode tiket yang dihasilkan oleh generator database MySQL, sehingga pelacakan tiket antar-sesi dapat mengalami kegagalan.
3. Pengisian tanggal kejadian secara manual berupa teks bebas rawan menimbulkan kesalahan format (*human error*) dan memungkinkan siswa memilih tanggal yang belum terjadi.

**Keputusan:**
1. Membangun komponen `ProtectedRoute.jsx` yang secara aktif memeriksa token JWT dan peran akun sebelum merender halaman rahasia, serta melempar pengguna tidak terotorisasi ke halaman login terkait.
2. Memperbarui `StoreContext.jsx` agar memprioritaskan kode tiket dari respon `api.buatPengaduan()`, dan menambahkan mekanisme pencarian *fallback* ke endpoint `api.cekStatus()` pada `TrackReport.jsx`.
3. Mengganti kolom teks tanggal menjadi input kalender `type="date"` dengan atribut `max` hari ini dan menyertakan tombol aksi cepat satu klik.

---

### Backend & Database

**Kendala:**
1. Pelacakan status pengaduan oleh siswa harus dapat diakses secara publik dan instan tanpa login, namun tetap tidak boleh membocorkan informasi pribadi pelapor atau catatan internal konselor yang bersifat rahasia.
2. Ketergantungan tes otomatis terhadap database harus dipastikan terisolasi agar pengujian tidak merusak data benih (*seed data*) operasional sekolah.

**Keputusan:**
1. Mengoptimalkan skema respon `PengaduanTicketOut` pada endpoint `GET /api/pengaduan/{ticket_code}/status` agar secara ketat hanya menyajikan kode tiket, nama kategori kekerasan resmi, status penanganan saat ini, dan stempel waktu pembuatan laporan.
2. Menggunakan basis data SQLite in-memory khusus untuk eksekusi pengujian `pytest`, menjamin kecepatan pengujian tinggi (4.23 detik untuk 58 tes) tanpa mengubah basis data MySQL utama.

---

## 📊 Status Kesiapan Sistem Riil (Evaluasi Objektif Minggu 8)

| Komponen | Status Fungsional Riil | Keterangan |
|---|:---:|---|
| **Autentikasi (JWT + Bcrypt)** | **100% Nyata** | Login siswa dan admin terverifikasi penuh ke database MySQL. |
| **Infrastruktur & Docker** | **95% Nyata** | 4 kontainer stabil (MySQL, FastAPI, Frontend Nginx, phpMyAdmin). |
| **Keamanan Rute (Route Guard)** | **95% Nyata** | Rute admin dan dashboard terlindungi komponen `ProtectedRoute`. |
| **Pelacakan Tiket (Track Report)** | **85% Nyata** | Mendukung pencarian lokal dan query live ke endpoint `api.cekStatus()`. |
| **Transaksi Aduan Siswa** | **65% Nyata** | Mengirim payload ke endpoint live backend dan mengikat tiket database. |
| **Antarmuka & Responsif** | **92% Nyata** | Tampilan bersih, rasio 100% zoom rapi, kalender tanggal interaktif. |
| **Testing Otomatis** | **90% Nyata** | 58 pengujian unit dan E2E backend lulus 100%. |
| **Modul AI (IndoBERT & HDBSCAN)** | **30% Nyata** | Skrip inferensi dan clustering siap di backend, persiapan integrasi form. |
| **ESTIMASI KESIAPAN SISTEM RIIL** | **~65%** | **Progres nyata berorientasi fungsional (bebas dari data palsu)** |

---

## 🎯 Rencana Pengembangan Minggu Depan (Minggu 9 — Penguatan Integrasi Live CRUD & Dashboard Admin)

1. **Pelepasan Fallback Mock Data pada Antrean Laporan Admin:**
   * Menghubungkan tabel antrean verifikasi laporan admin secara langsung ke endpoint `GET /api/pengaduan` dengan token JWT admin.
2. **Implementasi Aksi Perubahan Status Langsung ke MySQL:**
   * Menghubungkan tombol verifikasi dan perubahan status kasus oleh Guru BK ke endpoint `PATCH /api/pengaduan/{id}/status`.
3. **Penyaluran Riwayat Jejak Audit ke Tabel `audit_trail` Backend:**
   * Memastikan setiap perubahan status atau mutasi data oleh admin secara otomatis dicatat ke tabel `audit_trail` MySQL.
4. **Persiapan Antarmuka Kerja Menu Validasi AI:**
   * Mengembangkan tata letak tabel peninjauan rekomendasi AI pada halaman `ValidasiAI.jsx` untuk menggantikan kartu *Coming Soon*.

