import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const StudentFooter = () => {
  return (
    <footer className="border-t border-slate-100 py-6 px-6 text-xs text-slate-500 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <span className="text-slate-600 font-medium">
            Layanan aduan resmi bimbingan konseling dan kesiswaan. Kerahasiaan identitas terjamin 100%.
          </span>
        </div>
        <div className="text-slate-400 flex items-center gap-1">
          <span>© 2026 SIGAP — Sistem Informasi Pengaduan Pelajar.</span>
        </div>
      </div>
    </footer>
  );
};

export default StudentFooter;
