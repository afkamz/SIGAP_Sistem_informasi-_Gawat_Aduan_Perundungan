# 📊 Materi Presentasi PPT — Proyek SIGAP
> **Durasi Presentasi:** 10–15 Menit | **Tim:** 3 Orang | **Slide:** 12 Slide

---

## 🎨 PROMPT CANVA AI (Copy-Paste Langsung ke Canva AI)

> **Cara Pakai:** Buka Canva → Klik "Buat Desain" → Pilih "Presentasi" → Klik tombol **"Magic Design"** atau **"AI"** → Paste prompt berikut:

```
Create a professional and modern 12-slide presentation in Indonesian language for a university student project titled "SIGAP – Sistem Informasi Pengaduan Perundungan dan Kekerasan Pelajar". 

Design style: Clean, modern, tech-forward with a blue and white color scheme accented with orange highlights. Use sans-serif fonts. Include relevant icons for education, security, AI, and reporting.

Slide structure:
1. Cover slide: Title "SIGAP", Subtitle "Sistem Informasi Pengaduan Perundungan dan Kekerasan Pelajar", with a tagline "Laporkan. Anonim. Aman. Cepat Ditangani."
2. Slide "Fenomena Gunung Es" – The Iceberg Problem: Statistics about unreported bullying cases in Indonesian schools, fear of retaliation, social stigma
3. Slide "Masalah yang Kami Pecahkan" – 4 pain points: underreporting, manual triage, no anonymous channel, no pattern detection
4. Slide "Apa itu SIGAP?" – Definition, mission, and 1-line value proposition
5. Slide "Siapa Penggunanya?" – 2 user types: Siswa (reporter) and Guru BK / Admin (case manager) with icons
6. Slide "4 Pilar Teknologi SIGAP" – Anonymous dual-mode reporting, IndoBERT AI NLP triage, HDBSCAN hotspot clustering, Human-in-the-Loop audit trail
7. Slide "Alur Pelaporan Siswa" – Step by step: Open SIGAP → Choose Privacy Mode → Fill Report Form → Upload Evidence → Get Ticket Code → Track Status
8. Slide "Dashboard & Alur Kerja Guru BK" – Step by step: Login → View Dashboard → Review AI Recommendation → Approve or Override → Update Case Status → Audit Trail recorded
9. Slide "Fitur Unggulan" – 3-column card layout: Anonim Murni, Tiket Pelacak, Triase AI IndoBERT, Override Human-in-the-Loop, Peta Rawan HDBSCAN, Audit Trail Permanen
10. Slide "Arsitektur Sistem" – Simple tech stack diagram: React Frontend ↔ FastAPI Backend ↔ MySQL Database, with AI module (IndoBERT + HDBSCAN)
11. Slide "Mengapa SIGAP Berbeda?" – Comparison table: SIGAP vs WhatsApp Hotline vs Laporan Manual Buku
12. Closing slide: "SIGAP – Teknologi untuk Sekolah yang Lebih Aman" with team names and thank you message

Each slide should have a clear heading, 3–5 bullet points maximum, and use visual icons or simple diagrams where appropriate.
```

---

## 📋 MATERI PER SLIDE + NARASI PRESENTER

> 🗣️ Blok **NARASI PRESENTER** adalah skrip yang dibacakan/disampaikan secara lisan oleh pembicara.
> Tidak perlu dibaca kata per kata — jadikan sebagai panduan alur bicara yang natural.

---

### SLIDE 1 — Cover / Judul
**Pembicara: Orang ke-1 (Pembuka)**

**Konten Slide:**
- Judul besar: **SIGAP**
- Subjudul: *Sistem Informasi Pengaduan Perundungan dan Kekerasan Pelajar*
- Tagline: *"Laporkan. Anonim. Aman. Cepat Ditangani."*
- Nama ketiga anggota tim

---

