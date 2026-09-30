import React from 'react';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayout = ({ children, showHeader = false, title = '', subtitle = '' }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {showHeader && (
          <header className="h-16 bg-white border-b border-slate-200 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20">
            <div>
              <h1 className="text-base font-extrabold text-slate-900 leading-tight">{title}</h1>
              {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>
          </header>
        )}

        {/* Content Body */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
