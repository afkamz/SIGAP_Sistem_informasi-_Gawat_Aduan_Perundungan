import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { Bell, Search } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLayout = ({ children, showHeader = false, title = '', subtitle = '' }) => {
  const { currentUser } = useStore();

  const userInitials = currentUser?.nama
    ? currentUser.nama.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : 'BK';

  return (
    <div className="min-h-screen bg-[#EEF3FD] flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-14 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3 flex-1">
            {/* Search Bar */}
            <div className="relative max-w-xs w-full hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari laporan, kasus, siswa..."
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-[#EEF3FD] border border-transparent text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#3B7DE8]/30 focus:bg-white transition"
              />
            </div>
            {showHeader && (
              <div className="ml-2 hidden lg:block">
                <h1 className="text-sm font-extrabold text-slate-900 leading-tight">{title}</h1>
                {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button className="relative w-8 h-8 rounded-xl bg-[#EEF3FD] hover:bg-[#dde9fa] flex items-center justify-center transition">
              <Bell className="w-4 h-4 text-slate-500" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-1 ring-white" />
            </button>

            {/* User Badge */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-[#3B7DE8] text-white flex items-center justify-center font-black text-xs shadow-sm">
                {userInitials}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser?.nama || 'Ibu Rahmawati'}</p>
                <p className="text-[10px] text-slate-400 leading-tight">{currentUser?.jabatan || 'Konselor BK'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
