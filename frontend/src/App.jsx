import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import PublicDashboard from './pages/public/PublicDashboard';
import LoginPage from './pages/auth/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import PokjaDashboard from './pages/pokja/PokjaDashboard';
import VendorDashboard from './pages/vendor/VendorDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/public/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      
      <Route element={<ProtectedRoute allowedRoles={['Admin', 'admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['Pokja', 'pokja']} />}>
        <Route path="/pokja/dashboard" element={<PokjaDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['Penyedia', 'penyedia', 'Vendor', 'vendor']} />}>
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
      </Route>
      
      <Route element={<ProtectedRoute allowedRoles={['Masyarakat', 'masyarakat']} />}>
        <Route path="/public/dashboard" element={<PublicDashboard />} />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<div className="p-8 text-center text-slate-800 text-xl font-bold mt-20">404 - Not Found</div>} />
    </Routes>
  );
}

export default App;
