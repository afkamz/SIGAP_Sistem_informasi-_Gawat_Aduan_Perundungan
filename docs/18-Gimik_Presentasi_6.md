# Progress Mingguan Pengembangan SIGAP (Minggu 10)

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

### 💻 Minggu 8–11 : Integrasi Live API, Penguatan Keamanan, & Pipeline AI (📍 Posisi Saat Ini: Minggu 10 — Redesain Glassmorphism iOS 26, Sidebar Full Viewport, Resolusi CORS Docker, Harmonisasi Bab III & IV Naskah IEEE, Integrasi Aset Gambar Nyata, serta Akselerasi Build Docker)
* Transformasi visual menyeluruh mengadopsi sistem desain *Liquid Glass / Glassmorphism iOS 26* pada seluruh portal publik (Landing Page), portal Admin, dan portal Siswa.
* Perbaikan dan pemantapan navigasi Admin dengan bilah sisi (*sidebar*) tetap sepanjang layar penuh (`100vh` / `100dvh`), dukungan mode dinamis (*expanded* 240px vs *collapsed* 76px), serta *drawer overlay* responsif pada perangkat *mobile*.
* Resolusi kendala autentikasi dan otorisasi login siswa/admin pada Docker melalui penambahan CORS origin `http://localhost:3000` dan penyelarasan persistensi token/role.
* Harmonisasi dan penulisan Bab III (METHODOLOGY) format IEEE menjadi 3 pilar padat (Arsitektur Sistem, Rancangan Formulir Multi-Step, AI Pipeline) yang selaras dengan panduan PRD namun tetap mempertahankan keunggulan riset AI.
* Penulisan Bab IV (DATASET PROFILE) format IEEE mencakup taksonomi 7 kategori yuridis Permendikbudristek No. 46/2023, augmentasi teks, distribusi 1.400 sampel seimbang, dan benchmark eksternal 1.250 data.
* Integrasi berkas gambar riil ke dalam naskah LaTeX: Diagram Arsitektur Sistem (`ARSITEK_MERMAID.png`) serta Mockup Formulir Pelaporan Langkah 1, 2, dan 3 (`mock_langkah1.png`, `mock_langkah2.png`, `mock_langkah3.png`).
* Pemutakhiran daftar pustaka naskah menjadi 21 referensi jurnal internasional bereputasi tinggi yang 100% *Gold Open Access* (MDPI, BMJ, PLOS ONE, Nature Human Behaviour) bebas hambatan akses.
* Optimasi berkas `backend/sigap-backend/Dockerfile` dengan mengeliminasi instalasi compiler C `gcc` yang redundan guna memangkas waktu build container dari 13+ menit menjadi di bawah 1 menit.

### 🔗 Minggu 12–14 : Testing End-to-End, UAT, Keamanan, & Final Deployment
* Pelaksanaan verifikasi fungsional *Black-Box Testing*, pengujian kebergunaan *System Usability Scale* (SUS), dan evaluasi penerimaan pengguna *Technology Acceptance Model* (TAM).
* Pengujian beban dan latensi performa API backend FastAPI secara simultan.
* Penyelesaian Bab V (Experimental Results & Discussion) dan Bab VI (Conclusion) naskah paper ilmiah.
* Audit keamanan final, pengujian penetrasi antarmuka, dan *deployment* rilis produksi.

---

## 📌 Progress Mingguan : Frontend & Desain UI/UX (Minggu 10)

### Task 1 ✅
* **Penerapan Sistem Desain Liquid Glass / Glassmorphism iOS 26 Secara Menyeluruh**
  * Mendefinisikan token utilitas CSS modern pada `Frontend/src/index.css` (`.glass-panel`, `.glass-card`, `.glass-pill`, `.glass-input`, `.ambient-mesh-glow`).
  * Menerapkan kartu semi-transparan dengan efek *backdrop-blur*, batas halus (*border highlight*), dan bayangan lembut pada seluruh komponen portal Siswa, portal Admin, dan Landing Page.
  * Mempertahankan 100% integritas logika bisnis data, *route guards*, dan interaktivitas komponen tanpa distorsi visual.

