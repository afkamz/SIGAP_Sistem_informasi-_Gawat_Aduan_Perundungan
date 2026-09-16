import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Upload,
  CheckCircle2,
  Lock,
  User,
  AlertTriangle,
  FileText,
  Copy,
  Search,
  Check
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { KATEGORI_DATA } from '../../data/categories';
import { StudentHeader } from '../../components/layout/StudentHeader';
import { StudentFooter } from '../../components/layout/StudentFooter';

export const CreateReportWizard = () => {
  const { createReport, currentUser } = useStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    kategori_id: 3, // default: Perundungan Siber
    judul: '',
    waktu_kejadian: '',
    lokasi: '',
    deskripsi: '',
    is_anonymous: true,
    nama_pelapor: currentUser?.nama || '',
    asal_sekolah: currentUser?.sekolah || 'SMAN 1 Teladan',
    nisn: currentUser?.nisn || '',
    saksi: '',
    bukti_file: null,
    persetujuan: false
  });

  const selectedCategory = KATEGORI_DATA.find((k) => k.id === Number(formData.kategori_id)) || KATEGORI_DATA[0];

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, bukti_file: file.name }));
    }
  };

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!formData.kategori_id) {
        setErrorMsg('Silakan pilih salah satu kategori kekerasan.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.deskripsi || formData.deskripsi.length < 15) {
        setErrorMsg('Kronologi kejadian harus diisi minimal 15 karakter.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!formData.is_anonymous && !formData.nama_pelapor) {
        setErrorMsg('Harap isi nama pelapor jika memilih mode terbuka.');
        return;
      }
      setStep(4);
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!formData.persetujuan) {
      setErrorMsg('Anda harus mencentang pernyataan kebenaran laporan.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const report = await createReport(formData);
      setCreatedTicket(report.ticket_code);
      setStep(5); // Success step
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
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800">
      <StudentHeader />

      <main className="max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Wizard Stepper Progress Header */}
        {step < 5 && (
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Tahap {step} dari 4</span>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">
                  {step === 1 && 'Pilih Kategori Permasalahan'}
                  {step === 2 && 'Kronologi & Detail Kejadian'}
                  {step === 3 && 'Identitas Pelapor & Unggah Bukti'}
                  {step === 4 && 'Konfirmasi & Pernyataan'}
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                      s === step
                        ? 'bg-[#A7D8F0] text-slate-900 ring-2 ring-sky-300'
                        : s < step
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {s < step ? <Check className="w-4 h-4" /> : s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 1: Pilih Kategori                                   */}
        {/* ========================================================= */}
        {step === 1 && (
          <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fade-in">
            <p className="text-xs text-slate-500">
              Pilih salah satu dari 7 kategori resmi Permendikbudristek No. 46 Tahun 2023 yang paling sesuai dengan kejadian yang Anda alami atau saksikan:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {KATEGORI_DATA.map((k) => {
                const isSelected = formData.kategori_id === k.id;
                return (
                  <div
                    key={k.id}
                    onClick={() => handleCategorySelect(k.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-sky-400 bg-sky-50/70 ring-2 ring-[#A7D8F0]/50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white text-xs shadow-xs"
                      style={{ backgroundColor: k.color }}
                    >
                      {k.id}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-slate-900">{k.nama}</h4>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-700" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{k.deskripsi}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-xs flex items-center gap-2 transition"
              >
                <span>Lanjut ke Detail Kejadian</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: Detail Kejadian                                  */}
        {/* ========================================================= */}
        {step === 2 && (
          <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fade-in">
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Kategori Terpilih:</span>
              <span className="font-bold text-sky-900 bg-white px-3 py-1 rounded-lg border border-sky-100">
                {selectedCategory.nama}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul Ringkas Aduan (Opsional)</label>
                <input
                  type="text"
                  name="judul"
                  value={formData.judul}
                  onChange={handleChange}
                  placeholder="Contoh: Pemalakan di area kantin belakang sekolah"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#A7D8F0]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Waktu Kejadian *</label>
                  <input
                    type="text"
                    name="waktu_kejadian"
                    value={formData.waktu_kejadian}
                    onChange={handleChange}
                    placeholder="Contoh: Hari Senin, jam istirahat pertama"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#A7D8F0]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lokasi Tempat Kejadian *</label>
                  <input
                    type="text"
                    name="lokasi"
                    value={formData.lokasi}
                    onChange={handleChange}
                    placeholder="Contoh: Lapangan basket / Grup WhatsApp kelas"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#A7D8F0]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700">Kronologi Lengkap Kejadian *</label>
                  <span className="text-[11px] text-slate-400">{formData.deskripsi.length} karakter (min. 15)</span>
                </div>
                <textarea
                  rows="5"
                  name="deskripsi"
                  required
                  value={formData.deskripsi}
                  onChange={handleChange}
                  placeholder="Ceritakan secara runtut apa yang terjadi, siapa saja pihak yang terlibat, dan kronologi kejadian selengkap mungkin..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#A7D8F0] leading-relaxed"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-xs flex items-center gap-2 transition"
              >
                <span>Lanjut ke Identitas & Bukti</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: Identitas & Berkas Bukti                          */}
        {/* ========================================================= */}
        {step === 3 && (
          <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fade-in">
            {/* Pilihan Anonim vs Terbuka */}
            <div className="space-y-3">
              <label className="font-bold text-xs text-slate-800 block">Pilihan Kerahasiaan Identitas Pelapor</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div
                  onClick={() => setFormData((p) => ({ ...p, is_anonymous: true }))}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                    formData.is_anonymous
                      ? 'border-sky-400 bg-sky-50/70 ring-2 ring-[#A7D8F0]/50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-900 text-white">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">Mode Anonim (Disarankan)</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">Identitas Anda disembunyikan sepenuhnya dari sistem.</p>
                  </div>
                </div>

                <div
                  onClick={() => setFormData((p) => ({ ...p, is_anonymous: false }))}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                    !formData.is_anonymous
                      ? 'border-sky-400 bg-sky-50/70 ring-2 ring-[#A7D8F0]/50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-sky-600 text-white">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">Mode Terbuka</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">Nama & NISN dicatat khusus untuk kemudahan tindak lanjut BK.</p>
                  </div>
                </div>
              </div>
            </div>

            {!formData.is_anonymous && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200 animate-fade-in">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Lengkap Pelapor *</label>
                  <input
                    type="text"
                    name="nama_pelapor"
                    value={formData.nama_pelapor}
                    onChange={handleChange}
                    placeholder="Nama Anda"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NISN / Kelas (Opsional)</label>
                  <input
                    type="text"
                    name="nisn"
                    value={formData.nisn}
                    onChange={handleChange}
                    placeholder="Nomor induk siswa"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Unggah Berkas Bukti */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 block">Lampiran Berkas Bukti (Foto, Tangkapan Layar, atau Audio)</label>
              <div className="border-2 border-dashed border-slate-300 hover:border-sky-400 p-6 rounded-2xl text-center space-y-2 bg-slate-50/60 transition relative cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx,audio/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-sky-700 flex items-center justify-center mx-auto shadow-xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-slate-600 font-medium">
                  {formData.bukti_file ? (
                    <span className="font-bold text-emerald-600 block">File Terpilih: {formData.bukti_file}</span>
                  ) : (
                    <span>Klik untuk memilih berkas bukti atau seret ke sini</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">Mendukung format JPG, PNG, PDF, atau MP3 (Maks. 10MB)</p>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-xs flex items-center gap-2 transition"
              >
                <span>Lanjut ke Konfirmasi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 4: Review & Konfirmasi Final                        */}
        {/* ========================================================= */}
        {step === 4 && (
          <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fade-in">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Tinjau Kembali Rincian Laporan Anda
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block font-medium">Kategori Kasus:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedCategory.nama}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Mode Identitas:</span>
                  <span className="font-bold text-slate-900">
                    {formData.is_anonymous ? '🔒 Anonim Terlindungi' : `👤 Terbuka (${formData.nama_pelapor})`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Lokasi:</span>
                  <span className="font-bold text-slate-900">{formData.lokasi || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Bukti Lampiran:</span>
                  <span className="font-bold text-slate-900">{formData.bukti_file || 'Tidak ada berkas'}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-slate-400 block font-medium mb-1">Kronologi Kejadian:</span>
                <p className="text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">{formData.deskripsi}</p>
              </div>

              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="persetujuanFinal"
                  name="persetujuan"
                  checked={formData.persetujuan}
                  onChange={handleChange}
                  className="rounded border-slate-300 text-sky-600 focus:ring-[#A7D8F0] mt-0.5"
                />
                <label htmlFor="persetujuanFinal" className="text-xs text-slate-700 leading-relaxed cursor-pointer font-medium">
                  Saya menyatakan bahwa informasi yang saya sampaikan adalah benar dan tidak bermaksud mencemarkan nama baik pihak manapun. Saya bersedia laporan ini ditindaklanjuti oleh Satgas Perlindungan Satuan Pendidikan.
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.persetujuan}
                className="px-7 py-3 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-extrabold text-sm flex items-center gap-2 transition shadow-sm disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Mengirim Laporan...' : 'Kirim Pengaduan Sekarang'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 5: Sukses & Kode Tiket                              */}
        {/* ========================================================= */}
        {step === 5 && (
          <div className="bg-white p-8 lg:p-10 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6 animate-fade-in max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-1">
                Laporan Diterima Sistem
              </span>
              <h2 className="text-2xl font-black text-slate-900">Pengaduan Anda Berhasil Terkirim!</h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                Terima kasih atas keberanian Anda bersuara. Laporan Anda telah masuk dalam antrean investigasi aman Konselor BK & Satgas PPKSP.
              </p>
            </div>

            {/* Kode Tiket Card */}
            <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
              <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">Kode Tiket Resmi Pelacakan</span>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-2xl font-black text-slate-900 tracking-wider">
                  {createdTicket}
                </span>
                <button
                  onClick={handleCopyTicket}
                  className="p-2 rounded-xl bg-white border border-sky-200 text-sky-800 hover:bg-sky-100 transition shadow-2xs"
                  title="Salin Kode Tiket"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copied && <span className="text-[11px] font-bold text-emerald-600 block">Kode tiket berhasil disalin!</span>}
              <p className="text-[11px] text-slate-500">
                Simpan kode ini dengan baik untuk memantau status perkembangan penanganan tanpa perlu login.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => navigate(`/lacak?code=${createdTicket}`)}
                className="px-5 py-2.5 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Search className="w-4 h-4" /> Lacak Perkembangan Tiket Ini
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center transition"
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

