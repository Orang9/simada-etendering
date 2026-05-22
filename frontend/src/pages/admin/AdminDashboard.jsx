import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

const AdminDashboard = () => {
  const tenderPackages = [
    {
      id: 'TND-2026-001',
      title: 'Pengadaan Server & Infrastructure Datacenter',
      category: 'Infrastruktur TI',
      budget: 'Rp 2,500,000,000',
      status: 'Aktivasi Bidding',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      date: 'Selesai: 30 Juni 2026',
    },
    {
      id: 'TND-2026-002',
      title: 'Pembangunan Sistem Informasi Manajemen Aset Terintegrasi',
      category: 'Software Development',
      budget: 'Rp 850,000,000',
      status: 'Evaluasi Dokumen',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-200',
      date: 'Selesai: 15 Juni 2026',
    },
    {
      id: 'TND-2026-003',
      title: 'Pengadaan Jasa Konsultan Keamanan Informasi (ISO 27001)',
      category: 'Jasa Konsultansi',
      budget: 'Rp 450,000,000',
      status: 'Pendaftaran Vendor',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-200',
      date: 'Selesai: 05 Juni 2026',
    },
  ];

  return (
    <DashboardLayout title="Ringkasan Pengadaan (Admin)">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden mb-8 border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="bg-brand-500/30 text-brand-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-brand-500/30">
            SIMADA e-Tendering v1.0
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-4 tracking-tight leading-tight">
            Selamat Datang di Portal Pengadaan SIMADA (Admin)
          </h2>
          <p className="text-slate-300 mt-2 text-base leading-relaxed">
            Struktur project frontend React + Vite + Tailwind CSS dan backend Laravel 11 REST API telah berhasil disetup secara clean & scalable. Gunakan dashboard ini untuk meninjau paket tender aktif dan mengelola verifikasi vendor.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide m-0">Tender Aktif</p>
          <p className="text-3xl font-bold text-slate-800 mt-2 mb-0">12</p>
          <span className="text-xs font-medium text-emerald-600 mt-2 inline-flex items-center">
            +3 dalam minggu ini
          </span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide m-0">Total Pagu Anggaran</p>
          <p className="text-3xl font-bold text-slate-800 mt-2 mb-0">Rp 3.8 M</p>
          <span className="text-xs font-medium text-slate-400 mt-2 inline-flex items-center">
            Tahun Anggaran 2026
          </span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide m-0">Vendor Terdaftar</p>
          <p className="text-3xl font-bold text-slate-800 mt-2 mb-0">87</p>
          <span className="text-xs font-medium text-emerald-600 mt-2 inline-flex items-center">
            +8 menunggu verifikasi
          </span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide m-0">Bidding Berjalan</p>
          <p className="text-3xl font-bold text-slate-800 mt-2 mb-0">4</p>
          <span className="text-xs font-medium text-slate-400 mt-2 inline-flex items-center">
            Evaluasi teknis aktif
          </span>
        </div>
      </div>

      {/* Tender List Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 m-0">Daftar Tender Terbaru</h3>
          <button className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
            Lihat Semua
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {tenderPackages.map((item, idx) => (
            <div key={idx} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-slate-50/50">
              <div className="flex-1 text-left">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-mono font-semibold text-slate-400">{item.id}</span>
                  <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full font-medium">
                    {item.category}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-800 mt-2 mb-1">{item.title}</h4>
                <p className="text-sm text-slate-500 m-0">{item.date}</p>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block uppercase tracking-wide font-medium">Nilai HPS</span>
                  <span className="text-base font-bold text-slate-800">{item.budget}</span>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${item.statusColor}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
