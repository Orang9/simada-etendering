import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import PublicDashboard from './pages/public/PublicDashboard';
import LoginPage from './pages/auth/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import PokjaDashboard from './pages/pokja/PokjaDashboard';
import VendorDashboard from './pages/vendor/VendorDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicDashboard />} />
      <Route path="/login" element={<LoginPage />} />
      
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['pokja']} />}>
        <Route path="/pokja" element={<PokjaDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
        <Route path="/vendor" element={<VendorDashboard />} />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<div className="p-8 text-center text-slate-800 text-xl font-bold mt-20">404 - Not Found</div>} />
    </Routes>
  );
}

export default App;
