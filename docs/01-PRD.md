# LAPORAN PRD LENGKAP — SIGAP (Sistem Informasi Pengaduan)
**Mata Kuliah Praktek Pemrograman Framework**

**Dosen Pengampu:** Amma Liesvarastranta Haz, S.Tr.T., M.T.

**Disusun Oleh:**
- Ahmad Falihul Hikam (3125521007)
- Arvin Dzaky Nugraha (3125521027)

Program Studi D3 Teknik Informatika PSDKU Lamongan
Departemen Teknik Informatika dan Komputer
Politeknik Elektronika Negeri Surabaya, 2026

> **Catatan versi:** Dokumen ini adalah revisi gabungan tahap lanjutan proyek SIGAP. Menyatukan tiga dokumen kerja sebelumnya menjadi satu PRD utuh:
> 1. Laporan PRD (story, requirement, validasi, data) — versi gabungan dengan mekanisme AI (IndoBERT + HDBSCAN)
> 2. Draf arsitektur sistem bergaya pengelompokan diagram (Frontend / Backend Core / AI-ML Layer / Data Layer / External Integration) dengan alur bernomor
> 3. Alur desain UI/UX layar-demi-layar (siap prompt Stitch.ai) untuk flow Siswa dan Admin
>
> Tujuannya agar dokumen ini menjadi satu acuan tunggal (*single source of truth*) untuk tahap pengembangan berikutnya — baik untuk penulisan laporan akademik maupun sebagai referensi teknis saat implementasi dan desain visual.

---

## Daftar Isi

1. Story E-Governance
2. PRD (Product Requirements Document)
3. User Flow (Ringkas)
4. Scope System (In-Scope & Out-of-Scope)
5. Logika Routing Laporan (Decision Matrix)
6. Mekanisme AI: Rekomendasi Kategori & Deteksi Klaster
7. Tech Stack
8. Standar Antarmuka dan Pengalaman Pengguna (UI/UX)
9. Arsitektur Sistem (Detail Pengelompokan & Alur Bernomor)
10. Desain API (Endpoints)
11. Alur Data & Skenario Simulasi
12. Data Seeding
13. Validation Method
14. Data dan Referensi
15. Timeline Pengerjaan (Gambaran Umum)
16. Lampiran A — Peta Layar & Prompt Desain Detail (Stitch.ai)
17. Ringkasan Perubahan & Catatan untuk Diskusi Lanjutan

---

## 1. Story E-Governance

### 1.1 Latar Belakang

Kekerasan dan perundungan di lingkungan pendidikan Indonesia masih menjadi masalah serius yang belum tertangani secara sistematis. Data Rapor Pendidikan Kemendikbudristek menunjukkan indikator "Iklim Keamanan Sekolah" — yang mengukur bebasnya lingkungan sekolah dari perundungan, hukuman fisik, kekerasan seksual, narkoba, rokok, dan minuman keras — justru mengalami penurunan skor pada jenjang SMP dan SMA dalam beberapa tahun terakhir. Data agregat nasional soal prevalensi kekerasan terhadap anak (tersedia di portal Satu Data Indonesia) menunjukkan bahwa persoalan ini bukan kasus sporadis, melainkan pola yang berulang dari tahun ke tahun.

Persoalan utamanya bukan hanya soal jumlah kasus, tetapi soal bagaimana kasus ditangani. Selama ini pelaporan kekerasan di sekolah kebanyakan masih dilakukan secara lisan/manual ke guru BK, tanpa pencatatan terstruktur, tanpa jejak tindak lanjut yang bisa dipantau, dan rawan tidak ditindaklanjuti karena berbagai alasan (relasi kuasa, rasa malu, takut stigma, dan sebagainya). Semangat *e-governance* dalam layanan publik menuntut adanya sistem yang transparan, terdokumentasi, akuntabel, dan mudah diakses oleh masyarakat — termasuk pelajar sebagai kelompok rentan.

Pemerintah sudah memiliki beberapa sistem pencatatan kekerasan skala nasional, seperti SIMFONI PPA (Kemen PPPA) dan indikator dalam Rapor Pendidikan. Namun sistem-sistem tersebut beroperasi di level makro/agregat kebijakan, bukan sebagai kanal pelaporan langsung yang bisa diakses individual oleh pelajar di tingkat sekolah. Celah inilah yang coba diisi oleh SIGAP — menjadi kanal pelaporan di level mikro (sekolah/siswa), sekaligus tetap terhubung secara konteks dengan data makro yang sudah ada, sehingga penanganan kasus tidak berdiri sendiri tanpa acuan.

### 1.2 Rumusan Masalah

1. Bagaimana pelajar dapat melaporkan kasus perundungan/kekerasan secara aman tanpa takut identitasnya terekspos?
2. Bagaimana memastikan laporan yang masuk tidak hilang atau terabaikan, melainkan dapat dipantau statusnya secara transparan sampai tuntas?
3. Bagaimana pihak sekolah dan dinas pendidikan dapat memperoleh data terstruktur untuk mendukung pengambilan kebijakan pencegahan kekerasan di satuan pendidikan?
4. Bagaimana sistem dapat dibangun dengan basis data awal yang realistis (bukan kosong/dummy tanpa dasar), agar dashboard dan proses verifikasi dapat diuji dengan skenario yang mendekati kondisi nyata?
5. Bagaimana admin dapat memvalidasi kategori laporan secara cepat dan konsisten, mengingat volume laporan berpotensi tinggi dan keterbatasan waktu guru BK/dinas untuk membaca setiap laporan secara mendalam satu per satu?

### 1.3 Tujuan

**Tujuan Umum:**
Membangun sistem informasi pengaduan tindak perundungan dan kekerasan pelajar yang aman, transparan, dan terintegrasi dengan data domestik sebagai dasar analitik.

**Tujuan Khusus:**
- Mempermudah proses pelaporan kasus oleh pelajar (dengan opsi anonim)
- Mempercepat proses verifikasi dan tindak lanjut oleh admin sekolah/dinas
- Menyediakan dashboard data yang informatif sejak awal implementasi (melalui seed data domestik)
- Menyediakan mekanisme eskalasi berjenjang sesuai tingkat keparahan kasus
- Membantu admin memvalidasi kategori laporan menggunakan analisis teks berbahasa Indonesia berbasis AI (IndoBERT), sehingga proses triase laporan tidak sepenuhnya bergantung pada pembacaan manual
- Mendeteksi laporan yang kemungkinan membahas kejadian yang sama (klasterisasi HDBSCAN) agar admin dapat menangani insiden secara terpadu dan mendeteksi potensi laporan tidak wajar/spam

### 1.4 Catatan Cakupan Proyek

Sesuai kesepakatan tahap praktikum, SIGAP dikembangkan dengan cakupan **satu sekolah (single-tenant)**. Dukungan multi-sekolah dicatat sebagai pengembangan lanjutan (lihat Bagian 4 — Out-of-Scope).

---

## 2. PRD (Product Requirements Document)

### 2.1 Aktor / Pengguna Sistem

| Aktor | Peran |
|---|---|
| Siswa (Pelapor) | Mengajukan laporan kasus, memilih mode anonim/non-anonim, mengunggah bukti pendukung, memantau status laporan menggunakan kode tiket |
| Admin (Sekolah/Guru BK / Dinas Pendidikan) | Login ke sistem, melihat seluruh laporan masuk (termasuk data seed), memvalidasi kategori laporan (dibantu rekomendasi AI), memverifikasi dan mengubah status laporan, memantau dashboard |

### 2.2 User Story & Acceptance Criteria

**US-01 — Siswa**
Sebagai siswa, saya ingin melaporkan kasus perundungan secara anonim, agar saya merasa aman tanpa takut dikenali pelaku atau pihak lain.
- AC: Sistem menyediakan toggle "Lapor sebagai Anonim"
- AC: Jika anonim dipilih, data identitas pelapor tidak disimpan/ditampilkan ke admin
- AC: Laporan tetap mendapatkan kode tiket unik untuk pelacakan status

