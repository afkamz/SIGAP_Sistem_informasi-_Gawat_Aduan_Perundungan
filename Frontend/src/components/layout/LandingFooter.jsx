import React from 'react';
import { ShieldCheck, PhoneCall, HeartHandshake, Lock } from 'lucide-react';
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
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs"
              style={{ background: '#FFFFFF' }}
            >
              <ShieldCheck className="w-5 h-5 text-[#142B4A]" />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-white">
                SIGAP
              </span>
              <p className="text-xs text-white/80">
                Sistem Informasi Gawat Aduan Perundungan Sekolah
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-white">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-xs" style={{ background: '#142B4A', borderColor: 'rgba(255, 255, 255, 0.25)', color: '#FFFFFF' }}>
              <Lock className="w-3.5 h-3.5 text-white" />
              <span>Enkripsi Berlapis 100%</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-xs" style={{ background: '#142B4A', borderColor: 'rgba(255, 255, 255, 0.25)', color: '#FFFFFF' }}>
              <HeartHandshake className="w-3.5 h-3.5 text-white" />
              <span>Pendampingan BK &amp; PPKSP</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-xs" style={{ background: '#142B4A', borderColor: 'rgba(255, 255, 255, 0.25)', color: '#FFFFFF' }}>
              <PhoneCall className="w-3.5 h-3.5 text-white" />
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
