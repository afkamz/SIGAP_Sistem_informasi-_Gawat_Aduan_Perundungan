import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Clock,
  Search,
  ArrowRight,
  Sparkles,
  UserCheck,
  EyeOff,
  AlertTriangle,
  MessageSquareWarning,
  Laptop,
  Users,
  UserX,
  Ban,
  CheckCircle2,
  PhoneCall,
  ChevronDown,
  HelpCircle,
  FileText,
  HeartHandshake,
  ExternalLink,
  LogIn,
  School,
  Activity,
  X,
  UserPlus
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { StudentHeader } from '../components/layout/StudentHeader';
import { StudentFooter } from '../components/layout/StudentFooter';
import { KATEGORI_DATA } from '../data/categories';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useStore();
  const [activeFaq, setActiveFaq] = useState(null);
  const [quickTicketCode, setQuickTicketCode] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [targetRedirect, setTargetRedirect] = useState('/buat-laporan');

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleQuickTrack = (e) => {
    e.preventDefault();
    if (quickTicketCode.trim()) {
      navigate(`/lacak?code=${encodeURIComponent(quickTicketCode.trim())}`);
    } else {
      navigate('/lacak');
    }
  };

  const handleReportAction = (e, path = '/buat-laporan') => {
    if (e && e.preventDefault) e.preventDefault();
    if (currentUser) {
      navigate(path);
    } else {
      setTargetRedirect(path);
      setShowAuthModal(true);
    }
  };

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'MessageSquareWarning':
        return <MessageSquareWarning className="w-5 h-5" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5" />;
      case 'Laptop':
        return <Laptop className="w-5 h-5" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5" />;
      case 'UserX':
        return <UserX className="w-5 h-5" />;
      case 'Users':
        return <Users className="w-5 h-5" />;
      case 'Ban':
        return <Ban className="w-5 h-5" />;
      default:
        return <ShieldAlert className="w-5 h-5" />;
    }
  };

  const faqs = [
    {
      q: 'Apakah saya harus memiliki akun terlebih dahulu untuk membuat aduan?',
      a: 'Ya. Anda harus login atau mendaftar terlebih dahulu untuk mengakses formulir pembuatan aduan guna memastikan validitas laporan, integritas data, dan pendampingan resmi oleh Tim Bimbingan Konseling (BK) & Satgas PPKSP.'
    },
    {
      q: 'Apakah identitas saya tetap dapat dirahasiakan saat melapor?',
      a: 'Tentu saja. Di dalam formulir pembuatan aduan, tersedia opsi pelaporan secara anonim di mana identitas nama dan NISN Anda tidak akan dipublikasikan ke publik atau terlapor, serta dilindungi penuh oleh enkripsi sistem.'
    },
    {
      q: 'Bagaimana cara memantau perkembangan penanganan laporan saya?',
      a: 'Setiap aduan yang berhasil diajukan akan menerima Kode Tiket Unik (misal: SG-2026-8921). Anda dapat memantau status secara langsung melalui menu "Lacak Tiket" atau melalui Dashboard Siswa terdaftar Anda.'
    },
    {
      q: 'Siapa pihak yang menerima dan memproses laporan saya?',
      a: 'Laporan Anda hanya dapat diakses oleh Guru Bimbingan Konseling (BK) berwenang dan Tim Satgas Pencegahan dan Penanganan Kekerasan di Satuan Pendidikan (PPKSP) resmi sekolah dengan sistem audit trail terenkripsi.'
    },
    {
      q: 'Apakah laporan akan ditindaklanjuti secara serius?',
      a: 'Pasti. Setiap laporan yang masuk akan ditelaah dengan standar keparahan dan urgensi yang sama sesuai regulasi Permendikbudristek No. 46 Tahun 2023. Tim Satgas akan memverifikasi kronologi dan bukti yang dilampirkan.'
    },
    {
      q: 'Apa yang harus dilakukan jika saya dalam situasi bahaya darurat fisik saat ini?',
      a: 'Jika Anda dalam ancaman bahaya fisik mendesak, segera cari tempat aman, temui guru terdekat, atau hubungi saluran darurat kepolisian (110) atau Hotline Sahabat Perempuan & Anak SAPA 129.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Emergency Announcement Bar */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-sky-950 text-white text-xs py-2 px-4 border-b border-sky-800/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300">
              Layanan Siaga Aduan Kekerasan Sekolah Sesuai <strong className="text-white">Permendikbudristek No. 46/2023</strong>
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-300 text-[11px]">
            <span className="flex items-center gap-1 font-medium text-sky-200">
              <PhoneCall className="w-3 h-3 text-[#A7D8F0]" /> Hotline Darurat: SAPA 129 | Polisi 110
            </span>
            <span className="hidden md:inline">•</span>
            <Link to="/lacak" className="hover:text-white underline underline-offset-2 transition hidden md:inline">
              Lacak Tiket Aduan
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <StudentHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-100/50 via-white to-slate-50 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/80">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#A7D8F0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Official Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100/80 border border-sky-300/80 text-sky-900 text-xs font-bold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-sky-700" />
                <span>SIGAP • SISTEM INFORMASI GAWAT ADUAN PERUNDUNGAN</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.18]">
                Suarakan Kebenaran. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-900">
                  Ciptakan Sekolah Bebas Kekerasan
                </span>{' '}
                & Perundungan.
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Kanal aduan terpadu resmi bagi seluruh pelajar dan warga sekolah. Laporkan kejadian secara aman dengan proteksi identitas berlapis, verifikasi cerdas asisten AI, dan tindak lanjut terpadu Tim Bimbingan Konseling (BK) & Satgas PPKSP.
              </p>

              {/* Primary Call-to-Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={(e) => handleReportAction(e, '/buat-laporan')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 text-[#A7D8F0] group-hover:scale-110 transition" />
                  <span>Buat Laporan Sekarang</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>

                <Link
                  to="/login"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-sm shadow-sm hover:shadow transition flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-slate-900" />
                  <span>Masuk ke Portal Siswa</span>
                </Link>
              </div>

              {/* Quick Ticket Tracking Form */}
              <div className="pt-4 max-w-md mx-auto lg:mx-0">
                <form
                  onSubmit={handleQuickTrack}
                  className="p-2 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2"
                >
                  <div className="pl-3 text-slate-400">
                    <Search className="w-4 h-4 text-sky-700" />
                  </div>
                  <input
                    type="text"
                    placeholder="Punya Kode Tiket? (Cth: SG-8921)"
                    value={quickTicketCode}
                    onChange={(e) => setQuickTicketCode(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-800 focus:outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex-shrink-0"
                  >
                    Lacak
                  </button>
                </form>
                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-center lg:justify-start gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pantau status perkembangan laporan kapan saja dengan nomor tiket</span>
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="pt-2 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <EyeOff className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">100% Rahasia</h5>
                    <p className="text-[10px] text-slate-500">Privasi Terjaga</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Bantuan AI</h5>
                    <p className="text-[10px] text-slate-500">Klasifikasi 7 Kategori</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Tim BK Resmi</h5>
                    <p className="text-[10px] text-slate-500">Satgas PPKSP Terpadu</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup / Hero Showcase Card */}
            <div className="lg:col-span-5 max-w-md mx-auto w-full">
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden relative">
                {/* Header Mock Card */}
                <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#A7D8F0] flex items-center justify-center text-slate-900 font-black text-sm">
                        <Shield className="w-5 h-5 text-slate-900" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                          Tiket Aduan Aman
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        </h4>
                        <p className="text-[11px] text-sky-200 font-mono">ID: #SG-2026-9021</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                      Terenkripsi
                    </span>
                  </div>
                </div>

                {/* Body of Mock Card */}
                <div className="p-6 space-y-5">
                  {/* Status Timeline Snippet */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-600">Status Penanganan:</span>
                      <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-bold text-[11px]">
                        Sedang Ditindaklanjuti
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-[#A7D8F0] h-2 rounded-full w-3/4"></div>
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Laporan Masuk</span>
                      <span className="font-semibold text-sky-800">Verifikasi BK</span>
                      <span className="font-semibold text-slate-700">Tindakan Satgas</span>
                      <span>Selesai</span>
                    </div>
                  </div>

                  {/* AI Detection Pill */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white text-indigo-600 shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-900">AI Recommendation NLP:</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-medium">96% Akurasi</span>
                      </div>
                      <p className="text-xs font-semibold text-sky-950 mt-0.5">Perundungan Siber (Cyberbullying)</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Diverifikasi resmi oleh Guru BK Hj. Rina Rahayu, S.Pd., Kons.
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Buttons inside Card */}
                  <div className="pt-1 flex items-center justify-between gap-3 text-xs">
                    <button
                      type="button"
                      onClick={(e) => handleReportAction(e, '/buat-laporan')}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-center transition shadow-xs cursor-pointer"
                    >
                      Coba Buat Aduan
                    </button>
                    <Link
                      to="/lacak"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-center transition"
                    >
                      Lacak Tiket
                    </Link>
                  </div>

                  {/* Safe Notice */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                    <Lock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Garansi tanpa intimidasi balasan (zero-retaliation guarantee).</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Metrics Bar */}
      <section className="py-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-3">
              <div className="text-2xl lg:text-3xl font-extrabold text-slate-900">100%</div>
              <div className="text-xs font-medium text-slate-500 mt-1">Jaminan Anonimitas & Kerahasiaan</div>
            </div>
            <div className="p-3">
              <div className="text-2xl lg:text-3xl font-extrabold text-sky-800">7 Kategori</div>
              <div className="text-xs font-medium text-slate-500 mt-1">Resmi Permendikbudristek No. 46/2023</div>
            </div>
            <div className="p-3">
              <div className="text-2xl lg:text-3xl font-extrabold text-slate-900">&lt; 24 Jam</div>
              <div className="text-xs font-medium text-slate-500 mt-1">Standar Respons Awal Verifikasi</div>
            </div>
            <div className="p-3">
              <div className="text-2xl lg:text-3xl font-extrabold text-emerald-700">Audit Trail</div>
              <div className="text-xs font-medium text-slate-500 mt-1">Rekam Penanganan Akuntabel</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Mode Section */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-sky-700" />
              <span>DUAL-MODE REPORTING</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Dua Pilihan Mode Pelaporan yang Fleksibel & Terlindungi
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Anda berhak memilih cara terbaik dan paling nyaman untuk bersuara. Kami memastikan rasa aman Anda adalah prioritas nomor satu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Mode 1: Anonim */}
            <div className="bg-gradient-to-b from-slate-50 to-white rounded-3xl p-7 lg:p-8 border-2 border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition space-y-6 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-[#A7D8F0] flex items-center justify-center font-bold">
                    <EyeOff className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                    Mode Anonim Terproteksi
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900">Pelaporan Anonim</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Bagi siswa, saksi, atau korban yang merasa ragu atau khawatir diintimidasi. Identitas nama dan data pribadi Anda tidak dicantumkan ke publik.
                </p>

                <ul className="mt-5 space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>100% Bebas Identitas Publik:</strong> Tanpa nama lengkap atau informasi kontak terekspos.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Kode Tiket Rahasia:</strong> Dapatkan nomor unik untuk melacak perkembangan kasus secara mandiri.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Bebas Intimidasi (No Retaliation):</strong> Tidak ada risiko pembalasan dari pihak terlapor.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={(e) => handleReportAction(e, '/buat-laporan')}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Mulai Lapor Anonim</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mode 2: Terverifikasi */}
            <div className="bg-gradient-to-b from-sky-50/60 to-white rounded-3xl p-7 lg:p-8 border-2 border-[#A7D8F0] shadow-sm hover:shadow-md transition space-y-6 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#A7D8F0] text-slate-900 flex items-center justify-center font-bold">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
                    Konseling Terpadu
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900">Pelaporan Terverifikasi</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Direkomendasikan untuk pendampingan konseling intensif, perlindungan fisik menyeluruh, dan advokasi berkelanjutan oleh sekolah.
                </p>

                <ul className="mt-5 space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-700 flex-shrink-0 mt-0.5" />
                    <span><strong>Dashboard Terpadu:</strong> Pantau riwayat seluruh aduan, riwayat notifikasi, dan catatan konselor.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-700 flex-shrink-0 mt-0.5" />
                    <span><strong>Pendampingan Langsung BK:</strong> Memudahkan penjadwalan sesi konseling privat yang aman dan terarah.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-700 flex-shrink-0 mt-0.5" />
                    <span><strong>Perlindungan Menyeluruh:</strong> Intervensi langsung oleh Satgas PPKSP dengan pendampingan resmi.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-sky-100 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={(e) => handleReportAction(e, '/buat-laporan')}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Buat Aduan Terverifikasi</span>
                </button>
                <Link
                  to="/register?redirect=/buat-laporan"
                  className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm text-center transition"
                >
                  Daftar Akun
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 Kategori Resmi Permendikbudristek Section */}
      <section className="py-14 lg:py-20 bg-slate-50 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
              <School className="w-3.5 h-3.5 text-sky-700" />
              <span>PERMENDIKBUDRISTEK NO. 46 TAHUN 2023</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              7 Kategori Kekerasan yang Dapat Dilaporkan
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              SIGAP mencakup seluruh spektrum bentuk kekerasan di lingkungan pendidikan sesuai regulasi nasional. Kenali kategorinya dan jangan ragu untuk melapor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {KATEGORI_DATA.map((kat) => (
              <div
                key={kat.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-300 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: kat.color }}
                    >
                      {getCategoryIcon(kat.icon)}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Kategori #{kat.id}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 group-hover:text-sky-800 transition">
                    {kat.nama}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {kat.deskripsi}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => handleReportAction(e, `/buat-laporan?kategori=${kat.id}`)}
                    className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 group-hover:translate-x-1 transition cursor-pointer"
                  >
                    <span>Laporkan Insiden Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Extra Card: Konseling Umum & Keluhan */}
            <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#A7D8F0] text-slate-900 flex items-center justify-center font-bold mb-3">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Konseling & Keluhan Lainnya</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Tidak yakin insiden Anda masuk kategori mana? Tim AI SIGAP dan Guru BK akan membantu mengidentifikasi dan mencarikan solusi terbaik untuk Anda.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={(e) => handleReportAction(e, '/buat-laporan')}
                  className="text-xs font-bold text-[#A7D8F0] hover:text-white flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Mulai Konsultasi Aduan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alur Pengaduan Section */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-semibold">
              <Activity className="w-3.5 h-3.5 text-sky-700" />
              <span>LANGKAH PENANGANAN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Alur Pengaduan 4 Langkah Mudah & Terarah
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Mulai dari pelaporan hingga tuntas, proses dirancang transparan, akuntabel, dan mengutamakan kesejahteraan psikologis korban.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center">
                01
              </div>
              <h4 className="font-bold text-slate-900 text-base">Kirim Aduan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Masuk ke akun siswa, tulis kronologi kejadian, dan lampirkan bukti foto bila ada. Anda tetap dapat memilih opsi pelaporan rahasia.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#A7D8F0] text-slate-900 font-black text-sm flex items-center justify-center">
                02
              </div>
              <h4 className="font-bold text-slate-900 text-base">Dapatkan Kode Tiket</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sistem menghasilkan nomor tiket terenkripsi (misal: <code className="text-sky-800 font-mono font-bold">#SG-82910</code>). Simpan kode ini untuk melacak kasus Anda kapan saja.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-700 text-white font-black text-sm flex items-center justify-center">
                03
              </div>
              <h4 className="font-bold text-slate-900 text-base">Verifikasi & AI NLP</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kecerdasan buatan membantu memetakan kategori kasus, sementara Guru BK & Satgas PPKSP memverifikasi keabsahan laporan secara cermat.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                04
              </div>
              <h4 className="font-bold text-slate-900 text-base">Tindakan & Solusi Kasus</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pelaksanaan mediasi damai, pendampingan psikologis, penegakan tata tertib sekolah, dan pencatatan audit trail hingga kasus selesai.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={(e) => handleReportAction(e, '/buat-laporan')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer"
            >
              <span>Mulai Buat Aduan Anda</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Fitur & Teknologi Keamanan SIGAP */}
      <section className="py-14 lg:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#A7D8F0] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>KEUNGGULAN SISTEM</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                Teknologi Cerdas untuk Perlindungan Nyata
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                SIGAP dirancang dengan standar teknologi institusi modern guna memastikan tidak ada suara aduan yang hilang, diabaikan, atau bocor.
              </p>

              <div className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition"
                >
                  <Lock className="w-3.5 h-3.5 text-[#A7D8F0]" />
                  <span>Akses Khusus Guru BK & Admin</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#A7D8F0] text-slate-900 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-white">AI NLP Multi-Label</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Rekomendasi otomatis 7 kategori kekerasan resmi berdasarkan analisis teks kronologi aduan untuk mempercepat telaah awal tim konselor.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#A7D8F0] text-slate-900 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-white">Enkripsi & Kerahasiaan</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Data aduan dilindungi mekanisme Role-Based Access Control (RBAC) dan JWT. Hanya konselor sekolah yang terverifikasi yang dapat mengakses.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#A7D8F0] text-slate-900 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-white">Digital Audit Trail</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Setiap perpindahan status laporan dicatat secara permanen dengan timestamp dan identitas konselor, mencegah kelalaian dan manipulasi.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#A7D8F0] text-slate-900 flex items-center justify-center font-bold">
                  <Search className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-white">Pelacakan Real-Time</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Transparansi progres aduan melalui kode tiket unik tanpa perlu login, menjaga kenyamanan dan ketenangan pikiran pelapor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5 text-sky-700" />
              <span>TANYA JAWAB</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Temukan jawaban seputar akses login, keamanan privasi, alur aduan, dan penanganan perundungan di SIGAP.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-slate-900 text-xs sm:text-sm flex justify-between items-center gap-4 hover:bg-slate-50 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform flex-shrink-0 ${
                      activeFaq === idx ? 'rotate-180 text-sky-700' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Crisis Contact Box */}
      <section className="py-10 bg-sky-50 border-t border-b border-sky-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>HOTLINE BANTUAN DARURAT</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Dalam Keadaan Bahaya Mendesak?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                Bila Anda membutuhkan perlindungan fisik seketika atau pendampingan darurat kekerasan seksual dan fisik, hubungi kontak resmi berikut:
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="tel:129"
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>SAPA 129 (KemenPPPA)</span>
              </a>
              <a
                href="tel:110"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Polisi 110</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Banner */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sekolah yang Sehat Dimulai dari Keberanian Bersuara
          </h2>
          <p className="text-slate-600 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            Tidak ada alasan untuk menoleransi perundungan di lingkungan sekolah. Masuk atau daftarkan akun Anda sekarang untuk membuat laporan aduan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              type="button"
              onClick={(e) => handleReportAction(e, '/buat-laporan')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-[#A7D8F0]" />
              <span>Buat Laporan Sekarang</span>
            </button>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-sm shadow-sm transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Akun Siswa</span>
            </Link>

            <Link
              to="/lacak"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-2xs transition flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-sky-700" />
              <span>Lacak Tiket Aduan</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Auth Gate Modal if User Not Logged In */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[#A7D8F0] text-slate-900 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                Masuk atau Daftar Terlebih Dahulu
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Untuk mengakses fungsi <strong>Buat Aduan</strong> dan memastikan validitas laporan serta perlindungan resmi oleh Guru BK & Satgas PPKSP, Anda harus memiliki akun terdaftar.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  navigate(`/login?redirect=${encodeURIComponent(targetRedirect)}`);
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#A7D8F0]" />
                <span>Masuk dengan Akun Siswa</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  navigate(`/register?redirect=${encodeURIComponent(targetRedirect)}`);
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Daftar Akun Baru</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                Batal
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Privasi data Anda dijamin 100% dan terenkripsi secara aman.</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <StudentFooter />
    </div>
  );
};

export default LandingPage;
