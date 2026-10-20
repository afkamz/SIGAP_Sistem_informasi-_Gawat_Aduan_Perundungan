# Aturan Otomatis AI Pengembangan Proyek SIGAP (Gemini / Antigravity Guidelines)

Lihat dan ikuti seluruh protokol pada [`AGENTS.md`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/AGENTS.md).

### Ringkasan Protokol Wajib:
1. **Awal Tugas**: Selalu baca [`docs/09-Progres_Pengembangan.md`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/docs/09-Progres_Pengembangan.md) terlebih dahulu untuk mengecek status dan prioritas berikutnya.
2. **Pengujian**: Selalu jalankan `npm run build` di `Frontend/` dan `./venv/bin/pytest` di `backend/sigap-backend/`.
3. **Akhir Tugas**: Selalu update otomatis checklist di [`docs/09-Progres_Pengembangan.md`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/docs/09-Progres_Pengembangan.md) dan append log sesi baru di [`docs/16-Log_Implementasi_dan_Perubahan.md`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/docs/16-Log_Implementasi_dan_Perubahan.md) dengan format ringkas:
   - Header: `## 📅 [Sesi X] <Hari>, <Tanggal> <Bulan> <Tahun> — Jam <XX> WIB` (tanpa menit & detik).
   - Fokus Utama (1-2 kalimat).
   - Tabel ringkasan berkas (`TAMBAH`/`EDIT`, path, modul) — *tanpa detail penjelasan teknis per berkas*.
   - Status build & test.

