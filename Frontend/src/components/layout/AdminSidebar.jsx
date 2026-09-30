import React from 'react';
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
  const { logout, reports } = useStore();

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
      path: '/admin/laporan?tab=low_ai',
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

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col justify-between p-4 sticky top-0 h-screen flex-shrink-0 z-30 select-none">
      <div className="space-y-6">
        {/* Navigation Items (Matches sidebar in screenshots) */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isExact = location.pathname === item.path.split('?')[0];
            const isTabActive = item.path.includes('?') && currentPath.includes(item.path.split('?')[1]);
            const isActive = item.path.includes('?') ? isTabActive : (isExact && !location.search.includes('tab=low_ai'));

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-[#7BBCE6] text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-slate-900 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info & Actions & TLS Banner */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        {/* Bottom TLS Encrypted Box (Matches screenshot bottom box) */}
        <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs text-sky-950 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-[11px] block leading-tight text-sky-900">
              Koneksi Terenkripsi TLS 1.3
            </span>
            <span className="text-[10px] text-sky-700/80 block leading-tight">
              Satgas PPKSP Satuan Pendidikan
            </span>
          </div>
        </div>

        {/* User Mini Card */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-[#7BBCE6] text-slate-900 flex items-center justify-center font-black text-xs shrink-0">
              BK
            </div>
            <div className="overflow-hidden">
              <span className="font-bold text-xs text-slate-900 block truncate">Ibu Rahmawati</span>
              <span className="text-[10px] text-slate-400 block truncate">Konselor Utama</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar"
            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Return to Student Portal Link */}
        <Link
          to="/"
          className="w-full py-1.5 px-2 rounded-xl text-slate-500 hover:text-slate-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
