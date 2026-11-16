import React, { useState, useRef, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
      <div
        className="min-h-screen flex flex-col justify-between font-sans relative"
        style={{ background: '#FFFFFF', color: '#1C6F8E' }}
      >
        <StudentHeader />
        <main className="max-w-md mx-auto w-full px-4 py-16 flex-1 flex flex-col justify-center">
          <div
            className="p-8 rounded-3xl text-center space-y-6 border"
            style={{
              background: '#FFFFFF',
              borderColor: '#BFEFFF',
              boxShadow: '0 24px 70px rgba(191, 239, 255, 0.45)'
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center font-bold border shadow-xs"
              style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
            >
              <Lock className="w-8 h-8 text-[#1C6F8E]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black tracking-tight" style={{ color: '#1C6F8E' }}>
                Masuk atau Daftar Terlebih Dahulu
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#2E84A5' }}>
                Untuk menjamin keaslian data, perlindungan identitas, serta tindak lanjut resmi oleh Guru BK &amp; Satgas PPKSP, Anda harus memiliki akun terdaftar untuk membuat aduan.
              </p>
            </div>
            <div className="space-y-2.5 pt-2">
              <Link
                to="/login?redirect=/buat-laporan"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 border hover:opacity-90 shadow-xs"
                style={{
                  background: '#BFEFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              >
                <LogIn className="w-4 h-4 text-[#1C6F8E]" />
                <span>Masuk ke Akun Siswa</span>
              </Link>
              <Link
                to="/register?redirect=/buat-laporan"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 border hover:opacity-90"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              >
                <User className="w-4 h-4 text-[#1C6F8E]" />
                <span>Daftar Akun Baru</span>
              </Link>
              <Link
                to="/"
                className="block text-xs pt-2 transition font-medium hover:underline"
                style={{ color: '#2E84A5' }}
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
  if (currentUser?.role === 'admin') {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialCategoryParam = searchParams.get('kategori') || searchParams.get('kategori_id');
  const initialKategoriId = initialCategoryParam ? Number(initialCategoryParam) : null;

  const [step, setStep] = useState(1);
  const [createdTicket, setCreatedTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    kategori_id: initialKategoriId && !isNaN(initialKategoriId) ? initialKategoriId : null,
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
    <div
      className="min-h-screen flex flex-col justify-between font-sans relative"
      style={{ background: '#FFFFFF', color: '#1C6F8E' }}
    >
      <StudentHeader isDashboard={false} />

      <main className="max-w-2xl mx-auto w-full px-4 py-8 sm:py-10 space-y-7">
        {/* Title Header */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#1C6F8E' }}>
            Formulir Pengaduan Insiden
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: '#2E84A5' }}>
            Sampaikan laporan Anda dengan aman, rahasia, dan terenkripsi.
          </p>
        </div>

        {/* Stepper Progress Bar (4 Tahapan) */}
        {step <= 4 && (
          <div
            className="rounded-2xl px-6 py-4 border"
            style={{
              background: '#FFFFFF',
              borderColor: '#BFEFFF',
              boxShadow: '0 4px 16px rgba(191, 239, 255, 0.35)'
            }}
          >
            <div className="relative flex items-center justify-between">
              {/* Garis Horizontal Background */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] z-0"
                style={{ background: '#BFEFFF' }}
              />

              {/* Garis Horizontal Progress */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] z-0 transition-all duration-300"
                style={{
                  background: '#1C6F8E',
                  width:
                    step === 1
                      ? '12%'
                      : step === 2
                      ? '38%'
                      : step === 3
                      ? '65%'
                      : '100%'
                }}
              />

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition border"
                  style={{
                    background: step >= 1 ? '#BFEFFF' : '#FFFFFF',
                    color: '#1C6F8E',
                    borderColor: step === 1 ? '#1C6F8E' : '#BFEFFF',
                    boxShadow: step === 1 ? '0 0 0 4px rgba(191, 239, 255, 0.6)' : 'none'
                  }}
                >
                  {step > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
                </div>
                <span
                  className="text-[11px] sm:text-xs mt-2 transition"
                  style={{
                    color: step >= 1 ? '#1C6F8E' : '#2E84A5',
                    fontWeight: step >= 1 ? '700' : '500'
                  }}
                >
                  Kategori
                </span>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition border"
                  style={{
                    background: step >= 2 ? '#BFEFFF' : '#FFFFFF',
                    color: '#1C6F8E',
                    borderColor: step === 2 ? '#1C6F8E' : '#BFEFFF',
                    boxShadow: step === 2 ? '0 0 0 4px rgba(191, 239, 255, 0.6)' : 'none'
                  }}
                >
                  {step > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
                </div>
                <span
                  className="text-[11px] sm:text-xs mt-2 transition"
                  style={{
                    color: step >= 2 ? '#1C6F8E' : '#2E84A5',
                    fontWeight: step >= 2 ? '700' : '500'
                  }}
                >
                  Detail Kejadian
                </span>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition border"
                  style={{
                    background: step >= 3 ? '#BFEFFF' : '#FFFFFF',
                    color: '#1C6F8E',
                    borderColor: step === 3 ? '#1C6F8E' : '#BFEFFF',
                    boxShadow: step === 3 ? '0 0 0 4px rgba(191, 239, 255, 0.6)' : 'none'
                  }}
                >
                  {step > 3 ? <Check className="w-4 h-4 stroke-[3]" /> : '3'}
                </div>
                <span
                  className="text-[11px] sm:text-xs mt-2 transition"
                  style={{
                    color: step >= 3 ? '#1C6F8E' : '#2E84A5',
                    fontWeight: step >= 3 ? '700' : '500'
                  }}
                >
                  Identitas Pelapor
                </span>
              </div>

              {/* Step 4 */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition border"
                  style={{
                    background: step === 4 ? '#BFEFFF' : '#FFFFFF',
                    color: '#1C6F8E',
                    borderColor: step === 4 ? '#1C6F8E' : '#BFEFFF',
                    boxShadow: step === 4 ? '0 0 0 4px rgba(191, 239, 255, 0.6)' : 'none'
                  }}
                >
                  4
                </div>
                <span
                  className="text-[11px] sm:text-xs mt-2 transition"
                  style={{
                    color: step === 4 ? '#1C6F8E' : '#2E84A5',
                    fontWeight: step === 4 ? '700' : '500'
                  }}
                >
                  Bukti &amp; Konfirmasi
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div
            className="p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2"
            style={{
              background: '#FFF5F5',
              borderColor: '#FEB2B2',
              color: '#C53030'
            }}
          >
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAHAP 1: Pilih Kategori Kejadian                           */}
        {/* ========================================================= */}
        {step === 1 && (
          <div
            className="rounded-3xl p-6 sm:p-8 space-y-5 border"
            style={{
              background: '#FFFFFF',
              borderColor: '#BFEFFF',
              boxShadow: '0 4px 20px -2px rgba(191, 239, 255, 0.45)'
            }}
          >
            {/* Top Subheader */}
            <div className="flex items-center justify-between">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold border"
                style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
              >
                Langkah 1 dari 4
              </span>
              <span className="text-xs font-medium" style={{ color: '#2E84A5' }}>
                Tahap Awal
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: '#1C6F8E' }}>
                Pilih Kategori Kejadian
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#2E84A5' }}>
                Pilih salah satu jenis insiden yang paling sesuai dengan peristiwa yang Anda alami atau saksikan di lingkungan sekolah.
              </p>
            </div>

            {/* Banner Kerahasiaan */}
            <div
              className="rounded-2xl p-3.5 flex items-center gap-3 border"
              style={{
                background: '#FFFFFF',
                borderColor: '#BFEFFF',
                color: '#1C6F8E'
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border"
                style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#2E84A5' }}>
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
                    className="p-4 rounded-2xl border cursor-pointer transition flex items-start gap-3.5 hover:opacity-95"
                    style={{
                      background: isSelected ? '#BFEFFF' : '#FFFFFF',
                      borderColor: isSelected ? '#1C6F8E' : '#BFEFFF',
                      boxShadow: isSelected ? '0 4px 14px rgba(191, 239, 255, 0.5)' : 'none'
                    }}
                  >
                    {/* Radio Indicator */}
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition border"
                      style={{
                        background: isSelected ? '#1C6F8E' : '#FFFFFF',
                        borderColor: isSelected ? '#1C6F8E' : '#BFEFFF',
                        color: '#FFFFFF'
                      }}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm leading-snug" style={{ color: '#1C6F8E' }}>
                          {k.nama}
                        </h4>
                        {isSelected && (
                          <span
                            className="px-2 py-0.5 rounded-md text-[11px] font-bold border"
                            style={{ background: '#FFFFFF', color: '#1C6F8E', borderColor: '#1C6F8E' }}
                          >
                            Dipilih
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#2E84A5' }}>
                        {k.deskripsi}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#BFEFFF' }}>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold transition border hover:opacity-90"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition active:scale-[0.98] border hover:opacity-90 shadow-xs"
                style={{
                  background: '#BFEFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              >
                <span>Lanjut</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#1C6F8E]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAHAP 2: Detail Kejadian (Kronologi Insiden)               */}
        {/* ========================================================= */}
        {step === 2 && (
          <div
            className="rounded-3xl p-6 sm:p-8 space-y-5 border"
            style={{
              background: '#FFFFFF',
              borderColor: '#BFEFFF',
              boxShadow: '0 4px 20px -2px rgba(191, 239, 255, 0.45)'
            }}
          >
            {/* Top Subheader */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider" style={{ color: '#1C6F8E' }}>
                LANGKAH 2 DARI 4
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#1C6F8E]" />
                <span>Kronologi Insiden</span>
              </span>
            </div>

            {/* Kategori Terpilih Box */}
            <div
              className="rounded-2xl p-3.5 flex items-center justify-between text-xs border"
              style={{
                background: '#FFFFFF',
                borderColor: '#BFEFFF',
                color: '#1C6F8E'
              }}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#1C6F8E] shrink-0" />
                <span className="font-bold">
                  Kategori: {selectedCategory.nama}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="font-bold flex items-center gap-1 transition hover:underline"
                style={{ color: '#1C6F8E' }}
              >
                <span>Ubah</span>
                <Edit3 className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: '#1C6F8E' }}>
                Ceritakan Kejadiannya
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#2E84A5' }}>
                Tuliskan kronologi peristiwa secara runtut agar tim penanganan dapat menindaklanjuti secara tepat.
              </p>
            </div>

            {/* Unsur Informasi Yang Disarankan */}
            <div className="space-y-2">
              <span className="text-xs font-bold block" style={{ color: '#2E84A5' }}>
                Unsur informasi yang disarankan:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border"
                  style={{ background: '#FFFFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#1C6F8E]" />
                  <span>Apa yang Terjadi</span>
                </span>
                <span
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border"
                  style={{ background: '#FFFFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                >
                  <Clock className="w-3.5 h-3.5 text-[#1C6F8E]" />
                  <span>Waktu Kejadian</span>
                </span>
                <span
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border"
                  style={{ background: '#FFFFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                >
                  <Hash className="w-3.5 h-3.5 text-[#1C6F8E]" />
                  <span>Lokasi / Platform</span>
                </span>
                <span
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border"
                  style={{ background: '#FFFFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                >
                  <Users className="w-3.5 h-3.5 text-[#1C6F8E]" />
                  <span>Pihak Terlibat</span>
                </span>
              </div>
            </div>

            {/* Textarea Uraian Peristiwa */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold" style={{ color: '#1C6F8E' }}>
                  Uraian Detail Peristiwa <span className="text-red-500">*</span>
                </label>
                <span className="font-mono text-[11px]" style={{ color: '#2E84A5' }}>
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
                className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed focus:outline-none transition resize-none border"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              />
              <div className="flex items-center gap-1.5 text-xs pt-0.5" style={{ color: '#2E84A5' }}>
                <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: '#1C6F8E' }} />
                <span>
                  Ceritamu akan dibaca dengan penuh kehati-hatian, empati, dan dijaga kerahasiaannya.
                </span>
              </div>
            </div>

            {/* Perkiraan Waktu & Tempat (Opsional) */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold block" style={{ color: '#1C6F8E' }}>
                Perkiraan Waktu &amp; Tempat (Opsional)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-semibold block mb-1" style={{ color: '#2E84A5' }}>
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
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl text-xs font-medium focus:outline-none cursor-pointer border [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      style={{
                        background: '#FFFFFF',
                        color: '#1C6F8E',
                        borderColor: '#BFEFFF'
                      }}
                    />
                    <Calendar className="w-4 h-4 absolute right-3 top-3 pointer-events-none text-[#1C6F8E]" />
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date().toISOString().split('T')[0];
                        setFormData((prev) => ({ ...prev, waktu_kejadian: today }));
                      }}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md transition border hover:opacity-90"
                      style={{
                        background: '#BFEFFF',
                        color: '#1C6F8E',
                        borderColor: '#BFEFFF'
                      }}
                    >
                      Hari Ini
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                        setFormData((prev) => ({ ...prev, waktu_kejadian: yesterday }));
                      }}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md transition border hover:opacity-90"
                      style={{
                        background: '#FFFFFF',
                        color: '#1C6F8E',
                        borderColor: '#BFEFFF'
                      }}
                    >
                      Kemarin
                    </button>
                    {formData.waktu_kejadian && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, waktu_kejadian: '' }));
                        }}
                        className="text-[10px] ml-auto transition text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold block mb-1" style={{ color: '#2E84A5' }}>
                    Lokasi Kejadian
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="lokasi"
                      value={formData.lokasi}
                      onChange={handleChange}
                      placeholder="Contoh: Area Kantin, Lapangan Olahraga, Lorong Kelas, atau WhatsApp"
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl text-xs font-medium focus:outline-none border"
                      style={{
                        background: '#FFFFFF',
                        color: '#1C6F8E',
                        borderColor: '#BFEFFF'
                      }}
                    />
                    <MapPin className="w-4 h-4 absolute right-3 top-3 pointer-events-none text-[#1C6F8E]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#BFEFFF' }}>
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border hover:opacity-90"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#1C6F8E]" />
                <span>Kembali</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition active:scale-[0.98] border hover:opacity-90 shadow-xs"
                style={{
                  background: '#BFEFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              >
                <span>Lanjut</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#1C6F8E]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAHAP 3: Identitas Pelapor (Bagaimana Kamu Ingin Melapor)  */}
        {/* ========================================================= */}
        {step === 3 && (
          <div
            className="rounded-3xl p-6 sm:p-8 space-y-5 border"
            style={{
              background: '#FFFFFF',
              borderColor: '#BFEFFF',
              boxShadow: '0 4px 20px -2px rgba(191, 239, 255, 0.45)'
            }}
          >
            {/* Top Subheader */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: '#2E84A5' }}>
                LANGKAH 3 DARI 4 • Kategori: {selectedCategory.nama.split(' ')[0]}
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
              >
                <Lock className="w-3 h-3 text-[#1C6F8E]" />
                <span>Privasi &amp; Identitas</span>
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: '#1C6F8E' }}>
                Bagaimana Kamu Ingin Melapor?
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#2E84A5' }}>
                Pilih tingkat kerahasiaan identitas sesuai kenyamananmu. Keduanya tetap mendapatkan penanganan serius dari pihak sekolah.
              </p>
            </div>

            {/* 2 Kotak Pilihan Mode (Grid 2 Kolom) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Card 1: Laporkan Secara Anonim */}
              <div
                onClick={() => setFormData((prev) => ({ ...prev, is_anonymous: true }))}
                className="p-5 rounded-3xl border-2 cursor-pointer transition flex flex-col justify-between hover:opacity-95"
                style={{
                  background: formData.is_anonymous ? '#BFEFFF' : '#FFFFFF',
                  borderColor: formData.is_anonymous ? '#1C6F8E' : '#BFEFFF',
                  boxShadow: formData.is_anonymous ? '0 4px 14px rgba(191, 239, 255, 0.5)' : 'none'
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border"
                      style={{ background: '#FFFFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
                    >
                      <EyeOff className="w-5 h-5 text-[#1C6F8E]" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="px-2 py-0.5 rounded-md text-[11px] font-bold border"
                        style={{ background: '#FFFFFF', color: '#1C6F8E', borderColor: '#1C6F8E' }}
                      >
                        Rekomendasi
                      </span>
                      {formData.is_anonymous && (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: '#1C6F8E', color: '#FFFFFF' }}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-sm" style={{ color: '#1C6F8E' }}>
                    Laporkan Secara Anonim
                  </h3>
                  <p className="text-xs mt-0.5 mb-3 leading-relaxed" style={{ color: '#2E84A5' }}>
                    Identitasmu tidak akan ditampilkan ke siapa pun.
                  </p>

                  <div className="space-y-2 border-t pt-3 text-xs" style={{ borderColor: '#1C6F8E', color: '#1C6F8E' }}>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#1C6F8E]" />
                      <span>Nama dan NISN disembunyikan sepenuhnya</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#1C6F8E]" />
                      <span>Pantau status aduan via kode tiket rahasia</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#1C6F8E]" />
                      <span>Komunikasi dua arah tetap terlindungi enkripsi</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Laporkan dengan Nama */}
              <div
                onClick={() => setFormData((prev) => ({ ...prev, is_anonymous: false }))}
                className="p-5 rounded-3xl border-2 cursor-pointer transition flex flex-col justify-between hover:opacity-95"
                style={{
                  background: !formData.is_anonymous ? '#BFEFFF' : '#FFFFFF',
                  borderColor: !formData.is_anonymous ? '#1C6F8E' : '#BFEFFF',
                  boxShadow: !formData.is_anonymous ? '0 4px 14px rgba(191, 239, 255, 0.5)' : 'none'
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border"
                      style={{ background: '#FFFFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
                    >
                      <User className="w-5 h-5 text-[#1C6F8E]" />
                    </div>
                    {!formData.is_anonymous ? (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: '#1C6F8E', color: '#FFFFFF' }}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border" style={{ borderColor: '#BFEFFF' }} />
                    )}
                  </div>

                  <h3 className="font-bold text-sm" style={{ color: '#1C6F8E' }}>
                    Laporkan dengan Nama
                  </h3>
                  <p className="text-xs mt-0.5 mb-3 leading-relaxed" style={{ color: '#2E84A5' }}>
                    Namamu akan terlihat oleh admin sekolah untuk penanganan personal.
                  </p>

                  <div className="space-y-2 border-t pt-3 text-xs" style={{ borderColor: '#BFEFFF', color: '#2E84A5' }}>
                    <div className="flex items-start gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border shrink-0 mt-0.5" style={{ borderColor: '#1C6F8E' }} />
                      <span>Guru BK dapat memberikan pendampingan langsung</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border shrink-0 mt-0.5" style={{ borderColor: '#1C6F8E' }} />
                      <span>Terhubung otomatis ke akun profil siswa SIGAP</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border shrink-0 mt-0.5" style={{ borderColor: '#1C6F8E' }} />
                      <span>Kerahasiaan tetap terjaga di hadapan pihak luar</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Callout Kerahasiaan Dijamin Sepenuhnya */}
            <div
              className="rounded-2xl p-4 flex items-start gap-3 border"
              style={{
                background: '#FFFFFF',
                borderColor: '#BFEFFF',
                color: '#1C6F8E'
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border"
                style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
              >
                <Lock className="w-4 h-4 text-[#1C6F8E]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs" style={{ color: '#1C6F8E' }}>
                  Kerahasiaanmu Dijamin Sepenuhnya
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: '#2E84A5' }}>
                  Pilihan mode anonim maupun dengan nama keduanya dilindungi undang-undang perlindungan anak dan SOP penanganan kekerasan sekolah (PPKSP Kemendikbudristek).
                </p>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#BFEFFF' }}>
              <span className="text-xs font-medium" style={{ color: '#2E84A5' }}>
                Langkah 3 dari 4
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold transition border hover:opacity-90"
                  style={{
                    background: '#FFFFFF',
                    color: '#1C6F8E',
                    borderColor: '#BFEFFF'
                  }}
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition active:scale-[0.98] border hover:opacity-90 shadow-xs"
                  style={{
                    background: '#BFEFFF',
                    color: '#1C6F8E',
                    borderColor: '#BFEFFF'
                  }}
                >
                  <span>Lanjut</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#1C6F8E]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAHAP 4: Bukti & Konfirmasi (Unggah Bukti Pendukung)       */}
        {/* ========================================================= */}
        {step === 4 && (
          <div
            className="rounded-3xl p-6 sm:p-8 space-y-5 border"
            style={{
              background: '#FFFFFF',
              borderColor: '#BFEFFF',
              boxShadow: '0 4px 20px -2px rgba(191, 239, 255, 0.45)'
            }}
          >
            {/* Top Subheader */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: '#2E84A5' }}>
                LANGKAH 4 DARI 4 • Kategori: {selectedCategory.nama.split(' ')[0]} • Mode:{' '}
                {formData.is_anonymous ? 'Anonim' : 'Identitas Terbuka'}
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
              >
                Bukti &amp; Konfirmasi
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: '#1C6F8E' }}>
                Unggah Bukti Pendukung (Opsional)
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#2E84A5' }}>
                Tambahkan tangkapan layar, dokumen, atau foto yang relevan untuk memperkuat laporanmu. Langkah ini bersifat opsional.
              </p>
            </div>

            {/* Dropzone Upload */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition hover:opacity-90"
              style={{
                background: '#FFFFFF',
                borderColor: '#BFEFFF'
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2.5 border"
                style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
              >
                <UploadCloud className="w-6 h-6 text-[#1C6F8E]" />
              </div>
              <p className="text-xs sm:text-sm font-bold" style={{ color: '#1C6F8E' }}>
                Seret file ke sini atau klik untuk unggah foto/PDF
              </p>
              <p className="text-xs mt-1" style={{ color: '#2E84A5' }}>
                Format: JPG, PNG, PDF. Maks 10MB per file.
              </p>
            </div>

            {/* File Terunggah List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold" style={{ color: '#1C6F8E' }}>
                    File Terunggah ({uploadedFiles.length} file)
                  </span>
                  <span className="font-mono text-[11px]" style={{ color: '#2E84A5' }}>
                    Total: {totalFileSize}
                  </span>
                </div>

                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-3 rounded-2xl flex items-center justify-between gap-3 border"
                      style={{
                        background: '#FFFFFF',
                        borderColor: '#BFEFFF'
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                          style={{
                            background: '#BFEFFF',
                            borderColor: '#BFEFFF',
                            color: '#1C6F8E'
                          }}
                        >
                          {file.type === 'pdf' ? (
                            <FileText className="w-5 h-5 text-[#1C6F8E]" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-[#1C6F8E]" />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold truncate" style={{ color: '#1C6F8E' }}>
                            {file.name}
                          </p>
                          <p className="text-[11px] flex items-center gap-1 mt-0.5" style={{ color: '#2E84A5' }}>
                            <span>{file.size}</span>
                            <span>•</span>
                            <span>Baru saja diunggah</span>
                            <CheckCircle2 className="w-3 h-3 text-[#1C6F8E]" />
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition shrink-0 hover:bg-red-50 text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Banner Enkripsi */}
            <div
              className="rounded-2xl p-4 flex items-start gap-3 border"
              style={{
                background: '#FFFFFF',
                borderColor: '#BFEFFF',
                color: '#1C6F8E'
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border"
                style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
              >
                <Lock className="w-4 h-4 text-[#1C6F8E]" />
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#2E84A5' }}>
                Semua berkas dienkripsi dengan standar AES-256 dan metadata lokasi/perangkat dibersihkan secara otomatis demi privasi Anda.
              </p>
            </div>

            {/* Tombol Kirim Laporan Utama */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-50 border hover:opacity-90 shadow-xs cursor-pointer"
                style={{
                  background: '#BFEFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              >
                <span>{isSubmitting ? 'Mengirim Laporan...' : 'Kirim Laporan'}</span>
                <Navigation className="w-4 h-4 rotate-90 text-[#1C6F8E]" />
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="w-full text-xs font-semibold text-center transition hover:underline"
                style={{ color: '#2E84A5' }}
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
          <div
            className="rounded-3xl p-8 text-center space-y-6 animate-fade-in border"
            style={{
              background: '#FFFFFF',
              borderColor: '#BFEFFF',
              boxShadow: '0 24px 70px rgba(191, 239, 255, 0.45)'
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto border shadow-xs"
              style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
            >
              <CheckCircle2 className="w-9 h-9 text-[#1C6F8E]" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-black tracking-tight" style={{ color: '#1C6F8E' }}>
                Laporan Berhasil Diajukan!
              </h2>
              <p className="text-xs sm:text-sm max-w-md mx-auto leading-relaxed" style={{ color: '#2E84A5' }}>
                Terima kasih atas keberanian Anda melapor. Pengaduan Anda telah terdaftar dan segera ditelaah oleh Tim Konselor Bimbingan Konseling.
              </p>
            </div>

            {/* Box Kode Tiket */}
            <div
              className="rounded-2xl p-5 max-w-md mx-auto space-y-2 border"
              style={{
                background: '#FFFFFF',
                borderColor: '#BFEFFF'
              }}
            >
              <span className="text-xs font-medium block" style={{ color: '#2E84A5' }}>
                Kode Tiket Pelacakan Rahasia:
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-2xl font-black tracking-wider" style={{ color: '#1C6F8E' }}>
                  #{createdTicket}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTicket}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border hover:opacity-90"
                  style={{
                    background: '#BFEFFF',
                    color: '#1C6F8E',
                    borderColor: '#BFEFFF'
                  }}
                >
                  <Copy className="w-3.5 h-3.5 text-[#1C6F8E]" />
                  <span>{copied ? 'Tersalin!' : 'Salin'}</span>
                </button>
              </div>
              <p className="text-[11px] pt-1" style={{ color: '#2E84A5' }}>
                Simpan kode ini dengan aman untuk memantau kronologi dan respon pihak sekolah tanpa perlu membuka identitas Anda.
              </p>
            </div>

            {/* Tombol Navigasi Akhir */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(`/lacak?code=${createdTicket}`)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition border hover:opacity-90 shadow-xs cursor-pointer"
                style={{
                  background: '#BFEFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              >
                <Search className="w-4 h-4 text-[#1C6F8E]" />
                <span>Lacak Status Aduan Sekarang</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs transition border hover:opacity-90 cursor-pointer"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
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

export default CreateReportWizard;
