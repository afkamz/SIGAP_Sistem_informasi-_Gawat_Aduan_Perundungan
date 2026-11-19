import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  CheckCircle2,
  AlertCircle,
  Headphones,
  School,
  Lock,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';

export const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'siswa';
  const [activeTab, setActiveTab] = useState(initialRole);

  // Form Siswa
  const [nisn, setNisn] = useState('');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form Admin
  const [nip, setNip] = useState('');
  const [namaAdmin, setNamaAdmin] = useState('');
  const [tokenOtorisasi, setTokenOtorisasi] = useState('');
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // State Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);

  const navigate = useNavigate();
  const { addAuditEntry } = useStore();

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'admin' || roleParam === 'siswa') {
      setActiveTab(roleParam);
    }
  }, [searchParams]);

  const handleResetSiswa = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword.length < 4) {
      setErrorMsg('Kata sandi baru minimal harus 4 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok dengan kata sandi baru.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.resetPasswordSiswa({
        nisn: nisn.trim(),
        nama: namaSiswa.trim(),
        new_password: newPassword
      });
      setSuccessMsg(res.message || 'Kata sandi siswa berhasil diubah. Silakan masuk kembali.');
    } catch (err) {
      console.warn('Reset password siswa error:', err.message);
      // Fallback lokal jika offline / backend simulasi
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setSuccessMsg('Sistem offline: Kata sandi siswa telah disimulasikan berhasil diperbarui.');
      } else {
        setErrorMsg(err.message || 'Gagal memulihkan kata sandi. Pastikan NISN dan nama lengkap sesuai data terdaftar.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAdmin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    setIsLoading(true);
    try {
      const payload = {
        nip: nip.trim(),
        nama: namaAdmin.trim(),
        token_otorisasi: tokenOtorisasi.trim() || undefined,
        new_password: adminNewPassword ? adminNewPassword.trim() : undefined
      };

      const res = await api.requestResetAdmin(payload);
      setSuccessMsg(res.message || 'Verifikasi NIP berhasil. Instruksi pemulihan telah dikirimkan ke kontak terdaftar.');

      if (addAuditEntry) {
        addAuditEntry({
          pelaksana_nama: namaAdmin || 'Petugas Pemohon',
          pelaksana_role: 'Admin / Petugas Resmi',
          tipe_aksi: 'password_reset_request',
          deskripsi: `Permohonan pemulihan akun NIP ${nip.trim()}`,
          detail_perubahan: 'Verifikasi identitas kepegawaian untuk reset kata sandi'
        });
      }
    } catch (err) {
      console.warn('Reset admin error:', err.message);
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setSuccessMsg('Sistem offline: Permohonan reset kata sandi staf admin disimulasikan berhasil.');
      } else {
        setErrorMsg(err.message || 'NIP atau nama petugas tidak sesuai dengan data resmi SIMPPKSP.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col font-sans relative overflow-hidden">
      {/* ─── BACKGROUND DEKORATIF: GRADIENT BABY BLUE & GARIS DIAGONAL RESMI ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div
          className="absolute -left-28 sm:-left-40 md:-left-52 top-[10%] w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] rounded-full"
          style={{
            background: 'linear-gradient(135deg, #BFEFFF 0%, #D6F5FF 100%)',
            opacity: 0.8
          }}
        />
        <div
          className="hidden md:block absolute -right-24 -bottom-24 w-[340px] h-[340px] rounded-full"
          style={{
            background: 'linear-gradient(135deg, #E6F8FF 0%, #BFEFFF 100%)',
            opacity: 0.45
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
          style={{ opacity: 0.7 }}
        >
          <line x1="-100" y1="60" x2="880" y2="1040" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="260" y1="-100" x2="1240" y2="880" stroke="#E2E8F0" strokeWidth="1.2" />
          <line x1="640" y1="-100" x2="1620" y2="880" stroke="#E2E8F0" strokeWidth="1.2" />
          <line x1="1020" y1="-100" x2="2000" y2="880" stroke="#E2E8F0" strokeWidth="1.2" />
        </svg>
      </div>

      {/* ─── HEADER RESMI ─── */}
      <header className="py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center relative z-20 w-full">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/assets/branding/logo-sigap.png"
            alt="Logo SIGAP"
            className="h-9 sm:h-10 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <img
            src="/assets/branding/branding-sigap.png"
            alt="SIGAP"
            className="h-7 sm:h-8 w-auto max-w-[130px] sm:max-w-[160px] object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="text-xs font-semibold hidden md:inline ml-1" style={{ color: '#2E84A5' }}>
            | Pemulihan Akses Akun
          </span>
        </Link>
        <div
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border shadow-xs"
          style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#1C6F8E]" />
          <span>Verifikasi Terenkripsi</span>
        </div>
      </header>

      {/* ─── KONTEN UTAMA ─── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative z-20">
        <div className="w-full max-w-[460px] space-y-5">
          {/* Tombol Kembali */}
          <div className="w-full flex justify-between items-center">
            <Link
              to={activeTab === 'admin' ? '/admin/login' : '/login'}
              className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full transition border hover:opacity-90"
              style={{
                background: '#FFFFFF',
                color: '#1C6F8E',
                borderColor: '#BFEFFF'
              }}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#1C6F8E]" />
              <span>Kembali ke Halaman Masuk</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline cursor-pointer"
              style={{ color: '#2E84A5' }}
            >
              <Headphones className="w-3.5 h-3.5 text-[#1C6F8E]" />
              <span>Butuh Bantuan?</span>
            </button>
          </div>

          {/* Card Container */}
          <div
            className="p-6 sm:p-7 rounded-2xl border shadow-sm space-y-5"
            style={{
              background: '#FFFFFF',
              borderColor: '#E2E8F0'
            }}
          >
            {/* Header Judul */}
            <div className="text-left space-y-1">
              <div className="inline-flex p-2.5 rounded-xl mb-1" style={{ background: 'rgba(191, 239, 255, 0.45)' }}>
                <KeyRound className="w-5 h-5 text-[#1C6F8E]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
                Pemulihan Kata Sandi
              </h1>
              <p className="text-xs leading-relaxed" style={{ color: '#2E84A5' }}>
                Verifikasi identitas resmi Anda untuk mengatur ulang kata sandi akses sistem SIGAP.
              </p>
            </div>

            {/* Tab Pilihan: Portal Siswa vs Portal Admin */}
            <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('siswa');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'siswa'
                    ? 'bg-white shadow-xs text-[#1C6F8E]'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <School className="w-3.5 h-3.5" />
                <span>Portal Siswa</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('admin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-white shadow-xs text-[#1C6F8E]'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin &amp; Guru BK</span>
              </button>
            </div>

            {/* Pesan Sukses */}
            {successMsg && (
              <div
                className="p-4 rounded-xl text-xs font-medium border flex items-start gap-2.5 animate-fade-in"
                style={{
                  background: 'rgba(191, 239, 255, 0.35)',
                  borderColor: '#BFEFFF',
                  color: '#1C6F8E'
                }}
              >
                <CheckCircle2 className="w-4 h-4 text-[#1C6F8E] shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p>{successMsg}</p>
                  <Link
                    to={activeTab === 'admin' ? '/admin/login' : '/login'}
                    className="inline-flex items-center gap-1 text-xs font-bold underline cursor-pointer"
                    style={{ color: '#1C6F8E' }}
                  >
                    <span>Masuk sekarang →</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Pesan Error */}
            {errorMsg && (
              <div
                className="p-3.5 rounded-xl text-xs font-semibold border flex items-start gap-2 animate-fade-in"
                style={{
                  background: '#FFF5F5',
                  borderColor: '#FEB2B2',
                  color: '#C53030'
                }}
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* ─── FORM 1: PEMULIHAN SANDI SISWA ─── */}
            {activeTab === 'siswa' && !successMsg && (
              <form onSubmit={handleResetSiswa} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    NISN (Nomor Induk Siswa Nasional)
                  </label>
                  <input
                    type="text"
                    required
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    placeholder="Contoh: 0081234567"
                    className="w-full px-3.5 py-2.5 rounded-md text-sm border focus:outline-none transition"
                    style={{ borderColor: '#D1D5DB' }}
                    onFocus={(e) => (e.target.style.borderColor = '#1C6F8E')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />
                  <span className="text-[11px] block mt-1" style={{ color: '#2E84A5' }}>
                    Pastikan 10 digit angka sesuai dengan Kartu Pelajar atau Rapor Anda.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Nama Lengkap Siswa
                  </label>
                  <input
                    type="text"
                    required
                    value={namaSiswa}
                    onChange={(e) => setNamaSiswa(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3.5 py-2.5 rounded-md text-sm border focus:outline-none transition"
                    style={{ borderColor: '#D1D5DB' }}
                    onFocus={(e) => (e.target.style.borderColor = '#1C6F8E')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 4 karakter"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-md text-sm border focus:outline-none transition"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.borderColor = '#1C6F8E')}
                      onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Masukkan ulang kata sandi baru"
                    className="w-full px-3.5 py-2.5 rounded-md text-sm border focus:outline-none transition"
                    style={{ borderColor: '#D1D5DB' }}
                    onFocus={(e) => (e.target.style.borderColor = '#1C6F8E')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-md font-bold text-sm transition active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-xs border"
                    style={{
                      background: '#BFEFFF',
                      color: '#1C6F8E',
                      borderColor: '#BFEFFF'
                    }}
                  >
                    <span>{isLoading ? 'Memverifikasi Data...' : 'Simpan Kata Sandi Baru'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* ─── FORM 2: PEMULIHAN SANDI ADMIN & GURU BK ─── */}
            {activeTab === 'admin' && !successMsg && (
              <form onSubmit={handleResetAdmin} className="space-y-4 text-left">
                {/* SOP Notice */}
                <div
                  className="p-3.5 rounded-xl border flex items-start gap-2.5 text-xs text-left"
                  style={{
                    background: 'rgba(191, 239, 255, 0.25)',
                    borderColor: '#BFEFFF',
                    color: '#1C6F8E'
                  }}
                >
                  <ShieldAlert className="w-4 h-4 text-[#1C6F8E] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block mb-0.5">SOP Keamanan Tingkat Tinggi Personel Resmi</strong>
                    <p className="text-[11px] leading-relaxed" style={{ color: '#2E84A5' }}>
                      Akun petugas mencakup data rahasia korban &amp; audit trail forensik. Pemulihan akun memerlukan verifikasi NIP kepegawaian dan otorisasi Satgas PPKSP.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    NIP (Nomor Induk Pegawai)
                  </label>
                  <input
                    type="text"
                    required
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="Contoh: 198001012026"
                    className="w-full px-3.5 py-2.5 rounded-md text-sm border focus:outline-none transition"
                    style={{ borderColor: '#D1D5DB' }}
                    onFocus={(e) => (e.target.style.borderColor = '#1C6F8E')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />
                  <span className="text-[11px] block mt-1" style={{ color: '#2E84A5' }}>
                    Format 18 digit resmi Dapodik / BKN.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Nama Lengkap Petugas
                  </label>
                  <input
                    type="text"
                    required
                    value={namaAdmin}
                    onChange={(e) => setNamaAdmin(e.target.value)}
                    placeholder="Contoh: Ibu Rahmawati, S.Pd"
                    className="w-full px-3.5 py-2.5 rounded-md text-sm border focus:outline-none transition"
                    style={{ borderColor: '#D1D5DB' }}
                    onFocus={(e) => (e.target.style.borderColor = '#1C6F8E')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-[#111827]">
                      Token Otorisasi Satgas (Opsional)
                    </label>
                    <span className="text-[10px] text-slate-400">Dari Koordinator BK / Disdik</span>
                  </div>
                  <input
                    type="text"
                    value={tokenOtorisasi}
                    onChange={(e) => setTokenOtorisasi(e.target.value)}
                    placeholder="Contoh: SIGAP-BK-2026"
                    className="w-full px-3.5 py-2.5 rounded-md text-sm border focus:outline-none transition"
                    style={{ borderColor: '#D1D5DB' }}
                    onFocus={(e) => (e.target.style.borderColor = '#1C6F8E')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Kata Sandi Baru yang Dikehendaki (Opsional)
                  </label>
                  <div className="relative">
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      value={adminNewPassword}
                      onChange={(e) => setAdminNewPassword(e.target.value)}
                      placeholder="Masukkan jika memiliki token otorisasi"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-md text-sm border focus:outline-none transition"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.borderColor = '#1C6F8E')}
                      onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-md font-bold text-sm transition active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-xs border"
                    style={{
                      background: '#BFEFFF',
                      color: '#1C6F8E',
                      borderColor: '#BFEFFF'
                    }}
                  >
                    <span>{isLoading ? 'Memproses Permohonan...' : 'Ajukan Pemulihan Kredensial Admin'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Navigasi Cepat Portal Masuk */}
          <div className="text-center text-xs space-y-1" style={{ color: '#2E84A5' }}>
            <p>
              Ingat kata sandi Anda?{' '}
              <Link
                to={activeTab === 'admin' ? '/admin/login' : '/login'}
                className="font-bold hover:underline"
                style={{ color: '#1C6F8E' }}
              >
                Masuk ke Portal Di Sini →
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* ─── MODAL BANTUAN KENDALA MASUK ─── */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div
            className="w-full max-w-lg bg-white rounded-2xl border shadow-xl p-6 space-y-5 text-left relative max-h-[90vh] overflow-y-auto"
            style={{ borderColor: '#BFEFFF' }}
          >
            <div className="flex justify-between items-start border-b pb-3" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-[#1C6F8E]" />
                <h3 className="font-bold text-base text-[#111827]">
                  Pusat Bantuan &amp; Panduan Masuk Akun
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg leading-none cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed" style={{ color: '#2E84A5' }}>
              {/* Poin 1: Lupa NISN */}
              <div className="p-3.5 rounded-xl border bg-slate-50 space-y-1" style={{ borderColor: '#E2E8F0' }}>
                <strong className="block text-[#111827] text-xs font-bold">
                  1. Bagaimana jika saya lupa atau salah ketik NISN?
                </strong>
                <p>
                  NISN dapat dilihat pada Rapor Sekolah, Ijazah jenjang sebelumnya, Kartu Pelajar, atau secara daring melalui portal resmi Kemdikbudristek (nisn.data.kemdikbud.go.id).
                </p>
              </div>

              {/* Poin 2: Lupa Kata Sandi */}
              <div className="p-3.5 rounded-xl border bg-slate-50 space-y-1" style={{ borderColor: '#E2E8F0' }}>
                <strong className="block text-[#111827] text-xs font-bold">
                  2. Akun Siswa Lupa Kata Sandi?
                </strong>
                <p>
                  Gunakan formulir pada tab <strong>Portal Siswa</strong> di halaman ini dengan memasukkan NISN dan Nama Lengkap yang terdaftar untuk membuat kata sandi baru secara instan.
                </p>
              </div>

              {/* Poin 3: Akses Staf / Admin */}
              <div className="p-3.5 rounded-xl border bg-slate-50 space-y-1" style={{ borderColor: '#E2E8F0' }}>
                <strong className="block text-[#111827] text-xs font-bold">
                  3. Kendala NIP atau Akun Petugas Guru BK / Satgas?
                </strong>
                <p>
                  Pastikan NIP 18 digit terdaftar dalam data SIMPPKSP sekolah. Jika akun terkunci, hubungi Kepala Sekolah atau Administrator Dinas Pendidikan dengan token otorisasi resmi.
                </p>
              </div>

              {/* Poin 4: Pelaporan Cepat Tanpa Akun */}
              <div className="p-3.5 rounded-xl border space-y-2" style={{ background: 'rgba(191, 239, 255, 0.25)', borderColor: '#BFEFFF' }}>
                <strong className="block text-[#1C6F8E] text-xs font-bold">
                  4. Butuh membuat aduan mendesak saat ini juga?
                </strong>
                <p>
                  Anda tetap dapat mengirim aduan perlindungan kekerasan secara anonim atau memeriksa progres tiket tanpa perlu masuk ke dalam akun.
                </p>
                <div className="flex gap-2 pt-1">
                  <Link
                    to="/buat-laporan"
                    onClick={() => setShowHelpModal(false)}
                    className="px-3 py-1.5 rounded-lg font-bold text-xs border transition hover:opacity-90"
                    style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                  >
                    Buat Aduan Cepat →
                  </Link>
                  <Link
                    to="/lacak"
                    onClick={() => setShowHelpModal(false)}
                    className="px-3 py-1.5 rounded-lg font-bold text-xs border transition hover:opacity-90 bg-white"
                    style={{ color: '#1C6F8E', borderColor: '#BFEFFF' }}
                  >
                    Lacak Kode Tiket →
                  </Link>
                </div>
              </div>

              {/* Kontak Hotline */}
              <div className="pt-2 text-[11px] text-slate-500 border-t flex justify-between items-center" style={{ borderColor: '#E2E8F0' }}>
                <span>Hotline Satgas SIGAP: <strong>0812-3456-7890</strong></span>
                <span>Email: <strong>bantuan@sigap.id</strong></span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold border transition cursor-pointer hover:bg-slate-50"
                style={{ borderColor: '#D1D5DB', color: '#111827' }}
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;