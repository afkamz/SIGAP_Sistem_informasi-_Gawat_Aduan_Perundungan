import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Search, Lock, User, LogOut, PlusCircle, LogIn, Menu, X, LayoutDashboard } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const StudentHeader = ({ isDashboard = false }) => {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  // Tentukan tujuan berdasarkan role
  const homePath = isAdmin ? '/admin/dashboard' : currentUser ? '/dashboard' : '/';
  const profilePath = isAdmin ? '/admin/dashboard' : '/dashboard';
  const buatAduanPath = currentUser && !isAdmin ? '/buat-laporan' : '/login?redirect=/buat-laporan';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Inisial avatar pengguna
  const userInitials = currentUser?.nama
    ? currentUser.nama
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'SW';

  return (
    <header className="glass-panel sticky top-0 z-40 border-b border-white/60 shadow-[0_4px_24px_rgba(31,38,135,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
        {/* Brand Logo */}
        <Link to={homePath} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3B7DE8] to-blue-500 group-hover:scale-105 flex items-center justify-center text-white shadow-[0_4px_14px_rgba(59,125,232,0.35)] border border-white/40 transition-all duration-200">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight block leading-none text-slate-900">
                SIGAP
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold glass-pill-blue">
                SISWA
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
              Ruang Perlindungan & Pengaduan Pelajar
            </span>
          </div>
        </Link>

        {/* Right Action Buttons — Desktop */}
        <div className="hidden sm:flex items-center gap-2 lg:gap-3">
          {/* Lacak Tiket */}
          {!isDashboard && (
            <Link
              to="/lacak"
              className={`text-xs font-bold px-3.5 py-2 rounded-2xl transition-all flex items-center gap-1.5 ${
                isActive('/lacak')
                  ? 'glass-pill-blue font-black'
                  : 'glass-card text-slate-700 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-[#3B7DE8]" />
              <span>Lacak Aduan</span>
            </Link>
          )}

          {/* Buat Aduan Button */}
          {!isDashboard && !isAdmin && (
            <Link
              to={buatAduanPath}
              className="text-xs font-bold px-4 py-2 rounded-2xl glass-button-primary text-white flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Buat Aduan Baru</span>
            </Link>
          )}

          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-white/50">
              {/* Nama pengguna */}
              <Link
                to={profilePath}
                className="flex items-center gap-2.5 text-xs font-bold text-slate-800 glass-card px-3 py-1.5 rounded-2xl hover:bg-white/90"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#3B7DE8] to-blue-500 text-white flex items-center justify-center font-black text-[10px] shadow-xs">
                  {userInitials}
                </div>
                <span className="truncate max-w-[130px]">{currentUser.nama || 'Siswa'}</span>
                {isAdmin && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold glass-pill-blue">
                    Admin
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-semibold text-red-500 hover:text-red-700 glass-pill-red px-3 py-1.5 rounded-2xl transition flex items-center gap-1.5"
                title="Keluar dari sesi"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Keluar</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Login Siswa */}
              {!isActive('/login') && (
                <Link
                  to="/login"
                  className="text-xs font-bold px-4 py-2 rounded-2xl glass-button-primary text-white flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk Portal</span>
                </Link>
              )}

              {/* Portal Guru / Admin */}
              <Link
                to="/admin/login"
                className="text-xs font-bold text-slate-700 hover:text-[#3B7DE8] px-3.5 py-2 rounded-2xl glass-card transition flex items-center gap-1.5"
                title="Akses Konselor BK & Satgas PPKSP"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden xl:inline">Portal Guru &amp; Admin</span>
                <span className="xl:hidden">Admin</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          {!currentUser && !isActive('/login') && (
            <Link
              to="/login"
              className="text-xs font-bold px-3 py-1.5 rounded-xl glass-button-primary text-white shadow-xs"
            >
              Masuk
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-2xl glass-pill text-slate-700 hover:bg-white/80 transition"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu — Glass Elevated */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-white/60 glass-panel-elevated px-4 pt-3.5 pb-5 space-y-3 shadow-xl animate-fade-in">
          <div className="grid grid-cols-2 gap-2">
            {!isAdmin ? (
              <Link
                to={buatAduanPath}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 px-3 rounded-2xl glass-button-primary text-white font-bold text-xs text-center flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>Buat Aduan</span>
              </Link>
            ) : (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 px-3 rounded-2xl glass-button-primary text-white font-bold text-xs text-center flex items-center justify-center gap-1.5"
              >
                <LayoutDashboard className="w-4 h-4 text-white" />
                <span>Dashboard</span>
              </Link>
            )}
            <Link
              to="/lacak"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 px-3 rounded-2xl glass-pill-blue font-bold text-xs text-center flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Lacak Tiket</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-white/40 flex flex-col gap-2">
            {currentUser ? (
              <>
                <Link
                  to={profilePath}
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-2.5 px-3 rounded-2xl glass-card text-slate-800 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#3B7DE8]" />
                  <span>
                    {isAdmin ? 'Dashboard Admin' : `Dashboard (${currentUser.nama})`}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2 px-3 rounded-2xl glass-pill-red text-red-600 text-xs font-semibold flex items-center justify-center gap-2 transition"
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
                  className="w-full py-2.5 px-3 rounded-2xl glass-button-primary text-white font-bold text-xs text-center flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk Portal Siswa</span>
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-2 px-3 rounded-2xl glass-card text-slate-700 font-semibold text-xs text-center flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Portal Guru &amp; Admin BK</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default StudentHeader;
