# Aturan Otomatis AI Pengembangan Proyek SIGAP (AI Guidelines & Workflow Protocol)

Instruksi ini mengikat seluruh asisten AI (Google Antigravity, Gemini CLI, Cursor, Claude Code, GitHub Copilot, dsb.) yang bekerja pada repositori SIGAP ini, baik di komputer ini maupun di komputer kolaborator/teman setelah melakukan `git pull`.

---

## 🎯 Protokol Alur Kerja Wajib (Mandatory Workflow Protocol)

Setiap asisten AI yang menerima instruksi dari pengguna **WAJIB** menjalankan 3 langkah berikut secara otomatis:

### 1. Langkah Awal: Pengecekan Status Proyek (Sebelum Menulis Kode)
Sebelum memulai implementasi fitur, perbaikan bug, atau tugas baru:
- **Buka dan baca [`docs/09-Progres_Pengembangan.md`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/docs/09-Progres_Pengembangan.md)**.
- Identifikasi status capaian terkini:
  - Apa saja yang sudah selesai (`[x]`).
  - Apa yang sedang berlangsung (`🔄`).
  - Item prioritas apa yang harus dieksekusi berikutnya (Prioritas Tinggi 🔴, Prioritas Sedang 🟡, Prioritas Rendah 🟢).
- **Prinsip Anti-Mock**: Jangan membuat klaim palsu atau data dummy statis. Semua progres harus nyata terhubung ke kode aktif (FastAPI + MySQL + React).

---

### 2. Langkah Pengujian & Verifikasi (Setelah Menulis Kode)
Setelah melakukan penambahan atau perubahan kode:
1. **Frontend**: Jalankan `npm run build` di direktori `Frontend/` dan pastikan build berhasil (**exit code 0** tanpa error).
2. **Backend**: Jalankan `./venv/bin/pytest` di direktori `backend/sigap-backend/` dan pastikan seluruh test suite **lulus 100%**.

---

### 3. Langkah Akhir: Pembaruan Otomatis Dokumen Progres & Log Perubahan
Setiap kali ada penambahan atau pengubahan kode/fitur yang selesai diuji, AI **WAJIB** langsung memperbarui 2 berkas dokumentasi berikut tanpa perlu diminta ulang oleh pengguna:

#### A. Update Berkas [`docs/09-Progres_Pengembangan.md`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/docs/09-Progres_Pengembangan.md)
- Tandai checklist yang telah selesai dengan mengubah `[ ]` menjadi `[x]`.
- Perbarui tabel fase/status jika ada kemajuan tahapan.

#### B. Update Berkas [`docs/16-Log_Implementasi_dan_Perubahan.md`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/docs/16-Log_Implementasi_dan_Perubahan.md)
Tambahkan entri sesi baru di bagian paling bawah berkas dengan mengikuti format standar ringkas:
1. **Header Sesi**:
   ```markdown
   ## 📅 [Sesi X] <Hari>, <Tanggal> <Bulan> <Tahun> — Jam <XX> WIB
   ```
   *(PENTING: Tuliskan Hari, Tanggal, Bulan, Tahun, dan Jam saja. DILARANG mencantumkan menit dan detik).*
2. **Fokus Utama**: 1-2 kalimat ringkas mengenai tujuan dan sasaran sesi tersebut.
3. **Tabel Ringkasan Perubahan Berkas**:
   Tabel dengan kolom: `No`, `Tipe Aksi` (`TAMBAH` / `EDIT`), `Berkas yang Diubah / Ditambah`, dan `Modul / Komponen Terkait`.
   *(PENTING: Jangan menyertakan detail penjelasan teknis per berkas / sub-poin Tindakan & Penjelasan untuk menjaga dokumen tetap padat dan ringkas).*
4. **Status Uji & Verifikasi Sistem**:
   Catatan hasil build frontend (`npm run build`) dan hasil test backend (`pytest`).

---

## 🔒 Kebijakan Keamanan & Integritas Kode
- Pertahankan struktur folder resmi: `Frontend/`, `backend/sigap-backend/`, `docs/`.
- Jangan menghapus komentar kode atau dokumentasi yang tidak berkaitan.
- Pastikan setiap endpoint backend dilindungi JWT & CORS sesuai `.env`.
- Semua bukti berkas aduan wajib melalui validasi MIME, magic bytes, batas ukuran 10 MB, dan penamaan UUID aman.

