# Progress Mingguan Pengembangan SIGAP (Minggu 7)

---

## 🗓️ Time Line Pengembangan Proyek

### 🔍 Minggu 1–3 : Persiapan & Fondasi
* Finalisasi PRD, ERD database, dan kontrak API.
* Setup FastAPI + MySQL + auth JWT di backend.
* Setup React + wireframe tampilan di frontend.
* Seeding data awal dari CSV.

### 🎯 Minggu 4–7 : Pengembangan Inti (📍 Posisi Saat Ini: Minggu 7 — Finalisasi Fitur Inti & Refinement UI/UX)
* Implementasi endpoint inti pengaduan, login admin, pelacakan tiket, validasi input, dan audit trail.
* Penyelesaian halaman utama siswa dan admin sesuai standar referensi resmi.
* Pemantapan infrastruktur container Docker (MySQL, FastAPI, Frontend, phpMyAdmin) dan integrasi awal.

### 💻 Minggu 8–11 : Dashboard Analitik Lanjutan, Pipeline AI, Clustering, dan Pengujian Integrasi
* Implementasi dashboard analitik komparatif makro-mikro dan visualisasi klaster.
* Integrasi rekomendasi kategori otomatis berbasis model NLP serta deteksi insiden berulang (clustering).
* Penyempurnaan sinkronisasi data benchmark nasional dengan aduan internal sekolah.
* Pengujian unit, integrasi sistem, dan smoke testing API.

### 🔗 Minggu 12–14 : Testing, UAT, Perbaikan Bug, Keamanan, Finalisasi Konfigurasi, dan Deployment
* Testing akhir meliputi pengujian end-to-end, UAT bersama pihak sekolah/konselor BK, validasi keamanan, dan audit hak akses.
* Perbaikan bug berdasarkan hasil evaluasi, finalisasi konfigurasi lingkungan produksi, dan deployment sistem ke server publik.

---

## 📌 Progress Mingguan : Backend & Database (Minggu 7)

### Task 1 ✅
* **Penguatan Resiliensi Koneksi Database & Mekanisme Auto-Retry Startup**
  * Mengatasi kendala *race condition* saat container Docker berjalan bersamaan dengan menambahkan logika *auto-retry* (hingga 10 percobaan dengan jeda waktu terukur) pada startup FastAPI di `main.py`.
  * Memastikan seluruh skema tabel relasional (`admins`, `siswa`, `kategori`, `pengaduan`, `bukti_pendukung`, `audit_trail`, `external_benchmark`) terbuat secara otomatis dan idempotensial pada basis data `sigap_db`.

### Task 2 ✅
* **Perbaikan Modul ETL Dataset Eksternal & Impor Data Benchmark Pemerintah**
  * Memperbaiki resolusi penanganan direktori dataset pada `etl_external.py` agar adaptif membaca *volume mount* `/app/dataset` di dalam container Docker maupun lingkungan host lokal.
  * Berhasil memproses dan mengimpor **188 baris data agregat nasional & daerah** (Dinas PPPA Aceh, DKP3A Kaltim, dan Kementerian PPPA) ke dalam tabel `external_benchmark` sebagai baseline komparasi kasus sekolah.

### Task 3 ✅
* **Inisialisasi Master Data 7 Kategori & Akun Default Satgas/Siswa**
  * Menjalankan seeding otomatis 7 kategori resmi kekerasan lingkungan satuan pendidikan berdasarkan Permendikbudristek No. 46 Tahun 2023.
  * Menyediakan akun seed percobaan yang aman: Guru BK/Satgas (NIP: `198001012026`) dan Siswa (NISN: `1234567890`) dengan password terenkripsi `bcrypt`.

### Task 4 ✅
* **Pengujian Endpoint Core & Verifikasi Isolasi Lingkungan phpMyAdmin**
  * Memvalidasi ketersediaan endpoint API RESTful (`GET /`, `GET /api/pengaduan/kategori`, router autentikasi, dan router dashboard).
  * Memverifikasi hak akses database `sigap_user` pada MySQL 8.0 dan phpMyAdmin, memastikan keamanan data terlindungi dan terisolasi khusus untuk skema `sigap_db`.

---

## 📌 Progress Mingguan : Frontend (Minggu 7)

### Task 1 ✅
* **Integrasi Tombol Aksi Cepat Lacak Laporan pada Dashboard Siswa**
  * Menambahkan tombol **"Lacak Laporan"** berdampingan dengan tombol **"Buat Laporan Baru"** pada banner aksi utama dashboard siswa.
  * Menerapkan tata letak responsif (*side-by-side* pada desktop/tablet dan *stacked* pada mobile) serta sinkronisasi navigasi kembali ke dashboard.

