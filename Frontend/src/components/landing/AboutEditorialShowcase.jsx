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
  HeartHandshake
} from 'lucide-react';

/**
 * =========================================================================
 * SIGAP — CLEAN LEFT-TO-RIGHT HORIZONTAL CARD SLIDE
 * =========================================================================
 * Rangkaian 4 kartu "Tentang Sistem SIGAP" yang meluncur lurus secara horizontal
 * dari KIRI KE KANAN tanpa animasi gelombang atau kemiringan rotasi.
 *
 * FITUR UTAMA:
 *  1. INITIAL STATE: Seluruh kartu berada di luar batas kiri viewport
 *     (startX = -(trackWidth + 60/120)). Tidak ada kartu terlihat di awal.
 *  2. LEFT TO RIGHT SLIDE: Kartu meluncur masuk dari KIRI KE KANAN secara berurutan.
 *     Card 1 (Filosofi) masuk pertama di barisan depan, disusul Card 2, Card 3, dan Card 4.
 *  3. CLEAN & FLAT: Kartu tetap stabil, rata pada satu garis lurus horizontal
 *     tanpa gelombang vertikal (translateY) atau tilt rotasi (rotateZ).
 *  4. WARNA BABY BLUE (#BFEFFF):
 *     - Background kartu biru baby blue lembut dengan tipografi Deep Navy (#062331/#093347).
 *  5. EDITORIAL TYPOGRAPHY JUDUL:
 *     - Menggunakan scale-down scroll animation yang identik dengan "7 Bentuk Kekerasan".
 * =========================================================================
 */

// Helper Hermite smoothstep for silky transitions
const smoothStep = (min, max, value) => {
  if (value <= min) return 0;
  if (value >= max) return 1;
  const x = (value - min) / (max - min);
  return x * x * (3 - 2 * x);
};

