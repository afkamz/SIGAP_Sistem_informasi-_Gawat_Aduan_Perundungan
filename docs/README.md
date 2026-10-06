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
| **12** | [12-Gimik_Presentasi_2.md](./12-Gimik_Presentasi_2.md) | **Material Presentasi (Sesi 2)**: Naskah atau poin presentasi sesi kedua. |
| **13** | [13-Gimik_Presentasi_3.md](./13-Gimik_Presentasi_3.md) | **Material Presentasi (Sesi 3)**: Naskah atau poin presentasi sesi ketiga. |

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
