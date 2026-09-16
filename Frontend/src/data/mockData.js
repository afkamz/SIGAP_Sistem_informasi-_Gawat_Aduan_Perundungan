export const INITIAL_LAPORAN = [
  {
    id: 1,
    ticket_code: 'SGP-2024-0142',
    judul: 'Perundungan Siber Melalui Pesan Grup Kelas',
    deskripsi: 'Tangkapan layar berisi pesan intimidasi berulang dan ujaran merendahkan fisik di grup WhatsApp angkatan kelas IX-B sekolah.',
    kategori_id: 3,
    kategori_nama: 'Perundungan Siber (Cyberbullying)',
    status: 'diverifikasi', // menunggu -> diverifikasi -> ditindaklanjuti -> selesai
    urgensi: 'Tinggi',
    is_active: true,
    is_anonymous: true,
    reporter_label: 'Anonim (Siswa Kelas IX-B)',
    reporter_school: 'SMAN 1 Teladan',
    lokasi: 'Grup WhatsApp Angkatan IX',
    tanggal: '14 Mei 2024, 08:45 WIB',
    ai: {
      kategori_rekomendasi: 'Perundungan Siber',
      confidence: 94.2,
      secondary_suggestion: 'Kekerasan Psikis',
      secondary_confidence: 76.5,
      is_approved: false,
      is_overridden: false,
      cluster_label: 'KLS-09',
      cluster_name: 'Kemungkinan Klaster Grup Pesan IX-B',
      is_noise: false
    },
    bukti_file: 'tangkapan_layar_grup_wa.jpg',
    catatan_konselor: 'Bukti tangkapan layar telah kami verifikasi. Kami sedang melakukan koordinasi internal dengan wali kelas terkait tanpa membocorkan identitas siapapun.',
    history: [
      {
        waktu: '14 Mei 2024, 08:45 WIB',
        status: 'menunggu',
        pelaksana: 'Pelapor Anonim',
        catatan: 'Laporan diterima sistem SIGAP.'
      },
      {
        waktu: '14 Mei 2024, 09:15 WIB',
        status: 'diverifikasi',
        pelaksana: 'Ibu Rahmawati, S.Pd (Konselor BK)',
        catatan: 'Bukti tangkapan layar valid dan memenuhi syarat tindak lanjut Satgas PPKSP.'
      }
    ]
  },
  {
    id: 2,
    ticket_code: 'SGP-2024-0141',
    judul: 'Pemukulan dan Dorongan Fisik di Lapangan Basket Belakang',
    deskripsi: 'Terjadi pemukulan dan dorongan berulang saat pergantian jam pelajaran olahraga oleh sekelompok siswa kelas atas.',
    kategori_id: 2,
    kategori_nama: 'Perundungan Fisik',
    status: 'diverifikasi',
    urgensi: 'Sedang',
    is_active: true,
    is_anonymous: false,
    reporter_name: 'Dimas Prasetya',
    reporter_label: 'Kelas VII-D • Pelapor Terdaftar',
    reporter_school: 'SMAN 1 Teladan',
    lokasi: 'Area Lapangan Basket Belakang',
    tanggal: '13 Mei 2024, 14:20 WIB',
    ai: {
      kategori_rekomendasi: 'Perundungan Fisik',
      confidence: 87.0,
      secondary_suggestion: 'Perundungan Verbal',
      secondary_confidence: 65.0,
      is_approved: true,
      is_overridden: false,
      cluster_label: 'KLS-03',
      cluster_name: 'Terhubung ke insiden lapangan',
      is_noise: false
    },
    bukti_file: 'foto_memar_lengan.jpg',
    catatan_konselor: 'Konseling individual telah dijadwalkan dengan orang tua pelapor.',
    history: [
      {
        waktu: '13 Mei 2024, 14:20 WIB',
        status: 'menunggu',
        pelaksana: 'Dimas Prasetya',
        catatan: 'Laporan diserahkan secara terbuka.'
      },
      {
        waktu: '13 Mei 2024, 15:00 WIB',
        status: 'diverifikasi',
        pelaksana: 'Ibu Rahmawati, S.Pd (Konselor BK)',
        catatan: 'Dilakukan verifikasi fisik oleh tim medis UKS.'
      }
    ]
  },
  {
    id: 3,
    ticket_code: 'SGP-2024-0140',
    judul: 'Ejekan Berulang Mengenai Fisik dan Kondisi Keluarga',
    deskripsi: 'Pelaku berulang kali meneriakkan kata-kata yang mempermalukan di depan teman sekelas saat jam istirahat pertama.',
    kategori_id: 1,
    kategori_nama: 'Perundungan Verbal',
    status: 'menunggu',
    urgensi: 'Tinggi',
    is_active: true,
    is_anonymous: true,
    reporter_label: 'Kelas VIII-A • Anonim',
    reporter_school: 'SMAN 1 Teladan',
    lokasi: 'Ruang Kelas VIII-A',
    tanggal: '14 Mei 2024, 07:30 WIB',
    ai: {
      kategori_rekomendasi: 'Ketidakcocokan Kategori',
      confidence: 62.0,
      secondary_suggestion: 'Kekerasan Psikis',
      secondary_confidence: 58.0,
      is_approved: false,
      is_overridden: false,
      cluster_label: null,
      cluster_name: null,
      is_noise: true
    },
    bukti_file: null,
    catatan_konselor: 'Menunggu penelaahan awal oleh Tim Satgas.',
    history: [
      {
        waktu: '14 Mei 2024, 07:30 WIB',
        status: 'menunggu',
        pelaksana: 'Pelapor Anonim',
        catatan: 'Laporan masuk dalam antrean telaah.'
      }
    ]
  },
  {
    id: 4,
    ticket_code: 'SGP-2024-0139',
    judul: 'Pemalakan Uang Jajan Harian di Area Kantin Sekolah',
    deskripsi: 'Anak sering diancam tidak boleh makan jika tidak memberikan separuh uang saku kepada siswa senior di pojok kantin.',
    kategori_id: 2,
    kategori_nama: 'Perundungan Fisik',
    status: 'ditindaklanjuti',
    urgensi: 'Sedang',
    is_active: true,
    is_anonymous: false,
    reporter_label: 'Kantin Sekolah • Wali Murid',
    reporter_school: 'SMAN 1 Teladan',
    lokasi: 'Kantin Sisi Barat',
    tanggal: '18 Mei 2024, 11:10 WIB',
    ai: {
      kategori_rekomendasi: 'Perundungan Fisik',
      confidence: 91.5,
      secondary_suggestion: 'Perundungan Verbal',
      secondary_confidence: 72.0,
      is_approved: true,
      is_overridden: true,
      cluster_label: 'KLS-01',
      cluster_name: 'Pusat Klaster Pemalakan Kantin',
      is_noise: false
    },
    bukti_file: 'nota_kehilangan.pdf',
    catatan_konselor: 'Telah dilakukan mediasi tertutup bersama wali murid dan pihak pengelola kantin.',
    history: [
      { waktu: '10 Mei 2024, 08:00 WIB', status: 'menunggu', pelaksana: 'Wali Murid', catatan: 'Laporan diajukan.' },
      { waktu: '11 Mei 2024, 09:30 WIB', status: 'diverifikasi', pelaksana: 'Bpk. Ahmad Fauzi, M.Psi', catatan: 'Keterangan saksi dikonfirmasi.' },
      { waktu: '12 Mei 2024, 13:00 WIB', status: 'ditindaklanjuti', pelaksana: 'Ibu Rahmawati, S.Pd', catatan: 'Pemanggilan pihak terkait untuk mediasi tertutup.' }
    ]
  },
  {
    id: 5,
    ticket_code: 'SGP-2024-0138',
    judul: 'Pemberian Julukan Buruk dan Pengucilan di Kelas',
    deskripsi: 'Siswa dikucilkan secara sistematis dan dilarang diajak bicara selama 2 pekan berturut-turut.',
    kategori_id: 1,
    kategori_nama: 'Perundungan Verbal',
    status: 'selesai',
    urgensi: 'Rendah',
    is_active: true,
    is_anonymous: false,
    reporter_label: 'Kelas VIII-C • Saksi Siswa',
    reporter_school: 'SMAN 1 Teladan',
    lokasi: 'Kelas VIII-C',
    tanggal: '10 Mei 2024, 10:00 WIB',
    ai: {
      kategori_rekomendasi: 'Perundungan Verbal',
      confidence: 79.0,
      is_approved: true,
      is_overridden: false,
      cluster_label: null,
      is_noise: true
    },
    bukti_file: null,
    catatan_konselor: 'Konseling sebaya dan ikrar perdamaian kelas telah terlaksana.',
    history: [
      { waktu: '02 Mei 2024', status: 'menunggu', pelaksana: 'Saksi Siswa', catatan: 'Laporan masuk.' },
      { waktu: '04 Mei 2024', status: 'diverifikasi', pelaksana: 'Konselor BK', catatan: 'Wali kelas berkoordinasi.' },
      { waktu: '07 Mei 2024', status: 'ditindaklanjuti', pelaksana: 'Konselor BK', catatan: 'Sesi rekonsiliasi kelompok.' },
      { waktu: '10 Mei 2024', status: 'selesai', pelaksana: 'Ibu Rahmawati, S.Pd', catatan: 'Kasus terselesaikan dengan kesepakatan tertulis.' }
    ]
  },
  {
    id: 6,
    ticket_code: 'REF-2023-0812',
    judul: 'Arsip Kasus Nasional: Cyberbullying Melalui Akun Menfess Twitter',
    deskripsi: 'Data acuan nasional: Kasus pencemaran nama baik melalui bot menfess Twitter sekolah oleh pihak eksternal.',
    kategori_id: 3,
    kategori_nama: 'Perundungan Siber (Cyberbullying)',
    status: 'selesai',
    urgensi: 'Selesai',
    is_active: false,
    is_anonymous: true,
    reporter_label: 'Puspeka Kemendikbudristek • Benchmark',
    reporter_school: 'Data Nasional Indonesia',
    lokasi: 'Media Daring',
    tanggal: '12 Des 2023 (Arsip)',
    ai: {
      kategori_rekomendasi: 'Pola Terverifikasi',
      confidence: 98.0,
      is_approved: true,
      is_overridden: false,
      cluster_label: null,
      is_noise: false
    },
    bukti_file: null,
    catatan_konselor: 'Diturunkan oleh Kemkominfo dan penanganan lintas instansi tuntas.',
    history: []
  },
  {
    id: 7,
    ticket_code: 'REF-2023-0409',
    judul: 'Arsip Kasus Teladan: Penanganan Diskriminasi Etnis & Intoleransi',
    deskripsi: 'Data acuan nasional: Contoh keberhasilan mediasi restoratif berbasis kebhinekaan di satuan pendidikan.',
    kategori_id: 6,
    kategori_nama: 'Kekerasan Psikis / Pengucilan Sosial',
    status: 'selesai',
    urgensi: 'Selesai',
    is_active: false,
    is_anonymous: false,
    reporter_label: 'Satgas Kota Malang • Kasus Teladan',
    reporter_school: 'Satgas Wilayah Jawa Timur',
    lokasi: 'Area Satuan Pendidikan',
    tanggal: '04 Sep 2023 (Arsip)',
    ai: {
      kategori_rekomendasi: 'Pola Terverifikasi',
      confidence: 95.0,
      is_approved: true,
      is_overridden: false,
      cluster_label: null,
      is_noise: false
    },
    bukti_file: null,
    catatan_konselor: 'Penerapan modul pendidikan anti-kekerasan dan evaluasi berkala.',
    history: []
  },
  {
    id: 8,
    ticket_code: 'SGP-2024-0137',
    judul: 'Pelecehan Verbal dan Komentar Tidak Senonoh di Laboratorium',
    deskripsi: 'Ucapan bernada sensual dan sentuhan tidak pantas pada pundak saat praktikum kimia di laboratorium.',
    kategori_id: 4,
    kategori_nama: 'Kekerasan Seksual',
    status: 'ditindaklanjuti',
    urgensi: 'Tinggi',
    is_active: true,
    is_anonymous: true,
    reporter_label: 'Laboratorium IPA • Anonim',
    reporter_school: 'SMAN 1 Teladan',
    lokasi: 'Laboratorium IPA Lantai 2',
    tanggal: '08 Mei 2024, 13:15 WIB',
    ai: {
      kategori_rekomendasi: 'Kekerasan Seksual',
      confidence: 93.4,
      secondary_suggestion: 'Perundungan Verbal',
      secondary_confidence: 68.0,
      is_approved: true,
      is_overridden: false,
      cluster_label: null,
      is_noise: false
    },
    bukti_file: 'rekaman_audio_singkat.m4a',
    catatan_konselor: 'Pendampingan psikologis korban bekerjasama dengan UPTD PPA kota.',
    history: [
      { waktu: '08 Mei 2024', status: 'menunggu', pelaksana: 'Pelapor Anonim', catatan: 'Laporan darurat diterima.' },
      { waktu: '08 Mei 2024', status: 'diverifikasi', pelaksana: 'Satgas PPKSP', catatan: 'Penanganan prioritas tingkat 1.' },
      { waktu: '09 Mei 2024', status: 'ditindaklanjuti', pelaksana: 'Ibu Rahmawati, S.Pd', catatan: 'Rujukan pendampingan psikologis aman.' }
    ]
  },
  {
    id: 9,
    ticket_code: 'SGP-2024-0136',
    judul: 'Intimidasi Pesan dan Provokasi Tawuran Antar Kelas',
    deskripsi: 'Penyebaran pesan provokasi di grup obrolan tertutup yang melibatkan beberapa siswa kelas IX-A dan IX-B.',
    kategori_id: 1,
    kategori_nama: 'Perundungan Verbal',
    status: 'diverifikasi',
    urgensi: 'Sedang',
    is_active: true,
    is_anonymous: false,
    reporter_label: 'Kelas IX-A • Konselor BK',
    reporter_school: 'SMAN 1 Teladan',
    lokasi: 'Area Gerbang Belakang',
    tanggal: '12 Mei 2024, 09:30 WIB',
    ai: {
      kategori_rekomendasi: 'Perundungan Verbal',
      confidence: 88.0,
      secondary_suggestion: 'Perundungan Siber',
      secondary_confidence: 81.0,
      is_approved: false,
      is_overridden: false,
      cluster_label: 'KLS-09',
      cluster_name: 'Terhubung ke IX-B',
      is_noise: false
    },
    bukti_file: 'tangkapan_pesan_provokasi.png',
    catatan_konselor: 'Pemeriksaan saksi dan patroli keamanan bersama pihak sekolah telah diperketat.',
    history: [
      { waktu: '12 Mei 2024', status: 'menunggu', pelaksana: 'Konselor BK', catatan: 'Pencatatan laporan temuan.' },
      { waktu: '12 Mei 2024', status: 'diverifikasi', pelaksana: 'Bpk. Ahmad Fauzi, M.Psi', catatan: 'Pengamanan barang bukti digital.' }
    ]
  },
  {
    id: 10,
    ticket_code: 'SGP-2024-0135',
    judul: 'Pengabaian dan Penolakan Masuk Kelompok Belajar',
    deskripsi: 'Siswa secara konsisten ditolak dalam seluruh pembagian tugas kelompok mata pelajaran oleh rekan-rekannya.',
    kategori_id: 6,
    kategori_nama: 'Kekerasan Psikis / Pengucilan Sosial',
    status: 'selesai',
    urgensi: 'Rendah',
    is_active: true,
    is_anonymous: true,
    reporter_label: 'Ruang Kelas VII-B • Anonim',
    reporter_school: 'SMAN 1 Teladan',
    lokasi: 'Ruang Kelas VII-B',
    tanggal: '05 Mei 2024, 11:20 WIB',
    ai: {
      kategori_rekomendasi: 'Pengabaian Sosial',
      confidence: 82.5,
      is_approved: true,
      is_overridden: false,
      cluster_label: null,
      is_noise: true
    },
    bukti_file: null,
    catatan_konselor: 'Wali kelas telah merotasi pembagian kelompok belajar secara adil dan terarah.',
    history: [
      { waktu: '01 Mei 2024', status: 'menunggu', pelaksana: 'Anonim', catatan: 'Laporan masuk.' },
      { waktu: '02 Mei 2024', status: 'diverifikasi', pelaksana: 'Wali Kelas VII-B', catatan: 'Observasi kelas.' },
      { waktu: '03 Mei 2024', status: 'ditindaklanjuti', pelaksana: 'Konselor BK', catatan: 'Restrukturisasi kelompok.' },
      { waktu: '05 Mei 2024', status: 'selesai', pelaksana: 'Ibu Rahmawati, S.Pd', catatan: 'Evaluasi mingguan kondusif.' }
    ]
  }
];