**US-02 — Siswa**
Sebagai siswa, saya ingin melacak status laporan saya menggunakan kode tiket, agar saya tahu perkembangan penanganannya.
- AC: Kode tiket dapat dimasukkan di halaman pelacakan tanpa perlu login
- AC: Status yang ditampilkan: Menunggu → Diverifikasi → Ditindaklanjuti → Selesai

**US-03 — Admin**
Sebagai admin, saya ingin melihat dashboard yang sudah terisi data awal (bukan kosong), agar saya bisa langsung memahami pola kasus sebelum ada laporan baru masuk.
- AC: Dashboard menampilkan visualisasi data seed (grafik tren, kategori kasus, distribusi wilayah/jenjang)
- AC: Data seed ditandai berbeda secara visual dari data laporan aktif (misal label "Data Referensi")

**US-04 — Admin**
Sebagai admin, saya ingin memverifikasi laporan yang masuk dan mengubah statusnya, agar proses tindak lanjut tercatat dan transparan.
- AC: Admin dapat mengubah status laporan sesuai alur (tidak bisa lompat status sembarangan)
- AC: Setiap perubahan status tercatat dengan waktu dan admin yang melakukan (audit trail)

**US-05 — Admin**
Sebagai admin, saya ingin sistem menyarankan kategori laporan secara otomatis berdasarkan analisis teks berbahasa Indonesia, agar saya bisa memvalidasi laporan dengan cepat tanpa harus membaca ulang setiap detail secara manual.
- AC: Sistem menampilkan kategori sugesti (top-1 atau top-2) beserta skor keyakinan (%) di samping setiap laporan
- AC: Admin dapat menyetujui sugesti dengan satu klik, atau melakukan override manual bila tidak sesuai
- AC: Jika skor keyakinan berada di bawah ambang batas tertentu (misal <60%), sistem menandai laporan sebagai "Perlu Peninjauan Manual" alih-alih memaksakan sugesti
- AC: Sistem mencatat apakah kategori final berasal dari sugesti AI (disetujui) atau override manual admin, sebagai bagian dari audit trail

**US-06 — Admin**
Sebagai admin, saya ingin melihat peringatan jika ada beberapa laporan yang terindikasi membahas kejadian yang sama, agar saya bisa menangani insiden secara terpadu, bukan sebagai kasus terpisah-pisah, dan lebih waspada terhadap kemungkinan laporan spam/tidak wajar.
- AC: Laporan dengan kemiripan embedding tinggi (satu klaster HDBSCAN) diberi label "Kemungkinan Kejadian Sama"
- AC: Laporan yang terdeteksi sebagai *noise*/outlier ekstrem ditandai untuk peninjauan tambahan (potensi laporan tidak wajar)
- AC: Admin dapat membuka daftar laporan lain dalam klaster yang sama dari satu klik pada laporan manapun di klaster tersebut

### 2.3 Deskripsi Produk

SIGAP adalah platform pengaduan digital yang dirancang khusus untuk lingkungan pendidikan, memungkinkan pelajar melaporkan kasus perundungan dan kekerasan secara aman dan terlacak. Sistem tidak hanya berfungsi sebagai alat pelaporan pasif, tetapi juga dibekali data awal (*seed data*) dari sumber data terbuka domestik, sehingga admin memiliki konteks data sejak hari pertama sistem digunakan. Selain itu, sistem dilengkapi lapisan AI berbasis IndoBERT dan HDBSCAN yang membantu admin melakukan triase dan validasi laporan secara lebih cepat dan konsisten.

### 2.4 Kategori Pengaduan

Diselaraskan dengan definisi resmi indikator "Iklim Keamanan Sekolah" (Kemendikbudristek):

1. Perundungan verbal (ejekan, hinaan, ancaman lisan)
2. Perundungan fisik (pukul, dorong, kekerasan fisik lain)
3. Perundungan siber (*cyberbullying*)
4. Kekerasan seksual
5. Hukuman fisik oleh tenaga pendidik
6. Kekerasan psikis / pengucilan sosial
7. Penyalahgunaan narkoba/rokok/minuman keras di lingkungan sekolah (kategori pendukung, sesuai definisi Rapor Pendidikan)

### 2.5 Kategori Fitur (Fase Awal)

Fitur berikut merupakan baseline pengembangan. Belum diprioritaskan menggunakan MoSCoW karena masih tahap rencana awal — cakupan fitur akan dikembangkan secara bertahap di iterasi berikutnya.

**Pelaporan Kasus (Siswa)**
- Submit laporan (kategori, deskripsi)
- Pilih mode anonim / non-anonim
- Unggah bukti pendukung

**Pelacakan Status (Siswa)**
- Dapatkan kode tiket unik saat submit
- Cek status tanpa perlu login

**Autentikasi (Admin)**
- Login admin (JWT)

**Manajemen & Validasi Laporan (Admin)**
- Lihat daftar seluruh laporan masuk (termasuk data seed)
- Lihat rekomendasi kategori dari AI (IndoBERT similarity) beserta skor keyakinan
- Setujui atau override kategori laporan
- Lihat penanda klaster/kejadian serupa dari HDBSCAN
- Ubah status laporan sesuai alur (*state machine* tervalidasi)
- Audit trail perubahan status dan validasi kategori

**Dashboard**
- Ringkasan total kasus
- Breakdown per kategori dan per status
- Gabungan data seed + data laporan aktif

**Data Seeding**
- Import data awal dari file CSV domestik (proses *one-time*)
- Idempotent — tidak duplikat jika dijalankan ulang

---

## 3. User Flow (Ringkas)

> Untuk detail layar-demi-layar beserta prompt desain visual, lihat **Lampiran A**.

### 3.1 Flow Siswa (Pelapor)

```
Buka form pengaduan
        ↓
Pilih kategori & deskripsi
        ↓
Pilih mode anonim / non-anonim
        ↓
Unggah bukti (opsional)
        ↓
Submit laporan → terima kode tiket unik
        ↓
Lacak status laporan pakai kode tiket
```

### 3.2 Flow Admin (menyertakan validasi AI)

```
Login admin (autentikasi via JWT)
        ↓
Lihat dashboard awal (data seed sudah terisi)
        ↓
Lihat daftar laporan (termasuk data seed sebagai referensi)
        ↓
Buka detail laporan aktif
        ↓
Lihat rekomendasi kategori AI (IndoBERT) + skor keyakinan
Lihat penanda klaster/kejadian serupa (HDBSCAN)
        ↓
Setujui kategori AI ATAU override manual
        ↓
Verifikasi & ubah status (alur tidak bisa dilompati)
        ↓
Dashboard ter-update (gabungan data seed + aktif)
```

---

## 4. Scope System (In-Scope & Out-of-Scope)