> 🗣️ **NARASI PRESENTER:**
>
> *"Selamat pagi / siang, Bapak/Ibu Dosen dan teman-teman semua.*
>
> *Kami dari kelompok [nama kelompok], yang terdiri dari [Nama 1], [Nama 2], dan [Nama 3]. Pada kesempatan kali ini, kami akan mempresentasikan proyek kami yang bernama SIGAP — kependekan dari Sistem Informasi Pengaduan Perundungan dan Kekerasan Pelajar.*
>
> *SIGAP adalah sebuah platform digital yang kami rancang khusus untuk mengatasi permasalahan perundungan dan kekerasan di lingkungan sekolah. Tagline kami: Laporkan. Anonim. Aman. Cepat Ditangani — dan itulah persis yang akan kami buktikan melalui presentasi ini.*
>
> *Baik, langsung saja kita mulai. Saya akan memulai dengan menjelaskan latar belakang masalah yang mendasari lahirnya proyek ini."*

---

### SLIDE 2 — Fenomena Gunung Es: Realita Perundungan di Sekolah
**Pembicara: Orang ke-1**

**Konten Slide:**
- 🔴 Perundungan di sekolah ibarat **gunung es** — yang terlihat hanya sebagian kecilnya.
- Mayoritas kasus **tidak pernah dilaporkan** *(underreporting)* oleh korban atau saksi.
- Hambatan psikologis yang membuat siswa diam:
  - 😨 Takut dibalas / diintimidasi pelaku *(fear of retaliation)*
  - 😰 Takut dicap "tukang ngadu" atau dikucilkan teman *(social stigma)*
  - 😶 Malu menceritakan kejadian secara tatap muka *(shame & retraumatization)*
  - 🤷 Tidak percaya laporan akan ditindaklanjuti *(distrust in system)*

---

> 🗣️ **NARASI PRESENTER:**
>
> *"Bayangkan sebuah gunung es yang mengapung di lautan. Yang kita lihat di permukaan hanya puncak kecilnya — tapi bagian terbesarnya justru tersembunyi di bawah air. Itulah gambaran perundungan di sekolah kita hari ini.*
>
> *Banyak sekali kasus perundungan dan kekerasan yang terjadi, tapi tidak pernah dilaporkan. Fenomena ini oleh para peneliti disebut underreporting — kasus yang terpendam diam-diam tanpa penanganan.*
>
> *Mengapa siswa tidak berani lapor? Ada empat hambatan psikologis utama yang kami identifikasi dari riset. Pertama, fear of retaliation — siswa takut jika melapor, pelaku justru akan membalasnya lebih keras. Kedua, social stigma — di kalangan remaja, melapor ke guru bisa membuat seseorang dicap 'cepu' atau 'tukang ngadu' dan akhirnya dikucilkan teman-temannya. Ketiga, rasa malu — terutama untuk kasus kekerasan yang sensitif, berbicara langsung tatap muka kepada guru BK sangat berat bagi korban. Dan keempat, ketidakpercayaan — siswa sering kali merasa percuma lapor karena yakin kasusnya tidak akan benar-benar ditangani.*
>
> *Hambatan-hambatan inilah yang menjadi akar masalah yang ingin kami selesaikan dengan SIGAP."*

---

### SLIDE 3 — Masalah yang Harus Diselesaikan
**Pembicara: Orang ke-1**

**Konten Slide:**

| # | Masalah | Siapa yang Terdampak |
|---|---------|----------------------|
| 1 | Tidak ada saluran pelaporan yang menjamin privasi dan anonimitas | Siswa (Pelapor) |
| 2 | Narasi aduan menggunakan bahasa gaul/informal, sulit diklasifikasi manual | Guru BK |
| 3 | Tidak ada cara mendeteksi pola perundungan berulang & lokasi rawan | Pihak Sekolah |
| 4 | Tidak ada sistem penanganan transparan dan akuntabel | Semua Pihak |

---

> 🗣️ **NARASI PRESENTER:**
>
> *"Dari latar belakang tadi, kami merumuskan empat masalah konkret yang harus kami selesaikan.*
>
> *Masalah pertama, dari sisi siswa: tidak ada saluran pelaporan yang benar-benar menjamin privasi dan anonimitas. Melapor lewat buku aduan atau langsung ke guru BK mengharuskan siswa membuka identitasnya — ini langsung menghancurkan keberaniannya untuk melapor.*
>
> *Masalah kedua, dari sisi guru BK: narasi aduan yang masuk biasanya ditulis dengan bahasa sehari-hari, bahasa gaul, atau bahkan bahasa campur. Sangat sulit bagi guru BK untuk secara manual mengklasifikasikan jenis kasusnya apakah ini perundungan verbal, fisik, atau siber — apalagi jika laporan menumpuk.*
>
> *Masalah ketiga, dari sisi sekolah: tidak ada cara untuk mendeteksi apakah satu pelaku sudah berulang kali melakukan kekerasan, atau di area mana saja di sekolah yang paling sering terjadi insiden. Tanpa data ini, langkah pencegahan tidak bisa dilakukan secara tepat sasaran.*
>
> *Dan masalah keempat, yang berdampak ke semua pihak: tidak ada sistem yang membuat penanganan kasus menjadi transparan dan akuntabel. Siapa yang menangani? Sudah sampai mana prosesnya? Tidak ada yang bisa menjawab dengan pasti.*
>
> *Nah, keempat masalah inilah yang SIGAP dirancang untuk menjawabnya."*

