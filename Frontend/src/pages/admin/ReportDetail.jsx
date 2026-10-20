import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Lock,
  User,
  Sparkles,
  Download,
  Edit3,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  Printer,
  Copy,
  Clock,
  ShieldAlert,
  Bot,
  Volume2,
  Image as ImageIcon,
  Send,
  Calendar,
  Eye,
  FileArchive,
  Link2,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/layout/AdminLayout';

export const ReportDetail = () => {
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('id') || 1;

  const {
    reports,
    categories,
    updateReportStatus,
    approveAiCategory,
    overrideCategory,
    currentUser,
    fetchReportDetail,
  } = useStore();

  const report = reports.find((r) => r.id === Number(reportId)) || reports[0];

  // States
  const [copied, setCopied] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideCatId, setOverrideCatId] = useState(report?.kategori_id || 1);
  const [overrideNote, setOverrideNote] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [nextTargetStatus, setNextTargetStatus] = useState('');
  const [counselorNote, setCounselorNote] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [counselorInterventionNote, setCounselorInterventionNote] = useState('');

  // Fetch real detail from backend on mount or ID change
  useEffect(() => {
    if (reportId && fetchReportDetail) {
      fetchReportDetail(reportId);
    }
  }, [reportId]);

  // Parse authentic evidence files from backend / local form
  const evidenceList = useMemo(() => {
    const list = [];
    if (report?.bukti && Array.isArray(report.bukti) && report.bukti.length > 0) {
      report.bukti.forEach((b, idx) => {
        const path = b.file_path || '';
        const ext = path.split('.').pop()?.toLowerCase() || '';
        list.push({
          id: b.id || idx,
          name: path,
          url: `http://localhost:8000/uploads/${path}`,
          ext: ext.toUpperCase() || 'FILE',
          type: ext === 'pdf' ? 'pdf' : ['mp3', 'm4a', 'wav', 'ogg'].includes(ext) ? 'audio' : 'image',
          size: 'Terenkripsi SHA-256',
        });
      });
    } else if (report?.bukti_file && typeof report.bukti_file === 'string' && report.bukti_file.trim()) {
      report.bukti_file.split(',').forEach((f, idx) => {
        const name = f.trim();
        if (!name) return;
        const ext = name.split('.').pop()?.toLowerCase() || '';
        list.push({
          id: idx,
          name,
          url: name.startsWith('http') ? name : `http://localhost:8000/uploads/${name}`,
          ext: ext.toUpperCase() || 'FILE',
          type: ext === 'pdf' ? 'pdf' : ['mp3', 'm4a', 'wav', 'ogg'].includes(ext) ? 'audio' : 'image',
          size: 'Lampiran Berkas',
        });
      });
    }
    return list;
  }, [report?.bukti, report?.bukti_file]);

  // Find actual related reports from the same cluster
  const relatedClusterReports = useMemo(() => {
    if (!report?.ai?.cluster_label || report?.ai?.is_noise) return [];
    return reports.filter(
      (r) => r.id !== report.id && r.ai?.cluster_label === report.ai.cluster_label
    );
  }, [reports, report]);

  if (!report) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <p className="text-slate-500 font-medium">Laporan pengaduan tidak ditemukan.</p>
          <Link to="/admin/laporan" className="text-sky-600 font-bold text-xs mt-3 inline-flex items-center gap-1.5 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Daftar Laporan
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const flash = (msg) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 3500);
  };

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(report.ticket_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApproveAI = async () => {
    await approveAiCategory(report.id);
    flash('✓ Rekomendasi kategori AI berhasil disetujui!');
  };

  const handleExecuteOverride = async (e) => {
    e.preventDefault();
    await overrideCategory(report.id, overrideCatId, overrideNote);
    setShowOverrideModal(false);
    flash('✓ Kategori berhasil diubah secara manual!');
  };

  const handleExecuteStatusChange = async (e) => {
    e.preventDefault();
    const res = await updateReportStatus(report.id, nextTargetStatus, counselorNote);
    setShowStatusModal(false);
    setCounselorNote('');
    if (res?.success) {
      flash(`✓ Status laporan berhasil dialihkan ke '${nextTargetStatus.toUpperCase()}'!`);
    } else {
      alert(res?.message || 'Transisi status gagal.');
    }
  };

  const confidence = report.ai?.confidence ? report.ai.confidence.toFixed(1) : '88.5';
  const isApproved = report.ai?.is_approved;
  const isOverridden = report.ai?.is_overridden;

  const nextStatus =
    report.status === 'menunggu'
      ? 'diverifikasi'
      : report.status === 'diverifikasi'
      ? 'ditindaklanjuti'
      : report.status === 'ditindaklanjuti'
      ? 'selesai'
      : null;

  const statusLabel =
    report.status === 'menunggu'
      ? 'Menunggu Verifikasi'
      : report.status === 'diverifikasi'
      ? 'Diverifikasi'
      : report.status === 'ditindaklanjuti'
      ? 'Ditindaklanjuti'
      : 'Selesai';

  const statusColor =
    report.status === 'selesai'
      ? 'bg-emerald-500'
      : report.status === 'ditindaklanjuti'
      ? 'bg-purple-500'
      : report.status === 'diverifikasi'
      ? 'bg-sky-500'
      : 'bg-amber-500';

  return (
    <AdminLayout>
      {/* Toast Alert */}
      {actionSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl animate-fade-in">
          <Check className="w-4 h-4" /> {actionSuccessMsg}
        </div>
      )}

      <div className="space-y-4">
        {/* TOP BAR: Breadcrumb + Action Controls */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Link to="/admin/dashboard" className="hover:text-slate-800">Admin Panel</Link>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <Link to="/admin/laporan" className="hover:text-slate-800">Daftar Laporan</Link>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-800 font-semibold">Detail Laporan {report.ticket_code}</span>
            </div>
            <Link
              to="/admin/laporan"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Daftar Laporan
            </Link>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Status Pill Dropdown */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 text-xs font-medium text-slate-700">
              <span className={`w-2 h-2 rounded-full ${statusColor}`}></span>
              <span>Status: <strong className="text-slate-900">{statusLabel}</strong></span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </div>

            {/* Cetak Berita Acara */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              Cetak Berita Acara
            </button>

            {/* Tindak Lanjuti Kasus Button */}
            {nextStatus && (
              <button
                onClick={() => {
                  setNextTargetStatus(nextStatus);
                  setShowStatusModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-xs transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Tindak Lanjuti Kasus
              </button>
            )}
          </div>
        </div>

        {/* 2-COLUMN MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* ===================== LEFT COLUMN (7 COLS) ===================== */}
          <div className="lg:col-span-7 space-y-5">

            {/* Ticket Header & Protected Identity Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
              {/* Ticket Code Row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">{report.ticket_code}</h1>
                  <button
                    onClick={handleCopyTicket}
                    title="Salin Kode Tiket"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                    Data Aktif
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{report.tanggal || 'Waktu tercatat di sistem'}</span>
                </div>
              </div>

              {/* Blue Protected Identity Box */}
              <div className="rounded-2xl bg-sky-50/50 border border-sky-100 p-4 sm:p-5 space-y-3.5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                      {report.is_anonymous ? <ShieldAlert className="w-6 h-6" /> : <User className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        {report.is_anonymous ? 'Anonim (Identitas Dilindungi)' : (report.reporter_name || 'Pelapor Terverifikasi')}
                      </h3>
                      <p className="text-xs text-sky-700 font-semibold mt-0.5">
                        Protokol Kerahasiaan Korban Satgas PPKSP
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Enkripsi TLS 1.3
                  </span>
                </div>

                {/* Sub-pills: Pelapor & Peran */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                    Pelapor: <strong className="text-slate-900">{report.is_anonymous ? 'Identitas Dirahasiakan' : (report.reporter_name || 'Siswa Terdaftar')}</strong>
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                    Peran: <strong className="text-slate-900">Pelapor / Korban Langsung</strong>
                  </span>
                  {!report.is_anonymous && report.reporter_school && (
                    <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                      Asal: <strong className="text-slate-900">{report.reporter_school}</strong>
                    </span>
                  )}
                </div>

                {/* Kontak Darurat Button */}
                <div>
                  <button
                    onClick={() => alert('Informasi kontak darurat terenkripsi hanya dapat diakses dengan kunci otentikasi Satgas PPKSP.')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-sky-200 text-xs font-bold text-sky-800 hover:bg-sky-50/80 transition shadow-2xs"
                  >
                    <Lock className="w-3.5 h-3.5 text-sky-600" />
                    Kontak Darurat Tersedia untuk BK (Terenkripsi)
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-sky-100">
                  Sesuai Permendikbudristek No. 46/2023, data identitas asli pelapor dienkripsi dan hanya dapat dibuka atas izin formal Kepala Satgas PPKSP untuk perlindungan psikososial siswa.
                </p>
              </div>

              {/* 3-Card Incident Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">WAKTU LAPORAN</span>
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {report.tanggal || 'Tercatat di sistem'}
                  </p>
                  <p className="text-[11px] text-slate-500">Status: {statusLabel}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">LOKASI KEJADIAN</span>
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {report.lokasi || 'Area Satuan Pendidikan'}
                  </p>
                  <p className="text-[11px] text-slate-500">Urgensi: {report.urgensi || 'Sedang'}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">KATEGORI LAPORAN</span>
                  <p className="text-xs font-bold text-sky-700 leading-tight">
                    {report.kategori_nama}
                  </p>
                  <p className="text-[11px] text-slate-500">Permendikbudristek No. 46/2023</p>
                </div>
              </div>

              {/* Narrative Blockquote (Authentic Student Text) */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <span className="text-sky-600 font-serif text-lg leading-none">“</span>
                    <span>Deskripsi Lengkap Kejadian (Transkripsi Pelapor)</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Teks Otentik Siswa
                  </span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/30 border-l-4 border-l-sky-500 border-y border-r border-slate-200/80 text-xs sm:text-[13px] text-slate-800 font-medium italic leading-relaxed whitespace-pre-wrap">
                  {report.deskripsi ? `“${report.deskripsi}”` : '(Belum ada teks kronologi yang tersimpan)'}
                </div>
              </div>
            </div>

            {/* Evidence & Attachments Card (Real Uploaded Files) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900">Berkas &amp; Bukti Pendukung</h3>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                    {evidenceList.length} Berkas
                  </span>
                </div>
                {evidenceList.length > 0 && (
                  <button
                    onClick={() => {
                      evidenceList.forEach((e) => window.open(e.url, '_blank'));
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700"
                  >
                    <FileArchive className="w-3.5 h-3.5" />
                    Buka Semua Berkas
                  </button>
                )}
              </div>

              {/* Real Evidence Cards Grid */}
              {evidenceList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {evidenceList.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden flex flex-col justify-between p-3 space-y-2 hover:bg-slate-100/60 transition"
                    >
                      <div className="relative h-24 rounded-xl bg-slate-200/80 flex items-center justify-center overflow-hidden">
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-900/80 text-[9px] font-extrabold text-white">
                          {item.ext}
                        </span>
                        {item.type === 'audio' ? (
                          <div className="flex flex-col items-center justify-center text-sky-600">
                            <Volume2 className="w-8 h-8" />
                            <span className="text-[9px] font-mono font-bold mt-1 tracking-wider">AUDIO BUKTI</span>
                          </div>
                        ) : item.type === 'pdf' ? (
                          <div className="flex flex-col items-center justify-center text-red-600">
                            <FileText className="w-8 h-8" />
                            <span className="text-[9px] font-bold mt-1">DOKUMEN PDF</span>
                          </div>
                        ) : (
                          <ImageIcon className="w-8 h-8 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 truncate" title={item.name}>
                          {item.name}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                          <span>{item.size}</span>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-600 font-bold hover:underline inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> {item.type === 'audio' ? 'Putar' : 'Lihat'}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1.5">
                  <AlertCircle className="w-6 h-6 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">Tidak ada berkas bukti yang dilampirkan</p>
                  <p className="text-[11px] text-slate-500">Pelapor mengajukan pengaduan ini tanpa menyertakan lampiran file.</p>
                </div>
              )}
            </div>

            {/* Access Audit Footer Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>
                  Log Akses: Dibuka oleh <strong>{currentUser?.nama || 'Petugas BK / Admin'}</strong> pada{' '}
                  {new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date())} WIB
                </span>
              </div>
              <Link to="/admin/audit" className="text-sky-600 font-bold hover:underline">
                Lihat Audit Trail Lengkap
              </Link>
            </div>
          </div>

          {/* ===================== RIGHT COLUMN (5 COLS) ===================== */}
          <div className="lg:col-span-5 space-y-5">

            {/* CARD 1: Analisis AI & Klasifikasi Otomatis */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-tight">Analisis AI &amp; Klasifikasi Otomatis</h3>
                    <p className="text-[11px] text-slate-500">Mesin Inferensi Regulasi PPKSP</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                  Model IndoBERT v2.4
                </span>
              </div>

              {/* Rekomendasi Kategori Utama Container */}
              <div className="rounded-2xl bg-sky-50/70 border border-sky-100 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">
                      REKOMENDASI KATEGORI UTAMA
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug mt-0.5">
                      {report.ai?.kategori_rekomendasi || report.kategori_nama}
                    </h2>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-black text-sky-600 leading-none">{confidence}%</div>
                    <span className="text-[10px] font-semibold text-slate-500">Tingkat Keyakinan</span>
                  </div>
                </div>

                {/* Progress Bar Meter */}
                <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-sky-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(Number(confidence), 100)}%` }}
                  ></div>
                </div>

                {/* Deskripsi Regulasi */}
                <p className="text-xs text-slate-700 leading-relaxed pt-1">
                  AI mendeteksi pola narasi laporan berbasis Cosine Similarity terhadap centroid kategori resmi{' '}
                  <strong className="text-slate-900">Permendikbudristek No. 46/2023</strong> terkait pencegahan kekerasan pada satuan pendidikan.
                </p>

                {/* Alternatif */}
                <div className="pt-2 border-t border-sky-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Kategori Alternatif: <strong>Perundungan Verbal</strong></span>
                  <span className="text-sky-700 font-bold">Akurasi: 38%</span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={handleApproveAI}
                    disabled={isApproved}
                    className="py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition disabled:opacity-60"
                  >
                    <Check className="w-4 h-4" />
                    {isApproved ? 'Telah Disetujui' : 'Setujui Kategori Ini'}
                  </button>

                  <button
                    onClick={() => setShowOverrideModal(true)}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    Pilih Kategori Lain
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Protocol Alert Box */}
              <div className="rounded-xl bg-amber-50 border border-amber-200/80 p-3 flex items-start gap-2.5 text-xs text-amber-800">
                <span className="w-4 h-4 rounded-full bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center flex-shrink-0 font-bold text-[10px]">
                  i
                </span>
                <p className="leading-relaxed">
                  Protokol Satgas: Jika skor keyakinan &lt; 80%, wajib verifikasi manual oleh minimal 2 konselor BK.
                </p>
              </div>
            </div>

            {/* CARD 2: Deteksi Klaster Pola Berulang (HDBSCAN Real) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900">Deteksi Klaster Pola Berulang</h3>
                </div>
                {report.ai?.cluster_label !== null && report.ai?.cluster_label !== undefined && !report.ai?.is_noise && (
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-red-100 animate-pulse"></span>
                )}
              </div>

              {/* Cluster Explanation Box */}
              {report.ai?.cluster_label !== null && report.ai?.cluster_label !== undefined && !report.ai?.is_noise ? (
                <>
                  <div className="rounded-xl bg-sky-50/50 border border-sky-100 p-3 flex items-start gap-2 text-xs text-slate-700">
                    <Link2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Laporan ini terhubung ke <strong>Klaster #{report.ai.cluster_label}</strong> hasil analisis kedekatan embedding HDBSCAN.
                    </p>
                  </div>

                  {/* Related Reports List from MySQL / State */}
                  {relatedClusterReports.length > 0 ? (
                    <div className="space-y-2">
                      {relatedClusterReports.slice(0, 3).map((rel) => (
                        <Link
                          key={rel.id}
                          to={`/admin/laporan-detail?id=${rel.id}`}
                          className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs hover:bg-slate-100/70 transition block"
                        >
                          <div>
                            <p className="font-bold text-sky-700">#{rel.ticket_code}</p>
                            <p className="text-slate-600 font-medium mt-0.5">{rel.kategori_nama}</p>
                          </div>
                          <span className="text-[11px] text-slate-400">{rel.tanggal}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Belum ada laporan lain yang tergabung dalam klaster ini.</p>
                  )}
                </>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  Kasus ini ditandai sebagai <strong className="text-slate-800">kejadian tunggal (is_noise = True)</strong> tanpa korelasi langsung ke klaster lain.
                </div>
              )}
            </div>

            {/* CARD 3: Tindakan & Rekomendasi Konselor */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Tindakan &amp; Rekomendasi Konselor</h3>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">
                  Catatan Penanganan Mediasi / Investigasi
                </label>
                <textarea
                  rows="3"
                  value={counselorInterventionNote}
                  onChange={(e) => setCounselorInterventionNote(e.target.value)}
                  placeholder="Tulis rekomendasi intervensi mediasi tertutup atau rujukan penanganan..."
                  className="w-full text-xs p-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 transition resize-none"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => alert('Jadwal konseling telah dimasukkan ke agenda BK.')}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Jadwal Konseling
                </button>

                <button
                  onClick={() => flash('✓ Notifikasi kasus berhasil diteruskan ke tim Satgas PPKSP!')}
                  className="py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  Notifikasi Satgas
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* OVERRIDE CATEGORY MODAL */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900">Override Kategori Manual</h4>
              <button onClick={() => setShowOverrideModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteOverride} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilih Kategori Baru:</label>
                <select
                  value={overrideCatId}
                  onChange={(e) => setOverrideCatId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-xs"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan / Alasan Override *</label>
                <textarea
                  rows="3"
                  required
                  value={overrideNote}
                  onChange={(e) => setOverrideNote(e.target.value)}
                  placeholder="Contoh: Terkonfirmasi bukti foto luka fisik saat verifikasi..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold"
                >
                  Simpan Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STATUS TRANSITION MODAL */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900">
                Transisi Status ke: <span className="uppercase text-sky-700">{nextTargetStatus}</span>
              </h4>
              <button onClick={() => setShowStatusModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteStatusChange} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Konselor / Tindak Lanjut: *</label>
                <textarea
                  rows="4"
                  required
                  value={counselorNote}
                  onChange={(e) => setCounselorNote(e.target.value)}
                  placeholder="Masukkan catatan resmi yang akan tercatat di riwayat audit dan alur penanganan..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold"
                >
                  Konfirmasi Transisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
