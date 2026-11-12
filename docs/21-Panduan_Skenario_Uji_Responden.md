# 📋 Panduan Skenario Pengujian Sistem SIGAP untuk Responden

> Dokumen panduan tugas terpandu (*Task Scenario Guide*) yang dibagikan kepada responden sebelum mengisi Kuesioner Evaluasi Pengujian Penerimaan Pengguna (*Google Form UAT — SUS & TAM*).

---

## 🎯 Tujuan Pengujian
Pengujian ini bertujuan untuk mengukur tingkat kemudahan penggunaan (*usability*), efektivitas sistem, dan penerimaan pengguna terhadap **SIGAP (Sistem Informasi Gawat Aduan Perundungan)** dalam menangani kasus kekerasan di lingkungan satuan pendidikan secara aman, rahasia, dan terstruktur.

⏱️ **Estimasi Durasi Pengujian**: 10 – 15 Menit  
🌐 **Akses Aplikasi**: `http://localhost:3000` (atau tautan server lokal sekolah)

---

## 🧑‍🎓 JALUR 1: PANDUAN PENGUJIAN UNTUK SISWA (PELAPOR)

Sebagai siswa, Anda berperan sebagai **Pelapor** yang melaporkan suatu insiden perundungan dan memantau perkembangannya secara mandiri.

### 📌 Misi 1: Eksplorasi Beranda & Akses Pelaporan
1. Buka halaman utama SIGAP di peramban (*browser*).
2. Perhatikan bagian informasi *Dual-Mode Reporting* (Lapor Anonim vs Terverifikasi) dan 7 kategori kekerasan resmi.
3. Klik tombol **"Buat Laporan Sekarang"** atau tombol darurat yang tersedia.

### 📌 Misi 2: Membuat Laporan Simulasi (Wizard 3 Langkah)
Isi formulir aduan dengan skenario kasus simulasi:
* **Langkah 1 (Identitas & Kerahasiaan):**
  * Pilih opsi identitas: **Anonim** (identitas dirahasiakan tanpa nama) atau **Terverifikasi** (menggunakan nama akun).
  * Pilih peran Anda: *Korban Langsung* atau *Saksi yang Melihat*.
  * Klik tombol **"Lanjut ke Detail Kasus"**.
* **Langkah 2 (Substansi Kasus & Lokasi):**
  * Tuliskan judul laporan singkat (Contoh: *"Pemalakan dan ejekan di kantin belakang"*).
  * Pilih salah satu kategori yang paling mendekati (Contoh: *Perundungan Verbal* atau *Perundungan Fisik*).
  * Masukkan tanggal & waktu kejadian (gunakan tombol pintas kalender *Hari Ini* atau *Kemarin*).
  * Pilih atau ketik lokasi kejadian di lingkungan sekolah (Contoh: *"Kantin Belakang"* atau *"Lorong Kelas X"*).
  * Tuliskan kronologi singkat pada kotak deskripsi.
  * Klik tombol **"Lanjut ke Bukti & Bantuan"**.
* **Langkah 3 (Bukti Digital & Bantuan Darurat):**
  * Unggah 1 berkas bukti simulasi (dapat berupa gambar tangkapan layar chat, foto, atau berkas PDF $\le 10$ MB).
  * Centang kebutuhan bantuan (misal: *Konseling Pendampingan Guru BK*).
  * Tinjau ringkasan akhir aduan, lalu klik tombol **"Kirim Laporan Sekarang"**.

### 📌 Misi 3: Mencatat Kode Tiket & Melacak Status Aduan
1. Setelah laporan terkirim, sistem akan menerbitkan **Kode Tiket Pengaduan** unik (Contoh: `SGP-XXXX-XXXX`).
2. **Salin atau catat** kode tiket tersebut.
3. Klik tombol **"Salin Kode Tiket"** atau navigasikan ke menu **"Lacak Laporan"** pada menu atas.
4. Masukkan kode tiket Anda, lalu klik tombol **"Lacak Tiket"**.
5. Amati riwayat penanganan, badge kategori hasil triase sistem, serta linimasa status aduan.

### 📌 Misi 4: Mengisi Kuesioner Evaluasi
* Buka tautan Google Form kuesioner yang telah disediakan penguji.
* Pada **Section 1**, pilih peran: **`Siswa (Pelapor)`**.
* Lanjutkan mengisi 10 pernyataan **SUS** dan 10 pernyataan **TAM** sesuai dengan pengalaman Anda.

---

## 👨‍🏫 JALUR 2: PANDUAN PENGUJIAN UNTUK GURU BK / SATGAS (ADMIN)

Sebagai Guru BK atau anggota Satgas PPKSP, Anda berperan sebagai **Pengelola Laporan** yang memverifikasi aduan masuk, meninjau rekomendasi AI, dan memperbarui status penanganan.

