# 📢 Panduan Lengkap Presentasi Proyek SIGAP & Bank Pertanyaan-Jawaban (Q&A)

> **Catatan Penggunaan:**  
> Dokumen ini disusun khusus sebagai bahan pembekalan bagi **3 orang anggota tim presentasi** (mahasiswa Semester 3) untuk mempresentasikan proyek **SIGAP** (*Sistem Informasi Pengaduan Perundungan dan Kekerasan Pelajar*) di hadapan **Dosen Pengampu** dan **Mahasiswa Audiens (Semester 1–2)**.  
> Seluruh substansi materi disarikan langsung dari *paper* ilmiah dan arsitektur teknis SIGAP.

---

## 📑 BAGIAN 1: MATERI INTI & BRIEFING PROYEK (Untuk Dipelajari 2 Teman Tim)

### 1.1 Latar Belakang & Urgensi Kasus
* **Masalah Utama (*Problem Statement*):**  
  Tingginya angka perundungan (*bullying*) dan kekerasan di sekolah sering kali tidak terdata (*iceberg phenomenon* / fenomena gunung es). Banyak siswa yang menjadi korban atau saksi memilih bungkam.
* **Fenomena *Underreporting* & Hambatan Psikologis:**  
  Riset menunjukkan siswa enggan melapor ke Guru Bimbingan Konseling (BK) secara tatap muka karena:
  1. *Fear of Retaliation* (Takut intimidasi balasan dari pelaku/geng sekolah).
  2. *Social Stigma* (Takut dicap "tukang ngadu", "cepu", atau dikucilkan teman sebaya).
  3. *Shame & Retraumatization* (Malu menceritakan kekerasan fisik/verbal secara langsung).
  4. *Distrust in System* (Pesimis laporan tidak ditindaklanjuti atau rahasianya bocor).
* **Kendala Pihak Sekolah / Guru BK:**  
  1. Narasi siswa sering menggunakan bahasa informal/gaul, ambigu, atau tidak terstruktur sehingga sulit diklasifikasikan secara manual.
  2. Sulit mendeteksi pola perundungan berulang (*chronic bullying*) dan titik-titik lokasi rawan (*hotspots*) di sekolah jika aduan hanya dicatat di buku konvensional.

---

### 1.2 Solusi Inovatif SIGAP
SIGAP adalah platform pelaporan digital berbasis web responsif yang mengintegrasikan kecerdasan buatan (*AI-powered*) untuk mengatasi masalah di atas melalui 4 pilar:

1. **Arsitektur Pelaporan *Dual-Mode* (Anonim & Terverifikasi):**
   * **Mode Anonim Murni:** Siswa tidak perlu membuat akun, tidak perlu mengisi nama/NISN, dan backend **tidak merekam alamat IP** pelapor.
   * **Kode Tiket Pelacak Acak (*Random Tracking Ticket*):** Sistem menerbitkan tiket unik (contoh: `SGP-2026-9A8525`). Siswa bisa memantau perkembangan tindak lanjut aduannya secara berkala tanpa perlu login.
2. **Triase Otomatis Berbasis NLP (IndoBERT + *Cosine Similarity*):**
   * Menggunakan model *pre-trained* bahasa Indonesia **IndoBERT** (`indobenchmark/indobert-base-p1`).
   * Menghasilkan representasi vektor konteks (*sentence embedding* 768 dimensi) dari narasi siswa.
   * Menghitung kesamaan semantik (*cosine similarity*) terhadap kategori kasus formal (Verbal, Fisik, Relasional, Siber, dll.) secara objektif, meski siswa menulis dengan bahasa gaul.
3. **Pendeteksian Pola Insiden & Titik Rawan Berbasis Klaster (HDBSCAN):**
   * Menggunakan algoritma *Hierarchical Density-Based Spatial Clustering of Applications with Noise* (HDBSCAN).
   * Otomatis mengelompokkan insiden berdasarkan densitas spasial/lokasi tanpa perlu menebak atau menetapkan jumlah *k* klaster di awal (seperti pada K-Means). Data pencilan (*noise*) otomatis diabaikan.
4. **Prinsip *Human-in-the-Loop* & *Tamper-Resistant Audit Trail*:**
   * Rekomendasi AI **bukan penentu mutlak**, melainkan berstatus *Pending Review*.
   * Keputusan sanksi, investigasi, dan verifikasi status kasus tetap 100% berada di tangan Guru BK.
   * Setiap mutasi status dicatat dalam *audit trail* permanen anti-manipulasi yang mencatat stempel waktu dan identitas akun petugas yang mengubahnya.

---

### 1.3 Arsitektur & Tumpukan Teknologi (*Tech Stack*)
* **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, Framer Motion. (Antarmuka *mobile-friendly*, modern, dan responsif).
* **Backend:** FastAPI (Python 3.10+), Pydantic v2 (validasi data ketat), SQLAlchemy ORM, Uvicorn.
* **Database:** MariaDB / MySQL.
* **Keamanan:** Autentikasi JWT (JSON Web Token), enkripsi *password* Bcrypt, validasi unggahan bukti digital (pemeriksaan *MIME type* & *magic bytes*, batasan ukuran 10 MB, dan penamaan berkas acak berformat UUID v4).

---

### 1.4 Fitur & Alur Penggunaan Pengguna (Siswa / Pelapor)

#### A. Fitur-Fitur di Sisi Pengguna (Siswa):
1. **Landing Page Edukatif:** Informasi definisi perundungan, ajakan berani melapor, panduan alur privasi, dan akses cepat ke tombol pelaporan atau pelacakan tiket.
2. **Formulir Pelaporan Multi-Langkah (*Guided Wizard*):** Form interaktif yang dipecah menjadi langkah terarah (Pilihan Privasi $\rightarrow$ Kronologi & Lokasi $\rightarrow$ Unggah Bukti $\rightarrow$ Ringkasan & Submit) guna menurunkan beban kepanikan dan stres siswa saat melapor.
3. **Pilihan Privasi *Dual-Mode*:**
   * *Mode Anonim:* Pelaporan tanpa login, tanpa meminta NISN/identitas pribadi, dan server tidak mencatat alamat IP.
   * *Mode Terverifikasi:* Pelaporan dengan login akun terdaftar jika siswa menghendaki pendampingan konseling personal langsung oleh Guru BK.
4. **Unggah Bukti Digital Aman (*Secure Attachment*):** Fitur melampirkan foto, tangkapan layar chat, atau dokumen PDF dengan validasi format otomatis (*magic bytes*) dan proteksi privasi berkas.
5. **Penerbitan Kode Tiket Unik (*Random Tracking Ticket*):** Siswa memperoleh kode unik format resmi (contoh: `SGP-2026-9A8525`) beserta fitur salin ke *clipboard* dan unduh bukti tiket.
6. **Pelacak Status Aduan Real-Time (*Ticket Tracking*):** Fitur cek progres penanganan kasus hanya dengan mengetikkan kode tiket tanpa perlu login, menampilkan *timeline stepper* visual yang transparan.
7. **Pesan & Catatan Resmi dari Guru BK:** Siswa dapat membaca pesan respon atau tindak lanjut dari pihak sekolah langsung di halaman pelacak tiket tanpa takut identitasnya terbongkar.

#### B. Alur Penggunaan Pengguna (Siswa Flow):
```text
Buka Web SIGAP
      │
      ├── [Punya Kode Tiket?] ──→ Masukkan Tiket ──→ Cek Status & Catatan BK
      │
      └── [Ingin Melapor?] ─────→ Klik "Lapor Sekarang"
                                          │
                                          ↓
                                 Pilih Mode Pelaporan
                                 (Anonim / Terverifikasi)
                                          │
                                          ↓
                                 Isi Narasi Kronologi,
                                 Waktu & Titik Lokasi
                                          │
                                          ↓
                                 Unggah Bukti Digital
                                 (Foto/PDF, Opsional)
                                          │
                                          ↓
                                 Kirim Laporan (Submit)
                                          │
                                          ↓
                               Terbitkan Kode Tiket Unik
                               (Simpan / Salin Tiket)
                                          │
                                          ↓
                              Pantau Timeline Progres
                   (Menunggu → Diverifikasi → Ditindaklanjuti → Selesai)
```

