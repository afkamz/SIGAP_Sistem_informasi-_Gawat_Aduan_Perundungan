import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const StudentFooter = () => {
  return (
    <footer className="glass-panel border-t border-white/60 py-6 px-6 text-xs text-slate-500 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl glass-pill-green flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-slate-600 font-medium">
            Layanan aduan resmi bimbingan konseling dan kesiswaan. Kerahasiaan identitas terjamin 100%.
          </span>
        </div>
        <div className="text-slate-400 flex items-center gap-1 font-medium">
          <span>© 2026 SIGAP — Sistem Informasi Pengaduan Pelajar Liquid Glass OS.</span>
        </div>
      </div>
    </footer>
  );
};

export default StudentFooter;
