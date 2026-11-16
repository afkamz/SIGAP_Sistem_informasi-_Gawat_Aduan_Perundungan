import React, { useEffect, useRef } from 'react';
import { Shield, Sparkles, EyeOff, Lock, CheckCircle2, HeartHandshake } from 'lucide-react';

/**
 * =========================================================================
 * SIGAP — HIGH-PERFORMANCE SCROLL-DRIVEN 3D PHOTO CUBE
 * =========================================================================
 * Objek visual 3D 6-sisi mandiri: Front, Back, Left, Right, Top, Bottom.
 *
 * OPTIMASI PERFORMA & TIMELINE PRESISI (60-120 FPS):
 *   1. TIMELINE 5 TAHAPAN (0% - 100%):
 *      - Scene 01 (0–15%)  : Initial State — Relatif kecil (scale ~0.65), sisi kanan (+340px).
 *      - Scene 02 (15–35%) : Scale Up — Membesar bertahap, perspektif mulai terlihat.
 *      - Scene 03 (35–60%) : Move to Center — Bergerak ke tengah, skala dominan (1.20x).
 *      - Scene 04 (60–85%) : Move Upward — Bergerak melayang naik ke atas (-36vh), skala ~0.80x.
 *      - Scene 05 (85–100%): Final Transition — Mencapai posisi akhir 100% sebelum seksi berikutnya.
 *
 *   2. ZERO-LAG RENDERING ARCHITECTURE:
 *      - Menggunakan scrollProgressRef (bebas re-render loop RAF saat scroll).
 *      - 3 Node Transform terpisah: positionRef, scaleRef, rotationRef.
 *      - Caching dimensi viewport via passive resize listener (hindari layout thrashing).
 *      - Penghentian otomatis loop RAF saat tab tidak aktif (Page Visibility API).
 *      - Backdrop-filter dioptimalkan ke blur(8px) untuk mencegah GPU bottleneck.
 *      - Tanpa mousemove / pointer interaction / hover effect sama sekali.
 * =========================================================================
 */

export const DEFAULT_CUBE_FACES = [
  {
    id: 'front',
    type: 'video',
    mediaSrc: '/assets/cube/video-1.mp4',
    label: 'SURFACE 01',
    title: 'SUARAKAN KEBENARAN',
    subtitle: 'Keberanian Melangkah Bersama',
    tag: 'VOICE // 01',
    icon: 'Shield',
    accent: '#BFEFFF',
    quote: 'Speak with courage. Every student matters.'
  },
  {
    id: 'back',
    type: 'video',
    mediaSrc: '/assets/cube/video-2.mp4',
    label: 'SURFACE 02',
    title: 'ANONYMOUS SHIELD',
    subtitle: 'Kerahasiaan Data Terenkripsi',
    tag: 'SHIELD // 02',
    icon: 'EyeOff',
    accent: '#BFEFFF',
    quote: '100% anonim sesuai kenyamanan Anda.'
  },
  {
    id: 'right',
    type: 'video',
    mediaSrc: '/assets/cube/video-3.mp4',
    label: 'SURFACE 03',
    title: 'ZERO RETALIATION',
    subtitle: 'Proteksi Penuh Tanpa Takut',
    tag: 'SAFE // 03',
    icon: 'Lock',
    accent: '#BFEFFF',
    quote: 'Dijamin perlindungan mutlak anti-intimidasi.'
  },
  {
    id: 'left',
    type: 'video',
    mediaSrc: '/assets/cube/video-4.mp4',
    label: 'SURFACE 04',
    title: 'AI SMART TRIASE',
    subtitle: 'Pemetaan Cerdas IndoBERT',
    tag: 'TRIASE // 04',
    icon: 'Sparkles',
    accent: '#BFEFFF',
    quote: '7 Kategori Permendikbudristek No. 46/2023.'
  },
  {
    id: 'top',
    type: 'video',
    mediaSrc: '/assets/cube/video-5.mp4',
    label: 'SURFACE 05',
    title: 'SAFE SANCTUARY',
    subtitle: 'Ruang Pendidikan Merdeka',
    tag: 'SANCTUARY // 05',
    icon: 'HeartHandshake',
    accent: '#BFEFFF',
    quote: 'Menciptakan ekosistem sekolah yang sehat.'
  },
  {
    id: 'bottom',
    type: 'image',
    mediaSrc: '/assets/cube/photo-1.jpg',
    label: 'SURFACE 06',
    title: 'AUDIT & INTEGRITY',
    subtitle: 'Tindakan Terpercaya Satgas BK',
    tag: 'INTEGRITY // 06',
    icon: 'CheckCircle2',
    accent: '#BFEFFF',
    quote: 'Audit trail digital transparan dan akuntabel.'
  }
];