---

### 1.5 Fitur & Alur Penggunaan Admin (Guru BK / Pengelola)

#### A. Fitur-Fitur di Sisi Admin (Guru BK):
1. **Autentikasi Terproteksi & RBAC (*Role-Based Access Control*):** Login khusus guru BK dan administrator sekolah menggunakan verifikasi JWT berdurasi terbatas dan sandi terenkripsi Bcrypt.
2. **Dashboard Analitik Agregat:** Ringkasan statistik waktu-nyata mengenai total aduan, status kasus yang sedang berjalan (*Pending, Investigasi, Selesai*), diagram tren kekerasan, dan kategori yang paling mendominasi.
3. **Manajemen Antrean Aduan (*Report Queue & Filtering*):** Tabel data laporan yang dapat difilter berdasarkan status verifikasi, urgensi, rentang tanggal, mode (anonim/terverifikasi), dan pencarian kata kunci.
4. **Panel Detail Kasus & Asistensi AI IndoBERT:**
   * Menampilkan narasi lengkap, titik lokasi, stempel waktu, dan berkas bukti digital.
   * Menampilkan hasil inferensi AI: rekomendasi kategori perundungan beserta nilai keyakinan (*confidence score*).
5. **Mekanisme *Human-in-the-Loop* (Setujui / Ganti Kategori):** Guru BK memiliki tombol *Approve AI Category* atau tombol *Override* untuk mengubah kategori kasus secara manual sesuai diskresi profesionalnya.
6. **Penegak Transisi Status (*State Transition Guard*):** Sistem menjaga agar status tidak dimutasi secara ilegal/melompat (alur wajib: `MENUNGGU` $\rightarrow$ `DIVERIFIKASI` $\rightarrow$ `DITINDAKLANJUTI` $\rightarrow$ `SELESAI`).
7. **Formulir Catatan Penanganan Konseling (*Case Notes*):** Guru BK dapat mencatat tindakan intervensi yang telah dilakukan, serta mengirimkan pesan progres yang bisa dibaca oleh siswa lewat kode tiket.
8. **Visualisasi Klaster Spasial HDBSCAN (*Hotspot Mapping*):** Peta atau grafik sebaran insiden yang otomatis mengelompokkan area rawan perundungan di lingkungan sekolah dan mendeteksi pola kasus berulang.
9. **Jejak Audit Tahan Manipulasi (*Tamper-Resistant Audit Trail*):** Setiap tindakan admin (login, verifikasi AI, pergantian status, pencatatan hasil) terekam secara otomatis, permanen, dan tidak dapat diedit/dihapus oleh siapapun.

#### B. Alur Penggunaan Admin (Guru BK Flow):
```text
Login Guru BK (Username, Password, JWT)
      │
      ↓
Dashboard Analitik (Lihat Statistik Kasus & Tren)
      │
      ↓
Buka Antrean Laporan (Filter status: "Menunggu / Pending")
      │
      ↓
Buka Detail Kasus & Periksa Narasi + Bukti Digital
      │
      ↓
Telaah Rekomendasi AI IndoBERT (Confidence Score)
      │
      ├── [Saran AI Akurat] ───→ Klik "Approve Kategori AI"
      │
      └── [Kurang Tepat] ─────→ Pilih "Override Manual" (Pilih Kategori Baru)
                                          │
                                          ↓
                                Naikkan Status ke "Diverifikasi"
                                          │
                                          ↓
                          Lakukan Investigasi & Konseling Fisik
                                          │
                                          ↓
                                Naikkan Status ke "Ditindaklanjuti"
                                + Tulis Catatan Progres untuk Siswa
                                          │
                                          ↓
                         Insiden Terselesaikan / Penanganan Usai
                                          │
                                          ↓
                                 Ubah Status ke "Selesai"
                                          │
                                          ↓
                         Sistem Merekam ke Log Audit Trail Permanen
                                          │
                                          ↓
                        Evaluasi Peta Titik Rawan Klaster HDBSCAN
                        (Guna Patroli / Langkah Preventif Sekolah)
```

---

### 1.6 Strategi Pembagian Peran Presentasi (Tim 3 Orang)
Agar presentasi terlihat solid, profesional, dan menguasai panggung:

* **Orang ke-1 (Pembuka, Masalah, & Solusi Konseptual):**
  * *Tugas:* Membuka presentasi, menjelaskan fenomena gunung es & *underreporting* kekerasan di sekolah, hambatan psikologis siswa, serta mengenalkan apa itu SIGAP beserta keunggulan mode anonimnya.
* **Orang ke-2 (Arsitektur Teknis & Mesin AI / NLP / Klaster):**
  * *Tugas:* Menjelaskan diagram arsitektur sistem, *tech stack* (React + FastAPI + MySQL), cara kerja model IndoBERT melakukan *sentence embedding*, perhitungan *cosine similarity*, serta algoritma HDBSCAN untuk pemetaan klaster titik rawan.
* **Orang ke-3 (Alur Human-in-the-Loop, Demo Alur Sistem, & Kesimpulan):**
  * *Tugas:* Menjelaskan prinsip *Human-in-the-Loop* (mengapa AI tidak boleh memvonis siswa), modul *audit trail* keamanan, alur verifikasi guru BK, hasil pengujian sistem (*Black-Box*, waktu respons API), kesimpulan, dan menutup sesi presentasi.

---

## 🏛️ BAGIAN 2: BANK PERTANYAAN DOSEN (20 SOAL + KUNCI JAWABAN)

### Kategori A: Dosen — Formal / Metodologis (10 Pertanyaan)

#### D-F01. Mengapa memilih IndoBERT (`indobenchmark/indobert-base-p1`) dibandingkan model konvensional seperti Naive Bayes atau TF-IDF + SVM?
* **Kunci Jawaban:**  
  *“Naive Bayes dan TF-IDF berbasis kata kunci (*bag-of-words*) yang kehilangan makna urutan kata, konteks semantik, serta negasi (misal: beda makna antara ‘tidak memukul’ dan ‘memukul’). IndoBERT adalah model berbasis Transformer yang dilatih pada miliaran korpus bahasa Indonesia, sehingga mampu menangkap representasi konteks semantik yang mendalam (*contextual sentence embedding*), termasuk gaya bahasa kasual dan slang siswa, menghasilkan akurasi pemetaan kategori yang jauh lebih superior.”*

#### D-F02. Mengapa klasifikasi kategori menggunakan pendekatan *Embedding + Cosine Similarity*, bukan langsung *End-to-End Classification Head* (Dense Layer di atas BERT)?
* **Kunci Jawaban:**  
  *“Karena dataset aduan kekerasan sekolah di dunia nyata bersifat *imbalanced* dan jumlah data berlabel sangat terbatas (*few-shot setting*). Jika melatih ulang *classification head* secara *end-to-end* dengan data sedikit, model sangat rentan mengalami *overfitting*. Pendekatan representasi *embedding* prototipe kategori dan *cosine similarity* lebih fleksibel (*zero/few-shot transfer*), memungkinkan penambahan sub-kategori baru tanpa perlu *retraining* seluruh bobot model Transformer.”*

