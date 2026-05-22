import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { Package, FolderOpen, Send, Award, CheckSquare, Users } from 'lucide-react';

const PokjaDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <DashboardLayout title="Pokja Dashboard">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-50 rounded-full opacity-50 blur-2xl"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Dashboard Kelompok Kerja (Pokja)
          </h2>
          <p className="text-slate-600">
            Berikut adalah ringkasan data pengadaan saat ini.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div></div>
      ) : data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <SummaryCard title="Total Paket" value={data.total_paket} icon={<Package />} color="bg-blue-50 text-blue-600" />
          <SummaryCard title="Paket Open" value={data.paket_open} icon={<FolderOpen />} color="bg-emerald-50 text-emerald-600" />
          <SummaryCard title="Paket Close" value={data.paket_close} icon={<CheckSquare />} color="bg-slate-100 text-slate-600" />
          <SummaryCard title="Total Penawaran" value={data.total_penawaran} icon={<Send />} color="bg-indigo-50 text-indigo-600" />
          <SummaryCard title="Total Evaluasi" value={data.total_evaluasi} icon={<CheckSquare />} color="bg-amber-50 text-amber-600" />
          <SummaryCard title="Total Pemenang" value={data.total_pemenang} icon={<Award />} color="bg-rose-50 text-rose-600" />
          <SummaryCard title="Total Penyedia" value={data.total_penyedia} icon={<Users />} color="bg-purple-50 text-purple-600" />
        </div>
      ) : (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-xl border border-rose-100">Gagal memuat data dashboard.</div>
      )}
    </DashboardLayout>
  );
};

const SummaryCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export default PokjaDashboard;
