import React, { useState, useEffect } from 'react';
import { X, Users, RefreshCw, Download, Search, CheckCircle2, FolderDown, ExternalLink } from 'lucide-react';

interface SubmissionItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  headline: string;
  documentType: string;
  creativeType: string;
  priceFormatted: string;
  gdriveFolder?: string;
  createdAt: string;
}

interface AdminLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLeadsModal: React.FC<AdminLeadsModalProps> = ({ isOpen, onClose }) => {
  const [leads, setLeads] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      if (data.success && data.data) {
        setLeads(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch leads:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeads();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      l.email.toLowerCase().includes(search.toLowerCase())
  );

  const exportCsv = () => {
    const headers = 'Waktu,Nama,No HP,Email,Dokumen,Tarif,Lokasi\n';
    const rows = filtered
      .map(
        (l) =>
          `"${new Date(l.createdAt).toLocaleString()}","${l.name}","${l.phone}","${l.email}","${
            l.documentType === 'cv_only' ? 'CV Saja' : 'CV + Lamaran'
          }","${l.priceFormatted}","${l.location}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rekap_pengguna_cv_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-base font-extrabold">Database Pengguna & Download CV</h2>
              <p className="text-xs text-slate-300">
                Data tersimpan otomatis & notifikasi ke linkedin.anief@gmail.com
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, no WA, atau email..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://drive.google.com/drive/folders/14Ckuu7Z72kmMpx_lU3MRdhhiPqy4UNzr"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-xl border border-emerald-300 flex items-center gap-1.5"
              title="Buka Folder Google Drive Hasil CV"
            >
              <FolderDown className="w-3.5 h-3.5 text-emerald-600" />
              <span>Buka Google Drive</span>
            </a>
            <button
              type="button"
              onClick={fetchLeads}
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-300 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={exportCsv}
              disabled={filtered.length === 0}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center gap-1.5 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto p-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              {loading ? 'Memuat database...' : 'Belum ada data pengguna yang tersimpan.'}
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Waktu</th>
                    <th className="p-3">Nama Lengkap</th>
                    <th className="p-3">No HP / WhatsApp</th>
                    <th className="p-3">Dokumen</th>
                    <th className="p-3">Tarif</th>
                    <th className="p-3">Berkas PDF (Admin)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {item.name}
                        {item.headline && (
                          <span className="block text-[11px] font-normal text-slate-500">
                            {item.headline}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-700 font-mono">
                        <a
                          href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:underline"
                        >
                          {item.phone}
                        </a>
                      </td>
                      <td className="p-3 text-slate-600">
                        {item.documentType === 'cv_only' ? (
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold">
                            CV Saja
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold">
                            CV + Lamaran
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-bold text-emerald-700 whitespace-nowrap">
                        {item.priceFormatted}
                      </td>
                      <td className="p-3 whitespace-nowrap space-x-1.5">
                        <a
                          href={`/api/submissions/${item.id}/pdf/ats`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] border border-blue-200"
                          title="Download CV ATS"
                        >
                          <Download className="w-3 h-3" /> ATS
                        </a>
                        <a
                          href={`/api/submissions/${item.id}/pdf/creative`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[10px] border border-purple-200"
                          title="Download CV Creative"
                        >
                          <Download className="w-3 h-3" /> Creative
                        </a>
                        {item.documentType === 'cv_and_cover_letter' && (
                          <a
                            href={`/api/submissions/${item.id}/pdf/lamaran`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[10px] border border-amber-200"
                            title="Download Surat Lamaran"
                          >
                            <Download className="w-3 h-3" /> Lamaran
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
