import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  EyeOff,
  Clock,
  PlusCircle,
  Inbox,
  MoreHorizontal,
  RotateCw,
  CheckCircle2,
  ChevronDown,
  SlidersHorizontal,
  Monitor,
  Users,
  Building2,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Lock,
  UserCheck,
  Info,
  GraduationCap,
  ArrowRight,
  PhoneCall,
  Phone,
  Search,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StudentHeader } from '../../components/layout/StudentHeader';
import { StudentFooter } from '../../components/layout/StudentFooter';

export const StudentDashboard = () => {
  const { currentUser, reports, fetchRiwayatSiswa, isBackendConnected, token } = useStore();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [isLoadingRiwayat, setIsLoadingRiwayat] = useState(false);

  const handleRefreshRiwayat = async () => {
    if (!currentUser?.id) return;
    setIsLoadingRiwayat(true);
    try {
      await fetchRiwayatSiswa(currentUser.id, token);
    } finally {
      setIsLoadingRiwayat(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      handleRefreshRiwayat();
    }
  }, [currentUser?.id, token]);

  const studentName = currentUser?.nama || 'Dimas Prasetya';
  const displayName = studentName.toLowerCase().includes('ananda')
    ? studentName
    : `Ananda ${studentName}`;

  // Filter laporan milik siswa
  const myReports = useMemo(() => {
    return reports.filter((r) => {
      if (!r.is_active && r.urgensi === 'Selesai' && r.ticket_code?.startsWith('REF-')) return false;

      if (currentUser?.id && r.siswa_id && Number(r.siswa_id) === Number(currentUser.id)) return true;
      if (currentUser?.nama && r.reporter_name && r.reporter_name.toLowerCase() === currentUser.nama.toLowerCase()) return true;

      if (!currentUser?.id) {
        if (['TKT-2024-0891', 'TKT-2024-0742', 'TKT-2024-0511'].includes(r.ticket_code)) return true;
        if (r.reporter_name && r.reporter_name.toLowerCase().includes('dimas prasetya')) return true;
      }

      if (r.id > 1000000000000 && (!r.reporter_name || r.reporter_name === currentUser?.nama)) return true;

      return false;
    });
  }, [reports, currentUser]);

  const totalCount = myReports.length;
  const pendingCount = myReports.filter((r) => r.status === 'menunggu').length;
  const inProgressCount = myReports.filter(
    (r) => r.status === 'diverifikasi' || r.status === 'ditindaklanjuti'
  ).length;
  const completedCount = myReports.filter((r) => r.status === 'selesai').length;

  const displayedReports = useMemo(() => {
    let result = [...myReports];

    if (statusFilter !== 'all') {
      if (statusFilter === 'ditindaklanjuti') {
        result = result.filter(
          (r) => r.status === 'ditindaklanjuti' || r.status === 'diverifikasi'
        );
      } else {
        result = result.filter((r) => r.status === statusFilter);
      }
    }

    result.sort((a, b) => {
      const dateA = new Date(a.tanggal || 0).getTime() || a.id;
      const dateB = new Date(b.tanggal || 0).getTime() || b.id;
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [myReports, statusFilter, sortOrder]);

  const renderCategoryIcon = (kategoriNama = '') => {
    const lower = kategoriNama.toLowerCase();
    if (lower.includes('siber') || lower.includes('cyber') || lower.includes('online')) {
      return (
        <span className="w-7 h-7 rounded-xl glass-pill-blue flex items-center justify-center shrink-0">
          <Monitor className="w-3.5 h-3.5 text-[#3B7DE8]" />
        </span>
      );
    }
    if (lower.includes('sosial') || lower.includes('pengucilan') || lower.includes('kelompok')) {
      return (
        <span className="w-7 h-7 rounded-xl glass-pill text-purple-600 border border-purple-200 flex items-center justify-center shrink-0">
          <Users className="w-3.5 h-3.5" />
        </span>
      );
    }
    if (lower.includes('sekolah') || lower.includes('kantin') || lower.includes('lingkungan')) {
      return (
        <span className="w-7 h-7 rounded-xl glass-pill-green flex items-center justify-center shrink-0">
          <Building2 className="w-3.5 h-3.5 text-emerald-600" />
        </span>
      );
    }
    return (
      <span className="w-7 h-7 rounded-xl glass-pill-yellow flex items-center justify-center shrink-0">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-liquid-mesh text-slate-800 relative overflow-hidden flex flex-col selection:bg-[#3B7DE8]/20">
      {/* ─── Ambient Glow Blobs (iOS 26 Liquid Mesh Reflections) ─── */}
      <div className="fixed top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-blue-400/20 blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-[40%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-300/20 blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-sky-200/25 blur-3xl pointer-events-none -z-10" />

      {/* Header Siswa */}
      <StudentHeader isDashboard={true} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7 relative z-20">
        {/* Top Greeting Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>Portal Siswa</span>
              <span>&gt;</span>
              <span className="text-[#3B7DE8] font-bold">Dashboard Pelapor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Selamat Datang, {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Ruang perlindungan siswa SIGAP bergaya Liquid Glass OS 26. Setiap suara Anda didengar, dilindungi, dan ditindaklanjuti secara profesional oleh bimbingan konseling.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefreshRiwayat}
              disabled={isLoadingRiwayat}
              className="glass-card hover:bg-white/90 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-700 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
              title="Sinkronkan aduan dari database MySQL"
            >
              <RotateCw className={`w-3.5 h-3.5 text-[#3B7DE8] ${isLoadingRiwayat ? 'animate-spin' : ''}`} />
              <span>Sinkronkan Data</span>
            </button>
          </div>
        </div>

        {/* Hero Banner Laporan Baru — Liquid Glass Elevated */}
        <div className="glass-panel-elevated rounded-3xl p-6 lg:p-7 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden border border-white/80">
          <div className="flex items-start gap-4 sm:gap-5 flex-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3B7DE8] to-blue-500 flex items-center justify-center shrink-0 text-white shadow-md border border-white/30">
              <Shield className="w-7 h-7 text-white" strokeWidth={2.2} />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                Mengalami atau Menyaksikan Tindakan Tidak Menyenangkan?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                Laporkan perundungan verbal, kontak fisik, cyberbullying, atau pemalakan di sekolah. Identitas Anda dijamin 100% aman, terlindungi, dan bersifat rahasia.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill-blue text-xs font-bold">
                  <EyeOff className="w-3.5 h-3.5 text-[#3B7DE8]" />
                  <span>Mode Anonim Tersedia</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill-green text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Respons Tim BK &lt; 24 Jam</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end shrink-0 w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
              <Link
                to="/lacak?from=dashboard"
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl glass-button-secondary text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
              >
                <Search className="w-4 h-4 text-[#3B7DE8]" />
                <span>Lacak Tiket</span>
              </Link>
              <Link
                to="/buat-laporan"
                className="w-full sm:w-auto px-6 py-2.5 rounded-2xl glass-button-primary text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Buat Aduan Baru</span>
              </Link>
            </div>
            <span className="text-[11px] text-slate-500 mt-2 font-medium text-center">
              Layanan resmi bebas biaya &amp; terlindungi hukum
            </span>
          </div>
        </div>

        {/* 4 Kartu Statistik Ringkasan — Liquid Glass Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Laporan */}
          <div className="glass-card p-5 rounded-3xl border border-white/80 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Aduan Saya</span>
              <div className="w-9 h-9 rounded-2xl glass-pill-blue text-[#3B7DE8] flex items-center justify-center shrink-0">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 leading-none">{totalCount}</span>
              <span className="text-xs text-slate-400 font-medium">kasus tercatat</span>
            </div>
          </div>

          {/* Card 2: Menunggu Tanggapan */}
          <div className="glass-card p-5 rounded-3xl border border-amber-200/50 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Menunggu Tanggapan</span>
              <div className="w-9 h-9 rounded-2xl glass-pill-yellow text-amber-600 flex items-center justify-center shrink-0">
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-3xl font-black text-slate-900 leading-none">{pendingCount}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold glass-pill-yellow">
                Penelaahan
              </span>
            </div>
          </div>

          {/* Card 3: Sedang Ditindak */}
          <div className="glass-card p-5 rounded-3xl border border-blue-200/50 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Sedang Ditindak</span>
              <div className="w-9 h-9 rounded-2xl glass-pill-blue text-[#3B7DE8] flex items-center justify-center shrink-0">
                <RotateCw className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-3xl font-black text-slate-900 leading-none">{inProgressCount}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold glass-pill-blue">
                Konseling
              </span>
            </div>
          </div>

          {/* Card 4: Selesai Ditangani */}
          <div className="glass-card p-5 rounded-3xl border border-emerald-200/50 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Selesai Ditangani</span>
              <div className="w-9 h-9 rounded-2xl glass-pill-green text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-3xl font-black text-slate-900 leading-none">{completedCount}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold glass-pill-green">
                Terselesaikan
              </span>
            </div>
          </div>
        </div>

        {/* Section Riwayat Laporan Saya */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Riwayat Laporan Saya
                </h3>
                {isBackendConnected && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold glass-pill-green">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Tersinkron Database</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pantau perkembangan dan tindak lanjut aduan yang telah Anda kirimkan secara transparan.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* Dropdown Filter Status */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none glass-input rounded-2xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="all">Semua Status</option>
                  <option value="menunggu">Menunggu</option>
                  <option value="ditindaklanjuti">Sedang Ditindak</option>
                  <option value="selesai">Selesai</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Tombol Urutkan */}
              <button
                type="button"
                onClick={() => setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'))}
                className="glass-card hover:bg-white rounded-2xl px-3.5 py-2 text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer transition"
                title="Klik untuk mengubah urutan"
              >
                <span>{sortOrder === 'newest' ? 'Terbaru' : 'Terlama'}</span>
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          {displayedReports.length === 0 ? (
            <div className="glass-panel-elevated rounded-3xl border border-white/80 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl glass-pill-blue text-[#3B7DE8] flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Tidak Ada Laporan Ditemukan</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {statusFilter !== 'all'
                  ? 'Tidak ada laporan dengan status yang dipilih.'
                  : 'Anda belum memiliki riwayat laporan pengaduan.'}
              </p>
              {statusFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className="text-xs font-bold text-[#3B7DE8] hover:underline cursor-pointer"
                >
                  Tampilkan Semua Status
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedReports.map((item) => {
                const isWaiting = item.status === 'menunggu';
                const isProcessing = item.status === 'ditindaklanjuti' || item.status === 'diverifikasi';
                const isCompleted = item.status === 'selesai';

                const formattedTicket = item.ticket_code.startsWith('#')
                  ? item.ticket_code
                  : `#${item.ticket_code}`;

                return (
                  <div
                    key={item.id}
                    className="glass-card rounded-3xl border border-white/80 p-5 shadow-sm hover:border-white/95 transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Baris Kode Tiket & Status Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800 glass-pill px-3 py-1 rounded-2xl">
                          {formattedTicket}
                        </span>

                        {isWaiting && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold glass-pill-yellow">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <span>Menunggu</span>
                          </span>
                        )}

                        {isProcessing && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold glass-pill-blue">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3B7DE8] animate-pulse" />
                            <span>Ditindaklanjuti</span>
                          </span>
                        )}

                        {isCompleted && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold glass-pill-green">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Selesai</span>
                          </span>
                        )}
                      </div>

                      {/* Kategori Baris */}
                      <div className="flex items-center gap-2 mt-3.5">
                        {renderCategoryIcon(item.kategori_nama)}
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {item.kategori_nama}
                        </span>
                      </div>

                      {/* Judul Insiden */}
                      <h4 className="text-slate-900 font-bold text-sm leading-snug my-2.5 line-clamp-2">
                        {item.judul || item.deskripsi}
                      </h4>

                      {/* Meta Info */}
                      <div className="space-y-1 text-xs text-slate-400 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.tanggal}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {item.is_anonymous ? (
                            <>
                              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>Mode: Anonim (Identitas Dirahasiakan)</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>Mode: Identitas Terbuka</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Callout Box Status */}
                      {isWaiting && (
                        <div className="glass-pill-blue p-3 rounded-2xl mt-3 flex items-start gap-2.5 text-xs text-slate-700">
                          <Info className="w-4 h-4 text-[#3B7DE8] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">
                            {item.catatan_konselor || 'Sedang dalam antrean telaah oleh Koordinator Konseling Kesiswaan.'}
                          </span>
                        </div>
                      )}

                      {isProcessing && (
                        <div className="glass-card border border-white/80 p-3 rounded-2xl mt-3 flex items-start gap-2.5 text-xs text-slate-700">
                          <GraduationCap className="w-4 h-4 text-[#3B7DE8] shrink-0 mt-0.5" />
                          <div className="leading-relaxed">
                            <span className="font-bold text-slate-900">Konselor Pendamping: </span>
                            <span>{item.konselor_nama || 'Dra. Hj. Ratna Sari (Guru BK)'}</span>
                          </div>
                        </div>
                      )}

                      {isCompleted && (
                        <div className="glass-pill-green p-3 rounded-2xl mt-3 flex items-start gap-2.5 text-xs text-emerald-950">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div className="leading-relaxed">
                            <span className="font-bold text-emerald-950">Resolusi: </span>
                            <span>{item.solusi || item.catatan_konselor || 'Penanganan dan mediasi kasus telah tuntas diselesaikan.'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Footer */}
                    <Link
                      to={`/lacak?code=${item.ticket_code.replace('#', '')}&from=dashboard`}
                      className="text-xs font-bold text-[#3B7DE8] hover:text-[#2563c0] flex items-center gap-1.5 mt-4 pt-3 border-t border-white/50 transition group"
                    >
                      <span>{isCompleted ? 'Lihat Arsip Resolusi' : 'Lihat Rincian & Percakapan'}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Banner Bantuan Darurat Segera — Liquid Glass Elevated */}
        <div className="glass-panel-elevated rounded-3xl p-5 md:p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-white/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl glass-pill-red flex items-center justify-center shrink-0 shadow-xs">
              <PhoneCall className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm md:text-base">
                Butuh Bantuan Darurat Segera?
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Hubungi Satuan Tugas PPA &amp; Layanan Konseling Darurat Sekolah jika keselamatan Anda atau teman dalam situasi kritis.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
            <a
              href="tel:02177889900"
              className="px-4 py-2.5 glass-card rounded-2xl text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition whitespace-nowrap"
            >
              <Phone className="w-4 h-4 text-slate-600" />
              <span>(021) 7788-9900</span>
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-2xl text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm whitespace-nowrap"
            >
              <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>WhatsApp Satgas PPKSP</span>
            </a>
          </div>
        </div>
      </main>

      <StudentFooter />
    </div>
  );
};

export default StudentDashboard;
