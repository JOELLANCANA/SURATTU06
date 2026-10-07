# Sistem Persuratan & Digitalisasi Arsip UIN Ar-Raniry Banda Aceh

**Versi:** 2.0 — September 2026  
**Lokasi:** Kampus Birobi'il 'Ilmi, Darussalam, Banda Aceh

---

## 🎨 Logo & Branding

Logo UIN Ar-Raniry telah terintegrasi di seluruh aplikasi:
- **Topbar**: Logo ditampilkan di header setiap halaman (40x40px)
- **Print Receipt**: Logo di kop surat tanda terima resmi (70x70px)
- **About Page**: Logo besar di halaman Tentang Aplikasi (80x80px)
- **Favicon**: Icon otomatis di tab browser (16x16 - 512x512px)

Desain logo mencerminkan identitas UIN Ar-Raniry dengan warna hijau (primary), emas (accent), dan simbol Kaaba.

**Dokumentasi lengkap:** Lihat file `LOGO-INTEGRATION.md`

---

## 📋 Tentang Sistem

Sistem Persuratan & Digitalisasi Arsip adalah aplikasi web modern untuk mengelola, mengarsipkan, dan mendistribusikan surat masuk/keluar serta mencetak bukti tanda terima resmi dua sisi dengan kode QR verifikasi digital.

**Fitur Utama:**
- ✅ Dashboard Administrator dengan Analitik Real-time
- ✅ Manajemen Arsip Surat (500+ data per bulan)
- ✅ Pencarian & Filter Multi-Kriteria (tanggal, pengirim, perihal, status)
- ✅ Input Surat Masuk & Keluar
- ✅ Distribusi & Disposisi Surat ke Unit Kerja
- ✅ Cetak Tanda Terima 2 Sisi dengan QR Code
- ✅ Laporan & Rekapitulasi Statistik
- ✅ Export Data ke CSV
- ✅ Arsip Publik untuk Verifikasi & Transparansi
- ✅ Pengaturan Admin (Branding, Master Dropdown)

---

## 🚀 Cara Membuka

1. **Buka file HTML di Browser:**
   - Buka file `index.html` dengan browser modern (Chrome, Firefox, Edge, Safari)
   - Atau: Double-click `index.html` di File Explorer

2. **Tidak perlu instalasi atau server:**
   - Aplikasi ini adalah **Single-Page Application (SPA)** berbasis HTML5 + JavaScript
   - Semua data disimpan di memori lokal browser
   - Tidak memerlukan koneksi internet setelah loading

3. **Mode Responsif:**
   - Desktop: Sidebar penuh + tabel berkolom banyak
   - Tablet/Mobile: Sidebar collapsible, tabel responsive

---

## 📚 Fitur & Cara Penggunaan

### 1. **Dashboard Administrator**
Halaman utama dengan:
- **Stat Cards:** Total surat, belum/sudah didistribusi, tren bulan ini
- **Chart Analytics:**
  - Donut chart status distribusi
  - Bar chart pengirim terbanyak
  - Bar chart kategori perihal
  - Tren penerimaan per bulan
- **Top 10 Surat Belum Didistribusi** dengan tombol distribusi cepat

### 2. **Arsip Surat**
Kelola semua data surat dengan fitur:
- **Pencarian:** Cari nomor surat, pengirim, perihal secara real-time
- **Filter Lanjutan:**
  - Filter per Bulan (Juli, Agustus, September 2026)
  - Filter Status (Belum/Sudah Didistribusi)
  - Filter Pengirim (dropdown otomatis dari data)
- **Sorting:** Klik header tabel untuk sort ascending/descending
- **Pagination:** 25/50/100 per halaman atau lihat semua
- **Tabel Interaktif:**
  - Lihat Detail: Klik icon 👁️
  - Cetak Tanda Terima: Klik icon 🖨️
  - Status badge dengan warna berbeda
- **Export:** Download data tersaring sebagai CSV

### 3. **Input Surat Masuk**
Form untuk menambah surat baru:
- **Field Wajib:** Nomor Surat, Tanggal Surat, Pengirim, Perihal
- **Field Opsional:** Nomor Agenda, Ditujukan Kepada, Disposisi, Keterangan
- **Dropdown Master:** Pengirim, Ditujukan Kepada (otomatis dari data)
- **Klasifikasi:** Biasa, Penting, Rahasia
- **Sifat:** Biasa, Segera, Sangat Segera
- **Upload File:** Pilih dokumen PDF/DOC/JPG (max 10MB)
- **Auto-Fields:** Tanggal Terima otomatis hari ini, Status otomatis "belum didistribusi"