#### D-F03. Mengapa memilih algoritma HDBSCAN untuk pengelompokan lokasi rawan ketimbang K-Means?
* **Kunci Jawaban:**  
  *“K-Means memiliki dua kelemahan fatal untuk data spasial sekolah: wajib menentukan jumlah klaster (*k*) di awal secara subjektif, dan memaksa setiap titik data masuk ke dalam klaster meskipun titik itu adalah anomali (*outlier*). Sementara HDBSCAN berbasis kepadatan (*density-based*), otomatis menemukan jumlah klaster secara hierarkis, tahan terhadap bentuk klaster non-spherical, dan mampu mengidentifikasi data insiden tunggal sebagai *noise* (*noise filtering*) sehingga tidak mendistorsi visualisasi titik rawan.”*

#### D-F04. Bagaimana sistem menjamin prinsip *Human-in-the-Loop* diterapkan secara nyata dan bukan sekadar jargon?
* **Kunci Jawaban:**  
  *“Dalam basis data SIGAP, keluaran IndoBERT hanya disimpan sebagai kolom `predicted_category` dengan *confidence score* tertentu dan status laporan berstatus `PENDING_REVIEW`. Sistem tidak menyediakan *endpoint* otomatis untuk memberikan sanksi. Guru BK harus melakukan penelaahan manual (*manual appraisal*), berhak mengubah atau menyetujui rekomendasi kategori tersebut, dan baru kemudian status laporan bisa dinaikkan ke `INVESTIGATION` atau `RESOLVED`. Setiap intervensi ini direkam dalam tabel audit trail.”*

#### D-F05. Bagaimana mitigasi keamanan sistem terhadap serangan injeksi berkas berbahaya (*malicious file upload*) saat siswa mengunggah bukti?
* **Kunci Jawaban:**  
  *“Sistem menerapkan validasi berlapis: pertama, memeriksa ekstensi berkas; kedua, validasi tipe MIME aktual menggunakan *magic bytes* (*file signature analysis*) di backend FastAPI sehingga penggantian ekstensi palsu (misal: skrip `.php` di-rename `.jpg`) akan langsung ditolak; ketiga, batas ukuran berkas dipatok maksimal 10 MB; dan keempat, nama berkas diacak menggunakan UUID v4 saat disimpan di direktori terisolasi agar terhindar dari kerentanan *path traversal* atau eksekusi langsung.”*

#### D-F06. Jika pelaporan dilakukan secara anonim murni, bagaimana mekanisme sistem mencegah aduan palsu (*spamming/trolling*)?
* **Kunci Jawaban:**  
  *“Pertama, arsitektur form dirancang dengan multi-langkah (*guided wizard*) yang mewajibkan pengisian rincian kronologi, waktu, dan titik lokasi spesifik, yang secara alami menaikkan hambatan psikologis pelaku *prank*. Kedua, API backend diproteksi *rate limiting*. Ketiga, modul NLP mendeteksi narasi yang tidak memiliki substansi atau *confidence score* rendah untuk ditandai pada dashboard Guru BK sebagai laporan berprioritas rendah (*unverified/needs screening*).”*

#### D-F07. Mengapa backend dibangun dengan FastAPI dan bukan framework populer lain seperti Django atau Express.js?
* **Kunci Jawaban:**  
  *“FastAPI memiliki keunggulan performa berbasis *asynchronous* (ASGI Starlette) yang sangat cepat, mendekati NodeJS/Go. Selain itu, FastAPI terintegrasi native dengan ekosistem AI/ML Python (PyTorch, Transformers HuggingFace, Scikit-Learn), serta memiliki validasi skema tipe data otomatis yang sangat ketat menggunakan Pydantic v2 dan dokumentasi Swagger UI interaktif secara *out-of-the-box*.”*

#### D-F08. Bagaimana desain basis data memastikan bahwa laporan anonim benar-benar tidak dapat dihubungkan ke identitas siswa (*unlinkability*)?
* **Kunci Jawaban:**  
  *“Pada skema tabel laporan (`reports`), kolom `reporter_id` didefinisikan bersifat *nullable*. Ketika mode anonim dipilih, nilai kolom ini diset `NULL`, dan sistem sama sekali tidak mencatat *header IP address* maupun *User-Agent* ke dalam baris tabel laporan. Satu-satunya pengenal bagi pelapor adalah token tiket unik yang disimpan di sisi klien (*client-side token storage*) atau dicatat sendiri oleh siswa.”*

#### D-F09. Apa metrik evaluasi yang digunakan untuk menguji keandalan sistem secara menyeluruh?
* **Kunci Jawaban:**  
  *“Kami menguji 4 dimensi komprehensif sesuai paper: (1) Verifikasi fungsionalitas menggunakan Black-Box Testing (14 skenario uji); (2) Kinerja klasifikasi NLP dengan metrik Precision, Recall, dan F1-Score per kategori; (3) Evaluasi performa sistem melalui API Response Time (ms) dan reliabilitas HTTP; serta (4) Validasi penerimaan responden menggunakan instrumen System Usability Scale (SUS) untuk siswa dan Technology Acceptance Model (TAM) untuk Guru BK.”*

#### D-F10. Apa keterbatasan (*threats to validity*) dari penelitian dan pengembangan sistem SIGAP saat ini?
* **Kunci Jawaban:**  
  *“Keterbatasan saat ini antara lain: representasi teks IndoBERT masih berbasis teks tulisan dan belum mendukung pemrosesan transkrip suara langsung (*speech-to-text*); pengujian spasial HDBSCAN masih mengasumsikan koordinat area kampus/sekolah lokal; serta dataset korpus ujicoba masih perlu diperkaya secara berkelanjutan dengan studi kasus nyata pasca-implementasi penuh di sekolah.”*

---

### Kategori B: Dosen — Non-Formal / Kritis & Realistis (10 Pertanyaan)

#### D-NF01. "Kalian masih semester 3, yakin bikin sistem sekompleks ini sendiri? Bukan cuma copy-paste template atau tugas akhir orang?"
* **Kunci Jawaban:**  
  *“Sistem ini kami rancang dan bangun sendiri dari dasar, Pak/Bu. Kami membagi peran secara terstruktur: ada yang fokus pada perancangan arsitektur backend FastAPI dan model NLP IndoBERT, ada yang fokus pada antarmuka frontend React modern, serta perancangan skema database. Komitmen kami mengerjakan ini sejak awal didokumentasikan dalam commit Git berkala dan penulisan dokumen paper ilmiah.”*

#### D-NF02. "Zaman sekarang kan ada ChatGPT / OpenAI API, kenapa repot-repot pakai IndoBERT lokal yang bikin berat laptop?"
* **Kunci Jawaban:**  
  *“Ada dua pertimbangan krusial, Pak/Bu: Pertama, **Privasi dan Kepatuhan Etika**. Data aduan perundungan anak sekolah adalah data sangat sensitif. Jika dikirim ke API luar negeri seperti OpenAI, terjadi kebocoran privasi data siswa. Kedua, **Biaya & Ketergantungan**. Menggunakan model lokal *open-source* membuat sekolah tidak perlu membayar biaya langganan API token bulanan dan sistem bisa beroperasi mandiri (*on-premise*) tanpa internet publik.”*

#### D-NF03. "Kalau anak SMP/SMA yang nakal iseng kirim 50 aduan palsu dalam 10 menit, guru BK-nya gak pusing tuh?"
* **Kunci Jawaban:**  
  *“Tidak, Pak/Bu. Backend kami memiliki middleware *rate limiting* yang membatasi frekuensi pengiriman dari satu koneksi dalam jendela waktu tertentu. Selain itu, laporan tanpa bukti digital atau tanpa pola semantik jelas akan diberi skor prioritas rendah oleh sistem, sehingga guru BK tetap bisa mendahulukan laporan-laporan berisiko tinggi (*high severity*).”*

