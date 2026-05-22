import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { ArrowLeft, Plus, Trash2, FileText, X } from 'lucide-react';

const DokumenPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dokumens, setDokumens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paketData, setPaketData] = useState(null);

  const fetchDokumens = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/paket-pengadaan/${id}/dokumen`);
      setDokumens(response.data);
    } catch (error) {
      console.error('Failed to fetch dokumen', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaketDetails = async () => {
    try {
      const response = await api.get(`/paket-pengadaan/${id}`);
      setPaketData(response.data);
    } catch (error) {
      console.error('Failed to fetch paket details', error);
    }
  };

  useEffect(() => {
    fetchDokumens();
    fetchPaketDetails();
  }, [id]);

  const handleDelete = async (dokumenId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) return;
    
    try {
      await api.delete(`/admin/dokumen/${dokumenId}`);
      fetchDokumens();
    } catch (error) {
      console.error('Failed to delete dokumen', error);
      alert('Gagal menghapus dokumen.');
    }
  };

  return (
    <DashboardLayout title="Dokumen Tender">
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-brand-600 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-sm font-semibold"
        >
          <ArrowLeft size={18} className="mr-2" />
          Kembali ke Paket
        </button>
      </div>

      {paketData && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{paketData.nama_paket}</h3>
            <p className="text-slate-500 text-sm mt-1">Kelola dokumen tender untuk paket pengadaan ini.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors shadow-sm shadow-brand-600/20"
          >
            <Plus size={18} className="mr-2" />
            Upload Dokumen
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Nama File</th>
                <th className="px-6 py-4">Jenis Dokumen</th>
                <th className="px-6 py-4">Tanggal Upload</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center">
                      <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                      Memuat dokumen...
                    </div>
                  </td>
                </tr>
              ) : dokumens.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    Belum ada dokumen yang diupload.
                  </td>
                </tr>
              ) : (
                dokumens.map((doc, index) => (
                  <tr key={doc.dokumen_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-800 flex items-center">
                      <FileText size={18} className="text-slate-400 mr-2" />
                      {doc.nama_file}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
                        {doc.jenis_dokumen}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">{doc.tanggal_upload}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button 
                        onClick={() => handleDelete(doc.dokumen_id)}
                        className="text-rose-500 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center" 
                        title="Hapus Dokumen"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <UploadDokumenModal 
          paketId={id}
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchDokumens();
          }} 
        />
      )}
    </DashboardLayout>
  );
};

const UploadDokumenModal = ({ paketId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nama_file: '',
    jenis_dokumen: 'Dokumen Pemilihan'
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
      await api.post(`/admin/paket-pengadaan/${paketId}/dokumen`, formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Gagal mengupload dokumen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">Upload Dokumen</h3>
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
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama File (Simulasi)</label>
              <input 
                type="text" 
                name="nama_file"
                required
                value={formData.nama_file}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-slate-50 focus:bg-white transition-colors"
                placeholder="misal: KAK_Pengadaan_Server.pdf"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Jenis Dokumen</label>
              <select 
                name="jenis_dokumen"
                value={formData.jenis_dokumen}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm bg-slate-50 focus:bg-white transition-colors"
              >
                <option value="Dokumen Pemilihan">Dokumen Pemilihan</option>
                <option value="KAK">Kerangka Acuan Kerja (KAK)</option>
                <option value="Rancangan Kontrak">Rancangan Kontrak</option>
                <option value="HPS">Harga Perkiraan Sendiri (HPS)</option>
                <option value="Lainnya">Lainnya</option>
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
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Mengupload...</>
              ) : 'Upload Dokumen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DokumenPage;
