import React, { useState, useEffect, useRef } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { Menu, Bell, Search, ShieldCheck, Clock, AlertCircle, ChevronRight, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

export const AdminLayout = ({ children, showHeader = false, title = '', subtitle = '' }) => {
  const { currentUser, reports } = useStore();
  const navigate = useNavigate();

  // Preferensi desktop sidebar tersimpan di localStorage (seperti YouTube)
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('sigap_admin_sidebar_expanded');
    return saved !== null ? saved === 'true' : true;
  });

  // State untuk drawer mobile overlay
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // State untuk dropdown notifikasi
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // Laporan menunggu verifikasi (prioritas notifikasi tertinggi)
  const notifLaporan = (reports || [])
    .filter((r) => r.status === 'menunggu')
    .sort((a, b) => new Date(b.tanggal || b.created_at || 0) - new Date(a.tanggal || a.created_at || 0))
    .slice(0, 8);

  const notifCount = notifLaporan.length;

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotifOpen]);

  // Simpan perubahan preferensi desktop ke localStorage
  useEffect(() => {
    localStorage.setItem('sigap_admin_sidebar_expanded', String(isExpanded));
  }, [isExpanded]);

  // Handler toggle burger
  const handleToggleBurger = () => {
    if (window.innerWidth >= 1024) {
      // Desktop: toggle expanded vs collapsed
      setIsExpanded((prev) => !prev);
    } else {
      // Mobile / Tablet: toggle overlay drawer
      setIsMobileOpen((prev) => !prev);
    }
  };

  // Inisial avatar pengguna
  const userInitials = currentUser?.nama
    ? currentUser.nama
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'BK';

  return (
    <div className="min-h-screen bg-liquid-mesh flex relative overflow-x-hidden selection:bg-[#3B7DE8]/20">
      {/* ─── Ambient Glow Blobs (iOS 26 Liquid Mesh Depth) ─── */}
      <div className="fixed top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-blue-300/25 blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-indigo-200/30 blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-[40%] right-[25%] w-[35vw] h-[35vw] rounded-full bg-sky-200/20 blur-3xl pointer-events-none -z-10" />

      {/* ─── Mobile Backdrop Overlay (Hanya aktif di mobile saat drawer terbuka) ─── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-md lg:hidden transition-opacity duration-300 animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ─── Sidebar Admin ─── */}
      <AdminSidebar
        isExpanded={isExpanded}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        toggleSidebar={handleToggleBurger}
      />

      {/* ─── Konten Area Utama ─── */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10 ${
          isExpanded ? 'lg:ml-60' : 'lg:ml-[76px]'
        }`}
      >
        {/* Top Header Bar — iOS 26 Liquid Glass */}
        <header className="h-16 glass-panel px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 border-b border-white/60">
          {/* Sisi Kiri: Tombol Burger + Brand SIGAP + Search */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            {/* Tombol Hamburger Burger */}
            <button
              type="button"
              onClick={handleToggleBurger}
              aria-label="Toggle Sidebar Menu"
              title="Buka / Tutup Navigasi Sidebar"
              className="p-2 -ml-1 rounded-2xl text-slate-700 hover:text-slate-900 glass-pill hover:bg-white/80 active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo & Title di Navbar */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3B7DE8] to-blue-500 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(59,125,232,0.35)] border border-white/30 sm:hidden">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="font-black text-base text-slate-900 tracking-tight">SIGAP</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full glass-pill-blue">
                  Panel Admin
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xs w-full hidden md:block ml-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari laporan, kasus, siswa..."
                className="w-full pl-9 pr-4 py-2 rounded-2xl glass-input text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* Page Title & Subtitle jika showHeader true */}
            {showHeader && (
              <div className="ml-2 hidden xl:block overflow-hidden">
                <h1 className="text-xs font-bold text-slate-900 truncate leading-tight">{title}</h1>
                {subtitle && <p className="text-[11px] text-slate-400 truncate">{subtitle}</p>}
              </div>
            )}
          </div>

          {/* Sisi Kanan: Notifikasi + User Profile Badge */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Tombol Notifikasi + Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setIsNotifOpen((prev) => !prev)}
                className="relative w-9 h-9 rounded-2xl glass-pill hover:bg-white/90 text-slate-600 hover:text-slate-900 flex items-center justify-center transition active:scale-95 shadow-xs"
                title="Notifikasi Sistem"
              >
                <Bell className="w-4 h-4" />
                {notifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 ring-2 ring-white/90 text-white text-[9px] font-extrabold flex items-center justify-center leading-none">
                    {notifCount > 9 ? '9+' : notifCount}
                  </span>
                )}
              </button>

              {/* Dropdown Panel Notifikasi */}
              {isNotifOpen && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 z-50 animate-fade-in">
                  <div className="glass-panel-elevated rounded-3xl border border-white/80 shadow-2xl overflow-hidden">
                    {/* Header Dropdown */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/50">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#3B7DE8]" />
                        <span className="text-sm font-bold text-slate-900">Notifikasi</span>
                        {notifCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-extrabold">
                            {notifCount} baru
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsNotifOpen(false)}
                        className="w-6 h-6 rounded-xl glass-pill hover:bg-white/90 text-slate-500 hover:text-slate-900 flex items-center justify-center transition active:scale-95"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Daftar Notifikasi */}
                    <div className="max-h-72 overflow-y-auto">
                      {notifLaporan.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                          <div className="w-10 h-10 rounded-2xl glass-pill flex items-center justify-center">
                            <Bell className="w-5 h-5 text-slate-400" />
                          </div>
                          <p className="text-xs font-semibold text-slate-600">Semua laporan sudah ditangani</p>
                          <p className="text-[11px] text-slate-400">Tidak ada laporan yang menunggu verifikasi saat ini.</p>
                        </div>
                      ) : (
                        notifLaporan.map((lap) => (
                          <button
                            key={lap.id}
                            type="button"
                            onClick={() => {
                              setIsNotifOpen(false);
                              navigate(`/admin/laporan-detail?id=${lap.id}`);
                            }}
                            className="w-full flex items-start gap-3.5 px-5 py-4 hover:bg-white/60 transition border-b border-white/40 last:border-0 text-left group"
                          >
                            <div className="mt-0.5 shrink-0 w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center">
                              <AlertCircle className="w-4 h-4 text-amber-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate group-hover:text-[#3B7DE8] transition-colors">
                                {lap.judul || `Laporan #${lap.id}`}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {lap.kategori_nama || 'Kategori belum diverifikasi'}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span className="text-[10px] text-slate-400">
                                  {lap.tanggal
                                    ? new Date(lap.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                                    : 'Tanggal tidak diketahui'}
                                </span>
                                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-bold uppercase">
                                  Menunggu
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#3B7DE8] mt-1 shrink-0 transition-colors" />
                          </button>
                        ))
                      )}
                    </div>

                    {/* Footer Dropdown */}
                    <div className="px-5 py-3 border-t border-white/50">
                      <button
                        type="button"
                        onClick={() => {
                          setIsNotifOpen(false);
                          navigate('/admin/laporan');
                        }}
                        className="w-full py-2 rounded-2xl glass-pill-blue text-[#3B7DE8] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-50 transition"
                      >
                        <span>Lihat Semua Laporan</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Mini Badge */}
            <div className="flex items-center gap-2.5 pl-2 sm:p-1.5 sm:px-2 rounded-2xl glass-pill">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#3B7DE8] to-blue-500 text-white flex items-center justify-center font-black text-xs shadow-xs border border-white/40 shrink-0">
                {userInitials}
              </div>
              <div className="hidden lg:block text-left pr-1.5">
                <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[130px]">
                  {currentUser?.nama || 'Ibu Rahmawati'}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight truncate max-w-[130px]">
                  {currentUser?.jabatan || 'Konselor BK'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto transition-all">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