#### D-NF04. "Guru BK di sekolah biasanya sudah berumur dan gaptek. Yakin mereka mau dan bisa pakai dashboard ini?"
* **Kunci Jawaban:**  
  *“Sangat yakin, Pak/Bu. Di dashboard admin SIGAP, desain antarmuka dibuat sangat intuitif seperti aplikasi pesan/email biasa: ada lencana warna status yang kontras (Pending, Investigasi, Selesai), tombol aksi satu klik untuk menyetujui rekomendasi AI, dan kolom catatan penanganan yang sederhana tanpa istilah teknis rumit. Hasil pengujian kegunaan kami juga menunjukkan skor penerimaan yang sangat positif.”*

#### D-NF05. "Sekolah kan biasanya tertutup soal nama baik. Kalau kepala sekolahnya takut aib sekolah terbongkar gimana?"
* **Kunci Jawaban:**  
  *“Justru SIGAP ini instrumen internal untuk melindungi nama baik sekolah, Pak/Bu. Selama ini siswa curhat di media sosial (viral di Twitter/TikTok) karena tidak ada saluran internal yang terpercaya. Dengan SIGAP, aduan diselesaikan secara internal, sistematis, dan terukur sebelum insiden membesar atau meledak ke publik.”*

#### D-NF06. "Kenapa siswa harus percaya kalau laporannya benar-benar anonim? Jangan-jangan IP mereka tetap kalian lacak?"
* **Kunci Jawaban:**  
  *“Kami mempublikasikan *privacy notice* yang transparan di halaman depan sistem. Pada level teknis, router endpoint aduan anonim kami sengaja mengabaikan ekstraksi header `X-Forwarded-For` dan `client.host`, serta database tidak memiliki kolom penyimpan IP. Kami siap mendemonstrasikan isi tabel database secara terbuka untuk membuktikan nol data identitas tersimpan.”*

#### D-NF07. "Kalau siswa kehilangan kode tiket pelacaknya, mereka bisa cari tahu kelanjutan kasusnya gak?"
* **Kunci Jawaban:**  
  *“Demi menjaga prinsip anonimitas murni, sistem sengaja tidak menyediakan fitur 'Lupa Tiket' (karena itu mengharuskan input email/No HP). Namun, pada halaman akhir pelaporan, kami menyediakan tombol *Download Tiket (PDF/Gambar)* dan *Copy to Clipboard* dengan peringatan tegas agar siswa menyimpannya di tempat aman. Jika tiket hilang dan kasus berulang, siswa dianjurkan membuat aduan lanjutan.”*

#### D-NF08. "Bukannya lebih gampang lapor lewat WhatsApp hotline sekolah daripada bikin web baru?"
* **Kunci Jawaban:**  
  *“WhatsApp tidak memiliki privasi anonim karena nomor telepon siswa/orang tua otomatis terlihat oleh guru. Selain itu, WhatsApp tidak memiliki triase AI, tidak bisa memetakan klaster lokasi rawan otomatis, dan riwayat penanganannya tidak memiliki *audit trail* terstruktur sehingga sangat rentan lupa ditindaklanjuti.”*

#### D-NF09. "Seberapa berat komputasi IndoBERT ini di server? Apakah sekolah butuh server GPU mahal?"
* **Kunci Jawaban:**  
  *“Tidak butuh GPU mahal, Pak/Bu. Untuk kebutuhan *inference* (bukan training ulang), model IndoBERT yang sudah di-*quantize* dapat berjalan sangat efisien di CPU server standar atau VPS hemat dengan RAM 2–4 GB, dengan waktu inferensi berkisar antara 200–400 ms per narasi aduan.”*

#### D-NF10. "Apa hal paling menantang yang kalian hadapi bertiga saat mengerjakan proyek ini?"
* **Kunci Jawaban:**  
  *“Tantangan terbesar adalah menjembatani aspek teknis kecerdasan buatan dengan etika penanganan siswa. Kami harus merancang arsitektur di mana AI memberi bantuan klasifikasi yang akurat, namun tidak boleh mengambil alih peran manusia (*Human-in-the-Loop*), serta menjaga keseimbangan antara kemudahan melapor dengan pencegahan data palsu.”*

---

## 🎓 BAGIAN 3: BANK PERTANYAAN MAHASISWA (20 SOAL + KUNCI JAWABAN)

### Kategori C: Mahasiswa (Semester 1–2) — Formal & Penasaran Teknis (10 Pertanyaan)

#### M-F01. "Halo Kak, boleh jelaskan secara sederhana apa itu *Sentence Embedding* di IndoBERT?"
* **Kunci Jawaban:**  
  *“Halo! Secara sederhana, komputer kan tidak bisa paham huruf atau kalimat bahasa manusia. Nah, Sentence Embedding adalah teknik mengubah satu kalimat narasi menjadi deretan 768 angka desimal (disebut vektor). Angka-angka ini merepresentasikan 'makna semantik' dari kalimat tersebut. Jadi kalimat yang maknanya mirip akan memiliki susunan angka vektor yang berdekatan di ruang matematis.”*

#### M-F02. "Bagaimana rumus *Cosine Similarity* bisa menentukan kategori kekerasan dari teks siswa?"
* **Kunci Jawaban:**  
  *“Cosine Similarity menghitung sudut kosinus antara dua vektor: yaitu vektor narasi siswa vs vektor contoh prototipe kasus kekerasan (misal contoh aduan 'pemerasan uang'). Jika arah kedua vektor hampir sejajar (sudut 0 derajat, nilai kosinus mendekati 1.0), artinya makna narasi siswa sangat cocok dengan kategori tersebut.”*

#### M-F03. "Kenapa arsitekturnya memisahkan React di frontend dan FastAPI di backend, tidak pakai monolitik seperti Laravel/Django?"
* **Kunci Jawaban:**  
  *“Pemisahan ini disebut arsitektur *Decoupled/Client-Server*. Tujuannya agar aplikasi modular: React bisa fokus menangani antarmuka yang dinamis (*Single Page Application*) dan responsif di HP, sementara FastAPI fokus menangani beban komputasi AI dan keamanan API. Ke depannya, jika sekolah ingin membuat aplikasi Android/iOS, backend FastAPI-nya bisa langsung dipakai tanpa perlu ubah kode.”*

#### M-F04. "Di database relasional, bagaimana relasi tabel laporan dengan tabel bukti digital?"
* **Kunci Jawaban:**  
  *“Relasinya adalah *One-to-Many* (1 ke N). Satu baris aduan di tabel `reports` bisa memiliki banyak berkas bukti di tabel `report_evidences` yang terhubung melalui relasi *foreign key* `report_id` dengan aturan `ON DELETE CASCADE`.”*

#### M-F05. "Apa itu *Magic Bytes* yang tadi disebut dalam validasi berkas unggahan?"
* **Kunci Jawaban:**  
  *“Magic bytes adalah beberapa bita pertama di awal setiap berkas biner yang menandakan identitas asli berkas tersebut. Misalnya berkas PNG selalu diawali bita `89 50 4E 47`. Jadi meski ada orang jahat mengubah nama skrip virus `hack.php` menjadi `foto.png`, backend FastAPI akan membaca bita pertamanya dan langsung tahu kalau berkas itu palsu.”*

#### M-F06. "Bagaimana cara kerja JWT (JSON Web Token) saat Guru BK login ke dashboard?"
* **Kunci Jawaban:**  
  *“Saat Guru BK memasukkan username dan password yang cocok, server membuat token terenkripsi digital yang berisi identitas dan peran (*role*) guru tersebut. Token ini dikirim ke browser dan disimpan di memori. Setiap kali guru BK ingin membuka data aduan, browser melampirkan token ini di *header request* sehingga server langsung tahu dia petugas yang sah tanpa perlu cek database berulang kali.”*

