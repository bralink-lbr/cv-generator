export type Language = 'id' | 'en';

export type CreativeTemplateType = 'creative1' | 'creative2';

export type DocumentType = 'cv_only' | 'cv_and_cover_letter';

export type ToneLevel = 'staff' | 'manager';

export interface CoverLetterInfo {
  targetCompany: string;
  targetPosition: string;
  recipientName?: string;
  content: string;
}

export interface PersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  photoUrl?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  field?: string;
  institution: string;
  startYear?: string;
  endYear: string;
  description?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer?: string;
  year?: string;
  details?: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string; // e.g. "C2 - Native", "A1 - Beginner", "Fasih"
}

export interface ResumeData {
  lang: Language;
  documentType?: DocumentType;
  toneLevel?: ToneLevel;
  personalInfo: PersonalInfo;
  summary: string;
  careerHighlights: string[];
  coreCompetencies: string[];
  experiences: ExperienceItem[];
  educations: EducationItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  hobbies: string[];
  coverLetter?: CoverLetterInfo;
}

export interface PastelPalette {
  id: string;
  name: string;
  primary: string; // main solid or dark pastel
  secondary: string; // lighter accent
  background: string; // tinted soft background
  sidebarBg: string; // for sidebar in creative 1
  sidebarText: string;
  badgeBg: string;
  badgeText: string;
  border: string;
}
