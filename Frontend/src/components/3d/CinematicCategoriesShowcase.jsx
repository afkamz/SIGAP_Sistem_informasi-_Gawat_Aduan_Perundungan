import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  MessageSquareWarning,
  ShieldAlert,
  Laptop,
  AlertTriangle,
  UserX,
  Users,
  Ban,
  HeartHandshake
} from 'lucide-react';
import { KATEGORI_DATA } from '../../data/categories';

/**
 * =========================================================================
 * SIGAP — RIGHT TO LEFT WAVY CINEMATIC CARD ANIMATION
 * (INSPIRASI SM ENTERTAINMENT AUDITION SHOWCASE)
 * =========================================================================
 * Rangkaian 8 kartu kategori SIGAP yang melayang horizontal dari kanan ke kiri
 * dengan gerakan vertikal naik-turun sinusoidal (wavy / gelombang).
 *
 * FITUR UTAMA:
 *  1. INITIAL STATE: Di awal seksi, seluruh kartu berada di luar batas kanan
 *     viewport (startX = window.innerWidth + 80px). Tidak ada kartu terlihat.
 *  2. RIGHT TO LEFT: Kartu masuk satu per satu dari kanan ke kiri secara kontinu.
 *  3. WAVY MOVEMENT (GERAKAN NAIK TURUN GELOMBANG):
 *     - Kartu genap (Card 1, 3, 5, 7): bergerak dari bawah menuju atas.
 *     - Kartu ganjil (Card 2, 4, 6, 8): bergerak dari atas menuju bawah.
 *     - Transformasi sinematik terintegrasi: translateY (gelombang), rotateZ (kemiringan),
 *       dan scale (fokus di tengah).
 *  4. GRAYSCALE TO FULL COLOR ON HOVER:
 *     - Kondisi normal: Media kartu grayscale 100%.
 *     - Saat kursor hover ke gambar: Full color (grayscale 0% + brightness 105%),
 *       transisi 600ms sangat halus.
 *     - Hover TIDAK memengaruhi posisi, rotasi, atau lintasan gerak kartu.
 *  5. PINNED SCROLL SEJATI (480vh):
 *     - Section tertahan sticky 100dvh hingga seluruh kartu menyelesaikan lintasannya.
 *     - Lepas secara natural ke seksi berikutnya (#safety) setelah 100%.
 *  6. INTERAKTIF:
 *     - Seluruh kartu dapat diklik untuk memilih kategori pelaporan aduan.
 * =========================================================================
 */

// Helper Hermite Smoothstep Easing
const smoothStep = (min, max, value) => {
  if (value <= min) return 0;
  if (value >= max) return 1;
  const x = (value - min) / (max - min);
  return x * x * (3 - 2 * x);
};

// Pemetaan gambar lokal untuk setiap kategori (/assets/cards/nama-file.jpg)
const CARD_IMAGE_MAP = {
  1: '/assets/cards/verbal.jpg',
  2: '/assets/cards/fisik.jpg',
  3: '/assets/cards/perundungan.jpg', // Perundungan Siber / Cyberbullying
  4: '/assets/cards/seksual.jpg',
  5: '/assets/cards/kebijakan.jpg',  // Hukuman Fisik oleh Tenaga Pendidik / Kebijakan
  6: '/assets/cards/psikis.jpg',     // Kekerasan Psikis / Pengucilan Sosial
  7: '/assets/cards/diskriminasi.jpg' // Penyalahgunaan / Diskriminasi
};

// Data kartu ke-8: Layanan Konseling & Keluhan Khusus
const EXTRA_COUNSELING_CARD = {
  id: null,
  nama: 'Konseling & Keluhan Lainnya',
  deskripsi: 'Tidak yakin insiden Anda masuk kategori mana? Tim AI SIGAP dan Guru BK akan membantu mengidentifikasi dan mencarikan solusi terbaik.',
  icon: 'HeartHandshake',
  tag: 'BANTUAN // 08',
  count: 'SIAP BANTU',
  benchmark: '24/7',
  image: '/assets/cards/konseling.jpg'
};

// Gabungan 8 kartu resmi SIGAP
const ALL_CARDS = [
  ...KATEGORI_DATA.map((k) => ({
    ...k,
    tag: `KATEGORI // 0${k.id}`,
    image: CARD_IMAGE_MAP[k.id] || null
  })),
  EXTRA_COUNSELING_CARD
];

