# Arsitektur Sistem SIGAP

## Gambaran Utama

```text
┌──────────────────────────────────────────────────────────────┐
│                    USER CLIENT (MVC)                          │
│                                                                │
│  ┌──────────────────────┐    ┌────────────────────────────┐  │
│  │    SISWA / USER       │    │ ADMIN / GURU BK / WALI     │  │
│  │                       │    │           KELAS             │  │
│  │ VIEW                  │    │ VIEW                        │  │
│  │ INPUT                 │    │ INPUT                       │  │
│  │ • Login               │    │ • Login                     │  │
│  │ • Form Pengaduan      │    │ • Validasi Pengaduan        │  │
│  │ • Kategori            │    │ • Kategori Final             │  │
│  │ • Deskripsi           │    │ • Status Penanganan         │  │
│  │ • Anonim/Non-anonim   │    │ • Catatan/Tindakan          │  │
│  │ • Upload Bukti        │    │ • Filter/Pencarian          │  │
│  │                       │    │                             │  │
│  │ OUTPUT                │    │ OUTPUT                      │  │
│  │ • Kode Tiket          │    │ • Dashboard Statistik       │  │
│  │ • Status Laporan      │    │ • Daftar Pengaduan          │  │
│  │ • Timeline            │    │ • Detail Pengaduan          │  │
│  │ • Riwayat             │    │ • Rekomendasi AI            │  │
│  │ • Notifikasi          │    │ • Confidence Score          │  │
│  │                       │    │ • Cluster Laporan           │  │
│  │ MODEL / PROCESS       │    │ • Statistik / Grafik        │  │
│  │ • React Router & RBAC │    │ • Audit Trail               │  │
│  │ • Client State/Cache  │    │                             │  │
│  │ • ECharts             │    │ MODEL / PROCESS             │  │
│  └──────────────────────┘    │ • React Router & RBAC        │  │
│                               │ • Client State / Cache       │  │
│                               │ • ECharts                    │  │
│                               └────────────────────────────┘  │
└────────────────────────────────┬───────────────────────────────┘
                                  │
                                  │ HTTPS / REST API
                                  │ Bearer JWT
                                  ▼
┌──────────────────────────────────────────────────────────────┐
│              BACKEND SERVICES — PYTHON 3                      │
│                                                                │
│  ┌──────────────────┐      ┌──────────────────────────────┐  │
│  │     FastAPI       │      │       MySQL Database          │  │
│  │                   │◄────►│                               │  │
│  │ API & Core Logic  │      │ Users • Pengaduan • Status    │  │
│  └────────┬──────────┘      │ Kategori • AI • Audit Trail   │  │
│           │                 └──────────────────────────────┘  │
│           ▼                                                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                  MODUL AI PIPELINE                      │  │
│  │                                                          │  │
│  │ IndoBERT → Embedding → Cosine Similarity                 │  │
│  │                         ↓                                │  │
│  │                Kategori + Confidence                     │  │
│  │                                                          │  │
│  │ Embedding → HDBSCAN → Cluster / Noise                    │  │
│  └────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬───────────────────────────────┘
                                  │
                                  │ Data / Integration
                                  ▼
┌──────────────────────────────────────────────────────────────┐
│                       EXTERNAL DATA                            │
│                                                                │
│  • Satu Data Indonesia                                         │
│  • Rapor Pendidikan / Kemendikbudristek                        │
│  • SIMFONI PPA (referensi / pengembangan lanjutan)             │
│  • Dataset Domestik / Seed Data                                │
└──────────────────────────────────────────────────────────────┘
```

---

## 1. User Client

User Client menggunakan pola MVC dan memiliki dua jenis pengguna: Siswa dan Admin (Guru BK/Wali Kelas).

### 1.1 Siswa / User

**View — Input**

```
Siswa
├── Login / Registrasi
└── Form Pengaduan
    ├── Kategori Pengaduan
    ├── Deskripsi Kejadian
    ├── Anonim / Non-anonim
    └── Upload Bukti
```

**View — Output**

```
Siswa
├── Kode Tiket
├── Status Laporan
├── Timeline Penanganan
├── Riwayat Laporan
└── Notifikasi / Pembaruan
```

Alur status:

```
Menunggu → Diverifikasi → Ditindaklanjuti → Selesai
```

### 1.2 Admin — Guru BK / Wali Kelas

**View — Input**

```
Admin
├── Login
├── Validasi Pengaduan
├── Konfirmasi / Override Kategori
├── Perubahan Status
├── Catatan Penanganan
└── Filter / Pencarian Laporan
```

**View — Output**

```
Admin
├── Dashboard Statistik
├── Daftar Pengaduan
├── Detail Pengaduan
├── Rekomendasi Kategori AI
├── Confidence Score
├── Cluster / Laporan Serupa
├── Statistik & Grafik
└── Audit Trail
```

### 1.3 Model / Process

```
MODEL / PROCESS
├── React Router & RBAC
├── Client State & Cache
└── ECharts
    └── Dashboard Statistik Admin
```

---

## 2. Backend Services — Python 3

Backend mengikuti struktur general seperti diagram referensi.

```
BACKEND SERVICES
├── FastAPI
├── MySQL Database
└── Modul AI Pipeline
```

### 2.1 FastAPI

```
FastAPI
├── API Routing
├── Authentication / JWT
├── Core Business Logic
├── Pengelolaan Pengaduan
├── Status Laporan
├── Dashboard / Analytics
└── Integrasi AI
```

### 2.2 MySQL Database

```
MySQL Database
├── Users
├── Pengaduan
├── Kategori
├── Status
├── Hasil AI
├── Cluster
└── Audit Trail
```

