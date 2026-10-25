import { Language } from '../types/resume';

export interface CVLabels {
  executiveProfile: string;
  careerHighlights: string;
  coreCompetencies: string;
  experience: string;
  education: string;
  certifications: string;
  languages: string;
  hobbies: string;
  skills: string;
  present: string;
}

export const CV_SECTION_LABELS: Record<Language, CVLabels> = {
  id: {
    executiveProfile: 'PROFIL PROFESIONAL',
    careerHighlights: 'PENCAPAIAN UTAMA',
    coreCompetencies: 'KOMPETENSI INTI',
    experience: 'PENGALAMAN PROFESIONAL',
    education: 'PENDIDIKAN',
    certifications: 'SERTIFIKASI & KEAHLIAN TEKNIS',
    languages: 'BAHASA',
    hobbies: 'MINAT & HOBI',
    skills: 'KEAHLIAN UTAMA',
    present: 'Sekarang',
  },
  en: {
    executiveProfile: 'EXECUTIVE PROFILE',
    careerHighlights: 'CAREER HIGHLIGHTS',
    coreCompetencies: 'CORE COMPETENCIES',
    experience: 'PROFESSIONAL EXPERIENCE',
    education: 'EDUCATION',
    certifications: 'CERTIFICATIONS & TECHNICAL SKILLS',
    languages: 'LANGUAGES',
    hobbies: 'HOBBIES',
    skills: 'KEY SKILLS',
    present: 'Present',
  },
};

export const UI_TEXT = {
  id: {
    appName: 'CV Generator Pro',
    appSubtitle: 'Ekspor Sekaligus 2 File PDF: Standar ATS & Desain Kreatif Pastel',
    dualDownloadBtn: '⚡ Download Keduanya Sekaligus (ATS + Creative PDF)',
    downloadAtsBtn: '📄 Download ATS PDF',
    downloadCreativeBtn: '🎨 Download Creative PDF',
    languageSelector: 'Bahasa CV & Teks',
    creativeTemplate: 'Pilihan Template Creative',
    creative1Title: 'Creative 1 (Left Sidebar)',
    creative2Title: 'Creative 2 (Top Banner Header)',
    pastelColorTitle: 'Palet Warna Pastel Creative',
    tabs: {
      personal: 'Data Pribadi & Foto',
      profile: 'Profil & Pencapaian',
      skills: 'Keahlian & Bahasa',
      experience: 'Pengalaman Kerja',
      education: 'Pendidikan & Sertifikat',
    },
    sampleLoader: 'Muat Contoh Data',
    sampleAnief: 'Data Pak Anief (Contoh ATS)',
    sampleJohnDoe: 'Data Creative Designer (John Doe)',
    resetBlank: 'Kosongkan Form',
    atsChecker: 'Cek Skor ATS',
    aiAssistant: 'Asisten AI Gemini',
    previewAts: 'Preview ATS',
    previewCreative: 'Preview Creative',
  },
  en: {
    appName: 'CV Generator Pro',
    appSubtitle: 'Simultaneous Dual PDF Export: Standard ATS & Pastel Creative Designs',
    dualDownloadBtn: '⚡ Download Both Simultaneously (ATS + Creative PDF)',
    downloadAtsBtn: '📄 Download ATS PDF',
    downloadCreativeBtn: '🎨 Download Creative PDF',
    languageSelector: 'Resume Language',
    creativeTemplate: 'Creative Template Style',
    creative1Title: 'Creative 1 (Left Sidebar)',
    creative2Title: 'Creative 2 (Top Banner Header)',
    pastelColorTitle: 'Creative Pastel Color Palette',
    tabs: {
      personal: 'Personal Info & Photo',
      profile: 'Profile & Highlights',
      skills: 'Skills & Languages',
      experience: 'Work Experience',
      education: 'Education & Certificates',
    },
    sampleLoader: 'Load Sample Data',
    sampleAnief: 'Mr. Anief Data (Real ATS Example)',
    sampleJohnDoe: 'Creative Designer (John Doe)',
    resetBlank: 'Clear to Blank',
    atsChecker: 'ATS Compatibility Score',
    aiAssistant: 'Gemini AI Assistant',
    previewAts: 'Preview ATS',
    previewCreative: 'Preview Creative',
  },
};