export const CinematicCategoriesShowcase = ({ onSelectCategory }) => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const cachedMetricsRef = useRef(null);

  // Helper render icon kategori
  const renderCategoryIcon = (iconName, color) => {
    const props = { className: 'w-5 h-5 text-white' };
    switch (iconName) {
      case 'MessageSquareWarning': return <MessageSquareWarning {...props} />;
      case 'ShieldAlert': return <ShieldAlert {...props} />;
      case 'Laptop': return <Laptop {...props} />;
      case 'AlertTriangle': return <AlertTriangle {...props} />;
      case 'UserX': return <UserX {...props} />;
      case 'Users': return <Users {...props} />;
      case 'Ban': return <Ban {...props} />;
      case 'HeartHandshake': return <HeartHandshake {...props} />;
      default: return <ShieldAlert {...props} />;
    }
  };

  // ─── HIGH-PERFORMANCE ZERO-LAG WAVY SCROLL ANIMATION ENGINE ───
  useEffect(() => {
    let animFrameId = null;

    // Cache dimensi & offset fisik kartu saat mount / resize (eliminasi layout thrashing)
    const updateMetrics = () => {
      if (!sectionRef.current || !trackRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const scrollableDistance = rect.height - viewportHeight;
      const isMobile = viewportWidth < 768;
      const cardWidth = isMobile ? 290 : 350;
      const trackWidth = trackRef.current.scrollWidth;
      const startX = viewportWidth + (isMobile ? 50 : 100);
      const endPadding = isMobile ? 24 : Math.min(140, viewportWidth * 0.12);
      const endX = -(trackWidth - viewportWidth + endPadding);

      const offsets = cardRefs.current.map((cardEl) => (cardEl ? cardEl.offsetLeft : 0));

      cachedMetricsRef.current = {
        viewportHeight,
        viewportWidth,
        scrollableDistance,
        isMobile,
        cardWidth,
        startX,
        endX,
        offsets
      };
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

      // ─── 1. TIMELINE ALOKASI RESMI (0–100%) ───
      // Interpolasi gerakan horizontal kontinu (10% s.d. 80%)
      const flightP = smoothStep(0.10, 0.80, progress);
      const currentTrackX = startX + (endX - startX) * flightP;

      // Terapkan translasi track horizontal utama
      trackRef.current.style.transform = `translate3d(${currentTrackX.toFixed(1)}px, 0px, 0px)`;

      // ─── 2. WAVY MOVEMENT (GERAKAN NAIK TURUN GELOMBANG PER KARTU) ───
      const maxAmpY = isMobile ? 26 : 48;
      const maxRotZ = isMobile ? 2.2 : 3.8;
      const screenCenter = viewportWidth / 2;

      // Iterasi setiap kartu untuk menghitung posisi vertikal bergelombang & rotasi dinamis
      cardRefs.current.forEach((cardEl, index) => {
        if (!cardEl) return;

        const cardOffset = offsets[index] !== undefined ? offsets[index] : cardEl.offsetLeft;
        const cardScreenX = currentTrackX + cardOffset;
        const cardCenter = cardScreenX + cardWidth / 2;

        // Posisi normalisasi layar (u = +1 saat masuk di kanan, 0 di tengah, -1 saat di kiri)
        const u = (cardCenter - screenCenter) / (viewportWidth / 2);

        // Hanya hitung transformasi kartu yang berada di sekitar layar (-1.8 <= u <= 1.8)
        if (u < -1.8 || u > 1.8) {
          cardEl.style.transform = 'translate3d(0, 0, 0)';
          return;
        }

        // Kartu genap (1, 3, 5, 7): bergerak dari bawah menuju atas
        // Kartu ganjil (2, 4, 6, 8): bergerak dari atas menuju bawah
        const direction = index % 2 === 0 ? 1 : -1;
        const waveBase = Math.sin((u * Math.PI) / 2);
        const harmonic = Math.sin(u * Math.PI * 1.5) * (maxAmpY * 0.20);
        const finalY = direction * waveBase * maxAmpY + harmonic;
        const rotZ = direction * Math.cos((u * Math.PI) / 2) * maxRotZ;
        const focusFactor = 1 - Math.min(1, Math.abs(u));
        const scale = 1.0 + focusFactor * (isMobile ? 0.02 : 0.035);

        // Terapkan GPU transform murni
        cardEl.style.transform = `translate3d(0, ${finalY.toFixed(1)}px, 0) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      });
    };

    const handleScroll = () => {
      if (!animFrameId) {
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
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      id="media"
      ref={sectionRef}
      className="categories-scroll-section relative w-full h-[480vh]"
      style={{ overflow: 'visible' }}
    >
      {/* ─── Pinned Sticky Stage (100dvh Viewport) ─── */}
      <div
        className="categories-sticky-stage sticky top-0 w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-between py-5 sm:py-7 relative z-20 bg-transparent"
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '100dvh',
          zIndex: 20
        }}
      >
        {/* ─── SCENE 01: SECTION HEADER (Fokus Editorial Kategori Resmi) ─── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-6 sm:pt-8 z-10 flex-shrink-0">
          <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-black tracking-tight leading-tight" style={{ color: '#1C6F8E' }}>
            7 Bentuk Kekerasan Sesuai Permendikbudristek 46/2023
          </h2>

          <p className="text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl mx-auto mt-1.5 font-medium" style={{ color: '#2E84A5' }}>
            SIGAP mencakup seluruh spektrum bentuk kekerasan di lingkungan pendidikan sesuai regulasi nasional. Kenali bentuknya dan laporkan tanpa ragu.
          </p>
        </div>

        {/* ─── SCENE 02 & 03: WAVY RIGHT-TO-LEFT CINEMATIC REEL ─── */}
        <div
          className="w-full my-auto py-6 sm:py-8 relative z-20 overflow-visible"
          style={{
            perspective: '1400px',
            perspectiveOrigin: '50% 50%'
          }}
        >
          {/* Horizontal Reel Track: Bergerak dari kanan ke kiri, awal berada di luar layar */}
          <div
            ref={trackRef}
            className="flex items-center gap-7 sm:gap-10 lg:gap-12 will-change-transform select-none px-6"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translate3d(100vw, 0px, 0px)'
            }}
          >
            {ALL_CARDS.map((card, index) => {
              const isCounseling = card.id === null;

              // Alternating Baby Blue and White themes for cards (Solid, No Gradasi)
              const cardBg = isCounseling
                ? '#BFEFFF'
                : index % 2 === 1
                ? '#BFEFFF'
                : '#FFFFFF';

              const cardBorder = '#BFEFFF';

              return (
                <div
                  key={card.id ?? 'counseling'}
                  ref={(el) => (cardRefs.current[index] = el)}
                  onClick={() => onSelectCategory && onSelectCategory(card.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectCategory && onSelectCategory(card.id);
                    }
                  }}
                  className={`flex-shrink-0 w-[290px] sm:w-[330px] lg:w-[350px] h-[430px] sm:h-[450px] rounded-3xl p-5 sm:p-6 flex flex-col justify-between group cursor-pointer border-2 shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#BFEFFF] relative overflow-hidden will-change-transform`}
                  style={{
                    background: cardBg,
                    borderColor: cardBorder
                  }}
                  aria-label={`Pilih kategori ${card.nama}`}
                >
                  {/* ─── EFEK UTAMA: GRAYSCALE TO FULL COLOR ON HOVER ─── */}
                  {/* Media Banner Bergaya Editorial dengan Filter Grayscale 100% -> 0% saat hover */}
                  <div
                    className="relative w-full h-[180px] sm:h-[195px] rounded-2xl overflow-hidden mb-4 transition-all duration-500 ease-out filter grayscale group-hover:grayscale-0 group-hover:brightness-105 group-hover:scale-[1.02]"
                    style={{
                      background: '#BFEFFF'
                    }}
                  >
                    {/* Gambar Lokal per Kategori dengan Fallback */}
                    {card.image && (
                      <img
                        src={card.image}
                        alt={card.nama}
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}

                    {/* Solid Dark Overlay Bawah untuk Keterbacaan Teks */}
                    <div className="absolute inset-x-0 bottom-0 h-14 bg-black/50 z-10" />

                    {/* Category Icon */}
                    <div className="absolute top-3.5 left-3.5 z-20 flex items-center">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#1C6F8E] shadow-md border border-white/40 group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: '#BFEFFF' }}
                      >
                        {renderCategoryIcon(card.icon, '#1C6F8E')}
                      </div>
                    </div>

                    {/* Large Background Watermark Number (#01-#08) */}
                    <div className="absolute -bottom-4 -right-2 text-[80px] font-black font-mono text-white/20 select-none leading-none pointer-events-none z-15">
                      {isCounseling ? '08' : `0${card.id}`}
                    </div>
                  </div>

                  {/* ─── KONTEN INFORMASI KATEGORI ─── */}
                  <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        className="text-base sm:text-lg font-black tracking-tight leading-snug transition-colors duration-300 text-[#1C6F8E] group-hover:text-[#2E84A5]"
                      >
                        {card.nama}
                      </h3>
                      <p
                        className="text-xs mt-1.5 leading-relaxed line-clamp-3 font-medium text-[#2E84A5]"
                      >
                        {card.deskripsi}
                      </p>
                    </div>

                    {/* Footer Kartu & Tombol Aksi Pelaporan */}
                    <div
                      className="pt-3.5 mt-3 border-t flex items-center justify-between border-[#BFEFFF]/40"
                    >
                      <span
                        className="text-xs font-extrabold flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform duration-300 text-[#1C6F8E] group-hover:text-[#2E84A5]"
                      >
                        <span>{isCounseling ? 'Mulai Konsultasi Aduan' : 'Laporkan Insiden Ini'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clean bottom padding without decorative clutter */}
        <div className="w-full h-4 sm:h-6 flex-shrink-0" />
      </div>
    </section>
  );
};

export default CinematicCategoriesShowcase;
