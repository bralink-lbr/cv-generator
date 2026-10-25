import React from 'react';
import { ResumeData, PastelPalette } from '../types/resume';
import { CV_SECTION_LABELS } from '../constants/translations';

interface Creative2ResumeProps {
  data: ResumeData;
  palette: PastelPalette;
  id?: string;
  className?: string;
}

export const Creative2Resume: React.FC<Creative2ResumeProps> = ({
  data,
  palette,
  id = 'creative2-resume-preview',
  className = '',
}) => {
  const { personalInfo, summary, coreCompetencies, experiences, educations, certifications, languages, hobbies, lang } = data;
  const labels = CV_SECTION_LABELS[lang] || CV_SECTION_LABELS.id;

  const halfSkills = Math.ceil(coreCompetencies.length / 2);
  const skillsCol1 = coreCompetencies.slice(0, halfSkills);
  const skillsCol2 = coreCompetencies.slice(halfSkills);

  return (
    <div
      id={id}
      className={`bg-white text-slate-800 font-sans shadow-2xl mx-auto overflow-hidden text-[12px] flex flex-col justify-between ${className}`}
      style={{
        width: '794px',
        height: '1123px',
        minHeight: '1123px',
        maxHeight: '1123px',
        boxSizing: 'border-box',
      }}
    >
      <div>
        {/* Top Hero Banner */}
        <header
          className="w-full text-white pt-5 pb-3.5 px-6 text-center relative shadow-sm"
          style={{ backgroundColor: palette.primary }}
        >
          {/* Centered Profile Photo */}
          <div className="flex justify-center mb-2.5">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-200">
              {personalInfo.photoUrl ? (
                <img
                  src={personalInfo.photoUrl}
                  alt={personalInfo.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center font-bold text-2xl text-slate-700"
                  style={{ backgroundColor: palette.badgeBg }}
                >
                  {personalInfo.fullName ? personalInfo.fullName.charAt(0).toUpperCase() : 'CV'}
                </div>
              )}
            </div>
          </div>

          {/* Full Name & Headline */}
          <h1 className="text-2xl font-black uppercase tracking-wider text-white">
            {(personalInfo.fullName || 'NAMA LENGKAP').toUpperCase()}
          </h1>
          {personalInfo.headline && (
            <p className="text-white/90 text-[12px] font-semibold mt-0.5 uppercase tracking-wide">
              {personalInfo.headline.toUpperCase()}
            </p>
          )}

          {/* Contact info sub-bar */}
          <div className="mt-2 pt-1.5 border-t border-white/20 flex flex-wrap items-center justify-center gap-x-3 text-[11px] text-white/95">
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.phone && personalInfo.email && <span>|</span>}
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.email && personalInfo.location && <span>|</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.website && (
              <>
                <span>|</span>
                <span>{personalInfo.website}</span>
              </>
            )}
          </div>
        </header>

        {/* Main 2-Column Content Below Header (Selalu 2 kolom di A4) */}
        <div className="p-6 grid grid-cols-12 gap-5 box-border">
          {/* Left Column (Approx 38% - 5 cols) */}
          <div className="col-span-5 space-y-4">
            {/* SUMMARY */}
            {summary && (
              <section>
                <div
                  className="px-3 py-1 text-white font-bold uppercase tracking-wider text-[11.5px] mb-2 rounded-xs"
                  style={{ backgroundColor: palette.sidebarBg || palette.primary }}
                >
                  {labels.executiveProfile}
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed text-justify px-0.5">
                  {summary}
                </p>
              </section>
            )}

            {/* LANGUAGES */}
            {languages && languages.filter((l) => l.name && l.name.trim()).length > 0 && (
              <section>
                <div
                  className="px-3 py-1 text-white font-bold uppercase tracking-wider text-[11.5px] mb-2 rounded-xs"
                  style={{ backgroundColor: palette.sidebarBg || palette.primary }}
                >
                  {labels.languages}
                </div>
                <ul className="space-y-1.5 px-0.5 text-[11px] text-slate-700">
                  {languages.filter((l) => l.name && l.name.trim()).slice(0, 4).map((item) => (
                    <li key={item.id} className="flex items-center gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: palette.primary }}
                      />
                      <span className="font-semibold text-slate-900">{item.name}</span>
                      <span className="text-slate-500 font-mono text-[10px]"> – {item.level}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* HOBBIES */}
            {hobbies && hobbies.length > 0 && (
              <section>
                <div
                  className="px-3 py-1 text-white font-bold uppercase tracking-wider text-[11.5px] mb-2 rounded-xs"
                  style={{ backgroundColor: palette.sidebarBg || palette.primary }}
                >
                  {labels.hobbies}
                </div>
                <ul className="space-y-1 px-0.5 text-[11px] text-slate-700">
                  {hobbies.slice(0, 5).map((hobby, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: palette.primary }}
                      />
                      <span>{hobby}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right Column (Approx 62% - 7 cols) */}
          <div className="col-span-7 space-y-4">
            {/* EXPERIENCE */}
            {experiences.length > 0 && (
              <section>
                <div
                  className="px-3 py-1 text-white font-bold uppercase tracking-wider text-[11.5px] mb-2 rounded-xs"
                  style={{ backgroundColor: palette.sidebarBg || palette.primary }}
                >
                  {labels.experience}
                </div>
                <div className="space-y-3 px-0.5">
                  {experiences.slice(0, 4).map((exp) => (
                    <div key={exp.id} className="text-[11px]">
                      <div className="flex justify-between items-baseline font-bold text-slate-900">
                        <span className="uppercase">{exp.role}</span>
                        <span className="text-slate-500 font-medium text-[10.5px]">
                          {exp.startDate} - {exp.isCurrent ? labels.present : exp.endDate}
                        </span>
                      </div>
                      <div
                        className="font-semibold text-[10.5px] mb-0.5"
                        style={{ color: palette.primary }}
                      >
                        {exp.company}
                        {exp.location ? `, ${exp.location}` : ''}
                      </div>
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="space-y-0.5 text-slate-700 list-disc pl-4 marker:text-slate-400">
                          {exp.highlights.slice(0, 2).map((h, i) => (
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

            {/* EDUCATION */}
            {educations.length > 0 && (
              <section>
                <div
                  className="px-3 py-1 text-white font-bold uppercase tracking-wider text-[11.5px] mb-2 rounded-xs"
                  style={{ backgroundColor: palette.sidebarBg || palette.primary }}
                >
                  {labels.education}
                </div>
                <div className="space-y-2 px-0.5 text-[11px]">
                  {educations.slice(0, 2).map((edu) => (
                    <div key={edu.id} className="uppercase">
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
                      <div className="text-slate-600 text-[10.5px]">{edu.institution}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SKILLS */}
            {coreCompetencies.length > 0 && (
              <section>
                <div
                  className="px-3 py-1 text-white font-bold uppercase tracking-wider text-[11.5px] mb-2 rounded-xs"
                  style={{ backgroundColor: palette.sidebarBg || palette.primary }}
                >
                  {labels.skills}
                </div>
                <div className="grid grid-cols-2 gap-x-3 px-0.5 text-[11px] text-slate-700">
                  <ul className="space-y-1">
                    {skillsCol1.slice(0, 4).map((s, idx) => (
                      <li key={`s1-${idx}`} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 mt-1 rounded-xs bg-slate-400 flex-shrink-0" />
                        <span className="leading-tight">{s}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="space-y-1">
                    {skillsCol2.slice(0, 4).map((s, idx) => (
                      <li key={`s2-${idx}`} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 mt-1 rounded-xs bg-slate-400 flex-shrink-0" />
                        <span className="leading-tight">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* CERTIFICATIONS */}
            {certifications.length > 0 && (
              <section>
                <div
                  className="px-3 py-1 text-white font-bold uppercase tracking-wider text-[11.5px] mb-2 rounded-xs"
                  style={{ backgroundColor: palette.sidebarBg || palette.primary }}
                >
                  {labels.certifications}
                </div>
                <div className="space-y-1 px-0.5 text-[10.5px] text-slate-700">
                  {certifications.slice(0, 2).map((cert) => (
                    <div key={cert.id}>
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
        </div>
      </div>

      {/* Footer A4 */}
      <footer className="p-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <span>CV Creative Top Banner • 1 Lembar A4</span>
        <span>Halaman 1 dari 1</span>
      </footer>
    </div>
  );
};
