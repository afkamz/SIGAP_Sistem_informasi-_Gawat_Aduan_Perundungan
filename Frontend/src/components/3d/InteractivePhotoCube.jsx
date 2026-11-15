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
    accent: '#3B7DE8',
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
    accent: '#93C5FD',
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
    accent: '#60A5FA',
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
    accent: '#3B7DE8',
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
    accent: '#BFDBFE',
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
    accent: '#3B7DE8',
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

  // Simpan scrollProgress dalam ref agar rendering loop tidak di-unmount setiap ada perubahan scroll
  const scrollProgressRef = useRef(scrollProgress);
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  // Nilai fisik lerp (current vs target) murni scroll
  const animState = useRef({
    curTx: 0,
    curTy: 0,
    curScale: 0.65,
    curRotX: -14,
    curRotY: 24,
    autoRotY: 0
  });

  const animFrameId = useRef(null);

  // Helper render ikon untuk tiap sisi
  const renderIcon = (iconName, accent) => {
    const props = { className: 'w-5 h-5', style: { color: accent || '#3B7DE8' } };
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
      // TIMELINE 5 TAHAPAN (0% - 100%) PINNED STAGE PRESISI:
      // ─────────────────────────────────────────────────────────────

      // 1. POSISI X (Kanan ke Tengah)
      // Scene 01 (0–15%): Berada di kanan hero (+340px desktop, +110px mobile)
      // Scene 02 (15–35%): Mulai bergeser secara bertahap
      // Scene 03 (35–60%): Selesai mencapai tengah layar (tx = 0 pada 55%)
      const initialOffsetX = isMobile ? Math.min(110, viewportWidth * 0.16) : Math.min(340, viewportWidth * 0.24);
      const pMoveCenter = smoothStep(0.20, 0.55, p);
      const targetTx = (1 - pMoveCenter) * initialOffsetX;

      // 2. SKALA
      // Scene 01 (0–15%): Ukuran relatif kecil (0.65 desktop, 0.58 mobile)
      // Scene 02 (15–35%): Membesar bertahap (0.65 -> 1.05)
      // Scene 03 (35–60%): Puncak dominan di tengah (1.20x desktop, 1.05x mobile pada 52%)
      // Scene 04 (60–85%): Menyesuaikan ke 0.78x saat bergerak naik ke atas
      // Scene 05 (85–100%): Stabil 100% di posisi akhir (0.78x)
      const baseSmallScale = isMobile ? 0.58 : 0.65;
      const peakCenterScale = isMobile ? 1.05 : 1.20;
      const elevatedScale = isMobile ? 0.72 : 0.78;

      let targetScale = baseSmallScale;
      if (p <= 0.55) {
        const pScaleUp = smoothStep(0.15, 0.50, p);
        targetScale = baseSmallScale + (peakCenterScale - baseSmallScale) * pScaleUp;
      } else {
        const pScaleDown = smoothStep(0.60, 0.85, p);
        targetScale = peakCenterScale - (peakCenterScale - elevatedScale) * pScaleDown;
      }

      // 3. POSISI Y (Tengah ke Atas Viewport)
      // Scene 01–03 (0–60%): Tetap berada di sumbu tengah (ty = 0)
      // Scene 04 (60–85%): Melayang naik ke atas layar (-36vh)
      // Scene 05 (85–100%): Selesai 100% mencapai posisi akhir di atas (-36vh)
      const pMoveUp = smoothStep(0.60, 0.85, p);
      const maxUpwardDistance = isMobile ? -viewportHeight * 0.26 : -viewportHeight * 0.35;
      const targetTy = pMoveUp * maxUpwardDistance;

      // 4. ROTASI SCROLL (Multi-Axis Mengungkap Sisi Foto)
      // Rotasi terikat langsung pada progress timeline (15% - 85%)
      const pRotate = smoothStep(0.15, 0.85, p);
      const targetRotY = 24 + pRotate * 270;
      const targetRotX = -14 + smoothStep(0.15, 0.45, p) * 16 - smoothStep(0.60, 0.85, p) * 26;

      // Rotasi otomatis kontinu mikro yang sangat tenang (~2 deg/s) saat santai
      st.autoRotY += dt * 2.0;

      // 5. LERP INTERPOLASI TINGKAT TINGGI (Responsif & Smooth, Cepat Settle di 85-100%)
      const lerpSpeed = p >= 0.85 ? 0.35 : 0.18;
      st.curTx += (targetTx - st.curTx) * lerpSpeed;
      st.curTy += (targetTy - st.curTy) * lerpSpeed;
      st.curScale += (targetScale - st.curScale) * lerpSpeed;
      st.curRotX += (targetRotX - st.curRotX) * lerpSpeed;
      st.curRotY += (targetRotY - st.curRotY) * lerpSpeed;

      // 6. APLIKASI TRANSFORM LANGSUNG KE REFS (Bypass React Virtual DOM)
      if (positionRef.current) {
        positionRef.current.style.transform = `translate3d(${st.curTx.toFixed(2)}px, ${st.curTy.toFixed(2)}px, 0px)`;
      }

      if (scaleRef.current) {
        scaleRef.current.style.transform = `scale(${st.curScale.toFixed(3)})`;
      }

      if (rotationRef.current) {
        const totalRotY = (st.curRotY + st.autoRotY).toFixed(2);
        const totalRotX = st.curRotX.toFixed(2);
        rotationRef.current.style.transform = `rotateX(${totalRotX}deg) rotateY(${totalRotY}deg)`;
      }

      // Ground Shadow realistis yang mengikuti skala dan memudar saat kubus naik
      if (shadowRef.current) {
        const shadowOpacity = Math.max(0, (1 - pMoveUp * 1.5) * 0.85).toFixed(2);
        const shadowScale = (st.curScale * (1 - pMoveUp * 0.4)).toFixed(2);
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
        className="relative w-[260px] h-[260px] sm:w-[310px] sm:h-[310px] lg:w-[340px] lg:h-[340px] flex items-center justify-center"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%'
        }}
      >
        {/* ─── NODE 1: PENGENDALI POSISI (Translasi X & Y) ─── */}
        <div
          ref={positionRef}
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
        >
          {/* Ambient Illumination Glow Ringan (Tanpa Pulse CPU Load) */}
          <div className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full bg-gradient-to-tr from-[#3B7DE8]/18 via-[#93C5FD]/20 to-transparent blur-2xl pointer-events-none -z-10" />

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
              {faces.map((face) => {
                let faceTransform = '';
                switch (face.id) {
                  case 'front':
                    faceTransform = 'translateZ(var(--cube-half, 175px))';
                    break;
                  case 'back':
                    faceTransform = 'rotateY(180deg) translateZ(var(--cube-half, 175px))';
                    break;
                  case 'left':
                    faceTransform = 'rotateY(-90deg) translateZ(var(--cube-half, 175px))';
                    break;
                  case 'right':
                    faceTransform = 'rotateY(90deg) translateZ(var(--cube-half, 175px))';
                    break;
                  case 'top':
                    faceTransform = 'rotateX(90deg) translateZ(var(--cube-half, 175px))';
                    break;
                  case 'bottom':
                    faceTransform = 'rotateX(-90deg) translateZ(var(--cube-half, 175px))';
                    break;
                  default:
                    faceTransform = 'translateZ(var(--cube-half, 175px))';
                }

                return (
                  <div
                    key={face.id}
                    className="cube-surface absolute inset-0 w-full h-full rounded-3xl overflow-hidden pointer-events-none"
                    style={{
                      transform: faceTransform,
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'visible',
                      WebkitBackfaceVisibility: 'visible',
                      background: '#FFFFFF',
                      border: '1.5px solid rgba(232, 227, 229, 0.85)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)'
                    }}
                  >
                    {face.type === 'video' && face.mediaSrc ? (
                      /* ── Permukaan Video Lokal (5 Sisi) ── */
                      <div className="relative w-full h-full overflow-hidden bg-slate-900 pointer-events-none">
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
                            background: 'linear-gradient(135deg, #1D294B 0%, #2A3C68 100%)'
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-1 rounded-full bg-white/20 text-[10px] font-mono font-bold text-white">
                              {face.tag}
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
                              {renderIcon(face.icon, '#FFFFFF')}
                            </div>
                          </div>
                          <div className="text-center my-auto">
                            <h4 className="text-sm font-black text-white">{face.title}</h4>
                            <p className="text-[10px] text-slate-300 mt-1 font-mono">FILE: {face.mediaSrc}</p>
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 text-center">
                            SIGAP CUBE MEDIA
                          </div>
                        </div>

                        {/* Minimalist Top Face Badge */}
                        <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-none">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 text-[10px] font-mono font-extrabold text-white border border-white/20">
                            {face.tag}
                          </span>
                          <div className="w-7 h-7 rounded-xl bg-black/60 border border-white/20 flex items-center justify-center text-white">
                            {renderIcon(face.icon, '#FFFFFF')}
                          </div>
                        </div>

                        {/* Minimalist Bottom Caption */}
                        <div className="absolute bottom-3 left-3.5 right-3.5 z-10 p-2.5 rounded-xl bg-black/65 border border-white/20 text-white pointer-events-none">
                          <h4 className="text-xs font-black leading-tight text-white">{face.title}</h4>
                          <p className="text-[10px] text-slate-200 mt-0.5 font-medium leading-tight">{face.subtitle}</p>
                        </div>
                      </div>
                    ) : face.type === 'image' && face.mediaSrc ? (
                      /* ── Permukaan Foto Statis Lokal (1 Sisi: Bottom) ── */
                      <div className="relative w-full h-full overflow-hidden bg-slate-100 pointer-events-none">
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
                          style={{ background: '#FDF7F9' }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-1 rounded-full bg-pink-100 text-[10px] font-mono font-bold text-pink-700">
                              {face.tag}
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600">
                              {renderIcon(face.icon, face.accent)}
                            </div>
                          </div>
                          <div className="text-center my-auto">
                            <h4 className="text-sm font-black text-slate-800">{face.title}</h4>
                            <p className="text-[10px] text-slate-500 mt-1 font-mono">FILE: {face.mediaSrc}</p>
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 text-center">
                            SIGAP CUBE PHOTO
                          </div>
                        </div>

                        {/* Minimalist Top Face Badge */}
                        <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-none">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 text-[10px] font-mono font-extrabold text-white border border-white/20">
                            {face.tag}
                          </span>
                          <div className="w-7 h-7 rounded-xl bg-black/60 border border-white/20 flex items-center justify-center text-white">
                            {renderIcon(face.icon, '#FFFFFF')}
                          </div>
                        </div>

                        {/* Minimalist Bottom Caption */}
                        <div className="absolute bottom-3 left-3.5 right-3.5 z-10 p-2.5 rounded-xl bg-black/65 border border-white/20 text-white pointer-events-none">
                          <h4 className="text-xs font-black leading-tight text-white">{face.title}</h4>
                          <p className="text-[10px] text-slate-200 mt-0.5 font-medium leading-tight">{face.subtitle}</p>
                        </div>
                      </div>
                    ) : (
                      /* ── Permukaan Editorial Fallback ── */
                      <div className="relative w-full h-full flex flex-col justify-between p-5 z-10 pointer-events-none">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-extrabold tracking-wider text-slate-500 uppercase">
                            {face.tag}
                          </span>
                          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                            {renderIcon(face.icon, face.accent)}
                          </div>
                        </div>
                        <div className="my-auto text-center space-y-1">
                          <h3 className="text-lg font-black text-slate-900 leading-tight">{face.title}</h3>
                          <p className="text-xs font-medium text-slate-500">{face.subtitle}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>SIGAP // 2026</span>
                          <span className="text-[#3B7DE8] font-bold">CUBE SURFACE</span>
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
        className="w-[220px] sm:w-[300px] h-[22px] rounded-full blur-lg pointer-events-none mt-4"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(59,125,232,0.22) 0%, rgba(191,219,254,0.28) 45%, transparent 75%)'
        }}
      />
    </div>
  );
};

export default InteractivePhotoCube;
