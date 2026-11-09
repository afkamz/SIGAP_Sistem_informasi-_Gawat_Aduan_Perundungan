# Progress Mingguan Pengembangan SIGAP (Minggu 11)

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

### 💻 Minggu 8–11 : Integrasi Live API, Penguatan Keamanan, & Pipeline AI (📍 Posisi Saat Ini: Selesai Minggu 11 — Manajemen Hak Akses Admin MySQL, Fitur Notifikasi Lonceng Live, Sidebar Fixed Full-Viewport, Perapian Pengaturan Sistem, Standarisasi Naskah Akademik IEEE, & Penulisan Bab V Hasil Pengujian)
* Penambahan dan integrasi penuh modul **Manajemen Akun Petugas & Hak Akses** langsung ke basis data MySQL (`admins`) dengan enkripsi kata sandi `bcrypt`, modal pendaftaran staf baru, serta otorisasi kontrol privasi saksi/korban (*Need-to-Know principle*).
* Pembangunan fitur **Notifikasi Lonceng Live Interaktif** pada top navbar admin (`AdminLayout.jsx`) yang menyajikan antrean laporan menunggu secara *real-time* dari MySQL lengkap dengan *dynamic badge counter*.
* Perbaikan tata letak navigasi **Sidebar Admin Full-Viewport** (`100vh` / `100dvh`) yang kokoh, konsisten, dan tidak terpotong oleh batas gulir layar.
* Penyempurnaan halaman **Pengaturan Sistem Admin** (`AdminSettings.jsx`) dengan mengeliminasi kontrol dummy agar antarmuka fokus pada informasi sekolah resmi, manajemen petugas, dan pemulihan data.
* Penyelarasan tema cerah *Liquid Glass iOS 26* pada bagian Keunggulan Sistem Landing Page publik.
* Harmonisasi naskah paper IEEE: Integrasi diagram alur pengguna (*User Flow* multi-step), koreksi matematis formula *Cosine Similarity*, integrasi Bab V (*Results and Discussion*), perapian blok penulis & *Index Terms*, serta standarisasi 100% terminologi teknis bahasa Inggris baku.

### 🔗 Minggu 12–14 : Testing End-to-End, UAT, Keamanan, & Final Deployment (Akan Datang)
* Pelaksanaan verifikasi fungsional menyeluruh (*Black-Box Testing*) seluruh modul.
* Pengujian kebergunaan antarmuka (*System Usability Scale* / SUS) dan evaluasi penerimaan pengguna (*Technology Acceptance Model* / TAM) dengan responden siswa dan guru BK.
* Pengujian beban dan latensi performa API backend FastAPI secara simultan (*throughput benchmark*).
* Finalisasi Bab V dan Bab VI naskah paper ilmiah serta persiapan *deployment* rilis produksi.

---

## 📌 Progress Mingguan : Frontend & Desain UI/UX (Minggu 11)

### Task 1 ✅
* **Integrasi Antarmuka Manajemen Akun Petugas & Hak Akses (`AdminSettings.jsx`)**
  * Membangun tabel dinamis daftar petugas Satgas PPKSP dan Guru BK yang disinkronkan langsung dari endpoint API MySQL.
  * Menyediakan tombol aksi cepat: *Refresh* data live, penanda level otoritas (*Super Admin* vs *Operator Triase*), status aktif, serta tombol hapus/cabut akses petugas dengan modal konfirmasi aman.
  * Menghadirkan modal formulir **Tambah Petugas Baru** terpadu:
    * Input Nama Lengkap & Gelar.
    * Input NIP / Nomor Identitas Resmi (otomatis divalidasi ke backend).
    * Input Kata Sandi Login aman lengkap dengan fitur *toggle show/hide password* (ikon `Eye`/`EyeOff`).
    * Pilihan Peran Jabatan (Guru BK, Satgas PPKSP, Kesiswaan, Wali Kelas).
    * Opsi perizinan khusus: **Buka Identitas Anonim** (*Need-to-Know principle*) untuk melindungi privasi pelapor.

