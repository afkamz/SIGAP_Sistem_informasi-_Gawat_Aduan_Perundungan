import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  EyeOff,
  Clock,
  PlusCircle,
  Inbox,
  MoreHorizontal,
  RotateCw,
  CheckCircle2,
  ChevronDown,
  SlidersHorizontal,
  Monitor,
  Users,
  Building2,
  ShieldAlert,
  FileText,
  Lock,
  UserCheck,
  Info,
  GraduationCap,
  ArrowRight,
  PhoneCall,
  Phone,
  Search
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StudentHeader } from '../../components/layout/StudentHeader';
import { StudentFooter } from '../../components/layout/StudentFooter';

export const StudentDashboard = () => {
  const { currentUser, reports, fetchRiwayatSiswa, isBackendConnected, token } = useStore();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [isLoadingRiwayat, setIsLoadingRiwayat] = useState(false);

  // Background Video Ref & Autoplay Enforcer
  const videoRef = useRef(null);
  const heroRef = useRef(null);
  const [isHeroInView, setIsHeroInView] = useState(false);

  const easeCurve = 'cubic-bezier(0.16, 1, 0.3, 1)';

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          video.muted = true;
          video.play()?.catch(() => {});
        });
      }
    }
  }, []);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeroInView(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(heroEl);

    // Initial check jika hero section sudah berada dalam viewport saat pertama kali render
    const rect = heroEl.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsHeroInView(true);
    }

    return () => observer.disconnect();
  }, []);

  const handleRefreshRiwayat = async () => {
    if (!currentUser?.id) return;
    setIsLoadingRiwayat(true);
    try {
      await fetchRiwayatSiswa(currentUser.id, token);
    } finally {
      setIsLoadingRiwayat(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      handleRefreshRiwayat();
    }
  }, [currentUser?.id, token]);

  const studentName = currentUser?.nama || 'Dimas Prasetya';
  const displayName = studentName.toLowerCase().includes('ananda')
    ? studentName
    : `Ananda ${studentName}`;

  // Filter laporan milik siswa
  const myReports = useMemo(() => {
    return reports.filter((r) => {
      if (!r.is_active && r.urgensi === 'Selesai' && r.ticket_code?.startsWith('REF-')) return false;

      if (currentUser?.id && r.siswa_id && Number(r.siswa_id) === Number(currentUser.id)) return true;
      if (currentUser?.nama && r.reporter_name && r.reporter_name.toLowerCase() === currentUser.nama.toLowerCase()) return true;

      if (!currentUser?.id) {
        if (['TKT-2024-0891', 'TKT-2024-0742', 'TKT-2024-0511'].includes(r.ticket_code)) return true;
        if (r.reporter_name && r.reporter_name.toLowerCase().includes('dimas prasetya')) return true;
      }

      if (r.id > 1000000000000 && (!r.reporter_name || r.reporter_name === currentUser?.nama)) return true;

      return false;
    });
  }, [reports, currentUser]);

  const totalCount = myReports.length;
  const pendingCount = myReports.filter((r) => r.status === 'menunggu').length;
  const inProgressCount = myReports.filter(
    (r) => r.status === 'diverifikasi' || r.status === 'ditindaklanjuti'
  ).length;
  const completedCount = myReports.filter((r) => r.status === 'selesai').length;

  const displayedReports = useMemo(() => {
    let result = [...myReports];

    if (statusFilter !== 'all') {
      if (statusFilter === 'ditindaklanjuti') {
        result = result.filter(
          (r) => r.status === 'ditindaklanjuti' || r.status === 'diverifikasi'
        );
      } else {
        result = result.filter((r) => r.status === statusFilter);
      }
    }

    result.sort((a, b) => {
      const dateA = new Date(a.tanggal || 0).getTime() || a.id;
      const dateB = new Date(b.tanggal || 0).getTime() || b.id;
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [myReports, statusFilter, sortOrder]);

  const renderCategoryIcon = (kategoriNama = '') => {
    const lower = kategoriNama.toLowerCase();
    if (lower.includes('siber') || lower.includes('cyber') || lower.includes('online')) {
      return (
        <span
          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border"
          style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
        >
          <Monitor className="w-3.5 h-3.5 text-[#1C6F8E]" />
        </span>
      );
    }
    if (lower.includes('sosial') || lower.includes('pengucilan') || lower.includes('kelompok')) {
      return (
        <span
          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border"
          style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
        >
          <Users className="w-3.5 h-3.5 text-[#1C6F8E]" />
        </span>
      );
    }
    if (lower.includes('sekolah') || lower.includes('kantin') || lower.includes('lingkungan')) {
      return (
        <span
          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border"
          style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
        >
          <Building2 className="w-3.5 h-3.5 text-[#1C6F8E]" />
        </span>
      );
    }
    return (
      <span
        className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border"
        style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
      >
        <ShieldAlert className="w-3.5 h-3.5 text-[#1C6F8E]" />
      </span>
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans relative"
      style={{ background: '#FFFFFF', color: '#1C6F8E' }}
    >
      {/* Header Siswa */}
      <StudentHeader isDashboard={true} />

      {/* ─── Hero Section Siswa Full-Screen dengan Background Video ─── */}
      <section
        ref={heroRef}
        className="relative w-full min-h-[calc(100vh-4rem)] min-h-[calc(100dvh-4rem)] flex flex-col justify-between items-center overflow-hidden border-b z-0 text-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16"
        style={{ borderColor: '#BFEFFF' }}
      >
        {/* Background Video (Memenuhi Seluruh Viewport Hero Layar Penuh) */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none brightness-105"
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
          aria-hidden="true"
        >
          <source src="/assets/background/dashboard-welcome.mp4" type="video/mp4" />
        </video>

        {/* Clean Solid Translucent Shield Overlay (Melindungi Keterbacaan Teks Hero) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.40)',
            zIndex: 1
          }}
          aria-hidden="true"
        />

        {/* Spacer Atas untuk Menyeimbangkan Komposisi Tengah */}
        <div className="w-full h-4 sm:h-8 relative z-10" />

        {/* Hero Content Area: Konten Utama Berada Tepat di Tengah Halaman */}
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center space-y-6 sm:space-y-8 my-auto">
          
          {/* Breadcrumb Tag */}
          <div
            className="inline-flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full border shadow-xs"
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              color: '#1C6F8E',
              borderColor: '#BFEFFF',
              opacity: isHeroInView ? 1 : 0,
              transform: isHeroInView ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 500ms ${easeCurve} 50ms, transform 500ms ${easeCurve} 50ms`
            }}
          >
            <span>Portal Siswa</span>
            <span>&gt;</span>
            <span className="font-extrabold" style={{ color: '#142B4A' }}>
              Dashboard Pelapor
            </span>
          </div>

          {/* Main Welcome Headline (Cinematic Text Reveal - Full Screen Center) */}
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.14]"
            style={{
              textShadow: '0 3px 14px rgba(20, 43, 74, 0.50)'
            }}
          >
            <span
              className="inline-block"
              style={{
                color: '#FFFFFF',
                opacity: isHeroInView ? 1 : 0,
                transform: isHeroInView ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 700ms ${easeCurve} 150ms, transform 700ms ${easeCurve} 150ms`
              }}
            >
              Selamat Datang,&nbsp;
            </span>
            <br className="hidden sm:inline" />
            <span
              className="inline-block"
              style={{
                color: '#FFFFFF',
                opacity: isHeroInView ? 1 : 0,
                transform: isHeroInView ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 700ms ${easeCurve} 260ms, transform 700ms ${easeCurve} 260ms`
              }}
            >
              {displayName}
            </span>
          </h1>

          {/* Supporting Text Sambutan Singkat */}
          <p
            className="text-sm sm:text-lg leading-relaxed max-w-2xl font-semibold"
            style={{
              color: '#FFFFFF',
              textShadow: '0 2px 10px rgba(20, 43, 74, 0.55)',
              opacity: isHeroInView ? 1 : 0,
              transform: isHeroInView ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 500ms ${easeCurve} 420ms, transform 500ms ${easeCurve} 420ms`
            }}
          >
            Ruang perlindungan siswa SIGAP. Setiap suara Anda didengar, dilindungi, dan ditindaklanjuti secara profesional.
          </p>

          {/* Group Tombol Aksi - Fokus Utama "Buat Aduan Baru" */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto pt-2"
            style={{
              opacity: isHeroInView ? 1 : 0,
              transform: isHeroInView ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 500ms ${easeCurve} 600ms, transform 500ms ${easeCurve} 600ms`
            }}
          >
            {/* Tombol Utama: Buat Aduan Baru (Fokus Utama) */}
            <Link
              to="/buat-laporan"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition transform hover:scale-105 active:scale-95 border shadow-lg cursor-pointer"
              style={{
                background: '#BFEFFF',
                color: '#142B4A',
                borderColor: '#FFFFFF',
                boxShadow: '0 8px 24px rgba(20, 43, 74, 0.25)'
              }}
            >
              <PlusCircle className="w-5 h-5 text-[#142B4A]" />
              <span>Buat Aduan Baru</span>
            </Link>

            {/* Tombol Sekunder: Lacak Tiket */}
            <Link
              to="/lacak?from=dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition hover:opacity-95 border shadow-md"
              style={{
                background: '#FFFFFF',
                color: '#1C6F8E',
                borderColor: '#BFEFFF'
              }}
            >
              <Search className="w-4 h-4 text-[#1C6F8E]" />
              <span>Lacak Tiket</span>
            </Link>

            {/* Tombol Sekunder: Sinkronkan Data */}
            <button
              type="button"
              onClick={handleRefreshRiwayat}
              disabled={isLoadingRiwayat}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer border hover:opacity-95 shadow-md"
              style={{
                background: '#FFFFFF',
                color: '#1C6F8E',
                borderColor: '#BFEFFF'
              }}
              title="Sinkronkan aduan dari database"
            >
              <RotateCw className={`w-4 h-4 text-[#1C6F8E] ${isLoadingRiwayat ? 'animate-spin' : ''}`} />
              <span>Sinkronkan Data</span>
            </button>
          </div>

          <span
            className="text-[11px] sm:text-xs font-semibold px-3.5 py-1 rounded-full border shadow-xs"
            style={{
              background: 'rgba(255, 255, 255, 0.90)',
              color: '#1C6F8E',
              borderColor: '#BFEFFF',
              opacity: isHeroInView ? 1 : 0,
              transition: `opacity 500ms ${easeCurve} 750ms`
            }}
          >
            Layanan resmi bebas biaya &amp; terlindungi hukum • Respons Tim BK &lt; 24 Jam
          </span>
        </div>

        {/* Petunjuk Gulir ke Bawah (Scroll Indicator) */}
        <div
          className="relative z-10 pb-2 flex flex-col items-center gap-1 pointer-events-none select-none"
          style={{
            opacity: isHeroInView ? 0.95 : 0,
            transition: `opacity 600ms ${easeCurve} 900ms`
          }}
        >
          <span
            className="text-[11px] font-bold tracking-wider uppercase drop-shadow"
            style={{ color: '#FFFFFF' }}
          >
            Gulir ke bawah untuk melihat riwayat aduan
          </span>
          <ChevronDown className="w-4 h-4 text-white animate-bounce drop-shadow" />
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative z-20">

        {/* ── Ajakan Melapor / Report Banner (Dapat Diakses Saat Pengguna Scroll ke Bawah) ── */}
        <div
          className="rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 relative border"
          style={{
            background: '#FFFFFF',
            borderColor: '#BFEFFF',
            boxShadow: '0 4px 20px -2px rgba(191, 239, 255, 0.40)'
          }}
        >
          <div className="flex items-start gap-4 sm:gap-5 flex-1">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xs border"
              style={{
                background: '#BFEFFF',
                borderColor: '#BFEFFF'
              }}
            >
              <Shield className="w-7 h-7 text-[#1C6F8E]" strokeWidth={2.2} />
            </div>
            <div className="space-y-2 flex-1">
              <h2
                className="text-base sm:text-lg lg:text-xl font-black leading-snug"
                style={{ color: '#1C6F8E' }}
              >
                Mengalami atau Menyaksikan Tindakan Tidak Menyenangkan?
              </h2>
              <p
                className="text-xs sm:text-sm max-w-3xl leading-relaxed font-medium"
                style={{ color: '#2E84A5' }}
              >
                Laporkan perundungan verbal, kontak fisik, cyberbullying, atau pemalakan di sekolah. Identitas Anda dijamin 100% aman, terlindungi, dan bersifat rahasia.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                  style={{
                    background: '#BFEFFF',
                    color: '#1C6F8E',
                    borderColor: '#BFEFFF'
                  }}
                >
                  <EyeOff className="w-3.5 h-3.5 text-[#1C6F8E]" />
                  <span>Mode Anonim Tersedia</span>
                </span>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                  style={{
                    background: '#FFFFFF',
                    color: '#1C6F8E',
                    borderColor: '#BFEFFF'
                  }}
                >
                  <Clock className="w-3.5 h-3.5 text-[#1C6F8E]" />
                  <span>Respons Tim BK &lt; 24 Jam</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end shrink-0 w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
              <Link
                to="/lacak?from=dashboard"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition hover:opacity-90 border"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              >
                <Search className="w-4 h-4 text-[#1C6F8E]" />
                <span>Lacak Tiket</span>
              </Link>
              <Link
                to="/buat-laporan"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition hover:opacity-90 border shadow-xs"
                style={{
                  background: '#BFEFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              >
                <PlusCircle className="w-4 h-4 text-[#1C6F8E]" />
                <span>Buat Aduan Baru</span>
              </Link>
            </div>
            <span className="text-[11px] mt-2 font-medium text-center" style={{ color: '#2E84A5' }}>
              Layanan resmi bebas biaya &amp; terlindungi hukum
            </span>
          </div>
        </div>

        {/* 4 Kartu Statistik Ringkasan */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Laporan */}
          <div
            className="p-5 rounded-3xl border flex flex-col justify-between"
            style={{
              background: '#FFFFFF',
              borderColor: '#BFEFFF',
              boxShadow: '0 4px 16px rgba(191, 239, 255, 0.35)'
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: '#2E84A5' }}>
                Total Aduan Saya
              </span>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
              >
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black leading-none" style={{ color: '#1C6F8E' }}>
                {totalCount}
              </span>
              <span className="text-xs font-medium" style={{ color: '#2E84A5' }}>
                kasus tercatat
              </span>
            </div>
          </div>

          {/* Card 2: Menunggu Tanggapan */}
          <div
            className="p-5 rounded-3xl border flex flex-col justify-between"
            style={{
              background: '#FFFFFF',
              borderColor: '#BFEFFF',
              boxShadow: '0 4px 16px rgba(191, 239, 255, 0.35)'
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: '#2E84A5' }}>
                Menunggu Tanggapan
              </span>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-3xl font-black leading-none" style={{ color: '#1C6F8E' }}>
                {pendingCount}
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border"
                style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
              >
                Penelaahan
              </span>
            </div>
          </div>

          {/* Card 3: Sedang Ditindak */}
          <div
            className="p-5 rounded-3xl border flex flex-col justify-between"
            style={{
              background: '#FFFFFF',
              borderColor: '#BFEFFF',
              boxShadow: '0 4px 16px rgba(191, 239, 255, 0.35)'
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: '#2E84A5' }}>
                Sedang Ditindak
              </span>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
              >
                <RotateCw className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-3xl font-black leading-none" style={{ color: '#1C6F8E' }}>
                {inProgressCount}
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border"
                style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#1C6F8E' }}
              >
                Konseling
              </span>
            </div>
          </div>

          {/* Card 4: Selesai Ditangani */}
          <div
            className="p-5 rounded-3xl border flex flex-col justify-between"
            style={{
              background: '#FFFFFF',
              borderColor: '#BFEFFF',
              boxShadow: '0 4px 16px rgba(191, 239, 255, 0.35)'
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: '#2E84A5' }}>
                Selesai Ditangani
              </span>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-3xl font-black leading-none" style={{ color: '#1C6F8E' }}>
                {completedCount}
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border"
                style={{ background: '#FFFFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
              >
                Terselesaikan
              </span>
            </div>
          </div>
        </div>

        {/* Section Riwayat Laporan Saya */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg sm:text-xl font-black tracking-tight" style={{ color: '#1C6F8E' }}>
                  Riwayat Laporan Saya
                </h3>
                {isBackendConnected && (
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold border"
                    style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1C6F8E] animate-pulse" />
                    <span>Tersinkron Database</span>
                  </span>
                )}
              </div>
              <p className="text-xs mt-0.5" style={{ color: '#2E84A5' }}>
                Pantau perkembangan dan tindak lanjut aduan yang telah Anda kirimkan secara transparan.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* Dropdown Filter Status */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold focus:outline-none cursor-pointer border"
                  style={{
                    background: '#FFFFFF',
                    color: '#1C6F8E',
                    borderColor: '#BFEFFF'
                  }}
                >
                  <option value="all">Semua Status</option>
                  <option value="menunggu">Menunggu</option>
                  <option value="ditindaklanjuti">Sedang Ditindak</option>
                  <option value="selesai">Selesai</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#1C6F8E]" />
              </div>

              {/* Tombol Urutkan */}
              <button
                type="button"
                onClick={() => setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'))}
                className="rounded-xl px-3.5 py-2 text-xs font-semibold flex items-center gap-2 cursor-pointer transition border hover:opacity-90"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
                title="Klik untuk mengubah urutan"
              >
                <span>{sortOrder === 'newest' ? 'Terbaru' : 'Terlama'}</span>
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#1C6F8E]" />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          {displayedReports.length === 0 ? (
            <div
              className="rounded-3xl border p-12 text-center space-y-3"
              style={{
                background: '#FFFFFF',
                borderColor: '#BFEFFF',
                boxShadow: '0 4px 16px rgba(191, 239, 255, 0.35)'
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto border"
                style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
              >
                <FileText className="w-6 h-6 text-[#1C6F8E]" />
              </div>
              <h4 className="text-sm font-bold" style={{ color: '#1C6F8E' }}>
                Tidak Ada Laporan Ditemukan
              </h4>
              <p className="text-xs max-w-sm mx-auto" style={{ color: '#2E84A5' }}>
                {statusFilter !== 'all'
                  ? 'Tidak ada laporan dengan status yang dipilih.'
                  : 'Anda belum memiliki riwayat laporan pengaduan.'}
              </p>
              {statusFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className="text-xs font-bold hover:underline cursor-pointer"
                  style={{ color: '#1C6F8E' }}
                >
                  Tampilkan Semua Status
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedReports.map((item) => {
                const isWaiting = item.status === 'menunggu';
                const isProcessing = item.status === 'ditindaklanjuti' || item.status === 'diverifikasi';
                const isCompleted = item.status === 'selesai';

                const formattedTicket = item.ticket_code.startsWith('#')
                  ? item.ticket_code
                  : `#${item.ticket_code}`;

                return (
                  <div
                    key={item.id}
                    className="rounded-3xl border p-5 transition flex flex-col justify-between"
                    style={{
                      background: '#FFFFFF',
                      borderColor: '#BFEFFF',
                      boxShadow: '0 4px 16px rgba(191, 239, 255, 0.35)'
                    }}
                  >
                    <div>
                      {/* Baris Kode Tiket & Status Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="font-mono text-xs font-bold px-3 py-1 rounded-xl border"
                          style={{
                            background: '#FFFFFF',
                            color: '#1C6F8E',
                            borderColor: '#BFEFFF'
                          }}
                        >
                          {formattedTicket}
                        </span>

                        {isWaiting && (
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold border"
                            style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1C6F8E] animate-pulse" />
                            <span>Menunggu</span>
                          </span>
                        )}

                        {isProcessing && (
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold border"
                            style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#1C6F8E' }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1C6F8E] animate-pulse" />
                            <span>Ditindaklanjuti</span>
                          </span>
                        )}

                        {isCompleted && (
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold border"
                            style={{ background: '#FFFFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1C6F8E]" />
                            <span>Selesai</span>
                          </span>
                        )}
                      </div>

                      {/* Kategori Baris */}
                      <div className="flex items-center gap-2 mt-3.5">
                        {renderCategoryIcon(item.kategori_nama)}
                        <span className="text-xs font-bold truncate" style={{ color: '#1C6F8E' }}>
                          {item.kategori_nama}
                        </span>
                      </div>

                      {/* Judul Insiden */}
                      <h4
                        className="font-bold text-sm leading-snug my-2.5 line-clamp-2"
                        style={{ color: '#1C6F8E' }}
                      >
                        {item.judul || item.deskripsi}
                      </h4>

                      {/* Meta Info */}
                      <div className="space-y-1 text-xs mb-3" style={{ color: '#2E84A5' }}>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: '#2E84A5' }} />
                          <span>{item.tanggal}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {item.is_anonymous ? (
                            <>
                              <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: '#2E84A5' }} />
                              <span>Mode: Anonim (Identitas Dirahasiakan)</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5 shrink-0" style={{ color: '#2E84A5' }} />
                              <span>Mode: Identitas Terbuka</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Callout Box Status */}
                      {isWaiting && (
                        <div
                          className="p-3 rounded-2xl mt-3 flex items-start gap-2.5 text-xs border"
                          style={{
                            background: 'rgba(191, 239, 255, 0.3)',
                            borderColor: '#BFEFFF',
                            color: '#1C6F8E'
                          }}
                        >
                          <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#1C6F8E]" />
                          <span className="leading-relaxed">
                            {item.catatan_konselor || 'Sedang dalam antrean telaah oleh Koordinator Konseling Kesiswaan.'}
                          </span>
                        </div>
                      )}

                      {isProcessing && (
                        <div
                          className="p-3 rounded-2xl mt-3 flex items-start gap-2.5 text-xs border"
                          style={{
                            background: '#FFFFFF',
                            borderColor: '#BFEFFF',
                            color: '#1C6F8E'
                          }}
                        >
                          <GraduationCap className="w-4 h-4 shrink-0 mt-0.5 text-[#1C6F8E]" />
                          <div className="leading-relaxed">
                            <span className="font-bold">Konselor Pendamping: </span>
                            <span>{item.konselor_nama || 'Dra. Hj. Ratna Sari (Guru BK)'}</span>
                          </div>
                        </div>
                      )}

                      {isCompleted && (
                        <div
                          className="p-3 rounded-2xl mt-3 flex items-start gap-2.5 text-xs border"
                          style={{
                            background: '#FFFFFF',
                            borderColor: '#BFEFFF',
                            color: '#1C6F8E'
                          }}
                        >
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#1C6F8E]" />
                          <div className="leading-relaxed">
                            <span className="font-bold">Resolusi: </span>
                            <span>{item.solusi || item.catatan_konselor || 'Penanganan dan mediasi kasus telah tuntas diselesaikan.'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Footer */}
                    <Link
                      to={`/lacak?code=${item.ticket_code.replace('#', '')}&from=dashboard`}
                      className="text-xs font-bold flex items-center gap-1.5 mt-4 pt-3 border-t transition group hover:opacity-80"
                      style={{
                        color: '#1C6F8E',
                        borderColor: '#BFEFFF'
                      }}
                    >
                      <span>{isCompleted ? 'Lihat Arsip Resolusi' : 'Lihat Rincian & Percakapan'}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Banner Bantuan Darurat Segera */}
        <div
          className="rounded-3xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border"
          style={{
            background: '#FFFFFF',
            borderColor: '#BFEFFF',
            boxShadow: '0 4px 20px -2px rgba(191, 239, 255, 0.45)'
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border"
              style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
            >
              <PhoneCall className="w-6 h-6 text-[#1C6F8E]" />
            </div>
            <div>
              <h4 className="font-black text-sm md:text-base" style={{ color: '#1C6F8E' }}>
                Butuh Bantuan Darurat Segera?
              </h4>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#2E84A5' }}>
                Hubungi Satuan Tugas PPA &amp; Layanan Konseling Darurat Sekolah jika keselamatan Anda atau teman dalam situasi kritis.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
            <a
              href="tel:02177889900"
              className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition whitespace-nowrap border hover:opacity-90"
              style={{
                background: '#FFFFFF',
                color: '#1C6F8E',
                borderColor: '#BFEFFF'
              }}
            >
              <Phone className="w-4 h-4 text-[#1C6F8E]" />
              <span>(021) 7788-9900</span>
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs whitespace-nowrap border hover:opacity-90"
              style={{
                background: '#BFEFFF',
                color: '#1C6F8E',
                borderColor: '#BFEFFF'
              }}
            >
              <svg className="w-4 h-4 fill-[#1C6F8E] shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>WhatsApp Satgas PPKSP</span>
            </a>
          </div>
        </div>
      </main>

      <StudentFooter />
    </div>
  );
};

export default StudentDashboard;
