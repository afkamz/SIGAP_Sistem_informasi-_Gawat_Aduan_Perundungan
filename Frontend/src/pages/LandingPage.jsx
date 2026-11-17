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
  FileText,
  HeartHandshake,
  LogIn,
  X,
  UserPlus,
  Compass,
  ArrowUpRight,
  Menu,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { LandingFooter } from '../components/layout/LandingFooter';
import { KATEGORI_DATA } from '../data/categories';
import { InteractivePhotoCube } from '../components/3d/InteractivePhotoCube';
import { BackgroundMediaBackdrop } from '../components/3d/BackgroundMediaBackdrop';
import { CinematicCategoriesShowcase } from '../components/3d/CinematicCategoriesShowcase';
import { AboutEditorialShowcase } from '../components/landing/AboutEditorialShowcase';

const NAV_ITEMS = [
  { id: 'about', label: 'TENTANG', type: 'section' },
  { id: 'categories', label: '7 KATEGORI', type: 'section' },
  { id: 'how-it-works', label: 'ALUR PENANGANAN', type: 'section' },
  { id: 'buat-laporan', label: 'BUAT LAPORAN', type: 'action', hasArrow: true },
  { id: 'safety', label: 'KEAMANAN', type: 'section' },
  { id: 'faq', label: 'FAQ', type: 'section' },
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useStore();
  const [activeFaq, setActiveFaq] = useState(null);
  const [quickTicketCode, setQuickTicketCode] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [targetRedirect, setTargetRedirect] = useState('/buat-laporan');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ─── Editorial Sliding Pill Capsule Navigation (Ref: SMTOWN Style) ───
  const [hoveredNav, setHoveredNav] = useState(null);
  const [activeNav, setActiveNav] = useState('about');
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navContainerRef = useRef(null);
  const navItemRefs = useRef({});

  const updatePill = (id) => {
    const el = navItemRefs.current[id];
    const container = navContainerRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setPillStyle({
        left: elRect.left - containerRect.left,
        width: elRect.width,
        opacity: 1,
      });
    }
  };

  const handleNavMouseEnter = (id) => {
    setHoveredNav(id);
    updatePill(id);
  };

  const handleNavMouseLeave = () => {
    setHoveredNav(null);
    if (activeNav && navItemRefs.current[activeNav]) {
      updatePill(activeNav);
    } else {
      setPillStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  useEffect(() => {
    // Inisialisasi posisi pill pada item pertama (TENTANG)
    const timer = setTimeout(() => {
      if (activeNav && navItemRefs.current[activeNav]) {
        updatePill(activeNav);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (hoveredNav) updatePill(hoveredNav);
      else if (activeNav) updatePill(activeNav);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hoveredNav, activeNav]);

  useEffect(() => {
    const sections = ['about', 'categories', 'how-it-works', 'safety', 'faq'];
    let ticking = false;
    let cachedTops = [];

    const cacheSectionTops = () => {
      cachedTops = sections
        .map((id) => {
          const el = document.getElementById(id);
          return el ? { id, top: el.offsetTop } : null;
        })
        .filter(Boolean);
    };

    cacheSectionTops();
    window.addEventListener('resize', cacheSectionTops, { passive: true });

    const handleScrollNav = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollPos = window.scrollY + 200;
        let found = 'about';
        for (let i = cachedTops.length - 1; i >= 0; i--) {
          if (cachedTops[i].top <= scrollPos) {
            found = cachedTops[i].id;
            break;
          }
        }
        setActiveNav((prev) => (prev !== found ? found : prev));
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScrollNav, { passive: true });
    handleScrollNav();
    return () => {
      window.removeEventListener('scroll', handleScrollNav);
      window.removeEventListener('resize', cacheSectionTops);
    };
  }, []);

  useEffect(() => {
    if (!hoveredNav) {
      if (activeNav && navItemRefs.current[activeNav]) {
        updatePill(activeNav);
      } else {
        setPillStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    }
  }, [activeNav, hoveredNav]);

  // ─── Zero-Lag DOM-Driven Cinematic Stage Tracker (Scene 01 -> Scene 05) ───
  const scrollStageRef = useRef(null);
  const heroContentRef = useRef(null);
  const transitionBridgeRef = useRef(null);
  const backdropLayerRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    let stageTop = 0;
    let stageScrollable = 0;
    let isHeroVisible = true;

    const updateStageMetrics = () => {
      if (!scrollStageRef.current) return;
      const rect = scrollStageRef.current.getBoundingClientRect();
      stageTop = window.scrollY + rect.top;
      stageScrollable = rect.height - window.innerHeight;
    };
    updateStageMetrics();
    window.addEventListener('resize', updateStageMetrics, { passive: true });

    let observer = null;
    if (typeof IntersectionObserver !== 'undefined' && scrollStageRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          isHeroVisible = entries[0].isIntersecting;
        },
        { rootMargin: '100px 0px' }
      );
      observer.observe(scrollStageRef.current);
    }

    const updateScroll = () => {
      ticking = false;
      if (!isHeroVisible || stageScrollable <= 0) return;

      const scrolled = window.scrollY - stageTop;
      const progress = Math.max(0, Math.min(1, scrolled / stageScrollable));

      if (heroContentRef.current) {
        const heroOpacity = Math.max(0, Math.min(1, 1 - (progress - 0.15) / 0.18));
        const heroY = Math.max(0, progress - 0.12) * 80;
        heroContentRef.current.style.opacity = heroOpacity.toFixed(3);
        heroContentRef.current.style.transform = `translate3d(0, -${heroY.toFixed(1)}px, 0)`;
        heroContentRef.current.style.pointerEvents = progress > 0.28 ? 'none' : 'auto';
      }

      if (transitionBridgeRef.current) {
        const bridgeOpacity = Math.max(0, Math.min(1, (progress - 0.85) * 8.0));
        const bridgeY = Math.max(0, (1 - progress) * 45);
        transitionBridgeRef.current.style.opacity = bridgeOpacity.toFixed(3);
        transitionBridgeRef.current.style.transform = `translate3d(0, ${bridgeY.toFixed(1)}px, 0)`;
      }

      if (backdropLayerRef.current) {
        const bScale = (1 + progress * 0.08).toFixed(3);
        const bOpacity = Math.max(0.2, 0.65 * (1 - progress * 0.35)).toFixed(2);
        backdropLayerRef.current.style.transform = `scale(${bScale})`;
        backdropLayerRef.current.style.opacity = bOpacity;
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateStageMetrics);
      if (observer) observer.disconnect();
    };
  }, []);

  const isAdmin = currentUser?.role === 'admin';
  const profilePath = isAdmin ? '/admin/dashboard' : '/dashboard';

  // ─── FAQ Scroll-Driven Zoom-In Card Reveal Tracker ───
  const faqTrackRef = useRef(null);
  const faqCardsRef = useRef([]);
  const faqAnswersRef = useRef([]);

  useEffect(() => {
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const applyProgress = (progress) => {
      for (let i = 0; i < 6; i++) {
        const cardEl = faqCardsRef.current[i];
        const ansEl = faqAnswersRef.current[i];
        if (!cardEl || !ansEl) continue;

        // Slot progres masing-masing kartu:
        // Setiap card zoom-in selama window 0.12, disusul kemunculan jawaban
        const cardStart = 0.02 + i * 0.13;
        const cardEnd = cardStart + 0.12;
        const ansStart = cardStart + 0.08;
        const ansEnd = ansStart + 0.08;

        // 1. Zoom-in dan Gerakan Naik Card
        let cardT = 0;
        if (progress >= cardEnd) {
          cardT = 1;
        } else if (progress > cardStart) {
          cardT = (progress - cardStart) / (cardEnd - cardStart);
        }
        const cardEased = easeOutCubic(cardT);
        const cardScale = 0.65 + 0.35 * cardEased;
        const cardOpacity = cardEased;
        const cardY = (1 - cardEased) * 45;

        cardEl.style.opacity = cardOpacity.toFixed(3);
        cardEl.style.transform = `scale(${cardScale.toFixed(3)}) translateY(${cardY.toFixed(1)}px)`;

        // 2. Kemunculan Jawaban (Fade-in & Slide Up)
        let ansT = 0;
        if (progress >= ansEnd) {
          ansT = 1;
        } else if (progress > ansStart) {
          ansT = (progress - ansStart) / (ansEnd - ansStart);
        }
        const ansEased = easeOutCubic(ansT);
        const ansOpacity = ansEased;
        const ansY = (1 - ansEased) * 10;

        ansEl.style.opacity = ansOpacity.toFixed(3);
        ansEl.style.transform = `translateY(${ansY.toFixed(1)}px)`;
      }
    };

    let isFaqVisible = true;
    let observer = null;
    if (typeof IntersectionObserver !== 'undefined' && faqTrackRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          isFaqVisible = entries[0].isIntersecting;
          if (isFaqVisible) updateFaqScroll();
        },
        { rootMargin: '120px 0px' }
      );
      observer.observe(faqTrackRef.current);
    }

    const updateFaqScroll = () => {
      if (!isFaqVisible) return;
      const track = faqTrackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollableDistance = rect.height - windowHeight;

      if (scrollableDistance <= 0) return;

      // Saat pengguna berada di atas FAQ (belum masuk)
      if (rect.top >= windowHeight) {
        applyProgress(0);
        return;
      }

      // Saat pengguna sudah melewati FAQ ke bawah
      if (rect.bottom <= windowHeight) {
        applyProgress(1);
        return;
      }

      // Progres murni scroll di dalam lintasan sticky FAQ (0.0 s.d. 1.0)
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      applyProgress(progress);
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking && isFaqVisible) {
        window.requestAnimationFrame(() => {
          updateFaqScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateFaqScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (observer) observer.disconnect();
    };
  }, []);

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
    const element = document.getElementById(sectionId) || (sectionId === 'about' && document.getElementById('mission'));
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

  return (
    <div
      className="min-h-screen flex flex-col text-[#1C6F8E] font-sans relative"
      style={{ background: '#FFFFFF', overflow: 'visible' }}
    >

      {/* ─── FIXED GLOBAL HEADER ─── */}
      <header className="fixed top-0 inset-x-0 z-50 w-full pointer-events-auto">
        {/* ─── NAVIGATION BAR — Baby Blue & White Theme ─── */}
        <nav className="border-b" style={{ background: '#FFFFFF', borderColor: '#BFEFFF' }}>
          <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
            {/* Brand Logo & Emblem — Mentok ke kiri */}
            <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group py-1 flex-shrink-0 z-10" aria-label="Beranda SIGAP">
              <img
                src="/assets/branding/logo-sigap.png"
                alt="Logo SIGAP"
                className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <img
                src="/assets/branding/branding-sigap.png"
                alt="SIGAP"
                className="h-7 sm:h-8 w-auto max-w-[120px] sm:max-w-[150px] object-contain transition-transform duration-200 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Link>

            {/* ─── CENTER NAVIGATION BAR (EDITORIAL SLIDING PILL CAPSULE) ─── */}
            <div
              ref={navContainerRef}
              onMouseLeave={handleNavMouseLeave}
              className="hidden lg:flex items-center gap-3 xl:gap-6 text-[12px] xl:text-[13px] font-semibold tracking-wider select-none whitespace-nowrap absolute left-1/2 -translate-x-1/2 z-10 py-1"
            >
              {/* Sliding Pill Capsule Outline — Sesuai Gambar Referensi (Pure Stroke Capsule) */}
              <span
                className="absolute top-1/2 -translate-y-1/2 h-[34px] rounded-full border-[1.5px] border-black bg-transparent pointer-events-none transition-all duration-300 ease-out"
                style={{
                  transform: `translateX(${pillStyle.left}px) translateY(-50%)`,
                  left: 0,
                  width: `${pillStyle.width}px`,
                  opacity: pillStyle.opacity,
                }}
              />

              {NAV_ITEMS.map((item) => {
                const isCurrent = hoveredNav === item.id || (!hoveredNav && activeNav === item.id);
                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      navItemRefs.current[item.id] = el;
                    }}
                    type="button"
                    onClick={(e) => {
                      if (item.type === 'action') {
                        handleReportAction(e, '/buat-laporan');
                      } else {
                        scrollToSection(e, item.id);
                      }
                    }}
                    onMouseEnter={() => handleNavMouseEnter(item.id)}
                    className="relative z-10 px-4 xl:px-5 py-1.5 rounded-full transition-colors duration-200 cursor-pointer whitespace-nowrap text-black hover:text-black flex items-center gap-1"
                  >
                    <span>{item.label}</span>
                    {item.hasArrow && (
                      <span className="text-[12px] xl:text-[13px] font-normal leading-none inline-block -mt-0.5">
                        ↗
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Action / Auth Buttons — Mentok ke kanan */}
            <div className="hidden sm:flex items-center gap-2.5 flex-shrink-0 z-10">
              {currentUser ? (
                <div className="flex items-center gap-2 pl-2 border-l" style={{ borderColor: '#BFEFFF' }}>
                  <Link
                    to={profilePath}
                    className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl border transition"
                    style={{ color: '#1C6F8E', background: '#FFFFFF', border: '1.5px solid #BFEFFF' }}
                  >
                    <div
                      className="w-6 h-6 rounded-lg text-[#1C6F8E] flex items-center justify-center font-black text-[10px] shadow-xs border"
                      style={{ background: '#BFEFFF', borderColor: '#BFEFFF' }}
                    >
                      {currentUser.nama?.slice(0, 2).toUpperCase() || 'SW'}
                    </div>
                    <span className="truncate max-w-[100px]">{currentUser.nama || 'Siswa'}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="p-2 rounded-xl border transition hover:opacity-80 cursor-pointer"
                    style={{ border: '1.5px solid #BFEFFF', color: '#1C6F8E' }}
                    title="Keluar"
                  >
                    <LogIn className="w-3.5 h-3.5 rotate-180 text-[#1C6F8E]" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-xs font-bold px-4 py-1.5 rounded-xl border transition flex items-center gap-1.5 hover:opacity-90"
                  style={{ background: '#FFFFFF', color: '#1C6F8E', border: '1.5px solid #BFEFFF' }}
                >
                  <LogIn className="w-3.5 h-3.5 text-[#1C6F8E]" />
                  <span>Masuk</span>
                </Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border cursor-pointer z-10"
              style={{ border: '1.5px solid #BFEFFF', color: '#1C6F8E' }}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#1C6F8E]" /> : <Menu className="w-5 h-5 text-[#1C6F8E]" />}
            </button>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden px-6 pt-4 pb-6 border-t space-y-3 animate-fade-in" style={{ borderColor: '#BFEFFF', background: '#FFFFFF' }}>
              <div className="flex flex-col gap-1.5 text-[13px] font-bold tracking-wider text-black">
                {NAV_ITEMS.map((item) => {
                  const isCurrent = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        if (item.type === 'action') {
                          handleReportAction(e, '/buat-laporan');
                        } else {
                          scrollToSection(e, item.id);
                        }
                      }}
                      className={`text-left px-4 py-2 rounded-full border transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'border-[1.5px] border-black text-black font-semibold bg-transparent'
                          : 'border-transparent text-black hover:border-[1.5px] hover:border-black'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.hasArrow && <span className="text-[12px] font-normal leading-none">↗</span>}
                    </button>
                  );
                })}

                <div className="pt-3 border-t flex flex-col gap-2" style={{ borderColor: '#BFEFFF' }}>
                  {!currentUser ? (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 rounded-xl font-bold text-xs text-center border flex items-center justify-center gap-1.5"
                      style={{ color: '#1C6F8E', border: '1.5px solid #BFEFFF', background: '#FFFFFF' }}
                    >
                      <LogIn className="w-3.5 h-3.5 text-[#1C6F8E]" />
                      <span>Masuk</span>
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1C6F8E]">{currentUser.nama}</span>
                      <button
                        type="button"
                        onClick={() => { setMobileMenuOpen(false); logout(); }}
                        className="text-xs text-red-500 font-bold"
                      >
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* ─── PINNED SCROLL SECTION (500vh) — Cinematic 3D Cube Animation ─── */}
      <div
        ref={scrollStageRef}
        className="cube-scroll-section relative w-full h-[500vh]"
        style={{ position: 'relative', height: '500vh', overflow: 'visible' }}
      >
        <div
          className="cube-sticky-stage sticky top-0 w-full h-screen h-[100svh] overflow-hidden flex flex-col justify-between"
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            zIndex: 20,
            background: 'transparent'
          }}
        >
          <div className="cube-animation-container relative w-full h-full overflow-hidden flex flex-col justify-between">
            {/* Background Media Backdrop (Cube Video Background) */}
            <BackgroundMediaBackdrop
              src="/assets/background/cube-background.mp4"
              type="video"
              layerRef={backdropLayerRef}
              opacity={0.65}
            />

            {/* SCENE 01 & 02: HERO INITIAL CONTENT (0–15% Visible, 15–35% Fade Out) */}
            <div
              ref={heroContentRef}
              className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 relative z-10 will-change-transform"
              style={{
                opacity: 1,
                transform: 'translate3d(0, 0px, 0)',
                pointerEvents: 'auto'
              }}
            >
              <div className="max-w-xl lg:max-w-2xl space-y-5 text-center lg:text-left mx-auto lg:mx-0">
                {/* Main Headline */}
                <div className="space-y-1">
                  <h1 className="text-3xl sm:text-5xl lg:text-[62px] font-black tracking-tight leading-[1.08]" style={{ color: '#1C6F8E' }}>
                    SUARAKAN KEBENARAN. <br />
                    <span style={{ color: '#2E84A5' }}>
                      CIPTAKAN SEKOLAH BEBAS KEKERASAN
                    </span>{' '}
                    &amp; PERUNDUNGAN.
                  </h1>
                </div>

                {/* Supporting Text */}
                <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium" style={{ color: '#1C6F8E' }}>
                  Setiap pelajar berhak mendapatkan lingkungan pendidikan yang aman, nyaman, dan bebas dari perundungan.
                </p>

                {/* Call to Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                  <button
                    type="button"
                    onClick={(e) => handleReportAction(e, '/buat-laporan')}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 group cursor-pointer active:scale-95 transition hover:opacity-90 shadow-xs border"
                    style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
                  >
                    <ShieldAlert className="w-4 h-4 text-[#1C6F8E] group-hover:scale-110 transition" />
                    <span>Buat Laporan Sekarang</span>
                    <ArrowRight className="w-4 h-4 text-[#1C6F8E] group-hover:translate-x-1 transition" />
                  </button>

                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border transition hover:opacity-90"
                    style={{ color: '#1C6F8E', border: '1.5px solid #BFEFFF', background: '#FFFFFF' }}
                  >
                    <LogIn className="w-4 h-4 text-[#1C6F8E]" />
                    <span>Masuk Portal Siswa</span>
                  </Link>
                </div>

                {/* Quick Ticket Tracking */}
                <div className="pt-2 max-w-md mx-auto lg:mx-0">
                  <form
                    onSubmit={handleQuickTrack}
                    className="p-1.5 pl-3.5 rounded-2xl border flex items-center gap-2"
                    style={{ background: '#FFFFFF', border: '1.5px solid #BFEFFF' }}
                  >
                    <Search className="w-4 h-4 flex-shrink-0 text-[#1C6F8E]" />
                    <input
                      type="text"
                      placeholder="Punya Kode Tiket? (Contoh: SGP-2024-0142)"
                      value={quickTicketCode}
                      onChange={(e) => setQuickTicketCode(e.target.value)}
                      className="w-full bg-transparent text-xs focus:outline-none font-medium"
                      style={{ color: '#1C6F8E' }}
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-bold flex-shrink-0 cursor-pointer transition hover:opacity-90 border"
                      style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
                    >
                      Lacak
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* 3D CUBE CONTAINER */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 pt-16">
              <InteractivePhotoCube />
            </div>

            {/* SCENE 05: TRANSITION BRIDGE (85–100%) */}
            <div
              ref={transitionBridgeRef}
              className="absolute inset-x-0 bottom-16 max-w-2xl mx-auto px-4 text-center pointer-events-none z-10 will-change-transform"
              style={{
                opacity: 0,
                transform: 'translate3d(0, 45px, 0)'
              }}
            >
              <div
                className="p-5 sm:p-6 rounded-3xl space-y-2"
                style={{ background: '#FFFFFF', border: '1.5px solid #BFEFFF', boxShadow: '0 12px 40px rgba(191,239,255,0.3)' }}
              >
                <h3 className="text-base sm:text-lg font-black tracking-tight" style={{ color: '#1C6F8E' }}>
                  Mengenal Ekosistem Pengaduan &amp; Pencegahan SIGAP
                </h3>
                <p className="text-xs max-w-lg mx-auto font-medium" style={{ color: '#2E84A5' }}>
                  Melindungi integritas pelajar melalui pelaporan rahasia, audit trail terverifikasi, dan pendampingan profesional Satgas PPKSP.
                </p>
              </div>
            </div>

            {/* SCROLL GUIDE FOOTER */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 flex items-center justify-center text-xs font-mono z-30 pointer-events-auto" style={{ color: '#1C6F8E' }}>
              <div className="flex items-center gap-1.5 font-bold" style={{ color: '#1C6F8E' }}>
                <span>GULIR KE BAWAH</span>
                <ChevronDown className="w-4 h-4 animate-bounce text-[#1C6F8E]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 1: ABOUT SIGAP (#about) EDITORIAL HORIZONTAL SHOWCASE ─── */}
      <AboutEditorialShowcase handleReportAction={handleReportAction} />

      {/* ─── SECTION 2: OUR MISSION (#mission) (Baby Blue Tint Background with White Cards) ─── */}
      <section id="mission" className="py-20 lg:py-28 border-y relative z-30" style={{ background: 'rgba(191, 239, 255, 0.25)', borderColor: '#BFEFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight" style={{ color: '#1C6F8E' }}>
              Membangun Ekosistem Sekolah yang Aman dan Berintegritas
            </h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#2E84A5' }}>
              Kami percaya rasa aman adalah hak dasar setiap anak dalam menuntut ilmu. SIGAP mempertemukan komitmen hukum, teknologi cerdas, dan sentuhan empati manusia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield className="w-6 h-6 text-[#1C6F8E]" />,
                bg: '#BFEFFF',
                cardBg: '#FFFFFF',
                cardBorder: '#BFEFFF',
                title: 'Zero Retaliation Guarantee',
                desc: 'Menjamin perlindungan tanpa intimidasi balasan bagi pelapor, saksi, maupun korban. Sanksi tegas diberlakukan terhadap setiap upaya perundungan lanjutan.'
              },
              {
                icon: <Sparkles className="w-6 h-6 text-[#1C6F8E]" />,
                bg: '#BFEFFF',
                cardBg: '#FFFFFF',
                cardBorder: '#BFEFFF',
                title: 'Validasi & Triase Berbasis AI',
                desc: 'Pemrosesan teks IndoBERT secara otomatis mengidentifikasi 7 kategori kekerasan resmi dan mengukur tingkat risiko untuk mempercepat respons tindakan awal.'
              },
              {
                icon: <HeartHandshake className="w-6 h-6 text-[#1C6F8E]" />,
                bg: '#BFEFFF',
                cardBg: '#FFFFFF',
                cardBorder: '#BFEFFF',
                title: 'Pendampingan Psikologis Terpadu',
                desc: 'Guru BK dan Satgas PPKSP mendampingi siswa secara privat dan berkelanjutan hingga tercapai pemulihan trauma dan kedamaian lingkungan sekolah.'
              }
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-3xl p-8 space-y-4 shadow-md"
                style={{ background: item.cardBg, border: `2px solid ${item.cardBorder}` }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-xs border" style={{ background: item.bg, borderColor: '#BFEFFF' }}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-black" style={{ color: '#1C6F8E' }}>{item.title}</h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#2E84A5' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: HOW IT WORKS (#how-it-works) (White Background) ─── */}
      <section id="how-it-works" className="py-20 lg:py-28 relative z-30" style={{ background: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight" style={{ color: '#1C6F8E' }}>
              Alur 4 Langkah: Report → Verification → Follow-up → Resolution
            </h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#2E84A5' }}>
              Mulai dari pengiriman hingga penuntasan kasus, proses berjalan transparan, akuntabel, dan bebas hambatan birokrasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', bg: '#BFEFFF', cardBg: '#FFFFFF', cardBorder: '#BFEFFF', title: 'Report (Kirim Aduan)', desc: 'Tulis kronologi kejadian, pilih lokasi di sekolah, lampirkan bukti foto bila ada, dan tentukan opsi privasi identitas Anda.' },
              { num: '02', bg: '#BFEFFF', cardBg: '#FFFFFF', cardBorder: '#BFEFFF', title: 'Verification (Verifikasi)', desc: 'Kecerdasan buatan NLP IndoBERT memetakan kategori kasus, kemudian Tim BK Satgas memverifikasi keabsahan laporan.' },
              { num: '03', bg: '#BFEFFF', cardBg: '#FFFFFF', cardBorder: '#BFEFFF', title: 'Follow-up (Tindak Lanjut)', desc: 'Pelaksanaan sesi konseling privat, mediasi terarah, pemanggilan saksi aman, dan pemenuhan kebutuhan bantuan korban.' },
              { num: '04', bg: '#BFEFFF', cardBg: '#FFFFFF', cardBorder: '#BFEFFF', title: 'Resolution (Penyelesaian)', desc: 'Penegakan aturan sekolah, pemulihan situasi belajar, dan pencatatan riwayat penanganan secara permanen di Digital Audit Trail.' }
            ].map((step, i) => (
              <div
                key={i}
                className="rounded-3xl p-6 space-y-3 shadow-md"
                style={{ background: step.cardBg, border: `2px solid ${step.cardBorder}` }}
              >
                <div
                  className="w-10 h-10 rounded-2xl text-[#1C6F8E] font-black text-sm flex items-center justify-center shadow-xs border"
                  style={{ background: step.bg, borderColor: '#BFEFFF' }}
                >
                  {step.num}
                </div>
                <h4 className="font-extrabold text-base" style={{ color: '#1C6F8E' }}>{step.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: '#2E84A5' }}>{step.desc}</p>
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

        {/* Subtle translucent light overlay with White & Baby Blue tone */}
        <div
          className="absolute inset-0 pointer-events-none z-1"
          style={{
            background: 'rgba(255, 255, 255, 0.92)'
          }}
        />

        {/* Section 4: 7 Bentuk Kekerasan (Pinned Horizontal Wavy Reel) */}
        <div id="categories" className="relative z-10 scroll-mt-20">
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
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight" style={{ color: '#1C6F8E' }}>
                  Teknologi Cerdas untuk Perlindungan Hakiki
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: '#2E84A5' }}>
                  SIGAP dirancang dengan standar teknologi institusi modern guna memastikan tidak ada suara aduan yang hilang, diabaikan, atau bocor.
                </p>

                <div className="pt-2">
                  <Link
                    to="/admin/login"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold border transition hover:opacity-90 shadow-xs"
                    style={{ color: '#1C6F8E', border: '1.5px solid #BFEFFF', background: '#FFFFFF' }}
                  >
                    <Lock className="w-3.5 h-3.5 text-[#1C6F8E]" />
                    <span>Akses Khusus Guru BK &amp; Admin</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { cardBg: '#FFFFFF', cardBorder: '#BFEFFF', icon: <Sparkles className="w-5 h-5 text-[#1C6F8E]" />, title: 'AI NLP Multi-Label', desc: 'Rekomendasi otomatis 7 kategori kekerasan resmi berdasarkan analisis teks kronologi aduan untuk mempercepat telaah awal tim konselor.' },
                  { cardBg: '#FFFFFF', cardBorder: '#BFEFFF', icon: <Lock className="w-5 h-5 text-[#1C6F8E]" />, title: 'Enkripsi & Kerahasiaan', desc: 'Data aduan dilindungi mekanisme Role-Based Access Control (RBAC) dan JWT. Hanya konselor sekolah yang terverifikasi yang dapat mengakses.' },
                  { cardBg: '#FFFFFF', cardBorder: '#BFEFFF', icon: <FileText className="w-5 h-5 text-[#1C6F8E]" />, title: 'Digital Audit Trail', desc: 'Setiap perpindahan status laporan dicatat secara permanen dengan timestamp dan identitas konselor, mencegah kelalaian dan manipulasi.' },
                  { cardBg: '#FFFFFF', cardBorder: '#BFEFFF', icon: <Search className="w-5 h-5 text-[#1C6F8E]" />, title: 'Pelacakan Real-Time', desc: 'Transparansi progres aduan melalui kode tiket unik tanpa perlu login, menjaga kenyamanan dan ketenangan pikiran pelapor.' }
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-3xl space-y-3 border-2 transition group hover:shadow-md shadow-xs"
                    style={{ background: feature.cardBg, borderColor: feature.cardBorder }}
                  >
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold group-hover:scale-105 transition-transform shadow-xs border"
                      style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
                    >
                      {feature.icon}
                    </div>
                    <h4 className="font-bold text-base transition-colors" style={{ color: '#1C6F8E' }}>
                      {feature.title}
                    </h4>
                    <p className="text-xs leading-relaxed" style={{ color: '#2E84A5' }}>{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─── SECTION: FAQ SCROLL-DRIVEN ZOOM-IN REVEAL BOARD ─── */}
      <section
        id="faq"
        ref={faqTrackRef}
        className="faq-scroll-track relative w-full border-y border-[#BFEFFF]"
        style={{
          position: 'relative',
          height: '260vh',
          background: 'rgba(191, 239, 255, 0.22)',
          overflow: 'visible'
        }}
      >
        <style>{`
          .faq-zoom-card {
            transition: box-shadow 200ms ease, border-color 200ms ease;
          }
          .faq-zoom-card:hover {
            border-color: #8FE3FF;
            box-shadow: 0 8px 24px -2px rgba(191, 239, 255, 0.65), 0 3px 8px rgba(46, 132, 165, 0.05);
          }
        `}</style>

        {/* Sticky Viewport Stage */}
        <div
          className="faq-sticky-stage sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pointer-events-auto"
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            zIndex: 20
          }}
        >
          <div className="max-w-6xl w-full mx-auto flex flex-col justify-center h-full pt-20 pb-6 sm:pt-24 sm:pb-8">
            {/* Header: Title and subtitle */}
            <div className="text-center space-y-2 mb-4 sm:mb-6 flex-shrink-0">
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight"
                style={{ color: '#1C6F8E' }}
              >
                Pertanyaan yang Sering Diajukan
              </h2>
              <p
                className="text-xs sm:text-sm max-w-2xl mx-auto"
                style={{ color: '#2E84A5' }}
              >
                Temukan jawaban seputar akses login, keamanan privasi, alur aduan, dan penanganan perundungan di SIGAP.
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 w-full max-h-[72vh] sm:max-h-none overflow-y-auto sm:overflow-visible pr-1 sm:pr-0">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  ref={(el) => (faqCardsRef.current[idx] = el)}
                  className="faq-zoom-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #BFEFFF',
                    boxShadow: '0 4px 18px -2px rgba(191, 239, 255, 0.45), 0 2px 6px rgba(46, 132, 165, 0.04)',
                    opacity: 0,
                    transform: 'scale(0.65) translateY(45px)',
                    willChange: 'transform, opacity'
                  }}
                >
                  <div>
                    {/* Question Header */}
                    <div className="flex items-start gap-2.5">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: '#BFEFFF', color: '#1C6F8E' }}
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-[#1C6F8E]" />
                      </div>
                      <h3
                        className="font-bold text-xs sm:text-sm leading-snug"
                        style={{ color: '#1C6F8E' }}
                      >
                        {faq.q}
                      </h3>
                    </div>

                    {/* Answer Block */}
                    <div
                      ref={(el) => (faqAnswersRef.current[idx] = el)}
                      className="faq-answer-block mt-3 pt-3 border-t"
                      style={{
                        borderColor: 'rgba(191, 239, 255, 0.7)',
                        opacity: 0,
                        transform: 'translateY(10px)',
                        willChange: 'transform, opacity'
                      }}
                    >
                      <p
                        className="text-xs sm:text-[13px] leading-relaxed"
                        style={{ color: '#2E84A5' }}
                      >
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION: EMERGENCY CRISIS CONTACT BOX ─── */}
      <section className="py-10 relative z-30" style={{ background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ background: '#FFFFFF', border: '2px solid #BFEFFF', boxShadow: '0 8px 30px rgba(191, 239, 255, 0.25)' }}
          >
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-lg sm:text-xl font-black" style={{ color: '#1C6F8E' }}>
                Dalam Keadaan Bahaya Mendesak?
              </h3>
              <p className="text-xs sm:text-sm max-w-xl" style={{ color: '#2E84A5' }}>
                Bila Anda membutuhkan perlindungan fisik seketika atau pendampingan darurat kekerasan seksual dan fisik, hubungi kontak resmi berikut:
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="tel:129"
                className="px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition active:scale-95 shadow-xs hover:opacity-90 border"
                style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
              >
                <PhoneCall className="w-4 h-4 text-[#1C6F8E]" />
                <span>SAPA 129 (KemenPPPA)</span>
              </a>
              <a
                href="tel:110"
                className="px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition active:scale-95 shadow-xs hover:opacity-90 border"
                style={{ background: '#FFFFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
              >
                <ShieldAlert className="w-4 h-4 text-[#1C6F8E]" />
                <span>Polisi 110</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: FINAL CALL TO ACTION (Baby Blue & White Theme) ─── */}
      <section className="py-16 border-t relative z-30" style={{ background: '#FFFFFF', borderColor: '#BFEFFF' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight" style={{ color: '#1C6F8E' }}>
            Sekolah yang Sehat Dimulai dari Keberanian Bersuara
          </h2>
          <p className="text-xs sm:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: '#2E84A5' }}>
            Tidak ada alasan untuk menoleransi perundungan di lingkungan sekolah. Masuk atau daftarkan akun Anda sekarang untuk membuat laporan aduan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              type="button"
              onClick={(e) => handleReportAction(e, '/buat-laporan')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm cursor-pointer transition hover:opacity-90 flex items-center justify-center gap-2 shadow-xs border"
              style={{ background: '#FFFFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
            >
              <ShieldAlert className="w-4 h-4 text-[#1C6F8E]" />
              <span>Buat Laporan Sekarang</span>
            </button>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border transition hover:opacity-90 shadow-xs"
              style={{ color: '#1C6F8E', border: '1.5px solid #BFEFFF', background: '#FFFFFF' }}
            >
              <LogIn className="w-4 h-4 text-[#1C6F8E]" />
              <span>Masuk ke Akun Siswa</span>
            </Link>

            <Link
              to="/admin/login"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border transition hover:opacity-90 shadow-xs"
              style={{ color: '#1C6F8E', border: '1.5px solid #BFEFFF', background: '#FFFFFF' }}
            >
              <Lock className="w-4 h-4 text-[#1C6F8E]" />
              <span>Akses Portal Guru BK</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── AUTH GATE MODAL ─── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ background: 'rgba(28, 111, 142, 0.45)' }}>
          <div
            className="rounded-3xl max-w-md w-full p-6 sm:p-8 relative space-y-6"
            style={{ background: '#FFFFFF', border: '2px solid #BFEFFF', boxShadow: '0 24px 70px rgba(191, 239, 255, 0.35)' }}
          >
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute right-5 top-5 p-2 rounded-2xl transition hover:opacity-70"
              style={{ color: '#1C6F8E' }}
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-xs border"
              style={{ background: '#BFEFFF', borderColor: '#BFEFFF' }}
            >
              <Lock className="w-7 h-7 text-[#1C6F8E]" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-black tracking-tight" style={{ color: '#1C6F8E' }}>
                Masuk atau Daftar Terlebih Dahulu
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#2E84A5' }}>
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
                className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 shadow-xs hover:opacity-90 border"
                style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
              >
                <LogIn className="w-4 h-4 text-[#1C6F8E]" />
                <span>Masuk dengan Akun Siswa</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  navigate(`/register?redirect=${encodeURIComponent(targetRedirect)}`);
                }}
                className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition hover:opacity-90 shadow-xs border"
                style={{ background: '#FFFFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
              >
                <UserPlus className="w-4 h-4 text-[#1C6F8E]" />
                <span>Daftar Akun Baru</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-full py-2.5 px-4 text-xs font-semibold transition cursor-pointer hover:underline"
                style={{ color: '#2E84A5' }}
              >
                Batal
              </button>
            </div>

            <div className="pt-3 border-t flex items-center gap-2 text-[11px]" style={{ borderColor: '#BFEFFF', color: '#2E84A5' }}>
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-[#1C6F8E]" />
              <span>Privasi data Anda dijamin 100% dan terenkripsi secara aman.</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
