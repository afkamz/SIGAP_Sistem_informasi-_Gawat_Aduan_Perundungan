import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Lock, LogOut, PlusCircle, LogIn, Menu, X, LayoutDashboard } from 'lucide-react';
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
    <header
      className="sticky top-0 z-40 w-full transition-colors"
      style={{
        background: '#FFFFFF',
        borderBottom: '1.5px solid #BFEFFF',
        boxShadow: '0 4px 20px -2px rgba(191, 239, 255, 0.45)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* Brand Logo & Emblem */}
        <Link to={homePath} className="flex items-center gap-2 sm:gap-2.5 group py-1" aria-label="Beranda SIGAP">
          <img
            src="/assets/branding/logo-sigap.png"
            alt="Logo SIGAP"
            className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <img
            src="/assets/branding/branding-sigap.png"
            alt="SIGAP"
            className="h-7 sm:h-8 w-auto max-w-[130px] sm:max-w-[160px] object-contain transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span
            className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border"
            style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
          >
            PORTAL SISWA
          </span>
        </Link>

        {/* Right Action Buttons — Desktop */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Lacak Tiket */}
          {!isDashboard && (
            <Link
              to="/lacak"
              className="text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 hover:opacity-90 border"
              style={{
                background: isActive('/lacak') ? '#BFEFFF' : '#FFFFFF',
                color: '#1C6F8E',
                borderColor: '#BFEFFF'
              }}
            >
              <Search className="w-3.5 h-3.5 text-[#1C6F8E]" />
              <span>Lacak Aduan</span>
            </Link>
          )}

          {/* Buat Aduan Button */}
          {!isDashboard && !isAdmin && (
            <Link
              to={buatAduanPath}
              className="text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition active:scale-95 hover:opacity-90 border shadow-xs"
              style={{
                background: '#BFEFFF',
                color: '#1C6F8E',
                borderColor: '#BFEFFF'
              }}
            >
              <PlusCircle className="w-4 h-4 text-[#1C6F8E]" />
              <span>Buat Aduan Baru</span>
            </Link>
          )}

          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l" style={{ borderColor: '#BFEFFF' }}>
              {/* Nama pengguna */}
              <Link
                to={profilePath}
                className="flex items-center gap-2.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition hover:opacity-90"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              >
                <div
                  className="w-6 h-6 rounded-lg text-[#1C6F8E] flex items-center justify-center font-black text-[10px] shadow-xs border"
                  style={{ background: '#BFEFFF', borderColor: '#BFEFFF' }}
                >
                  {userInitials}
                </div>
                <span className="truncate max-w-[130px]">{currentUser.nama || 'Siswa'}</span>
                {isAdmin && (
                  <span
                    className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold border"
                    style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                  >
                    Admin
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 border hover:opacity-90 cursor-pointer"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
                title="Keluar dari sesi"
              >
                <LogOut className="w-3.5 h-3.5 text-[#1C6F8E]" />
                <span className="hidden lg:inline">Keluar</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Login Siswa */}
              {!isActive('/login') && (
                <Link
                  to="/login"
                  className="text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition hover:opacity-90 border shadow-xs"
                  style={{
                    background: '#BFEFFF',
                    color: '#1C6F8E',
                    borderColor: '#BFEFFF'
                  }}
                >
                  <LogIn className="w-3.5 h-3.5 text-[#1C6F8E]" />
                  <span>Masuk Portal</span>
                </Link>
              )}

              {/* Portal Guru / Admin */}
              <Link
                to="/admin/login"
                className="text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 hover:opacity-90 border"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
                title="Akses Konselor BK & Satgas PPKSP"
              >
                <Lock className="w-3.5 h-3.5 text-[#1C6F8E]" />
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
              className="text-xs font-bold px-3 py-1.5 rounded-xl transition border shadow-xs"
              style={{
                background: '#BFEFFF',
                color: '#1C6F8E',
                borderColor: '#BFEFFF'
              }}
            >
              Masuk
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl border transition"
            style={{
              background: '#FFFFFF',
              borderColor: '#BFEFFF',
              color: '#1C6F8E'
            }}
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-[#1C6F8E]" /> : <Menu className="w-5 h-5 text-[#1C6F8E]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div
          className="sm:hidden border-t px-4 pt-3.5 pb-5 space-y-3 shadow-xl animate-fade-in"
          style={{ background: '#FFFFFF', borderColor: '#BFEFFF' }}
        >
          <div className="grid grid-cols-2 gap-2">
            {!isAdmin ? (
              <Link
                to={buatAduanPath}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 px-3 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 border shadow-xs"
                style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
              >
                <PlusCircle className="w-4 h-4 text-[#1C6F8E]" />
                <span>Buat Aduan</span>
              </Link>
            ) : (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 px-3 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 border shadow-xs"
                style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
              >
                <LayoutDashboard className="w-4 h-4 text-[#1C6F8E]" />
                <span>Dashboard</span>
              </Link>
            )}
            <Link
              to="/lacak"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 px-3 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 border"
              style={{ background: '#FFFFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
            >
              <Search className="w-4 h-4 text-[#1C6F8E]" />
              <span>Lacak Tiket</span>
            </Link>
          </div>

          <div className="pt-2 border-t flex flex-col gap-2" style={{ borderColor: '#BFEFFF' }}>
            {currentUser ? (
              <>
                <Link
                  to={profilePath}
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border"
                  style={{ background: '#FFFFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                >
                  <LayoutDashboard className="w-4 h-4 text-[#1C6F8E]" />
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
                  className="w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition border cursor-pointer hover:bg-red-50"
                  style={{ background: '#FFFFFF', color: '#B91C1C', borderColor: '#BFEFFF' }}
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span>Keluar Akun</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-2 border shadow-xs"
                  style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                >
                  <LogIn className="w-4 h-4 text-[#1C6F8E]" />
                  <span>Masuk Portal Siswa</span>
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-2 px-3 rounded-xl font-semibold text-xs text-center flex items-center justify-center gap-2 border"
                  style={{ background: '#FFFFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                >
                  <Lock className="w-3.5 h-3.5 text-[#1C6F8E]" />
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