### 📌 Misi 1: Masuk ke Portal Manajemen Admin
1. Buka alamat portal admin di `http://localhost:3000/#/admin/login`.
2. Masuk menggunakan akun admin simulasi yang telah disiapkan:
   * **NIP / Username**: `198001012026`
   * **Kata Sandi**: *(Kredensial simulasi yang diberikan penguji)*
3. Klik tombol **"Masuk ke Portal Admin"**.

### 📌 Misi 2: Eksplorasi Dashboard & Notifikasi Real-Time
1. Perhatikan kartu ringkasan metrik statistik (*Total Laporan*, *Perlu Tindakan*, *Kasus Selesai*).
2. Perhatikan ikon **Lonceng Notifikasi** di pojok kanan atas navbar:
   * Klik ikon lonceng untuk membuka panel *dropdown* laporan baru berstatus *Menunggu*.
   * Perhatikan *badge* merah penghitung jumlah aduan yang belum diverifikasi.
   * Klik salah satu notifikasi untuk langsung menuju ke lembar kasus.

### 📌 Misi 3: Verifikasi Laporan & Tinjauan Triase AI
1. Masuk ke menu navigasi **"Daftar Laporan"** di bilah sisi kiri (*sidebar*).
2. Temukan laporan yang baru saja dibuat oleh siswa simulasi (status: *Menunggu*).
3. Buka tombol **"Tinjau Kasus"** untuk masuk ke halaman **Detail Laporan**:
   * Periksa kartu **Rekomendasi Triase AI** (Tingkat Urgensi, Skor Kepercayaan/Confidence Score, dan Ekstraksi Kata Kunci Insiden).
   * Periksa dokumen bukti lampiran aduan (klik pratinjau gambar jika ada).
   * Perhatikan status kerahasiaan: jika pelapor memilih *Anonim*, pastikan identitas disamarkan demi privasi korban.

### 📌 Misi 4: Eksekusi Perubahan Status & Pemeriksaan Audit Trail
1. Pada panel aksi penanganan di halaman Detail Laporan, ubah status kasus dari **"Menunggu"** menjadi **"Diproses"** atau **"Ditindaklanjuti"**.
2. Masukkan catatan tindak lanjut singkat (Contoh: *"Satgas telah menjadwalkan konseling tatap muka dengan siswa bersangkutan"*).
3. Simpan perubahan status.
4. Buka menu **"Audit Trail"** pada sidebar kiri:
   * Pastikan tindakan perubahan status yang baru saja Anda lakukan tercatat secara permanen dengan stempel waktu (*timestamp*), nama admin penindak, dan status sebelum $\rightarrow$ sesudah.

### 📌 Misi 5: Meninjau Pengaturan Petugas (Opsional)
1. Buka menu **"Pengaturan"** pada sidebar kiri.
2. Perhatikan tabel **Manajemen Akun Petugas & Hak Akses** yang tersinkronisasi ke database MySQL.
3. Klik tombol **"Tambah Petugas Baru"** untuk melihat formulir pendaftaran staf BK/Satgas.

### 📌 Misi 6: Mengisi Kuesioner Evaluasi
* Buka tautan Google Form kuesioner yang telah disediakan penguji.
* Pada **Section 1**, pilih peran: **`Guru BK / Admin (Pengelola Laporan)`**.
* Lanjutkan mengisi 10 pernyataan **SUS** dan 10 pernyataan **TAM** sesuai dengan pengalaman Anda.

---

## 📊 Matriks Ringkasan Tugas Pengujian

| Pengguna | Tugas Utama yang Diuji | Parameter yang Dinilai Responden |
|---|---|---|
| **Siswa** | 1. Navigasi Beranda & Akses Form<br>2. Pengisian Wizard 3 Langkah<br>3. Pemilihan Mode Anonim<br>4. Unggah Bukti Berkas<br>5. Pelacakan Tiket Real-Time | - Kemudahan alur pengisian form (*PEOU*)<br>- Rasa aman atas kerahasiaan data (*PU*)<br>- Kejelasan status tiket aduan (*SUS*)<br>- Kenyamanan visual Liquid Glass (*SUS*) |
| **Guru BK / Admin** | 1. Login Petugas Terproteksi<br>2. Pemantauan Dashboard & Notifikasi Lonceng<br>3. Tinjauan Rekomendasi Triase AI<br>4. Mutasi Status & Verifikasi Berkas<br>5. Validasi Jejak Riwayat (*Audit Trail*) | - Efektivitas bantuan triase AI (*PU*)<br>- Efisiensi pemantauan kasus baru (*PU*)<br>- Kemudahan navigasi sidebar & navbar (*PEOU*)<br>- Keyakinan terhadap integritas audit trail (*SUS*) |
