import React from 'react';

/**
 * =========================================================================
 * SIGAP — BACKGROUND MEDIA BACKDROP (BEHIND THE 3D CUBE)
 * =========================================================================
 * Komponen latar belakang sinematik terpisah yang berada di belakang objek
 * kubus 3D. Mendukung:
 *   - Video MP4 / WebM (muted, loop, playsInline, autoPlay, poster fallback)
 *   - Foto JPG / PNG dengan object-fit: cover
 *   - Mode Ambient Glassmesh bawaan SIGAP (jika belum ada file foto/video)
 *
 * Dilengkapi lapisan gradien dan opasitas yang selaras dengan palet warna asli
 * SIGAP (biru muda #EEF3FD, accent blue #3B7DE8, dan translucent white glass).
 * =========================================================================
 */

export const BackgroundMediaBackdrop = ({
  src = null, // Path foto lokal atau video (cth: '/videos/hero_background.mp4' atau '/images/bg.jpg')
  type = 'auto', // 'video' | 'image' | 'ambient' | 'auto'
  poster = null, // Fallback gambar poster saat video loading
  opacity = 0.55, // Opasitas media dasar (0.1 - 1.0)
  scrollProgress = 0, // 0.0 s.d. 1.0 untuk paralaks kedalaman
  className = ''
}) => {
  // Deteksi otomatis format jika type === 'auto'
  const isVideo =
    type === 'video' ||
    (type === 'auto' &&
      typeof src === 'string' &&
      (src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.ogg')));

  const isImage =
    type === 'image' ||
    (type === 'auto' &&
      typeof src === 'string' &&
      (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png') || src.endsWith('.webp') || src.endsWith('.svg')));

  // Efek transisi skala dan opasitas halus berbasis scroll (Scene 01 -> Scene 05)
  const scale = (1 + scrollProgress * 0.08).toFixed(3);
  const dynamicOpacity = Math.max(0.2, (opacity * (1 - scrollProgress * 0.35))).toFixed(2);

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none -z-10 ${className}`}
      aria-hidden="true"
    >
      {/* ─── Layer 1: Actual Media (Video / Image / Ambient Art Canvas) ─── */}
      <div
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{
          transform: `scale(${scale})`,
          opacity: dynamicOpacity
        }}
      >
        {isVideo && src ? (
          <video
            src={src}
            poster={poster}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover brightness-105"
          />
        ) : isImage && src ? (
          <img
            src={src}
            alt="SIGAP Backdrop Atmosphere"
            loading="lazy"
            className="w-full h-full object-cover filter blur-[0.5px] brightness-105"
          />
        ) : (
          /* Ambient Generative Art Backdrop (Warna Asli SIGAP) */
          <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#EEF3FD] via-[#F4F8FE] to-[#E3EDFD]">
            {/* Soft Flowing Light Ribbons (Glow Statis Ringan Tanpa Pulse Animasi Berulang) */}
            <div className="absolute top-[10%] right-[15%] w-[48vw] h-[48vw] rounded-full bg-gradient-to-tr from-[#3B7DE8]/15 via-[#93C5FD]/20 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute bottom-[5%] left-[10%] w-[52vw] h-[52vw] rounded-full bg-gradient-to-tr from-[#60A5FA]/12 via-[#DBEAFE]/25 to-transparent blur-3xl pointer-events-none" />
            
            {/* Subtle Futuristic Architectural Coordinate Grid */}
            <div
              className="absolute inset-0 opacity-[0.045]"
              style={{
                backgroundImage:
                  'linear-gradient(#3B7DE8 1px, transparent 1px), linear-gradient(to right, #3B7DE8 1px, transparent 1px)',
                backgroundSize: '48px 48px'
              }}
            />
          </div>
        )}
      </div>

      {/* ─── Layer 2: Gradient Overlay Warna Asli SIGAP (Melindungi Keterbacaan) ─── */}
      {/* Radial spotlight di belakang kubus */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 65% 50%, rgba(238, 243, 253, 0.4) 0%, rgba(238, 243, 253, 0.85) 60%, #EEF3FD 100%)'
        }}
      />

      {/* Top & Bottom Soft Fading Gradients */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#EEF3FD] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#EEF3FD] via-[#EEF3FD]/80 to-transparent" />
    </div>
  );
};

export default BackgroundMediaBackdrop;