// Helper interpolasi matematika smoothstep (Hermite easing)
const smoothStep = (min, max, value) => {
  if (value <= min) return 0;
  if (value >= max) return 1;
  const x = (value - min) / (max - min);
  return x * x * (3 - 2 * x);
};

export const InteractivePhotoCube = ({
  faces = DEFAULT_CUBE_FACES,
  scrollProgress = 0, // 0.0 s.d. 1.0 dari parent scroll stage
  className = ''
}) => {
  // DOM element refs untuk manipulasi matriks langsung di RAF tanpa re-render React
  const positionRef = useRef(null);
  const scaleRef = useRef(null);
  const rotationRef = useRef(null);
  const shadowRef = useRef(null);

  // Simpan scrollProgress dalam ref agar rendering loop selalu mendapatkan nilai terkini tanpa jeda
  const scrollProgressRef = useRef(scrollProgress);
  scrollProgressRef.current = scrollProgress;

  // Nilai fisik lerp (current vs target) murni scroll dengan posisi awal 3D miring showcase
  const animState = useRef({
    curTx: 300,
    curTy: 0,
    curScale: 0.68,
    curRotX: -18,
    curRotY: 26,
    autoRotY: 0
  });

  const animFrameId = useRef(null);

  // Helper render ikon untuk tiap sisi
  const renderIcon = (iconName, accent) => {
    const props = { className: 'w-5 h-5', style: { color: accent || '#BFEFFF' } };
    switch (iconName) {
      case 'Shield': return <Shield {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'EyeOff': return <EyeOff {...props} />;
      case 'Lock': return <Lock {...props} />;
      case 'HeartHandshake': return <HeartHandshake {...props} />;
      case 'CheckCircle2': return <CheckCircle2 {...props} />;
      default: return <Shield {...props} />;
    }
  };

  // ─── 60–120 FPS KINEMATIC LOOP (SINGLE MOUNTED LIFECYCLE) ───
  useEffect(() => {
    // Cache viewport dimensions via passive resize listener untuk hindari layout thrashing
    let viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
    let viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    const handleResize = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    let lastTime = performance.now();
    let isTabVisible = true;

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        lastTime = performance.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const renderLoop = (time) => {
      if (!isTabVisible) {
        animFrameId.current = requestAnimationFrame(renderLoop);
        return;
      }

      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      const st = animState.current;
      const p = Math.max(0, Math.min(1, scrollProgressRef.current));
      const isMobile = viewportWidth < 1024;

      // ─────────────────────────────────────────────────────────────
      // TIMELINE SCROLL-DRIVEN 3D SHOWCASE (0% - 100%):
      // 0.00–0.08: Transisi dari sudut isometrik 3D miring awal (-18°, 26°) ke FRONT
      // 0.08–0.16: FRONT (Surface 01 - video-1.mp4)
      // 0.16–0.32: Transisi & RIGHT (Surface 03 - video-3.mp4)
      // 0.32–0.48: Transisi & BACK (Surface 02 - video-2.mp4)
      // 0.48–0.64: Transisi & LEFT (Surface 04 - video-4.mp4)
      // 0.64–0.80: Transisi & TOP (Surface 05 - video-5.mp4)
      // 0.80–0.94: Transisi & BOTTOM (Surface 06 - photo-1.jpg)
      // 0.94–1.00: Transisi kembali ke FRONT & penahanan posisi akhir
      // ─────────────────────────────────────────────────────────────

      // 1. POSISI X (Kanan ke Tengah Secara Sinematik)
      const initialOffsetX = isMobile ? Math.min(100, viewportWidth * 0.15) : Math.min(320, viewportWidth * 0.24);
      const pMoveCenter = smoothStep(0.00, 0.20, p);
      const targetTx = (1 - pMoveCenter) * initialOffsetX;

      // 2. SKALA (Showcase Scale Up di Tengah Panggung)
      const baseSmallScale = isMobile ? 0.60 : 0.68;
      const peakCenterScale = isMobile ? 1.02 : 1.10;
      const pScaleUp = smoothStep(0.00, 0.22, p);
      const pScaleSettle = smoothStep(0.94, 1.00, p);
      const targetScale = (baseSmallScale + (peakCenterScale - baseSmallScale) * pScaleUp) * (1 - 0.05 * pScaleSettle);

      // 3. POSISI Y (Elevasi Halus / Floating Pedestal Tanpa Terpotong Navbar)
      const pElevate = smoothStep(0.12, 0.25, p) * (1 - smoothStep(0.92, 0.98, p));
      const targetTy = -20 * pElevate;

      // 4. ROTASI SCROLL MULTI-AXIS SINEMATIK:
      let targetRotX = 0;
      let targetRotY = 0;

      if (p <= 0.08) {
        // [Hero Initial Showcase Pose] Kubus tampil miring 3D artistik dengan perspektif jelas
        const t = smoothStep(0.00, 0.08, p);
        targetRotX = -18 * (1 - t);
        targetRotY = 26 * (1 - t);
      } else if (p <= 0.16) {
        // ─────────────────────────────────────────────
        // 1. FRONT FACE (Surface 01 - video-1.mp4)
        // Dwell 8–16%: Sisi Front menghadap penuh ke arah pengguna
        // ─────────────────────────────────────────────
        targetRotX = 0;
        targetRotY = 0;
      } else if (p <= 0.24) {
        // Transisi Horizontal 1: FRONT -> RIGHT
        const t = smoothStep(0.16, 0.24, p);
        targetRotX = 0;
        targetRotY = -90 * t; // 0 -> -90 deg
      } else if (p <= 0.32) {
        // ─────────────────────────────────────────────
        // 2. RIGHT FACE (Surface 03 - video-3.mp4)
        // Dwell 24–32%: Sisi Right menghadap penuh ke arah pengguna
        // ─────────────────────────────────────────────
        targetRotX = 0;
        targetRotY = -90;
      } else if (p <= 0.40) {
        // Transisi Horizontal 2: RIGHT -> BACK
        const t = smoothStep(0.32, 0.40, p);
        targetRotX = 0;
        targetRotY = -90 - 90 * t; // -90 -> -180 deg
      } else if (p <= 0.48) {
        // ─────────────────────────────────────────────
        // 3. BACK FACE (Surface 02 - video-2.mp4)
        // Dwell 40–48%: Sisi Back menghadap penuh di pusat layar
        // ─────────────────────────────────────────────
        targetRotX = 0;
        targetRotY = -180;
      } else if (p <= 0.56) {
        // Transisi Horizontal 3: BACK -> LEFT
        const t = smoothStep(0.48, 0.56, p);
        targetRotX = 0;
        targetRotY = -180 - 90 * t; // -180 -> -270 deg
      } else if (p <= 0.64) {
        // ─────────────────────────────────────────────
        // 4. LEFT FACE (Surface 04 - video-4.mp4)
        // Dwell 56–64%: Sisi Left menghadap penuh ke arah pengguna
        // ─────────────────────────────────────────────
        targetRotX = 0;
        targetRotY = -270;
      } else if (p <= 0.72) {
        // Transisi Horizontal & Pitch: Melengkapi rotasi ke -360 deg dan rotasi X ke -90 deg (TOP)
        const t = smoothStep(0.64, 0.72, p);
        targetRotX = -90 * t; // 0 -> -90 deg
        targetRotY = -270 - 90 * t; // -270 -> -360 deg
      } else if (p <= 0.80) {
        // ─────────────────────────────────────────────
        // 5. TOP FACE (Surface 05 - video-5.mp4)
        // Dwell 72–80%: Sisi Top menghadap penuh dari atas
        // ─────────────────────────────────────────────
        targetRotX = -90;
        targetRotY = -360;
      } else if (p <= 0.88) {
        // Transisi Vertikal: TOP -> BOTTOM FACE (Rotasi vertikal -90 deg -> +90 deg)
        const t = smoothStep(0.80, 0.88, p);
        targetRotX = -90 + 180 * t; // -90 -> +90 deg
        targetRotY = -360;
      } else if (p <= 0.94) {
        // ─────────────────────────────────────────────
        // 6. BOTTOM FACE (Surface 06 - photo-1.jpg)
        // Dwell 88–94%: Sisi Bottom menghadap penuh dari bawah
        // ─────────────────────────────────────────────
        targetRotX = 90;
        targetRotY = -360;
      } else if (p <= 0.98) {
        // Transisi Vertikal: BOTTOM -> Kembali ke FRONT
        const t = smoothStep(0.94, 0.98, p);
        targetRotX = 90 * (1 - t); // +90 -> 0 deg
        targetRotY = -360;
      } else {
        // ─────────────────────────────────────────────
        // 7. KEMBALI KE FRONT FACE & PENAHANAN POSISI AKHIR
        // Dwell 98–100%: Kubus stabil 100% menghadap FRONT sebelum sticky dilepas alami
        // ─────────────────────────────────────────────
        targetRotX = 0;
        targetRotY = -360;
      }

      // 5. RESPONSIVE ZERO-LAG KINEMATIC INTERPOLATION
      // Adaptif terhadap kecepatan scroll: jika scroll cepat (delta besar), lerp otomatis naik hingga 1.0 (instan)
      // sehingga animasi kubus tidak pernah tertinggal dari pergerakan scroll pengguna.
      const diffRot = Math.max(Math.abs(targetRotX - st.curRotX), Math.abs(targetRotY - st.curRotY));
      const lerpRot = Math.min(1.0, 0.45 + diffRot * 0.05);

      st.curRotX += (targetRotX - st.curRotX) * lerpRot;
      st.curRotY += (targetRotY - st.curRotY) * lerpRot;

      const diffPos = Math.max(Math.abs(targetTx - st.curTx), Math.abs(targetTy - st.curTy));
      const lerpPos = Math.min(1.0, 0.45 + diffPos * 0.03);

      st.curTx += (targetTx - st.curTx) * lerpPos;
      st.curTy += (targetTy - st.curTy) * lerpPos;
      st.curScale += (targetScale - st.curScale) * 0.45;

      // Lock presisi tinggi di 99% - 100% untuk memastikan posisi FRONT terkunci sempurna sebelum unpinning
      if (p >= 0.99) {
        st.curRotX = targetRotX;
        st.curRotY = targetRotY;
        st.curTx = targetTx;
        st.curTy = targetTy;
        st.curScale = targetScale;
      }

      // 6. APLIKASI TRANSFORM LANGSUNG KE REFS (Bypass React Virtual DOM)
      if (positionRef.current) {
        positionRef.current.style.transform = `translate3d(${st.curTx.toFixed(2)}px, ${st.curTy.toFixed(2)}px, 0px)`;
      }

      if (scaleRef.current) {
        scaleRef.current.style.transform = `scale(${st.curScale.toFixed(3)})`;
      }

      if (rotationRef.current) {
        // Murni dikendalikan oleh scroll — berhenti total saat user berhenti scroll
        rotationRef.current.style.transform = `rotateX(${st.curRotX.toFixed(2)}deg) rotateY(${st.curRotY.toFixed(2)}deg)`;
      }

      // Ground Shadow realistis yang mengikuti skala kubus
      if (shadowRef.current) {
        shadowRef.current.style.opacity = '0.4';
        shadowRef.current.style.transform = `scale(${st.curScale.toFixed(3)})`;
      }

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    animFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Run ONCE on mount — eliminates all teardown overhead!

  return (
    <div
      className={`relative select-none flex flex-col items-center justify-center pointer-events-none ${className}`}
      aria-label="High-Performance 3D Photo Cube SIGAP"
    >
      {/* ─── 3D Perspective Viewport ─── */}
      <div
        className="cube-viewport relative flex items-center justify-center"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%'
        }}
      >
        <style>{`
          .cube-viewport {
            --cube-size: 260px;
            --cube-half: 130px;
            width: var(--cube-size);
            height: var(--cube-size);
          }
          @media (min-width: 640px) {
            .cube-viewport {
              --cube-size: 300px;
              --cube-half: 150px;
            }
          }
          @media (min-width: 1024px) {
            .cube-viewport {
              --cube-size: 340px;
              --cube-half: 170px;
            }
          }
          .cube-surface {
            width: var(--cube-size) !important;
            height: var(--cube-size) !important;
            box-sizing: border-box !important;
            backface-visibility: visible !important;
            -webkit-backface-visibility: visible !important;
          }
        `}</style>

        {/* ─── NODE 1: PENGENDALI POSISI (Translasi X & Y) ─── */}
        <div
          ref={positionRef}
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
        >
          {/* ─── NODE 2: PENGENDALI SKALA (Scale) ─── */}
          <div
            ref={scaleRef}
            className="relative w-full h-full flex items-center justify-center"
            style={{
              transformStyle: 'preserve-3d',
              willChange: 'transform'
            }}
          >
            {/* ─── NODE 3: PENGENDALI ROTASI (RotateX & RotateY) ─── */}
            <div
              ref={rotationRef}
              className="relative w-full h-full"
              style={{
                transformStyle: 'preserve-3d',
                willChange: 'transform'
              }}
            >
              {/* Solid Inner Core Box: Menghilangkan 100% rongga/lubang di dalam kubus */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  width: 'var(--cube-size)',
                  height: 'var(--cube-size)',
                  background: '#BFEFFF',
                  transform: 'translateZ(0px)',
                  transformStyle: 'preserve-3d'
                }}
              />

              {faces.map((face) => {
                let faceTransform = '';
                switch (face.id) {
                  case 'front':
                    faceTransform = 'translateZ(var(--cube-half))';
                    break;
                  case 'back':
                    faceTransform = 'rotateY(180deg) translateZ(var(--cube-half))';
                    break;
                  case 'left':
                    faceTransform = 'rotateY(-90deg) translateZ(var(--cube-half))';
                    break;
                  case 'right':
                    faceTransform = 'rotateY(90deg) translateZ(var(--cube-half))';
                    break;
                  case 'top':
                    faceTransform = 'rotateX(90deg) translateZ(var(--cube-half))';
                    break;
                  case 'bottom':
                    faceTransform = 'rotateX(-90deg) translateZ(var(--cube-half))';
                    break;
                  default:
                    faceTransform = 'translateZ(var(--cube-half))';
                }

                return (
                  <div
                    key={face.id}
                    className="cube-surface absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                    style={{
                      transform: faceTransform,
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'visible',
                      WebkitBackfaceVisibility: 'visible',
                      background: '#FFFFFF',
                      border: '1.5px solid #BFEFFF',
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)'
                    }}
                  >
                    {face.type === 'video' && face.mediaSrc ? (
                      /* ── Permukaan Video Lokal (5 Sisi) ── */
                      <div className="relative w-full h-full overflow-hidden bg-[#BFEFFF] pointer-events-none">
                        <video
                          src={face.mediaSrc}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="auto"
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                          onError={(e) => {
                            // Fallback jika video gagal load
                            e.currentTarget.style.display = 'none';
                            const fallbackEl = e.currentTarget.nextElementSibling;
                            if (fallbackEl) fallbackEl.style.display = 'flex';
                          }}
                        />

                        {/* Fallback Display jika file video belum tersedia */}
                        <div
                          className="absolute inset-0 w-full h-full p-5 flex flex-col justify-between hidden"
                          style={{
                            background: '#BFEFFF'
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-1 rounded-full bg-white/30 text-[10px] font-mono font-bold text-[#1C6F8E]">
                              {face.tag}
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-[#1C6F8E]">
                              {renderIcon(face.icon, '#1C6F8E')}
                            </div>
                          </div>
                          <div className="text-center my-auto">
                            <h4 className="text-sm font-black text-[#1C6F8E]">{face.title}</h4>
                            <p className="text-[10px] text-[#2E84A5] mt-1 font-mono">FILE: {face.mediaSrc}</p>
                          </div>
                          <div className="text-[10px] font-mono text-[#2E84A5] text-center">
                            SIGAP CUBE MEDIA
                          </div>
                        </div>

                        {/* Minimalist Top Face Badge */}
                        <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-none">
                          <span className="px-2.5 py-1 rounded-full bg-[#1C6F8E]/90 text-[10px] font-mono font-extrabold text-white border border-white/20">
                            {face.tag}
                          </span>
                          <div className="w-7 h-7 rounded-xl bg-[#1C6F8E]/90 border border-white/20 flex items-center justify-center text-white">
                            {renderIcon(face.icon, '#FFFFFF')}
                          </div>
                        </div>

                        {/* Minimalist Bottom Caption */}
                        <div className="absolute bottom-3 left-3.5 right-3.5 z-10 p-2.5 rounded-xl bg-[#1C6F8E]/90 border border-white/20 text-white pointer-events-none">
                          <h4 className="text-xs font-black leading-tight text-white">{face.title}</h4>
                          <p className="text-[10px] text-white/90 mt-0.5 font-medium leading-tight">{face.subtitle}</p>
                        </div>
                      </div>
                    ) : face.type === 'image' && face.mediaSrc ? (
                      /* ── Permukaan Foto Statis Lokal (1 Sisi: Bottom) ── */
                      <div className="relative w-full h-full overflow-hidden bg-[#BFEFFF] pointer-events-none">
                        <img
                          src={face.mediaSrc}
                          alt={face.title}
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallbackEl = e.currentTarget.nextElementSibling;
                            if (fallbackEl) fallbackEl.style.display = 'flex';
                          }}
                        />

                        {/* Fallback Display jika file foto belum tersedia */}
                        <div
                          className="absolute inset-0 w-full h-full p-5 flex flex-col justify-between hidden"
                          style={{ background: '#FFFFFF' }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-1 rounded-full bg-[#BFEFFF]/30 text-[10px] font-mono font-bold text-[#1C6F8E]">
                              {face.tag}
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-[#BFEFFF]/30 flex items-center justify-center text-[#1C6F8E]">
                              {renderIcon(face.icon, '#1C6F8E')}
                            </div>
                          </div>
                          <div className="text-center my-auto">
                            <h4 className="text-sm font-black text-[#1C6F8E]">{face.title}</h4>
                            <p className="text-[10px] text-[#2E84A5] mt-1 font-mono">FILE: {face.mediaSrc}</p>
                          </div>
                          <div className="text-[10px] font-mono text-[#2E84A5] text-center">
                            SIGAP CUBE PHOTO
                          </div>
                        </div>

                        {/* Minimalist Top Face Badge */}
                        <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-none">
                          <span className="px-2.5 py-1 rounded-full bg-[#1C6F8E]/90 text-[10px] font-mono font-extrabold text-white border border-white/20">
                            {face.tag}
                          </span>
                          <div className="w-7 h-7 rounded-xl bg-[#1C6F8E]/90 border border-white/20 flex items-center justify-center text-white">
                            {renderIcon(face.icon, '#FFFFFF')}
                          </div>
                        </div>

                        {/* Minimalist Bottom Caption */}
                        <div className="absolute bottom-3 left-3.5 right-3.5 z-10 p-2.5 rounded-xl bg-[#1C6F8E]/90 border border-white/20 text-white pointer-events-none">
                          <h4 className="text-xs font-black leading-tight text-white">{face.title}</h4>
                          <p className="text-[10px] text-white/90 mt-0.5 font-medium leading-tight">{face.subtitle}</p>
                        </div>
                      </div>
                    ) : (
                      /* ── Permukaan Editorial Fallback ── */
                      <div className="relative w-full h-full flex flex-col justify-between p-5 z-10 pointer-events-none">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-extrabold tracking-wider text-[#1C6F8E] uppercase">
                            {face.tag}
                          </span>
                          <div className="w-8 h-8 rounded-xl bg-[#BFEFFF]/30 flex items-center justify-center text-[#1C6F8E]">
                            {renderIcon(face.icon, face.accent)}
                          </div>
                        </div>
                        <div className="my-auto text-center space-y-1">
                          <h3 className="text-lg font-black text-[#1C6F8E] leading-tight">{face.title}</h3>
                          <p className="text-xs font-medium text-[#2E84A5]">{face.subtitle}</p>
                        </div>
                        <div className="pt-2 border-t border-[#BFEFFF]/30 flex items-center justify-between text-[10px] font-mono text-[#2E84A5]">
                          <span>SIGAP // 2026</span>
                          <span className="text-[#1C6F8E] font-bold">CUBE SURFACE</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Ground Realistic Soft Shadow ─── */}
      <div
        ref={shadowRef}
        className="w-[220px] sm:w-[300px] h-[18px] rounded-full pointer-events-none mt-4"
        style={{
          background: 'rgba(191, 239, 255, 0.45)'
        }}
      />
    </div>
  );
};

export default InteractivePhotoCube;