### Task 2 ✅
* **Perbaikan Navigasi & Tata Letak Sidebar Admin Full Viewport**
  * Memperbaiki tata letak bilah sisi admin agar membentang kokoh dari batas atas hingga bawah layar (`fixed inset-y-0 left-0 h-screen h-[100dvh]`).
  * Mendukung transisi dinamis antara mode *expanded* (lebar 240px dengan label teks lengkap) dan mode *collapsed* (lebar 76px dengan ikon ringkas dan tooltip mengambang).
  * Menghadirkan tombol *burger* interaktif di navbar atas serta *backdrop drawer overlay* pada resolusi layar ponsel/tablet.
  * Menyelaraskan margin konten utama (`lg:ml-60` vs `lg:ml-[76px]`) agar tidak terjadi tumpang tindih (*overlap*) konten.

### Task 3 ✅
* **Redesain Visual Menyeluruh Landing Page Publik (`LandingPage.jsx`)**
  * Memperbarui hero section dengan kartu showcase interaktif pelaporan instan.
  * Menata ulang sajian *Dual-Mode Reporting* (Anonim vs Terverifikasi), kisi 7 kategori kekerasan resmi, serta 4 langkah mudah alur penanganan.
  * Menambahkan panel jaminan kerahasiaan & enkripsi, akordeon FAQ interaktif, kontak darurat (*emergency hotlines*), dan modal autentikasi terpadu.

### Task 4 ✅
* **Penyelarasan Autentikasi Frontend pada Lingkungan Docker**
  * Memperbaiki persistensi penyimpanan `token` dan `userRole` pada `StoreContext.jsx` agar tidak terputus saat halaman dimuat ulang.
  * Menambahkan mekanisme penanganan *fallback* pada `AdminLogin.jsx` dan `Login.jsx` sehingga pengguna tetap mendapatkan respons yang jelas ketika server backend dalam proses inisialisasi.

### Task 5 ✅
* **Standardisasi Alur Formulir Pengaduan Multi-Step & Penyiapan Mockup**
  * Menyelaraskan alur wizard formulir pelaporan siswa:
    * **Langkah 1**: Pemilihan Identitas Pelapor & Mode Kerahasiaan (Anonim vs Terverifikasi).
    * **Langkah 2**: Pengisian Substansi Kasus, Tanggal, Jam, dan Lokasi Kejadian di Sekolah.
    * **Langkah 3**: Unggah Bukti Digital (validasi 10 MB & MIME), Kebutuhan Bantuan Darurat, dan Konfirmasi Tiket.
  * Mengekspor tangkapan layar antarmuka resolusi tinggi (`mock_langkah1.png`, `mock_langkah2.png`, `mock_langkah3.png`) untuk diintegrasikan ke dalam naskah ilmiah.

---

## 📌 Progress Mingguan : Backend, Database, & DevOps (Minggu 10)

### Task 1 ✅
* **Resolusi Kendala CORS Multi-Origin & Konfigurasi Lingkungan Docker**
  * Memperbaiki konfigurasi `ALLOWED_ORIGINS` pada `backend/sigap-backend/app/config.py` dengan menambahkan izin akses eksplisit untuk `http://localhost:3000` dan `http://127.0.0.1:3000` (port container Nginx frontend).
  * Memperbarui berkas dokumentasi konfigurasi lingkungan `.env.example` untuk memastikan koneksi mulus ke MySQL container `sigap_db`.

