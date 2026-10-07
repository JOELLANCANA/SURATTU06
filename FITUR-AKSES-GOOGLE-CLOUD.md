# Fitur Akses Google Cloud - Si-Surat v2.1

## 📋 Ringkasan

Fitur baru memungkinkan admin untuk mengakses langsung Google Spreadsheet dan Google Drive dari halaman **Surat Masuk** dan **Surat Keluar**. Tombol akan muncul otomatis di samping tombol "Catat surat baru".

## 🔐 Kredensial Admin

```
Username: admin
Password: 1122
```

## 📍 Lokasi Fitur

### ✅ Tombol Muncul Di:
- **↓ Surat masuk** - Halaman input surat masuk
- **↑ Surat keluar** - Halaman input surat keluar

### ✗ Tombol Tidak Muncul Di:
- ⌂ Beranda utama
- ▤ Semua surat
- ▦ Arsip surat
- ▥ Laporan & rekap
- → Distribusi surat
- 📢 Pengumuman
- ⚙ Pengaturan sistem

## 🎯 Cara Menggunakan

### 1. Buka Halaman Surat Masuk
```
1. Login dengan username: admin, password: 1122
2. Klik menu sidebar: "↓ Surat masuk"
3. Perhatikan 2 tombol baru di sebelah "Catat surat baru":
   - 📊 Buka Sheet
   - 📁 Buka Drive
```

### 2. Buka Halaman Surat Keluar
```
1. Klik menu sidebar: "↑ Surat keluar"
2. 2 tombol akses Google muncul otomatis
```

### 3. Klik Tombol
- **"📊 Buka Sheet"** → Buka Google Spreadsheet (tab baru)
- **"📁 Buka Drive"** → Buka Google Drive folder (tab baru)

## 📊 Resources Google

| Nama | ID | Fungsi |
|------|--|----|
| **Spreadsheet Utama** | `1YS7HVGEaWb6nj-VahxOwoTFy1kIll_7UoqbxM8x4sdU` | Edit data surat, master list, pengumuman |
| **Google Drive Folder** | `1H8_QF4GGc8C6-E9OEg-gKXHf3MFPAhRJ` | Kelola lampiran & dokumen surat |

## 💡 Workflow Praktis

### Mengedit Data Surat Massal
```
1. Klik "↓ Surat masuk"
2. Klik "📊 Buka Sheet"
3. Edit data di Google Sheets (tab baru terbuka)
4. Kembali ke Si-Surat
5. Tekan F5 untuk refresh
6. Data otomatis ter-sinkronisasi
```

### Backup Lampiran Dokumen
```
1. Klik "↓ Surat masuk" atau "↑ Surat keluar"
2. Klik "📁 Buka Drive"
3. Klik kanan dokumen → Download
4. Simpan ke folder lokal
```

### Upload Dokumen Tambahan
```
1. Klik "↓ Surat masuk"
2. Klik "📁 Buka Drive"
3. Klik "+ New" → "File upload"
4. Pilih dokumen dari komputer
5. File siap digunakan
```

## 🔧 Implementasi Teknis

### File: `index.html`

#### 1. HTML (Baris ~465)
```html
<div style="display: flex; gap: 10px; align-items: center;" id="pageActions">
  <button class="primary-btn" id="openModal">＋ &nbsp;Catat surat baru</button>
  <button class="outline-btn" id="openSpreadsheetBtn" style="display: none;">📊 Buka Sheet</button>
  <button class="outline-btn" id="openDriveBtn" style="display: none;">📁 Buka Drive</button>
</div>
```

#### 2. JavaScript Event Listeners (Baris ~612-615)
```javascript
document.getElementById('openSpreadsheetBtn').addEventListener('click', () => {
  const spreadsheetId = '1YS7HVGEaWb6nj-VahxOwoTFy1kIll_7UoqbxM8x4sdU';
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
  window.open(url, '_blank');
});

document.getElementById('openDriveBtn').addEventListener('click', () => {
  const driveFolder = '1H8_QF4GGc8C6-E9OEg-gKXHf3MFPAhRJ';
  const url = `https://drive.google.com/drive/folders/${driveFolder}`;
  window.open(url, '_blank');
});
```

#### 3. Visibility Logic (Baris ~627-628)
```javascript
// Tampilkan saat view = incoming atau outgoing
document.querySelectorAll('.nav-item[data-view="incoming"], .nav-item[data-view="outgoing"]')
  .forEach(item => item.addEventListener('click', () => {
    document.getElementById('openSpreadsheetBtn').style.display = 'block';
    document.getElementById('openDriveBtn').style.display = 'block';
  }));

// Sembunyikan untuk view lain
document.querySelectorAll('.nav-item[data-view]')
  .forEach(item => item.addEventListener('click', () => {
    const view = item.dataset.view;
    if (view !== 'incoming' && view !== 'outgoing') {
      document.getElementById('openSpreadsheetBtn').style.display = 'none';
      document.getElementById('openDriveBtn').style.display = 'none';
    }
  }));
```

## ✨ Fitur

✅ **Visibility Dinamis** - Tombol otomatis muncul/tersembunyi  
✅ **One-Click Access** - Akses langsung ke Google Apps  
✅ **New Tab** - Tidak mengganggu aplikasi (buka di tab baru)  
✅ **Mobile Responsive** - Bekerja di semua ukuran layar  
✅ **Admin Friendly** - Password mudah diingat (1122)  
✅ **Integrated** - Menggunakan ID dari Code.gs  

## 📋 Checklist Penggunaan

- [ ] Sudah login dengan username: `admin`, password: `1122`
- [ ] Halaman "Surat masuk" menampilkan 2 tombol baru
- [ ] Halaman "Surat keluar" menampilkan 2 tombol baru
- [ ] Klik "📊 Buka Sheet" membuka Google Spreadsheet
- [ ] Klik "📁 Buka Drive" membuka Google Drive
- [ ] Tombol tidak muncul di halaman lain (Beranda, Arsip, dll)
- [ ] Perubahan di spreadsheet ter-sinkronisasi setelah F5

## ⚠️ Catatan Penting

1. **Sinkronisasi Manual** - Refresh halaman (F5) untuk melihat perubahan dari spreadsheet
2. **Tunggu 5 Detik** - Beri waktu untuk sinkronisasi setelah edit
3. **Backup Berkala** - Spreadsheet sudah terintegrasi Google Drive untuk backup otomatis
4. **Sharing Permissions** - Follow Google Drive sharing rules yang sudah ada

## 🐛 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Tombol tidak muncul | Pastikan di halaman "Surat masuk" atau "Surat keluar" |
| Google tidak buka | Periksa akun Google yang login |
| Data tidak update | Refresh halaman (F5) dan tunggu 5 detik |
| Tombol tersembunyi | Pindah ke halaman lain → kembali ke Surat masuk/keluar |

## 📞 Support

Untuk pertanyaan atau masalah:
1. Cek halaman ini untuk troubleshooting
2. Verifikasi username & password
3. Pastikan koneksi internet stabil
4. Refresh browser (Ctrl+F5 untuk hard refresh)

---

**Versi:** 2.1  
**Dibuat:** 7 Oktober 2026  
**Untuk:** UIN Ar-Raniry Banda Aceh  
**Sistem:** Si-Surat - Manajemen Surat Menyurat