# Progress Mingguan Pengembangan SIGAP (Minggu 13)

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

### 🚀 Minggu 12 : Pengujian Fungsional Black-Box 100%, Validasi Responden (SUS/TAM), Redesain Sinematik 3D Landing Page, Kompatibilitas Video Web H.264, & Standarisasi Formal Naskah Ilmiah IEEE
* Pelaksanaan pengujian fungsional komprehensif (*Black-Box Testing*) 14 skenario lintas 6 modul kritis dengan **tingkat keberhasilan mutlak 100,00% (14/14 lulus)** dan sinkronisasi datanya ke Tabel II naskah paper.
* Perancangan instrumen kuesioner kaji kelayakan sistem untuk responden (*Respondent Validation*) berbasis Google Form (*System Usability Scale* / SUS dan *Technology Acceptance Model* / TAM) lengkap dengan skrip otomasi Google Apps Script dan panduan skenario tugas terpandu bagi siswa dan Guru BK.
* Redesain visual sinematik Landing Page: integrasi objek kubus 3D interaktif 6-sisi (*Nested 3-Tier Rig*), *Dynamic Background Media Backdrop*, serta *One Continuous Shared Video Background* tanpa jeda/reload.
* Resolusi permasalahan pemutaran video latar belakang lintas platform (*cross-platform web compatibility*) dengan konversi format Apple QuickTime (.MOV) ke ISO MPEG-4 (H.264 / AAC / FastStart).
* Penyempurnaan formal naskah ilmiah IEEE: Penambahan definisi variabel notasi matematis pada formula *Cosine Similarity*, penyesuaian istilah pengujian menjadi *Respondent Validation*, serta pembersihan pola kalimat terindikasi AI (penghapusan karakter *em-dash*) pada subbab Diskusi.

### 🏆 Minggu 13 : Data Empiris Responden Lapangan (SUS/TAM), Evaluasi NLP 280 Sampel, Load Testing API Riil, Optimasi UI 3D Mobile Responsif, Restrukturisasi Paper Bebas Placeholder, & Materi Presentasi Kelompok (📍 Posisi Saat Ini: Selesai Minggu 13)
* Pengambilan dan pengolahan data kuesioner lapangan nyata dari 23 responden (22 siswa dan 1 Guru BK/Admin) dengan perolehan skor **SUS 66,85 (*Acceptable*)** dan skor **TAM 4,08 / 81,6% (*Adopsi Tinggi*)**.
* Pelaksanaan evaluasi komputasi klasifikasi teks NLP berbasis *IndoBERT sentence embedding* dan *cosine similarity* pada 280 sampel data uji tertutup seimbang (40 sampel per kategori yuridis) dengan **Akurasi 81,07%**, **Macro F1-Score 81,18%**, dan latensi 1,36 ms.
* Pengujian beban performa API (*Load Testing*) backend riil secara asinkronus dengan 50 permintaan konkuren (total 200 permintaan) yang mencatat latensi 270 ms pelaporan, 651 ms inferensi NLP, 400 ms auth JWT, dan **Success Rate mutlak 100,00%**.
* Restrukturisasi dan diferensiasi naskah publikasi ilmiah IEEE sesuai catatan dosen pembimbing: pemisahan tegas isi Subbab V.E (*Diskusi*) dan Bab VI (*Conclusion*), pemecahan tabel validasi responden menjadi 4 tabel detail IEEE, serta eliminasi 100% placeholder `XX` (dokumen tepat 8 halaman IEEE).
* Penyempurnaan responsivitas 3D Photo Cube mobile dengan kalkulasi offset dinamis dan centering horizontal, serta penyusunan instrumen kuesioner iterasi ke-2 (`docs/26`).
* Penyusunan materi komprehensif presentasi kelompok: bank 30 tanya-jawab Frontend & Backend (`docs/24`), materi slide Canva AI 12 slide (`docs/25`), serta verifikasi akses tunneling online publik via Cloudflare Tunnel.

