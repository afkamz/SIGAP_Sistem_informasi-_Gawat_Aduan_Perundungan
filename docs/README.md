# Dokumentasi Proyek SIGAP
*(Sistem Informasi Gawat Aduan Perundungan)*

Folder `docs/` memuat seluruh dokumen spesifikasi produk, arsitektur sistem, rancangan alur pengguna, panduan UI/UX, desain sistem, roadmap teknis backend, catatan kendala & keputusan, serta catatan progres pengembangan yang disusun secara terstruktur.

---

## 📚 Daftar Isi Dokumentasi

| No | Dokumen | Deskripsi |
| :---: | :--- | :--- |
| **01** | [01-PRD.md](./01-PRD.md) | **Product Requirements Document (PRD)**: Latar belakang, tujuan, cakupan 7 kategori Permendikbudristek No. 46/2023, kebutuhan fungsional & non-fungsional, dan metrik keberhasilan. |
| **02** | [02-Arsitektur_Sistem_SIGAP.md](./02-Arsitektur_Sistem_SIGAP.md) | **Arsitektur Sistem**: Diagram arsitektur gateway FastAPI, skema basis data relasional, modul AI pipeline (IndoBERT + HDBSCAN), dan integrasi benchmark eksternal. |
| **03** | [03-Userflow.md](./03-Userflow.md) | **Alur Pengguna (User Flow)**: Diagram interaksi alur pelapor siswa (anonim & terdaftar), tracking tiket publik, serta alur kerja konselor BK / Satgas PPKSP. |
| **04** | [04-UIUX_Spesifikasi.md](./04-UIUX_Spesifikasi.md) | **Spesifikasi UI/UX**: Panduan desain layar portal siswa (S-01–S-10) dan portal admin (A-01–A-08), standar aksesibilitas WCAG, dan tone of voice sistem. |
| **05** | [05-Desain_Sistem.md](./05-Desain_Sistem.md) | **Desain Sistem & Komponen**: Tipografi, palet warna (*Baby Blue* `#A7D8F0`, *Sky*, *Slate*), sistem grid, ikonografi, dan spesifikasi komponen visual. |
| **06** | [06-Tahapan_Backend.md](./06-Tahapan_Backend.md) | **Roadmap & Tahapan Backend**: Panduan teknis bertahap pengerjaan backend dari Fase 1 hingga Fase 6 beserta checklist implementasi. |
| **07** | [07-Fondasi_Data_SIGAP.md](./07-Fondasi_Data_SIGAP.md) | **Fondasi Database & Dataset**: Struktur tabel database, relasi, enum status, format dataset CSV/JSON, normalisasi ETL, dan status implementasi fondasi data. |
| **08** | [08-Kendala_dan_Keputusan.md](./08-Kendala_dan_Keputusan.md) | **Kendala & Keputusan Teknis**: Catatan lengkap kendala yang ditemui dan keputusan desain yang diambil selama pengembangan (frontend, backend, AI, dataset, deployment). |
| **09** | [**09-Progres_Pengembangan.md**](./09-Progres_Pengembangan.md) | **📊 Progres & Status Pengembangan**: Estimasi progres per komponen, log perubahan per sesi, daftar backlog testing, dan hal-hal yang perlu diperbaiki. |
| **10** | [10-Alur_Detail_Arsitektur.md](./10-Alur_Detail_Arsitektur.md) | **Alur Detail Arsitektur SIGAP**: Rincian teknis alur data antar komponen sistem. |
| **11** | [11-Gimik_Presentasi_1.md](./11-Gimik_Presentasi_1.md) | **Material Presentasi (Sesi 1)**: Naskah atau poin presentasi sesi pertama. |
| **12** | [12-Gimik_Presentasi_2.md](./12-Gimik_Presentasi_2.md) | **Material Presentasi (Sesi 2)**: Naskah atau poin presentasi sesi kedua (Minggu 6). |
| **13** | [13-Gimik_Presentasi_3.md](./13-Gimik_Presentasi_3.md) | **Material Presentasi (Sesi 3)**: Naskah atau poin presentasi sesi ketiga (Minggu 7). |
| **14** | [14-Laporan_Progres_Proyek_SIGAP.md](./14-Laporan_Progres_Proyek_SIGAP.md) | **Laporan Progres Realistis Proyek SIGAP**: Evaluasi capaian sistem berbasis fungsional riil (60%). |
| **15** | [15-Gimik_Presentasi_4.md](./15-Gimik_Presentasi_4.md) | **Progress Mingguan (Minggu 8)**: Route guard terpusat, sinkronisasi tiket backend riil, dan lookup hybrid. |
| **16** | [16-Log_Implementasi_dan_Perubahan.md](./16-Log_Implementasi_dan_Perubahan.md) | **Log Implementasi & Perubahan Sistem**: Catatan riwayat sesi teknis (Sesi 1 s.d. Sesi 10). |
| **17** | [**17-Gimik_Presentasi_5.md**](./17-Gimik_Presentasi_5.md) | **Progress Mingguan (Minggu 9)**: Eliminasi mock data total, integrasi live CRUD MySQL, serving bukti nyata, dan kartu triase Validasi AI. |
| **18** | [18-Gimik_Presentasi_6.md](./18-Gimik_Presentasi_6.md) | **Progress Mingguan (Minggu 10)**: Redesain landing page baby blue, audio soundscape, dan pipeline analitik data. |
| **19** | [19-Gimik_Presentasi_7.md](./19-Gimik_Presentasi_7.md) | **Progress Mingguan (Minggu 11)**: Integrasi live chart ECharts, audit trail hash SHA-256, dan testing end-to-end. |
| **20** | [20-brainstroming-pengujian.md](./20-brainstroming-pengujian.md) | **Brainstorming Pengujian**: Konsep instrumen evaluasi empiris pengguna (SUS & TAM). |
| **21** | [21-Panduan_Skenario_Uji_Responden.md](./21-Panduan_Skenario_Uji_Responden.md) | **Panduan Skenario Pengujian Responden**: Skenario tugas pengujian siswa dan admin. |
| **22** | [22-Google_Apps_Script_Form_Pengujian.md](./22-Google_Apps_Script_Form_Pengujian.md) | **Google Apps Script Form Pengujian (Iterasi 1)**: Skrip pembuat Google Form evaluasi pertama. |
| **23** | [23-Gimik_Presentasi_8.md](./23-Gimik_Presentasi_8.md) | **Progress Mingguan (Minggu 12)**: Rekapitulasi pencapaian siklus Minggu 12 dan persiapan instrumen evaluasi. |
| **24** | [24-Materi_dan_QNA_Presentasi_Kelompok.md](./24-Materi_dan_QNA_Presentasi_Kelompok.md) | **Materi & QnA Presentasi Kelompok**: Panduan komprehensif presentasi proyek SIGAP dan simulasi tanya jawab. |
| **25** | [25-Materi_PPT_Presentasi_SIGAP.md](./25-Materi_PPT_Presentasi_SIGAP.md) | **Materi Slide Presentasi SIGAP**: Rancangan slide presentasi pitch deck sistem SIGAP. |
| **26** | [26-Google_Apps_Script_Pengujian_Iterasi_2.md](./26-Google_Apps_Script_Pengujian_Iterasi_2.md) | **Google Apps Script Pengujian Iterasi ke-2 (Minggu 13)**: Instrumen evaluasi perbaikan, generator Google Form, skrip kalkulasi SUS/TAM sheets, dan komparasi delta peningkatan. |
| **27** | [27-Gimik_Presentasi_9.md](./27-Gimik_Presentasi_9.md) | **Progress Mingguan (Minggu 13)**: Rekapitulasi pencapaian siklus Minggu 13 (data empiris responden SUS/TAM, evaluasi NLP 280 sampel, load test API riil, restrukturisasi naskah paper IEEE bebas placeholder, dan optimasi UI 3D mobile). |

---

## 📂 Modul Aplikasi Terkait

| Komponen | Lokasi |
|---|---|
| **Frontend** (React + Vite + Tailwind) | [`../Frontend/`](../Frontend/) |
| **Backend** (FastAPI + AI Pipeline) | [`../backend/sigap-backend/`](../backend/sigap-backend/) |
| **Dataset & Ground Truth** | [`../backend/sigap-backend/dataset/`](../backend/sigap-backend/dataset/) |
| **Laporan Akademik (LaTeX)** | [`../SIGAP.tex`](../SIGAP.tex) |

---

## 🔖 Catatan Konvensi Penamaan File

File di folder ini menggunakan format `XX-Nama_Topik.md` di mana:
- `XX` adalah nomor urut dua digit untuk memudahkan pengurutan.
- `Nama_Topik` menggunakan PascalCase dengan underscore sebagai pemisah kata.

---

> Dokumen ini diperbarui setiap kali ada penambahan file dokumentasi baru atau perubahan signifikan pada struktur proyek.
