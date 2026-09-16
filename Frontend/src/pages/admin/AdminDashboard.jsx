import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Network,
  Database,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { TrendLineChart, CategoryBarChart } from '../../components/charts/DashboardCharts';

export const AdminDashboard = () => {
  const { reports, getMetrics, categories } = useStore();
  const navigate = useNavigate();

  const metrics = getMetrics();
  const recentReports = reports.filter((r) => r.is_active).slice(0, 4);

  return (
    <AdminLayout
      title="Dashboard Analitik & Pemantauan Kasus"
      subtitle="Ringkasan insiden sekolah, deteksi klaster AI, dan data pembanding makro"
    >
      <div className="space-y-6">
        {/* Stat Cards Grid (6 Metrik Sesuai Wireframe DashboardAdmin_SIGAP.png) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Total Aduan</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-900">{metrics.total}</span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block">+3 aduan baru hari ini</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Menunggu Telaah</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-amber-600">{metrics.menunggu}</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[10px] text-amber-600 font-bold block">Butuh validasi BK</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Dalam Proses</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-sky-600">{metrics.proses}</span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-medium block">Investigasi / Mediasi</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Selesai Tuntas</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-emerald-600">{metrics.selesai}</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block">Tingkat tuntas 75%</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Anomali / Low AI</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-rose-600">{metrics.lowAi}</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[10px] text-rose-600 font-bold block">Akurasi AI &lt; 80%</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Klaster HDBSCAN</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-purple-600">{metrics.clusters}</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Network className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[10px] text-purple-600 font-bold block">Pola kejadian berulang</span>
          </div>
        </div>

        {/* ECharts Analytics Section (2 Kolom) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Grafik 1: Tren Bulanan vs Baseline */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Tren Insiden Sekolah vs Baseline Wilayah</h3>
                <p className="text-[11px] text-slate-400">Data agregasi kasus 6 bulan terakhir vs data pembanding Dinas PPPA</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-sky-50 text-sky-800 border border-sky-200">
                2024
              </span>
            </div>
            <TrendLineChart />
          </div>

          {/* Grafik 2: Distribusi 7 Kategori */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Distribusi 7 Kategori Kasus</h3>
                <p className="text-[11px] text-slate-400">Permendikbudristek No. 46/2023</p>
              </div>
              <Link to="/admin/laporan" className="text-[11px] font-bold text-sky-700 hover:underline">
                Lihat Semua
              </Link>
            </div>
            <CategoryBarChart categories={categories} />
          </div>
        </div>

        {/* Bottom Section: Laporan Memerlukan Perhatian Segera */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Laporan Memerlukan Tindak Lanjut Konselor</h3>
              <p className="text-[11px] text-slate-400">Daftar aduan aktif terbaru yang membutuhkan verifikasi atau tindakan segera</p>
            </div>
            <Link
              to="/admin/laporan"
              className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
            >
              Buka Semua Laporan <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentReports.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/admin/laporan-detail?id=${item.id}`)}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 p-2.5 rounded-2xl cursor-pointer transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-900 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                      {item.ticket_code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {item.status.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-slate-400">• {item.tanggal}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{item.judul}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{item.deskripsi}</p>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-center">
                  {item.ai && (
                    <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      AI: {item.ai.confidence}%
                    </span>
                  )}
                  <span className="text-xs font-bold text-sky-700 flex items-center gap-1">
                    Detail <ChevronRight className="w-3.5 h-3.5" />
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

