import React, { useState } from 'react';
import {
  ResumeData,
  CreativeTemplateType,
  PastelPalette,
  DocumentType,
} from './types/resume';
import { PASTEL_PALETTES } from './constants/palettes';
import { AtsResume } from './components/AtsResume';
import { Creative1Resume } from './components/Creative1Resume';
import { Creative2Resume } from './components/Creative2Resume';
import { CoverLetterResume } from './components/CoverLetterResume';
import { ResumeForm } from './components/ResumeForm';
import { PaymentWaModal } from './components/PaymentWaModal';
import { AdminLeadsModal } from './components/AdminLeadsModal';
import { exportElementToPdf, exportAllPdfs, exportSingleDoc } from './utils/pdfExport';
import {
  Download,
  FileCheck,
  Palette,
  Mail,
  Printer,
  ArrowLeft,
  Sparkles,
  Users,
  Tag,
  ShieldCheck,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Home,
  ExternalLink,
} from 'lucide-react';

const INITIAL_BLANK_DATA: ResumeData = {
  lang: 'id',
  documentType: 'cv_only',
  toneLevel: 'staff',
  personalInfo: {
    fullName: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    photoUrl: '',
  },
  summary: '',
  careerHighlights: [],
  coreCompetencies: [],
  experiences: [
    {
      id: 'exp-init-1',
      role: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      highlights: [''],
    },
  ],
  educations: [
    {
      id: 'edu-init-1',
      degree: '',
      field: '',
      institution: '',
      startYear: '',
      endYear: '',
    },
  ],
  certifications: [],
  languages: [],
  hobbies: [],
  coverLetter: {
    targetCompany: '',
    targetPosition: '',
    content: '',
  },
};

