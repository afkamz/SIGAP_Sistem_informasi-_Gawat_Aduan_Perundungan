import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Search, Lock, User, LogOut, PlusCircle, LogIn, Menu, X, LayoutDashboard } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const StudentHeader = ({ isDashboard = false }) => {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Brand Logo */}
        <Link to={currentUser ? '/dashboard' : '/'} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#A7D8F0] group-hover:bg-[#90C8E4] flex items-center justify-center text-slate-900 shadow-sm font-bold transition">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight block leading-none text-slate-900">SIGAP</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-100 text-sky-800">PPKSP</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Sistem Pengaduan Pelajar</span>
          </div>
        </Link>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-2 lg:gap-2.5">
          {/* Lacak Tiket */}
          {!isDashboard && (
            <Link
              to="/lacak"
              className={`text-xs font-semibold px-3 py-2 rounded-xl border transition flex items-center gap-1.5 ${
                isActive('/lacak')
                  ? 'border-sky-300 bg-sky-50 text-sky-800'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-sky-700" />
              <span>Lacak Tiket</span>
            </Link>
          )}

          {/* Buat Aduan Quick Button */}
          {!isDashboard && (
            <Link
              to={currentUser ? '/buat-laporan' : '/login?redirect=/buat-laporan'}
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#A7D8F0]" />
              <span>Buat Aduan</span>
            </Link>
          )}

          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 transition"
              >
                <User className="w-3.5 h-3.5 text-sky-700" />
                <span>{currentUser.nama || 'Siswa'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl border border-red-200 transition flex items-center gap-1.5"
                title="Keluar dari sesi"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Keluar</span>
              </button>
            </div>
          ) : (
            <>
              {/* Login Siswa */}
              {!isActive('/login') && (
                <Link
                  to="/login"
                  className="text-xs font-bold px-3 py-2 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 transition flex items-center gap-1.5 shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </Link>
              )}

              {/* Portal Guru / Admin */}
              <Link
                to="/admin/login"
                className="text-xs font-semibold text-sky-900 hover:text-sky-950 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 transition flex items-center gap-1.5"
                title="Akses Konselor BK & Satgas PPKSP"
              >
                <Lock className="w-3.5 h-3.5 text-sky-700" />
                <span className="hidden xl:inline">Portal Guru & Admin</span>
                <span className="xl:hidden">Admin</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger / Quick Actions */}
        <div className="flex sm:hidden items-center gap-2">
          {!currentUser && !isActive('/login') && (
            <Link
              to="/login"
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#A7D8F0] text-slate-900"
            >
              Masuk
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={currentUser ? '/buat-laporan' : '/login?redirect=/buat-laporan'}
              onClick={() => setMobileOpen(false)}
              className="py-2.5 px-3 rounded-xl bg-slate-900 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#A7D8F0]" />
              <span>Buat Aduan</span>
            </Link>
            <Link
              to="/lacak"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs text-center flex items-center justify-center gap-1.5 border border-slate-200"
            >
              <Search className="w-3.5 h-3.5 text-sky-700" />
              <span>Lacak Tiket</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-sky-700" />
                  <span>Dashboard ({currentUser.nama})</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2 px-3 rounded-xl border border-red-200 text-red-600 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#A7D8F0] text-slate-900 font-bold text-xs text-center flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk Portal Siswa</span>
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-2 px-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 font-semibold text-xs text-center flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Portal Guru & Admin BK</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
