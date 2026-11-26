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

### 🚀 Minggu 12 : Pengujian Fungsional Black-Box 100%, Validasi Responden Awal, Redesain Sinematik 3D Landing Page, & Kompatibilitas Video Web H.264
* Pelaksanaan pengujian fungsional komprehensif (*Black-Box Testing*) 14 skenario lintas 6 modul kritis dengan tingkat keberhasilan mutlak 100,00% (14/14 lulus).
* Perancangan instrumen kuesioner kaji kelayakan sistem untuk responden (*Respondent Validation*) berbasis Google Form (*System Usability Scale* / SUS dan *Technology Acceptance Model* / TAM) lengkap dengan skrip otomasi Google Apps Script.
* Redesain visual sinematik Landing Page: integrasi objek kubus 3D interaktif 6-sisi (*Nested 3-Tier Rig*), *Dynamic Background Media Backdrop*, serta *One Continuous Shared Video Background* tanpa jeda/reload.
* Resolusi permasalahan pemutaran video latar belakang lintas platform (*cross-platform web compatibility*) dengan konversi format Apple QuickTime (.MOV) ke ISO MPEG-4 (H.264 / AAC / FastStart).

### 🏆 Minggu 13 : Data Empiris Responden Nyata (SUS/TAM), Evaluasi NLP 280 Sampel, Load Testing API Riil, Perbaikan UI Mobile Responsif, & Restrukturisasi Naskah Ilmiah IEEE Bebas Placeholder (📍 Posisi Saat Ini: Selesai Minggu 13)
* **Pengambilan & Pengolahan Data Kuesioner Responden Lapangan Nyata (n = 23):**
  - Mengintegrasikan tanggapan kuesioner aktual dari `Kuesioner Pengujian Penerimaan Pengguna — SIGAP (Jawaban).xlsx` yang melibatkan 22 siswa dan 1 Guru BK/Admin (13 Laki-laki, 10 Perempuan).
  - Skor **SUS keseluruhan mencapai 66,85** (kategori *Acceptable*), dengan skor Guru BK 70,00 (*Good*) dan siswa 66,70.
  - Skor **TAM keseluruhan mencapai 4,08 dari skala 5,00 (81,6% — Adopsi Tinggi)**, dengan dimensi *Perceived Usefulness* (PU) sebesar 4,18 (83,7%) dan *Perceived Ease of Use* (PEOU) sebesar 3,97 (79,5%).
* **Evaluasi Komputasi Model NLP Klasifikasi Teks Aduan (280 Sampel Tertutup):**
  - Pelaksanaan evaluasi komputasi NLP berbasis *IndoBERT sentence embedding* (`indobenchmark/indobert-base-p1`) dan *cosine similarity* terhadap 280 data uji tertutup seimbang (40 sampel per kategori yuridis).
  - Menghasilkan **Akurasi 81,07%**, **Macro-Average F1-Score 81,18%**, Weighted F1-Score 81,25%, dan latensi inferensi rata-rata 1,36 ms per kalimat, mengisi penuh Tabel III naskah paper.
* **Pengujian Beban Kinerja API Empiris (*Load Testing* Riil):**
  - Menjalankan uji beban asinkronus menggunakan *httpx* pada backend server dengan 50 permintaan konkuren (total 200 permintaan).
  - Waktu respons rata-rata: pelaporan non-NLP 270 ms, inferensi NLP 651 ms, autentikasi JWT 400 ms (memenuhi ambang batas *sub-second* < 500 ms), dan tingkat keberhasilan API mutlak 100,00% (200/200 OK).
* **Restrukturisasi Naskah Ilmiah IEEE Sesuai Masukan Dosen Pembimbing:**
  - Melakukan diferensiasi tegas antara Subbab V.E (*Diskusi*) dan Bab VI (*Conclusion*) agar tidak redundan.
  - Diskusi difokuskan pada analisis teoritis mendalam (*underreporting*, *human-in-the-loop*, perbandingan literatur), sedangkan Conclusion disederhanakan mengikuti format standar 4 pilar: Permasalahan, Solusi SIGAP, Tiga Metode Pengujian, dan Rangkuman Hasil Numerik.
  - Mengubah tabel validasi responden menjadi 4 tabel detail bergaya standar IEEE: Profil Responden, Rerata SUS per Peran, Rerata per Butir SUS (S1–S10), dan Hasil TAM per Aspek.
  - Menghapus 100% placeholder `XX` dan `XXX` di seluruh naskah LaTeX ([`SIGAP_Paper.tex`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/SIGAP_Paper.tex), [`SIGAP.tex`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/SIGAP.tex), [`SIGAP-source.tex`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/SIGAP-source.tex)), serta menjaga dokumen paper tepat 8 halaman IEEE.