---

### SLIDE 4 — Apa itu SIGAP?
**Pembicara: Orang ke-1**

**Konten Slide:**
- **SIGAP** = *Sistem Informasi Pengaduan Perundungan dan Kekerasan Pelajar*
- Platform pelaporan digital berbasis **web responsif** (bisa diakses dari HP/laptop).
- Mengintegrasikan **kecerdasan buatan (AI)** untuk triase aduan secara objektif dan cepat.
- Prinsip utama: **privasi siswa terlindungi**, **proses aduan transparan**, **penanganan akuntabel**.
- Tersedia sebagai sistem **internal sekolah** — data tidak keluar ke pihak luar.

---

> 🗣️ **NARASI PRESENTER:**
>
> *"Jadi, apa itu SIGAP? SIGAP adalah Sistem Informasi Pengaduan Perundungan dan Kekerasan Pelajar — sebuah platform pelaporan digital yang kami bangun berbasis web responsif, artinya bisa diakses langsung dari HP atau laptop tanpa perlu mengunduh aplikasi apapun.*
>
> *Yang membuat SIGAP berbeda dari sistem aduan konvensional adalah integrasi kecerdasan buatan di dalamnya. AI membantu mengklasifikasikan jenis kasus secara otomatis, mendeteksi pola insiden, dan memvisualisasikan lokasi rawan di peta sekolah — semuanya terjadi dalam hitungan detik.*
>
> *SIGAP dibangun di atas tiga prinsip yang tidak bisa dikompromikan: privasi siswa harus terlindungi, proses penanganan aduan harus transparan sehingga pelapor tahu kasusnya sedang diproses, dan setiap tindakan guru BK harus terekam secara akuntabel.*
>
> *Satu poin penting: SIGAP dirancang sebagai sistem internal sekolah. Data aduan tidak dikirim ke server luar atau pihak ketiga manapun — semua tersimpan aman di infrastruktur sekolah sendiri."*

---

### SLIDE 5 — Target Pengguna SIGAP
**Pembicara: Orang ke-1**

**Konten Slide:**

**👤 Siswa (Pelapor)**
- Korban atau saksi perundungan / kekerasan di lingkungan sekolah.
- Melapor secara **anonim penuh** (tanpa nama, tanpa akun, tanpa rekam IP).
- Memantau status aduan kapan saja menggunakan kode tiket.

**👩‍🏫 Guru BK / Admin Sekolah (Pengelola Kasus)**
- Menerima, menelaah, dan menangani laporan aduan.
- Mendapat **bantuan rekomendasi AI** — keputusan final tetap di tangan guru.
- Akses ke dashboard analitik, peta titik rawan, dan rekam audit.

---

> 🗣️ **NARASI PRESENTER:**
>
> *"SIGAP memiliki dua jenis pengguna utama dengan peran yang berbeda.*
>
> *Pengguna pertama adalah siswa, sebagai pelapor. Siswa yang menjadi korban atau saksi perundungan bisa langsung membuka web SIGAP dan melaporkan kejadian yang mereka alami atau saksikan. Yang paling penting — mereka bisa melakukannya secara anonim penuh. Tidak perlu nama, tidak perlu buat akun, dan server kami bahkan tidak merekam alamat IP-nya. Setelah melapor, siswa mendapat kode tiket unik yang bisa digunakan untuk memantau perkembangan penanganan kasusnya kapan saja dan di mana saja.*
>
> *Pengguna kedua adalah Guru BK atau administrator sekolah, sebagai pengelola kasus. Mereka menggunakan dashboard khusus yang hanya bisa diakses dengan login terautentikasi. Di sana, mereka bisa melihat seluruh laporan yang masuk, mendapat bantuan rekomendasi kategori dari AI, mengelola status kasus secara bertahap, dan melihat visualisasi peta titik rawan di sekolah. Dan yang terpenting, semua tindakan yang mereka lakukan terekam secara otomatis dalam sistem audit trail yang tidak bisa dimanipulasi.*
>
> *Jadi SIGAP benar-benar menjembatani dua pihak ini dengan cara yang aman dan terstruktur."*

