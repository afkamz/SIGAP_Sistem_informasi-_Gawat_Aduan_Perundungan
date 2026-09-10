# System Architecture --- SIGAP

## 1. Overview

SIGAP menggunakan arsitektur web dengan React sebagai frontend, FastAPI
sebagai backend/orchestrator, MySQL sebagai database, file storage untuk
bukti, serta layer AI untuk IndoBERT dan HDBSCAN.

Arsitektur dibagi menjadi: 1. Frontend 2. Backend Core 3. AI/ML Layer 4.
Data Layer 5. External Integration

## 2. High-Level Architecture

``` text
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  Web Console Siswa (React)     Web Console Admin (React)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / REST API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       BACKEND CORE                          │
│ API Gateway/Reverse Proxy (opsional)                        │
│ FastAPI                                                     │
│ ├── Auth Service (JWT)                                      │
│ ├── Report Service                                          │
│ └── Dashboard/Analytics Service                             │
└───────────────┬──────────────────────────┬──────────────────┘
                │                          │
                ▼                          ▼
┌───────────────────────────┐    ┌────────────────────────────┐
│       AI/ML LAYER         │    │       DATA LAYER            │
│ IndoBERT Embedding        │    │ MySQL                      │
│ Cosine Similarity         │    │ File Storage               │
│ Category Recommendation   │    │ Seed Data Pipeline          │
│ HDBSCAN                   │    │                            │
└─────────────┬─────────────┘    └────────────────────────────┘
              │
              ▼
      AI result returned to
          Admin Console

External/public data:
Background Worker → external public API (future/optional)
```

## 3. Component Specification

### 3.1 Frontend

**Web Console Siswa** - Login/registrasi. - Form pengaduan. - Upload
bukti. - Kode tiket. - Pelacakan status. - Riwayat.

**Web Console Admin** - Login admin. - Dashboard. - Daftar laporan. -
Detail laporan. - Validasi AI. - Klaster laporan. - Audit trail.

**Hosting/CDN** - Opsional. - Provider belum ditentukan.

### 3.2 Backend Core

**FastAPI App Server** - Routing. - Orkestrasi request. - Komunikasi
database. - Integrasi AI.

**Auth Service** - JWT. - Login siswa/admin sesuai kebutuhan akses. -
Refresh token.

**Report Service** - CRUD laporan. - Ticket ID. - State machine. -
Validasi kategori. - Audit trail.

**Dashboard/Analytics Service** - Agregasi data. - Summary. - Trend. -
Distribusi kategori.

### 3.3 AI/ML Layer

**Embedding Service** - Memproses deskripsi Bahasa Indonesia menggunakan
IndoBERT. - Menghasilkan embedding 384/768 dimensi sesuai model yang
dipakai.

**Category Recommendation Engine** - Menghitung cosine similarity
terhadap centroid kategori. - Menghasilkan rekomendasi dan skor.

**HDBSCAN** - Mengelompokkan embedding berdasarkan kepadatan. -
Menghasilkan cluster label dan noise/outlier.

**Embedding Cache/Vector Store** - Opsional. - Fase awal dapat menyimpan
embedding pada MySQL jika sesuai implementasi.

### 3.4 Data Layer

**MySQL** Menyimpan: - User. - Laporan. - Kategori. - Status. -
Embedding/metadata AI. - Cluster result. - Audit trail. - Data
referensi/seed.

**File Storage** - Foto/PDF bukti. - Database menyimpan referensi/path
file.

**Seed Data Pipeline**

``` text
CSV → Cleaning → Mapping → Idempotency Check → MySQL
```

### 3.5 External Integration

Background worker dapat disiapkan untuk mengambil data makro dari API
publik. Namun, berdasarkan PRD, live synchronization pemerintah berada
di luar scope fase awal. Untuk implementasi awal, data domestik
digunakan melalui proses seed CSV one-time.

## 4. Data Flow

### Siswa

``` text
Siswa
 ↓
React Student Console
 ↓
POST /api/pengaduan
 ↓
FastAPI
 ↓
Auth / Anonymous Handling
 ↓
Report Service
 ↓
MySQL
 ↓
IndoBERT
 ↓
Embedding
 ↓
MySQL
 ↓
File Storage (jika ada bukti)
 ↓
Ticket ID
 ↓
Siswa
```

### Admin + AI

``` text
Admin
 ↓
React Admin Console
 ↓
FastAPI
 ↓
MySQL → Detail laporan
 ↓
IndoBERT Embedding
 ├── Cosine Similarity → Recommendation
 └── HDBSCAN → Cluster / Noise
 ↓
Admin Review
 ├── Approve
 └── Override
 ↓
MySQL + Audit Trail
```

## 5. State Machine

``` text
Menunggu
   ↓
Diverifikasi
   ↓
Ditindaklanjuti
   ↓
Selesai
```

Backend harus memvalidasi setiap transisi.

## 6. Security Considerations

-   HTTPS pada deployment.
-   JWT untuk autentikasi.
-   Role-based authorization untuk endpoint admin.
-   Identitas anonim tidak ditampilkan pada dashboard admin.
-   File upload divalidasi tipe dan ukuran.
-   Audit trail menyimpan admin, waktu, dan aksi.
-   Ticket tracking tidak boleh mengekspos informasi identitas sensitif.

## 7. Deployment

### Fase Proyek

-   React frontend.
-   FastAPI backend.
-   MySQL database.
-   Local/S3-equivalent file storage.
-   Python AI processing.

API Gateway/reverse proxy dan CDN dapat ditambahkan saat deployment
production.

## 8. Architecture Principles

-   AI adalah alat bantu keputusan.
-   Database menjadi sumber data utama aplikasi.
-   Status menggunakan state machine.
-   Seed data dan data aktif dibedakan.
-   Komponen opsional tidak dianggap dependency wajib fase awal.
