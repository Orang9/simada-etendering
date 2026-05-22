import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { Search, Plus, Eye, X, FileText } from 'lucide-react';

const PaketPengadaanPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const rolePrefix = user?.role?.toLowerCase() === 'admin' ? '/admin' : '/pokja';
  
  const [pakets, setPakets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetailPaket, setSelectedDetailPaket] = useState(null);
  
  const fetchPakets = async () => {
    setLoading(true);
    try {
      const response = await api.get('/paket-pengadaan');
      setPakets(response.data);
    } catch (error) {
      console.error('Failed to fetch paket pengadaan', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPakets();
  }, []);

  const filteredPakets = pakets.filter(paket => 
    paket.nama_paket?.toLowerCase().includes(search.toLowerCase()) ||
    paket.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Data Pengadaan">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-2">
        
        {/* Header Actions */}
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cari paket pengadaan..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-slate-50 focus:bg-white transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors shadow-sm shadow-brand-600/20"
          >
            <Plus size={18} className="mr-2" />
            Tambah Paket
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Nama Paket</th>
                <th className="px-6 py-4">OPD</th>
                <th className="px-6 py-4">Metode</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center">
                      <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : filteredPakets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    Tidak ada paket pengadaan yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredPakets.map((paket, index) => (
                  <tr key={paket.paket_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{paket.nama_paket}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{paket.opd?.nama_opd || paket.opd_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{paket.metode?.nama_metode || paket.metode_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        paket.status === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        paket.status === 'close' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {paket.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button 
                        onClick={() => setSelectedDetailPaket(paket)}
                        className="text-brand-600 hover:text-brand-800 p-1.5 hover:bg-brand-50 rounded-lg transition-colors inline-flex items-center mr-1" 
                        title="Detail Paket"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => navigate(`${rolePrefix}/paket-pengadaan/${paket.paket_id}/dokumen`)}
                        className="text-indigo-600 hover:text-indigo-800 p-1.5 hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center" 
                        title="Dokumen Tender"
                      >
                        <FileText size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Paket */}
      {isModalOpen && (
        <AddPaketModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchPakets();
          }} 
        />
      )}

      {/* Modal Detail Paket */}
      {selectedDetailPaket && (
        <DetailPaketModal 
          paket={selectedDetailPaket} 
          onClose={() => setSelectedDetailPaket(null)} 
        />
      )}
    </DashboardLayout>
  );
};

const AddPaketModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nama_paket: '',
    status: 'open',
    opd_id: 1,
    metode_id: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/admin/paket-pengadaan', {
        ...formData,
        opd_id: parseInt(formData.opd_id),
        metode_id: parseInt(formData.metode_id)
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Gagal menambahkan paket pengadaan. Periksa kembali data Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">Tambah Paket Pengadaan</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 text-rose-600 text-sm font-medium border border-rose-100">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Paket</label>
              <input 
                type="text" 
                name="nama_paket"
                required
                value={formData.nama_paket}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-slate-50 focus:bg-white transition-colors"
                placeholder="Masukkan nama paket tender"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">OPD</label>
                <select 
                  name="opd_id"
                  required
                  value={formData.opd_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-slate-50 focus:bg-white transition-colors"
                >
                  <option value="1">Dinas Kesehatan</option>
                  <option value="2">Dinas Pendidikan</option>
                  <option value="3">Dinas Pekerjaan Umum</option>
                  <option value="4">Dinas Komunikasi dan Informatika</option>
                  <option value="5">Sekretariat Daerah</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Metode Pengadaan</label>
                <select 
                  name="metode_id"
                  required
                  value={formData.metode_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-slate-50 focus:bg-white transition-colors"
                >
                  <option value="1">Tender Cepat</option>
                  <option value="2">Tender Umum</option>
                  <option value="3">Penunjukan Langsung</option>
                  <option value="4">Pengadaan Langsung</option>
                  <option value="5">E-Purchasing</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Status Awal</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-slate-50 focus:bg-white transition-colors"
              >
                <option value="open">Open (Buka)</option>
                <option value="close">Close (Tutup)</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 shadow-sm shadow-brand-600/20 transition-colors disabled:opacity-70 flex items-center"
            >
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Menyimpan...</>
              ) : 'Simpan Paket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaketPengadaanPage;

const DetailPaketModal = ({ paket, onClose }) => {
  const [dokumens, setDokumens] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

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

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
          <h3 className="text-lg font-bold text-slate-800">Detail Paket Pengadaan</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
            <h4 className="text-xl font-bold text-slate-800 mb-4">{paket.nama_paket}</h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <p className="text-slate-500 font-medium mb-1">Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border inline-block ${
                  paket.status === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                  paket.status === 'close' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                  'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {paket.status.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">OPD</p>
                <p className="font-semibold text-slate-800">{paket.opd?.nama_opd || paket.opd_id}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">Metode Pengadaan</p>
                <p className="font-semibold text-slate-800">{paket.metode?.nama_metode || paket.metode_id}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">Anggaran Pagu</p>
                <p className="font-bold text-emerald-600">
                  Rp {Number(paket.anggaran?.pagu || 0).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Dokumen Tender</h4>
            {loadingDocs ? (
              <div className="flex justify-center items-center py-4 text-slate-500 text-sm">
                <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                Memuat dokumen...
              </div>
            ) : dokumens.length === 0 ? (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center text-sm text-slate-500">
                Tidak ada dokumen yang dilampirkan pada paket ini.
              </div>
            ) : (
              <ul className="grid sm:grid-cols-2 gap-3">
                {dokumens.map(doc => (
                  <li key={doc.dokumen_id} className="flex items-center p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm">
                    <FileText size={18} className="text-indigo-500 mr-3 shrink-0" />
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
      </div>
    </div>
  );
};
