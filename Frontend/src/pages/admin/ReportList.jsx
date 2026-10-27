import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  RotateCw,
  Download,
  FileText,
  ClipboardList,
  Sparkles,
  Share2,
  Database,
  SlidersHorizontal,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  AlertTriangle,
  Link as LinkIcon,
  Asterisk,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/layout/AdminLayout';

export const ReportList = ({ defaultFilter = '' }) => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || defaultFilter || 'semua';

  const { reports, categories, getMetrics, fetchAdminReports, isBackendConnected } = useStore();
  const navigate = useNavigate();

  const metrics = getMetrics();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchAdminReports();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    await fetchAdminReports();
    setIsSyncing(false);
  };

  const [activeTab, setActiveTab] = useState(tabParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [selectedSource, setSelectedSource] = useState('semua');

  const [selectedRows, setSelectedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code, e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      if (activeTab === 'menunggu' && item.status !== 'menunggu') return false;
      if (activeTab === 'low_ai' && (!item.ai || item.ai.confidence >= 80)) return false;
      if (activeTab === 'klaster' && (!item.ai?.cluster_label || item.ai?.is_noise)) return false;
      if (activeTab === 'referensi' && item.is_active) return false;

      if (selectedSource === 'aktif' && !item.is_active) return false;
      if (selectedSource === 'referensi' && item.is_active) return false;

      if (selectedCategory !== 'semua') {
        const catName = item.kategori_nama?.toLowerCase() || '';
        if (!catName.includes(selectedCategory.toLowerCase())) return false;
      }

      if (selectedStatus !== 'semua') {
        if (item.status !== selectedStatus) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = item.ticket_code?.toLowerCase().includes(q);
        const matchJudul = item.judul?.toLowerCase().includes(q);
        const matchDeskripsi = item.deskripsi?.toLowerCase().includes(q);
        const matchKategori = item.kategori_nama?.toLowerCase().includes(q);
        const matchReporter = item.reporter_name?.toLowerCase().includes(q) || item.reporter_label?.toLowerCase().includes(q);
        if (!matchCode && !matchJudul && !matchDeskripsi && !matchKategori && !matchReporter) return false;
      }

      return true;
    });
  }, [reports, activeTab, selectedSource, selectedCategory, selectedStatus, searchQuery]);

  const totalCount = filteredReports.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReports.slice(start, start + itemsPerPage);
  }, [filteredReports, currentPage, itemsPerPage]);

  const activeReportsCount = useMemo(() => {
    return filteredReports.filter((r) => r.is_active).length;
  }, [filteredReports]);

  const referenceReportsCount = useMemo(() => {
    return filteredReports.filter((r) => !r.is_active).length;
  }, [filteredReports]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(new Set(paginatedReports.map((r) => r.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id, e) => {
    e.stopPropagation();
    const updated = new Set(selectedRows);
    if (updated.has(id)) updated.delete(id);
    else updated.add(id);
    setSelectedRows(updated);
  };

  const handleResetFilters = () => {
    setActiveTab('semua');
    setSearchQuery('');
    setSelectedCategory('semua');
    setSelectedStatus('semua');
    setSelectedSource('semua');
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const header = 'Kode Tiket,Kategori,Status,Pelapor,Tingkat Keparahan,Tanggal\n';
    const rows = filteredReports.map((r) =>
      `"${r.ticket_code}","${r.kategori_nama}","${r.status}","${r.reporter_label || (r.is_anonymous ? 'Anonim' : 'Terdaftar')}","${r.urgensi}","${r.tanggal}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Daftar_Laporan_SIGAP_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPI Tab config
  const kpiTabs = [
    { key: 'semua', label: 'Semua Aduan', count: metrics.total ?? 0, sub: 'total kasus', icon: FileText, color: 'blue' },
    { key: 'menunggu', label: 'Menunggu Verifikasi', count: metrics.menunggu ?? 0, sub: 'butuh tindakan', icon: ClipboardList, color: 'amber' },
    { key: 'low_ai', label: 'Perlu Tinjauan AI', count: metrics.lowAi ?? 0, sub: 'akurasi <80%', icon: Sparkles, color: 'blue' },
    { key: 'klaster', label: 'Terdeteksi Klaster', count: metrics.clusters ?? 0, sub: 'pola berulang', icon: Share2, color: 'purple' },
    { key: 'referensi', label: 'Data Referensi', count: metrics.referenceCount ?? 0, sub: 'benchmark', icon: Database, color: 'slate' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-7xl mx-auto">

        {/* Top Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>Admin Panel</span>
              <span>&gt;</span>
              <span className="text-slate-800 font-bold">Daftar Laporan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Daftar Laporan Masuk
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Kelola, verifikasi, dan pantau seluruh aduan insiden siswa dan data rujukan nasional PPKSP.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition ${
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
              className="px-3.5 py-2 rounded-2xl glass-card text-xs font-bold text-slate-700 flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#3B7DE8]' : 'text-slate-400'}`} />
              <span>Sinkronkan</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-2xl glass-button-primary text-white font-bold text-xs flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor Data (CSV)</span>
            </button>
          </div>
        </div>

        {/* 5 KPI Tab Cards — Liquid Glass Style */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {kpiTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
                className={`p-4 rounded-3xl text-left transition-all flex flex-col justify-between space-y-2 ${
                  isActive
                    ? 'glass-button-primary text-white shadow-lg'
                    : 'glass-card text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className={isActive ? 'text-white/90 font-bold' : 'text-slate-600'}>{tab.label}</span>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F5C518]' : 'text-slate-400'}`} />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-2xl font-black ${isActive ? 'text-white' : 'text-slate-900'}`}>{tab.count}</span>
                  <span className={`text-xs font-medium ${isActive ? 'text-white/80' : 'text-slate-400'}`}>{tab.sub}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Search & Filter Toolbar — Liquid Glass Panel */}
        <div className="glass-panel-elevated p-3.5 rounded-3xl border border-white/80 shadow-sm flex flex-col lg:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Cari kode tiket, nama siswa/terlapor, atau kata kunci..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl glass-input text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Category Select */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="appearance-none pl-3 pr-8 py-2 rounded-2xl glass-input text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer min-w-[130px]"
              >
                <option value="semua">Semua Kategori</option>
                <option value="verbal">Perundungan Verbal</option>
                <option value="fisik">Perundungan Fisik</option>
                <option value="siber">Perundungan Siber</option>
                <option value="pemalakan">Pemalakan / Pemerasan</option>
                <option value="diskriminasi">Diskriminasi &amp; Intoleransi</option>
                <option value="pengabaian">Pengabaian / Lainnya</option>
                <option value="seksual">Kekerasan Seksual</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Select */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                className="appearance-none pl-3 pr-8 py-2 rounded-2xl glass-input text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer min-w-[120px]"
              >
                <option value="semua">Semua Status</option>
                <option value="menunggu">Menunggu</option>
                <option value="diverifikasi">Diverifikasi</option>
                <option value="ditindaklanjuti">Ditindaklanjuti</option>
                <option value="selesai">Selesai</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Source Select */}
            <div className="relative">
              <select
                value={selectedSource}
                onChange={(e) => { setSelectedSource(e.target.value); setCurrentPage(1); }}
                className="appearance-none pl-3 pr-8 py-2 rounded-2xl glass-input text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer min-w-[125px]"
              >
                <option value="semua">Semua Sumber</option>
                <option value="aktif">Data Aktif</option>
                <option value="referensi">Data Referensi</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="button"
              className="p-2 rounded-2xl glass-button-primary text-white"
              title="Filter Lanjutan"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="p-2 rounded-2xl glass-card text-slate-500 hover:text-slate-800"
              title="Reset Filter"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Data Table — Liquid Glass Panel */}
        <div className="glass-panel-elevated rounded-3xl border border-white/80 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="glass-panel border-b border-white/50 text-slate-600 font-bold text-[11px]">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={paginatedReports.length > 0 && selectedRows.size === paginatedReports.length}
                      className="rounded border-slate-300 text-[#3B7DE8] focus:ring-[#3B7DE8] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3">Kode Tiket</th>
                  <th className="py-3 px-3">Kategori Dilaporkan</th>
                  <th className="py-3 px-3">Rekomendasi AI</th>
                  <th className="py-3 px-3">Status Penanganan</th>
                  <th className="py-3 px-3">Penanda Klaster</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40 font-medium">
                {paginatedReports.length > 0 ? (
                  paginatedReports.map((item) => {
                    const isChecked = selectedRows.has(item.id);
                    const isRef = !item.is_active || item.ticket_code?.startsWith('REF-');
                    const isSexual = item.kategori_nama?.toLowerCase().includes('seksual');

                    const confidence = item.ai?.confidence || 85;
                    const isLowAi = confidence < 80;

                    let clusterBadge = null;
                    if (item.ticket_code === 'SGP-2024-0142') {
                      clusterBadge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold glass-pill-yellow">
                          <LinkIcon className="w-3 h-3 text-amber-600" />
                          <span>Kemungkinan Klaster...</span>
                        </span>
                      );
                    } else if (item.ticket_code === 'SGP-2024-0141' || item.ticket_code === 'SGP-2024-0136') {
                      clusterBadge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold glass-pill text-slate-700">
                          <LinkIcon className="w-3 h-3 text-slate-500" />
                          <span>Terhubung ke...</span>
                        </span>
                      );
                    } else if (item.ticket_code === 'SGP-2024-0139') {
                      clusterBadge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold glass-pill text-purple-700 border-purple-200">
                          <Asterisk className="w-3 h-3 text-purple-600" />
                          <span>Pusat Klaster...</span>
                        </span>
                      );
                    } else {
                      clusterBadge = <span className="text-slate-300 font-bold">-</span>;
                    }

                    let statusBadge = null;
                    if (item.status === 'menunggu') {
                      statusBadge = <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold glass-pill-yellow">Menunggu</span>;
                    } else if (item.status === 'diverifikasi') {
                      statusBadge = <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold glass-pill-blue">Diverifikasi</span>;
                    } else if (item.status === 'ditindaklanjuti') {
                      statusBadge = <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold glass-pill text-purple-700 border-purple-200">Ditindaklanjuti</span>;
                    } else if (item.status === 'selesai') {
                      statusBadge = <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold glass-pill-green">Selesai</span>;
                    }

                    return (
                      <tr
                        key={item.id}
                        onClick={() => navigate(`/admin/laporan-detail?id=${item.id}`)}
                        className={`hover:bg-white/60 cursor-pointer transition ${isChecked ? 'bg-white/80' : ''}`}
                      >
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleSelectRow(item.id, e)}
                            className="rounded border-slate-300 text-[#3B7DE8] focus:ring-[#3B7DE8] cursor-pointer"
                          />
                        </td>

                        <td className="py-3 px-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-slate-900 text-xs">
                                {item.ticket_code}
                              </span>
                              {isRef && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black glass-pill text-slate-600">
                                  REF
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => handleCopyCode(item.ticket_code, e)}
                                title="Salin Kode"
                                className="text-slate-400 hover:text-[#3B7DE8] p-0.5 rounded transition"
                              >
                                {copiedCode === item.ticket_code ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-500 block truncate max-w-[200px]">
                              {isRef
                                ? 'Puspeka Kemendikbudristek • Benchmark'
                                : item.reporter_label || (item.is_anonymous ? 'Kelas IX-B • Anonim' : 'Pelapor Terdaftar')}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          {isSexual ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold glass-pill-red">
                              Kekerasan Seksual
                            </span>
                          ) : (
                            <span className="text-slate-800 font-semibold">{item.kategori_nama}</span>
                          )}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          {isRef ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold glass-pill text-slate-600">
                              <CheckCircle2 className="w-3 h-3 text-slate-400" />
                              <span>Pola Terverifikasi {confidence}%</span>
                            </span>
                          ) : isLowAi ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold glass-pill-yellow">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span>Ketidakcocokan {confidence}%</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold glass-pill-blue">
                              <Sparkles className="w-3 h-3 text-[#3B7DE8]" />
                              <span>{item.ai?.kategori_rekomendasi || item.kategori_nama?.split(' ')[0]} {confidence}%</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">{statusBadge}</td>

                        <td className="py-3 px-3 whitespace-nowrap">{clusterBadge}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                      Tidak ada laporan yang sesuai dengan kriteria filter saat ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer & Pagination */}
          <div className="p-4 border-t border-white/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Menampilkan {Math.min(1, totalCount)}-{Math.min(itemsPerPage * currentPage, totalCount)} dari{' '}
              <strong className="text-slate-800 font-bold">{totalCount}</strong> laporan (
              <span className="text-[#3B7DE8] font-bold">{activeReportsCount} Aktif</span>,{' '}
              {referenceReportsCount} Referensi)
            </div>

            <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="appearance-none pl-3 pr-8 py-1 rounded-2xl glass-input text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value={10}>10 per halaman</option>
                  <option value={20}>20 per halaman</option>
                  <option value={50}>50 per halaman</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-xl glass-card text-slate-600 disabled:opacity-40 disabled:pointer-events-none text-xs"
                >
                  ← Sebelumnya
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 rounded-xl text-xs font-bold transition ${
                      currentPage === p
                        ? 'glass-button-primary text-white'
                        : 'glass-card text-slate-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                {totalPages > 5 && <span className="text-slate-300 px-1">...</span>}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 rounded-xl glass-card text-slate-600 disabled:opacity-40 disabled:pointer-events-none text-xs"
                >
                  Selanjutnya →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info Box — Liquid Glass */}
        <div className="glass-card border border-white/80 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl glass-pill-blue flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#3B7DE8]" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Panduan Validasi AI &amp; Deteksi Klaster PPKSP Liquid OS
              </h4>
            </div>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold glass-pill-blue">
              Model NLP IndoBERT v2.4
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Sistem AI menganalisis narasi laporan untuk mencocokkan pola insiden serupa secara otomatis guna mendeteksi tindakan perundungan berulang dalam lingkup kelas atau angkatan yang sama.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-slate-500 border-t border-white/50">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B7DE8]" />
              <span>Ambang Akurasi Stabil: ≥ 85%</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Perlu Verifikasi Manual: &lt; 80%</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>Deteksi Kesamaan Semantik: Bertaut Otomatis</span>
            </span>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default ReportList;
