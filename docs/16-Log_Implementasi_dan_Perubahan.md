# 📋 Log Perubahan & Perkembangan Sistem SIGAP

> **Catatan Hidup (Living Document)**  
> Berkas ini mencatat seluruh riwayat penambahan, modifikasi, dan perbaikan kode pada sistem SIGAP. Format disusun ringkas, terstruktur, dan langsung pada poin perubahan agar mudah ditinjau sewaktu-waktu. Dokumen ini akan terus diperbarui pada setiap sesi pengerjaan berikutnya.

---

## 📌 Format Penulisan Log Sesi
Setiap sesi pengerjaan dicatat dengan format:
- **Waktu**: Hari, Tanggal Bulan Tahun | Jam (tanpa menit & detik)
- **Fokus Utama**: Sasaran pengerjaan sesi tersebut
- **Rincian Perubahan Berkas**: Tabel berkas + daftar detail penambahan/edit
- **Status Uji & Verifikasi**: Hasil build dan automated testing

---

## 📅 [Sesi 1] Senin, 19 Oktober 2026 — Jam 17 WIB
**Fokus Utama**: Integrasi Penuh Admin Dashboard, Daftar Laporan, Perubahan Status, dan Jejak Audit ke Database MySQL (Eliminasi Mock Data)

### 1. Ringkasan Perubahan Berkas

| No | Tipe Aksi | Berkas yang Diubah / Ditambah | Modul / Komponen Terkait |
|:--:|:---------:|---|---|
| 1 | `TAMBAH` | `backend/sigap-backend/app/schemas/pengaduan.py` | Skema transfer data `AuditTrailItemOut` |
| 2 | `TAMBAH` | `backend/sigap-backend/app/routers/pengaduan.py` | Endpoint `GET /api/pengaduan/audit-trail/list` |
| 3 | `TAMBAH` | `backend/sigap-backend/tests/test_pengaduan.py` | Unit test suite `TestAuditTrail` |
| 4 | `TAMBAH` | `Frontend/src/services/api.js` | Fungsi HTTP client `api.getAuditTrail()` |
| 5 | `EDIT` | `Frontend/src/context/StoreContext.jsx` | State global admin, fetch methods, token fallback, dynamic metrics |
| 6 | `EDIT` | `Frontend/src/pages/admin/AdminDashboard.jsx` | Data live table `displayCases`, indikator MySQL, tombol sinkronisasi |
| 7 | `EDIT` | `Frontend/src/pages/admin/ReportList.jsx` | Hook live fetch, indikator koneksi, tombol sinkronisasi |
| 8 | `EDIT` | `Frontend/src/pages/admin/AuditTrail.jsx` | Sinkronisasi log server, indikator koneksi, tombol sinkronisasi |
| 9 | `EDIT` | `Frontend/src/pages/student/StudentDashboard.jsx` | Sinkronisasi riwayat siswa live ke MySQL, badge koneksi |
| 10 | `EDIT` | `docs/09-Progres_Pengembangan.md` | Pembaruan status checklist Prioritas Sedang |

---

### 2. Detail Penjelasan Teknis per Berkas

#### 🔹 Backend

1. **[`backend/sigap-backend/app/schemas/pengaduan.py`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/backend/sigap-backend/app/schemas/pengaduan.py)**
   - **Tindakan**: Menambahkan skema Pydantic `AuditTrailItemOut`.
   - **Penjelasan**: Mendefinisikan format JSON response untuk jejak audit publik/admin yang berisi `id`, `pengaduan_id`, `ticket_code`, `pelaksana_nama`, `pelaksana_role`, `tipe_aksi`, `keterangan`, dan `created_at`.

2. **[`backend/sigap-backend/app/routers/pengaduan.py`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/backend/sigap-backend/app/routers/pengaduan.py)**
   - **Tindakan**: Menambahkan endpoint `GET /api/pengaduan/audit-trail/list` dengan autentikasi `get_current_admin`.
   - **Penjelasan**: Mengambil 50 log aktivitas terbaru dari tabel MySQL `audit_trail`, menggabungkannya dengan nomor tiket pengaduan dan nama admin serta jabatannya (`admin.jabatan`, misal: "Guru BK"). Diletakkan sebelum `/{pengaduan_id}` untuk mencegah benturan rute di FastAPI.

