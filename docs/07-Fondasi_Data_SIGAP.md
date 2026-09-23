# Fondasi Data SIGAP

Dokumen ini menjelaskan struktur database dan format dataset yang menjadi fondasi sistem SIGAP. Struktur database mengikuti model SQLAlchemy pada `backend/sigap-backend/app/models/`, sedangkan struktur dataset mengikuti file pada folder `dataset/`.

## 1. Prinsip Fondasi Data

- MySQL digunakan sebagai database utama sistem.
- SQLite dapat digunakan untuk pengembangan lokal atau testing.
- Data laporan operasional disimpan pada tabel inti SIGAP.
- Dataset eksternal CSV diproses melalui ETL sebelum dimasukkan ke tabel `external_benchmark`.
- Dataset teks digunakan oleh pipeline AI dan tidak langsung disamakan dengan tabel laporan operasional.
- Laporan anonim menyimpan `siswa_id = NULL` dan tidak menyimpan identitas pelapor pada data laporan.
- Kategori final dan rekomendasi AI disimpan terpisah agar keputusan admin dapat dibedakan dari saran model.

## 2. Struktur Database Relasional

### 2.1 Domain dan Tabel Data

| Domain | Tabel Data | Fungsi |
|---|---|---|
| Autentikasi dan Pengguna | `admins`, `siswa` | Menyimpan akun admin dan user/siswa serta kebutuhan login. |
| Master Data | `kategori` | Menyimpan tujuh kategori pengaduan resmi. |
| Pengaduan | `pengaduan` | Menyimpan laporan, tiket, status, mode anonim, dan hasil AI. |
| Bukti Pendukung | `bukti_pendukung` | Menyimpan metadata file bukti yang terkait dengan laporan. |
| Audit dan Akuntabilitas | `audit_trail` | Mencatat aksi admin dan perubahan pada laporan. |
| Analytics dan External Data | `external_benchmark` | Menyimpan data agregat eksternal untuk perbandingan dashboard. |

### 2.2 Diagram Relasi

```text
admins ───────────────┐
                      │ admin_id
                      ▼
                audit_trail ◄──── pengaduan ─────► siswa
                      ▲              │  │
                      │              │  └──────► kategori
                      │              │
                      │              └─────────► bukti_pendukung

external_benchmark berdiri sebagai tabel referensi analytics.
```

### 2.3 Tabel `admins`

Menyimpan akun admin, guru BK, wali kelas, atau petugas dinas.

| Kolom | Tipe | Aturan | Keterangan |
|---|---|---|---|
| `id` | Integer | PK, index | Identitas admin |
| `nip` | String(50) | Unique, not null, index | Nomor identitas admin |
| `nama` | String(150) | Not null | Nama admin |
| `jabatan` | String(100) | Nullable | Guru BK, wali kelas, atau dinas |
| `password_hash` | String(255) | Not null | Password hasil hash bcrypt |
| `created_at` | DateTime | Default waktu database | Waktu akun dibuat |

**Sumber data:** seed/admin internal. Registrasi admin tidak dibuka untuk publik.

### 2.4 Tabel `siswa`

Menyimpan akun user/siswa yang dapat melakukan login dan melihat laporan miliknya.

| Kolom | Tipe | Aturan | Keterangan |
|---|---|---|---|
| `id` | Integer | PK, index | Identitas siswa |
| `nisn` | String(20) | Unique, not null, index | Nomor identitas siswa |
| `nama` | String(150) | Not null | Nama siswa |
| `sekolah` | String(150) | Nullable | Asal sekolah |
| `password_hash` | String(255) | Not null | Password hasil hash bcrypt |
| `created_at` | DateTime | Default waktu database | Waktu registrasi |

### 2.5 Tabel `kategori`

Menyimpan tujuh kategori resmi yang digunakan sebagai kategori laporan dan acuan AI.

| Kolom | Tipe | Aturan | Keterangan |
|---|---|---|---|
| `id` | Integer | PK, index | Identitas kategori |
| `nama` | String(100) | Unique, not null | Nama kategori kasus |

