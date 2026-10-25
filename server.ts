import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

import fs from 'fs';
import { saveSubmission, getAllSubmissions } from './src/server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const ORDERS_PDF_DIR = path.resolve(process.cwd(), 'data', 'orders_pdf');
if (!fs.existsSync(ORDERS_PDF_DIR)) {
  fs.mkdirSync(ORDERS_PDF_DIR, { recursive: true });
}

function savePdfBase64(base64Data: string, filename: string): boolean {
  try {
    const cleanBase64 = base64Data.replace(/^data:application\/pdf[^,]*,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    fs.writeFileSync(path.join(ORDERS_PDF_DIR, filename), buffer);
    return true;
  } catch (err) {
    console.error(`Error saving PDF ${filename}:`, err);
    return false;
  }
}

// Database API: Simpan pengguna yang membuat/unduh CV & lamaran
app.post('/api/submissions', (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      location,
      headline,
      documentType,
      creativeType,
      targetCompany,
      targetPosition,
      gdriveFolder,
      resumeData,
      atsPdf,
      creativePdf,
      coverLetterPdf,
    } = req.body;

    const price = documentType === 'cv_and_cover_letter' ? 15000 : 10000;
    const priceFormatted = documentType === 'cv_and_cover_letter' ? 'Rp 15.000' : 'Rp 10.000';

    const saved = saveSubmission({
      name: name || 'Tanpa Nama',
      phone: phone || '-',
      email: email || '-',
      location: location || '-',
      headline: headline || '-',
      documentType: documentType || 'cv_only',
      creativeType: creativeType || 'creative1',
      price,
      priceFormatted,
      targetCompany: targetCompany || '',
      targetPosition: targetPosition || '',
      gdriveFolder: gdriveFolder || 'https://drive.google.com/drive/folders/14Ckuu7Z72kmMpx_lU3MRdhhiPqy4UNzr',
      resumeData: resumeData || null,
    });

    if (atsPdf && typeof atsPdf === 'string') {
      const savedAts = savePdfBase64(atsPdf, `${saved.id}_ATS.pdf`);
      saved.hasAtsPdf = savedAts;
    }
    if (creativePdf && typeof creativePdf === 'string') {
      const savedCr = savePdfBase64(creativePdf, `${saved.id}_CREATIVE.pdf`);
      saved.hasCreativePdf = savedCr;
    }
    if (coverLetterPdf && typeof coverLetterPdf === 'string') {
      const savedCl = savePdfBase64(coverLetterPdf, `${saved.id}_LAMARAN.pdf`);
      saved.hasCoverLetterPdf = savedCl;
    }

    res.json({ success: true, submission: saved });
  } catch (error: any) {
    console.error('Error saving submission:', error);
    res.status(500).json({ error: error.message || 'Gagal menyimpan data' });
  }
});

// Database API: Ambil semua data pengguna (untuk admin)
app.get('/api/submissions', (req, res) => {
  try {
    const data = getAllSubmissions();
    res.json({ success: true, data, count: data.length });
  } catch (error: any) {
    res.status(500).json({ error: 'Gagal mengambil data pengguna' });
  }
});