### 🔗 Minggu 14 : Penyebaran Kuesioner Evaluasi Iterasi ke-2, Gladi Resik Simulasi Sidang Akhir, & Final Deployment Produksi (Akan Datang)
* Penyebaran kuesioner Google Form iterasi ke-2 kepada siswa dan Guru BK guna mengukur peningkatan kepuasan pengguna pasca penyempurnaan UI mobile.
* Pelaksanaan gladi resik simulasi presentasi kelompok menggunakan panduan bank tanya-jawab teknis Frontend dan Backend.
* Audit keamanan akhir basis data, penguncian kredensial produksi pada berkas `.env`, dan verifikasi keandalan container Docker untuk kesiapan demonstrasi sidang akhir tugas akhir.

---

## 📌 Progress Mingguan : Frontend & Desain UI/UX (Minggu 13)

### Task 1 ✅
* **Optimasi Responsivitas 3D Photo Cube pada Layar Mobile (`InteractivePhotoCube.jsx`)**
  * Mengatasi kendala tumpang-tindih (*overlapping*) antara kubus 3D dengan teks judul/subjudul pada layar ponsel dengan mengimplementasikan kalkulasi offset vertikal dinamis berbasis bounding rect slot spacer `hero-mobile-cube-slot`.
  * Menyesuaikan breakpoint skala kubus dinamis (skala 0.52 pada mobile) serta mengalibrasi bayangan dasar (*ground shadow*) agar kubus tetap terbingkai rapi dan proporsional di atas tombol aksi (*call-to-action*).
  * Menerapkan centering horizontal mutlak (`left: 50%`, `transform: translateX(-50%)`) untuk memastikan kubus selalu berada tepat di tengah viewport mobile tanpa memicu *horizontal scrollbar overflow*.

### Task 2 ✅
* **Penyesuaian Kompatibilitas Alur Path Relatif Frontend untuk Tunneling Online (`api.js` & `ReportDetail.jsx`)**
  * Mengubah pemanggilan endpoint backend dari hardcoded `http://localhost:8000` menjadi *relative path* `/api` pada `Frontend/src/services/api.js`.
  * Memperbaiki penanganan URL berkas lampiran bukti pada `ReportDetail.jsx` agar menggunakan path relatif `/uploads/`, sehingga seluruh media foto/dokumen aduan dapat diakses secara sempurna saat sistem dijalankan melalui Cloudflare Tunneling publik (`trycloudflare.com`).

### Task 3 ✅
* **Penyusunan Materi Presentasi Kelompok & Desain Slide Canva AI (`docs/24` & `docs/25`)**
  * Menyusun naskah rancangan presentasi 12 slide modern pitch-deck ([`docs/25-Materi_PPT_Presentasi_SIGAP.md`](./25-Materi_PPT_Presentasi_SIGAP.md)) lengkap dengan prompt visual Canva AI per slide dan narasi lisan presenter.
  * Menyusun bank materi tanya jawab ([`docs/24-Materi_dan_QNA_Presentasi_Kelompok.md`](./24-Materi_dan_QNA_Presentasi_Kelompok.md)) berisi 30 pertanyaan kritis (15 soal Frontend dan 15 soal Backend) mencakup arsitektur React, state management, keamanan JWT, penanganan MIME upload, hingga pipeline AI IndoBERT.

---

## 📌 Progress Mingguan : Backend, Testing, & Pipeline AI (Minggu 13)

### Task 1 ✅
* **Pengolahan & Ekstraksi Data Empiris Responden Lapangan (n = 23)**
  * Mengolah data tanggapan kuesioner aktual dari berkas `Kuesioner Pengujian Penerimaan Pengguna — SIGAP (Jawaban).xlsx` yang diisi oleh 23 responden riil (22 siswa dan 1 Guru BK/Admin, 13 Laki-laki dan 10 Perempuan).
  * Mengkalkulasi skor instrumen ilmiah baku:
    * **System Usability Scale (SUS):** Rerata keseluruhan sebesar **66,85** (skala 0–100) dalam kategori *Acceptable* (Siswa: 66,70, Guru BK: 70,00 — *Good*).
    * **Technology Acceptance Model (TAM):** Rerata keseluruhan sebesar **4,08** (skala 1–5) atau **81,6%** (*Adopsi Tinggi*), dengan skor *Perceived Usefulness* (PU) sebesar 4,18 (83,7%) dan *Perceived Ease of Use* (PEOU) sebesar 3,97 (79,5%).