---

### SLIDE 6 — 4 Pilar Teknologi SIGAP
**Pembicara: Orang ke-2**

**Konten Slide:**

```
┌──────────────────────┐  ┌──────────────────────┐
│  1. DUAL-MODE        │  │  2. IndoBERT NLP      │
│  PELAPORAN ANONIM    │  │  + COSINE SIMILARITY  │
│  Tanpa akun, tanpa   │  │  Klasifikasi narasi   │
│  nama, tanpa IP.     │  │  bahasa gaul otomatis │
│  Tiket unik acak.    │  │  dengan embedding AI  │
└──────────────────────┘  └──────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐
│  3. HDBSCAN          │  │  4. HUMAN-IN-THE-LOOP │
│  CLUSTERING          │  │  + AUDIT TRAIL        │
│  Peta klaster titik  │  │  AI hanya rekomendasi,│
│  rawan otomatis,     │  │  keputusan final oleh │
│  tanpa tebak-k.      │  │  Guru BK. Tercatat.   │
└──────────────────────┘  └──────────────────────┘
```

---

> 🗣️ **NARASI PRESENTER:**
>
> *"Oke, sekarang izinkan saya sebagai anggota kedua menjelaskan teknologi di balik SIGAP. Sistem ini berdiri di atas empat pilar utama.*
>
> *Pilar pertama adalah Dual-Mode Pelaporan Anonim. Siswa bisa memilih dua mode: anonim murni — tanpa login, tanpa nama, tanpa rekam IP — atau terverifikasi dengan akun jika ingin mendapat pendampingan langsung. Untuk mode anonim, setelah laporan dikirim, sistem menerbitkan kode tiket acak yang unik sebagai satu-satunya pengenal bagi pelapor.*
>
> *Pilar kedua adalah NLP berbasis IndoBERT dan Cosine Similarity. IndoBERT adalah model kecerdasan buatan berbasis Transformer yang sudah dilatih khusus pada miliaran teks bahasa Indonesia. Ketika narasi aduan masuk, sistem mengubahnya menjadi representasi matematis yang disebut sentence embedding, lalu mengukur kemiripan semantiknya dengan kategori kasus yang ada menggunakan rumus cosine similarity. Hasilnya? Klasifikasi otomatis yang akurat meski siswa menulis dengan bahasa gaul.*
>
> *Pilar ketiga adalah HDBSCAN Clustering. Ini adalah algoritma pengelompokan berbasis kepadatan data. HDBSCAN otomatis menemukan pola klaster dari titik-titik lokasi insiden di peta sekolah, tanpa perlu kita tebak terlebih dahulu ada berapa kelompok. Area yang sering terjadi insiden akan terdeteksi sebagai titik rawan.*
>
> *Dan pilar keempat adalah Human-in-the-Loop dan Audit Trail. Meskipun AI memberikan rekomendasi, keputusan akhir selalu ada di tangan Guru BK. AI tidak bisa memvonis atau menetapkan sanksi sendiri. Dan setiap tindakan yang dilakukan guru BK — mulai dari verifikasi hingga penyelesaian kasus — tercatat permanen dalam sistem audit trail."*

---

### SLIDE 7 — Alur Penggunaan: Sisi Siswa
**Pembicara: Orang ke-2**

**Konten Slide:**
```
① Buka Web SIGAP
        ↓
② Pilih Mode Pelaporan
   [Anonim] ────── [Terverifikasi]
        ↓
③ Isi Formulir Kronologi
   + Waktu + Titik Lokasi Kejadian
        ↓
④ Unggah Bukti Digital
   (Foto / Screenshot / PDF — Opsional)
        ↓
⑤ Kirim Laporan → Terima Kode Tiket Unik
   Contoh: SGP-2026-9A8525
        ↓
⑥ Lacak Status Kapan Saja Pakai Tiket
   Menunggu → Diverifikasi → Ditindaklanjuti → Selesai
```

