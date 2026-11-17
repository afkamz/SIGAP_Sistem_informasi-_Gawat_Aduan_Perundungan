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

  // Sticky Scroll-Driven Animation Section Ref & Direct Element Refs
  const stickyContainerRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const cardsRef = useRef([]);
  const labelsRef = useRef([]);
  const valuesRef = useRef([]);
  const badgesRef = useRef([]);
  const progressCardRef = useRef(null);
  const progressPendingRef = useRef(null);
  const progressInProgressRef = useRef(null);
  const progressCompletedRef = useRef(null);

  // Pinned Horizontal Editorial Section: Riwayat Laporan Saya
  const reportsStickyRef = useRef(null);
  const editorialTitleRef = useRef(null);
  const reportsTrackRef = useRef(null);
  const reportCardsRef = useRef([]);

  const easeCurve = 'cubic-bezier(0.16, 1, 0.3, 1)';

  // Cubic Bezier solver for cubic-bezier(0.16, 1, 0.3, 1)
  const solveCubicBezier = (p) => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    let t = p;
    for (let i = 0; i < 5; i++) {
      const currentX = 3 * (1 - t) * (1 - t) * t * 0.16 + 3 * (1 - t) * t * t * 0.3 + t * t * t;
      const currentSlope = 3 * (1 - t) * (1 - t) * 0.16 + 6 * (1 - t) * t * (0.3 - 0.16) + 3 * t * t * (1 - 0.3);
      if (Math.abs(currentSlope) < 1e-5) break;
      t -= (currentX - p) / currentSlope;
      t = Math.max(0, Math.min(1, t));
    }
    return 3 * (1 - t) * (1 - t) * t * 1.0 + 3 * (1 - t) * t * t * 1.0 + t * t * t;
  };

  const getSubProgress = (p, start, end) => {
    if (p <= start) return 0;
    if (p >= end) return 1;
    return (p - start) / (end - start);
  };

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

  const pendingPercent = totalCount > 0 ? (pendingCount / totalCount) * 100 : 0;
  const inProgressPercent = totalCount > 0 ? (inProgressCount / totalCount) * 100 : 0;
  const completedPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Data 4 Kartu Statistik Ringkasan
  const statsItems = useMemo(() => [
    {
      id: 'total',
      label: 'Total Aduan Saya',
      value: totalCount,
      suffix: 'kasus tercatat',
      icon: <Inbox className="w-5 h-5 text-[#1C6F8E]" />
    },
    {
      id: 'pending',
      label: 'Menunggu Tanggapan',
      value: pendingCount,
      suffix: 'Penelaahan',
      icon: <Clock className="w-5 h-5 text-[#1C6F8E]" />
    },
    {
      id: 'in_progress',
      label: 'Sedang Ditindak',
      value: inProgressCount,
      suffix: 'Konseling',
      icon: <RotateCw className="w-5 h-5 text-[#1C6F8E]" />
    },
    {
      id: 'completed',
      label: 'Selesai Ditangani',
      value: completedCount,
      suffix: 'Terselesaikan',
      icon: <CheckCircle2 className="w-5 h-5 text-[#1C6F8E]" />
    }
  ], [totalCount, pendingCount, inProgressCount, completedCount]);

  // Handler Sticky Scroll-Driven Animation
  useEffect(() => {
    const container = stickyContainerRef.current;
    if (!container) return;

    let rafId = null;

    const updateCard = (index, p, cStart, cEnd, vStart, vEnd, bStart, bEnd, targetValue) => {
      // 1. Container & Nama Kategori + Icon
      const pCard = solveCubicBezier(getSubProgress(p, cStart, cEnd));
      const cardEl = cardsRef.current[index];
      const labelEl = labelsRef.current[index];
      if (cardEl) {
        cardEl.style.opacity = pCard;
        cardEl.style.transform = `translateY(${(1 - pCard) * 24}px)`;
      }
      if (labelEl) {
        labelEl.style.opacity = pCard;
      }

      // 2. Angka Count-Up
      const pValRaw = getSubProgress(p, vStart, vEnd);
      const pVal = solveCubicBezier(pValRaw);
      const valEl = valuesRef.current[index];
      if (valEl) {
        valEl.style.opacity = pVal;
        valEl.style.transform = `scale(${0.85 + 0.15 * pVal})`;
        const currentCount = Math.round(targetValue * pVal);
        valEl.textContent = currentCount;
      }

      // 3. Keterangan Badge
      const pBadge = solveCubicBezier(getSubProgress(p, bStart, bEnd));
      const badgeEl = badgesRef.current[index];
      if (badgeEl) {
        badgeEl.style.opacity = pBadge;
        badgeEl.style.transform = `translateY(${(1 - pBadge) * 10}px)`;
      }
    };

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const topOffset = 64; // Tinggi header sticky (64px)
      const totalScrollable = rect.height - window.innerHeight;

      let p = 0;
      if (totalScrollable > 0) {
        p = Math.max(0, Math.min(1, (topOffset - rect.top) / totalScrollable));
      }

      // 1. Judul Section: [0.00, 0.08]
      const pTitle = solveCubicBezier(getSubProgress(p, 0.00, 0.08));
      if (titleRef.current) {
        titleRef.current.style.opacity = pTitle;
        titleRef.current.style.transform = `translateY(${(1 - pTitle) * 24}px)`;
      }

      // 2. Deskripsi Section: [0.05, 0.12]
      const pDesc = solveCubicBezier(getSubProgress(p, 0.05, 0.12));
      if (descRef.current) {
        descRef.current.style.opacity = pDesc;
        descRef.current.style.transform = `translateY(${(1 - pDesc) * 12}px)`;
      }

      // 3. Card 1: Total Aduan Saya (target = totalCount)
      updateCard(0, p, 0.12, 0.19, 0.17, 0.25, 0.23, 0.28, totalCount);

      // 4. Card 2: Menunggu Tanggapan (target = pendingCount)
      updateCard(1, p, 0.29, 0.36, 0.34, 0.42, 0.40, 0.45, pendingCount);

      // 5. Card 3: Sedang Ditindak (target = inProgressCount)
      updateCard(2, p, 0.46, 0.53, 0.51, 0.59, 0.57, 0.62, inProgressCount);

      // 6. Card 4: Selesai Ditangani (target = completedCount)
      updateCard(3, p, 0.63, 0.70, 0.68, 0.76, 0.74, 0.79, completedCount);

      // 7. Elemen Visual Progres (muncul setelah seluruh 4 card selesai): [0.81, 0.94]
      const pProgress = solveCubicBezier(getSubProgress(p, 0.81, 0.94));
      if (progressCardRef.current) {
        progressCardRef.current.style.opacity = pProgress;
        progressCardRef.current.style.transform = `translateY(${(1 - pProgress) * 20}px)`;
      }
      if (progressPendingRef.current) {
        progressPendingRef.current.style.width = `${pendingPercent * pProgress}%`;
      }
      if (progressInProgressRef.current) {
        progressInProgressRef.current.style.width = `${inProgressPercent * pProgress}%`;
      }
      if (progressCompletedRef.current) {
        progressCompletedRef.current.style.width = `${completedPercent * pProgress}%`;
      }
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Inisialisasi posisi frame saat pertama kali render
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [totalCount, pendingCount, inProgressCount, completedCount, pendingPercent, inProgressPercent, completedPercent]);

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

  // Handler Sticky Scroll-Driven Horizontal Reveal: Riwayat Laporan Saya
  useEffect(() => {
    const container = reportsStickyRef.current;
    if (!container) return;

    let rafId = null;

    const handleReportsScroll = () => {
      const rect = container.getBoundingClientRect();
      const topOffset = 64; // Header sticky offset
      const totalScrollable = rect.height - window.innerHeight;

      let p = 0;
      if (totalScrollable > 0) {
        p = Math.max(0, Math.min(1, (topOffset - rect.top) / totalScrollable));
      }

      // 1. Oversized Editorial Typography:
      // At p = 0: opacity 1.0, scale 1.0
      // Fades to soft watermark background (opacity 0.12, scale 0.94)
      const pTitle = getSubProgress(p, 0.00, 0.28);
      const titleOpacity = 1.0 - (0.88 * solveCubicBezier(pTitle));
      const titleScale = 1.0 - (0.06 * solveCubicBezier(pTitle));
      if (editorialTitleRef.current) {
        editorialTitleRef.current.style.opacity = titleOpacity;
        editorialTitleRef.current.style.transform = `scale(${titleScale}) translate3d(0, 0, 0)`;
      }

      // 2. Horizontal Cards Track Translation:
      const track = reportsTrackRef.current;
      if (track) {
        const vw = window.innerWidth;
        const trackWidth = track.scrollWidth;
        const padding = vw < 640 ? 24 : 48;

        // End position:
        let endX = padding;
        if (trackWidth + padding * 2 <= vw) {
          endX = Math.round((vw - trackWidth) / 2);
        } else {
          endX = vw - trackWidth - padding;
        }

        const startX = vw + 60; // Initial state: entirely hidden offscreen right

        const pTrackNorm = getSubProgress(p, 0.05, 0.95);
        const pTrack = solveCubicBezier(pTrackNorm);

        const currentX = startX + (endX - startX) * pTrack;
        const trackOpacity = solveCubicBezier(getSubProgress(p, 0.03, 0.15));

        track.style.opacity = trackOpacity;
        track.style.transform = `translate3d(${currentX}px, 0, 0)`;

        // 3. Staggered Card Animation
        const cards = reportCardsRef.current;
        const numCards = cards.length;
        if (numCards > 0) {
          cards.forEach((cardEl, idx) => {
            if (!cardEl) return;
            const cardStart = (idx / (numCards + 1)) * 0.35;
            const cardEnd = Math.min(1, cardStart + 0.45);
            const pCard = solveCubicBezier(getSubProgress(pTrackNorm, cardStart, cardEnd));
            cardEl.style.opacity = 0.35 + 0.65 * pCard;
            cardEl.style.transform = `scale(${0.92 + 0.08 * pCard}) translate3d(0, 0, 0)`;
          });
        }
      }
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleReportsScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial frame
    handleReportsScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [displayedReports.length]);

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
            const el = stickyContainerRef.current;
            if (el) {
              const top = el.getBoundingClientRect().top + window.scrollY - 64;
              window.scrollTo({ top, behavior: 'smooth' });
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

      {/* ─── Sticky Scroll Section: Status Penanganan Aduan Anda ─── */}
      <section
        id="student-stats-section"
        ref={stickyContainerRef}
        className="relative w-full z-10"
        style={{ height: '240vh' }}
      >
        <div className="sticky top-16 w-full min-h-[calc(100vh-4rem)] min-h-[calc(100dvh-4rem)] flex flex-col justify-start pt-4 sm:pt-8 md:pt-10 pb-6 sm:pb-12">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-7">
            
            {/* Header Ringkasan Statistik */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#BFEFFF]">
              <div className="space-y-1.5">
                <h2
                  ref={titleRef}
                  className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight"
                  style={{
                    color: '#1C6F8E',
                    opacity: 0,
                    transform: 'translateY(24px)',
                    willChange: 'opacity, transform'
                  }}
                >
                  Status Penanganan Aduan Anda
                </h2>
                <p
                  className="text-xs sm:text-sm font-semibold"
                  style={{ color: '#2E84A5' }}
                >
                  Pantau perkembangan seluruh aduan yang telah Anda sampaikan melalui SIGAP.
                </p>
              </div>

              <div
                ref={descRef}
                className="flex items-center gap-2 text-xs font-semibold text-[#2E84A5] self-start md:self-end pb-1"
                style={{
                  opacity: 0,
                  transform: 'translateY(12px)',
                  willChange: 'opacity, transform'
                }}
              >
                <CheckCircle2 className="w-4 h-4 text-[#1C6F8E] shrink-0" />
                <span>Statistik lengkap. Anda dapat menggulir ke bawah.</span>
              </div>
            </div>

            {/* Grid 4 Kartu Statistik (2 Kolom di Mobile, 4 Kolom di Desktop) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {statsItems.map((item, idx) => (
                <div
                  key={item.id}
                  ref={(el) => (cardsRef.current[idx] = el)}
                  className="p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border flex flex-col justify-between relative overflow-hidden transition-shadow duration-300 hover:shadow-md min-h-[140px] sm:min-h-[175px]"
                  style={{
                    background: '#FFFFFF',
                    borderColor: '#BFEFFF',
                    boxShadow: '0 4px 18px rgba(191, 239, 255, 0.40)',
                    opacity: 0,
                    transform: 'translateY(24px)',
                    willChange: 'opacity, transform'
                  }}
                >
                  {/* Bagian Atas Card: Icon & Nama Kategori Sejajar */}
                  <div
                    ref={(el) => (labelsRef.current[idx] = el)}
                    className="flex items-center gap-2.5 sm:gap-3.5"
                    style={{ opacity: 0, willChange: 'opacity' }}
                  >
                    <div
                      className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border"
                      style={{
                        background: '#BFEFFF',
                        borderColor: '#BFEFFF',
                        color: '#1C6F8E'
                      }}
                    >
                      {item.icon}
                    </div>
                    <span className="text-xs sm:text-base font-extrabold tracking-tight leading-tight" style={{ color: '#1C6F8E' }}>
                      {item.label}
                    </span>
                  </div>

                  {/* Bagian Bawah Card: Angka & Keterangan Status */}
                  <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-3">
                    <span
                      ref={(el) => (valuesRef.current[idx] = el)}
                      className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none tabular-nums"
                      style={{ color: '#1C6F8E', opacity: 0, transform: 'scale(0.85)', willChange: 'opacity, transform' }}
                    >
                      0
                    </span>
                    <span
                      ref={(el) => (badgesRef.current[idx] = el)}
                      className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold border shrink-0 w-fit"
                      style={{
                        background: '#FFFFFF',
                        color: '#1C6F8E',
                        borderColor: '#BFEFFF',
                        opacity: 0,
                        transform: 'translateY(10px)',
                        willChange: 'opacity, transform'
                      }}
                    >
                      {item.suffix}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Elemen Visual Pendukung: Garis Progres Distribusi Status Aduan */}
            <div
              ref={progressCardRef}
              className="p-5 sm:p-6 rounded-3xl border shadow-xs"
              style={{
                background: '#FFFFFF',
                borderColor: '#BFEFFF',
                boxShadow: '0 4px 18px rgba(191, 239, 255, 0.35)',
                opacity: 0,
                transform: 'translateY(20px)',
                willChange: 'opacity, transform'
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1C6F8E]" />
                  <span className="text-xs sm:text-sm font-extrabold tracking-tight" style={{ color: '#1C6F8E' }}>
                    Ringkasan perkembangan aduan Anda
                  </span>
                </div>
                <span className="text-xs font-bold" style={{ color: '#2E84A5' }}>
                  {totalCount > 0 ? `${totalCount} Kasus Tercatat` : '0 Kasus Tercatat'}
                </span>
              </div>

              {/* Garis Progres Horizontal Solid */}
              <div
                className="w-full h-3.5 rounded-full overflow-hidden flex border"
                style={{
                  background: '#F0FAFD',
                  borderColor: '#BFEFFF'
                }}
              >
                {totalCount > 0 ? (
                  <>
                    <div
                      ref={progressPendingRef}
                      className="h-full transition-all duration-300"
                      style={{
                        width: '0%',
                        background: '#7AD4F8',
                        borderRight: (inProgressCount > 0 || completedCount > 0) ? '1.5px solid #FFFFFF' : 'none'
                      }}
                      title={`Menunggu Tanggapan: ${pendingCount} (${Math.round(pendingPercent)}%)`}
                    />
                    <div
                      ref={progressInProgressRef}
                      className="h-full transition-all duration-300"
                      style={{
                        width: '0%',
                        background: '#2E84A5',
                        borderRight: completedCount > 0 ? '1.5px solid #FFFFFF' : 'none'
                      }}
                      title={`Sedang Ditindak: ${inProgressCount} (${Math.round(inProgressPercent)}%)`}
                    />
                    <div
                      ref={progressCompletedRef}
                      className="h-full transition-all duration-300"
                      style={{
                        width: '0%',
                        background: '#1C6F8E'
                      }}
                      title={`Selesai Ditangani: ${completedCount} (${Math.round(completedPercent)}%)`}
                    />
                  </>
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-[11px] font-bold"
                    style={{ color: '#2E84A5', background: '#F0FAFD' }}
                  >
                    Belum ada riwayat aduan yang tercatat
                  </div>
                )}
              </div>

              {/* Legend 4 Kategori Status */}
              <div className="mt-4 pt-3 border-t border-[#BFEFFF]/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full border shrink-0" style={{ borderColor: '#1C6F8E', background: '#FFFFFF' }} />
                  <span className="font-semibold text-[#2E84A5] truncate">Total Aduan:</span>
                  <span className="font-extrabold text-[#1C6F8E]">{totalCount}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#7AD4F8' }} />
                  <span className="font-semibold text-[#2E84A5] truncate">Menunggu:</span>
                  <span className="font-extrabold text-[#1C6F8E]">
                    {pendingCount}
                    {totalCount > 0 && <span className="font-normal text-[11px] ml-1">({Math.round(pendingPercent)}%)</span>}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#2E84A5' }} />
                  <span className="font-semibold text-[#2E84A5] truncate">Ditindak:</span>
                  <span className="font-extrabold text-[#1C6F8E]">
                    {inProgressCount}
                    {totalCount > 0 && <span className="font-normal text-[11px] ml-1">({Math.round(inProgressPercent)}%)</span>}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#1C6F8E' }} />
                  <span className="font-semibold text-[#2E84A5] truncate">Selesai:</span>
                  <span className="font-extrabold text-[#1C6F8E]">
                    {completedCount}
                    {totalCount > 0 && <span className="font-normal text-[11px] ml-1">({Math.round(completedPercent)}%)</span>}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Pinned Horizontal Editorial Section: Riwayat Laporan Saya ─── */}
      <section
        id="student-reports-section"
        ref={reportsStickyRef}
        className="relative w-full z-20"
        style={{ height: '260vh' }}
      >
        <div
          className="sticky top-16 w-full h-[calc(100vh-4rem)] h-[calc(100dvh-4rem)] flex flex-col justify-center overflow-hidden relative"
          style={{ background: '#FFFFFF' }}
        >
          {/* Top Bar Floating Controls: Header Badge, Filter, and Sort */}
          <div className="absolute top-4 sm:top-6 inset-x-0 z-30 px-4 sm:px-8 max-w-7xl w-full mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 pointer-events-auto">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1C6F8E] animate-pulse" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1C6F8E]">
                Riwayat Laporan Saya
              </span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Dropdown Filter Status */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none rounded-xl px-3.5 py-1.5 sm:py-2 pr-8 text-xs font-semibold focus:outline-none cursor-pointer border shadow-xs"
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
                className="rounded-xl px-3.5 py-1.5 sm:py-2 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition border hover:opacity-90 shadow-xs"
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

          {/* 1. INITIAL STATE — OVERSIZED EDITORIAL TYPOGRAPHY */}
          <div
            ref={editorialTitleRef}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none px-4 sm:px-6 text-center z-0 will-change-transform"
            style={{ opacity: 1, willChange: 'opacity, transform' }}
          >
            <div className="space-y-1 sm:space-y-2 max-w-5xl">
              <span className="text-[11px] sm:text-xs md:text-sm font-black tracking-[0.25em] uppercase text-[#2E84A5] block">
                Arsip &amp; Dokumentasi Perlindungan Siswa
              </span>
              <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.88] text-[#1C6F8E]">
                <span className="block">
                  RI<span className="font-serif italic font-normal text-[#2E84A5]">W</span>AYAT
                </span>
                <span className="block mt-1 sm:mt-2">
                  LAPO<span className="font-serif italic font-normal text-[#2E84A5]">R</span>AN <span className="text-[#142B4A]">SAYA</span>
                </span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-[#2E84A5] max-w-xl mx-auto pt-2 sm:pt-4 flex items-center justify-center gap-2">
                <span>Gulir ke bawah untuk menelusuri kartu laporan</span>
                <ArrowRight className="w-4 h-4 text-[#1C6F8E] animate-pulse" />
              </p>
            </div>
          </div>

          {/* 2. HORIZONTAL CARD REVEAL TRACK (Glide in from offscreen right) */}
          <div className="relative z-10 w-full overflow-visible pointer-events-auto py-4">
            {displayedReports.length === 0 ? (
              <div
                ref={reportsTrackRef}
                className="max-w-md mx-auto rounded-3xl border p-8 sm:p-10 text-center space-y-3 bg-white shadow-lg will-change-transform"
                style={{
                  borderColor: '#BFEFFF',
                  transform: 'translate3d(100vw, 0, 0)',
                  opacity: 0
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto border"
                  style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
                >
                  <FileText className="w-6 h-6 text-[#1C6F8E]" />
                </div>
                <h4 className="text-base font-bold" style={{ color: '#1C6F8E' }}>
                  Tidak Ada Laporan Ditemukan
                </h4>
                <p className="text-xs text-[#2E84A5]">
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
              <div
                ref={reportsTrackRef}
                className="flex items-center gap-5 sm:gap-6 flex-nowrap will-change-transform w-fit select-none"
                style={{
                  transform: 'translate3d(100vw, 0, 0)',
                  opacity: 0
                }}
              >
                {displayedReports.map((item, idx) => {
                  const isWaiting = item.status === 'menunggu';
                  const isProcessing = item.status === 'ditindaklanjuti' || item.status === 'diverifikasi';
                  const isCompleted = item.status === 'selesai';

                  const formattedTicket = item.ticket_code.startsWith('#')
                    ? item.ticket_code
                    : `#${item.ticket_code}`;

                  return (
                    <div
                      key={item.id}
                      ref={(el) => (reportCardsRef.current[idx] = el)}
                      className="w-[300px] sm:w-[360px] md:w-[400px] shrink-0 h-[440px] sm:h-[470px] rounded-3xl border p-5 sm:p-6 flex flex-col justify-between relative shadow-[0_8px_30px_rgba(191,239,255,0.45)] hover:shadow-xl transition-shadow duration-300 will-change-transform bg-white text-left"
                      style={{
                        borderColor: '#BFEFFF'
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
                        className="text-xs font-bold flex items-center gap-1.5 mt-4 pt-3 border-t transition group hover:opacity-80 cursor-pointer"
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
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative z-20">

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
