import React from 'react';
import { ResumeData } from '../types/resume';
import { CV_SECTION_LABELS } from '../constants/translations';

interface AtsResumeProps {
  data: ResumeData;
  id?: string;
  className?: string;
}

export const AtsResume: React.FC<AtsResumeProps> = ({
  data,
  id = 'ats-resume-preview',
  className = '',
}) => {
  const {
    personalInfo,
    summary,
    careerHighlights,
    coreCompetencies,
    experiences,
    educations,
    certifications,
    languages,
    lang,
  } = data;
  const labels = CV_SECTION_LABELS[lang] || CV_SECTION_LABELS.id;

  // Split highlights and competencies into 2 balanced columns like the PDF
  const halfHighlights = Math.ceil(careerHighlights.length / 2);
  const highlightsCol1 = careerHighlights.slice(0, halfHighlights);
  const highlightsCol2 = careerHighlights.slice(halfHighlights);

  const halfCompetencies = Math.ceil(coreCompetencies.length / 2);
  const competenciesCol1 = coreCompetencies.slice(0, halfCompetencies);
  const competenciesCol2 = coreCompetencies.slice(halfCompetencies);

  return (
    <div
      id={id}
      className={`bg-white text-slate-900 font-sans p-10 shadow-2xl mx-auto overflow-hidden text-[12.5px] leading-relaxed flex flex-col justify-between ${className}`}
      style={{
        width: '794px',
        height: '1123px',
        minHeight: '1123px',
        maxHeight: '1123px',
        boxSizing: 'border-box',
      }}
    >
      <div>
        {/* Top Header */}
        <header className="text-center mb-4">
          <h1 className="text-2xl font-bold tracking-wider uppercase text-slate-900 mb-1">
            {(personalInfo.fullName || 'NAMA LENGKAP').toUpperCase()}
          </h1>

          {personalInfo.headline && (
            <p className="text-slate-800 text-[12.5px] font-semibold tracking-normal mb-1.5 uppercase">
              {personalInfo.headline.toUpperCase()}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-x-2 text-slate-700 text-[11.5px]">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.location && personalInfo.phone && <span>|</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.phone && personalInfo.email && <span>|</span>}
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.website && (
              <>
                <span>|</span>
                <span>{personalInfo.website}</span>
              </>
            )}
          </div>

          {/* Double-line divider matching the user's PDF */}
          <div className="mt-3 space-y-[2px]">
            <div className="h-[1.5px] bg-blue-600 w-full" />
            <div className="h-[1.5px] bg-blue-600 w-full" />
          </div>
        </header>

        {/* PROFIL PROFESIONAL / EXECUTIVE PROFILE */}
        {summary && (
          <section className="mb-4">
            <div className="border-b border-blue-600 pb-0.5 mb-1.5">
              <h2 className="text-[12.5px] font-bold tracking-wide uppercase text-blue-700">
                {labels.executiveProfile}
              </h2>
            </div>
            <p className="text-slate-800 text-[11.5px] text-justify leading-relaxed">
              {summary}
            </p>
          </section>
        )}

        {/* CAREER HIGHLIGHTS / PENCAPAIAN UTAMA */}
        {careerHighlights.length > 0 && (
          <section className="mb-4">
            <div className="border-b border-blue-600 pb-0.5 mb-1.5">
              <h2 className="text-[12.5px] font-bold tracking-wide uppercase text-blue-700">
                {labels.careerHighlights}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-x-6 text-[11.5px] text-slate-800">
              <ul className="space-y-1 list-disc pl-4 marker:text-slate-700">
                {highlightsCol1.map((item, idx) => (
                  <li key={`hl1-${idx}`} className="leading-snug">
                    {item}
                  </li>
                ))}
              </ul>
              <ul className="space-y-1 list-disc pl-4 marker:text-slate-700">
                {highlightsCol2.map((item, idx) => (
                  <li key={`hl2-${idx}`} className="leading-snug">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* KOMPETENSI INTI / CORE COMPETENCIES */}
        {coreCompetencies.length > 0 && (
          <section className="mb-4">
            <div className="border-b border-blue-600 pb-0.5 mb-1.5">
              <h2 className="text-[12.5px] font-bold tracking-wide uppercase text-blue-700">
                {labels.coreCompetencies}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-x-6 text-[11.5px] text-slate-800">
              <ul className="space-y-1 list-disc pl-4 marker:text-slate-700">
                {competenciesCol1.map((item, idx) => (
                  <li key={`comp1-${idx}`} className="leading-snug">
                    {item}
                  </li>
                ))}
              </ul>
              <ul className="space-y-1 list-disc pl-4 marker:text-slate-700">
                {competenciesCol2.map((item, idx) => (
                  <li key={`comp2-${idx}`} className="leading-snug">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* PENGALAMAN PROFESIONAL / PROFESSIONAL EXPERIENCE */}
        {experiences.length > 0 && (
          <section className="mb-4">
            <div className="border-b border-blue-600 pb-0.5 mb-2">
              <h2 className="text-[12.5px] font-bold tracking-wide uppercase text-blue-700">
                {labels.experience}
              </h2>
            </div>
            <div className="space-y-3">
              {experiences.slice(0, 4).map((exp) => (
                <div key={exp.id} className="text-[12px]">
                  <div className="flex justify-between items-baseline">
                    <div className="font-bold text-blue-700">
                      <span className="uppercase">{exp.role}</span>{' '}
                      <span className="text-slate-800 font-medium">
                        | {exp.company}
                        {exp.location ? ` (${exp.location})` : ''}
                      </span>
                    </div>
                    <div className="text-slate-600 text-[11px] font-medium">
                      {exp.startDate} – {exp.isCurrent ? labels.present : exp.endDate}
                    </div>
                  </div>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc pl-4 space-y-1 text-slate-800 text-[11.5px] marker:text-slate-700 mt-1">
                      {exp.highlights.slice(0, 3).map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-snug">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PENDIDIKAN / EDUCATION */}
        {educations.length > 0 && (
          <section className="mb-3">
            <div className="border-b border-blue-600 pb-0.5 mb-1.5">
              <h2 className="text-[12.5px] font-bold tracking-wide uppercase text-blue-700">
                {labels.education}
              </h2>
            </div>
            <div className="space-y-1.5 text-[12px] text-slate-800">
              {educations.slice(0, 2).map((edu) => (
                <div key={edu.id} className="leading-snug uppercase">
                  <span className="font-semibold text-slate-900">
                    {edu.degree}
                    {edu.field && edu.field.trim() && edu.field.trim().toUpperCase() !== edu.degree.trim().toUpperCase() ? ` – ${edu.field.trim()}` : ''}
                  </span>{' '}
                  – {edu.institution} ({edu.startYear ? `${edu.startYear}–` : ''}
                  {edu.endYear})
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SERTIFIKASI / CERTIFICATIONS */}
        {certifications.length > 0 && (
          <section className="mb-3">
            <div className="border-b border-blue-600 pb-0.5 mb-1.5">
              <h2 className="text-[12.5px] font-bold tracking-wide uppercase text-blue-700">
                {labels.certifications}
              </h2>
            </div>
            <div className="space-y-1.5 text-[11.5px] text-slate-800">
              {certifications.slice(0, 2).map((cert) => (
                <div key={cert.id} className="leading-snug">
                  <span className="font-semibold">{cert.name}</span>
                  {cert.issuer && ` – ${cert.issuer}`}
                  {cert.year && ` (${cert.year})`}
                  {cert.details && (
                    <p className="text-slate-600 text-[11px] mt-0.5">{cert.details}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* BAHASA / LANGUAGES (Hanya tampil jika diinput pengguna) */}
        {languages && languages.filter((l) => l.name && l.name.trim()).length > 0 && (
          <section className="mb-3">
            <div className="border-b border-blue-600 pb-0.5 mb-1.5">
              <h2 className="text-[12.5px] font-bold tracking-wide uppercase text-blue-700">
                {labels.languages}
              </h2>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-slate-800">
              {languages.filter((l) => l.name && l.name.trim()).map((langItem) => (
                <span key={langItem.id}>
                  <strong>{langItem.name}</strong> ({langItem.level})
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer A4 */}
      <footer className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
        <span>Format CV ATS Terstandarisasi</span>
        <span>Halaman 1 dari 1 (Ukuran A4)</span>
      </footer>
    </div>
  );
};
