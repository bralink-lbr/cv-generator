import fs from 'fs';
import path from 'path';

export interface SubmissionRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  headline: string;
  documentType: 'cv_only' | 'cv_and_cover_letter';
  creativeType: string;
  price: number;
  priceFormatted: string;
  targetCompany?: string;
  targetPosition?: string;
  gdriveFolder?: string;
  hasAtsPdf?: boolean;
  hasCreativePdf?: boolean;
  hasCoverLetterPdf?: boolean;
  createdAt: string;
  resumeData?: any;
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'submissions.json');

// Ensure database directory and file exist
function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

export function getAllSubmissions(): SubmissionRecord[] {
  try {
    initDb();
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading submissions DB:', err);
    return [];
  }
}

export function saveSubmission(record: Omit<SubmissionRecord, 'id' | 'createdAt'>): SubmissionRecord {
  initDb();
  const all = getAllSubmissions();
  const newRecord: SubmissionRecord = {
    ...record,
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  all.unshift(newRecord);
  fs.writeFileSync(DB_FILE, JSON.stringify(all, null, 2), 'utf-8');

  // Log notification to owner email
  console.log(`[EMAIL NOTIFICATION TO: linkedin.anief@gmail.com]`);
  console.log(`Subjek: Pesanan CV Baru dari ${newRecord.name} (${newRecord.priceFormatted})`);
  console.log(`Halo Admin,\nAda pengguna baru yang mengunduh CV:\n- Nama: ${newRecord.name}\n- HP/WA: ${newRecord.phone}\n- Email: ${newRecord.email}\n- Tipe Dokumen: ${newRecord.documentType === 'cv_only' ? 'CV Saja (Rp 10.000)' : 'CV + Lamaran (Rp 15.000)'}\n- Perusahaan Tujuan: ${newRecord.targetCompany || '-'}\n- Waktu: ${newRecord.createdAt}\nKonfirmasi WhatsApp akan masuk ke 081228251605.`);

  return newRecord;
}
