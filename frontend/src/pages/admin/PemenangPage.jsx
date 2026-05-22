import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { Search, Award, Plus, X } from 'lucide-react';

const PemenangPage = () => {
  const [pemenangList, setPemenangList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPemenang = async () => {
    setLoading(true);
    try {
      const response = await api.get('/pemenang-tender');
      setPemenangList(response.data);
    } catch (error) {
      console.error('Failed to fetch pemenang tender', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPemenang();
  }, []);

  const filteredData = pemenangList.filter(item => 
    item.paketPengadaan?.nama_paket?.toLowerCase().includes(search.toLowerCase()) ||
    item.pengguna?.nama?.toLowerCase().includes(search.toLowerCase()) ||
    item.status_pemenang?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Pemenang Tender">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-2">
        
        {/* Header Actions */}
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Daftar Pemenang Tender</h3>
            <p className="text-sm text-slate-500">Kelola penetapan pemenang tender yang telah lulus evaluasi.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Cari paket / penyedia..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-white transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors shadow-sm shadow-brand-600/20 whitespace-nowrap"
            >
              <Plus size={18} className="mr-2" />
              Tetapkan Pemenang
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Nama Paket</th>
                <th className="px-6 py-4">Nama Penyedia</th>
                <th className="px-6 py-4">Nilai Final</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tanggal Penetapan</th>
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
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    Tidak ada pemenang tender ditemukan.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.pemenang_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{item.paketPengadaan?.nama_paket || item.paket_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.pengguna?.nama || item.pengguna_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-emerald-600">
                      Rp {Number(item.nilai_final).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        item.status_pemenang === 'Menang' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        <Award size={12} className="inline mr-1" />
                        {item.status_pemenang}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">{item.tanggal_penetapan}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <PemenangModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchPemenang();
          }} 
        />
      )}
    </DashboardLayout>
  );
};

const PemenangModal = ({ onClose, onSuccess }) => {
  const [kandidat, setKandidat] = useState([]);
  const [loadingKandidat, setLoadingKandidat] = useState(true);
  
  const [formData, setFormData] = useState({
    penawaran_id: '',
    paket_id: '',
    nilai_final: '',
    status_pemenang: 'Menang',
    catatan_penetapan: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchKandidat = async () => {
      try {
        const response = await api.get('/evaluasi');
        // Only allow "Lolos" evaluation
        const lolos = response.data.filter(e => e.status_evaluasi === 'Lolos');
        setKandidat(lolos);
      } catch (err) {
        console.error("Failed to fetch evaluasi", err);
      } finally {
        setLoadingKandidat(false);
      }
    };
    fetchKandidat();
  }, []);

  const handleSelectChange = (e) => {
    const penawaranId = e.target.value;
    if (!penawaranId) {
      setFormData(prev => ({ ...prev, penawaran_id: '', paket_id: '', nilai_final: '' }));
      return;
    }
    
    const selectedEval = kandidat.find(k => k.penawaran_id.toString() === penawaranId);
    if (selectedEval && selectedEval.penawaran) {
      setFormData(prev => ({ 
        ...prev, 
        penawaran_id: penawaranId, 
        paket_id: selectedEval.penawaran.paket_id,
        nilai_final: selectedEval.penawaran.nilai_penawaran
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!formData.penawaran_id) {
      setError('Silakan pilih kandidat pemenang terlebih dahulu.');
      setIsSubmitting(false);
      return;
    }

    try {
      await api.post('/admin/pemenang-tender', {
        paket_id: formData.paket_id,
        penawaran_id: formData.penawaran_id,
        nilai_final: parseFloat(formData.nilai_final),
        status_pemenang: formData.status_pemenang,
        catatan_penetapan: formData.catatan_penetapan
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Gagal menetapkan pemenang.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 sticky top-0 z-10">
          <h3 className="text-lg font-bold text-slate-800">Tetapkan Pemenang Tender</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 text-rose-600 text-sm font-medium border border-rose-100">
              {error}
            </div>
          )}
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Pilih Kandidat (Penawaran Lolos)</label>
              <select 
                name="penawaran_id"
                required
                value={formData.penawaran_id}
                onChange={handleSelectChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-slate-50 focus:bg-white transition-colors"
                disabled={loadingKandidat}
              >
                <option value="">{loadingKandidat ? 'Memuat kandidat...' : '-- Pilih Penawaran Lolos --'}</option>
                {kandidat.map(k => (
                  <option key={k.evaluasi_id} value={k.penawaran_id}>
                    {k.penawaran?.nomor_penawaran} - {k.pengguna?.nama} (Nilai Teknis: {k.nilai_teknis})
                  </option>
                ))}
              </select>
              {kandidat.length === 0 && !loadingKandidat && (
                <p className="text-xs text-amber-600 mt-2 font-medium">Belum ada penawaran yang lulus evaluasi.</p>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Nilai Final (Rp)</label>
              <input 
                type="number" 
                name="nilai_final"
                required
                value={formData.nilai_final}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Status Pemenang</label>
              <select 
                name="status_pemenang"
                required
                value={formData.status_pemenang}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-slate-50 focus:bg-white transition-colors"
              >
                <option value="Menang">Menang</option>
                <option value="Menang Bersyarat">Menang Bersyarat</option>
                <option value="Pemenang Cadangan">Pemenang Cadangan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Catatan Penetapan</label>
              <textarea 
                name="catatan_penetapan"
                value={formData.catatan_penetapan}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-slate-50 focus:bg-white transition-colors resize-none"
                placeholder="Berikan alasan atau catatan tambahan..."
              />
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
              disabled={isSubmitting || !formData.penawaran_id}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 shadow-sm shadow-brand-600/20 transition-colors disabled:opacity-70 flex items-center"
            >
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Memproses...</>
              ) : 'Tetapkan Pemenang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PemenangPage;