### 2.3 Modul AI Pipeline

```
Deskripsi Laporan
        ↓
     IndoBERT
        ↓
Vector Embedding
        │
        ├───────────────┐
        ▼               ▼
Cosine Similarity    HDBSCAN
        │               │
        ▼               ▼
Rekomendasi        Cluster / Noise
Kategori
        │
        ▼
Confidence Score
        │
        ▼
Admin Validasi
   ├── Approve
   └── Override
        │
        ▼
  Kategori Final
```

AI berfungsi sebagai pendukung keputusan. Admin tetap menentukan kategori final.

---

## 3. Alur Utama Siswa

```
Siswa
  ↓
React Client
  ↓
Isi Form Pengaduan
  ↓
HTTPS / REST API
  ↓
FastAPI
  ↓
Simpan Laporan → MySQL
  ↓
AI Pipeline
  ↓
Hasil AI → MySQL
  ↓
Generate Ticket
  ↓
React Client
  ↓
Siswa melihat Ticket & Status
```

---

## 4. Alur Utama Admin

```
Admin
  ↓
React Client
  ↓
Login
  ↓
JWT Authentication
  ↓
FastAPI
  ↓
Ambil Laporan → MySQL
  ↓
Tampilkan Analisis AI
  ├── Rekomendasi Kategori
  ├── Confidence Score
  └── Cluster / Noise
  ↓
Admin Validasi
  ├── Approve
  └── Override
  ↓
Update Status
  ↓
MySQL + Audit Trail
  ↓
Dashboard Ter-update
```

---

## 5. Alur Data Pengaduan

```
SISWA
  │
  │ Deskripsi + Kategori + Bukti
  ▼
REACT CLIENT
  │
  │ REST API
  ▼
FASTAPI
  │
  ├──────────────→ MySQL
  │                   └── Data Pengaduan
  │
  └──────────────→ AI PIPELINE
                      ├── IndoBERT
                      ├── Embedding
                      ├── Similarity
                      └── HDBSCAN
                           │
                           ▼
                         MySQL
                           │
                           ▼
                     ADMIN CLIENT
```

---

## 6. External Data

External Data digunakan sebagai data referensi dan konteks analitik.

```
EXTERNAL DATA
├── Satu Data Indonesia
├── Rapor Pendidikan / Kemendikbudristek
├── SIMFONI PPA
└── Dataset Domestik / Seed Data
```

### Seed Data

```
Dataset CSV
    ↓
Python + pandas
    ↓
Cleaning / Mapping
    ↓
Validasi
    ↓
MySQL
    ↓
Dashboard Admin
```

Untuk fase awal, data domestik digunakan sebagai seed data melalui proses manual/*one-time*. Sinkronisasi *live* dengan sistem pemerintah bukan bagian dari kebutuhan awal.

---

## 7. Alur External Data

```
External Data
      ↓
Data / API Publik
      ↓
Backend / Data Processing
      ↓
MySQL
      ↓
Dashboard Admin
```

---

## 8. Ringkasan untuk Diagram Visual

Jika diagram ingin dibuat sesederhana gambar referensi, gunakan isi berikut:

```
USER CLIENT (MVC)
│
├── SISWA
│   ├── INPUT
│   │   ├── Pengaduan
│   │   ├── Deskripsi
│   │   ├── Anonim
│   │   └── Bukti
│   └── OUTPUT
│       ├── Ticket
│       ├── Status
│       └── Riwayat
│
├── ADMIN
│   ├── INPUT
│   │   ├── Validasi
│   │   ├── Kategori
│   │   └── Status
│   └── OUTPUT
│       ├── Dashboard
│       ├── AI Recommendation
│       ├── Cluster
│       └── Statistik
│
└── MODEL / PROCESS
    ├── React Router & RBAC
    ├── Client State & Cache
    └── ECharts

          ↓ HTTPS / REST API + JWT

BACKEND SERVICES (Python 3)
│
├── FastAPI
├── MySQL Database
└── Modul AI Pipeline
    ├── IndoBERT
    ├── Cosine Similarity
    └── HDBSCAN

          ↓

EXTERNAL DATA
├── Satu Data Indonesia
├── Rapor Pendidikan
├── SIMFONI PPA
└── Dataset Domestik / Seed Data
```

---

## 9. Catatan untuk Tahap Visualisasi

- Tiga blok utama (User Client, Backend Services, External Data) dapat langsung dipetakan menjadi *container box* pada diagram visual, mengikuti gaya pengelompokan seperti pada draf arsitektur sebelumnya (lihat `Alur_Arsitektur_SIGAP.md`).
- Modul AI Pipeline pada bagian ini menekankan alur keputusan (IndoBERT → Similarity → Rekomendasi Kategori → Validasi Admin) berdampingan dengan alur klasterisasi (Embedding → HDBSCAN → Cluster/Noise) — keduanya berjalan dari embedding yang sama namun menghasilkan output berbeda dan ditampilkan terpisah ke admin.
- External Data pada versi ini mencantumkan SIMFONI PPA sebagai referensi tambahan di luar Satu Data Indonesia dan Rapor Pendidikan — statusnya tetap sebagai *referensi/pengembangan lanjutan*, bukan sumber *live sync* pada fase awal (selaras dengan PRD).
- Dokumen ini melengkapi (bukan menggantikan) `Alur_Arsitektur_SIGAP.md` — versi tersebut lebih rinci pada penomoran komponen per grup (1–17) dan alur bernomor (1–22) untuk kebutuhan pemetaan ke diagram visual bergaya AWS/Miro, sementara dokumen ini menekankan struktur MVC pada sisi client dan alur data end-to-end secara naratif.