#### M-F07. "Apa fungsi algoritma Bcrypt untuk password di database?"
* **Kunci Jawaban:**  
  *“Bcrypt adalah algoritma *hashing* satu arah (*one-way hash*) yang dilengkapi *salt* acak. Tujuannya agar password Guru BK tidak disimpan dalam bentuk teks polos. Jika suatu saat database dicuri hacker, mereka tidak akan bisa membaca password aslinya karena proses dekripsi matematika balikannya mustahil dilakukan secara komputasi.”*

#### M-F08. "Bagaimana cara algoritma HDBSCAN tahu mana yang klaster rawan dan mana yang data *noise*?"
* **Kunci Jawaban:**  
  *“HDBSCAN mengukur kepadatan jarak antar titik kejadian. Jika dalam suatu radius tertentu ada minimal titik kejadian yang saling berdekatan (sesuai parameter *min_cluster_size*), area itu dijadikan klaster. Tapi kalau ada satu kejadian di pojok sekolah yang lokasinya sangat terisolasi dari kejadian lain, HDBSCAN akan menandainya sebagai label `-1` alias *noise*.”*

#### M-F09. "Di pengujian *Black-Box*, apa saja yang kalian uji sampai dapat persentase 100%?"
* **Kunci Jawaban:**  
  *“Kami merancang 14 skenario uji berbasis fungsionalitas pengguna: mulai dari alur login admin, form aduan mode anonim, form mode terverifikasi, unggah bukti valid dan bukti palsu, generate kode tiket, pencarian status via tiket, hingga mutasi status laporan oleh guru BK. Semua skenario memberikan luaran (*output*) yang persis sesuai dengan spesifikasi rancangan.”*

#### M-F10. "Apa perbedaan instrumen SUS dan TAM dalam pengujian ke responden?"
* **Kunci Jawaban:**  
  *“SUS (*System Usability Scale*) fokus mengukur tingkat kemudahan dan kebergunaan aplikasi dari sudut pandang siswa awam (skor 0–100). Sedangkan TAM (*Technology Acceptance Model*) mengukur tingkat penerimaan teknologi dari persepsi guru BK yang mencakup aspek kemanfaatan (*perceived usefulness*) dan kemudahan penggunaan (*perceived ease of use*).”*

---

### Kategori D: Mahasiswa (Semester 1–2) — Non-Formal / Santai & Kepo (10 Pertanyaan)

#### M-NF01. "Kak, kalau ada siswa iseng curhat galau diputusin pacar di form SIGAP, model AI-nya bakal bingung gak?"
* **Kunci Jawaban:**  
  *“Pertanyaan bagus haha! Model IndoBERT kami menghitung kemiripan makna. Karena curhat galau tidak memiliki kemiripan semantik dengan pola perundungan fisik, verbal, atau siber, nilai *cosine similarity*-nya akan sangat rendah (di bawah ambang batas). Sistem akan otomatis memasukkannya ke kategori 'Lainnya/Tidak Teridentifikasi' dan guru BK bisa langsung mengarsipkan laporannya.”*

#### M-NF02. "Bisa gak sih kak sistem ini dibuka dari HP kentang yang memorinya kecil?"
* **Kunci Jawaban:**  
  *“Bisa banget! Karena sistem SIGAP adalah aplikasi web responsif. Siswa tidak perlu mengunduh aplikasi 100 MB dari Play Store. Cukup buka link lewat browser HP (Chrome/Safari), tampilannya sudah otomatis menyesuaikan ukuran layar dan sangat ringan karena aset web kami sudah dioptimasi dengan Vite.”*

#### M-NF03. "Kak, kalau ada teman yang upload foto meme atau anime sebagai bukti kejadian, sistemnya bisa tahu gak?"
* **Kunci Jawaban:**  
  *“Sistem akan menerima berkasnya selama format gambarnya asli (JPG/PNG). Tapi ingat, ada prinsip *Human-in-the-Loop*! Guru BK yang memeriksa aduan akan melihat gambar meme tersebut, mengetahui bahwa laporannya tidak valid, dan langsung menolak status aduan tersebut.”*

#### M-NF04. "Kalian kan semester 3, bagi waktu bikin web sekeren ini sama tugas kuliah biasa gimana caranya kak?"
* **Kunci Jawaban:**  
  *“Kuncinya di pembagian tugas yang jelas sejak awal. Satu orang megang backend & AI, satu orang antarmuka frontend, dan satu orang data serta skenario pengujian. Kami pakai Git untuk kolaborasi kode, jadi kami bisa ngoding barengan tanpa saling menimpa pekerjaan.”*

#### M-NF05. "Bikin aplikasi kayak gini butuh modal uang berapa kak? Mahal gak buat sewa hostingnya?"
* **Kunci Jawaban:**  
  *“Nol rupiah saat masa pengembangan! Kita bisa pakai Docker di laptop lokal untuk database MySQL, Python virtual environment gratis, dan React lokal. Kalau mau di-online-kan untuk tingkat sekolah, cukup pakai VPS murah seharga 50–80 ribu per bulan atau layanan cloud gratis khusus pelajar (*GitHub Student Pack*).”*

#### M-NF06. "Kenapa namanya SIGAP kak? Siapa yang nemuin singkatannya?"
* **Kunci Jawaban:**  
  *“SIGAP singkatan dari 'Sistem Informasi Pengaduan Perundungan dan Kekerasan Pelajar'. Kata 'Sigap' dalam bahasa Indonesia artinya tangkas, cepat, dan siap siaga. Harapannya, pihak sekolah bisa sigap dan tanggap menolong korban perundungan sebelum dampaknya fatal.”*

#### M-NF07. "Kalau laporannya anonim, terus guru BK mau bantu korbannya gimana caranya kalau gak tahu siapa yang lapor?"
* **Kunci Jawaban:**  
  *“Di formulir ada rincian lokasi kejadian, waktu, dan pelaku. Guru BK bisa langsung meningkatkan pengawasan di lokasi tersebut tanpa mempermalukan korban. Selain itu, ada fitur catatan tiket: guru BK bisa menulis pesan di sistem, 'Kami sudah menerima aduanmu, jika butuh konseling privat kamu bisa datang dengan membawa tiket ini secara rahasia'.”*

#### M-NF08. "Kak, UI webnya kelihatan rapi dan estetik, belajarnya dari mana atau pakai komponen apa?"
* **Kunci Jawaban:**  
  *“Kami pakai framework Tailwind CSS dipadukan dengan icon dari Lucide-React dan animasi halus Framer Motion. Kami juga riset tren UI modern dengan prinsip *clean design*, kontras warna yang nyaman di mata, dan form berundak agar pengguna tidak stres melihat banyak pertanyaan sekaligus.”*

#### M-NF09. "Kenapa database-nya pilih MySQL/MariaDB kak? Kenapa gak MongoDB yang NoSQL?"
* **Kunci Jawaban:**  
  *“Karena data pengaduan sekolah memiliki relasi struktural yang jelas dan butuh integritas data tinggi (*ACID compliance*): relasi antara tabel laporan, bukti digital, audit log, dan akun guru BK harus konsisten. Database relasional SQL jauh lebih handal dalam mencegah inkonsistensi data dibanding NoSQL.”*

#### M-NF10. "Ada rencana mau dikembangin jadi aplikasi Android beneran gak kak di semester depan?"
* **Kunci Jawaban:**  
  *“Pasti ada! Karena backend FastAPI kami sudah menerapkan arsitektur RESTful API yang rapi, semester depan kami tinggal membuat antarmuka mobile menggunakan Flutter atau React Native yang langsung terhubung ke endpoint backend SIGAP yang sudah ada sekarang.”*

---

