/**
 * SIGAP - Data Store & State Management
 * Menyediakan mock state, seed data sesuai PRD & wireframe, serta integrasi API lokal/FastAPI
 */

const SIGAP_STORAGE_KEY = 'SIGAP_APP_STATE_V1';

// 7 Kategori Resmi Permendikbudristek No. 46 Tahun 2023
export const KATEGORI_DATA = [
  {
    id: 1,
    nama: 'Perundungan Verbal',
    deskripsi: 'Cacian, hinaan, pemanggilan nama buruk, fitnah, atau ancaman kata-kata.',
    icon: 'message-square-warning',
    color: '#3B82F6',
    count: 48,
    benchmark: 32
  },
  {
    id: 2,
    nama: 'Perundungan Fisik',
    deskripsi: 'Pemukulan, tendangan, dorongan, pemalakan uang/barang, atau perusakan properti.',
    icon: 'shield-alert',
    color: '#0EA5E9',
    count: 34,
    benchmark: 28
  },
  {
    id: 3,
    nama: 'Perundungan Siber (Cyberbullying)',
    deskripsi: 'Teror pesan daring, penyebaran hoaks/foto pribadi tanpa izin, atau intimidasi grup media sosial.',
    icon: 'laptop',
    color: '#6366F1',
    count: 27,
    benchmark: 22
  },
  {
    id: 4,
    nama: 'Kekerasan Seksual',
    deskripsi: 'Pelecehan fisik, verbal berkonotasi seksual, ajakan tidak senonoh, atau pemaksaan tanpa persetujuan.',
    icon: 'alert-triangle',
    color: '#EF4444',
    count: 4,
    benchmark: 6
  },
  {
    id: 5,
    nama: 'Hukuman Fisik oleh Tenaga Pendidik',
    deskripsi: 'Tindakan disiplin fisik berlebihan yang melanggar batas kewajaran dan etika perlindungan anak.',
    icon: 'user-x',
    color: '#F59E0B',
    count: 8,
    benchmark: 11
  },
  {
    id: 6,
    nama: 'Kekerasan Psikis / Pengucilan Sosial',
    deskripsi: 'Pengucilan kelompok terencana, diskriminasi latar belakang, atau penyebaran gosip yang memojokkan.',
    icon: 'users-slash',
    color: '#8B5CF6',
    count: 9,
    benchmark: 12
  },
  {
    id: 7,
    nama: 'Penyalahgunaan Narkoba / Rokok / Miras',
    deskripsi: 'Peredaran, kepemilikan, atau pemaksaan konsumsi zat terlarang dan rokok di area sekolah.',
    icon: 'ban',
    color: '#EC4899',
    count: 12,
    benchmark: 15
  }
];

