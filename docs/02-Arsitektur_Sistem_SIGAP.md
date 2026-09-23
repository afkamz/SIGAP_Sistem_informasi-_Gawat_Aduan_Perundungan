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
│  • Dataset CSV Domestik / Seed Data                            │
│  • Dataset Teks untuk AI                                       │
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

### 1.4 Struktur Modular Frontend

Frontend dibangun menggunakan React dan Vite dengan pemisahan antara halaman, komponen tampilan, state aplikasi, data, dan komunikasi API.

```text
Frontend/
├── index.html                    # Entry HTML aplikasi
├── vite.config.js                # Konfigurasi development dan build
├── tailwind.config.js            # Konfigurasi utility styling
└── src/
    ├── main.jsx                  # Entry React dan mounting aplikasi
    ├── App.jsx                   # Router dan daftar route aplikasi
    ├── index.css                 # Style global dan design token
    ├── components/
    │   ├── layout/
    │   │   ├── AdminLayout.jsx   # Layout dashboard admin
    │   │   ├── AdminSidebar.jsx  # Navigasi admin
    │   │   ├── StudentHeader.jsx # Header portal siswa
    │   │   └── StudentFooter.jsx # Footer portal siswa
    │   └── charts/
    │       └── DashboardCharts.jsx # Grafik statistik admin
    ├── pages/
    │   ├── student/              # Halaman dan flow siswa
    │   │   ├── Landing.jsx
    │   │   ├── Register.jsx
    │   │   ├── StudentDashboard.jsx
    │   │   ├── CreateReportWizard.jsx
    │   │   └── TrackReport.jsx
    │   └── admin/                # Halaman dan flow admin
    │       ├── AdminLogin.jsx
    │       ├── AdminDashboard.jsx
    │       ├── ReportList.jsx
    │       ├── ReportDetail.jsx
    │       ├── AuditTrail.jsx
    │       └── AdminSettings.jsx
    ├── context/
    │   └── StoreContext.jsx      # State bersama dan session client
    ├── services/
    │   └── api.js                # HTTP request ke FastAPI
    └── data/
   ├── categories.js         # Data kategori tampilan
   └── mockData.js            # Data simulasi/development
```

### 1.5 Pembagian Tanggung Jawab Modul Frontend

| Modul | Tanggung Jawab |
|---|---|
| `App.jsx` | Menentukan route, fallback halaman, dan pemisahan portal siswa/admin |
| `pages/student/` | Registrasi, pengajuan laporan, upload bukti, dashboard siswa, dan pelacakan tiket |
| `pages/admin/` | Login admin, dashboard, daftar/detail laporan, validasi, audit trail, dan pengaturan |
| `components/layout/` | Menyediakan kerangka navigasi dan tampilan konsisten setiap portal |
| `components/charts/` | Mengubah data analytics menjadi grafik dashboard |
| `context/StoreContext.jsx` | Menyimpan session, user, token, dan state lintas halaman |
| `services/api.js` | Menentukan base URL, mengirim request, Bearer token, parsing response, dan error handling |
| `data/` | Menyimpan kategori atau data simulasi yang tidak berasal dari API |
| `index.css` dan Tailwind | Mengatur style global, responsive layout, warna, typography, dan komponen visual |

### 1.6 Flow Data Frontend Modular

```text
┌─────────────────────────────┐
│ User                        │
│ Siswa atau Admin            │
└──────────────┬──────────────┘
     ▼
┌─────────────────────────────┐
│ Page Component              │
│ Form | Table | Dashboard    │
└──────────────┬──────────────┘
     ▼
┌─────────────────────────────┐
│ Context / Local State       │
│ Session | Token | UI State  │
└──────────────┬──────────────┘
     ▼
┌─────────────────────────────┐
│ Service Layer: services/api │
│ Request | Bearer JWT | Error│
└──────────────┬──────────────┘
     │ HTTPS / REST API
     ▼
┌─────────────────────────────┐
│ FastAPI Backend             │
└──────────────┬──────────────┘
     │ JSON response
     ▼
┌─────────────────────────────┐
│ State Update                 │
│ Loading | Success | Error    │
└──────────────┬──────────────┘
     ▼
┌─────────────────────────────┐
│ Re-render UI                 │
│ Status, ticket, table, chart│
└─────────────────────────────┘
```

### 1.7 Flow Portal Siswa dan Admin

```text
PORTAL SISWA
Landing → Register/Login → Dashboard
      ↓
    Buat Laporan
      ↓
  Kategori + Deskripsi + Anonim
      ↓
      Upload Bukti
      ↓
        Submit ke FastAPI
      ↓
    Kode Tiket + Status
      ↓
    Lacak / Riwayat

PORTAL ADMIN
Admin Login → JWT Session → Dashboard
          ↓
      Daftar Pengaduan
          ↓
       Detail Pengaduan
        ├── Rekomendasi AI
        ├── Cluster / Noise
        └── Bukti Pendukung
          ↓
        Approve / Override Kategori
          ↓
          Ubah Status Berurutan
          ↓
      Audit Trail + Dashboard
```