## 🎯 KESIMPULAN RINGKAS UNTUK SLIDE PENUTUP
> *"SIGAP membuktikan bahwa kecerdasan buatan dan rekayasa web modern dapat menjadi solusi nyata atas masalah sosial krusial di dunia pendidikan. Dengan melindungi privasi siswa melalui mode anonim dan memberdayakan guru melalui triase cerdas serta transparansi audit, kita dapat mewujudkan lingkungan sekolah yang aman, inklusif, dan bebas perundungan."*

---

## 💻 BAGIAN 4: PERTANYAAN SPESIFIK FRONTEND (15 SOAL + KUNCI JAWABAN)

> Pertanyaan-pertanyaan ini berfokus pada implementasi teknis sisi antarmuka pengguna (React, Vite, Tailwind CSS, Framer Motion, dll.) yang digunakan dalam sistem SIGAP.

---

#### FE-01. Mengapa kalian memilih React sebagai framework frontend dan bukan Vue.js atau Angular?
* **Kunci Jawaban:**  
  *"React kami pilih karena ekosistemnya paling matang dan komunitasnya terbesar, sehingga referensi dan library pendukungnya sangat melimpah. React berbasis komponen (*component-based architecture*) memudahkan kami membagi antarmuka seperti form multi-langkah, dashboard analitik, dan tabel laporan menjadi komponen-komponen yang bisa dipakai ulang. Selain itu, React hooks (`useState`, `useEffect`, `useContext`) sangat cocok untuk manajemen state form yang dinamis di alur pelaporan multi-step SIGAP."*

---

#### FE-02. Apa fungsi Vite dalam proyek frontend SIGAP dan kenapa tidak pakai Create React App (CRA)?
* **Kunci Jawaban:**  
  *"Vite adalah build tool generasi baru berbasis ES Modules native yang memiliki kecepatan startup dev server hampir instan karena menggunakan native browser ESM — berbeda dengan CRA yang membundel seluruh proyek terlebih dahulu. Vite menghasilkan bundle produksi yang jauh lebih kecil dan cepat menggunakan Rollup. Untuk SIGAP yang tampilannya harus ringan diakses dari HP sekolah dengan koneksi terbatas, Vite adalah pilihan yang jauh lebih optimal."*

---

#### FE-03. Bagaimana Tailwind CSS digunakan dalam SIGAP dan apa keunggulannya dibanding CSS biasa atau Bootstrap?
* **Kunci Jawaban:**  
  *"Tailwind CSS adalah utility-first CSS framework — alih-alih membuat class `.card` atau `.button` secara manual, kami langsung menerapkan class utilitas kecil seperti `bg-blue-600`, `rounded-xl`, `shadow-md`, `px-4`, dan `flex` langsung di elemen HTML. Keunggulannya: tidak ada konflik nama class, ukuran CSS final sangat kecil karena Tailwind hanya menyertakan class yang benar-benar dipakai (`purge/content`), dan konsistensi desain lebih mudah dijaga dibanding CSS biasa. Dibanding Bootstrap, Tailwind tidak memaksa opini visual tertentu sehingga tampilan SIGAP lebih unik dan custom."*

---

#### FE-04. Untuk apa Framer Motion digunakan di frontend SIGAP?
* **Kunci Jawaban:**  
  *"Framer Motion adalah library animasi untuk React yang kami gunakan untuk menambahkan transisi halaman (*page transition*), animasi kemunculan elemen (*fade-in*, *slide-up*), dan transisi antar langkah di formulir multi-step. Tujuannya bukan sekadar estetika — animasi halus secara psikologis membuat pengalaman pelaporan terasa lebih ringan dan tidak mengintimidasi bagi siswa yang sedang dalam kondisi tertekan."*

---

#### FE-05. Bagaimana implementasi formulir multi-langkah (*multi-step wizard*) di React pada halaman pelaporan siswa?
* **Kunci Jawaban:**  
  *"Kami menggunakan state management React dengan `useState` untuk menyimpan nomor langkah aktif dan data setiap field form. Setiap step dirender sebagai komponen terpisah yang dikontrol oleh state induk. Navigasi antar step dilakukan melalui tombol 'Lanjut' dan 'Kembali' yang memanipulasi state langkah. Validasi dilakukan per-step sebelum mengizinkan navigasi ke langkah berikutnya, sehingga user tidak bisa melompat langkah. Data semua step dikumpulkan dan dikirim sekaligus ke backend saat langkah terakhir selesai."*

---

#### FE-06. Bagaimana cara frontend SIGAP menangani autentikasi JWT secara aman?
* **Kunci Jawaban:**  
  *"Token JWT yang diterima dari backend setelah login disimpan di memori React (variabel state atau React Context) — bukan di `localStorage` maupun `sessionStorage` untuk menghindari risiko serangan XSS (*Cross-Site Scripting*). Setiap request ke API yang membutuhkan autentikasi menyertakan token ini di header `Authorization: Bearer <token>`. Jika token kedaluwarsa, interceptor Axios mendeteksi respons 401 dan mengarahkan pengguna kembali ke halaman login."*

---

#### FE-07. Apa itu React Context dan bagaimana penggunaannya dalam SIGAP?
* **Kunci Jawaban:**  
  *"React Context adalah mekanisme bawaan React untuk berbagi state global antar komponen tanpa harus melewatkan props secara berantai (*prop drilling*). Di SIGAP, kami menggunakan Context untuk menyimpan dan mendistribusikan data sesi pengguna yang sudah login (data profil guru BK, token JWT, dan status autentikasi) ke seluruh komponen yang membutuhkan — seperti sidebar, header, dan setiap halaman dashboard — tanpa perlu mengoper props satu per satu."*

---

#### FE-08. Bagaimana frontend menampilkan status laporan secara visual menggunakan *stepper* atau *timeline*?
* **Kunci Jawaban:**  
  *"Kami membuat komponen `StatusTimeline` yang menerima prop status kasus saat ini dan merender deretan *step indicator* horizontal atau vertikal. Setiap step memiliki kondisi: `completed` (ikon centang + warna hijau), `active` (ikon bulat berwarna biru + animasi pulse), dan `pending` (ikon abu-abu). Status ini dipetakan dari nilai string status backend (`PENDING`, `VERIFIED`, `INVESTIGATION`, `RESOLVED`) ke indeks angka untuk menentukan visual tiap step."*

---

#### FE-09. Bagaimana SIGAP memastikan tampilan frontend tetap *mobile-responsive* untuk siswa yang mengakses dari HP?
* **Kunci Jawaban:**  
  *"Kami menerapkan mobile-first design approach menggunakan breakpoint Tailwind CSS: semua komponen didesain untuk layar kecil terlebih dahulu, lalu ditambahkan modifier `md:` atau `lg:` untuk layar yang lebih besar. Layout utama menggunakan CSS Flexbox dan Grid yang fluid. Formulir pelaporan menggunakan input berukuran cukup besar dengan target area sentuh minimal 44px agar mudah diketuk dengan jempol. Kami juga menguji tampilan di berbagai resolusi menggunakan DevTools Chrome."*

---

#### FE-10. Bagaimana cara frontend mengirim file bukti digital ke backend secara aman?
* **Kunci Jawaban:**  
  *"Upload file dilakukan menggunakan `FormData` API browser yang dikombinasikan dengan Axios. File yang dipilih pengguna dari input `type='file'` dimasukkan ke objek `FormData` bersama field-field teks laporan lainnya, lalu dikirim ke endpoint backend dengan `Content-Type: multipart/form-data`. Di sisi frontend, sebelum dikirim kami sudah melakukan validasi awal: memeriksa ekstensi file yang diizinkan dan ukuran file tidak melebihi 10 MB, sehingga request yang jelas tidak valid sudah ditolak sebelum sampai ke server."*

---