### Task 2 ✅
* **Penyempurnaan Alur & UX Formulir Pelacakan Status Laporan (Track Report)**
  * Menjadikan formulir pelacakan bersih (*clean state*) saat pertama kali dibuka tanpa *auto-trigger* pencarian palsu maupun peringatan error prematur.
  * Menambahkan tombol *clear* cepat `[X]` pada kolom input tiket, pesan helper validasi huruf kapital, modal bantuan *"Lupa Kode Tiket"*, dan tombol salin kode dengan umpan balik visual (*tooltip "Tersalin!"*).
  * Mengintegrasikan riwayat pengaduan siswa terdahulu dengan tab filter status (*Semua*, *Diproses*, *Selesai*) yang dapat langsung diklik untuk melihat detail tiket.

### Task 3 ✅
* **Implementasi Tampilan Detail Lengkap Progres Penanganan Kasus (Sesuai Referensi Resmi)**
  * Membangun tampilan penelusuran status 4 tahap interaktif: `Menunggu` -> `Diverifikasi` -> `Ditindaklanjuti` -> `Selesai` lengkap dengan tanggal/waktu pencatatan serta penanda *badge* aktif.
  * Menampilkan kotak resmi **Catatan Petugas Penanganan (Tim BK & Satgas PPKSP)** dengan atribusi konselor penanggung jawab.
  * Menyematkan klausul **Jaminan Kerahasiaan & Perlindungan Siswa** berlandaskan Permendikbudristek No. 46 Tahun 2023.
  * Menyediakan fitur aksi interaktif: modal formulir **"Kirim Pesan Tambahan / Bukti Baru"** dan fitur cetak/simpan **"Unduh Bukti Tanda Terima (PDF)"** resmi berformat kop surat SIGAP.

### Task 4 ✅
* **Implementasi Dashboard Analitik Admin (Sesuai Desain Referensi)**
  * Menata layout dashboard analitik: breadcrumb navigasi, lencana legenda data aktif vs referensi, filter dropdown semester tahun ajaran, dan tombol ekspor laporan.
  * Menampilkan 4 kartu ringkasan KPI: *Total Laporan* (+12%), *Menunggu Verifikasi* (Prioritas respons < 24 jam), *Ditindaklanjuti* (16.2% beban kasus), dan *Selesai & Ditutup* (tingkat resolusi 78.2%).
  * Membangun grafik ECharts **Tren Kasus per Bulan (11 Bulan: Jan–Nov)** yang membandingkan volume insiden internal sekolah terhadap baseline rata-rata nasional, dilengkapi kotak catatan analisis evaluasi MPLS.
  * Membangun visualisasi batang komparatif **Distribusi 7 Kategori Kekerasan** dengan penanda visual khusus (merah/coral) pada kategori berisiko tinggi (*Kekerasan Seksual*).
  * Mengembangkan tabel antrean verifikasi kasus terkini dengan indikator badge urgensi, badge status penanganan, dan tombol aksi periksa kasus.

### Task 5 ✅
* **Implementasi Halaman Daftar Laporan Masuk Admin & Multi-Filtering Terstruktur**
  * Membangun 5 kartu filter cepat interaktif: *Semua Aduan*, *Menunggu Verifikasi*, *Perlu Tinjauan AI*, *Terdeteksi Klaster*, dan *Data Referensi*.
  * Menambahkan bilah filter pencarian teks, dropdown kategori, dropdown status, dropdown sumber data, serta tombol reset filter.
  * Mengembangkan tabel aduan komprehensif memuat *checkbox selection*, nomor tiket, keterangan pelapor, kategori, lencana akurasi AI (*confidence score* & *warning alert* ketidakcocokan), status penanganan, dan penanda klaster keterhubungan.
  * Mengimplementasikan fitur ekspor data ke format CSV/Excel secara langsung dari frontend serta kotak panduan deteksi klaster NLP v2.4.

### Task 6 ✅
* **Standardisasi Sidebar Navigasi Admin & Badge Keamanan TLS 1.3**
  * Merapikan navigasi sidebar admin (*Dashboard*, *Daftar Laporan*, *Validasi AI*, *Audit Trail*, *Pengaturan*) dengan status aktif bernuansa *brand blue* `#7BBCE6`.
  * Menyematkan kartu status keamanan *Koneksi Terenkripsi TLS 1.3 - Satgas PPKSP Satuan Pendidikan* pada sisi bawah sidebar.

---

## ⚠️ Kendala dan Keputusan

### Frontend

**Kendala:**
1. Halaman lacak status laporan sebelumnya langsung mengeksekusi pencarian kode tiket sampel secara otomatis saat pertama kali dibuka, sehingga membingungkan pengguna jika tiket tersebut tidak terdapat di penyimpanan lokal.
2. Dashboard analitik admin memerlukan penyajian visual yang kaya (grafik tren 11 bulan, perbandingan 7 kategori kasus terhadap data nasional, dan tabel antrean) tanpa menurunkan performa render pada layar yang lebih kecil.
3. Kebutuhan ekspor dokumen tanda terima aduan siswa yang siap cetak tanpa harus bergantung pada library PDF pihak ketiga yang berat.