### 4. **Input Surat Keluar**
Form untuk registrasi surat keluar:
- **Field Wajib:** Nomor Surat, Tanggal Surat, Tujuan, Perihal
- **Penandatangan:** Rektor, Kepala Biro AUPK, Dekan Fakultas
- **Upload File:** Dokumen surat keluar
- **Tindakan:** Simpan & auto-redirect ke dashboard

### 5. **Distribusi Surat**
Manajemen alur disposisi ke unit kerja:
- **Tabel Surat Belum Didistribusi** dengan filter real-time
- **Distribusikan Ke:** Pilih unit penerima (dropdown: KEPEGAWAIAN, AKADEMIK, KEMAHASISWAAN, KASUBBAG BMN, dll)
- **Tanggal Distribusi:** Auto-isi hari ini atau pilih manual
- **Bulk Action:** Distribusi per baris dengan tombol ✅
- **Update Real-time:** Status langsung berubah ke "sudah didistribusi"

### 6. **Laporan & Rekap**
5 Tab laporan statistik:

**a) Ringkasan:**
- Total surat masuk & tren
- Persentase distribusi
- Analisis per bulan

**b) Per Pengirim:**
- Daftar pengirim dengan jumlah surat
- Surat sudah/belum didistribusi
- Persentase distribusi per pengirim

**c) Per Kategori Perihal:**
- Top 10 kategori perihal
- Jumlah dan persentase
- Trend issues/requests

**d) Per Unit Penerima:**
- Unit kerja mana yang paling banyak menerima surat
- Jumlah & persentase

**e) Timeline:**
- Tren penerimaan per hari
- Bar chart tren 20 hari terakhir

**Aksi:** Cetak laporan (Ctrl+P) atau export ke CSV

### 7. **Arsip Publik**
Halaman akses publik dengan:
- **Hero Section:** Statistik total surat, sudah didistribusi, jumlah bulan data
- **Tabel Surat:** Tampilkan semua surat (atau filter status saja)
- **Pencarian:** Cari nomor, pengirim, perihal
- **Filter Tipe:** Semua surat, sudah didistribusi, belum didistribusi
- **Pagination:** 50 per halaman
- **Cetak Tanda Terima:** Akses publik ke bukti tanda terima (QR code verification)

### 8. **Tanda Terima (Cetak)**
Modal untuk cetak 2 salinan A4:
- **Kop Surat:** Logo UIN, nama institusi, alamat
- **Judul:** Bukti Tanda Terima Berkas Surat
- **Kode Referensi:** UIN/TT/2026/XXXX (unique per surat)
- **Detail Surat:** Nomor, Tanggal, Pengirim, Ditujukan, Perihal
- **QR Code Area:** Kode referensi untuk verifikasi digital
- **Tanda Tangan:** Area untuk paraf petugas penerima
- **2 Lembar:** Lembar 1 (Arsip TU), Lembar 2 (Untuk Pengirim)
- **Format:** Siap print A4 landscape/portrait

### 9. **Panel Admin**
Pengaturan & konfigurasi:

**a) Tampilan Header & Footer:**
- Edit judul, sub-judul, teks footer
- Ubah branding website

**b) Master Dropdown:**
- Edit list Pengirim (pisah koma)
- Edit list Ditujukan Kepada
- Edit list Tujuan (Surat Keluar)
- Edit list Penandatangan
- Changes otomatis ke form & filter

**c) Manajemen Data:**
- Tombol **Bersihkan Semua Data Lokal** (hapus semua surat & reset)
- Konfirmasi sebelum menghapus

### 10. **Tentang Aplikasi**
Halaman informasi dengan:
- Versi & tanggal rilis
- Feature highlights (Bukti Terima 2 Sisi, QR Code, Dashboard, Export CSV)
- Kontak & alamat UIN Ar-Raniry

---

## 🎨 Desain & Responsif

### Warna Tema:
- **Primary Green:** #1a6b3c (Brand UIN Ar-Raniry)
- **Accent Gold:** #c8a94a (Aksen premium)
- **Success:** #16a34a (Status sudah)
- **Warning:** #d97706 (Status belum)
- **Info/Primary:** #2563eb

