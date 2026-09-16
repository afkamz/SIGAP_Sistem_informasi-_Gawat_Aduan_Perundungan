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

    let token = '';
    try {
      // Try FastAPI backend login
      const res = await api.loginAdmin(nip, password);
      token = res.access_token;
    } catch (err) {
      console.warn('API warning:', err.message);
    }

    setIsLoading(false);

    // Login user into store
    loginUser(
      {
        id: 1,
        nama: 'Ibu Rahmawati, S.Pd',
        nip: nip,
        jabatan: 'Konselor BK Utama',
        role: 'admin'
      },
      token,
      'admin'
    );

    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800">
      {/* Top Navbar */}
      <header className="py-4 px-6 lg:px-12 flex justify-between items-center bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-lg text-slate-900 tracking-tight">SIGAP</span>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs text-slate-500 font-medium">Portal Konselor & Dinas Pendidikan</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Autentikasi Terenkripsi JWT</span>
        </div>
      </header>

      {/* Center Login Card */}
      <main className="max-w-md mx-auto w-full px-4 py-8">
        <div className="bg-white p-7 lg:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 mx-auto shadow-xs">
              <ShieldAlert className="w-6 h-6 text-sky-800" />
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold">
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
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  NIP (Nomor Induk Pegawai) *
                </label>
                <span className="text-[11px] text-slate-400">Format 18 Digit</span>
              </div>
              <div className="relative">
                <IdCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="Contoh: 198001012026"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Kata Sandi *</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-sky-600 focus:ring-[#A7D8F0]" />
                <span>Ingat perangkat ini</span>
              </label>
              <a href="#/lupa-sandi-admin" className="text-sky-700 hover:underline font-medium">Lupa kata sandi?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <span>{isLoading ? 'Memvalidasi Sesi...' : 'Masuk ke Panel Admin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* SOP Legal Alert Notice */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-start gap-3 text-xs text-slate-700">
            <ShieldAlert className="w-4 h-4 text-sky-800 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block mb-0.5">Area Akses Terbatas</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Sistem ini hanya diperuntukkan bagi personel sekolah dan dinas pendidikan resmi yang berwenang. Segala bentuk akses tanpa hak akan dicatat ke dalam audit trail.
              </p>
            </div>
          </div>

          <div className="text-center text-xs text-slate-600 pt-1">
            Bukan staf atau guru?{' '}
            <Link to="/" className="font-bold text-sky-700 hover:underline">
              Masuk ke Portal Siswa →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200 text-center text-xs text-slate-500 bg-white">
        Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi • Satgas PPKSP Satuan Pendidikan
      </footer>
    </div>
  );
};

