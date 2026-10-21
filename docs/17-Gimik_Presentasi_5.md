# Progress Mingguan Pengembangan SIGAP (Minggu 9)

---

## 🗓️ Time Line Pengembangan Proyek

### 🔍 Minggu 1–3 : Persiapan & Fondasi
* Finalisasi PRD, ERD database, dan kontrak API.
* Setup FastAPI + MySQL + auth JWT di backend.
* Setup React + wireframe tampilan di frontend.
* Seeding data awal dari CSV dan benchmark eksternal.

### 🎯 Minggu 4–7 : Pengembangan Inti & Refinement UI/UX
* Implementasi endpoint inti pengaduan, login admin, pelacakan tiket, validasi input, dan audit trail.
* Penyelesaian halaman utama siswa dan admin sesuai standar referensi resmi.
* Pemantapan infrastruktur container Docker (MySQL, FastAPI, Frontend Nginx, phpMyAdmin).
* Pembersihan tampilan desktop 100% zoom dan penyelarasan rasio kontainer.

### 💻 Minggu 8–11 : Integrasi Live API, Penguatan Keamanan, & Pipeline AI (📍 Posisi Saat Ini: Minggu 9 — Eliminasi Mock Data, Live CRUD MySQL, Serving Bukti Nyata, & Validasi AI Card Stream)
* Eliminasi total ketergantungan mock data pada seluruh alur kerja Admin (Dashboard, Daftar Laporan, Status Kasus, dan Jejak Audit).
* Integrasi nyata pipeline inferensi AI IndoBERT (`indobenchmark/indobert-base-p1`) dan HDBSCAN saat pengaduan diajukan siswa (penghapusan simulasi nilai acak `Math.random()`).
* Pembangunan dan redesain antarmuka menu Validasi AI (`AiValidation.jsx`) mengadopsi struktur alur kartu triase (*card stream*), banner peringatan ambiguitas multi-label (<80%), deteksi klaster HDBSCAN, dan token NLP.
* Redesain halaman Detail Laporan Admin (`ReportDetail.jsx`) dengan tata letak 2 kolom standar Satgas PPKSP, rendering thumbnail foto bukti nyata, modal lightbox pratinjau, dan tautan unduh berkas.
* Konfigurasi serving berkas lampiran siswa via FastAPI `StaticFiles` pada `/uploads` dan reverse proxy Nginx Docker.
* Standardisasi istilah teknis naskah akademik IEEE `SIGAP.tex` dan kelulusan 100% dari 60 pengujian otomatis backend.

### 🔗 Minggu 12–14 : Testing End-to-End, UAT, Keamanan, & Final Deployment
* Pelaksanaan User Acceptance Testing (UAT) bersama pihak sekolah (Guru BK, Satgas PPKSP, dan perwakilan siswa).
* Evaluasi performa deteksi klaster HDBSCAN terhadap laporan massal insiden berulang.
* Pengujian ketahanan beban (*load testing*), audit celah keamanan, dan deployment rilis siap pakai ke server produksi.

---

## 📌 Progress Mingguan : Frontend (Minggu 9)

### Task 1 ✅
* **Eliminasi Total Mock Data & Integrasi Penuh Live Database MySQL (`StoreContext.jsx`)**
  * Membersihkan array statis cadangan (*mock fallback*) dari state global agar sistem murni mencerminkan kondisi data nyata dari pangkalan data MySQL.
  * Menghubungkan modul `AdminDashboard.jsx`, `ReportList.jsx`, dan `AuditTrail.jsx` langsung ke endpoint live backend via `api.getAdminReports()` dan `api.getAuditTrail()`.
  * Mencegah percampuran (*blending*) antara data palsu dengan laporan otentik saat koneksi berhasil terhubung, serta menyajikan status antrean kosong (*empty state*) yang bersih.

