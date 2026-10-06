# Kendala dan Keputusan Sistem SIGAP

Dokumen ini mencatat kendala teknis dan keputusan desain selama pengembangan sistem SIGAP. Catatan ini mencakup frontend, backend, database, dataset, AI, keamanan, dan deployment.

## 1. Ringkasan Keputusan Utama

| Area | Keputusan |
|---|---|
| Arsitektur | Menggunakan React/Vite untuk frontend dan FastAPI untuk backend. |
| Database | MySQL menjadi target database utama; SQLite dapat digunakan untuk pengembangan lokal/testing. |
| Autentikasi | Menggunakan JWT dengan password yang di-hash menggunakan bcrypt. |
| Pengguna | Memisahkan portal siswa/pelapor dan portal admin/Guru BK. |
| External data | Menggunakan file CSV lokal sebagai seed data pada fase awal, bukan live sync API pemerintah. |
| AI | AI hanya memberi rekomendasi; kategori final tetap divalidasi admin. |
| Status laporan | Status wajib bergerak berurutan: Menunggu → Diverifikasi → Ditindaklanjuti → Selesai. |
| Data anonim | Identitas pelapor tidak ditampilkan pada response publik dan laporan anonim. |
| Deployment | Deployment dilakukan setelah integrasi penuh, testing, dan finalisasi konfigurasi. |

## 1.1 Tabel Kendala dan Keputusan Backend

| Area | Kendala | Keputusan | Tindak Lanjut |
|---|---|---|---|
| Struktur modul | Router dapat menjadi terlalu besar jika memuat seluruh logika sistem. | Memisahkan router, security, schema, model, AI, dan ETL. | Menjaga setiap modul memiliki tanggung jawab yang jelas. |
| Autentikasi | Admin dan siswa memiliki hak akses berbeda. | Menggunakan JWT, bcrypt, dan role pada token. | Menambahkan validasi token siswa dan role umum. |
| Kepemilikan data | Siswa berisiko mengakses laporan milik siswa lain. | Menggunakan pemeriksaan role dan ownership data. | Mengambil identitas siswa dari JWT, bukan hanya dari parameter request. |
| Status laporan | Status dapat berubah tidak berurutan. | Menggunakan state machine: Menunggu → Diverifikasi → Ditindaklanjuti → Selesai. | Menguji seluruh transisi dan menolak lompatan status. |
| Audit trail | Perubahan status dan kategori perlu dapat dilacak. | Mencatat admin, waktu, aksi, dan keterangan perubahan. | Memastikan seluruh aksi admin penting tercatat. |
| Dataset eksternal | Dataset memiliki format dan tujuan berbeda. | CSV lokal diproses melalui ETL dan dipisahkan menjadi seed data serta dataset AI. | Memvalidasi mapping, duplikasi, dan idempotency seeding. |
| Upload bukti | File dapat berisi data sensitif dan berbahaya. | Menggunakan nama file acak dan menyimpan metadata di database. | Membatasi MIME type, ekstensi, ukuran, serta akses file. |
| CORS dan konfigurasi | CORS wildcard dan secret di development tidak cocok untuk production. | CORS terbuka hanya untuk development. | Membatasi origin dan memindahkan secret ke environment variable. |
| Deployment | Server, database production, HTTPS, dan monitoring belum final. | Deployment dilakukan setelah testing dan integrasi. | Menyiapkan migration, backup, logging, HTTPS, dan smoke test. |

## 1.2 Tabel Kendala dan Keputusan Frontend

