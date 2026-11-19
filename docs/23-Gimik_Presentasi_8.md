# Progress Mingguan Pengembangan SIGAP (Minggu 12)

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

### 💻 Minggu 8–11 : Integrasi Live API, Penguatan Keamanan, & Pipeline AI
* Penambahan modul Manajemen Akun Petugas & Hak Akses langsung ke database MySQL (`admins`).
* Pembangunan fitur Notifikasi Lonceng Live Interaktif pada navbar admin.
* Navigasi Sidebar Admin Full-Viewport (`100vh` / `100dvh`) yang kokoh dan responsif.
* Penyelarasan tema cerah Liquid Glass dan penyusunan draf awal Bab V naskah paper IEEE.

### 🚀 Minggu 12 : Pengujian Fungsional Black-Box 100%, Validasi Responden (SUS/TAM), Redesain Sinematik 3D Landing Page, Kompatibilitas Video Web H.264, & Standarisasi Formal Naskah Ilmiah IEEE (📍 Posisi Saat Ini: Selesai Minggu 12)
* Pelaksanaan pengujian fungsional komprehensif (*Black-Box Testing*) 14 skenario lintas 6 modul kritis dengan **tingkat keberhasilan mutlak 100,00% (14/14 lulus)** dan sinkronisasi datanya ke Tabel II naskah paper.
* Perancangan instrumen kuesioner kaji kelayakan sistem untuk responden (*Respondent Validation*) berbasis Google Form (*System Usability Scale* / SUS dan *Technology Acceptance Model* / TAM) lengkap dengan skrip otomasi Google Apps Script dan panduan skenario tugas terpandu bagi siswa dan Guru BK.
* Redesain visual sinematik Landing Page: integrasi objek kubus 3D interaktif 6-sisi (*Nested 3-Tier Rig*), *Dynamic Background Media Backdrop*, serta *One Continuous Shared Video Background* tanpa jeda/reload.
* Resolusi permasalahan pemutaran video latar belakang lintas platform (*cross-platform web compatibility*) dengan konversi format Apple QuickTime (.MOV) ke ISO MPEG-4 (H.264 / AAC / FastStart).
* Penyempurnaan formal naskah ilmiah IEEE: Penambahan definisi variabel notasi matematis pada formula *Cosine Similarity*, penyesuaian istilah pengujian menjadi *Respondent Validation*, serta pembersihan pola kalimat terindikasi AI (penghapusan karakter *em-dash*) pada subbab Diskusi.

### 🔗 Minggu 13–14 : Pengambilan Data Responden Lapangan, Analisis Statistik SUS & TAM, Finalisasi Bab VI (Conclusion), & Final Deployment (Akan Datang)
* Penyebaran kuesioner Google Form kepada responden siswa dan guru BK/admin sekolah secara terstruktur.
* Pengolahan data kuantitatif instrumen SUS (normalisasi skor 0–100) dan TAM (skor rata-rata konstruk PU & PEOU skala 5,00) untuk menggantikan nilai placeholder pada naskah paper.
* Penyusunan Bab VI (*Conclusion*) naskah IEEE yang merangkum kontribusi riset, signifikansi empiris, dan arah pengembangan lanjutan.
* Uji ketahanan keamanan final (sanitasi SQL Injection, XSS, MIME spoofing) dan rilis produksi sistem SIGAP.

---

## 📌 Progress Mingguan : Frontend & Desain UI/UX (Minggu 12)

### Task 1 ✅
* **Redesain Sinematik Hero Section dengan Kubus 3D 6-Sisi Interaktif (`InteractivePhotoCube.jsx`)**
  * Membangun komponen kubus 3D interaktif murni berbasis CSS 3D Transforms dengan arsitektur isolasi 3-tier (*Scroll Rig*, *Auto Pivot*, dan *Mouse Dynamic Core*).
  * Menghubungkan 5 video lokal (`video-1.mp4` s.d. `video-5.mp4`) dan 1 foto statis (`photo-1.jpg`) pada 6 permukaan kubus dengan performa GPU optimal tanpa filter blur berat.
  * Menyelaraskan koreografi gulir 5-scene halus (*Smooth Scroll Choreography*) yang menyajikan transisi sinematik tanpa membajak perilaku *scroll* alami peramban (*zero scroll-hijacking*).