### Layout:
- **Desktop (768px+):** Sidebar 260px fixed + main content full
- **Mobile (<768px):** Sidebar overlay toggle + hamburger menu
- **Responsive Tables:** Auto-horizontal scroll di mobile
- **Touch-friendly:** Buttons & inputs besar untuk mobile

---

## 💾 Data & Penyimpanan

### Format Data Internal:
```javascript
{
  idx: number,           // Index urutan
  no: string,            // ID unik surat
  agenda: string,        // No. Agenda
  nomor: string,         // Nomor Surat
  tgl_surat: date,       // Tanggal Surat
  tgl_terima: date,      // Tanggal Terima
  pengirim: string,      // Pengirim/Asal
  tujuan: string,        // Ditujukan Kepada
  perihal: string,       // Isi/Ringkasan Perihal
  klasifikasi: enum,     // biasa|penting|rahasia
  sifat: enum,           // biasa|segera|sangat segera
  disposisi: string,     // Catatan disposisi
  status: enum,          // belum didistribusi|sudah didistribusi
  distribusi_ke: string, // Unit penerima
  unit_penerima: string, // Unit kerja final
  tgl_dist: date,        // Tanggal distribusi
  arsip: enum,           // aktif|inaktif
  keterangan: string     // Keterangan tambahan
}
```

### Penyimpanan:
- **Lokal Memory:** Data disimpan di JavaScript array `allData[]`
- **Session Persistent:** Data bertahan selama tab browser terbuka
- **Refresh:** Data tetap ada (tidak perlu reload manual)
- **Export:** Bisa di-export ke CSV anytime
- **Clear:** Tombol "Bersihkan Semua" untuk reset

---

## 📊 Data Sampel

### Pengumuman Publik

Menu `Pengumuman` pada admin menyimpan judul dan isi pengumuman ke sheet `Pengumuman` di Spreadsheet utama. Pengumuman berstatus `published` tampil sebagai popup animasi di beranda publik, sedangkan admin dapat mengedit, mengarsipkan, atau menghapusnya. Jalankan `setup()` sekali setelah deployment untuk membuat sheet beserta kolomnya.

File ini sudah berisi **100 surat sampel** dari data UIN Ar-Raniry Agustus-September 2026:
- **Tanggal Penerimaan:** 1-11 September 2026
- **Pengirim Dominan:** Fakultas-fakultas, LP2M, Kemahasiswaan, Pusat-pusat
- **Perihal Dominan:** Permohonan keringanan UKT, rekomendasi haji, perbaikan sarana, pindah kuliah
- **Status Distribusi:** ~60% belum, ~40% sudah
- **Klasifikasi & Sifat:** Semua "biasa" (data umum non-rahasia)

### Tambah Data Lebih Banyak:
1. Buka **Input Surat Masuk** (sidebar menu)
2. Isi form dan **Simpan Surat Masuk**
3. Data langsung muncul di Arsip & Dashboard

---

## 🖨️ Cetak & Export

### Cetak Tanda Terima (2 Sisi):
1. Klik surat → icon 🖨️ (atau Lihat Detail → Cetak TT)
2. Modal terbuka dengan preview 2 lembar
3. Klik **Cetak Tanda Terima (2 Sisi)**
4. Browser print dialog muncul
5. Pilih printer & cetak (A4 recommended)
6. Gunting/lipat di tengah untuk 2 salinan

### Export CSV:
1. Arsip Surat → **Export CSV** (top bar)
2. File otomatis download: `arsip-surat-YYYY-MM-DD.csv`
3. Buka di Excel/Google Sheets
4. Include header: Agenda, Nomor, Tanggal, Pengirim, Perihal, Status, dll

### Export Laporan:
1. Laporan & Rekap → pilih Tab → **Cetak Laporan**
2. Browser print dialog
3. Pilih "Save as PDF" atau printer fisik

---

## ⌨️ Shortcut & Tips

| Aksi | Cara |
|------|------|
| **Pencarian Cepat** | Ketik di field search (real-time) |
| **Sort Tabel** | Klik header kolom tabel |
| **Filter Multi** | Pilih multiple filter sekaligus |
| **Cetak** | Ctrl+P atau tombol 🖨️ |
| **Export CSV** | Top bar button atau Tab Laporan |
| **Distribusi Cepat** | Dashboard pending → tombol 📤 |
| **Lihat Detail** | Tabel → icon 👁️ |
| **Reset Filter** | Tombol ✕ Reset di filter bar |
| **Toggle Sidebar** | Hamburger icon (☰) di top bar |

