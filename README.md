# 📄 CV Generator Pro (ATS & Creative Dual Export)

Aplikasi web modern berbasis **React, TypeScript, Tailwind CSS, Express, dan Gemini AI** untuk membuat CV profesional dwibahasa (Bahasa Indonesia & English) dengan sistem pemesanan online, pratinjau interaktif proporsi presisi 1 lembar A4, serta output otomatis 2 berkas (CV Standar ATS & CV Creative) atau 3 berkas (+ Surat Lamaran Kerja).

---

## 🚀 Fitur Utama

1. **Dual / Triple Export Dokumen:**
   - **Tipe 1: CV Standar ATS** – Format teks bersih, ramah mesin pemindai ATS HRD perusahaan multinasional / BUMN / korporat.
   - **Tipe 2: CV Creative (1 Halaman A4 Presisi)**:
     - *Model 1:* Desain Sidebar Klasik Modern.
     - *Model 2:* Desain Header Banner Kontemporer.
   - **Tipe 3: Surat Lamaran Kerja Resmi (Cover Letter)** – Otomatis diselaraskan dengan warna palet terpilih.
2. **AI Polish Engine (Gemini 2.5 / 3.x Flash + Deterministic Polisher):**
   - Memoles data mentah atau minim menjadi kalimat profesional secara instan.
   - Pilihan Gaya Bahasa AI:
     - **Staf / Pelaksana / Lapangan:** Bersahaja, jujur, sopan, disiplin, berdedikasi tinggi (cocok untuk kasir, pramuniaga, driver, kurir, staf toko, admin, fresh graduate).
     - **Supervisor / Manager / Eksekutif:** Strategis, kepemimpinan tim, efisiensi operasional, pencapaian target KPI.
3. **10 Palet Warna Profesional Terkurasi:**
   - 10 kombinasi warna kontras tinggi yang telah disesuaikan agar tidak pecah saat cetak atau diekspor ke PDF.
4. **Format Otomatis Sesuai Standar CV:**
   - Nama Lengkap (`fullName`) dan Profesi Target (`headline`) otomatis diformat **UPPERCASE (HURUF BESAR)**.
   - Riwayat pekerjaan dan pendidikan diformat rapi tanpa salah jurusan.
   - Kolom Bahasa hanya muncul jika pengguna memasukkan data bahasa sendiri (tanpa bahasa fiktif bawaan).
5. **Sistem Alur Pemesanan & Pembayaran Aman (Anti-Download Gratis):**
   - Saat pengguna mengklik **"Submit Pemesanan CV"**, berkas PDF diarsip dan diunggah ke sistem admin.
   - Berkas **tidak terunduh otomatis ke HP pelanggan** sebelum pembayaran dikonfirmasi, sehingga admin dapat mengamankan penerimaan pembayaran (Rp 10.000 / Rp 15.000).
   - Pengguna langsung diarahkan ke tombol **Konfirmasi Pemesanan via WhatsApp Admin** dengan format pesan otomatis yang bersih dan rapi.
6. **Panel Database Pemesanan untuk Admin:**
   - Tersedia tombol **"Database Pemesanan"** di bagian atas untuk memantau pesanan masuk secara real-time.
   - Admin dapat mengunduh berkas PDF ATS, Creative, dan Lamaran secara langsung dari tabel data untuk dikirimkan kepada pelanggan via WhatsApp setelah pembayaran diterima.
   - Dilengkapi tautan langsung ke folder penyimpanan **Google Drive Resmi Admin**.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React Icons
- **Backend / API:** Node.js, Express, tsx
- **AI Engine:** `@google/genai` (Google Gemini API)
- **PDF Generation:** `jspdf`, `html2canvas-pro`

---

## 📦 Panduan Instalasi Lokal

### 1. Prasyarat
- **Node.js** versi 18.0.0 atau lebih baru
- **npm**, **yarn**, atau **bun**

### 2. Clone Repositori
```bash
git clone https://github.com/USERNAME_ANDA/cv-generator-pro.git
cd cv-generator-pro
```

### 3. Pasang Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment Variable
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi nilai di dalam `.env`:
```env
# Kunci API Gemini (Dapatkan gratis di https://aistudio.google.com/)
GEMINI_API_KEY="AIzaSy..."

# Port server (opsional, default 3000)
PORT=3000
```

### 5. Jalankan Aplikasi (Mode Pengembangan)
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

### 6. Build untuk Produksi
```bash
npm run build
npm start
```

---

## ⚙️ Kustomisasi Nomor WhatsApp & Google Drive Admin

Untuk mengubah kontak WhatsApp admin dan tautan folder Google Drive:

1. **Nomor WhatsApp Admin:**
   - Buka `src/components/PaymentWaModal.tsx` dan `src/App.tsx`.
   - Ubah `6281228251605` / `0812-2825-1605` ke nomor WhatsApp admin Anda.

2. **Folder Google Drive:**
   - Buka `src/components/PaymentWaModal.tsx`, `src/components/AdminLeadsModal.tsx`, dan `src/App.tsx`.
   - Ubah `https://drive.google.com/drive/folders/14Ckuu7Z72kmMpx_lU3MRdhhiPqy4UNzr` ke URL folder Google Drive Anda.

---

## 📁 Struktur Direktori

```
cv-generator-pro/
├── data/                       # Penyimpanan lokal database pesanan & berkas PDF
│   ├── submissions.json        # Database catatan pemesanan
│   └── orders_pdf/             # Arsip berkas PDF pesanan kandidat
├── public/                     # Aset statis & foto profil default
├── src/
│   ├── components/             # Komponen UI React
│   │   ├── AtsResume.tsx       # Template CV Standar ATS (A4)
│   │   ├── Creative1Resume.tsx # Template CV Creative Model 1 (Sidebar)
│   │   ├── Creative2Resume.tsx # Template CV Creative Model 2 (Banner)
│   │   ├── CoverLetterResume.tsx # Template Surat Lamaran Kerja
│   │   ├── ResumeForm.tsx      # Formulir Input Data CV & Bahasa
│   │   ├── PaymentWaModal.tsx  # Modal Submit Pemesanan & Alur WhatsApp
│   │   ├── AdminLeadsModal.tsx # Panel Database Pemesanan & Unduh PDF
│   │   ├── OfficeColorPicker.tsx # Pemilih 10 Palet Warna Profesional
│   │   └── TemplateThumbnails.tsx # Pratinjau Model Template
│   ├── constants/              # Palet warna, terjemahan, dan data awal
│   ├── server/                 # Logika database lokal & deterministic polish engine
│   ├── types/                  # Definisi TypeScript data CV
│   ├── utils/                  # Utilitas ekspor PDF (jsPDF + html2canvas-pro)
│   ├── App.tsx                 # Halaman utama aplikasi
│   ├── index.css               # Styling Tailwind CSS
│   └── main.tsx                # Entry point React
├── index.html                  # Dokumen HTML dengan tag SEO & OpenGraph
├── package.json                # Konfigurasi dependensi & script npm
├── server.ts                   # Server backend Express & API proxy Gemini
├── tsconfig.json               # Konfigurasi compiler TypeScript
└── vite.config.ts              # Konfigurasi bundler Vite
```

---

## 📄 Lisensi
Hak Cipta © 2026 CV Generator Pro.
Dibuat untuk kebutuhan operasional layanan pembuatan CV profesional.