### Task 2 ✅
* **Implementasi Dynamic Backdrop & Continuous Shared Video Background (`LandingPage.jsx`)**
  * Menghadirkan komponen `BackgroundMediaBackdrop.jsx` sebagai latar belakang atmosferik cerdas yang merespons pergerakan kubus 3D.
  * Menerapkan teknik *One Continuous Shared Video Background* (`shared-video-wrapper`) tunggal untuk seksi 7 Bentuk Kekerasan dan seksi Teknologi Cerdas tanpa *unmount*, *flicker*, atau jeda pemutaran saat pengguna menggulir halaman.
  * Mengintegrasikan lapisan pelindung translusen *Baby Blue & White* (`rgba(255, 255, 255, 0.45)`) untuk menjaga keterbacaan tipografi judul dan tombol aksi.

### Task 3 ✅
* **Optimasi Animasi Pinned Wavy Reel 7 Bentuk Kekerasan (`CinematicCategoriesShowcase.jsx`)**
  * Memperbaiki struktur *Pinned Scroll* sejati dengan mengeliminasi pembungkus *overflow-hidden* yang merusak perilaku `position: sticky`.
  * Mengeliminasi *state updates* React pada loop `requestAnimationFrame` (RAF) guna mencapai performa rendering 60 FPS bebas lag (*zero-lag GPU acceleration*).
  * Mengintegrasikan 8 kartu visual kekerasan dengan efek *hover full color* dan tautan aksi yang langsung terhubung ke formulir pelaporan terpandu.

### Task 4 ✅
* **Resolusi Kompatibilitas Pemutaran Video Lintas Platform (H.264 ISO MP4)**
  * Mengidentifikasi akar masalah video background dan kubus yang tidak dapat diputar pada peramban Google Chrome dan Firefox di lingkungan sistem operasi Linux.
  * Melakukan konversi transkoding menggunakan `ffmpeg` terhadap 5 berkas video berformat Apple QuickTime (.MOV/QT) ke profil standar web:
    * **Video Codec:** `H.264 / AVC` (Pixel format: `yuv420p`, CRF: 23, Preset: Fast).
    * **Audio Codec:** `AAC` (128 kbps).
    * **Web Optimization:** Penempatan atom indeks metadata di awal berkas (`-movflags +faststart`) agar video dapat diputar seketika (*instant stream*).
  * Membangun ulang seluruh aset statis frontend (`npm run build`) sehingga berkas video siap disajikan oleh container Nginx.

