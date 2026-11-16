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

  // Sequential Animated Stats with Scroll Lock
  const statsSectionRef = useRef(null);
  const [statsAnimStep, setStatsAnimStep] = useState(0); // 0 to 8 (9 = selesai)
  const [isStatsAnimDone, setIsStatsAnimDone] = useState(false);
  const isStatsAnimatingRef = useRef(false);
  const animStartedRef = useRef(false);
  const timersRef = useRef([]);

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

  // Fungsi pemanggil animasi berurutan 4 kartu statistik + Scroll-Lock sementara
  const startStatsAnimation = () => {
    if (animStartedRef.current) return;
    animStartedRef.current = true;
    isStatsAnimatingRef.current = true;

    // Kunci scroll pengguna sementara selama seluruh sequence animasi berlangsung
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const preventScroll = (e) => {
      e.preventDefault();
    };

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });

    // 8 Urutan Langkah Animasi (Header Kartu lalu Angka & Badge)
    const delays = [
      120,   // Step 1: Card 1 Header ("Total Aduan Saya" + icon)
      500,   // Step 2: Card 1 Value ("2" + "kasus tercatat")
      880,   // Step 3: Card 2 Header ("Menunggu Tanggapan" + icon)
      1260,  // Step 4: Card 2 Value ("2" + "Penelaahan")
      1640,  // Step 5: Card 3 Header ("Sedang Ditindak" + icon)
      2020,  // Step 6: Card 3 Value ("0" + "Konseling")
      2400,  // Step 7: Card 4 Header ("Selesai Ditangani" + icon)
      2780   // Step 8: Card 4 Value ("0" + "Terselesaikan")
    ];

    delays.forEach((delay, idx) => {
      const t = setTimeout(() => {
        setStatsAnimStep(idx + 1);
      }, delay);
      timersRef.current.push(t);
    });

    // Selesai seluruh sequence pada ~3100ms -> Buka kunci scroll kembali
    const finishTimer = setTimeout(() => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      setIsStatsAnimDone(true);
      setStatsAnimStep(9);
      isStatsAnimatingRef.current = false;
    }, 3100);

    timersRef.current.push(finishTimer);
  };

  // Observer untuk mendeteksi saat pengguna scroll ke area statistik
  useEffect(() => {
    const el = statsSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animStartedRef.current) {
          startStatsAnimation();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    // Initial check jika pengguna membuka halaman langsung pada area statistik
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0 && !animStartedRef.current) {
      startStatsAnimation();
    }

    return () => {
      observer.disconnect();
      timersRef.current.forEach(clearTimeout);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
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

  // Data 4 Kartu Statistik dengan Konfigurasi Sequential Reveal & Styling Ultra-Modern
  const statsItems = useMemo(() => [
    {
      id: 'total',
      label: 'Total Aduan Saya',
      value: totalCount,
      suffix: 'kasus tercatat',
      icon: <Inbox className="w-5 h-5 text-[#1C6F8E]" />,
      accentColor: '#1C6F8E',
      accentBg: '#EBF7FC',
      accentBorder: '#BFEFFF',
      cardShadow: '0 10px 25px -4px rgba(28, 111, 142, 0.16)',
      badgeBg: '#F0F9FF',
      badgeColor: '#0369A1',
      badgeBorder: '#BAE6FD',
      labelStep: 1,
      valueStep: 2
    },
    {
      id: 'pending',
      label: 'Menunggu Tanggapan',
      value: pendingCount,
      suffix: 'Penelaahan',
      icon: <Clock className="w-5 h-5 text-[#D97706]" />,
      accentColor: '#F59E0B',
      accentBg: '#FEF3C7',
      accentBorder: '#FDE68A',
      cardShadow: '0 10px 25px -4px rgba(217, 119, 6, 0.16)',
      badgeBg: '#FEF3C7',
      badgeColor: '#B45309',
      badgeBorder: '#FDE68A',
      labelStep: 3,
      valueStep: 4
    },
    {
      id: 'in_progress',
      label: 'Sedang Ditindak',
      value: inProgressCount,
      suffix: 'Konseling',
      icon: <RotateCw className="w-5 h-5 text-[#0284C7]" />,
      accentColor: '#0284C7',
      accentBg: '#E0F2FE',
      accentBorder: '#BAE6FD',
      cardShadow: '0 10px 25px -4px rgba(2, 132, 199, 0.16)',
      badgeBg: '#E0F2FE',
      badgeColor: '#0284C7',
      badgeBorder: '#BAE6FD',
      labelStep: 5,
      valueStep: 6
    },
    {
      id: 'completed',
      label: 'Selesai Ditangani',
      value: completedCount,
      suffix: 'Terselesaikan',
      icon: <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />,
      accentColor: '#10B981',
      accentBg: '#DCFCE7',
      accentBorder: '#A7F3D0',
      cardShadow: '0 10px 25px -4px rgba(16, 185, 129, 0.16)',
      badgeBg: '#DCFCE7',
      badgeColor: '#15803D',
      badgeBorder: '#A7F3D0',
      labelStep: 7,
      valueStep: 8
    }
  ], [totalCount, pendingCount, inProgressCount, completedCount]);

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

      {/* ─── Hero Section Siswa Full-Screen dengan Background Video & Degradasi Halus ─── */}
      <section
        ref={heroRef}
        className="relative w-full min-h-[calc(100vh-4rem)] min-h-[calc(100dvh-4rem)] flex flex-col justify-between items-center overflow-hidden z-0 text-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16"
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
            backgroundColor: 'rgba(255, 255, 255, 0.38)',
            zIndex: 1
          }}
          aria-hidden="true"
        />

        {/* Bottom Seamless Gradient Fade (Degradasi Halus Menyatu ke Web Bawahnya, Menghilangkan Garis Polosan) */}
        <div
          className="absolute inset-x-0 bottom-0 h-36 sm:h-48 lg:h-64 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.40) 35%, rgba(255, 255, 255, 0.85) 75%, #FFFFFF 100%)',
            zIndex: 2
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

        {/* Petunjuk Gulir ke Bawah (Interaktif Klik untuk Scroll Turun) */}
        <button
          type="button"
          onClick={() => {
            const el = statsSectionRef.current;
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
              if (!animStartedRef.current) {
                setTimeout(() => {
                  startStatsAnimation();
                }, 400);
              }
            }
          }}
          className="relative z-10 pb-3 flex flex-col items-center gap-1 cursor-pointer group hover:scale-105 transition-all duration-300 select-none"
          style={{
            opacity: isHeroInView ? 0.95 : 0,
            transition: `opacity 600ms ${easeCurve} 900ms`
          }}
          aria-label="Gulir ke bawah untuk melihat riwayat aduan"
        >
          <span
            className="text-[11px] font-bold tracking-wider uppercase transition-transform group-hover:translate-y-0.5"
            style={{ color: '#1C6F8E' }}
          >
            Gulir ke bawah untuk melihat riwayat aduan
          </span>
          <ChevronDown className="w-4 h-4 text-[#1C6F8E] animate-bounce" />
        </button>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative z-20">

        {/* ── 4 Kartu Statistik Ringkasan dengan Animasi Sequential Reveal & Scroll-Lock ── */}
        <div id="student-stats-section" ref={statsSectionRef} className="space-y-4">
          {/* Header Ringkasan Statistik */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-[#BFEFFF]/60">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold" style={{ color: '#2E84A5' }}>
                <span className="w-2 h-2 rounded-full bg-[#1C6F8E] animate-pulse" />
                <span>Ringkasan Statistik Siswa</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5" style={{ color: '#1C6F8E' }}>
                Status Penanganan Aduan Anda
              </h2>
            </div>
            
            {/* Indikator Status Animasi & Scroll Lock */}
            {!isStatsAnimDone && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border animate-pulse shadow-xs" style={{ background: '#FFFBEB', color: '#B45309', borderColor: '#FDE68A' }}>
                <Lock className="w-3.5 h-3.5" />
                <span>Menampilkan statistik... (Gulir ke bawah terkunci sementara)</span>
              </span>
            )}
            {isStatsAnimDone && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border shadow-xs transition-opacity duration-500" style={{ background: '#ECFDF5', color: '#047857', borderColor: '#A7F3D0' }}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Statistik lengkap. Anda dapat menggulir ke bawah.</span>
              </span>
            )}
          </div>

          {/* Grid 4 Kartu Statistik (Ultra Modern & Sequential Reveal) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {statsItems.map((item) => {
              const showHeader = isStatsAnimDone || statsAnimStep >= item.labelStep;
              const showValue = isStatsAnimDone || statsAnimStep >= item.valueStep;

              return (
                <div
                  key={item.id}
                  className="p-5 sm:p-6 rounded-3xl border flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-lg group"
                  style={{
                    background: '#FFFFFF',
                    borderColor: showHeader ? item.accentBorder : '#E2E8F0',
                    boxShadow: showHeader ? item.cardShadow : '0 2px 8px rgba(0, 0, 0, 0.04)',
                    opacity: showHeader ? 1 : 0,
                    transform: showHeader ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.95)',
                    transition: `opacity 400ms ${easeCurve}, transform 400ms ${easeCurve}, border-color 300ms ease, box-shadow 300ms ease`
                  }}
                >
                  {/* Top Accent Strip */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{
                      background: item.accentColor,
                      opacity: showHeader ? 1 : 0,
                      transition: `opacity 300ms ease`
                    }}
                  />

                  {/* Bagian Atas Card: Label Judul & Icon (Muncul Tahap 1) */}
                  <div
                    className="flex items-center justify-between"
                    style={{
                      opacity: showHeader ? 1 : 0,
                      transform: showHeader ? 'translateY(0)' : 'translateY(12px)',
                      transition: `opacity 350ms ${easeCurve} 40ms, transform 350ms ${easeCurve} 40ms`
                    }}
                  >
                    <span className="text-xs sm:text-sm font-extrabold tracking-tight" style={{ color: '#1C6F8E' }}>
                      {item.label}
                    </span>
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs transition-transform duration-300 group-hover:scale-105"
                      style={{
                        background: item.accentBg,
                        borderColor: item.accentBorder
                      }}
                    >
                      {item.icon}
                    </div>
                  </div>

                  {/* Bagian Bawah Card: Angka & Badge Keterangan (Muncul Tahap 2 Setelah Label) */}
                  <div
                    className="mt-6 flex items-baseline justify-between gap-2"
                    style={{
                      opacity: showValue ? 1 : 0,
                      transform: showValue ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.80)',
                      transition: `opacity 450ms cubic-bezier(0.34, 1.56, 0.64, 1), transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1)`
                    }}
                  >
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none" style={{ color: '#1C6F8E' }}>
                      {item.value}
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold border shadow-xs"
                      style={{
                        background: item.badgeBg,
                        color: item.badgeColor,
                        borderColor: item.badgeBorder
                      }}
                    >
                      {item.suffix}
                    </span>
                  </div>
                </div>
              );
            })}
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