// Admin API: Unduh berkas PDF pesanan kandidat
app.get('/api/submissions/:id/pdf/:type', (req, res) => {
  try {
    const { id, type } = req.params;
    let suffix = 'ATS';
    if (type === 'creative') suffix = 'CREATIVE';
    else if (type === 'cover_letter' || type === 'lamaran') suffix = 'LAMARAN';
    const filePath = path.join(ORDERS_PDF_DIR, `${id}_${suffix}.pdf`);
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${id}_${suffix}.pdf"`);
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: 'Berkas PDF tidak ditemukan di server.' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// Server-side Gemini AI setup
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Polish & Enhance Text (e.g. STAR method for bullet points or executive summary)
app.post('/api/ai/enhance', async (req, res) => {
  try {
    const { text, type, lang } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API Key belum dikonfigurasi di server environment.',
      });
    }

    const promptLang = lang === 'en' ? 'English' : 'Indonesian (Bahasa Indonesia)';
    const prompt = `You are an expert executive resume writer and career coach.
Enhance and rewrite the following resume content into impactful, professional ${promptLang}.
Type: ${type || 'bullet point or summary'}
Original text:
"${text}"

Rules:
1. Use strong active action verbs (e.g., spearheaded, optimized, accelerated, orchestrated).
2. Incorporate quantifiable metrics or impact orientation where possible.
3. Keep it crisp, professional, and ATS-friendly.
4. Output ONLY the rewritten text, without quotes, explanations, or markdown bold symbols unless needed.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const enhanced = response.text?.trim() || text;
    res.json({ result: enhanced });
  } catch (error: any) {
    console.error('Enhance API error:', error);
    res.status(500).json({ error: error.message || 'Gagal memproses AI enhance' });
  }
});

// API: Translate Full Resume or Text between Indonesian and English
app.post('/api/ai/translate', async (req, res) => {
  try {
    const { resumeData, targetLang } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API Key belum dikonfigurasi di server environment.',
      });
    }

    const targetLanguageName = targetLang === 'en' ? 'English' : 'Indonesian (Bahasa Indonesia)';
    const prompt = `You are a professional resume localization expert.
Translate the following CV JSON content to ${targetLanguageName}.
Keep all JSON keys exactly the same.
Only translate the human-readable text values (headline, summary, highlights items, experience role, experience description bullets, education field, languages, hobbies, skills).
Do NOT change personal names, emails, URLs, dates/years, or contact numbers.
Return STRICTLY valid JSON with no markdown formatting.

JSON:
${JSON.stringify(resumeData)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const translatedText = response.text?.trim();
    if (!translatedText) {
      return res.status(500).json({ error: 'Empty response from AI' });
    }

    const parsed = JSON.parse(translatedText);
    res.json({ result: parsed });
  } catch (error: any) {
    console.error('Translate API error:', error);
    res.status(500).json({ error: error.message || 'Gagal menerjemahkan dengan AI' });
  }
});

import { deterministicPolish } from './src/server/polishEngine.ts';

// Helper to extract JSON from AI response text
function extractJsonFromText(text: string): any {
  if (!text) return null;
  const clean = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // Try direct parse
  try {
    return JSON.parse(clean);
  } catch (_) {
    // Try finding the first { and last }
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const sub = clean.slice(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(sub);
      } catch (err) {
        return null;
      }
    }
    return null;
  }
}

