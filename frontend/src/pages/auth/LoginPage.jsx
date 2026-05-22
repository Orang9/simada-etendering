import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login({ role });
    switch (role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'pokja':
        navigate('/pokja');
        break;
      case 'vendor':
        navigate('/vendor');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-slate-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Login to SIMADA</h2>
        <div className="space-y-4">
          <button onClick={() => handleLogin('admin')} className="w-full bg-slate-800 text-white p-3 rounded-lg font-medium hover:bg-slate-900 transition-colors">
            Login as Admin
          </button>
          <button onClick={() => handleLogin('pokja')} className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Login as Pokja
          </button>
          <button onClick={() => handleLogin('vendor')} className="w-full bg-amber-600 text-white p-3 rounded-lg font-medium hover:bg-amber-700 transition-colors">
            Login as Vendor
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
