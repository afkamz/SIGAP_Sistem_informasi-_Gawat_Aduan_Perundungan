import React, { useEffect, useRef } from 'react';

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
  // beserta state engine auto-rotation mandiri dan kinematic inertia
  const animState = useRef({
    curTx: 300,
    curTy: 0,
    curScale: 0.68,
    curRotX: -16,
    curRotY: 22,
    autoRotY: 0, // Inisialisasi sudut putaran mandiri (mencegah NaN)
    lastP: 0,
    lastScrollTime: 0
  });

  const animFrameId = useRef(null);

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

      // Baca progress scroll secara real-time langsung dari DOM outer stage
      // untuk respon seketika tanpa jeda re-render React
      let p = scrollProgressRef.current;
      if (typeof document !== 'undefined') {
        const stageEl = document.querySelector('.cube-scroll-section');
        if (stageEl) {
          const rect = stageEl.getBoundingClientRect();
          const scrollableDistance = rect.height - viewportHeight;
          if (scrollableDistance > 0) {
            p = Math.max(0, Math.min(1, -rect.top / scrollableDistance));
          }
        }
      }

      const isMobile = viewportWidth < 1024;

      // ─────────────────────────────────────────────────────────────
      // 1. ENGINE PUTARAN MANDIRI (AUTO-ROTATION) & AYUNAN MELAYANG
      // ─────────────────────────────────────────────────────────────
      // Kubus selalu berputar aktif secara mandiri (~32 deg/s) agar efek berputar terlihat jelas dan hidup
      if (typeof st.autoRotY !== 'number' || isNaN(st.autoRotY)) {
        st.autoRotY = 0;
      }
      st.autoRotY += dt * 32.0;

      // Ayunan nafas melayang lembut di udara (Wave Motion)
      const waveTime = time * 0.002;
      const gentleFloatY = Math.sin(waveTime) * 7.0;
      const gentleTiltX = Math.cos(waveTime * 0.9) * 3.0;
      const gentleRollZ = Math.sin(waveTime * 0.7) * 2.0;

      // ─────────────────────────────────────────────────────────────
      // 2. TIMELINE KINEMATIK SCROLL SHOWCASE RESMI (0% - 100%)
      // 0–15%: Kubus kecil di kanan
      // 15–35%: Kubus membesar secara bertahap
      // 35–60%: Kubus bergerak dari kanan menuju tengah
      // 60–85%: Kubus bergerak menuju bagian atas viewport sambil berubah perspektif dan rotasi
      // 85–100%: Kubus menyelesaikan gerakan akhir dan transisi media
      // ─────────────────────────────────────────────────────────────

      // A. POSISI X (Kanan ke Tengah)
      const initialOffsetX = isMobile ? Math.min(90, viewportWidth * 0.14) : Math.min(320, viewportWidth * 0.24);
      let targetTx = initialOffsetX;
      if (p <= 0.35) {
        targetTx = initialOffsetX;
      } else if (p <= 0.60) {
        const pMoveCenter = smoothStep(0.35, 0.60, p);
        targetTx = (1 - pMoveCenter) * initialOffsetX;
      } else {
        targetTx = 0;
      }

      // B. SKALA (0–15% Kecil, 15–35% Membesar, 35–60% Dominan, 60–85% Menyesuaikan, 85–100% Akhir)
      const baseSmallScale = isMobile ? 0.58 : 0.65;
      const peakCenterScale = isMobile ? 1.05 : 1.15;
      const elevatedScale = isMobile ? 0.72 : 0.78;

      let targetScale = baseSmallScale;
      if (p <= 0.15) {
        targetScale = baseSmallScale;
      } else if (p <= 0.35) {
        const pScaleUp = smoothStep(0.15, 0.35, p);
        targetScale = baseSmallScale + (peakCenterScale - baseSmallScale) * pScaleUp;
      } else if (p <= 0.60) {
        targetScale = peakCenterScale;
      } else if (p <= 0.85) {
        const pScaleDown = smoothStep(0.60, 0.85, p);
        targetScale = peakCenterScale - (peakCenterScale - elevatedScale) * pScaleDown;
      } else {
        targetScale = elevatedScale;
      }

      // C. POSISI Y (0–60% Tengah, 60–85% Bergerak ke Atas, 85–100% Stabil di Atas)
      const maxUpwardDistance = isMobile ? -viewportHeight * 0.30 : -viewportHeight * 0.38;
      let targetTy = 0;
      if (p <= 0.60) {
        targetTy = 0;
      } else if (p <= 0.85) {
        const pMoveUp = smoothStep(0.60, 0.85, p);
        targetTy = pMoveUp * maxUpwardDistance;
      } else {
        targetTy = maxUpwardDistance;
      }

      // D. ROTASI SCROLL MULTI-AXIS SINEMATIK (X & Y)
      // Rotasi langsung merespons scroll secara kontinu sejak p = 0 tanpa deadzone
      const scrollRotY = p * 420;
      const scrollRotX = -14 + Math.sin(p * Math.PI) * 16 - smoothStep(0.60, 0.85, p) * 22;

      const targetRotY = st.autoRotY + scrollRotY;
      const targetRotX = scrollRotX;

      // ─────────────────────────────────────────────────────────────
      // 3. LERP INTERPOLASI KINEMATIK (Responsif, Berbobot & Halus)
      // ─────────────────────────────────────────────────────────────
      const lerpSpeed = p >= 0.85 ? 0.35 : 0.22;

      st.curTx += (targetTx - st.curTx) * lerpSpeed;
      st.curTy += (targetTy - st.curTy) * lerpSpeed;
      st.curScale += (targetScale - st.curScale) * lerpSpeed;
      st.curRotX += (targetRotX - st.curRotX) * lerpSpeed;
      st.curRotY += (targetRotY - st.curRotY) * lerpSpeed;

      // Sanitasi angka untuk mencegah NaN di seluruh properti
      if (!Number.isFinite(st.curRotY)) st.curRotY = targetRotY || 0;
      if (!Number.isFinite(st.curRotX)) st.curRotX = targetRotX || 0;
      if (!Number.isFinite(st.curTx)) st.curTx = targetTx || 0;
      if (!Number.isFinite(st.curTy)) st.curTy = targetTy || 0;
      if (!Number.isFinite(st.curScale)) st.curScale = targetScale || 0.65;

      // RELEASE CONDITION: Mengunci 100% posisi dan rotasi akhir saat progress mencapai 99%-100%
      if (p >= 0.99) {
        st.curTx = targetTx;
        st.curTy = targetTy;
        st.curScale = targetScale;
        st.curRotX = targetRotX;
        st.curRotY = targetRotY;
      }

      // ─────────────────────────────────────────────────────────────
      // 4. APLIKASI TRANSFORM LANGSUNG KE REFS (Bypass React Virtual DOM)
      // ─────────────────────────────────────────────────────────────
      const finalTx = st.curTx;
      const finalTy = st.curTy + gentleFloatY;
      const finalScale = st.curScale;
      const finalRotX = st.curRotX + gentleTiltX;
      const finalRotY = st.curRotY;
      const finalRotZ = gentleRollZ;

      if (positionRef.current) {
        const x = Number.isFinite(finalTx) ? finalTx : 0;
        const y = Number.isFinite(finalTy) ? finalTy : 0;
        positionRef.current.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0px)`;
      }

      if (scaleRef.current) {
        const s = Number.isFinite(finalScale) ? finalScale : 0.65;
        scaleRef.current.style.transform = `scale(${s.toFixed(3)})`;
      }

      if (rotationRef.current) {
        const rX = Number.isFinite(finalRotX) ? finalRotX : 0;
        const rY = Number.isFinite(finalRotY) ? finalRotY : 0;
        const rZ = Number.isFinite(finalRotZ) ? finalRotZ : 0;
        rotationRef.current.style.transform = `rotateX(${rX.toFixed(2)}deg) rotateY(${rY.toFixed(2)}deg) rotateZ(${rZ.toFixed(2)}deg)`;
      }

      // Ground Shadow realistis yang mengikuti skala dan memudar saat kubus melayang naik
      if (shadowRef.current) {
        const pMoveUp = smoothStep(0.60, 0.85, p);
        const shadowOpacity = Math.max(0, (1 - pMoveUp * 1.6) * 0.42).toFixed(2);
        const shadowScale = (finalScale * (1 - pMoveUp * 0.4)).toFixed(3);
        shadowRef.current.style.opacity = shadowOpacity;
        shadowRef.current.style.transform = `scale(${shadowScale})`;
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
                      /* ── Permukaan Video Lokal (5 Sisi) — Murni Video Tanpa Teks/Logo ── */
                      <div className="relative w-full h-full overflow-hidden bg-[#BFEFFF] pointer-events-none">
                        <video
                          src={face.mediaSrc}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="auto"
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        />
                      </div>
                    ) : face.type === 'image' && face.mediaSrc ? (
                      /* ── Permukaan Foto Statis Lokal (1 Sisi: Bottom) — Murni Foto Tanpa Teks/Logo ── */
                      <div className="relative w-full h-full overflow-hidden bg-[#BFEFFF] pointer-events-none">
                        <img
                          src={face.mediaSrc}
                          alt="SIGAP 3D Cube"
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        />
                      </div>
                    ) : (
                      /* ── Permukaan Bersih Fallback ── */
                      <div className="relative w-full h-full bg-[#BFEFFF] pointer-events-none" />
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
