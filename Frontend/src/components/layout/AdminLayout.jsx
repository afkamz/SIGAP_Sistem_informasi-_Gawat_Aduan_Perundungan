import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { Bell, Search } from 'lucide-react';

export const AdminLayout = ({ children, title = '', subtitle = '' }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-base font-extrabold text-slate-900 leading-tight">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari tiket, siswa, kata kunci..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs w-64 focus:outline-none focus:border-[#A7D8F0] bg-slate-50 focus:bg-white transition"
              />
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <button
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 relative transition"
                title="Notifikasi"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 bg-red-500 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