| Area | Kendala | Keputusan | Tindak Lanjut |
|---|---|---|---|
| Struktur aplikasi | Portal siswa dan admin memiliki alur serta kebutuhan tampilan berbeda. | Memisahkan `pages/student`, `pages/admin`, layout, context, services, dan charts. | Menjaga komponen tetap reusable dan tidak mencampur role. |
| Routing | Banyak halaman membutuhkan navigasi dan pembatasan akses. | Menggunakan React Router dengan route siswa dan admin. | Menambahkan route guard berdasarkan token dan role. |
| Integrasi API | Sebagian alur masih dapat menggunakan mock data/localStorage saat backend gagal. | Fallback dipakai untuk development agar UI tetap dapat diuji. | Menghapus atau menonaktifkan fallback mock pada production. |
| Session/token | Penyimpanan token di localStorage praktis, tetapi memiliki risiko XSS. | localStorage digunakan sementara untuk development. | Mempertimbangkan cookie HttpOnly, Secure, dan SameSite untuk production. |
| State request | Request dapat berada pada kondisi loading, berhasil, gagal, atau token kedaluwarsa. | Setiap alur menggunakan state loading, success, dan error. | Menambahkan feedback UI dan redirect login saat token tidak valid. |
| Kontrak API | Nama field, status, tanggal, dan format error frontend/backend harus sama. | `services/api.js` dijadikan satu jalur komunikasi ke FastAPI. | Menyamakan schema, enum status, response, dan HTTP error. |
| Dashboard dan AI | Data chart, seed, confidence, dan cluster berasal dari backend. | Tampilan mengambil data dari endpoint API, bukan hanya mock data. | Menghubungkan seluruh widget dashboard ke response API. |
| Responsive UI | Portal siswa berfokus mobile, admin berfokus desktop. | Menggunakan layout responsive dengan pola tampilan terpisah. | Menguji mobile, tablet, desktop, tabel, form, dan chart. |
| Deployment frontend | URL API, hosting, routing SPA, dan environment production belum final. | Deployment dilakukan setelah testing dan integrasi selesai. | Menjalankan build production, mengatur API URL, hosting, dan smoke test. |

## 1.3 Rencana Pengembangan Minggu Depan

Bagian ini merupakan catatan rencana yang akan ditunjukkan kepada dosen. Tampilan awal **login, register, dashboard user, dan dashboard admin** sudah menjadi dasar pekerjaan. Fokus minggu depan adalah memperbaiki dan menyempurnakan tampilan tersebut. Setelah UI diperbaiki dan kebutuhan tampilannya lebih jelas, backend menyesuaikan endpoint, struktur data, autentikasi, dan response API.

### Asumsi Pengembangan

- **User** yang dimaksud adalah siswa/pelapor.
- Siswa dapat melakukan registrasi menggunakan NISN, nama, sekolah, dan kata sandi.
- Admin dapat melakukan login menggunakan NIP dan kata sandi.
- Registrasi admin tidak dibuka sebagai registrasi publik; akun admin dibuat melalui seed data atau dikelola oleh administrator sistem.
- Dashboard siswa menampilkan profil singkat, ringkasan laporan, riwayat laporan, dan status tiket.
- Dashboard admin menampilkan ringkasan laporan, distribusi status/kategori, laporan terbaru, dan akses ke detail laporan.
- Tampilan login, register, dan dashboard user/admin sudah tersedia sebagai rancangan awal.
- Perbaikan UI dilakukan berdasarkan hasil pengecekan internal dan masukan dosen.
- Backend menyesuaikan struktur request dan response dengan UI yang sudah diperbaiki.
- Integrasi awal menggunakan API lokal FastAPI dan database pengembangan. Deployment belum menjadi target minggu depan.

### A. Perbaikan Tampilan Frontend

**Kata kunci:** evaluasi UI, perbaikan layout, konsistensi, responsive, validasi form, user experience.

| Prioritas | Pekerjaan | Hasil yang Diharapkan |
|---|---|---|
| 1 | Mengevaluasi tampilan login dan register user | Memeriksa susunan form, ukuran input, label, tombol, pesan error, dan kemudahan penggunaan. |
| 2 | Mengevaluasi tampilan login admin | Memastikan tampilan portal admin berbeda secara jelas dan tetap konsisten dengan design system. |
| 3 | Memperbaiki dashboard user | Merapikan ringkasan laporan, riwayat, status tiket, navigasi, dan tombol buat laporan. |
| 4 | Memperbaiki dashboard admin | Merapikan kartu statistik, tabel/daftar laporan, kategori, status, dan navigasi detail. |
| 5 | Menyesuaikan responsive layout | Memastikan login, register, dan dashboard dapat digunakan pada mobile, tablet, dan desktop. |
| 6 | Menambahkan state tampilan | Menyiapkan tampilan loading, error, data kosong, berhasil, dan session kedaluwarsa. |
| 7 | Menyesuaikan mock data dengan kebutuhan UI | Menyamakan field mock data dengan data yang nantinya dikirim oleh backend. |

