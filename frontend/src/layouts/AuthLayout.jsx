import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-slate-900 via-slate-950 to-black p-4 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Auth Card Container */}
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl p-8 relative z-10 transition-all duration-300 hover:border-slate-700/80">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-500 mb-3 shadow-inner">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11.5V10c0-2.5-.5-4.5-2.5-4.5m10 11.5a13.908 13.908 0 002.753-9.571M11 5.5h2M12 3a9 9 0 00-9 9v1.5a9 9 0 001.8 5.4L3 21l3.3-.9A9 9 0 0012 21a9 9 0 009-9V12a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white m-0">SIMADA</h1>
          <p className="text-sm text-slate-400 mt-1">Sistem Informasi Pengadaan Barang & Jasa</p>
        </div>

        {/* Children Render */}
        <div className="mt-4 text-left">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
