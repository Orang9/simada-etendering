import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { Search, Send, Eye, FileText, CheckCircle, X } from 'lucide-react';

const VendorPenawaranPage = () => {
  const [pakets, setPakets] = useState([]);
  const [riwayat, setRiwayat] = useState([]);
  const [loadingPaket, setLoadingPaket] = useState(true);
  const [loadingRiwayat, setLoadingRiwayat] = useState(true);
  
  const [search, setSearch] = useState('');
  const [selectedPaket, setSelectedPaket] = useState(null);

  const fetchPakets = async () => {
    setLoadingPaket(true);
    try {
      const response = await api.get('/paket-pengadaan');
      // Already filtered by status='open' on backend for non-admin requests,
      // but let's ensure we only show 'open' just in case.
      setPakets(response.data.filter(p => p.status === 'open'));
    } catch (error) {
      console.error('Failed to fetch pakets', error);
    } finally {
      setLoadingPaket(false);
    }
  };

  const fetchRiwayat = async () => {
    setLoadingRiwayat(true);
    try {
      const response = await api.get('/penawaran');
      setRiwayat(response.data);
    } catch (error) {
      console.error('Failed to fetch riwayat penawaran', error);
    } finally {
      setLoadingRiwayat(false);
    }
  };

  useEffect(() => {
    fetchPakets();
    fetchRiwayat();
  }, []);

  const filteredPakets = pakets.filter(paket => 
    paket.nama_paket?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Penawaran">
      
      {/* Seksi Paket Tersedia */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Paket Tender Tersedia</h3>
            <p className="text-sm text-slate-500">Pilih paket pengadaan yang sedang buka untuk mengirimkan penawaran.</p>
          </div>
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cari paket tender..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-white transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Nama Paket</th>
                <th className="px-6 py-4">OPD</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingPaket ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center">
                      <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : filteredPakets.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                    Tidak ada paket tender yang sedang buka.
                  </td>
                </tr>
              ) : (
                filteredPakets.map((paket, index) => {
                  const hasSubmitted = riwayat.some(r => r.paket_id === paket.paket_id);
                  return (
                    <tr key={paket.paket_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{paket.nama_paket}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{paket.opd?.nama_opd || paket.opd_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {hasSubmitted ? (
                          <span className="inline-flex items-center text-emerald-600 font-semibold text-xs px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
                            <CheckCircle size={14} className="mr-1" />
                            Sudah Submit
                          </span>
                        ) : (
                          <button 
                            onClick={() => setSelectedPaket(paket)}
                            className="text-white bg-brand-600 hover:bg-brand-700 px-4 py-1.5 rounded-lg transition-colors font-medium text-xs inline-flex items-center shadow-sm shadow-brand-600/20"
                          >
                            <Send size={14} className="mr-1.5" />
                            Ikuti Tender
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seksi Riwayat Penawaran */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">Riwayat Penawaran Saya</h3>
          <p className="text-sm text-slate-500">Daftar penawaran yang telah Anda ajukan.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Nomor Penawaran</th>
                <th className="px-6 py-4">Paket ID</th>
                <th className="px-6 py-4">Nilai Penawaran</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingRiwayat ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Memuat riwayat...</td>
                </tr>
              ) : riwayat.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Belum ada riwayat penawaran.</td>
                </tr>
              ) : (
                riwayat.map((item) => (
                  <tr key={item.penawaran_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{item.tanggal_penawaran}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{item.nomor_penawaran}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.paket?.nama_paket || item.paket_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-brand-600">
                      Rp {Number(item.nilai_penawaran).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
                        {item.status_penawaran}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPaket && (
        <SubmitPenawaranModal 
          paket={selectedPaket} 
          onClose={() => setSelectedPaket(null)}
          onSuccess={() => {
            setSelectedPaket(null);
            fetchRiwayat();
          }}
        />
      )}

    </DashboardLayout>
  );
};

const SubmitPenawaranModal = ({ paket, onClose, onSuccess }) => {
  const [dokumens, setDokumens] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  
  const [formData, setFormData] = useState({
    nomor_penawaran: '',
    nilai_penawaran: '',
    catatan: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await api.get(`/paket-pengadaan/${paket.paket_id}/dokumen`);
        setDokumens(response.data);
      } catch (err) {
        console.error("Failed to fetch docs", err);
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchDocs();
  }, [paket.paket_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await api.post(`/vendor/paket-pengadaan/${paket.paket_id}/penawaran`, {
        ...formData,
        nilai_penawaran: parseFloat(formData.nilai_penawaran)
      });
      setSuccess('Penawaran berhasil dikirim!');
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Gagal mengirim penawaran.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
          <h3 className="text-lg font-bold text-slate-800">Detail & Submit Penawaran</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
          
          {/* Kolom Info Paket & Dokumen */}
          <div className="flex-1 space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Informasi Paket</h4>
              <p className="text-xl font-bold text-slate-800">{paket.nama_paket}</p>
              <div className="mt-2 text-sm text-slate-600 grid grid-cols-2 gap-2">
                <div><strong>OPD ID:</strong> {paket.opd_id}</div>
                <div><strong>Metode ID:</strong> {paket.metode_id}</div>
                <div><strong>Status:</strong> <span className="text-emerald-600 font-semibold">{paket.status.toUpperCase()}</span></div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Dokumen Tender</h4>
              {loadingDocs ? (
                <p className="text-sm text-slate-500">Memuat dokumen...</p>
              ) : dokumens.length === 0 ? (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center text-sm text-slate-500">
                  Tidak ada dokumen yang dilampirkan.
                </div>
              ) : (
                <ul className="space-y-2">
                  {dokumens.map(doc => (
                    <li key={doc.dokumen_id} className="flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                      <FileText size={18} className="text-indigo-500 mr-3" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 truncate">{doc.nama_file}</p>
                        <p className="text-xs text-slate-500">{doc.jenis_dokumen}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Kolom Form Penawaran */}
          <div className="md:w-96 flex flex-col">
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 shadow-inner flex-1">
              <h4 className="text-base font-bold text-brand-900 mb-4">Form Penawaran</h4>
              
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-brand-800 mb-1.5 uppercase tracking-wide">Nomor Penawaran</label>
                  <input 
                    type="text" 
                    name="nomor_penawaran"
                    required
                    value={formData.nomor_penawaran}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-white"
                    placeholder="misal: PNW-2026-001"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-brand-800 mb-1.5 uppercase tracking-wide">Nilai Penawaran (Rp)</label>
                  <input 
                    type="number" 
                    name="nilai_penawaran"
                    required
                    value={formData.nilai_penawaran}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-white"
                    placeholder="misal: 150000000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-800 mb-1.5 uppercase tracking-wide">Catatan (Opsional)</label>
                  <textarea 
                    name="catatan"
                    value={formData.catatan}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-white resize-none"
                    placeholder="Tambahkan catatan jika ada..."
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting || success}
                    className="w-full py-3 px-4 text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 rounded-xl hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-600/30 transition-all disabled:opacity-70 flex justify-center items-center"
                  >
                    {isSubmitting ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Memproses...</>
                    ) : success ? (
                      <><CheckCircle size={18} className="mr-2" /> Sukses</>
                    ) : (
                      <><Send size={18} className="mr-2" /> Submit Penawaran</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VendorPenawaranPage;
