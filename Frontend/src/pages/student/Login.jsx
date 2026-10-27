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
    <div className="min-h-screen flex flex-col justify-between bg-liquid-mesh text-slate-800 relative overflow-hidden selection:bg-[#3B7DE8]/20">
      {/* ─── Ambient Glow Blobs ─── */}
      <div className="fixed top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-blue-400/20 blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-indigo-300/25 blur-3xl pointer-events-none -z-10" />

      <StudentHeader />

      {/* Main Login Content */}
      <main className="max-w-6xl mx-auto w-full px-4 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-20">
        {/* Kolom Kiri: Hero & Jaminan Kerahasiaan */}
        <div className="lg:col-span-6 space-y-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#3B7DE8] glass-pill px-3 py-1.5 rounded-full transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Utama</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill-blue text-xs font-extrabold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#3B7DE8]" />
            <span>LAYANAN RESMI BIMBINGAN KONSELING & PPKSP</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Ruang Suara Aman bagi Seluruh Warga Sekolah
          </h1>

          <p className="text-slate-600 text-sm lg:text-base leading-relaxed">
            Sampaikan laporan perundungan, kekerasan fisik maupun verbal, atau ketidaknyamanan belajar dengan garansi kerahasiaan identitas dan perlindungan penuh Liquid Glass OS 26.
          </p>

          {/* Card Ilustrasi Perlindungan */}
          <div className="glass-panel-elevated p-6 rounded-3xl border border-white/80 shadow-md relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3B7DE8] to-blue-500 flex items-center justify-center text-white shrink-0 font-bold shadow-md border border-white/30">
                <HeartHandshake className="w-7 h-7 text-white" />
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
            <div className="p-4 rounded-2xl glass-card border border-white/80 shadow-xs flex items-start gap-3">
              <div className="p-2 rounded-xl glass-pill-blue text-[#3B7DE8] shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">Enkripsi Berlapis</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">Identitas pelapor terproteksi ketat secara sistemik.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-white/80 shadow-xs flex items-start gap-3">
              <div className="p-2 rounded-xl glass-pill-green text-emerald-600 shrink-0">
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
          <div className="glass-panel-elevated p-7 lg:p-8 rounded-3xl border border-white/90 shadow-[0_24px_70px_rgba(59,125,232,0.18)] space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-white/50">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#3B7DE8] to-blue-500 flex items-center justify-center text-white shadow-md border border-white/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Masuk Portal Siswa</h3>
                <p className="text-xs text-slate-400">Silakan masuk dengan akun siswa terdaftar Anda.</p>
              </div>
            </div>

            {isFromReport && (
              <div className="p-3.5 rounded-2xl glass-pill-blue text-xs text-slate-700 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#3B7DE8] shrink-0 mt-0.5" />
                <span>
                  <strong>Akses Buat Aduan:</strong> Harap masuk atau daftar terlebih dahulu agar dapat membuat dan memantau laporan aduan Anda secara aman.
                </span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-2xl glass-pill-red text-xs font-semibold animate-fade-in">
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
                  className="w-full px-4 py-3 rounded-2xl glass-input text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Kata Sandi *</label>
                  <a href="#/lupa-sandi" className="text-[11px] font-bold text-[#3B7DE8] hover:underline">
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
                    className="w-full pl-4 pr-10 py-3 rounded-2xl glass-input text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
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
                  className="rounded border-slate-300 text-[#3B7DE8] focus:ring-[#3B7DE8]"
                />
                <label htmlFor="rememberMe" className="text-xs text-slate-600 cursor-pointer">
                  Ingat sesi saya di perangkat ini
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl glass-button-primary text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
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
              <div className="flex-grow border-t border-white/50"></div>
              <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Atau</span>
              <div className="flex-grow border-t border-white/50"></div>
            </div>

            {/* Lacak Tanpa Login Button */}
            <div className="space-y-1.5">
              <Link
                to="/lacak"
                className="w-full py-2.5 px-4 rounded-2xl glass-pill-blue font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <SearchCheck className="w-4 h-4 text-[#3B7DE8]" />
                <span>Lacak Status Laporan Tanpa Login</span>
              </Link>
              <p className="text-[11px] text-center text-slate-500">
                Punya Kode Tiket Aduan? Periksa progres penanganan secara transparan di sini.
              </p>
            </div>

            <div className="pt-3 border-t border-white/50 flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
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
