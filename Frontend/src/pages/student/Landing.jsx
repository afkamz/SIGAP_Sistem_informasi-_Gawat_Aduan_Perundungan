import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Shield,
  HeartHandshake,
  Lock,
  Clock,
  Eye,
  EyeOff,
  ArrowRight,
  SearchCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StudentHeader } from '../../components/layout/StudentHeader';
import { StudentFooter } from '../../components/layout/StudentFooter';

export const Landing = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { loginUser } = useStore();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier || !password) {
      setErrorMsg('Harap isi NISN / NIP dan Kata Sandi.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Mock student login
      loginUser({
        id: 1,
        nama: 'Ahmad Falihul Hikam',
        nisn: identifier,
        sekolah: 'SMAN 1 Teladan',
        role: 'siswa'
      });
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-slate-800">
      <StudentHeader />

      {/* Main Onboarding Content (Grid 2 Kolom Sesuai Wireframe) */}
      <main className="max-w-6xl mx-auto w-full px-4 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Kolom Kiri: Hero & Jaminan Kerahasiaan */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-sky-700" />
            <span>LAYANAN RESMI BIMBINGAN KONSELING</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Ruang Suara Aman bagi Seluruh Warga Sekolah
          </h1>

          <p className="text-slate-600 text-sm lg:text-base leading-relaxed">
            Sampaikan laporan perundungan, kekerasan fisik maupun verbal, atau keluhan lingkungan belajar dengan garansi kerahasiaan identitas dan perlindungan penuh.
          </p>

          {/* Card Ilustrasi Perlindungan */}
          <div className="bg-gradient-to-b from-sky-50/70 to-slate-50 p-6 rounded-2xl border border-sky-100 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#A7D8F0] flex items-center justify-center text-slate-900 flex-shrink-0 font-bold">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">100% Rahasia & Terlindungi</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Setiap laporan diverifikasi langsung oleh Tim BK & Satgas Perlindungan Anak tanpa takut dihakimi.
                </p>
              </div>
            </div>
          </div>

          {/* Fitur Utama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white border border-slate-200 text-sky-700">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">Enkripsi Berlapis</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">Identitas pelapor terproteksi ketat secara sistemik.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white border border-slate-200 text-sky-700">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">Respons Terpadu</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">Penanganan langsung oleh Guru BK & Tim Satgas.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Card Login / Akses Masuk */}
        <div className="lg:col-span-6 max-w-md mx-auto w-full">
          <div className="bg-white p-7 lg:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#A7D8F0] flex items-center justify-center text-slate-900">
                <Shield className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Masuk ke Portal</h3>
                <p className="text-xs text-slate-500">Silakan masuk dengan akun siswa atau pendidik Anda.</p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">NISN / NIP *</label>
                  <span className="text-[11px] text-slate-400">10 atau 18 Digit</span>
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: 3125521007"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0] focus:ring-2 focus:ring-[#A7D8F0]/30 transition"
                />
                <p className="text-[11px] text-slate-400 mt-1">Gunakan NIP jika Anda adalah staf pengajar atau wali kelas.</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Kata Sandi *</label>
                  <a href="#/lupa-sandi" className="text-[11px] font-medium text-sky-600 hover:underline">Lupa kata sandi?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0] focus:ring-2 focus:ring-[#A7D8F0]/30 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
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
                  className="rounded border-slate-300 text-sky-600 focus:ring-[#A7D8F0]"
                />
                <label htmlFor="rememberMe" className="text-xs text-slate-600 cursor-pointer">
                  Ingat sesi saya di perangkat ini
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <span>{isLoading ? 'Memverifikasi...' : 'Masuk'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center text-xs text-slate-600">
              Belum memiliki akun terdaftar?{' '}
              <Link to="/register" className="font-bold text-sky-700 hover:underline">
                Daftar di sini
              </Link>
            </div>

            {/* Pembatas Atau */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase">Atau</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Lacak Tanpa Login Button */}
            <div className="space-y-1.5">
              <Link
                to="/lacak"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm flex items-center justify-center gap-2 transition"
              >
                <SearchCheck className="w-4 h-4 text-sky-700" />
                <span>Lacak status laporan tanpa login</span>
              </Link>
              <p className="text-[11px] text-center text-slate-500">
                Punya Kode Tiket Aduan Anonim? Periksa progres investigasi di sini.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Data Anda dienkripsi dan diproteksi sesuai standar perlindungan kerahasiaan data anak dan instansi pendidikan.</span>
            </div>
          </div>
        </div>
      </main>

      <StudentFooter />
    </div>
  );
};

