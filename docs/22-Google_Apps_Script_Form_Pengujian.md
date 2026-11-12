# 📜 Google Apps Script — Pembuat Otomatis Form Pengujian SIGAP (SUS & TAM)

Dokumen ini berisi kode **Google Apps Script** untuk membuat Google Form kuesioner evaluasi secara otomatis, beserta script kalkulasi skor otomatis di Google Sheets.

---

## 📌 Cara Penggunaan Cepat:

1. Buka peramban dan akses **[script.google.com](https://script.google.com/)**.
2. Klik tombol **New Project** (Project Baru).
3. Hapus seluruh isi editor, lalu **salin dan tempelkan (copy-paste)** **Script 1** di bawah ini.
4. Klik tombol **Save (💾)**, lalu pilih fungsi `buatFormPengujianSIGAP` dan klik tombol **Run (▶)**.
5. Berikan izin akses akun Google Anda (*Review Permissions* $\rightarrow$ *Allow*).
6. Buka menu **Execution log** di bagian bawah editor untuk melihat **URL Google Form** yang berhasil dibuat. Sebarkan URL tersebut kepada responden.

---

## 1️⃣ Script 1: Pembuat Google Form Kuesioner (SUS & TAM)

```javascript
/**
 * ============================================================
 * SIGAP — Script Pembuat Google Form Pengujian Otomatis
 * ============================================================
 * Membuat Google Form lengkap 4 Section:
 *   1. Data Responden (Nama, Peran, Gender, Kelas/Jabatan)
 *   2. System Usability Scale (SUS) — 10 Pertanyaan Brooke
 *   3. Technology Acceptance Model (TAM) — 5 PU + 5 PEOU
 *   4. Kesan & Saran (3 Pertanyaan Terbuka Opsional)
 * ============================================================
 */

function buatFormPengujianSIGAP() {
  // ── 1. Inisialisasi Form ──────────────────────────────────
  var form = FormApp.create('Kuesioner Pengujian Penerimaan Pengguna — SIGAP');
  
  form.setDescription(
    '📋 Kuesioner Evaluasi Sistem Informasi Gawat Aduan Perundungan (SIGAP)\n\n' +
    'Kuesioner ini bertujuan untuk mengukur tingkat kebergunaan (usability) dan penerimaan pengguna ' +
    '(user acceptance) terhadap sistem SIGAP yang telah Anda coba.\n\n' +
    '⏱️ Estimasi waktu pengisian: 5–8 menit\n' +
    '🔒 Identitas Anda dijaga kerahasiaannya dan data hanya digunakan untuk keperluan penelitian akademik.\n\n' +
    'Terima kasih atas partisipasi dan kontribusi berharga Anda!'
  );
  
  form.setIsQuiz(false);
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setAllowResponseEdits(false);
  form.setShowLinkToRespondAgain(false);
  form.setConfirmationMessage(
    '✅ Terima kasih telah berpartisipasi dalam pengujian SIGAP!\n\n' +
    'Masukan Anda sangat berharga untuk mendukung terciptanya lingkungan sekolah ' +
    'yang aman, inklusif, dan bebas dari segala bentuk perundungan.'
  );
  form.setProgressBar(true);

  // ── Opsi Skala Likert 5 Poin ──────────────────────────────
  var skalaLikert = [
    '1 — Sangat Tidak Setuju',
    '2 — Tidak Setuju',
    '3 — Netral',
    '4 — Setuju',
    '5 — Sangat Setuju'
  ];

  // ════════════════════════════════════════════════════════════
  // SECTION 1: DATA RESPONDEN
  // ════════════════════════════════════════════════════════════
  form.addSectionHeaderItem()
    .setTitle('📌 Section 1 — Data Responden')
    .setHelpText(
      'Lengkapi data diri Anda sebagai responden pengujian. ' +
      'Nama bersifat opsional (boleh dikosongkan jika ingin tetap anonim).'
    );

  // 1.1 Nama Lengkap
  form.addTextItem()
    .setTitle('Nama Lengkap')
    .setHelpText('Opsional — boleh dikosongkan demi menjaga kerahasiaan identitas.')
    .setRequired(false);

  // 1.2 Peran Responden
  form.addMultipleChoiceItem()
    .setTitle('Peran Anda dalam pengujian ini')
    .setChoiceValues([
      'Siswa (Pelapor)',
      'Guru BK / Admin (Pengelola Laporan)'
    ])
    .setRequired(true);

  // 1.3 Jenis Kelamin
  form.addMultipleChoiceItem()
    .setTitle('Jenis Kelamin')
    .setChoiceValues(['Laki-laki', 'Perempuan'])
    .setRequired(true);

  // 1.4 Kelas atau Jabatan
  form.addTextItem()
    .setTitle('Kelas / Jabatan')
    .setHelpText('Contoh: "XII IPA 2", "X-B", atau "Guru BK / Satgas PPKSP"')
    .setRequired(true);

  // ════════════════════════════════════════════════════════════
  // SECTION 2: SYSTEM USABILITY SCALE (SUS)
  // ════════════════════════════════════════════════════════════
  form.addPageBreakItem()
    .setTitle('📊 Section 2 — System Usability Scale (SUS)')
    .setHelpText(
      'Bagian ini mengukur tingkat kebergunaan (usability) sistem SIGAP secara terstandar.\n\n' +
      'Petunjuk: Berikan penilaian terhadap sistem SIGAP yang telah Anda uji coba. ' +
      'Pilih salah satu skala dari 1 (Sangat Tidak Setuju) sampai 5 (Sangat Setuju) ' +
      'untuk setiap pernyataan berikut.'
    );

  var pertanyaanSUS = [
    'S1. Saya merasa akan sering menggunakan sistem SIGAP ini.',
    'S2. Saya merasa sistem ini terlalu rumit untuk digunakan.',
    'S3. Saya merasa sistem ini mudah digunakan.',
    'S4. Saya merasa membutuhkan bantuan orang lain atau teknisi untuk dapat menggunakan sistem ini.',
    'S5. Saya merasa berbagai fungsi dalam sistem ini terintegrasi dengan baik.',
    'S6. Saya merasa terlalu banyak ketidakkonsistenan dalam sistem ini.',
    'S7. Saya merasa kebanyakan orang akan dapat mempelajari sistem ini dengan cepat.',
    'S8. Saya merasa sistem ini sangat tidak praktis untuk digunakan.',
    'S9. Saya merasa sangat percaya diri saat menggunakan sistem ini.',
    'S10. Saya perlu belajar banyak hal terlebih dahulu sebelum dapat menggunakan sistem ini.'
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
      'Bagian ini mengukur persepsi kemanfaatan dan kemudahan penggunaan sistem SIGAP.\n\n' +
      'Petunjuk: Pilih salah satu skala dari 1 (Sangat Tidak Setuju) sampai 5 (Sangat Setuju) ' +
      'untuk setiap pernyataan berikut.'
    );

  // ── 3A. Perceived Usefulness (PU) ──
  form.addSectionHeaderItem()
    .setTitle('A. Perceived Usefulness (PU) — Persepsi Kemanfaatan')
    .setHelpText('Sejauh mana Anda merasa SIGAP bermanfaat dalam mendukung pencegahan dan penanganan kasus perundungan.');

  var pertanyaanPU = [
    'PU1. Menggunakan SIGAP mempercepat proses pelaporan kasus perundungan di sekolah.',
    'PU2. SIGAP membantu meningkatkan efektivitas penanganan kasus perundungan.',
    'PU3. SIGAP memudahkan pemantauan status penanganan laporan yang telah dibuat.',
    'PU4. Fitur triase AI pada SIGAP bermanfaat untuk menentukan kategori dan urgensi kasus secara otomatis.',
    'PU5. Secara keseluruhan, SIGAP bermanfaat untuk mendukung pencegahan dan penanganan perundungan di sekolah.'
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
    .setHelpText('Sejauh mana Anda merasa SIGAP mudah dipahami, dipelajari, dan dioperasikan.');

  var pertanyaanPEOU = [
    'PEOU1. Saya mudah memahami cara menggunakan SIGAP tanpa perlu pelatihan khusus.',
    'PEOU2. Tampilan antarmuka SIGAP terlihat jelas, rapi, dan mudah dinavigasi.',
    'PEOU3. Proses membuat laporan aduan di SIGAP dapat dilakukan dengan langkah yang sederhana.',
    'PEOU4. Saya mudah menemukan informasi atau fitur yang saya butuhkan di dalam SIGAP.',
    'PEOU5. Secara keseluruhan, SIGAP mudah dan nyaman untuk digunakan.'
  ];

  for (var k = 0; k < pertanyaanPEOU.length; k++) {
    form.addMultipleChoiceItem()
      .setTitle(pertanyaanPEOU[k])
      .setChoiceValues(skalaLikert)
      .setRequired(true);
  }

  // ════════════════════════════════════════════════════════════
  // SECTION 4: KESAN & SARAN (KUALITATIF)
  // ════════════════════════════════════════════════════════════
  form.addPageBreakItem()
    .setTitle('💬 Section 4 — Kesan & Saran')
    .setHelpText(
      'Bagian ini bersifat opsional. Berikan masukan Anda untuk ' +
      'pengembangan platform SIGAP ke depannya.'
    );

  form.addParagraphTextItem()
    .setTitle('Apa hal yang paling Anda sukai dari sistem SIGAP?')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('Apa kendala atau kesulitan yang Anda alami saat menggunakan SIGAP?')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('Apakah ada fitur tambahan yang Anda harapkan tersedia di SIGAP?')
    .setRequired(false);

  // ── Ringkasan URL Output ──────────────────────────────────
  var formUrl = form.getPublishedUrl();
  var editUrl = form.getEditUrl();

  Logger.log('════════════════════════════════════════════════════════');
  Logger.log('✅ GOOGLE FORM BERHASIL DIBUAT DENGAN SUKSES!');
  Logger.log('════════════════════════════════════════════════════════');
  Logger.log('📋 Tautan Form Publik (Responden) : ' + formUrl);
  Logger.log('✏️ Tautan Editor Form (Admin)     : ' + editUrl);
  Logger.log('════════════════════════════════════════════════════════');
  Logger.log('Total Item: 27 Pertanyaan (4 Data Diri, 10 SUS, 10 TAM, 3 Saran)');
  Logger.log('════════════════════════════════════════════════════════');

  return {
    formUrl: formUrl,
    editUrl: editUrl
  };
}
```

---

## 2️⃣ Script 2: Penghitung Otomatis Skor SUS & TAM (Google Sheets)

Jalankan script ini di Spreadsheet tempat Google Form menyimpan jawaban (tab **Responses** $\rightarrow$ **Link to Sheets** $\rightarrow$ **Extensions** $\rightarrow$ **Apps Script**).

```javascript
/**
 * ============================================================
 * SIGAP — Penghitung Otomatis Skor SUS & TAM di Google Sheets
 * ============================================================
 * Membaca respons responden, menghitung skor SUS (0-100),
 * rata-rata PU (1-5), PEOU (1-5), dan TAM keseluruhan (1-5),
 * serta membuat sheet baru "Hasil Perhitungan" berisi ringkasan.
 * ============================================================
 */

function hitungSkorSUSdanTAM() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0]; // Sheet pertama berisi respon form
  var data = sheet.getDataRange().getValues();

  var COL_PERAN = 2;       // Kolom C (Peran)
  var COL_SUS_START = 5;   // Kolom F (S1)
  var COL_SUS_END = 14;    // Kolom O (S10)
  var COL_PU_START = 15;   // Kolom P (PU1)
  var COL_PU_END = 19;     // Kolom T (PU5)
  var COL_PEOU_START = 20; // Kolom U (PEOU1)
  var COL_PEOU_END = 24;   // Kolom Y (PEOU5)

  // Fungsi pembantu mengekstrak angka '1' s.d. '5' dari teks pilihan
  function extractNilai(jawaban) {
    if (!jawaban) return 0;
    var str = String(jawaban).trim();
    var angka = parseInt(str.charAt(0), 10);
    return isNaN(angka) ? 0 : angka;
  }

  // Buat atau bersihkan sheet "Hasil Perhitungan"
  var hasilSheet = ss.getSheetByName('Hasil Perhitungan');
  if (hasilSheet) {
    hasilSheet.clear();
  } else {
    hasilSheet = ss.insertSheet('Hasil Perhitungan');
  }

  // Header tabel hasil
  hasilSheet.appendRow([
    'No', 'Nama', 'Peran', 'Kelas/Jabatan',
    'Skor SUS (0–100)',
    'Rata-rata PU (1–5)', 'Rata-rata PEOU (1–5)', 'Skor TAM (1–5)',
    'Kategori SUS', 'Kategori TAM'
  ]);

  var totalSUS = 0, totalPU = 0, totalPEOU = 0, totalTAM = 0;
  var jumlahSiswa = 0, jumlahGuru = 0;
  var totalSUSSiswa = 0, totalSUSGuru = 0;
  var totalTAMSiswa = 0, totalTAMGuru = 0;
  var jumlahResponden = 0;

  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    if (!row[COL_PERAN]) continue; // Lewati baris kosong

    jumlahResponden++;
    var nama = row[1] || '(Anonim)';
    var peran = row[COL_PERAN];
    var kelas = row[4] || '-';

    // ── Perhitungan Skor SUS (Brooke) ──
    var skorSUSItems = 0;
    for (var s = COL_SUS_START; s <= COL_SUS_END; s++) {
      var nilai = extractNilai(row[s]);
      var nomorSoal = s - COL_SUS_START + 1; // 1 s.d. 10
      if (nomorSoal % 2 === 1) {
        // Soal Positif (Ganjil): Nilai - 1
        skorSUSItems += (nilai - 1);
      } else {
        // Soal Negatif (Genap): 5 - Nilai
        skorSUSItems += (5 - nilai);
      }
    }
    var skorSUS = skorSUSItems * 2.5; // Normalisasi ke skala 0-100

    // ── Perhitungan Skor TAM: PU ──
    var sumPU = 0;
    for (var p = COL_PU_START; p <= COL_PU_END; p++) {
      sumPU += extractNilai(row[p]);
    }
    var avgPU = sumPU / 5;

    // ── Perhitungan Skor TAM: PEOU ──
    var sumPEOU = 0;
    for (var q = COL_PEOU_START; q <= COL_PEOU_END; q++) {
      sumPEOU += extractNilai(row[q]);
    }
    var avgPEOU = sumPEOU / 5;

    // ── Rata-rata Skor TAM Total ──
    var skorTAM = (avgPU + avgPEOU) / 2;

    // ── Penentuan Kategori ──
    var katSUS = (skorSUS >= 85) ? 'Excellent' : (skorSUS >= 70) ? 'Good' : (skorSUS >= 50) ? 'Acceptable' : 'Poor';
    var katTAM = (skorTAM >= 4.20) ? 'Sangat Baik' : (skorTAM >= 3.40) ? 'Baik' : (skorTAM >= 2.60) ? 'Cukup' : 'Kurang';

    // Tulis baris responden
    hasilSheet.appendRow([
      jumlahResponden, nama, peran, kelas,
      Math.round(skorSUS * 100) / 100,
      Math.round(avgPU * 100) / 100,
      Math.round(avgPEOU * 100) / 100,
      Math.round(skorTAM * 100) / 100,
      katSUS, katTAM
    ]);

    totalSUS += skorSUS;
    totalPU += avgPU;
    totalPEOU += avgPEOU;
    totalTAM += skorTAM;

    if (String(peran).indexOf('Siswa') > -1) {
      jumlahSiswa++;
      totalSUSSiswa += skorSUS;
      totalTAMSiswa += skorTAM;
    } else {
      jumlahGuru++;
      totalSUSGuru += skorSUS;
      totalTAMGuru += skorTAM;
    }
  }

  // ── Baris Ringkasan Rata-rata untuk Paper IEEE ──
  if (jumlahResponden > 0) {
    hasilSheet.appendRow([]);
    hasilSheet.appendRow(['───', '───────────────────', '─────────', '─────────', '─────────', '─────────', '─────────', '─────────', '─────────', '─────────']);
    hasilSheet.appendRow([
      '', 'RATA-RATA KESELURUHAN', '(' + jumlahResponden + ' Responden)', '',
      Math.round((totalSUS / jumlahResponden) * 100) / 100,
      Math.round((totalPU / jumlahResponden) * 100) / 100,
      Math.round((totalPEOU / jumlahResponden) * 100) / 100,
      Math.round((totalTAM / jumlahResponden) * 100) / 100,
      '', ''
    ]);

    if (jumlahSiswa > 0) {
      hasilSheet.appendRow([
        '', 'Rata-rata Siswa', '(' + jumlahSiswa + ' Orang)', '',
        Math.round((totalSUSSiswa / jumlahSiswa) * 100) / 100,
        '', '',
        Math.round((totalTAMSiswa / jumlahSiswa) * 100) / 100,
        '', ''
      ]);
    }

    if (jumlahGuru > 0) {
      hasilSheet.appendRow([
        '', 'Rata-rata Guru BK / Admin', '(' + jumlahGuru + ' Orang)', '',
        Math.round((totalSUSGuru / jumlahGuru) * 100) / 100,
        '', '',
        Math.round((totalTAMGuru / jumlahGuru) * 100) / 100,
        '', ''
      ]);
    }

    Logger.log('✅ Selesai menghitung ' + jumlahResponden + ' respon.');
    Logger.log('Skor Rata-rata SUS: ' + Math.round((totalSUS / jumlahResponden) * 100) / 100);
    Logger.log('Skor Rata-rata TAM: ' + Math.round((totalTAM / jumlahResponden) * 100) / 100);
  }
}
```
