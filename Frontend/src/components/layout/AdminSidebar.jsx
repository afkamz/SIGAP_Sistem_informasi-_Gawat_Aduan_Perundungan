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
  ArrowLeft
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminSidebar = () => {
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

  // Get user initials
  const userInitials = currentUser?.nama
    ? currentUser.nama.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : 'BK';

  return (
    <aside className="w-[72px] bg-white border-r border-slate-100 flex flex-col items-center justify-between py-5 sticky top-0 h-screen flex-shrink-0 z-30 select-none shadow-sm">
      {/* Top: Logo + Nav */}
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Logo */}
        <div className="w-10 h-10 rounded-2xl bg-[#3B7DE8] flex items-center justify-center shadow-md flex-shrink-0">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col items-center gap-1.5 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isExact = location.pathname === item.path.split('?')[0];
            const isTabActive = item.path.includes('?') && currentPath.includes(item.path.split('?')[1]);
            const isActive = item.path.includes('?') ? isTabActive : (isExact && !location.search.includes('tab=low_ai'));

            return (
              <div
                key={item.name}
                className="relative w-full"
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  to={item.path}
                  className={`relative w-full flex items-center justify-center p-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#3B7DE8] text-white shadow-md'
                      : 'text-slate-400 hover:bg-[#EEF3FD] hover:text-[#3B7DE8]'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isActive && (
                    <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-full bg-[#F5C518]" />
                  )}
                  {item.badge && !isActive && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </Link>

                {/* Tooltip */}
                {hoveredItem === item.name && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none">
                    <div className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg flex items-center gap-1.5">
                      {item.name}
                      {item.badge && (
                        <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col items-center gap-2 w-full px-2">
        {/* TLS Shield */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredItem('tls')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          {hoveredItem === 'tls' && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none">
              <div className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                TLS 1.3 Terenkripsi
                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
              </div>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredItem('home')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Link
            to="/"
            className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          {hoveredItem === 'home' && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none">
              <div className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                Kembali ke Beranda
                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredItem('user')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="w-9 h-9 rounded-xl bg-[#3B7DE8] text-white flex items-center justify-center font-black text-xs shadow-md">
            {userInitials}
          </div>
          {hoveredItem === 'user' && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none">
              <div className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                {currentUser?.nama || 'Ibu Rahmawati'}
                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredItem('logout')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <button
            onClick={handleLogout}
            title="Keluar"
            className="w-9 h-9 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
          {hoveredItem === 'logout' && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none">
              <div className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                Keluar
                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
