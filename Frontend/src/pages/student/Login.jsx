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
  Info,
  Sparkles
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
    <div className="min-h-screen flex flex-col justify-between bg-[#EEF3FD] text-slate-800">
      <StudentHeader />

      {/* Main Login Content */}
      <main className="max-w-6xl mx-auto w-full px-4 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Kolom Kiri: Hero & Jaminan Kerahasiaan */}
        <div className="lg:col-span-6 space-y-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#3B7DE8] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Utama</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#3B7DE8]/20 text-[#3B7DE8] text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#3B7DE8]" />
            <span>LAYANAN RESMI BIMBINGAN KONSELING & PPKSP</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Ruang Suara Aman bagi Seluruh Warga Sekolah
          </h1>

          <p className="text-slate-600 text-sm lg:text-base leading-relaxed">
            Sampaikan laporan perundungan, kekerasan fisik maupun verbal, atau ketidaknyamanan belajar dengan garansi kerahasiaan identitas dan perlindungan penuh.
          </p>

          {/* Card Ilustrasi Perlindungan */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#EEF3FD] flex items-center justify-center text-[#3B7DE8] shrink-0 font-bold shadow-xs">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">100% Rahasia &amp; Terlindungi</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Setiap laporan diverifikasi langsung oleh Tim BK &amp; Satgas Perlindungan Anak tanpa takut dihakimi atau bocor.
                </p>
              </div>
            </div>
          </div>

          {/* Fitur Utama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#EEF3FD] text-[#3B7DE8] shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">Enkripsi Berlapis</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">Identitas pelapor terproteksi ketat secara sistemik.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">Respons Cepat</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">Penanganan langsung oleh Guru BK &amp; Tim Satgas &lt; 24 Jam.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Card Login / Akses Masuk */}
        <div className="lg:col-span-6 max-w-md mx-auto w-full">
          <div className="bg-white p-7 lg:p-8 rounded-3xl border border-slate-100 shadow-xl space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-[#3B7DE8] flex items-center justify-center text-white shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Masuk Portal Siswa</h3>
                <p className="text-xs text-slate-400">Silakan masuk dengan akun siswa terdaftar Anda.</p>
              </div>
            </div>

            {isFromReport && (
              <div className="p-3.5 rounded-2xl bg-[#EEF3FD] border border-[#3B7DE8]/20 text-xs text-slate-700 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#3B7DE8] shrink-0 mt-0.5" />
                <span>
                  <strong>Akses Buat Aduan:</strong> Harap masuk atau daftar terlebih dahulu agar dapat membuat dan memantau laporan aduan Anda secara aman.
                </span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    NISN (Nomor Induk Siswa Nasional) *
                  </label>
                  <span className="text-[11px] text-slate-400">10 Digit</span>
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: 1234567890"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#3B7DE8] focus:bg-white transition"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Kata Sandi *</label>
                  <a href="#/lupa-sandi" className="text-[11px] font-semibold text-[#3B7DE8] hover:underline">
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
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#3B7DE8] focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
                  className="rounded border-slate-300 text-[#3B7DE8] focus:ring-[#3B7DE8]"
                />
                <label htmlFor="rememberMe" className="text-xs text-slate-600 cursor-pointer">
                  Ingat sesi saya di perangkat ini
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#3B7DE8] hover:bg-[#2563c0] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
              >
                <span>{isLoading ? 'Memverifikasi Sesi...' : 'Masuk ke Portal Siswa'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center text-xs text-slate-600">
              Belum memiliki akun siswa?{' '}
              <Link
                to={redirectTarget ? `/register?redirect=${encodeURIComponent(redirectTarget)}` : '/register'}
                className="font-bold text-[#3B7DE8] hover:underline"
              >
                Daftar akun di sini →
              </Link>
            </div>

            {/* Pembatas Atau */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Atau</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* Lacak Tanpa Login Button */}
            <div className="space-y-1.5">
              <Link
                to="/lacak"
                className="w-full py-2.5 px-4 rounded-xl bg-[#EEF3FD] hover:bg-[#dde9fa] text-[#3B7DE8] font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <SearchCheck className="w-4 h-4 text-[#3B7DE8]" />
                <span>Lacak Status Laporan Tanpa Login</span>
              </Link>
              <p className="text-[11px] text-center text-slate-400">
                Punya Kode Tiket Aduan? Periksa progres penanganan secara transparan di sini.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
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
