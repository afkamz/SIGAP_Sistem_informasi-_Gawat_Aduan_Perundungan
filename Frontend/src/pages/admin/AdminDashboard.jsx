import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  ClipboardList,
  RotateCw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  Download,
  Info,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { TrendLineChart } from '../../components/charts/DashboardCharts';

export const AdminDashboard = () => {
  const { reports, getMetrics } = useStore();
  const navigate = useNavigate();

  const metrics = getMetrics();
  const [academicYear, setAcademicYear] = useState('2023/2024-genap');

  // 7 Categories data matching Permendikbudristek 46/2023 and reference screenshot
  const categoryData = [
    { id: 1, name: '1. Perundungan Verbal', activeCount: 48, refCount: 32, max: 60, isAlert: false },
    { id: 2, name: '2. Perundungan Fisik', activeCount: 34, refCount: 28, max: 60, isAlert: false },
    { id: 3, name: '3. Perundungan Siber', activeCount: 27, refCount: 22, max: 60, isAlert: false },
    { id: 4, name: '4. Pemalakan / Pemerasan', activeCount: 15, refCount: 18, max: 60, isAlert: false },
    { id: 5, name: '5. Diskriminasi & Intoleransi', activeCount: 9, refCount: 12, max: 60, isAlert: false },
    { id: 6, name: '6. Pengabaian / Lainnya', activeCount: 5, refCount: 9, max: 60, isAlert: false },
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

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Top Header Section (Matches Image 1) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <span>Admin Panel</span>
              <span>&gt;</span>
              <span className="text-slate-700">Dashboard Analitik</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Ikhtisar & Analitik Kasus Siswa
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Monitoring real-time penanganan insiden, perbandingan tren laporan sekolah terhadap data referensi nasional PPKSP.
            </p>
          </div>

          {/* Right Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Legend Pills */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs">
              <span className="text-slate-400 font-medium">Legenda:</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                Data Aktif
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                Data Referensi
              </span>
            </div>

            {/* Academic Year Dropdown */}
            <div className="relative">
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs hover:border-slate-300 focus:outline-none focus:border-sky-400 cursor-pointer"
              >
                <option value="2023/2024-genap">Tahun Ajaran 2023/2024 (Semester Genap)</option>
                <option value="2023/2024-ganjil">Tahun Ajaran 2023/2024 (Semester Ganjil)</option>
                <option value="2022/2023-genap">Tahun Ajaran 2022/2023 (Semester Genap)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Unduh Laporan Button */}
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2 rounded-xl bg-[#7BBCE6] hover:bg-[#68AFDC] text-slate-900 font-bold text-xs flex items-center gap-2 shadow-2xs transition active:scale-95"
            >
              <Download className="w-4 h-4 text-slate-900" />
              <span>Unduh Laporan</span>
            </button>
          </div>
        </div>

        {/* 4 Summary KPI Cards (Matches 4 Cards in Image 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Laporan */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 hover:shadow-xs transition">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                <FileText className="w-4 h-4 text-sky-600" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                Data Aktif
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Total Laporan</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black text-slate-900 leading-none">
                  {metrics.total || 142}
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center">
                  ↗ +12%
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-2 block">
                Dari bulan lalu (internal satuan)
              </span>
            </div>
          </div>

          {/* Card 2: Menunggu Verifikasi */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 hover:shadow-xs transition">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-amber-600" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                Data Aktif
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Menunggu Verifikasi</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black text-slate-900 leading-none">
                  {metrics.menunggu || 8}
                </span>
                <span className="text-xs font-bold text-amber-600">
                  Prioritas Satgas
                </span>
              </div>
              <span className="text-[11px] text-red-600 font-semibold mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3 text-red-500" />
                <span>Butuh respons &lt; 24 jam</span>
              </span>
            </div>
          </div>

          {/* Card 3: Ditindaklanjuti */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 hover:shadow-xs transition">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                <RotateCw className="w-4 h-4 text-sky-600" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                Data Aktif
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Ditindaklanjuti</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black text-slate-900 leading-none">
                  {metrics.proses || 23}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  16.2% beban
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-2 block">
                Tahap mediasi &amp; konseling BK
              </span>
            </div>
          </div>

          {/* Card 4: Selesai & Ditutup */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 hover:shadow-xs transition">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                Data Aktif
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Selesai &amp; Ditutup</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black text-slate-900 leading-none">
                  {metrics.selesai || 111}
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  Efektif
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-2 block">
                Tingkat resolusi kasus 78.2%
              </span>
            </div>
          </div>

        </div>

        {/* Middle Section: Tren Kasus per Bulan & Distribusi per Kategori (Matches Image 1) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Tren Kasus per Bulan (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Tren Kasus per Bulan
                </h3>
                <p className="text-xs text-slate-500">
                  Perbandingan volume insiden internal sekolah dengan baseline rata-rata nasional (Kemendikbudristek).
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs shrink-0 self-start sm:self-auto">
                <span className="flex items-center gap-1.5 text-sky-800 font-semibold">
                  <span className="w-4 h-0.5 bg-sky-600 inline-block"></span>
                  Internal
                </span>
                <span className="flex items-center gap-1.5 text-slate-500 font-semibold">
                  <span className="w-4 h-0.5 border-t-2 border-dashed border-slate-400 inline-block"></span>
                  Nasional
                </span>
              </div>
            </div>

            {/* ECharts Line Chart */}
            <div className="w-full">
              <TrendLineChart />
            </div>

            {/* Bottom Analysis Box (Exact Box from Image 1) */}
            <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 flex items-start gap-3 text-xs text-sky-950">
              <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px] sm:text-xs">
                <strong>Catatan Analisis:</strong> Terjadi penurunan aduan sebesar 15% pada bulan April pasca-sosialisasi anti-perundungan di pekan MPLS, namun kembali meningkat di bulan Mei akibat laporan siber luar jam sekolah.
              </p>
            </div>
          </div>

          {/* Right: Distribusi per Kategori (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Distribusi per Kategori
                </h3>
                <p className="text-xs text-slate-500">
                  Klasifikasi 7 jenis kekerasan sekolah (Permendikbudristek 46/2023).
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-700 shrink-0">
                7 Kategori
              </span>
            </div>

            {/* Category Progress Bars List */}
            <div className="space-y-3.5 py-1">
              {categoryData.map((cat) => {
                const activePercent = Math.min(100, Math.round((cat.activeCount / cat.max) * 100));
                const refPercent = Math.min(100, Math.round((cat.refCount / cat.max) * 100));

                return (
                  <div key={cat.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-semibold ${cat.isAlert ? 'text-rose-700 font-bold' : 'text-slate-800'}`}>
                        {cat.name}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs">
                        <strong className={cat.isAlert ? 'text-rose-700 font-bold' : 'text-sky-800 font-bold'}>
                          {cat.activeCount} kasus
                        </strong>
                        <span className="text-slate-400 text-[11px]">(Ref: {cat.refCount})</span>
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="h-2 w-full bg-slate-100 rounded-full relative overflow-hidden">
                      {/* Benchmark Bar (Gray) */}
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-slate-200/80 rounded-full"
                        style={{ width: `${refPercent}%` }}
                      ></div>
                      {/* Active Case Bar */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 rounded-full transition-all duration-500 ${
                          cat.isAlert ? 'bg-rose-500' : 'bg-[#7BBCE6]'
                        }`}
                        style={{ width: `${activePercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend at bottom */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#7BBCE6] inline-block"></span>
                Data Sekolah (Aktif)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-200 inline-block"></span>
                Benchmark Nasional (PPKSP)
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Section: Antrean Verifikasi & Pemantauan Kasus Terkini (Matches Image 1) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-sky-700" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Antrean Verifikasi &amp; Pemantauan Kasus Terkini
                </h3>
                <p className="text-xs text-slate-500">
                  Daftar laporan masuk yang membutuhkan validasi administratif dan tindak lanjut segera.
                </p>
              </div>
            </div>

            <Link
              to="/admin/laporan"
              className="text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-3.5 py-2 rounded-xl bg-white shadow-2xs hover:bg-slate-50 transition flex items-center gap-1.5 self-start sm:self-auto shrink-0"
            >
              <span>Lihat Semua Arsip</span>
              <span>→</span>
            </Link>
          </div>

          {/* Table matching Image 1 */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">TIPE DATA</th>
                  <th className="py-3 px-3">KODE TIKET</th>
                  <th className="py-3 px-3">KATEGORI INSIDEN</th>
                  <th className="py-3 px-3">TANGGAL MASUK</th>
                  <th className="py-3 px-3">URGENSI</th>
                  <th className="py-3 px-3">STATUS VERIFIKASI</th>
                  <th className="py-3 px-3 text-right">TINDAKAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {queueCases.map((item) => {
                  let badgeUrgensi = 'text-slate-600 bg-slate-100';
                  if (item.urgency === 'Tinggi') badgeUrgensi = 'text-rose-700 bg-rose-50 border border-rose-200';
                  else if (item.urgency === 'Sedang') badgeUrgensi = 'text-amber-700 bg-amber-50 border border-amber-200';

                  let badgeStatus = 'bg-slate-100 text-slate-700';
                  if (item.status_badge === 'amber') badgeStatus = 'bg-amber-100 text-amber-900 border border-amber-200';
                  else if (item.status_badge === 'sky') badgeStatus = 'bg-sky-100 text-sky-900 border border-sky-200';
                  else if (item.status_badge === 'purple') badgeStatus = 'bg-purple-100 text-purple-900 border border-purple-200';
                  else if (item.status_badge === 'emerald') badgeStatus = 'bg-emerald-100 text-emerald-900 border border-emerald-200';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      {/* Tipe Data */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.type === 'active'
                              ? 'bg-sky-100 text-sky-900 border border-sky-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {item.type === 'active' ? 'Data Aktif' : 'Data Referensi'}
                        </span>
                      </td>

                      {/* Kode Tiket */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`font-mono font-bold ${item.type === 'active' ? 'text-sky-700' : 'text-slate-600'}`}>
                          {item.ticket_code}
                        </span>
                      </td>

                      {/* Kategori Insiden */}
                      <td className="py-3 px-3 text-slate-900 font-semibold">
                        {item.category}
                      </td>

                      {/* Tanggal Masuk */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-500">
                        {item.date}
                      </td>

                      {/* Urgensi */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badgeUrgensi}`}>
                          {item.urgency === 'Tinggi' || item.urgency === 'Sedang' ? '• ' : ''}
                          {item.urgency}
                        </span>
                      </td>

                      {/* Status Verifikasi */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badgeStatus}`}>
                          {item.status_text}
                        </span>
                      </td>

                      {/* Tindakan */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.is_internal) {
                              navigate('/admin/laporan-detail?id=1');
                            } else {
                              navigate('/admin/laporan');
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs inline-flex items-center gap-1 transition"
                        >
                          <span>{item.action_label}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Menampilkan 4 dari {metrics.total || 142} rekaman data insiden yang terverifikasi
            </span>
            <div className="flex items-center gap-1 self-end sm:self-auto">
              <button
                type="button"
                disabled
                className="px-3 py-1 rounded-lg border border-slate-200 text-slate-400 text-xs disabled:opacity-50"
              >
                Sebelumnya
              </button>
              <span className="px-3 py-1 rounded-lg bg-sky-100 text-sky-900 font-bold text-xs">
                1
              </span>
              <button
                type="button"
                disabled
                className="px-3 py-1 rounded-lg border border-slate-200 text-slate-400 text-xs disabled:opacity-50"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
