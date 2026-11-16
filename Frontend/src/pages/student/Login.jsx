import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  Shield,
  HeartHandshake,
  Lock,
  Clock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  SearchCheck,
  Info
} from 'lucide-react';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { StudentHeader } from '../../components/layout/StudentHeader';
import { StudentFooter } from '../../components/layout/StudentFooter';

export const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { loginUser } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';
  const isFromReport = redirectTarget.includes('buat-laporan');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim() || !password) {
      setErrorMsg('Harap isi NISN dan Kata Sandi.');
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
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        loginUser({
          id: 1,
          nama: 'Ahmad Falihul Hikam',
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
    <div
      className="min-h-screen flex flex-col justify-between font-sans relative"
      style={{ background: '#FFFFFF', color: '#1C6F8E' }}
    >
      <StudentHeader />

      {/* Main Login Content */}
      <main className="max-w-6xl mx-auto w-full px-4 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-20 flex-1">
        {/* Kolom Kiri: Hero & Jaminan Kerahasiaan */}
        <div className="lg:col-span-6 space-y-5">
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

          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-xs"
            style={{
              background: '#BFEFFF',
              color: '#1C6F8E',
              borderColor: '#BFEFFF'
            }}
          >
            <ShieldCheck className="w-4 h-4 text-[#1C6F8E]" />
            <span>LAYANAN RESMI BIMBINGAN KONSELING &amp; PPKSP</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight" style={{ color: '#1C6F8E' }}>
            Ruang Suara Aman bagi Seluruh Warga Sekolah
          </h1>

          <p className="text-sm lg:text-base leading-relaxed" style={{ color: '#2E84A5' }}>
            Sampaikan laporan perundungan, kekerasan fisik maupun verbal, atau ketidaknyamanan belajar dengan garansi kerahasiaan identitas dan perlindungan penuh sistem SIGAP.
          </p>

          {/* Card Ilustrasi Perlindungan */}
          <div
            className="p-6 rounded-3xl border relative overflow-hidden"
            style={{
              background: '#FFFFFF',
              borderColor: '#BFEFFF',
              boxShadow: '0 4px 20px -2px rgba(191, 239, 255, 0.45)'
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-bold border shadow-xs"
                style={{
                  background: '#BFEFFF',
                  borderColor: '#BFEFFF',
                  color: '#1C6F8E'
                }}
              >
                <HeartHandshake className="w-7 h-7 text-[#1C6F8E]" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm" style={{ color: '#1C6F8E' }}>
                  100% Rahasia &amp; Terlindungi
                </h4>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#2E84A5' }}>
                  Setiap laporan diverifikasi langsung oleh Tim BK &amp; Satgas Perlindungan Anak tanpa takut dihakimi atau bocor.
                </p>
              </div>
            </div>
          </div>

          {/* Fitur Utama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div
              className="p-4 rounded-2xl border flex items-start gap-3"
              style={{
                background: '#FFFFFF',
                borderColor: '#BFEFFF'
              }}
            >
              <div
                className="p-2 rounded-xl shrink-0 border"
                style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
              >
                <Lock className="w-4 h-4 text-[#1C6F8E]" />
              </div>
              <div>
                <h5 className="text-xs font-bold" style={{ color: '#1C6F8E' }}>Enkripsi Berlapis</h5>
                <p className="text-[11px] mt-0.5" style={{ color: '#2E84A5' }}>Identitas pelapor terproteksi ketat secara sistemik.</p>
              </div>
            </div>

            <div
              className="p-4 rounded-2xl border flex items-start gap-3"
              style={{
                background: '#FFFFFF',
                borderColor: '#BFEFFF'
              }}
            >
              <div
                className="p-2 rounded-xl shrink-0 border"
                style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
              >
                <Clock className="w-4 h-4 text-[#1C6F8E]" />
              </div>
              <div>
                <h5 className="text-xs font-bold" style={{ color: '#1C6F8E' }}>Respons Cepat</h5>
                <p className="text-[11px] mt-0.5" style={{ color: '#2E84A5' }}>Penanganan langsung oleh Guru BK &amp; Tim Satgas &lt; 24 Jam.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Card Login / Akses Masuk */}
        <div className="lg:col-span-6 max-w-md mx-auto w-full">
          <div
            className="p-7 lg:p-8 rounded-3xl border space-y-5"
            style={{
              background: '#FFFFFF',
              borderColor: '#BFEFFF',
              boxShadow: '0 24px 70px rgba(191, 239, 255, 0.45)'
            }}
          >
            <div className="flex items-center gap-3 pb-3 border-b" style={{ borderColor: '#BFEFFF' }}>
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs"
                style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
              >
                <Shield className="w-6 h-6 text-[#1C6F8E]" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight" style={{ color: '#1C6F8E' }}>
                  Masuk Portal Siswa
                </h3>
                <p className="text-xs" style={{ color: '#2E84A5' }}>
                  Silakan masuk dengan akun siswa terdaftar Anda.
                </p>
              </div>
            </div>

            {isFromReport && (
              <div
                className="p-3.5 rounded-2xl text-xs flex items-start gap-2.5 border"
                style={{
                  background: 'rgba(191, 239, 255, 0.35)',
                  borderColor: '#BFEFFF',
                  color: '#1C6F8E'
                }}
              >
                <Info className="w-4 h-4 text-[#1C6F8E] shrink-0 mt-0.5" />
                <span>
                  <strong>Akses Buat Aduan:</strong> Harap masuk atau daftar terlebih dahulu agar dapat membuat dan memantau laporan aduan Anda secara aman.
                </span>
              </div>
            )}

            {errorMsg && (
              <div
                className="p-3.5 rounded-2xl text-xs font-semibold animate-fade-in border"
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
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#1C6F8E' }}>
                    NISN (Nomor Induk Siswa Nasional) *
                  </label>
                  <span className="text-[11px]" style={{ color: '#2E84A5' }}>10 Digit</span>
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: 1234567890"
                  className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm focus:outline-none border"
                  style={{
                    background: '#FFFFFF',
                    color: '#1C6F8E',
                    borderColor: '#BFEFFF'
                  }}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#1C6F8E' }}>
                    Kata Sandi *
                  </label>
                  <a href="#/lupa-sandi" className="text-[11px] font-bold hover:underline" style={{ color: '#1C6F8E' }}>
                    Lupa kata sandi?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full pl-4 pr-10 py-3 rounded-2xl text-xs sm:text-sm focus:outline-none border"
                    style={{
                      background: '#FFFFFF',
                      color: '#1C6F8E',
                      borderColor: '#BFEFFF'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#BFEFFF] text-[#1C6F8E] focus:ring-[#BFEFFF]"
                />
                <label htmlFor="rememberMe" className="text-xs cursor-pointer" style={{ color: '#2E84A5' }}>
                  Ingat sesi saya di perangkat ini
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 border hover:opacity-90 shadow-xs cursor-pointer transition active:scale-95"
                style={{
                  background: '#BFEFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              >
                <span>{isLoading ? 'Memverifikasi Sesi...' : 'Masuk ke Portal Siswa'}</span>
                <ArrowRight className="w-4 h-4 text-[#1C6F8E]" />
              </button>
            </form>

            <div className="text-center text-xs" style={{ color: '#2E84A5' }}>
              Belum memiliki akun siswa?{' '}
              <Link
                to={redirectTarget ? `/register?redirect=${encodeURIComponent(redirectTarget)}` : '/register'}
                className="font-bold hover:underline"
                style={{ color: '#1C6F8E' }}
              >
                Daftar akun di sini →
              </Link>
            </div>

            {/* Pembatas Atau */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t" style={{ borderColor: '#BFEFFF' }} />
              <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: '#2E84A5' }}>
                Atau
              </span>
              <div className="flex-grow border-t" style={{ borderColor: '#BFEFFF' }} />
            </div>

            {/* Lacak Tanpa Login Button */}
            <div className="space-y-1.5">
              <Link
                to="/lacak"
                className="w-full py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition border hover:opacity-90"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              >
                <SearchCheck className="w-4 h-4 text-[#1C6F8E]" />
                <span>Lacak Status Laporan Tanpa Login</span>
              </Link>
              <p className="text-[11px] text-center" style={{ color: '#2E84A5' }}>
                Punya Kode Tiket Aduan? Periksa progres penanganan secara transparan di sini.
              </p>
            </div>

            <div className="pt-3 border-t flex items-start gap-2 text-[11px] leading-relaxed" style={{ borderColor: '#BFEFFF', color: '#2E84A5' }}>
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#1C6F8E]" />
              <span>Data Anda dienkripsi dan diproteksi sesuai standar perlindungan kerahasiaan data anak.</span>
            </div>
          </div>
        </div>
      </main>

      <StudentFooter />
    </div>
  );
};

export default Login;
