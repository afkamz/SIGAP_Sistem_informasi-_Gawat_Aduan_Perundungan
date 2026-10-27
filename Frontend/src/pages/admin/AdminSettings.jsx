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
      <div className="max-w-2xl space-y-5">

        {/* Page Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Admin Panel</span>
            <span>&gt;</span>
            <span className="text-slate-800 font-bold">Pengaturan</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pengaturan Sistem</h1>
          <p className="text-xs text-slate-600">Kelola parameter satuan pendidikan, ambang model AI, dan sinkronisasi basis data Liquid OS.</p>
        </div>

        {savedMsg && (
          <div className="p-3.5 rounded-2xl glass-pill-green text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{savedMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Informasi Satuan Pendidikan */}
          <div className="glass-panel-elevated p-6 rounded-3xl border border-white/80 shadow-md space-y-4">
            <div className="flex items-center gap-2 border-b border-white/50 pb-3">
              <Shield className="w-4 h-4 text-[#3B7DE8]" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Informasi Satuan Pendidikan
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Nama Satuan Pendidikan</label>
                <input
                  type="text"
                  defaultValue="SMAN 1 Teladan"
                  className="w-full p-3 rounded-2xl glass-input font-semibold text-slate-800 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">NPSN</label>
                <input
                  type="text"
                  defaultValue="20512345"
                  className="w-full p-3 rounded-2xl glass-input font-semibold text-slate-800 focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Konfigurasi AI Pipeline */}
          <div className="glass-panel-elevated p-6 rounded-3xl border border-white/80 shadow-md space-y-4">
            <div className="flex items-center gap-2 border-b border-white/50 pb-3">
              <Sliders className="w-4 h-4 text-[#3B7DE8]" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Parameter Modul AI &amp; NLP Pipeline
              </h3>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Arsitektur NLP Terpasang</label>
                <span className="font-mono text-xs glass-pill-blue px-3.5 py-2 rounded-2xl inline-block font-semibold">
                  IndoBERT-Base-Indonesian (512-dim embedding) + HDBSCAN
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-bold text-slate-700">Ambang Batas Kepercayaan (Confidence Threshold)</label>
                  <span className="font-black text-[#3B7DE8] text-sm">{confidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[#3B7DE8]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>50% (Longgar)</span>
                  <span className="font-bold text-slate-600">80% (Standar Rekomendasi)</span>
                  <span>95% (Sangat Ketat)</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl glass-button-primary text-white font-bold text-xs"
            >
              Simpan Pengaturan
            </button>
          </div>
        </form>

        {/* Reset Uji Coba */}
        <div className="glass-panel-elevated p-6 rounded-3xl border border-red-200/50 shadow-md space-y-3">
          <div className="flex items-center gap-2 border-b border-red-100 pb-3">
            <Trash2 className="w-4 h-4 text-red-500" />
            <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider">
              Pemulihan Data &amp; Reset Uji Coba
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Kembalikan seluruh aduan dan jejak audit ke data simulasi bawaan awal jika diperlukan untuk demonstrasi sidang atau pengujian ulang.
          </p>
          <button
            type="button"
            onClick={handleResetData}
            className="px-4 py-2.5 rounded-2xl glass-pill-red font-bold text-xs flex items-center gap-2 transition"
          >
            <Trash2 className="w-4 h-4" /> Reset ke Data Simulasi Bawaan
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
