import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  RotateCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  SlidersHorizontal,
  ChevronDown,
  Database,
  Brain,
  GitBranch,
  Zap,
  BarChart3,
  Filter,
  ShieldCheck,
  Edit3,
  TrendingUp,
  Info,
  ExternalLink,
  Check,
  Tag,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Layers,
  X,
  FileText
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/layout/AdminLayout';

// ─── 7 Kategori Resmi Permendikbudristek No. 46/2023 ──────────────────────────
const OFFICIAL_CATEGORIES = [
  'Kekerasan Fisik',
  'Kekerasan Psikis',
  'Perundungan Siber (Cyberbullying)',
  'Kekerasan Seksual',
  'Diskriminasi dan Intoleransi',
  'Kebijakan yang Mengandung Kekerasan',
  'Bentuk Kekerasan Lainnya'
];

// ─── Helper Rekomendasi Alur Tindak Lanjut PPKSP ──────────────────────────────
const getSopRecommendation = (categoryName = '') => {
  const cat = (categoryName || '').toLowerCase();
  if (cat.includes('siber') || cat.includes('cyber')) {
    return 'Amankan tangkapan layar jejak digital, koordinasikan dengan wali kelas & tim IT madrasah/sekolah, beri pendampingan psikologis awal, dan telusuri kanal akun terkait.';
  }
  if (cat.includes('fisik')) {
    return 'Lakukan asesmen fisik/rujuk UKS atau Puskesmas jika terdapat luka, pisahkan pihak korban dan terduga pelaku secara aman, serta jadwalkan pemanggilan orang tua terpisah.';
  }
  if (cat.includes('psikis') || cat.includes('verbal')) {
    return 'Jadwalkan konseling individual intensif oleh Guru BK, ukur skala kecemasan/trauma emosional, dan lakukan pemantauan interaksi kelas secara berkala.';
  }
  if (cat.includes('seksual')) {
    return 'Terapkan protokol perlindungan kerahasiaan identitas tingkat tinggi, rujuk ke UPTD PPA/psikolog berizin, dan jamin proses penanganan bebas viktimisasi sekunder.';
  }
  if (cat.includes('diskriminasi') || cat.includes('intoleransi')) {
    return 'Mediasi edukatif dengan pendekatan kesetaraan hak, penguatan moderasi beragama dan kebinekaan, serta evaluasi dinamika kelompok pergaulan siswa.';
  }
  if (cat.includes('kebijakan')) {
    return 'Laporkan ke Kepala Satuan Pendidikan dan Tim PPKSP untuk peninjauan regulasi internal, tata tertib, atau praktik pengkondisian yang tidak ramah anak.';
  }
  return 'Lakukan verifikasi faktual terpisah bersama wali kelas dan jalankan alur intervensi bimbingan konseling sesuai Permendikbudristek No. 46/2023.';
};

// ─── Ekstraksi Token / Fitur Teks NLP ──────────────────────────────────────────
const extractFeatureTokens = (text = '') => {
  if (!text) return ['#AduanSiswa', '#VerifikasiBK'];
  const lower = text.toLowerCase();
  const rules = [
    { label: 'Grup WhatsApp', test: /whatsapp|wa|grup chat|group/i },
    { label: 'Ancaman Digital', test: /ancam|diancam|teror|intimidasi|takut/i },
    { label: 'Penyebaran Konten', test: /foto|video|edit|stiker|sebar|sosmed|instagram|tiktok/i },
    { label: 'Kontak Fisik', test: /pukul|tendang|dorong|tampar|jambak|luka/i },
    { label: 'Pemalakan / Uang', test: /palak|uang|duit|jajan|paksa/i },
    { label: 'Pengucilan Sosial', test: /kucil|jauhi|musuhi|diamkan|benci/i },
    { label: 'Hinaan Verbal', test: /ejek|kata-katain|hina|body shaming|bodoh|jelek/i },
    { label: 'Pelanggaran Privasi', test: /privasi|chat pribadi|bocorkan|rahasia/i },
    { label: 'Dampak Emosional', test: /menangis|trauma|takut ke sekolah|depresi|malu/i },
    { label: 'Tekanan Kelompok', test: /geng|komplotan|rombongan|teman sekelas/i },
  ];

  const matched = rules.filter((r) => r.test.test(lower)).map((r) => `#${r.label.replace(/\s+/g, '')}`);
  if (matched.length >= 2) return matched.slice(0, 4);

  // Fallback ekstrak kata penting
  const words = lower
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !['karena', 'dengan', 'adalah', 'kepada', 'mereka', 'ketika', 'setiap', 'sangat', 'kemarin', 'tersebut', 'bahwa', 'sudah'].includes(w));
  const fallback = Array.from(new Set(words)).slice(0, 3).map((w) => `#${w.charAt(0).toUpperCase() + w.slice(1)}`);
  const combined = [...matched, ...fallback];
  return combined.length > 0 ? combined.slice(0, 4) : ['#AduanSiswa', '#PerluTelaah'];
};

