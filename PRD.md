# PRD --- SIGAP

## Sistem Informasi Pengaduan Perundungan dan Kekerasan Pelajar

**Basis dokumen:** PRD SIGAP Gabungan, Alur Arsitektur SIGAP, dan Alur
Desain SIGAP untuk Stitch.ai.

------------------------------------------------------------------------

## 1. Ringkasan Produk

SIGAP adalah platform pengaduan digital untuk lingkungan pendidikan yang
memungkinkan siswa melaporkan perundungan dan kekerasan secara aman,
menyediakan kode tiket untuk pelacakan, serta membantu admin
sekolah/Guru BK/Dinas Pendidikan melakukan verifikasi, tindak lanjut,
analitik, dan validasi kategori berbantuan AI.

AI berfungsi sebagai **decision support**, bukan pengambil keputusan
otomatis. Kategori final tetap ditentukan oleh admin manusia.

## 2. Latar Belakang

Pelaporan kasus kekerasan di lingkungan pendidikan masih dapat dilakukan
secara manual sehingga berisiko tidak terdokumentasi, sulit dipantau,
dan tidak memiliki jejak tindak lanjut yang jelas. SIGAP dirancang untuk
menyediakan kanal pelaporan yang terstruktur, transparan, dan dapat
dilacak.

Sistem juga menggunakan data awal (*seed data*) domestik agar dashboard
tidak kosong sejak awal implementasi.

## 3. Tujuan

### Tujuan Umum

Membangun sistem informasi pengaduan tindak perundungan dan kekerasan
pelajar yang aman, transparan, terlacak, dan memiliki dukungan analitik.

### Tujuan Khusus

-   Mempermudah siswa membuat laporan anonim atau non-anonim.
-   Memberikan kode tiket unik untuk pelacakan.
-   Mempercepat verifikasi dan tindak lanjut admin.
-   Menyediakan dashboard statistik dengan data seed dan data aktif.
-   Memberikan rekomendasi kategori berbasis IndoBERT.
-   Mendeteksi laporan dengan pola kejadian serupa menggunakan HDBSCAN.
-   Menyediakan audit trail.
-   Mendukung eskalasi berdasarkan tingkat kasus.

## 4. Aktor

  -----------------------------------------------------------------------
  Aktor                               Peran
  ----------------------------------- -----------------------------------
  Siswa                               Membuat laporan, memilih mode
                                      anonim/non-anonim, mengunggah
                                      bukti, dan melacak status

  Admin Sekolah/Guru BK               Memeriksa laporan, memvalidasi
                                      kategori, mengubah status, dan
                                      menindaklanjuti

  Admin Dinas Pendidikan              Memantau laporan yang memerlukan
                                      eskalasi dan analitik

  Sistem AI                           Memberikan rekomendasi kategori dan
                                      klaster laporan sebagai alat bantu

  Background Worker                   Menjalankan pekerjaan terjadwal
                                      yang disiapkan untuk integrasi/olah
                                      data
  -----------------------------------------------------------------------

## 5. Kategori Pengaduan

1.  Perundungan verbal
2.  Perundungan fisik
3.  Perundungan siber
4.  Kekerasan seksual
5.  Hukuman fisik oleh tenaga pendidik
6.  Kekerasan psikis/pengucilan sosial
7.  Penyalahgunaan narkoba/rokok/minuman keras di lingkungan sekolah

## 6. Fitur Utama

### Siswa

-   Registrasi/login menggunakan NISN.
-   Membuat laporan.
-   Memilih kategori.
-   Mengisi deskripsi kejadian.
-   Memilih anonim/non-anonim.
-   Mengunggah bukti foto/PDF secara opsional.
-   Menerima kode tiket.
-   Melacak status tanpa login menggunakan kode tiket.
-   Melihat riwayat laporan.

### Admin

-   Login menggunakan NIP.
-   Dashboard analitik.
-   Daftar laporan.
-   Filter kategori, status, sumber data, dan pencarian.
-   Detail laporan.
-   Rekomendasi kategori AI.
-   Persetujuan/override kategori.
-   Deteksi klaster laporan terkait.
-   Perubahan status berurutan.
-   Audit trail.

### Data

-   Import seed data CSV.
-   Cleaning dan mapping menggunakan Python/pandas.
-   Import idempotent ke MySQL.
-   Pembedaan visual antara Data Referensi dan Data Aktif.

## 7. AI

### Rekomendasi Kategori

1.  Deskripsi siswa diproses oleh IndoBERT.
2.  Sistem menghasilkan vector embedding.
3.  Embedding dibandingkan dengan centroid setiap kategori menggunakan
    cosine similarity.