**Output frontend minggu depan:**

- Tampilan login dan register user/siswa diperbaiki.
- Tampilan login admin diperbaiki.
- Dashboard user dan dashboard admin diperbaiki berdasarkan hasil pengecekan.
- Responsive layout dan state tampilan lebih lengkap.
- UI final menjadi acuan backend untuk menentukan field dan response API.

### B. Penyesuaian Backend Berdasarkan UI

**Kata kunci:** API adjustment, API contract, JWT, authentication, role access, dashboard response, data mapping.

| Prioritas | Pekerjaan | Hasil yang Diharapkan |
|---|---|---|
| 1 | Memetakan kebutuhan dari UI yang sudah diperbaiki | Menentukan field form login/register dan informasi yang harus ditampilkan pada setiap dashboard. |
| 2 | Menyesuaikan endpoint login user dan admin | Login menerima NISN/NIP dan kata sandi, lalu mengembalikan access token serta role. |
| 3 | Menyesuaikan endpoint register user | Data siswa divalidasi, password di-hash bcrypt, dan NISN tidak boleh duplikat. |
| 4 | Menentukan mekanisme akun admin | Admin dibuat melalui seed data atau proses internal; tidak ada register admin publik. |
| 5 | Menyesuaikan validasi JWT dan role | Token, role, dan profil user dapat digunakan untuk membatasi akses dashboard. |
| 6 | Menyesuaikan response dashboard user | Mengembalikan profil, ringkasan, riwayat laporan, dan status tiket sesuai UI final. |
| 7 | Menyesuaikan response dashboard admin | Mengembalikan statistik, status, kategori, laporan terbaru, dan data yang diperlukan UI. |
| 8 | Menyusun kontrak API final | Menyamakan nama field, tipe data, response sukses, error, dan format tanggal dengan frontend. |
| 9 | Menghubungkan backend dengan UI | Mengganti mock data secara bertahap dengan response FastAPI dan menguji alur utama. |

**Output backend setelah UI diperbaiki:**

- Endpoint login siswa dan admin siap dihubungkan ke frontend.
- Endpoint register siswa siap digunakan.
- Akun admin development tersedia melalui seed data.
- JWT dan role dapat digunakan untuk membatasi akses dashboard.
- Endpoint dashboard user dan admin memiliki response sesuai kebutuhan UI final.
- Struktur data backend dapat dipetakan ke komponen frontend.
- Mock data frontend mulai digantikan dengan data dari backend.
- Kontrak API dan contoh request/response sesuai UI terdokumentasi.

### Batasan Target Minggu Depan

- Fokus minggu depan adalah perbaikan tampilan login, register user/admin, dashboard user, dan dashboard admin.
- Backend menyesuaikan UI yang sudah diperbaiki, bukan membangun tampilan baru.
- AI, clustering, deployment, notifikasi, dan live sync external data belum menjadi fokus utama minggu depan.
- Dashboard masih boleh menggunakan mock data selama proses perbaikan UI.
- Status “selesai” pada tahap UI berarti tampilan sudah diperbaiki dan siap menjadi acuan integrasi, bukan berarti backend atau deployment sudah selesai.

## 2. Kendala dan Keputusan Backend

### 2.1 Pemisahan Modul Backend

**Kendala:** API, autentikasi, business logic, database, AI, dan ETL memiliki tanggung jawab berbeda. Jika seluruh logika diletakkan di router, kode sulit dirawat dan diuji.

**Keputusan:** Backend dipisahkan menjadi modul `routers`, `core/security.py`, `schemas`, `models`, `ai`, dan `data`.

**Poin yang dikerjakan:**
- `routers/auth.py` menangani register dan login.
- `routers/pengaduan.py` menangani laporan, status, bukti, dan audit.
- `routers/dashboard.py` menangani analytics.
- `core/security.py` menangani hash password, JWT, dan dependency autentikasi.
- `schemas/` memvalidasi request dan response.
- `models/` menyimpan struktur tabel dan relasi database.
- `ai/` menangani preprocessing, embedding, rekomendasi, dan clustering.
- `data/` menangani ETL serta import dataset.

### 2.2 Autentikasi JWT dan Role