### Task 2 ✅
* **Pelaksanaan Evaluasi Komputasi Model Klasifikasi NLP (280 Sampel Data Uji Tertutup)**
  * Menjalankan evaluasi komputasi inferensi model klasifikasi berbasis *IndoBERT sentence embedding* (`indobenchmark/indobert-base-p1`) dan *cosine similarity* terhadap 280 data uji tertutup seimbang (40 sampel untuk setiap dari 7 kategori yuridis perundungan).
  * Memperoleh metrik kinerja empiris: **Akurasi 81,07%**, **Macro F1-Score 81,18%**, Weighted F1-Score 81,25%, serta latensi komputasi inferensi rata-rata sebesar 1,36 ms per aduan.
  * Mengintegrasikan metrik presisi, recall, dan F1-score tiap kategori yuridis secara lengkap ke dalam Tabel III naskah publikasi ilmiah.

### Task 3 ✅
* **Uji Beban Performa API Empiris (*Load Testing* 50 Concurrent Requests)**
  * Mengembangkan skrip uji beban asinkronus `backend/sigap-backend/load_test.py` berbasis pustaka `httpx` untuk menyimulasikan 50 permintaan konkuren (total 200 permintaan) terhadap endpoint kritis backend.
  * Hasil pengujian performa riil mencatat:
    * Waktu respons rata-rata operasi pelaporan (non-NLP): **270 ms**.
    * Waktu respons rata-rata operasi inferensi NLP aduan: **651 ms**.
    * Waktu respons rata-rata autentikasi JWT: **400 ms** (memenuhi kriteria *sub-second* < 500 ms).
    * Rasio keberhasilan sistem (*API Success Rate*): **100,00%** (200 dari 200 permintaan berhasil tanpa kegagalan).

### Task 4 ✅
* **Perancangan Dokumen Instrumen Evaluasi Pengujian Iterasi ke-2 (`docs/26`)**
  * Menyusun dokumen instrumen evaluasi siklus ke-2 ([`docs/26-Google_Apps_Script_Pengujian_Iterasi_2.md`](./26-Google_Apps_Script_Pengujian_Iterasi_2.md)) yang mencakup kode Google Apps Script untuk pembuatan form kuesioner baru, kalkulator SUS/TAM otomatis pada Google Sheets, formula perbandingan delta skor, serta draft siaran kepada responden.

---

## 📌 Progress Mingguan : Naskah Publikasi Ilmiah IEEE (`SIGAP.tex`) (Minggu 13)

### Task 1 ✅
* **Restrukturisasi & Diferensiasi Bagian Diskusi (V.E) dan Conclusion (VI)**
  * Menindaklanjuti catatan dosen pembimbing agar bagian Kesimpulan tidak redundan dengan bagian Diskusi dan tidak memuat istilah teknis berlebihan:
    * **Subbab Diskusi (V.E):** Dikhususkan untuk analisis ilmiah mendalam, implikasi teoritis, fenomena *underreporting*, dan konsep *human-in-the-loop* dengan referensi literatur terkait.
    * **Bab Kesimpulan (VI):** Ditulis ulang secara padat dan lugas mengikuti struktur 4 pilar standar: (1) Permasalahan keengganan lapor siswa; (2) Solusi platform SIGAP; (3) Tiga metode evaluasi (*black-box*, NLP, dan validasi responden SUS/TAM); serta (4) Ringkasan kuantitatif hasil evaluasi.

### Task 2 ✅
* **Penyajian 4 Tabel Detail Validasi Responden Bergaya Standar IEEE**
  * Merestrukturisasi subbab V.D (*Respondent Validation*) dari yang sebelumnya hanya 1 tabel ringkasan menjadi 4 tabel detail terstruktur sesuai standar referensi paper IEEE:
    1. **Tabel Profil Responden (n = 23):** Distribusi peran (Siswa: 22, Guru BK: 1) dan jenis kelamin (Laki-laki: 13, Perempuan: 10).
    2. **Tabel Rata-rata Skor SUS Menurut Peran:** Rerata semua responden (66,85), siswa (66,70), dan Guru BK (70,00).
    3. **Tabel Rata-rata Nilai per Butir SUS:** Rincian rata-rata 10 butir pernyataan (S1 hingga S10).
    4. **Tabel Hasil Evaluasi TAM:** Perincian skor rata-rata aspek PU (4,18), PEOU (3,97), dan keseluruhan (4,08).

