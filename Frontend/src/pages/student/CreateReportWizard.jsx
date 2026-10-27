import React, { useState, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  ShieldCheck,
  Check,
  CheckCircle2,
  Lock,
  EyeOff,
  User,
  Calendar,
  Hash,
  MapPin,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  X,
  ArrowRight,
  ArrowLeft,
  Navigation,
  HelpCircle,
  Clock,
  Users,
  Edit3,
  Copy,
  Search,
  LogIn
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { KATEGORI_DATA } from '../../data/categories';
import { StudentHeader } from '../../components/layout/StudentHeader';
import { StudentFooter } from '../../components/layout/StudentFooter';

export const CreateReportWizard = () => {
  const { createReport, currentUser } = useStore();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Gatekeeper: Pengguna harus login atau daftar terlebih dahulu
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-liquid-mesh text-slate-800">
        {/* Ambient glow orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-400/25 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-400/20 rounded-full blur-3xl" />
        </div>
        <StudentHeader />
        <main className="max-w-md mx-auto w-full px-4 py-16 flex-1 flex flex-col justify-center">
          <div className="glass-panel-elevated p-8 rounded-3xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/80 backdrop-blur-sm text-white mx-auto flex items-center justify-center font-bold shadow-lg border border-white/40">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Masuk atau Daftar Terlebih Dahulu</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Untuk menjamin keaslian data, perlindungan identitas, serta tindak lanjut resmi oleh Guru BK & Satgas PPKSP, Anda harus memiliki akun terdaftar untuk membuat aduan.
              </p>
            </div>
            <div className="space-y-2.5 pt-2">
              <Link
                to="/login?redirect=/buat-laporan"
                className="glass-button-secondary w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk ke Akun Siswa</span>
              </Link>
              <Link
                to="/register?redirect=/buat-laporan"
                className="glass-button-primary w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95"
              >
                <User className="w-4 h-4" />
                <span>Daftar Akun Baru</span>
              </Link>
              <Link
                to="/"
                className="block text-xs text-slate-500 hover:text-slate-800 pt-2 transition font-medium"
              >
                ← Kembali ke Beranda
              </Link>
            </div>
          </div>
        </main>
        <StudentFooter />
      </div>
    );
  }

  // Gatekeeper lapis 2: Admin tidak boleh mengakses halaman buat aduan
  // (mencegah akses langsung via URL oleh admin yang sedang login)
  if (currentUser?.role === 'admin') {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const [step, setStep] = useState(1);
  const [createdTicket, setCreatedTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // Form State (dimulai dalam kondisi bersih / kosong)
  const [formData, setFormData] = useState({
    kategori_id: null,
    deskripsi: '',
    waktu_kejadian: '',
    lokasi: '',
    is_anonymous: true,
    nama_pelapor: currentUser?.nama || '',
    asal_sekolah: currentUser?.sekolah || 'SMAN 1 Teladan'
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const totalFileSize = useMemo(() => {
    if (uploadedFiles.length === 0) return '0 KB';
    let totalBytes = 0;
    uploadedFiles.forEach((f) => {
      totalBytes += f.bytes || 0;
    });
    if (totalBytes > 1024 * 1024) {
      return (totalBytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
    return Math.round(totalBytes / 1024) + ' KB';
  }, [uploadedFiles]);

  const selectedCategory =
    KATEGORI_DATA.find((k) => k.id === Number(formData.kategori_id)) || KATEGORI_DATA[0];

  const handleCategorySelect = (id) => {
    setFormData((prev) => ({ ...prev, kategori_id: id }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!formData.kategori_id) {
        setErrorMsg('Silakan pilih salah satu kategori kejadian terlebih dahulu.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.deskripsi || formData.deskripsi.trim().length < 10) {
        setErrorMsg('Harap isi uraian kronologi kejadian minimal 10 karakter.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files).map((f, idx) => ({
      id: Date.now() + idx,
      name: f.name,
      rawFile: f,
      bytes: f.size,
      size:
        f.size > 1024 * 1024
          ? (f.size / (1024 * 1024)).toFixed(1) + ' MB'
          : Math.round(f.size / 1024) + ' KB',
      type: f.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image'
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        ...formData,
        judul: `Pengaduan Insiden ${selectedCategory.nama}`,
        bukti_file: uploadedFiles.map((f) => f.name).join(', ')
      };

      const report = await createReport(payload, uploadedFiles);
      setCreatedTicket(report.ticket_code);
      setStep(5); // Step 5: Success confirmation
    } catch (err) {
      setErrorMsg('Terjadi kendala saat mengirim laporan: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTicket = () => {
    if (createdTicket) {
      navigator.clipboard.writeText(createdTicket);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-liquid-mesh text-slate-800 relative">
      {/* Ambient glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-violet-400/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-400/15 rounded-full blur-3xl" />
      </div>
      <StudentHeader isDashboard={false} />

      <main className="max-w-2xl mx-auto w-full px-4 py-8 sm:py-10 space-y-7">
        {/* Title Header */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Formulir Pengaduan Insiden
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Sampaikan laporan Anda dengan aman, rahasia, dan terenkripsi.
          </p>
        </div>

        {/* Stepper Progress Bar (4 Tahapan) */}
        {step <= 4 && (
          <div className="glass-panel rounded-2xl px-6 py-4">
            <div className="relative flex items-center justify-between">
              {/* Garis Horizontal Background */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-white/40 z-0"></div>

              {/* Garis Horizontal Progress Biru */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-sky-400 z-0 transition-all duration-300"
                style={{
                  width:
                    step === 1
                      ? '12%'
                      : step === 2
                      ? '38%'
                      : step === 3
                      ? '65%'
                      : '100%'
                }}
              ></div>

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    step > 1
                      ? 'bg-sky-500 text-white shadow-md'
                      : step === 1
                      ? 'bg-sky-500 text-white ring-4 ring-sky-200/60 shadow-md'
                      : 'bg-white/50 backdrop-blur-sm border-2 border-white/60 text-slate-400'
                  }`}
                >
                  {step > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
                </div>
                <span
                  className={`text-[11px] sm:text-xs mt-2 transition ${
                    step >= 1 ? 'font-bold text-slate-800' : 'text-slate-400 font-medium'
                  }`}
                >
                  Kategori
                </span>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    step > 2
                      ? 'bg-sky-500 text-white shadow-md'
                      : step === 2
                      ? 'bg-sky-500 text-white ring-4 ring-sky-200/60 shadow-md'
                      : 'bg-white/50 backdrop-blur-sm border-2 border-white/60 text-slate-400'
                  }`}
                >
                  {step > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
                </div>
                <span
                  className={`text-[11px] sm:text-xs mt-2 transition ${
                    step >= 2 ? 'font-bold text-slate-800' : 'text-slate-400 font-medium'
                  }`}
                >
                  Detail Kejadian
                </span>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    step > 3
                      ? 'bg-sky-500 text-white shadow-md'
                      : step === 3
                      ? 'bg-sky-500 text-white ring-4 ring-sky-200/60 shadow-md'
                      : 'bg-white/50 backdrop-blur-sm border-2 border-white/60 text-slate-400'
                  }`}
                >
                  {step > 3 ? <Check className="w-4 h-4 stroke-[3]" /> : '3'}
                </div>
                <span
                  className={`text-[11px] sm:text-xs mt-2 transition ${
                    step >= 3 ? 'font-bold text-slate-800' : 'text-slate-400 font-medium'
                  }`}
                >
                  Identitas Pelapor
                </span>
              </div>

              {/* Step 4 */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    step === 4
                      ? 'bg-sky-500 text-white ring-4 ring-sky-200/60 shadow-md'
                      : 'bg-white/50 backdrop-blur-sm border-2 border-white/60 text-slate-400'
                  }`}
                >
                  4
                </div>
                <span
                  className={`text-[11px] sm:text-xs mt-2 transition ${
                    step === 4 ? 'font-bold text-slate-800' : 'text-slate-400 font-medium'
                  }`}
                >
                  Bukti & Konfirmasi
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/10 backdrop-blur-sm border border-red-300/60 text-xs text-red-700 font-semibold flex items-center gap-2">
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAHAP 1: Pilih Kategori Kejadian                           */}
        {/* ========================================================= */}
        {step === 1 && (
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 space-y-5">
            {/* Top Subheader */}
            <div className="flex items-center justify-between">
              <span className="glass-pill-blue px-3 py-1 rounded-full text-xs font-semibold">
                Langkah 1 dari 4
              </span>
              <span className="text-xs text-slate-500 font-medium">Tahap Awal</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Pilih Kategori Kejadian
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pilih salah satu jenis insiden yang paling sesuai dengan peristiwa yang Anda alami atau saksikan di lingkungan sekolah.
              </p>
            </div>

            {/* Banner Kerahasiaan */}
            <div className="glass-card rounded-2xl p-3.5 flex items-center gap-3 border border-sky-200/60">
              <div className="w-8 h-8 rounded-xl bg-sky-200/60 text-sky-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Kerahasiaan data dan perlindungan saksi/korban dijamin sesuai peraturan perlindungan anak dan Permendikbudristek PPKSP.
              </p>
            </div>

            {/* List 7 Kategori Radio Buttons */}
            <div className="space-y-2.5 pt-1">
              {KATEGORI_DATA.map((k) => {
                const isSelected = formData.kategori_id === k.id;
                return (
                  <div
                    key={k.id}
                    onClick={() => handleCategorySelect(k.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-sky-300/80 bg-sky-50/70 backdrop-blur-sm ring-1 ring-sky-200/60 shadow-sm'
                        : 'glass-card border-white/60 hover:border-sky-200/60'
                    }`}
                  >
                    {/* Radio Indicator */}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition ${
                        isSelected
                          ? 'bg-sky-500 text-white'
                          : 'border border-white/70 bg-white/40 backdrop-blur-sm'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 leading-snug">
                          {k.nama}
                        </h4>
                        {isSelected && (
                          <span className="glass-pill-blue px-2 py-0.5 rounded-md text-[11px] font-bold">
                            Dipilih
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {k.deskripsi}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-white/50">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="glass-button-secondary px-5 py-2.5 rounded-xl text-xs font-bold transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="glass-button-primary px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition active:scale-[0.98]"
              >
                <span>Lanjut</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAHAP 2: Detail Kejadian (Kronologi Insiden)               */}
        {/* ========================================================= */}
        {step === 2 && (
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 space-y-5">
            {/* Top Subheader */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-800 tracking-wider">
                LANGKAH 2 DARI 4
              </span>
              <span className="glass-pill-blue inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                <span>Kronologi Insiden</span>
              </span>
            </div>

            {/* Kategori Terpilih Box */}
            <div className="glass-card rounded-2xl p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-sky-700 shrink-0" />
                <span className="font-bold text-slate-800">
                  Kategori: {selectedCategory.nama}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1 transition"
              >
                <span>Ubah</span>
                <Edit3 className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Ceritakan Kejadiannya
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tuliskan kronologi peristiwa secara runtut agar tim penanganan dapat menindaklanjuti secara tepat.
              </p>
            </div>

            {/* Unsur Informasi Yang Disarankan */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-slate-500 block">
                Unsur informasi yang disarankan:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl glass-pill text-xs font-semibold text-slate-700">
                  <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                  <span>Apa yang Terjadi</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl glass-pill text-xs font-semibold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Waktu Kejadian</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl glass-pill text-xs font-semibold text-slate-700">
                  <Hash className="w-3.5 h-3.5 text-sky-600" />
                  <span>Lokasi / Platform</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl glass-pill text-xs font-semibold text-slate-700">
                  <Users className="w-3.5 h-3.5 text-sky-600" />
                  <span>Pihak Terlibat</span>
                </span>
              </div>
            </div>

            {/* Textarea Uraian Peristiwa */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700">
                  Uraian Detail Peristiwa <span className="text-red-500">*</span>
                </label>
                <span className="text-slate-400 font-mono text-[11px]">
                  {formData.deskripsi.length} / 2000 karakter
                </span>
              </div>
              <textarea
                name="deskripsi"
                rows={5}
                value={formData.deskripsi}
                onChange={handleChange}
                maxLength={2000}
                placeholder="Tuliskan detail kronologi insiden yang Anda alami atau saksikan..."
                className="glass-input w-full px-4 py-3 rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed focus:outline-none transition resize-none"
              ></textarea>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-0.5">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  Ceritamu akan dibaca dengan penuh kehati-hatian, empati, dan dijaga kerahasiaannya.
                </span>
              </div>
            </div>

            {/* Perkiraan Waktu & Tempat (Opsional) */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-800 block">
                Perkiraan Waktu & Tempat (Opsional)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Tanggal Kejadian
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="waktu_kejadian"
                      value={formData.waktu_kejadian}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      onClick={(e) => {
                        try {
                          if (e.target.showPicker) e.target.showPicker();
                        } catch (_) {}
                      }}
                      className="glass-input w-full pl-3.5 pr-10 py-2.5 rounded-xl text-xs font-medium text-slate-800 focus:outline-none cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date().toISOString().split('T')[0];
                        setFormData((prev) => ({ ...prev, waktu_kejadian: today }));
                      }}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/60 hover:bg-sky-50 hover:text-sky-700 text-slate-600 transition border border-white/60"
                    >
                      Hari Ini
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                        setFormData((prev) => ({ ...prev, waktu_kejadian: yesterday }));
                      }}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/60 hover:bg-sky-50 hover:text-sky-700 text-slate-600 transition border border-white/60"
                    >
                      Kemarin
                    </button>
                    {formData.waktu_kejadian && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, waktu_kejadian: '' }));
                        }}
                        className="text-[10px] text-slate-400 hover:text-red-500 ml-auto transition"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Lokasi Kejadian
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="lokasi"
                      value={formData.lokasi}
                      onChange={handleChange}
                      placeholder="Contoh: Area Kantin, Lapangan Olahraga, Lorong Kelas, atau WhatsApp Grup"
                      className="glass-input w-full pl-3.5 pr-10 py-2.5 rounded-xl text-xs font-medium text-slate-800 focus:outline-none"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-white/50">
              <button
                type="button"
                onClick={handleBack}
                className="glass-button-secondary px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="glass-button-primary px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition active:scale-[0.98]"
              >
                <span>Lanjut</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAHAP 3: Identitas Pelapor (Bagaimana Kamu Ingin Melapor)  */}
        {/* ========================================================= */}
        {step === 3 && (
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 space-y-5">
            {/* Top Subheader */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                LANGKAH 3 DARI 4 • Kategori: {selectedCategory.nama.split(' ')[0]} • Detail Tersimpan
              </span>
              <span className="glass-pill-blue inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold">
                <Lock className="w-3 h-3" />
                <span>Privasi & Identitas</span>
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Bagaimana Kamu Ingin Melapor?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pilih tingkat kerahasiaan identitas sesuai kenyamananmu. Keduanya tetap mendapatkan penanganan serius dari pihak sekolah.
              </p>
            </div>

            {/* 2 Kotak Pilihan Mode (Grid 2 Kolom) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Card 1: Laporkan Secara Anonim */}
              <div
                onClick={() => setFormData((prev) => ({ ...prev, is_anonymous: true }))}
                className={`p-5 rounded-3xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  formData.is_anonymous
                    ? 'border-sky-300/80 bg-sky-50/60 backdrop-blur-sm ring-1 ring-sky-200/60 shadow-sm'
                    : 'glass-card border-white/60 hover:border-sky-200/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-sky-100/80 text-sky-700 flex items-center justify-center shrink-0">
                      <EyeOff className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="glass-pill-blue px-2 py-0.5 rounded-md text-[11px] font-bold">
                        Rekomendasi
                      </span>
                      {formData.is_anonymous && (
                        <div className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">
                    Laporkan Secara Anonim
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 mb-3 leading-relaxed">
                    Identitasmu tidak akan ditampilkan ke siapa pun.
                  </p>

                  <div className="space-y-2 border-t border-sky-200/40 pt-3 text-xs text-slate-700">
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span>Nama dan NISN disembunyikan sepenuhnya</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span>Pantau status aduan via kode tiket rahasia</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span>Komunikasi dua arah tetap terlindungi enkripsi</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Laporkan dengan Nama */}
              <div
                onClick={() => setFormData((prev) => ({ ...prev, is_anonymous: false }))}
                className={`p-5 rounded-3xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  !formData.is_anonymous
                    ? 'border-sky-300/80 bg-sky-50/60 backdrop-blur-sm ring-1 ring-sky-200/60 shadow-sm'
                    : 'glass-card border-white/60 hover:border-sky-200/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/60 text-slate-600 flex items-center justify-center shrink-0 border border-white/70">
                      <User className="w-5 h-5" />
                    </div>
                    {!formData.is_anonymous ? (
                      <div className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-white/70 bg-white/40"></div>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">
                    Laporkan dengan Nama
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 mb-3 leading-relaxed">
                    Namamu akan terlihat oleh admin sekolah untuk penanganan personal.
                  </p>

                  <div className="space-y-2 border-t border-white/50 pt-3 text-xs text-slate-700">
                    <div className="flex items-start gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-400 shrink-0 mt-0.5"></span>
                      <span>Guru BK dapat memberikan pendampingan langsung</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-400 shrink-0 mt-0.5"></span>
                      <span>Terhubung otomatis ke akun profil siswa SIGAP</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-400 shrink-0 mt-0.5"></span>
                      <span>Kerahasiaan tetap terjaga di hadapan pihak luar</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Callout Kerahasiaan Dijamin Sepenuhnya */}
            <div className="glass-card rounded-2xl p-4 flex items-start gap-3 border border-sky-200/50">
              <div className="w-8 h-8 rounded-xl bg-sky-200/60 text-sky-800 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-slate-900">
                  Kerahasiaanmu Dijamin Sepenuhnya
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pilihan mode anonim maupun dengan nama keduanya dilindungi undang-undang perlindungan anak dan SOP penanganan kekerasan sekolah (PPKSP Kemendikbudristek).
                </p>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-white/50">
              <span className="text-xs text-slate-400 font-medium">Langkah 3 dari 4</span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleBack}
                  className="glass-button-secondary px-5 py-2.5 rounded-xl text-xs font-bold transition"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="glass-button-primary px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition active:scale-[0.98]"
                >
                  <span>Lanjut</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAHAP 4: Bukti & Konfirmasi (Unggah Bukti Pendukung)       */}
        {/* ========================================================= */}
        {step === 4 && (
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 space-y-5">
            {/* Top Subheader */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                LANGKAH 4 DARI 4 • Kategori: {selectedCategory.nama.split(' ')[0]} • Mode:{' '}
                {formData.is_anonymous ? 'Anonim' : 'Identitas Terbuka'}
              </span>
              <span className="glass-pill-blue inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold">
                Bukti & Konfirmasi
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Unggah Bukti Pendukung (Opsional)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tambahkan tangkapan layar, dokumen, atau foto yang relevan untuk memperkuat laporanmu. Langkah ini bersifat opsional.
              </p>
            </div>

            {/* Dropzone Upload */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-sky-300/70 bg-sky-50/40 backdrop-blur-sm rounded-2xl p-7 text-center cursor-pointer hover:bg-sky-50/70 transition"
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-sky-100/80 text-sky-600 flex items-center justify-center mx-auto mb-2.5">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                Seret file ke sini atau klik untuk unggah foto/PDF
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Format: JPG, PNG, PDF. Maks 10MB per file.
              </p>
            </div>

            {/* File Terunggah List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">
                    File Terunggah ({uploadedFiles.length} file)
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Total: {totalFileSize}
                  </span>
                </div>

                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="glass-card p-3 rounded-2xl flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            file.type === 'pdf'
                              ? 'bg-red-100/70 text-red-600'
                              : 'bg-sky-100/70 text-sky-600'
                          }`}
                        >
                          {file.type === 'pdf' ? (
                            <FileText className="w-5 h-5" />
                          ) : (
                            <ImageIcon className="w-5 h-5" />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {file.name}
                          </p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <span>{file.size}</span>
                            <span>•</span>
                            <span>Baru saja diunggah</span>
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="w-7 h-7 rounded-lg hover:bg-white/60 text-slate-400 hover:text-slate-600 flex items-center justify-center transition shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Banner Enkripsi AES-256 */}
            <div className="glass-card rounded-2xl p-4 flex items-start gap-3 border border-sky-200/50">
              <div className="w-8 h-8 rounded-xl bg-sky-200/60 text-sky-800 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Semua berkas dienkripsi dengan standar AES-256 dan metadata lokasi/perangkat dibersihkan secara otomatis demi privasi Anda.
              </p>
            </div>

            {/* Tombol Kirim Laporan Utama */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="glass-button-primary w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Mengirim Laporan...' : 'Kirim Laporan'}</span>
                <Navigation className="w-4 h-4 rotate-90" />
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="w-full text-xs font-semibold text-slate-500 hover:text-slate-800 text-center transition"
              >
                Kembali ke langkah sebelumnya
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAHAP 5: Konfirmasi Sukses                                 */}
        {/* ========================================================= */}
        {step === 5 && (
          <div className="glass-panel-elevated rounded-3xl p-8 text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-400/20 backdrop-blur-sm border border-emerald-300/60 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Laporan Berhasil Diajukan!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Terima kasih atas keberanian Anda melapor. Pengaduan Anda telah terdaftar dan segera ditelaah oleh Tim Konselor Bimbingan Konseling.
              </p>
            </div>

            {/* Box Kode Tiket */}
            <div className="glass-card rounded-2xl p-5 max-w-md mx-auto space-y-2 border border-sky-200/60">
              <span className="text-xs text-slate-500 font-medium block">
                Kode Tiket Pelacakan Rahasia:
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-2xl font-black text-sky-900 tracking-wider">
                  #{createdTicket}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTicket}
                  className="glass-button-secondary px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Tersalin!' : 'Salin'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Simpan kode ini dengan aman untuk memantau kronologi dan respon pihak sekolah tanpa perlu membuka identitas Anda.
              </p>
            </div>

            {/* Tombol Navigasi Akhir */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(`/lacak?code=${createdTicket}`)}
                className="glass-button-primary w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Search className="w-4 h-4" />
                <span>Lacak Status Aduan Sekarang</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="glass-button-secondary w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs transition"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        )}
      </main>

      <StudentFooter />
    </div>
  );
};