### 1.8 Aturan State dan Keamanan Frontend

- Token autentikasi tidak dikirim secara manual dari komponen halaman; request terproteksi dilakukan melalui `services/api.js`.
- Halaman admin harus memeriksa session dan role sebelum menampilkan data laporan, dashboard, atau audit trail.
- State request memiliki tiga kondisi utama: `loading`, `success`, dan `error`.
- Form laporan menampilkan validasi field wajib sebelum request dikirim ke backend.
- Setelah login, token dan role dipakai untuk request yang membutuhkan autentikasi; token kedaluwarsa harus mengembalikan user ke halaman login.
- Data anonim tidak boleh menampilkan identitas pelapor pada komponen siswa maupun admin.
- Data dashboard, rekomendasi AI, dan status laporan ditampilkan dari response API, bukan hanya dari mock data.
- URL API untuk development dan production diatur melalui environment variable, bukan hardcode.

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

### 2.4 Struktur Modular Keamanan dan Autentikasi

Backend menggunakan pemisahan modul agar proses autentikasi, otorisasi, logika bisnis, dan akses data tidak tercampur dalam satu endpoint.

```text
backend/sigap-backend/app/
├── main.py                         # Inisialisasi FastAPI, CORS, dan router
├── config.py                       # JWT secret, algoritma, dan konfigurasi aplikasi
├── database.py                     # Engine, session, dan dependency database
├── core/
│   └── security.py                 # Hash password, JWT, token validation, RBAC
├── routers/
│   ├── auth.py                     # Register, login, refresh/profile
│   ├── pengaduan.py                # Pengaduan siswa dan administrasi admin
│   └── dashboard.py                # Endpoint analytics admin
├── schemas/                        # Validasi request dan response Pydantic
├── models/                         # Entitas database dan relasi SQLAlchemy
├── ai/                             # Preprocessing, embedding, klasifikasi, clustering
└── data/                           # ETL dan import external data/seed CSV
```

#### Modul Keamanan

| Modul | Tanggung Jawab | Output |
|---|---|---|
| `config.py` | Membaca secret JWT, algoritma, masa berlaku token, dan konfigurasi database dari environment | Konfigurasi aplikasi |
| `core/security.py` | Hash/verify password, membuat JWT, membaca token Bearer, dan memvalidasi identitas | Token valid atau HTTP 401 |
| `routers/auth.py` | Register dan login admin/siswa | Access token + role |
| Dependency authorization | Memastikan role dan pemilik resource sesuai endpoint | Akses diizinkan atau HTTP 403 |
| `schemas/` | Memvalidasi tipe, format, dan field request/response | Data tervalidasi |
| `AuditTrail` | Mencatat perubahan status, kategori, dan aksi admin | Jejak aktivitas |
| `database.py` | Membuka dan menutup session database untuk setiap request | Session terkontrol |

### 2.5 Flow Autentikasi dan Otorisasi

#### Login Admin atau Siswa

```text
Client React
  │ NIP/NISN + password
  ▼
POST /api/auth/{admin/login atau siswa/login}
  ▼
Auth Router
  ▼
Ambil user berdasarkan NIP/NISN ──────┐
  │                                  │
  ▼                                  │
Verify password dengan bcrypt          │
  │                                  │
  ├── Gagal → HTTP 401               │
  │                                  │
  ▼                                  │
Create JWT {sub: user_id, role, exp}
  ▼
Response access_token + role
  ▼
Client menyimpan token untuk request terproteksi
```

#### Request Terproteksi

```text
Client React
  │ Authorization: Bearer <JWT>
  ▼
FastAPI Router
  ▼
OAuth2PasswordBearer membaca token
  ▼
Decode JWT dengan secret + algoritma yang dikonfigurasi
  ├── Token rusak/kedaluwarsa → HTTP 401
  └── Token valid
      ▼
  Ambil user dari database berdasarkan sub
      ├── User tidak ada/nonaktif → HTTP 401
      ├── Role tidak sesuai → HTTP 403
      └── Role sesuai → lanjut ke service/logic
```

#### Matriks Akses Endpoint

| Area | Publik | Siswa Terautentikasi | Admin Terautentikasi |
|---|:---:|:---:|:---:|
| Register dan login | ✅ | - | - |
| Daftar kategori | ✅ | ✅ | ✅ |
| Membuat laporan anonim | ✅* | ✅ | ✅ |
| Upload bukti laporan | ✅* | Pemilik laporan | Admin sesuai kebutuhan |
| Cek status dengan kode tiket | ✅ | ✅ | ✅ |
| Riwayat laporan siswa | ❌ | Pemilik data saja | ❌/sesuai kebijakan |
| Daftar dan detail seluruh laporan | ❌ | ❌ | ✅ |
| Validasi kategori dan ubah status | ❌ | ❌ | ✅ |
| Dashboard dan audit trail | ❌ | ❌ | ✅ |

`*` Endpoint publik harus tetap membatasi data yang dikembalikan, memvalidasi kode tiket, membatasi ukuran/jenis file, dan mencegah akses ke identitas pelapor.

### 2.6 Flow Data Backend Modular

