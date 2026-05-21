import React, { useState } from 'react';

const DashboardLayout = ({ children, title = 'Dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Stub sidebar items (scalable navigation)
  const menuItems = [
    { label: 'Dashboard', icon: 'grid', active: true },
    { label: 'Paket Tender', icon: 'file-text', active: false },
    { label: 'Registrasi Vendor', icon: 'shield', active: false },
    { label: 'Evaluasi & Bid', icon: 'award', active: false },
    { label: 'Pengaturan', icon: 'settings', active: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`bg-slate-900 border-r border-slate-800 text-slate-300 w-64 flex-shrink-0 transition-all duration-300 flex flex-col ${sidebarOpen ? 'ml-0' : '-ml-64'}`}>
        {/* Brand */}
        <div className="h-16 flex items-center px-6 bg-slate-950/40 border-b border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white mr-3 font-bold text-lg">
            S
          </div>
          <span className="text-lg font-bold text-white tracking-wider">SIMADA e-Tendering</span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item, idx) => (
            <a
              key={idx}
              href="#"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group text-sm ${
                item.active 
                  ? 'bg-brand-600 text-white font-medium shadow-md shadow-brand-600/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              {/* Menu Label */}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* User profile bottom anchor */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/20 flex items-center">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold shadow-inner mr-3">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate m-0">John Doe</p>
            <p className="text-xs text-slate-400 truncate m-0">Panitia Pengadaan</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 relative z-20">
          {/* Collapse sidebar button */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>

          {/* Current Page Title */}
          <h2 className="text-lg font-bold text-slate-800 m-0 uppercase tracking-wide">{title}</h2>

          {/* Notification & Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors relative">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <span className="text-sm text-slate-500">21 Mei 2026</span>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-7xl mx-auto text-left">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