### Task 2 ✅
* **Optimasi Kecepatan Build Dockerfile Backend**
  * Mengidentifikasi *bottleneck* proses `docker compose up --build` di mana instruksi instalasi `gcc` memakan waktu lebih dari 11 menit (678 detik) akibat latensi mirror Debian lokal.
  * Mengeliminasi instruksi `apt-get install gcc` dari `backend/sigap-backend/Dockerfile` karena seluruh dependensi Python modern (FastAPI, SQLAlchemy, Uvicorn, Pydantic, Bcrypt, Cryptography) telah memiliki paket biner (*pre-compiled wheels* `.whl`) resmi di PyPI.
  * Memangkas durasi kompilasi container backend secara signifikan sehingga proses build selanjutnya berjalan instan.

### Task 3 ✅
* **Verifikasi Stabilitas & Integritas Pengujian Otomatis (60 Tests Passed)**
  * Menjalankan seluruh rangkaian tes otomatis backend melalui `pytest` dengan hasil **100% kelulusan (60 passed, 0 failed)** dalam waktu 6,11 detik.
  * Memastikan validasi MIME berkas unggahan, proteksi endpoint JWT, alur FSM penanganan kasus, dan pencatatan jejak audit tetap terjaga kokoh.

---

## 📌 Progress Mingguan : Naskah Akademik IEEE (`SIGAP.tex`) (Minggu 10)

### Task 1 ✅
* **Penulisan & Restrukturisasi Bab III (METHODOLOGY) Menjadi 3 Pilar Padat**
  * Mengadopsi struktur ramping yang memadukan alur dokumen PRD dengan keunggulan riset AI SIGAP:
    * **A. Arsitektur Sistem dan Alur Pemrosesan Kasus**: Menguraikan arsitektur 3-tier, mesin status *Finite State Machine* (FSM), dan *tamper-resistant audit trail*.
    * **B. Rancangan Formulir Pengaduan Multi-Step**: Menjelaskan detail alur pelaporan Langkah 1, Langkah 2, dan Langkah 3 secara bertahap.
    * **C. Pipeline Kecerdasan Buatan (AI Pipeline)**: Menguraikan formulasi matematis klasifikasi *Cosine Similarity* berbasis IndoBERT (Persamaan 1) dan algoritma klastering kepadatan HDBSCAN.

### Task 2 ✅
* **Penulisan Bab IV (DATASET PROFILE) Format IEEE**
  * Menyusun Bab IV secara komprehensif ke dalam 4 sub-bab utama:
    * **A. Taxonomy and Ground Truth Formulation**: Mengacu pada 7 kategori yuridis Permendikbudristek No. 46/2023 dengan landasan empiris prevalensi kekerasan pelajar (*Marta dkk., BMJ 2026*).
    * **B. Text Preprocessing and Data Augmentation**: Normalisasi ragam bahasa nonformal/slang siswa dan solusi augmentasi teks parafrase (*Tang dkk., 2023*) untuk mengatasi *class imbalance*.
    * **C. Class Distribution and Data Partitioning**: Menyajikan **Tabel II** (1.400 sampel korpus seimbang, 200 per kategori) serta partisi *stratified split* 80:20 (1.120 latih vs 280 uji).
    * **D. External Benchmark Aggregation**: Integrasi 1.250 data pembanding makro dari Satu Data Indonesia, SIMFONI PPA KemenPPPA, dan Open Data daerah.

### Task 3 ✅
* **Integrasi Aset Visual Gambar Nyata ke Dokumen LaTeX**
  * Menggantikan kotak-kotak *placeholder* lama dengan gambar aset nyata:
    * **Gambar 1**: Diagram Arsitektur & Alur Kerja Sistem (`ARSITEK_MERMAID.png`).
    * **Gambar 2**: Mockup Formulir Langkah 1 - Identitas & Kerahasiaan (`mock_langkah1.png`).
    * **Gambar 3**: Mockup Formulir Langkah 2 - Data Kasus & Lokasi (`mock_langkah2.png`).
    * **Gambar 4**: Mockup Formulir Langkah 3 - Bukti Digital & Konfirmasi Tiket (`mock_langkah3.png`).

