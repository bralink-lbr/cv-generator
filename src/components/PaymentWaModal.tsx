import React, { useState } from 'react';
import { ResumeData, DocumentType } from '../types/resume';
import { generateAllPdfsBase64 } from '../utils/pdfExport';
import {
  MessageCircle,
  X,
  Loader2,
  CheckCircle2,
  Send,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface PaymentWaModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  documentType: DocumentType;
  creativeType: string;
  onConfirmAndDownload?: () => Promise<void>;
  onDownloadSingle?: (type: 'ats' | 'creative' | 'cover_letter') => Promise<void>;
}

export const PaymentWaModal: React.FC<PaymentWaModalProps> = ({
  isOpen,
  onClose,
  data,
  documentType,
  creativeType,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string>('');

  if (!isOpen) return null;

  const isWithLetter = documentType === 'cv_and_cover_letter';
  const priceFormatted = isWithLetter ? 'Rp 15.000' : 'Rp 10.000';
  const docTitle = isWithLetter ? 'CV (ATS + Creative) + Surat Lamaran' : 'CV (ATS + Creative)';
  const totalFiles = isWithLetter ? '3 File PDF' : '2 File PDF';

  const candidateName = data.personalInfo.fullName.trim() || 'Pelamar';
  const targetPhone = '6281228251605';
  const gdriveLink = 'https://drive.google.com/drive/folders/14Ckuu7Z72kmMpx_lU3MRdhhiPqy4UNzr';

  // Pesan WhatsApp bersih TANPA link gdrive sesuai permintaan user
  const waMessage = `halo ka..konfirmasi untuk pemesanan cv atas nama ${candidateName} ya.. (${totalFiles} - ${priceFormatted})`;
  const waUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(waMessage)}`;

  // Submit order ke server & simpan file PDF ke sistem admin (TIDAK terdownload ke HP pelanggan)
  const handleSubmitOrder = async () => {
    setIsProcessing(true);
    setProgressMsg('Menyiapkan dan mengarsipkan berkas PDF pesanan ke sistem...');

    try {
      // Generate PDF Base64 untuk diupload ke server admin
      let pdfPayload: { atsPdf?: string; creativePdf?: string; coverLetterPdf?: string } = {};
      try {
        pdfPayload = await generateAllPdfsBase64({
          atsElementId: 'export-node-ats',
          creativeElementId: 'export-node-creative',
          coverLetterElementId: 'export-node-cover-letter',
          includeCoverLetter: isWithLetter,
          onProgress: (msg) => setProgressMsg(msg),
        });
      } catch (genErr) {
        console.warn('PDF generation in background note:', genErr);
      }

      setProgressMsg('Menyimpan data pemesanan ke admin...');
      await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: candidateName,
          phone: data.personalInfo.phone,
          email: data.personalInfo.email,
          location: data.personalInfo.location,
          headline: data.personalInfo.headline,
          documentType,
          creativeType,
          targetCompany: data.coverLetter?.targetCompany,
          targetPosition: data.coverLetter?.targetPosition,
          gdriveFolder: gdriveLink,
          resumeData: data,
          atsPdf: pdfPayload.atsPdf,
          creativePdf: pdfPayload.creativePdf,
          coverLetterPdf: pdfPayload.coverLetterPdf,
        }),
      });

      // Sukses: Ubah state ke submitted agar pelanggan diarahkan ke konfirmasi WA untuk bayar
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting order:', err);
      // Tetap set submitted agar pelanggan bisa menghubungi WA
      setIsSubmitted(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 my-4">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center text-white shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold leading-tight">
                {isSubmitted ? 'Pesanan Berhasil Disubmit' : 'Submit Pemesanan CV'}
              </h2>
              <p className="text-xs text-emerald-100">
                {isSubmitted ? 'Lanjutkan Konfirmasi Pembayaran' : 'Verifikasi Data & Kirim ke Admin'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCloseModal}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Order Summary Box */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span>Paket Dokumen:</span>
              <span className="font-bold text-slate-800">{totalFiles}</span>
            </div>
            <div className="text-sm font-extrabold text-slate-900">{docTitle}</div>
            <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
              <span>Atas Nama:</span>
              <span className="font-semibold text-blue-700">{candidateName}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
              <span className="font-bold text-slate-700">Total Biaya:</span>
              <span className="text-lg font-black text-emerald-700">{priceFormatted}</span>
            </div>
          </div>

          {!isSubmitted ? (
            /* STATE 1: SEBELUM SUBMIT */
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs text-blue-950 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-blue-900">
                  <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Proses Pemesanan CV:</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-[11.5px] text-blue-900">
                  <li>Klik tombol <strong>Submit Pemesanan CV</strong> di bawah ini.</li>
                  <li>Berkas pesanan Anda akan otomatis disimpan & diarsipkan ke sistem admin.</li>
                  <li>Lanjutkan konfirmasi ke WhatsApp Admin untuk penyelesaian pembayaran dan penerimaan berkas PDF resmi Anda.</li>
                </ol>
              </div>

              {/* Tombol Submit Pemesanan CV */}
              <div className="space-y-1.5 pt-1">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleSubmitOrder}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-800 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{progressMsg || 'Memproses & Menyimpan Pesanan...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Pemesanan CV ({totalFiles})</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-slate-500">
                  *Klik tombol di atas untuk mengirimkan pesanan Anda ke sistem admin.
                </p>
              </div>
            </div>
          ) : (
            /* STATE 2: SETELAH SUBMIT - ARAHKAN KE WHATSAPP UNTUK PEMBAYARAN */
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-xs text-emerald-950 space-y-2 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-1">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-sm text-emerald-900">
                  Pesanan Berhasil Disimpan ke Sistem Admin!
                </h3>
                <p className="text-[11.5px] leading-relaxed text-emerald-800">
                  Berkas pesanan CV atas nama <strong>{candidateName}</strong> telah diterima. Untuk menyelesaikan pembayaran dan menerima berkas PDF resmi beresolusi tinggi, silakan klik tombol di bawah untuk konfirmasi ke WhatsApp Admin.
                </p>
              </div>

              {/* Tombol Konfirmasi Pemesanan via WhatsApp Admin */}
              <div className="space-y-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                  <span>Kirim Konfirmasi Pemesanan ke WhatsApp</span>
                </a>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Admin WhatsApp:</span>
                    <strong className="text-slate-800 font-mono">0812-2825-1605</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Biaya:</span>
                    <strong className="text-emerald-700 font-bold">{priceFormatted}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            type="button"
            onClick={handleCloseModal}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
