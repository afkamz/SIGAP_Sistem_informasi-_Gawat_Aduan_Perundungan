import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  HelpCircle,
  Tag,
  Mail,
  RotateCw,
  Monitor,
  Users,
  Building2,
  ShieldAlert,
  ArrowRight,
  GraduationCap,
  Info
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';
import { StudentHeader } from '../../components/layout/StudentHeader';

export const TrackReport = () => {
  const [searchParams] = useSearchParams();
  const queryCode = searchParams.get('code') || '';
  const fromParam = searchParams.get('from') || '';
  const initialView = searchParams.get('view') || '';

  const { reports, currentUser, addReportMessage } = useStore();
  const navigate = useNavigate();

  const [ticketInput, setTicketInput] = useState(queryCode || '');
  const [activeReport, setActiveReport] = useState(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const [viewMode, setViewMode] = useState(initialView === 'detail' && !!queryCode ? 'detail' : 'overview');
  const [historyTab, setHistoryTab] = useState('all');

  const [copied, setCopied] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const [additionalMessage, setAdditionalMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  const [submitSuccessNotice, setSubmitSuccessNotice] = useState(false);

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

  const handleSearch = async (codeToSearch, triggerDetailOnFound = false) => {
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
      return;
    }

    // Fallback live backend API
    try {
      const res = await api.cekStatus(clean);
      if (res && res.ticket_code) {
        const liveReport = {
          id: Date.now(),
          ticket_code: res.ticket_code,
          judul: `Pengaduan Insiden ${res.kategori_nama || 'Kekerasan'}`,
          deskripsi: 'Data aduan resmi tercatat pada server pangkalan data SIGAP.',
          kategori_id: 1,
          kategori_nama: res.kategori_nama || 'Perundungan',
          status: res.status || 'menunggu',
          urgensi: 'Sedang',
          is_active: true,
          is_anonymous: true,
          reporter_name: null,
          reporter_label: 'Pelapor Terverifikasi / Anonim',
          reporter_school: 'Satuan Pendidikan',
          lokasi: 'Lingkungan Sekolah',
          tanggal: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(res.created_at || Date.now())) + ' WIB',
          catatan_konselor: 'Laporan baru diterima oleh sistem. Menunggu verifikasi tim konselor BK.',
          history: [
            {
              waktu: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(res.created_at || Date.now())) + ' WIB',
              status: res.status || 'menunggu',
              pelaksana: 'Sistem SIGAP',
              keterangan: 'Pengaduan berhasil didaftarkan ke server dan tersimpan di basis data.'
            }
          ]
        };
        setActiveReport(liveReport);
        if (triggerDetailOnFound) {
          setViewMode('detail');
        }
        return;
      }
    } catch (_) {}

    setActiveReport(null);
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

  const historyReports = useMemo(() => {
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

  // Pinned Horizontal Editorial Section: Riwayat Laporan Sebelumnya
  const reportsStickyRef = useRef(null);
  const editorialTitleRef = useRef(null);
  const reportsTrackRef = useRef(null);
  const reportCardsRef = useRef([]);

  // Cubic Bezier solver for cubic-bezier(0.16, 1, 0.3, 1)
  const solveCubicBezier = (p) => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    let t = p;
    for (let i = 0; i < 5; i++) {
      const currentX = 3 * (1 - t) * (1 - t) * t * 0.16 + 3 * (1 - t) * t * t * 0.3 + t * t * t;
      const currentSlope = 3 * (1 - t) * (1 - t) * 0.16 + 6 * (1 - t) * t * (0.3 - 0.16) + 3 * t * t * (1 - 0.3);
      if (Math.abs(currentSlope) < 1e-5) break;
      t -= (currentX - p) / currentSlope;
      t = Math.max(0, Math.min(1, t));
    }
    return 3 * (1 - t) * (1 - t) * t * 1.0 + 3 * (1 - t) * t * t * 1.0 + t * t * t;
  };

  const getSubProgress = (p, start, end) => {
    if (p <= start) return 0;
    if (p >= end) return 1;
    return (p - start) / (end - start);
  };

  // Handler Sticky Scroll-Driven Horizontal Reveal: Riwayat Laporan Sebelumnya
  useEffect(() => {
    if (viewMode !== 'overview') return;

    const container = reportsStickyRef.current;
    if (!container) return;

    let rafId = null;

    const handleReportsScroll = () => {
      const rect = container.getBoundingClientRect();
      const topOffset = 64; // Header sticky offset
      const totalScrollable = rect.height - window.innerHeight;

      let p = 0;
      if (totalScrollable > 0) {
        p = Math.max(0, Math.min(1, (topOffset - rect.top) / totalScrollable));
      }

      // 1. Oversized Editorial Typography:
      const pTitle = getSubProgress(p, 0.00, 0.28);
      const titleOpacity = 1.0 - (0.88 * solveCubicBezier(pTitle));
      const titleScale = 1.0 - (0.06 * solveCubicBezier(pTitle));
      if (editorialTitleRef.current) {
        editorialTitleRef.current.style.opacity = titleOpacity;
        editorialTitleRef.current.style.transform = `scale(${titleScale}) translate3d(0, 0, 0)`;
      }

      // 2. Horizontal Cards Track Translation:
      const track = reportsTrackRef.current;
      if (track) {
        const vw = window.innerWidth;
        const trackWidth = track.scrollWidth;
        const padding = vw < 640 ? 24 : 48;

        let endX = padding;
        if (trackWidth + padding * 2 <= vw) {
          endX = Math.round((vw - trackWidth) / 2);
        } else {
          endX = vw - trackWidth - padding;
        }

        const startX = vw + 60; // Initial state: offscreen right
        const pTrackNorm = getSubProgress(p, 0.05, 0.95);
        const pTrack = solveCubicBezier(pTrackNorm);

        const currentX = startX + (endX - startX) * pTrack;
        const trackOpacity = solveCubicBezier(getSubProgress(p, 0.03, 0.15));

        track.style.opacity = trackOpacity;
        track.style.transform = `translate3d(${currentX}px, 0, 0)`;

        // 3. Staggered Card Animation
        const cards = reportCardsRef.current;
        const numCards = cards.length;
        if (numCards > 0) {
          cards.forEach((cardEl, idx) => {
            if (!cardEl) return;
            const cardStart = (idx / (numCards + 1)) * 0.35;
            const cardEnd = Math.min(1, cardStart + 0.45);
            const pCard = solveCubicBezier(getSubProgress(pTrackNorm, cardStart, cardEnd));
            cardEl.style.opacity = 0.35 + 0.65 * pCard;
            cardEl.style.transform = `scale(${0.92 + 0.08 * pCard}) translate3d(0, 0, 0)`;
          });
        }
      }
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleReportsScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    handleReportsScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [viewMode, historyReports.length, historyTab]);

  const renderCategoryIcon = (kategoriNama = '') => {
    const lower = (kategoriNama || '').toLowerCase();
    if (lower.includes('siber') || lower.includes('cyber') || lower.includes('online')) {
      return (
        <span
          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border"
          style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
        >
          <Monitor className="w-3.5 h-3.5 text-[#1C6F8E]" />
        </span>
      );
    }
    if (lower.includes('sosial') || lower.includes('pengucilan') || lower.includes('kelompok')) {
      return (
        <span
          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border"
          style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
        >
          <Users className="w-3.5 h-3.5 text-[#1C6F8E]" />
        </span>
      );
    }
    if (lower.includes('sekolah') || lower.includes('kantin') || lower.includes('lingkungan')) {
      return (
        <span
          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border"
          style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
        >
          <Building2 className="w-3.5 h-3.5 text-[#1C6F8E]" />
        </span>
      );
    }
    return (
      <span
        className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border"
        style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
      >
        <ShieldAlert className="w-3.5 h-3.5 text-[#1C6F8E]" />
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white text-[#1C6F8E] flex flex-col font-sans antialiased relative overflow-hidden">
      {/* ─── BACKGROUND DEKORATIF: KOMBINASI TIGA LINGKARAN BABY BLUE & GARIS-GARIS DIAGONAL ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Lingkaran 1: Kiri Atas */}
        <div
          className="absolute -left-20 sm:-left-28 md:-left-36 top-[4%] sm:top-[6%] w-[300px] sm:w-[420px] md:w-[480px] h-[300px] sm:h-[420px] md:h-[480px] rounded-full"
          style={{
            background: 'linear-gradient(135deg, #BFEFFF 0%, #D6F5FF 100%)',
            opacity: 0.85
          }}
        />

        {/* Lingkaran 2: Kanan Tengah (Tambahan Lingkaran Variasi Baru) */}
        <div
          className="absolute -right-20 sm:-right-28 md:-right-36 top-[32%] sm:top-[36%] w-[260px] sm:w-[380px] md:w-[440px] h-[260px] sm:h-[380px] md:h-[440px] rounded-full"
          style={{
            background: 'linear-gradient(135deg, #D2F4FF 0%, #BFEFFF 100%)',
            opacity: 0.78
          }}
        />

        {/* Lingkaran 3: Kiri Bawah (Aksen Halus) */}
        <div
          className="hidden md:block absolute -left-16 bottom-[10%] w-[220px] h-[220px] rounded-full"
          style={{
            background: 'linear-gradient(135deg, #E6F8FF 0%, #BFEFFF 100%)',
            opacity: 0.5
          }}
        />

        {/* Garis-garis Diagonal SVG Berarah Baru (Melintang Elegan) */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
          style={{ opacity: 0.75 }}
        >
          <line
            x1="-100"
            y1="520"
            x2="920"
            y2="-80"
            stroke="#CBD5E1"
            strokeWidth="1.2"
          />
          <line
            x1="220"
            y1="960"
            x2="1240"
            y2="360"
            stroke="#CBD5E1"
            strokeWidth="1.2"
          />
          <line
            x1="540"
            y1="1080"
            x2="1560"
            y2="480"
            stroke="#E2E8F0"
            strokeWidth="1.2"
          />
          <line
            x1="-240"
            y1="820"
            x2="780"
            y2="220"
            stroke="#E2E8F0"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* ─── NAVBAR TANPA GARIS PEMBATAS ─── */}
      <StudentHeader hideBorder={true} />

      <main className="w-full flex-1 relative z-20">
        
        {/* ========================================================================= */}
        {/* VIEW MODE 1: OVERVIEW / PENCARIAN & RIWAYAT                              */}
        {/* ========================================================================= */}
        {viewMode === 'overview' && (
          <div className="w-full space-y-10 animate-fade-in pb-12">
            <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-8 sm:pt-10 space-y-7">
            {/* Title & Description */}
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight" style={{ color: '#1C6F8E' }}>
                Lacak Status Laporan
              </h1>
              <p className="text-xs sm:text-sm leading-relaxed max-w-xl mx-auto" style={{ color: '#2E84A5' }}>
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
                className="flex items-center rounded-2xl p-1.5 transition border"
                style={{
                  background: '#FFFFFF',
                  borderColor: '#BFEFFF',
                  boxShadow: '0 4px 16px rgba(191, 239, 255, 0.35)'
                }}
              >
                <div className="pl-3.5 pr-1 text-[#1C6F8E]">
                  <Mail className="w-5 h-5 text-[#1C6F8E]" />
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
                  className="w-full px-3 py-2.5 bg-transparent font-mono font-bold text-sm sm:text-base uppercase tracking-wider focus:outline-none placeholder:font-medium placeholder:font-sans placeholder:normal-case"
                  style={{
                    color: '#1C6F8E'
                  }}
                />
                {ticketInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setTicketInput('');
                      setActiveReport(null);
                      setSearchAttempted(false);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg mr-1 transition"
                    title="Hapus"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition active:scale-95 border hover:opacity-90 shadow-xs cursor-pointer"
                  style={{
                    background: '#BFEFFF',
                    color: '#1C6F8E',
                    borderColor: '#BFEFFF'
                  }}
                >
                  <Search className="w-4 h-4 text-[#1C6F8E]" />
                  <span>Cek Status</span>
                </button>
              </form>

              {/* Sub-search helper row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-2 text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium text-[11px] sm:text-xs" style={{ color: '#1C6F8E' }}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1C6F8E] shrink-0" />
                  <span>Format kode peka huruf kapital (SGP-XXXX-XXXX)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className="text-[11px] sm:text-xs font-bold hover:underline"
                  style={{ color: '#1C6F8E' }}
                >
                  Lupa kode tiket?
                </button>
              </div>
            </div>

            {/* Quick Demo Code Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs" style={{ color: '#2E84A5' }}>
              <span className="text-[11px]">Contoh kode tiket:</span>
              {['SGP-2026-0091', 'SGP-2026-0084', 'SGP-2026-0042', 'SGP-2024-0142'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setTicketInput(code);
                    handleSearch(code, false);
                  }}
                  className="font-mono text-xs px-2.5 py-1 rounded-lg border transition hover:opacity-90"
                  style={{
                    background: activeReport?.ticket_code === code ? '#BFEFFF' : '#FFFFFF',
                    color: '#1C6F8E',
                    borderColor: activeReport?.ticket_code === code ? '#1C6F8E' : '#BFEFFF'
                  }}
                >
                  {code}
                </button>
              ))}
            </div>

            {/* Status Result Card */}
            {activeReport ? (
              <div
                className="rounded-3xl p-6 sm:p-7 space-y-6 animate-fade-in border"
                style={{
                  background: '#FFFFFF',
                  borderColor: '#BFEFFF',
                  boxShadow: '0 4px 20px -2px rgba(191, 239, 255, 0.45)'
                }}
              >
                {/* Header Row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b pb-5" style={{ borderColor: '#BFEFFF' }}>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: '#2E84A5' }}>
                        KODE TIKET TERVERIFIKASI
                      </span>
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border"
                        style={{
                          background: '#BFEFFF',
                          color: '#1C6F8E',
                          borderColor: '#BFEFFF'
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1C6F8E]" />
                        {activeReport.status_badge || activeReport.status_label || 'Sedang Ditelaah Konselor'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight" style={{ color: '#1C6F8E' }}>
                        {activeReport.ticket_code}
                      </h2>
                      <button
                        type="button"
                        onClick={() => handleCopyTicket(activeReport.ticket_code)}
                        title="Salin Kode Tiket"
                        className="p-1.5 rounded-lg border transition relative hover:opacity-80"
                        style={{
                          background: '#FFFFFF',
                          borderColor: '#BFEFFF',
                          color: '#1C6F8E'
                        }}
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-[#1C6F8E]" />
                        ) : (
                          <Copy className="w-4 h-4 text-[#1C6F8E]" />
                        )}
                        {copied && (
                          <span
                            className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-bold shadow-xs whitespace-nowrap"
                            style={{ background: '#1C6F8E', color: '#FFFFFF' }}
                          >
                            Tersalin!
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 3 Info Boxes on Right */}
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <div
                      className="border px-3.5 py-2 rounded-xl text-left min-w-[120px]"
                      style={{
                        background: '#FFFFFF',
                        borderColor: '#BFEFFF'
                      }}
                    >
                      <span className="text-[10px] font-bold uppercase block tracking-wider" style={{ color: '#2E84A5' }}>
                        KATEGORI
                      </span>
                      <span className="text-xs font-bold block truncate max-w-[160px]" style={{ color: '#1C6F8E' }}>
                        {activeReport.kategori_nama}
                      </span>
                    </div>

                    <div
                      className="border px-3.5 py-2 rounded-xl text-left min-w-[130px]"
                      style={{
                        background: '#FFFFFF',
                        borderColor: '#BFEFFF'
                      }}
                    >
                      <span className="text-[10px] font-bold uppercase block tracking-wider" style={{ color: '#2E84A5' }}>
                        DIKIRIM PADA
                      </span>
                      <span className="text-xs font-bold block" style={{ color: '#1C6F8E' }}>
                        {activeReport.tanggal || '14 Mei 2024 • 14:45'}
                      </span>
                    </div>

                    <div
                      className="border px-3.5 py-2 rounded-xl text-left min-w-[110px]"
                      style={{
                        background: '#FFFFFF',
                        borderColor: '#BFEFFF'
                      }}
                    >
                      <span className="text-[10px] font-bold uppercase block tracking-wider" style={{ color: '#2E84A5' }}>
                        SIFAT PELAPORAN
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: '#1C6F8E' }}>
                        {activeReport.is_anonymous ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-[#1C6F8E]" />
                            <span>Anonim</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5 text-[#1C6F8E]" />
                            <span>Terbuka</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4-Step Stepper Progress Bar */}
                <div className="py-2">
                  <div className="relative flex items-center justify-between">
                    {/* Background track line */}
                    <div className="absolute left-6 right-6 top-5 -translate-y-1/2 h-0.5 z-0" style={{ background: '#BFEFFF' }} />
                    {/* Active colored progress track */}
                    <div
                      className="absolute left-6 top-5 -translate-y-1/2 h-0.5 z-0 transition-all duration-500"
                      style={{
                        background: '#1C6F8E',
                        width:
                          currentStepIdx === 0
                            ? '0%'
                            : currentStepIdx === 1
                            ? '33%'
                            : currentStepIdx === 2
                            ? '66%'
                            : '100%'
                      }}
                    />

                    {/* Step 1: Diterima */}
                    <div className="relative z-10 flex flex-col items-center text-center max-w-[90px] sm:max-w-[120px]">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border"
                        style={{
                          background: '#BFEFFF',
                          color: '#1C6F8E',
                          borderColor: '#BFEFFF'
                        }}
                      >
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <span className="font-bold text-xs mt-2 block" style={{ color: '#1C6F8E' }}>Diterima</span>
                      <span className="text-[10px] sm:text-[11px] mt-0.5" style={{ color: '#2E84A5' }}>
                        {activeReport.step_dates?.step1 || '14 Mei, 14:45'}
                      </span>
                    </div>

                    {/* Step 2: Penelaahan BK/Satgas */}
                    <div className="relative z-10 flex flex-col items-center text-center max-w-[90px] sm:max-w-[140px]">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border"
                        style={{
                          background: currentStepIdx >= 1 ? '#BFEFFF' : '#FFFFFF',
                          color: '#1C6F8E',
                          borderColor: currentStepIdx === 1 ? '#1C6F8E' : '#BFEFFF',
                          boxShadow: currentStepIdx === 1 ? '0 0 0 4px rgba(191, 239, 255, 0.6)' : 'none'
                        }}
                      >
                        {currentStepIdx > 1 ? (
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        ) : currentStepIdx === 1 ? (
                          <RotateCw className="w-4 h-4 animate-spin text-[#1C6F8E]" />
                        ) : (
                          '2'
                        )}
                      </div>
                      <span
                        className="font-bold text-xs mt-2 block"
                        style={{ color: currentStepIdx >= 1 ? '#1C6F8E' : '#2E84A5' }}
                      >
                        Penelaahan BK/Satgas
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-medium mt-0.5" style={{ color: '#2E84A5' }}>
                        {currentStepIdx >= 1 ? 'Maks 24 Jam Kerja' : 'Menunggu'}
                      </span>
                    </div>

                    {/* Step 3: Tindak Lanjut & Mediasi */}
                    <div className="relative z-10 flex flex-col items-center text-center max-w-[90px] sm:max-w-[140px]">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border"
                        style={{
                          background: currentStepIdx >= 2 ? '#BFEFFF' : '#FFFFFF',
                          color: '#1C6F8E',
                          borderColor: currentStepIdx === 2 ? '#1C6F8E' : '#BFEFFF',
                          boxShadow: currentStepIdx === 2 ? '0 0 0 4px rgba(191, 239, 255, 0.6)' : 'none'
                        }}
                      >
                        {currentStepIdx > 2 ? (
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        ) : (
                          '3'
                        )}
                      </div>
                      <span
                        className="font-bold text-xs mt-2 block"
                        style={{ color: currentStepIdx >= 2 ? '#1C6F8E' : '#2E84A5' }}
                      >
                        Tindak Lanjut &amp; Mediasi
                      </span>
                      <span className="text-[10px] sm:text-[11px] mt-0.5" style={{ color: '#2E84A5' }}>
                        {currentStepIdx >= 2 ? activeReport.step_dates?.step3 || 'Aktif' : 'Menunggu'}
                      </span>
                    </div>

                    {/* Step 4: Selesai & Evaluasi */}
                    <div className="relative z-10 flex flex-col items-center text-center max-w-[90px] sm:max-w-[130px]">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border"
                        style={{
                          background: currentStepIdx === 3 ? '#BFEFFF' : '#FFFFFF',
                          color: '#1C6F8E',
                          borderColor: currentStepIdx === 3 ? '#1C6F8E' : '#BFEFFF',
                          boxShadow: currentStepIdx === 3 ? '0 0 0 4px rgba(191, 239, 255, 0.6)' : 'none'
                        }}
                      >
                        {currentStepIdx === 3 ? (
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        ) : (
                          '4'
                        )}
                      </div>
                      <span
                        className="font-bold text-xs mt-2 block"
                        style={{ color: currentStepIdx === 3 ? '#1C6F8E' : '#2E84A5' }}
                      >
                        Selesai &amp; Evaluasi
                      </span>
                      <span className="text-[10px] sm:text-[11px] mt-0.5" style={{ color: '#2E84A5' }}>
                        {currentStepIdx === 3 ? 'Kasus Tuntas' : 'Tahap Akhir'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Catatan Petugas Konselor BK Box */}
                <div
                  className="rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 border"
                  style={{
                    background: '#FFFFFF',
                    borderColor: '#BFEFFF'
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border"
                    style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
                  >
                    <MessageSquare className="w-4 h-4 text-[#1C6F8E]" />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-xs font-bold" style={{ color: '#1C6F8E' }}>
                        Catatan Petugas Konselor BK ({activeReport.konselor_nama || 'Ibu Rahmawati, S.Pd'})
                      </h4>
                      <span className="text-[11px] font-medium" style={{ color: '#2E84A5' }}>
                        {activeReport.catatan_updated_at || '14 Mei, 16:10 WIB'}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed italic" style={{ color: '#2E84A5' }}>
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
                    className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition border hover:opacity-90"
                    style={{
                      background: '#FFFFFF',
                      color: '#1C6F8E',
                      borderColor: '#BFEFFF'
                    }}
                  >
                    <span>Lihat Progres Penanganan Lengkap &amp; Dokumen Bukti</span>
                    <ChevronRight className="w-4 h-4 text-[#1C6F8E]" />
                  </button>
                </div>
              </div>
            ) : searchAttempted ? (
              <div
                className="p-8 rounded-3xl text-center space-y-3 border"
                style={{
                  background: '#FFFFFF',
                  borderColor: '#FEB2B2'
                }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto border bg-red-50 text-red-600 border-red-200">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-red-700">Kode Tiket Tidak Ditemukan</h4>
                <p className="text-xs max-w-md mx-auto" style={{ color: '#2E84A5' }}>
                  Pastikan Anda memasukkan kode tiket dengan format yang benar (misal:{' '}
                  <code className="px-1.5 py-0.5 rounded font-mono font-bold" style={{ background: '#BFEFFF', color: '#1C6F8E' }}>
                    SGP-2026-0091
                  </code>).
                </p>
              </div>
            ) : null}

            </div>

            {/* ─── Pinned Horizontal Editorial Section: Riwayat Laporan Sebelumnya ─── */}
            <section
              id="student-history-section"
              ref={reportsStickyRef}
              className="relative w-full z-20"
              style={{ height: '240vh' }}
            >
              <div
                className="sticky top-16 w-full h-[calc(100vh-4rem)] h-[calc(100dvh-4rem)] flex flex-col justify-center overflow-hidden relative"
                style={{ background: 'transparent' }}
              >
                {/* Top Bar Floating Controls: Header Badge, Filter, and Count */}
                <div className="absolute top-4 sm:top-6 inset-x-0 z-30 px-4 sm:px-8 max-w-7xl w-full mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 pointer-events-auto">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1C6F8E] animate-pulse" />
                    <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1C6F8E]">
                      Riwayat Laporan Sebelumnya
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold border"
                      style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                    >
                      <span>Total: {reports.length} Laporan</span>
                    </span>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <div className="flex items-center p-1 rounded-xl border text-xs" style={{ background: '#FFFFFF', borderColor: '#BFEFFF' }}>
                      <button
                        type="button"
                        onClick={() => setHistoryTab('all')}
                        className="px-3 py-1 rounded-lg font-semibold transition cursor-pointer"
                        style={{
                          background: historyTab === 'all' ? '#BFEFFF' : 'transparent',
                          color: '#1C6F8E'
                        }}
                      >
                        Semua
                      </button>
                      <button
                        type="button"
                        onClick={() => setHistoryTab('proses')}
                        className="px-3 py-1 rounded-lg font-semibold transition cursor-pointer"
                        style={{
                          background: historyTab === 'proses' ? '#BFEFFF' : 'transparent',
                          color: '#1C6F8E'
                        }}
                      >
                        Diproses ({countProses})
                      </button>
                      <button
                        type="button"
                        onClick={() => setHistoryTab('selesai')}
                        className="px-3 py-1 rounded-lg font-semibold transition cursor-pointer"
                        style={{
                          background: historyTab === 'selesai' ? '#BFEFFF' : 'transparent',
                          color: '#1C6F8E'
                        }}
                      >
                        Selesai ({countSelesai})
                      </button>
                    </div>
                  </div>
                </div>

                {/* 1. INITIAL STATE — OVERSIZED EDITORIAL TYPOGRAPHY */}
                <div
                  ref={editorialTitleRef}
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none px-4 sm:px-6 text-center z-0 will-change-transform"
                  style={{ opacity: 1, willChange: 'opacity, transform' }}
                >
                  <div className="space-y-1 sm:space-y-2 max-w-5xl">
                    <span className="text-[11px] sm:text-xs md:text-sm font-black tracking-[0.25em] uppercase text-[#2E84A5] block">
                      Arsip &amp; Dokumentasi Perlindungan Siswa
                    </span>
                    <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-black tracking-tighter leading-[0.88] text-[#1C6F8E]">
                      <span className="block">
                        RI<span className="font-serif italic font-normal text-[#2E84A5]">W</span>AYAT
                      </span>
                      <span className="block mt-1 sm:mt-2">
                        LAPO<span className="font-serif italic font-normal text-[#2E84A5]">R</span>AN <span className="text-[#142B4A]">SEBELUMNYA</span>
                      </span>
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base font-semibold text-[#2E84A5] max-w-xl mx-auto pt-2 sm:pt-4 flex items-center justify-center gap-2">
                      <span>Gulir ke bawah untuk menelusuri kartu laporan</span>
                      <ArrowRight className="w-4 h-4 text-[#1C6F8E] animate-pulse" />
                    </p>
                  </div>
                </div>

                {/* 2. HORIZONTAL CARD REVEAL TRACK (Glide in from offscreen right) */}
                <div className="relative z-10 w-full overflow-visible pointer-events-auto py-4">
                  {historyReports.length === 0 ? (
                    <div
                      ref={reportsTrackRef}
                      className="max-w-md mx-auto rounded-3xl border p-8 sm:p-10 text-center space-y-3 bg-white shadow-lg will-change-transform"
                      style={{
                        borderColor: '#BFEFFF',
                        transform: 'translate3d(100vw, 0, 0)',
                        opacity: 0
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto border"
                        style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
                      >
                        <FileText className="w-6 h-6 text-[#1C6F8E]" />
                      </div>
                      <h4 className="text-base font-bold" style={{ color: '#1C6F8E' }}>
                        Tidak Ada Laporan Ditemukan
                      </h4>
                      <p className="text-xs text-[#2E84A5]">
                        {historyTab !== 'all'
                          ? 'Tidak ada laporan dengan status yang dipilih.'
                          : 'Belum ada riwayat laporan pengaduan.'}
                      </p>
                      {historyTab !== 'all' && (
                        <button
                          type="button"
                          onClick={() => setHistoryTab('all')}
                          className="text-xs font-bold hover:underline cursor-pointer"
                          style={{ color: '#1C6F8E' }}
                        >
                          Tampilkan Semua Status
                        </button>
                      )}
                    </div>
                  ) : (
                    <div
                      ref={reportsTrackRef}
                      className="flex items-center gap-5 sm:gap-6 flex-nowrap will-change-transform w-fit select-none"
                      style={{
                        transform: 'translate3d(100vw, 0, 0)',
                        opacity: 0
                      }}
                    >
                      {historyReports.map((item, idx) => {
                        const isWaiting = item.status === 'menunggu';
                        const isProcessing = item.status === 'ditindaklanjuti' || item.status === 'diverifikasi';
                        const isCompleted = item.status === 'selesai';

                        const formattedTicket = item.ticket_code?.startsWith('#')
                          ? item.ticket_code
                          : `#${item.ticket_code}`;

                        return (
                          <div
                            key={item.id}
                            ref={(el) => (reportCardsRef.current[idx] = el)}
                            className="w-[300px] sm:w-[360px] md:w-[400px] shrink-0 h-[440px] sm:h-[470px] rounded-3xl border p-5 sm:p-6 flex flex-col justify-between relative shadow-[0_8px_30px_rgba(191,239,255,0.45)] hover:shadow-xl transition-shadow duration-300 will-change-transform bg-white text-left"
                            style={{
                              borderColor: '#BFEFFF'
                            }}
                          >
                            <div>
                              {/* Baris Kode Tiket & Status Badge */}
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className="font-mono text-xs font-bold px-3 py-1 rounded-xl border"
                                  style={{
                                    background: '#FFFFFF',
                                    color: '#1C6F8E',
                                    borderColor: '#BFEFFF'
                                  }}
                                >
                                  {formattedTicket}
                                </span>

                                {isWaiting && (
                                  <span
                                    className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold border"
                                    style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1C6F8E] animate-pulse" />
                                    <span>Menunggu</span>
                                  </span>
                                )}

                                {isProcessing && (
                                  <span
                                    className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold border"
                                    style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#1C6F8E' }}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1C6F8E] animate-pulse" />
                                    <span>Ditindaklanjuti</span>
                                  </span>
                                )}

                                {isCompleted && (
                                  <span
                                    className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold border"
                                    style={{ background: '#FFFFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1C6F8E]" />
                                    <span>Selesai</span>
                                  </span>
                                )}
                              </div>

                              {/* Kategori Baris */}
                              <div className="flex items-center gap-2 mt-3.5">
                                {renderCategoryIcon(item.kategori_nama)}
                                <span className="text-xs font-bold truncate" style={{ color: '#1C6F8E' }}>
                                  {item.kategori_nama || 'Pengaduan Umum'}
                                </span>
                              </div>

                              {/* Judul Insiden */}
                              <h4
                                className="font-bold text-sm leading-snug my-2.5 line-clamp-2"
                                style={{ color: '#1C6F8E' }}
                              >
                                {item.judul || item.deskripsi}
                              </h4>

                              {/* Meta Info */}
                              <div className="space-y-1 text-xs mb-3" style={{ color: '#2E84A5' }}>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: '#2E84A5' }} />
                                  <span>{item.tanggal?.split('•')[0] || item.tanggal}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {item.is_anonymous ? (
                                    <>
                                      <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: '#2E84A5' }} />
                                      <span>Mode: Anonim (Rahasia)</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="w-3.5 h-3.5 shrink-0" style={{ color: '#2E84A5' }} />
                                      <span>Mode: Identitas Terbuka</span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Callout Box Status */}
                              {isWaiting && (
                                <div
                                  className="p-3 rounded-2xl mt-3 flex items-start gap-2.5 text-xs border"
                                  style={{
                                    background: 'rgba(191, 239, 255, 0.3)',
                                    borderColor: '#BFEFFF',
                                    color: '#1C6F8E'
                                  }}
                                >
                                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#1C6F8E]" />
                                  <span className="leading-relaxed">
                                    {item.catatan_konselor || 'Sedang dalam antrean telaah oleh Koordinator Konseling Kesiswaan.'}
                                  </span>
                                </div>
                              )}

                              {isProcessing && (
                                <div
                                  className="p-3 rounded-2xl mt-3 flex items-start gap-2.5 text-xs border"
                                  style={{
                                    background: '#FFFFFF',
                                    borderColor: '#BFEFFF',
                                    color: '#1C6F8E'
                                  }}
                                >
                                  <GraduationCap className="w-4 h-4 shrink-0 mt-0.5 text-[#1C6F8E]" />
                                  <div className="leading-relaxed">
                                    <span className="font-bold">Konselor Pendamping: </span>
                                    <span>{item.konselor_nama || 'Tim BK & Satgas PPKSP'}</span>
                                  </div>
                                </div>
                              )}

                              {isCompleted && (
                                <div
                                  className="p-3 rounded-2xl mt-3 flex items-start gap-2.5 text-xs border"
                                  style={{
                                    background: '#FFFFFF',
                                    borderColor: '#BFEFFF',
                                    color: '#1C6F8E'
                                  }}
                                >
                                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#1C6F8E]" />
                                  <div className="leading-relaxed">
                                    <span className="font-bold">Resolusi: </span>
                                    <span>{item.solusi || item.catatan_konselor || 'Kasus telah tuntas diselesaikan oleh konselor BK.'}</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Action Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setActiveReport(item);
                                setTicketInput(item.ticket_code);
                                setViewMode('detail');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="w-full text-xs font-bold flex items-center justify-between gap-1.5 mt-4 pt-3 border-t transition group hover:opacity-80 cursor-pointer"
                              style={{
                                color: '#1C6F8E',
                                borderColor: '#BFEFFF'
                              }}
                            >
                              <span>{isCompleted ? 'Lihat Arsip Resolusi' : 'Lihat Detail & Lacak'}</span>
                              <ChevronRight className="w-4 h-4 transition group-hover:translate-x-1" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 2: FULL DETAIL LAPORAN & STATUS                                */}
        {/* ========================================================================= */}
        {viewMode === 'detail' && activeReport && (
          <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 space-y-7 animate-fade-in">
            {/* Top Navigation */}
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
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition border hover:opacity-90"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#1C6F8E]" />
                <span>
                  {fromParam === 'dashboard' ? 'Kembali ke Dashboard' : 'Kembali ke Riwayat Laporan'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('overview')}
                  className="text-xs font-medium hover:underline"
                  style={{ color: '#1C6F8E' }}
                >
                  Cari Tiket Lain
                </button>
              </div>
            </div>

            {/* Success notification if additional message sent */}
            {submitSuccessNotice && (
              <div
                className="p-3.5 rounded-2xl border text-xs flex items-center gap-2 animate-fade-in"
                style={{
                  background: '#FFFFFF',
                  borderColor: '#BFEFFF',
                  color: '#1C6F8E'
                }}
              >
                <CheckCircle2 className="w-4 h-4 text-[#1C6F8E] shrink-0" />
                <span>Pesan tambahan / bukti baru berhasil diteruskan ke Konselor BK &amp; Satgas.</span>
              </div>
            )}

            {/* Main Detail Card */}
            <div
              className="rounded-3xl p-6 sm:p-8 space-y-7 border"
              style={{
                background: '#FFFFFF',
                borderColor: '#BFEFFF',
                boxShadow: '0 4px 20px -2px rgba(191, 239, 255, 0.45)'
              }}
            >
              
              {/* Row 1: Badges Row */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border"
                  style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                >
                  <Tag className="w-3.5 h-3.5 text-[#1C6F8E]" />
                  <span>{activeReport.kategori_nama}</span>
                </span>

                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                  style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#1C6F8E' }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#1C6F8E]" />
                  <span>{activeReport.status_label || 'Sedang Ditindaklanjuti'}</span>
                </span>
              </div>

              {/* Row 2: Ticket Code & Shield Icon */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold tracking-wider uppercase block" style={{ color: '#2E84A5' }}>
                    NOMOR TIKET REGISTRASI
                  </span>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight" style={{ color: '#1C6F8E' }}>
                      {activeReport.ticket_code}
                    </h2>
                    <button
                      type="button"
                      onClick={() => handleCopyTicket(activeReport.ticket_code)}
                      title="Salin Kode Tiket"
                      className="p-1.5 rounded-lg border transition relative hover:opacity-80"
                      style={{
                        background: '#FFFFFF',
                        borderColor: '#BFEFFF',
                        color: '#1C6F8E'
                      }}
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-[#1C6F8E]" />
                      ) : (
                        <Copy className="w-4 h-4 text-[#1C6F8E]" />
                      )}
                      {copied && (
                        <span
                          className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-bold shadow-xs whitespace-nowrap"
                          style={{ background: '#1C6F8E', color: '#FFFFFF' }}
                        >
                          Tersalin!
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border"
                  style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
                >
                  <Shield className="w-5 h-5 text-[#1C6F8E]" strokeWidth={1.8} />
                </div>
              </div>

              {/* Row 3: Date & Anonymity */}
              <div className="flex items-center gap-3 text-xs border-b pb-5 flex-wrap" style={{ borderColor: '#BFEFFF', color: '#2E84A5' }}>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#1C6F8E]" />
                  <span>{activeReport.tanggal || '14 Mei 2024 • 14:15 WIB'}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#1C6F8E]" />
                  <span className="font-semibold" style={{ color: '#1C6F8E' }}>
                    Sifat: {activeReport.is_anonymous ? 'Laporan Anonim' : 'Laporan Terbuka'}
                  </span>
                </div>
              </div>

              {/* Row 4: Progres Penanganan Stepper */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <h4 className="font-bold text-sm" style={{ color: '#1C6F8E' }}>
                    Progres Penanganan
                  </h4>
                  <span className="font-medium" style={{ color: '#2E84A5' }}>
                    Langkah {currentStepIdx + 1} dari 4
                  </span>
                </div>

                <div className="relative pt-2 pb-4">
                  {/* Track line */}
                  <div className="absolute left-6 right-6 top-7 -translate-y-1/2 h-0.5 z-0" style={{ background: '#BFEFFF' }} />
                  <div
                    className="absolute left-6 top-7 -translate-y-1/2 h-0.5 z-0 transition-all duration-500"
                    style={{
                      background: '#1C6F8E',
                      width:
                        currentStepIdx === 0
                          ? '0%'
                          : currentStepIdx === 1
                          ? '33%'
                          : currentStepIdx === 2
                          ? '66%'
                          : '100%'
                    }}
                  />

                  <div className="relative z-10 grid grid-cols-4 gap-2">
                    {/* Step 1: Menunggu */}
                    <div className="flex flex-col items-center text-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border"
                        style={{
                          background: '#BFEFFF',
                          color: '#1C6F8E',
                          borderColor: '#BFEFFF'
                        }}
                      >
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <span className="font-bold text-xs mt-2.5 block" style={{ color: '#1C6F8E' }}>Menunggu</span>
                      <span className="text-[10px] sm:text-[11px] mt-0.5 leading-tight" style={{ color: '#2E84A5' }}>
                        {activeReport.step_dates?.step1 || '14 Mei 2024 14:15 WIB'}
                      </span>
                    </div>

                    {/* Step 2: Diverifikasi */}
                    <div className="flex flex-col items-center text-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border"
                        style={{
                          background: currentStepIdx >= 1 ? '#BFEFFF' : '#FFFFFF',
                          color: '#1C6F8E',
                          borderColor: currentStepIdx === 1 ? '#1C6F8E' : '#BFEFFF'
                        }}
                      >
                        {currentStepIdx >= 1 ? (
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        ) : (
                          '2'
                        )}
                      </div>
                      <span className="font-bold text-xs mt-2.5 block" style={{ color: '#1C6F8E' }}>Diverifikasi</span>
                      <span className="text-[10px] sm:text-[11px] mt-0.5 leading-tight" style={{ color: '#2E84A5' }}>
                        {activeReport.step_dates?.step2 || '14 Mei 2024 15:30 WIB'}
                      </span>
                    </div>

                    {/* Step 3: Ditindaklanjuti */}
                    <div className="flex flex-col items-center text-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border"
                        style={{
                          background: currentStepIdx >= 2 ? '#BFEFFF' : '#FFFFFF',
                          color: '#1C6F8E',
                          borderColor: currentStepIdx === 2 ? '#1C6F8E' : '#BFEFFF',
                          boxShadow: currentStepIdx === 2 ? '0 0 0 4px rgba(191, 239, 255, 0.6)' : 'none'
                        }}
                      >
                        {currentStepIdx > 2 ? (
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        ) : (
                          '3'
                        )}
                      </div>
                      <span
                        className="font-bold text-xs mt-2.5 block"
                        style={{ color: currentStepIdx === 2 ? '#1C6F8E' : '#2E84A5' }}
                      >
                        Ditindaklanjuti
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-semibold mt-0.5 leading-tight" style={{ color: '#1C6F8E' }}>
                        {activeReport.step_dates?.step3 || '15 Mei, 09:00'}
                      </span>
                      {currentStepIdx === 2 && (
                        <span
                          className="mt-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border"
                          style={{ background: '#1C6F8E', color: '#FFFFFF', borderColor: '#1C6F8E' }}
                        >
                          Aktif
                        </span>
                      )}
                    </div>

                    {/* Step 4: Selesai */}
                    <div className="flex flex-col items-center text-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border"
                        style={{
                          background: currentStepIdx === 3 ? '#BFEFFF' : '#FFFFFF',
                          color: '#1C6F8E',
                          borderColor: currentStepIdx === 3 ? '#1C6F8E' : '#BFEFFF'
                        }}
                      >
                        {currentStepIdx === 3 ? (
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        ) : (
                          '4'
                        )}
                      </div>
                      <span className="font-bold text-xs mt-2.5 block" style={{ color: '#2E84A5' }}>Selesai</span>
                      <span className="text-[10px] sm:text-[11px] mt-0.5 leading-tight" style={{ color: '#2E84A5' }}>
                        {activeReport.step_dates?.step4 || 'Estimasi 1-2 hari kerja'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 5: Catatan Petugas Penanganan */}
              <div
                className="rounded-2xl p-5 space-y-3 border"
                style={{
                  background: '#FFFFFF',
                  borderColor: '#BFEFFF'
                }}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                      style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
                    >
                      <FileText className="w-4 h-4 text-[#1C6F8E]" />
                    </div>
                    <h5 className="font-bold text-xs sm:text-sm" style={{ color: '#1C6F8E' }}>
                      Catatan Petugas Penanganan
                    </h5>
                  </div>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border"
                    style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1C6F8E]" />
                    <span>Tim BK &amp; Satgas PPKSP</span>
                  </span>
                </div>

                <p className="text-xs leading-relaxed" style={{ color: '#2E84A5' }}>
                  {activeReport.catatan_konselor ||
                    'Laporan telah diverifikasi oleh Guru Bimbingan Konseling. Tim Satgas saat ini sedang melakukan pemanggilan tertutup dan koordinasi bersama wali kelas tanpa membuka identitas pelapor. Tetap pantau halaman ini untuk pembaruan berikutnya.'}
                </p>

                <div className="pt-1 flex items-center gap-1.5 text-[11px]" style={{ color: '#2E84A5' }}>
                  <Clock className="w-3.5 h-3.5 text-[#1C6F8E]" />
                  <span>
                    Diperbarui: {activeReport.catatan_updated_at || '15 Mei 2024, 10:45 WIB'} oleh{' '}
                    <strong className="font-semibold" style={{ color: '#1C6F8E' }}>
                      {activeReport.konselor_nama || 'Ibu Rahmawati, S.Pd (Konselor BK)'}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Row 6: Jaminan Kerahasiaan & Perlindungan Siswa Box */}
              <div
                className="rounded-2xl p-5 flex items-start gap-4 border"
                style={{
                  background: '#FFFFFF',
                  borderColor: '#BFEFFF'
                }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border"
                  style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
                >
                  <ShieldCheck className="w-5 h-5 text-[#1C6F8E]" />
                </div>
                <div className="space-y-1 text-xs">
                  <h5 className="font-bold text-xs sm:text-sm" style={{ color: '#1C6F8E' }}>
                    Jaminan Kerahasian &amp; Perlindungan Siswa
                  </h5>
                  <p className="leading-relaxed text-[11px] sm:text-xs" style={{ color: '#2E84A5' }}>
                    Laporanmu ditangani dengan kerahasiaan penuh. Identitas, bukti, dan percakapan dilindungi sesuai{' '}
                    <strong className="font-semibold" style={{ color: '#1C6F8E' }}>
                      Permendikbudristek No. 46 Tahun 2023
                    </strong>{' '}
                    tentang Pencegahan dan Penanganan Kekerasan di Lingkungan Satuan Pendidikan (PPKSP). Pihak terlapor tidak akan mengetahui identitas pelapor.
                  </p>
                </div>
              </div>

              {/* Row 7: Action Footer Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t" style={{ borderColor: '#BFEFFF' }}>
                <button
                  type="button"
                  onClick={() => setShowMessageModal(true)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-98 border hover:opacity-90 shadow-xs cursor-pointer"
                  style={{
                    background: '#BFEFFF',
                    color: '#1C6F8E',
                    borderColor: '#BFEFFF'
                  }}
                >
                  <MessageSquare className="w-4 h-4 text-[#1C6F8E]" />
                  <span>Kirim Pesan Tambahan / Bukti Baru</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowReceiptModal(true)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition hover:underline cursor-pointer"
                  style={{ color: '#1C6F8E' }}
                >
                  <Download className="w-4 h-4 text-[#1C6F8E]" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ background: 'rgba(20, 43, 74, 0.45)' }}>
          <div
            className="rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 border"
            style={{
              background: '#FFFFFF',
              borderColor: '#BFEFFF',
              boxShadow: '0 24px 70px rgba(191, 239, 255, 0.45)'
            }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: '#BFEFFF' }}>
              <div className="space-y-0.5">
                <h3 className="font-bold text-base" style={{ color: '#1C6F8E' }}>
                  Kirim Pesan Tambahan / Bukti Baru
                </h3>
                <span className="text-xs font-mono" style={{ color: '#2E84A5' }}>
                  Tiket: {activeReport.ticket_code}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowMessageModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1.5" style={{ color: '#1C6F8E' }}>
                  Isi Pesan / Klarifikasi Lanjutan
                </label>
                <textarea
                  rows={4}
                  required
                  value={additionalMessage}
                  onChange={(e) => setAdditionalMessage(e.target.value)}
                  placeholder="Tuliskan perkembangan terbaru, kronologi susulan, atau tanggapan untuk konselor BK..."
                  className="w-full p-3 text-xs rounded-xl focus:outline-none leading-relaxed border"
                  style={{
                    background: '#FFFFFF',
                    color: '#1C6F8E',
                    borderColor: '#BFEFFF'
                  }}
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1.5" style={{ color: '#1C6F8E' }}>
                  Lampirkan Berkas / Screenshot Bukti Tambahan (Opsional)
                </label>
                <label
                  className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition hover:opacity-90"
                  style={{
                    background: '#FFFFFF',
                    borderColor: '#BFEFFF'
                  }}
                >
                  <UploadCloud className="w-6 h-6 mb-1 text-[#1C6F8E]" />
                  <span className="text-xs font-semibold" style={{ color: '#1C6F8E' }}>
                    {attachedFile ? attachedFile.name : 'Pilih file tangkapan layar atau dokumen'}
                  </span>
                  <span className="text-[10px] mt-0.5" style={{ color: '#2E84A5' }}>PNG, JPG, PDF (Maks 10MB)</span>
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
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold transition border hover:opacity-90"
                  style={{
                    background: '#FFFFFF',
                    color: '#1C6F8E',
                    borderColor: '#BFEFFF'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingMessage}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition disabled:opacity-50 border hover:opacity-90 shadow-xs cursor-pointer"
                  style={{
                    background: '#BFEFFF',
                    color: '#1C6F8E',
                    borderColor: '#BFEFFF'
                  }}
                >
                  <Send className="w-3.5 h-3.5 text-[#1C6F8E]" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ background: 'rgba(20, 43, 74, 0.45)' }}>
          <div
            className="rounded-3xl max-w-md w-full p-6 space-y-4 border"
            style={{
              background: '#FFFFFF',
              borderColor: '#BFEFFF',
              boxShadow: '0 24px 70px rgba(191, 239, 255, 0.45)'
            }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: '#BFEFFF' }}>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#1C6F8E]" />
                <h3 className="font-bold text-sm" style={{ color: '#1C6F8E' }}>Bantuan: Lupa Kode Tiket</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed" style={{ color: '#2E84A5' }}>
              <p>
                Kode tiket (contoh: <code className="font-mono font-bold px-1 py-0.5 rounded border" style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}>SGP-2026-0091</code>) diberikan pada layar saat pengaduan Anda berhasil terkirim.
              </p>
              <div
                className="p-3 rounded-xl border space-y-1.5"
                style={{
                  background: '#FFFFFF',
                  borderColor: '#BFEFFF',
                  color: '#2E84A5'
                }}
              >
                <strong className="block" style={{ color: '#1C6F8E' }}>Cara Menemukan Kode Tiket:</strong>
                <ul className="list-disc list-inside space-y-1 text-[11px]">
                  <li>Periksa tangkapan layar atau catatan saat mengirim formulir pengaduan.</li>
                  <li>Jika Anda masuk menggunakan akun siswa, seluruh laporan Anda otomatis tampil di bagian <strong>Riwayat Laporan Sebelumnya</strong>.</li>
                  <li>Hubungi konselor BK sekolah di ruang BK dengan menunjukkan bukti kepemilikan akun.</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 rounded-xl font-bold text-xs border hover:opacity-90 cursor-pointer"
                style={{
                  background: '#BFEFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in" style={{ background: 'rgba(20, 43, 74, 0.45)' }}>
          <div
            className="rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 my-auto border"
            style={{
              background: '#FFFFFF',
              borderColor: '#BFEFFF',
              boxShadow: '0 24px 70px rgba(191, 239, 255, 0.45)'
            }}
          >
            {/* Modal Actions Header */}
            <div className="flex items-center justify-between border-b pb-3 print:hidden" style={{ borderColor: '#BFEFFF' }}>
              <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: '#1C6F8E' }}>
                <FileText className="w-4 h-4 text-[#1C6F8E]" />
                <span>Bukti Tanda Terima Registrasi Laporan</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition border hover:opacity-90 shadow-xs cursor-pointer"
                  style={{
                    background: '#BFEFFF',
                    color: '#1C6F8E',
                    borderColor: '#BFEFFF'
                  }}
                >
                  <Printer className="w-3.5 h-3.5 text-[#1C6F8E]" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowReceiptModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
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
                className="px-4 py-2 rounded-xl font-bold text-xs border transition hover:opacity-90"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackReport;