**Data awal:** perundungan verbal, perundungan fisik, perundungan siber, kekerasan seksual, hukuman fisik oleh tenaga pendidik, kekerasan psikis/pengucilan sosial, dan penyalahgunaan narkoba/rokok/minuman keras.

### 2.6 Tabel `pengaduan`

Tabel utama operasional. Satu baris mewakili satu laporan pengaduan.

| Kolom | Tipe | Aturan | Keterangan |
|---|---|---|---|
| `id` | Integer | PK, index | Identitas laporan |
| `ticket_code` | String(30) | Unique, not null, index | Kode pelacakan publik |
| `siswa_id` | Integer | FK `siswa.id`, nullable | Null jika laporan anonim |
| `mode_anonim` | Boolean | Not null, default true | Penanda laporan anonim |
| `deskripsi` | Text | Not null | Narasi laporan |
| `kategori_id` | Integer | FK `kategori.id`, not null | Kategori laporan/final |
| `ai_kategori_rekomendasi_id` | Integer | FK `kategori.id`, nullable | Rekomendasi kategori AI |
| `ai_confidence_score` | Float | Nullable, rentang 0.0–1.0 | Skor keyakinan AI |
| `sumber_kategori` | Enum | Not null | `belum_divalidasi`, `ai_disetujui`, `manual_override` |
| `status` | Enum | Not null | `menunggu`, `diverifikasi`, `ditindaklanjuti`, `selesai` |
| `embedding` | JSON | Nullable | Vector embedding sebagai list float |
| `cluster_label` | Integer | Nullable | Label cluster HDBSCAN |
| `is_noise` | Boolean | Nullable | Penanda outlier/noise |
| `created_at` | DateTime | Default waktu database | Waktu laporan dibuat |
| `updated_at` | DateTime | Otomatis diperbarui | Waktu perubahan terakhir |

**Aturan penting:**

- `siswa_id` harus `NULL` jika `mode_anonim = true`.
- Status hanya boleh maju satu tahap sesuai urutan resmi.
- `kategori_id` adalah keputusan yang digunakan sistem, sedangkan `ai_kategori_rekomendasi_id` adalah saran model.
- Identitas pelapor tidak ditampilkan pada endpoint pelacakan publik.

### 2.7 Tabel `bukti_pendukung`

Menyimpan metadata file bukti. File fisik berada di file storage atau folder upload, bukan di dalam kolom database.

| Kolom | Tipe | Aturan | Keterangan |
|---|---|---|---|
| `id` | Integer | PK, index | Identitas bukti |
| `pengaduan_id` | Integer | FK `pengaduan.id`, not null | Laporan pemilik bukti |
| `file_path` | String(255) | Not null | Path/URL file tersimpan |
| `uploaded_at` | DateTime | Default waktu database | Waktu unggah |

### 2.8 Tabel `audit_trail`

Menyimpan jejak perubahan yang dilakukan admin terhadap laporan.

| Kolom | Tipe | Aturan | Keterangan |
|---|---|---|---|
| `id` | Integer | PK, index | Identitas audit |
| `pengaduan_id` | Integer | FK `pengaduan.id`, not null | Laporan yang berubah |
| `admin_id` | Integer | FK `admins.id`, nullable | Admin pelaksana |
| `aksi` | String(150) | Not null | Contoh: `ubah_status`, `validasi_kategori` |
| `keterangan` | Text | Nullable | Detail perubahan |
| `created_at` | DateTime | Default waktu database | Waktu aksi |

### 2.9 Tabel `external_benchmark`

Menyimpan data agregat eksternal yang sudah dinormalisasi untuk perbandingan pada dashboard admin.

| Kolom | Tipe | Aturan | Keterangan |
|---|---|---|---|
| `id` | Integer | PK, index | Identitas record |
| `sumber` | String(100) | Not null, index | Sumber dataset |
| `wilayah` | String(100) | Not null, index | Nasional, provinsi, kabupaten/kota, atau wilayah lain |
| `indikator` | String(255) | Not null | Nama data/metrik |
| `tahun` | Integer | Not null, index | Tahun pencatatan |
| `nilai` | Float | Not null | Nilai numerik indikator |
| `satuan` | String(50) | Not null, default `Kasus` | Kasus, jiwa, indeks, atau satuan lain |
| `keterangan` | String(255) | Nullable | Catatan tambahan |
| `created_at` | DateTime | Default waktu database | Waktu import |