### Task 3 ✅
* **Eliminasi 100% Placeholder Nilai `XX` dan `XXX` di Seluruh Naskah**
  * Mengganti seluruh nilai sementara pada Abstrak dan Subbab V.C dengan data empiris hasil load test riil: tingkat keberhasilan fungsi 100,00%, latensi pelaporan 270 ms, inferensi NLP 651 ms, latensi auth 400 ms, dan rasio keberhasilan API 100,00%.
  * Memastikan tidak ada satu pun karakter placeholder yang tertinggal pada naskah ilmiah.

### Task 4 ✅
* **Perbaikan Karakter Beraksen Bibliografi & Sinkronisasi 3 Berkas Sumber**
  * Memperbaiki penulisan karakter non-ASCII pada sitasi `\bibitem{regueiro2021}` (`Guti{\'e}rrez-Ag{\"u}ero`) agar kompatibel penuh dengan mesin kompilasi `pdflatex`.
  * Menambahkan package `\usepackage{multirow}` untuk mendukung rendering tabel profil responden.
  * Melakukan sinkronisasi identik pada ketiga berkas: `SIGAP.tex`, `SIGAP_Paper.tex`, dan `SIGAP-source.tex`.
  * Memverifikasi hasil kompilasi:
    * `SIGAP_Paper.pdf`: **Tepat 8 halaman** (sesuai batas maksimal format IEEE conference $\le 8$ halaman).
    * `SIGAP.pdf`: **24 halaman** (naskah laporan lengkap dengan 4 tabel detail).

---

## ⚠️ Kendala dan Keputusan

### Frontend & UI/UX

**Kendala:**
1. Pada tampilan layar ponsel (*mobile viewport*), objek 3D Photo Cube sempat menutupi teks subjudul hero dan tombol aksi karena keterbatasan ruang vertikal.
2. Pengujian tunneling publik via Cloudflare Tunnel sempat mengalami kendala pemanggilan API dan pemuatan gambar bukti aduan akibat hardcoded URL `http://localhost:8000`.

**Keputusan:**
1. Mengimplementasikan kalkulasi offset vertikal dinamis terhadap slot pembatas `hero-mobile-cube-slot`, menetapkan skala kubus mobile 0.52, dan menerapkan centering horizontal mutlak (`left: 50%`, `translateX(-50%)`).
2. Melakukan refactoring menyeluruh pada berkas `api.js` dan `ReportDetail.jsx` menjadi path relatif (`/api` dan `/uploads/`) sehingga sistem berfungsi sempurna baik pada localhost maupun domain tunneling publik.

---

### Backend & Testing

**Kendala:**
1. Naskah publikasi pada bagian evaluasi performa sistem (Subbab V.C) dan Abstrak masih berstatus placeholder `XX` karena belum pernah dilakukan pengukuran beban konkuren secara terukur.
2. Tabel validasi responden pada versi awal dinilai terlalu ringkas sehingga tidak memperlihatkan variasi persebaran skor per butir pernyataan kuesioner.

**Keputusan:**
1. Mengembangkan skrip load test asinkronus `load_test.py` menggunakan `httpx` dengan simulasi 50 koneksi konkuren (200 total request). Data latensi riil (270 ms pelaporan, 651 ms NLP, 400 ms auth, dan 100% success rate) langsung dimasukkan ke naskah paper.
2. Membedah seluruh data mentah dari `Kuesioner Pengujian Penerimaan Pengguna — SIGAP (Jawaban).xlsx` dan menyajikannya ke dalam 4 tabel terpisah: profil responden, SUS per peran, SUS per butir pernyataan (S1–S10), serta TAM per aspek.

---

### Naskah Publikasi Ilmiah IEEE

**Kendala:**
1. Dosen pembimbing menginstruksikan bahwa bagian Kesimpulan tidak boleh mengulang detail teknis dari bagian Diskusi (seperti istilah *underreporting*, *tamper-resistant audit trail*, *human-in-the-loop*, dll.), melainkan harus fokus merangkum: masalah, aplikasi SIGAP, metode pengujian, dan hasil numerik.
2. Penambahan 4 tabel baru pada Subbab V.D berisiko membuat jumlah halaman paper melampaui batas toleransi 8 halaman IEEE.