export const INITIAL_AUDIT = [
  {
    id: 1,
    waktu: 'Hari ini, 09:15 WIB',
    tanggal_raw: '14 Mei 2024',
    pelaksana_nama: 'Ibu Rahmawati, S.Pd',
    pelaksana_role: 'Konselor BK Utama',
    pelaksana_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    tipe_aksi: 'status',
    deskripsi: 'Mengubah status ke Diverifikasi',
    detail_perubahan: 'Dari: Menunggu → Menjadi: Diverifikasi',
    ticket_code: 'SGP-2024-0142',
    hash_verified: true
  },
  {
    id: 2,
    waktu: 'Hari ini, 08:42 WIB',
    tanggal_raw: '14 Mei 2024',
    pelaksana_nama: 'Bpk. Ahmad Fauzi, M.Psi',
    pelaksana_role: 'Satgas PPKSP',
    pelaksana_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    tipe_aksi: 'ai_approve',
    deskripsi: 'Menyetujui rekomendasi AI: Perundungan Siber',
    detail_perubahan: 'Tingkat akurasi model IndoBERT: 94.2% dengan klaster indikasi intimidasi pesan instan.',
    ticket_code: 'SGP-2024-0140',
    hash_verified: true
  },
  {
    id: 3,
    waktu: 'Kemarin, 16:20 WIB',
    tanggal_raw: '13 Mei 2024',
    pelaksana_nama: 'Ibu Rahmawati, S.Pd',
    pelaksana_role: 'Konselor BK Utama',
    pelaksana_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    tipe_aksi: 'override',
    deskripsi: 'Override kategori manual oleh Konselor',
    detail_perubahan: 'Dari: Perundungan Verbal → Menjadi: Perundungan Fisik (Catatan: Terkonfirmasi bukti digital tangkapan layar).',
    ticket_code: 'SGP-2024-0139',
    hash_verified: true
  },
  {
    id: 4,
    waktu: 'Kemarin, 14:05 WIB',
    tanggal_raw: '13 Mei 2024',
    pelaksana_nama: 'AI System Service',
    pelaksana_role: 'Automasi Klaster',
    pelaksana_avatar: null,
    tipe_aksi: 'ai_cluster',
    deskripsi: 'Sistem mendeteksi klaster kemiripan pola 92%',
    detail_perubahan: 'Algoritma HDBSCAN mengidentifikasi korelasi lokasi & terduga pelaku yang berulang pada 4 laporan terkini.',
    ticket_code: 'KLS-09',
    hash_verified: true
  },
  {
    id: 5,
    waktu: '12 Mei 2024, 11:30 WIB',
    tanggal_raw: '12 Mei 2024',
    pelaksana_nama: 'Ibu Rahmawati, S.Pd',
    pelaksana_role: 'Konselor BK Utama',
    pelaksana_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    tipe_aksi: 'status',
    deskripsi: 'Mengubah status ke Ditindaklanjuti',
    detail_perubahan: 'Catatan: Mediasi tertutup telah dijadwalkan bersama orang tua/wali dan komite pendamping anak.',
    ticket_code: 'SGP-2024-0136',
    hash_verified: true
  },
  {
    id: 6,
    waktu: '12 Mei 2024, 10:14 WIB',
    tanggal_raw: '12 Mei 2024',
    pelaksana_nama: 'Pengawas Wilayah III',
    pelaksana_role: 'Dinas Pendidikan',
    pelaksana_avatar: null,
    tipe_aksi: 'download',
    deskripsi: 'Mengunduh berkas bukti lampiran terenkripsi',
    detail_perubahan: 'Berkas: tangkapan_layar_chat.enc (Kunci dekripsi diverifikasi melalui token pengawas resmi).',
    ticket_code: 'SGP-2024-0136',
    hash_verified: true
  }
];

