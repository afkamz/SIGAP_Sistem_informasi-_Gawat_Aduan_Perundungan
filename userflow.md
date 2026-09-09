# User Flow --- SIGAP

## 1. Overview

SIGAP memiliki dua flow utama: 1. Siswa sebagai pelapor. 2. Admin
sekolah/Guru BK/Dinas sebagai pengelola laporan.

## 2. Student Flow

``` text
Landing/Login
    │
    ├── Login ────────────────┐
    │                         ↓
    └── Registrasi → Login → Dashboard
                              │
                              ↓
                       Buat Laporan Baru
                              │
                              ↓
                    Step 1: Pilih Kategori
                              │
                              ↓
                    Step 2: Isi Deskripsi
                              │
                              ↓
                    Step 3: Pilih Mode
                         │           │
                      Anonim     Non-anonim
                         └─────┬─────┘
                               ↓
                    Step 4: Upload Bukti
                         (opsional)
                               │
                               ↓
                         Kirim Laporan
                               │
                               ↓
                     Generate Ticket ID
                               │
                               ↓
                     Konfirmasi Berhasil
                               │
                 ┌─────────────┴─────────────┐
                 ↓                           ↓
            Lacak Status                Beranda
                 │
                 ↓
             Timeline
                 │
                 ↓
Menunggu → Diverifikasi → Ditindaklanjuti → Selesai
```

## 3. Student Decision Points

### Apakah siswa sudah memiliki akun?

-   Ya → Login.
-   Tidak → Registrasi.

### Apakah laporan anonim?

-   Ya → identitas tidak ditampilkan pada dashboard admin.
-   Tidak → identitas dapat digunakan untuk penanganan personal.

### Apakah ada bukti?

-   Ya → upload foto/PDF.
-   Tidak → lanjut submit.

## 4. Admin Flow

``` text
Login Admin
    ↓
Dashboard Analitik
    ↓
Daftar Laporan
    ↓
Pilih Laporan
    ↓
Detail Laporan
    ↓
Analisis AI
    ├───────────────┐
    ↓               ↓
IndoBERT         HDBSCAN
    ↓               ↓
Rekomendasi      Cluster/Noise
Kategori
    └───────┬───────┘
            ↓
      Review Admin
        │       │
     Setuju   Override
        └───┬───┘
            ↓
     Kategori Final
            ↓
        Verifikasi
            ↓
   Ubah Status Berikutnya
            ↓
       Audit Trail
            ↓
      Dashboard Update
```

## 5. Admin Decision Points

### Confidence AI

-   = threshold → rekomendasi ditampilkan.

-   \< threshold → **Perlu Peninjauan Manual**.

Threshold final masih perlu ditentukan melalui pengujian.

### Ada cluster?

-   Ya → admin dapat melihat laporan terkait.
-   Tidak → lanjut proses normal.

### Apakah kategori AI benar?

-   Ya → Approve.
-   Tidak → Override manual.

## 6. Status Flow

``` text
[Menunggu]
    ↓
[Diverifikasi]
    ↓
[Ditindaklanjuti]
    ↓
[Selesai]
```

Invalid:

``` text
Menunggu ─────X────→ Selesai
```

Backend harus menolak transisi yang tidak valid.

## 7. Escalation Flow

``` text
Laporan
   ↓
Kategori + Tingkat
   ├── Ringan → Guru BK
   │             ↓
   │        Tidak selesai
   │             ↓
   │       Kepala Sekolah
   │
   ├── Sedang → Guru BK + Kepala Sekolah
   │             ↓
   │       Berulang/tidak selesai
   │             ↓
   │       Dinas Pendidikan
   │
   └── Berat → Eskalasi langsung
                 ↓
          Dinas Pendidikan
                 ↓
       Layanan resmi bila perlu
```

## 8. Seed Data Flow

``` text
CSV Domestik
    ↓
Python/pandas
    ↓
Cleaning
    ↓
Mapping
    ↓
Idempotency Check
    ↓
MySQL
    ↓
Dashboard Data Referensi
```

## 9. AI Data Flow

``` text
Deskripsi Laporan
       ↓
    IndoBERT
       ↓
Vector Embedding
       │
       ├──────────────→ Cosine Similarity
       │                         ↓
       │                  Category Suggestion
       │
       └──────────────→ HDBSCAN
                                 ↓
                         Cluster / Noise
                                 ↓
                           Admin Review
                                 ↓
                       Final Decision + Audit
```

## 10. End-to-End Flow

``` text
Siswa
 ↓
Submit Report
 ↓
FastAPI
 ↓
MySQL + File Storage
 ↓
AI Processing
 ↓
Admin Dashboard
 ↓
AI Review + Cluster Review
 ↓
Approve/Override
 ↓
State Transition
 ↓
Audit Trail
 ↓
Dashboard Update
 ↓
Student Tracking
```
