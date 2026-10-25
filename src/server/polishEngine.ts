// Smart deterministic polisher for CV & Cover Letter
// Guaranteed 100% to transform minimal, informal, or rough user inputs into polished professional phrasing

export interface PolishInput {
  fullName?: string;
  headline?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  experiences?: Array<{
    id?: string;
    role?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    highlights?: string[];
  }>;
  educations?: Array<{
    id?: string;
    degree?: string;
    field?: string;
    institution?: string;
    startYear?: string;
    endYear?: string;
  }>;
  rawSkills?: string;
  targetCompany?: string;
  targetPosition?: string;
  toneLevel?: 'staff' | 'manager';
}

function cleanText(t: string): string {
  return (t || '').trim().replace(/^[-*•\s]+/, '');
}

// Convert rough informal phrases into polite/professional action phrases
function polishActionPhrase(raw: string, isStaff: boolean, isEn: boolean): string {
  const text = cleanText(raw);
  if (!text) return '';

  const lower = text.toLowerCase();

  if (isEn) {
    if (isStaff) {
      if (lower.includes('drive') || lower.includes('nyetir') || lower.includes('kirim')) {
        return `Safely operated delivery vehicle and ensured on-time distribution of goods adhering to traffic regulations`;
      }
      if (lower.includes('kasir') || lower.includes('cashier') || lower.includes('uang')) {
        return `Handled daily cash and digital transactions accurately with friendly, attentive customer service`;
      }
      if (lower.includes('admin') || lower.includes('excel') || lower.includes('data')) {
        return `Organized daily administrative records and data entry with high accuracy and neat filing`;
      }
      return `Carried out daily assignments for ${text} with strong work ethic, discipline, and attention to safety`;
    } else {
      return `Spearheaded and coordinated operational execution of ${text} to enhance team efficiency and achieve set performance targets`;
    }
  }

  // Indonesian
  if (isStaff) {
    // Humble, polite, responsible, disciplined phrasing
    if (lower.includes('nyetir') || lower.includes('driver') || lower.includes('supir') || lower.includes('mobil') || lower.includes('motor')) {
      return `Mengemudikan armada kendaraan dengan aman, mematuhi rambu lalu lintas, dan memastikan barang tiba di tujuan tepat waktu serta utuh`;
    }
    if (lower.includes('kirim') || lower.includes('antar') || lower.includes('paket') || lower.includes('ekspedisi')) {
      return `Menjalankan proses pengiriman dan serah terima barang kepada pelanggan dengan ramah, teliti, dan bertanggung jawab penuh atas kelengkapan surat jalan`;
    }
    if (lower.includes('rawat') || lower.includes('bensin') || lower.includes('cek') || lower.includes('oli') || lower.includes('mesin')) {
      return `Melakukan pengecekan rutin kondisi fisik dan kebersihan armada sebelum bertugas guna menjamin kelancaran operasional kerja`;
    }
    if (lower.includes('kasir') || lower.includes('uang') || lower.includes('bayar') || lower.includes('transaksi')) {
      return `Melayani transaksi pembayaran tunai maupun non-tunai secara teliti, jujur, dan ramah kepada setiap pelanggan`;
    }
    if (lower.includes('admin') || lower.includes('excel') || lower.includes('ketik') || lower.includes('rekap') || lower.includes('arsip')) {
      return `Mengerjakan pencatatan data dan rekap administrasi harian dengan rapi, teliti, serta tepat waktu`;
    }
    if (lower.includes('gudang') || lower.includes('stok') || lower.includes('packing') || lower.includes('bongkar')) {
      return `Membantu penataan, penghitungan stok barang, dan proses bongkar muat dengan mengutamakan keselamatan kerja`;
    }
    if (lower.includes('pelayan') || lower.includes('waiter') || lower.includes('toko') || lower.includes('jual') || lower.includes('sales')) {
      return `Memberikan pelayanan yang sopan dan ramah kepada pelanggan serta membantu menjawab kebutuhan produk dengan baik`;
    }
    // Generic staff polish
    return `Menjalankan tugas ${text} dengan penuh rasa tanggung jawab, disiplin waktu, dan kepatuhan pada standar operasional`;
  } else {
    // Managerial / Strategic phrasing
    return `Mengkoordinasikan dan mengoptimalkan proses ${text} guna meningkatkan efisiensi kerja tim serta mendukung pencapaian target operasional`;
  }
}

