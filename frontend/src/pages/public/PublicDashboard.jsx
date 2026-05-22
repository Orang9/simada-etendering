import React from 'react';
import { Link } from 'react-router-dom';

const PublicDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-lg w-full text-center border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">SIMADA e-Tendering</h1>
        <p className="text-slate-600 mb-8">Public dashboard for unauthenticated users to view open tenders.</p>
        <Link to="/login" className="bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors font-medium">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default PublicDashboard;