* **Penyempurnaan Tampilan UI 3D Interaktif Responsif Mobile:**
  - Penambahan slot bounding box `hero-mobile-cube-slot` dan kalkulasi offset dinamis pada `InteractivePhotoCube.jsx` untuk memastikan kubus 3D tidak menabrak teks hero pada layar perangkat ponsel.
  - Penyusunan instrumen evaluasi siklus ke-2 (`docs/26-Google_Apps_Script_Pengujian_Iterasi_2.md`) untuk mengukur kepuasan pengguna pasca penyempurnaan UI.
* **Kompilasi & Pemutakhiran Dokumen Presentasi Kelompok:**
  - Penyusunan bank materi tanya jawab presentasi ([`docs/24-Materi_dan_QNA_Presentasi_Kelompok.md`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/docs/24-Materi_dan_QNA_Presentasi_Kelompok.md)) berisi 30 soal komprehensif Frontend dan Backend beserta naskah presentasi PPT 12 slide Canva AI ([`docs/25-Materi_PPT_Presentasi_SIGAP.md`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/docs/25-Materi_PPT_Presentasi_SIGAP.md)).
  - Verifikasi akses publik melalui Cloudflare Tunneling (`cloudflared`).

### 🔗 Minggu 14 : Penyebaran Kuesioner Evaluasi Iterasi ke-2, Finalisasi Presentasi Sidang Akhir, & Audit Kesiapan Produksi (Akan Datang)
* Penyebaran kuesioner evaluasi iterasi ke-2 berbasis Google Form untuk menguji respon perbaikan antarmuka mobile dan alur baru.
* Pengujian akhir performa end-to-end terintegrasi pada jaringan produksi satuan pendidikan.
* Gladi resik simulasi presentasi kelompok menggunakan panduan bank tanya-jawab teknis.
* Penguncian rilis repositori final v1.0.0 untuk demonstrasi proyek tugas akhir.

---

## 📌 Ringkasan Capaian Utama Minggu 13

| Sesi | Tanggal / Waktu | Ringkasan Kegiatan | Berkas Utama Terkait |
|:---:|---|---|---|
| **Sesi 134–136** | 18–19 Nov 2026 | Rekapitulasi Gimik 8, formulasi draf Conclusion, dan standarisasi istilah pengujian *Respondent Validation*. | `docs/23-Gimik_Presentasi_8.md`, `SIGAP_Paper.tex` |
| **Sesi 137–138** | 19–25 Nov 2026 | Eliminasi redundansi narasi bilingual dan integrasi data kuesioner riil dari Google Forms (23 responden). | `SIGAP_Paper.tex`, `SIGAP.tex` |
| **Sesi 139** | 25 Nov 2026 | Evaluasi komputasi NLP pada 280 sampel data uji tertutup, penentuan Akurasi 81,07% dan F1-Score 81,18%. | `SIGAP_Paper.tex`, `docs/16-Log` |
| **Sesi 140–141** | 25 Nov 2026 | Integrasi Tabel IV pada naskah LaTeX dan pembersihan baris liar penyebab halaman kosong sebelum cover. | `SIGAP_Paper.tex`, `SIGAP_Paper.pdf` |
| **Sesi 142–144** | 25 Nov 2026 | Penyempurnaan responsivitas kubus 3D mobile, centering horizontal, dan instrumen kuesioner iterasi ke-2. | `InteractivePhotoCube.jsx`, `docs/26` |
| **Sesi 145** | 26 Nov 2026 | Restrukturisasi dan pemisahan tegas bagian Diskusi (V.E) dan Conclusion (VI) sesuai catatan dosen. | `SIGAP_Paper.tex`, `SIGAP.tex` |
| **Sesi 146** | 26 Nov 2026 | Pembagian hasil kuesioner menjadi 4 tabel detail IEEE: Profil, SUS Peran, SUS Butir, dan TAM Aspek. | `SIGAP_Paper.tex`, `SIGAP-source.tex` |
| **Sesi 147** | 26 Nov 2026 | Pelaksanaan load testing API backend (50 concurrent) dan eliminasi 100% placeholder XX pada paper. | `load_test.py`, `SIGAP_Paper.pdf` |

---

## 💡 Kendala & Keputusan Solutif Minggu 13

### 1. Perbedaan Karakteristik Diskusi vs Kesimpulan (Catatan Dosen)
* **Kendala:** Dosen pembimbing menilai bagian Conclusion terlalu padat dengan jargon mendalam (*underreporting*, *tamper-resistant*, *human-in-the-loop*, HDBSCAN) yang menyebabkan duplikasi isi dengan subbab Diskusi.
* **Solusi:** Bagian Diskusi (V.E) dipertahankan sebagai wahana analisis ilmiah dan implikasi teoritis mendalam. Sebaliknya, Conclusion (VI) ditulis ulang menjadi ringkas dan standar: Masalah yang diangkat $\rightarrow$ Solusi aplikasi SIGAP $\rightarrow$ Tiga metode pengujian $\rightarrow$ Ringkasan numerik hasil pengujian.

