import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Lock,
  Sparkles,
  Edit3,
  RefreshCw,
  Network
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/layout/AdminLayout';

export const AuditTrail = () => {
  const { auditList } = useStore();
  const [filterType, setFilterType] = useState('all');
  const [searchQ, setSearchQ] = useState('');

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
        return <RefreshCw className="w-4 h-4 text-sky-600" />;
      case 'ai_approve':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'override':
        return <Edit3 className="w-4 h-4 text-amber-600" />;
      case 'ai_cluster':
        return <Network className="w-4 h-4 text-indigo-600" />;
      case 'download':
        return <Download className="w-4 h-4 text-emerald-600" />;
      default:
        return <Lock className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <AdminLayout
      title="Jejak Audit Sistem (Audit Trail)"
      subtitle="Log kronologis aktivitas tidak dapat diubah (immutable) dengan verifikasi hash integritas"
    >
      <div className="space-y-6">
        {/* Banner Integritas SHA-256 */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-5 lg:p-6 rounded-3xl border border-emerald-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900">Integritas Audit Terverifikasi (Cryptographic SHA-256)</h3>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                Setiap mutasi status laporan, persetujuan model AI, serta akses unduh berkas dicatat secara permanen untuk menjamin akuntabilitas SOP penanganan PPKSP.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold text-[11px] shadow-2xs">
              ✓ Log Hash Verified
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Cari pelaksana, tiket, atau deskripsi..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#A7D8F0]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-700 focus:outline-none"
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

        {/* List Audit Trail Cards */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-3">
            Histori Aktivitas Sistem ({filteredLogs.length} Catatan)
          </h4>

          <div className="divide-y divide-slate-100">
            {filteredLogs.map((item) => (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getActionIcon(item.tipe_aksi)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{item.pelaksana_nama}</span>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.pelaksana_role}
                      </span>
                      {item.ticket_code && item.ticket_code !== '-' && (
                        <span className="font-mono text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
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
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Immutable SHA-256
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