**In-Scope:**
- Pelaporan kasus oleh siswa (anonim/non-anonim)
- Rekomendasi kategori laporan berbasis AI (IndoBERT) untuk mempercepat validasi admin
- Deteksi laporan serupa/klaster kejadian menggunakan HDBSCAN
- Verifikasi dan tindak lanjut oleh admin sekolah
- Dashboard statistik dan visualisasi data
- Seeding data awal dari file CSV data domestik (proses manual/*one-time*, bukan *live sync*)
- Skenario simulasi *entry* (user) dan verifikasi (admin) untuk keperluan pengujian sistem
- Cakupan satu sekolah (*single-tenant*)

**Out-of-Scope:**
- Dukungan multi-sekolah (*multi-tenant*) — dicatat sebagai pengembangan lanjutan, menunggu evaluasi dosen
- Sinkronisasi otomatis/*live* dengan sistem pemerintah (SIMFONI PPA, Rapor Pendidikan, dsb) — dicatat sebagai potensi pengembangan lanjutan
- Proses hukum/penindakan pidana (sistem hanya sampai tahap eskalasi & pencatatan, bukan mengganti proses hukum resmi)
- Integrasi pembayaran atau modul non-terkait pengaduan
- Pelatihan ulang (*retraining*) model IndoBERT dari nol — sistem menggunakan model pre-trained yang sudah tersedia publik, disesuaikan lewat pendekatan *similarity*/*fine-tuning* ringan bila diperlukan
- Notifikasi email/WA otomatis ke admin (fase awal)

---

## 5. Logika Routing Laporan (Decision Matrix)

| Kategori Kasus | Tingkat | Penanganan Awal | Eskalasi |
|---|---|---|---|
| Perundungan verbal/pengucilan | Ringan | Guru BK sekolah | Jika tidak selesai dalam SLA → Kepala Sekolah |
| Perundungan fisik/siber | Sedang | Guru BK + Kepala Sekolah | Jika berulang/tidak selesai → Dinas Pendidikan |
| Kekerasan seksual | Berat | Wajib eskalasi langsung | Dinas Pendidikan + rujukan ke layanan resmi (mis. SAPA129) |
| Kekerasan oleh tenaga pendidik | Berat | Wajib eskalasi langsung | Dinas Pendidikan (melibatkan relasi kuasa, tidak bisa ditangani internal sekolah saja) |

---

## 6. Mekanisme AI: Rekomendasi Kategori & Deteksi Klaster

### 6.1 Prinsip Desain

AI di sini berperan sebagai **alat bantu triase (*decision support*), bukan pengambil keputusan otomatis**. Kategori final laporan tetap ditentukan/divalidasi oleh admin manusia (guru BK/dinas), karena implikasinya menyangkut penanganan kasus sensitif terhadap anak.

### 6.2 Tahap 1 — Rekomendasi Kategori (IndoBERT + Similarity)

1. **Ekstraksi embedding:** Teks deskripsi insiden dari siswa diproses IndoBERT menjadi *vector embedding* (384 atau 768 dimensi), menangkap konteks, variasi bahasa, dan *slang* Bahasa Indonesia.
2. **Representasi kategori:** Untuk masing-masing dari 7 kategori pengaduan, dibangun *embedding* representatif (centroid) dari kumpulan contoh kalimat/deskripsi khas kategori tersebut — bersumber dari data seed yang sudah dikategorikan serta anotasi awal tim.
3. **Perhitungan kemiripan:** Sistem menghitung *cosine similarity* antara embedding laporan baru dengan centroid tiap kategori.
4. **Output ke admin:** Kategori dengan skor similarity tertinggi (top-1, bisa juga tampilkan top-2) ditampilkan sebagai "Rekomendasi Kategori" beserta skor keyakinan dalam persen.
5. **Ambang batas keyakinan:** Jika skor tertinggi di bawah threshold (misal 60%), sistem tidak memaksakan sugesti — laporan ditandai "Perlu Peninjauan Manual" agar admin membaca detail secara penuh.

### 6.3 Tahap 2 — Deteksi Klaster & Anomali (HDBSCAN)

1. Seluruh embedding laporan (dalam periode tertentu atau per kategori) dikelompokkan menggunakan HDBSCAN — algoritma klasterisasi berbasis densitas yang tidak memerlukan jumlah klaster ditentukan di awal.
2. Laporan-laporan dengan embedding yang berdekatan secara densitas ditandai sebagai kemungkinan **kejadian yang sama atau berulang** — membantu admin melihat pola insiden massal (misal beberapa siswa melaporkan pelaku yang sama).
3. Laporan yang menjadi *noise* (tidak masuk klaster manapun / outlier ekstrem) ditandai untuk **perhatian ekstra** — bisa jadi kasus yang benar-benar unik, atau berpotensi laporan tidak wajar/spam yang perlu diverifikasi lebih ketat.
4. HDBSCAN **tidak digunakan untuk menentukan kategori** laporan (itu tugas Tahap 1) — perannya murni mengelompokkan pola kejadian untuk kebutuhan penanganan terpadu dan deteksi anomali.

### 6.4 Tampilan di Dashboard Admin

| Kolom | Isi |
|---|---|
| Rekomendasi Kategori | Nama kategori + skor keyakinan (%), atau label "Perlu Peninjauan Manual" |
| Status Validasi | "Disetujui (AI)" / "Diubah Manual" / "Belum Divalidasi" |
| Penanda Klaster | Ikon/label "Kemungkinan Kejadian Sama" (dengan tautan ke laporan terkait) atau "Outlier — Perlu Perhatian" |

### 6.5 Alur Data Model AI

```
Deskripsi teks (Bahasa Indonesia) dari siswa
        ↓
IndoBERT → vector embedding (384/768 dim)
        ↓
   ┌────────────────────┬─────────────────────┐
   ↓                                          ↓
Cosine similarity                    HDBSCAN clustering
ke centroid kategori                 (semua/embedding per periode)
   ↓                                          ↓
Rekomendasi kategori                  Label klaster / noise
+ skor keyakinan                      (kejadian sama / outlier)
   ↓                                          ↓
        Ditampilkan bersama di panel Admin
                ↓
   Admin menyetujui / override kategori
   Admin meninjau laporan terkait dalam klaster
                ↓
        Tercatat dalam audit trail
```

---

## 7. Tech Stack

| Komponen | Teknologi |
|---|---|
| Frontend | React (dengan kemungkinan tambahan Vite untuk *build tooling*) |
| Backend | Python — FastAPI (sebagai *orchestrator* utama: *routing*, autentikasi JWT, komunikasi database) |
| Database | MySQL (menyimpan kredensial pengguna, histori laporan, hasil klasterisasi AI) |
| ORM | SQLAlchemy (usulan, perlu dikonfirmasi tim) |
| Autentikasi | JWT (JSON Web Token) |
| Data Processing (seeding) | Python + pandas untuk membaca dan membersihkan file CSV sebelum *import* ke MySQL |
| AI — Pemahaman Teks | IndoBERT (*vector embeddings* 384/768 dimensi) |
| AI — Klasterisasi | HDBSCAN (klasterisasi densitas + deteksi anomali/*noise*) |
| Integrasi Eksternal | *Background worker* FastAPI menarik data makro dari API publik (Satu Data Indonesia, Kemendikbudristek) secara berkala untuk memperkaya dashboard analitik admin |

---

## 8. Standar Antarmuka dan Pengalaman Pengguna (UI/UX)

- **Tipografi dan Tata Bahasa:** Seluruh elemen teks pada sistem — label tombol, instruksi pengisian, notifikasi galat, hingga dokumentasi internal — wajib disusun menggunakan kalimat baku yang merujuk pada Pedoman Umum Ejaan Bahasa Indonesia (PUEBI/KBBI).
- **Palet Warna:** Antarmuka menggunakan desain minimalis dengan latar belakang putih solid (#FFFFFF). Tidak diperkenankan menggunakan efek gradasi pada elemen visual apa pun.
- **Aksen Visual:** Warna *Baby Blue* (#A7D8F0 atau serupa) diterapkan secara eksklusif sebagai aksen utama untuk elemen interaktif (tombol aksi utama, tautan aktif, indikator tab, *border focus* pada kotak isian) guna menjaga desain tetap bersih, rata (*flat*), dan terstruktur.
- **Bentuk & Ikon:** Sudut membulat lembut (8–12px), bayangan (*shadow*) tipis saja, tanpa gradasi, tanpa neumorphism. Ikon garis sederhana, satu warna (abu-abu gelap atau baby blue untuk status aktif).
- **Platform:** Web app *mobile-first* & responsif untuk sisi Siswa, dashboard *desktop-first* untuk sisi Admin.
- **Aksesibilitas:** Kontras teks di atas baby blue wajib memenuhi standar WCAG AA — gunakan teks gelap di atas baby blue (bukan putih), karena baby blue adalah warna pastel terang.
- **Diferensiasi visual AI vs data final:** Label rekomendasi AI (kategori & skor keyakinan) ditampilkan dengan gaya visual yang jelas berbeda dari data yang sudah divalidasi admin — menggunakan badge *outline* (bukan solid) sampai admin menyetujuinya, agar admin tidak salah mengira sugesti AI sebagai keputusan final. Setelah disetujui, badge berubah menjadi *solid*.
- **Konsistensi status badge:** Warna status yang sama dipakai persis sama di seluruh layar (siswa & admin) — misal "Diverifikasi" selalu baby blue solid di kedua sisi aplikasi.

> Detail lengkap standar ini diterjemahkan menjadi *design system* siap pakai untuk Stitch.ai pada **Lampiran A, Bagian 0**.

---

## 9. Arsitektur Sistem (Detail Pengelompokan & Alur Bernomor)

Arsitektur disusun mengikuti gaya pengelompokan & penomoran seperti referensi diagram "Distributed Load Testing on AWS" (Miro/AWS Architecture Icons) — per grup: Frontend / Backend Core / AI-ML Layer / Data Layer / External Integration, dengan alur bernomor untuk memudahkan pemetaan ke diagram visual pada tahap berikutnya.

### 9.1 Pengelompokan Area

- **Frontend** — antarmuka Siswa & Admin
- **Backend Core** — API, auth, business logic
- **AI/ML Layer** — pemrosesan IndoBERT & HDBSCAN
- **Data Layer** — database & storage
- **External Integration** — API publik pemerintah, notifikasi

### 9.2 Komponen per Grup

**Frontend**
1. Web Console Siswa (React) — form pengaduan, lacak status
2. Web Console Admin (React) — dashboard, validasi laporan
3. Hosting/CDN Frontend *(opsional, belum ditentukan — mis. Vercel/Netlify/CloudFront/Amplify, sesuaikan infrastruktur kampus/proyek)*

**Backend Core**
4. API Gateway / Reverse Proxy *(opsional, jika deploy production)*
5. FastAPI App Server — routing, orkestrasi request
6. Auth Service (JWT) — login siswa (NISN) & admin (NIP), refresh token
7. Report Service — CRUD laporan, generate kode tiket, *state machine* status
8. Dashboard/Analytics Service — agregasi data seed + aktif untuk grafik

**AI/ML Layer**
9. Embedding Service (IndoBERT) — ubah teks deskripsi jadi *vector embedding*
10. Category Recommendation Engine — *cosine similarity* ke centroid kategori
11. Clustering Service (HDBSCAN) — deteksi klaster kejadian serupa & *noise*/anomali
12. Model/Embedding Cache atau Vector Store *(opsional — mis. simpan embedding di kolom MySQL JSON/BLOB, atau vector DB ringan jika scope berkembang)*

**Data Layer**
13. MySQL Database — user, laporan, hasil klasterisasi, audit trail
14. File Storage — bukti pendukung (foto/PDF) — bisa *local storage*/S3-equivalent
15. Seed Data Pipeline (Python + pandas) — *cleaning* CSV → *import* ke MySQL (*one-time*, *idempotent*)

**External Integration**
16. Background Worker (*scheduled job* di FastAPI) — tarik data makro dari API Satu Data Indonesia / Kemendikbudristek secara berkala
17. *(Opsional, out-of-scope fase awal)* Notifikasi — email/WA ke admin saat laporan berat masuk

> Nomor 1–17 pada bagian ini mewakili elemen/ikon yang akan muncul pada diagram visual arsitektur.

### 9.3 Narasi Arsitektur (Ringkas)

- **Frontend:** React untuk merender komponen UI secara dinamis dan menangani *state management*.
- **Backend:** FastAPI (Python) sebagai *orchestrator* utama yang menangani *routing*, autentikasi berbasis JWT, dan komunikasi database.
- **Database:** MySQL untuk menyimpan data kredensial pengguna, histori laporan, serta hasil klasterisasi kecerdasan buatan.
- **Integrasi AI:** IndoBERT memproses teks deskripsi menjadi *vector embeddings* (384/768 dimensi); HDBSCAN melakukan klasterisasi densitas untuk mengelompokkan laporan berpola serupa dan mendeteksi anomali (*noise*) guna mencegah laporan palsu/*spam*.
- **Integrasi API Eksternal:** *Background worker* pada FastAPI secara berkala menarik data makro dari portal Satu Data Indonesia atau Kemendikbudristek untuk memperkaya dasbor analitik admin.

### 9.4 Rincian Dasbor Siswa

**A. Modul Autentikasi dan Registrasi**
- **Kewajiban Registrasi:** Pengguna diwajibkan membuat akun menggunakan parameter identitas sekolah yang valid (NISN) sebelum dapat mengakses formulir pengaduan.
- **Masuk (*Login*):** Pengguna memasukkan kredensial (NISN dan kata sandi) untuk mengakses dasbor personal.

**B. Modul Pengajuan Laporan**
- **Kategori Pengaduan:** Menu tarik-turun untuk memilih jenis insiden, diselaraskan dengan indikator Iklim Keamanan Sekolah.
- **Deskripsi Insiden:** Kotak isian teks luas tempat siswa menguraikan kronologi — teks ini secara langsung menjadi input untuk ekstraksi *embedding* IndoBERT.
- **Mode Visibilitas:** Sakelar (*toggle switch*) yang mewajibkan pengguna memilih antara mode **Anonim** atau **Non-anonim**. Mode anonim memblokir tampilan identitas pelapor di seluruh dasbor admin, namun tetap menautkan laporan ke ID terenkripsi pada database.
- **Unggah Bukti:** Modul untuk melampirkan berkas pendukung (foto atau dokumen PDF).
- **Penerbitan Tiket:** Sistem menghasilkan kode tiket pelacakan unik segera setelah laporan divalidasi dan dikirim ke peladen.

**C. Modul Pelacakan dan Riwayat**
- **Tabel Riwayat Laporan:** Menampilkan daftar seluruh pengaduan yang pernah dikirimkan beserta kode tiket uniknya.
- **Linimasa Status:** Indikator visual perkembangan penanganan kasus: Menunggu → Diverifikasi → Ditindaklanjuti → Selesai.

### 9.5 Rincian Dasbor Admin

**A. Modul Autentikasi Admin**
- **Akses Terbatas:** Admin masuk menggunakan Nomor Induk Pegawai (NIP) dan kata sandi melalui sistem autentikasi JWT.

**B. Modul Dasbor Analitik Utama**
- **Pembandingan Data Terintegrasi:** Dasbor menyajikan visualisasi gabungan antara data internal (laporan aktif dari siswa) dan data dari API eksternal (tren regional/nasional).
- **Metrik Visual:** Grafik tren kasus dan distribusi kategori ditampilkan secara *flat* (tanpa gradasi).

**C. Modul Manajemen dan Validasi AI**
- **Daftar Laporan Masuk:** Tabel komprehensif menampilkan seluruh tiket pengaduan aktif.
- **Analitik Teks Berbasis AI:** Rekomendasi Kategori (IndoBERT) dan Deteksi Klaster (HDBSCAN) — lihat Bagian 6.
- **Panel Detail dan Verifikasi:** Admin mengeklik baris laporan untuk meninjau bukti lampiran, deskripsi kejadian, rekomendasi kategori AI, dan laporan terkait dalam klaster yang sama.
- **Alur Tindak Lanjut (*State Machine*):** Admin mengonfirmasi usulan kategori AI dan mengubah status laporan ke tahap berikutnya; sistem mengunci alur agar status tidak dapat diubah secara acak atau dilompati.
- **Jejak Audit (*Audit Trail*):** Setiap aktivitas perubahan status, konfirmasi/override kategori AI, atau peninjauan dokumen dicatat dengan *timestamp* dan identitas admin yang bertugas.

### 9.6 Alur Bernomor (Flow Sequence)

**Alur Siswa (Pelaporan)**
1. Siswa buka Web Console Siswa → isi form (kategori, deskripsi, mode anonim, bukti)
2. Frontend kirim request ke FastAPI App Server (`POST /api/pengaduan`)
3. Auth Service verifikasi token siswa (jika login) atau proses anonim
4. Report Service simpan data laporan awal ke MySQL (status: Menunggu)
5. Teks deskripsi dikirim ke Embedding Service (IndoBERT) → hasilkan *vector embedding*
6. Embedding disimpan terkait laporan di MySQL
7. Bukti pendukung diunggah ke File Storage, referensi path disimpan di MySQL
8. Report Service generate kode tiket unik → dikembalikan ke Frontend
9. Siswa terima kode tiket, bisa lacak status kapan pun (`GET /api/pengaduan/{ticket_id}/status`)

**Alur Admin (Validasi & AI)**
10. Admin login via Web Console Admin → Auth Service verifikasi (JWT, NIP)
11. Admin buka Daftar Laporan → Report Service ambil data dari MySQL
12. Saat admin buka detail laporan, Category Recommendation Engine hitung *similarity* embedding laporan vs centroid kategori → kirim skor + rekomendasi ke Frontend
13. Clustering Service (HDBSCAN) jalan (batch berkala atau *on-demand*) → tandai laporan yang satu klaster / *noise*
14. Admin setuju/override kategori → Report Service *update* MySQL + catat Audit Trail
15. Admin ubah status laporan (*state machine* tervalidasi) → Report Service *update* MySQL + Audit Trail

**Alur Dashboard & Data Eksternal**
16. Background Worker jalan berkala → tarik data dari API Satu Data Indonesia/Kemendikbudristek
17. Data eksternal disimpan/diperbarui di MySQL sebagai referensi
18. Dashboard/Analytics Service gabungkan data seed + data aktif + data eksternal → sajikan ke Admin Web Console via `GET /api/dashboard/*`

**Alur Seeding (One-time, Setup Awal)**
19. Seed Data Pipeline baca CSV domestik
20. *Cleaning* & *mapping* kolom (Python/pandas)
21. *Import* ke MySQL (*idempotent check* — cegah duplikat)
22. Data seed langsung tampil di Dashboard Admin sejak hari pertama

> Nomor 1–22 mewakili urutan panah/proses pada diagram — bisa disederhanakan saat digambar (gabungkan langkah yang searah dalam satu panah bila diagram terlalu padat).

### 9.7 Catatan untuk Tahap Visualisasi

- Struktur pengelompokan (9.1) dapat langsung dipetakan menjadi *container box* bergaya diagram referensi (kotak besar berlabel, dengan sub-kotak komponen di dalamnya, panah bernomor menghubungkan antar grup).
- Beberapa komponen masih bertanda *(opsional)* / *(belum ditentukan)* — perlu dikonfirmasi tim sebelum difinalisasi ke diagram visual (lihat juga Bagian 17 — Catatan Diskusi Lanjutan).

---

## 10. Desain API (Endpoints)

**Modul Pengaduan**
- `POST /api/pengaduan` → submit laporan baru
- `GET /api/pengaduan/{ticket_id}/status` → cek status laporan (publik, pakai kode tiket)
- `GET /api/pengaduan` → daftar laporan (admin only, dengan filter)
- `PATCH /api/pengaduan/{id}/verifikasi` → ubah status laporan (admin only)

**Modul Autentikasi**
- `POST /api/auth/login` → login admin
- `POST /api/auth/refresh` → refresh token

**Modul Dashboard**
- `GET /api/dashboard/summary` → ringkasan gabungan data seed + laporan aktif
- `GET /api/dashboard/trend` → data tren kasus per waktu
- `GET /api/dashboard/kategori` → distribusi kasus per kategori

**Modul AI — Rekomendasi & Klaster**
- `POST /api/ai/kategori/rekomendasi` → hitung & kembalikan rekomendasi kategori (embedding + similarity) untuk sebuah laporan
- `GET /api/ai/klaster/{report_id}` → ambil daftar laporan lain dalam klaster HDBSCAN yang sama
- `PATCH /api/pengaduan/{id}/kategori` → admin menyetujui atau override kategori laporan (tercatat di audit trail)

**Modul Data Seeding** *(khusus dev/admin, bukan untuk publik)*
- `POST /api/admin/seed-data` → trigger import CSV data domestik (manual, *one-time*)
- `GET /api/admin/seed-data/status` → cek status/log hasil seeding

---

## 11. Alur Data & Skenario Simulasi

```
Data Open Domestik (CSV)
        ↓
Cleaning & Mapping (Python/pandas)
        ↓
Seeding ke MySQL (script one-time, idempotent)
        ↓
Dashboard Awal Terisi (bukan kosong)
        ↓
   ┌─────────────────────┬─────────────────────┐
   ↓                                            ↓
Skenario User:                          Skenario Admin:
Submit laporan baru                     Lihat rekomendasi AI,
                                         validasi kategori,
                                         verifikasi & ubah status
   ↓                                            ↓
        Dashboard Update (data seed + data aktif)
```

---

## 12. Data Seeding

Proses seeding dilakukan secara manual, sekali di awal (*one-time*) menggunakan file CSV yang diunduh dari portal data domestik — bukan *live API call* berkelanjutan, karena beberapa portal sumber (misal SIGA/SIMFONI PPA) memblokir *automated access*, dan sifat data yang historis/agregat tahunan membuat *live-sync* tidak diperlukan untuk kebutuhan sistem ini.

---

## 13. Validation Method

### 13.1 Validasi Input & Logika Sistem (Technical Data Validation)

- Validasi form pengaduan: field wajib (kategori, deskripsi) tidak boleh kosong, format file bukti sesuai (jpg/png/pdf), ukuran file dibatasi
- Validasi proses seeding data:
  - Jumlah baris hasil *import* sesuai dengan jumlah baris sumber CSV
  - Tidak ada duplikasi data saat seeding dijalankan ulang (*idempotency check*)
  - Mapping kolom CSV ke skema tabel MySQL sudah benar (tipe data, satuan, dsb)
- Validasi *state transition* status laporan: status tidak bisa berpindah secara tidak berurutan (misal langsung dari "Menunggu" ke "Selesai" tanpa melalui "Diverifikasi")
- Validasi output AI: skor keyakinan rekomendasi kategori harus berada dalam rentang 0–100%; laporan dengan skor di bawah ambang batas otomatis diberi label "Perlu Peninjauan Manual" dan tidak boleh tersimpan sebagai kategori final tanpa persetujuan admin
- Validasi klasterisasi: hasil label klaster (termasuk *noise*) tersimpan dan dapat ditelusuri ulang (*traceable*) ke laporan-laporan anggotanya untuk keperluan audit

### 13.2 Validasi Fungsionalitas: User Acceptance Testing (UAT)

**Skenario User (Pelapor):**
1. Membuka form pengaduan
2. Mengisi laporan dengan kategori tertentu, memilih mode anonim
3. Mengunggah bukti pendukung
4. Submit dan menerima kode tiket
5. Melacak status menggunakan kode tiket

**Skenario Admin:**
1. Login ke dashboard admin
2. Melihat daftar laporan masuk (termasuk data seed sebagai referensi)
3. Membuka detail satu laporan aktif
4. Meninjau rekomendasi kategori AI dan skor keyakinannya, lalu menyetujui atau melakukan override
5. Meninjau penanda klaster (jika ada laporan terkait/serupa)
6. Mengubah status laporan (verifikasi → tindak lanjut → selesai)
7. Melihat dashboard ter-update setelah perubahan status

### 13.3 Validasi Usability: System Usability Scale (SUS)

- Menggunakan 10 pertanyaan standar SUS kepada responden (siswa & guru/admin sebagai dua kelompok terpisah)
- Skor dihitung dengan metode SUS standar (skala 0–100)
- Target: skor rata-rata di atas 68 (dianggap "di atas rata-rata" menurut benchmark umum SUS)

### 13.4 Validasi Berbasis Tugas: Task Success Rate & Single Ease Question (SEQ)

**Sisi User:**
- Task: "Laporkan sebuah kasus perundungan secara anonim dan cek statusnya"
- Diukur: berhasil/gagal menyelesaikan task, waktu penyelesaian, skor SEQ (skala 1–7)

**Sisi Admin:**
- Task: "Verifikasi satu laporan yang masuk, tinjau rekomendasi kategori AI, dan ubah statusnya menjadi ditindaklanjuti"
- Diukur: berhasil/gagal, waktu penyelesaian, skor SEQ
- Task tambahan: "Temukan apakah ada laporan lain yang kemungkinan membahas kejadian yang sama dengan laporan yang sedang ditinjau"
- Diukur: berhasil/gagal, waktu penyelesaian, skor SEQ

### 13.5 Validasi Kualitas Model AI

Karena Bagian 13.1–13.4 menguji sistem dari sisi pengguna, ditambahkan validasi teknis khusus model AI:

- **Evaluasi rekomendasi kategori:** Bandingkan kategori sugesti sistem dengan kategori yang dipilih/divalidasi admin pada sampel data uji → hitung *accuracy* / *precision* per kategori
- **Evaluasi klasterisasi:** Tinjau manual sejumlah klaster hasil HDBSCAN untuk memastikan laporan yang dikelompokkan memang secara substansi berkaitan (bukan sekadar mirip kata kunci)
- **Evaluasi ambang batas keyakinan:** Uji beberapa nilai threshold (misal 50%, 60%, 70%) untuk menyeimbangkan antara terlalu sering menampilkan "Perlu Peninjauan Manual" (kurang membantu) vs terlalu percaya diri pada sugesti yang salah

---

## 14. Data dan Referensi

### 14.1 Data Dalam Negeri (Domestik)

| Sumber | Dataset | Format | Kegunaan |
|---|---|---|---|
| katalog.data.go.id (Bappenas/SDI) | Prevalensi Kekerasan terhadap Anak | CSV | Seed data nasional, konteks skala masalah |
| katalog.data.go.id (Kemensos) | Prevalensi Kekerasan Terhadap Anak Perempuan Menurut Jenis Kekerasan | CSV | Seed data breakdown per jenis kekerasan |
| katalog.data.go.id (P2TP2A) | Jumlah Korban Kekerasan Anak yang Ditangani P2TP2A | CSV | Seed data penanganan kasus |
| Rapor Pendidikan Kemendikbudristek | Indikator Iklim Keamanan Sekolah (2021–2024) | Web/PDF, ekstraksi manual | Acuan kategori kasus, konteks per sekolah/wilayah |
| SIMFONI PPA (Kemen PPPA) | Statistik kekerasan perempuan & anak nasional | Naratif/laporan (situs *block automated access*) | Konteks narasi latar belakang, bukan sumber file seeding utama |

### 14.2 Referensi Terintegrasi

- UU No. 35 Tahun 2014 tentang Perubahan atas UU No. 23 Tahun 2002 tentang Perlindungan Anak (definisi resmi bentuk kekerasan anak: fisik, psikis, seksual, penelantaran, *bullying*)
- Definisi resmi "Iklim Keamanan Sekolah" dari Kemendikbudristek sebagai acuan kategori kasus dalam sistem

### 14.3 Data Layanan Pendukung

- **SAPA129** — hotline nasional pengaduan kekerasan perempuan dan anak (untuk fitur rujukan pada kasus berat)
- **Layanan UPTD PPA daerah** — untuk eskalasi kasus lintas sekolah

### 14.4 Studi Literatur & Platform Sejenis

- **STOPit** — platform pelaporan *bullying* berbasis aplikasi, digunakan di sekolah-sekolah Amerika Serikat — dibahas sebagai pembanding fitur UX, bukan sumber data sistem
- Studi literatur terkait efektivitas sistem pelaporan digital terhadap penurunan kasus *bullying* (perlu ditambahkan sitasi jurnal terkait saat riset lanjutan)

## 15. Timeline Pengerjaan (Gambaran Umum)

Timeline berikut merupakan gambaran umum pengerjaan proyek selama 14 minggu. Rincian tugas dapat menyesuaikan hasil evaluasi tim dan arahan dosen.

| Periode | Fokus Pengerjaan | Catatan/Target |
|---|---|---|
| Minggu 1–3 | Finalisasi PRD, ERD database, dan kontrak API. Setup FastAPI + MySQL + autentikasi JWT di backend. Setup React dan wireframe tampilan di frontend. Seeding data awal dari CSV. | **Posisi saat ini: minggu ke-3.** Fondasi dokumen, arsitektur, backend, frontend, dan data awal mulai tersedia. |
| Minggu 4–7 | Implementasi endpoint inti pengaduan, login admin, pelacakan tiket, validasi input, dan audit trail. Penyelesaian halaman utama siswa dan admin. Integrasi awal frontend dengan backend. | Alur dasar siswa dan admin dapat digunakan dari awal sampai akhir pada lingkungan pengembangan. |
| Minggu 8–11 | Implementasi dashboard dan visualisasi data. Integrasi rekomendasi kategori berbasis AI serta clustering laporan. Penyempurnaan penggabungan data seed dengan laporan aktif. Pengujian unit dan integrasi. | Fitur utama terintegrasi dan mulai diuji menggunakan skenario laporan siswa serta verifikasi admin. |
| Minggu 12–14 | Testing akhir meliputi pengujian end-to-end, UAT, validasi keamanan, dan pemeriksaan hak akses. Perbaikan bug berdasarkan hasil testing, finalisasi konfigurasi, lalu deployment aplikasi ke server/lingkungan produksi. | Sistem teruji, dapat diakses pada lingkungan deployment, dan siap untuk demo/presentasi. |

**Gambaran langkah terdekat setelah minggu ke-3:** fokus berpindah ke penyelesaian API inti dan autentikasi, penghubungan form React dengan endpoint FastAPI, serta memastikan proses seeding CSV dapat dijalankan tanpa duplikasi.

## 16. Lampiran A — Peta Layar & Prompt Desain Detail (Stitch.ai)

Lampiran ini berisi panduan screen-by-screen beserta prompt siap pakai untuk digenerate di Stitch.ai, mencakup flow **Siswa (Pelapor)** dan **Admin (Guru BK/Dinas)**. Gunakan bersamaan dengan standar UI/UX pada Bagian 8.

### 16.0 Design System (masukkan di prompt pertama / project-level style di Stitch)

```
Style: Minimalist, flat design, clean, structured.
Background: solid white (#FFFFFF), no gradients anywhere.
Accent color: baby blue (#A7D8F0 or similar pastel blue) — used exclusively for
primary buttons, active links, active tab indicators, and input focus borders.
Text: neutral dark gray/black for body text, formal Bahasa Indonesia (PUEBI-compliant).
Typography: clean sans-serif, clear hierarchy (headline, subheading, body, caption).
Corners: soft rounded corners (8-12px), subtle shadows only, no gradients, no neumorphism.
Icons: simple line icons, single color (dark gray or baby blue for active states).
Charts: flat style, no gradients, use baby blue + neutral grays as palette.
Platform: mobile-first responsive web app (siswa), desktop-first dashboard (admin).
```

### 16.1 Flow Siswa (Pelapor) — Mobile-first

**Peta Layar**

```
[Landing/Login] → [Registrasi (NISN)] → [Dashboard Siswa]
                                              ↓
                                     [Form Pengaduan - Step 1: Kategori]
                                              ↓
                                     [Form Pengaduan - Step 2: Deskripsi]
                                              ↓
                                     [Form Pengaduan - Step 3: Mode Anonim]
                                              ↓
                                     [Form Pengaduan - Step 4: Unggah Bukti]
                                              ↓
                                     [Konfirmasi & Kode Tiket]
                                              ↓
                                     [Riwayat Laporan / Lacak Status]
                                              ↓
                                     [Detail Status Laporan (Timeline)]
```

**1.1 Landing / Login Siswa**
```
Design a mobile login screen for "SIGAP", a school incident-reporting app.
White background, baby blue accent. App logo/name "SIGAP" at top with a short
tagline in Indonesian ("Lapor Aman, Sekolah Nyaman"). Two input fields: "NISN"
and "Kata Sandi" with baby blue focus border. Primary button "Masuk" in baby
blue, full width, rounded corners. Below it, a text link "Belum punya akun?
Daftar di sini" in baby blue. Include a secondary link "Lacak status laporan
tanpa login" for anonymous ticket tracking. Keep it calm, safe, and trustworthy
looking — no harsh colors, generous white space.
```

**1.2 Registrasi**
```
Design a mobile registration screen for SIGAP. White background, baby blue
accents. Form fields: "Nama Lengkap" (optional, small note "opsional untuk
mode anonim"), "NISN", "Asal Sekolah" (dropdown), "Kata Sandi", "Konfirmasi
Kata Sandi". A short reassurance text below the form in Indonesian explaining
that data is kept private and used only to verify student status. Primary
button "Daftar" in baby blue. Link back to login "Sudah punya akun? Masuk".
```

**1.3 Dashboard Siswa**
```
Design a mobile home dashboard for a student after login on SIGAP. White
background, baby blue accents, flat minimalist style. Top greeting "Halo,
[Nama Siswa]". A large primary call-to-action card/button "+ Buat Laporan
Baru" in baby blue. Below it, a section "Riwayat Laporan Saya" showing a
short list/cards of 2-3 previous reports, each card showing ticket code,
category icon, and a status badge (e.g. "Menunggu", "Diverifikasi",
"Ditindaklanjuti", "Selesai") using flat colored badges. Bottom navigation
bar with icons: Beranda, Buat Laporan, Riwayat, Profil.
```

**1.4 Form Pengaduan — Step 1: Kategori**
```
Design a mobile multi-step form, step 1 of 4, for reporting a bullying
incident on SIGAP. White background, baby blue accent, progress indicator
at top showing step 1/4. Title "Pilih Kategori Kejadian". A dropdown/select
list styled as tappable cards or a dropdown menu with 7 options in Indonesian:
"Perundungan Verbal", "Perundungan Fisik", "Perundungan Siber", "Kekerasan
Seksual", "Hukuman Fisik oleh Tenaga Pendidik", "Kekerasan Psikis/Pengucilan
Sosial", "Penyalahgunaan Narkoba/Rokok/Minuman Keras". Primary button
"Lanjut" in baby blue, disabled/gray until a selection is made.
```

**1.5 Form Pengaduan — Step 2: Deskripsi**
```
Design step 2 of 4 of a mobile incident report form on SIGAP. Progress
indicator at top (2/4). Title "Ceritakan Kejadiannya". Large multiline text
area with placeholder in Indonesian: "Jelaskan apa yang terjadi, kapan, dan
di mana. Semakin jelas, semakin mudah kami membantu." Character counter
below the text area. Small reassurance note: "Ceritamu akan dibaca dengan
hati-hati dan rahasia." Buttons "Kembali" (outline baby blue) and "Lanjut"
(filled baby blue) side by side at bottom.
```

**1.6 Form Pengaduan — Step 3: Mode Anonim**
```
Design step 3 of 4 of a mobile incident report form on SIGAP. Progress
indicator (3/4). Title "Bagaimana Kamu Ingin Melapor?". Two large selectable
cards stacked: Card 1 "Laporkan Secara Anonim" with a shield/mask icon,
subtitle "Identitasmu tidak akan ditampilkan ke siapa pun". Card 2 "Laporkan
dengan Nama" with a user icon, subtitle "Namamu akan terlihat oleh admin
sekolah untuk penanganan lebih personal". Selected card has baby blue
border/highlight. Buttons "Kembali" and "Lanjut" at bottom.
```

**1.7 Form Pengaduan — Step 4: Unggah Bukti**
```
Design step 4 of 4 of a mobile incident report form on SIGAP. Progress
indicator (4/4). Title "Unggah Bukti Pendukung (Opsional)". A dashed-border
upload box with an upload icon and text "Tap untuk unggah foto atau PDF".
Show 1-2 example uploaded file thumbnails with a small "x" remove icon.
Small note "Format: JPG, PNG, PDF. Maks 10MB per file." Primary button
"Kirim Laporan" in baby blue, full width.
```

**1.8 Konfirmasi & Kode Tiket**
```
Design a mobile confirmation screen shown right after a student submits a
report on SIGAP. White background, baby blue accents. Centered checkmark
icon in baby blue circle. Title "Laporan Berhasil Dikirim". Subtitle "Simpan
kode tiket ini untuk melacak status laporanmu." A prominent card displaying
a large ticket code (e.g. "SGP-2026-0091") with a "Salin Kode" button.
Secondary text explaining next steps in Indonesian. Two buttons: "Lacak
Status Sekarang" (filled baby blue) and "Kembali ke Beranda" (text link).
```

**1.9 Riwayat Laporan / Lacak Status (bisa tanpa login)**
```
Design a mobile screen for tracking a report status on SIGAP, accessible
without login. White background, baby blue accents. Title "Lacak Status
Laporan". Input field for entering ticket code with a "Cek Status" button
in baby blue. Below, if logged in, show a list of past reports as cards:
ticket code, category, submitted date, and a status badge.
```

**1.10 Detail Status Laporan (Timeline)**
```
Design a mobile screen showing the status timeline of a single report on
SIGAP. White background, baby blue accents. Top shows ticket code and
category. A vertical timeline/stepper component with 4 stages: "Menunggu",
"Diverifikasi", "Ditindaklanjuti", "Selesai" — completed stages filled baby
blue with checkmark, current stage highlighted, future stages gray/outline.
Each stage has a short timestamp label. Below the timeline, a note in
Indonesian reassuring the student that their report is being handled
confidentially.
```

### 16.2 Flow Admin (Guru BK / Dinas Pendidikan) — Desktop-first

**Peta Layar**

```
[Login Admin] → [Dashboard Analitik Utama]
                        ↓
              [Daftar Laporan Masuk (Tabel)]
                        ↓
              [Detail Laporan + Rekomendasi AI]
                        ↓
        ┌───────────────┴───────────────┐
        ↓                                ↓
[Validasi Kategori (Setuju/Override)]  [Lihat Klaster Laporan Terkait]
        ↓                                ↓
              [Ubah Status (State Machine)]
                        ↓
              [Audit Trail / Log Aktivitas]
```

**2.1 Login Admin**
```
Design a desktop login screen for SIGAP admin panel (school counselors /
education office staff). White background, baby blue accent, flat minimalist
style. Centered card with SIGAP logo, title "Masuk sebagai Admin". Fields:
"NIP (Nomor Induk Pegawai)" and "Kata Sandi" with baby blue focus border.
Primary button "Masuk" in baby blue. Small footer text noting this is a
restricted access area for authorized school/education office staff only.
```

**2.2 Dashboard Analitik Utama**
```
Design a desktop analytics dashboard for SIGAP admin. White background,
baby blue accents, flat design, no gradients. Top bar with SIGAP logo,
admin name, and logout icon. Left sidebar navigation with icons: Dashboard,
Daftar Laporan, Validasi AI, Audit Trail, Pengaturan. Main content area
with: (1) Row of 4 summary stat cards — "Total Laporan", "Menunggu
Verifikasi", "Ditindaklanjuti", "Selesai" — each with a number and small
flat icon. (2) A flat line chart "Tren Kasus per Bulan" comparing internal
report data vs national reference data (two lines, one baby blue solid for
internal data, one gray dashed for reference/seed data). (3) A flat bar
chart "Distribusi per Kategori" showing the 7 incident categories. (4) A
small badge/label system distinguishing "Data Referensi" (seed data, gray
badge) from "Data Aktif" (baby blue badge) wherever mixed data appears.
```

**2.3 Daftar Laporan Masuk (Tabel)**
```
Design a desktop table view listing incoming reports for SIGAP admin.
White background, baby blue accents, flat design. Filter bar at top:
dropdowns for "Kategori", "Status", "Sumber Data" (Aktif/Referensi), and a
search box. Table columns: Kode Tiket, Kategori, Rekomendasi Kategori AI
(shown as a small badge with confidence percentage, e.g. "Perundungan
Fisik 87%"), Status (colored flat badge: Menunggu=gray, Diverifikasi=baby
blue, Ditindaklanjuti=darker blue, Selesai=green outline), Penanda Klaster
(small icon "🔗 Kemungkinan Kejadian Sama" if applicable, or nothing),
Tanggal Masuk, and an "action" chevron icon to open details. Rows for
seed/reference data have a subtle gray background tint and a small
"Referensi" tag to visually distinguish them from active reports.
```

**2.4 Detail Laporan + Rekomendasi AI**
```
Design a desktop detail/review panel for a single report on SIGAP admin
dashboard (can be a modal or full page). White background, baby blue
accents. Left column: report details — ticket code, submission date,
reporter identity (or "Anonim" badge if hidden), full incident description
text, and thumbnail previews of uploaded evidence files. Right column,
an "Analisis AI" card with: (1) "Rekomendasi Kategori" section showing
the top suggested category with a large confidence percentage displayed
as a flat circular or horizontal progress bar in baby blue, plus a
secondary suggested category below it in smaller text. Two buttons:
"Setujui Kategori Ini" (filled baby blue) and "Pilih Kategori Lain"
(outline, opens a dropdown). (2) Below it, a "Deteksi Klaster" card showing
an icon and text like "Terdeteksi 3 laporan lain dengan pola serupa" with
a button "Lihat Laporan Terkait". If confidence is low, show an orange/amber
flat badge "Perlu Peninjauan Manual" instead of the AI suggestion.
```

**2.5 Validasi Kategori (Setuju/Override) — komponen/dropdown**
```
Design a small desktop dropdown/override component for changing a report's
category on SIGAP admin panel. White background, baby blue accents. A
dropdown list of the 7 official incident categories, with the AI-suggested
one pre-highlighted with a small "Direkomendasikan AI" tag. Below the
dropdown, a "Simpan Perubahan" button in baby blue and a "Batal" text link.
```

**2.6 Lihat Klaster Laporan Terkait**
```
Design a desktop side panel or modal on SIGAP admin showing a cluster of
related reports (from HDBSCAN grouping). White background, baby blue
accents. Title "Laporan dengan Pola Kejadian Serupa". A short explanatory
note in Indonesian: "Laporan-laporan berikut memiliki kemiripan tinggi dan
mungkin membahas kejadian yang sama." A list of 3-5 report cards, each
showing ticket code, category, short excerpt of description, and
submission date, with a "Buka Detail" link on each. A button at bottom
"Tandai sebagai Kejadian Terkait" to formally link them for combined
handling.
```

**2.7 Ubah Status (State Machine)**
```
Design a desktop status-update component for SIGAP admin, shown within the
report detail panel. White background, baby blue accents. A horizontal
stepper showing 4 stages: Menunggu → Diverifikasi → Ditindaklanjuti →
Selesai, with the current stage highlighted in baby blue and completed
stages shown with checkmarks. Only the next valid stage is clickable/active
(others are grayed out and disabled to enforce sequential flow). A button
"Ubah ke [Nama Status Berikutnya]" in baby blue below the stepper, plus a
small optional text field "Catatan Tindak Lanjut (opsional)".
```

**2.8 Audit Trail / Log Aktivitas**
```
Design a desktop audit trail/activity log screen for SIGAP admin. White
background, baby blue accents, flat design. Title "Jejak Audit". A
filterable table with columns: Waktu (timestamp), Admin, Aksi (e.g.
"Mengubah status ke Diverifikasi", "Menyetujui kategori AI: Perundungan
Fisik", "Override kategori manual"), and Kode Tiket Terkait. Rows are
simple flat list items with subtle dividers, no heavy borders, generous
white space, small icons next to each action type (checkmark for status
change, AI icon for AI-related actions).
```

### 16.3 Urutan Disarankan Saat Membangun di Stitch.ai

1. Mulai dari **Design System (15.0)** sebagai konteks/style project pertama.
2. Bangun flow **Siswa** dulu secara berurutan (1.1 → 1.10) — flow ini lebih linear dan simpel, bagus untuk menyamakan gaya visual dasar.
3. Lanjut ke flow **Admin** (2.1 → 2.8) — pastikan referensi ulang Design System agar konsisten dengan flow siswa.
4. Setelah semua layar tergenerate, buat 1-2 prompt tambahan khusus untuk memastikan konsistensi lintas layar, misalnya:
   ```
   Review all screens generated so far for SIGAP and ensure consistent
   spacing, the same baby blue shade, same corner radius, and same
   typography scale across both the student flow and admin flow.
   ```
5. Ekspor/susun sebagai prototipe alur klik-tayang (clickable flow) mengikuti Peta Layar di atas untuk demo ke dosen.

### 16.4 Catatan Desain Tambahan

- **Konsistensi status badge**: gunakan warna yang sama persis untuk status yang sama di seluruh layar (siswa & admin).
- **Bedakan sugesti AI vs data final**: di semua layar admin, elemen yang berasal dari AI (rekomendasi kategori, label klaster) konsisten pakai gaya *outline/badge terbuka* sebelum disetujui, baru berubah jadi *solid* setelah admin approve.
- **Aksesibilitas**: pastikan kontras teks di atas baby blue tetap memenuhi standar WCAG AA.

---

## 17. Ringkasan Perubahan & Catatan untuk Diskusi Lanjutan

### 17.1 Ringkasan Perubahan dari Draft Sebelumnya

| Area | Perubahan |
|---|---|
| Struktur dokumen | Menggabungkan 3 dokumen kerja (PRD, arsitektur, desain UI/UX) menjadi satu PRD lengkap untuk tahap lanjutan proyek |
| Arsitektur | Ditambahkan pengelompokan area (Frontend/Backend Core/AI-ML/Data/External) dan alur bernomor 1–22 sebagai dasar diagram visual (Bagian 9) |
| Lampiran | Ditambahkan Lampiran A berisi peta layar dan prompt Stitch.ai lengkap untuk kedua flow (Bagian 16) |
| User Story | US-05 (rekomendasi kategori AI) dan US-06 (deteksi klaster kejadian serupa) |
| Rumusan Masalah & Tujuan | Poin terkait bantuan AI untuk validasi kategori |
| API | Endpoint `/api/ai/kategori/rekomendasi`, `/api/ai/klaster/{report_id}`, `/api/pengaduan/{id}/kategori` |
| Validation Method | Validasi teknis kualitas model AI (13.5) dan task UAT tambahan untuk fitur klaster |
| UI/UX | Ketentuan visual agar sugesti AI dibedakan jelas dari data tervalidasi |

### 17.2 Catatan untuk Diskusi Lanjutan (belum final, perlu dikonfirmasi tim/dosen)

1. Dari mana sumber contoh kalimat untuk membangun *centroid* tiap kategori jika data seed berlabel kategori masih terbatas? Apakah perlu anotasi manual tambahan oleh tim?
2. Apakah threshold keyakinan (misal 60%) akan diuji coba secara empiris, atau ditentukan berdasarkan literatur/heuristik saja untuk fase awal?
3. Apakah klasterisasi HDBSCAN dijalankan secara *real-time* setiap ada laporan baru, atau batch berkala (misal setiap beberapa jam)? Ini akan memengaruhi desain *background worker* di FastAPI.
4. Komponen arsitektur yang masih bertanda *(opsional)* — Hosting/CDN Frontend, API Gateway, Model/Embedding Cache/Vector Store, dan Notifikasi email/WA — perlu difinalisasi sebelum masuk tahap implementasi dan diagram visual resmi.
5. Evaluasi dosen terkait keputusan cakupan *single-tenant* (satu sekolah) untuk fase praktikum ini masih ditunggu.