import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  Headphones,
  KeyRound,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';

export const AdminLogin = () => {
  const [nip, setNip] = useState('198001012026');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const { loginUser } = useStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      // Panggil backend FastAPI
      const res = await api.loginAdmin(nip.trim(), password);
      const adminData = res.user || {
        id: 1,
        nama: 'Ibu Rahmawati, S.Pd',
        nip: nip.trim(),
        jabatan: 'Konselor BK Utama',
        role: 'admin'
      };
      loginUser(adminData, res.access_token, 'admin');
      navigate('/admin/dashboard');
    } catch (err) {
      console.warn('Admin login error:', err.message);
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        // Fallback jika backend offline saat testing lokal
        loginUser(
          {
            id: 1,
            nama: 'Ibu Rahmawati, S.Pd (Offline)',
            nip: nip.trim(),
            jabatan: 'Konselor BK Utama',
            role: 'admin'
          },
          'mock-admin-token-offline',
          'admin'
        );
        navigate('/admin/dashboard');
      } else {
        setErrorMsg(err.message || 'NIP atau kata sandi admin tidak valid.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col font-sans relative overflow-hidden">
      {/* ─── BACKGROUND DEKORATIF: KOMBINASI BULAT BABY BLUE & GARIS-GARIS DIAGONAL ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Lingkaran Besar Baby Blue di sisi kiri */}
        <div
          className="absolute -left-28 sm:-left-40 md:-left-52 top-[12%] sm:top-[16%] w-[340px] sm:w-[480px] md:w-[580px] h-[340px] sm:h-[480px] md:h-[580px] rounded-full"
          style={{
            background: 'linear-gradient(135deg, #BFEFFF 0%, #D6F5FF 100%)',
            opacity: 0.82
          }}
        />

        {/* Lingkaran Aksen Halus di kanan bawah untuk keseimbangan estetika */}
        <div
          className="hidden md:block absolute -right-24 -bottom-24 w-[320px] h-[320px] rounded-full"
          style={{
            background: 'linear-gradient(135deg, #E6F8FF 0%, #BFEFFF 100%)',
            opacity: 0.45
          }}
        />

        {/* Garis-garis Diagonal Halus */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
          style={{ opacity: 0.75 }}
        >
          <line x1="-100" y1="60" x2="880" y2="1040" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="260" y1="-100" x2="1240" y2="880" stroke="#E2E8F0" strokeWidth="1.2" />
          <line x1="640" y1="-100" x2="1620" y2="880" stroke="#E2E8F0" strokeWidth="1.2" />
          <line x1="1020" y1="-100" x2="2000" y2="880" stroke="#E2E8F0" strokeWidth="1.2" />
        </svg>
      </div>

      {/* ─── NAVBAR TANPA GARIS PEMBATAS DENGAN LOGO DI SISI KIRI ─── */}
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
            | Portal Admin &amp; Konselor BK
          </span>
        </Link>
        <div
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border shadow-xs"
          style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#1C6F8E]" />
          <span>Terenkripsi JWT</span>
        </div>
      </header>

      {/* ─── MAIN CONTENT: TAMPILAN LOGIN ADMIN MINIMALIS FLAT SESUAI REFERENSI ─── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative z-20">
        <div className="w-full max-w-[420px] space-y-5">
          {/* Tombol Kembali ke Halaman Utama */}
          <div className="w-full flex justify-start">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full transition border hover:opacity-90"
              style={{
                background: '#FFFFFF',
                color: '#1C6F8E',
                borderColor: '#BFEFFF'
              }}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#1C6F8E]" />
              <span>Kembali ke Halaman Utama</span>
            </Link>
          </div>

          {/* Judul: Login Admin */}
          <div className="text-left w-full pt-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
              Masuk sebagai Admin
            </h1>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: '#2E84A5' }}>
              Akses khusus Guru Bimbingan Konseling (BK), Satgas PPKSP, dan Tim Pengawas Satuan Pendidikan.
            </p>
          </div>

          {errorMsg && (
            <div
              className="p-3.5 rounded-xl text-xs font-semibold animate-fade-in border"
              style={{
                background: '#FFF5F5',
                borderColor: '#FEB2B2',
                color: '#C53030'
              }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Input: NIP */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-[#111827]">
                  NIP (Nomor Induk Pegawai)
                </label>
                <span className="text-[11px]" style={{ color: '#2E84A5' }}>Format 18 Digit</span>
              </div>
              <input
                type="text"
                required
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="Contoh: 198001012026"
                className="w-full px-3.5 py-2.5 rounded-md text-sm border focus:outline-none transition"
                style={{
                  background: '#FFFFFF',
                  color: '#111827',
                  borderColor: '#D1D5DB'
                }}
                onFocus={(e) => (e.target.style.borderColor = '#1C6F8E')}
                onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
              />
            </div>

            {/* Input: Kata Sandi */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-[#111827]">Kata sandi</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-md text-sm border focus:outline-none transition"
                  style={{
                    background: '#FFFFFF',
                    color: '#111827',
                    borderColor: '#D1D5DB'
                  }}
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

            {/* Remember Me & Lupa Sandi */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer" style={{ color: '#2E84A5' }}>
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#1C6F8E] focus:ring-[#1C6F8E]" />
                <span>Ingat perangkat ini</span>
              </label>
              <Link to="/lupa-sandi?role=admin" className="font-semibold hover:underline" style={{ color: '#1C6F8E' }}>
                Lupa kata sandi Anda?
              </Link>
            </div>

            {/* Tombol: Masuk ke Panel Admin */}
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
                <span>{isLoading ? 'Memvalidasi Sesi...' : 'Masuk ke Panel Admin'}</span>
              </button>
            </div>
          </form>

          {/* SOP Legal Alert Notice */}
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
              <strong className="block mb-0.5">Area Akses Terbatas Personel Resmi</strong>
              <p className="text-[11px] leading-relaxed" style={{ color: '#2E84A5' }}>
                Sistem ini hanya diperuntukkan bagi personel sekolah dan dinas pendidikan resmi yang berwenang. Segala bentuk akses tanpa hak akan dicatat ke dalam audit trail.
              </p>
            </div>
          </div>

          <div className="text-center text-xs pt-1 space-x-2" style={{ color: '#2E84A5' }}>
            <span>Bukan staf atau guru?</span>
            <Link to="/login" className="font-bold hover:underline" style={{ color: '#1C6F8E' }}>
              Masuk ke Portal Siswa →
            </Link>
          </div>

          {/* Link Bantuan: Apakah Anda mengalami kesulitan saat masuk? */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="inline-flex items-center gap-1.5 text-xs hover:underline transition cursor-pointer"
              style={{ color: '#2E84A5' }}
            >
              <Headphones className="w-3.5 h-3.5" style={{ color: '#1C6F8E' }} />
              <span>Apakah Anda mengalami kesulitan saat masuk?</span>
            </button>
          </div>
        </div>
      </main>

      {/* ─── MODAL PUSAT BANTUAN AKSES ADMIN & GURU BK ─── */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div
            className="w-full max-w-lg bg-white rounded-2xl border shadow-xl p-6 space-y-5 text-left relative max-h-[90vh] overflow-y-auto"
            style={{ borderColor: '#BFEFFF' }}
          >
            <div className="flex justify-between items-start border-b pb-3" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#1C6F8E]" />
                <div>
                  <h3 className="font-bold text-base text-[#111827]">
                    Pusat Bantuan Personel Satgas &amp; Guru BK
                  </h3>
                  <p className="text-[11px]" style={{ color: '#2E84A5' }}>
                    Prosedur pemecahan masalah kendala login portal staf SIGAP
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg leading-none cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs leading-relaxed" style={{ color: '#2E84A5' }}>
              {/* Panduan 1: NIP Tidak Terdaftar */}
              <div className="p-3.5 rounded-xl border bg-slate-50 space-y-1" style={{ borderColor: '#E2E8F0' }}>
                <strong className="block text-[#111827] text-xs font-bold">
                  1. NIP Tidak Terdaftar atau Salah Format?
                </strong>
                <p>
                  Pastikan Anda menginput NIP 18 digit resmi tanpa tanda spasi atau titik. NIP petugas terdaftar disinkronkan melalui Dapodik / SIM-Tendik sekolah yang diverifikasi oleh Kepala Sekolah.
                </p>
              </div>

              {/* Panduan 2: Lupa Kata Sandi Akun Petugas */}
              <div className="p-3.5 rounded-xl border bg-slate-50 space-y-1.5" style={{ borderColor: '#E2E8F0' }}>
                <strong className="block text-[#111827] text-xs font-bold">
                  2. Lupa Kata Sandi Petugas?
                </strong>
                <p>
                  Gunakan halaman Pemulihan Akses Akun Resmi atau koordinasikan dengan Koordinator Satgas PPKSP untuk penerbitan token otorisasi reset sandi.
                </p>
                <div className="pt-1">
                  <Link
                    to="/lupa-sandi?role=admin"
                    onClick={() => setShowHelpModal(false)}
                    className="inline-flex items-center gap-1.5 font-bold text-xs underline"
                    style={{ color: '#1C6F8E' }}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Buka Halaman Pemulihan Sandi Admin →</span>
                  </Link>
                </div>
              </div>

              {/* Panduan 3: Penanganan Kasus Darurat */}
              <div
                className="p-3.5 rounded-xl border space-y-2"
                style={{ background: 'rgba(191, 239, 255, 0.25)', borderColor: '#BFEFFF' }}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#1C6F8E]" />
                  <strong className="block text-[#1C6F8E] text-xs font-bold">
                    3. Ada Kasus Kekerasan Mendesak yang Perlu Segera Ditindak?
                  </strong>
                </div>
                <p>
                  Jika akun sedang mengalami kendala otentikasi namun korban membutuhkan perlindungan seketika, segera gunakan nomor darurat internal Satgas PPKSP atau akses kanal pelaporan cepat.
                </p>
              </div>

              {/* Kontak Helpdesk Resmi */}
              <div className="p-3 rounded-xl border bg-slate-50 space-y-1" style={{ borderColor: '#E2E8F0' }}>
                <span className="font-semibold text-[#111827] block">Kontak Bantuan IT &amp; Disdik:</span>
                <p className="flex justify-between items-center text-[11px] text-slate-600">
                  <span>Helpdesk Satgas PPKSP: <strong>0811-9876-5432</strong></span>
                  <span>Email: <strong>satgas.bk@sigap.id</strong></span>
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t" style={{ borderColor: '#E2E8F0' }}>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold border transition cursor-pointer hover:bg-slate-50"
                style={{ borderColor: '#D1D5DB', color: '#111827' }}
              >
                Tutup Bantuan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
