import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Folder,
  Sparkles,
  History,
  Settings,
  LogOut,
  ShieldCheck,
  ArrowLeft,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminSidebar = ({
  isExpanded = true,
  isMobileOpen = false,
  setIsMobileOpen = () => {},
  toggleSidebar = () => {}
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, reports, currentUser } = useStore();
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const pendingCount = reports.filter((r) => r.is_active && r.status === 'menunggu').length;

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'Daftar Laporan',
      path: '/admin/laporan',
      icon: Folder,
      badge: pendingCount > 0 ? pendingCount : null
    },
    {
      name: 'Validasi AI',
      path: '/admin/validasi-ai',
      icon: Sparkles,
      badge: null
    },
    {
      name: 'Audit Trail',
      path: '/admin/audit',
      icon: History,
      badge: null
    },
    {
      name: 'Pengaturan',
      path: '/admin/pengaturan',
      icon: Settings,
      badge: null
    }
  ];

  const currentPath = location.pathname + location.search;

  // Inisial nama pengguna
  const userInitials = currentUser?.nama
    ? currentUser.nama
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'BK';

  return (
    <>
      <aside
        className={`bg-white/95 backdrop-blur-md border-r flex flex-col justify-between py-4 select-none shadow-[0_8px_30px_rgba(191,239,255,0.35)] transition-all duration-300 ease-in-out
          fixed inset-y-0 left-0 h-screen h-[100dvh] z-50 lg:z-30 overflow-y-auto lg:overflow-visible
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64 ${isExpanded ? 'lg:w-60' : 'lg:w-[76px]'}
        `}
        style={{ borderColor: 'rgba(191, 239, 255, 0.7)' }}
      >
        {/* Top: Logo & Brand + Nav Items */}
        <div className="flex flex-col gap-5 w-full">
          {/* Header Brand */}
          <div className={`flex items-center justify-between px-3 h-10 ${!isExpanded ? 'lg:justify-center lg:px-2' : ''}`}>
            <Link to="/admin" className="flex items-center gap-2.5 overflow-hidden group">
              <img
                src="/assets/branding/logo-sigap.png"
                alt="Logo SIGAP"
                className="h-8 w-auto object-contain flex-shrink-0 group-hover:scale-105 transition-transform"
              />
              {/* Teks Brand (Hanya tampil saat Expanded di desktop atau saat drawer di mobile) */}
              <div className={`overflow-hidden transition-opacity duration-200 ${!isExpanded ? 'lg:hidden' : 'block'}`}>
                <span className="font-black text-base tracking-tight block leading-tight text-[#1C6F8E]">
                  SIGAP
                </span>
                <span className="text-[10px] font-semibold block leading-tight text-[#2E84A5]">
                  Panel Admin &amp; BK
                </span>
              </div>
            </Link>

            {/* Tombol Close khusus tampilan Mobile Drawer */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              title="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1.5 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isExact = location.pathname === item.path.split('?')[0];
              const isTabActive = item.path.includes('?') && currentPath.includes(item.path.split('?')[1]);
              const isActive = item.path.includes('?')
                ? isTabActive
                : isExact && !location.search.includes('tab=low_ai');

              return (
                <div
                  key={item.name}
                  className="relative w-full"
                  onMouseEnter={() => !isExpanded && setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`relative w-full flex items-center rounded-2xl transition-all duration-200 border ${
                      isExpanded
                        ? 'px-3.5 py-2.5 gap-3 justify-between'
                        : 'p-2.5 justify-center'
                    }`}
                    style={{
                      background: isActive ? '#BFEFFF' : 'transparent',
                      color: isActive ? '#1C6F8E' : '#2E84A5',
                      borderColor: isActive ? '#BFEFFF' : 'transparent',
                      fontWeight: isActive ? 700 : 600
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className="w-5 h-5 flex-shrink-0" style={{ color: '#1C6F8E' }} />
                      {/* Label Teks Menu */}
                      <span
                        className={`text-xs truncate transition-opacity duration-200 ${
                          !isExpanded ? 'lg:hidden' : 'block'
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>

                    {/* Indikator Titik saat Aktif */}
                    {isActive && (
                      <span
                        className={`rounded-full ${
                          isExpanded
                            ? 'w-2 h-2 mr-0.5'
                            : 'absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-6'
                        }`}
                        style={{ background: '#1C6F8E' }}
                      />
                    )}

                    {/* Badge Notifikasi */}
                    {item.badge && !isActive && (
                      <span
                        className={`rounded-full bg-red-500 text-white font-extrabold flex items-center justify-center shadow-xs ${
                          isExpanded
                            ? 'px-2 py-0.5 text-[10px]'
                            : 'absolute top-1 right-1 w-4 h-4 text-[9px]'
                        }`}
                      >
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </Link>

                  {/* Tooltip on Hover (Collapsed Desktop) */}
                  {!isExpanded && hoveredItem === item.name && (
                    <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none animate-fade-in">
                      <div className="glass-panel-dark text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-2xl flex items-center gap-1.5 border border-white/20">
                        {item.name}
                        {item.badge && (
                          <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                        <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900/90" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Controls & User Info */}
        <div className="flex flex-col gap-2.5 px-3 pt-3 border-t border-[#BFEFFF]">
          {/* TLS Encrypted Banner */}
          <div
            className="relative"
            onMouseEnter={() => !isExpanded && setHoveredItem('tls')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {isExpanded ? (
              <div className="p-2.5 rounded-2xl bg-[#D6F5FF]/40 border border-[#BFEFFF] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#1C6F8E] shrink-0 mt-0.5" />
                <div className="overflow-hidden">
                  <span className="font-bold text-[11px] block leading-tight text-[#1C6F8E]">
                    TLS 1.3 Terenkripsi
                  </span>
                  <span className="text-[10px] text-slate-500 block leading-tight truncate">
                    Satgas PPKSP Resmi
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full flex items-center justify-center">
                <div className="w-10 h-10 rounded-2xl bg-[#D6F5FF]/40 border border-[#BFEFFF] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#1C6F8E]" />
                </div>
              </div>
            )}

            {!isExpanded && hoveredItem === 'tls' && (
              <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none">
                <div className="bg-[#1C6F8E] text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-md border border-[#BFEFFF]">
                  Koneksi TLS 1.3 Terenkripsi
                  <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1C6F8E]" />
                </div>
              </div>
            )}
          </div>

          {/* User Profile Mini Card */}
          <div
            className="relative"
            onMouseEnter={() => !isExpanded && setHoveredItem('user')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {isExpanded ? (
              <div className="p-2.5 rounded-2xl bg-white border border-[#BFEFFF] shadow-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-[#1C6F8E] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs border border-white/30">
                    {userInitials}
                  </div>
                  <div className="overflow-hidden">
                    <span className="font-bold text-xs text-slate-900 block truncate">
                      {currentUser?.nama || 'Ibu Rahmawati'}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {currentUser?.jabatan || 'Konselor BK'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Keluar"
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-full flex items-center justify-center">
                <div className="w-10 h-10 rounded-2xl bg-[#1C6F8E] text-white flex items-center justify-center font-black text-xs shadow-md border border-white/40">
                  {userInitials}
                </div>
              </div>
            )}

            {!isExpanded && hoveredItem === 'user' && (
              <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none">
                <div className="bg-[#1C6F8E] text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-md border border-[#BFEFFF]">
                  {currentUser?.nama || 'Ibu Rahmawati'} • {currentUser?.jabatan || 'Konselor BK'}
                  <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1C6F8E]" />
                </div>
              </div>
            )}
          </div>

          {/* Back to Home & Logout Buttons (Collapsed View) */}
          {!isExpanded && (
            <div className="flex flex-col items-center gap-1.5">
              {/* Back to Home */}
              <div
                className="relative w-full flex justify-center"
                onMouseEnter={() => setHoveredItem('home')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  to="/"
                  className="w-10 h-10 rounded-2xl bg-white border border-[#BFEFFF] text-slate-500 hover:text-[#1C6F8E] hover:bg-[#BFEFFF]/20 flex items-center justify-center transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                {hoveredItem === 'home' && (
                  <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none">
                    <div className="bg-[#1C6F8E] text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-md border border-[#BFEFFF]">
                      Kembali ke Beranda
                      <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1C6F8E]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <div
                className="relative w-full flex justify-center"
                onMouseEnter={() => setHoveredItem('logout')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-2xl bg-white border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                {hoveredItem === 'logout' && (
                  <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none">
                    <div className="bg-[#1C6F8E] text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-md border border-[#BFEFFF]">
                      Keluar dari Panel Admin
                      <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1C6F8E]" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Back to Home Link (Expanded View) */}
          {isExpanded && (
            <Link
              to="/"
              className="w-full py-2 px-3 rounded-2xl bg-white border border-[#BFEFFF] text-slate-600 hover:text-[#1C6F8E] hover:bg-[#BFEFFF]/20 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