// API: Generate & Polish Full Resume and Cover Letter from minimal/informal user inputs
app.post('/api/ai/generate-full', async (req, res) => {
  const { rawInput, documentType, lang, templateType } = req.body;
  const tone = rawInput?.toneLevel || 'staff';
  const isStaff = tone === 'staff';
  const targetLanguage = lang === 'en' ? 'English' : 'Indonesian (Bahasa Indonesia)';

  const ai = getGenAI();

  // Helper for tone guidelines
  const toneGuidelines = isStaff
    ? `TONE & STYLE: LEBIH SEDERHANA, MERENDAH TAPI TIDAK RENDAH DIRI (HUMBLE YET CONFIDENT & RESPONSIBLE).
- Pengguna melamar posisi pelaksana/operasional/staf (misal: driver, kurir, kasir, admin, teknisi, operator, pramuniaga, staf lapangan, dll).
- JANGAN gunakan istilah korporat yang terlalu bombastis, muluk-muluk, atau sok akademis (HINDARI kata seperti: "mengorkestrasi", "mensinergikan visi", "mengoptimalisasi paradigma strategis", dsb).
- Gunakan bahasa yang wajar, bersahaja, jujur, sopan, disiplin, dan bertanggung jawab.
- Tekankan: ketepatan waktu, kejujuran, keselamatan kerja, ketelitian, etos kerja keras, pelayanan ramah, dan kerja sama tim.
- Buat agar HRD/pemilik usaha merasa calon pekerja ini tulus, tekun, amanah, dan dapat dipercaya.`
    : `TONE & STYLE: STRATEGIS, MANAJERIAL, DAN BERORIENTASI PADA KPI.
- Posisi ditujukan untuk tingkat Supervisor, Manager, atau Eksekutif.
- Gunakan kata kerja aktif manajerial (memimpin, merancang strategi, mengoptimalkan proses, pembinaan tim, analisis data).`;

  const prompt = `You are an expert Indonesian and English resume writer and career coach.
The user provided draft resume data in informal or minimal words.
Your job is to polish it into clean, professional, ATS-friendly ${targetLanguage}.

User raw input:
${JSON.stringify(rawInput, null, 2)}

Target Tone: ${isStaff ? 'STAFF / OPERASIONAL (Sederhana, Merendah tapi tidak rendah diri, Jujur & Tanggung Jawab)' : 'MANAJERIAL (Strategis & Leadership)'}
${toneGuidelines}

PENTING UNTUK RIWAYAT PEKERJAAN (EXPERIENCES):
- Nilai "role" (jabatan/posisi) WAJIB diubah menjadi HURUF BESAR / KAPITAL (UPPERCASE), misalnya "PRAMUNIAGA", "KASIR", "STAFF GUDANG", "DRIVER".

PENTING UNTUK RIWAYAT PENDIDIKAN (EDUCATIONS):
- TAMPILKAN JURUSAN (field) APA ADANYA (AS-IS). JANGAN PERNAH MENGARANG ATAU MENAMBAHKAN JURUSAN jika pengguna hanya menulis jenjang seperti "SMK", "SMA", "SMP" atau mengosongkan jurusan (JANGAN tebak "TATA NIAGA" dsb)! Jika pengguna tidak menginput jurusan, biarkan field tetap string kosong ("").
- Nilai degree dan institution WAJIB diubah menjadi HURUF BESAR / KAPITAL (UPPERCASE).

Document Type: ${documentType} (cv_only or cv_and_cover_letter)
Language: ${targetLanguage}

Instructions:
1. "summary": Write a natural 2-3 sentence profile adhering to the tone guidelines above. Transform any rough user notes into polished sentences.
2. "careerHighlights": Generate 3-5 realistic, positive highlights tailored to their role and tone.
3. "coreCompetencies": Generate 6-10 realistic, relevant skills matching their profession and tone.
4. "experiences": Keep role (in UPPERCASE) and company, rewrite bullet points into clear, realistic, and respectful achievements/responsibilities matching the candidate's level.
5. "educations": Return educations with UPPERCASE degree and institution. Keep field strictly as-is (empty string if user did not specify a major).
6. If Document Type is "cv_and_cover_letter", write "coverLetter": a sincere, polite, and persuasive letter matching the candidate's level in ${targetLanguage}.

Return STRICTLY valid JSON with this exact schema:
{
  "summary": string,
  "careerHighlights": string[],
  "coreCompetencies": string[],
  "experiences": [
    {
      "id": string,
      "role": string,
      "company": string,
      "location": string,
      "startDate": string,
      "endDate": string,
      "isCurrent": boolean,
      "highlights": string[]
    }
  ],
  "educations": [
    {
      "id": string,
      "degree": string,
      "field": string,
      "institution": string,
      "startYear": string,
      "endYear": string
    }
  ],
  "coverLetter": string
}`;

  let aiResult: any = null;

  if (ai) {
    // Try gemini-3.1-flash-lite first (highest reliability & quota availability)
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
      });
      aiResult = extractJsonFromText(response.text?.trim() || '');
    } catch (err: any) {
      console.warn('gemini-3.1-flash-lite call error, trying fallback model:', err?.message || err);
      // Fallback try gemini-3.8-flash
      try {
        const response2 = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });
        aiResult = extractJsonFromText(response2.text?.trim() || '');
      } catch (err2: any) {
        console.warn('gemini-3.8-flash fallback also failed:', err2?.message || err2);
      }
    }
  }

  // If AI generation produced valid JSON, clean and return it
  if (aiResult && aiResult.summary && aiResult.experiences) {
    if (aiResult.experiences && Array.isArray(aiResult.experiences)) {
      aiResult.experiences = aiResult.experiences.map((exp: any) => ({
        ...exp,
        role: (exp.role || '').toUpperCase(),
      }));
    }
    if (aiResult.educations && Array.isArray(aiResult.educations)) {
      aiResult.educations = aiResult.educations.map((e: any, idx: number) => {
        const rawEdu = rawInput?.educations?.[idx];
        const rawField = rawEdu?.field ? rawEdu.field.trim() : '';
        return {
          ...e,
          degree: (rawEdu?.degree || e.degree || '').toUpperCase(),
          field: rawField ? rawField.toUpperCase() : '',
          institution: (rawEdu?.institution || e.institution || '').toUpperCase(),
        };
      });
    }
    return res.json({
      ...aiResult,
      source: 'gemini',
    });
  }

  // Deterministic rule-based polish engine (guaranteed 100% polished, zero unpolished raw text)
  console.log('Using deterministicPolish engine for candidate...');
  const polished = deterministicPolish(rawInput || {}, documentType || 'cv_only', lang || 'id');
  return res.json({
    ...polished,
    source: 'deterministic_engine',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