### Task 4 ✅
* **Ekspansi Rujukan Jurnal Bereputasi Tinggi & Bebas Paywall (21 Referensi)**
  * Memperluas daftar pustaka dari 14 menjadi 21 referensi ilmiah terkini (2020–2026).
  * Mengeliminasi seluruh artikel paywall berbayar dan menggantinya dengan jurnal bereputasi internasional berkategori *Gold Open Access* (MDPI, BMJ Paediatrics Open, PLOS ONE, Nature Human Behaviour, AACL-IJCNLP) dengan tautan DOI aktif yang dapat diakses secara instan oleh siapa pun.

### Task 5 ✅
* **Standardisasi Bahasa Inggris Teknis Murni Tanpa Istilah Ganda**
  * Menghapus penulisan ganda istilah bahasa Indonesia dan Inggris dalam tanda kurung (seperti *antarmuka pengguna (frontend)*) di Bab III dan Bab IV.
  * Menggunakan istilah baku langsung seperti `\textit{frontend}`, `\textit{dual-mode reporting}`, `\textit{class imbalance}`, `\textit{data augmentation}`, dan `\textit{confidence score}` sesuai standar penulisan IEEE.

---

## ⚠️ Kendala dan Keputusan

### Frontend & UI/UX

**Kendala:**
1. Pada resolusi layar tertentu, bilah navigasi admin sempat terpotong oleh batas scroll kontainer induk dan tidak membentang penuh hingga dasar layar.
2. Form pengaduan sebelumnya terasa terlalu padat jika disajikan dalam satu halaman panjang, menimbulkan kelelahan visual (*cognitive overload*) bagi siswa yang sedang mengalami trauma/intimidasi.
3. Terjadi kendala CORS saat peramban mengakses port backend `8000` dari kontainer Nginx frontend pada port `3000`.

**Keputusan:**
1. Mengubah struktur CSS sidebar menjadi `fixed inset-y-0 left-0 h-screen h-[100dvh]` dengan pembagian flexbox terpisah antara logo atas, menu navigasi tengah yang dapat di-scroll secara independen, dan kontrol profil bawah.
2. Membagi formulir pengaduan menjadi model *multi-step wizard* 3 tahap terpandu yang memisahkan identitas kerahasiaan, kronologi kejadian, dan dokumen bukti.
3. Menambahkan alamat `http://localhost:3000` dan `http://127.0.0.1:3000` ke dalam daftar `ALLOWED_ORIGINS` konfigurasi FastAPI backend.

---

### Backend & DevOps

**Kendala:**
1. Proses `docker compose up --build` berjalan sangat lama (>13 menit) karena Debian mirror lambat saat mengunduh compiler `gcc`.
2. Tampilan terminal Docker BuildKit tampak berulang-ulang mencetak teks yang sama setiap 0,1 detik sehingga dikira terjadi *infinite loop*.

**Keputusan:**
1. Menghapus baris instalasi `gcc` pada Dockerfile backend karena paket-paket Python di `requirements.txt` sudah tersedia dalam bentuk *pre-built wheel* `.whl`.
2. Mengedukasi pengguna bahwa pengulangan baris merupakan perilaku wajar mekanisme penyegaran layar BuildKit saat mengunduh paket.

---

### Naskah Akademik IEEE

**Kendala:**
1. Draf awal Bab III memuat 5 sub-bab (A hingga E) beserta banyak sub-poin sehingga terasa terlalu gemuk dan tidak proporsional dibanding dokumen rujukan teman/PRD.
2. Sebagian tautan referensi jurnal sebelumnya terkunci di balik dinding berbayar (*paywall*) IEEE Xplore sehingga penguji/pembaca umum tidak dapat memverifikasi isi jurnal secara mandiri.

