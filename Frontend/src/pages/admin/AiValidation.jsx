import React from 'react';
import { Sparkles } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';

export const AiValidation = () => {
  return (
    <AdminLayout
      title="Validasi AI"
      subtitle="Modul analisis dan tinjauan cerdas model AI"
    >
      <div className="min-h-[65vh] bg-white rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 shadow-2xs">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Coming Soon
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-2 leading-relaxed">
          Fitur Validasi AI sedang dalam tahap pengembangan dan penyempurnaan.
        </p>
      </div>
    </AdminLayout>
  );
};