```text
┌──────────────────┐
│ React Client     │
└────────┬─────────┘
     │ HTTPS + JSON/File + Bearer JWT
     ▼
┌──────────────────────────────────────────┐
│ API Layer — FastAPI Routers              │
│ auth | pengaduan | dashboard              │
└────────┬─────────────────────────────────┘
     ▼
┌──────────────────────────────────────────┐
│ Security Middleware & Dependencies       │
│ CORS | token validation | role | owner   │
└────────┬─────────────────────────────────┘
     ▼
┌──────────────────────────────────────────┐
│ Schema & Business Logic                  │
│ Pydantic validation | state machine      │
│ service pengaduan | audit action         │
└──────┬───────────────────┬───────────────┘
     │                   │
     ▼                   ▼
┌───────────────┐   ┌─────────────────────┐
│ AI Pipeline   │   │ Data Access Layer   │
│ NLP/Embedding │   │ SQLAlchemy Session │
│ Similarity    │   └──────────┬──────────┘
│ HDBSCAN       │              ▼
└──────┬────────┘   ┌─────────────────────┐
     │            │ MySQL / SQLite      │
     └───────────►│ User, Pengaduan,    │
          │ Bukti, AI, Audit    │
          └─────────────────────┘
```

### 2.7 Contoh Flow Submit Pengaduan

```text
1. Siswa mengisi kategori, deskripsi, mode anonim, dan bukti.
2. Client mengirim request ke endpoint pengaduan melalui HTTPS.
3. Router memvalidasi payload dengan schema Pydantic.
4. Service memeriksa kategori dan membuat ticket code unik.
5. Data pengaduan disimpan ke MySQL melalui session database.
6. AI Pipeline memproses deskripsi dan menyimpan rekomendasi/confidence/cluster.
7. File bukti disimpan melalui file storage dengan nama acak dan metadata di database.
8. Response hanya mengembalikan ticket code dan status yang diperlukan.
9. Siswa menggunakan ticket code untuk melihat status tanpa melihat identitas pelapor.
```

### 2.8 Kontrol Keamanan Wajib

- Secret JWT dan kredensial database disimpan di environment variable, bukan di source code.
- Password selalu disimpan sebagai hash bcrypt, tidak pernah sebagai plain text.
- Token memiliki masa berlaku dan ditolak jika signature, `sub`, atau `exp` tidak valid.
- Setiap endpoint admin memakai dependency autentikasi dan pemeriksaan role.
- Endpoint data siswa memeriksa kepemilikan `siswa_id`, bukan hanya menerima ID dari client.
- Upload bukti membatasi ekstensi, MIME type, ukuran file, nama file, dan lokasi penyimpanan.
- CORS production dibatasi hanya ke domain frontend yang sah; `allow_origins=["*"]` hanya untuk development.
- Response publik tidak boleh membocorkan nama, NISN, sekolah, path file, atau detail sensitif pelapor.
- Perubahan status dan kategori admin dicatat ke audit trail dengan waktu, admin, aksi, dan objek perubahan.
- Tambahkan rate limiting, HTTPS, backup database, dan logging terkontrol sebelum deployment production.

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
├── Dataset CSV Domestik / Seed Data
└── Dataset Teks untuk AI
```

External data pada proyek ini dibagi menjadi dua kelompok:

1. **Dataset CSV domestik / seed data** untuk data agregat kasus dan indikator wilayah:
  - PPKS Anak Yang Menjadi Korban Tindak Kekerasan
  - Jumlah Laporan Pengaduan Kasus Kekerasan terhadap Anak
  - Kasus Kekerasan terhadap Anak di Aceh
  - Data Prioritas Nasional 2023 DKP3A Provinsi Kalimantan Timur Tahun 2021–2023
2. **Dataset teks untuk modul AI**:
  - Cyberbullying Bahasa Indonesia dengan slang
  - Cleaned Indonesian Cyberbullying Dataset
  - Indonesian Hate Speech Detection Dataset

Pada fase awal, seluruh dataset yang digunakan diambil dari file lokal pada folder `dataset/`. Sumber pemerintah seperti Satu Data Indonesia, Rapor Pendidikan, dan SIMFONI PPA merupakan asal atau referensi data, bukan koneksi *live* yang berjalan di dalam sistem.

### Alur Seed Data Dashboard

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

  Data domestik digunakan sebagai seed data melalui proses manual/*one-time*. Sinkronisasi *live* dengan sistem pemerintah bukan bagian dari kebutuhan awal.

  ### Alur Dataset AI

  ```
  Dataset Teks CSV
    ↓
  Cleaning / Preprocessing
    ↓
  Embedding / Model AI
    ↓
  Rekomendasi Kategori dan Clustering
    ↓
  Backend SIGAP
  ```

---

## 7. Alur External Data

```
External Data
  ├── Dataset CSV lokal → ETL → MySQL → Dashboard Admin
  ├── Dataset teks lokal → AI Pipeline → Rekomendasi/Clustering
  └── Data/API publik (referensi, bukan live sync fase awal)
      ↓
Backend / Data Processing
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
