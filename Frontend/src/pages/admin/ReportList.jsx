import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Network,
  Lock,
  User,
  CheckCircle2,
  Clock,
  Archive
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/layout/AdminLayout';

export const ReportList = () => {
  const { reports, categories } = useStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('semua'); // semua, menunggu, low_ai, klaster, referensi
  const [categoryFilter, setCategoryFilter] = useState('semua');
  const [statusFilter, setStatusFilter] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic
  const filteredReports = reports.filter((report) => {
    // Tab Filter
    if (activeTab === 'menunggu' && report.status !== 'menunggu') return false;
    if (activeTab === 'low_ai' && (!report.ai || report.ai.confidence >= 80)) return false;
    if (activeTab === 'klaster' && (!report.ai || !report.ai.cluster_label)) return false;
    if (activeTab === 'referensi' && report.is_active) return false;
    if (activeTab === 'semua' && !report.is_active) return false; // Tab 'semua' default to active reports

    // Dropdown Category
    if (categoryFilter !== 'semua' && report.kategori_id !== Number(categoryFilter)) {
      return false;
    }

    // Dropdown Status
    if (statusFilter !== 'semua' && report.status !== statusFilter) {
      return false;
    }

    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTicket = report.ticket_code?.toLowerCase().includes(q);
      const matchJudul = report.judul?.toLowerCase().includes(q);
      const matchDesk = report.deskripsi?.toLowerCase().includes(q);
      const matchKategori = report.kategori_nama?.toLowerCase().includes(q);
      if (!matchTicket && !matchJudul && !matchDesk && !matchKategori) return false;
    }

    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'menunggu':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Menunggu</span>;
      case 'diverifikasi':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">Diverifikasi</span>;
      case 'ditindaklanjuti':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Ditindaklanjuti</span>;
      case 'selesai':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Selesai</span>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout
      title="Daftar Pengaduan Masuk"
      subtitle="Kelola, verifikasi dan tindak lanjuti aduan perundungan dan kekerasan peserta didik"
    >
      <div className="space-y-6">
        {/* Quick Filter Tabs (Sesuai Wireframe DaftarLaporanAdmin_SIGAP.png) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'semua', label: 'Semua Aduan Aktif' },
            { id: 'menunggu', label: '⏳ Menunggu Telaah' },
            { id: 'low_ai', label: '⚠️ Anomali / Low AI (<80%)' },
            { id: 'klaster', label: '🔗 Terhubung Klaster HDBSCAN' },
            { id: 'referensi', label: '📚 Data Referensi Nasional' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-sky-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Filter Dropdowns Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor tiket, kata kunci kejadian..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#A7D8F0]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-700 focus:outline-none"
            >
              <option value="semua">Semua Kategori (7 Jenis)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nama}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-700 focus:outline-none"
            >
              <option value="semua">Semua Status</option>
              <option value="menunggu">Menunggu Telaah</option>
              <option value="diverifikasi">Diverifikasi</option>
              <option value="ditindaklanjuti">Ditindaklanjuti</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>

        {/* Tabel / Card List Laporan */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex justify-between items-center text-xs text-slate-500 font-semibold">
            <span>Menampilkan {filteredReports.length} laporan pengaduan</span>
          </div>

          {filteredReports.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <span className="text-2xl">📋</span>
              <h4 className="text-sm font-bold text-slate-700">Tidak Ada Laporan yang Sesuai</h4>
              <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau filter yang dipilih.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredReports.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/admin/laporan-detail?id=${item.id}`)}
                  className="p-4 lg:p-5 hover:bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-sky-900 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                        {item.ticket_code}
                      </span>
                      {getStatusBadge(item.status)}
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.kategori_nama}
                      </span>
                      <span className="text-[11px] text-slate-400">• {item.tanggal}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.judul}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.deskripsi}</p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        {item.is_anonymous ? <Lock className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                        {item.reporter_label}
                      </span>
                      <span>• Lokasi: {item.lokasi || '-'}</span>
                    </div>
                  </div>

                  {/* AI & Cluster Badges */}
                  <div className="flex flex-row md:flex-col items-end gap-2 flex-shrink-0">
                    {item.ai && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border ${
                            item.ai.confidence >= 85
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : item.ai.confidence >= 70
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          IndoBERT: {item.ai.confidence}%
                        </span>
                      </div>
                    )}

                    {item.ai?.cluster_label && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1">
                        <Network className="w-3 h-3" /> {item.ai.cluster_label}
                      </span>
                    )}

                    <span className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 mt-1">
                      Periksa <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