**Kendala:** Sistem memiliki dua jenis pengguna, yaitu siswa dan admin, dengan hak akses berbeda. Token yang tidak divalidasi dengan benar dapat membuka data laporan sensitif.

**Keputusan:** Login menghasilkan JWT yang memuat `sub`, `role`, dan `exp`. Password tidak disimpan dalam bentuk teks biasa.

**Poin yang dikerjakan:**
- Login admin menggunakan NIP.
- Login siswa menggunakan NISN.
- Password di-hash dan diverifikasi menggunakan bcrypt.
- Token dikirim melalui header `Authorization: Bearer <token>`.
- Endpoint admin menggunakan dependency `get_current_admin`.
- Request dengan token rusak atau kedaluwarsa dikembalikan sebagai HTTP 401.

**Tindak lanjut:** Validasi token siswa, dependency role umum, dan pemeriksaan kepemilikan laporan perlu disempurnakan sebelum production.

### 2.3 Hak Akses dan Kepemilikan Data

**Kendala:** Endpoint riwayat laporan harus memastikan siswa hanya dapat melihat laporan miliknya sendiri. Menerima `siswa_id` langsung dari client tanpa verifikasi dapat menyebabkan akses ke data siswa lain.

**Keputusan:** Data admin dan siswa dipisahkan melalui role dan ownership check.

**Tindak lanjut:**
- Ambil identitas siswa dari JWT, bukan hanya dari parameter URL.
- Tolak request jika `siswa_id` tidak sesuai dengan identitas token.
- Batasi endpoint dashboard, daftar laporan, audit trail, validasi kategori, dan perubahan status untuk admin.

### 2.4 Upload Bukti Pendukung

**Kendala:** File bukti dapat mengandung data sensitif dan berisiko menjadi celah keamanan jika ukuran, tipe, atau nama file tidak dibatasi.

**Keputusan:** File disimpan dengan nama acak dan metadata path disimpan di database.

**Tindak lanjut:**
- Batasi ekstensi dan MIME type.
- Batasi ukuran file.
- Jangan menggunakan nama file asli sebagai nama penyimpanan.
- Jangan menampilkan path server pada response publik.
- Pertimbangkan object storage untuk production.

### 2.5 Status Laporan dan Audit Trail

**Kendala:** Admin dapat mengubah status secara tidak berurutan sehingga riwayat penanganan tidak valid.

**Keputusan:** Status menggunakan state machine berurutan:

```text
Menunggu → Diverifikasi → Ditindaklanjuti → Selesai
```

Setiap perubahan status dan validasi kategori dicatat dalam audit trail bersama admin, waktu, aksi, dan keterangan.

### 2.6 Database MySQL dan SQLite

**Kendala:** MySQL sesuai target sistem, tetapi konfigurasi database production belum tersedia selama pengembangan lokal.

**Keputusan:** MySQL menjadi target utama, sedangkan SQLite digunakan sebagai alternatif lokal/testing bila diperlukan.

**Tindak lanjut:**
- Menyediakan environment variable untuk URL database.
- Menjalankan migration/seed pada database production.
- Menguji tipe data dan relasi pada MySQL sebelum deployment.
- Menyiapkan backup dan prosedur pemulihan database.

### 2.7 CORS dan Environment

**Kendala:** CORS saat ini menggunakan `allow_origins=["*"]` agar frontend lokal dapat berkomunikasi dengan backend. Konfigurasi ini tidak sesuai untuk production.

**Keputusan:** CORS terbuka hanya untuk development.

**Tindak lanjut:**
- Mengganti origin wildcard dengan domain frontend yang sah.
- Memindahkan JWT secret, database URL, dan konfigurasi lain ke environment variable.
- Menonaktifkan konfigurasi development saat deployment.

## 3. Kendala dan Keputusan Frontend

### 3.1 Struktur React Modular

**Kendala:** Halaman siswa dan admin memiliki kebutuhan UI yang berbeda, tetapi tetap membutuhkan komponen layout dan state yang konsisten.

**Keputusan:** Frontend dipisahkan menjadi `pages/student`, `pages/admin`, `components/layout`, `components/charts`, `context`, `services`, dan `data`.

