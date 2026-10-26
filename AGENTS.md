# Aturan Otomatis AI Pengembangan Proyek SIGAP (AI Guidelines & Workflow Protocol)

Instruksi ini mengikat seluruh asisten AI (Google Antigravity, Gemini CLI, Cursor, Claude Code, GitHub Copilot, dsb.) yang bekerja pada repositori SIGAP ini, baik di komputer ini maupun di komputer kolaborator/teman setelah melakukan `git pull`.

---

## 🎯 Protokol Alur Kerja Wajib (Mandatory Workflow Protocol)

Setiap kali ada penambahan atau pengubahan kode/fitur/berkas, AI **WAJIB** langsung memperbarui berkas log dokumentasi berikut:

### Pembaruan Otomatis Log Perubahan ([`docs/16-Log_Implementasi_dan_Perubahan.md`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/docs/16-Log_Implementasi_dan_Perubahan.md))
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

---

## 🔒 Kebijakan Keamanan & Integritas Kode
- Pertahankan struktur folder resmi: `Frontend/`, `backend/sigap-backend/`, `docs/`.
- Jangan menghapus komentar kode atau dokumentasi yang tidak berkaitan.
- Pastikan setiap endpoint backend dilindungi JWT & CORS sesuai `.env`.
- Semua bukti berkas aduan wajib melalui validasi MIME, magic bytes, batas ukuran 10 MB, dan penamaan UUID aman.

