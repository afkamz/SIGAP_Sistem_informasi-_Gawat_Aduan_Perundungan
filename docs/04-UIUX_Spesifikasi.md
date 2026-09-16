# UI/UX Specification --- SIGAP

## 1. Design Direction

SIGAP menggunakan desain: - Minimalist. - Flat. - Clean. - Structured. -
Mobile-first untuk siswa. - Desktop-first untuk admin. - Bahasa
Indonesia formal dan konsisten.

## 2. Design System

### Color

  Token          Value             Penggunaan
  -------------- ----------------- -------------------------------------------
  Background     `#FFFFFF`         Background utama
  Baby Blue      `#A7D8F0`         Primary button, active link, focus border
  Neutral Dark   Dark gray/black   Teks
  Neutral Gray   Gray              Secondary text/data referensi

Tidak menggunakan gradient.

### Typography

-   Sans-serif.
-   Hierarki jelas: headline → subheading → body → caption.
-   Bahasa mengikuti PUEBI/KBBI.

### Shape

-   Border radius 8--12px.
-   Shadow tipis.
-   Tidak menggunakan neumorphism.

### Icon

-   Line icons.
-   Dark gray pada default.
-   Baby blue untuk active state.

### Chart

-   Flat.
-   Tanpa gradient.
-   Baby blue + neutral gray.

## 3. Accessibility

-   Kontras teks harus memadai.
-   Gunakan teks gelap di atas baby blue, bukan putih.
-   Status tidak hanya dibedakan berdasarkan warna; gunakan label/icon.
-   Form memiliki label yang jelas.
-   Tombol disabled terlihat berbeda dari tombol aktif.

## 4. Student Screens

### S-01 Landing/Login

Elemen: - Logo SIGAP. - Tagline "Lapor Aman, Sekolah Nyaman". - NISN. -
Kata sandi. - Masuk. - Daftar. - Lacak status tanpa login.

### S-02 Registrasi

Field: - Nama lengkap opsional. - NISN. - Asal sekolah. - Kata sandi. -
Konfirmasi kata sandi.

### S-03 Dashboard

-   Greeting.
-   CTA "+ Buat Laporan Baru".
-   Riwayat laporan.
-   Status badge.
-   Bottom navigation: Beranda, Buat Laporan, Riwayat, Profil.

### S-04 Form Step 1 --- Kategori

7 kategori pengaduan. Progress indicator 1/4. Tombol Lanjut.

### S-05 Form Step 2 --- Deskripsi

-   Text area.
-   Character counter.
-   Keterangan kerahasiaan.
-   Kembali/Lanjut.

### S-06 Form Step 3 --- Mode

Dua pilihan: - Laporkan Secara Anonim. - Laporkan dengan Nama.

### S-07 Form Step 4 --- Bukti

-   Upload foto/PDF.
-   Maksimal 10 MB per file.
-   Kirim Laporan.

### S-08 Confirmation

-   Checkmark.
-   "Laporan Berhasil Dikirim".
-   Ticket code.
-   Salin Kode.
-   Lacak Status Sekarang.

### S-09 Tracking

-   Input ticket code.
-   Cek Status.
-   Riwayat jika login.

### S-10 Status Detail

Timeline: `Menunggu → Diverifikasi → Ditindaklanjuti → Selesai`

## 5. Admin Screens

### A-01 Login

-   NIP.
-   Kata sandi.
-   Restricted access notice.

### A-02 Dashboard

Sidebar: - Dashboard. - Daftar Laporan. - Validasi AI. - Audit Trail. -
Pengaturan.

Stat cards: - Total Laporan. - Menunggu Verifikasi. - Ditindaklanjuti. -
Selesai.

Charts: - Tren Kasus per Bulan. - Distribusi per Kategori.

Data reference diberi label **Data Referensi**, sedangkan laporan aktif
diberi label **Data Aktif**.

### A-03 Daftar Laporan

Filter: - Kategori. - Status. - Sumber Data. - Search.

Kolom: - Kode Tiket. - Kategori. - Rekomendasi AI. - Confidence. -
Status. - Cluster marker. - Tanggal. - Action.

### A-04 Detail + AI

Layout dua kolom: - Kiri: detail laporan. - Kanan: Analisis AI.

Komponen AI: - Rekomendasi kategori. - Confidence. - Secondary
suggestion. - Approve. - Override. - Cluster detection.

Confidence rendah: **Perlu Peninjauan Manual**

### A-05 Override Kategori

-   Dropdown 7 kategori.
-   AI suggestion diberi label "Direkomendasikan AI".
-   Simpan Perubahan.
-   Batal.

### A-06 Cluster

-   Judul "Laporan dengan Pola Kejadian Serupa".
-   Daftar laporan terkait.
-   Ticket code.
-   Kategori.
-   Excerpt.
-   Tanggal.
-   Buka Detail.
-   Tandai sebagai Kejadian Terkait.

### A-07 State Machine

Stepper: `Menunggu → Diverifikasi → Ditindaklanjuti → Selesai`

Hanya status berikutnya yang aktif.

### A-08 Audit Trail

Kolom: - Waktu. - Admin. - Aksi. - Kode Tiket Terkait.

## 6. Status Visual

  Status            Bentuk
  ----------------- --------------------
  Menunggu          Neutral/gray badge
  Diverifikasi      Baby blue
  Ditindaklanjuti   Darker blue
  Selesai           Green outline

Status harus konsisten pada seluruh layar.

## 7. AI Visual Language

Rekomendasi AI yang belum divalidasi: - Outline badge. - Ikon AI. -
Confidence percentage.

Setelah disetujui: - Data final menggunakan gaya solid/normal. - Audit
trail mencatat sumber keputusan.

## 8. Responsive Behavior

### Mobile

-   Satu kolom.
-   Bottom navigation siswa.
-   Form step-by-step.
-   CTA utama mudah dijangkau.

### Desktop

-   Sidebar admin.
-   Tabel.
-   Panel detail.
-   Dashboard multi-kolom.

## 9. UX Principles

-   Aman dan menenangkan.
-   Minim beban kognitif.
-   Progress form jelas.
-   Feedback setelah submit jelas.
-   Ticket code mudah disalin.
-   Informasi AI tidak boleh terlihat sebagai keputusan final.
-   Data referensi tidak boleh disalahartikan sebagai laporan aktif.