// Seed Laporan Sesuai Mockup UI/UX
const INITIAL_LAPORAN = [
  {
    id: 1,
    ticket_code: 'SGP-2024-0142',
    judul: 'Perundungan Siber Melalui Pesan Grup Kelas',
    deskripsi: 'Tangkapan layar berisi pesan intimidasi berulang dan ujaran merendahkan fisik di grup WhatsApp angkatan kelas IX-B sekolah.',
    kategori_id: 3,
    kategori_nama: 'Perundungan Siber (Cyberbullying)',
    status: 'diverifikasi', // menunggu -> diverifikasi -> ditindaklanjuti -> selesai
    urgensi: 'Tinggi',
    is_active: true, // Data Aktif vs Data Referensi
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
    kategori_nama: 'Pemalakan / Pemerasan',
    status: 'ditindaklanjuti',
    urgensi: 'Sedang',
    is_active: true,
    is_anonymous: false,
    reporter_label: 'Kantin Sekolah • Wali Murid',
    reporter_school: 'SMAN 1 Teladan',
    lokasi: 'Kantin Sisi Barat',
    tanggal: '18 Mei 2024, 11:10 WIB',
    ai: {
      kategori_rekomendasi: 'Pemalakan / Pemerasan',
      confidence: 91.5,
      secondary_suggestion: 'Perundungan Fisik',
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
    kategori_nama: 'Perundungan Siber',
    status: 'selesai',
    urgensi: 'Selesai',
    is_active: false, // Data Referensi
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
    is_active: false, // Data Referensi
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

// Seed Audit Trail Sesuai JejakAuditAdmin_SIGAP.png
const INITIAL_AUDIT = [
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
    detail_perubahan: 'Dari: Perundungan Verbal → Menjadi: Pemalakan / Pemerasan (Catatan: Terkonfirmasi bukti digital tangkapan layar).',
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

class SigapStore {
  constructor() {
    this.init();
  }

  init() {
    const saved = localStorage.getItem(SIGAP_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.laporanList = parsed.laporanList || INITIAL_LAPORAN;
        this.auditList = parsed.auditList || INITIAL_AUDIT;
        this.currentUser = parsed.currentUser || null;
        return;
      } catch (e) {
        console.warn('Gagal membaca cache lokal, memuat data bawaan.', e);
      }
    }
    this.laporanList = [...INITIAL_LAPORAN];
    this.auditList = [...INITIAL_AUDIT];
    this.currentUser = null;
    this.save();
  }

  save() {
    localStorage.setItem(SIGAP_STORAGE_KEY, JSON.stringify({
      laporanList: this.laporanList,
      auditList: this.auditList,
      currentUser: this.currentUser
    }));
  }

  // Pengguna
  getCurrentUser() {
    return this.currentUser;
  }

  setCurrentUser(user) {
    this.currentUser = user;
    this.save();
  }

  logout() {
    this.currentUser = null;
    this.save();
  }

  // Laporan
  getAllLaporan() {
    return this.laporanList;
  }

  getLaporanByTicket(ticketCode) {
    if (!ticketCode) return null;
    const clean = ticketCode.trim().toUpperCase();
    return this.laporanList.find(item => item.ticket_code.toUpperCase() === clean) || null;
  }

  getLaporanById(id) {
    return this.laporanList.find(item => item.id === Number(id)) || null;
  }

  createLaporan(data) {
    const randomSeq = String(Math.floor(100 + Math.random() * 900));
    const ticketCode = `SGP-2026-${randomSeq}`;
    const katObj = KATEGORI_DATA.find(k => k.id === Number(data.kategori_id)) || KATEGORI_DATA[0];

    // Inferensi AI Cepat (Simulasi IndoBERT & Cosine Similarity)
    const aiConfidence = (85 + Math.random() * 12).toFixed(1);

    const newReport = {
      id: Date.now(),
      ticket_code: ticketCode,
      judul: data.judul || `Pengaduan Insiden ${katObj.nama}`,
      deskripsi: data.deskripsi || '',
      kategori_id: katObj.id,
      kategori_nama: katObj.nama,
      status: 'menunggu',
      urgensi: data.urgensi || 'Sedang',
      is_active: true,
      is_anonymous: !!data.is_anonymous,
      reporter_name: data.is_anonymous ? null : (data.nama_pelapor || 'Siswa Terdaftar'),
      reporter_label: data.is_anonymous ? 'Anonim (Siswa)' : `${data.nama_pelapor || 'Siswa Terdaftar'} • Pelapor Terverifikasi`,
      reporter_school: data.asal_sekolah || 'SMAN 1 Teladan',
      lokasi: data.lokasi || 'Area Sekolah',
      tanggal: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()) + ' WIB',
      ai: {
        kategori_rekomendasi: katObj.nama,
        confidence: parseFloat(aiConfidence),
        secondary_suggestion: 'Perundungan Verbal',
        secondary_confidence: 68.4,
        is_approved: false,
        is_overridden: false,
        cluster_label: null,
        cluster_name: null,
        is_noise: true
      },
      bukti_file: data.bukti_file || null,
      catatan_konselor: 'Laporan baru diterima. Menunggu verifikasi tim konselor BK.',
      history: [
        {
          waktu: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()) + ' WIB',
          status: 'menunggu',
          pelaksana: data.is_anonymous ? 'Pelapor Anonim' : (data.nama_pelapor || 'Siswa'),
          catatan: 'Pengaduan berhasil diajukan melalui portal SIGAP.'
        }
      ]
    };

    this.laporanList.unshift(newReport);

    // Catat ke Audit Trail
    this.addAuditEntry({
      pelaksana_nama: data.is_anonymous ? 'Pelapor Anonim' : (data.nama_pelapor || 'Siswa'),
      pelaksana_role: 'Pelapor',
      tipe_aksi: 'create',
      deskripsi: `Laporan baru diajukan: ${katObj.nama}`,
      detail_perubahan: `Kategori terpilih: ${katObj.nama} • Status: Menunggu Telaah`,
      ticket_code: ticketCode
    });

    this.save();
    return newReport;
  }

  // State Machine Transisi Status
  updateLaporanStatus(id, nextStatus, catatan, adminName = 'Ibu Rahmawati, S.Pd') {
    const report = this.getLaporanById(id);
    if (!report) return { success: false, message: 'Laporan tidak ditemukan' };

    const validTransitions = {
      'menunggu': 'diverifikasi',
      'diverifikasi': 'ditindaklanjuti',
      'ditindaklanjuti': 'selesai',
      'selesai': null
    };

    if (validTransitions[report.status] !== nextStatus) {
      return {
        success: false,
        message: `Transisi tidak valid! Dari '${report.status}' hanya dapat beralih ke '${validTransitions[report.status]}'.`
      };
    }

    const prevStatus = report.status;
    report.status = nextStatus;
    if (catatan) {
      report.catatan_konselor = catatan;
    }

    const timestamp = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()) + ' WIB';
    report.history.push({
      waktu: timestamp,
      status: nextStatus,
      pelaksana: adminName,
      catatan: catatan || `Status dialihkan ke ${nextStatus}.`
    });

    // Tambah log ke Audit
    this.addAuditEntry({
      pelaksana_nama: adminName,
      pelaksana_role: 'Konselor BK Utama',
      pelaksana_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      tipe_aksi: 'status',
      deskripsi: `Mengubah status ke ${nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}`,
      detail_perubahan: `Dari: ${prevStatus} → Menjadi: ${nextStatus}. Catatan: "${catatan || 'Tanpa catatan'}"`,
      ticket_code: report.ticket_code
    });

    this.save();
    return { success: true, report };
  }

  // Validasi AI: Approve Rekomendasi
  approveAiRecommendation(id, adminName = 'Bpk. Ahmad Fauzi, M.Psi') {
    const report = this.getLaporanById(id);
    if (!report) return false;

    report.ai.is_approved = true;
    report.ai.is_overridden = false;

    this.addAuditEntry({
      pelaksana_nama: adminName,
      pelaksana_role: 'Satgas PPKSP',
      pelaksana_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      tipe_aksi: 'ai_approve',
      deskripsi: `Menyetujui rekomendasi AI: ${report.ai.kategori_rekomendasi}`,
      detail_perubahan: `Tingkat keyakinan IndoBERT: ${report.ai.confidence}% disetujui sebagai kategori final.`,
      ticket_code: report.ticket_code
    });

    this.save();
    return true;
  }

  // Validasi AI: Override Kategori
  overrideCategory(id, newCategoryId, catatan, adminName = 'Ibu Rahmawati, S.Pd') {
    const report = this.getLaporanById(id);
    if (!report) return false;

    const newKat = KATEGORI_DATA.find(k => k.id === Number(newCategoryId));
    if (!newKat) return false;

    const oldKatName = report.kategori_nama;
    report.kategori_id = newKat.id;
    report.kategori_nama = newKat.nama;
    report.ai.is_overridden = true;
    report.ai.is_approved = false;

    this.addAuditEntry({
      pelaksana_nama: adminName,
      pelaksana_role: 'Konselor BK Utama',
      pelaksana_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      tipe_aksi: 'override',
      deskripsi: 'Override kategori manual oleh Konselor',
      detail_perubahan: `Dari: ${oldKatName} → Menjadi: ${newKat.nama}. Alasan: ${catatan || 'Koreksi verifikasi bukti fisik'}`,
      ticket_code: report.ticket_code
    });

    this.save();
    return true;
  }

  // Audit Trail
  getAllAudit() {
    return this.auditList;
  }

  addAuditEntry(entry) {
    const newEntry = {
      id: Date.now(),
      waktu: 'Hari ini, ' + new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date()) + ' WIB',
      tanggal_raw: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date()),
      pelaksana_nama: entry.pelaksana_nama || 'Petugas Sistem',
      pelaksana_role: entry.pelaksana_role || 'Staff',
      pelaksana_avatar: entry.pelaksana_avatar || null,
      tipe_aksi: entry.tipe_aksi || 'system',
      deskripsi: entry.deskripsi || 'Aktivitas sistem',
      detail_perubahan: entry.detail_perubahan || '-',
      ticket_code: entry.ticket_code || '-',
      hash_verified: true
    };
    this.auditList.unshift(newEntry);
    this.save();
  }

  // Summary Metrics untuk Admin Dashboard
  getMetrics() {
    const total = this.laporanList.filter(l => l.is_active).length;
    const menunggu = this.laporanList.filter(l => l.is_active && l.status === 'menunggu').length;
    const proses = this.laporanList.filter(l => l.is_active && (l.status === 'diverifikasi' || l.status === 'ditindaklanjuti')).length;
    const selesai = this.laporanList.filter(l => l.is_active && l.status === 'selesai').length;
    const lowAi = this.laporanList.filter(l => l.is_active && l.ai && l.ai.confidence < 80).length;
    const clusters = 5;
    const referenceCount = this.laporanList.filter(l => !l.is_active).length;

    return {
      total: total + 132, // baseline realistis sesuai mockup (142 aduan)
      menunggu: menunggu,
      proses: proses + 21,
      selesai: selesai + 107,
      lowAi: lowAi + 10,
      clusters: clusters,
      referenceCount: referenceCount + 33
    };
  }

  resetDefault() {
    localStorage.removeItem(SIGAP_STORAGE_KEY);
    this.init();
  }
}

export const store = new SigapStore();

