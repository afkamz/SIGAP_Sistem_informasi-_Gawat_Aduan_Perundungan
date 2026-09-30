import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Shield,
  FileText,
  Lock,
  ArrowLeft,
  ChevronRight,
  MessageSquare,
  Copy,
  Check,
  Download,
  Calendar,
  EyeOff,
  UserCheck,
  Send,
  UploadCloud,
  X,
  Printer,
  Sparkles,
  HelpCircle,
  Tag,
  Mail,
  RotateCw
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StudentHeader } from '../../components/layout/StudentHeader';
import { StudentFooter } from '../../components/layout/StudentFooter';

export const TrackReport = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryCode = searchParams.get('code') || '';
  const fromParam = searchParams.get('from') || '';
  const initialView = searchParams.get('view') || '';

  const { reports, currentUser, addReportMessage } = useStore();
  const navigate = useNavigate();

  // Search input state: default to empty unless explicitly passed in URL query
  const [ticketInput, setTicketInput] = useState(queryCode || '');
  const [activeReport, setActiveReport] = useState(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // View mode: 'overview' (Image 2) or 'detail' (Image 1)
  const [viewMode, setViewMode] = useState(initialView === 'detail' && !!queryCode ? 'detail' : 'overview');

  // Filter tabs for Riwayat Laporan Sebelumnya in Overview mode
  const [historyTab, setHistoryTab] = useState('all'); // 'all' | 'proses' | 'selesai'

  // Interactive UI states
  const [copied, setCopied] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Message modal form state
  const [additionalMessage, setAdditionalMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  const [submitSuccessNotice, setSubmitSuccessNotice] = useState(false);

  // Only auto-search if a queryCode is explicitly provided in URL
  useEffect(() => {
    if (queryCode && queryCode.trim()) {
      setTicketInput(queryCode);
      handleSearch(queryCode, initialView === 'detail');
    } else {
      setTicketInput('');
      setActiveReport(null);
      setSearchAttempted(false);
      setViewMode('overview');
    }
  }, [queryCode, reports]);

  const handleSearch = (codeToSearch, triggerDetailOnFound = false) => {
    const raw = (codeToSearch !== undefined ? codeToSearch : ticketInput).trim().toUpperCase();
    const clean = raw.replace(/[#\s]/g, '');

    if (!clean) {
      setSearchAttempted(false);
      setActiveReport(null);
      return;
    }

    setSearchAttempted(true);

    const found = reports.find(
      (r) => r.ticket_code && r.ticket_code.toUpperCase().replace(/[#\s]/g, '') === clean
    );

    if (found) {
      setActiveReport(found);
      if (triggerDetailOnFound) {
        setViewMode('detail');
      }
    } else {
      setActiveReport(null);
    }
  };

  const handleCopyTicket = (code) => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!additionalMessage.trim() || !activeReport) return;

    setIsSubmittingMessage(true);
    setTimeout(() => {
      if (addReportMessage) {
        addReportMessage(
          activeReport.ticket_code,
          additionalMessage,
          attachedFile,
          currentUser?.nama || (activeReport.is_anonymous ? 'Pelapor Anonim' : 'Pelapor Siswa')
        );
      }
      setIsSubmittingMessage(false);
      setAdditionalMessage('');
      setAttachedFile(null);
      setShowMessageModal(false);
      setSubmitSuccessNotice(true);
      setTimeout(() => setSubmitSuccessNotice(false), 4000);
    }, 600);
  };

  // Stepper helper
  const getStepIndex = (status) => {
    switch (status) {
      case 'menunggu': return 0;
      case 'diverifikasi': return 1;
      case 'ditindaklanjuti': return 2;
      case 'selesai': return 3;
      default: return 1;
    }
  };

  const currentStepIdx = activeReport ? getStepIndex(activeReport.status) : 1;

  // Filtered reports for "Riwayat Laporan Sebelumnya"
  const historyReports = useMemo(() => {
    // Show reports associated with current user or the representative mock list
    let list = reports;
    if (historyTab === 'proses') {
      list = list.filter((r) => r.status === 'menunggu' || r.status === 'diverifikasi' || r.status === 'ditindaklanjuti');
    } else if (historyTab === 'selesai') {
      list = list.filter((r) => r.status === 'selesai');
    }
    return list;
  }, [reports, historyTab]);

  const countProses = useMemo(
    () => reports.filter((r) => r.status === 'menunggu' || r.status === 'diverifikasi' || r.status === 'ditindaklanjuti').length,
    [reports]
  );
  const countSelesai = useMemo(
    () => reports.filter((r) => r.status === 'selesai').length,
    [reports]
  );

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      <StudentHeader />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 space-y-7">
        
        {/* ========================================================================= */}
        {/* VIEW MODE 1: OVERVIEW / PENCARIAN & RIWAYAT (Matches Image 2)           */}
        {/* ========================================================================= */}
        {viewMode === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Pill Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-xs font-semibold text-sky-800 shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-sky-700" />
                <span>Pelacakan Aman & Anonim Tanpa Perlu Masuk</span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Lacak Status Laporan
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
                Masukkan kode tiket rahasia yang Anda dapatkan saat mengirimkan pengaduan untuk memantau perkembangan investigasi.
              </p>
            </div>

            {/* Search Input Box */}
            <div className="max-w-2xl mx-auto space-y-2.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!ticketInput.trim()) return;
                  handleSearch(ticketInput, false);
                }}
                className="flex items-center bg-white rounded-2xl border-2 border-sky-200/90 shadow-sm hover:border-sky-300 focus-within:border-sky-400 p-1.5 transition"
              >
                <div className="pl-3.5 pr-1 text-slate-400">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={ticketInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTicketInput(val);
                    if (!val.trim()) {
                      setSearchAttempted(false);
                      setActiveReport(null);
                    }
                  }}
                  placeholder="Masukkan kode tiket (contoh: SGP-2026-0091)"
                  className="w-full px-3 py-2.5 bg-transparent font-mono font-bold text-sm sm:text-base text-slate-800 uppercase tracking-wider focus:outline-none placeholder:text-slate-300 placeholder:font-medium placeholder:font-sans"
                />
                {ticketInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setTicketInput('');
                      setActiveReport(null);
                      setSearchAttempted(false);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 mr-1 transition"
                    title="Hapus"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#7BBCE6] hover:bg-[#68AFDC] text-slate-900 font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition active:scale-95 shadow-2xs"
                >
                  <Search className="w-4 h-4 text-slate-900" />
                  <span>Cek Status</span>
                </button>
              </form>

              {/* Sub-search helper row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-2 text-xs">
                <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium text-[11px] sm:text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Format kode peka huruf kapital (SGP-XXXX-XXXX)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className="text-[11px] sm:text-xs font-semibold text-sky-700 hover:text-sky-900 hover:underline"
                >
                  Lupa kode tiket?
                </button>
              </div>
            </div>

            {/* Quick Demo Code Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="text-[11px]">Contoh kode tiket uji:</span>
              {['SGP-2026-0091', 'SGP-2026-0084', 'SGP-2026-0042', 'SGP-2024-0142'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setTicketInput(code);
                    handleSearch(code, false);
                  }}
                  className={`font-mono text-xs px-2.5 py-1 rounded-lg border transition ${
                    activeReport?.ticket_code === code
                      ? 'bg-sky-100 text-sky-900 border-sky-300 font-bold'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            {/* Status Result Card (Exact layout matching Image 2) */}
            {activeReport ? (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6 animate-fade-in">
                {/* Header Row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-100 pb-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                        KODE TIKET TERVERIFIKASI
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        {activeReport.status_badge || activeReport.status_label || 'Sedang Ditelaah Konselor'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                        {activeReport.ticket_code}
                      </h2>
                      <button
                        type="button"
                        onClick={() => handleCopyTicket(activeReport.ticket_code)}
                        title="Salin Kode Tiket"
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition relative"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-500" />
                        )}
                        {copied && (
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold shadow-xs whitespace-nowrap">
                            Tersalin!
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 3 Info Boxes on Right */}
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <div className="bg-slate-50/90 border border-slate-100 px-3.5 py-2 rounded-xl text-left min-w-[120px]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                        KATEGORI
                      </span>
                      <span className="text-xs font-bold text-slate-800 block truncate max-w-[160px]">
                        {activeReport.kategori_nama}
                      </span>
                    </div>

                    <div className="bg-slate-50/90 border border-slate-100 px-3.5 py-2 rounded-xl text-left min-w-[130px]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                        DIKIRIM PADA
                      </span>
                      <span className="text-xs font-bold text-slate-800 block">
                        {activeReport.tanggal || '14 Mei 2024 • 14:45'}
                      </span>
                    </div>

                    <div className="bg-slate-50/90 border border-slate-100 px-3.5 py-2 rounded-xl text-left min-w-[110px]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                        SIFAT PELAPORAN
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800">
                        {activeReport.is_anonymous ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Anonim</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                            <span>Terbuka</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4-Step Stepper Progress Bar (Horizontal Timeline matching Image 2) */}
                <div className="py-2">
                  <div className="relative flex items-center justify-between">
                    {/* Background track line */}
                    <div className="absolute left-6 right-6 top-5 -translate-y-1/2 h-0.5 bg-slate-200 z-0"></div>
                    {/* Active colored progress track */}
                    <div
                      className="absolute left-6 top-5 -translate-y-1/2 h-0.5 bg-sky-500 z-0 transition-all duration-500"
                      style={{
                        width:
                          currentStepIdx === 0
                            ? '0%'
                            : currentStepIdx === 1
                            ? '33%'
                            : currentStepIdx === 2
                            ? '66%'
                            : '100%'
                      }}
                    ></div>

                    {/* Step 1: Diterima */}
                    <div className="relative z-10 flex flex-col items-center text-center max-w-[90px] sm:max-w-[120px]">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs font-bold text-sm">
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <span className="font-bold text-xs text-slate-900 mt-2 block">Diterima</span>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                        {activeReport.step_dates?.step1 || '14 Mei, 14:45'}
                      </span>
                    </div>

                    {/* Step 2: Penelaahan BK/Satgas */}
                    <div className="relative z-10 flex flex-col items-center text-center max-w-[90px] sm:max-w-[140px]">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-xs ${
                          currentStepIdx >= 1
                            ? currentStepIdx === 1
                              ? 'bg-sky-500 text-white ring-4 ring-sky-100'
                              : 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {currentStepIdx > 1 ? (
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        ) : currentStepIdx === 1 ? (
                          <RotateCw className="w-4 h-4 animate-spin" />
                        ) : (
                          '2'
                        )}
                      </div>
                      <span
                        className={`font-bold text-xs mt-2 block ${
                          currentStepIdx >= 1 ? 'text-sky-900' : 'text-slate-500'
                        }`}
                      >
                        Penelaahan BK/Satgas
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-sky-600 font-medium mt-0.5">
                        {currentStepIdx >= 1 ? 'Maks 24 Jam Kerja' : 'Menunggu'}
                      </span>
                    </div>

                    {/* Step 3: Tindak Lanjut & Mediasi */}
                    <div className="relative z-10 flex flex-col items-center text-center max-w-[90px] sm:max-w-[140px]">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-xs ${
                          currentStepIdx >= 2
                            ? currentStepIdx === 2
                              ? 'bg-sky-600 text-white ring-4 ring-sky-100'
                              : 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {currentStepIdx > 2 ? (
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        ) : (
                          '3'
                        )}
                      </div>
                      <span
                        className={`font-bold text-xs mt-2 block ${
                          currentStepIdx >= 2 ? 'text-slate-900' : 'text-slate-500'
                        }`}
                      >
                        Tindak Lanjut & Mediasi
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                        {currentStepIdx >= 2 ? activeReport.step_dates?.step3 || 'Aktif' : 'Menunggu'}
                      </span>
                    </div>

                    {/* Step 4: Selesai & Evaluasi */}
                    <div className="relative z-10 flex flex-col items-center text-center max-w-[90px] sm:max-w-[130px]">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-xs ${
                          currentStepIdx === 3
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {currentStepIdx === 3 ? (
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        ) : (
                          '4'
                        )}
                      </div>
                      <span
                        className={`font-bold text-xs mt-2 block ${
                          currentStepIdx === 3 ? 'text-emerald-900' : 'text-slate-500'
                        }`}
                      >
                        Selesai & Evaluasi
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                        {currentStepIdx === 3 ? 'Kasus Tuntas' : 'Tahap Akhir'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Catatan Petugas Konselor BK Box */}
                <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900">
                        Catatan Petugas Konselor BK ({activeReport.konselor_nama || 'Ibu Rahmawati, S.Pd'})
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {activeReport.catatan_updated_at || '14 Mei, 16:10 WIB'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{activeReport.catatan_konselor ||
                        'Bukti tangkapan layar telah kami verifikasi. Kami sedang melakukan koordinasi internal dengan wali kelas terkait tanpa membocorkan identitas siapapun. Harap simpan tautan/tiket ini untuk update berikutnya.'}"
                    </p>
                  </div>
                </div>

                {/* Detail View Switch Link Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setViewMode('detail')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-sky-800 hover:text-sky-950 bg-sky-50 hover:bg-sky-100 px-4 py-2.5 rounded-xl border border-sky-200 transition"
                  >
                    <span>Lihat Progres Penanganan Lengkap & Dokumen Bukti</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : searchAttempted ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Kode Tiket Tidak Ditemukan</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Pastikan Anda memasukkan kode tiket dengan format yang benar (misal:{' '}
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold">SGP-2026-0091</code>).
                </p>
              </div>
            ) : null}

            {/* Riwayat Laporan Sebelumnya Section (Bottom of Image 2) */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      Riwayat Laporan Sebelumnya
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-800">
                      Jika Sudah Masuk Akun
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Daftar pengaduan yang terhubung dengan akun siswa Anda dapat ditinjau langsung secara terpusat di bawah ini.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className="text-xs text-slate-400 font-medium hidden md:inline">
                    Total: {reports.length} Laporan
                  </span>
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setHistoryTab('all')}
                      className={`px-3 py-1 rounded-lg font-semibold transition ${
                        historyTab === 'all'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Semua
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistoryTab('proses')}
                      className={`px-3 py-1 rounded-lg font-semibold transition ${
                        historyTab === 'proses'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Diproses ({countProses})
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistoryTab('selesai')}
                      className={`px-3 py-1 rounded-lg font-semibold transition ${
                        historyTab === 'selesai'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Selesai ({countSelesai})
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid of previous reports */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {historyReports.slice(0, 6).map((report) => {
                  const isDone = report.status === 'selesai';
                  const isMediasi = report.status_badge === 'Mediasi Terjadwal' || report.status === 'ditindaklanjuti';
                  
                  let badgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
                  let badgeText = report.status_badge || 'Penelaahan';
                  if (isDone) {
                    badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                    badgeText = 'Terselesaikan';
                  } else if (isMediasi) {
                    badgeClass = 'bg-sky-50 text-sky-800 border-sky-200';
                    badgeText = report.status_badge || 'Mediasi Terjadwal';
                  }

                  return (
                    <div
                      key={report.id}
                      className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition flex flex-col justify-between space-y-3.5"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold text-sky-900 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                            {report.ticket_code}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isDone ? 'bg-emerald-500' : isMediasi ? 'bg-sky-500' : 'bg-amber-500'
                              }`}
                            ></span>
                            {badgeText}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                          {report.judul}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {report.deskripsi}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-400">
                          Tanggal Kirim<br />
                          <strong className="text-slate-600 font-semibold">{report.tanggal?.split('•')[0] || report.tanggal}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveReport(report);
                            setTicketInput(report.ticket_code);
                            setViewMode('detail');
                          }}
                          className="font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 group py-1"
                        >
                          <span>{isDone ? 'Arsip Laporan' : 'Detail Laporan'}</span>
                          <ChevronRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 2: FULL DETAIL LAPORAN & STATUS (Matches Image 1)               */}
        {/* ========================================================================= */}
        {viewMode === 'detail' && activeReport && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Navigation: Kembali ke Riwayat Laporan */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (fromParam === 'dashboard') {
                    navigate('/dashboard');
                  } else {
                    setViewMode('overview');
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>
                  {fromParam === 'dashboard' ? 'Kembali ke Dashboard' : 'Kembali ke Riwayat Laporan'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('overview')}
                  className="text-xs font-medium text-slate-500 hover:text-sky-700 underline"
                >
                  Cari Tiket Lain
                </button>
              </div>
            </div>

            {/* Success notification if additional message sent */}
            {submitSuccessNotice && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pesan tambahan / bukti baru berhasil diteruskan ke Konselor BK & Satgas.</span>
              </div>
            )}

            {/* Main Detail Card (Exact Match to Image 1) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-7">
              
              {/* Row 1: Badges Row */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-50 border border-sky-200 text-xs font-semibold text-sky-900">
                  <Tag className="w-3.5 h-3.5 text-sky-700" />
                  <span>{activeReport.kategori_nama}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-900 border border-sky-200">
                  <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                  <span>{activeReport.status_label || 'Sedang Ditindaklanjuti'}</span>
                </span>
              </div>

              {/* Row 2: Ticket Code & Shield Icon */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                    NOMOR TIKET REGISTRASI
                  </span>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                      {activeReport.ticket_code}
                    </h2>
                    <button
                      type="button"
                      onClick={() => handleCopyTicket(activeReport.ticket_code)}
                      title="Salin Kode Tiket"
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition relative"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-500" />
                      )}
                      {copied && (
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold shadow-xs whitespace-nowrap">
                          Tersalin!
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 shrink-0">
                  <Shield className="w-5 h-5" strokeWidth={1.8} />
                </div>
              </div>

              {/* Row 3: Date & Anonymity */}
              <div className="flex items-center gap-3 text-xs text-slate-500 border-b border-slate-100 pb-5 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeReport.tanggal || '14 Mei 2024 • 14:15 WIB'}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-sky-700" />
                  <span className="font-semibold text-slate-700">
                    Sifat: {activeReport.is_anonymous ? 'Laporan Anonim' : 'Laporan Terbuka'}
                  </span>
                </div>
              </div>

              {/* Row 4: Progres Penanganan (Langkah 3 dari 4) Stepper */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <h4 className="font-bold text-slate-900 text-sm">Progres Penanganan</h4>
                  <span className="text-slate-400 font-medium">
                    Langkah {currentStepIdx + 1} dari 4
                  </span>
                </div>

                <div className="relative pt-2 pb-4">
                  {/* Track line */}
                  <div className="absolute left-6 right-6 top-7 -translate-y-1/2 h-0.5 bg-slate-200 z-0"></div>
                  <div
                    className="absolute left-6 top-7 -translate-y-1/2 h-0.5 bg-sky-600 z-0 transition-all duration-500"
                    style={{
                      width:
                        currentStepIdx === 0
                          ? '0%'
                          : currentStepIdx === 1
                          ? '33%'
                          : currentStepIdx === 2
                          ? '66%'
                          : '100%'
                    }}
                  ></div>

                  <div className="relative z-10 grid grid-cols-4 gap-2">
                    {/* Step 1: Menunggu */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-[#7BBCE6] text-slate-900 flex items-center justify-center font-bold text-sm shadow-xs">
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <span className="font-bold text-xs text-slate-900 mt-2.5 block">Menunggu</span>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 leading-tight">
                        {activeReport.step_dates?.step1 || '14 Mei 2024 14:15 WIB'}
                      </span>
                    </div>

                    {/* Step 2: Diverifikasi */}
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-xs ${
                          currentStepIdx >= 1
                            ? 'bg-[#7BBCE6] text-slate-900'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {currentStepIdx >= 1 ? (
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        ) : (
                          '2'
                        )}
                      </div>
                      <span className="font-bold text-xs text-slate-900 mt-2.5 block">Diverifikasi</span>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 leading-tight">
                        {activeReport.step_dates?.step2 || '14 Mei 2024 15:30 WIB'}
                      </span>
                    </div>

                    {/* Step 3: Ditindaklanjuti (Aktif) */}
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-xs ${
                          currentStepIdx >= 2
                            ? currentStepIdx === 2
                              ? 'bg-sky-800 text-white ring-4 ring-sky-100'
                              : 'bg-[#7BBCE6] text-slate-900'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {currentStepIdx > 2 ? (
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        ) : (
                          '3'
                        )}
                      </div>
                      <span
                        className={`font-bold text-xs mt-2.5 block ${
                          currentStepIdx === 2 ? 'text-sky-900' : 'text-slate-900'
                        }`}
                      >
                        Ditindaklanjuti
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-sky-700 font-semibold mt-0.5 leading-tight">
                        {activeReport.step_dates?.step3 || '15 Mei, 09:00'}
                      </span>
                      {currentStepIdx === 2 && (
                        <span className="mt-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-sky-600 text-white uppercase tracking-wider">
                          Aktif
                        </span>
                      )}
                    </div>

                    {/* Step 4: Selesai */}
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-xs ${
                          currentStepIdx === 3
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                            : 'bg-white border-2 border-dashed border-slate-300 text-slate-400'
                        }`}
                      >
                        {currentStepIdx === 3 ? (
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        ) : (
                          '4'
                        )}
                      </div>
                      <span className="font-bold text-xs text-slate-500 mt-2.5 block">Selesai</span>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 leading-tight">
                        {activeReport.step_dates?.step4 || 'Estimasi 1-2 hari kerja'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 5: Catatan Petugas Penanganan (Exact Box from Image 1) */}
              <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                      Catatan Petugas Penanganan
                    </h5>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Tim BK & Satgas PPKSP</span>
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeReport.catatan_konselor ||
                    'Laporan telah diverifikasi oleh Guru Bimbingan Konseling. Tim Satgas saat ini sedang melakukan pemanggilan tertutup dan koordinasi bersama wali kelas tanpa membuka identitas pelapor. Tetap pantau halaman ini untuk pembaruan berikutnya.'}
                </p>

                <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Diperbarui: {activeReport.catatan_updated_at || '15 Mei 2024, 10:45 WIB'} oleh{' '}
                    <strong className="text-slate-700 font-semibold">
                      {activeReport.konselor_nama || 'Ibu Rahmawati, S.Pd (Konselor BK)'}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Row 6: Jaminan Kerahasiaan & Perlindungan Siswa Box (Exact from Image 1) */}
              <div className="bg-sky-50/70 border border-sky-200/90 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5 text-sky-700" />
                </div>
                <div className="space-y-1 text-xs">
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                    Jaminan Kerahasian & Perlindungan Siswa
                  </h5>
                  <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                    Laporanmu ditangani dengan kerahasiaan penuh. Identitas, bukti, dan percakapan dilindungi sesuai{' '}
                    <strong className="text-slate-800 font-semibold">
                      Permendikbudristek No. 46 Tahun 2023
                    </strong>{' '}
                    tentang Pencegahan dan Penanganan Kekerasan di Lingkungan Satuan Pendidikan (PPKSP). Pihak terlapor tidak akan mengetahui identitas pelapor.
                  </p>
                </div>
              </div>

              {/* Row 7: Action Footer Buttons (Exact from Image 1) */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(true)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 hover:border-slate-300 shadow-2xs flex items-center justify-center gap-2 transition active:scale-98"
                >
                  <MessageSquare className="w-4 h-4 text-sky-700" />
                  <span>Kirim Pesan Tambahan / Bukti Baru</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowReceiptModal(true)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-sky-800 hover:text-sky-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition hover:underline"
                >
                  <Download className="w-4 h-4 text-sky-700" />
                  <span>Unduh Bukti Tanda Terima (PDF)</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: Kirim Pesan Tambahan / Bukti Baru                               */}
      {/* ========================================================================= */}
      {showMessageModal && activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-base text-slate-900">
                  Kirim Pesan Tambahan / Bukti Baru
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  Tiket: {activeReport.ticket_code}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowMessageModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Isi Pesan / Klarifikasi Lanjutan
                </label>
                <textarea
                  rows={4}
                  required
                  value={additionalMessage}
                  onChange={(e) => setAdditionalMessage(e.target.value)}
                  placeholder="Tuliskan perkembangan terbaru, kronologi susulan, atau tanggapan untuk konselor BK..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-400 leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Lampirkan Berkas / Screenshot Bukti Tambahan (Opsional)
                </label>
                <label className="border-2 border-dashed border-slate-200 hover:border-sky-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-50/50">
                  <UploadCloud className="w-6 h-6 text-sky-600 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">
                    {attachedFile ? attachedFile.name : 'Pilih file tangkapan layar atau dokumen'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, PDF (Maks 10MB)</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setAttachedFile(e.target.files[0] || null)}
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingMessage}
                  className="px-5 py-2.5 rounded-xl bg-[#7BBCE6] hover:bg-[#68AFDC] text-slate-900 font-bold text-xs flex items-center gap-2 transition shadow-2xs disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-slate-900" />
                  <span>{isSubmittingMessage ? 'Mengirim...' : 'Kirim Pesan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Lupa Kode Tiket Help Modal                                      */}
      {/* ========================================================================= */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-sky-700" />
                <h3 className="font-bold text-sm text-slate-900">Bantuan: Lupa Kode Tiket</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                Kode tiket (contoh: <code className="font-mono font-bold bg-slate-100 px-1 py-0.5 rounded">SGP-2026-0091</code>) diberikan pada layar saat pengaduan Anda berhasil terkirim.
              </p>
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 space-y-1.5 text-slate-700">
                <strong className="block text-sky-900">Cara Menemukan Kode Tiket:</strong>
                <ul className="list-disc list-inside space-y-1 text-[11px]">
                  <li>Periksa tangkapan layar atau catatan saat mengirim formulir pengaduan.</li>
                  <li>Jika Anda masuk menggunakan akun siswa, seluruh laporan Anda otomatis tampil di bagian <strong>Riwayat Laporan Sebelumnya</strong> di bawah.</li>
                  <li>Hubungi konselor BK sekolah di ruang BK dengan menunjukkan bukti kepemilikan akun.</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: Cetak / Unduh Bukti Tanda Terima (PDF Print)                     */}
      {/* ========================================================================= */}
      {showReceiptModal && activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-auto">
            {/* Modal Actions Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-700" />
                <span>Bukti Tanda Terima Registrasi Laporan</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowReceiptModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Paper */}
            <div className="border border-slate-300 rounded-2xl p-6 sm:p-7 space-y-5 bg-white text-slate-900">
              {/* Receipt Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                <div className="space-y-0.5">
                  <h2 className="text-xl font-black tracking-tight text-slate-900">SIGAP</h2>
                  <p className="text-[11px] font-semibold text-slate-600">
                    Sistem Informasi Gawat Aduan Perundungan
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Satgas PPKSP • Permendikbudristek No. 46 Tahun 2023
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-black text-slate-900 block">
                    {activeReport.ticket_code}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {activeReport.tanggal}
                  </span>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Kategori</span>
                    <span className="font-bold text-slate-800">{activeReport.kategori_nama}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Sifat Laporan</span>
                    <span className="font-bold text-slate-800">
                      {activeReport.is_anonymous ? 'Anonim (Identitas Dirahasiakan)' : 'Terbuka'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Status Penanganan</span>
                    <span className="font-bold text-sky-700">{activeReport.status_label || activeReport.status}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Konselor Pendamping</span>
                    <span className="font-bold text-slate-800">{activeReport.konselor_nama || 'Tim BK & Satgas'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Ringkasan Aduan</span>
                  <p className="text-[11px] text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {activeReport.deskripsi || activeReport.judul}
                  </p>
                </div>

                <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl text-[10px] text-sky-950 space-y-1">
                  <strong>Pernyataan Keabsahan Dokumen:</strong>
                  <p>
                    Tanda terima ini sah diterbitkan secara otomatis oleh sistem SIGAP. Perlindungan kerahasiaan identitas saksi/korban dijamin penuh oleh hukum.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                <span>SIGAP Verification Token: #{activeReport.id}-{activeReport.ticket_code.replace(/[^0-9]/g, '')}</span>
                <span>Dicetak: {new Date().toLocaleDateString('id-ID')}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 print:hidden">
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <StudentFooter />
    </div>
  );
};

export default TrackReport;
