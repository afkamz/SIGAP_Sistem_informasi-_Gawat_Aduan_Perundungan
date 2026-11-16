import React from 'react';
import { PhoneCall, HeartHandshake, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingFooter = () => {
  return (
    <footer
      className="py-12 px-6 relative z-20"
      style={{
        background: '#142B4A',
        borderTop: '1px solid #142B4A'
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b text-center md:text-left" style={{ borderColor: 'rgba(255, 255, 255, 0.15)' }}>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <Link to="/" className="inline-flex items-center gap-2.5 sm:gap-3 rounded-xl bg-white px-3 py-1.5 shadow-xs transition-opacity group hover:opacity-90" aria-label="Beranda SIGAP">
              <img
                src="/assets/branding/logo-sigap.png"
                alt="Logo SIGAP"
                className="h-8 sm:h-9 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <img
                src="/assets/branding/branding-sigap.png"
                alt="SIGAP"
                className="h-7 sm:h-8 w-auto max-w-[150px] sm:max-w-[190px] object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Link>
            <p className="text-xs text-white/80 max-w-xs">
              Sistem Informasi Gawat Aduan Perundungan Sekolah
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-medium text-white/90">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-white/80" />
              <span>Enkripsi Berlapis 100%</span>
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-white/80" />
              <span>Pendampingan BK &amp; PPKSP</span>
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-white/80" />
              <span>SAPA 129 / Polisi 110</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-center sm:text-left text-white/80">
          <p>
            Layanan aduan resmi bimbingan konseling dan kesiswaan sesuai <strong className="text-white font-bold">Permendikbudristek No. 46 Tahun 2023</strong>.
          </p>
          <p className="text-white/70">
            © 2026 SIGAP — Ruang Perlindungan &amp; Pengaduan Pelajar.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
