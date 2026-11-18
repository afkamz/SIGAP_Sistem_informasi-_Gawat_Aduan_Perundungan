import React, { useEffect, useRef } from 'react';

/**
 * =========================================================================
 * SIGAP — HIGH-PERFORMANCE 3D CUBE ANIMATION (MATCHING REFERENCE VIDEO)
 * =========================================================================
 * Objek visual 3D 6-sisi mandiri: Front, Back, Left, Right, Top, Bottom.
 *
 * KARAKTERISTIK ANIMASI PERSIS VIDEO REFERENSI (audition.smtown.com):
 *   1. STATE IDLE (Top of page, p ≈ 0):
 *      - Posisi di sebelah kanan (Hero section).
 *      - Perspektif isometric miring dari atas (rotX ≈ -20°).
 *      - Berputar anggun secara mandiri (ambient continuous auto-rotation)
 *        dengan ayunan melayang lembut (organic floating wave).
 *
 *   2. SCROLL REVEAL TIMELINE (p: 0.0 -> 1.0):
 *      - Phase 1 (p: 0.02 - 0.45): Kubus bergerak mulus dari kanan ke tengah (translateX -> 0).
 *      - Phase 2 (p: 0.02 - 0.55): Skala membesar dari ukuran showcase (0.72x) ke ukuran dominan (1.22x).
 *      - Phase 3 (p: 0.02 - 0.78): Rotasi 3D sinkron bergulir mulus dan kemiringan atas (rotX)
 *        secara presisi menegak lurus (-20° -> 0°).
 *      - Phase 4 (p: 0.78 - 0.88): KUBUS MENDATAR 100% (rotX: 0°, rotY: 0°, rotZ: 0°)
 *        sehingga satu sisi (Front) menatap lurus langsung ke kamera seperti layar digital / flat card!
 *      - Phase 5 (p: 0.88 - 1.00): Mengalir naik secara alami saat pengguna melanjutkan scroll ke seksi berikutnya.
 *
 *   3. ZERO-LAG ARCHITECTURE (60-120 FPS):
 *      - Interpolasi kinematik berbobot (exponential damping lerp).
 *      - Manipulasi style langsung pada refs tanpa re-render React.
 *      - Bebas layout-thrashing & tanpa backdrop-filter berat.
 * =========================================================================
 */

export const DEFAULT_CUBE_FACES = [
  {
    id: 'front',
    type: 'image',
    mediaSrc: '/assets/cube/photo-2.jpg?v=20261118',
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
    type: 'image',
    mediaSrc: '/assets/cube/photo-3.jpg?v=20261118',
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
    mediaSrc: '/assets/cube/video-3.mp4?v=20261118',
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
    mediaSrc: '/assets/cube/video-4.mp4?v=20261118',
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
    type: 'image',
    mediaSrc: '/assets/cube/photo-1.jpg?v=20261118',
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
    mediaSrc: '/assets/cube/photo-1.jpg?v=20261118',
    label: 'SURFACE 06',
    title: 'AUDIT & INTEGRITY',
    subtitle: 'Tindakan Terpercaya Satgas BK',
    tag: 'INTEGRITY // 06',
    icon: 'CheckCircle2',
    accent: '#BFEFFF',
    quote: 'Audit trail digital transparan dan akuntabel.'
  }
];

// Helper otomatis deteksi apakah media berjenis video atau foto (gambar) secara cerdas
const isVideoMedia = (face) => {
  if (!face || !face.mediaSrc) return false;
  const cleanSrc = (face.mediaSrc || '').split('?')[0].toLowerCase();
  // Deteksi ekstensi video umum
  if (
    cleanSrc.endsWith('.mp4') ||
    cleanSrc.endsWith('.webm') ||
    cleanSrc.endsWith('.mov') ||
    cleanSrc.endsWith('.ogg') ||
    cleanSrc.endsWith('.m4v')
  ) {
    return true;
  }
  // Deteksi ekstensi foto / gambar umum
  if (
    cleanSrc.endsWith('.jpg') ||
    cleanSrc.endsWith('.jpeg') ||
    cleanSrc.endsWith('.png') ||
    cleanSrc.endsWith('.webp') ||
    cleanSrc.endsWith('.svg') ||
    cleanSrc.endsWith('.gif') ||
    cleanSrc.endsWith('.avif')
  ) {
    return false;
  }
  // Fallback ke deklarasi type jika ekstensi tidak dikenali
  return face.type === 'video';
};

