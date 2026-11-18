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
      {/* ─── Hero Section Admin Full-Width dengan Background Video & Degradasi Halus (Menampung Header & 4 KPI Cards) ─── */}
      <section className="-mt-4 sm:-mt-6 lg:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 relative overflow-hidden z-0 px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-14 sm:pb-20 mb-6 sm:mb-8">
        {/* Background Video (Memenuhi Seluruh Viewport Hero yang Lebih Luas) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none brightness-105"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0
          }}
          aria-hidden="true"
        >
          <source src="/assets/background/admin-welcome.mp4" type="video/mp4" />
          <source src="/assets/background/dashboard-welcome.mp4" type="video/mp4" />
        </video>

        {/* Clean Directional Scrim Overlay: Sangat terang di sisi kiri agar teks 100% kontras tajam, transparan halus di kanan */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.94) 0%, rgba(255, 255, 255, 0.82) 45%, rgba(255, 255, 255, 0.45) 75%, rgba(255, 255, 255, 0.20) 100%)',
            backdropFilter: 'blur(1.5px)',
            zIndex: 1
          }}
          aria-hidden="true"
        />

        {/* Bottom Seamless Gradient Fade (Menyatu lembut ke halaman putih bawah) */}
        <div
          className="absolute inset-x-0 bottom-0 h-28 sm:h-36 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.50) 45%, #FFFFFF 100%)',
            zIndex: 2
          }}
          aria-hidden="true"
        />

        {/* Hero Content Area: Header Greeting & 4 Summary KPI Cards */}
        <div className="max-w-7xl mx-auto relative z-10 space-y-8 sm:space-y-10">
          {/* Top Row: Greeting & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Professional Editorial Plaque */}
            <div className="space-y-3 max-w-2xl">
              {/* Status Capsule Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-white/90 text-[#1C6F8E] border border-[#BFEFFF] shadow-xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Panel Monitoring Insiden &amp; Layanan Terpadu</span>
              </div>

              {/* Main Greeting Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                {greeting}, <span className="text-[#1C6F8E]">{adminName}</span>
              </h1>

              {/* Professional Subtitle */}
              <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-medium">
                Sistem pemantauan real-time penanganan aduan perundungan, pelacakan proses investigasi, dan sinkronisasi standar PPKSP Kemendikbudristek.
              </p>
            </div>

            {/* Right Controls in Grouped Frosted Glass Container */}
            <div className="p-2 sm:p-2.5 rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-[0_8px_24px_rgba(28,111,142,0.08)] flex flex-wrap items-center gap-2.5 self-start lg:self-center shrink-0">
              {/* DB Status */}
              <div className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition shadow-2xs ${
                isBackendConnected
                  ? 'bg-emerald-50/90 text-emerald-800 border border-emerald-200'
                  : 'bg-white border border-[#BFEFFF] text-slate-700'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]' : 'bg-slate-400'}`} />
                <Database className="w-3.5 h-3.5 text-[#1C6F8E]" />
                <span>{isBackendConnected ? 'MySQL Terhubung' : 'Offline'}</span>
              </div>

              <button
                type="button"
                onClick={handleSync}
                disabled={isSyncing}
                className="px-4 py-2 rounded-2xl bg-white border border-[#BFEFFF] text-slate-800 hover:bg-[#BFEFFF]/20 font-bold text-xs flex items-center gap-2 transition disabled:opacity-50 shadow-2xs cursor-pointer active:scale-95"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#1C6F8E]' : 'text-[#1C6F8E]'}`} />
                <span>Sinkronkan</span>
              </button>

              <button
                onClick={handleDownloadReport}
                className="px-4 py-2 rounded-2xl bg-[#1C6F8E] hover:bg-[#165870] text-white font-bold text-xs flex items-center gap-2 transition shadow-xs cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Laporan</span>
              </button>
            </div>
          </div>

          {/* 4 Summary KPI Cards — Di Dalam Hero Section Background Video */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Card 1: Total Laporan */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/90 shadow-[0_8px_24px_rgba(28,111,142,0.08)] hover:shadow-[0_12px_32px_rgba(28,111,142,0.14)] hover:-translate-y-0.5 transition-all duration-300 p-5 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#D6F5FF] text-[#1C6F8E] flex items-center justify-center shadow-xs">
                  <FileText className="w-5 h-5 text-[#1C6F8E]" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D6F5FF] text-[#1C6F8E] border border-[#BFEFFF]">
                  Data Aktif
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-600 block">Total Laporan</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-[#1C6F8E] leading-none">
                    {metrics.total ?? 0}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +12%
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1.5 block">Dari bulan lalu (internal satuan)</span>
              </div>
            </div>

            {/* Card 2: Menunggu Verifikasi */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/90 shadow-[0_8px_24px_rgba(28,111,142,0.08)] hover:shadow-[0_12px_32px_rgba(28,111,142,0.14)] hover:-translate-y-0.5 transition-all duration-300 p-5 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-xs">
                  <ClipboardList className="w-5 h-5 text-amber-600" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                  Prioritas
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-600 block">Menunggu Verifikasi</span>
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
            <div className="bg-white/90 backdrop-blur-xl border border-white/90 shadow-[0_8px_24px_rgba(28,111,142,0.08)] hover:shadow-[0_12px_32px_rgba(28,111,142,0.14)] hover:-translate-y-0.5 transition-all duration-300 p-5 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-xs">
                  <RotateCw className="w-5 h-5 text-purple-600" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                  Proses
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-600 block">Ditindaklanjuti</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-slate-900 leading-none">
                    {metrics.proses ?? 0}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {metrics.total ? `${((metrics.proses / metrics.total) * 100).toFixed(1)}% beban` : '0%'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1.5 block">Tahap mediasi &amp; konseling BK</span>
              </div>
            </div>

            {/* Card 4: Selesai & Ditutup */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/90 shadow-[0_8px_24px_rgba(28,111,142,0.08)] hover:shadow-[0_12px_32px_rgba(28,111,142,0.14)] hover:-translate-y-0.5 transition-all duration-300 p-5 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Efektif
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-600 block">Selesai &amp; Ditutup</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-slate-900 leading-none">
                    {metrics.selesai ?? 0}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">Terselesaikan</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1.5 block">Tingkat resolusi kasus 78.2%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Middle Section: Chart + Distribusi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Left: Tren Kasus per Bulan */}
          <div className="lg:col-span-7 bg-white/95 p-6 rounded-3xl border border-[#BFEFFF] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#BFEFFF]/60 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Tren Kasus per Bulan</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Perbandingan volume insiden internal sekolah vs. baseline nasional (Kemendikbudristek).
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs shrink-0">
                <span className="flex items-center gap-1.5 text-[#1C6F8E] font-semibold bg-[#D6F5FF]/60 border border-[#BFEFFF] px-2.5 py-1 rounded-full">
                  <span className="w-3.5 h-1 bg-[#1C6F8E] inline-block rounded-full" />
                  Internal
                </span>
                <span className="flex items-center gap-1.5 text-slate-500 font-semibold bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                  <span className="w-3.5 h-0.5 border-t-2 border-dashed border-slate-400 inline-block" />
                  Nasional
                </span>
              </div>
            </div>

            <div className="w-full">
              <TrendLineChart />
            </div>

            <div className="bg-[#F8FDFF] border border-[#BFEFFF] rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-700">
              <Info className="w-4 h-4 text-[#1C6F8E] shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px] sm:text-xs">
                <strong>Catatan Analisis:</strong> Terjadi penurunan aduan sebesar 15% pada bulan April pasca-sosialisasi anti-perundungan di pekan MPLS, namun kembali meningkat di bulan Mei akibat laporan siber luar jam sekolah.
              </p>
            </div>
          </div>

          {/* Right: Distribusi per Kategori */}
          <div className="lg:col-span-5 bg-white/95 p-6 rounded-3xl border border-[#BFEFFF] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#BFEFFF]/60 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Distribusi per Kategori</h3>
                <p className="text-xs text-slate-500 mt-0.5">Klasifikasi 7 jenis kekerasan (Permendikbudristek 46/2023).</p>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#D6F5FF] text-[#1C6F8E] border border-[#BFEFFF]">
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
                        <strong className={cat.isAlert ? 'text-rose-700 font-bold' : 'text-[#1C6F8E] font-bold'}>
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
                          cat.isAlert ? 'bg-rose-500' : 'bg-[#1C6F8E]'
                        }`}
                        style={{ width: `${activePercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#BFEFFF]/60 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1C6F8E] inline-block" />
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
        <div className="bg-white/95 rounded-3xl border border-[#BFEFFF] shadow-xs p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#BFEFFF]/60 pb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#D6F5FF] text-[#1C6F8E] flex items-center justify-center shrink-0 border border-[#BFEFFF]">
                <ShieldCheck className="w-5 h-5 text-[#1C6F8E]" />
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
              className="text-xs font-bold text-[#1C6F8E] bg-[#D6F5FF]/60 hover:bg-[#BFEFFF] px-4 py-2 rounded-2xl transition flex items-center gap-1.5 self-start sm:self-auto shrink-0 border border-[#BFEFFF]"
            >
              <span>Lihat Semua Arsip</span>
              <span>→</span>
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#BFEFFF] text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">TIPE DATA</th>
                  <th className="py-3 px-3">KODE TIKET</th>
                  <th className="py-3 px-3">KATEGORI INSIDEN</th>
                  <th className="py-3 px-3">TANGGAL MASUK</th>
                  <th className="py-3 px-3">URGENSI</th>
                  <th className="py-3 px-3">STATUS VERIFIKASI</th>
                  <th className="py-3 px-3 text-right">TINDAKAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BFEFFF]/40 font-medium">
                {displayCases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                      Belum ada pengaduan aktif yang tercatat di database MySQL.
                    </td>
                  </tr>
                ) : (
                  displayCases.map((item) => {
                    let badgeUrgensi = 'bg-slate-100 text-slate-600 border border-slate-200';
                    if (item.urgency === 'Tinggi') badgeUrgensi = 'bg-rose-50 text-rose-700 border border-rose-200';
                    else if (item.urgency === 'Sedang') badgeUrgensi = 'bg-amber-50 text-amber-700 border border-amber-200';

                    let badgeStatus = 'bg-slate-100 text-slate-700 border border-slate-200';
                    if (item.status_badge === 'amber') badgeStatus = 'bg-amber-50 text-amber-700 border border-amber-200';
                    else if (item.status_badge === 'sky') badgeStatus = 'bg-[#D6F5FF] text-[#1C6F8E] border border-[#BFEFFF]';
                    else if (item.status_badge === 'purple') badgeStatus = 'bg-purple-50 text-purple-700 border border-purple-200';
                    else if (item.status_badge === 'emerald') badgeStatus = 'bg-emerald-50 text-emerald-700 border border-emerald-200';

                    return (
                      <tr key={item.id} className="hover:bg-[#F0F9FF]/50 transition">
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.type === 'active'
                              ? 'bg-[#D6F5FF] text-[#1C6F8E] border border-[#BFEFFF]'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {item.type === 'active' ? 'Data Aktif' : 'Data Referensi'}
                          </span>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`font-mono font-bold ${item.type === 'active' ? 'text-[#1C6F8E]' : 'text-slate-500'}`}>
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
                            className="px-3.5 py-1.5 rounded-xl bg-white border border-[#BFEFFF] text-[#1C6F8E] hover:bg-[#BFEFFF]/30 font-bold text-xs inline-flex items-center gap-1 transition shadow-2xs"
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
          <div className="pt-3 border-t border-[#BFEFFF]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Menampilkan {displayCases.length} dari {metrics.total || 142} rekaman data insiden yang terverifikasi
            </span>
            <div className="flex items-center gap-1">
              <button type="button" disabled className="px-3 py-1 rounded-xl bg-white border border-[#BFEFFF] text-slate-400 text-xs disabled:opacity-50">
                Sebelumnya
              </button>
              <span className="px-3 py-1 rounded-xl bg-[#1C6F8E] text-white font-bold text-xs">1</span>
              <button type="button" disabled className="px-3 py-1 rounded-xl bg-white border border-[#BFEFFF] text-slate-400 text-xs disabled:opacity-50">
                Selanjutnya
              </button>
            </div>
          </div>
        </div>

        {/* AI Summary Bar */}
        <div className="rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-[#1C6F8E] to-[#2E84A5] text-white shadow-sm border border-[#BFEFFF]/40">
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
            className="flex-shrink-0 px-4 py-2 rounded-2xl bg-white/95 hover:bg-white text-[#1C6F8E] font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
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
