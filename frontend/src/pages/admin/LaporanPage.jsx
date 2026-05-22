import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { Download, FileText, CheckSquare, Award, Send, LayoutDashboard, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
const LaporanPage = () => {
  const [activeTab, setActiveTab] = useState('paket');
  const [dashboardData, setDashboardData] = useState(null);
  
  const [reports, setReports] = useState({
    paket: { data: [], loading: true },
    penawaran: { data: [], loading: true },
    evaluasi: { data: [], loading: true },
    pemenang: { data: [], loading: true }
  });

  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setDashboardData(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard', err);
      }
    };
    
    fetchDashboard();
  }, []);

  useEffect(() => {
    const fetchReportData = async (type) => {
      try {
        setReports(prev => ({ ...prev, [type]: { ...prev[type], loading: true } }));
        const res = await api.get(`/laporan/${type}`);
        setReports(prev => ({ 
          ...prev, 
          [type]: { data: res.data.data || res.data, loading: false } 
        }));
      } catch (err) {
        console.error(`Failed to fetch laporan ${type}`, err);
        setReports(prev => ({ ...prev, [type]: { ...prev[type], loading: false } }));
      }
    };

    fetchReportData('paket');
    fetchReportData('penawaran');
    fetchReportData('evaluasi');
    fetchReportData('pemenang');
  }, []);

  const tabs = [
    { id: 'paket', label: 'Laporan Paket', icon: <FileText size={16} /> },
    { id: 'penawaran', label: 'Laporan Penawaran', icon: <Send size={16} /> },
    { id: 'evaluasi', label: 'Laporan Evaluasi', icon: <CheckSquare size={16} /> },
    { id: 'pemenang', label: 'Laporan Pemenang', icon: <Award size={16} /> }
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  const chartDataStatusPaket = dashboardData ? [
    { name: 'Open', value: dashboardData.paket_open || 0 },
    { name: 'Close', value: dashboardData.paket_close || 0 }
  ] : [];

  const chartDataOverview = dashboardData ? [
    { name: 'Paket', jumlah: dashboardData.total_paket },
    { name: 'Penawaran', jumlah: dashboardData.total_penawaran },
    { name: 'Pemenang', jumlah: dashboardData.total_pemenang }
  ] : [];

  const getExportData = () => {
    const currentReport = reports[activeTab];
    if (!currentReport || !currentReport.data) return { head: [], body: [] };
    let filtered = currentReport.data;
    
    if (activeTab === 'paket') {
      filtered = filtered.filter(p => p.nama_paket?.toLowerCase().includes(search.toLowerCase()));
      return {
        head: [['Nama Paket', 'OPD', 'Anggaran', 'Status']],
        body: filtered.map(p => [
          p.nama_paket,
          p.opd?.nama_opd || p.opd_id,
          p.anggaran?.pagu || 0,
          p.status
        ])
      };
    } else if (activeTab === 'penawaran') {
      filtered = filtered.filter(p => p.nomor_penawaran?.toLowerCase().includes(search.toLowerCase()));
      return {
        head: [['No Penawaran', 'Paket', 'Penyedia', 'Nilai Penawaran', 'Status']],
        body: filtered.map(p => [
          p.nomor_penawaran,
          (p.paketPengadaan || p.paket_pengadaan)?.nama_paket,
          p.pengguna?.nama,
          p.nilai_penawaran,
          p.status_penawaran
        ])
      };
    } else if (activeTab === 'evaluasi') {
      filtered = filtered.filter(e => e.penawaran?.nomor_penawaran?.toLowerCase().includes(search.toLowerCase()));
      return {
        head: [['No Penawaran', 'Evaluator', 'Teknis', 'Harga', 'Total', 'Status']],
        body: filtered.map(e => [
          e.penawaran?.nomor_penawaran,
          e.pengguna?.nama,
          e.nilai_teknis,
          e.nilai_harga,
          e.total_nilai,
          e.status_evaluasi
        ])
      };
    } else if (activeTab === 'pemenang') {
      filtered = filtered.filter(w => (w.paketPengadaan || w.paket_pengadaan)?.nama_paket?.toLowerCase().includes(search.toLowerCase()));
      return {
        head: [['Paket', 'Pemenang', 'Nilai Final', 'Status', 'Tanggal', 'Catatan']],
        body: filtered.map(w => [
          (w.paketPengadaan || w.paket_pengadaan)?.nama_paket,
          w.pengguna?.nama,
          w.nilai_final,
          w.status_pemenang,
          w.tanggal_penetapan,
          w.catatan_penetapan
        ])
      };
    }
    return { head: [], body: [] };
  };

  const handleExportPDF = () => {
    const { head, body } = getExportData();
    if (body.length === 0) return alert('Tidak ada data untuk diexport');
    const doc = new jsPDF();
    doc.text(`Laporan ${activeTab.toUpperCase()}`, 14, 15);
    autoTable(doc, { head: head, body: body, startY: 25, styles: { fontSize: 8 } });
    doc.save(`Laporan_${activeTab}.pdf`);
  };

  const handleExportExcel = () => {
    const { head, body } = getExportData();
    if (body.length === 0) return alert('Tidak ada data untuk diexport');
    const ws = XLSX.utils.aoa_to_sheet([...head, ...body]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan');
    XLSX.writeFile(wb, `Laporan_${activeTab}.xlsx`);
  };

  const renderActiveTable = () => {
    const currentReport = reports[activeTab];
    if (currentReport.loading) return <div className="p-8 text-center text-slate-500">Memuat data laporan...</div>;
    if (!currentReport.data || currentReport.data.length === 0) return <div className="p-8 text-center text-slate-500">Tidak ada data untuk laporan ini.</div>;

    if (activeTab === 'paket') {
      const filtered = currentReport.data.filter(p => p.nama_paket?.toLowerCase().includes(search.toLowerCase()));
      return (
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Nama Paket</th>
              <th className="px-6 py-4">OPD</th>
              <th className="px-6 py-4">Anggaran</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(p => (
              <tr key={p.paket_id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{p.nama_paket}</td>
                <td className="px-6 py-4">{p.opd?.nama_opd || p.opd_id}</td>
                <td className="px-6 py-4">Rp {Number(p.anggaran?.pagu || 0).toLocaleString('id-ID')}</td>
                <td className="px-6 py-4">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (activeTab === 'penawaran') {
      const filtered = currentReport.data.filter(p => p.nomor_penawaran?.toLowerCase().includes(search.toLowerCase()));
      return (
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">No Penawaran</th>
              <th className="px-6 py-4">Paket</th>
              <th className="px-6 py-4">Penyedia</th>
              <th className="px-6 py-4">Nilai Penawaran</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(p => (
              <tr key={p.penawaran_id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{p.nomor_penawaran}</td>
                <td className="px-6 py-4">{(p.paketPengadaan || p.paket_pengadaan)?.nama_paket}</td>
                <td className="px-6 py-4">{p.pengguna?.nama}</td>
                <td className="px-6 py-4 text-emerald-600 font-semibold">Rp {Number(p.nilai_penawaran).toLocaleString('id-ID')}</td>
                <td className="px-6 py-4">{p.status_penawaran}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (activeTab === 'evaluasi') {
      const filtered = currentReport.data.filter(e => e.penawaran?.nomor_penawaran?.toLowerCase().includes(search.toLowerCase()));
      return (
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">No Penawaran</th>
              <th className="px-6 py-4">Evaluator</th>
              <th className="px-6 py-4">Teknis</th>
              <th className="px-6 py-4">Harga</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(e => (
              <tr key={e.evaluasi_id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{e.penawaran?.nomor_penawaran}</td>
                <td className="px-6 py-4">{e.pengguna?.nama}</td>
                <td className="px-6 py-4">{e.nilai_teknis}</td>
                <td className="px-6 py-4">{e.nilai_harga}</td>
                <td className="px-6 py-4 font-bold text-indigo-600">{e.total_nilai}</td>
                <td className="px-6 py-4">{e.status_evaluasi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (activeTab === 'pemenang') {
      const filtered = currentReport.data.filter(w => (w.paketPengadaan || w.paket_pengadaan)?.nama_paket?.toLowerCase().includes(search.toLowerCase()));
      return (
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Paket</th>
              <th className="px-6 py-4">Pemenang</th>
              <th className="px-6 py-4">Nilai Final</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Catatan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(w => (
              <tr key={w.pemenang_id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{(w.paketPengadaan || w.paket_pengadaan)?.nama_paket}</td>
                <td className="px-6 py-4">{w.pengguna?.nama}</td>
                <td className="px-6 py-4 font-bold text-emerald-600">Rp {Number(w.nilai_final).toLocaleString('id-ID')}</td>
                <td className="px-6 py-4">{w.status_pemenang}</td>
                <td className="px-6 py-4 whitespace-nowrap">{w.tanggal_penetapan}</td>
                <td className="px-6 py-4 max-w-xs truncate" title={w.catatan_penetapan}>{w.catatan_penetapan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return null;
  };

  return (
    <DashboardLayout title="Laporan & Analytics">
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="text-slate-500 text-sm font-semibold mb-2 flex items-center"><FileText size={16} className="mr-2" /> Total Paket</div>
          <div className="text-3xl font-bold text-slate-800">{dashboardData?.total_paket || 0}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="text-slate-500 text-sm font-semibold mb-2 flex items-center"><Send size={16} className="mr-2" /> Total Penawaran</div>
          <div className="text-3xl font-bold text-brand-600">{dashboardData?.total_penawaran || 0}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="text-slate-500 text-sm font-semibold mb-2 flex items-center"><CheckSquare size={16} className="mr-2" /> Total Evaluasi</div>
          <div className="text-3xl font-bold text-indigo-600">{dashboardData?.total_evaluasi || 0}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="text-slate-500 text-sm font-semibold mb-2 flex items-center"><Award size={16} className="mr-2" /> Total Pemenang</div>
          <div className="text-3xl font-bold text-emerald-600">{dashboardData?.total_pemenang || 0}</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-700 mb-6 flex items-center"><BarChart2 size={18} className="mr-2 text-brand-600"/> Status Paket Pengadaan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartDataStatusPaket}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {chartDataStatusPaket.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-700 mb-6 flex items-center"><LayoutDashboard size={18} className="mr-2 text-brand-600"/> Overview Aktivitas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDataOverview} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="jumlah" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Reports Data Table Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        <div className="border-b border-slate-200 bg-slate-50/80 px-6 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h3 className="text-lg font-bold text-slate-800">Detail Laporan Data</h3>
            
            <div className="flex gap-2">
              <button onClick={handleExportPDF} className="flex items-center px-4 py-2 text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200">
                <Download size={16} className="mr-2" /> PDF
              </button>
              <button onClick={handleExportExcel} className="flex items-center px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200">
                <Download size={16} className="mr-2" /> Excel
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 overflow-x-auto no-scrollbar pb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id 
                    ? 'border-brand-600 text-brand-600 bg-white rounded-t-xl' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-t-xl'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar for active table */}
        <div className="p-4 border-b border-slate-100 flex justify-end bg-white">
          <input
            type="text"
            placeholder="Ketik untuk mencari di laporan ini..."
            className="w-full md:w-80 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-slate-50 focus:bg-white transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          {renderActiveTable()}
        </div>
      </div>

    </DashboardLayout>
  );
};

export default LaporanPage;