---

> 🗣️ **NARASI PRESENTER:**
>
> *"Sekarang mari kita lihat bagaimana seorang siswa menggunakan SIGAP step by step.*
>
> *Langkah pertama, siswa cukup membuka web SIGAP dari browser HP-nya — tidak perlu instal apapun. Langkah kedua, dia memilih mode pelaporan. Jika tidak ingin identitasnya diketahui siapapun, pilih mode anonim. Jika ingin ada pendampingan personal dari Guru BK, pilih mode terverifikasi.*
>
> *Langkah ketiga, siswa mengisi formulir kronologi kejadian. Formulirnya dibagi menjadi beberapa langkah kecil yang terstruktur — tidak semuanya ditampilkan sekaligus — sehingga terasa lebih ringan dan tidak membuat panik. Siswa menceritakan apa yang terjadi, kapan, dan di mana menggunakan bahasanya sendiri.*
>
> *Langkah keempat, jika ada bukti seperti foto, screenshot percakapan, atau dokumen, siswa bisa mengunggahnya. Ini bersifat opsional — tidak ada bukti pun laporan tetap bisa dikirim.*
>
> *Langkah kelima, setelah kirim, sistem langsung menerbitkan kode tiket unik — misalnya SGP-2026-9A8525. Siswa wajib menyimpan kode ini.*
>
> *Dan langkah keenam, kapan pun siswa ingin tahu sudah sampai mana kasusnya ditangani, cukup masukkan kode tiket di halaman pelacak. Statusnya akan tampil secara visual: Menunggu, Diverifikasi, Ditindaklanjuti, sampai Selesai.*
>
> *Bayangkan seluruh proses pelaporan ini bisa selesai dalam tiga menit, dari mana saja, kapan saja, tanpa harus bertatap muka dengan siapapun."*

---

### SLIDE 8 — Alur Penggunaan: Sisi Guru BK (Admin)
**Pembicara: Orang ke-3**

**Konten Slide:**
```
① Login Dashboard Guru BK (Aman via JWT)
        ↓
② Pantau Dashboard: Statistik Total Laporan & Tren
        ↓
③ Buka Antrean Laporan "Menunggu"
   + Filter: urgensi, tanggal, mode anonim/terverifikasi
        ↓
④ Telaah Detail Kasus + Rekomendasi AI IndoBERT
   (Kategori otomatis + Confidence Score)
        ↓
⑤ Human-in-the-Loop: Setujui ATAU Ganti Kategori Manual
        ↓
⑥ Naikkan Status Bertahap → Tulis Catatan Progres
   Diverifikasi → Ditindaklanjuti → Selesai
        ↓
⑦ Seluruh Aksi Tercatat Otomatis di Audit Trail
        ↓
⑧ Evaluasi Peta Klaster HDBSCAN untuk Langkah Preventif
```

---

> 🗣️ **NARASI PRESENTER:**
>
> *"Sekarang izinkan saya, sebagai anggota ketiga, menjelaskan bagaimana Guru BK menggunakan sistem ini.*
>
> *Pertama, Guru BK login ke dashboard khusus mereka menggunakan username dan password yang sudah dienkripsi. Sistem menggunakan teknologi JWT — JSON Web Token — untuk memastikan hanya akun yang berwenang yang bisa mengakses data laporan.*
>
> *Setelah login, tampil dashboard analitik yang langsung memberikan gambaran besar: berapa total laporan hari ini, berapa yang masih menunggu, berapa yang sedang diinvestigasi, dan bagaimana tren kasusnya dari waktu ke waktu.*
>
> *Guru BK lalu membuka antrean laporan yang berstatus 'Menunggu'. Mereka bisa filter berdasarkan urgensi, tanggal, atau apakah laporan itu anonim atau tidak.*
>
> *Di panel detail kasus, seluruh narasi siswa tampil lengkap beserta bukti digital yang diunggah. Dan di sebelahnya, ada rekomendasi otomatis dari AI IndoBERT — misalnya, 'Kategori: Perundungan Fisik, Confidence: 87%'.*
>
> *Nah, di sinilah prinsip Human-in-the-Loop bekerja. Guru BK tidak wajib mengikuti saran AI. Mereka bisa menekan 'Setujui' jika rekomendasinya tepat, atau memilih 'Override' untuk mengubah kategori secara manual sesuai penilaian profesional mereka.*
>
> *Setelah itu, Guru BK menaikkan status kasus secara bertahap — dari Diverifikasi, ke Ditindaklanjuti, lalu Selesai — sambil menuliskan catatan progres yang bisa dibaca pelapor melalui kode tiket.*
>
> *Semua aksi ini terekam otomatis dan permanen di audit trail. Dan di akhir, Guru BK bisa membuka peta klaster HDBSCAN untuk melihat titik-titik rawan di sekolah dan merencanakan langkah pencegahan ke depan."*