3. **[`backend/sigap-backend/tests/test_pengaduan.py`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/backend/sigap-backend/tests/test_pengaduan.py)**
   - **Tindakan**: Menambahkan class test `TestAuditTrail`.
   - **Penjelasan**: Menguji keamanan endpoint jejak audit: memastikan `401 Unauthorized` jika diakses tanpa token, dan `200 OK` dengan payload log valid saat diakses dengan token Admin.

---

#### 🔹 Frontend Services & Central State

4. **[`Frontend/src/services/api.js`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/Frontend/src/services/api.js)**
   - **Tindakan**: Menambahkan method `api.getAuditTrail(token, limit = 50)`.
   - **Penjelasan**: Fungsi HTTP fetch dengan header Bearer token untuk memanggil endpoint audit trail backend FastAPI.

5. **[`Frontend/src/context/StoreContext.jsx`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/Frontend/src/context/StoreContext.jsx)**
   - **Tindakan**:
     - Menambahkan state `dashboardSummary`.
     - Menambahkan fungsi `fetchDashboardSummary(authToken)` (panggil `GET /api/dashboard/summary`).
     - Menambahkan fungsi `fetchAdminReports(authToken, opts)` (panggil `GET /api/pengaduan` dan *merge* ke state `reports`).
     - Menambahkan fungsi `fetchAuditTrail(authToken, limit)` (panggil `GET /api/pengaduan/audit-trail/list` dan *merge* ke state `auditList`).
     - Memperbaiki `updateReportStatus()`, `approveAiCategory()`, dan `overrideCategory()` agar menggunakan token fallback `token || localStorage.getItem(TOKEN_KEY)` sehingga perubahan status dan kategori oleh Guru BK dijamin tersimpan ke MySQL meskipun browser baru di-refresh.
     - Memperbarui fungsi `getMetrics()` agar langsung membaca agregasi data dari `dashboardSummary` server jika tersedia.

---

#### 🔹 Antarmuka Frontend (UI Pages)

6. **[`Frontend/src/pages/admin/AdminDashboard.jsx`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/Frontend/src/pages/admin/AdminDashboard.jsx)**
   - **Tindakan**:
     - `useEffect` memanggil `fetchDashboardSummary()` dan `fetchAdminReports()` saat halaman dibuka.
     - Mengganti array dummy statis `queueCases` dengan komputasi dinamis `displayCases` dari data laporan riil MySQL.
     - Menambahkan indikator visual status database (🟢 *MySQL Terhubung* / ⚪ *Offline*) dan tombol **"Sinkronkan"**.
     - Mengubah link tombol aksi tabel agar dinamis mengarah ke ID laporan riil (`/admin/laporan-detail?id=${item.id}`).

7. **[`Frontend/src/pages/admin/ReportList.jsx`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/Frontend/src/pages/admin/ReportList.jsx)**
   - **Tindakan**:
     - `useEffect` otomatis memuat laporan live melalui `fetchAdminReports()`.
     - Menambahkan indikator status koneksi MySQL dan tombol **"Sinkronkan"** di header tindakan.

8. **[`Frontend/src/pages/admin/AuditTrail.jsx`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/Frontend/src/pages/admin/AuditTrail.jsx)**
   - **Tindakan**:
     - `useEffect` otomatis memuat riwayat log dari server melalui `fetchAuditTrail()`.
     - Menambahkan indikator status database MySQL dan tombol **"Sinkronkan"** di bilah filter.

9. **[`Frontend/src/pages/student/StudentDashboard.jsx`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/Frontend/src/pages/student/StudentDashboard.jsx)**
   - **Tindakan**:
     - Menggunakan `fetchRiwayatSiswa(currentUser.id, token)` untuk menampilkan aduan asli milik siswa terdaftar dari MySQL.
     - Menyediakan indikator koneksi dan tombol manual untuk sinkronisasi riwayat laporan.

---