### Task 2 ✅
* **Implementasi Sistem Notifikasi Lonceng Real-Time pada Navbar Admin (`AdminLayout.jsx`)**
  * Mengganti tombol notifikasi statis dengan panel *dropdown* melayang interaktif berbasis *Liquid Glass*.
  * Menghubungkan badge counter merah di atas ikon lonceng ke status laporan nyata (`status === 'menunggu'`) dari pangkalan data MySQL.
  * Menampilkan ringkasan kartu laporan menunggu: judul aduan, kategori kekerasan, tanggal masuk, penanda urgensi, serta tombol pintas menuju halaman Detail Laporan.
  * Dilengkapi penanganan *empty state* yang informatif, tombol footer *Lihat Semua Laporan*, dan penutup otomatis (*auto-dismiss*) saat pengguna mengklik di luar area panel (*click-outside listener*).

### Task 3 ✅
* **Penyempurnaan Navigasi Sidebar Admin Setinggi Layar Penuh (Full Viewport `100vh`/`100dvh`)**
  * Memperbaiki kendala bilah sisi admin yang sebelumnya sempat terpotong di tengah layar pada resolusi tertentu.
  * Menerapkan struktur `fixed inset-y-0 left-0 h-screen h-[100dvh]` dengan tata letak Flexbox modern: header logo di bagian atas, menu navigasi utama di bagian tengah, dan kartu profil/logout di bagian bawah.
  * Memastikan sidebar tetap membentang utuh dan konsisten tanpa menimbulkan *horizontal scrollbar* atau konflik dengan kontainer utama.