---

### SLIDE 9 — Fitur Unggulan SIGAP
**Pembicara: Orang ke-3**

**Konten Slide:**

| Fitur | Deskripsi | Manfaat |
|-------|-----------|---------|
| 🔒 **Anonim Murni** | Tanpa nama, NISN, atau rekam IP | Hilangkan ketakutan siswa |
| 🎫 **Kode Tiket Unik** | Tiket acak untuk lacak progres tanpa login | Transparansi tanpa identitas |
| 🤖 **Triase AI IndoBERT** | Klasifikasi narasi bahasa gaul otomatis | Efisiensi kerja Guru BK |
| 🧑‍⚖️ **Override Human-in-the-Loop** | Guru BK setujui atau koreksi saran AI | AI membantu, bukan memvonis |
| 🗺️ **Peta Rawan HDBSCAN** | Klaster lokasi insiden otomatis | Deteksi titik berbahaya |
| 📋 **Audit Trail Permanen** | Rekam semua aksi petugas, anti-manipulasi | Akuntabilitas & kepercayaan |
| 📁 **Bukti Digital Aman** | Validasi *magic bytes* + UUID + batas 10 MB | Cegah file berbahaya |

---

> 🗣️ **NARASI PRESENTER:**
>
> *"Kalau tadi kita lihat alurnya, sekarang mari kita rangkum fitur-fitur unggulan SIGAP dalam satu tampilan.*
>
> *Fitur pertama yang paling krusial: Anonim Murni. Tidak ada satupun data identitas yang kami simpan untuk pelapor anonim — tidak ada nama, tidak ada NISN, dan server kami secara teknis memang tidak mencatat alamat IP pengirim laporan. Ini bukan sekadar janji, tapi arsitektur teknis yang kami terapkan langsung di kode backend.*
>
> *Kedua, Kode Tiket Unik. Setiap laporan menghasilkan kode acak yang menjadi jembatan antara pelapor dan sistem — tanpa harus buat akun atau login.*
>
> *Ketiga, Triase AI IndoBERT. Guru BK tidak perlu lagi membaca puluhan laporan satu per satu untuk menentukan jenisnya. AI sudah membantu mengklasifikasikannya secara otomatis.*
>
> *Keempat, Override Human-in-the-Loop. Ini fitur yang kami banggakan karena membuktikan bahwa AI kami bukan alat yang otoriter. Guru BK selalu punya kendali penuh untuk menyetujui atau mengubah rekomendasi AI.*
>
> *Kelima, Peta Rawan HDBSCAN. Visualisasi klaster lokasi insiden di peta sekolah yang terbentuk secara otomatis dari data laporan.*
>
> *Keenam, Audit Trail Permanen. Setiap aksi tercatat dan tidak bisa diedit atau dihapus oleh siapapun — ini yang membuat sistem benar-benar akuntabel.*
>
> *Dan ketujuh, Keamanan Upload Bukti. Setiap file yang diunggah divalidasi secara berlapis — mulai dari pengecekan tipe file asli di level byte pertama, hingga penamaan ulang dengan UUID acak agar tidak ada yang bisa menebak nama filenya."*

---

### SLIDE 10 — Arsitektur Sistem
**Pembicara: Orang ke-2**

**Konten Slide:**
```
[ PENGGUNA ]
Siswa & Guru BK via Browser
           ↓
[ FRONTEND ]
React 18 + Vite + Tailwind CSS
           ↓  REST API
[ BACKEND ]
FastAPI (Python) + JWT + Pydantic v2
  ├── IndoBERT NLP + Cosine Similarity
  └── HDBSCAN Spatial Clustering
           ↓
[ DATABASE ]
MySQL / MariaDB
Reports | Evidence | Audit Log | Users
```

