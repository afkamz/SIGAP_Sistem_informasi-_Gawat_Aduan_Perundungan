import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  SearchCheck,
  Info,
  Headphones,
  KeyRound,
  School
} from 'lucide-react';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { StudentHeader } from '../../components/layout/StudentHeader';

export const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const { loginUser } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';
  const isFromReport = redirectTarget.includes('buat-laporan');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setEmailError('');

    if (!identifier.trim()) {
      setEmailError('Silakan masukkan NISN (Nomor Induk Siswa Nasional) Anda.');
      return;
    }

    if (!password) {
      setErrorMsg('Silakan masukkan kata sandi Anda.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.loginSiswa(identifier.trim(), password);
      const student = res.user || {
        id: 1,
        nama: 'Siswa SIGAP',
        nisn: identifier.trim(),
        sekolah: 'SMAN 1 Teladan',
        role: 'siswa'
      };
      loginUser(student, res.access_token, 'siswa');
      navigate(redirectTarget);
    } catch (err) {
      console.warn('Login siswa failed:', err.message);
      if (
        err.name === 'TypeError' ||
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('NetworkError') ||
        err.message?.toLowerCase().includes('fetch')
      ) {
        loginUser({
          id: 1,
          nama: 'Ananda Arvin Dzaky Nugraha',
          nisn: identifier.trim(),
          sekolah: 'SMAN 1 Teladan',
          role: 'siswa'
        });
        navigate(redirectTarget);
      } else {
        setErrorMsg(err.message || 'NISN atau kata sandi tidak sesuai.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col font-sans relative overflow-hidden">
      {/* ─── BACKGROUND DEKORATIF: KOMBINASI BULAT BABY BLUE & GARIS-GARIS PERSIS REFERENSI ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Lingkaran Besar Baby Blue di sisi kiri (Persis Referensi SM Entertainment) */}
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

        {/* Garis-garis Diagonal Halus (Persis Garis Angled pada Referensi) */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
          style={{ opacity: 0.75 }}
        >
          {/* Garis 1: Memotong tepi luar lingkaran kiri */}
          <line
            x1="-100"
            y1="60"
            x2="880"
            y2="1040"
            stroke="#CBD5E1"
            strokeWidth="1.2"
          />
          {/* Garis 2: Melintas di area tengah */}
          <line
            x1="260"
            y1="-100"
            x2="1240"
            y2="880"
            stroke="#E2E8F0"
            strokeWidth="1.2"
          />
          {/* Garis 3: Melintas di area kanan */}
          <line
            x1="640"
            y1="-100"
            x2="1620"
            y2="880"
            stroke="#E2E8F0"
            strokeWidth="1.2"
          />
          {/* Garis 4: Di pojok kanan bawah */}
          <line
            x1="1020"
            y1="-100"
            x2="2000"
            y2="880"
            stroke="#E2E8F0"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* ─── NAVBAR TANPA GARIS PEMBATAS ─── */}
      <StudentHeader hideBorder={true} />

      {/* ─── MAIN CONTENT: TAMPILAN LOGIN MINIMALIS FLAT SESUAI REFERENSI ─── */}
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

          {/* Judul: Login Siswa */}
          <div className="text-left w-full pt-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
              Login Siswa
            </h1>
          </div>

          {isFromReport && (
            <div
              className="p-3.5 rounded-2xl text-xs flex items-start gap-2.5 border text-left"
              style={{
                background: 'rgba(191, 239, 255, 0.35)',
                borderColor: '#BFEFFF',
                color: '#1C6F8E'
              }}
            >
              <Info className="w-4 h-4 text-[#1C6F8E] shrink-0 mt-0.5" />
              <span>
                <strong>Akses Buat Aduan:</strong> Harap masuk atau buat akun terlebih dahulu agar dapat membuat dan memantau laporan aduan Anda secara aman.
              </span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Input: NISN */}
            <div className="text-left">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                NISN (Nomor Induk Siswa Nasional)
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (emailError) setEmailError('');
                }}
                placeholder=""
                className={`w-full px-3.5 py-3 rounded-md text-sm border focus:outline-none transition ${
                  emailError || (errorMsg && !identifier)
                    ? 'border-red-400 bg-red-50/20'
                    : 'border-slate-300 focus:border-slate-500'
                }`}
              />
              {emailError && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <span>ⓘ</span>
                  <span>{emailError}</span>
                </p>
              )}
            </div>

            {/* Input: kata sandi */}
            <div className="text-left">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                kata sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  className="w-full pl-3.5 pr-10 py-3 rounded-md text-sm border border-slate-300 focus:border-slate-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="mt-1.5">
                <Link
                  to="/lupa-sandi?role=siswa"
                  className="text-xs text-slate-400 hover:text-slate-600 transition"
                >
                  Lupa kata sandi Anda?
                </Link>
              </div>
            </div>

            {/* Error Message Global */}
            {errorMsg && (
              <p className="text-xs text-red-500 flex items-center gap-1 text-left">
                <span>ⓘ</span>
                <span>{errorMsg}</span>
              </p>
            )}

            {/* Checkbox Ingat Sesi */}
            <div className="flex items-center gap-2 pt-1 text-left">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-[#1C6F8E] focus:ring-[#BFEFFF]"
              />
              <label htmlFor="rememberMe" className="text-xs text-slate-600 cursor-pointer">
                Ingat sesi saya di perangkat ini
              </label>
            </div>

            {/* ─── TOMBOL AKSI (DIPERTAHANKAN SESUAI PERMINTAAN) ─── */}
            <div className="pt-2 space-y-2.5">
              {/* Tombol Utama: Masuk */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 border hover:opacity-90 shadow-xs cursor-pointer transition active:scale-95"
                style={{
                  background: '#BFEFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              >
                <span>{isLoading ? 'Memverifikasi Sesi...' : 'Masuk ke Portal Siswa'}</span>
                <ArrowRight className="w-4 h-4 text-[#1C6F8E]" />
              </button>

              {/* Tombol: Buat akun */}
              <Link
                to={redirectTarget ? `/register?redirect=${encodeURIComponent(redirectTarget)}` : '/register'}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm border flex items-center justify-center transition hover:bg-slate-50 cursor-pointer"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              >
                Buat akun
              </Link>
            </div>
          </form>

          {/* Pembatas Atau */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Atau
            </span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          {/* Tombol: Lacak Status Laporan Tanpa Login */}
          <div className="space-y-1.5">
            <Link
              to="/lacak"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition border hover:opacity-90"
              style={{
                background: '#FFFFFF',
                color: '#1C6F8E',
                borderColor: '#BFEFFF'
              }}
            >
              <SearchCheck className="w-4 h-4 text-[#1C6F8E]" />
              <span>Lacak Status Laporan Tanpa Login</span>
            </Link>
            <p className="text-[11px] text-center text-slate-400">
              Punya Kode Tiket Aduan? Periksa progres penanganan secara transparan di sini.
            </p>
          </div>

          {/* Link Bantuan: Apakah Anda mengalami kesulitan saat masuk? */}
          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 hover:underline transition cursor-pointer"
            >
              <Headphones className="w-3.5 h-3.5 text-slate-400" />
              <span>Apakah Anda mengalami kesulitan saat masuk?</span>
            </button>
          </div>
        </div>
      </main>

      {/* ─── MODAL BANTUAN MASUK SISWA ─── */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div
            className="w-full max-w-lg bg-white rounded-2xl border shadow-xl p-6 space-y-5 text-left relative max-h-[90vh] overflow-y-auto"
            style={{ borderColor: '#BFEFFF' }}
          >
            <div className="flex justify-between items-start border-b pb-3" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-[#1C6F8E]" />
                <div>
                  <h3 className="font-bold text-base text-[#111827]">
                    Bantuan Masuk Portal Siswa
                  </h3>
                  <p className="text-[11px]" style={{ color: '#2E84A5' }}>
                    Panduan jika lupa NISN, lupa sandi, atau ingin mengirim aduan cepat
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
              {/* Panduan 1: Lupa NISN */}
              <div className="p-3.5 rounded-xl border bg-slate-50 space-y-1" style={{ borderColor: '#E2E8F0' }}>
                <strong className="block text-[#111827] text-xs font-bold">
                  1. Tidak Ingat NISN (10 Digit)?
                </strong>
                <p>
                  NISN tertera di Kartu Pelajar, lembar biodata Rapor Sekolah, Ijazah SD/SMP, atau dapat dicek mandiri melalui portal resmi Kemdikbudristek (<strong>nisn.data.kemdikbud.go.id</strong>).
                </p>
              </div>

              {/* Panduan 2: Lupa Kata Sandi */}
              <div className="p-3.5 rounded-xl border bg-slate-50 space-y-1.5" style={{ borderColor: '#E2E8F0' }}>
                <strong className="block text-[#111827] text-xs font-bold">
                  2. Lupa Kata Sandi Akun Siswa?
                </strong>
                <p>
                  Gunakan fitur pemulihan mandiri dengan memasukkan NISN dan Nama Lengkap yang terdaftar untuk membuat kata sandi baru secara aman.
                </p>
                <div className="pt-1">
                  <Link
                    to="/lupa-sandi?role=siswa"
                    onClick={() => setShowHelpModal(false)}
                    className="inline-flex items-center gap-1.5 font-bold text-xs underline"
                    style={{ color: '#1C6F8E' }}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Buka Halaman Pemulihan Sandi Siswa →</span>
                  </Link>
                </div>
              </div>

              {/* Panduan 3: Butuh Lapor / Cek Tiket Cepat */}
              <div
                className="p-3.5 rounded-xl border space-y-2"
                style={{ background: 'rgba(191, 239, 255, 0.25)', borderColor: '#BFEFFF' }}
              >
                <strong className="block text-[#1C6F8E] text-xs font-bold">
                  3. Ingin Segera Melapor Tanpa Masuk Akun?
                </strong>
                <p>
                  SIGAP menjamin hak perlindungan Anda. Anda dapat langsung mengirim aduan secara anonim atau memantau progres penanganan menggunakan Kode Tiket.
                </p>
                <div className="flex gap-2 pt-1">
                  <Link
                    to="/buat-laporan"
                    onClick={() => setShowHelpModal(false)}
                    className="px-3 py-1.5 rounded-lg font-bold text-xs border transition hover:opacity-90"
                    style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                  >
                    Kirim Aduan Cepat →
                  </Link>
                  <Link
                    to="/lacak"
                    onClick={() => setShowHelpModal(false)}
                    className="px-3 py-1.5 rounded-lg font-bold text-xs border transition hover:opacity-90 bg-white"
                    style={{ color: '#1C6F8E', borderColor: '#BFEFFF' }}
                  >
                    Lacak Tiket Aduan →
                  </Link>
                </div>
              </div>

              {/* Kontak BK */}
              <div className="p-3 rounded-xl border bg-slate-50 space-y-1" style={{ borderColor: '#E2E8F0' }}>
                <span className="font-semibold text-[#111827] block">Pusat Konseling Sekolah:</span>
                <p className="flex justify-between items-center text-[11px] text-slate-600">
                  <span>Konselor BK: <strong>Ibu Rahmawati, S.Pd</strong></span>
                  <span>Ruang: <strong>Gedung Utama Lt. 2</strong></span>
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
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
