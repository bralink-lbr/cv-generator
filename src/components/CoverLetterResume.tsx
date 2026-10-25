import React from 'react';
import { ResumeData, PastelPalette } from '../types/resume';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface CoverLetterResumeProps {
  data: ResumeData;
  palette: PastelPalette;
  id?: string;
  className?: string;
}

export const CoverLetterResume: React.FC<CoverLetterResumeProps> = ({
  data,
  palette,
  id = 'cover-letter-preview',
  className = '',
}) => {
  const { personalInfo, coverLetter, lang } = data;
  const isEn = lang === 'en';

  const defaultContent = isEn
    ? `Hiring Manager / Recruitment Team\n${coverLetter?.targetCompany || 'Target Company'}\n\nDear Hiring Team,\n\nI am pleased to submit my application for the ${coverLetter?.targetPosition || personalInfo.headline || 'open position'} at ${coverLetter?.targetCompany || 'your esteemed company'}.\n\nWith a strong background and dedication to delivering measurable results, I am confident in my capacity to add immediate value to your organization. I have developed a solid foundation in collaboration, problem solving, and driving operational excellence.\n\nI am particularly drawn to your company's mission and culture of innovation, and I would welcome the opportunity to bring my experience and enthusiasm to your team. Thank you for your time and consideration.\n\nSincerely,\n\n${personalInfo.fullName || 'Candidate'}`
    : `Kepada Yth.\nBapak/Ibu Tim HRD / Rekrutmen\n${coverLetter?.targetCompany || 'Nama Perusahaan'}\n\nDengan hormat,\n\nSehubungan dengan informasi lowongan pekerjaan untuk posisi ${coverLetter?.targetPosition || personalInfo.headline || 'posisi yang tersedia'} di ${coverLetter?.targetCompany || 'perusahaan yang Bapak/Ibu pimpin'}, melalui surat ini saya bermaksud untuk mengajukan diri guna bergabung dengan tim Anda.\n\nDengan latar belakang pengalaman, dedikasi, serta keterampilan yang saya miliki, saya berkomitmen untuk memberikan kontribusi nyata serta bekerja secara profesional guna mencapai target dan kemajuan perusahaan. Saya memiliki kemampuan adaptasi yang cepat, komunikasi yang efektif, serta orientasi kerja pada hasil yang optimal.\n\nBesar harapan saya untuk memperoleh kesempatan wawancara agar dapat menjelaskan lebih lanjut mengenai potensi dan kualifikasi diri saya. Demikian surat lamaran ini saya sampaikan, atas perhatian dan kesempatan yang diberikan saya ucapkan terima kasih.\n\nHormat saya,\n\n${personalInfo.fullName || 'Pelamar'}`;

  const contentText = coverLetter?.content || defaultContent;

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
        {/* Header Bar */}
        <header className="border-b-2 pb-5 mb-7" style={{ borderColor: palette.primary }}>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h1
                className="text-2xl font-black uppercase tracking-wider"
                style={{ color: palette.primary }}
              >
                {(personalInfo.fullName || 'NAMA LENGKAP').toUpperCase()}
              </h1>
              {personalInfo.headline && (
                <p className="text-slate-600 text-xs font-medium mt-0.5 uppercase tracking-wide">
                  {personalInfo.headline.toUpperCase()}
                </p>
              )}
            </div>

            <div className="text-[11.5px] text-slate-600 space-y-0.5 sm:text-right">
              {personalInfo.email && (
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center sm:justify-end gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Letter Target & Subject */}
        <div className="mb-6 space-y-1 text-slate-800 text-[12.5px]">
          <div className="text-slate-500 text-[11.5px] mb-2">
            {new Date().toLocaleDateString(isEn ? 'en-US' : 'id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>

          <div className="font-semibold text-slate-900">
            {isEn ? 'Subject:' : 'Perihal:'}{' '}
            <span style={{ color: palette.primary }}>
              {isEn
                ? `Application for ${coverLetter?.targetPosition || 'Position'} - ${personalInfo.fullName}`
                : `Lamaran Pekerjaan: ${coverLetter?.targetPosition || 'Posisi'} - ${personalInfo.fullName}`}
            </span>
          </div>
        </div>

        {/* Cover Letter Body Content */}
        <div className="text-slate-800 text-[12.5px] leading-relaxed whitespace-pre-line text-justify space-y-4">
          {contentText}
        </div>
      </div>

      {/* Footer signoff badge */}
      <footer className="pt-8 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
        <span>Surat Lamaran Kerja Resmi • {personalInfo.fullName}</span>
        <span>CV Generator Pro</span>
      </footer>
    </div>
  );
};