---

## 🔒 Keamanan & Privasi

- **Lokal Processing:** Semua data diproses di client (browser) lokal
- **No Server Upload:** Data tidak dikirim ke server manapun
- **QR Code:** Hanya reference code, bukan kode enkripsi
- **Admin Protected:** Mode Admin bisa diswitch (tapi tanpa password - untuk demo)
- **Clear Data:** Tombol hapus data tersedia di Admin Panel

---

## 🐛 Troubleshooting

| Masalah | Solusi |
|--------|---------|
| **Data tidak muncul** | Refresh browser (F5) atau buka ulang index.html |
| **Tabel kosong saat filter** | Klik **Reset** di filter bar, pastikan data sudah ada |
| **Cetak TT tidak rapi** | Gunakan browser Chrome/Edge, zoom 100%, landscape A4 |
| **Sidebar tidak muncul mobile** | Klik hamburger ☰ di top bar |
| **Export CSV blank** | Pastikan ada data (cek Arsip page) |
| **Dropdown tidak update** | Admin Panel → Simpan Master Dropdown ulang |

---

## 📝 Catatan Teknis

- **Framework:** HTML5 + CSS3 + Vanilla JavaScript (no dependencies)
- **Compatibility:** Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- **File Size:** ~107 KB HTML (gzip ~25 KB)
- **Performance:** <100ms load, instant search/filter
- **Memory:** ~2-5 MB untuk 500 surat
- **Offline Ready:** Bekerja 100% offline setelah loading pertama

---

## 🔧 Backend Integration: Supabase

Aplikasi sekarang terintegrasi dengan **Supabase** untuk cloud storage & real-time sync!

### Konfigurasi Supabase

**Project Details:**
```
URL:              https://tzvdenjiyxxzwciwxbor.supabase.co
Anon Key:         eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role:     sb_secret_WI8EAzmD4a4U1y83A0gpxw_iQIlAF97
Publishable Key:  sb_publishable_Mad5PbMQYl3bOEY3n7vpug_Ppi_88Nz
```

### Database Tables

**1. surat** - Master data surat masuk/keluar
- 20 columns dengan indexes untuk fast queries
- RLS enabled untuk read access publik

**2. master_pengirim** - Daftar institusi/pengirim
- Default 9 entries
- Unique constraint pada nama

**3. master_tujuan** - Daftar unit tujuan
- Default 14 entries
- Unique constraint pada nama

**4. settings** - Customization admin
- Header, Hero, Footer configuration
- Persisten di cloud

### Setup Supabase (5 Menit)

**Ikuti: SUPABASE-QUICKSTART.md**

1. Copy SQL dari file
2. Paste ke Supabase SQL Editor
3. Run untuk create tables
4. Test di browser console

### Features

✅ **Real-time Sync** - Data otomatis sync antar browser/device  
✅ **Cloud Storage** - Unlimited data di cloud Supabase  
✅ **Multi-user** - Collaboration ready  
✅ **Auto Backup** - Built-in backup di Supabase  
✅ **Offline** - Tetap bekerja jika offline (will sync later)

### Migration dari localStorage

Semua data lama di localStorage bisa dimigrasikan ke Supabase:

```javascript
// Jalankan di browser console setelah setup Supabase:
const localPengirim = JSON.parse(localStorage.getItem('master-pengirim') || '[]');
for (const p of localPengirim) {
  await window.supabaseConfig.addPengirimSupabase(p);
}
// Refresh halaman untuk load dari Supabase
```

### Documentation

- **SUPABASE-SETUP.md** - Full documentation dengan SQL schema
- **SUPABASE-QUICKSTART.md** - 5-minute quick start guide
- **supabase-config.js** - JavaScript helper functions

---

**Universitas Islam Negeri Ar-Raniry Banda Aceh**
- Kampus: Birobi'il 'Ilmi, Darussalam
- Alamat: Jl. Lingkar Kampus, Darussalam, Banda Aceh
- Kode Pos: 23111

**Tim Tata Usaha (TU)**
- Divisi Persuratan & Arsip
- Email/Telepon: [Hubungi TU UIN Ar-Raniry]

---

**Dokumen Versi 2.0 — September 2026**  
*Sistem Persuratan & Digitalisasi Arsip UIN Ar-Raniry Banda Aceh*