export const AboutEditorialShowcase = ({ handleReportAction }) => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const titleWrapperRef = useRef(null);
  const titleHeadingRef = useRef(null);
  const cachedMetricsRef = useRef(null);

  // ─── Tali Penarik Antar-Kartu (Dynamic Tow Ropes) ───
  const ropePathRefs = useRef([]);
  const ropeTwistRefs = useRef([]);
  const ropeShadowRefs = useRef([]);

  useEffect(() => {
    let animFrameId = null;

    const updateRopes = (waveYArr, flightP = 0) => {
      // Kelengkungan dinamis (catenary tension sag) saat kartu meluncur
      const sag = Math.sin(flightP * Math.PI) * 4 + 7;
      const anchors = cachedMetricsRef.current?.ropeAnchors || [];

      for (let i = 0; i < 3; i++) {
        const anchor = anchors[i];
        if (!anchor) continue;

        const x1 = anchor.x1;
        const y1 = anchor.midY1 + (waveYArr[i] || 0);

        const x2 = anchor.x2;
        const y2 = anchor.midY2 + (waveYArr[i + 1] || 0);

        const midX = (x1 + x2) * 0.5;
        const midY = (y1 + y2) * 0.5 + sag;

        const d = `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
        const dShadow = `M ${x1.toFixed(1)} ${(y1 + 4).toFixed(1)} Q ${midX.toFixed(1)} ${(midY + 4).toFixed(1)} ${x2.toFixed(1)} ${(y2 + 4).toFixed(1)}`;

        if (ropePathRefs.current[i]) {
          ropePathRefs.current[i].setAttribute('d', d);
        }
        if (ropeTwistRefs.current[i]) {
          ropeTwistRefs.current[i].setAttribute('d', d);
        }
        if (ropeShadowRefs.current[i]) {
          ropeShadowRefs.current[i].setAttribute('d', dShadow);
        }
      }
    };

    const updateMetrics = () => {
      if (!sectionRef.current || !trackRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const scrollableDistance = rect.height - viewportHeight;
      const isMobile = viewportWidth < 768;
      const cardWidth = isMobile ? 280 : 320;
      const trackWidth = trackRef.current.scrollWidth;

      // ─── LEFT TO RIGHT CONVOY ───
      const leadCard = cardRefs.current[3];
      const leadCardRight = leadCard ? leadCard.offsetLeft + leadCard.offsetWidth : trackWidth;
      const startX = -leadCardRight;
      const endX = Math.max(isMobile ? 20 : 40, (viewportWidth - trackWidth) / 2);

      const offsets = cardRefs.current.map((cardEl) => (cardEl ? cardEl.offsetLeft : 0));

      // Cache anchor points tali penarik untuk eliminasi forced layout reads saat scrolling
      const ropeAnchors = [];
      for (let i = 0; i < 3; i++) {
        const cardA = cardRefs.current[i];
        const cardB = cardRefs.current[i + 1];
        if (cardA && cardB) {
          ropeAnchors.push({
            x1: cardA.offsetLeft + cardA.offsetWidth,
            midY1: cardA.offsetTop + cardA.offsetHeight * 0.5,
            x2: cardB.offsetLeft,
            midY2: cardB.offsetTop + cardB.offsetHeight * 0.5
          });
        } else {
          ropeAnchors.push(null);
        }
      }

      cachedMetricsRef.current = {
        viewportHeight,
        viewportWidth,
        scrollableDistance,
        isMobile,
        cardWidth,
        trackWidth,
        startX,
        endX,
        offsets,
        ropeAnchors
      };

      updateRopes([0, 0, 0, 0], 0);
    };

    const updateWavyMovement = () => {
      animFrameId = null;
      if (!sectionRef.current || !trackRef.current) return;

      if (!cachedMetricsRef.current) {
        updateMetrics();
      }

      const {
        viewportHeight,
        viewportWidth,
        scrollableDistance,
        isMobile,
        cardWidth,
        startX,
        endX,
        offsets
      } = cachedMetricsRef.current;

      if (scrollableDistance <= 0) return;

      const rect = sectionRef.current.getBoundingClientRect();

      // Progress murni outer section (0.0 s.d. 1.0)
      const progress = Math.max(0, Math.min(1, (-rect.top) / scrollableDistance));

      // ─── 0. EDITORIAL TYPOGRAPHY SCROLL ANIMATION (JUDUL SECTION) ───
      // Bergerak dari posisi tengah/bawah naik ke atas (progress 0.00 hingga 0.20)
      if (titleWrapperRef.current) {
        const titleProgress = smoothStep(0.00, 0.12, progress);
        const startTranslateY = isMobile ? viewportHeight * 0.07 : Math.min(80, viewportHeight * 0.09);
        const currentTranslateY = startTranslateY * (1.0 - titleProgress);

        titleWrapperRef.current.style.transform = `translate3d(0, ${currentTranslateY.toFixed(1)}px, 0)`;

        if (titleHeadingRef.current) {
          const startScale = isMobile ? 1.08 : 1.25;
          const currentScale = startScale - (startScale - 1.0) * titleProgress;
          titleHeadingRef.current.style.transform = `scale(${currentScale.toFixed(3)})`;
          titleHeadingRef.current.style.transformOrigin = '0% 50%';
        }
      }

      // ─── 1. HORIZONTAL TRACK PAN DARI KIRI KE KANAN ───
      // Begitu teks bergerak setengah ke atas (progress = 0.10, yaitu 50% dari interval teks 0.00 - 0.20),
      // deretan kartu langsung meluncur masuk dari kiri ke kanan agar layar tidak kosong!
      const flightP = smoothStep(0.04, 0.65, progress);
      const currentTrackX = startX + (endX - startX) * flightP;

      trackRef.current.style.transform = `translate3d(${currentTrackX.toFixed(1)}px, 0px, 0px)`;

      // ─── 2. SUBTLE & SMOOTH WAVE ANIMATION (GELOMBANG HALUS / SEDIKIT SAJA) ───
      const screenCenter = viewportWidth / 2;
      const subtleAmpY = isMobile ? 7 : 12; // Amplitudo halus (7px mobile, 12px desktop)
      const subtleRotZ = isMobile ? 0.8 : 1.5; // Kemiringan rotasi sangat lembut (0.8° - 1.5°)

      // Motion factor: gelombang aktif saat meluncur, dan mereda mulus (settle) saat kartu berhenti
      const motionFactor = Math.sin(flightP * Math.PI);
      const waveYArr = [0, 0, 0, 0];

      cardRefs.current.forEach((cardEl, index) => {
        if (!cardEl) return;

        const cardOffset = offsets[index] !== undefined ? offsets[index] : cardEl.offsetLeft;
        const cardScreenX = currentTrackX + cardOffset;
        const cardCenter = cardScreenX + cardWidth / 2;

        // Posisi normalisasi terhadap pusat layar
        const u = (cardCenter - screenCenter) / (viewportWidth / 2);

        if (flightP >= 0.98 || u < -2.0 || u > 2.0) {
          cardEl.style.transform = 'translate3d(0, 0, 0)';
          waveYArr[index] = 0;
          return;
        }

        const direction = index % 2 === 0 ? 1 : -1;
        const waveY = direction * Math.sin(u * Math.PI) * subtleAmpY * motionFactor;
        const waveRot = direction * Math.cos(u * Math.PI) * subtleRotZ * motionFactor;

        waveYArr[index] = waveY;
        cardEl.style.transform = `translate3d(0, ${waveY.toFixed(1)}px, 0) rotateZ(${waveRot.toFixed(2)}deg)`;
      });

      // ─── 3. UPDATE TALI PENARIK ANTAR KARTU ───
      updateRopes(waveYArr, flightP);
    };

    let isSectionVisible = true;
    let observer = null;
    if (typeof IntersectionObserver !== 'undefined' && sectionRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          isSectionVisible = entries[0].isIntersecting;
          if (isSectionVisible) handleScroll();
        },
        { rootMargin: '120px 0px' }
      );
      observer.observe(sectionRef.current);
    }

    const handleScroll = () => {
      if (!animFrameId && isSectionVisible) {
        animFrameId = requestAnimationFrame(updateWavyMovement);
      }
    };

    const handleResize = () => {
      updateMetrics();
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    updateMetrics();
    updateWavyMovement();

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-editorial-section relative w-full h-[230vh] lg:h-[270vh] scroll-mt-20"
      style={{ overflow: 'visible', background: '#FFFFFF' }}
    >
      {/* ─── Pinned Viewport Container (100dvh) ─── */}
      <div
        className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-between pt-24 pb-4 sm:pt-26 sm:pb-6 relative z-20"
        style={{
          background: '#FFFFFF',
          borderBottom: '1.5px solid #BFEFFF'
        }}
      >
        {/* ─── AMBIENT ATMOSPHERE & EDITORIAL WATERMARK (MENIADAKAN KESAN KOSONG) ─── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
          {/* Soft ambient radial glow di pojok kanan atas */}
          <div
            className="absolute -top-32 -right-32 w-[32rem] h-[32rem] rounded-full pointer-events-none opacity-40"
            style={{ background: 'radial-gradient(circle, rgba(191, 239, 255, 0.8) 0%, rgba(191, 239, 255, 0) 70%)' }}
          />
          {/* Soft ambient radial glow di pojok kiri bawah */}
          <div
            className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] rounded-full pointer-events-none opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(191, 239, 255, 0.7) 0%, rgba(191, 239, 255, 0) 70%)' }}
          />
          {/* Subtle architectural typographic watermark */}
          <div className="absolute right-4 top-16 text-[10rem] sm:text-[14rem] lg:text-[17rem] font-black text-[#1C6F8E]/[0.035] leading-none tracking-tighter uppercase font-sans select-none pointer-events-none">
            SIGAP
          </div>
        </div>

        {/* ─── SCENE 01: BALANCED EDITORIAL TITLE & KEY HIGHLIGHTS ─── */}
        <div
          ref={titleWrapperRef}
          className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-left z-30 flex-shrink-0 will-change-transform"
          style={{
            transform: 'translate3d(0, 0px, 0)'
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-8">
            <div ref={titleHeadingRef} className="will-change-transform origin-left">
              <h2 className="font-black tracking-tight leading-tight text-[#1C6F8E] text-left">
                <span className="text-2xl sm:text-4xl lg:text-5xl block">
                  <span className="tracking-tighter">Tentang Sistem</span>{' '}
                  <span className="tracking-tight text-[#142B4A]">
                    SI<span className="font-serif italic font-normal text-[#2E84A5]">G</span>AP
                  </span>
                </span>
                <span className="text-sm sm:text-lg lg:text-xl font-extrabold text-[#1C6F8E] block mt-0.5 tracking-normal">
                  Sistem Informasi Gawat Aduan Perundungan Sekolah
                </span>
              </h2>
            </div>

            {/* Sisi Kanan: Editorial Summary & 3 Micro Badges (Mengisi ruang yang sebelumnya kosong) */}
            <div className="hidden md:flex flex-col items-start lg:items-end text-left lg:text-right max-w-lg space-y-2.5">
              <p className="text-xs sm:text-[13px] font-medium text-[#093347]/85 leading-relaxed">
                Platform perlindungan terpadu yang memadukan kerahasiaan identitas penuh, respons tanggap Satgas PPKSP &amp; Guru BK, serta konseling psikososial berkeadilan.
              </p>
              <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2 pt-0.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F0F9FF] border border-[#BFEFFF] text-[11px] font-bold text-[#062331] shadow-xs">
                  <Lock className="w-3 h-3 text-[#1C6F8E]" />
                  <span>Enkripsi Anonim</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F0F9FF] border border-[#BFEFFF] text-[11px] font-bold text-[#062331] shadow-xs">
                  <CheckCircle2 className="w-3 h-3 text-[#1C6F8E]" />
                  <span>Respon Satgas 24/7</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F0F9FF] border border-[#BFEFFF] text-[11px] font-bold text-[#062331] shadow-xs">
                  <Sparkles className="w-3 h-3 text-[#1C6F8E]" />
                  <span>Permendikbudristek 46/2023</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── SCENE 02: CLEAN HORIZONTAL SLIDE & TOW ROPES CARDS SHOWCASE (WARNA BABY BLUE #BFEFFF) ─── */}
        <div className="w-full my-auto py-3 sm:py-5 relative z-20 overflow-visible">
          {/* Horizontal Reel Track: Bergerak Lurus DARI KIRI KE KANAN. 
              Urutan konvoi: [Card 4, Card 3, Card 2, Card 1]. 
              Saat bergerak ke kanan (+X), Card 1 (Filosofi) masuk ke layar paling awal dari kiri! */}
          <div
            ref={trackRef}
            className="flex items-center gap-8 sm:gap-10 lg:gap-12 will-change-transform select-none px-6 relative"
            style={{
              transform: 'translate3d(-100vw, 0px, 0px)'
            }}
          >
            {/* ─── DYNAMIC TOW ROPES CONNECTING ADJACENT CARDS ─── */}
            <svg
              className="absolute inset-0 pointer-events-none w-full h-full z-25 overflow-visible"
              style={{ overflow: 'visible' }}
            >
              {[0, 1, 2].map((idx) => (
                <g key={idx}>
                  {/* Rope Drop Shadow */}
                  <path
                    ref={(el) => (ropeShadowRefs.current[idx] = el)}
                    stroke="rgba(6, 35, 49, 0.22)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Main Solid Core Rope */}
                  <path
                    ref={(el) => (ropePathRefs.current[idx] = el)}
                    stroke="#062331"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Twisted Braided Fiber Accent */}
                  <path
                    ref={(el) => (ropeTwistRefs.current[idx] = el)}
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.9"
                  />
                </g>
              ))}
            </svg>

            {/* ── PANEL 4: EDITORIAL CALLOUT QUOTE (Baby Blue Card) ── */}
            <div
              ref={(el) => (cardRefs.current[0] = el)}
              className="flex-shrink-0 w-[280px] sm:w-[305px] lg:w-[320px] h-[430px] sm:h-[450px] rounded-3xl p-6 sm:p-7 flex flex-col justify-between group cursor-pointer border-2 shadow-sm hover:shadow-xl transition-shadow relative overflow-visible will-change-transform select-none"
              style={{
                background: 'linear-gradient(180deg, #BFEFFF 0%, #B2EAFE 100%)',
                borderColor: 'rgba(6, 35, 49, 0.14)',
                boxShadow: '0 16px 36px rgba(191, 239, 255, 0.65)'
              }}
            >
              {/* Right Tow Eyelet Ring */}
              <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#062331] border-2 border-[#FFFFFF] shadow-md z-30 flex items-center justify-center pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-[#BFEFFF]" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs"
                    style={{ background: '#FFFFFF', border: '1px solid rgba(6, 35, 49, 0.15)' }}
                  >
                    <Sparkles className="w-5 h-5 text-[#062331]" />
                  </div>
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#062331]">
                    04 // KOMITMEN
                  </span>
                </div>
                <blockquote className="text-sm sm:text-[15px] font-bold italic leading-relaxed text-[#062331]">
                  "Tidak ada satu siswa pun yang layak merasa takut saat menuntut ilmu di sekolah."
                </blockquote>
                <p className="text-xs font-semibold text-[#093347]">
                  Satuan Tugas PPKSP &amp; Bimbingan Konseling SIGAP.
                </p>
              </div>

              <div className="pt-4 border-t mt-4" style={{ borderColor: 'rgba(6, 35, 49, 0.2)' }}>
                <p className="text-[11px] font-medium text-[#093347]">
                  Layanan Advokasi dan Penanganan Ramah Anak 24/7
                </p>
              </div>
            </div>

            {/* ── PANEL 3: KONSELING TERPADU / TERVERIFIKASI (Baby Blue Card) ── */}
            <div
              ref={(el) => (cardRefs.current[1] = el)}
              className="flex-shrink-0 w-[290px] sm:w-[320px] lg:w-[340px] h-[430px] sm:h-[450px] rounded-3xl p-6 sm:p-7 flex flex-col justify-between group cursor-pointer border-2 shadow-sm hover:shadow-xl transition-shadow relative overflow-visible will-change-transform select-none"
              style={{
                background: 'linear-gradient(180deg, #BFEFFF 0%, #B2EAFE 100%)',
                borderColor: 'rgba(6, 35, 49, 0.14)',
                boxShadow: '0 16px 36px rgba(191, 239, 255, 0.65)'
              }}
            >
              {/* Left Tow Eyelet Ring */}
              <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#062331] border-2 border-[#FFFFFF] shadow-md z-30 flex items-center justify-center pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-[#BFEFFF]" />
              </div>
              {/* Right Tow Eyelet Ring */}
              <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#062331] border-2 border-[#FFFFFF] shadow-md z-30 flex items-center justify-center pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-[#BFEFFF]" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-xs"
                    style={{ background: '#FFFFFF', color: '#062331', border: '1px solid rgba(6, 35, 49, 0.15)' }}
                  >
                    <UserCheck className="w-5 h-5 text-[#062331]" />
                  </div>
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#062331]">
                    03 // TERVERIFIKASI
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#062331]">
                  Pelaporan Terverifikasi
                </h3>
                <p className="text-xs sm:text-[13px] mt-1.5 leading-relaxed text-[#093347]">
                  Direkomendasikan untuk pendampingan konseling intensif dan advokasi berkelanjutan oleh Guru BK &amp; Satgas.
                </p>

                <ul className="mt-3.5 space-y-2 text-xs sm:text-[12.5px] text-[#093347]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#062331]" />
                    <span><strong className="text-[#062331]">Dashboard Terpadu:</strong> Pantau riwayat aduan &amp; catatan konselor.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#062331]" />
                    <span><strong className="text-[#062331]">Konseling BK:</strong> Sesi privat terarah dan aman.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#062331]" />
                    <span><strong className="text-[#062331]">Satgas PPKSP:</strong> Intervensi resmi penanganan kasus.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t mt-4 flex gap-2" style={{ borderColor: 'rgba(6, 35, 49, 0.2)' }}>
                <button
                  type="button"
                  onClick={(e) => handleReportAction(e, '/buat-laporan')}
                  className="flex-1 py-2.5 px-2 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition hover:opacity-95 shadow-xs border"
                  style={{ background: '#062331', borderColor: '#062331', color: '#FFFFFF' }}
                >
                  <LogIn className="w-3.5 h-3.5 text-white" />
                  <span>Buat Aduan</span>
                </button>
                <Link
                  to="/register?redirect=/buat-laporan"
                  className="py-2.5 px-3 rounded-2xl font-bold text-xs sm:text-sm text-center border transition hover:opacity-90 shadow-xs"
                  style={{ color: '#062331', border: '1.5px solid rgba(6, 35, 49, 0.25)', background: '#FFFFFF' }}
                >
                  Daftar
                </Link>
              </div>
            </div>

            {/* ── PANEL 2: MODE ANONIM (Baby Blue Card) ── */}
            <div
              ref={(el) => (cardRefs.current[2] = el)}
              className="flex-shrink-0 w-[290px] sm:w-[320px] lg:w-[340px] h-[430px] sm:h-[450px] rounded-3xl p-6 sm:p-7 flex flex-col justify-between group cursor-pointer border-2 shadow-sm hover:shadow-xl transition-shadow relative overflow-visible will-change-transform select-none"
              style={{
                background: 'linear-gradient(180deg, #BFEFFF 0%, #B2EAFE 100%)',
                borderColor: 'rgba(6, 35, 49, 0.14)',
                boxShadow: '0 16px 36px rgba(191, 239, 255, 0.65)'
              }}
            >
              {/* Left Tow Eyelet Ring */}
              <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#062331] border-2 border-[#FFFFFF] shadow-md z-30 flex items-center justify-center pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-[#BFEFFF]" />
              </div>
              {/* Right Tow Eyelet Ring */}
              <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#062331] border-2 border-[#FFFFFF] shadow-md z-30 flex items-center justify-center pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-[#BFEFFF]" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-xs"
                    style={{ background: '#FFFFFF', color: '#062331', border: '1px solid rgba(6, 35, 49, 0.15)' }}
                  >
                    <EyeOff className="w-5 h-5 text-[#062331]" />
                  </div>
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#062331]">
                    02 // ANONIMITAS
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#062331]">
                  Pelaporan Anonim
                </h3>
                <p className="text-xs sm:text-[13px] mt-1.5 leading-relaxed text-[#093347]">
                  Bagi siswa, saksi, atau korban yang khawatir diintimidasi. Identitas nama dan NISN Anda tidak dicantumkan ke publik.
                </p>

                <ul className="mt-3.5 space-y-2 text-xs sm:text-[12.5px] text-[#093347]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#062331]" />
                    <span><strong className="text-[#062331]">100% Bebas Identitas Publik:</strong> Tanpa nama lengkap terekspos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#062331]" />
                    <span><strong className="text-[#062331]">Kode Tiket Rahasia:</strong> Lacak progres kasus secara mandiri.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#062331]" />
                    <span><strong className="text-[#062331]">Bebas Intimidasi:</strong> Dijamin zero-retaliation sekolah.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t mt-4" style={{ borderColor: 'rgba(6, 35, 49, 0.2)' }}>
                <button
                  type="button"
                  onClick={(e) => handleReportAction(e, '/buat-laporan')}
                  className="w-full py-2.5 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer border transition hover:opacity-90 shadow-xs"
                  style={{ background: '#FFFFFF', color: '#062331', border: '1.5px solid rgba(6, 35, 49, 0.25)' }}
                >
                  <span>Mulai Lapor Anonim</span>
                  <ArrowRight className="w-4 h-4 text-[#062331]" />
                </button>
              </div>
            </div>

            {/* ── PANEL 1: FILOSOFI & LANDASAN (Baby Blue Card - Masuk paling awal!) ── */}
            <div
              ref={(el) => (cardRefs.current[3] = el)}
              className="flex-shrink-0 w-[290px] sm:w-[320px] lg:w-[340px] h-[430px] sm:h-[450px] rounded-3xl p-6 sm:p-7 flex flex-col justify-between group cursor-pointer border-2 shadow-sm hover:shadow-xl transition-shadow relative overflow-visible will-change-transform select-none"
              style={{
                background: 'linear-gradient(180deg, #BFEFFF 0%, #B2EAFE 100%)',
                borderColor: 'rgba(6, 35, 49, 0.14)',
                boxShadow: '0 16px 36px rgba(191, 239, 255, 0.65)'
              }}
            >
              {/* Left Tow Eyelet Ring */}
              <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#062331] border-2 border-[#FFFFFF] shadow-md z-30 flex items-center justify-center pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-[#BFEFFF]" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-xs"
                    style={{ background: '#FFFFFF', color: '#062331', border: '1px solid rgba(6, 35, 49, 0.15)' }}
                  >
                    <Shield className="w-5 h-5 text-[#062331]" />
                  </div>
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#062331]">
                    01 // FILOSOFI &amp; REGULASI
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug text-[#062331]">
                  Landasan Regulasi &amp; Perlindungan
                </h3>

                <p className="text-xs sm:text-[13px] leading-relaxed text-[#093347]">
                  Berakar pada amanat <strong>Permendikbudristek No. 46/2023</strong>, kami memadukan ketegasan regulasi, jaminan privasi, dan pendekatan humanis demi rasa aman seluruh pelajar.
                </p>
              </div>

              {/* Editorial Pillars */}
              <div className="pt-4 border-t mt-4 grid grid-cols-2 gap-3" style={{ borderColor: 'rgba(6, 35, 49, 0.2)' }}>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#062331]">
                    <Lock className="w-3.5 h-3.5 text-[#062331]" />
                    <span>Zero Retaliation</span>
                  </div>
                  <p className="text-[10.5px] leading-tight text-[#093347]">
                    Perlindungan hukum dan privasi penuh pelapor.
                  </p>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#062331]">
                    <HeartHandshake className="w-3.5 h-3.5 text-[#062331]" />
                    <span>Pendampingan</span>
                  </div>
                  <p className="text-[10.5px] leading-tight text-[#093347]">
                    Konseling privat dan pemulihan komprehensif.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutEditorialShowcase;