**Keputusan:**
1. Melakukan restrukturisasi harmonisasi Bab III menjadi 3 pilar utama (A: Arsitektur, B: Formulir Multi-Step, C: AI Pipeline), serta memindahkan rincian pengujian fungsional dan usability ke Bab V.
2. Mengganti seluruh referensi paywall dengan artikel ilmiah bereputasi tinggi berstatus *100% Gold Open Access* dengan pranala PDF dan DOI aktif.

---

## 📊 Status Kesiapan Sistem Riil (Evaluasi Objektif Minggu 10)

| Komponen | Status Fungsional Riil | Keterangan |
|---|:---:|---|
| **Sistem Desain Liquid Glass iOS 26** | **100% Nyata** | Konsisten pada Landing Page, Portal Siswa, dan Portal Admin. |
| **Navigasi Sidebar Admin Full Viewport** | **100% Nyata** | Sidebar kokoh `100vh`, mode dinamis expanded/collapsed, drawer mobile aktif. |
| **Autentikasi (JWT + Bcrypt + RBAC)** | **100% Nyata** | Login siswa & admin terhubung ke MySQL, CORS port 3000 teratasi. |
| **Infrastruktur Kontainer Docker** | **100% Nyata** | Dockerfile backend dioptimasi, 4 container (MySQL, FastAPI, Nginx, PMA) siap pakai. |
| **Alur Formulir Multi-Step Pelaporan** | **100% Nyata** | Wizard 3 tahap (Identitas $\rightarrow$ Data Kasus $\rightarrow$ Unggah Bukti & Tiket). |
| **Pipeline AI IndoBERT & HDBSCAN** | **95% Nyata** | Triase otomatis kategori yuridis dan deteksi klaster hotspot insiden. |
| **Jejak Audit Mutlak (Audit Trail)** | **95% Nyata** | Mutasi status dilindungi FSM guard dan pencatatan riwayat aman. |
| **Pengujian Otomatis Backend** | **100% Nyata** | 60 unit dan E2E test cases lulus 100% tanpa kegagalan. |
| **Naskah Akademik Bab I, II, III, IV** | **100% Selesai** | Format IEEE dua kolom, diagram arsitektur nyata, 3 mockup UI, dan 21 rujukan Open Access. |
| **ESTIMASI KESIAPAN SISTEM RIIL** | **~92%** | **Sistem telah terintegrasi end-to-end, tampilan modern terpadu, dan naskah Bab I–IV lengkap.** |

---

## 🎯 Rencana Pengembangan Minggu Depan (Minggu 11 — Pengujian Fungsional Black-Box, Evaluasi SUS & TAM, Uji Performa API, serta Penulisan Bab V Hasil & Pembahasan)

1. **Pelaksanaan & Dokumentasi Pengujian Fungsional (*Black-Box Testing*):**
   * Menyusun matriks pengujian lengkap seluruh fitur aplikasi (pelaporan anonim, login terverifikasi, unggah berkas, validasi AI, dan mutasi status admin) untuk disajikan pada Bab V-A.
2. **Pengujian Kebergunaan Antarmuka (*System Usability Scale* / SUS):**
   * Mengumpulkan dan menghitung skor SUS (10 instrumen pertanyaan terstandar) dari responden siswa dan tenaga pendidik untuk Bab V-B.
3. **Evaluasi Model Penerimaan Teknologi (*Technology Acceptance Model* / TAM):**
   * Mengukur konstruk *Perceived Usefulness* (PU) dan *Perceived Ease of Use* (PEOU) sebagai bukti penerimaan publik terhadap platform SIGAP untuk Bab V-C.
4. **Pengujian Performa Backend dan API Benchmark:**
   * Melakukan pengukuran waktu respons (latensi dalam milidetik) dan *throughput* permintaan API FastAPI untuk Bab V-D.
5. **Penulisan Bab V (EXPERIMENTAL RESULTS AND DISCUSSION) & Bab VI (CONCLUSION):**
   * Menyelesaikan naskah akhir publikasi paper ilmiah secara komprehensif.

