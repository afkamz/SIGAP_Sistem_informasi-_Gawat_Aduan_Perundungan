import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Network,
  Lock,
  User,
  ShieldCheck,
  FileText,
  Clock,
  MessageSquare,
  Sparkles,
  Download,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/layout/AdminLayout';

export const ReportDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reportId = searchParams.get('id') || 1;

  const { reports, categories, updateReportStatus, approveAiCategory, overrideCategory } = useStore();

  const report = reports.find((r) => r.id === Number(reportId)) || reports[0];

  // State Modal Override
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideCatId, setOverrideCatId] = useState(report?.kategori_id || 1);
  const [overrideNote, setOverrideNote] = useState('');

  // State Modal Transition
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [nextTargetStatus, setNextTargetStatus] = useState('');
  const [counselorNote, setCounselorNote] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  if (!report) {
    return (
      <AdminLayout title="Detail Laporan">
        <div className="text-center py-12">
          <p className="text-slate-500">Laporan tidak ditemukan.</p>
          <Link to="/admin/laporan" className="text-sky-700 font-bold text-xs mt-2 inline-block">
            Kembali ke Daftar Laporan
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const handleApproveAI = async () => {
    await approveAiCategory(report.id);
    setActionSuccessMsg('Rekomendasi kategori AI berhasil disetujui!');
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  const handleExecuteOverride = async (e) => {
    e.preventDefault();
    await overrideCategory(report.id, overrideCatId, overrideNote);
    setShowOverrideModal(false);
    setActionSuccessMsg('Kategori berhasil diubah secara manual!');
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  const handleExecuteStatusChange = async (e) => {
    e.preventDefault();
    const res = await updateReportStatus(report.id, nextTargetStatus, counselorNote);
    setShowStatusModal(false);
    setCounselorNote('');
    if (res.success) {
      setActionSuccessMsg(`Status laporan berhasil diubah ke '${nextTargetStatus}'!`);
      setTimeout(() => setActionSuccessMsg(''), 3000);
    } else {
      alert(res.message);
    }
  };

  const openStatusModal = (status) => {
    setNextTargetStatus(status);
    setShowStatusModal(true);
  };

  return (
    <AdminLayout
      title={`Detail Pengaduan: ${report.ticket_code}`}
      subtitle="Analisis NLP IndoBERT, keterkaitan klaster kejadian, dan kontrol tindak lanjut"
    >
      <div className="space-y-6">
        {/* Back Button & Action Notification */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin/laporan"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Daftar
          </Link>

          {actionSuccessMsg && (
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-1.5 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{actionSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* 2-Kolom Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* KOLOM KIRI: Informasi Kasus, Kronologi, Bukti, dan Log (7 Kolom) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card Utama Pengaduan */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-sky-900 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200">
                      {report.ticket_code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">• {report.tanggal}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">{report.judul}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {report.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Rincian Pelapor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block font-medium">Identitas Pelapor:</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                    {report.is_anonymous ? <Lock className="w-3.5 h-3.5 text-slate-700" /> : <User className="w-3.5 h-3.5 text-sky-700" />}
                    {report.reporter_label}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Lokasi Kejadian:</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{report.lokasi || 'Area Sekolah'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Kategori Saat Ini:</span>
                  <span className="font-bold text-sky-900 mt-0.5 block">{report.kategori_nama}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Tingkat Urgensi:</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{report.urgensi || 'Sedang'}</span>
                </div>
              </div>

              {/* Kronologi Teks Narasi */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-700 block">Kronologi / Narasi Laporan:</span>
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
                  {report.deskripsi}
                </div>
              </div>

              {/* Berkas Bukti */}
              {report.bukti_file && (
                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-sky-700" />
                    <div>
                      <span className="font-bold text-slate-900 block">{report.bukti_file}</span>
                      <span className="text-[10px] text-slate-400">Lampiran bukti terenkripsi SHA-256</span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert('Mengunduh berkas bukti lampiran terenkripsi...')}
                    className="px-3 py-1.5 rounded-xl bg-white border border-sky-200 text-sky-800 hover:bg-sky-50 font-bold text-xs flex items-center gap-1 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh
                  </button>
                </div>
              )}
            </div>

            {/* Riwayat Timeline Kasus */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Log Kronologi Tindak Lanjut Kasus
              </h3>
              <div className="divide-y divide-slate-100">
                {report.history?.map((h, i) => (
                  <div key={i} className="py-3 flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 flex-shrink-0"></div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{h.pelaksana}</span>
                        <span className="text-[11px] text-slate-400">{h.waktu}</span>
                      </div>
                      <span className="inline-block text-[10px] font-bold text-sky-700 uppercase">{h.status}</span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{h.catatan}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: AI Decision Support & State Machine Controller (5 Kolom) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Panel AI Decision Support (IndoBERT + Cosine Similarity) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Analisis AI Pipeline</h3>
                    <span className="text-[10px] text-slate-400">Model IndoBERT + Cosine Similarity</span>
                  </div>
                </div>

                {report.ai?.is_approved ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Disetujui
                  </span>
                ) : report.ai?.is_overridden ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Override Manual
                  </span>
                ) : null}
              </div>

              {report.ai && (
                <div className="space-y-4 text-xs">
                  {/* Rekomendasi Utama */}
                  <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Rekomendasi Kategori:</span>
                      <span className="font-extrabold text-purple-900 text-sm">
                        {report.ai.kategori_rekomendasi}
                      </span>
                    </div>

                    {/* Bar Meter Confidence */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Confidence Score:</span>
                        <span className="font-black text-purple-900">{report.ai.confidence}%</span>
                      </div>
                      <div className="w-full bg-purple-200/50 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${report.ai.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Saran Sekunder */}
                  {report.ai.secondary_suggestion && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Alternatif Kemungkinan:</span>
                      <span className="font-bold text-slate-700">
                        {report.ai.secondary_suggestion} ({report.ai.secondary_confidence}%)
                      </span>
                    </div>
                  )}

                  {/* Tombol Aksi AI */}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleApproveAI}
                      className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Check className="w-3.5 h-3.5" /> Setujui Rekomendasi
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOverrideModal(true)}
                      className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Override
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Deteksi Klaster Kejadian (HDBSCAN) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Network className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Deteksi Klaster Pola</h3>
                  <span className="text-[10px] text-slate-400">Algoritma HDBSCAN Density Clustering</span>
                </div>
              </div>

              {report.ai?.cluster_label ? (
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-900">Klaster: {report.ai.cluster_label}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-600 text-white">
                      Terhubung
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {report.ai.cluster_name || 'Terdeteksi kemiripan lokasi dan pelaku dengan 3 laporan lainnya dalam kurun 14 hari.'}
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                  <span>Kasus ini ditandai sebagai <strong className="text-slate-700">kejadian tunggal (is_noise = True)</strong> tanpa korelasi langsung ke klaster lain.</span>
                </div>
              )}
            </div>

            {/* 3. State Machine Controller */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Kontrol Transisi Status (State Machine)
              </h3>

              <div className="space-y-2">
                {report.status === 'menunggu' && (
                  <button
                    type="button"
                    onClick={() => openStatusModal('diverifikasi')}
                    className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <span>Alihkan ke: DIVERIFIKASI</span>
                  </button>
                )}

                {report.status === 'diverifikasi' && (
                  <button
                    type="button"
                    onClick={() => openStatusModal('ditindaklanjuti')}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <span>Alihkan ke: DITINDAKLANJUTI</span>
                  </button>
                )}

                {report.status === 'ditindaklanjuti' && (
                  <button
                    type="button"
                    onClick={() => openStatusModal('selesai')}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <span>Selesaikan Laporan (SELESAI)</span>
                  </button>
                )}

                {report.status === 'selesai' && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold text-center">
                    ✓ Laporan ini telah tuntas ditangani secara resmi.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Override Kategori */}
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
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nama}
                    </option>
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
                  className="w-full p-2.5 rounded-xl border border-slate-300"
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
                  className="px-5 py-2 rounded-xl bg-sky-800 text-white font-bold"
                >
                  Simpan Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ubah Status */}
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
                <label className="font-bold text-slate-700 block mb-1">Catatan Konselor / Tindak Lanjut:</label>
                <textarea
                  rows="4"
                  required
                  value={counselorNote}
                  onChange={(e) => setCounselorNote(e.target.value)}
                  placeholder="Masukkan catatan resmi yang akan dapat dilihat siswa atau tercatat di riwayat audit..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
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
                  className="px-5 py-2 rounded-xl bg-sky-800 text-white font-bold"
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

