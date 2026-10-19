import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Search,
  RotateCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  SlidersHorizontal,
  ChevronDown,
  Database,
  Brain,
  GitBranch,
  Zap,
  BarChart3,
  Filter,
  ShieldCheck,
  Edit3,
  TrendingUp,
  Info,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/layout/AdminLayout';

// ─── Konstanta ────────────────────────────────────────────────────────────────
const STATUS_VALIDASI = {
  belum_divalidasi: { label: 'Menunggu', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  ai_disetujui:     { label: 'AI Disetujui', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  manual_override:  { label: 'Override Manual', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
};

const CONFIDENCE_LEVEL = (score) => {
  if (score >= 85) return { label: 'Tinggi', color: 'text-emerald-600', bar: 'bg-emerald-500' };
  if (score >= 70) return { label: 'Sedang', color: 'text-amber-600', bar: 'bg-amber-400' };
  return { label: 'Rendah', color: 'text-red-600', bar: 'bg-red-500' };
};

// ─── Sub-komponen Confidence Bar ─────────────────────────────────────────────
const ConfidenceBar = ({ score }) => {
  const level = CONFIDENCE_LEVEL(score);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className={`text-[10px] font-semibold ${level.color}`}>{level.label}</span>
        <span className="text-[11px] font-bold text-slate-700">{score.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${level.bar}`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );
};

// ─── Modal Override Kategori ──────────────────────────────────────────────────
const OverrideModal = ({ report, categories, onConfirm, onClose }) => {
  const [selectedCat, setSelectedCat] = useState(report.kategori_id);
  const [catatan, setCatatan] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200">
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
            <Edit3 className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Override Kategori Manual</h3>
            <p className="text-[11px] text-slate-500">Tiket: {report.ticket_code}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Rekomendasi AI */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50 border border-sky-200">
            <Sparkles className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[11px] font-semibold text-sky-700">Rekomendasi AI (IndoBERT)</p>
              <p className="text-xs text-sky-900 font-medium mt-0.5">
                {report.ai?.kategori_rekomendasi || '—'}{' '}
                <span className="text-sky-600">({(report.ai?.confidence || 0).toFixed(1)}%)</span>
              </p>
            </div>
          </div>

          {/* Pilih Kategori */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kategori Pengganti
            </label>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(Number(e.target.value))}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nama}</option>
              ))}
            </select>
          </div>

          {/* Alasan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Alasan Override <span className="text-slate-400 font-normal">(opsional)</span>
            </label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
              placeholder="Contoh: Bukti video menunjukkan kontak fisik langsung..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 p-5 pt-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(report.id, selectedCat, catatan)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors"
          >
            Simpan Override
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Row Tabel ────────────────────────────────────────────────────────────────
const TableRow = ({ report, onApprove, onOverride, isApproving, isOverriding }) => {
  const validasi = report.ai?.is_approved
    ? STATUS_VALIDASI.ai_disetujui
    : report.ai?.is_overridden
    ? STATUS_VALIDASI.manual_override
    : STATUS_VALIDASI.belum_divalidasi;

  const confidence = report.ai?.confidence ?? 0;
  const isDone = report.ai?.is_approved || report.ai?.is_overridden;

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
      {/* Tiket */}
      <td className="px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-mono font-bold text-slate-800">{report.ticket_code}</span>
          <span className="text-[10px] text-slate-400">{report.tanggal}</span>
        </div>
      </td>

      {/* Rekomendasi AI */}
      <td className="px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1">
            <Brain className="w-3 h-3 text-sky-500 flex-shrink-0" />
            <span className="text-[11px] font-semibold text-sky-700 leading-tight">
              {report.ai?.kategori_rekomendasi || '—'}
            </span>
          </div>
          <div className="w-28 mt-1">
            <ConfidenceBar score={confidence} />
          </div>
        </div>
      </td>

      {/* Kategori Terdaftar */}
      <td className="px-4 py-3">
        <span className="text-[11px] text-slate-700 font-medium">{report.kategori_nama}</span>
      </td>

      {/* Klaster HDBSCAN */}
      <td className="px-4 py-3">
        {report.ai?.cluster_label !== null && report.ai?.cluster_label !== undefined ? (
          <div className="flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[11px] font-semibold text-indigo-700">
              Klaster #{report.ai.cluster_label}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] text-slate-400 italic">
              {report.ai?.is_noise !== false ? 'Noise / Outlier' : '—'}
            </span>
          </div>
        )}
      </td>

      {/* Status Validasi */}
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border ${validasi.bg} ${validasi.color} ${validasi.border}`}
        >
          {report.ai?.is_approved
            ? <CheckCircle2 className="w-3 h-3" />
            : report.ai?.is_overridden
            ? <Edit3 className="w-3 h-3" />
            : <AlertTriangle className="w-3 h-3" />
          }
          {validasi.label}
        </span>
      </td>

      {/* Aksi */}
      <td className="px-4 py-3">
        {isDone ? (
          <span className="text-[10px] text-slate-400 italic">Selesai divalidasi</span>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onApprove(report.id)}
              disabled={isApproving}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold hover:bg-emerald-100 transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-3 h-3" />
              Setujui AI
            </button>
            <button
              onClick={() => onOverride(report)}
              disabled={isOverriding}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-semibold hover:bg-purple-100 transition-colors disabled:opacity-50"
            >
              <Edit3 className="w-3 h-3" />
              Override
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

// ─── Halaman Utama ────────────────────────────────────────────────────────────
export const AiValidation = () => {
  const {
    reports,
    categories,
    fetchAdminReports,
    approveAiCategory,
    overrideCategory,
    isBackendConnected,
    token,
    getMetrics,
  } = useStore();

  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [filterConf, setFilterConf] = useState('semua');
  const [overrideTarget, setOverrideTarget] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Load laporan saat mount
  useEffect(() => {
    fetchAdminReports();
  }, []);

  const metrics = getMetrics();

  // Filter + search
  const filtered = useMemo(() => {
    return reports.filter((r) => {
      // Hanya tampilkan laporan yang sudah diproses AI (ada confidence score)
      if (!r.ai) return false;

      // Filter status validasi
      if (filterStatus === 'menunggu' && (r.ai.is_approved || r.ai.is_overridden)) return false;
      if (filterStatus === 'disetujui' && !r.ai.is_approved) return false;
      if (filterStatus === 'override' && !r.ai.is_overridden) return false;

      // Filter confidence
      if (filterConf === 'tinggi' && r.ai.confidence < 85) return false;
      if (filterConf === 'sedang' && (r.ai.confidence < 70 || r.ai.confidence >= 85)) return false;
      if (filterConf === 'rendah' && r.ai.confidence >= 70) return false;

      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTicket = r.ticket_code?.toLowerCase().includes(q);
        const matchKat = r.kategori_nama?.toLowerCase().includes(q);
        const matchRek = r.ai?.kategori_rekomendasi?.toLowerCase().includes(q);
        if (!matchTicket && !matchKat && !matchRek) return false;
      }

      return true;
    });
  }, [reports, filterStatus, filterConf, searchQuery]);

  // Hitung statistik lokal dari filtered reports
  const stats = useMemo(() => {
    const all = reports.filter((r) => r.ai);
    const menunggu = all.filter((r) => !r.ai.is_approved && !r.ai.is_overridden).length;
    const disetujui = all.filter((r) => r.ai.is_approved).length;
    const override = all.filter((r) => r.ai.is_overridden).length;
    const avgConf = all.length
      ? all.reduce((sum, r) => sum + (r.ai.confidence || 0), 0) / all.length
      : 0;
    return { total: all.length, menunggu, disetujui, override, avgConf };
  }, [reports]);

  const handleSync = async () => {
    setIsSyncing(true);
    await fetchAdminReports();
    setIsSyncing(false);
  };

  const handleApprove = async (id) => {
    setApprovingId(id);
    const ok = await approveAiCategory(id);
    setApprovingId(null);
    if (ok) {
      setSuccessMsg('✓ Rekomendasi AI berhasil disetujui');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleOverrideConfirm = async (id, newCatId, catatan) => {
    setOverrideTarget(null);
    await overrideCategory(id, newCatId, catatan);
    setSuccessMsg('✓ Kategori berhasil di-override');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <AdminLayout title="Validasi AI" subtitle="Tinjau dan validasi rekomendasi IndoBERT untuk setiap laporan">
      {/* ── Modal Override ─────────────────────────────────────────────────── */}
      {overrideTarget && (
        <OverrideModal
          report={overrideTarget}
          categories={categories}
          onConfirm={handleOverrideConfirm}
          onClose={() => setOverrideTarget(null)}
        />
      )}

      {/* ── Toast Sukses ───────────────────────────────────────────────────── */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      <div className="space-y-6">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 leading-tight">Validasi AI</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Tabel kerja tinjauan rekomendasi IndoBERT + HDBSCAN
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Indikator koneksi */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border ${
              isBackendConnected
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <Database className="w-3.5 h-3.5" />
              {isBackendConnected ? 'MySQL Terhubung' : 'Mode Lokal'}
            </div>

            {/* Tombol Sinkronisasi */}
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 text-white text-[11px] font-semibold hover:bg-sky-700 transition-colors disabled:opacity-60"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Menyinkron...' : 'Sinkron Data'}
            </button>
          </div>
        </div>

        {/* ── Kartu Statistik ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: 'Total Diproses AI',
              value: stats.total,
              icon: Brain,
              color: 'text-sky-600',
              bg: 'bg-sky-50',
              border: 'border-sky-200',
            },
            {
              label: 'Menunggu Validasi',
              value: stats.menunggu,
              icon: AlertTriangle,
              color: 'text-amber-600',
              bg: 'bg-amber-50',
              border: 'border-amber-200',
            },
            {
              label: 'AI Disetujui',
              value: stats.disetujui,
              icon: ShieldCheck,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
              border: 'border-emerald-200',
            },
            {
              label: 'Avg. Confidence',
              value: `${stats.avgConf.toFixed(1)}%`,
              icon: TrendingUp,
              color: 'text-indigo-600',
              bg: 'bg-indigo-50',
              border: 'border-indigo-200',
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-2xl border p-4 flex items-center gap-3 ${s.bg} ${s.border}`}
            >
              <div className={`w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <s.icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium leading-none">{s.label}</p>
                <p className={`text-xl font-extrabold mt-0.5 ${s.color}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Toolbar Filter ───────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tiket, kategori, atau rekomendasi..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 bg-slate-50"
            />
          </div>

          {/* Filter Status Validasi */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white"
            >
              <option value="semua">Semua Status</option>
              <option value="menunggu">Menunggu Validasi</option>
              <option value="disetujui">AI Disetujui</option>
              <option value="override">Override Manual</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Filter Confidence */}
          <div className="relative">
            <select
              value={filterConf}
              onChange={(e) => setFilterConf(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white"
            >
              <option value="semua">Semua Confidence</option>
              <option value="tinggi">Tinggi (≥85%)</option>
              <option value="sedang">Sedang (70–84%)</option>
              <option value="rendah">Rendah (&lt;70%)</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Jumlah hasil */}
          <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
            {filtered.length} laporan
          </span>
        </div>

        {/* ── Tabel Utama ─────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* Info banner */}
          <div className="flex items-center gap-2.5 px-4 py-3 bg-sky-50 border-b border-sky-100">
            <Info className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
            <p className="text-[11px] text-sky-700">
              Rekomendasi AI dibuat oleh model <strong>IndoBERT</strong> (embedding) + Cosine Similarity terhadap 7 centroid Permendikbudristek No. 46/2023,
              divalidasi klaster oleh <strong>HDBSCAN</strong>.
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Sparkles className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm font-semibold">Tidak ada laporan ditemukan</p>
              <p className="text-xs mt-1">
                {reports.filter((r) => r.ai).length === 0
                  ? 'Belum ada laporan yang diproses oleh AI pipeline.'
                  : 'Coba ubah filter atau kata kunci pencarian.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {[
                      'No. Tiket',
                      'Rekomendasi AI',
                      'Kategori Terdaftar',
                      'Klaster HDBSCAN',
                      'Status Validasi',
                      'Aksi',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((report) => (
                    <TableRow
                      key={report.id}
                      report={report}
                      onApprove={handleApprove}
                      onOverride={(r) => setOverrideTarget(r)}
                      isApproving={approvingId === report.id}
                      isOverriding={false}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer tabel */}
          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Menampilkan {filtered.length} dari {reports.filter((r) => r.ai).length} laporan yang diproses AI
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-slate-400">Disetujui: {stats.disetujui}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="text-[10px] text-slate-400">Override: {stats.override}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-[10px] text-slate-400">Menunggu: {stats.menunggu}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Catatan Teknis ───────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl border border-slate-200 p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 mb-2">Cara Kerja AI Pipeline SIGAP</h3>
              <ol className="space-y-1.5 text-[11px] text-slate-600 list-decimal list-inside">
                <li>
                  <strong>Embedding IndoBERT</strong> — Narasi laporan siswa diubah menjadi vektor 768 dimensi oleh model IndoBERT (indobenchmark).
                </li>
                <li>
                  <strong>Cosine Similarity</strong> — Vektor laporan dibandingkan ke 7 centroid kategori resmi Permendikbudristek No. 46/2023 untuk menentukan kategori dengan skor tertinggi.
                </li>
                <li>
                  <strong>Kalibrasi Confidence</strong> — Skor dikalibrasi berbasis gap margin ke kategori kedua: <code>min(0.96, max(0.50, 0.50 + best × 0.8 + gap × 0.4))</code>.
                </li>
                <li>
                  <strong>HDBSCAN Clustering</strong> — Laporan baru dibandingkan ke embedding seluruh laporan sebelumnya untuk mendeteksi pola kejadian berulang (klaster) atau kasus tunggal (noise).
                </li>
              </ol>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