### Task 2 ✅
* **Pembangunan & Redesain Antarmuka Validasi AI Mengadopsi Pola Kartu Triase (`AiValidation.jsx`)**
  * Mengganti kartu *Coming Soon* menjadi antarmuka kerja interaktif penuh bagi Guru BK untuk meninjau, menyetujui, atau mengoreksi (*override*) hasil analisis kecerdasan buatan.
  * Menghadirkan alur kartu triase (*card stream*) yang dilengkapi:
    * **Banner Peringatan Multi-Label**: Mendeteksi otomatis jika skor keyakinan AI <80% atau terdapat selisih tipis antarkategori (indikasi insiden kompleks).
    * **Badge Klaster HDBSCAN**: Menandai jika aduan terhubung dengan laporan lain dalam pola waktu/lokasi yang sama.
    * **Ekstraksi Token Kata Kunci NLP**: Menyorot frasa krusial dari narasi siswa (misal: *hinaan*, *ancaman*, *grup WA*).
    * **Rekomendasi SOP PPKSP**: Menyediakan panduan langkah penanganan resmi berdasarkan kategori hasil klasifikasi.
    * **Aksi Triase Cepat**: Tombol *Setujui Rekomendasi AI* dan modal *Koreksi Manual* yang langsung mencatat tindakan ke jejak audit.

### Task 3 ✅
* **Redesain Antarmuka Detail Laporan Admin (`ReportDetail.jsx`) Standar Satgas PPKSP**
  * Mengadopsi tata letak dua kolom terstruktur:
    * **Kolom Kiri**: Kronologi lengkap kejadian narasi otentik siswa, kartu identitas pelapor terenkripsi (mendukung penanganan anonim dan terverifikasi), serta galeri berkas bukti pendukung.
    * **Kolom Kanan**: Panel intelijen AI IndoBERT (skor keyakinan, kategori primer & sekunder, deteksi klaster), panel log riwayat penanganan, serta kartu tindakan konselor untuk mutasi status resmi.

### Task 4 ✅
* **Integrasi Berkas Bukti Nyata, Thumbnail Dinamis, & Modal Lightbox Preview**
  * Menghubungkan berkas unggahan siswa dari `CreateReportWizard.jsx` langsung ke database backend dan penyimpanan server melalui `api.uploadBukti()`.
  * Menampilkan pratinjau thumbnail gambar nyata pada halaman detail laporan dengan helper resolusi URL `/uploads/`.
  * Menyediakan fitur modal *lightbox* untuk memperbesar foto bukti tanpa merusak tata letak, tombol buka di tab baru, serta tombol unduh dokumen PDF/gambar.

### Task 5 ✅
* **Penyelarasan Nginx Reverse Proxy Docker & Verifikasi Build Produksi**
  * Menambahkan blok konfigurasi `location /uploads/` pada `Frontend/nginx.conf` agar berkas yang diunggah dapat diakses secara mulus oleh browser melalui container Nginx.
  * Menjalankan build produksi menggunakan Vite (`npm run build`) dengan hasil **Exit Code 0** (2.152 modul terkompilasi bersih tanpa peringatan error).

---

## 📌 Progress Mingguan : Backend, Database, & AI Pipeline (Minggu 9)

### Task 1 ✅
* **Penyediaan Skema & Endpoint Jejak Audit Terpusat (`audit_trail`)**
  * Membuat skema transfer data `AuditTrailItemOut` pada `app/schemas/pengaduan.py`.
  * Membangun endpoint `GET /api/pengaduan/audit-trail/list` yang dilindungi autentikasi JWT admin untuk mengambil seluruh riwayat aktivitas mutasi penanganan aduan secara kronologis.
  * Menghubungkan setiap pergantian status laporan (`PATCH /api/pengaduan/{id}/status`) dan validasi AI ke penulisan baris baru pada tabel MySQL `audit_trail`.

### Task 2 ✅
* **Integrasi Nyata Inferensi AI IndoBERT & HDBSCAN pada Alur Pembuatan Aduan**
  * Menghilangkan simulasi penentuan skor acak (`Math.random()`) di frontend.
  * Mengintegrasikan modul `classifier.py` dan `embedder.py` berbasis model `indobenchmark/indobert-base-p1` langsung pada endpoint `POST /api/pengaduan`.
  * Setiap narasi siswa yang masuk diproses secara real-time ke dalam representasi vektor kalimat 768-dimensi, dihitung kemiripan *cosine*-nya terhadap data benih 7 kategori Permendikbudristek No. 46/2023, dan menghasilkan nilai keyakinan (*confidence score*) serta rekomendasi kategori primer/sekunder yang disimpan permanen ke database.