**Tech Stack:** React 18 · FastAPI · IndoBERT · HDBSCAN · MySQL · JWT · Bcrypt · Docker

---

> 🗣️ **NARASI PRESENTER:**
>
> *"Sekarang izinkan saya kembali untuk menjelaskan arsitektur teknis SIGAP secara sederhana.*
>
> *Di lapisan paling atas, ada pengguna — siswa dan guru BK — yang mengakses sistem melalui browser biasa di HP atau laptop mereka.*
>
> *Lapisan pertama yang mereka sentuh adalah Frontend, yang kami bangun menggunakan React 18 dan Vite. Kombinasi ini menghasilkan antarmuka yang sangat cepat, modern, dan responsif di berbagai ukuran layar. Desainnya kami kerjakan menggunakan Tailwind CSS untuk tampilan bersih dan konsisten.*
>
> *Di bawahnya ada Backend, yang kami bangun dengan FastAPI berbasis Python. FastAPI kami pilih karena kemampuannya menangani request secara asynchronous — sangat cepat — dan karena ekosistemnya sangat kompatibel dengan library AI seperti HuggingFace Transformers untuk IndoBERT dan Scikit-Learn untuk HDBSCAN. Di sinilah seluruh logika bisnis, autentikasi JWT, dan pemrosesan AI berlangsung.*
>
> *Dan di lapisan paling bawah ada Database MySQL yang menyimpan semua data: laporan aduan, berkas bukti, log audit, dan akun pengguna.*
>
> *Seluruh infrastruktur ini kami jalankan menggunakan Docker, sehingga mudah dipasang di server sekolah manapun tanpa konfigurasi yang rumit."*

---

### SLIDE 11 — Mengapa SIGAP Berbeda?
**Pembicara: Orang ke-3**

**Konten Slide:**

| Kriteria | 📒 Buku Aduan Manual | 💬 WhatsApp Hotline | ✅ SIGAP |
|----------|---------------------|---------------------|---------|
| Anonimitas | ❌ Tidak ada | ❌ Nomor HP terlihat | ✅ Murni anonim |
| Klasifikasi AI | ❌ Manual | ❌ Manual | ✅ IndoBERT otomatis |
| Pelacakan Status | ❌ Tidak bisa | ❌ Tidak bisa | ✅ Via kode tiket |
| Peta Titik Rawan | ❌ Tidak ada | ❌ Tidak ada | ✅ HDBSCAN Klaster |
| Audit Trail | ❌ Tidak ada | ❌ Tidak ada | ✅ Permanen anti-ubah |
| Akses 24 Jam | ❌ Tidak | ❌ Terbatas | ✅ Kapan saja |

---

> 🗣️ **NARASI PRESENTER:**
>
> *"Sebagai pembanding, mari kita lihat SIGAP dibandingkan dengan dua solusi yang paling umum digunakan sekolah saat ini: buku aduan manual dan WhatsApp hotline.*
>
> *Dari sisi anonimitas — buku aduan manual jelas tidak anonim, nama siswa harus ditulis. WhatsApp hotline juga tidak anonim, nomor HP pelapor otomatis terlihat oleh pihak sekolah. Hanya SIGAP yang menawarkan anonimitas murni secara teknis.*
>
> *Klasifikasi AI — dua metode lama itu sepenuhnya manual, bergantung pada kemampuan dan ketersediaan waktu guru. SIGAP melakukannya otomatis dengan IndoBERT dalam hitungan detik.*
>
> *Pelacakan status — pelapor yang menggunakan buku aduan atau WhatsApp tidak punya cara untuk tahu apakah kasusnya sudah diproses atau masih terbengkalai. Di SIGAP, pelapor bisa cek kapan saja lewat kode tiket.*
>
> *Peta titik rawan dan audit trail — ini fitur yang sama sekali tidak dimiliki solusi lama. SIGAP memiliki keduanya.*
>
> *Dan akses 24 jam — buku aduan dan guru BK hanya tersedia saat jam sekolah. SIGAP bisa diakses kapan saja, termasuk saat malam hari ketika siswa baru berani bercerita.*
>
> *Dari perbandingan ini, jelas bahwa SIGAP bukan sekadar digitalisasi formulir biasa — ini adalah lompatan kualitatif dalam sistem penanganan perundungan sekolah."*

