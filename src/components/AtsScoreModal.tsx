import React from 'react';
import { ResumeData } from '../types/resume';
import { X, CheckCircle2, AlertCircle, Award, Sparkles } from 'lucide-react';

interface AtsScoreModalProps {
  data: ResumeData;
  isOpen: boolean;
  onClose: () => void;
}

export const AtsScoreModal: React.FC<AtsScoreModalProps> = ({ data, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Calculate ATS metrics
  const checks = [
    {
      title: 'Nama Lengkap & Kontak Terisi',
      pass: !!(data.personalInfo.fullName && data.personalInfo.email && data.personalInfo.phone),
      desc: 'Sistem ATS membutuhkan email, nama, dan nomor telepon valid agar recruiter bisa menghubungi.',
      weight: 20,
    },
    {
      title: 'Profil Eksekutif / Ringkasan Kuat',
      pass: !!(data.summary && data.summary.length >= 100),
      desc: 'Ringkasan profesional dengan panjang minimal 100 karakter membantu indexing profil kerja.',
      weight: 15,
    },
    {
      title: 'Pencapaian Utama (Career Highlights)',
      pass: data.careerHighlights.length >= 3,
      desc: 'Minimal 3 poin pencapaian utama memudahkan recruiter melihat bukti rekam jejak dalam 6 detik.',
      weight: 15,
    },
    {
      title: 'Daftar Kompetensi Inti / Keahlian',
      pass: data.coreCompetencies.length >= 6,
      desc: 'Kata kunci keahlian (minimal 6 skills) sangat penting untuk pencocokan algoritma ATS filter.',
      weight: 20,
    },
    {
      title: 'Pengalaman Kerja Terstruktur',
      pass: data.experiences.length >= 1 && data.experiences.some((e) => e.highlights.length >= 2),
      desc: 'Format jabatan, nama perusahaan, rentang tahun, dan poin-poin pencapaian yang jelas.',
      weight: 20,
    },
    {
      title: 'Metrik Terukur (Angka, %, atau Nilai Bisnis)',
      pass:
        /\d+|%|miliar|juta|billion|million|rp|idr|\$/i.test(data.summary) ||
        data.experiences.some((e) =>
          e.highlights.some((h) => /\d+|%|miliar|juta|billion|million|rp|idr|\$/i.test(h))
        ),
      desc: 'ATS dan hiring manager sangat menyukai bukti numerik (misal: "±3 miliar", "100%", "23 karyawan").',
      weight: 10,
    },
  ];

  const totalScore = checks.reduce((sum, c) => sum + (c.pass ? c.weight : 0), 0);

  const getScoreBadge = () => {
    if (totalScore >= 85) {
      return {
        text: 'Sangat Siap Lolos ATS (Excellent)',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      };
    }
    if (totalScore >= 65) {
      return {
        text: 'Cukup Baik (Perlu sedikit penyesuaian)',
        color: 'bg-amber-100 text-amber-800 border-amber-300',
      };
    }
    return {
      text: 'Perlu Dilengkapi (Kurang optimal)',
      color: 'bg-rose-100 text-rose-800 border-rose-300',
    };
  };

  const badge = getScoreBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-300" />
            <div>
              <h2 className="text-base font-bold">Evaluasi Kesiapan ATS CV</h2>
              <p className="text-xs text-blue-100">Standar Parser Sistem HR & Perusahaan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Meter */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-3xl font-extrabold text-slate-900">
              {totalScore}<span className="text-lg font-normal text-slate-500">/100</span>
            </div>
            <div className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.color}`}>
              {badge.text}
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 max-w-[200px]">
            CV format ATS kami secara default bebas kolom rumit dan tanpa tabel tersembunyi.
          </div>
        </div>

        {/* Checklist */}
        <div className="p-5 max-h-[380px] overflow-y-auto space-y-3">
          {checks.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all ${
                item.pass
                  ? 'bg-emerald-50/60 border-emerald-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-xs text-slate-900">
                  {item.pass ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  )}
                  <span>{item.title}</span>
                </div>
                <span className={`text-[11px] font-bold ${item.pass ? 'text-emerald-700' : 'text-slate-400'}`}>
                  +{item.weight} pts
                </span>
              </div>
              <p className="text-[11.5px] text-slate-600 mt-1 pl-6">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Tutup & Lanjutkan Edit
          </button>
        </div>
      </div>
    </div>
  );
};
