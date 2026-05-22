import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

const PokjaDashboard = () => {
  return (
    <DashboardLayout title="Pokja Dashboard">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold mb-4">Welcome Pokja</h3>
        <p className="text-slate-600">This is the placeholder for Pokja Dashboard.</p>
      </div>
    </DashboardLayout>
  );
};

export default PokjaDashboard;
