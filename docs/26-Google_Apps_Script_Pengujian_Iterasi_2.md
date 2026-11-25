# 📜 Google Apps Script — Pembuat Otomatis Form Pengujian Iterasi ke-2 (SIGAP Minggu ke-13)

Dokumen ini memuat panduan, arsitektur instrumen evaluasi, dan kode lengkap **Google Apps Script** untuk membuat **Google Form Kuesioner Pengujian Iterasi ke-2 (Post-Improvement Evaluation)** secara otomatis, serta skrip otomasi pengolahan skor di **Google Sheets** dengan komparasi delta peningkatan terhadap baseline Iterasi ke-1.

---

## 🎯 Latar Belakang & Tujuan Pengujian Iterasi ke-2

Pada pengujian **Iterasi ke-1** (Minggu ke-12) dengan 23 responden riil, sistem SIGAP memperoleh skor kebergunaan **SUS 66,85** (*Marginal-High / Grade D*) dan penerimaan teknologi **TAM 4,08** (*Perceived Usefulness = 4,14* dan *Perceived Ease of Use = 4,02*). Berdasarkan evaluasi tersebut dan catatan implementasi **Minggu ke-13 (Sesi 134 s.d. Sesi 143)**, serangkaian penyempurnaan utama telah dituntaskan:

1. **Responsivitas & Integrasi Visual Mobile**:
   - Optimalisasi presisi kubus 3D (*Interactive Photo Cube*) pada layar smartphone berbasis slot dinamis (`#hero-mobile-cube-slot`), memastikan kubus terbingkai seimbang di tengah tanpa menutupi judul, deskripsi, tombol aksi (*CTA*), maupun formulir pencarian tiket.
2. **Navigasi Presisi Landing Page**:
   - Perbaikan *scroll anchor* navbar (Alur Penanganan, 7 Kategori Yuridis, FAQ, dsb.) dengan kompensasi offset ketinggian navbar sehingga posisi berhenti tepat (*pixel-perfect*).
3. **Pengaturan Akun & Koreksi Mandiri Siswa**:
   - Penambahan fitur Pengaturan Akun pada Dashboard Siswa untuk koreksi mandiri data identitas (seperti salah ketik/typo NISN, nama lengkap, asal sekolah) serta pembaruan kata sandi.
4. **Penyederhanaan Antarmuka Dashboard Siswa**:
   - Pembersihan elemen yang terlalu padat pada dashboard siswa menjadi antarmuka yang bersih, intuitif, dan terintegrasi dengan aksi cepat: *Buat Aduan*, *Lacak Tiket*, dan *Sinkronkan Data*.
5. **Akses Bantuan Autentikasi Admin**:
   - Resolusi tautan bantuan pada laman masuk admin (*Lupa Kata Sandi* dan *Pusat Bantuan Masuk*).
6. **Penyelarasan Naskah Ilmiah & Evaluasi NLP**:
   - Pengujian klasifikasi 7 kategori yuridis Permendikbudristek No. 46/2023 dengan Macro F1-Score 81,07% pada 280 sampel uji.

Pengujian Iterasi ke-2 bertujuan mengukur secara empiris **kenaikan skor kebergunaan (SUS)** dan **penerimaan pengguna (TAM)** pasca implementasi perbaikan Minggu ke-13.

---

## 📌 Cara Penggunaan Cepat:

1. Buka peramban dan akses **[script.google.com](https://script.google.com/)**.
2. Klik tombol **New Project** (Project Baru).
3. Beri nama proyek, misalnya: `SIGAP - Form Generator Iterasi 2`.
4. Hapus seluruh isi editor bawaan, lalu **salin dan tempelkan (copy-paste)** **Script 1** di bawah ini.
5. Klik ikon **Save (💾)**, pilih fungsi `buatFormPengujianSIGAPIterasi2`, lalu klik **Run (▶)**.
6. Berikan izin otorisasi akses akun Google Anda (*Review Permissions* $\rightarrow$ *Allow*).
7. Buka tab **Execution log** di bagian bawah editor untuk melihat:
   - 📋 **Tautan Publik Form Responden** (sebarkan ke siswa, guru, dan admin).
   - ✏️ **Tautan Editor Form Admin** (untuk memantau tanggapan).
8. Setelah data kuesioner terkumpul di Google Sheets tanggapan, gunakan **Script 2** untuk menghitung rekapitulasi skor SUS, TAM, dan komparasi delta terhadap Iterasi 1 secara otomatis.

---

## 1️⃣ Script 1: Google Apps Script Pembuat Form Pengujian Iterasi ke-2

```javascript
/**
 * ==========================================================================
 * SIGAP — Script Pembuat Google Form Pengujian Iterasi ke-2 (Minggu ke-13)
 * ==========================================================================
 * Struktur Form (5 Section):
 *   1. Data Karakteristik Responden & Riwayat Pengujian
 *   2. System Usability Scale (SUS) — 10 Pertanyaan Brooke Terstandar
 *   3. Technology Acceptance Model (TAM) — 5 PU + 5 PEOU
 *   4. Evaluasi Khusus Perbaikan Fitur Minggu ke-13 (5 Indikator Khusus)
 *   5. Masukan Kualitatif, Kesan, & Saran Lanjutan
 * ==========================================================================
 */

function buatFormPengujianSIGAPIterasi2() {
  // ── 1. Inisialisasi Google Form ───────────────────────────
  var form = FormApp.create('Kuesioner Evaluasi Pengujian Pengguna (Iterasi 2) — SIGAP');

  form.setDescription(
    '📋 KUESIONER EVALUASI SISTEM INFORMASI GAWAT ADUAN PERUNDUNGAN (SIGAP)\n' +
    'Fase Evaluasi: Iterasi ke-2 (Pasca-Perbaikan Siklus Pengembangan Minggu ke-13)\n\n' +
    'Kuesioner ini dirancang untuk mengevaluasi efektivitas, kemudahan, dan tingkat kepuasan ' +
    'pengguna setelah dilakukan serangkaian optimalisasi antarmuka (UI/UX responsif mobile, ' +
    'navigasi presisi, fitur koreksi mandiri data akun siswa, dan penyederhanaan alur kerja sistem).\n\n' +
    '⏱️ Estimasi Waktu Pengisian: 5–8 menit\n' +
    '🔒 Kerahasiaan Data: Identitas responden dilindungi secara ketat dan data tanggapan ' +
    'hanya dipergunakan demi kepentingan riset ilmiah akademik dan validasi sistem SIGAP.\n\n' +
    'Terima kasih atas dedikasi dan kontribusi nyata Anda dalam mewujudkan sekolah aman tanpa perundungan!'
  );

  form.setIsQuiz(false);
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setAllowResponseEdits(false);
  form.setShowLinkToRespondAgain(false);
  form.setConfirmationMessage(
    '✅ Terima kasih! Tanggapan Pengujian Iterasi ke-2 Anda telah berhasil tersimpan.\n\n' +
    'Kontribusi Anda sangat berharga dalam membuktikan peningkatan mutu, kebergunaan, dan ' +
    'efektivitas sistem SIGAP demi perlindungan seluruh warga satuan pendidikan.'
  );
  form.setProgressBar(true);

  // ── Standar Skala Likert 5 Poin ───────────────────────────
  var skalaLikert = [
    '1 — Sangat Tidak Setuju (STS)',
    '2 — Tidak Setuju (TS)',
    '3 — Netral (N)',
    '4 — Setuju (S)',
    '5 — Sangat Setuju (SS)'
  ];

  // ════════════════════════════════════════════════════════════
  // SECTION 1: PROFIL RESPONDEN & RIWAYAT PENGUJIAN
  // ════════════════════════════════════════════════════════════
  form.addSectionHeaderItem()
    .setTitle('📌 Section 1 — Profil Responden & Riwayat Pengujian')
    .setHelpText(
      'Isi identitas Anda sebagai responden uji coba. Nama bersifat opsional ' +
      'apabila Anda ingin menjaga anonimitas.'
    );

  // 1.1 Nama Lengkap
  form.addTextItem()
    .setTitle('Nama Lengkap')
    .setHelpText('Opsional — Boleh dikosongkan jika memilih mengisi secara anonim.')
    .setRequired(false);

  // 1.2 Peran Responden
  form.addMultipleChoiceItem()
    .setTitle('Peran Anda dalam pengujian sistem SIGAP ini')
    .setChoiceValues([
      'Siswa (Pelapor / Pengguna Utama Portal Siswa)',
      'Guru BK / Tim Satgas PPKSP (Pengelola Kasus / Admin)',
      'Tenaga Kependidikan / Wali Murid / Pengamat'
    ])
    .setRequired(true);

  // 1.3 Jenis Kelamin
  form.addMultipleChoiceItem()
    .setTitle('Jenis Kelamin')
    .setChoiceValues(['Laki-laki', 'Perempuan'])
    .setRequired(true);

  // 1.4 Kelas / Instansi / Jabatan
  form.addTextItem()
    .setTitle('Kelas / Instansi / Jabatan')
    .setHelpText('Contoh: "Kelas XI-A", "Guru Bimbingan Konseling", atau "Satgas Pencegahan Kekerasan".')
    .setRequired(true);

  // 1.5 Riwayat Partisipasi Pengujian
  form.addMultipleChoiceItem()
    .setTitle('Apakah Anda sebelumnya pernah mencoba SIGAP pada Pengujian Iterasi 1?')
    .setHelpText('Informasi ini berguna untuk menganalisis perbandingan persepsi pengguna berulang vs pengguna baru.')
    .setChoiceValues([
      'Ya, saya pernah mencoba SIGAP pada pengujian sebelumnya (Iterasi 1)',
      'Belum, ini pertama kali saya mencoba dan menguji sistem SIGAP (Responden Baru)'
    ])
    .setRequired(true);

  // 1.6 Perangkat yang Digunakan untuk Menguji
  form.addMultipleChoiceItem()
    .setTitle('Perangkat utama yang Anda gunakan saat menguji SIGAP kali ini')
    .setChoiceValues([
      'Smartphone / Ponsel Pintar (Mobile Android / iOS)',
      'Laptop / Komputer Desktop (PC)',
      'Keduanya (Mencoba di Laptop dan Smartphone)'
    ])
    .setRequired(true);

  // ════════════════════════════════════════════════════════════
  // SECTION 2: SYSTEM USABILITY SCALE (SUS) — 10 PERTANYAAN
  // ════════════════════════════════════════════════════════════
  form.addPageBreakItem()
    .setTitle('📊 Section 2 — System Usability Scale (SUS)')
    .setHelpText(
      'Bagian ini menggunakan instrumen baku System Usability Scale (Brooke, 1996) ' +
      'untuk mengukur tingkat kebergunaan sistem SIGAP secara objektif dan terstandar internasional.\n\n' +
      'Petunjuk: Berikan penilaian sejujurnya berdasarkan pengalaman langsung Anda menggunakan platform SIGAP. ' +
      'Pilih skala 1 (Sangat Tidak Setuju) hingga 5 (Sangat Setuju).'
    );

  var pertanyaanSUS = [
    'S1. Saya merasa akan sering menggunakan sistem SIGAP ini jika menghadapi atau menemukan kasus perundungan.',
    'S2. Saya merasa sistem SIGAP ini terlalu rumit untuk digunakan.',
    'S3. Saya merasa sistem SIGAP ini mudah digunakan.',
    'S4. Saya merasa membutuhkan bantuan teknis dari orang lain untuk dapat menggunakan sistem ini.',
    'S5. Saya merasa fitur-fitur dan alur kerja di dalam sistem SIGAP terintegrasi dengan sangat baik.',
    'S6. Saya merasa ada terlalu banyak hal yang tidak konsisten pada sistem ini.',
    'S7. Saya merasa sebagian besar pengguna (siswa dan guru) dapat memahami cara mengoperasikan sistem ini dengan cepat.',
    'S8. Saya merasa sistem SIGAP ini sangat membingungkan atau canggung untuk digunakan.',
    'S9. Saya merasa sangat percaya diri dan aman saat menggunakan sistem SIGAP.',
    'S10. Saya merasa harus mempelajari banyak hal terlebih dahulu sebelum dapat menggunakan sistem ini secara lancar.'
  ];

  for (var i = 0; i < pertanyaanSUS.length; i++) {
    form.addMultipleChoiceItem()
      .setTitle(pertanyaanSUS[i])
      .setChoiceValues(skalaLikert)
      .setRequired(true);
  }

  // ════════════════════════════════════════════════════════════
  // SECTION 3: TECHNOLOGY ACCEPTANCE MODEL (TAM)
  // ════════════════════════════════════════════════════════════
  form.addPageBreakItem()
    .setTitle('🎯 Section 3 — Technology Acceptance Model (TAM)')
    .setHelpText(
      'Bagian ini mengukur persepsi kemanfaatan (Perceived Usefulness) dan kemudahan penggunaan ' +
      '(Perceived Ease of Use) terhadap platform SIGAP (Davis, 1989).\n\n' +
      'Petunjuk: Pilih salah satu skala dari 1 (Sangat Tidak Setuju) hingga 5 (Sangat Setuju).'
    );

  // ── 3A. Perceived Usefulness (PU) ──
  form.addSectionHeaderItem()
    .setTitle('A. Perceived Usefulness (PU) — Persepsi Kemanfaatan Sistem')
    .setHelpText('Sejauh mana platform SIGAP membantu dan meningkatkan efektivitas pencegahan serta penanganan kasus perundungan.');

  var pertanyaanPU = [
    'PU1. Penggunaan SIGAP secara nyata mempercepat alur penyampaian aduan perundungan di lingkungan sekolah.',
    'PU2. Fitur pelaporan berjenjang dan perlindungan anonimitas SIGAP meningkatkan efektivitas perlindungan bagi korban.',
    'PU3. Fitur pelacakan tiket aduan (Quick Ticket Tracking) memudahkan pemantauan progres penanganan secara transparan.',
    'PU4. Kemampuan AI dalam mengklasifikasikan kategori kekerasan secara otomatis sangat bermanfaat bagi tim penanganan kasus.',
    'PU5. Secara menyeluruh, platform SIGAP sangat berharga dan bermanfaat bagi terciptanya budaya sekolah yang aman.'
  ];

  for (var j = 0; j < pertanyaanPU.length; j++) {
    form.addMultipleChoiceItem()
      .setTitle(pertanyaanPU[j])
      .setChoiceValues(skalaLikert)
      .setRequired(true);
  }

  // ── 3B. Perceived Ease of Use (PEOU) ──
  form.addSectionHeaderItem()
    .setTitle('B. Perceived Ease of Use (PEOU) — Persepsi Kemudahan Penggunaan')
    .setHelpText('Sejauh mana Anda merasa interaksi dengan antarmuka SIGAP terasa mudah, jelas, dan tidak membebani.');

  var pertanyaanPEOU = [
    'PEOU1. Navigasi dan langkah-langkah dalam sistem SIGAP sangat jelas dan mudah dipahami tanpa memerlukan buku panduan khusus.',
    'PEOU2. Desain visual SIGAP rapi, profesional, dan nyaman dipandang baik pada perangkat ponsel maupun laptop.',
    'PEOU3. Proses pengisian formulir aduan hingga mendapatkan kode tiket berlangsung dengan cepat dan intuitif.',
    'PEOU4. Menu-menu informasi, status tiket, dan tombol aksi mudah ditemukan di posisi yang tepat.',
    'PEOU5. Secara menyeluruh, sistem SIGAP sangat mudah, ramah pengguna, dan nyaman dioperasikan.'
  ];

  for (var k = 0; k < pertanyaanPEOU.length; k++) {
    form.addMultipleChoiceItem()
      .setTitle(pertanyaanPEOU[k])
      .setChoiceValues(skalaLikert)
      .setRequired(true);
  }

  // ════════════════════════════════════════════════════════════
  // SECTION 4: EVALUASI PERBAIKAN FITUR MINGGU KE-13
  // ════════════════════════════════════════════════════════════
  form.addPageBreakItem()
    .setTitle('🚀 Section 4 — Evaluasi Perbaikan & Pembaruan Sistem (Minggu ke-13)')
    .setHelpText(
      'Bagian ini secara khusus mengevaluasi 5 perbaikan fitur utama yang telah dikerjakan ' +
      'pada siklus pengembangan Minggu ke-13 berdasarkan masukan responden sebelumnya.\n\n' +
      'Petunjuk: Berikan penilaian Anda terhadap aspek peningkatan berikut (1 = Sangat Tidak Setuju s.d. 5 = Sangat Setuju).'
    );

  var pertanyaanPerbaikan = [
    'IMP1. [Tampilan Mobile & Kubus 3D]: Pada perangkat HP/smartphone, tata letak visual halaman utama kini terlihat rapi, proporsional, dan elemen animasi tidak lagi menutupi teks, tombol, maupun kolom pencarian.',
    'IMP2. [Navigasi Anchor Halaman]: Saat mengklik menu di navigasi atas (seperti 7 Kategori, Alur Penanganan, dan FAQ), layar bergulir dengan halus dan berhenti tepat pada posisinya tanpa terpotong navbar.',
    'IMP3. [Pengaturan Profil Siswa]: Fitur koreksi data profil pada dashboard siswa sangat memudahkan jika terjadi salah ketik (typo) NISN, nama, atau asal sekolah tanpa harus mendaftar ulang.',
    'IMP4. [Dashboard Siswa Bersih]: Tampilan dashboard siswa saat ini terasa lebih ringkas, fokus, dan tidak membuat bingung dengan akses langsung pada Buat Aduan, Lacak Tiket, dan Sinkronkan Data.',
    'IMP5. [Bantuan Masuk Admin]: Tautan bantuan pemulihan kata sandi dan kendala masuk pada halaman admin bekerja dengan jelas dan informatif.'
  ];

  for (var m = 0; m < pertanyaanPerbaikan.length; m++) {
    form.addMultipleChoiceItem()
      .setTitle(pertanyaanPerbaikan[m])
      .setChoiceValues(skalaLikert)
      .setRequired(true);
  }

  // ════════════════════════════════════════════════════════════
  // SECTION 5: KESAN KUALITATIF & SARAN LANJUTAN
  // ════════════════════════════════════════════════════════════
  form.addPageBreakItem()
    .setTitle('💬 Section 5 — Kesan Kualitatif & Rekomendasi Lanjutan')
    .setHelpText(
      'Tuliskan opini terbuka dan pengalaman Anda untuk membantu tim pengembang menyempurnakan SIGAP ke depannya. ' +
      'Bagian ini bersifat opsional namun sangat kami apresiasi.'
    );

  form.addParagraphTextItem()
    .setTitle('1. Menurut Anda, apa perubahan atau peningkatan yang paling terasa lebih baik pada versi SIGAP saat ini?')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('2. Apakah Anda masih menemukan kendala, kesulitan, atau tampilan yang kurang pas saat mencoba sistem?')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('3. Apa rekomendasi atau ide fitur tambahan yang menurut Anda krusial untuk diterapkan pada pengembangan berikutnya?')
    .setRequired(false);

  // ── Logging Hasil Pembuatan Form ──────────────────────────
  var formUrl = form.getPublishedUrl();
  var editUrl = form.getEditUrl();

  Logger.log('════════════════════════════════════════════════════════════════════');
  Logger.log('🎉 GOOGLE FORM PENGUJIAN ITERASI KE-2 BERHASIL DICIPTAKAN!');
  Logger.log('════════════════════════════════════════════════════════════════════');
  Logger.log('📋 Tautan Kuesioner Publik (Responden) : ' + formUrl);
  Logger.log('✏️ Tautan Editor Kuesioner (Admin)     : ' + editUrl);
  Logger.log('════════════════════════════════════════════════════════════════════');
  Logger.log('Total Item Form: 34 Pertanyaan (6 Profil, 10 SUS, 10 TAM, 5 Evaluasi Perbaikan, 3 Kualitatif)');
  Logger.log('════════════════════════════════════════════════════════════════════');
}
```

---

## 2️⃣ Script 2: Otomasi Kalkulasi Skor SUS & TAM Iterasi 2 di Google Sheets

Skrip ini dipasang langsung pada file **Google Sheets yang menampung hasil respon Google Form di atas**:
1. Buka spreadsheet tanggapan form Anda di Google Sheets.
2. Klik menu **Extensions (Ekstensi)** $\rightarrow$ **Apps Script**.
3. Tempelkan kode di bawah ini, lalu simpan dan jalankan fungsi `hitungEvaluasiIterasi2()`.
4. Skrip akan membuat sheet baru bernama **`📊 Rekapitulasi_Iterasi_2`** yang secara otomatis:
   - Menghitung skor SUS per responden dengan rumus standar Brooke (skor 0–100).
   - Menghitung rata-rata TAM (Perceived Usefulness & Perceived Ease of Use).
   - Menghitung rata-rata skor kepuasan perbaikan Minggu ke-13.
   - **Menyajikan tabel perbandingan komparasi Delta peningkatan antara Iterasi 1 vs Iterasi 2**.

```javascript
/**
 * ==========================================================================
 * SIGAP — Script Kalkulasi Otomatis Skor SUS, TAM & Delta Iterasi 1 vs 2
 * ==========================================================================
 */

function hitungEvaluasiIterasi2() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = ss.getSheets()[0]; // Sheet tanggapan kuesioner utama
  var data = sourceSheet.getDataRange().getValues();

  if (data.length <= 1) {
    SpreadsheetApp.getUi().alert('⚠️ Belum ada tanggapan responden yang masuk di sheet ini!');
    return;
  }

  var headers = data[0];
  
  // Deteksi indeks kolom berdasarkan pola nama kolom
  var susCols = [];
  var puCols = [];
  var peouCols = [];
  var impCols = [];

  for (var c = 0; c < headers.length; c++) {
    var h = headers[c].toString();
    if (h.match(/^S([1-9]|10)\./i)) susCols.push(c);
    else if (h.match(/^PU[1-5]\./i)) puCols.push(c);
    else if (h.match(/^PEOU[1-5]\./i)) peouCols.push(c);
    else if (h.match(/^IMP[1-5]\./i)) impCols.push(c);
  }

  // Validasi kecukupan kolom
  if (susCols.length !== 10) {
    Logger.log('Peringatan: Kolom SUS yang terdeteksi: ' + susCols.length + ' (Seharusnya 10)');
  }

  function parseSkala(val) {
    if (!val) return 3;
    var str = val.toString().trim();
    var match = str.match(/^([1-5])/);
    return match ? parseInt(match[1], 10) : 3;
  }

  var totalSUS = 0;
  var totalPU = 0;
  var totalPEOU = 0;
  var totalIMP = 0;
  var jumlahResponden = data.length - 1;

  var detailResponden = [];

  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    
    // Kalkulasi SUS per Responden:
    // Pertanyaan ganjil (S1, S3, S5, S7, S9): Nilai - 1
    // Pertanyaan genap (S2, S4, S6, S8, S10): 5 - Nilai
    var sumSUSPerResponden = 0;
    for (var s = 0; s < susCols.length; s++) {
      var raw = parseSkala(row[susCols[s]]);
      if (s % 2 === 0) {
        sumSUSPerResponden += (raw - 1);
      } else {
        sumSUSPerResponden += (5 - raw);
      }
    }
    var susScore = sumSUSPerResponden * 2.5;
    totalSUS += susScore;

    // Kalkulasi TAM PU
    var sumPU = 0;
    for (var p = 0; p < puCols.length; p++) {
      sumPU += parseSkala(row[puCols[p]]);
    }
    var avgPU = puCols.length > 0 ? (sumPU / puCols.length) : 0;
    totalPU += avgPU;

    // Kalkulasi TAM PEOU
    var sumPEOU = 0;
    for (var pe = 0; pe < peouCols.length; pe++) {
      sumPEOU += parseSkala(row[peouCols[pe]]);
    }
    var avgPEOU = peouCols.length > 0 ? (sumPEOU / peouCols.length) : 0;
    totalPEOU += avgPEOU;

    // Kalkulasi Evaluasi Perbaikan
    var sumIMP = 0;
    for (var im = 0; im < impCols.length; im++) {
      sumIMP += parseSkala(row[impCols[im]]);
    }
    var avgIMP = impCols.length > 0 ? (sumIMP / impCols.length) : 0;
    totalIMP += avgIMP;

    detailResponden.push([r, susScore.toFixed(2), avgPU.toFixed(2), avgPEOU.toFixed(2), avgIMP.toFixed(2)]);
  }

  var finalSUS = totalSUS / jumlahResponden;
  var finalPU = totalPU / jumlahResponden;
  var finalPEOU = totalPEOU / jumlahResponden;
  var finalTAM = (finalPU + finalPEOU) / 2;
  var finalIMP = totalIMP / jumlahResponden;

  // Baseline Evaluasi Iterasi ke-1 (dari data paper & log Sesi 138-140)
  var baseSUS_Iterasi1 = 66.85;
  var baseTAM_Iterasi1 = 4.08;
  var basePU_Iterasi1 = 4.14;
  var basePEOU_Iterasi1 = 4.02;

  var deltaSUS = finalSUS - baseSUS_Iterasi1;
  var deltaTAM = finalTAM - baseTAM_Iterasi1;
  var deltaPU = finalPU - basePU_Iterasi1;
  var deltaPEOU = finalPEOU - basePEOU_Iterasi1;

  // Tentukan Adjective Rating SUS
  var susGrade = '';
  var susAdjective = '';
  if (finalSUS >= 85) { susGrade = 'A+'; susAdjective = 'Best Imaginable (Sangat Luar Biasa)'; }
  else if (finalSUS >= 80) { susGrade = 'A'; susAdjective = 'Excellent (Sangat Baik)'; }
  else if (finalSUS >= 73) { susGrade = 'B'; susAdjective = 'Good (Baik & Diterima)'; }
  else if (finalSUS >= 68) { susGrade = 'C'; susAdjective = 'Acceptable (Cukup / Di Atas Rata-rata Industri)'; }
  else { susGrade = 'D'; susAdjective = 'Marginal / Needs Improvement'; }

  // ── Pembuatan / Penulisan Sheet Rekapitulasi ───────────────
  var reportSheet = ss.getSheetByName('📊 Rekapitulasi_Iterasi_2');
  if (reportSheet) {
    ss.deleteSheet(reportSheet);
  }
  reportSheet = ss.insertSheet('📊 Rekapitulasi_Iterasi_2');

  reportSheet.getRange('A1:E1').merge().setValue('HASIL PENGUJIAN EVALUASI PENGGUNA — ITERASI KE-2 (SIGAP)')
    .setFontWeight('bold').setFontSize(14).setHorizontalAlignment('center').setBackground('#BFEFFF').setFontColor('#1C6F8E');

  reportSheet.getRange('A2:E2').merge().setValue('Waktu Analisis: ' + new Date().toLocaleString('id-ID') + ' | Jumlah Responden: ' + jumlahResponden)
    .setFontSize(10).setHorizontalAlignment('center').setFontStyle('italic');

  // Tabel Ringkasan Metrik & Komparasi Delta
  var summaryRows = [
    ['Metrik Evaluasi', 'Iterasi 1 (Baseline)', 'Iterasi 2 (Saat Ini)', 'Perubahan (Delta)', 'Status Keterangan'],
    ['System Usability Scale (SUS)', baseSUS_Iterasi1.toFixed(2), finalSUS.toFixed(2), (deltaSUS >= 0 ? '+' : '') + deltaSUS.toFixed(2), susGrade + ' — ' + susAdjective],
    ['TAM: Perceived Usefulness (PU)', basePU_Iterasi1.toFixed(2), finalPU.toFixed(2), (deltaPU >= 0 ? '+' : '') + deltaPU.toFixed(2), finalPU >= 4.0 ? 'Tinggi (Sangat Bermanfaat)' : 'Cukup'],
    ['TAM: Perceived Ease of Use (PEOU)', basePEOU_Iterasi1.toFixed(2), finalPEOU.toFixed(2), (deltaPEOU >= 0 ? '+' : '') + deltaPEOU.toFixed(2), finalPEOU >= 4.0 ? 'Tinggi (Sangat Mudah)' : 'Cukup'],
    ['TAM: Rata-Rata Komposit TAM', baseTAM_Iterasi1.toFixed(2), finalTAM.toFixed(2), (deltaTAM >= 0 ? '+' : '') + deltaTAM.toFixed(2), finalTAM >= 4.0 ? 'Diterima Kuat (High Acceptance)' : 'Cukup'],
    ['Evaluasi Fitur Minggu ke-13', '— (Baru)', finalIMP.toFixed(2), '—', finalIMP >= 4.2 ? 'Perbaikan Efektif & Memuaskan' : 'Perlu Poles Lanjutan']
  ];

  reportSheet.getRange(4, 1, summaryRows.length, 5).setValues(summaryRows);
  reportSheet.getRange(4, 1, 1, 5).setFontWeight('bold').setBackground('#E0F7FA').setFontColor('#006064');
  reportSheet.getRange(4, 1, summaryRows.length, 5).setBorder(true, true, true, true, true, true);

  // Tabel Rincian per Responden
  reportSheet.getRange(12, 1, 1, 5).setValues([['Responden #', 'Skor SUS (0-100)', 'Skor PU (1-5)', 'Skor PEOU (1-5)', 'Skor Perbaikan (1-5)']])
    .setFontWeight('bold').setBackground('#F5F5F5');
  reportSheet.getRange(13, 1, detailResponden.length, 5).setValues(detailResponden);
  reportSheet.getRange(12, 1, detailResponden.length + 1, 5).setBorder(true, true, true, true, true, true);

  reportSheet.autoResizeColumns(1, 5);

  SpreadsheetApp.getUi().alert(
    '✅ Rekapitulasi Iterasi 2 Berhasil Dihitung!\n\n' +
    '• Rata-rata Skor SUS : ' + finalSUS.toFixed(2) + ' (Delta: ' + (deltaSUS >= 0 ? '+' : '') + deltaSUS.toFixed(2) + ')\n' +
    '• Skor Komposit TAM  : ' + finalTAM.toFixed(2) + ' (Delta: ' + (deltaTAM >= 0 ? '+' : '') + deltaTAM.toFixed(2) + ')\n' +
    '• Evaluasi Perbaikan : ' + finalIMP.toFixed(2) + ' / 5.00\n\n' +
    'Silakan tinjau lembar "📊 Rekapitulasi_Iterasi_2".'
  );
}
```

---

## 3️⃣ Template Teks Siaran / Broadcast untuk Responden (Siswa & Guru)

Gunakan draf pesan ini untuk disebarkan melalui grup WhatsApp, Telegram, atau email sekolah saat mengundang responden:

```text
Halo rekan-rekan Siswa, Bapak/Ibu Guru, dan Tim Satgas PPKSP 👋

Dalam rangka meningkatkan mutu dan kenyamanan platform SIGAP (Sistem Informasi Gawat Aduan Perundungan), kami mengundang Anda untuk berpartisipasi dalam Pengujian Pengguna Tahap ke-2 (Iterasi 2).

Pada pembaruan versi terbaru ini, kami telah menerapkan beberapa penyempurnaan utama berdasarkan masukan Anda sebelumnya:
✨ Tampilan utama yang lebih rapi dan bebas tumpukan visual di layar HP (Mobile-Responsive 100%).
✨ Navigasi tombol navbar yang bergerak presisi dan pas saat diklik.
✨ Fitur Pengaturan Akun di Dashboard Siswa untuk koreksi mandiri data (seperti perbaikan typo NISN).
✨ Antarmuka Dashboard Siswa yang lebih ringkas, fokus, dan bebas distraksi.

Silakan uji coba platform SIGAP melalui tautan berikut:
🌐 Akses Sistem : [MASUKKAN_URL_SIGAP_ANDA]

Setelah mencoba, mohon kesediaan waktu Anda selama 5–8 menit untuk mengisi kuesioner evaluasi singkat berikut:
📋 Tautan Kuesioner : [MASUKKAN_URL_GOOGLE_FORM_ITERASI_2]

🔒 Catatan: Nama Anda bersifat opsional. Seluruh jawaban dijaga kerahasiaannya dan semata-mata digunakan untuk validasi riset akademik.

Terima kasih banyak atas dukungan nyata Anda dalam menciptakan ekosistem sekolah yang aman, nyaman, dan bebas dari perundungan! 🛡️✨
```