#### FE-11. Apa fungsi Axios dalam frontend SIGAP dan kenapa tidak menggunakan `fetch` API bawaan browser?
* **Kunci Jawaban:**  
  *"Axios memberikan beberapa kemudahan dibanding `fetch` native: pertama, Axios secara otomatis memparsing response JSON tanpa perlu `.json()` manual. Kedua, Axios mendukung *interceptors* — lapisan middleware yang memungkinkan kami menyisipkan token JWT secara otomatis di setiap header request keluar dan menangani error 401/403 secara terpusat tanpa menulis logika berulang di setiap komponen. Ketiga, Axios mendukung pembatalan request (*request cancellation*) yang berguna untuk mencegah race condition saat komponen di-unmount."*

---

#### FE-12. Bagaimana SIGAP menampilkan visualisasi data dashboard analitik di sisi admin?
* **Kunci Jawaban:**  
  *"Dashboard admin SIGAP menampilkan beberapa elemen visual: kartu statistik angka (total laporan, laporan aktif, laporan selesai) yang dirender dari response API. Untuk grafik tren dan distribusi kategori, kami menggunakan library *charting* seperti Recharts atau Chart.js yang diintegrasikan ke komponen React. Data diambil dari endpoint backend menggunakan `useEffect` pada saat komponen dimuat, dan diperbarui secara berkala atau ketika guru BK memperbarui status kasus."*

---

#### FE-13. Bagaimana cara frontend SIGAP mencegah double-submit saat siswa menekan tombol kirim laporan berkali-kali?
* **Kunci Jawaban:**  
  *"Kami menggunakan state boolean `isSubmitting` yang di-set ke `true` tepat saat tombol submit ditekan. Selama `isSubmitting` bernilai `true`, tombol submit dinonaktifkan (`disabled`) dan tampilannya berubah menjadi spinner loading. State ini baru dikembalikan ke `false` setelah respons dari API diterima — baik berhasil maupun gagal. Ini mencegah pengguna mengirim request duplikat yang bisa menghasilkan laporan ganda di database."*

---

#### FE-14. Bagaimana handling error dari API ditampilkan ke pengguna di frontend SIGAP?
* **Kunci Jawaban:**  
  *"Error dari API ditangkap di blok `catch` Axios. Berdasarkan kode status HTTP-nya, kami menampilkan pesan yang sesuai: 400 menampilkan pesan validasi spesifik dari backend, 401/403 mengarahkan ke halaman login, 413 menampilkan pesan 'Ukuran file terlalu besar', dan 500 menampilkan pesan umum 'Terjadi kesalahan pada server'. Pesan error ditampilkan sebagai komponen notifikasi (`toast`) non-intrusif di sudut layar menggunakan library seperti `react-hot-toast` atau komponen Alert custom."*

---

#### FE-15. Bagaimana cara frontend mengimplementasikan halaman pelacak tiket tanpa memerlukan login pengguna?
* **Kunci Jawaban:**  
  *"Halaman pelacak tiket adalah halaman publik yang tidak membutuhkan autentikasi sama sekali. Pengguna memasukkan kode tiket di input field, lalu frontend mengirim request GET ke endpoint publik backend (misalnya `GET /api/reports/track/{ticket_code}`) tanpa menyertakan token JWT apapun di header. Backend hanya mengembalikan informasi status dan catatan progres yang bisa dibaca publik — tanpa narasi detail atau identitas pelapor. Jika kode tiket tidak ditemukan, backend mengembalikan 404 dan frontend menampilkan pesan 'Kode tiket tidak ditemukan'."*

---

## 🖥️ BAGIAN 5: PERTANYAAN SPESIFIK BACKEND (15 SOAL + KUNCI JAWABAN)

> Pertanyaan-pertanyaan ini berfokus pada implementasi teknis sisi server (FastAPI, Python, SQLAlchemy, JWT, IndoBERT, HDBSCAN, dll.) yang digunakan dalam sistem SIGAP.

---

#### BE-01. Bagaimana struktur proyek backend FastAPI SIGAP diorganisir?
* **Kunci Jawaban:**  
  *"Backend SIGAP mengikuti pola arsitektur berlapis (*layered architecture*) yang modular. Strukturnya terdiri dari: direktori `routers/` yang menyimpan file endpoint per fitur (laporan, autentikasi, pengguna, NLP), direktori `models/` untuk definisi tabel database menggunakan SQLAlchemy ORM, direktori `schemas/` untuk model validasi data request/response menggunakan Pydantic v2, direktori `services/` untuk logika bisnis termasuk inferensi IndoBERT dan HDBSCAN, serta `core/` untuk konfigurasi global seperti koneksi database, pengaturan CORS, dan middleware JWT."*

---

#### BE-02. Mengapa FastAPI menggunakan Pydantic v2 untuk validasi data dan apa bedanya dengan validasi manual?
* **Kunci Jawaban:**  
  *"Pydantic v2 memungkinkan kami mendefinisikan skema data menggunakan Python class dengan type annotation. Ketika request masuk ke endpoint, FastAPI otomatis memvalidasi semua field: tipe data, keberadaan field wajib, panjang string, range angka, format email, dan lain-lain — tanpa perlu menulis kode validasi manual satu per satu. Jika ada field yang tidak valid, Pydantic otomatis mengembalikan response 422 Unprocessable Entity dengan pesan error yang detail dan terstruktur. Ini menghemat ratusan baris kode validasi boilerplate."*

---

#### BE-03. Bagaimana SQLAlchemy ORM bekerja dalam backend SIGAP untuk operasi database?
* **Kunci Jawaban:**  
  *"SQLAlchemy ORM memungkinkan kami mendefinisikan tabel database sebagai Python class (disebut Model). Misalnya class `Report` merepresentasikan tabel `reports` dengan atribut `id`, `ticket_code`, `narrative`, `status`, `reporter_id`, dll. Untuk operasi CRUD, kami tidak menulis SQL mentah — melainkan menggunakan method ORM seperti `session.add(new_report)`, `session.query(Report).filter(...)`, atau `session.delete(report)`. SQLAlchemy mengonversinya ke SQL yang dioptimalkan secara otomatis, dan mendukung transaction management serta relationship antar tabel."*

---

#### BE-04. Bagaimana mekanisme pembuatan dan verifikasi JWT di backend FastAPI SIGAP?
* **Kunci Jawaban:**  
  *"Saat Guru BK login dengan kredensial yang valid, backend menggunakan library `python-jose` untuk membuat token JWT yang berisi payload: `sub` (user ID), `role`, dan `exp` (waktu kedaluwarsa). Token ditandatangani dengan algoritma HS256 menggunakan secret key yang disimpan di variabel environment `.env`. Untuk setiap request ke endpoint terproteksi, `Depends(get_current_user)` di FastAPI mengekstrak token dari header `Authorization`, memverifikasi signature-nya, mengecek apakah sudah expired, lalu mengembalikan data pengguna. Jika token tidak valid, FastAPI otomatis mengembalikan response 401."*

---

#### BE-05. Bagaimana backend SIGAP mengimplementasikan *rate limiting* untuk mencegah spam laporan palsu?
* **Kunci Jawaban:**  
  *"Kami menggunakan middleware atau dependency FastAPI yang menghitung frekuensi request dari satu sumber dalam jendela waktu tertentu (*sliding window counter*). Implementasinya bisa menggunakan library seperti `slowapi` yang terintegrasi dengan FastAPI, atau menyimpan counter di cache Redis. Jika sebuah koneksi mengirim lebih dari threshold yang ditetapkan (misalnya 5 laporan per 10 menit), backend mengembalikan response 429 Too Many Requests dengan pesan informatif."*

---

