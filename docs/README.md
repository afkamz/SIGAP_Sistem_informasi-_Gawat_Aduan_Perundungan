# Dokumentasi Proyek SIGAP
*(Sistem Informasi & Pengaduan Kekerasan di Satuan Pendidikan)*

Folder ini memuat seluruh dokumen spesifikasi produk, arsitektur sistem, rancangan alur pengguna (user flow), panduan UI/UX, desain sistem, dan roadmap tahapan teknis backend yang telah disusun secara terstruktur.

---

## 📚 Daftar Isi Dokumentasi

| No | Dokumen | Deskripsi |
| :---: | :--- | :--- |
| **01** | [**01-PRD.md**](./01-PRD.md) | **Product Requirements Document (PRD)**: Latar belakang, tujuan, cakupan 7 kategori Permendikbudristek No. 46/2023, kebutuhan fungsional & non-fungsional, dan metrik keberhasilan sistem. |
| **02** | [**02-Arsitektur_Sistem_SIGAP.md**](./02-Arsitektur_Sistem_SIGAP.md) | **Arsitektur Sistem**: Diagram arsitektur gateway FastAPI, skema basis data relasional, modul AI pipeline (IndoBERT + HDBSCAN), dan integrasi benchmark eksternal. |
| **03** | [**03-Userflow.md**](./03-Userflow.md) | **Alur Pengguna (User Flow)**: Diagram dan rincian interaksi alur pelapor siswa (anonim & terdaftar), tracking tiket publik, serta alur kerja konselor BK / Satgas PPKSP. |
| **04** | [**04-UIUX_Spesifikasi.md**](./04-UIUX_Spesifikasi.md) | **Spesifikasi UI/UX**: Panduan desain layar S-01 s/d S-10 (Portal Siswa) dan A-01 s/d A-08 (Portal Admin), standar aksesibilitas WCAG, dan tone of voice sistem. |
| **05** | [**05-Desain_Sistem.md**](./05-Desain_Sistem.md) | **Desain Sistem & Komponen**: Tipografi, palet warna resmi (*Baby Blue* `#A7D8F0`, *Sky*, *Slate*), sistem grid, ikonografi, dan spesifikasi komponen visual. |
| **06** | [**06-Tahapan_Backend.md**](./06-Tahapan_Backend.md) | **Roadmap & Tahapan Backend**: Panduan teknis bertahap pengerjaan backend dari Fase 1 hingga Fase 6 beserta checklist implementasi. |
| **07** | [**07-Fondasi_Data_SIGAP.md**](./07-Fondasi_Data_SIGAP.md) | **Fondasi Database & Dataset**: Struktur tabel database, relasi, enum status, format dataset CSV/JSON, normalisasi ETL, dan status implementasi fondasi data. |

---

## 🛠️ Modul Aplikasi Terkait

- **Frontend (React + Vite)**: Berada di direktori [`../Frontend/`](../Frontend/)
- **Backend (FastAPI + AI Pipeline)**: Berada di direktori [`../backend/sigap-backend/`](../backend/sigap-backend/)
- **Dataset & Ground Truth**: Berada di direktori [`../dataset/`](../dataset/)

