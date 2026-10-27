import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { Menu, Bell, Search, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLayout = ({ children, showHeader = false, title = '', subtitle = '' }) => {
  const { currentUser } = useStore();

  // Preferensi desktop sidebar tersimpan di localStorage (seperti YouTube)
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('sigap_admin_sidebar_expanded');
    return saved !== null ? saved === 'true' : true;
  });

  // State untuk drawer mobile overlay
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
            {/* Tombol Notifikasi */}
            <button
              type="button"
              className="relative w-9 h-9 rounded-2xl glass-pill hover:bg-white/90 text-slate-600 hover:text-slate-900 flex items-center justify-center transition active:scale-95 shadow-xs"
              title="Notifikasi Sistem"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white/90" />
            </button>

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
