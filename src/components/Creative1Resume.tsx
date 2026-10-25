import React from 'react';
import { ResumeData, PastelPalette } from '../types/resume';
import { CV_SECTION_LABELS } from '../constants/translations';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';

interface Creative1ResumeProps {
  data: ResumeData;
  palette: PastelPalette;
  id?: string;
  className?: string;
}

export const Creative1Resume: React.FC<Creative1ResumeProps> = ({
  data,
  palette,
  id = 'creative1-resume-preview',
  className = '',
}) => {
  const { personalInfo, summary, coreCompetencies, experiences, educations, certifications, languages, hobbies, lang } = data;
  const labels = CV_SECTION_LABELS[lang] || CV_SECTION_LABELS.id;

  return (
    <div
      id={id}
      className={`bg-white text-slate-800 font-sans shadow-2xl mx-auto overflow-hidden text-[12px] flex flex-row ${className}`}
      style={{
        width: '794px',
        height: '1123px',
        minHeight: '1123px',
        maxHeight: '1123px',
        boxSizing: 'border-box',
      }}
    >
      {/* Kolom Kiri: Sidebar Warna (Selalu di kiri, 32% lebar, 1 lembar A4) */}
      <aside
        className="w-[260px] h-full p-6 text-white flex-shrink-0 flex flex-col justify-between overflow-hidden"
        style={{ backgroundColor: palette.sidebarBg || palette.primary }}
      >
        <div className="space-y-5">
          {/* Foto Profil Lingkaran dengan Outline Putih */}
          <div className="flex justify-center pt-2">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/90 shadow-lg bg-slate-200 flex-shrink-0">
              {personalInfo.photoUrl ? (
                <img
                  src={personalInfo.photoUrl}
                  alt={personalInfo.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center font-bold text-3xl text-slate-700"
                  style={{ backgroundColor: palette.badgeBg || '#F1F5F9' }}
                >
                  {personalInfo.fullName ? personalInfo.fullName.charAt(0).toUpperCase() : 'CV'}
                </div>
              )}
            </div>
          </div>

          {/* Kontak & Informasi */}
          <div className="space-y-2.5 pt-1 text-[11px] border-b border-white/20 pb-4">
            {personalInfo.phone && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-white/90 flex-shrink-0" />
                <span className="truncate">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-white/90 flex-shrink-0" />
                <span className="truncate">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-white/90 flex-shrink-0" />
                <span className="truncate">{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-2.5">
                <Globe className="w-3.5 h-3.5 text-white/90 flex-shrink-0" />
                <span className="truncate">{personalInfo.website}</span>
              </div>
            )}
          </div>

          {/* SKILL HIGHLIGHTS */}
          {coreCompetencies.length > 0 && (
            <div>
              <h3 className="font-extrabold tracking-wider uppercase text-[12px] mb-2 pb-1 border-b border-white/25">
                {labels.skills}
              </h3>
              <ul className="space-y-1.5 text-[11px] text-white/95">
                {coreCompetencies.slice(0, 8).map((skill, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 mt-1 rounded-xs bg-white/90 flex-shrink-0" />
                    <span className="leading-tight">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* LANGUAGES */}
          {languages && languages.filter((l) => l.name && l.name.trim()).length > 0 && (
            <div>
              <h3 className="font-extrabold tracking-wider uppercase text-[12px] mb-2 pb-1 border-b border-white/25">
                {labels.languages}
              </h3>
              <ul className="space-y-1 text-[11px] text-white/90">
                {languages.filter((l) => l.name && l.name.trim()).slice(0, 4).map((langItem) => (
                  <li key={langItem.id} className="flex items-center justify-between">
                    <span>{langItem.name}</span>
                    <span className="text-white/80 text-[10.5px] font-mono">{langItem.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* HOBBIES */}
          {hobbies && hobbies.length > 0 && (
            <div>
              <h3 className="font-extrabold tracking-wider uppercase text-[12px] mb-1.5 pb-1 border-b border-white/25">
                {labels.hobbies}
              </h3>
              <div className="flex flex-wrap gap-1">
                {hobbies.slice(0, 6).map((hobby, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-2 py-0.5 rounded text-[10px] bg-white/15 text-white"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-2 text-[10px] text-white/50 text-center tracking-wider">
          CV Creative • 1 Lembar A4
        </div>
      </aside>

      {/* Kolom Kanan: Konten Utama Putih (68% lebar, 1 lembar A4) */}
      <main className="w-[534px] h-full p-7 flex flex-col justify-between bg-white text-slate-800 overflow-hidden box-border">
        <div className="space-y-4">
          {/* Header Nama & Profesi */}
          <div className="border-b-2 pb-2.5" style={{ borderColor: palette.primary }}>
            <h1
              className="text-3xl font-black tracking-tight uppercase"
              style={{ color: palette.primary }}
            >
              {(personalInfo.fullName || 'NAMA LENGKAP').toUpperCase()}
            </h1>
            {personalInfo.headline && (
              <p className="text-slate-600 font-bold text-[12.5px] mt-0.5 tracking-wide uppercase">
                {personalInfo.headline.toUpperCase()}
              </p>
            )}
          </div>

          {/* SUMMARY / PROFIL PROFESIONAL */}
          {summary && (
            <section>
              <div
                className="px-3 py-1 font-bold uppercase tracking-wider text-[11.5px] mb-1.5 text-white shadow-xs rounded-xs flex items-center"
                style={{ backgroundColor: palette.primary }}
              >
                {labels.executiveProfile}
              </div>
              <p className="text-slate-700 text-[11.5px] leading-relaxed text-justify px-0.5">
                {summary}
              </p>
            </section>
          )}

          {/* EXPERIENCE / PENGALAMAN KERJA */}
          {experiences.length > 0 && (
            <section>
              <div
                className="px-3 py-1 font-bold uppercase tracking-wider text-[11.5px] mb-2 text-white shadow-xs rounded-xs flex items-center"
                style={{ backgroundColor: palette.primary }}
              >
                {labels.experience}
              </div>
              <div className="space-y-3 px-0.5">
                {experiences.slice(0, 4).map((exp) => (
                  <div key={exp.id} className="text-[11.5px]">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span className="uppercase">{exp.role}</span>
                      <span className="text-slate-500 font-medium text-[10.5px]">
                        {exp.startDate} - {exp.isCurrent ? labels.present : exp.endDate}
                      </span>
                    </div>
                    <div
                      className="font-semibold text-[11px] mb-1"
                      style={{ color: palette.secondary || palette.primary }}
                    >
                      {exp.company}
                      {exp.location ? `, ${exp.location}` : ''}
                    </div>
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="space-y-1 text-slate-700 list-disc pl-4 marker:text-slate-400">
                        {exp.highlights.slice(0, 3).map((h, i) => (
                          <li key={i} className="leading-snug">
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EDUCATION / PENDIDIKAN */}
          {educations.length > 0 && (
            <section>
              <div
                className="px-3 py-1 font-bold uppercase tracking-wider text-[11.5px] mb-1.5 text-white shadow-xs rounded-xs flex items-center"
                style={{ backgroundColor: palette.primary }}
              >
                {labels.education}
              </div>
              <div className="space-y-2 px-0.5">
                {educations.slice(0, 2).map((edu) => (
                  <div key={edu.id} className="text-[11.5px] uppercase">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>
                        {edu.degree}
                        {edu.field && edu.field.trim() && edu.field.trim().toUpperCase() !== edu.degree.trim().toUpperCase() ? `: ${edu.field.trim()}` : ''}
                      </span>
                      <span className="text-slate-500 font-medium text-[10.5px] normal-case">
                        {edu.startYear ? `${edu.startYear} - ` : ''}
                        {edu.endYear}
                      </span>
                    </div>
                    <div className="text-slate-600 text-[11px] font-medium">{edu.institution}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CERTIFICATIONS / SERTIFIKASI */}
          {certifications.length > 0 && (
            <section>
              <div
                className="px-3 py-1 font-bold uppercase tracking-wider text-[11.5px] mb-1.5 text-white shadow-xs rounded-xs flex items-center"
                style={{ backgroundColor: palette.primary }}
              >
                {labels.certifications}
              </div>
              <div className="space-y-1.5 px-0.5 text-[11px] text-slate-700">
                {certifications.slice(0, 2).map((cert) => (
                  <div key={cert.id} className="leading-snug">
                    <span className="font-bold text-slate-900">{cert.name}</span>
                    {cert.issuer && ` (${cert.issuer})`}
                    {cert.year && ` - ${cert.year}`}
                    {cert.details && <p className="text-slate-600 mt-0.5">{cert.details}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
          <span>{personalInfo.fullName}</span>
          <span>Halaman 1 dari 1 (Standar A4)</span>
        </div>
      </main>
    </div>
  );
};
