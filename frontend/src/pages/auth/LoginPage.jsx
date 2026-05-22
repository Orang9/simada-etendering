import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/login', { email, password });
      const data = response.data;

      // Ensure token and pengguna exist
      if (data.token && data.pengguna) {
        login(data);
        
        // Redirect based on role
        const role = data.role || data.pengguna.role;
        
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'pokja') {
          navigate('/pokja/dashboard');
        } else if (role === 'penyedia' || role === 'vendor') {
          navigate('/vendor/dashboard');
        } else {
          navigate('/public/dashboard');
        }
      } else {
        setError('Login failed: Invalid response format');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-600/10 blur-[80px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[80px]"></div>

      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md relative z-10 border border-slate-100">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-4">
            <span className="text-white text-3xl font-extrabold">S</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">SIMADA e-Tendering</h2>
          <p className="text-slate-500 text-sm mt-2">Pemerintah Kabupaten Kebumen</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/30 hover:from-brand-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            &copy; 2026 SIMADA e-Tendering. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