export function deterministicPolish(
  rawInput: PolishInput,
  documentType: string,
  lang: string
) {
  const isEn = lang === 'en';
  const isStaff = (rawInput.toneLevel || 'staff') === 'staff';
  const roleTitle = rawInput.headline || (isStaff ? (isEn ? 'Operational Staff' : 'Staf Operasional') : (isEn ? 'Professional Manager' : 'Manajer'));

  // 1. POLISH SUMMARY
  let polishedSummary = '';
  const rawSummary = cleanText(rawInput.summary || '');
  if (isEn) {
    if (isStaff) {
      polishedSummary = rawSummary
        ? `Dedicated and reliable ${roleTitle} with hands-on experience in ${rawSummary}. Known for high integrity, punctuality, and a strong sense of responsibility. Eager to follow company procedures, maintain workplace safety, and deliver consistent, high-quality contributions as part of a supportive team.`
        : `Results-driven and trustworthy ${roleTitle} with a solid background in daily operations. Committed to punctuality, disciplined execution, and continuous learning to support team success.`;
    } else {
      polishedSummary = rawSummary
        ? `Accomplished and strategic ${roleTitle} with extensive background in ${rawSummary}. Proven track record in optimizing operational workflows, fostering high-performing teams, and achieving corporate KPIs with measurable impact.`
        : `Dynamic and visionary ${roleTitle} experienced in spearheading cross-functional initiatives, elevating organizational performance, and driving sustainable business growth through structured management.`;
    }
  } else {
    if (isStaff) {
      polishedSummary = rawSummary
        ? `Pribadi yang jujur, disiplin, dan bertanggung jawab dengan pengalaman kerja di bidang ${roleTitle}. Terbiasa melaksanakan pekerjaan ${rawSummary} dengan cermat, menjaga etika dan keselamatan kerja, serta siap bekerja keras dan bekerja sama secara kompak di dalam tim demi kemajuan perusahaan.`
        : `Pribadi yang bersahaja, jujur, dan berdedikasi tinggi di bidang ${roleTitle}. Memiliki etos kerja yang kuat, disiplin waktu, cepat beradaptasi, serta berkomitmen memberikan kontribusi nyata dan tanggung jawab penuh dalam setiap amanah pekerjaan.`;
    } else {
      polishedSummary = rawSummary
        ? `Profesional berdedikasi dengan rekam jejak terbukti di bidang ${roleTitle}, khususnya dalam ${rawSummary}. Memiliki keahlian kepemimpinan tim yang adaptif, kemampuan analisa strategis, serta komitmen tinggi dalam mengoptimalkan efisiensi proses dan pencapaian target kerja.`
        : `Profesional strategis di bidang ${roleTitle} dengan komitmen kuat pada peningkatan performa bisnis, efisiensi operasional lintas fungsi, serta pengembangan tim kerja yang solid dan berorientasi hasil.`;
    }
  }

  // 2. POLISH CAREER HIGHLIGHTS
  let careerHighlights: string[] = [];
  if (isEn) {
    careerHighlights = isStaff
      ? [
          `Consistently maintained 100% punctuality and dependable attendance throughout employment history`,
          `Adhered strictly to occupational safety standards and operating procedures with zero violation record`,
          `Demonstrated respectful, polite communication with clients and strong camaraderie with colleagues`,
          `Quick learner, responsive to instructions, and adaptable to dynamic field conditions`,
        ]
      : [
          `Proven leadership in driving operational performance and improving process workflows`,
          `Consistently achieved and exceeded key performance targets across assigned projects`,
          `Enhanced team productivity through clear communication, mentoring, and disciplined coordination`,
        ];
  } else {
    careerHighlights = isStaff
      ? [
          `Selalu menjaga kedisiplinan waktu, ketepatan kehadiran, dan dedikasi tinggi dalam bertugas`,
          `Memiliki rekam jejak kerja yang bersih, jujur, serta mematuhi seluruh standar operasional (SOP)`,
          `Terbiasa berkomunikasi dengan santun, ramah kepada pelanggan, dan mudah bekerja sama dalam tim`,
          `Cepat tanggap dalam menjalankan instruksi kerja dan mampu menjaga kehati-hatian dalam bertugas`,
        ]
      : [
          `Rekam jejak terbukti dalam memimpin tim serta mengoptimalkan efisiensi operasional kerja`,
          `Berhasil mencapai dan melampaui target berkala melalui perencanaan kerja yang terstruktur`,
          `Kemampuan komunikasi strategis, pembinaan bawahan, dan penyelesaian kendala kerja secara efektif`,
        ];
  }

  // 3. POLISH COMPETENCIES / SKILLS
  let coreCompetencies: string[] = [];
  if (rawInput.rawSkills && rawInput.rawSkills.trim()) {
    coreCompetencies = rawInput.rawSkills
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  
  if (coreCompetencies.length < 5) {
    const defaultSkills = isEn
      ? (isStaff
          ? ['Work Ethic & Integrity', 'Time Management & Punctuality', 'SOP & Safety Compliance', 'Team Collaboration', 'Polite Communication', 'Responsibility & Care']
          : ['Strategic Planning', 'Team Leadership', 'Operational Efficiency', 'Process Improvement', 'Stakeholder Management', 'Problem Solving'])
      : (isStaff
          ? ['Kejujuran & Tanggung Jawab', 'Disiplin Waktu & Kehadiran', 'Kepatuhan SOP & Keselamatan', 'Kerja Sama Tim', 'Komunikasi Ramah & Sopan', 'Ketelitian & Ketekunan']
          : ['Kepemimpinan Tim', 'Manajemen Operasional', 'Perencanaan Strategis', 'Komunikasi & Negosiasi', 'Analisis Masalah', 'Pencapaian Target KPI']);

    for (const sk of defaultSkills) {
      if (!coreCompetencies.includes(sk)) {
        coreCompetencies.push(sk);
      }
    }
  }

  // 4. POLISH EXPERIENCES
  const rawExperiences = rawInput.experiences && rawInput.experiences.length > 0
    ? rawInput.experiences
    : [
        {
          id: 'exp-default-1',
          role: roleTitle,
          company: isEn ? 'Previous Company' : 'Perusahaan Sebelumnya',
          startDate: '2022',
          endDate: isEn ? 'Present' : 'Sekarang',
          highlights: [''],
        },
      ];

  const polishedExperiences = rawExperiences.map((exp, idx) => {
    const rawHighlights = exp.highlights || [];
    const flattened = rawHighlights
      .join('\n')
      .split(/[\n,;]+/)
      .map((h) => h.trim())
      .filter((h) => h.length > 2);

    let polishedBullets: string[] = [];

    if (flattened.length > 0) {
      polishedBullets = flattened.map((item) => polishActionPhrase(item, isStaff, isEn)).filter(Boolean);
    }

    // If still empty or too short, supply strong role-fitting bullets
    if (polishedBullets.length === 0) {
      if (isEn) {
        polishedBullets = isStaff
          ? [
              `Carried out daily assignments for ${exp.role || roleTitle} with high dedication and discipline.`,
              `Maintained effective coordination with team members and respected superiors' directions.`,
              `Ensured work environment and assigned equipment were kept neat, safe, and well-maintained.`,
            ]
          : [
              `Managed and supervised day-to-day operations to ensure alignment with organizational goals.`,
              `Collaborated cross-functionally to streamline workflows and boost team productivity.`,
            ];
      } else {
        polishedBullets = isStaff
          ? [
              `Menjalankan tugas pekerjaan harian untuk posisi ${exp.role || roleTitle} dengan penuh rasa tanggung jawab dan disiplin.`,
              `Menjaga koordinasi yang baik dengan rekan kerja serta mematuhi arahan kerja dari atasan.`,
              `Memastikan keselamatan kerja, kebersihan peralatan, serta kelengkapan administrasi tugas terjaga dengan baik.`,
            ]
          : [
              `Memimpin dan mengkoordinasikan kegiatan operasional guna memastikan tercapainya target kerja secara tepat waktu.`,
              `Melakukan evaluasi berkala dan perbaikan alur kerja untuk meningkatkan efisiensi dan kualitas hasil.`,
            ];
      }
    }

    return {
      id: exp.id || `exp-${idx}`,
      role: (exp.role || roleTitle).toUpperCase(),
      company: exp.company || (isEn ? 'Company' : 'Perusahaan'),
      location: exp.location || '',
      startDate: exp.startDate || '2021',
      endDate: exp.endDate || (isEn ? 'Present' : 'Sekarang'),
      isCurrent: exp.isCurrent || false,
      highlights: polishedBullets.slice(0, 5),
    };
  });

  // 5. UPPERCASE EDUCATIONS (Keep field as-is apa adanya, don't invent majors)
  const polishedEducations = (rawInput.educations || []).map((edu) => ({
    id: edu.id || `edu-${Date.now()}`,
    degree: (edu.degree || '').trim().toUpperCase(),
    field: (edu.field || '').trim().toUpperCase(),
    institution: (edu.institution || '').trim().toUpperCase(),
    startYear: edu.startYear || '',
    endYear: edu.endYear || '',
  }));

  // 6. POLISH COVER LETTER
  let coverLetter = '';
  if (documentType === 'cv_and_cover_letter') {
    const company = rawInput.targetCompany || (isEn ? '[Company Name]' : '[Nama Perusahaan]');
    const position = rawInput.targetPosition || rawInput.headline || (isEn ? '[Position Title]' : '[Posisi yang Dilamar]');
    const dateStr = new Date().toLocaleDateString(isEn ? 'en-US' : 'id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    const name = rawInput.fullName || (isEn ? 'Applicant' : 'Pelamar');

    if (isStaff) {
      coverLetter = isEn
        ? `${dateStr}\n\nTo: Hiring Manager / HR Department\n${company}\n\nDear Sir/Madam,\n\nThrough this application letter, I would like to respectfully apply for the ${position} position at ${company}.\n\nI am a hardworking, honest, and disciplined individual with a strong sense of responsibility. I am ready to follow company procedures diligently, uphold high safety standards, and contribute my best efforts to support the team. I believe that with my dedication and humble attitude, I can be a dependable asset for ${company}.\n\nThank you for considering my application. I would be very grateful for the opportunity to attend an interview.\n\nRespectfully,\n\n${name}`
        : `${dateStr}\n\nKepada Yth.\nBapak/Ibu Pimpinan / HRD\n${company}\n\nDengan hormat,\n\nSehubungan dengan informasi lowongan pekerjaan untuk posisi ${position} di ${company}, melalui surat ini saya bermaksud untuk mengajukan diri guna mengisi posisi tersebut.\n\nSaya adalah pribadi yang jujur, disiplin, dan terbiasa bekerja dengan rasa tanggung jawab yang tinggi. Saya siap mematuhi aturan kerja yang berlaku, menjaga ketelitian dan keselamatan dalam bertugas, serta siap belajar dan bekerja sama dengan baik bersama rekan kerja demi kelancaran operasional perusahaan.\n\nBesar harapan saya untuk dapat diberikan kesempatan mengikuti proses wawancara agar dapat menyampaikan kesiapan dan tekad saya untuk berkontribusi. Atas perhatian dan kesempatan yang Bapak/Ibu berikan, saya ucapkan terima kasih.\n\nHormat saya,\n\n${name}`;
    } else {
      coverLetter = isEn
        ? `${dateStr}\n\nTo: Hiring Committee / Management\n${company}\n\nDear Hiring Team,\n\nI am writing to express my strong interest in the ${position} position at ${company}. With my professional background and proven commitment to operational excellence, I am confident in my ability to deliver meaningful value to your organization.\n\nThroughout my career, I have focused on driving measurable results, optimizing team workflows, and fostering collaborative cross-functional relationships. I am particularly inspired by ${company}'s growth and would welcome the opportunity to contribute my leadership and problem-solving skills to your team.\n\nThank you for your time and consideration. I look forward to discussing how my experience aligns with your strategic objectives.\n\nSincerely,\n\n${name}`
        : `${dateStr}\n\nKepada Yth.\nBapak/Ibu HRD / Tim Rekrutmen\n${company}\n\nDengan hormat,\n\nSehubungan dengan informasi lowongan pekerjaan yang saya peroleh untuk posisi ${position} di ${company}, melalui surat ini saya bermaksud untuk mengajukan diri guna bergabung dengan perusahaan yang Bapak/Ibu pimpin.\n\nDengan latar belakang pengalaman dan keahlian yang saya miliki, saya berkomitmen untuk memberikan dedikasi penuh, kemampuan adaptasi yang cepat, serta kontribusi nyata bagi tercapainya target dan kemajuan ${company}. Saya terbiasa bekerja secara mandiri maupun memimpin tim dengan orientasi pada hasil yang terukur dan efisiensi kerja.\n\nBesar harapan saya untuk diberikan kesempatan wawancara agar dapat menjelaskan lebih lanjut mengenai kualifikasi dan potensi yang dapat saya kontribusikan bagi perusahaan.\n\nDemikian surat lamaran ini saya sampaikan. Atas perhatian dan kesempatan yang Bapak/Ibu berikan, saya ucapkan terima kasih.\n\nHormat saya,\n\n${name}`;
    }
  }

  return {
    summary: polishedSummary,
    careerHighlights,
    coreCompetencies,
    experiences: polishedExperiences,
    educations: polishedEducations,
    coverLetter,
  };
}