### 3. Status Uji & Verifikasi Sistem
- **Frontend Build**: `npm run build` ➔ **Sukses 100% (Exit Code 0)**, 2.152 modul ditransformasi tanpa error.
- **Backend Test**: `pytest` ➔ **60 passed, 0 failed** dalam ~6 detik.
- **Integritas Dokumen**: Status item Prioritas Sedang di `docs/09-Progres_Pengembangan.md` telah disinkronkan ke checklist selesai (`[x]`).

---

## 📅 [Sesi 2] Senin, 19 Oktober 2026 — Jam 17 WIB
**Fokus Utama**: Penonaktifan Fallback Mock Data di Lingkungan Produksi & Sinkronisasi Jejak Audit Real-Time saat Mutasi Status

### 1. Ringkasan Perubahan Berkas

| No | Tipe Aksi | Berkas yang Diubah / Ditambah | Modul / Komponen Terkait |
|:--:|:---------:|---|---|
| 1 | `EDIT` | `Frontend/src/context/StoreContext.jsx` | Sanitasi state awal mock data, pencegahan blending mock di `fetchAdminReports` & `fetchAuditTrail`, trigger otomatis `fetchAuditTrail` pada mutasi status |
| 2 | `EDIT` | `Frontend/src/pages/admin/AdminDashboard.jsx` | Penonaktifan fallback array statis `queueCases` saat terhubung ke database atau di mode produksi, penambahan pesan data kosong bersih |
| 3 | `EDIT` | `docs/09-Progres_Pengembangan.md` | Penyelesaian 100% item Prioritas Sedang 🟡 dan pembaruan status Fase 5 & Fase 6 menjadi selesai (✅) |

---

### 2. Detail Penjelasan Teknis per Berkas

#### 🔹 Frontend Services & Central State

1. **[`Frontend/src/context/StoreContext.jsx`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/Frontend/src/context/StoreContext.jsx)**
   - **Tindakan**:
     - Memperbarui inisialisasi state `reports` dan `auditList` agar tidak lagi memaksakan penggabungan (*forced injection*) array `INITIAL_LAPORAN` dan `INITIAL_AUDIT` saat mode produksi (`import.meta.env.PROD`).
     - Pada `fetchAdminReports()`, hasil mapping server langsung menetapkan `setReports(mappedList)` secara murni tanpa menggabungkan (*blending*) tiket mock lama tahun 2024.
     - Pada `fetchAuditTrail()`, hasil query `audit_trail` server langsung menggantikan list lama (`setAuditList(mappedList)`).
     - Menambahkan panggilan otomatis `fetchAuditTrail(activeToken)` di dalam `updateReportStatus()`, `approveAiCategory()`, dan `overrideCategory()`. Sehingga setiap kali Guru BK melakukan aksi validasi atau pengalihan status, log mutasi di MySQL langsung ditarik detik itu juga ke tampilan.

---

#### 🔹 Antarmuka Frontend (UI Pages)

2. **[`Frontend/src/pages/admin/AdminDashboard.jsx`](file:///home/afkam/SIGAP_Sistem_informasi-_Gawat_Aduan_Perundungan/Frontend/src/pages/admin/AdminDashboard.jsx)**
   - **Tindakan**:
     - Mengubah logika fallback `displayCases` agar mengembalikan array kosong (`[]`) alih-alih data contoh fiktif `queueCases` jika `isBackendConnected` bernilai `true` atau aplikasi berjalan dalam mode produksi.
     - Menambahkan baris tabel ramah pengguna jika database belum memiliki kasus: *"Belum ada pengaduan aktif yang tercatat di database MySQL."*

---

### 3. Status Uji & Verifikasi Sistem
- **Frontend Build**: `npm run build` ➔ **Sukses 100% (Exit Code 0)**, 2.152 modul dikompilasi bersih dalam 17.59 detik.
- **Backend Test**: `pytest` ➔ **60 passed, 0 failed** dalam 6.27 detik.
- **Status Tahapan**: Seluruh item pada **Prioritas Sedang 🟡** di `docs/09-Progres_Pengembangan.md` telah berstatus selesai (`[x]`), dan sistem kini siap melangkah ke **Prioritas Rendah 🟢** (otomasi AI NLP pipeline IndoBERT & antarmuka validasi AI).

---

*(Entri sesi berikutnya akan otomatis ditambahkan di bawah bagian ini)*
