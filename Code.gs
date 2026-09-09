const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const SHEET_NAME = 'DataSurat';
const SETTINGS_SHEET = 'Settings';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('AR-RANIRY - Persuratan UIN Ar-Raniry Banda Aceh');
}

function doPost(e) {
  try {
    const payload = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    const action = payload.action || e.parameter.action;

    switch (action) {
      case 'loginAdmin':
        return ContentService.createTextOutput(JSON.stringify({
          ok: loginAdmin(payload.username, payload.password),
          message: loginAdmin(payload.username, payload.password) ? 'Login berhasil' : 'Username atau password salah'
        })).setMimeType(ContentService.MimeType.JSON);

      case 'saveSurat':
        return ContentService.createTextOutput(JSON.stringify(saveSurat(payload.data))).setMimeType(ContentService.MimeType.JSON);

      case 'deleteSurat':
        return ContentService.createTextOutput(JSON.stringify(deleteSurat(payload.id))).setMimeType(ContentService.MimeType.JSON);

      case 'purgeDummyData':
        return ContentService.createTextOutput(JSON.stringify(purgeDummyData())).setMimeType(ContentService.MimeType.JSON);

      case 'getAllDocuments':
        return ContentService.createTextOutput(JSON.stringify(getAllDocuments())).setMimeType(ContentService.MimeType.JSON);

      case 'getSettings':
        return ContentService.createTextOutput(JSON.stringify(getSettings())).setMimeType(ContentService.MimeType.JSON);

      case 'saveSettings':
        return ContentService.createTextOutput(JSON.stringify(saveSettings(payload.settings))).setMimeType(ContentService.MimeType.JSON);

      default:
        return ContentService.createTextOutput(JSON.stringify({ ok: false, message: 'Aksi tidak dikenal' })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      message: 'Error: ' + err.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss) return ss;
  return SpreadsheetApp.create('AR-RANIRY Persuratan');
}

function getDataSheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'id',
      'tipe',
      'agenda',
      'noSurat',
      'tglSurat',
      'pengirim',
      'perihal',
      'klasifikasi',
      'fileUrl',
      'createdAt'
    ]);
  }

  return { ss, sheet };
}

function getSettingsSheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SETTINGS_SHEET);

  if (!sheet) {
    sheet = ss.insertSheet(SETTINGS_SHEET);
    sheet.appendRow(['key', 'value']);
    sheet.appendRow(['headerTitle', 'AR-RANIRY']);
    sheet.appendRow(['headerSubtitle', 'UIN Ar-Raniry Banda Aceh']);
    sheet.appendRow(['heroBadge', 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ']);
    sheet.appendRow(['heroTitlePrimary', 'Sistem Informasi Persuratan']);
    sheet.appendRow(['heroTitleHighlight', 'UIN Ar-Raniry Banda Aceh']);
    sheet.appendRow(['heroSubtitle', 'Portal resmi tata kelola arsip persuratan digital, pencarian dokumen, dan penerbitan bukti tanda terima terverifikasi.']);
    sheet.appendRow(['heroBackground', '']);
    sheet.appendRow(['masterPengirim', 'Fakultas Tarbiyah, Fakultas Syariah, Rektorat, PDDikti']);
  }

  return sheet;
}

function ensureDefaultData() {
  const { sheet } = getDataSheet();
  const rows = sheet.getDataRange().getValues();

  if (rows.length > 1) return;

  const defaultData = [
    ['1', 'Masuk', '1764', 'B-2031/UN.08/TU.FDK/KS.01.3/09/2026', '2026-09-08', 'FAKULTAS DAKWAH DAN KOMUNIKASI', 'MOHON PERBAIKAN DAN PERAWATAN ALAT KANTOR', 'Biasa', '#', new Date().toISOString()],
    ['2', 'Masuk', '1762', '2574/UN.08/FAH-TU/KS.01.7/09/2026', '2026-09-07', 'FAKULTAS ADAB DAN HUMANIORA', 'PEMELIHARAAN BARANG ELEKTRONIK', 'Biasa', '#', new Date().toISOString()],
    ['3', 'Keluar', '001', 'B-101/UN.08/R/2026', '2026-09-02', 'WAKIL REKTOR III', 'Surat Rekomendasi Beasiswa', 'Biasa', '#', new Date().toISOString()]
  ];

  sheet.getRange(2, 1, defaultData.length, defaultData[0].length).setValues(defaultData);
}

function getAllDocuments() {
  ensureDefaultData();
  const { sheet } = getDataSheet();
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) return [];

  const headers = values[0];
  return values.slice(1)
    .filter(row => row.some(cell => cell !== ''))
    .map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
}