#### BE-06. Bagaimana backend memproses inferensi IndoBERT untuk klasifikasi narasi aduan?
* **Kunci Jawaban:**  
  *"Model IndoBERT (`indobenchmark/indobert-base-p1`) dimuat satu kali saat aplikasi FastAPI start menggunakan `transformers.AutoTokenizer` dan `transformers.AutoModel` dari HuggingFace. Proses inferensi berjalan dalam tiga tahap: pertama, narasi siswa di-tokenisasi dengan `tokenizer.encode_plus()` menghasilkan `input_ids` dan `attention_mask`. Kedua, token-token ini dilewatkan ke model untuk menghasilkan hidden states, lalu diambil representasi vektor 768 dimensi dari token `[CLS]` sebagai sentence embedding. Ketiga, embedding ini dibandingkan dengan embedding prototipe setiap kategori menggunakan rumus cosine similarity, dan kategori dengan skor tertinggi menjadi rekomendasi."*

---

#### BE-07. Bagaimana cara backend menjamin anonimitas laporan murni di level database?
* **Kunci Jawaban:**  
  *"Pada endpoint pelaporan anonim, backend FastAPI menggunakan versi endpoint yang tidak memerlukan JWT sama sekali. Di dalam handler endpoint tersebut, field `reporter_id` dalam model `Report` diisi `None` (NULL). Backend tidak mengakses `request.client.host` untuk merekam IP, dan tidak menyimpan header `User-Agent` atau `X-Forwarded-For` ke kolom manapun di database. Satu-satunya data yang tersimpan adalah narasi, waktu, lokasi, kategori, dan kode tiket — tanpa jejak identitas."*

---

#### BE-08. Bagaimana implementasi *State Transition Guard* pada backend untuk status laporan?
* **Kunci Jawaban:**  
  *"Setiap endpoint pembaruan status laporan memiliki validasi logika transisi sebelum melakukan update. Kami mendefinisikan dictionary allowed transitions seperti: `PENDING` hanya bisa pindah ke `VERIFIED`, `VERIFIED` hanya ke `INVESTIGATION`, `INVESTIGATION` hanya ke `RESOLVED`. Jika Guru BK mengirim request untuk memindahkan status ke kondisi yang tidak valid — misalnya langsung dari `PENDING` ke `RESOLVED` — backend mengembalikan response 400 Bad Request dengan pesan error 'Transisi status tidak valid'. Ini mencegah penanganan kasus yang tidak prosedural."*

---

#### BE-09. Bagaimana audit trail diimplementasikan di backend SIGAP agar tidak bisa dimanipulasi?
* **Kunci Jawaban:**  
  *"Setiap kali status laporan berubah, endpoint FastAPI secara otomatis membuat baris baru di tabel `audit_logs` yang berisi: `report_id`, `actor_id` (ID Guru BK yang melakukan aksi), `action` (jenis tindakan), `old_status`, `new_status`, dan `timestamp` yang di-generate server-side — bukan dari input klien. Tabel `audit_logs` tidak memiliki endpoint untuk UPDATE atau DELETE — hanya INSERT dan SELECT yang diizinkan. Dengan demikian, rekaman ini bersifat append-only dan tidak bisa dimodifikasi dari antarmuka manapun."*

---

#### BE-10. Bagaimana validasi berkas bukti digital dilakukan di layer backend?
* **Kunci Jawaban:**  
  *"Validasi berlapis dilakukan di service upload: pertama, ukuran file dicek tidak melebihi 10 MB menggunakan `file.size`. Kedua, ekstensi file dicocokkan dengan whitelist yang diizinkan. Ketiga — dan ini yang paling krusial — kami membaca 12 byte pertama dari file buffer menggunakan `await file.read(12)` lalu mencocokkannya dengan tabel magic bytes: misalnya `FF D8 FF` untuk JPEG, `89 50 4E 47` untuk PNG, `25 50 44 46` untuk PDF. Jika magic bytes tidak cocok dengan ekstensi yang diklaim, file ditolak dengan 400 Bad Request. File yang lolos validasi disimpan dengan nama UUID v4 acak di direktori terisolasi."*

---

#### BE-11. Bagaimana CORS dikonfigurasi di backend FastAPI SIGAP?
* **Kunci Jawaban:**  
  *"CORS dikonfigurasi menggunakan `CORSMiddleware` bawaan FastAPI/Starlette. Kami mendefinisikan `allow_origins` hanya dengan domain frontend yang sah (misalnya `http://localhost:3000` untuk development dan URL produksi untuk deployment) — bukan wildcard `'*'` yang berbahaya. `allow_credentials=True` diaktifkan agar cookie dan header Authorization bisa dikirim cross-origin. Method yang diizinkan dibatasi: GET, POST, PUT, PATCH, DELETE sesuai kebutuhan endpoint. Konfigurasi ini dibaca dari variabel environment `.env` agar bisa berbeda antara development dan production."*

---

#### BE-12. Bagaimana backend FastAPI mengelola koneksi database secara efisien menggunakan *connection pooling*?
* **Kunci Jawaban:**  
  *"Kami menggunakan `create_engine` SQLAlchemy dengan parameter `pool_size` dan `max_overflow` untuk mengkonfigurasi connection pool. Connection pool mempertahankan sejumlah koneksi database yang tetap terbuka dan siap pakai, sehingga setiap request tidak perlu membuka dan menutup koneksi baru dari nol. `SessionLocal` dibuat menggunakan `sessionmaker` dan didistribusikan ke setiap endpoint melalui `Depends(get_db)` — dependency injection FastAPI yang otomatis membuat session baru per request dan menutupnya dengan benar setelah request selesai menggunakan `finally`."*

---

#### BE-13. Bagaimana backend mengimplementasikan algoritma HDBSCAN untuk pemetaan klaster insiden?
* **Kunci Jawaban:**  
  *"Data koordinat lokasi dari seluruh laporan yang sudah diverifikasi diambil dari database. Array koordinat [latitude, longitude] ini diproses menggunakan `hdbscan.HDBSCAN(min_cluster_size=3)` dari library Python HDBSCAN. Output berupa array label klaster: angka 0, 1, 2, dst. menandakan klaster berbeda, sementara label `-1` berarti data noise atau insiden terisolasi. Hasil klaster ini — bersama ID laporan, koordinat, dan label klasternya — dikembalikan sebagai JSON ke frontend untuk divisualisasikan sebagai overlay peta atau grafik sebaran titik rawan."*

---

#### BE-14. Bagaimana endpoint backend FastAPI untuk pelacakan tiket bekerja tanpa memerlukan autentikasi?
* **Kunci Jawaban:**  
  *"Endpoint `GET /api/reports/track/{ticket_code}` didefinisikan tanpa parameter `Depends(get_current_user)`, sehingga FastAPI tidak mewajibkan token JWT. Backend melakukan query ke tabel `reports` dengan filter `ticket_code = :code`. Jika ditemukan, backend hanya mengembalikan field terpilih yang aman untuk publik: `status`, `created_at`, `updated_at`, dan daftar catatan progres dari Guru BK — tanpa mengembalikan narasi penuh, identitas pelapor, atau data sensitif lainnya. Jika tiket tidak ditemukan, response 404 dikembalikan."*

---

#### BE-15. Bagaimana backend SIGAP di-deploy menggunakan Docker dan apa manfaatnya?
* **Kunci Jawaban:**  
  *"Seluruh stack SIGAP — frontend React, backend FastAPI, database MySQL, dan phpMyAdmin — dikemas menggunakan Docker Compose dengan masing-masing service dalam container terpisah. `Dockerfile` backend menggunakan base image Python resmi, menginstal dependensi dari `requirements.txt`, dan menjalankan Uvicorn sebagai ASGI server. Manfaatnya: pertama, environment yang identik antara development dan production menghilangkan masalah 'berjalan di laptop saya tapi tidak di server'. Kedua, instalasi di sekolah baru cukup dengan satu perintah `docker-compose up -d`. Ketiga, isolasi antar service mencegah konflik library atau port."*