**Keputusan:**
1. Mengubah inisialisasi form pelacakan menjadi *clean state* dengan placeholder informatif dan menambahkan tombol *reset/clear* `[X]`, sehingga pencarian hanya berjalan ketika dipicu langsung oleh tombol "Cek Status" atau parameter URL spesifik.
2. Memadukan grafik interaktif ECharts yang responsif untuk tren linier bulanan dengan komponen *custom progress bar* berbasis Tailwind CSS untuk distribusi kategori kasus.
3. Membangun modal dokumen tanda terima berbasis HTML/CSS standar cetak (*print-optimized stylesheet*) yang langsung terintegrasi dengan fungsi bawaan `window.print()` peramban untuk penyimpanan format PDF.

---

### Backend & Database

**Kendala:**
1. Pada lingkungan Docker multi-container, service backend FastAPI sering mengalami *crash* saat inisialisasi awal karena container MySQL masih dalam tahap *booting* internal dan belum siap menerima koneksi soket (*Connection refused*).
2. Modul ETL data eksternal gagal menemukan berkas CSV karena perbedaan path absolut antara mesin host lokal dengan direktori di dalam container Docker.
3. Akses phpMyAdmin memunculkan peringatan `#1046 - No database selected` saat pengguna mengklik skema internal MySQL (`performance_schema`).

**Keputusan:**
1. Menambahkan mekanisme *exponential backoff retry* pada event startup FastAPI di `main.py` sehingga server dengan sabar menunggu database MySQL siap sebelum mengeksekusi pembuatan tabel metadata.
2. Memperbarui fungsi `get_dataset_dir()` di `etl_external.py` dengan resolusi multi-jalur yang mendeteksi path `/app/dataset` di dalam container sebelum mencari fallback path di direktori proyek.
3. Mengonfirmasi bahwa hak akses user aplikasi (`sigap_user`) memang dibatasi secara aman hanya pada database aplikasi `sigap_db`, dan mengedukasi alur kerja agar fokus pada tabel operasional aplikasi.

---

## 🎯 Rencana Pengembangan Minggu Depan (Minggu 8 — Memasuki Fase AI, Clustering & Integrasi Penuh)

### Frontend

1. **Integrasi Penuh Form Pengaduan ke API Backend:**
   * Menghubungkan form pengaduan siswa ke endpoint API `/api/pengaduan/` dengan payload `multipart/form-data` untuk pengiriman data aduan beserta file bukti gambar/dokumen secara riil.
2. **Sinkronisasi Autentikasi Pengguna & Session Token:**
   * Menghubungkan login siswa (NISN) dan admin (NIP) langsung ke endpoint token JWT backend, serta menyempurnakan penyimpanan sesi pada state `StoreContext`.
3. **Penyempurnaan Halaman Detail Pengaduan Admin (`ReportDetail.jsx`):**
   * Mengintegrasikan tombol aksi verifikasi admin: persetujuan kategori AI (*Approve AI*), pengalihan kategori manual (*Override Category*), dan penambahan catatan konselor ke endpoint backend.
4. **Visualisasi Graf Klaster Semantik (Semantic Cluster Explorer):**
   * Membuat komponen visual grafik relasi atau peta sebaran untuk menggambarkan keterkaitan antar-aduan yang berada dalam satu klaster lokasi/waktu perundungan yang sama.
5. **Pemberitahuan Real-Time & Feedback Interaktif:**
   * Menambahkan sistem notifikasi toast mengambang saat status laporan berhasil diperbarui dan counter badge dinamis pada menu laporan masuk admin.

---

### Backend

1. **Aktivasi Pipeline Inferensi Rekomendasi Kategori AI:**
   * Menghubungkan model klasifikasi teks bahasa Indonesia (NLP classifier berbasis representasi vektor) pada endpoint pembuatan pengaduan untuk menghasilkan *confidence score* kategori secara otomatis.
2. **Implementasi Logika Deteksi Klaster Insiden Berulang:**
   * Membangun modul *semantic similarity* dan clustering teks untuk mendeteksi kesamaan narasi kejadian antar-laporan dalam lingkup sekolah yang sama.
3. **Penguatan Validasi Transisi Status & Audit Trail Otomatis:**
   * Menerapkan aturan transisi status ketat (*State Machine*: `Menunggu` -> `Diverifikasi` -> `Ditindaklanjuti` -> `Selesai`) dan memastikan setiap perubahan status mencatat entri baru ke tabel `audit_trail`.
4. **Endpoint Ekspor Rekapitulasi Kasus & Statistik:**
   * Menyediakan endpoint backend untuk menghasilkan laporan statistik komprehensif terenkripsi bagi kebutuhan laporan berkala Satgas PPKSP ke dinas pendidikan.
5. **Penyusunan Automated Test Suite (Pytest):**
   * Membuat pengujian otomatis untuk menguji seluruh alur autentikasi, integritas transaksi pengaduan, dan keabsahan token JWT.