### Task 3 ✅
* **Penyajian Berkas Bukti via FastAPI StaticFiles & Sanitasi Penyimpanan**
  * Menambahkan konfigurasi `app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")` pada `app/main.py`.
  * Memastikan seluruh berkas bukti laporan (foto kejadian, tangkapan layar chat siber) tersimpan dengan nama UUID acak yang aman dan terisolasi dari ancaman *path traversal*.

### Task 4 ✅
* **Resolusi Path Dataset Seed 7 Kategori pada Lingkungan Container Docker**
  * Memperbaiki resolusi penemuan berkas dataset `seed_narasi_7_kategori.json` pada `classifier.py` dan `embedder.py` agar adaptif mendeteksi jalur berkas baik saat dijalankan di lingkungan lokal host maupun di dalam container Linux Docker `/app/dataset`.

### Task 5 ✅
* **Standardisasi Naskah Paper Akademik IEEE (`SIGAP.tex`)**
  * Menyelaraskan peristilahan teknis pada bagian *Abstract* dan *Introduction* menggunakan istilah baku bahasa Inggris murni (`underreporting`, `cyberbullying`, `sentence embedding`, `confidence score`, `density-based clustering`, `natural language processing`) tanpa reduplikasi tanda kurung.
  * Memperbarui 14 daftar pustaka rujukan dengan pencantuman Digital Object Identifier (DOI) dan pranala open-access aktif (rentang 2019–2025).

### Task 6 ✅
* **Otomasi Pengujian Backend (60 Tests Lulus 100%)**
  * Menambahkan test suite baru `TestAuditTrail` pada `tests/test_pengaduan.py` untuk menguji integritas pencatatan riwayat audit.
  * Seluruh **60 unit dan E2E test cases** berhasil lulus 100% dalam waktu 3.86 detik pada container backend.

---

## ⚠️ Kendala dan Keputusan

### Frontend

**Kendala:**
1. Penggunaan fallback data mock lokal yang masih tertinggal pada state global membuat admin melihat data laporan fiktif lama alih-alih data kosong bersih ketika MySQL baru pertama kali dijalankan.
2. Gambar bukti yang diunggah siswa tidak dapat dimuat (*broken image*) karena peramban memanggil tautan lokal tanpa routing reverse proxy yang sesuai pada Nginx Docker.
3. Halaman Validasi AI sebelumnya hanya berupa kartu statis informasi (*coming soon*), sehingga konselor belum dapat melakukan intervensi terhadap rekomendasi kategori dari AI.

**Keputusan:**
1. Membersihkan array statis inisial pada `StoreContext.jsx` dan mengaitkan seluruh indikator metrik KPI secara dinamis ke panjang data riil hasil fetch server.
2. Menambahkan konfigurasi blok reverse proxy `/uploads/` pada `Frontend/nginx.conf` serta membangun helper fungsi URL gambar terpadu dengan modal *lightbox* pratinjau.
3. Membangun halaman `AiValidation.jsx` berfitur kartu triase cerdas yang terhubung ke state laporan riil MySQL dan mendukung tombol aksi persetujuan satu klik.

---

### Backend & AI Pipeline

**Kendala:**
1. Skrip inferensi IndoBERT sebelumnya terisolasi di folder pengujian dan belum terhubung ke siklus hidup pengiriman aduan siswa (`POST /api/pengaduan`).
2. Jalur berkas dataset rujukan kategori mengalami *FileNotFoundError* saat container backend Docker mencoba memuat model karena perbedaan struktur direktori kerja antara macOS dan Linux container.
3. Log penanganan aduan hanya tersimpan di memori browser lokal siswa dan belum tersimpan di server, sehingga tidak memiliki kekuatan akuntabilitas hukum.

