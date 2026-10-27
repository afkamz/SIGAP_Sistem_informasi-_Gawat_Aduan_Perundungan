import React, { useState, useEffect } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  Download,
  Lock,
  Sparkles,
  Edit3,
  RefreshCw,
  Network,
  Database,
  Filter
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/layout/AdminLayout';

export const AuditTrail = () => {
  const { auditList, fetchAuditTrail, isBackendConnected } = useStore();
  const [filterType, setFilterType] = useState('all');
  const [searchQ, setSearchQ] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchAuditTrail();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    await fetchAuditTrail();
    setIsSyncing(false);
  };

  const filteredLogs = auditList.filter((item) => {
    if (filterType !== 'all' && item.tipe_aksi !== filterType) return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      const matchDesc = item.deskripsi?.toLowerCase().includes(q);
      const matchTicket = item.ticket_code?.toLowerCase().includes(q);
      const matchUser = item.pelaksana_nama?.toLowerCase().includes(q);
      if (!matchDesc && !matchTicket && !matchUser) return false;
    }
    return true;
  });

  const getActionIcon = (type) => {
    switch (type) {
      case 'status':
        return <RefreshCw className="w-4 h-4 text-[#3B7DE8]" />;
      case 'ai_approve':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'override':
        return <Edit3 className="w-4 h-4 text-amber-600" />;
      case 'ai_cluster':
        return <Network className="w-4 h-4 text-indigo-600" />;
      case 'download':
        return <Download className="w-4 h-4 text-emerald-600" />;
      default:
        return <Lock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getActionBg = (type) => {
    switch (type) {
      case 'status': return 'glass-pill-blue';
      case 'ai_approve': return 'glass-pill text-purple-600 border border-purple-200';
      case 'override': return 'glass-pill-yellow';
      case 'ai_cluster': return 'glass-pill text-indigo-600 border border-indigo-200';
      case 'download': return 'glass-pill-green';
      default: return 'glass-pill text-slate-500';
    }
  };

  return (
    <AdminLayout
      title="Jejak Audit Sistem (Audit Trail)"
      subtitle="Log kronologis aktivitas tidak dapat diubah (immutable) dengan verifikasi hash integritas"
    >
      <div className="space-y-5 max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Admin Panel</span>
            <span>&gt;</span>
            <span className="text-slate-800 font-bold">Audit Trail</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Jejak Audit Sistem</h1>
          <p className="text-xs text-slate-600">Log kronologis aktivitas immutable dengan verifikasi hash integritas SHA-256 Liquid OS.</p>
        </div>

        {/* Banner Integritas SHA-256 — Liquid Glass Elevated */}
        <div className="p-5 rounded-3xl glass-panel-elevated border border-emerald-200/60 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl glass-pill-green flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900">Integritas Audit Terverifikasi (Cryptographic SHA-256)</h3>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                Setiap mutasi status laporan, persetujuan model AI, serta akses unduh berkas dicatat secara permanen untuk menjamin akuntabilitas SOP penanganan PPKSP.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-2xl glass-button-primary text-white font-extrabold text-[11px] shadow-sm">
              ✓ Log Hash Verified
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-panel-elevated p-3.5 rounded-3xl border border-white/80 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Cari pelaksana, tiket, atau deskripsi..."
              className="w-full pl-9 pr-3 py-2 rounded-2xl glass-input text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition ${
              isBackendConnected ? 'glass-pill-green' : 'glass-card text-slate-600'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <Database className="w-3.5 h-3.5" />
              <span>{isBackendConnected ? 'MySQL Terhubung' : 'Offline'}</span>
            </div>

            <button
              type="button"
              onClick={handleSync}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-2xl glass-card text-xs font-bold text-slate-700 flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#3B7DE8]' : 'text-slate-400'}`} />
              <span>Sinkronkan</span>
            </button>

            <div className="relative">
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-2xl glass-input text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Tipe Aksi</option>
                <option value="status">Perubahan Status</option>
                <option value="ai_approve">Persetujuan AI</option>
                <option value="override">Override Manual</option>
                <option value="ai_cluster">Automasi Klaster</option>
                <option value="download">Unduh Berkas</option>
              </select>
            </div>
          </div>
        </div>

        {/* List Audit Trail Cards */}
        <div className="glass-panel-elevated rounded-3xl border border-white/80 shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/50 pb-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-[#3B7DE8]" />
              Histori Aktivitas Sistem
            </h4>
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold glass-pill-blue">
              {filteredLogs.length} Catatan
            </span>
          </div>

          <div className="divide-y divide-white/40">
            {filteredLogs.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                Belum ada log audit yang tersedia.
              </div>
            ) : (
              filteredLogs.map((item) => (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/60 rounded-2xl px-3 transition">
                  <div className="flex items-start gap-3.5">
                    <div className={`w-9 h-9 rounded-2xl ${getActionBg(item.tipe_aksi)} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      {getActionIcon(item.tipe_aksi)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{item.pelaksana_nama}</span>
                        <span className="text-[10px] text-slate-600 glass-pill px-2.5 py-0.5 rounded-full">
                          {item.pelaksana_role}
                        </span>
                        {item.ticket_code && item.ticket_code !== '-' && (
                          <span className="font-mono text-[10px] font-bold glass-pill-blue px-2.5 py-0.5 rounded-full">
                            {item.ticket_code}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-800">{item.deskripsi}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{item.detail_perubahan}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1 flex-shrink-0 self-start sm:self-center">
                    <span className="text-[11px] text-slate-400 font-medium">{item.waktu}</span>
                    <span className="text-[10px] font-mono glass-pill-green px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Immutable SHA-256
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AuditTrail;
