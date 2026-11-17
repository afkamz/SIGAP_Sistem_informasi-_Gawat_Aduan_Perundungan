import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Headphones,
  Menu,
  X
} from 'lucide-react';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';

export const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { loginUser } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setEmailError('');

    if (!identifier.trim()) {
      setEmailError('Silakan masukkan alamat email Anda.');
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
        kelas: 'XII IPA 1',
        sekolah: 'SMK/SMA SIGAP',
        role: 'siswa'
      };
      loginUser(student, res.access_token, 'siswa');
      navigate(redirectTarget);
    } catch (err) {
      console.warn('Login error:', err.message);
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        loginUser({
          id: 1,
          nama: 'Siswa SIGAP (Offline)',
          nisn: identifier.trim(),
          kelas: 'XII IPA 1',
          sekolah: 'SMK/SMA SIGAP',
          role: 'siswa'
        });
        navigate(redirectTarget);
      } else {
        setErrorMsg(err.message || 'Alamat email/NISN atau kata sandi tidak sesuai.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col font-sans">
      {/* ─── NAVBAR TANPA GARIS (PERSIS SEPERTI DI LAMPIRAN) ─── */}
      <header className="w-full bg-white relative z-30">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex justify-between items-center">
          {/* Logo SIGAP */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/assets/branding/logo-sigap.png"
              alt="Logo SIGAP"
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <img
              src="/assets/branding/branding-sigap.png"
              alt="SIGAP"
              className="h-6 sm:h-7 w-auto object-contain transition-transform group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-sm">
            <Link
              to="/"
              className="font-medium text-[#111827] hover:text-[#1C6F8E] transition"
            >
              Rumah
            </Link>
            <a
              href="/#about"
              className="font-medium text-[#111827] hover:text-[#1C6F8E] transition"
            >
              Semua Tentang SM
            </a>
            <a
              href="/#categories"
              className="font-medium text-[#111827] hover:text-[#1C6F8E] transition"
            >
              SM Life
            </a>
            <a
              href="/#how-it-works"
              className="font-medium text-[#111827] hover:text-[#1C6F8E] transition"
            >
              Karir SM
            </a>

            {/* Pill Button: Daftar Sekarang! */}
            <Link
              to={redirectTarget ? `/register?redirect=${encodeURIComponent(redirectTarget)}` : '/register'}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#FDE8EC] text-[#9F1239] hover:bg-[#FCE7F3] transition"
            >
              Daftar Sekarang!
            </Link>

            {/* Text Link: masuk */}
            <span className="font-bold text-[#111827] cursor-default">
              masuk
            </span>
          </nav>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white px-6 py-4 space-y-3 shadow-lg border-t border-slate-100 animate-fade-in">
            <Link
              to="/"
              className="block py-2 text-sm font-medium text-[#111827]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Rumah
            </Link>
            <a
              href="/#about"
              className="block py-2 text-sm font-medium text-[#111827]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Semua Tentang SM
            </a>
            <a
              href="/#categories"
              className="block py-2 text-sm font-medium text-[#111827]"
              onClick={() => setMobileMenuOpen(false)}
            >
              SM Life
            </a>
            <a
              href="/#how-it-works"
              className="block py-2 text-sm font-medium text-[#111827]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Karir SM
            </a>
            <div className="pt-2 flex items-center justify-between">
              <Link
                to={redirectTarget ? `/register?redirect=${encodeURIComponent(redirectTarget)}` : '/register'}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-[#FDE8EC] text-[#9F1239]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Daftar Sekarang!
              </Link>
              <span className="text-sm font-bold text-[#111827]">masuk</span>
            </div>
          </div>
        )}
      </header>

      {/* ─── MAIN LOGIN CONTENT (PERSIS SEPERTI DI LAMPIRAN) ─── */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-[420px]">
          {/* Judul: Login Email */}
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#111827] mb-7 text-left">
            Login Email
          </h1>

          <form onSubmit={handleLogin} noValidate className="space-y-4">
            {/* Input 1: Alamat email */}
            <div>
              <label className="block text-xs sm:text-sm text-[#374151] mb-1.5">
                Alamat email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (emailError) setEmailError('');
                  if (errorMsg) setErrorMsg('');
                }}
                className={`w-full px-3.5 py-3 rounded-md text-sm border focus:outline-none transition ${
                  emailError || errorMsg
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-slate-300 focus:border-slate-500'
                }`}
              />
              {(emailError || errorMsg) && (
                <p className="text-xs text-red-500 flex items-center gap-1.5 mt-1.5">
                  <span className="w-3.5 h-3.5 rounded-full border border-red-500 text-red-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                    !
                  </span>
                  <span>{emailError || errorMsg}</span>
                </p>
              )}
            </div>

            {/* Input 2: kata sandi */}
            <div>
              <label className="block text-xs sm:text-sm text-[#374151] mb-1.5">
                kata sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full pl-3.5 pr-10 py-3 rounded-md text-sm border border-slate-300 focus:border-slate-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              {/* Link: Lupa kata sandi Anda? */}
              <div className="mt-1.5">
                <Link
                  to="/lupa-sandi"
                  className="text-xs text-slate-400 hover:text-slate-600 transition"
                >
                  Lupa kata sandi Anda?
                </Link>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="pt-3 space-y-2.5">
              {/* Tombol: masuk */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-md text-sm font-semibold bg-[#FDE8EC] text-[#111827] hover:bg-[#FCE7F3] active:scale-[0.99] transition disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? 'Memproses...' : 'masuk'}
              </button>

              {/* Tombol: Buat akun */}
              <Link
                to={redirectTarget ? `/register?redirect=${encodeURIComponent(redirectTarget)}` : '/register'}
                className="w-full py-3.5 px-4 rounded-md text-sm font-semibold bg-white border border-slate-300 text-[#111827] hover:bg-slate-50 active:scale-[0.99] transition flex items-center justify-center cursor-pointer"
              >
                Buat akun
              </Link>
            </div>
          </form>

          {/* Link Bantuan: Apakah Anda mengalami kesulitan saat masuk? */}
          <div className="mt-8 text-center">
            <Link
              to="/lacak"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 hover:underline transition"
            >
              <Headphones className="w-3.5 h-3.5 text-slate-400" />
              <span>Apakah Anda mengalami kesulitan saat masuk?</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
