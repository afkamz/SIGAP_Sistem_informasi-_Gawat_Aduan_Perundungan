import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Briefcase,
  IdCard
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';

export const AdminLogin = () => {
  const [nip, setNip] = useState('198001012026');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen bg-[#EEF3FD] flex flex-col" style={{ background: 'linear-gradient(135deg, #3B7DE8 0%, #2563c0 40%, #EEF3FD 100%)' }}>
      {/* Top Navbar */}
      <header className="py-4 px-6 lg:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">SIGAP</span>
          <span className="text-xs text-white/60 font-medium hidden sm:block">| Portal Konselor & Dinas Pendidikan</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/80 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>Autentikasi Terenkripsi JWT</span>
        </div>
      </header>

      {/* Center Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-7 lg:p-8 space-y-5">
            {/* Logo & Header */}
            <div className="text-center space-y-2.5">
              <div className="w-14 h-14 rounded-2xl bg-[#EEF3FD] flex items-center justify-center mx-auto shadow-sm">
                <ShieldAlert className="w-7 h-7 text-[#3B7DE8]" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF3FD] border border-[#3B7DE8]/20 text-[#3B7DE8] text-xs font-semibold">
                <Briefcase className="w-3.5 h-3.5" /> Portal Tenaga Pendidik & Pengawas
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">Masuk sebagai Admin</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Akses khusus Guru Bimbingan Konseling (BK), Satgas PPKSP, dan Staf Dinas Pendidikan.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    NIP (Nomor Induk Pegawai) *
                  </label>
                  <span className="text-[11px] text-slate-400">Format 18 Digit</span>
                </div>
                <div className="relative">
                  <IdCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="Contoh: 198001012026"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#3B7DE8] focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Kata Sandi *</label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#3B7DE8] focus:bg-white transition"
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

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#3B7DE8] focus:ring-[#3B7DE8]" />
                  <span>Ingat perangkat ini</span>
                </label>
                <a href="#/lupa-sandi-admin" className="text-[#3B7DE8] hover:underline font-medium">Lupa kata sandi?</a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#3B7DE8] hover:bg-[#2563c0] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <span>{isLoading ? 'Memvalidasi Sesi...' : 'Masuk ke Panel Admin'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* SOP Legal Alert Notice */}
            <div className="p-4 rounded-2xl bg-[#EEF3FD] border border-[#3B7DE8]/15 flex items-start gap-3 text-xs text-slate-700">
              <ShieldAlert className="w-4 h-4 text-[#3B7DE8] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Area Akses Terbatas</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Sistem ini hanya diperuntukkan bagi personel sekolah dan dinas pendidikan resmi yang berwenang. Segala bentuk akses tanpa hak akan dicatat ke dalam audit trail.
                </p>
              </div>
            </div>

            <div className="text-center text-xs text-slate-600 pt-1 space-x-2">
              <Link to="/" className="text-slate-500 hover:text-slate-800">
                ← Beranda
              </Link>
              <span>•</span>
              <span>Bukan staf atau guru?</span>
              <Link to="/login" className="font-bold text-[#3B7DE8] hover:underline">
                Masuk ke Portal Siswa →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-white/60">
        Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi • Satgas PPKSP Satuan Pendidikan
      </footer>
    </div>
  );
};