function getSettings() {
  const sheet = getSettingsSheet();
  const values = sheet.getDataRange().getValues();
  const result = {};

  values.slice(1).forEach(([key, value]) => {
    if (key) result[key] = value;
  });

  return {
    headerTitle: result.headerTitle || 'AR-RANIRY',
    headerSubtitle: result.headerSubtitle || 'UIN Ar-Raniry Banda Aceh',
    heroBadge: result.heroBadge || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    heroTitlePrimary: result.heroTitlePrimary || 'Sistem Informasi Persuratan',
    heroTitleHighlight: result.heroTitleHighlight || 'UIN Ar-Raniry Banda Aceh',
    heroSubtitle: result.heroSubtitle || 'Portal resmi tata kelola arsip persuratan digital, pencarian dokumen, dan penerbitan bukti tanda terima terverifikasi.',
    heroBackground: result.heroBackground || '',
    masterPengirim: result.masterPengirim || 'Fakultas Tarbiyah, Fakultas Syariah, Rektorat, PDDikti'
  };
}

function saveSettings(settings) {
  const sheet = getSettingsSheet();
  const payload = settings || {};

  const map = {
    headerTitle: payload.headerTitle || 'AR-RANIRY',
    headerSubtitle: payload.headerSubtitle || 'UIN Ar-Raniry Banda Aceh',
    heroBadge: payload.heroBadge || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    heroTitlePrimary: payload.heroTitlePrimary || 'Sistem Informasi Persuratan',
    heroTitleHighlight: payload.heroTitleHighlight || 'UIN Ar-Raniry Banda Aceh',
    heroSubtitle: payload.heroSubtitle || 'Portal resmi tata kelola arsip persuratan digital, pencarian dokumen, dan penerbitan bukti tanda terima terverifikasi.',
    heroBackground: payload.heroBackground || '',
    masterPengirim: payload.masterPengirim || 'Fakultas Tarbiyah, Fakultas Syariah, Rektorat, PDDikti'
  };

  Object.keys(map).forEach((key) => {
    const range = sheet.getRange(1, 1, sheet.getLastRow(), 2);
    const values = range.getValues();
    let found = false;

    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === key) {
        sheet.getRange(i + 1, 2).setValue(map[key]);
        found = true;
        break;
      }
    }

    if (!found) {
      sheet.appendRow([key, map[key]]);
    }
  });

  return { ok: true, settings: getSettings() };
}

function loginAdmin(username, password) {
  return String(username || '').trim() === ADMIN_USERNAME && String(password || '').trim() === ADMIN_PASSWORD;
}

function saveSurat(data) {
  const payload = data || {};
  const { sheet } = getDataSheet();

  const row = [
    payload.id || Utilities.getUuid(),
    payload.tipe || 'Masuk',
    payload.agenda || '',
    payload.noSurat || '',
    payload.tglSurat || '',
    payload.pengirim || '',
    payload.perihal || '',
    payload.klasifikasi || 'Biasa',
    payload.fileUrl || '#',
    new Date().toISOString()
  ];

  const rows = sheet.getDataRange().getValues();
  let foundRowIndex = -1;

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(payload.id || '')) {
      foundRowIndex = i + 1;
      break;
    }
  }

  if (foundRowIndex > 0) {
    sheet.getRange(foundRowIndex, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }

  return { ok: true, data: { ...payload, id: row[0], tipe: row[1], agenda: row[2], noSurat: row[3], tglSurat: row[4], pengirim: row[5], perihal: row[6], klasifikasi: row[7], fileUrl: row[8] } };
}

function deleteSurat(id) {
  const { sheet } = getDataSheet();
  const rows = sheet.getDataRange().getValues();

  let targetIndex = -1;
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      targetIndex = i + 1;
      break;
    }
  }

  if (targetIndex > 0) {
    sheet.deleteRow(targetIndex);
    return { ok: true, deletedId: id };
  }

  return { ok: false, deletedId: id, message: 'Data tidak ditemukan' };
}

function purgeDummyData() {
  const { sheet } = getDataSheet();
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return { ok: true, message: 'Tidak ada data dummy untuk dihapus' };
  }

  sheet.clear();
  sheet.appendRow([
    'id',
    'tipe',
    'agenda',
    'noSurat',
    'tglSurat',
    'pengirim',
    'perihal',
    'klasifikasi',
    'fileUrl',
    'createdAt'
  ]);

  return { ok: true, message: 'Semua data dummy berhasil dibersihkan' };
}

function testAppScript() {
  const docs = getAllDocuments();
  const settings = getSettings();
  return { docs, settings, login: loginAdmin('admin', 'admin123') };
}