export default function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_BLANK_DATA);
  const [creativeType, setCreativeType] = useState<CreativeTemplateType>('creative1');
  const [selectedPalette, setSelectedPalette] = useState<PastelPalette>(PASTEL_PALETTES[0]);
  const [documentType, setDocumentType] = useState<DocumentType>('cv_only');

  // Screen step: 'form' | 'preview'
  const [currentStep, setCurrentStep] = useState<'form' | 'preview'>('form');
  const [activePreviewTab, setActivePreviewTab] = useState<'ats' | 'creative' | 'cover_letter'>('ats');
  const [zoomScale, setZoomScale] = useState<number>(0.85);
  const [userCustomZoom, setUserCustomZoom] = useState<number | null>(null);

  // Screen width for responsive mobile A4 fit
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  React.useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Compute scale so A4 fits phone screen width without horizontal overflow
  const autoMobileScale = screenWidth < 850 ? Math.max(0.35, (screenWidth - 40) / 794) : 0.85;
  const effectiveScale = userCustomZoom !== null ? userCustomZoom : autoMobileScale;

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Status message
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Generation
  const handleGenerateWithAi = async () => {
    setIsGenerating(true);
    setStatusMsg('Sedang memoles dan menyusun kalimat dengan AI...');

    try {
      const res = await fetch('/api/ai/generate-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawInput: {
            fullName: resumeData.personalInfo.fullName,
            headline: resumeData.personalInfo.headline,
            email: resumeData.personalInfo.email,
            phone: resumeData.personalInfo.phone,
            location: resumeData.personalInfo.location,
            summary: resumeData.summary,
            experiences: resumeData.experiences,
            educations: resumeData.educations,
            rawSkills: resumeData.coreCompetencies.join(', '),
            targetCompany: resumeData.coverLetter?.targetCompany,
            targetPosition: resumeData.coverLetter?.targetPosition || resumeData.personalInfo.headline,
            toneLevel: resumeData.toneLevel || 'staff',
          },
          documentType,
          lang: resumeData.lang,
          templateType: creativeType,
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal merespons AI');
      }

      const generated = await res.json();

      setResumeData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          fullName: (prev.personalInfo.fullName || '').toUpperCase(),
          headline: (prev.personalInfo.headline || '').toUpperCase(),
        },
        summary: generated.summary || prev.summary,
        careerHighlights: generated.careerHighlights || prev.careerHighlights,
        coreCompetencies:
          generated.coreCompetencies && generated.coreCompetencies.length > 0
            ? generated.coreCompetencies
            : prev.coreCompetencies,
        experiences: (generated.experiences || prev.experiences).map((exp: any) => ({
          ...exp,
          role: (exp.role || '').toUpperCase(),
        })),
        educations: prev.educations.map((rawEdu, idx) => {
          const genEdu = generated.educations?.[idx];
          return {
            ...rawEdu,
            degree: (rawEdu.degree || genEdu?.degree || '').toUpperCase(),
            // JANGAN pernah terima jurusan buatan AI jika user tidak mengetik jurusan di awal
            field: rawEdu.field?.trim() ? rawEdu.field.trim().toUpperCase() : '',
            institution: (rawEdu.institution || genEdu?.institution || '').toUpperCase(),
            startYear: rawEdu.startYear || genEdu?.startYear || '',
            endYear: rawEdu.endYear || genEdu?.endYear || '',
          };
        }),
        coverLetter: {
          targetCompany: prev.coverLetter?.targetCompany || '',
          targetPosition: prev.coverLetter?.targetPosition || prev.personalInfo.headline || '',
          content: generated.coverLetter || prev.coverLetter?.content || '',
        },
      }));

      setCurrentStep('preview');
      setActivePreviewTab('ats');
      const toneLabel = (resumeData.toneLevel || 'staff') === 'staff' ? 'Staf & Sederhana' : 'Manajerial & Strategis';
      setStatusMsg(`✨ Selesai! Kalimat Anda berhasil dipoles profesional oleh AI (Gaya: ${toneLabel}).`);
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      console.warn('API error, proceeding to preview:', err);
      setCurrentStep('preview');
      setStatusMsg('Pratinjau CV siap diperiksa & diunduh.');
      setTimeout(() => setStatusMsg(null), 3500);
    } finally {
      setIsGenerating(false);
    }
  };

  // Perform single PDF download (100% immune to mobile pop-up blocking)
  const executeDownloadSingle = async (type: 'ats' | 'creative' | 'cover_letter') => {
    setIsExporting(true);
    try {
      let elementId = 'export-node-ats';
      let docLabel = 'CV Standar ATS';
      if (type === 'creative') {
        elementId = 'export-node-creative';
        docLabel = `CV Creative (${creativeType === 'creative1' ? 'Sidebar' : 'Banner'})`;
      } else if (type === 'cover_letter') {
        elementId = 'export-node-cover-letter';
        docLabel = 'Surat Lamaran Kerja';
      }

      setStatusMsg(`Mengunduh file PDF ${docLabel}...`);
      await exportSingleDoc({
        elementId,
        type,
        name: resumeData.personalInfo.fullName || 'CV',
        creativeType,
      });
      setStatusMsg(`✅ Berhasil! File PDF ${docLabel} tersimpan di folder Download perangkat Anda.`);
      setTimeout(() => setStatusMsg(null), 5000);
    } catch (err) {
      console.error(err);
      setStatusMsg('Gagal mengunduh file PDF.');
      setTimeout(() => setStatusMsg(null), 3500);
    } finally {
      setIsExporting(false);
    }
  };

  // Perform actual PDF Downloads (Batch)
  const executeDownloadPdfs = async () => {
    setIsExporting(true);
    try {
      await exportAllPdfs({
        atsElementId: 'export-node-ats',
        creativeElementId: 'export-node-creative',
        coverLetterElementId: 'export-node-cover-letter',
        includeCoverLetter: documentType === 'cv_and_cover_letter',
        name: resumeData.personalInfo.fullName || 'CV',
        creativeType: creativeType,
        onProgress: (msg) => setStatusMsg(msg),
      });
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setStatusMsg('Gagal mengunduh file PDF.');
      setTimeout(() => setStatusMsg(null), 3500);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* BANNER HARGA RESMI ATAS */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white px-4 py-2 shadow-xs text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 font-semibold">
            <span className="flex items-center gap-1.5 bg-white/15 px-2.5 py-0.5 rounded-full text-amber-300">
              <Tag className="w-3.5 h-3.5" />
              <span>Pemesanan CV harga 10rb</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 px-2.5 py-0.5 rounded-full text-emerald-300">
              <Tag className="w-3.5 h-3.5" />
              <span>Pemesanan CV n lamaran harga 15rb</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://drive.google.com/drive/folders/14Ckuu7Z72kmMpx_lU3MRdhhiPqy4UNzr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white flex items-center gap-1 hover:underline text-[11px]"
              title="Folder Penyimpanan Google Drive"
            >
              <ExternalLink className="w-3 h-3 text-amber-300" />
              <span>Folder GDrive</span>
            </a>
            <span className="text-white/40">|</span>
            <button
              type="button"
              onClick={() => setIsAdminModalOpen(true)}
              className="text-white/80 hover:text-white flex items-center gap-1 hover:underline text-[11px]"
            >
              <Users className="w-3 h-3 text-blue-300" />
              <span>Database Pemesanan</span>
            </button>
            <span className="text-white/40">|</span>
            <span className="text-white/80 text-[11px]">
              Konfirmasi WA: <strong>0812-2825-1605</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Top Main Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
          {/* Logo, Title & Pricing Tag (Always on Top) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep('form');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-base sm:text-lg shadow-md hover:scale-105 active:scale-95 transition-transform"
                title="Kembali ke Beranda"
              >
                CV
              </button>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep('form');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="font-extrabold text-slate-900 text-sm sm:text-lg leading-tight hover:text-blue-600 text-left transition-colors"
                  >
                    CV Generator Pro
                  </button>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200 whitespace-nowrap">
                    {documentType === 'cv_only' ? 'Dual PDF (10rb)' : 'Triple (+ Lamaran 15rb)'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Isi form seadanya, langsung dipoles AI menjadi CV ATS & Creative siap kerja
                </p>
              </div>
            </div>

            {/* Mobile preview badge */}
            {currentStep === 'preview' && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full md:hidden">
                Mode Pratinjau
              </span>
            )}
          </div>

          {/* Action Buttons Row (Below title on mobile, side-by-side on desktop) */}
          <div className="w-full md:w-auto">
            {currentStep === 'preview' ? (
              <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:gap-2">
                {/* 1. Tombol Beranda */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep('form');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors shadow-2xs"
                  title="Kembali ke Beranda / Halaman Awal"
                >
                  <Home className="w-3.5 h-3.5 flex-shrink-0 text-slate-600" />
                  <span className="truncate">Beranda</span>
                </button>

                {/* 2. Tombol Edit Data Form */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep('form');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors shadow-2xs"
                  title="Edit data pada form"
                >
                  <ArrowLeft className="w-3.5 h-3.5 flex-shrink-0 text-blue-600" />
                  <span className="truncate">Edit Form</span>
                </button>

                {/* 3. Tombol Submit Pemesanan (sebelah menu edit) */}
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl text-[11px] sm:text-xs font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all active:scale-98 disabled:opacity-50"
                  title="Submit Pemesanan CV"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">
                    Submit Pemesanan ({documentType === 'cv_only' ? '10rb' : '15rb'})
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between md:justify-end text-xs text-slate-500 py-0.5">
                <span className="font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                  Langkah 1: Lengkapi Form Data
                </span>
                <span className="text-[11px] text-slate-400 md:hidden">
                  ✨ Dipoles AI Otomatis
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Floating Status Notification */}
      {statusMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
          <span className="text-xs font-medium">{statusMsg}</span>
        </div>
      )}

      {/* VIEW 1: STEP FORM INPUT */}
      {currentStep === 'form' && (
        <main className="max-w-3xl mx-auto w-full p-4 sm:p-6 flex-1">
          <ResumeForm
            data={resumeData}
            onChange={setResumeData}
            creativeType={creativeType}
            onCreativeTypeChange={setCreativeType}
            selectedPalette={selectedPalette}
            onPaletteChange={setSelectedPalette}
            documentType={documentType}
            onDocumentTypeChange={setDocumentType}
            onGenerateWithAi={handleGenerateWithAi}
            isGenerating={isGenerating}
          />
        </main>
      )}

      {/* VIEW 2: STEP PREVIEW & DOWNLOAD */}
      {currentStep === 'preview' && (
        <main className="max-w-7xl mx-auto w-full p-3 sm:p-6 flex-1 flex flex-col">
          {/* Header Bar in Preview View */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 mb-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Tab switchers */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 mr-1 hidden sm:inline">
                Lihat Preview:
              </span>
              <div className="inline-flex rounded-xl border border-slate-300 p-0.5 bg-slate-50 text-xs">
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('ats')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    activePreviewTab === 'ats'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>1. CV Standar ATS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePreviewTab('creative')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    activePreviewTab === 'creative'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>
                    2. CV Creative ({creativeType === 'creative1' ? 'Sidebar' : 'Banner'})
                  </span>
                </button>

                {documentType === 'cv_and_cover_letter' && (
                  <button
                    type="button"
                    onClick={() => setActivePreviewTab('cover_letter')}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                      activePreviewTab === 'cover_letter'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>3. Surat Lamaran</span>
                  </button>
                )}
              </div>

              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold ${
                (resumeData.toneLevel || 'staff') === 'staff'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-blue-50 text-blue-800 border border-blue-300'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  {(resumeData.toneLevel || 'staff') === 'staff'
                    ? 'Gaya AI: Staf & Sederhana'
                    : 'Gaya AI: Manajerial & Strategis'}
                </span>
              </span>

              <button
                type="button"
                disabled={isExporting}
                onClick={() => setIsPaymentModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-all active:scale-98 disabled:opacity-50"
                title="Submit Pemesanan CV (Unduh Berkas)"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Submit Pemesanan CV</span>
              </button>
            </div>

            {/* Zoom & Print */}
            <div className="flex items-center gap-1 text-slate-600 text-xs pl-2 border-l border-slate-200">
              <button
                type="button"
                onClick={() => setUserCustomZoom(Math.max(0.3, effectiveScale - 0.08))}
                className="p-1.5 hover:bg-slate-100 rounded-md"
                title="Perkecil"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-[11px] px-1">{Math.round(effectiveScale * 100)}%</span>
              <button
                type="button"
                onClick={() => setUserCustomZoom(Math.min(1.3, effectiveScale + 0.08))}
                className="p-1.5 hover:bg-slate-100 rounded-md"
                title="Perbesar"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setUserCustomZoom(null)}
                className="p-1.5 hover:bg-slate-100 rounded-md"
                title="Pas ke Layar"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="p-1.5 hover:bg-slate-100 rounded-md ml-1 hidden sm:inline-block"
                title="Cetak langsung"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Scaled Preview Canvas (Strict 1-Page A4 Proportion) */}
          <div className="flex-1 bg-slate-200/90 rounded-2xl p-2 sm:p-6 overflow-auto border border-slate-300 flex justify-center items-start shadow-inner min-h-[550px]">
            <div
              style={{
                width: `${794 * effectiveScale}px`,
                height: `${1123 * effectiveScale}px`,
                position: 'relative',
              }}
              className="shadow-2xl transition-all flex-shrink-0"
            >
              <div
                style={{
                  width: '794px',
                  height: '1123px',
                  transform: `scale(${effectiveScale})`,
                  transformOrigin: 'top left',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              >
                {activePreviewTab === 'ats' && <AtsResume data={resumeData} />}
                {activePreviewTab === 'creative' &&
                  (creativeType === 'creative1' ? (
                    <Creative1Resume data={resumeData} palette={selectedPalette} />
                  ) : (
                    <Creative2Resume data={resumeData} palette={selectedPalette} />
                  ))}
                {activePreviewTab === 'cover_letter' && (
                  <CoverLetterResume data={resumeData} palette={selectedPalette} />
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Hidden Render Targets for PDF Exporting (Strict A4: 794px x 1123px) */}
      <div
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '794px',
          height: '1123px',
          opacity: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <div id="export-node-ats" style={{ width: '794px', height: '1123px' }}>
          <AtsResume data={resumeData} id="target-ats" />
        </div>
        <div id="export-node-creative" style={{ width: '794px', height: '1123px' }}>
          {creativeType === 'creative1' ? (
            <Creative1Resume data={resumeData} palette={selectedPalette} id="target-creative1" />
          ) : (
            <Creative2Resume data={resumeData} palette={selectedPalette} id="target-creative2" />
          )}
        </div>
        <div id="export-node-cover-letter" style={{ width: '794px', height: '1123px' }}>
          <CoverLetterResume data={resumeData} palette={selectedPalette} id="target-cover-letter" />
        </div>
      </div>

      {/* Pop-up Modals */}
      <PaymentWaModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        data={resumeData}
        documentType={documentType}
        creativeType={creativeType}
        onConfirmAndDownload={executeDownloadPdfs}
        onDownloadSingle={executeDownloadSingle}
      />

      <AdminLeadsModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}