**Poin yang dikerjakan:**
- React Router mengatur route siswa dan admin.
- Layout admin menggunakan sidebar dan dashboard.
- Portal siswa menggunakan header, footer, form, dashboard, dan tracking.
- `StoreContext` menyimpan session, token, role, laporan, dan audit lokal.
- `services/api.js` menjadi satu jalur komunikasi ke FastAPI.
- Komponen chart dipisahkan dari halaman dashboard.

### 3.2 Integrasi API Belum Penuh

**Kendala:** Struktur service API sudah tersedia, tetapi beberapa alur frontend masih menyimpan data lokal dan menggunakan mock data.

**Keputusan sementara:** Frontend tetap dapat digunakan dalam mode development melalui `localStorage` dan `mockData` ketika backend tidak merespons.

**Dampak:**
- Tampilan dapat diuji tanpa menjalankan backend.
- Data lokal dapat berbeda dari data database sebenarnya.
- Keberhasilan request belum selalu berarti data production sudah tersimpan.
- Fallback dapat menyembunyikan masalah integrasi jika tidak dipantau.

**Tindak lanjut:**
- Bedakan mode development/mock dengan mode API production.
- Jangan menggunakan fallback mock sebagai perilaku production.
- Tampilkan notifikasi yang jelas ketika API gagal.
- Sinkronkan ticket code, status, ID laporan, dan response backend dengan state frontend.

### 3.3 Session dan Penyimpanan Token

**Kendala:** Token dan sebagian state disimpan di `localStorage`, yang praktis untuk prototipe tetapi memiliki risiko jika aplikasi terkena XSS.

**Keputusan sementara:** `localStorage` digunakan untuk mempertahankan session pada pengembangan frontend.

**Tindak lanjut production:**
- Pertimbangkan cookie `HttpOnly`, `Secure`, dan `SameSite` untuk token.
- Hapus token saat logout atau token kedaluwarsa.
- Jangan menyimpan data sensitif pelapor di localStorage.
- Tambahkan route guard untuk halaman admin dan halaman siswa.

### 3.4 Error Handling dan Loading State

**Kendala:** Request API membutuhkan kondisi loading, sukses, gagal, token kedaluwarsa, dan data kosong. Tanpa status ini, user dapat mengira laporan berhasil padahal request gagal.

**Keputusan:** Setiap alur API harus memiliki state `loading`, `success`, dan `error`.

**Poin yang perlu diselesaikan:**
- Menampilkan loading state pada submit, login, tabel, dan dashboard.
- Menampilkan pesan error yang mudah dipahami.
- Mengarahkan user ke login ketika token tidak valid.
- Menyediakan empty state untuk dashboard dan daftar laporan.

### 3.5 Responsive dan Konsistensi UI

**Kendala:** Portal siswa berfokus pada mobile, sedangkan portal admin berfokus pada desktop. Layout tabel, form, chart, dan sidebar harus tetap terbaca pada ukuran layar berbeda.

**Keputusan:** Menggunakan layout responsive dan memisahkan pola tampilan siswa/admin.

**Tindak lanjut:**
- Uji mobile, tablet, dan desktop.
- Pastikan tabel admin dapat di-scroll atau berubah menjadi tampilan kartu.
- Pastikan form tidak terpotong pada layar kecil.
- Pastikan chart memiliki ukuran stabil dan label tidak bertabrakan.

## 4. Kendala Dataset dan External Data

### 4.1 Banyak Dataset dengan Format Berbeda

**Kendala:** Dataset kasus agregat dan dataset teks memiliki struktur, delimiter, label, dan tujuan penggunaan yang berbeda.

**Keputusan:** Dataset dikelompokkan menjadi dua jalur:

1. **CSV domestik/seed data** untuk dashboard dan konteks statistik.
2. **Dataset teks** untuk preprocessing dan modul AI.

**Dataset yang digunakan:**
- PPKS Anak Yang Menjadi Korban Tindak Kekerasan.
- Jumlah Laporan Pengaduan Kasus Kekerasan terhadap Anak.
- Kasus Kekerasan terhadap Anak di Aceh.
- Data Prioritas Nasional 2023 DKP3A Provinsi Kalimantan Timur Tahun 2021–2023.
- Cyberbullying Bahasa Indonesia dengan slang.
- Cleaned Indonesian Cyberbullying Dataset.
- Indonesian Hate Speech Detection Dataset.

