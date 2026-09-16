import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Search, Lock, User, LogOut } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const StudentHeader = ({ isDashboard = false }) => {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b border-slate-200 py-3.5 px-6 lg:px-12 flex justify-between items-center bg-white sticky top-0 z-30 shadow-xs">
      <Link to={currentUser ? '/dashboard' : '/'} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#A7D8F0] flex items-center justify-center text-slate-900 shadow-sm font-bold">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <span className="font-extrabold text-lg tracking-tight block leading-none text-slate-900">SIGAP</span>
          <span className="text-xs text-slate-500 font-medium">Sistem Pengaduan Siswa</span>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        {!isDashboard && (
          <Link
            to="/lacak"
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-2 transition"
          >
            <Search className="w-4 h-4 text-sky-700" />
            <span>Lacak Tiket</span>
          </Link>
        )}

        {currentUser ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <User className="w-3.5 h-3.5 text-sky-700" />
              <span>{currentUser.nama || 'Siswa Terdaftar'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl border border-red-200 transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        ) : (
          <Link
            to="/admin/login"
            className="text-xs font-semibold text-sky-900 hover:text-sky-950 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 transition flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Portal Guru & Admin</span>
          </Link>
        )}
      </div>
    </header>
  );
};

