import React, { useState } from 'react';
import { Settings, Trash2, CheckCircle2, Shield, Sliders } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/layout/AdminLayout';

export const AdminSettings = () => {
  const { resetDefault } = useStore();
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMsg('Pengaturan berhasil disimpan!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin mereset seluruh data aduan ke simulasi awal?')) {
      resetDefault();
      alert('Data berhasil direset ke kondisi awal.');
    }
  };

  return (
    <AdminLayout
      title="Pengaturan Sistem SIGAP"
      subtitle="Kelola parameter satuan pendidikan, ambang model AI, dan sinkronisasi basis data"
    >
      <div className="max-w-2xl space-y-6">
        {savedMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{savedMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Informasi Satuan Pendidikan */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Informasi Satuan Pendidikan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Satuan Pendidikan</label>
                <input
                  type="text"
                  defaultValue="SMAN 1 Teladan"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">NPSN</label>
                <input
                  type="text"
                  defaultValue="20512345"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Konfigurasi AI Pipeline */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Parameter Modul AI & NLP Pipeline
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Arsitektur NLP Terpasang</label>
                <span className="font-mono text-xs bg-slate-100 px-3 py-1.5 rounded-xl text-slate-800 inline-block border border-slate-200">
                  IndoBERT-Base-Indonesian (512-dim embedding) + HDBSCAN
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700">Ambang Batas Kepercayaan (Confidence Threshold)</label>
                  <span className="font-bold text-sky-800">{confidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[#A7D8F0]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>50% (Longgar)</span>
                  <span className="font-bold text-slate-700">80% (Standar Rekomendasi)</span>
                  <span>95% (Sangat Ketat)</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-xs transition"
            >
              Simpan Pengaturan
            </button>
          </div>
        </form>

        {/* Reset Uji Coba */}
        <div className="bg-white p-6 rounded-3xl border border-red-200 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider border-b border-red-100 pb-2">
            Pemulihan Data & Reset Uji Coba
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Kembalikan seluruh aduan dan jejak audit ke data simulasi bawaan awal jika diperlukan untuk demonstrasi sidang atau pengujian ulang.
          </p>
          <button
            type="button"
            onClick={handleResetData}
            className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-4 h-4" /> Reset ke Data Simulasi Bawaan
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

