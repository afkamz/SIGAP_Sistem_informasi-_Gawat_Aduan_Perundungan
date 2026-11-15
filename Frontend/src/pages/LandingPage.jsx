import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
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
  UserPlus,
  Compass,
  ArrowUpRight,
  Menu,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { StudentFooter } from '../components/layout/StudentFooter';
import { KATEGORI_DATA } from '../data/categories';
import { InteractivePhotoCube } from '../components/3d/InteractivePhotoCube';
import { BackgroundMediaBackdrop } from '../components/3d/BackgroundMediaBackdrop';
import { CinematicCategoriesShowcase } from '../components/3d/CinematicCategoriesShowcase';
import { AboutEditorialShowcase } from '../components/landing/AboutEditorialShowcase';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useStore();
  const [activeFaq, setActiveFaq] = useState(null);
  const [quickTicketCode, setQuickTicketCode] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [targetRedirect, setTargetRedirect] = useState('/buat-laporan');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ─── Scroll-Driven Cinematic Stage Tracker (Scene 01 -> Scene 05) ───
  const scrollStageRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      if (!scrollStageRef.current) {
        ticking = false;
        return;
      }
      const rect = scrollStageRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollableDistance = rect.height - windowHeight;

      if (scrollableDistance > 0) {
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
        setScrollProgress(progress);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdmin = currentUser?.role === 'admin';
  const profilePath = isAdmin ? '/admin/dashboard' : '/dashboard';

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

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
      a: 'Setiap aduan yang berhasil diajukan akan menerima Kode Tiket Unik (misal: SGP-2026-8921). Anda dapat memantau status secara langsung melalui menu "Lacak Tiket" atau melalui Dashboard Siswa terdaftar Anda.'
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

  // Opasitas headline spotlight di tengah saat progress 0.35 s.d. 0.60 (Scene 03)
  const centerSpotlightOpacity =
    scrollProgress >= 0.32 && scrollProgress <= 0.64
      ? Math.max(0, Math.min(1, (scrollProgress - 0.32) * 8)) *
        Math.max(0, Math.min(1, (0.64 - scrollProgress) * 8))
      : 0;

  return (
    <div
      className="min-h-screen flex flex-col text-slate-800 font-sans relative"
      style={{ background: '#FFFFFF', overflowX: 'clip' }}
    >

      {/* ─── FIXED GLOBAL HEADER ─── */}
      <header className="fixed top-0 inset-x-0 z-50 w-full pointer-events-auto">
        {/* Top Micro-Ticker Bar */}
        <div style={{ background: '#1D294B' }} className="text-white text-[11px] py-1.5 px-4 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span style={{ color: '#C9D0DA' }}>
                Layanan Siaga Aduan Kekerasan Sekolah Sesuai <strong className="text-white">Permendikbudristek No. 46/2023</strong>
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 font-semibold text-white px-2.5 py-0.5 rounded-full border border-white/20">
                <PhoneCall className="w-3.5 h-3.5" style={{ color: '#E9A7BF' }} />
                Hotline Darurat: SAPA 129 | Polisi 110
              </span>
              <span className="hidden md:inline" style={{ color: '#667085' }}>•</span>
              <Link
                to="/lacak"
                className="hover:text-white underline underline-offset-2 transition hidden md:inline font-medium"
                style={{ color: '#C9D0DA' }}
              >
                Lacak Tiket Aduan
              </Link>
            </div>
          </div>
        </div>

        {/* ─── NAVIGATION BAR — Pink & White Minimalist ─── */}
        <nav className="bg-white border-b" style={{ borderColor: '#E8E3E5' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white group-hover:scale-105 transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #D982A5, #E9A7BF)' }}
              >
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl tracking-tight leading-none" style={{ color: '#202020' }}>
                    SIGAP
                  </span>
                  <span
                    className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold"
                    style={{ background: '#F9DCE7', color: '#D982A5', border: '1px solid #E9A7BF' }}
                  >
                    SISWA
                  </span>
                </div>
                <span className="text-[11px] font-medium block mt-0.5" style={{ color: '#777777' }}>
                  Ruang Perlindungan & Pengaduan Pelajar
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider" style={{ color: '#777777' }}>
              {['about', 'mission', 'how-it-works', 'media', 'safety'].map((section) => (
                <a
                  key={section}
                  href={`#${section}`}
                  onClick={(e) => scrollToSection(e, section)}
                  className="transition-colors py-1 hover:text-pink-500"
                  style={{ color: '#555' }}
                >
                  {section === 'how-it-works' ? 'How It Works' : section === 'safety' ? 'Safety & Privacy' : section.charAt(0).toUpperCase() + section.slice(1)}
                </a>
              ))}
            </div>

            {/* Right Action / Auth Buttons */}
            <div className="hidden sm:flex items-center gap-2.5">
              <Link
                to="/lacak"
                className="text-xs font-bold px-3.5 py-2 rounded-xl border transition flex items-center gap-1.5 hover:border-pink-300"
                style={{ background: '#FDF7F9', color: '#555', border: '1px solid #E8E3E5' }}
              >
                <Search className="w-3.5 h-3.5" style={{ color: '#D982A5' }} />
                <span>Lacak Aduan</span>
              </Link>

              {currentUser ? (
                <div className="flex items-center gap-2 pl-2 border-l" style={{ borderColor: '#E8E3E5' }}>
                  <Link
                    to={profilePath}
                    className="flex items-center gap-2.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition"
                    style={{ color: '#202020', background: '#FDF7F9', border: '1px solid #E8E3E5' }}
                  >
                    <div
                      className="w-6 h-6 rounded-lg text-white flex items-center justify-center font-black text-[10px]"
                      style={{ background: 'linear-gradient(135deg, #D982A5, #E9A7BF)' }}
                    >
                      {currentUser.nama?.slice(0, 2).toUpperCase() || 'SW'}
                    </div>
                    <span className="truncate max-w-[120px]">{currentUser.nama || 'Siswa'}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="p-2 rounded-xl border transition hover:border-red-300 hover:text-red-500"
                    style={{ border: '1px solid #E8E3E5', color: '#777' }}
                    title="Keluar"
                  >
                    <LogIn className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-xs font-bold px-4 py-2 rounded-xl border transition flex items-center gap-1.5"
                  style={{ background: '#FDF7F9', color: '#202020', border: '1px solid #E8E3E5' }}
                >
                  <LogIn className="w-3.5 h-3.5" style={{ color: '#D982A5' }} />
                  <span>Masuk</span>
                </Link>
              )}

              <button
                type="button"
                onClick={(e) => handleReportAction(e, '/buat-laporan')}
                className="text-xs font-bold px-4.5 py-2 rounded-xl text-white flex items-center gap-1.5 cursor-pointer transition active:scale-95 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #D982A5, #E9A7BF)' }}
              >
                <ShieldAlert className="w-4 h-4 text-white" />
                <span>Buat Laporan</span>
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-xl border"
              style={{ border: '1px solid #E8E3E5', color: '#555' }}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="sm:hidden px-4 pt-3 pb-5 border-t space-y-3 animate-fade-in" style={{ borderColor: '#E8E3E5', background: '#fff' }}>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                {['about', 'mission', 'how-it-works', 'media'].map((section) => (
                  <a
                    key={section}
                    href={`#${section}`}
                    onClick={(e) => scrollToSection(e, section)}
                    className="p-2.5 rounded-xl border text-center transition"
                    style={{ border: '1px solid #E8E3E5', color: '#202020', background: '#FDF7F9' }}
                  >
                    {section === 'how-it-works' ? 'How It Works' : section.charAt(0).toUpperCase() + section.slice(1)}
                  </a>
                ))}
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={(e) => { setMobileMenuOpen(false); handleReportAction(e, '/buat-laporan'); }}
                  className="w-full py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #D982A5, #E9A7BF)' }}
                >
                  <ShieldAlert className="w-4 h-4 text-white" />
                  <span>Buat Laporan Sekarang</span>
                </button>
                <Link
                  to="/lacak"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl font-semibold text-xs text-center border"
                  style={{ color: '#202020', border: '1px solid #E8E3E5', background: '#FDF7F9' }}
                >
                  Lacak Tiket Aduan
                </Link>
                {!currentUser && (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl font-semibold text-xs text-center border"
                    style={{ color: '#202020', border: '1px solid #E8E3E5', background: '#fff' }}
                  >
                    Masuk Portal Siswa
                  </Link>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* ─── PINNED SCROLL SECTION (500vh) — Cube Animation (TIDAK DIUBAH) ─── */}
      <section
        ref={scrollStageRef}
        className="cube-scroll-section relative w-full h-[500vh]"
        style={{ overflow: 'visible' }}
      >
        <div
          className="cube-sticky-stage sticky top-0 w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-between"
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            width: '100%',
            height: '100dvh',
            overflow: 'hidden',
            zIndex: 20,
            background: 'transparent'
          }}
        >
          {/* Background Media Backdrop (Cube Video Background) */}
          <BackgroundMediaBackdrop
            src="/assets/background/cube-background.mp4"
            type="video"
            scrollProgress={scrollProgress}
            opacity={0.65}
          />

          {/* SCENE 01 & 02: HERO INITIAL CONTENT */}
          <div
            className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 relative z-10 transition-all duration-150"
            style={{
              opacity: Math.max(0, Math.min(1, 1 - (scrollProgress - 0.12) / 0.16)).toFixed(3),
              transform: `translateY(-${(Math.max(0, scrollProgress - 0.10) * 100).toFixed(1)}px)`,
              pointerEvents: scrollProgress > 0.18 ? 'none' : 'auto'
            }}
          >
            <div className="max-w-xl lg:max-w-2xl space-y-5 text-center lg:text-left mx-auto lg:mx-0">
              {/* Official Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold"
                style={{ background: '#F9DCE7', color: '#D982A5', border: '1px solid #E9A7BF' }}
              >
                <ShieldCheck className="w-4 h-4" style={{ color: '#D982A5' }} />
                <span>SIGAP • RUANG PERLINDUNGAN RESMI PELAJAR</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-5xl lg:text-[62px] font-black tracking-tight leading-[1.08]" style={{ color: '#202020' }}>
                  SUARAKAN KEBENARAN. <br />
                  <span style={{ color: '#D982A5' }}>
                    CIPTAKAN SEKOLAH BEBAS KEKERASAN
                  </span>{' '}
                  &amp; PERUNDUNGAN.
                </h1>
              </div>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium" style={{ color: '#555' }}>
                Setiap pelajar berhak mendapatkan lingkungan pendidikan yang aman, nyaman, dan bebas dari perundungan.
              </p>
              <p className="text-xs max-w-lg mx-auto lg:mx-0 leading-relaxed hidden sm:block" style={{ color: '#777' }}>
                Laporkan insiden secara aman dengan proteksi identitas berlapis, verifikasi cerdas asisten AI IndoBERT NLP, dan pendampingan terpadu Tim Bimbingan Konseling (BK) &amp; Satgas PPKSP.
              </p>

              {/* Call to Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <button
                  type="button"
                  onClick={(e) => handleReportAction(e, '/buat-laporan')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 group cursor-pointer active:scale-95 transition hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #D982A5, #E9A7BF)' }}
                >
                  <ShieldAlert className="w-4 h-4 text-white group-hover:scale-110 transition" />
                  <span>Buat Laporan Sekarang</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>

                <Link
                  to="/login"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border transition hover:border-pink-300"
                  style={{ color: '#202020', border: '1px solid #E8E3E5', background: '#fff' }}
                >
                  <LogIn className="w-4 h-4" style={{ color: '#D982A5' }} />
                  <span>Masuk Portal Siswa</span>
                </Link>
              </div>

              {/* Quick Ticket Tracking */}
              <div className="pt-2 max-w-md mx-auto lg:mx-0">
                <form
                  onSubmit={handleQuickTrack}
                  className="p-1.5 pl-3.5 rounded-2xl border flex items-center gap-2"
                  style={{ background: '#FDF7F9', border: '1px solid #E8E3E5' }}
                >
                  <Search className="w-4 h-4 flex-shrink-0" style={{ color: '#D982A5' }} />
                  <input
                    type="text"
                    placeholder="Punya Kode Tiket? (Contoh: SGP-2024-0142)"
                    value={quickTicketCode}
                    onChange={(e) => setQuickTicketCode(e.target.value)}
                    className="w-full bg-transparent text-xs focus:outline-none font-medium"
                    style={{ color: '#202020' }}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-white text-xs font-bold flex-shrink-0 cursor-pointer transition hover:opacity-90"
                    style={{ background: '#D982A5' }}
                  >
                    Lacak
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* CUBE 3D (Dekoratif Tanpa Interaksi Klik) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 pt-16">
            <InteractivePhotoCube
              scrollProgress={scrollProgress}
            />
          </div>

          {/* SCENE 03: SPOTLIGHT CENTER */}
          <div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 max-w-4xl mx-auto px-4 text-center pointer-events-none z-10 transition-opacity duration-200"
            style={{
              opacity: centerSpotlightOpacity.toFixed(3),
              transform: `translateY(${((scrollProgress - 0.48) * -40).toFixed(1)}px)`
            }}
          >
            <div className="space-y-3">
              <span
                className="font-mono text-xs uppercase tracking-widest px-4 py-1.5 rounded-full"
                style={{ background: '#F9DCE7', color: '#D982A5', border: '1px solid #E9A7BF' }}
              >
                PENGALAMAN INTERAKTIF // SCROLL SPOTLIGHT
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight" style={{ color: '#202020' }}>
                SATU SUARA KEBENARAN DAPAT MENGHENTIKAN KEKERASAN.
              </h2>
              <p className="text-xs sm:text-base max-w-2xl mx-auto leading-relaxed font-medium" style={{ color: '#555' }}>
                IDENTITAS DILINDUNGI • TRIASE CERDAS AI INDOBERT • 100% TERENKRIPSI
              </p>
            </div>
          </div>

          {/* SCENE 05: TRANSITION BRIDGE */}
          <div
            className="absolute inset-x-0 bottom-16 max-w-2xl mx-auto px-4 text-center pointer-events-none z-10 transition-opacity duration-300"
            style={{
              opacity: Math.max(0, Math.min(1, (scrollProgress - 0.84) * 6.5)).toFixed(3),
              transform: `translateY(${Math.max(0, (1 - scrollProgress) * 45).toFixed(1)}px)`
            }}
          >
            <div
              className="p-5 sm:p-6 rounded-3xl space-y-2"
              style={{ background: '#fff', border: '1px solid #E9A7BF', boxShadow: '0 12px 40px rgba(217,130,165,0.12)' }}
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold"
                style={{ background: '#F9DCE7', color: '#D982A5', border: '1px solid #E9A7BF' }}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>TRANSISI // SISTEM PERLINDUNGAN TERPADU</span>
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight" style={{ color: '#202020' }}>
                Mengenal Ekosistem Pengaduan &amp; Pencegahan SIGAP
              </h3>
              <p className="text-xs max-w-lg mx-auto font-medium" style={{ color: '#555' }}>
                Melindungi integritas pelajar melalui pelaporan rahasia, audit trail terverifikasi, dan pendampingan profesional Satgas PPKSP.
              </p>
            </div>
          </div>

          {/* SCROLL GUIDE FOOTER DOCK */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 flex items-center justify-between text-xs font-mono z-30 pointer-events-auto" style={{ color: '#777' }}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: '#D982A5' }} />
              <span className="font-bold" style={{ color: '#555' }}>
                {scrollProgress < 0.15
                  ? 'SCENE 01 // INITIAL STATE'
                  : scrollProgress < 0.35
                  ? 'SCENE 02 // SCALE UP'
                  : scrollProgress < 0.60
                  ? 'SCENE 03 // MOVE TO CENTER'
                  : scrollProgress < 0.85
                  ? 'SCENE 04 // MOVE UPWARD'
                  : 'SCENE 05 // FINAL TRANSITION'}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2.5">
              <span style={{ color: '#aaa' }}>0%</span>
              <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ background: '#E8E3E5' }}>
                <div
                  className="h-full rounded-full transition-all duration-75"
                  style={{ width: `${(scrollProgress * 100).toFixed(0)}%`, background: 'linear-gradient(90deg, #D982A5, #E9A7BF)' }}
                />
              </div>
              <span style={{ color: '#aaa' }}>100%</span>
            </div>

            <div className="flex items-center gap-1.5 font-bold" style={{ color: '#D982A5' }}>
              <span>GULIR KE BAWAH</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 1: ABOUT SIGAP (#about) EDITORIAL HORIZONTAL SHOWCASE ─── */}
      <AboutEditorialShowcase handleReportAction={handleReportAction} />

      {/* ─── SECTION 2: OUR MISSION (#mission) ─── */}
      <section id="mission" className="py-20 lg:py-28 border-y relative z-30" style={{ background: '#FDF7F9', borderColor: '#E8E3E5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <div
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold"
              style={{ background: '#F9DCE7', color: '#D982A5', border: '1px solid #E9A7BF' }}
            >
              <School className="w-3.5 h-3.5" />
              <span>MISI &amp; FILOSOFI SIGAP</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight" style={{ color: '#202020' }}>
              Membangun Ekosistem Sekolah yang Aman dan Berintegritas
            </h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#555' }}>
              Kami percaya rasa aman adalah hak dasar setiap anak dalam menuntut ilmu. SIGAP mempertemukan komitmen hukum, teknologi cerdas, dan sentuhan empati manusia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield className="w-6 h-6 text-white" />,
                bg: 'linear-gradient(135deg, #D982A5, #E9A7BF)',
                title: 'Zero Retaliation Guarantee',
                desc: 'Menjamin perlindungan tanpa intimidasi balasan bagi pelapor, saksi, maupun korban. Sanksi tegas diberlakukan terhadap setiap upaya perundungan lanjutan.'
              },
              {
                icon: <Sparkles className="w-6 h-6 text-white" />,
                bg: 'linear-gradient(135deg, #9B59B6, #8E44AD)',
                title: 'Validasi & Triase Berbasis AI',
                desc: 'Pemrosesan teks IndoBERT secara otomatis mengidentifikasi 7 kategori kekerasan resmi dan mengukur tingkat risiko untuk mempercepat respons tindakan awal.'
              },
              {
                icon: <HeartHandshake className="w-6 h-6 text-white" />,
                bg: 'linear-gradient(135deg, #2ECC71, #1ABC9C)',
                title: 'Pendampingan Psikologis Terpadu',
                desc: 'Guru BK dan Satgas PPKSP mendampingi siswa secara privat dan berkelanjutan hingga tercapai pemulihan trauma dan kedamaian lingkungan sekolah.'
              }
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-3xl p-8 space-y-4"
                style={{ background: '#fff', border: '1px solid #E8E3E5' }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold" style={{ background: item.bg }}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-black" style={{ color: '#202020' }}>{item.title}</h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#555' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: HOW IT WORKS (#how-it-works) ─── */}
      <section id="how-it-works" className="py-20 lg:py-28 relative z-30" style={{ background: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold"
              style={{ background: '#F9DCE7', color: '#D982A5', border: '1px solid #E9A7BF' }}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>ALUR PENANGANAN</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight" style={{ color: '#202020' }}>
              Alur 4 Langkah: Report → Verification → Follow-up → Resolution
            </h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#555' }}>
              Mulai dari pengiriman hingga penuntasan kasus, proses berjalan transparan, akuntabel, dan bebas hambatan birokrasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', bg: '#202020', title: 'Report (Kirim Aduan)', desc: 'Tulis kronologi kejadian, pilih lokasi di sekolah, lampirkan bukti foto bila ada, dan tentukan opsi privasi identitas Anda.' },
              { num: '02', bg: 'linear-gradient(135deg, #D982A5, #E9A7BF)', title: 'Verification (Verifikasi)', desc: 'Kecerdasan buatan NLP IndoBERT memetakan kategori kasus, kemudian Tim BK Satgas memverifikasi keabsahan laporan.' },
              { num: '03', bg: '#5B4CF5', title: 'Follow-up (Tindak Lanjut)', desc: 'Pelaksanaan sesi konseling privat, mediasi terarah, pemanggilan saksi aman, dan pemenuhan kebutuhan bantuan korban.' },
              { num: '04', bg: '#16A34A', title: 'Resolution (Penyelesaian)', desc: 'Penegakan aturan sekolah, pemulihan situasi belajar, dan pencatatan riwayat penanganan secara permanen di Digital Audit Trail.' }
            ].map((step, i) => (
              <div
                key={i}
                className="rounded-3xl p-6 space-y-3"
                style={{ background: '#FDF7F9', border: '1px solid #E8E3E5' }}
              >
                <div
                  className="w-10 h-10 rounded-2xl text-white font-black text-sm flex items-center justify-center"
                  style={{ background: step.bg }}
                >
                  {step.num}
                </div>
                <h4 className="font-extrabold text-base" style={{ color: '#202020' }}>{step.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: '#777' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: CINEMATIC CATEGORIES SHOWCASE (#media) & SHARED CONTINUOUS VIDEO ─── */}
      <div className="shared-video-wrapper relative w-full">
        {/* Single continuous shared video background for both #media and #safety */}
        <video
          className="shared-background-video absolute inset-0 w-full h-full object-cover object-center pointer-events-none -z-10"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0
          }}
        >
          <source src="/assets/background/sigap-background.mp4" type="video/mp4" />
        </video>

        {/* Subtle translucent light overlay to ensure legibility while showing video */}
        <div
          className="absolute inset-0 pointer-events-none z-1"
          style={{
            background: 'linear-gradient(180deg, rgba(253, 247, 249, 0.82) 0%, rgba(255, 255, 255, 0.72) 50%, rgba(253, 247, 249, 0.85) 100%)'
          }}
        />

        {/* Section 4: 7 Bentuk Kekerasan (Pinned Horizontal Wavy Reel) */}
        <div className="relative z-10">
          <CinematicCategoriesShowcase
            onSelectCategory={(catId) => {
              handleReportAction(null, catId ? `/buat-laporan?kategori=${catId}` : '/buat-laporan');
            }}
          />
        </div>

        {/* Section 5: Safety & Privacy (#safety) */}
        <section id="safety" className="py-20 lg:py-28 relative z-10" style={{ background: 'transparent' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: '#F9DCE7', color: '#D982A5', border: '1px solid #E9A7BF' }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>KEAMANAN &amp; PRIVASI</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight" style={{ color: '#202020' }}>
                  Teknologi Cerdas untuk Perlindungan Hakiki
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: '#555' }}>
                  SIGAP dirancang dengan standar teknologi institusi modern guna memastikan tidak ada suara aduan yang hilang, diabaikan, atau bocor.
                </p>

                <div className="pt-2">
                  <Link
                    to="/admin/login"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold border transition hover:border-pink-300"
                    style={{ color: '#202020', border: '1px solid #E8E3E5', background: '#FDF7F9' }}
                  >
                    <Lock className="w-3.5 h-3.5" style={{ color: '#D982A5' }} />
                    <span>Akses Khusus Guru BK &amp; Admin</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <Sparkles className="w-5 h-5 text-white" />, title: 'AI NLP Multi-Label', desc: 'Rekomendasi otomatis 7 kategori kekerasan resmi berdasarkan analisis teks kronologi aduan untuk mempercepat telaah awal tim konselor.' },
                  { icon: <Lock className="w-5 h-5 text-white" />, title: 'Enkripsi & Kerahasiaan', desc: 'Data aduan dilindungi mekanisme Role-Based Access Control (RBAC) dan JWT. Hanya konselor sekolah yang terverifikasi yang dapat mengakses.' },
                  { icon: <FileText className="w-5 h-5 text-white" />, title: 'Digital Audit Trail', desc: 'Setiap perpindahan status laporan dicatat secara permanen dengan timestamp dan identitas konselor, mencegah kelalaian dan manipulasi.' },
                  { icon: <Search className="w-5 h-5 text-white" />, title: 'Pelacakan Real-Time', desc: 'Transparansi progres aduan melalui kode tiket unik tanpa perlu login, menjaga kenyamanan dan ketenangan pikiran pelapor.' }
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-3xl space-y-3 border transition group hover:border-pink-300 shadow-sm"
                    style={{ background: 'rgba(253, 247, 249, 0.92)', border: '1px solid #E8E3E5' }}
                  >
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold group-hover:scale-105 transition-transform"
                      style={{ background: 'linear-gradient(135deg, #D982A5, #E9A7BF)' }}
                    >
                      {feature.icon}
                    </div>
                    <h4 className="font-bold text-base group-hover:text-pink-500 transition-colors" style={{ color: '#202020' }}>
                      {feature.title}
                    </h4>
                    <p className="text-xs leading-relaxed" style={{ color: '#555' }}>{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─── SECTION: FAQ ACCORDION ─── */}
      <section className="py-16 lg:py-24 relative z-30" style={{ background: '#FDF7F9' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <div
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold"
              style={{ background: '#F9DCE7', color: '#D982A5', border: '1px solid #E9A7BF' }}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>TANYA JAWAB</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: '#202020' }}>
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xs sm:text-sm" style={{ color: '#777' }}>
              Temukan jawaban seputar akses login, keamanan privasi, alur aduan, dan penanganan perundungan di SIGAP.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl overflow-hidden transition"
                style={{ background: '#fff', border: '1px solid #E8E3E5' }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm flex justify-between items-center gap-4 transition"
                  style={{ color: '#202020' }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform flex-shrink-0 ${activeFaq === idx ? 'rotate-180' : ''}`}
                    style={{ color: activeFaq === idx ? '#D982A5' : '#aaa' }}
                  />
                </button>
                {activeFaq === idx && (
                  <div
                    className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed border-t"
                    style={{ color: '#555', borderColor: '#E8E3E5', background: '#FDF7F9' }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION: EMERGENCY CRISIS CONTACT BOX ─── */}
      <section className="py-10 relative z-30" style={{ background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ background: '#FFF5F7', border: '1px solid #F9DCE7' }}
          >
            <div className="space-y-2 text-center md:text-left">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' }}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>HOTLINE BANTUAN DARURAT</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black" style={{ color: '#202020' }}>
                Dalam Keadaan Bahaya Mendesak?
              </h3>
              <p className="text-xs sm:text-sm max-w-xl" style={{ color: '#777' }}>
                Bila Anda membutuhkan perlindungan fisik seketika atau pendampingan darurat kekerasan seksual dan fisik, hubungi kontak resmi berikut:
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="tel:129"
                className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 transition active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>SAPA 129 (KemenPPPA)</span>
              </a>
              <a
                href="tel:110"
                className="px-5 py-3 rounded-2xl text-white font-bold text-xs flex items-center gap-2 transition active:scale-95"
                style={{ background: '#1D294B' }}
              >
                <ShieldAlert className="w-4 h-4 text-white" />
                <span>Polisi 110</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: FINAL CALL TO ACTION ─── */}
      <section className="py-16 border-t relative z-30" style={{ background: '#FDF7F9', borderColor: '#E8E3E5' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight" style={{ color: '#202020' }}>
            Sekolah yang Sehat Dimulai dari Keberanian Bersuara
          </h2>
          <p className="text-xs sm:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: '#555' }}>
            Tidak ada alasan untuk menoleransi perundungan di lingkungan sekolah. Masuk atau daftarkan akun Anda sekarang untuk membuat laporan aduan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              type="button"
              onClick={(e) => handleReportAction(e, '/buat-laporan')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-white font-bold text-sm cursor-pointer transition hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #D982A5, #E9A7BF)' }}
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              <span>Buat Laporan Sekarang</span>
            </button>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border transition hover:border-pink-300"
              style={{ color: '#202020', border: '1px solid #E8E3E5', background: '#fff' }}
            >
              <LogIn className="w-4 h-4" style={{ color: '#D982A5' }} />
              <span>Masuk ke Akun Siswa</span>
            </Link>

            <Link
              to="/admin/login"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border transition hover:border-pink-300"
              style={{ color: '#555', border: '1px solid #E8E3E5', background: '#FDF7F9' }}
            >
              <Lock className="w-4 h-4" style={{ color: '#D982A5' }} />
              <span>Akses Portal Guru BK</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── AUTH GATE MODAL ─── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ background: 'rgba(29,41,75,0.4)' }}>
          <div
            className="rounded-3xl max-w-md w-full p-6 sm:p-8 relative space-y-6"
            style={{ background: '#fff', border: '1px solid #E9A7BF', boxShadow: '0 24px 70px rgba(217,130,165,0.2)' }}
          >
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute right-5 top-5 p-2 rounded-2xl transition hover:bg-pink-50"
              style={{ color: '#aaa' }}
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
              style={{ background: '#F9DCE7' }}
            >
              <Lock className="w-7 h-7" style={{ color: '#D982A5' }} />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-black tracking-tight" style={{ color: '#202020' }}>
                Masuk atau Daftar Terlebih Dahulu
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#555' }}>
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
                className="w-full py-3.5 px-4 rounded-2xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
                style={{ background: '#1D294B' }}
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
                className="w-full py-3.5 px-4 rounded-2xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #D982A5, #E9A7BF)' }}
              >
                <UserPlus className="w-4 h-4" />
                <span>Daftar Akun Baru</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-full py-2.5 px-4 text-xs font-semibold transition cursor-pointer hover:text-slate-800"
                style={{ color: '#aaa' }}
              >
                Batal
              </button>
            </div>

            <div className="pt-3 border-t flex items-center gap-2 text-[11px]" style={{ borderColor: '#E8E3E5', color: '#aaa' }}>
              <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#16A34A' }} />
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
