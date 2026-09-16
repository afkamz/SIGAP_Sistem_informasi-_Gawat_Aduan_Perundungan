import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  History,
  Settings,
  LogOut,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, reports } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const pendingCount = reports.filter((r) => r.is_active && r.status === 'menunggu').length;

  const navItems = [
    {
      name: 'Dashboard Statistik',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'Daftar Pengaduan',
      path: '/admin/laporan',
      icon: FileText,
      badge: pendingCount > 0 ? pendingCount : null
    },
    {
      name: 'Jejak Audit (Immutable)',
      path: '/admin/audit',
      icon: History,
      badge: null
    },
    {
      name: 'Pengaturan Sistem',
      path: '/admin/pengaturan',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 sticky top-0 h-screen flex-shrink-0">
      <div className="space-y-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="w-10 h-10 rounded-xl bg-[#A7D8F0] flex items-center justify-center text-slate-900 font-extrabold shadow-xs">
            <ShieldAlert className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight block text-slate-900 leading-none">SIGAP</span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Console Satgas</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-sky-50 text-sky-900 border border-sky-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-700' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info & Actions */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sky-200 text-sky-900 flex items-center justify-center font-bold text-xs">
            RB
          </div>
          <div className="overflow-hidden">
            <span className="font-bold text-xs text-slate-900 block truncate">Ibu Rahmawati, S.Pd</span>
            <span className="text-[10px] text-slate-500 block truncate">Konselor BK Utama</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex-1 py-2 px-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Portal Siswa</span>
          </Link>
          <button
            onClick={handleLogout}
            className="py-2 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
            title="Keluar"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

