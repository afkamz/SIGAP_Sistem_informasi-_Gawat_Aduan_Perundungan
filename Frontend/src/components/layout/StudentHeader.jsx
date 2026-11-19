import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Lock,
  LogOut,
  PlusCircle,
  LogIn,
  Menu,
  X,
  LayoutDashboard,
  Settings,
  Bell,
  CheckCheck,
  Clock,
  CheckCircle2,
  RotateCw,
  HeartHandshake,
  ShieldCheck,
  ChevronRight,
  Inbox
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const StudentHeader = ({ isDashboard = false, hideBorder = false }) => {
  const {
    currentUser,
    logout,
    studentNotifications = [],
    unreadNotificationsCount = 0,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifDropdownRef = useRef(null);

  // Tutup dropdown notifikasi saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notifOpen]);

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
        borderBottom: hideBorder ? 'none' : '1.5px solid #BFEFFF',
        boxShadow: hideBorder ? 'none' : '0 4px 20px -2px rgba(191, 239, 255, 0.45)'
      }}
    >
      <div className="w-full px-3 sm:px-5 lg:px-8 h-16 flex justify-between items-center">
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

              {!isAdmin && (
                <div className="relative" ref={notifDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setNotifOpen(!notifOpen)}
                    title="Notifikasi Tindak Lanjut Aduan"
                    className="p-1.5 rounded-xl border transition hover:opacity-90 flex items-center justify-center cursor-pointer shadow-2xs relative"
                    style={{
                      background: notifOpen ? '#BFEFFF' : '#FFFFFF',
                      color: '#1C6F8E',
                      borderColor: '#BFEFFF'
                    }}
                  >
                    <Bell className="w-4 h-4 text-[#1C6F8E]" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white shadow-xs animate-pulse">
                        {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Notifikasi */}
                  {notifOpen && (
                    <div
                      className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white rounded-2xl border shadow-2xl p-4 z-50 text-left animate-fade-in"
                      style={{ borderColor: '#BFEFFF' }}
                    >
                      <div className="flex justify-between items-center pb-2.5 border-b" style={{ borderColor: '#E2E8F0' }}>
                        <div className="flex items-center gap-1.5">
                          <Bell className="w-4 h-4 text-[#1C6F8E]" />
                          <span className="font-bold text-xs text-[#111827]">Notifikasi Tindak Lanjut</span>
                          {unreadNotificationsCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-100 text-rose-700">
                              {unreadNotificationsCount} baru
                            </span>
                          )}
                        </div>
                        {unreadNotificationsCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllNotificationsAsRead}
                            className="text-[11px] font-semibold text-[#1C6F8E] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCheck className="w-3 h-3 text-[#1C6F8E]" />
                            <span>Tandai Semua Dibaca</span>
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-1 space-y-1">
                        {studentNotifications.length === 0 ? (
                          <div className="py-8 text-center text-xs text-slate-400 space-y-1">
                            <Inbox className="w-6 h-6 mx-auto text-slate-300" />
                            <p>Belum ada notifikasi tindak lanjut</p>
                          </div>
                        ) : (
                          studentNotifications.slice(0, 5).map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => {
                                markNotificationAsRead(notif.id);
                                setNotifOpen(false);
                                navigate(`/dashboard?notif=${notif.reportId}`);
                              }}
                              className={`p-2.5 rounded-xl transition cursor-pointer flex items-start gap-2.5 ${
                                !notif.isRead ? 'bg-sky-50/70 hover:bg-sky-100/60' : 'hover:bg-slate-50'
                              }`}
                            >
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border mt-0.5"
                                style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
                              >
                                {notif.status === 'selesai' ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                ) : notif.status === 'counseling' ? (
                                  <HeartHandshake className="w-3.5 h-3.5 text-[#1C6F8E]" />
                                ) : notif.status === 'diverifikasi' ? (
                                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                                ) : notif.status === 'ditindaklanjuti' ? (
                                  <RotateCw className="w-3.5 h-3.5 text-cyan-700" />
                                ) : (
                                  <Clock className="w-3.5 h-3.5 text-[#1C6F8E]" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-1">
                                  <h5 className="font-bold text-xs text-[#111827] truncate">
                                    {notif.title}
                                  </h5>
                                  {!notif.isRead && (
                                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1" />
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                                  {notif.message}
                                </p>
                                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                                  <span>{notif.pelaksana}</span>
                                  <span>{notif.waktu}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="pt-2.5 border-t border-slate-100 text-center">
                        <Link
                          to="/dashboard?tab=notifikasi"
                          onClick={() => setNotifOpen(false)}
                          className="text-xs font-bold flex items-center justify-center gap-1 hover:underline"
                          style={{ color: '#1C6F8E' }}
                        >
                          <span>Buka Seluruh Riwayat Tindak Lanjut</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!isAdmin && (
                <Link
                  to="/dashboard?tab=pengaturan"
                  title="Pengaturan Akun & NISN"
                  className="p-1.5 rounded-xl border transition hover:opacity-90 flex items-center justify-center cursor-pointer shadow-2xs"
                  style={{
                    background: '#FFFFFF',
                    color: '#1C6F8E',
                    borderColor: '#BFEFFF'
                  }}
                >
                  <Settings className="w-4 h-4 text-[#1C6F8E]" />
                </Link>
              )}

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
                {!isAdmin && (
                  <>
                    <Link
                      to="/dashboard?tab=notifikasi"
                      onClick={() => setMobileOpen(false)}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between border"
                      style={{ background: '#FFFFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                    >
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#1C6F8E]" />
                        <span>Notifikasi Tindak Lanjut</span>
                      </div>
                      {unreadNotificationsCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                          {unreadNotificationsCount} Baru
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/dashboard?tab=pengaturan"
                      onClick={() => setMobileOpen(false)}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border"
                      style={{ background: '#FFFFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                    >
                      <Settings className="w-4 h-4 text-[#1C6F8E]" />
                      <span>Pengaturan Akun &amp; NISN</span>
                    </Link>
                  </>
                )}
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