## 3. Status dan Enum Data

### 3.1 Status Laporan

| Nilai database | Label tampilan | Makna |
|---|---|---|
| `menunggu` | Menunggu | Laporan baru diterima |
| `diverifikasi` | Diverifikasi | Laporan sudah diperiksa admin |
| `ditindaklanjuti` | Ditindaklanjuti | Penanganan sedang berjalan |
| `selesai` | Selesai | Penanganan telah ditutup |

Urutan transisi:

```text
menunggu → diverifikasi → ditindaklanjuti → selesai
```

### 3.2 Sumber Kategori

| Nilai database | Makna |
|---|---|
| `belum_divalidasi` | Kategori belum disahkan admin |
| `ai_disetujui` | Admin menyetujui rekomendasi AI |
| `manual_override` | Admin mengganti rekomendasi AI secara manual |

## 4. Struktur Dataset Eksternal

Dataset lokal memiliki delimiter dan format berbeda. ETL wajib melakukan pembacaan delimiter, pembersihan nama kolom, konversi angka, dan normalisasi sebelum import.

### 4.1 Domain dan Format Dataset

| Domain Dataset | Dataset/File | Format | Kolom atau Struktur Utama | Fungsi |
|---|---|---|---|---|
| Data Agregat Eksternal | `jumlah-laporan-pengaduan-kasus-kekerasan-terhadap-anak.csv` | CSV, koma | `Tahun`, jumlah laporan | Seed data jumlah laporan per tahun |
| Data Agregat Eksternal | `ppks-anak-yang-menjadi-korban-tindak-kekersan.csv` | CSV, koma | `Tahun`, jumlah korban | Seed data korban kekerasan per tahun |
| Data Agregat Wilayah | `kasus-kekerasan-terhadap-anak-di-aceh-menurut-kabupaten-kota.csv` | CSV, titik koma | Kode wilayah, nama wilayah, tahun, jumlah kasus, satuan | Perbandingan kasus berdasarkan kabupaten/kota |
| Data Indikator Daerah | `data-prioritas-nasional-2023-dkp3a-prov.-kaltim-tahun-2021-2023.csv` | CSV, titik koma | `No`, `Daftar Data`, `2021`, `2022`, `2023`, `Satuan` | Data indikator prioritas Kaltim |
| Dataset Teks AI | `combined_dataset.csv` | CSV, koma | `Label`, `clean_text`, `String`, `encoded_label` | Data teks cyberbullying untuk preprocessing/model |
| Dataset Teks AI | `datasetmediasosial.csv` | CSV, titik koma | `Label`, `clean_text`, `String`, `new_label` | Data teks media sosial untuk klasifikasi |
| Dataset Teks AI | `data.csv` | CSV, koma | `Tweet`, label HS/Abusive, kategori, intensitas | Data hate speech dan abusive |
| Seed Kategori AI | `seed_narasi_7_kategori.json` | JSON | Kategori dan array narasi | Membentuk referensi/centroid tujuh kategori |

### 4.2 Dataset Agregat untuk Dashboard

#### A. `jumlah-laporan-pengaduan-kasus-kekerasan-terhadap-anak.csv`

| Kolom sumber | Tipe hasil | Pemetaan normalisasi |
|---|---|---|
| `Tahun` | Integer | `tahun` |
| `Jumlah Laporan Pengaduan Kasus Kekerasan terhadap Anak` | Float | `nilai` |
| Nilai tetap | String | `satuan = Laporan` |
| Nama file | String | `sumber` |
| Cakupan umum | String | `wilayah = Nasional/daerah sesuai metadata` |

Format hasil normalisasi:

| sumber | wilayah | indikator | tahun | nilai | satuan | keterangan |
|---|---|---|---:|---:|---|---|
| Jumlah Laporan Pengaduan | Nasional | Jumlah laporan pengaduan kekerasan terhadap anak | 2018 | 29 | Laporan | Seed data |

#### B. `ppks-anak-yang-menjadi-korban-tindak-kekersan.csv`

| Kolom sumber | Tipe hasil | Pemetaan normalisasi |
|---|---|---|
| `Tahun` | Integer | `tahun` |
| `PPKS Anak Yang Menjadi Tindak Kekerasan` | Float | `nilai` |
| Nilai tetap | String | `satuan = Jiwa/korban` sesuai metadata |
| Nama file | String | `sumber` |
| Cakupan umum | String | `wilayah` |

#### C. `kasus-kekerasan-terhadap-anak-di-aceh-menurut-kabupaten-kota.csv`

Delimiter sumber: titik koma (`;`).

| Kolom sumber | Tipe hasil | Pemetaan normalisasi |
|---|---|---|
| `kemendagri_kode_provinsi` | String | Bagian dari metadata wilayah |
| `kemendagri_nama_provinsi` | String | `wilayah` tingkat provinsi |
| `kemendagri_kode_kabupaten_kota` | String | Metadata wilayah |
| `kemendagri_nama_kabupaten_kota` | String | `wilayah` tingkat kabupaten/kota |
| `tahun` | Integer | `tahun` |
| `Kekerasan_ Anak` | Float | `nilai` |
| `satuan` | String | `satuan` |

Contoh format hasil:

| sumber | wilayah | indikator | tahun | nilai | satuan | keterangan |
|---|---|---|---:|---:|---|---|
| Data kekerasan anak Aceh | Kabupaten Aceh Selatan | Kekerasan Anak | 2016 | 4 | Kasus | Kode wilayah disimpan di keterangan bila diperlukan |

#### D. `data-prioritas-nasional-2023-dkp3a-prov.-kaltim-tahun-2021-2023.csv`

Delimiter sumber: titik koma (`;`). Angka desimal menggunakan koma sehingga perlu dikonversi menjadi angka desimal sebelum disimpan.

| Kolom sumber | Tipe hasil | Pemetaan normalisasi |
|---|---|---|
| `No` | Integer | Nomor sumber, opsional disimpan di keterangan |
| `Daftar Data` | String | `indikator` |
| `2021` | Float nullable | `tahun = 2021`, `nilai` |
| `2022` | Float nullable | `tahun = 2022`, `nilai` |
| `2023` | Float nullable | `tahun = 2023`, `nilai` |
| `Satuan` | String | `satuan` |

Dataset wide diubah menjadi format long:

| sumber | wilayah | indikator | tahun | nilai | satuan | keterangan |
|---|---|---|---:|---:|---|---|
| DKP3A Kaltim | Kalimantan Timur | Data Indeks Pemenuhan Hak Anak (IPHA) | 2021 | 59.47 | Indeks | No sumber |

### 4.3 Dataset Teks untuk AI

#### A. `combined_dataset.csv`

Delimiter sumber: koma.

| Kolom sumber | Tipe hasil | Fungsi |
|---|---|---|
| kolom indeks kosong | Integer | Index sumber, tidak menjadi label utama |
| `Label` | String | Label binary, misalnya bullying/non-bullying |
| `clean_text` | Text | Teks yang sudah dibersihkan |
| `String` | Text | Teks asli/narasi sumber |
| `encoded_label` | Integer/Float | Label numerik |

#### B. `datasetmediasosial.csv`

Delimiter sumber: titik koma (`;`).

| Kolom sumber | Tipe hasil | Fungsi |
|---|---|---|
| `Column1` | Integer | Index sumber |
| `Label` | String | Label binary |
| `clean_text` | Text | Teks bersih |
| `String` | Text | Teks asli |
| `new_label` | Integer | Label numerik |

#### C. `data.csv`

Delimiter sumber: koma.

