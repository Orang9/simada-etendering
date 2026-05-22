import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { Search, CheckSquare, Edit, X } from 'lucide-react';

const EvaluasiPage = () => {
  const [penawaranList, setPenawaranList] = useState([]);
  const [evaluasiList, setEvaluasiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resPenawaran, resEvaluasi] = await Promise.all([
        api.get('/penawaran'),
        api.get('/evaluasi')
      ]);
      setPenawaranList(resPenawaran.data);
      setEvaluasiList(resEvaluasi.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Merge penawaran with evaluasi
  const mergedData = penawaranList.map(penawaran => {
    const evaluasi = evaluasiList.find(e => e.penawaran_id === penawaran.penawaran_id);
    return {
      ...penawaran,
      evaluasi: evaluasi || null
    };
  });

  const filteredData = mergedData.filter(item => 
    item.nomor_penawaran?.toLowerCase().includes(search.toLowerCase()) ||
    item.paket?.nama_paket?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout title="Evaluasi Penawaran">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-2">
        
        {/* Header Actions */}
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Daftar Penawaran</h3>
            <p className="text-sm text-slate-500">Evaluasi dokumen penawaran yang masuk dari penyedia.</p>
          </div>
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nomor penawaran / paket..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-white transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Nomor Penawaran</th>
                <th className="px-6 py-4">Nama Paket</th>
                <th className="px-6 py-4">Penyedia ID</th>
                <th className="px-6 py-4">Nilai Penawaran</th>
                <th className="px-6 py-4">Status Evaluasi</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center">
                      <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                    Tidak ada penawaran ditemukan.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.penawaran_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{item.nomor_penawaran}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.paket?.nama_paket || item.paket_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.pengguna?.nama || item.pengguna_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-700">
                      Rp {Number(item.nilai_penawaran).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.evaluasi ? (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          item.evaluasi.status_evaluasi === 'Lolos' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          item.evaluasi.status_evaluasi === 'Tidak Lolos' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {item.evaluasi.status_evaluasi}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-slate-100 text-slate-500 border-slate-200">
                          Belum Evaluasi
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button 
                        onClick={() => handleOpenModal(item)}
                        className={`p-1.5 rounded-lg transition-colors inline-flex items-center text-xs font-semibold px-3 ${
                          item.evaluasi 
                            ? 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 border border-indigo-200 bg-white' 
                            : 'text-white bg-brand-600 hover:bg-brand-700 shadow-sm'
                        }`}
                      >
                        {item.evaluasi ? (
                          <><Edit size={14} className="mr-1.5" /> Ubah</>
                        ) : (
                          <><CheckSquare size={14} className="mr-1.5" /> Evaluasi</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedItem && (
        <EvaluasiModal 
          item={selectedItem} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchData();
          }} 
        />
      )}
    </DashboardLayout>
  );
};

const EvaluasiModal = ({ item, onClose, onSuccess }) => {
  const isEdit = !!item.evaluasi;
  
  const [formData, setFormData] = useState({
    status_evaluasi: isEdit ? item.evaluasi.status_evaluasi : 'Evaluasi',
    nilai_teknis: isEdit ? item.evaluasi.nilai_teknis : '',
    nilai_harga: isEdit ? item.evaluasi.nilai_harga : '',
    catatan_evaluasi: isEdit ? (item.evaluasi.catatan_evaluasi || '') : ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    const teknis = parseFloat(formData.nilai_teknis) || 0;
    const harga = parseFloat(formData.nilai_harga) || 0;
    return ((teknis + harga) / 2).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const payload = {
      penawaran_id: item.penawaran_id,
      status_evaluasi: formData.status_evaluasi,
      nilai_teknis: parseFloat(formData.nilai_teknis),
      nilai_harga: parseFloat(formData.nilai_harga),
      catatan_evaluasi: formData.catatan_evaluasi
    };

    try {
      if (isEdit) {
        await api.put(`/admin/evaluasi/${item.evaluasi.evaluasi_id}`, payload);
      } else {
        await api.post('/admin/evaluasi', payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Gagal menyimpan evaluasi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 sticky top-0 z-10">
          <h3 className="text-lg font-bold text-slate-800">
            {isEdit ? 'Ubah Evaluasi' : 'Beri Evaluasi'}
          </h3>
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
          
          <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500 mb-1">Nomor Penawaran</p>
                <p className="font-semibold text-slate-800">{item.nomor_penawaran}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Nilai Penawaran</p>
                <p className="font-semibold text-brand-600">Rp {Number(item.nilai_penawaran).toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nilai Teknis (0-100)</label>
                <input 
                  type="number" 
                  name="nilai_teknis"
                  min="0"
                  max="100"
                  step="0.01"
                  required
                  value={formData.nilai_teknis}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nilai Harga (0-100)</label>
                <input 
                  type="number" 
                  name="nilai_harga"
                  min="0"
                  max="100"
                  step="0.01"
                  required
                  value={formData.nilai_harga}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex justify-between items-center">
              <span className="text-sm font-semibold text-indigo-800">Total Nilai Prediksi:</span>
              <span className="text-2xl font-bold text-indigo-600">{calculateTotal()}</span>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Status Evaluasi</label>
              <select 
                name="status_evaluasi"
                required
                value={formData.status_evaluasi}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-slate-50 focus:bg-white transition-colors"
              >
                <option value="Evaluasi">Sedang Dievaluasi</option>
                <option value="Lolos">Lolos Evaluasi</option>
                <option value="Tidak Lolos">Tidak Lolos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Catatan Evaluasi</label>
              <textarea 
                name="catatan_evaluasi"
                value={formData.catatan_evaluasi}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-slate-50 focus:bg-white transition-colors resize-none"
                placeholder="Berikan catatan detail terkait hasil evaluasi..."
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
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 shadow-sm shadow-brand-600/20 transition-colors disabled:opacity-70 flex items-center"
            >
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Menyimpan...</>
              ) : 'Simpan Evaluasi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluasiPage;