4.  Sistem menampilkan top-1/top-2 rekomendasi beserta skor.
5.  Jika skor di bawah threshold, laporan diberi label **Perlu
    Peninjauan Manual**.

### Klasterisasi

HDBSCAN digunakan untuk: - Mengelompokkan laporan yang memiliki pola
serupa. - Menandai kemungkinan kejadian yang sama/berulang. - Menandai
*noise/outlier* untuk perhatian tambahan.

HDBSCAN tidak digunakan untuk menentukan kategori laporan.

## 8. Status Laporan

`Menunggu → Diverifikasi → Ditindaklanjuti → Selesai`

Sistem tidak mengizinkan lompatan status sembarangan.

## 9. Routing Awal

  -------------------------------------------------------------------------
  Kategori            Tingkat           Penanganan Awal   Eskalasi
  ------------------- ----------------- ----------------- -----------------
  Verbal/pengucilan   Ringan            Guru BK           Kepala Sekolah
                                                          jika tidak
                                                          selesai

  Fisik/siber         Sedang            Guru BK + Kepala  Dinas jika
                                        Sekolah           berulang/tidak
                                                          selesai

  Kekerasan seksual   Berat             Eskalasi langsung Dinas + rujukan
                                                          layanan resmi

  Kekerasan oleh      Berat             Eskalasi langsung Dinas
  tenaga pendidik                                         
  -------------------------------------------------------------------------

## 10. Scope

### In-Scope

-   Pelaporan siswa.
-   Anonim/non-anonim.
-   Pelacakan tiket.
-   Manajemen laporan admin.
-   AI recommendation IndoBERT.
-   HDBSCAN clustering.
-   Dashboard.
-   Seed data CSV.
-   Audit trail.
-   Simulasi user dan admin untuk pengujian.

### Out-of-Scope

-   Proses hukum/pidana.
-   Pembayaran.
-   Modul non-pengaduan.
-   Retraining IndoBERT dari nol.
-   Live synchronization dengan sistem pemerintah.

## 11. Acceptance Criteria Utama

-   Siswa dapat membuat laporan dengan field wajib kategori dan
    deskripsi.
-   Laporan anonim tidak menampilkan identitas kepada admin.
-   Setiap laporan memiliki ticket ID unik.
-   Status dapat dilacak tanpa login.
-   Admin tidak dapat melompati state.
-   Perubahan status dan kategori tercatat dalam audit trail.
-   Rekomendasi AI menampilkan skor.
-   Skor di bawah threshold memunculkan peninjauan manual.
-   Admin dapat override rekomendasi AI.
-   Laporan dalam klaster dapat dibuka dari laporan terkait.
-   Dashboard dapat membedakan data aktif dan data referensi.
-   Seeding dapat dijalankan ulang tanpa membuat duplikasi.

## 12. API Utama

-   `POST /api/pengaduan`
-   `GET /api/pengaduan/{ticket_id}/status`
-   `GET /api/pengaduan`
-   `PATCH /api/pengaduan/{id}/verifikasi`
-   `POST /api/auth/login`
-   `POST /api/auth/refresh`
-   `GET /api/dashboard/summary`
-   `GET /api/dashboard/trend`
-   `GET /api/dashboard/kategori`
-   `POST /api/ai/kategori/rekomendasi`
-   `GET /api/ai/klaster/{report_id}`
-   `PATCH /api/pengaduan/{id}/kategori`
-   `POST /api/admin/seed-data`
-   `GET /api/admin/seed-data/status`

## 13. Validasi

### Teknis

-   Validasi field wajib.
-   Validasi tipe dan ukuran file.
-   Validasi idempotency seed.
-   Validasi state transition.
-   Validasi skor AI 0--100%.
-   Validasi keterlacakan label HDBSCAN.

### UAT

**Siswa:** membuat laporan anonim → memperoleh tiket → melacak status.

**Admin:** login → melihat dashboard → membuka laporan → memvalidasi
kategori → melihat klaster → mengubah status → melihat dashboard
terbarui.

### Usability

-   SUS.
-   Task Success Rate.
-   SEQ.

### AI

-   Accuracy/precision rekomendasi kategori.
-   Review manual klaster.
-   Pengujian threshold 50%, 60%, 70% sebagai contoh evaluasi awal.

## 14. Catatan Produk yang Perlu Diputuskan

-   Sumber contoh kalimat untuk centroid kategori.
-   Threshold AI final.
-   Frekuensi HDBSCAN: real-time atau batch.
-   Infrastruktur hosting/CDN.
-   ORM SQLAlchemy masih berupa usulan.
-   Integrasi API pemerintah tetap diposisikan sebagai pengembangan/fase
    lanjutan, sedangkan seed CSV adalah mekanisme awal.