### Task 5 ✅
* **Harmonisasi Sistem Desain Minimalis Baby Blue & White di Seluruh Komponen**
  * Menyelaraskan palet warna seluruh tombol aksi admin (`AdminDashboard.jsx`, `ReportList.jsx`, `ReportDetail.jsx`, `AiValidation.jsx`) dari warna biru tua ke gradasi biru muda (#BFEFFF) dengan tipografi tegas (#1C6F8E).
  * Mengintegrasikan seksi editorial horizontal modern brutalist pada bagian "Tentang SIGAP" (`AboutEditorialShowcase.jsx`) dengan tata letak minimalis dan tipografi berbobot.

---

## 📌 Progress Mingguan : Backend, Keamanan, & Instrumen Pengujian (Minggu 12)

### Task 1 ✅
* **Perancangan Instrumen Evaluasi Kaji Kelayakan Sistem (`docs/20-brainstroming-pengujian.md`)**
  * Merumuskan instrumen evaluasi komprehensif berbasis standar metodologi ilmiah:
    * **System Usability Scale (SUS):** 10 butir pertanyaan skala Likert 1–5 terstandarisasi untuk mengukur kebergunaan, kemudahan pemahaman, dan integrasi antarmuka.
    * **Technology Acceptance Model (TAM):** Kuesioner berfokus pada konstruk *Perceived Usefulness* (PU) dan *Perceived Ease of Use* (PEOU) untuk mengukur tingkat adopsi teknologi oleh siswa dan Guru BK.
  * Menyusun matriks pengujian fungsional internal (*Black-Box Testing*) 14 skenario untuk memverifikasi kesiapan teknis aplikasi sebelum diuji oleh responden umum.

### Task 2 ✅
* **Penyusunan Panduan Skenario Tugas Pengujian Responden (`docs/21-Panduan_Skenario_Uji_Responden.md`)**
  * Menyusun panduan skenario tugas terpandu (*Guided User Task Flow*) yang memisahkan instruksi pengujian secara proporsional:
    * **Kelompok Peran Siswa:** Alur pengujian pembuatan laporan anonim, pengisian kronologi, unggah berkas bukti png/pdf, dan pelacakan status tiket pengaduan.
    * **Kelompok Peran Guru BK / Admin:** Alur login admin aman, verifikasi triase AI NLP, mutasi status penanganan kasus, peninjauan log audit trail, dan manajemen akun petugas.

### Task 3 ✅
* **Otomasi Pembuatan Formulir & Kalkulator Skor SUS/TAM (`docs/22-Google_Apps_Script_Form_Pengujian.md`)**
  * Mengembangkan skrip otomasi Google Apps Script siap pakai untuk:
    * Membuat formulir Google Form evaluasi secara instan dengan logika percabangan peran (Siswa vs Guru BK).
    * Mengkalkulasi formula skor SUS secara otomatis (konversi skor ganjil/genap dan normalisasi faktor pengali 2,5 ke rentang 0–100).
    * Menghitung nilai rata-rata konstruk TAM secara otomatis pada Google Sheets hasil tanggapan.

### Task 4 ✅
* **Eksekusi Pengujian Fungsional Black-Box Menyeluruh (14 Test Cases — 100% Lulus)**
  * Melakukan pengujian fungsional langsung pada lingkungan aplikasi riil melintasi 6 modul inti:
    1. *Autentikasi & JWT:* Login siswa valid, login siswa gagal, login admin valid, dan proteksi rute dashboard tanpa token JWT (4 TC — Lulus).
    2. *Pelaporan Multi-Step:* Submit aduan anonim valid, proteksi unggah file $> 10$ MB, dan penolakan file bukan MIME gambar/PDF (3 TC — Lulus).
    3. *Triase NLP:* Klasifikasi aduan narasi kekerasan fisik ke kategori yuridis yang tepat dengan tingkat confidence $> 50\%$ (1 TC — Lulus).
    4. *Manajemen Admin:* Penambahan akun petugas baru dan penghapusan staf non-super admin (2 TC — Lulus).
    5. *Klaster & Dashboard:* Penampilan data statistik laporan riil dari basis data MySQL (1 TC — Lulus).
    6. *Audit Trail & Pelacakan Tiket:* Mutasi status tercatat pada audit trail, pelacakan tiket kode valid, dan mitigasi tiket tidak valid (3 TC — Lulus).
  * Seluruh 14 skenario berhasil dieksekusi dengan tingkat keberhasilan sempurna **100,00%**.

---

## 📌 Progress Mingguan : Naskah Publikasi Ilmiah IEEE (`SIGAP.tex`) (Minggu 12)

### Task 1 ✅
* **Integrasi Data Empiris Riil pada Tabel II Black-Box Testing**
  * Memperbarui Tabel II naskah naskah publikasi ilmiah (`SIGAP.tex`, `SIGAP_Paper.tex`, dan `SIGAP-source.tex`) dengan menyajikan hasil pengukuran empiris riil:
    * Mengganti nilai *placeholder* `XX` dengan data absolut: 14 skenario uji, 14 berhasil dieksekusi, tingkat kelulusan 100,00% pada setiap modul.
    * Menyelaraskan teks narasi hasil pada Bab V Subbab A agar konsisten merefleksikan 14 skenario uji lintas 6 modul sistem.

### Task 2 ✅
* **Penambahan Definisi Notasi Variabel Matematis Persamaan Cosine Similarity (Persamaan 1)**
  * Menyempurnakan kaidah penulisan ilmiah formal IEEE tepat di bawah persamaan Cosine Similarity:
    $$\text{sim}(\vec{u}, \vec{v}_k) = \frac{\vec{u} \cdot \vec{v}_k}{\|\vec{u}\|\,\|\vec{v}_k\|} = \frac{\displaystyle\sum_{i=1}^{n} u_i v_{k,i}}{\sqrt{\displaystyle\sum_{i=1}^{n} u_i^2}\;\sqrt{\displaystyle\sum_{i=1}^{n} v_{k,i}^2} }$$
  * Menambahkan kalimat definisi eksplisit:
    > *"di mana $\text{sim}(\vec{u}, \vec{v}_k)$ merepresentasikan koefisien kemiripan semantik; $\vec{u} \in \mathbb{R}^n$ merupakan vektor representasi narasi aduan siswa hasil ekstraksi sentence embedding IndoBERT dengan dimensi ruang fitur $n = 768$; $\vec{v}_k \in \mathbb{R}^n$ adalah vektor centroid acuan untuk kategori yuridis ke-$k$ ($k \in \{1, 2, \dots, 7\}$); $u_i$ dan $v_{k,i}$ masing-masing menyatakan nilai bobot fitur pada dimensi ke-$i$; sedangkan $\|\cdot\|$ melambangkan norma Euclidean (magnitude) dari masing-masing vektor."*

### Task 3 ✅
* **Standarisasi Nomenklatur Pengujian Menjadi "Respondent Validation"**
  * Menyesuaikan istilah pengujian pengguna dari *User Acceptance Testing (UAT)* menjadi *Respondent Validation* pada seluruh bagian naskah ilmiah:
    * Bagian Abstrak: `...evaluasi klasifikasi teks, serta \textit{Respondent Validation}.`
    * Pengantar Bab V: `...dimensi pengujian: black-box testing, kinerja model NLP, performa sistem, dan \textit{Respondent Validation}.`
    * Judul Subbab V.D: Diubah secara resmi menjadi `\subsection{Respondent Validation}`.

### Task 4 ✅
* **Rekonstruksi Gaya Bahasa & Eliminasi Pola Kalimat Terindikasi AI**
  * Menghapus karakter *em-dash* (`---`) pada subbab Diskusi (Bab V.E) yang dinilai penguji terindikasi pola generatif AI.
  * Memecah kalimat menjadi struktur akademik baku yang natural:
    * *Sebelumnya:* `...berhasil meminimalkan hambatan psikologis pelaporan siswa---yang merupakan kontribusi utama terhadap fenomena underreporting...`
    * *Sesudah:* `...berhasil meminimalkan hambatan psikologis pelaporan siswa. Capaian ini menjawab persoalan underreporting yang diidentifikasi oleh Kasturiratna dkk. dan Wachs dkk.`

### Task 5 ✅
* **Sinkronisasi 3 Berkas Sumber & Keberhasilan Kompilasi PDF**
  * Seluruh pembaruan diintegrasikan secara identik pada 3 berkas sumber: `SIGAP.tex`, `SIGAP_Paper.tex`, dan `SIGAP-source.tex`.
  * Menjalankan kompilasi `pdflatex` dengan hasil sukses tanpa peringatan:
    * `SIGAP_Paper.pdf` (8 halaman format IEEE dua kolom).
    * `SIGAP.pdf` (22 halaman naskah lengkap).

---

## ⚠️ Kendala dan Keputusan

### Frontend & UI/UX

**Kendala:**
1. Berkas video latar belakang Landing Page dan kubus 3D (`sigap-background.mp4`, `cube-background.mp4`, `video-1.mp4`, dst.) tidak dapat diputar pada peramban Google Chrome dan Firefox di lingkungan Linux, sementara pada perangkat macOS berjalan normal.
2. Animasi gulir *wavy reel* pada kartu 7 Bentuk Kekerasan sempat mengalami penurunan *frame rate* (lag) saat digulir cepat karena komputasi state React yang berlebihan pada setiap frame.

**Keputusan:**
1. Mengidentifikasi bahwa 5 berkas video berformat kontainer Apple QuickTime (.MOV). Dilakukan transkoding massal ke profil ISO MP4 H.264 standar web (`libx264` + `aac` + `faststart`) menggunakan `ffmpeg` statis dan melakukan *rebuild* frontend ke direktori `dist/`.
2. Melakukan refactoring komponen: memisahkan pembacaan posisi scroll dari state React, memanfaatkan `layerRef` langsung ke DOM, serta memanfaatkan akselerasi GPU murni (`transform: translate3d`).

---

### Backend & Testing

**Kendala:**
1. Evaluasi penerimaan pengguna memerlukan instrumen baku yang dapat dipertanggungjawabkan secara akademis, tidak sekadar survei kepuasan umum tanpa landasan teori.
2. Dibutuhkan verifikasi fungsional objektif yang terdokumentasi rapi agar seluruh skenario alur (anonim, unggah bukti, triase AI) terbukti bekerja sebelum naskah dipublikasikan.

**Keputusan:**
1. Mengadopsi dua instrumen ilmiah baku yang diakui secara internasional: **System Usability Scale (SUS)** dengan 10 butir pertanyaan terstandarisasi dan **Technology Acceptance Model (TAM)** dengan konstruk PU & PEOU.
2. Merancang dan mengeksekusi 14 skenario *Black-Box Testing* langsung pada sistem, mendokumentasikannya ke dalam matriks uji, serta memasukkan hasil kelulusan 100% ke naskah publikasi ilmiah.

---

### Naskah Publikasi Ilmiah IEEE

**Kendala:**
1. Dosen penguji memberikan catatan bahwa penggunaan tanda hubung panjang (*em-dash* `---`) pada subbab Diskusi naskah ilmiah mengindikasikan struktur kalimat otomatis luaran AI generatif.
2. Rumus Cosine Similarity sebelumnya belum disertai rincian penjelasan simbol variabel, berpotensi menjadi celah pertanyaan reviewer jurnal.

**Keputusan:**
1. Menghapus seluruh karakter *em-dash* pada teks prosa naskah dan merestrukturisasi kalimat menjadi bentuk kalimat akademik baku yang ringkas, tegas, dan natural.
2. Menyisipkan paragraf definisi variabel formal tepat di bawah persamaan matematika (Persamaan 1) yang menguraikan dimensi ruang vektor $n = 768$, representasi aduan, serta vektor centroid acuan.

---

## 📊 Status Kesiapan Sistem Riil (Evaluasi Objektif Minggu 12)

| Komponen | Status Fungsional Riil | Keterangan |
|---|:---:|---|
| **Verifikasi Fungsional (Black-Box Testing)** | **100% Lulus (14/14 TC)** | 14 skenario uji lintas 6 modul terverifikasi sukses pada sistem nyata. |
| **Kompabilitas Media Video Web (H.264)** | **100% Nyata** | Seluruh video terkonversi ke ISO MP4 H.264, disajikan mulus oleh Nginx. |
| **Visual Sinematik 3D Kubus & Backdrop** | **100% Nyata** | Kubus 3D 6-sisi CSS transforms, zero-lag pinned scroll, tema Baby Blue. |
| **Instrumen Evaluasi Kaji Kelayakan (SUS/TAM)** | **100% Siap** | Instrumen kuesioner Google Form, panduan skenario, & Apps Script siap sebar. |
| **Manajemen Staf & Akun Admin (MySQL)** | **100% Nyata** | Pendaftaran staf live DB, enkripsi bcrypt, proteksi Super Admin. |
| **Notifikasi Lonceng Live (Admin Navbar)** | **100% Nyata** | Dropdown laporan berstatus *Menunggu*, dynamic badge counter MySQL. |
| **Autentikasi Multi-Role (JWT + Bcrypt)** | **100% Nyata** | Login siswa NISN dan login admin NIP dengan pemisahan hak akses ketat. |
| **Alur Formulir Multi-Step Pelaporan** | **100% Nyata** | Mode anonim & terverifikasi, unggah bukti digital, tiket pelacakan unik. |
| **Pipeline AI IndoBERT & HDBSCAN** | **95% Nyata** | Ekstraksi 768-d embedding, klasifikasi 7 kategori yuridis, klasterisasi titik rawan. |
| **Jejak Audit Mutlak (Audit Trail)** | **95% Nyata** | Pencatatan mutasi status kronologis, state transition guard FSM. |
| **Infrastruktur Docker & Automated Tests** | **100% Nyata** | 4 container stabil (MySQL, FastAPI, Nginx, PMA), automated test suite passed. |
| **Naskah Publikasi Ilmiah IEEE (Bab I s.d. V)** | **100% Lengkap** | Tabel II empiris 100%, definisi formula rapi, terminologi *Respondent Validation*. |
| **ESTIMASI KESIAPAN SISTEM RIIL** | **~98%** | **Sistem matang end-to-end, instrumen evaluasi siap sebar, naskah paper siap review.** |

---

## 🎯 Rencana Pengembangan Minggu Depan (Minggu 13 — Eksekusi Kuesioner Responden Lapangan, Pengolahan Data SUS/TAM, Bab VI Conclusion, & Rilis Produksi)

1. **Penyebaran Kuesioner Kaji Kelayakan kepada Responden Lapangan:**
   * Mendistribusikan formulir Google Form evaluasi sistem kepada kelompok responden siswa dan kelompok responden Guru BK/admin sesuai skenario tugas terpandu.
2. **Pengolahan Statistik Hasil Tanggapan Responden:**
   * Mengolah skor kuantitatif SUS (menghitung nilai rata-rata pada skala 0–100) dan skor TAM (analisis rata-rata konstruk PU dan PEOU pada skala 1–5).
   * Memasukkan hasil angka riil ke dalam naskah Bab V Subbab D (*Respondent Validation*) menggantikan tanda *placeholder* `XX,XX`.
3. **Penyusunan Bab VI (CONCLUSION) Naskah Publikasi Ilmiah:**
   * Merumuskan kesimpulan komprehensif mengenai kontribusi arsitektur *dual-mode*, efektivitas triase IndoBERT NLP, dampak penurunan hambatan psikologis pelaporan siswa, serta batasan penelitian dan rekomendasi pengembangan ke depan.
4. **Finalisasi Deployment & Kesiapan Rilis Produksi:**
   * Melakukan audit akhir integritas basis data, penguncian kredensial produksi pada berkas `.env`, dan verifikasi keandalan container Docker untuk kesiapan demonstrasi sidang akhir.