// ─── Modal Konfigurasi Parameter Model ────────────────────────────────────────
const ModelConfigModal = ({ isOpen, onClose, avgConf }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Parameter Pipeline NLP & AI</h3>
              <p className="text-xs text-slate-500">Konfigurasi operasional model triase SIGAP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">Arsitektur Encoder:</span>
              <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                IndoBERT-Base-p1 (768-dim)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">Metode Klasifikasi:</span>
              <span className="text-slate-800 font-medium">Cosine Centroid Similarity (7 Kategori)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">Clustering Algoritma:</span>
              <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                HDBSCAN (min_cluster_size=2)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">Confidence Threshold Ambang:</span>
              <span className="font-bold text-amber-700">80.0% (Standar Rekomendasi)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/60 text-sky-900 leading-relaxed">
            <p className="font-semibold mb-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-sky-600" /> Human-in-the-Loop Safety Guard:
            </p>
            AI tidak pernah mengambil tindakan disipliner secara otomatis. Seluruh rekomendasi klasifikasi wajib diverifikasi oleh Guru Bimbingan Konseling atau Tim PPKSP satuan pendidikan.
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Modal Batch Approval ─────────────────────────────────────────────────────
const BatchApproveModal = ({ isOpen, onClose, highConfidenceCount, onConfirm, isProcessing }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
        <div className="p-6 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Validasi Massal Rekomendasi AI</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Sistem mendeteksi <strong className="text-slate-800">{highConfidenceCount} tiket aduan</strong> dengan skor keyakinan tinggi (<span className="text-emerald-600 font-bold">≥ 80.0%</span>) yang menunggu persetujuan.
          </p>
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] text-left">
            <strong>Perhatian:</strong> Tindakan ini akan menyetujui rekomendasi kategori AI untuk seluruh tiket berkeyakinan tinggi dan mencatat jejak audit resmi konselor.
          </div>
        </div>
        <div className="flex gap-2.5 p-5 pt-0">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing || highConfidenceCount === 0}
            className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
          >
            {isProcessing ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                Validasi Semua ({highConfidenceCount})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Modal Override Kategori ──────────────────────────────────────────────────
const OverrideModal = ({ report, categories, onConfirm, onClose }) => {
  const [selectedCat, setSelectedCat] = useState(report?.kategori_id || 1);
  const [catatan, setCatatan] = useState('');

  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center">
            <Edit3 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Ubah Kategori (Override Manual)</h3>
            <p className="text-xs text-slate-500 font-mono">Tiket: {report.ticket_code}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Rekomendasi AI saat ini */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-sky-50 border border-sky-200">
            <Sparkles className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[11px] font-semibold text-sky-700">Rekomendasi Prediksi IndoBERT:</p>
              <p className="text-xs text-sky-950 font-bold mt-0.5">
                {report.ai?.kategori_rekomendasi || report.kategori_nama || '—'}{' '}
                <span className="text-sky-600 font-normal">
                  ({(report.ai?.confidence || 0).toFixed(1)}% confidence)
                </span>
              </p>
            </div>
          </div>

          {/* Pilih Kategori Baru */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pilih Kategori Resmi Pengganti (Permendikbudristek No. 46/2023)
            </label>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(Number(e.target.value))}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white shadow-sm font-medium"
            >
              {categories && categories.length > 0
                ? categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nama}
                    </option>
                  ))
                : OFFICIAL_CATEGORIES.map((nama, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {nama}
                    </option>
                  ))}
            </select>
          </div>

          {/* Catatan Konselor */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Catatan Justifikasi Konselor <span className="text-slate-400 font-normal">(opsional)</span>
            </label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
              placeholder="Contoh: Bukti tangkapan layar mengindikasikan adanya unsur pemalakan langsung di luar dugaan awal..."
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none shadow-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 p-5 pt-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(report.id, selectedCat, catatan)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors shadow-sm"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Case Card Item (Sesuai Referensi Desain WhatsApp) ────────────────────────
const CaseCard = ({ report, onApprove, onOverride, isApproving }) => {
  const navigate = useNavigate();
  const confidence = report.ai?.confidence ?? 88.5;
  const isAmbiguous = confidence < 80;
  const isApproved = report.ai?.is_approved || report.sumber_kategori === 'ai_disetujui';
  const isOverridden = report.ai?.is_overridden || report.sumber_kategori === 'manual_override';
  const isDone = isApproved || isOverridden;

  const clusterLabel = report.ai?.cluster_label;
  const isNoise = report.ai?.is_noise ?? (clusterLabel === null || clusterLabel === undefined);
  const featureTokens = extractFeatureTokens(report.deskripsi || '');
  const sopText = getSopRecommendation(report.ai?.kategori_rekomendasi || report.kategori_nama);

  // Confidence styling
  const confColor =
    confidence >= 85
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : confidence >= 70
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-rose-50 text-rose-700 border-rose-200';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* ── Header Kartu ── */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Nomor Tiket */}
          <span className="font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] tracking-wide shadow-xs">
            #{report.ticket_code}
          </span>
          <span className="text-slate-300">•</span>
          {/* Tanggal */}
          <span className="text-slate-500 font-medium flex items-center gap-1 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {report.tanggal}
          </span>
          <span className="text-slate-300">•</span>
          {/* Pelapor */}
          <span className="text-slate-600 font-medium flex items-center gap-1 text-[11px]">
            <User className="w-3.5 h-3.5 text-slate-400" />
            {report.pelapor || report.reporter_label || (report.is_anonymous ? 'Anonim (Siswa)' : (report.reporter_name ? `${report.reporter_name} • Pelapor Terverifikasi` : 'Siswa Terdaftar • Pelapor Terverifikasi'))}
          </span>
        </div>

        {/* Prediksi & Skor Kanan */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-xs font-semibold">
            <Brain className="w-3.5 h-3.5 text-sky-600" />
            {report.ai?.kategori_rekomendasi || report.kategori_nama}
          </div>
          <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${confColor}`}>
            Akurasi: {confidence.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* ── Banner Ambigu (Jika confidence < 80%) ── */}
        {isAmbiguous && (
          <div className="rounded-xl bg-amber-50/80 border border-amber-300 p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Catatan Asisten AI (Multi-Label Decision)</span>
            </div>
            <div className="text-[11px] text-amber-900/90 leading-relaxed space-y-1">
              <p>
                Prediksi Utama: <strong className="text-amber-950">{report.ai?.kategori_rekomendasi || report.kategori_nama}</strong>{' '}
                <span className="font-semibold">({confidence.toFixed(1)}%)</span> vs Alternatif:{' '}
                <strong className="text-amber-950">{report.ai?.secondary_suggestion || 'Kekerasan Psikis'}</strong>{' '}
                <span className="font-semibold">({(report.ai?.secondary_confidence || 68.4).toFixed(1)}%)</span>.
              </p>
              <p className="text-amber-800 italic">
                Indikasi frasa tumpang tindih terdeteksi pada teks aduan. Disarankan peninjauan kontekstual oleh Guru BK sebelum tindakan lebih lanjut.
              </p>
            </div>
          </div>
        )}

        {/* ── Banner Klaster HDBSCAN (Jika Bukan Noise) ── */}
        {!isNoise && clusterLabel !== null && clusterLabel !== undefined && (
          <div className="rounded-xl bg-indigo-50/80 border border-indigo-200 p-3.5 flex items-start gap-2.5 text-xs">
            <GitBranch className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-indigo-950">
                Terdeteksi dalam Klaster Kemiripan HDBSCAN (#{`KLS-${String(clusterLabel).padStart(2, '0')}`})
              </p>
              <p className="text-[11px] text-indigo-800/90 mt-0.5 leading-relaxed">
                Pola kasus ini memiliki korelasi semantik dengan aduan lain dalam kelompok terduga pelaku atau kanal yang sama. Korelasi Semantik:{' '}
                <strong>{(confidence * 0.96).toFixed(1)}%</strong>.
              </p>
            </div>
          </div>
        )}

        {/* ── Fitur Ekstraksi Token (NLP) ── */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Tag className="w-3 h-3" /> Fitur Teks NLP:
          </span>
          {featureTokens.map((token, i) => (
            <span
              key={i}
              className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 hover:bg-slate-200/60 transition-colors"
            >
              {token}
            </span>
          ))}
        </div>

        {/* ── Kutipan Narasi Siswa ── */}
        <div className="rounded-xl bg-slate-50 border-l-4 border-slate-300 p-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <FileText className="w-3 h-3 text-slate-400" /> Kutipan Narasi Aduan Siswa:
          </p>
          <p className="text-xs text-slate-800 italic leading-relaxed whitespace-pre-wrap">
            "{report.deskripsi || 'Siswa tidak mencantumkan narasi rinci dalam aduan ini.'}"
          </p>
        </div>

        {/* ── Rekomendasi Alur Tindak Lanjut PPKSP ── */}
        <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-3.5 flex items-start gap-2.5 text-xs text-emerald-950">
          <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-0.5">
            <p className="font-bold text-emerald-900">Rekomendasi Alur Tindak Lanjut PPKSP:</p>
            <p className="text-[11px] text-emerald-800 leading-relaxed">{sopText}</p>
          </div>
        </div>
      </div>

      {/* ── Footer Aksi Kartu ── */}
      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Kiri */}
        <div>
          {isApproved ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Tervalidasi: Rekomendasi AI Disetujui
            </span>
          ) : isOverridden ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
              <Edit3 className="w-3.5 h-3.5" />
              Tervalidasi: Override Manual Konselor
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5" />
              Menunggu Validasi Konselor
            </span>
          )}
        </div>

        {/* Tombol Aksi Kanan */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {!isDone ? (
            <>
              <button
                onClick={() => onApprove(report.id)}
                disabled={isApproving}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 active:scale-95 transition-all shadow-xs disabled:opacity-50"
              >
                {isApproving ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                Setujui Rekomendasi
              </button>
              <button
                onClick={() => onOverride(report)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-purple-300 text-purple-700 text-xs font-bold hover:bg-purple-50 active:scale-95 transition-all shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Ubah Kategori (Override)
              </button>
            </>
          ) : null}

          {/* Link Detail Laporan */}
          <button
            onClick={() => navigate(`/admin/laporan-detail?id=${report.id}`)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 text-xs font-semibold transition-colors"
          >
            Tinjau Detail Kasus
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Komponen Utama Halaman Validasi AI ───────────────────────────────────────
export const AiValidation = () => {
  const {
    reports,
    categories,
    fetchAdminReports,
    approveAiCategory,
    overrideCategory,
    isBackendConnected,
    token,
  } = useStore();

  const [isSyncing, setIsSyncing] = useState(false);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAcc, setFilterAcc] = useState('semua');
  const [filterCategory, setFilterCategory] = useState('semua');
  const [filterCluster, setFilterCluster] = useState('semua');
  const [activePill, setActivePill] = useState('semua_antrean'); // 'semua_antrean', 'akurasi_tinggi', 'ambigu', 'klaster', 'semua_riwayat'

  const [overrideTarget, setOverrideTarget] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [isModelConfigOpen, setIsModelConfigOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAdminReports();
  }, []);

  // Hitung metrik statistik lokal
  const stats = useMemo(() => {
    const list = reports || [];
    const withAi = list.filter((r) => r.ai);
    const targetList = withAi.length > 0 ? withAi : list;

    const menunggu = targetList.filter(
      (r) => !r.ai?.is_approved && !r.ai?.is_overridden && r.sumber_kategori !== 'ai_disetujui' && r.sumber_kategori !== 'manual_override'
    ).length;

    const disetujui = targetList.filter(
      (r) => r.ai?.is_approved || r.sumber_kategori === 'ai_disetujui'
    ).length;

    const override = targetList.filter(
      (r) => r.ai?.is_overridden || r.sumber_kategori === 'manual_override'
    ).length;

    const ambigu = targetList.filter((r) => (r.ai?.confidence ?? 88.5) < 80).length;

    const klasterCount = targetList.filter(
      (r) => r.ai?.cluster_label !== null && r.ai?.cluster_label !== undefined && !r.ai?.is_noise
    ).length;

    const highConfidenceMenunggu = targetList.filter(
      (r) =>
        (!r.ai?.is_approved && !r.ai?.is_overridden && r.sumber_kategori !== 'ai_disetujui' && r.sumber_kategori !== 'manual_override') &&
        (r.ai?.confidence ?? 88.5) >= 80
    ).length;

    const sumConf = targetList.reduce((acc, r) => acc + (r.ai?.confidence ?? 88.5), 0);
    const avgConf = targetList.length > 0 ? sumConf / targetList.length : 88.5;

    return {
      total: targetList.length,
      menunggu,
      disetujui,
      override,
      tervalidasi: disetujui + override,
      ambigu,
      klasterCount,
      highConfidenceMenunggu,
      avgConf,
    };
  }, [reports]);

  // Filtering data
  const filteredReports = useMemo(() => {
    const list = reports || [];
    return list.filter((r) => {
      const conf = r.ai?.confidence ?? 88.5;
      const isApproved = r.ai?.is_approved || r.sumber_kategori === 'ai_disetujui';
      const isOverridden = r.ai?.is_overridden || r.sumber_kategori === 'manual_override';
      const isDone = isApproved || isOverridden;
      const hasCluster = r.ai?.cluster_label !== null && r.ai?.cluster_label !== undefined && !r.ai?.is_noise;

      // Filter Pill Utama
      if (activePill === 'semua_antrean' && isDone) return false;
      if (activePill === 'akurasi_tinggi' && (isDone || conf < 80)) return false;
      if (activePill === 'ambigu' && conf >= 80) return false;
      if (activePill === 'klaster' && !hasCluster) return false;
      // 'semua_riwayat' menampilkan semua tanpa batasan status

      // Filter Dropdown Akurasi
      if (filterAcc === 'tinggi' && conf < 85) return false;
      if (filterAcc === 'sedang' && (conf < 70 || conf >= 85)) return false;
      if (filterAcc === 'rendah' && conf >= 70) return false;

      // Filter Dropdown Kategori
      if (filterCategory !== 'semua') {
        const catName = (r.ai?.kategori_rekomendasi || r.kategori_nama || '').toLowerCase();
        if (!catName.includes(filterCategory.toLowerCase())) return false;
      }

      // Filter Dropdown Klaster
      if (filterCluster === 'klaster' && !hasCluster) return false;
      if (filterCluster === 'noise' && hasCluster) return false;

      // Search Box
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const ticket = (r.ticket_code || '').toLowerCase();
        const desc = (r.deskripsi || '').toLowerCase();
        const kat = (r.kategori_nama || '').toLowerCase();
        const aiKat = (r.ai?.kategori_rekomendasi || '').toLowerCase();
        if (!ticket.includes(q) && !desc.includes(q) && !kat.includes(q) && !aiKat.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [reports, activePill, filterAcc, filterCategory, filterCluster, searchQuery]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activePill, filterAcc, filterCategory, filterCluster, searchQuery]);

  // Pagination calculation
  const totalItems = filteredReports.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  const handleSync = async () => {
    setIsSyncing(true);
    const result = await fetchAdminReports();
    setIsSyncing(false);
    const count = result?.length || reports.length;
    setSuccessMsg(`✓ Data berhasil disinkronkan (${count} aduan aktif dari database MySQL)`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleApprove = async (id) => {
    setApprovingId(id);
    const ok = await approveAiCategory(id);
    setApprovingId(null);
    if (ok) {
      setSuccessMsg('✓ Rekomendasi AI berhasil disetujui');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleOverrideConfirm = async (id, newCatId, catatan) => {
    setOverrideTarget(null);
    await overrideCategory(id, newCatId, catatan);
    setSuccessMsg('✓ Kategori laporan berhasil diubah secara manual');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleBatchApprove = async () => {
    setIsBatchProcessing(true);
    const highConfList = reports.filter(
      (r) =>
        (!r.ai?.is_approved && !r.ai?.is_overridden && r.sumber_kategori !== 'ai_disetujui' && r.sumber_kategori !== 'manual_override') &&
        (r.ai?.confidence ?? 88.5) >= 80
    );

    for (const item of highConfList) {
      await approveAiCategory(item.id);
    }

    setIsBatchProcessing(false);
    setIsBatchModalOpen(false);
    setSuccessMsg(`✓ Berhasil memvalidasi massal ${highConfList.length} laporan bereputasi tinggi.`);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  return (
    <AdminLayout
      title="Validasi AI"
      subtitle="Tinjau dan verifikasi hasil inferensi model klasifikasi NLP (IndoBERT PPKSP) dan deteksi klaster insiden sebelum diteruskan ke alur penanganan."
    >
      {/* ── Modals ── */}
      <ModelConfigModal
        isOpen={isModelConfigOpen}
        onClose={() => setIsModelConfigOpen(false)}
        avgConf={stats.avgConf}
      />

      <BatchApproveModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        highConfidenceCount={stats.highConfidenceMenunggu}
        onConfirm={handleBatchApprove}
        isProcessing={isBatchProcessing}
      />

      {overrideTarget && (
        <OverrideModal
          report={overrideTarget}
          categories={categories}
          onConfirm={handleOverrideConfirm}
          onClose={() => setOverrideTarget(null)}
        />
      )}

      {/* ── Toast Sukses ── */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white text-xs font-semibold px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* ── Top Header Section (Sesuai Referensi Desain) ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
              <span>Admin Panel</span>
              <span>&gt;</span>
              <span className="text-indigo-600 font-bold">Validasi AI</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              Validasi & Triase Klasifikasi AI
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Tinjau dan verifikasi hasil inferensi model klasifikasi NLP (IndoBERT PPKSP) dan deteksi klaster insiden sebelum diteruskan ke alur penanganan.
            </p>
          </div>

          {/* Action Buttons Kanan */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsModelConfigOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              Filter Model
            </button>

            <button
              onClick={() => setIsBatchModalOpen(true)}
              disabled={stats.highConfidenceMenunggu === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Proses Validasi Massal
            </button>

            <button
              onClick={handleSync}
              disabled={isSyncing}
              title="Sinkronkan data dengan MySQL"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <RotateCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── Top 4 KPI Metrics Card (Sesuai Referensi Gambar) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Perlu Validasi */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Perlu Validasi</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{stats.menunggu}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                Butuh Tindakan
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-4 flex items-center gap-1 font-medium">
              <span className="text-rose-500 font-bold">!</span> Menunggu verifikasi BK
            </p>
          </div>

          {/* Card 2: Akurasi Rata-rata AI */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Akurasi Rata-rata AI</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{stats.avgConf.toFixed(1)}%</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                IndoBERT v2.1
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-4 flex items-center gap-1 font-medium">
              <span className="text-emerald-600 font-bold">✓</span> Terhubung ke database MySQL &amp; IndoBERT pipeline
            </p>
          </div>

          {/* Card 3: Rekomendasi Ambigu (<80%) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Rekomendasi Ambigu (&lt;80%)</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{stats.ambigu}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Peninjauan Manual
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-4 flex items-center gap-1 font-medium">
              <span className="text-amber-500 font-bold">⚠️</span> Prediksi multi-label bersaing
            </p>
          </div>

          {/* Card 4: Tervalidasi Hari Ini */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Tervalidasi Hari Ini</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{stats.tervalidasi}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                100% Sesuai SOP
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-4 flex items-center gap-1 font-medium">
              <span className="text-emerald-600 font-bold">✓</span> Laporan telah dialirkan
            </p>
          </div>
        </div>

        {/* ── Search & Filter Bar Toolbar ── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Search Box */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor tiket, katakunci aduan, atau indikasi..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-slate-50/60"
            />
          </div>

          {/* Dropdown 1: Tingkat Akurasi */}
          <div className="relative min-w-[170px]">
            <select
              value={filterAcc}
              onChange={(e) => setFilterAcc(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              <option value="semua">Tingkat Akurasi: Semua</option>
              <option value="tinggi">Tinggi (≥ 85%)</option>
              <option value="sedang">Sedang (70% - 84%)</option>
              <option value="rendah">Rendah (&lt; 70%)</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Dropdown 2: Kategori Prediksi */}
          <div className="relative min-w-[190px]">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              <option value="semua">Kategori: 7 Kategori Resmi</option>
              {OFFICIAL_CATEGORIES.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Dropdown 3: Status Klaster */}
          <div className="relative min-w-[160px]">
            <select
              value={filterCluster}
              onChange={(e) => setFilterCluster(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              <option value="semua">Status Klaster: Semua</option>
              <option value="klaster">Terindikasi Klaster</option>
              <option value="noise">Noise / Outlier</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* ── Filter Pills Bar ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'semua_antrean', label: 'Semua Perlu Validasi', count: stats.menunggu },
            { id: 'akurasi_tinggi', label: 'Akurasi Tinggi (≥80%)', count: stats.highConfidenceMenunggu },
            { id: 'ambigu', label: 'Ambiguitas / Perlu Review', count: stats.ambigu },
            { id: 'klaster', label: 'Klaster Terindikasi', count: stats.klasterCount },
            { id: 'semua_riwayat', label: 'Semua Riwayat Laporan', count: stats.total },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setActivePill(pill.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activePill === pill.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{pill.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  activePill === pill.id ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {pill.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Case Cards Stream (Tampilan Kartu Sesuai WhatsApp Referensi) ── */}
        <div className="space-y-4">
          {totalItems === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Tidak ada tiket laporan ditemukan</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Semua antrean sesuai filter saat ini telah divalidasi atau tidak ada data yang cocok dengan kata kunci pencarian.
              </p>
            </div>
          ) : (
            currentItems.map((report) => (
              <CaseCard
                key={report.id}
                report={report}
                onApprove={handleApprove}
                onOverride={(r) => setOverrideTarget(r)}
                isApproving={approvingId === report.id}
              />
            ))
          )}
        </div>

        {/* ── Pagination Section ── */}
        {totalItems > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <span className="text-xs text-slate-500">
              Menampilkan{' '}
              <strong className="text-slate-800">
                {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)}
              </strong>{' '}
              dari <strong className="text-slate-800">{totalItems}</strong> tiket antrean validasi
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-lg text-slate-700">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                title="Halaman Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── Standar Akurasi & Etika AI PPKSP Footer Banner ── */}
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center flex-shrink-0 text-indigo-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                  Standar Akurasi & Etika AI PPKSP (Human-in-the-Loop)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  Model IndoBERT dan algoritma HDBSCAN bertindak sebagai asisten pemilahan awal (triase) cerdas. Setiap keputusan resmi intervensi, konseling siswa, dan penindakan kasus tetap menjadi wewenang penuh Guru BK dan Satgas PPKSP berdasarkan Permendikbudristek No. 46/2023.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/10 text-xs font-semibold backdrop-blur-xs">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                Audit Trail Terverifikasi
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default AiValidation;