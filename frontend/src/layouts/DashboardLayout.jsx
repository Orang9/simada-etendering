import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Send, 
  CheckSquare, 
  Award, 
  BarChart, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const DashboardLayout = ({ children, title = 'Dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userRole = user?.role?.toLowerCase() || 'public';
  const rolePrefix = userRole === 'admin' ? '/admin' : userRole === 'pokja' ? '/pokja' : (userRole === 'penyedia' || userRole === 'vendor') ? '/vendor' : '/public';

  const allMenuItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, active: title.includes('Dashboard'), path: `${rolePrefix}/dashboard`, roles: ['admin', 'pokja', 'penyedia', 'vendor', 'masyarakat', 'public'] },
    { label: 'Data Pengadaan', icon: <FileText size={20} />, active: title === 'Data Pengadaan', path: `${rolePrefix}/paket-pengadaan`, roles: ['admin', 'pokja'] },
    { label: 'Dokumen', icon: <FolderOpen size={20} />, active: title === 'Dokumen', path: '#', roles: ['admin', 'pokja'] },
    { label: 'Penawaran', icon: <Send size={20} />, active: title === 'Penawaran', path: `${rolePrefix}/penawaran`, roles: ['admin', 'penyedia', 'vendor'] },
    { label: 'Evaluasi', icon: <CheckSquare size={20} />, active: title === 'Evaluasi Penawaran', path: `${rolePrefix}/evaluasi`, roles: ['admin', 'pokja'] },
    { label: 'Pemenang Tender', icon: <Award size={20} />, active: title === 'Pemenang Tender', path: '#', roles: ['admin', 'pokja'] },
    { label: 'Laporan', icon: <BarChart size={20} />, active: title === 'Laporan', path: '#', roles: ['admin', 'pokja'] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 text-slate-700 w-64 flex-shrink-0 transition-all duration-300 flex flex-col fixed md:relative z-30 h-full shadow-sm ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:-translate-x-64'}`}>
        {/* Brand in Sidebar */}
        <div className="h-16 flex items-center px-6 bg-white border-b border-slate-200 justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center text-white mr-3 font-bold text-lg shadow-sm">
              S
            </div>
            <span className="text-sm font-bold text-slate-800 tracking-tight leading-tight">
              SIMADA<br/>KEBUMEN
            </span>
          </div>
          <button className="md:hidden text-slate-500 hover:text-slate-700" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium ${
                item.active 
                  ? 'bg-brand-50 text-brand-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-brand-600'
              }`}
            >
              <div className="mr-3">{item.icon}</div>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Menu at Bottom */}
        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative h-screen">
        
        {/* Top Navbar: Blue/Purple styling */}
        <header className="h-16 bg-gradient-to-r from-brand-600 to-indigo-700 flex items-center justify-between px-6 relative z-20 shadow-md">
          <div className="flex items-center">
            {/* Collapse sidebar button */}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 mr-4 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <Menu size={24} />
            </button>
            {/* Current Page Title */}
            <h2 className="text-lg font-bold text-white m-0 tracking-wide">{title}</h2>
          </div>

          {/* User Info / Greeting */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white m-0">Halo, {user?.nama || 'User'}</p>
              <p className="text-xs text-brand-100 m-0 capitalize">{user?.role || 'Guest'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold border border-white/30 backdrop-blur-sm">
              {user?.nama ? user.nama.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