| Kolom sumber | Tipe hasil | Fungsi |
|---|---|---|
| `Tweet` | Text | Teks tweet |
| `HS` | Integer | Penanda hate speech |
| `Abusive` | Integer | Penanda abusive |
| `HS_Individual` | Integer | Hate speech terhadap individu |
| `HS_Group` | Integer | Hate speech terhadap kelompok |
| `HS_Religion` | Integer | Kategori agama |
| `HS_Race` | Integer | Kategori ras |
| `HS_Physical` | Integer | Kategori fisik |
| `HS_Gender` | Integer | Kategori gender |
| `HS_Other` | Integer | Kategori lainnya |
| `HS_Weak` | Integer | Intensitas lemah |
| `HS_Moderate` | Integer | Intensitas sedang |
| `HS_Strong` | Integer | Intensitas kuat |

### 4.4 Dataset Narasi Seed Kategori

File: `seed_narasi_7_kategori.json`.

Format logis yang digunakan:

| Field | Tipe | Keterangan |
|---|---|---|
| `kategori` | String | Nama kategori resmi |
| `narasi` | Array[String] | Contoh narasi untuk membangun centroid |

Dataset ini digunakan sebagai referensi/ground truth awal untuk rekomendasi kategori, bukan sebagai laporan siswa nyata.

## 5. Format Data Hasil ETL

Semua dataset agregat diarahkan ke format canonical berikut sebelum dimasukkan ke `external_benchmark`:

| Field canonical | Tipe | Wajib | Aturan |
|---|---|---:|---|
| `sumber` | String | Ya | Nama file atau sumber data |
| `wilayah` | String | Ya | Wilayah yang dapat dibandingkan |
| `indikator` | String | Ya | Nama metrik |
| `tahun` | Integer | Ya | Tahun valid |
| `nilai` | Float | Ya | Angka dengan desimal titik |
| `satuan` | String | Ya | Kasus, laporan, jiwa, indeks, atau lainnya |
| `keterangan` | String | Tidak | Metadata tambahan |

Aturan validasi ETL:

- Baris kosong dan baris header ganda dihapus.
- Nama kolom dibersihkan dari spasi berlebih dan karakter tidak perlu.
- Delimiter koma dan titik koma dideteksi sesuai file.
- Angka dengan koma desimal dikonversi menjadi angka dengan titik desimal.
- Nilai kosong tetap `NULL` dan tidak dipaksa menjadi nol.
- Import harus idempotent agar menjalankan seed ulang tidak menggandakan data.
- Dataset teks tidak dimasukkan ke `external_benchmark`; dataset tersebut diproses oleh pipeline AI.

## 6. Alur Implementasi Data

```text
File CSV/JSON lokal
        ↓
Profiling dan deteksi delimiter
        ↓
Cleaning, mapping, dan validasi
        ├── Dataset agregat → format canonical → external_benchmark → dashboard
        ├── Dataset teks → preprocessing → embedding/model AI
        └── Seed narasi → centroid kategori → rekomendasi AI

Input laporan siswa
        ↓
Validasi schema API
        ↓
pengaduan + kategori + bukti
        ↓
AI recommendation/cluster
        ↓
MySQL + audit trail
```

## 7. Status Implementasi Fondasi Data

| Komponen | Status | Catatan |
|---|:---:|---|
| Model tabel SQLAlchemy | ✅ | Admin, siswa, kategori, pengaduan, bukti, audit, external benchmark tersedia. |
| Enum status dan sumber kategori | ✅ | State machine dan sumber kategori sudah didefinisikan. |
| Struktur dataset CSV | ✅ | Dataset agregat dan teks sudah diinventarisasi. |
| Normalisasi seluruh dataset ke database | ❌ | Perlu diverifikasi melalui script ETL dan hasil import. |
| Validasi idempotency seed | ❌ | Perlu diuji dengan menjalankan seed lebih dari satu kali. |
| Validasi dataset AI terhadap tujuh kategori | ❌ | Dataset teks belum otomatis memiliki tujuh label resmi. |
| Migrasi dan deployment database production | ❌ | Menunggu konfigurasi lingkungan production. |
