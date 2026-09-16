import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  FileText,
  PhoneCall,
  ShieldCheck,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StudentHeader } from '../../components/layout/StudentHeader';
import { StudentFooter } from '../../components/layout/StudentFooter';

export const StudentDashboard = () => {
  const { currentUser, reports } = useStore();
  const navigate = useNavigate();

  const myReports = reports.filter(
    (r) => !r.is_anonymous || r.reporter_name === currentUser?.nama
  );

  const pendingCount = myReports.filter((r) => r.status === 'menunggu').length;
  const inProgressCount = myReports.filter(
    (r) => r.status === 'diverifikasi' || r.status === 'ditindaklanjuti'
  ).length;
  const completedCount = myReports.filter((r) => r.status === 'selesai').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'menunggu':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Menunggu Telaah
          </span>
        );
      case 'diverifikasi':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
            Diverifikasi
          </span>
        );
      case 'ditindaklanjuti':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            Ditindaklanjuti
          </span>
        );
      case 'selesai':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Selesai
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800">
      <StudentHeader isDashboard={true} />

      <main className="max-w-6xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Banner Selamat Datang & Tindakan Cepat */}
        <div className="bg-gradient-to-r from-sky-100 via-[#A7D8F0]/50 to-white p-6 lg:p-8 rounded-3xl border border-sky-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-sky-200 text-sky-800 text-xs font-bold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Siswa Terdaftar: {currentUser?.nisn || '3125521007'}</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Halo, {currentUser?.nama || 'Siswa Teladan'} 👋
            </h2>
            <p className="text-xs lg:text-sm text-slate-600 max-w-xl leading-relaxed">
              Selamat datang di Dashboard Siswa SIGAP. Anda dapat memantau status tindak lanjut aduan Anda atau membuat pengaduan baru dengan perlindungan privasi penuh.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/buat-laporan"
              className="px-5 py-3 rounded-2xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-black text-sm shadow-xs flex items-center justify-center gap-2 transition"
            >
              <PlusCircle className="w-5 h-5" />
              <span>+ Buat Pengaduan Baru</span>
            </Link>
            <Link
              to="/lacak"
              className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition"
            >
              <Search className="w-4 h-4 text-sky-700" />
              <span>Lacak Tiket Lain</span>
            </Link>
          </div>
        </div>

        {/* Statistik Pengaduan Saya */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">{pendingCount}</span>
              <span className="text-xs text-slate-500 block font-medium">Menunggu Telaah</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">{inProgressCount}</span>
              <span className="text-xs text-slate-500 block font-medium">Dalam Proses Satgas</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">{completedCount}</span>
              <span className="text-xs text-slate-500 block font-medium">Selesai Ditangani</span>
            </div>
          </div>
        </div>

        {/* Riwayat Laporan Pengaduan */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Riwayat Pengaduan Saya</h3>
              <p className="text-xs text-slate-500">Daftar laporan yang pernah Anda kirimkan melalui sistem.</p>
            </div>
            <Link
              to="/buat-laporan"
              className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
            >
              <span>+ Laporan Baru</span>
            </Link>
          </div>

          {myReports.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">Belum Ada Pengaduan</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Anda belum pernah mengajukan laporan. Jika mengalami atau melihat tindakan perundungan, laporkan melalui tombol di bawah.
              </p>
              <Link
                to="/buat-laporan"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A7D8F0] text-slate-900 font-bold text-xs"
              >
                <PlusCircle className="w-4 h-4" /> Buat Pengaduan Sekarang
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {myReports.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/lacak?code=${item.ticket_code}`)}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 p-3 rounded-2xl cursor-pointer transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                        {item.ticket_code}
                      </span>
                      {getStatusBadge(item.status)}
                      <span className="text-[11px] text-slate-400">• {item.tanggal}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{item.judul}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{item.deskripsi}</p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs font-semibold text-sky-700 flex items-center gap-1">
                      Lihat Timeline <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Banner Bantuan Darurat & Hotline Satgas */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Butuh Bantuan Mendesak / Darurat?</h4>
              <p className="text-xs text-slate-300">
                Hubungi langsung Konselor BK di Ruang Konseling atau telepon Hotline Satgas PPKSP: <span className="font-mono font-bold text-sky-300">0800-1234-5678</span>
              </p>
            </div>
          </div>
          <a
            href="tel:080012345678"
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 whitespace-nowrap transition"
          >
            <PhoneCall className="w-4 h-4" /> Panggil Hotline
          </a>
        </div>
      </main>

      <StudentFooter />
    </div>
  );
};

