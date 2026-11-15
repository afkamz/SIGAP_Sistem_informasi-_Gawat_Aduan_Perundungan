import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  EyeOff,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  LogIn,
  Sparkles,
  Lock,
  HeartHandshake,
  Compass
} from 'lucide-react';

/**
 * Helper Hermite smoothstep for silky transitions
 */
const smoothStep = (min, max, value) => {
  if (value <= min) return 0;
  if (value >= max) return 1;
  const x = (value - min) / (max - min);
  return x * x * (3 - 2 * x);
};

export const AboutEditorialShowcase = ({ handleReportAction }) => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const headerRef = useRef(null);
  const indicatorRef = useRef(null);

  useEffect(() => {
    let animFrameId = null;

    const updateTransform = () => {
      animFrameId = null;
      if (!sectionRef.current || !trackRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const scrollableDistance = rect.height - viewportHeight;

      if (scrollableDistance <= 0) return;

      // Scroll progress from 0.0 to 1.0
      const progress = Math.max(0, Math.min(1, (-rect.top) / scrollableDistance));

      // Calculate horizontal pan for the track
      // On desktop, the track moves horizontally as the user scrolls
      const trackWidth = trackRef.current.scrollWidth;
      const maxTranslateX = Math.max(0, trackWidth - viewportWidth + (viewportWidth < 768 ? 32 : 120));

      // Timeline phases:
      // 0.00 - 0.15: Header focus & entrance
      // 0.15 - 0.85: Smooth horizontal pan through the editorial panels
      // 0.85 - 1.00: Settle & transition out
      const panProgress = smoothStep(0.12, 0.82, progress);
      const currentTranslateX = -panProgress * maxTranslateX;

      trackRef.current.style.transform = `translate3d(${currentTranslateX.toFixed(1)}px, 0px, 0px)`;

      // Subtle header parallax & opacity
      if (headerRef.current) {
        const headerOpacity = progress < 0.85 ? 1 : Math.max(0, 1 - (progress - 0.85) / 0.12);
        headerRef.current.style.opacity = headerOpacity.toFixed(2);
      }

      // Micro line indicator
      if (indicatorRef.current) {
        indicatorRef.current.style.width = `${(panProgress * 100).toFixed(0)}%`;
      }
    };

    const handleScroll = () => {
      if (!animFrameId) {
        animFrameId = requestAnimationFrame(updateTransform);
      }
    };

    const handleResize = () => {
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    updateTransform();

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-editorial-section relative w-full h-[300vh] lg:h-[340vh]"
      style={{ overflow: 'visible', background: '#FFFFFF' }}
    >
      {/* ─── Pinned Viewport Container (100dvh) ─── */}
      <div
        className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-between py-6 sm:py-8 relative z-20"
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E8E3E5'
        }}
      >
        {/* ─── TOP EDITORIAL HEADER ─── */}
        <div
          ref={headerRef}
          className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-shrink-0 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold"
              style={{ background: '#F9DCE7', color: '#D982A5', border: '1px solid #E9A7BF' }}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>TENTANG SISTEM SIGAP</span>
            </div>
            <span className="hidden sm:inline-block text-xs font-mono font-semibold" style={{ color: '#777777' }}>
              EDISI 2026 // PERMENDIKBUDRISTEK 46/2023
            </span>
          </div>

          {/* Minimalist progress indicator track */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold" style={{ color: '#777777' }}>PAN</span>
            <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: '#E8E3E5' }}>
              <div
                ref={indicatorRef}
                className="h-full rounded-full transition-all duration-75"
                style={{ width: '0%', background: '#D982A5' }}
              />
            </div>
          </div>
        </div>

        {/* ─── HORIZONTAL EDITORIAL GALLERY TRACK ─── */}
        <div className="w-full my-auto overflow-visible">
          <div
            ref={trackRef}
            className="flex items-stretch gap-6 sm:gap-8 lg:gap-10 px-4 sm:px-8 lg:px-12 will-change-transform select-none"
            style={{
              transform: 'translate3d(0px, 0px, 0px)'
            }}
          >
            {/* ── PANEL 1: EDITORIAL COVER & MISSION STATEMENT ── */}
            <div
              className="flex-shrink-0 w-[88vw] sm:w-[480px] lg:w-[560px] rounded-3xl p-7 sm:p-9 flex flex-col justify-between"
              style={{
                background: '#FDF7F9',
                border: '1px solid #E8E3E5'
              }}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: '#D982A5' }}
                  />
                  <span className="text-xs font-mono font-bold tracking-widest uppercase" style={{ color: '#D982A5' }}>
                    01 // FILOSOFI &amp; LANDASAN
                  </span>
                </div>

                <h2
                  className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight"
                  style={{ color: '#202020' }}
                >
                  Sistem Informasi Gawat Aduan Perundungan Sekolah
                </h2>

                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#555555' }}>
                  SIGAP hadir sebagai sarana resmi perlindungan pelajar dari segala bentuk kekerasan, perundungan fisik, verbal, siber, maupun diskriminasi di satuan pendidikan.
                </p>
              </div>

              {/* Editorial Pillars */}
              <div className="pt-6 border-t mt-6 grid grid-cols-2 gap-4" style={{ borderColor: '#E8E3E5' }}>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: '#202020' }}>
                    <Lock className="w-3.5 h-3.5" style={{ color: '#D982A5' }} />
                    <span>Zero Retaliation</span>
                  </div>
                  <p className="text-[11px] leading-snug" style={{ color: '#777777' }}>
                    Perlindungan hukum dan privasi penuh bagi seluruh pelapor.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: '#202020' }}>
                    <HeartHandshake className="w-3.5 h-3.5" style={{ color: '#D982A5' }} />
                    <span>Pendampingan BK</span>
                  </div>
                  <p className="text-[11px] leading-snug" style={{ color: '#777777' }}>
                    Konseling humanis dan pemulihan psikologis komprehensif.
                  </p>
                </div>
              </div>
            </div>

            {/* ── PANEL 2: MODE ANONIM (SOLID CLEAN CARD) ── */}
            <div
              className="flex-shrink-0 w-[88vw] sm:w-[420px] lg:w-[460px] rounded-3xl p-7 sm:p-9 flex flex-col justify-between"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E8E3E5',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold"
                    style={{ background: '#202020' }}
                  >
                    <EyeOff className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: '#FDF7F9', color: '#555555', border: '1px solid #E8E3E5' }}
                  >
                    Mode Anonim Terproteksi
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black" style={{ color: '#202020' }}>
                  Pelaporan Anonim
                </h3>
                <p className="text-xs sm:text-sm mt-2 leading-relaxed" style={{ color: '#777777' }}>
                  Bagi siswa, saksi, atau korban yang merasa ragu atau khawatir diintimidasi. Identitas nama dan data pribadi Anda tidak dicantumkan ke publik.
                </p>

                <ul className="mt-5 space-y-3 text-xs sm:text-sm" style={{ color: '#555555' }}>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#D982A5' }} />
                    <span><strong>100% Bebas Identitas Publik:</strong> Tanpa nama lengkap atau informasi kontak terekspos.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#D982A5' }} />
                    <span><strong>Kode Tiket Rahasia:</strong> Dapatkan nomor unik untuk melacak perkembangan kasus secara mandiri.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#D982A5' }} />
                    <span><strong>Bebas Intimidasi:</strong> Dijamin zero-retaliation policy dari pihak sekolah.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 border-t mt-6" style={{ borderColor: '#E8E3E5' }}>
                <button
                  type="button"
                  onClick={(e) => handleReportAction(e, '/buat-laporan')}
                  className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer border transition hover:border-pink-300"
                  style={{ background: '#FDF7F9', color: '#202020', border: '1px solid #E8E3E5' }}
                >
                  <span>Mulai Lapor Anonim</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── PANEL 3: KONSELING TERPADU / TERVERIFIKASI (SOLID ACCENT CARD) ── */}
            <div
              className="flex-shrink-0 w-[88vw] sm:w-[440px] lg:w-[480px] rounded-3xl p-7 sm:p-9 flex flex-col justify-between relative"
              style={{
                background: '#FFFFFF',
                border: '2px solid #E9A7BF',
                boxShadow: '0 8px 30px rgba(217, 130, 165, 0.12)'
              }}
            >
              <span
                className="absolute -top-3 right-6 px-3.5 py-1 rounded-full text-white text-[10px] font-extrabold uppercase tracking-wider"
                style={{ background: 'linear-gradient(135deg, #D982A5, #E9A7BF)' }}
              >
                DIREKOMENDASIKAN
              </span>

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold"
                    style={{ background: '#F9DCE7', border: '1px solid #E9A7BF' }}
                  >
                    <UserCheck className="w-6 h-6" style={{ color: '#D982A5' }} />
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: '#F9DCE7', color: '#D982A5', border: '1px solid #E9A7BF' }}
                  >
                    Konseling Terpadu
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black" style={{ color: '#202020' }}>
                  Pelaporan Terverifikasi
                </h3>
                <p className="text-xs sm:text-sm mt-2 leading-relaxed" style={{ color: '#777777' }}>
                  Direkomendasikan untuk pendampingan konseling intensif, perlindungan fisik menyeluruh, dan advokasi berkelanjutan oleh sekolah.
                </p>

                <ul className="mt-5 space-y-3 text-xs sm:text-sm" style={{ color: '#555555' }}>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#D982A5' }} />
                    <span><strong>Dashboard Terpadu:</strong> Pantau riwayat seluruh aduan, riwayat notifikasi, dan catatan konselor.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#D982A5' }} />
                    <span><strong>Pendampingan Langsung BK:</strong> Memudahkan penjadwalan sesi konseling privat yang aman dan terarah.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#D982A5' }} />
                    <span><strong>Perlindungan Menyeluruh:</strong> Intervensi langsung oleh Satgas PPKSP dengan pendampingan resmi.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 border-t mt-6 flex flex-col sm:flex-row gap-2" style={{ borderColor: '#E9A7BF' }}>
                <button
                  type="button"
                  onClick={(e) => handleReportAction(e, '/buat-laporan')}
                  className="flex-1 py-3.5 px-4 rounded-2xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition hover:opacity-95"
                  style={{ background: 'linear-gradient(135deg, #D982A5, #E9A7BF)' }}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Buat Aduan Terverifikasi</span>
                </button>
                <Link
                  to="/register?redirect=/buat-laporan"
                  className="py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm text-center border transition hover:border-pink-300"
                  style={{ color: '#202020', border: '1px solid #E8E3E5', background: '#FDF7F9' }}
                >
                  Daftar Akun
                </Link>
              </div>
            </div>

            {/* ── PANEL 4: EDITORIAL CALLOUT QUOTE ── */}
            <div
              className="flex-shrink-0 w-[75vw] sm:w-[320px] lg:w-[360px] rounded-3xl p-7 sm:p-9 flex flex-col justify-between"
              style={{
                background: '#FDF7F9',
                border: '1px dashed #E9A7BF'
              }}
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#F9DCE7' }}>
                  <Sparkles className="w-5 h-5" style={{ color: '#D982A5' }} />
                </div>
                <blockquote className="text-sm sm:text-base font-bold italic leading-relaxed" style={{ color: '#202020' }}>
                  "Tidak ada satu siswa pun yang layak merasa takut saat menuntut ilmu di sekolah."
                </blockquote>
                <p className="text-xs" style={{ color: '#777777' }}>
                  Satuan Tugas PPKSP &amp; Bimbingan Konseling SIGAP.
                </p>
              </div>

              <div className="pt-4 border-t" style={{ borderColor: '#E8E3E5' }}>
                <span className="text-[11px] font-mono font-bold" style={{ color: '#D982A5' }}>
                  SIGAP // SELALU SIAP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── BOTTOM EDITORIAL CAPTION ─── */}
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-shrink-0 flex items-center justify-between text-xs font-mono" style={{ color: '#777777' }}>
          <span className="hidden sm:inline">GULIR KE SAMPING UNTUK MENELUSURI MODALITAS PELAPORAN</span>
          <span className="text-right ml-auto">SIGAP SYSTEM © 2026</span>
        </div>
      </div>
    </section>
  );
};

export default AboutEditorialShowcase;
