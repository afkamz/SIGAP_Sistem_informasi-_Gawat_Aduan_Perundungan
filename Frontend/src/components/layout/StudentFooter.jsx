import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const StudentFooter = () => {
  return (
    <footer className="border-t border-slate-200 py-6 px-6 text-xs text-slate-500 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-600 flex-shrink-0" />
          <span>Layanan aduan resmi bimbingan konseling dan kesiswaan. Kerahasiaan identitas terjamin 100%.</span>
        </div>
        <div className="text-slate-400">
          © 2026 SIGAP — Sistem Informasi Pengaduan Pelajar. Politeknik Elektronika Negeri Surabaya.
        </div>
      </div>
    </footer>
  );
};

