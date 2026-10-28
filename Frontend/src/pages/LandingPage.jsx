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
    if (!currentUser) {
      setTargetRedirect(path);
      setShowAuthModal(true);
    } else if (currentUser.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate(path);
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
    <div className="min-h-screen flex flex-col bg-liquid-mesh text-slate-800 relative overflow-hidden">
      {/* ─── Ambient Glow Blobs (iOS 26 Liquid Mesh Reflections) ─── */}
      <div className="fixed top-[-12%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-blue-400/20 blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-[30%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-300/25 blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-sky-200/25 blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-[60%] right-[30%] w-[35vw] h-[35vw] rounded-full bg-amber-200/20 blur-3xl pointer-events-none -z-10" />

      {/* Top Emergency Announcement Bar — Liquid Dark Glass */}
      <div className="glass-panel-dark text-white text-xs py-2.5 px-4 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="text-slate-300">
              Layanan Siaga Aduan Kekerasan Sekolah Sesuai <strong className="text-white">Permendikbudristek No. 46/2023</strong>
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-300 text-[11px]">
            <span className="flex items-center gap-1.5 font-semibold text-white glass-pill px-2.5 py-0.5 rounded-full border border-white/20">
              <PhoneCall className="w-3.5 h-3.5 text-[#3B7DE8]" /> Hotline Darurat: SAPA 129 | Polisi 110
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <Link to="/lacak" className="hover:text-white underline underline-offset-2 transition hidden md:inline font-medium">
              Lacak Tiket Aduan
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <StudentHeader />

      {/* Hero Section — Liquid Glass iOS 26 */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Official Badge — Glass Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill-blue text-xs font-bold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#3B7DE8]" />
                <span>SIGAP • LIQUID GLASS OS 26 • PERLINDUNGAN SISWA</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-black text-slate-900 tracking-tight leading-[1.18]">
                Suarakan Kebenaran. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B7DE8] via-blue-600 to-indigo-700">
                  Ciptakan Sekolah Bebas Kekerasan
                </span>{' '}
                &amp; Perundungan.
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Kanal aduan terpadu resmi bagi seluruh pelajar dan warga sekolah. Laporkan kejadian secara aman dengan proteksi identitas berlapis, verifikasi cerdas asisten AI NLP, dan pendampingan terpadu Tim Bimbingan Konseling (BK) &amp; Satgas PPKSP.
              </p>

              {/* Primary Call-to-Actions */}
              <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={(e) => handleReportAction(e, '/buat-laporan')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl glass-button-primary text-white font-bold text-sm flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 text-white group-hover:scale-110 transition" />
                  <span>Buat Laporan Sekarang</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>

                <Link
                  to="/login"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl glass-button-secondary text-slate-800 font-bold text-sm flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-[#3B7DE8]" />
                  <span>Masuk Portal Siswa</span>
                </Link>
              </div>

              {/* Quick Ticket Tracking Form — Translucent Glass Bubble */}
              <div className="pt-2 max-w-md mx-auto lg:mx-0">
                <form
                  onSubmit={handleQuickTrack}
                  className="p-2.5 glass-panel rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(59,125,232,0.08)] flex items-center gap-2"
                >
                  <div className="pl-3 text-slate-400">
                    <Search className="w-4 h-4 text-[#3B7DE8]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Punya Kode Tiket? (Contoh: SGP-2024-0142)"
                    value={quickTicketCode}
                    onChange={(e) => setQuickTicketCode(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-800 focus:outline-none placeholder:text-slate-400 font-medium"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl glass-button-primary text-white text-xs font-bold flex-shrink-0 cursor-pointer"
                  >
                    Lacak
                  </button>
                </form>
                <p className="text-[11px] text-slate-500 mt-2 flex items-center justify-center lg:justify-start gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pantau status perkembangan laporan kapan saja dengan nomor tiket</span>
                </p>
              </div>

              {/* Trust Indicators — Frosted Glass Mini Badges */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-white/50 max-w-lg mx-auto lg:mx-0 text-left">
                <div className="p-2.5 rounded-2xl glass-card flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl glass-pill-green flex items-center justify-center flex-shrink-0">
                    <EyeOff className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">100% Rahasia</h5>
                    <p className="text-[10px] text-slate-500">Privasi Terjaga</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl glass-card flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl glass-pill-blue flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-[#3B7DE8]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Bantuan AI</h5>
                    <p className="text-[10px] text-slate-500">7 Kategori Cerdas</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl glass-card flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl glass-pill flex items-center justify-center flex-shrink-0 text-purple-600 border border-purple-200">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Tim BK Resmi</h5>
                    <p className="text-[10px] text-slate-500">Satgas Terpadu</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Showcase Card — iOS 26 Glass Tablet */}
            <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
              <div className="glass-panel-elevated rounded-3xl border border-white/90 shadow-[0_24px_64px_rgba(59,125,232,0.18)] overflow-hidden relative w-full max-w-md lg:max-w-[480px]">
                {/* Header Mock Card — Frosted Dark Bar */}
                <div className="glass-panel-dark p-5 text-white border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3B7DE8] to-blue-500 flex items-center justify-center text-white font-black text-sm shadow-[0_4px_12px_rgba(59,125,232,0.4)] border border-white/30">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                          Tiket Aduan Terlindungi
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                        </h4>
                        <p className="text-[11px] text-slate-300 font-mono">ID: #SGP-2024-0142</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full glass-pill-green text-[10px] font-extrabold">
                      TLS 1.3 Terenkripsi
                    </span>
                  </div>
                </div>

                {/* Body of Mock Card */}
                <div className="p-6 space-y-5">
                  {/* Status Timeline Snippet — Frosted Bubble */}
                  <div className="glass-card rounded-2xl p-4 border border-white/80 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">Status Penanganan:</span>
                      <span className="px-3 py-1 rounded-full glass-pill-blue font-black text-[11px]">
                        Sedang Ditindaklanjuti
                      </span>
                    </div>

                    <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden p-0.5">
                      <div className="bg-gradient-to-r from-[#3B7DE8] to-blue-600 h-1.5 rounded-full w-3/4 transition-all shadow-xs" />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                      <span>Laporan Masuk</span>
                      <span className="font-bold text-[#3B7DE8]">Verifikasi BK</span>
                      <span className="font-bold text-slate-800">Tindakan Satgas</span>
                      <span>Selesai</span>
                    </div>
                  </div>

                  {/* AI Detection Pill — Frosted Accent Bubble */}
                  <div className="p-4 rounded-2xl glass-card border border-white/80 flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 border border-purple-200/50 shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-900">Inferensi IndoBERT NLP:</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold border border-purple-200">
                          96% Akurasi
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 mt-1">Perundungan Siber (Cyberbullying)</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Diverifikasi resmi oleh Konselor Utama Satgas PPKSP.
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="pt-1 flex items-center justify-between gap-3 text-xs">
                    <button
                      type="button"
                      onClick={(e) => handleReportAction(e, '/buat-laporan')}
                      className="flex-1 py-2.5 px-3 rounded-2xl glass-button-primary text-white font-bold text-center cursor-pointer"
                    >
                      Coba Buat Aduan
                    </button>
                    <Link
                      to="/lacak"
                      className="flex-1 py-2.5 px-3 rounded-2xl glass-button-secondary text-slate-700 font-bold text-center"
                    >
                      Lacak Tiket
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-white/50 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Garansi tanpa intimidasi balasan (zero-retaliation guarantee).</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Metrics Bar — Floating Frosted Glass Banner */}
      <section className="py-8 glass-panel border-y border-white/60 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl glass-card">
              <div className="text-2xl lg:text-3xl font-black text-slate-900">100%</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Jaminan Anonimitas &amp; Kerahasiaan</div>
            </div>
            <div className="p-4 rounded-2xl glass-card">
              <div className="text-2xl lg:text-3xl font-black text-[#3B7DE8]">7 Kategori</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Resmi Permendikbudristek 46/2023</div>
            </div>
            <div className="p-4 rounded-2xl glass-card">
              <div className="text-2xl lg:text-3xl font-black text-slate-900">&lt; 24 Jam</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Standar Respons Awal Verifikasi</div>
            </div>
            <div className="p-4 rounded-2xl glass-card">
              <div className="text-2xl lg:text-3xl font-black text-emerald-600">Audit Trail</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Rekam Penanganan Akuntabel</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Mode Section — Liquid Glass Cards */}
      <section className="py-16 lg:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full glass-pill-blue text-xs font-bold">
              <Shield className="w-3.5 h-3.5 text-[#3B7DE8]" />
              <span>DUAL-MODE REPORTING</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Dua Pilihan Mode Pelaporan yang Fleksibel &amp; Terlindungi
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Anda berhak memilih cara terbaik dan paling nyaman untuk bersuara. Kami memastikan rasa aman Anda adalah prioritas nomor satu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Mode 1: Anonim */}
            <div className="glass-panel-elevated rounded-3xl p-7 lg:p-8 border border-white/80 shadow-lg space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl glass-panel-dark text-white flex items-center justify-center font-bold shadow-md">
                    <EyeOff className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 rounded-full glass-pill text-slate-700 text-xs font-bold">
                    Mode Anonim Terproteksi
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900">Pelaporan Anonim</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
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
                    <span><strong>Bebas Intimidasi:</strong> Dijamin zero-retaliation policy dari pihak sekolah.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-white/50">
                <button
                  type="button"
                  onClick={(e) => handleReportAction(e, '/buat-laporan')}
                  className="w-full py-3 px-4 rounded-2xl glass-button-secondary text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Mulai Lapor Anonim</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mode 2: Terverifikasi */}
            <div className="glass-panel-elevated rounded-3xl p-7 lg:p-8 border-2 border-[#3B7DE8]/40 shadow-xl space-y-6 flex flex-col justify-between relative">
              <span className="absolute -top-3 right-6 px-3.5 py-1 rounded-full glass-button-primary text-white text-[10px] font-extrabold shadow-sm">
                DIREKOMENDASIKAN
              </span>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl glass-pill-blue flex items-center justify-center font-bold shadow-md">
                    <UserCheck className="w-6 h-6 text-[#3B7DE8]" />
                  </div>
                  <span className="px-3 py-1 rounded-full glass-pill-blue text-xs font-bold">
                    Konseling Terpadu
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900">Pelaporan Terverifikasi</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                  Direkomendasikan untuk pendampingan konseling intensif, perlindungan fisik menyeluruh, dan advokasi berkelanjutan oleh sekolah.
                </p>

                <ul className="mt-5 space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3B7DE8] flex-shrink-0 mt-0.5" />
                    <span><strong>Dashboard Terpadu:</strong> Pantau riwayat seluruh aduan, riwayat notifikasi, dan catatan konselor.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3B7DE8] flex-shrink-0 mt-0.5" />
                    <span><strong>Pendampingan Langsung BK:</strong> Memudahkan penjadwalan sesi konseling privat yang aman dan terarah.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3B7DE8] flex-shrink-0 mt-0.5" />
                    <span><strong>Perlindungan Menyeluruh:</strong> Intervensi langsung oleh Satgas PPKSP dengan pendampingan resmi.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-white/50 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={(e) => handleReportAction(e, '/buat-laporan')}
                  className="flex-1 py-3 px-4 rounded-2xl glass-button-primary text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Buat Aduan Terverifikasi</span>
                </button>
                <Link
                  to="/register?redirect=/buat-laporan"
                  className="py-3 px-4 rounded-2xl glass-button-secondary text-slate-800 font-bold text-xs sm:text-sm text-center"
                >
                  Daftar Akun
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 Kategori Resmi Permendikbudristek Section — Liquid Glass Grid */}
      <section className="py-16 lg:py-24 glass-panel border-y border-white/60 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full glass-pill-blue text-xs font-bold">
              <School className="w-3.5 h-3.5 text-[#3B7DE8]" />
              <span>PERMENDIKBUDRISTEK NO. 46 TAHUN 2023</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              7 Kategori Kekerasan yang Dilindungi &amp; Ditindaklanjuti
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              SIGAP mencakup seluruh spektrum bentuk kekerasan di lingkungan pendidikan sesuai regulasi nasional. Kenali kategorinya dan jangan ragu untuk melapor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {KATEGORI_DATA.map((kat) => (
              <div
                key={kat.id}
                className="glass-card rounded-3xl p-5 border border-white/70 shadow-sm hover:border-[#3B7DE8]/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md border border-white/30"
                      style={{ backgroundColor: kat.color }}
                    >
                      {getCategoryIcon(kat.icon)}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider glass-pill px-2 py-0.5 rounded-full">
                      #{kat.id}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 group-hover:text-[#3B7DE8] transition">
                    {kat.nama}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {kat.deskripsi}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/40 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => handleReportAction(e, `/buat-laporan?kategori=${kat.id}`)}
                    className="text-xs font-bold text-[#3B7DE8] hover:text-[#2563c0] flex items-center gap-1 group-hover:translate-x-1 transition cursor-pointer"
                  >
                    <span>Laporkan Insiden Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Extra Card: Konseling Umum & Keluhan */}
            <div className="glass-panel-dark text-white rounded-3xl p-5 shadow-xl flex flex-col justify-between border border-white/15">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3B7DE8] to-blue-500 text-white flex items-center justify-center font-bold mb-3 shadow-md border border-white/30">
                  <HeartHandshake className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-base font-black text-white">Konseling &amp; Keluhan Lainnya</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Tidak yakin insiden Anda masuk kategori mana? Tim AI SIGAP dan Guru BK akan membantu mengidentifikasi dan mencarikan solusi terbaik untuk Anda.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={(e) => handleReportAction(e, '/buat-laporan')}
                  className="text-xs font-bold text-sky-300 hover:text-white flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Mulai Konsultasi Aduan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alur Pengaduan Section — Liquid Step Cards */}
      <section className="py-16 lg:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full glass-pill-blue text-xs font-bold">
              <Activity className="w-3.5 h-3.5 text-[#3B7DE8]" />
              <span>LANGKAH PENANGANAN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Alur Pengaduan 4 Langkah Mudah &amp; Terarah
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Mulai dari pelaporan hingga tuntas, proses dirancang transparan, akuntabel, dan mengutamakan kesejahteraan psikologis korban.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card rounded-3xl p-6 border border-white/80 shadow-md space-y-3">
              <div className="w-10 h-10 rounded-2xl glass-panel-dark text-white font-black text-sm flex items-center justify-center shadow-xs">
                01
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Kirim Aduan</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Masuk ke akun siswa, tulis kronologi kejadian, dan lampirkan bukti foto bila ada. Anda tetap dapat memilih opsi pelaporan rahasia.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-white/80 shadow-md space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3B7DE8] to-blue-500 text-white font-black text-sm flex items-center justify-center shadow-[0_4px_12px_rgba(59,125,232,0.35)] border border-white/30">
                02
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Dapatkan Kode Tiket</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sistem menghasilkan nomor tiket terenkripsi (misal: <code className="text-[#3B7DE8] font-mono font-bold">#SGP-2024-0142</code>). Simpan kode ini untuk melacak kasus Anda kapan saja.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-white/80 shadow-md space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                03
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Verifikasi &amp; AI NLP</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kecerdasan buatan membantu memetakan kategori kasus, sementara Guru BK &amp; Satgas PPKSP memverifikasi keabsahan laporan secara cermat.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-white/80 shadow-md space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                04
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Tindakan &amp; Solusi</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pelaksanaan mediasi damai, pendampingan psikologis, penegakan tata tertib sekolah, dan pencatatan audit trail hingga kasus selesai.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={(e) => handleReportAction(e, '/buat-laporan')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl glass-button-primary text-white font-bold text-xs sm:text-sm cursor-pointer"
            >
              <span>Mulai Buat Aduan Anda</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Fitur & Teknologi Keamanan SIGAP — Liquid Glass Light */}
      <section className="py-16 lg:py-24 glass-panel border-y border-white/60 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-pill-blue text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#3B7DE8]" />
                <span className="text-[#1D4ED8]">KEUNGGULAN SISTEM</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
                Teknologi Cerdas untuk Perlindungan Nyata
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                SIGAP dirancang dengan standar teknologi institusi modern guna memastikan tidak ada suara aduan yang hilang, diabaikan, atau bocor.
              </p>

              <div className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl glass-button-secondary hover:border-[#3B7DE8]/40 text-slate-800 text-xs font-bold transition shadow-sm"
                >
                  <Lock className="w-3.5 h-3.5 text-[#3B7DE8]" />
                  <span>Akses Khusus Guru BK &amp; Admin</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl glass-card space-y-3 border border-white/80 shadow-sm hover:shadow-md hover:border-[#3B7DE8]/40 transition group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3B7DE8] to-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-base text-slate-900 group-hover:text-[#3B7DE8] transition-colors">AI NLP Multi-Label</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Rekomendasi otomatis 7 kategori kekerasan resmi berdasarkan analisis teks kronologi aduan untuk mempercepat telaah awal tim konselor.
                </p>
              </div>

              <div className="p-6 rounded-3xl glass-card space-y-3 border border-white/80 shadow-sm hover:shadow-md hover:border-[#3B7DE8]/40 transition group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3B7DE8] to-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-base text-slate-900 group-hover:text-[#3B7DE8] transition-colors">Enkripsi &amp; Kerahasiaan</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Data aduan dilindungi mekanisme Role-Based Access Control (RBAC) dan JWT. Hanya konselor sekolah yang terverifikasi yang dapat mengakses.
                </p>
              </div>

              <div className="p-6 rounded-3xl glass-card space-y-3 border border-white/80 shadow-sm hover:shadow-md hover:border-[#3B7DE8]/40 transition group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3B7DE8] to-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-base text-slate-900 group-hover:text-[#3B7DE8] transition-colors">Digital Audit Trail</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Setiap perpindahan status laporan dicatat secara permanen dengan timestamp dan identitas konselor, mencegah kelalaian dan manipulasi.
                </p>
              </div>

              <div className="p-6 rounded-3xl glass-card space-y-3 border border-white/80 shadow-sm hover:shadow-md hover:border-[#3B7DE8]/40 transition group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3B7DE8] to-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-base text-slate-900 group-hover:text-[#3B7DE8] transition-colors">Pelacakan Real-Time</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Transparansi progres aduan melalui kode tiket unik tanpa perlu login, menjaga kenyamanan dan ketenangan pikiran pelapor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section — Glass Accordion */}
      <section className="py-16 lg:py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full glass-pill-blue text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5 text-[#3B7DE8]" />
              <span>TANYA JAWAB</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
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
                className="glass-card rounded-2xl overflow-hidden transition border border-white/80 shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-slate-900 text-xs sm:text-sm flex justify-between items-center gap-4 hover:bg-white/60 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${
                      activeFaq === idx ? 'rotate-180 text-[#3B7DE8]' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-white/40 bg-white/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Crisis Contact Box — Glass Elevated */}
      <section className="py-10 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/90 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill-red text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>HOTLINE BANTUAN DARURAT</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Dalam Keadaan Bahaya Mendesak?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
                Bila Anda membutuhkan perlindungan fisik seketika atau pendampingan darurat kekerasan seksual dan fisik, hubungi kontak resmi berikut:
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="tel:129"
                className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>SAPA 129 (KemenPPPA)</span>
              </a>
              <a
                href="tel:110"
                className="px-5 py-3 rounded-2xl glass-panel-dark text-white font-bold text-xs flex items-center gap-2 shadow-md transition active:scale-95 border border-white/20"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Polisi 110</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Banner */}
      <section className="py-16 glass-panel border-t border-white/60 relative z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Sekolah yang Sehat Dimulai dari Keberanian Bersuara
          </h2>
          <p className="text-slate-600 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            Tidak ada alasan untuk menoleransi perundungan di lingkungan sekolah. Masuk atau daftarkan akun Anda sekarang untuk membuat laporan aduan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              type="button"
              onClick={(e) => handleReportAction(e, '/buat-laporan')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl glass-button-primary text-white font-bold text-sm cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              <span>Buat Laporan Sekarang</span>
            </button>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl glass-button-secondary text-slate-800 font-bold text-sm flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 text-[#3B7DE8]" />
              <span>Masuk ke Akun Siswa</span>
            </Link>

            <Link
              to="/lacak"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl glass-pill text-slate-700 hover:text-slate-900 font-bold text-sm flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-[#3B7DE8]" />
              <span>Lacak Tiket Aduan</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Auth Gate Modal if User Not Logged In — iOS 26 Liquid Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="glass-panel-elevated rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-[0_24px_70px_rgba(0,0,0,0.25)] border border-white/90 relative space-y-6">
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute right-5 top-5 p-2 rounded-2xl glass-pill text-slate-400 hover:text-slate-700 hover:bg-white transition"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl glass-pill-blue text-[#3B7DE8] flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Masuk atau Daftar Terlebih Dahulu
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Untuk mengakses fungsi <strong>Buat Aduan</strong> dan memastikan validitas laporan serta perlindungan resmi oleh Guru BK &amp; Satgas PPKSP, Anda harus memiliki akun terdaftar.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  navigate(`/login?redirect=${encodeURIComponent(targetRedirect)}`);
                }}
                className="w-full py-3.5 px-4 rounded-2xl glass-panel-dark text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 border border-white/20"
              >
                <LogIn className="w-4 h-4 text-white" />
                <span>Masuk dengan Akun Siswa</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  navigate(`/register?redirect=${encodeURIComponent(targetRedirect)}`);
                }}
                className="w-full py-3.5 px-4 rounded-2xl glass-button-primary text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
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

            <div className="pt-3 border-t border-white/50 flex items-center gap-2 text-[11px] text-slate-500">
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
