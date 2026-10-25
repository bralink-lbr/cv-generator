import React, { useState } from 'react';
import {
  ResumeData,
  CreativeTemplateType,
  PastelPalette,
  Language,
  DocumentType,
  LanguageItem,
} from '../types/resume';
import { PASTEL_PALETTES } from '../constants/palettes';
import { TemplateThumbnails } from './TemplateThumbnails';
import { OfficeColorPicker } from './OfficeColorPicker';
import {
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Building2,
  FileCheck2,
  Wand2,
  Loader2,
  Languages,
} from 'lucide-react';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (updated: ResumeData) => void;
  creativeType: CreativeTemplateType;
  onCreativeTypeChange: (type: CreativeTemplateType) => void;
  selectedPalette: PastelPalette;
  onPaletteChange: (palette: PastelPalette) => void;
  documentType: DocumentType;
  onDocumentTypeChange: (docType: DocumentType) => void;
  onGenerateWithAi: () => void;
  isGenerating: boolean;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({
  data,
  onChange,
  creativeType,
  onCreativeTypeChange,
  selectedPalette,
  onPaletteChange,
  documentType,
  onDocumentTypeChange,
  onGenerateWithAi,
  isGenerating,
}) => {
  // Simple raw skills string state for easy input
  const [skillsInput, setSkillsInput] = useState(data.coreCompetencies.join(', '));

  const updatePersonalInfo = (field: keyof typeof data.personalInfo, value: string) => {
    const finalVal = (field === 'fullName' || field === 'headline') ? value.toUpperCase() : value;
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: finalVal,
      },
    });
  };

  const handleLanguageChange = (lang: Language) => {
    onChange({
      ...data,
      lang,
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updatePersonalInfo('photoUrl', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkillsBlur = () => {
    const parsed = skillsInput
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    onChange({
      ...data,
      coreCompetencies: parsed,
    });
  };

  // Experience handlers
  const addExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      role: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      highlights: [''],
    };
    onChange({
      ...data,
      experiences: [...data.experiences, newExp],
    });
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...data.experiences];
    const finalVal = field === 'role' && typeof value === 'string' ? value.toUpperCase() : value;
    updated[index] = { ...updated[index], [field]: finalVal };
    onChange({ ...data, experiences: updated });
  };

  const removeExperience = (index: number) => {
    onChange({
      ...data,
      experiences: data.experiences.filter((_, i) => i !== index),
    });
  };

  const updateExpHighlight = (expIndex: number, text: string) => {
    const updated = [...data.experiences];
    updated[expIndex].highlights = [text];
    onChange({ ...data, experiences: updated });
  };

  // Education handlers
  const addEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      degree: '',
      field: '',
      institution: '',
      startYear: '',
      endYear: '',
    };
    onChange({
      ...data,
      educations: [...data.educations, newEdu],
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...data.educations];
    // Otomatis ubah input riwayat pendidikan (degree, field, institution) menjadi UPPERCASE
    const finalVal = ['degree', 'field', 'institution'].includes(field) ? value.toUpperCase() : value;
    updated[index] = { ...updated[index], [field]: finalVal };
    onChange({ ...data, educations: updated });
  };

  const handleToneChange = (tone: 'staff' | 'manager') => {
    onChange({
      ...data,
      toneLevel: tone,
    });
  };

  const removeEducation = (index: number) => {
    onChange({
      ...data,
      educations: data.educations.filter((_, i) => i !== index),
    });
  };

  // Cover Letter fields update
  const updateCoverLetter = (field: 'targetCompany' | 'targetPosition' | 'content', value: string) => {
    onChange({
      ...data,
      coverLetter: {
        targetCompany: data.coverLetter?.targetCompany || '',
        targetPosition: data.coverLetter?.targetPosition || '',
        content: data.coverLetter?.content || '',
        [field]: value,
      },
    });
  };

  // Language handlers
  const addLanguage = () => {
    const newLang: LanguageItem = {
      id: `lang-${Date.now()}`,
      name: '',
      level: 'Fasih / Native',
    };
    onChange({
      ...data,
      languages: [...(data.languages || []), newLang],
    });
  };

  const updateLanguage = (index: number, field: keyof LanguageItem, value: string) => {
    const updated = [...(data.languages || [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, languages: updated });
  };

  const removeLanguage = (index: number) => {
    onChange({
      ...data,
      languages: (data.languages || []).filter((_, i) => i !== index),
    });
  };

  const currentTone = data.toneLevel || 'staff';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-slate-800">
      {/* Top Banner: Dropdown Dokumen, Bahasa & Gaya Bahasa AI */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 border-b border-slate-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Dropdown 1: CV Saja vs CV + Lamaran */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span>Mau Buat Dokumen Apa?</span>
            </label>
            <select
              value={documentType}
              onChange={(e) => onDocumentTypeChange(e.target.value as DocumentType)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border-2 border-blue-300 bg-white shadow-2xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="cv_only">1. CV Saja (Dapat 2 PDF: ATS & Creative)</option>
              <option value="cv_and_cover_letter">
                2. CV dan Surat Lamaran (Dapat 3 PDF: ATS + Creative + Lamaran)
              </option>
            </select>
          </div>

          {/* Dropdown 2: Bahasa */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Bahasa CV & Dokumen
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleLanguageChange('id')}
                className={`py-2 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-1.5 ${
                  data.lang === 'id'
                    ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>🇮🇩 Bahasa Indonesia</span>
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`py-2 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-1.5 ${
                  data.lang === 'en'
                    ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>🇬🇧 English</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gaya Bahasa & Tingkat Posisi untuk AI */}
        <div className="pt-2 border-t border-slate-200/70">
          <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Gaya Bahasa & Level Posisi AI:</span>
            </span>
            <span className="text-[11px] font-normal text-slate-500">
              *Menyesuaikan gaya kalimat agar tepat sasaran
            </span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleToneChange('staff')}
              className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                currentTone === 'staff'
                  ? 'border-emerald-600 bg-emerald-50/90 text-emerald-950 shadow-xs ring-1 ring-emerald-500'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-xs">
                <span>🌱 Staf / Pelaksana / Lapangan</span>
                {currentTone === 'staff' && (
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    Aktif
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                Bahasa sederhana, bersahaja, jujur, sopan, disiplin, dan bertanggung jawab. Merendah tapi tidak rendah diri (cocok untuk driver, kurir, kasir, staf toko, admin, teknisi, fresh graduate).
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleToneChange('manager')}
              className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                currentTone === 'manager'
                  ? 'border-blue-600 bg-blue-50/90 text-blue-950 shadow-xs ring-1 ring-blue-500'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-xs">
                <span>👔 Supervisor / Manager / Eksekutif</span>
                {currentTone === 'manager' && (
                  <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    Aktif
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                Bahasa manajerial, kepemimpinan tim, efisiensi operasional, pencapaian target, dan strategis (cocok untuk level lead, asisten manager, kepala cabang, manager ke atas).
              </p>
            </button>
          </div>
        </div>

        {/* AI Auto-Polish Callout */}
        <div className="p-3 bg-indigo-50/90 rounded-xl border border-indigo-200/80 flex items-start gap-2.5 text-xs text-indigo-950">
          <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="font-bold">Bisa isi dengan info minim & bahasa seadanya!</span>{' '}
            Cukup masukkan data ringkas di bawah, saat klik tombol <strong>"Generate dengan AI"</strong>, sistem otomatis menyusun kalimat yang pas sesuai level posisi yang Anda pilih di atas.
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* MODEL TEMPLATE CREATIVE (Thumbnail Gambar) */}
        <div>
          <TemplateThumbnails
            selected={creativeType}
            onSelect={onCreativeTypeChange}
            palette={selectedPalette}
          />
        </div>

        {/* WARNA UNTUK CV CREATIVE (Office Shape Fill Style) */}
        <div className="pt-2 border-t border-slate-100">
          <OfficeColorPicker
            selectedPalette={selectedPalette}
            onSelectPalette={onPaletteChange}
          />
        </div>

        {/* FORM SECTION 1: DATA PRIBADI */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Data Pribadi & Kontak
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap *
              </label>
              <input
                type="text"
                value={data.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                placeholder="Misal: Budi Santoso"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Profesi / Posisi Target
              </label>
              <input
                type="text"
                value={data.personalInfo.headline}
                onChange={(e) => updatePersonalInfo('headline', e.target.value)}
                placeholder="Misal: Sales Executive / Admin / Desainer"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={data.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                placeholder="emailkamu@gmail.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor HP / WhatsApp
              </label>
              <input
                type="tel"
                value={data.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                placeholder="0812-3456-7890"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kota / Domisili
              </label>
              <input
                type="text"
                value={data.personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                placeholder="Jakarta Selatan, DKI Jakarta"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Foto Profil Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Upload Foto Profil (Opsional untuk Creative)
              </label>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-300 bg-slate-100 flex items-center justify-center flex-shrink-0">
                  {data.personalInfo.photoUrl ? (
                    <img
                      src={data.personalInfo.photoUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <label className="cursor-pointer px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{data.personalInfo.photoUrl ? 'Ganti Foto' : 'Pilih Foto'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                {data.personalInfo.photoUrl && (
                  <button
                    type="button"
                    onClick={() => updatePersonalInfo('photoUrl', '')}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* KHUSUS DOKUMEN: CV DAN SURAT LAMARAN */}
        {documentType === 'cv_and_cover_letter' && (
          <div className="p-4 bg-amber-50/60 rounded-xl border-2 border-amber-300 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-700" />
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Tujuan Surat Lamaran Kerja
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Perusahaan yang Dituju *
                </label>
                <input
                  type="text"
                  value={data.coverLetter?.targetCompany || ''}
                  onChange={(e) => updateCoverLetter('targetCompany', e.target.value)}
                  placeholder="Misal: PT Tokopedia / Shopee Indonesia"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Posisi yang Dilamar *
                </label>
                <input
                  type="text"
                  value={data.coverLetter?.targetPosition || ''}
                  onChange={(e) => updateCoverLetter('targetPosition', e.target.value)}
                  placeholder="Misal: Marketing Specialist / Staf Admin"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Tambahan untuk Surat Lamaran (Boleh Seadanya)
                </label>
                <textarea
                  rows={2}
                  value={data.coverLetter?.content || ''}
                  onChange={(e) => updateCoverLetter('content', e.target.value)}
                  placeholder="Tulis alasan tertarik melamar atau poin penting lainnya... (AI akan merangkai menjadi surat resmi yang persuasif)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* FORM SECTION 2: PROFIL / TENTANG SAYA */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Profil Singkat / Tentang Saya (Bisa Tulis Seadanya)
            </h3>
            <span className="text-[11px] text-indigo-600 font-medium">
              ✨ Akan dipoles AI otomatis
            </span>
          </div>
          <textarea
            rows={3}
            value={data.summary}
            onChange={(e) => onChange({ ...data, summary: e.target.value })}
            placeholder="Contoh seadanya: 'Saya lulusan manajemen yang berpengalaman 3 tahun di bidang penjualan ritel dan logistik. Terbiasa memimpin tim kecil dan mencari target pelanggan baru.'"
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* FORM SECTION 3: PENGALAMAN KERJA */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                3. Pengalaman Kerja (Bisa Info Minim)
              </h3>
            </div>
            <button
              type="button"
              onClick={addExperience}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Pekerjaan</span>
            </button>
          </div>

          {data.experiences.length === 0 ? (
            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
              Belum ada riwayat kerja. Klik tombol di atas jika memiliki pengalaman kerja, atau biarkan kosong jika Anda Fresh Graduate.
            </div>
          ) : (
            <div className="space-y-3">
              {data.experiences.map((exp, idx) => (
                <div
                  key={exp.id || idx}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Pekerjaan #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                        Posisi / Jabatan
                      </label>
                      <input
                        type="text"
                        value={exp.role ? exp.role.toUpperCase() : ''}
                        onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                        placeholder="MISAL: PRAMUNIAGA / KASIR / ADMIN"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white uppercase font-medium placeholder:normal-case"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                        Nama Perusahaan
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                        placeholder="Nama Perusahaan"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  {/* Tahun Mulai & Tahun Selesai Terpisah */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                        Tahun Mulai
                      </label>
                      <input
                        type="text"
                        value={exp.startDate || ''}
                        onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                        placeholder="Misal: 2021"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <label className="text-[10px] font-semibold text-slate-500">
                          Tahun Selesai
                        </label>
                        <label className="flex items-center gap-1 text-[10.5px] text-blue-700 font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={exp.isCurrent || exp.endDate === 'Sekarang'}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              updateExperience(idx, 'isCurrent', checked);
                              updateExperience(idx, 'endDate', checked ? 'Sekarang' : '');
                            }}
                            className="rounded text-blue-600"
                          />
                          <span>Masih Bekerja</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        disabled={exp.isCurrent || exp.endDate === 'Sekarang'}
                        value={exp.isCurrent || exp.endDate === 'Sekarang' ? 'Sekarang' : exp.endDate || ''}
                        onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                        placeholder="Misal: 2024"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white disabled:bg-slate-100 disabled:text-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={exp.highlights?.[0] || ''}
                      onChange={(e) => updateExpHighlight(idx, e.target.value)}
                      placeholder="Apa saja yang dikerjakan? (Bisa tulis seadanya, misal: melayani pelanggan, rekap penjualan di excel)"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FORM SECTION 4: PENDIDIKAN */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  4. Riwayat Pendidikan
                </h3>
                <span className="text-[10.5px] text-blue-600 font-medium">
                  *Otomatis diformat HURUF BESAR (KAPITAL) di CV
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={addEducation}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Pendidikan</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {data.educations.map((edu, idx) => (
              <div
                key={edu.id || idx}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-2 text-xs"
              >
                <input
                  type="text"
                  value={edu.degree ? edu.degree.toUpperCase() : ''}
                  onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                  placeholder="GELAR / JURUSAN (SMA / SMK / S1 MANAJEMEN)"
                  className="w-full sm:w-1/3 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white uppercase font-medium placeholder:normal-case"
                />
                <input
                  type="text"
                  value={edu.institution ? edu.institution.toUpperCase() : ''}
                  onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                  placeholder="NAMA SEKOLAH / UNIVERSITAS (MISAL: SMU 10 PURWOKERTO)"
                  className="w-full sm:w-1/2 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white uppercase font-medium placeholder:normal-case"
                />
                <input
                  type="text"
                  value={edu.endYear}
                  onChange={(e) => updateEducation(idx, 'endYear', e.target.value)}
                  placeholder="Tahun Lulus"
                  className="w-full sm:w-24 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium"
                />
                <button
                  type="button"
                  onClick={() => removeEducation(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1 self-end sm:self-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FORM SECTION 5: KEAHLIAN / SKILLS */}
        <div className="pt-4 border-t border-slate-100 space-y-1.5">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
            5. Keahlian & Keterampilan (Ketik Pisahkan dengan Koma)
          </label>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            onBlur={handleSkillsBlur}
            placeholder="Contoh: Negosiasi, Microsoft Excel, Pelayanan Pelanggan, Kepemimpinan, Canva"
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <span className="text-[11px] text-slate-500 block">
            *AI juga akan merekomendasikan kata kunci standar ATS yang cocok dengan profesi Anda secara otomatis.
          </span>
        </div>

        {/* FORM SECTION 6: KEMAMPUAN BAHASA */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-blue-600" />
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  6. Kemampuan Bahasa (Opsional)
                </h3>
                <span className="text-[10.5px] text-slate-500">
                  *Hanya bahasa yang Anda masukkan yang akan tampil di CV
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={addLanguage}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Bahasa</span>
            </button>
          </div>

          {(!data.languages || data.languages.length === 0) ? (
            <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
              Belum ada data bahasa. Klik "+ Tambah Bahasa" jika ingin mencantumkan bahasa yang Anda kuasai (misal: Bahasa Indonesia, Bahasa Inggris, dll). Jika dibiarkan kosong, bagian bahasa tidak akan dimunculkan di CV.
            </div>
          ) : (
            <div className="space-y-2">
              {data.languages.map((langItem, idx) => (
                <div
                  key={langItem.id || idx}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-2 text-xs"
                >
                  <input
                    type="text"
                    value={langItem.name}
                    onChange={(e) => updateLanguage(idx, 'name', e.target.value)}
                    placeholder="Nama Bahasa (misal: Bahasa Indonesia, Bahasa Inggris)"
                    className="w-full sm:w-1/2 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium"
                  />
                  <select
                    value={langItem.level}
                    onChange={(e) => updateLanguage(idx, 'level', e.target.value)}
                    className="w-full sm:w-1/2 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    <option value="Fasih / Native">Fasih / Native (Bahasa Ibu)</option>
                    <option value="Aktif / Profesional">Aktif / Profesional (Lancar Kerja)</option>
                    <option value="Menengah (Konversasi)">Menengah (Konversasi / Percakapan)</option>
                    <option value="Dasar / Pemula">Dasar / Pemula</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeLanguage(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1 self-end sm:self-auto"
                    title="Hapus bahasa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BIG ACTION BUTTON: GENERATE & OLAH DENGAN AI */}
        <div className="pt-4 border-t border-slate-200">
          <button
            type="button"
            disabled={isGenerating || !data.personalInfo.fullName.trim()}
            onClick={() => {
              handleSkillsBlur();
              onGenerateWithAi();
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2.5"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sedang Mengolah & Memoles Kalimat dengan AI...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>
                  ✨ OLAH DENGAN AI & PREVIEW CV {documentType === 'cv_and_cover_letter' ? '+ LAMARAN' : ''}
                </span>
              </>
            )}
          </button>
          {!data.personalInfo.fullName.trim() && (
            <p className="text-center text-xs text-rose-500 mt-2">
              *Silakan isi Nama Lengkap terlebih dahulu untuk mulai generate.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