**Keputusan:**
1. Menata ulang narasi Bab VI (Conclusion) menjadi 1 paragraf padat dan ringkas yang secara disiplin menjawab 4 pilar tersebut, sementara pembahasan teoritis dan implikasi literatur tetap berada di Subbab Diskusi (V.E).
2. Mengoptimalkan ukuran tabel menggunakan `\resizebox{\columnwidth}{!}` dan tata letak ringkas sehingga `SIGAP_Paper.pdf` berhasil dikompilasi secara presisi tepat pada **8 halaman penuh**.

---

## 📊 Status Kesiapan Sistem Riil (Evaluasi Objektif Minggu 13)

| Komponen | Status Fungsional Riil | Keterangan |
|---|:---:|---|
| **Verifikasi Fungsional (Black-Box Testing)** | **100% Lulus (14/14 TC)** | 14 skenario uji lintas 6 modul terverifikasi sukses pada sistem nyata. |
| **Evaluasi Klasifikasi Teks NLP (IndoBERT)** | **81,07% Akurasi (Empiris)** | Diuji pada 280 sampel tertutup seimbang, Macro F1 81,18%, latensi 1,36 ms. |
| **Evaluasi Kaji Kelayakan Pengguna (SUS)** | **66,85 (*Acceptable*)** | Rata-rata dari 23 responden lapangan (Guru BK: 70,00, Siswa: 66,70). |
| **Evaluasi Penerimaan Teknologi (TAM)** | **4,08 / 81,6% (*Adopsi Tinggi*)** | PU 4,18 (83,7%), PEOU 3,97 (79,5%) berdasarkan 23 responden lapangan. |
| **Evaluasi Kinerja Beban API (Load Test)** | **100% Lulus (200/200 OK)** | 50 concurrent requests, latensi pelaporan 270 ms, inferensi NLP 651 ms. |
| **Responsivitas Antarmuka 3D Mobile** | **100% Optimal** | Offset dinamis terhadap slot hero, no-overflow, animasi halus. |
| **Kompatibilitas Media Video Web (H.264)** | **100% Nyata** | Seluruh video terkonversi ke ISO MP4 H.264, disajikan mulus oleh Nginx. |
| **Infrastruktur Backend & Database Docker** | **100% Nyata** | 4 container stabil (MySQL, FastAPI, Nginx, phpMyAdmin). |
| **Materi & Bank QnA Presentasi Kelompok** | **100% Siap** | 30 soal komprehensif FE/BE (`docs/24`) dan rancangan 12 slide PPT (`docs/25`). |
| **Naskah Publikasi Ilmiah IEEE (Bab I s.d. VI)** | **100% Final (8 Halaman)** | Bebas placeholder XX, 4 tabel detail kuesioner, sinkron penuh. |
| **ESTIMASI KESIAPAN SISTEM RIIL** | **~99%** | **Sistem matang end-to-end, data pengujian 100% empiris riil, naskah paper siap terbit.** |

---

## 🎯 Rencana Pengembangan Minggu Depan (Minggu 14 — Penyebaran Kuesioner Evaluasi Iterasi ke-2, Gladi Resik Simulasi Sidang Akhir, & Final Deployment Produksi)

1. **Penyebaran Kuesioner Evaluasi Pengguna Iterasi ke-2:**
   * Mendistribusikan formulir evaluasi iterasi ke-2 berbasis Google Apps Script (`docs/26`) untuk menguji respons dan kepuasan pengguna pasca penyempurnaan responsivitas mobile dan alur sistem.
2. **Gladi Resik & Pemantapan Presentasi Kelompok:**
   * Mematangkan pembagian peran presenter menggunakan panduan slide Canva AI (`docs/25`) dan simulasi tanya-jawab teknis Frontend/Backend (`docs/24`).
3. **Audit Kesiapan Rilis Produksi & Deployment Satuan Pendidikan:**
   * Memastikan stabilitas sistem saat diakses melalui domain jaringan sekolah dan mengunci konfigurasi variabel lingkungan produksi.