**Keputusan:**
1. Mengimpor dan mengeksekusi fungsi `predict_category_with_confidence()` secara langsung di dalam controller `create_pengaduan`, sehingga setiap tiket baru otomatis memiliki atribut klasifikasi AI di tabel `pengaduan`.
2. Menggunakan pustaka `pathlib.Path(__file__)` dengan logika pencarian bertingkat untuk mendeteksi folder dataset secara tangguh di lingkungan Docker `/app/dataset` maupun lokal.
3. Mengaktifkan model tabel `audit_trail` pada MySQL, mengekspos endpoint API `GET /api/pengaduan/audit-trail/list`, dan menulis log secara atomik pada setiap perubahan status laporan.

---

## 📊 Status Kesiapan Sistem Riil (Evaluasi Objektif Minggu 9)

| Komponen | Status Fungsional Riil | Keterangan |
|---|:---:|---|
| **Autentikasi (JWT + Bcrypt)** | **100% Nyata** | Login siswa dan admin terverifikasi penuh ke database MySQL. |
| **Infrastruktur & Docker** | **100% Nyata** | 4 kontainer stabil dan saling terhubung (MySQL, FastAPI, Frontend Nginx, phpMyAdmin). |
| **Keamanan Rute (Route Guard)** | **100% Nyata** | Seluruh rute rahasia terlindungi komponen `ProtectedRoute`. |
| **Pelacakan Tiket (Track Report)** | **95% Nyata** | Mendukung pencarian instan dan query live asinkronus ke server backend. |
| **Transaksi Pembuatan Aduan** | **95% Nyata** | Terhubung ke MySQL, menghasilkan tiket riil, upload berkas bukti nyata, dan eksekusi AI real-time. |
| **Admin Dashboard & Daftar Laporan** | **95% Nyata** | 100% bebas mock data; data antrean, filter, dan KPI terhitung dari tabel database aktif. |
| **Antarmuka Validasi AI Triase** | **90% Nyata** | Alur kartu triase, peringatan multi-label, visualisasi kata kunci NLP, dan aksi verifikasi aktif. |
| **Jejak Audit (Audit Trail)** | **95% Nyata** | Setiap mutasi status dan validasi tercatat permanen pada tabel `audit_trail` MySQL. |
| **Serving Berkas & Media Bukti** | **90% Nyata** | Bukti foto/dokumen tersimpan aman di `/uploads` dan dapat ditinjau via modal lightbox. |
| **Testing Otomatis** | **100% Nyata** | 60 unit dan E2E test cases lulus 100% tanpa kegagalan. |
| **Naskah Akademik (`SIGAP.tex`)** | **90% Selesai** | Naskah IEEE standard, 14 referensi verified DOI, bebas istilah ganda. |
| **ESTIMASI KESIAPAN SISTEM RIIL** | **~85%** | **Sistem telah terintegrasi end-to-end secara fungsional tanpa ketergantungan mock** |

---

## 🎯 Rencana Pengembangan Minggu Depan (Minggu 10 — Pengujian Pengguna Nyata/UAT, Stabilisasi, & Analitik Klasterisasi)

1. **Pelaksanaan Skenario Pengujian Pengguna Nyata (User Acceptance Testing / UAT):**
   * Menjalankan simulasi pelaporan terpadu bersama perwakilan pengguna sekolah (alur Siswa melapor $\rightarrow$ Notifikasi masuk ke Admin $\rightarrow$ Admin verifikasi AI $\rightarrow$ Penanganan kasus $\rightarrow$ Siswa lacak tiket).
2. **Pengujian Analitik Klasterisasi Laporan Massal (HDBSCAN):**
   * Menguji deteksi pola titik rawan dan kelompok pelaku berulang menggunakan sekumpulan data aduan massal pada dashboard analitik.
3. **Penyempurnaan Umpan Balik Visual & Notifikasi Toast:**
   * Memperkaya interaksi pengguna dengan feedback toast alert interaktif saat aksi mutasi status berhasil dilakukan oleh admin.
4. **Audit Beban & Finalisasi Dokumentasi Rilis:**
   * Melakukan evaluasi latensi inferensi NLP IndoBERT pada saat beberapa laporan masuk secara bersamaan serta penyusunan panduan instalasi produksi.