### 4.2 Tidak Ada Live Sync Pemerintah

**Kendala:** Sistem pemerintah seperti Satu Data Indonesia, Rapor Pendidikan, dan SIMFONI PPA tidak digunakan sebagai koneksi live pada fase awal. Akses otomatis juga dapat memiliki keterbatasan dan data bersifat historis/agregat.

**Keputusan:** Dataset lokal di folder `dataset/` diproses secara manual/one-time melalui ETL dan seed ke database.

**Dampak:** Dashboard tidak otomatis memperbarui data pemerintah.

**Tindak lanjut:** Jika dibutuhkan pada fase lanjutan, tambahkan scheduler, API client resmi, validasi perubahan skema, retry, dan monitoring sinkronisasi.

## 5. Kendala dan Keputusan AI

### 5.1 Dataset Tidak Langsung Memiliki Tujuh Label Resmi

**Kendala:** Dataset cyberbullying/hate speech berasal dari media sosial dan tidak langsung memiliki label tujuh kategori kasus sekolah.

**Keputusan:** Dataset teks digunakan sebagai pendukung preprocessing/representasi bahasa, sedangkan seed narasi tujuh kategori digunakan untuk membangun centroid kategori.

**Dampak:** Hasil AI adalah rekomendasi, bukan keputusan otomatis.

### 5.2 Perbedaan Bahasa Media Sosial dan Laporan Sekolah

**Kendala:** Slang, singkatan, dan gaya bahasa Twitter/media sosial berbeda dengan narasi laporan siswa di sekolah.

**Keputusan:** Preprocessing dan normalisasi dilakukan sebelum embedding, serta admin tetap memvalidasi hasil rekomendasi.

**Tindak lanjut:** Evaluasi precision/recall per kategori menggunakan data laporan sekolah yang telah divalidasi.

### 5.3 Risiko False Positive dan False Negative

**Kendala:** Rekomendasi kategori yang salah dapat memengaruhi prioritas penanganan kasus sensitif.

**Keputusan:** Sistem menampilkan confidence score dan membedakan rekomendasi AI dari kategori final admin secara visual.

**Tindak lanjut:**
- Tetapkan threshold confidence melalui pengujian.
- Tandai skor rendah sebagai perlu tinjauan manual.
- Simpan sumber keputusan: AI disetujui atau override admin.
- Jangan mengubah status kasus secara otomatis berdasarkan output AI.

## 6. Kendala Integrasi Frontend dan Backend

**Kendala:** Frontend menggunakan format state lokal, sedangkan backend menggunakan schema dan enum database. Perbedaan nama field atau status dapat menyebabkan data gagal dipetakan.

**Keputusan:** Kontrak API menjadi acuan bersama untuk payload, response, status, error, dan autentikasi.

**Poin yang harus disamakan:**
- Nama field kategori, deskripsi, mode anonim, siswa, dan ticket code.
- Format status laporan pada frontend dan backend.
- Format tanggal dan timezone.
- Response error HTTP 401, 403, 404, dan 422.
- ID laporan backend dengan ID laporan pada state frontend.
- Upload file melalui `multipart/form-data`.

## 7. Kendala Deployment

**Kendala:** Hosting frontend, server backend, database production, domain, HTTPS, dan environment variable belum ditentukan seluruhnya.

**Keputusan:** Deployment diposisikan sebagai fase akhir setelah testing dan integrasi selesai.

**Poin yang harus dipersiapkan:**
- Hosting frontend dan konfigurasi routing SPA.
- Server backend dan proses menjalankan FastAPI.
- Database MySQL production dan backup.
- Domain/API URL production.
- HTTPS dan CORS terbatas.
- Logging, monitoring, dan smoke test.

## 8. Urutan Penyelesaian Kendala

1. Selesaikan integrasi API utama dan hilangkan ketergantungan mock pada production.
2. Lengkapi validasi token siswa dan ownership check.
3. Perketat validasi upload bukti dan CORS.
4. Samakan kontrak API, enum status, dan format response.
5. Jalankan testing frontend, backend, integrasi, dan UAT.
6. Siapkan environment production, deployment, HTTPS, backup, dan monitoring.

> Dokumen ini perlu diperbarui setiap kali keputusan teknis berubah atau kendala sudah diselesaikan.