// Helper interpolasi matematika smoothstep (Hermite easing)
const smoothStep = (min, max, value) => {
  if (value <= min) return 0;
  if (value >= max) return 1;
  const x = (value - min) / (max - min);
  return x * x * (3 - 2 * x);
};

export const InteractivePhotoCube = ({
  faces = DEFAULT_CUBE_FACES,
  scrollProgress = 0,
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

  // Nilai fisik kinematik lerp (current vs target)
  const animState = useRef({
    curTx: 320,
    curTy: 0,
    curScale: 0.72,
    curRotX: -20,
    curRotY: 28,
    curRotZ: 0,
    curShadow: 0.35,
    autoRotY: 28,
    isScrolling: false,
    scrollStartRotY: 28,
    targetFlatRotY: 360
  });

  const animFrameId = useRef(null);

  // ─── 60–120 FPS KINEMATIC LOOP (SINGLE MOUNTED LIFECYCLE) ───
  useEffect(() => {
    let viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
    let viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    let stageTop = 0;
    let stageScrollable = 0;
    let isCubeVisible = true;

    const stageEl = document.querySelector('.cube-scroll-section');

    const updateMetrics = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      if (stageEl) {
        const rect = stageEl.getBoundingClientRect();
        stageTop = window.scrollY + rect.top;
        stageScrollable = rect.height - viewportHeight;
      }
    };
    updateMetrics();

    window.addEventListener('resize', updateMetrics, { passive: true });

    let lastTime = performance.now();
    let isTabVisible = true;

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && isCubeVisible && !animFrameId.current) {
        lastTime = performance.now();
        animFrameId.current = requestAnimationFrame(renderLoop);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // ─── INTERSECTION OBSERVER: PAUSE RAF SAAT KUBUS DI LUAR VIEWPORT ───
    let observer = null;
    if (typeof IntersectionObserver !== 'undefined' && stageEl) {
      observer = new IntersectionObserver(
        (entries) => {
          isCubeVisible = entries[0].isIntersecting;
          if (isCubeVisible && isTabVisible && !animFrameId.current) {
            lastTime = performance.now();
            animFrameId.current = requestAnimationFrame(renderLoop);
          }
        },
        { rootMargin: '120px 0px' }
      );
      observer.observe(stageEl);
    }

    const renderLoop = (time) => {
      if (!isTabVisible || !isCubeVisible) {
        animFrameId.current = null;
        return;
      }

      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      const st = animState.current;

      // Hitung progress scroll secara instan tanpa forced synchronous layout / getBoundingClientRect
      let p = scrollProgressRef.current;
      if (stageScrollable > 0) {
        const scrolled = window.scrollY - stageTop;
        p = Math.max(0, Math.min(1, scrolled / stageScrollable));
      }

      const isMobile = viewportWidth < 640;
      const isTablet = viewportWidth >= 640 && viewportWidth < 1024;

      // Baseline offsets dan skala sesuai breakpoint
      const initialOffsetX = isMobile
        ? Math.min(80, viewportWidth * 0.12)
        : isTablet
        ? Math.min(180, viewportWidth * 0.20)
        : Math.min(340, viewportWidth * 0.25);

      const baseScale = isMobile ? 0.60 : isTablet ? 0.68 : 0.72;
      const peakScale = isMobile ? 1.02 : isTablet ? 1.12 : 1.22;

      let targetTx = 0;
      let targetTy = 0;
      let targetScale = baseScale;
      let targetRotX = 0;
      let targetRotY = 0;
      let targetRotZ = 0;
      let targetShadow = 0;

      // ─────────────────────────────────────────────────────────────
      // 1. STATE IDLE (p <= 0.015) — PERSIS REFERENSI HERO
      // ─────────────────────────────────────────────────────────────
      if (p <= 0.015) {
        if (st.isScrolling) {
          st.isScrolling = false;
          st.autoRotY = st.curRotY;
        }

        // Putaran mandiri halus di Hero (~20 deg/s)
        st.autoRotY += dt * 20.0;

        // Ayunan nafas melayang lembut di udara (Organic Floating Wave)
        const floatWave = time * 0.002;
        const ambientFloatY = Math.sin(floatWave) * 6.0;
        const ambientTiltX = Math.cos(floatWave * 0.8) * 2.0;
        const ambientRollZ = Math.sin(floatWave * 0.6) * 1.5;

        targetTx = initialOffsetX;
        targetTy = ambientFloatY;
        targetScale = baseScale;
        targetRotX = -20.0 + ambientTiltX; // Tampilan isometric dari atas
        targetRotY = st.autoRotY;
        targetRotZ = ambientRollZ;
        targetShadow = 0.35;
      }
      // ─────────────────────────────────────────────────────────────
      // 2. SCROLL DRIVEN TRANSITION (p > 0.015 s.d. 1.0)
      // ─────────────────────────────────────────────────────────────
      else {
        if (!st.isScrolling) {
          st.isScrolling = true;
          st.scrollStartRotY = st.curRotY;
          // Target sudut rotasi agar sisi 'front' menghadap datar sempurna ke kamera
          st.targetFlatRotY = Math.ceil(st.scrollStartRotY / 360) * 360;
          if (st.targetFlatRotY - st.scrollStartRotY < 140) {
            st.targetFlatRotY += 360;
          }
        }

        // A. Perjalanan Horizontal: Kanan -> Tengah (p: 0.015 -> 0.45)
        const pTravel = smoothStep(0.015, 0.45, p);
        targetTx = initialOffsetX * (1 - pTravel);

        // B. Pembesaran Skala (p: 0.015 -> 0.55)
        const pScale = smoothStep(0.015, 0.55, p);
        targetScale = baseScale + (peakScale - baseScale) * pScale;

        // C. Rotasi 3D Menuju Rata (p: 0.015 -> 0.78)
        const pRot = smoothStep(0.015, 0.78, p);
        // Tilt X: Dari -20° (isometric dari atas) mendatar sempurna ke 0°
        targetRotX = -20.0 * (1 - pRot);
        // Rotasi Y: Bergulir anggun dari snapshot idle menuju sisi depan datar
        targetRotY = st.scrollStartRotY + (st.targetFlatRotY - st.scrollStartRotY) * pRot;
        targetRotZ = 0;

        // D. KUBUS MENDATAR 100% MENATAP KAMERA (p: 0.78 -> 0.88)
        // (Sesuai persis dengan frame 08 video referensi audition.smtown.com)
        if (p >= 0.78 && p <= 0.88) {
          targetTx = 0;
          targetTy = 0;
          targetScale = peakScale;
          targetRotX = 0;
          targetRotY = st.targetFlatRotY;
          targetRotZ = 0;
          targetShadow = 0;
        }

        // E. EXIT TRANSITION (p: 0.88 -> 1.00)
        // Mengalir naik bersama alur halaman saat seksi berikutnya masuk
        if (p > 0.88) {
          const pExit = smoothStep(0.88, 1.00, p);
          targetTy = -pExit * (viewportHeight * 0.32);
          targetScale = peakScale - pExit * 0.10;
          targetRotX = 0;
          targetRotY = st.targetFlatRotY;
          targetRotZ = 0;
          targetShadow = 0;
        } else {
          // Bayangan dasar perlahan memudar saat kubus berubah menjadi kartu datar
          const pFlatShadow = smoothStep(0.35, 0.75, p);
          targetShadow = 0.35 * (1 - pFlatShadow);
        }
      }

      // ─────────────────────────────────────────────────────────────
      // 3. KINEMATIC EXPONENTIAL LERP (Smooth, Responsive & No Jitter)
      // ─────────────────────────────────────────────────────────────
      const k = p >= 0.78 ? 16 : 12;
      const lerpFactor = 1 - Math.exp(-k * dt);

      st.curTx += (targetTx - st.curTx) * lerpFactor;
      st.curTy += (targetTy - st.curTy) * lerpFactor;
      st.curScale += (targetScale - st.curScale) * lerpFactor;
      st.curRotX += (targetRotX - st.curRotX) * lerpFactor;
      st.curRotY += (targetRotY - st.curRotY) * lerpFactor;
      st.curRotZ += (targetRotZ - st.curRotZ) * lerpFactor;
      st.curShadow += (targetShadow - st.curShadow) * lerpFactor;

      // Sanitasi angka untuk mencegah NaN
      if (!Number.isFinite(st.curRotY)) st.curRotY = targetRotY || 0;
      if (!Number.isFinite(st.curRotX)) st.curRotX = targetRotX || 0;
      if (!Number.isFinite(st.curRotZ)) st.curRotZ = targetRotZ || 0;
      if (!Number.isFinite(st.curTx)) st.curTx = targetTx || 0;
      if (!Number.isFinite(st.curTy)) st.curTy = targetTy || 0;
      if (!Number.isFinite(st.curScale)) st.curScale = targetScale || 0.72;
      if (!Number.isFinite(st.curShadow)) st.curShadow = targetShadow || 0;

      // Kunci presisi pada progress akhir (99.5%+)
      if (p >= 0.995) {
        st.curTx = targetTx;
        st.curTy = targetTy;
        st.curScale = targetScale;
        st.curRotX = targetRotX;
        st.curRotY = targetRotY;
        st.curRotZ = targetRotZ;
        st.curShadow = targetShadow;
      }

      // ─────────────────────────────────────────────────────────────
      // 4. APLIKASI TRANSFORM LANGSUNG KE DOM REFS (Bypass React VDOM)
      // ─────────────────────────────────────────────────────────────
      if (positionRef.current) {
        positionRef.current.style.transform = `translate3d(${st.curTx.toFixed(2)}px, ${st.curTy.toFixed(2)}px, 0px)`;
      }

      if (scaleRef.current) {
        scaleRef.current.style.transform = `scale(${st.curScale.toFixed(3)})`;
      }

      if (rotationRef.current) {
        rotationRef.current.style.transform = `rotateX(${st.curRotX.toFixed(2)}deg) rotateY(${st.curRotY.toFixed(2)}deg) rotateZ(${st.curRotZ.toFixed(2)}deg)`;
      }

      if (shadowRef.current) {
        const shadowScale = (st.curScale * 0.95).toFixed(3);
        shadowRef.current.style.opacity = Math.max(0, st.curShadow).toFixed(2);
        shadowRef.current.style.transform = `scale(${shadowScale})`;
      }

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    animFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', updateMetrics);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (observer) observer.disconnect();
    };
  }, []);

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
            border-radius: 0 !important;
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
            {/* ─── NODE 3: PENGENDALI ROTASI (RotateX, RotateY, RotateZ) ─── */}
            <div
              ref={rotationRef}
              className="relative w-full h-full"
              style={{
                transformStyle: 'preserve-3d',
                willChange: 'transform'
              }}
            >
              {/* Solid Inner Core Box: Menghilangkan rongga tembus pandang tanpa garis/warna biru */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  width: 'var(--cube-size)',
                  height: 'var(--cube-size)',
                  background: '#090d16',
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
                      background: '#090d16',
                      border: 'none',
                      boxShadow: 'none',
                      outline: 'none'
                    }}
                  >
                    {(() => {
                      if (!face.mediaSrc) {
                        return <div className="relative w-full h-full bg-black pointer-events-none" />;
                      }

                      const isVideo = isVideoMedia(face);

                      if (isVideo) {
                        return (
                          /* Permukaan Video Lokal — Otomatis Deteksi Format Video */
                          <div className="relative w-full h-full overflow-hidden bg-black pointer-events-none">
                            <video
                              src={face.mediaSrc}
                              autoPlay
                              muted
                              loop
                              playsInline
                              preload="auto"
                              ref={(el) => {
                                if (el) {
                                  el.defaultMuted = true;
                                  el.muted = true;
                                  if (el.paused) el.play().catch(() => {});
                                }
                              }}
                              onLoadedData={(e) => {
                                e.target.play().catch(() => {});
                              }}
                              onError={(e) => {
                                console.warn(`Cube video failed on face ${face.id}:`, face.mediaSrc);
                              }}
                              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                            />
                          </div>
                        );
                      }

                      /* Permukaan Foto Statis Lokal — Otomatis Deteksi Format Gambar */
                      return (
                        <div className="relative w-full h-full overflow-hidden bg-black pointer-events-none">
                          <img
                            src={face.mediaSrc}
                            alt={face.title || 'SIGAP 3D Cube'}
                            onError={(e) => {
                              console.warn(`Cube photo failed on face ${face.id}:`, face.mediaSrc);
                            }}
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                          />
                        </div>
                      );
                    })()}
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
        className="w-[220px] sm:w-[300px] h-[18px] rounded-full pointer-events-none mt-4 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(191, 239, 255, 0.7) 0%, rgba(191, 239, 255, 0) 70%)'
        }}
      />
    </div>
  );
};

export default InteractivePhotoCube;
