import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export interface ExportPdfOptions {
  elementId: string;
  filename: string;
}

export async function exportElementToPdf({ elementId, filename }: ExportPdfOptions): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found.`);
  }

  // Scroll to top to ensure complete capture
  window.scrollTo(0, 0);

  // High quality canvas generation
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    allowTaint: true,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  // A4 dimensions in mm
  const pdfWidth = 210;
  const pdfHeight = 297;

  // Calculate scaled height on A4
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pdf = new jsPDF('p', 'mm', 'a4');

  // Single page A4 guarantee (fits exactly on 1 page without extra blank page)
  if (imgHeight <= 298) {
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
  } else {
    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Additional pages only if content genuinely exceeds 1 page
    while (heightLeft > 5) {
      position = position - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }
  }

  pdf.save(filename);
}

export interface BatchExportOptions {
  atsElementId: string;
  creativeElementId: string;
  coverLetterElementId?: string;
  includeCoverLetter?: boolean;
  name: string;
  creativeType: string;
  onProgress?: (msg: string) => void;
}

export async function exportAllPdfs({
  atsElementId,
  creativeElementId,
  coverLetterElementId,
  includeCoverLetter,
  name,
  creativeType,
  onProgress,
}: BatchExportOptions): Promise<void> {
  const sanitizedName = (name || 'CV').trim().replace(/[^a-zA-Z0-9_-]/g, '_');

  onProgress?.('1/3 Mengunduh file PDF ATS...');
  await exportElementToPdf({
    elementId: atsElementId,
    filename: `${sanitizedName}_CV_ATS.pdf`,
  });

  await new Promise((resolve) => setTimeout(resolve, 800));

  onProgress?.('2/3 Mengunduh file PDF Creative...');
  await exportElementToPdf({
    elementId: creativeElementId,
    filename: `${sanitizedName}_CV_Creative_${creativeType.toUpperCase()}.pdf`,
  });

  if (includeCoverLetter && coverLetterElementId) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    onProgress?.('3/3 Mengunduh file Surat Lamaran Kerja...');
    await exportElementToPdf({
      elementId: coverLetterElementId,
      filename: `${sanitizedName}_Surat_Lamaran.pdf`,
    });
  }

  onProgress?.('Selesai! Seluruh file PDF berhasil diunduh.');
}

// Backward compatibility alias
export const exportDualPdfs = exportAllPdfs;

export interface SingleDocExportOptions {
  elementId: string;
  type: 'ats' | 'creative' | 'cover_letter';
  name: string;
  creativeType?: string;
}

export async function exportSingleDoc({
  elementId,
  type,
  name,
  creativeType = 'creative1',
}: SingleDocExportOptions): Promise<string> {
  const sanitizedName = (name || 'CV').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  let filename = `${sanitizedName}_CV_ATS.pdf`;
  if (type === 'creative') {
    filename = `${sanitizedName}_CV_Creative_${creativeType.toUpperCase()}.pdf`;
  } else if (type === 'cover_letter') {
    filename = `${sanitizedName}_Surat_Lamaran.pdf`;
  }

  await exportElementToPdf({ elementId, filename });
  return filename;
}

export async function generateElementPdfBase64(elementId: string): Promise<string> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found.`);
  }

  window.scrollTo(0, 0);

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    allowTaint: true,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdfWidth = 210;
  const pdfHeight = 297;
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pdf = new jsPDF('p', 'mm', 'a4');

  if (imgHeight <= 298) {
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
  } else {
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;
    while (heightLeft > 5) {
      position = position - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }
  }

  return pdf.output('datauristring');
}

export async function generateAllPdfsBase64({
  atsElementId,
  creativeElementId,
  coverLetterElementId,
  includeCoverLetter,
  onProgress,
}: {
  atsElementId: string;
  creativeElementId: string;
  coverLetterElementId?: string;
  includeCoverLetter?: boolean;
  onProgress?: (msg: string) => void;
}): Promise<{ atsPdf?: string; creativePdf?: string; coverLetterPdf?: string }> {
  onProgress?.('1/3 Menyiapkan berkas CV ATS...');
  const atsPdf = await generateElementPdfBase64(atsElementId);

  await new Promise((resolve) => setTimeout(resolve, 200));
  onProgress?.('2/3 Menyiapkan berkas CV Creative...');
  const creativePdf = await generateElementPdfBase64(creativeElementId);

  let coverLetterPdf: string | undefined;
  if (includeCoverLetter && coverLetterElementId) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    onProgress?.('3/3 Menyiapkan berkas Surat Lamaran...');
    coverLetterPdf = await generateElementPdfBase64(coverLetterElementId);
  }

  onProgress?.('Selesai! Berkas CV berhasil disubmit.');
  return { atsPdf, creativePdf, coverLetterPdf };
}

