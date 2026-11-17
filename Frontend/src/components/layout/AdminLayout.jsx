import React, { useState, useEffect, useRef } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { Menu, Bell, Search, ShieldCheck, Clock, AlertCircle, ChevronRight, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

export const AdminLayout = ({ children, showHeader = false, title = '', subtitle = '' }) => {
  const { currentUser, reports } = useStore();
  const navigate = useNavigate();

  // Preferensi desktop sidebar tersimpan di localStorage
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
      setIsExpanded((prev) => !prev);
    } else {
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
    <div className="min-h-screen bg-white text-[#1C6F8E] flex relative overflow-x-hidden font-sans">
      {/* ─── BACKGROUND DEKORATIF: KOMBINASI BULAT BABY BLUE & GARIS-GARIS DIAGONAL (IKUT SCROLL DENGAN KONTEN) ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Lingkaran 1: Kanan Atas */}
        <div
          className="absolute -right-28 sm:-right-40 md:-right-52 top-[60px] sm:top-[80px] w-[380px] sm:w-[500px] md:w-[600px] h-[380px] sm:h-[500px] md:h-[600px] rounded-full"
          style={{
            background: 'linear-gradient(135deg, #BFEFFF 0%, #D6F5FF 100%)',
            opacity: 0.82
          }}
        />

        {/* Lingkaran 2: Kiri Tengah */}
        <div
          className="absolute -left-28 sm:-left-36 top-[32%] w-[320px] sm:w-[440px] md:w-[520px] h-[320px] sm:h-[440px] md:h-[520px] rounded-full"
          style={{
            background: 'linear-gradient(135deg, #D2F4FF 0%, #BFEFFF 100%)',
            opacity: 0.78
          }}
        />

        {/* Lingkaran 3: Kanan Tengah-Bawah */}
        <div
          className="absolute -right-24 sm:-right-36 top-[62%] w-[340px] sm:w-[460px] md:w-[540px] h-[340px] sm:h-[460px] md:h-[540px] rounded-full"
          style={{
            background: 'linear-gradient(135deg, #BFEFFF 0%, #D6F5FF 100%)',
            opacity: 0.75
          }}
        />

        {/* Lingkaran 4: Kiri Bawah */}
        <div
          className="absolute -left-20 sm:-left-32 top-[86%] w-[280px] sm:w-[380px] md:w-[460px] h-[280px] sm:h-[380px] md:h-[460px] rounded-full"
          style={{
            background: 'linear-gradient(135deg, #E6F8FF 0%, #BFEFFF 100%)',
            opacity: 0.70
          }}
        />

        {/* Garis-garis Diagonal Halus Memanjang Sepanjang Halaman */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 3200"
          style={{ opacity: 0.75 }}
        >
          <line x1="-120" y1="400" x2="1620" y2="-200" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="-160" y1="1100" x2="1580" y2="500" stroke="#E2E8F0" strokeWidth="1.2" />
          <line x1="-120" y1="1900" x2="1620" y2="1300" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="-160" y1="2700" x2="1580" y2="2100" stroke="#E2E8F0" strokeWidth="1.2" />
        </svg>
      </div>

      {/* ─── Mobile Backdrop Overlay (Hanya aktif di mobile saat drawer terbuka) ─── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden transition-opacity duration-300 animate-fade-in"
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
        {/* Top Header Bar — Flat Minimalist Seamless */}
        <header
          className="h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 border-b bg-white/90 backdrop-blur-md"
          style={{ borderColor: 'rgba(191, 239, 255, 0.7)' }}
        >
          {/* Sisi Kiri: Tombol Burger + Brand SIGAP + Search */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            {/* Tombol Hamburger Burger */}
            <button
              type="button"
              onClick={handleToggleBurger}
              aria-label="Toggle Sidebar Menu"
              title="Buka / Tutup Navigasi Sidebar"
              className="p-2 -ml-1 rounded-xl text-[#1C6F8E] hover:opacity-90 active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer border shadow-xs"
              style={{
                background: '#FFFFFF',
                borderColor: '#BFEFFF'
              }}
            >
              <Menu className="w-5 h-5 text-[#1C6F8E]" />
            </button>

            {/* Brand Logo SIGAP Resmi & Title di Navbar */}
            <div className="flex items-center gap-2.5 shrink-0">
              <img
                src="/assets/branding/logo-sigap.png"
                alt="Logo SIGAP"
                className="h-8 sm:h-9 w-auto object-contain shrink-0"
              />
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight text-[#1C6F8E]">SIGAP</span>
                <span
                  className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border"
                  style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                >
                  Panel Admin
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xs w-full hidden md:block ml-2">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#2E84A5]" />
              <input
                type="text"
                placeholder="Cari laporan, kasus, siswa..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border focus:outline-none transition"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              />
            </div>

            {/* Page Title & Subtitle jika showHeader true */}
            {showHeader && (
              <div className="ml-2 hidden xl:block overflow-hidden">
                <h1 className="text-xs font-bold truncate leading-tight" style={{ color: '#1C6F8E' }}>{title}</h1>
                {subtitle && <p className="text-[11px] truncate" style={{ color: '#2E84A5' }}>{subtitle}</p>}
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
                className="relative w-9 h-9 rounded-xl border flex items-center justify-center transition active:scale-95 shadow-xs cursor-pointer hover:opacity-90"
                style={{
                  background: '#FFFFFF',
                  borderColor: '#BFEFFF',
                  color: '#1C6F8E'
                }}
                title="Notifikasi Sistem"
              >
                <Bell className="w-4 h-4 text-[#1C6F8E]" />
                {notifCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-white text-[9px] font-extrabold flex items-center justify-center leading-none"
                    style={{ background: '#EF4444' }}
                  >
                    {notifCount > 9 ? '9+' : notifCount}
                  </span>
                )}
              </button>

              {/* Dropdown Panel Notifikasi */}
              {isNotifOpen && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 z-50 animate-fade-in">
                  <div
                    className="rounded-2xl border shadow-2xl overflow-hidden"
                    style={{
                      background: '#FFFFFF',
                      borderColor: '#BFEFFF'
                    }}
                  >
                    {/* Header Dropdown */}
                    <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#BFEFFF' }}>
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#1C6F8E]" />
                        <span className="text-sm font-bold" style={{ color: '#1C6F8E' }}>Notifikasi</span>
                        {notifCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-extrabold">
                            {notifCount} baru
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsNotifOpen(false)}
                        className="w-6 h-6 rounded-lg border text-slate-500 hover:text-slate-900 flex items-center justify-center transition active:scale-95 cursor-pointer"
                        style={{ borderColor: '#BFEFFF' }}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Daftar Notifikasi */}
                    <div className="max-h-72 overflow-y-auto">
                      {notifLaporan.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#BFEFFF' }}>
                            <Bell className="w-5 h-5 text-[#1C6F8E]" />
                          </div>
                          <p className="text-xs font-semibold" style={{ color: '#1C6F8E' }}>Semua laporan sudah ditangani</p>
                          <p className="text-[11px]" style={{ color: '#2E84A5' }}>Tidak ada laporan yang menunggu verifikasi saat ini.</p>
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
                            className="w-full flex items-start gap-3.5 px-5 py-4 hover:bg-sky-50/60 transition border-b last:border-0 text-left group cursor-pointer"
                            style={{ borderColor: '#BFEFFF' }}
                          >
                            <div className="mt-0.5 shrink-0 w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center">
                              <AlertCircle className="w-4 h-4 text-amber-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold truncate group-hover:text-[#1C6F8E] transition-colors" style={{ color: '#111827' }}>
                                {lap.judul || `Laporan #${lap.id}`}
                              </p>
                              <p className="text-[11px] truncate mt-0.5" style={{ color: '#2E84A5' }}>
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
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#1C6F8E] mt-1 shrink-0 transition-colors" />
                          </button>
                        ))
                      )}
                    </div>

                    {/* Footer Dropdown */}
                    <div className="px-5 py-3 border-t" style={{ borderColor: '#BFEFFF' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsNotifOpen(false);
                          navigate('/admin/laporan');
                        }}
                        className="w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border hover:opacity-90 cursor-pointer"
                        style={{
                          background: '#BFEFFF',
                          color: '#1C6F8E',
                          borderColor: '#BFEFFF'
                        }}
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
            <div
              className="flex items-center gap-2.5 pl-2 sm:p-1.5 sm:px-2.5 rounded-xl border"
              style={{
                background: '#FFFFFF',
                borderColor: '#BFEFFF'
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs border shrink-0"
                style={{
                  background: '#BFEFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              >
                {userInitials}
              </div>
              <div className="hidden lg:block text-left pr-1.5">
                <p className="text-xs font-bold leading-tight truncate max-w-[130px]" style={{ color: '#1C6F8E' }}>
                  {currentUser?.nama || 'Ibu Rahmawati'}
                </p>
                <p className="text-[10px] leading-tight truncate max-w-[130px]" style={{ color: '#2E84A5' }}>
                  {currentUser?.jabatan || 'Konselor BK'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto transition-all relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