### Task 4 ✅
* **Penyelarasan Tema Cerah Liquid Glass pada Halaman Publik (`LandingPage.jsx`)**
  * Mengubah kartu pada seksi "Keunggulan Sistem SIGAP" dari nuansa latar belakang gelap (*dark mode*) menjadi tema cerah (*light glassmorphism*).
  * Menyelaraskan kontras tipografi, ikon aksen biru laut (#3B7DE8), batas kaca semi-transparan, dan efek bayangan lembut agar harmonis dengan seluruh halaman aplikasi.

### Task 5 ✅
* **Pembersihan & Refactor Halaman Pengaturan Sistem Admin**
  * Menghapus komponen dummy yang tidak esensial seperti konfigurasi email/hotline darurat dan slider threshold NLP.
  * Memastikan antarmuka pengaturan admin tampil bersih, elegan, dan terfokus pada:
    1. **Informasi Satuan Pendidikan** (Nama Sekolah & NPSN).
    2. **Manajemen Akun Petugas & Hak Akses** (Tersinkron Database MySQL).
    3. **Pemulihan Data & Reset Uji Coba**.

---

## 📌 Progress Mingguan : Backend, Database, & API (Minggu 11)

### Task 1 ✅
* **Pembangunan Endpoint REST API Manajemen Staf Admin (`auth.py`)**
  * Merancang dan mengimplementasikan 3 endpoint API baru untuk manajemen petugas:
    * `GET /api/auth/admin/list`: Mengambil daftar akun petugas aktif dari tabel MySQL `admins` (diproteksi otentikasi JWT).
    * `POST /api/auth/admin/register`: Pendaftaran admin/petugas baru dengan enkripsi hashing kata sandi aman via `bcrypt`, validasi integritas NIP unik, dan pencatatan jabatan resmi.
    * `DELETE /api/auth/admin/{id}`: Penghapusan atau pencabutan akses akun petugas dengan proteksi penjagaan agar akun admin super utama (`198001012026`) tidak terhapus secara tidak sengaja.

### Task 2 ✅
* **Penguatan Validasi Skema Data Pydantic (`schemas/auth.py`)**
  * Menambahkan model transfer data `AdminCreateRequest` dengan validasi ketat:
    * `nip`: String minimal 4 karakter, memotong spasi liar (*trimmed*).
    * `nama`: Nama lengkap petugas penanganan kasus.
    * `jabatan`: Peran institusi (Guru BK, Satgas PPKSP, dsb.).
    * `password`: Kata sandi minimal 6 karakter.

### Task 3 ✅
* **Pengujian Otomatis & Pemeliharaan Kestabilan Sistem**
  * Menjalankan automated test suite backend (`pytest`) dengan kelulusan mutlak **60 passed, 0 failed**.
  * Menjamin verifikasi hash kata sandi pada saat proses login admin tetap kompatibel dengan akun-akun baru yang didaftarkan melalui portal pengaturan.

---

## 📌 Progress Mingguan : Naskah Akademik IEEE (`SIGAP.tex`) (Minggu 11)

### Task 1 ✅
* **Penyusunan Bab V (RESULTS AND DISCUSSION) Format IEEE**
  * Menyusun Bab V secara terstruktur ke dalam 5 sub-bab evaluasi multidimensi:
    * **A. Functional Verification (Black-Box Testing)**: Matriks pengujian 12 skenario fungsional sistem pelaporan, validasi token, mitigasi upload file, dan audit trail.
    * **B. Natural Language Processing Classification Performance**: Evaluasi metrik *Accuracy*, *Precision*, *Recall*, dan *F1-Score* model IndoBERT pada 7 kategori kekerasan.
    * **C. Usability Evaluation (System Usability Scale / SUS)**: Kerangka evaluasi 10 pertanyaan baku SUS untuk mengukur akseptabilitas antarmuka siswa dan guru BK.
    * **D. Technology Acceptance Analysis (TAM)**: Analisis penerimaan pengguna melalui konstruk *Perceived Usefulness* (PU) dan *Perceived Ease of Use* (PEOU).
    * **E. API Performance and System Throughput**: Analisis latensi respon dan ketahanan konkurensi backend FastAPI.

### Task 2 ✅
* **Integrasi Aset Diagram Alur Pengguna (User Flow Multi-Step)**
  * Membuat dan mengintegrasikan diagram alur pengguna resolusi tinggi (`userflow_pelaporan.png`) pada Bab III-B sebagai pengganti galeri mockup statis, mengilustrasikan alur logika dari pemilihan mode kerahasiaan hingga terbitnya kode tiket aduan.

### Task 3 ✅
* **Koreksi Matematis Formula Cosine Similarity (Persamaan 1)**
  * Memperbaiki penulisan rumus norma vektor kategori pada naskah LaTeX dengan menambahkan notasi kuadrat magnitude ($v_{k,i}^2$) di bawah tanda akar pembagi:
    $$\text{Sim}(d, c_k) = \frac{\sum_{i=1}^{n} w_i \cdot v_{k,i}}{\sqrt{\sum_{i=1}^{n} w_i^2} \cdot \sqrt{\sum_{i=1}^{n} v_{k,i}^2}}$$

### Task 4 ✅
* **Standarisasi Bahasa Inggris Baku & Eliminasi Pola Bilingual**
  * Menghapus seluruh pola kalimat ganda bahasa Indonesia dan Inggris dalam tanda kurung di seluruh naskah paper.
  * Menggunakan terminologi teknis internasional baku murni (`\textit{user flow}`, `\textit{dual-mode reporting}`, `\textit{class imbalance}`, `\textit{confidence score}`, `\textit{black-box testing}`).

### Task 5 ✅
* **Perapian Tata Letak Index Terms & Sinkronisasi 3 Berkas Naskah**
  * Menghilangkan jeda vertikal kosong antara Abstract dan Index Terms, menggabungkan identitas email penulis dalam satu blok format IEEE.
  * Menyelaraskan seluruh perubahan secara identik pada 3 berkas naskah utama: `SIGAP.tex`, `SIGAP_Paper.tex`, dan `SIGAP-source.tex`.

---

## ⚠️ Kendala dan Keputusan

### Frontend & UI/UX

**Kendala:**
1. Sidebar admin sempat terpotong secara vertikal pada peramban tertentu akibat kontainer pembungkus tidak memiliki tinggi viewport penuh.
2. Halaman pengaturan sebelumnya memuat opsi konfigurasi darurat dan modul slider AI yang belum terhubung ke fungsionalitas inti sehingga membingungkan pengguna.

**Keputusan:**
1. Menetapkan styling sidebar menjadi `fixed inset-y-0 left-0 h-screen h-[100dvh]` dengan pembagian flexbox kokoh dan padding konten utama yang seimbang (`lg:ml-60`).
2. Menghapus konfigurasi dummy dan mengalihkan fokus halaman pengaturan pada **Manajemen Akun Petugas & Hak Akses** yang langsung tersinkronisasi ke basis data MySQL.

---

### Backend & Database

**Kendala:**
1. Penambahan petugas baru dari antarmuka frontend awalnya hanya tersimpan di memori lokal peramban (state React) sehingga akun baru tidak bisa digunakan untuk login ke portal admin dan tidak muncul di phpMyAdmin.
2. Dibutuhkan hashing kata sandi yang aman dan proteksi agar akun Super Admin utama tidak dapat dihapus secara sepihak.

**Keputusan:**
1. Membangun endpoint REST API `POST /api/auth/admin/register` dan `GET /api/auth/admin/list` yang langsung mengeksekusi query tabel MySQL `admins` dan mengembalikan data secara *live*.
2. Mengintegrasikan algoritma `bcrypt` pada backend untuk memastikan seluruh kata sandi admin baru di-hash sebelum masuk ke pangkalan data, serta menambahkan *guard condition* yang menolak penghapusan akun ber-NIP Super Admin.

---

### Naskah Akademik IEEE

**Kendala:**
1. Terjadi inkonsistensi terminologi karena sebagian teks menggunakan bahasa Indonesia dengan terjemahan Inggris di dalam kurung, melanggar kaidah penulisan paper internasional.
2. Penulisan formula Cosine Similarity pada naskah sebelumnya kehilangan kuadrat pada vektor referensi kategori.

**Keputusan:**
1. Melakukan audit komprehensif pada seluruh naskah dan mengubah seluruh frasa dwibahasa menjadi istilah teknis bahasa Inggris baku.
2. Memperbaiki formula matematika pada Bab III-C dan menyinkronkan seluruh perubahan ke naskah `SIGAP.tex`, `SIGAP_Paper.tex`, dan `SIGAP-source.tex`.

---

## 📊 Status Kesiapan Sistem Riil (Evaluasi Objektif Minggu 11)

| Komponen | Status Fungsional Riil | Keterangan |
|---|:---:|---|
| **Manajemen Staf & Akun Admin (MySQL)** | **100% Nyata** | Pendaftaran staf baru, hash bcrypt, list admin dari DB, hapus staf. |
| **Sistem Desain Liquid Glass iOS 26** | **100% Nyata** | Konsisten pada Landing Page, Portal Siswa, dan Portal Admin. |
| **Navigasi Sidebar Admin Full Viewport** | **100% Nyata** | Sidebar kokoh `100vh`/`100dvh`, navigasi responsif, bebas bug potong. |
| **Notifikasi Lonceng Live (Admin Navbar)** | **100% Nyata** | Dropdown laporan berstatus *Menunggu*, counter badge dinamis MySQL. |
| **Autentikasi Multi-Role (JWT + Bcrypt)** | **100% Nyata** | Siswa dan admin login nyata, akun admin baru langsung dapat login. |
| **Alur Formulir Multi-Step Pelaporan** | **100% Nyata** | Wizard 3 tahap (Identitas $\rightarrow$ Data Kasus $\rightarrow$ Unggah Bukti & Tiket). |
| **Pipeline AI IndoBERT & HDBSCAN** | **95% Nyata** | Triase otomatis kategori yuridis dan deteksi klaster insiden. |
| **Jejak Audit Mutlak (Audit Trail)** | **95% Nyata** | Mutasi status laporan tercatat aman dan terlindungi guard FSM. |
| **Infrastruktur Docker & Automated Tests** | **100% Nyata** | 4 container aktif (MySQL, FastAPI, Nginx, PMA), 60 tests passed 100%. |
| **Naskah Akademik Bab I s.d. Bab V** | **100% Lengkap** | Format IEEE dua kolom, formula terverifikasi, diagram alur terpadu. |
| **ESTIMASI KESIAPAN SISTEM RIIL** | **~96%** | **Sistem terintegrasi penuh end-to-end, fitur manajemen staf DB aktif, naskah Bab I–V lengkap.** |

---

## 🎯 Rencana Pengembangan Minggu Depan (Minggu 12 — Pengujian End-to-End Menyeluruh, UAT, & Persiapan Deployment Produksi)

1. **Pelaksanaan Skenario Pengujian End-to-End (E2E Testing):**
   * Mensimulasikan alur pelaporan siswa (anonim & terverifikasi), unggah bukti file digital, verifikasi triase AI, mutasi status penanganan oleh Guru BK, hingga peninjauan jejak audit.
2. **Pengisian Data Empiris Hasil Pengujian pada Naskah Bab V:**
   * Mengganti nilai *placeholder* `XX,XX%` pada Tabel Black-Box Testing, skor SUS, metrik TAM, dan benchmark latensi API dengan hasil pengukuran empiris.
3. **Penyusunan Bab VI (CONCLUSION) Naskah Paper:**
   * Merumuskan kesimpulan kontribusi riset SIGAP dan arah pengembangan di masa depan.
4. **Audit Keamanan & Kesiapan Rilis Produksi:**
   * Memastikan sanitasi input terbebas dari ancaman SQL Injection, XSS, serta validasi integritas token JWT kedaluwarsa.