---

### SLIDE 12 — Penutup & Kesimpulan
**Pembicara: Orang ke-1**

**Konten Slide:**
> *"SIGAP membuktikan bahwa teknologi kecerdasan buatan dapat menjadi solusi nyata atas masalah sosial krusial di dunia pendidikan — melindungi privasi siswa, memberdayakan guru BK, dan mewujudkan sekolah yang aman, inklusif, dan bebas perundungan."*

**Teknologi:** React 18 · FastAPI · IndoBERT · HDBSCAN · MySQL · JWT · Docker

**Tim:**
- [Nama Anggota 1]
- [Nama Anggota 2]
- [Nama Anggota 3]

---

> 🗣️ **NARASI PRESENTER:**
>
> *"Baik, sebagai penutup, izinkan saya menyimpulkan apa yang sudah kami presentasikan hari ini.*
>
> *SIGAP lahir dari satu keyakinan sederhana: bahwa teknologi seharusnya bisa digunakan untuk melindungi siswa yang paling rentan sekalipun. Seorang siswa yang terlalu takut untuk berbicara, terlalu malu untuk bertatap muka, atau terlalu pesimis karena tidak percaya sistem — SIGAP hadir untuk menjadi jalan keluar bagi mereka.*
>
> *Melalui empat pilar teknologi — pelaporan anonim dual-mode, triase AI IndoBERT, klasterisasi HDBSCAN, dan kerangka Human-in-the-Loop dengan audit trail — kami membangun sistem yang tidak hanya canggih secara teknis, tapi juga manusiawi dalam pendekatannya.*
>
> *AI kami tidak memvonis. AI kami membantu. Keputusan akhir tetap ada di tangan manusia — Guru BK yang punya hati, empati, dan tanggung jawab profesional.*
>
> *Kami percaya SIGAP bisa menjadi fondasi untuk lingkungan sekolah yang lebih aman, lebih inklusif, dan bebas dari budaya perundungan.*
>
> *Demikian presentasi dari kelompok kami. Atas perhatian Bapak/Ibu Dosen dan teman-teman semua, kami ucapkan terima kasih. Kami membuka sesi tanya jawab — silakan."*

---

## ⏱️ PEMBAGIAN WAKTU PRESENTASI

| Waktu | Slide | Pembicara | Konten |
|-------|-------|-----------|--------|
| 0:00 – 0:30 | Slide 1 | Semua | Perkenalan tim & judul |
| 0:30 – 2:30 | Slide 2–3 | Orang ke-1 | Masalah & fenomena gunung es |
| 2:30 – 4:00 | Slide 4–5 | Orang ke-1 | Apa itu SIGAP & target pengguna |
| 4:00 – 6:30 | Slide 6–7 | Orang ke-2 | 4 pilar teknologi & alur siswa |
| 6:30 – 8:30 | Slide 8–10 | Orang ke-2 & 3 | Alur admin & arsitektur |
| 8:30 – 10:30 | Slide 9–11 | Orang ke-3 | Fitur unggulan & perbandingan |
| 10:30 – 11:00 | Slide 12 | Orang ke-1 | Penutup & kesimpulan |
| 11:00 – 15:00 | — | Semua | Sesi tanya jawab |

---

## 💡 TIPS PRESENTASI

1. **Jangan baca slide word by word** — narasi adalah panduan, bukan skrip hafalan.
2. **Gunakan analogi sederhana** saat menjelaskan IndoBERT: *"seperti Google yang sangat pintar memahami bahasa gaul anak sekolah."*
3. **Demonstrasikan alur siswa secara live** jika ada laptop + koneksi — live demo sangat berkesan.
4. **Kontak mata dengan audiens** lebih penting daripada menatap slide terus-menerus.
5. **Saat sesi Q&A**, tunjuk anggota yang sesuai bidangnya. Backend/AI → Orang ke-2. Alur sistem & fitur → Orang ke-3.
6. **Jika ditanya hal teknis berat**, gunakan bank soal lengkap di [`24-Materi_dan_QNA_Presentasi_Kelompok.md`](./24-Materi_dan_QNA_Presentasi_Kelompok.md).
