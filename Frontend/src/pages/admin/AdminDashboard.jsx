import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  ClipboardList,
  RotateCw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Download,
  Info,
  ExternalLink,
  Database,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { TrendLineChart } from '../../components/charts/DashboardCharts';

export const AdminDashboard = () => {
  const { reports, getMetrics, fetchDashboardSummary, fetchAdminReports, isBackendConnected, currentUser } = useStore();
  const navigate = useNavigate();

  const metrics = getMetrics();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchDashboardSummary();
    fetchAdminReports();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    await Promise.all([fetchDashboardSummary(), fetchAdminReports()]);
    setIsSyncing(false);
  };

  // 7 Kategori Resmi Permendikbudristek No. 46/2023 (Data distribusi benchmark per kategori)
  const categoryData = [
    { id: 1, name: '1. Perundungan Verbal', activeCount: 48, refCount: 32, max: 60, isAlert: false },
    { id: 2, name: '2. Perundungan Fisik', activeCount: 34, refCount: 28, max: 60, isAlert: false },
    { id: 3, name: '3. Perundungan Siber', activeCount: 27, refCount: 22, max: 60, isAlert: false },
    { id: 4, name: '4. Kekerasan Psikis / Pengucilan Sosial', activeCount: 15, refCount: 18, max: 60, isAlert: false },
    { id: 5, name: '5. Hukuman Fisik oleh Pendidik', activeCount: 8, refCount: 11, max: 60, isAlert: false },
    { id: 6, name: '6. Penyalahgunaan Narkoba / Miras / Rokok', activeCount: 5, refCount: 7, max: 60, isAlert: false },
    { id: 7, name: '7. Kekerasan Seksual', activeCount: 4, refCount: 6, max: 60, isAlert: true }
  ];

  // Cases for the bottom table matching reference screenshot
  const queueCases = [
    {
      id: 1,
      type: 'active',
      ticket_code: 'SGP-2024-0142',
      category: 'Perundungan Siber (Grup WhatsApp Kelas)',
      date: 'Hari ini, 08:45 WIB',
      urgency: 'Tinggi',
      status_text: 'Menunggu Verifikasi BK',
      status_badge: 'amber',
      action_label: 'Periksa Kasus',
      is_internal: true
    },
    {
      id: 2,
      type: 'active',
      ticket_code: 'SGP-2024-0141',
      category: 'Perundungan Verbal & Ejekan Fisik',
      date: 'Kemarin, 14:20 WIB',
      urgency: 'Sedang',
      status_text: 'Investigasi Satgas',
      status_badge: 'sky',
      action_label: 'Periksa Kasus',
      is_internal: true
    },
    {
      id: 3,
      type: 'active',
      ticket_code: 'SGP-2024-0139',
      category: 'Pemalakan Uang Jajan Kantin',
      date: '18 Mei 2024, 11:10 WIB',
      urgency: 'Sedang',
      status_text: 'Mediasi Wali Murid',
      status_badge: 'purple',
      action_label: 'Periksa Kasus',
      is_internal: true
    },
    {
      id: 4,
      type: 'reference',
      ticket_code: 'REF-2023-0812',
      category: 'Perundungan Fisik (Insiden Lapangan)',
      date: '12 Des 2023 (Arsip)',
      urgency: 'Selesai',
      status_text: 'Selesai & Termonitor',
      status_badge: 'emerald',
      action_label: 'Lihat Catatan',
      is_internal: false
    }
  ];

  // Cases for the bottom table (derived dynamically from live reports if available)
  const displayCases = (reports && reports.length > 0)
    ? reports.slice(0, 5).map((r) => {
        let badgeColor = 'amber';
        let statusText = 'Menunggu Verifikasi BK';
        if (r.status === 'diverifikasi') {
          badgeColor = 'sky';
          statusText = 'Investigasi Satgas';
        } else if (r.status === 'ditindaklanjuti') {
          badgeColor = 'purple';
          statusText = 'Tindak Lanjut / Mediasi';
        } else if (r.status === 'selesai') {
          badgeColor = 'emerald';
          statusText = 'Selesai & Termonitor';
        }

        return {
          id: r.id,
          type: r.is_active ? 'active' : 'reference',
          ticket_code: r.ticket_code,
          category: r.kategori_nama || 'Perundungan',
          date: r.tanggal || 'Hari ini',
          urgency: r.urgensi || 'Sedang',
          status_text: statusText,
          status_badge: badgeColor,
          action_label: r.is_active ? 'Periksa Kasus' : 'Lihat Catatan',
          is_internal: r.is_active
        };
      })
    : (isBackendConnected || import.meta.env.PROD ? [] : queueCases);

  const handleDownloadReport = () => {
    // Generate clean CSV summary
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Kategori,Kasus Aktif Sekolah,Benchmark Nasional\n' +
      categoryData.map((c) => `"${c.name}",${c.activeCount},${c.refCount}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Analitik_SIGAP_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 11 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : hour < 18 ? 'Selamat Sore' : 'Selamat Malam';
  const adminName = currentUser?.nama?.replace(', S.Pd', '').replace(' (Offline)', '') || 'Admin';

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Top Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>Admin Panel</span>
              <span>&gt;</span>
              <span className="text-slate-800 font-bold">Dashboard Analitik</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {greeting}, {adminName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Monitoring real-time penanganan insiden, perbandingan tren laporan sekolah terhadap data referensi nasional PPKSP bergaya Liquid Glass.
            </p>
          </div>

          {/* Right Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* DB Status */}
            <div className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition shadow-xs ${
              isBackendConnected
                ? 'glass-pill-green'
                : 'glass-card text-slate-600'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]' : 'bg-slate-400'}`} />
              <Database className="w-3.5 h-3.5" />
              <span>{isBackendConnected ? 'MySQL Terhubung' : 'Offline'}</span>
            </div>

            <button
              type="button"
              onClick={handleSync}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-2xl glass-card text-slate-700 font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#3B7DE8]' : 'text-slate-500'}`} />
              <span>Sinkronkan</span>
            </button>

            <button
              onClick={handleDownloadReport}
              className="px-4 py-2 rounded-2xl glass-button-primary text-white font-bold text-xs flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Laporan</span>
            </button>
          </div>
        </div>

        {/* 4 Summary KPI Cards — Frosted Glass with Color Tints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Card 1: Total Laporan */}
          <div className="glass-card p-5 rounded-3xl border border-white/80 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl glass-pill-blue flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#3B7DE8]" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold glass-pill-blue">
                Data Aktif
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Total Laporan</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black text-slate-900 leading-none">
                  {metrics.total ?? 0}
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +12%
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1.5 block">Dari bulan lalu (internal satuan)</span>
            </div>
          </div>

          {/* Card 2: Menunggu Verifikasi */}
          <div className="glass-card p-5 rounded-3xl border border-amber-200/50 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl glass-pill-yellow flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-amber-600" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold glass-pill-yellow">
                Prioritas
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Menunggu Verifikasi</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black text-slate-900 leading-none">
                  {metrics.menunggu ?? 0}
                </span>
                <span className="text-xs font-bold text-amber-600">Butuh tindakan</span>
              </div>
              <span className="text-[11px] text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-red-500" />
                <span>Respons &lt; 24 jam</span>
              </span>
            </div>
          </div>

          {/* Card 3: Ditindaklanjuti */}
          <div className="glass-card p-5 rounded-3xl border border-purple-200/50 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl glass-pill flex items-center justify-center text-purple-600 border border-purple-200">
                <RotateCw className="w-5 h-5 text-purple-600" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold glass-pill text-purple-700 border border-purple-200">
                Proses
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Ditindaklanjuti</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black text-slate-900 leading-none">
                  {metrics.proses ?? 0}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {metrics.total ? `${((metrics.proses / metrics.total) * 100).toFixed(1)}% beban` : '0%'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1.5 block">Tahap mediasi &amp; konseling BK</span>
            </div>
          </div>

          {/* Card 4: Selesai & Ditutup */}
          <div className="glass-card p-5 rounded-3xl border border-emerald-200/50 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl glass-pill-green flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold glass-pill-green">
                Efektif
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Selesai &amp; Ditutup</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black text-slate-900 leading-none">
                  {metrics.selesai ?? 0}
                </span>
                <span className="text-xs font-bold text-emerald-600">Terselesaikan</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1.5 block">Tingkat resolusi kasus 78.2%</span>
            </div>
          </div>

        </div>

        {/* Middle Section: Chart + Distribusi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Left: Tren Kasus per Bulan */}
          <div className="lg:col-span-7 glass-panel-elevated p-6 rounded-3xl border border-white/80 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/50 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Tren Kasus per Bulan</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Perbandingan volume insiden internal sekolah vs. baseline nasional (Kemendikbudristek).
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs shrink-0">
                <span className="flex items-center gap-1.5 text-[#3B7DE8] font-semibold glass-pill px-2.5 py-1 rounded-full">
                  <span className="w-3.5 h-1 bg-[#3B7DE8] inline-block rounded-full" />
                  Internal
                </span>
                <span className="flex items-center gap-1.5 text-slate-500 font-semibold glass-pill px-2.5 py-1 rounded-full">
                  <span className="w-3.5 h-0.5 border-t-2 border-dashed border-slate-400 inline-block" />
                  Nasional
                </span>
              </div>
            </div>

            <div className="w-full">
              <TrendLineChart />
            </div>

            <div className="glass-card border border-white/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-700">
              <Info className="w-4 h-4 text-[#3B7DE8] shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px] sm:text-xs">
                <strong>Catatan Analisis:</strong> Terjadi penurunan aduan sebesar 15% pada bulan April pasca-sosialisasi anti-perundungan di pekan MPLS, namun kembali meningkat di bulan Mei akibat laporan siber luar jam sekolah.
              </p>
            </div>
          </div>

          {/* Right: Distribusi per Kategori */}
          <div className="lg:col-span-5 glass-panel-elevated p-6 rounded-3xl border border-white/80 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-white/50 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Distribusi per Kategori</h3>
                <p className="text-xs text-slate-500 mt-0.5">Klasifikasi 7 jenis kekerasan (Permendikbudristek 46/2023).</p>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold glass-pill-blue">
                7 Kategori
              </span>
            </div>

            <div className="space-y-3">
              {categoryData.map((cat) => {
                const activePercent = Math.min(100, Math.round((cat.activeCount / cat.max) * 100));
                const refPercent = Math.min(100, Math.round((cat.refCount / cat.max) * 100));

                return (
                  <div key={cat.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-semibold ${cat.isAlert ? 'text-rose-700 font-bold' : 'text-slate-800'}`}>
                        {cat.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <strong className={cat.isAlert ? 'text-rose-700 font-bold' : 'text-[#3B7DE8] font-bold'}>
                          {cat.activeCount} kasus
                        </strong>
                        <span className="text-slate-400 text-[11px]">(Ref: {cat.refCount})</span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-slate-200/60 rounded-full relative overflow-hidden">
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-slate-300/80 rounded-full"
                        style={{ width: `${refPercent}%` }}
                      />
                      <div
                        className={`absolute left-0 top-0 bottom-0 rounded-full transition-all duration-500 shadow-xs ${
                          cat.isAlert ? 'bg-rose-500' : 'bg-gradient-to-r from-[#3B7DE8] to-blue-600'
                        }`}
                        style={{ width: `${activePercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/50 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B7DE8] inline-block" />
                Data Sekolah (Aktif)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
                Benchmark Nasional (PPKSP)
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Section: Priority Queue Table */}
        <div className="glass-panel-elevated rounded-3xl border border-white/80 shadow-md p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/50 pb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl glass-pill-blue flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#3B7DE8]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Antrean Verifikasi &amp; Pemantauan Kasus Terkini</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftar laporan masuk yang membutuhkan validasi administratif dan tindak lanjut segera.
                </p>
              </div>
            </div>

            <Link
              to="/admin/laporan"
              className="text-xs font-bold text-[#3B7DE8] glass-pill-blue hover:bg-[#3B7DE8]/20 px-4 py-2 rounded-2xl transition flex items-center gap-1.5 self-start sm:self-auto shrink-0"
            >
              <span>Lihat Semua Arsip</span>
              <span>→</span>
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">TIPE DATA</th>
                  <th className="py-3 px-3">KODE TIKET</th>
                  <th className="py-3 px-3">KATEGORI INSIDEN</th>
                  <th className="py-3 px-3">TANGGAL MASUK</th>
                  <th className="py-3 px-3">URGENSI</th>
                  <th className="py-3 px-3">STATUS VERIFIKASI</th>
                  <th className="py-3 px-3 text-right">TINDAKAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40 font-medium">
                {displayCases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                      Belum ada pengaduan aktif yang tercatat di database MySQL.
                    </td>
                  </tr>
                ) : (
                  displayCases.map((item) => {
                    let badgeUrgensi = 'glass-pill text-slate-600';
                    if (item.urgency === 'Tinggi') badgeUrgensi = 'glass-pill-red';
                    else if (item.urgency === 'Sedang') badgeUrgensi = 'glass-pill-yellow';

                    let badgeStatus = 'glass-pill text-slate-700';
                    if (item.status_badge === 'amber') badgeStatus = 'glass-pill-yellow';
                    else if (item.status_badge === 'sky') badgeStatus = 'glass-pill-blue';
                    else if (item.status_badge === 'purple') badgeStatus = 'glass-pill text-purple-700 border-purple-200';
                    else if (item.status_badge === 'emerald') badgeStatus = 'glass-pill-green';

                    return (
                      <tr key={item.id} className="hover:bg-white/60 transition">
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.type === 'active'
                              ? 'glass-pill-blue'
                              : 'glass-pill text-slate-500'
                          }`}>
                            {item.type === 'active' ? 'Data Aktif' : 'Data Referensi'}
                          </span>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`font-mono font-bold ${item.type === 'active' ? 'text-[#3B7DE8]' : 'text-slate-500'}`}>
                            {item.ticket_code}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-slate-800 font-semibold">{item.category}</td>

                        <td className="py-3 px-3 whitespace-nowrap text-slate-500">{item.date}</td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badgeUrgensi}`}>
                            {item.urgency === 'Tinggi' || item.urgency === 'Sedang' ? '• ' : ''}
                            {item.urgency}
                          </span>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badgeStatus}`}>
                            {item.status_text}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.is_internal) {
                                navigate(`/admin/laporan-detail?id=${item.id}`);
                              } else {
                                navigate('/admin/laporan');
                              }
                            }}
                            className="px-3.5 py-1.5 rounded-xl glass-button-secondary text-[#3B7DE8] hover:text-[#2563c0] font-bold text-xs inline-flex items-center gap-1 transition"
                          >
                            <span>{item.action_label}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="pt-3 border-t border-white/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Menampilkan {displayCases.length} dari {metrics.total || 142} rekaman data insiden yang terverifikasi
            </span>
            <div className="flex items-center gap-1">
              <button type="button" disabled className="px-3 py-1 rounded-xl glass-card text-slate-400 text-xs disabled:opacity-50">
                Sebelumnya
              </button>
              <span className="px-3 py-1 rounded-xl glass-button-primary text-white font-bold text-xs">1</span>
              <button type="button" disabled className="px-3 py-1 rounded-xl glass-card text-slate-400 text-xs disabled:opacity-50">
                Selanjutnya
              </button>
            </div>
          </div>
        </div>

        {/* AI Summary Bar — Frosted Accent Pill */}
        <div className="rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 glass-button-primary shadow-lg border border-white/30">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[#F5C518] flex-shrink-0" />
            <div>
              <span className="text-white font-extrabold text-sm">AI Summary Liquid Assistant</span>
              <p className="text-white/85 text-xs mt-0.5">
                {metrics.menunggu ?? 0} laporan butuh perhatian segera. Pola siber meningkat 23% minggu ini. Intervensi awal dapat meningkatkan efektivitas penanganan.
              </p>
            </div>
          </div>
          <Link
            to="/admin/validasi-ai"
            className="flex-shrink-0 px-4 py-2 rounded-2xl glass-card text-slate-800 hover:text-[#3B7DE8] font-bold text-xs flex items-center gap-1.5 transition"
          >
            Tinjau Analisis AI
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
