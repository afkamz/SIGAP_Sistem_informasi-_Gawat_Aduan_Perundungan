import React from 'react';

/**
 * =========================================================================
 * SIGAP — BACKGROUND MEDIA BACKDROP (BEHIND THE 3D CUBE)
 * =========================================================================
 * Komponen latar belakang sinematik terpisah yang berada di belakang objek
 * kubus 3D. Mendukung:
 *   - Video MP4 / WebM (muted, loop, playsInline, autoPlay, poster fallback)
 *   - Foto JPG / PNG dengan object-fit: cover
 *   - Mode Ambient Canvas solid murni (tanpa gradasi apa pun)
 * =========================================================================
 */

export const BackgroundMediaBackdrop = ({
  src = null, // Path foto lokal atau video (cth: '/assets/background/cube-background.mp4')
  type = 'auto', // 'video' | 'image' | 'ambient' | 'auto'
  poster = null, // Fallback gambar poster saat video loading
  opacity = 0.55, // Opasitas media dasar (0.1 - 1.0)
  scrollProgress = 0, // 0.0 s.d. 1.0 untuk paralaks kedalaman
  className = '',
  layerRef = null // Direct DOM ref untuk zero-overhead RAF transform updates
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
      {/* ─── Layer 1: Actual Media (Video / Image / Ambient Solid Art Canvas) ─── */}
      <div
        ref={layerRef}
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
            className="w-full h-full object-cover brightness-105"
          />
        ) : (
          /* Ambient Solid Art Backdrop (Baby Blue & White Theme) */
          <div className="w-full h-full relative overflow-hidden bg-[#FFFFFF]" />
        )}
      </div>

      {/* ─── Layer 2: Clean Solid Translucent Shield (Melindungi Keterbacaan Teks Hero) ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.45)'
        }}
      />
    </div>
  );
};

export default BackgroundMediaBackdrop;