### 2. Eliminasi Seluruh Placeholder Nilai XX pada Naskah
* **Kendala:** Subbab Evaluasi Performa Sistem (V.C) dan Abstrak masih memuat tanda `XX` karena belum pernah dilakukan load test riil terukur.
* **Solusi:** Membuat skrip load test asinkronus `backend/sigap-backend/load_test.py` menggunakan `httpx` dengan 50 permintaan konkuren. Hasil riil (270 ms pelaporan, 651 ms NLP, 400 ms auth, dan 100% success rate) langsung disinkronkan ke seluruh berkas `.tex`.

### 3. Detail Hasil Evaluasi Responden Berdasarkan Format Referensi
* **Kendala:** Tabel hasil validasi responden awalnya hanya berupa 1 tabel ringkas yang kurang memperlihatkan persebaran per butir dan karakteristik sampel.
* **Solusi:** Merestrukturisasi subbab V.D menjadi 4 tabel terpisah sesuai gaya referensi IEEE: Profil Responden (n=23), Rata-rata SUS per Peran, Rata-rata per Butir Pernyataan SUS (S1–S10), serta Hasil Evaluasi TAM per Konstruk.

---

## 📊 Status Kesiapan Sistem Riil (Evaluasi Objektif Akhir Minggu 13)

| Komponen | Status Fungsional Riil | Keterangan |
|---|:---:|---|
| **Verifikasi Fungsional (Black-Box Testing)** | **100% Lulus (14/14 TC)** | 14 skenario uji lintas 6 modul terverifikasi sukses pada sistem nyata. |
| **Evaluasi Klasifikasi Teks NLP (IndoBERT)** | **81,07% Akurasi (Empiris)** | Diuji pada 280 sampel tertutup, Macro F1 81,18%, latensi 1,36 ms. |
| **Evaluasi Kaji Kelayakan Pengguna (SUS)** | **66,85 (*Acceptable*)** | Rata-rata dari 23 responden riil (Guru BK: 70,00, Siswa: 66,70). |
| **Evaluasi Penerimaan Teknologi (TAM)** | **4,08 / 81,6% (Adopsi Tinggi)** | PU 4,18 (83,7%), PEOU 3,97 (79,5%) berdasarkan 23 responden lapangan. |
| **Evaluasi Kinerja Beban API (Load Test)** | **100% Lulus (200/200 OK)** | 50 concurrent requests, latensi pelaporan 270 ms, inferensi NLP 651 ms. |
| **Responsivitas Antarmuka 3D Mobile** | **100% Optimal** | Offset dinamis terhadap slot hero, no-overflow, animasi halus. |
| **Kompabilitas Media Video Web (H.264)** | **100% Nyata** | Seluruh video terkonversi ke ISO MP4 H.264, disajikan mulus oleh Nginx. |
| **Infrastruktur Backend & Database Docker** | **100% Nyata** | 4 container stabil (MySQL, FastAPI, Nginx, phpMyAdmin). |
| **Naskah Publikasi Ilmiah IEEE (Bab I s.d. VI)** | **100% Final (8 Halaman)** | Bebas placeholder XX, 4 tabel pengujian kuesioner detail, sinkron penuh. |
| **ESTIMASI KESIAPAN SISTEM RIIL** | **~99%** | **Sistem matang end-to-end, data pengujian 100% empiris riil, naskah paper siap terbit.** |

---

## 🎯 Rencana Pengembangan Minggu Depan (Minggu 14 — Penyebaran Kuesioner Evaluasi Iterasi ke-2, Finalisasi Presentasi Sidang Akhir, & Rilis Final)

1. **Penyebaran Kuesioner Evaluasi Pengguna Iterasi ke-2:**
   * Mendistribusikan kuesioner evaluasi iterasi ke-2 berbasis Google Apps Script (`docs/26`) untuk menguji dampak peningkatan responsivitas antarmuka dan perbaikan alur pada siswa.
2. **Gladi Resik & Pemantapan Presentasi Kelompok:**
   * Mematangkan pembagian tugas presentasi kelompok menggunakan panduan slide Canva AI (`docs/25`) dan simulasi bank tanya-jawab teknis Frontend/Backend (`docs/24`).
3. **Audit Kesiapan Rilis Produksi & Deployment Satuan Pendidikan:**
   * Memastikan stabilitas endpoint saat diakses melalui tunnel publik sekolah dan mengunci konfigurasi variabel lingkungan produksi.
