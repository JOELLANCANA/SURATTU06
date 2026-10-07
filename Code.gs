const CONFIG = {
  spreadsheetId: PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || '1YS7HVGEaWb6nj-VahxOwoTFy1kIll_7UoqbxM8x4sdU',
  distributionSpreadsheetId: PropertiesService.getScriptProperties().getProperty('DISTRIBUTION_SPREADSHEET_ID') || '1BzgDHRRa-N_OY-Dv_EfF7lfsVHNaN4h8jj7UWiM3B-s',
  distributionSheetName: PropertiesService.getScriptProperties().getProperty('DISTRIBUTION_SHEET_NAME') || 'Distribusi',
  driveFolderId: PropertiesService.getScriptProperties().getProperty('DRIVE_FOLDER_ID') || '1H8_QF4GGc8C6-E9OEg-gKXHf3MFPAhRJ',
  incomingSheetName: PropertiesService.getScriptProperties().getProperty('INCOMING_SHEET_NAME') || 'Surat Masuk',
  outgoingSheetName: PropertiesService.getScriptProperties().getProperty('OUTGOING_SHEET_NAME') || 'Surat Keluar',
  senderSheetName: PropertiesService.getScriptProperties().getProperty('SENDER_SHEET_NAME') || 'Pengirim',
  recipientSheetName: PropertiesService.getScriptProperties().getProperty('RECIPIENT_SHEET_NAME') || 'Tujuan',
  announcementSheetName: PropertiesService.getScriptProperties().getProperty('ANNOUNCEMENT_SHEET_NAME') || 'Pengumuman',
  bannerSheetName: PropertiesService.getScriptProperties().getProperty('BANNER_SHEET_NAME') || 'Banner'
};

function doGet(event) {
  if (!event || !event.parameter || event.parameter.api !== '1') {
    return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Suratika - Manajemen Surat Menyurat')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  const data = getLetterData_();
  let distributions = [];
  try {
    distributions = getDistributionData_();
  } catch (error) {
    console.warn(`Distribusi tidak dapat dimuat: ${error.message}`);
  }
  const announcements = readAnnouncementSheet_();
  const banners = readBannerSheet_();
  const senderNames = readSenderNames_();
  const recipientNames = readRecipientNames_();
  const properties = PropertiesService.getScriptProperties();
  const publishedBannerUrls = getPublishedBannerUrls_();
  return json_({
    ok: true,
    data,
    distributions,
    announcements,
    banners,
    senderNames,
    recipientNames,
    footerInfo: properties.getProperty('FOOTER_INFO') || 'Informasi layanan administrasi surat UIN Ar-Raniry Banda Aceh.',
    heroImageUrl: publishedBannerUrls[0] || '',
    heroImageUrls: publishedBannerUrls,
    gradient: {
      colorOne: properties.getProperty('GRADIENT_COLOR_ONE') || '#f7f8f2',
      colorTwo: properties.getProperty('GRADIENT_COLOR_TWO') || '#dcefe3',
      direction: properties.getProperty('GRADIENT_DIRECTION') || '135deg'
    }
  });
}

function getDistributionData_() {
  if (!CONFIG.distributionSpreadsheetId) return [];
  const spreadsheet = SpreadsheetApp.openById(CONFIG.distributionSpreadsheetId);
  const sheet = spreadsheet.getSheetByName(CONFIG.distributionSheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getDisplayValues();
  const headers = values.shift() || [];
  return values.filter(row => row.some(value => String(value).trim())).map(row => headers.reduce((item, header, index) => {
    item[header || `column${index + 1}`] = row[index] || '';
    return item;
  }, {}));
}

function doPost(event) {
  try {
    const body = JSON.parse(event.postData.contents || '{}');
    if (body.action === 'saveSenderNames') {
      const names = [...new Set(String((body.data || {}).names || '').split(/[\n,;]+/).map(name => name.trim()).filter(Boolean))].sort((first, second) => first.localeCompare(second, 'id'));
      const sheet = getSenderSheet_();
      sheet.clearContents();
      sheet.getRange(1, 1, names.length + 1, 1).setValues([['name'], ...names.map(name => [name])]);
      return json_({ ok: true, senderNames: names });
    }
    if (body.action === 'saveRecipientNames') {
      const names = [...new Set(String((body.data || {}).names || '').split(/[\n,;]+/).map(name => name.trim()).filter(Boolean))].sort((first, second) => first.localeCompare(second, 'id'));
      const sheet = getRecipientSheet_();
      sheet.clearContents();
      sheet.getRange(1, 1, names.length + 1, 1).setValues([['name'], ...names.map(name => [name])]);
      return json_({ ok: true, recipientNames: names });
    }
    if (['createAnnouncement', 'updateAnnouncement', 'deleteAnnouncement', 'archiveAnnouncement'].includes(body.action)) {
      return handleAnnouncementAction_(body.action, body.data || {});
    }
    if (['uploadBanner', 'publishBanner', 'archiveBanner', 'deleteBanner'].includes(body.action)) {
      return handleBannerAction_(body.action, body.data || {});
    }
    if (body.action === 'saveHeroImages' || body.action === 'saveHeroImage') {
      const data = body.data || {};
      const images = Array.isArray(data.images) ? data.images : [data];
      const uploaded = images.filter(image => image && image.base64).map(image => {
        const saved = saveHeroFile_(image.base64, image.name, image.mimeType);
        return appendBannerRow_(saved, 'published');
      });
      if (!uploaded.length) return json_({ ok: false, error: 'Tidak ada gambar hero yang dikirim.' });
      syncHeroPropertiesFromBanners_();
      return json_({ ok: true, banners: readBannerSheet_(), heroImageUrl: getPublishedBannerUrls_()[0] || '', heroImageUrls: getPublishedBannerUrls_() });
    }
    if (body.action === 'saveGradient') {
      const gradient = body.data || {};
      const properties = PropertiesService.getScriptProperties();
      properties.setProperties({
        GRADIENT_COLOR_ONE: gradient.colorOne || '#f7f8f2',
        GRADIENT_COLOR_TWO: gradient.colorTwo || '#dcefe3',
        GRADIENT_DIRECTION: gradient.direction || '135deg'
      });
      return json_({ ok: true });
    }
    if (body.action === 'saveFooterInfo') {
      const footerInfo = String((body.data || {}).content || '').trim().slice(0, 500);
      PropertiesService.getScriptProperties().setProperty('FOOTER_INFO', footerInfo);
      return json_({ ok: true, footerInfo });
    }
    if (body.action !== 'createLetter') {
      return json_({ ok: false, error: 'Action tidak dikenal.' });
    }

    const data = body.data || {};
    const attachmentUrl = data.attachmentBase64
      ? saveAttachment_(data.attachmentBase64, data.attachmentName, data.attachmentMimeType)
      : '';
    getSheet_(data.type).appendRow([
      new Date(), data.number || '', data.subject || '', data.sender || '',
      data.type || '', data.date || '', data.status || '', attachmentUrl, data.recipient || ''
    ]);
    CacheService.getScriptCache().remove('suratika_letters_v1');
    return json_({ ok: true, attachmentUrl });
  } catch (error) {
    return json_({ ok: false, error: error.message });
  }
}

function getLetterData_() {
  return [readLetterSheet_(CONFIG.incomingSheetName), readLetterSheet_(CONFIG.outgoingSheetName)].flat();
}

function setup() {
  [CONFIG.incomingSheetName, CONFIG.outgoingSheetName].forEach(sheetName => {
    const sheet = getSheet_(sheetName === CONFIG.outgoingSheetName ? 'out' : 'in');
    if (sheet.getLastRow() === 0) sheet.appendRow(['createdAt', 'number', 'subject', 'sender', 'type', 'date', 'status', 'attachmentUrl']);
  });
  getSenderSheet_();
  getRecipientSheet_();
  getAnnouncementSheet_();
  getBannerSheet_();
  migrateLegacyHeroImages_();
}

function getSenderSheet_() {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  const sheet = spreadsheet.getSheetByName(CONFIG.senderSheetName) || spreadsheet.insertSheet(CONFIG.senderSheetName);
  if (sheet.getLastRow() === 0) sheet.appendRow(['name']);
  return sheet;
}

function readSenderNames_() {
  const sheet = getSenderSheet_();
  if (sheet.getLastRow() < 1) return [];
  const values = sheet.getDataRange().getDisplayValues().map(row => String(row[0] || '').trim()).filter(Boolean);
  const first = String(values[0] || '').toLowerCase().replace(/[ ._\/-]/g, '');
  const names = ['name', 'nama', 'sender', 'pengirim'].includes(first) ? values.slice(1) : values;
  return [...new Set(names)].sort((firstName, secondName) => firstName.localeCompare(secondName, 'id'));
}

function getRecipientSheet_() {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  const sheet = spreadsheet.getSheetByName(CONFIG.recipientSheetName) || spreadsheet.insertSheet(CONFIG.recipientSheetName);
  if (sheet.getLastRow() === 0) sheet.appendRow(['name']);
  return sheet;
}

function readRecipientNames_() {
  const sheet = getRecipientSheet_();
  if (sheet.getLastRow() < 1) return [];
  const values = sheet.getDataRange().getDisplayValues().map(row => String(row[0] || '').trim()).filter(Boolean);
  const first = String(values[0] || '').toLowerCase().replace(/[ ._\/-]/g, '');
  const names = ['name', 'nama', 'recipient', 'tujuan', 'penerima'].includes(first) ? values.slice(1) : values;
  return [...new Set(names)].sort((firstName, secondName) => firstName.localeCompare(secondName, 'id'));
}

function handleAnnouncementAction_(action, data) {
  const sheet = getAnnouncementSheet_();
  const id = String(data.id || '').trim();
  const row = id ? findAnnouncementRow_(sheet, id) : 0;
  if (action === 'createAnnouncement') {
    const announcementId = `ann-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    sheet.appendRow([announcementId, data.title || '', data.content || '', data.publishedAt || new Date(), 'published', '']);
    return json_({ ok: true, announcement: readAnnouncementByRow_(sheet, sheet.getLastRow()) });
  }
  if (!row) return json_({ ok: false, error: 'Pengumuman tidak ditemukan.' });
  if (action === 'updateAnnouncement') {
    sheet.getRange(row, 2, 1, 3).setValues([[data.title || '', data.content || '', data.publishedAt || new Date()]]);
  } else if (action === 'archiveAnnouncement') {
    sheet.getRange(row, 5, 1, 2).setValues([['archived', new Date()]]);
  } else if (action === 'deleteAnnouncement') {
    sheet.deleteRow(row);
    return json_({ ok: true });
  }
  return json_({ ok: true, announcement: readAnnouncementByRow_(sheet, row) });
}

function getAnnouncementSheet_() {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  const sheet = spreadsheet.getSheetByName(CONFIG.announcementSheetName) || spreadsheet.insertSheet(CONFIG.announcementSheetName);
  if (sheet.getLastRow() === 0) sheet.appendRow(['id', 'title', 'content', 'publishedAt', 'status', 'archivedAt']);
  return sheet;
}

function readAnnouncementSheet_() {
  const sheet = getAnnouncementSheet_();
  if (sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getDisplayValues();
  const headers = values.shift() || [];
  return values.filter(row => row.some(value => String(value).trim())).map(row => headers.reduce((item, header, index) => {
    item[header || `column${index + 1}`] = row[index] || '';
    return item;
  }, {}));
}

function readAnnouncementByRow_(sheet, rowNumber) {
  const values = sheet.getRange(rowNumber, 1, 1, 6).getDisplayValues()[0];
  return { id: values[0], title: values[1], content: values[2], publishedAt: values[3], status: values[4], archivedAt: values[5] };
}

function findAnnouncementRow_(sheet, id) {
  const ids = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1).getDisplayValues().flat();
  const index = ids.indexOf(id);
  return index < 0 ? 0 : index + 2;
}

function readLetterSheet_(sheetName) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values.shift() || [];
  return values.filter(row => row.some(value => String(value).trim())).map(row => headers.reduce((item, header, index) => {
    item[header] = row[index];
    return item;
  }, {}));
}

function getSheet_(type) {
  if (!CONFIG.spreadsheetId) throw new Error('SPREADSHEET_ID belum diatur di Script Properties.');
  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  const sheetName = type === 'out' ? CONFIG.outgoingSheetName : CONFIG.incomingSheetName;
  const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
  if (sheet.getLastRow() === 0) sheet.appendRow(['createdAt', 'number', 'subject', 'sender', 'type', 'date', 'status', 'attachmentUrl', 'recipient']);
  else if (sheet.getLastColumn() < 9) sheet.getRange(1, 9).setValue('recipient');
  return sheet;
}

function saveAttachment_(base64, name, mimeType, category) {
  if (!CONFIG.driveFolderId) throw new Error('DRIVE_FOLDER_ID belum diatur di Script Properties.');
  const bytes = Utilities.base64Decode(base64.split(',').pop());
  const blob = Utilities.newBlob(bytes, mimeType || MimeType.PDF, name || `${category || 'lampiran'}-${Date.now()}`);
  const file = DriveApp.getFolderById(CONFIG.driveFolderId).createFile(blob);
  if (category === 'hero') {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return publicHeroUrl_(file.getId());
  }
  return file.getUrl();
}

function saveHeroFile_(base64, name, mimeType) {
  if (!CONFIG.driveFolderId) throw new Error('DRIVE_FOLDER_ID belum diatur di Script Properties.');
  const bytes = Utilities.base64Decode(String(base64 || '').split(',').pop());
  const fileName = name || `banner-${Date.now()}.jpg`;
  const blob = Utilities.newBlob(bytes, mimeType || MimeType.JPEG, fileName);
  const file = DriveApp.getFolderById(CONFIG.driveFolderId).createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return {
    fileName: file.getName(),
    driveFileId: file.getId(),
    driveUrl: publicHeroUrl_(file.getId())
  };
}

function publicHeroUrl_(fileId) {
  return `https://lh3.googleusercontent.com/d/${fileId}=w1600`;
}

function extractDriveFileId_(value) {
  const match = String(value || '').match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
  return match ? match[1] : '';
}

function getBannerSheet_() {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  const sheet = spreadsheet.getSheetByName(CONFIG.bannerSheetName) || spreadsheet.insertSheet(CONFIG.bannerSheetName);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['id', 'fileName', 'driveFileId', 'driveUrl', 'status', 'publishedAt', 'archivedAt', 'createdAt']);
  }
  return sheet;
}

function readBannerSheet_() {
  migrateLegacyHeroImages_();
  const sheet = getBannerSheet_();
  if (sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getDisplayValues();
  const headers = values.shift() || [];
  return values.filter(row => row.some(value => String(value).trim())).map(row => headers.reduce((item, header, index) => {
    item[header || `column${index + 1}`] = row[index] || '';
    return item;
  }, {}));
}

function readBannerByRow_(sheet, rowNumber) {
  const values = sheet.getRange(rowNumber, 1, 1, 8).getDisplayValues()[0];
  return {
    id: values[0],
    fileName: values[1],
    driveFileId: values[2],
    driveUrl: values[3],
    status: values[4],
    publishedAt: values[5],
    archivedAt: values[6],
    createdAt: values[7]
  };
}

function findBannerRow_(sheet, id) {
  if (sheet.getLastRow() < 2) return 0;
  const ids = sheet.getRange(2, 1, sheet.getLastRow(), 1).getDisplayValues().flat();
  const index = ids.indexOf(id);
  return index < 0 ? 0 : index + 2;
}

function appendBannerRow_(fileMeta, status) {
  const sheet = getBannerSheet_();
  const bannerId = `banner-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date();
  const nextStatus = status === 'archived' ? 'archived' : 'published';
  sheet.appendRow([
    bannerId,
    fileMeta.fileName || '',
    fileMeta.driveFileId || '',
    fileMeta.driveUrl || '',
    nextStatus,
    nextStatus === 'published' ? now : '',
    nextStatus === 'archived' ? now : '',
    now
  ]);
  return readBannerByRow_(sheet, sheet.getLastRow());
}

function getPublishedBannerUrls_() {
  const sheet = getBannerSheet_();
  if (sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow(), 8).getDisplayValues()
    .filter(row => String(row[4] || '').toLowerCase() === 'published' && row[3])
    .map(row => ensurePublicBannerUrl_({ driveFileId: row[2], driveUrl: row[3] }));
}

function ensurePublicBannerUrl_(item) {
  const fileId = item.driveFileId || extractDriveFileId_(item.driveUrl);
  if (!fileId) return item.driveUrl || '';
  try {
    const file = DriveApp.getFileById(fileId);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (error) {
    console.warn(`Banner tidak dapat dibuat publik: ${error.message}`);
  }
  return publicHeroUrl_(fileId);
}

function syncHeroPropertiesFromBanners_() {
  const urls = getPublishedBannerUrls_();
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty('HERO_IMAGE_URLS', JSON.stringify(urls));
  properties.setProperty('HERO_IMAGE_URL', urls[0] || '');
}

function migrateLegacyHeroImages_() {
  const properties = PropertiesService.getScriptProperties();
  if (properties.getProperty('BANNER_MIGRATED') === '1') return;
  const sheet = getBannerSheet_();
  const existingIds = [];
  const existingUrls = [];
  if (sheet.getLastRow() >= 2) {
    sheet.getRange(2, 1, sheet.getLastRow(), 8).getDisplayValues().forEach(row => {
      if (row[2]) existingIds.push(String(row[2]));
      if (row[3]) existingUrls.push(String(row[3]));
    });
  }
  const storedUrls = properties.getProperty('HERO_IMAGE_URLS') || properties.getProperty('HERO_IMAGE_URL') || '';
  let urls = [];
  try {
    urls = storedUrls.startsWith('[') ? JSON.parse(storedUrls) : [storedUrls];
  } catch (error) {
    urls = [storedUrls];
  }
  urls.filter(Boolean).forEach(url => {
    const fileId = extractDriveFileId_(url);
    if ((fileId && existingIds.includes(fileId)) || existingUrls.includes(url)) return;
    const now = new Date();
    sheet.appendRow([
      `banner-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      fileId ? `banner-${fileId}` : 'banner-lama',
      fileId || '',
      fileId ? publicHeroUrl_(fileId) : url,
      'published',
      now,
      '',
      now
    ]);
  });
  properties.setProperty('BANNER_MIGRATED', '1');
  syncHeroPropertiesFromBanners_();
}

function handleBannerAction_(action, data) {
  const sheet = getBannerSheet_();
  if (action === 'uploadBanner') {
    if (!data.base64) return json_({ ok: false, error: 'File banner belum dikirim.' });
    const saved = saveHeroFile_(data.base64, data.name, data.mimeType);
    const banner = appendBannerRow_(saved, data.status === 'archived' ? 'archived' : 'published');
    syncHeroPropertiesFromBanners_();
    return json_({ ok: true, banner, banners: readBannerSheet_(), heroImageUrls: getPublishedBannerUrls_() });
  }

  const id = String(data.id || '').trim();
  const row = id ? findBannerRow_(sheet, id) : 0;
  if (!row) return json_({ ok: false, error: 'Banner tidak ditemukan.' });
  const current = readBannerByRow_(sheet, row);

  if (action === 'publishBanner') {
    sheet.getRange(row, 5, 1, 3).setValues([['published', new Date(), '']]);
  } else if (action === 'archiveBanner') {
    sheet.getRange(row, 5, 1, 3).setValues([['archived', current.publishedAt || '', new Date()]]);
  } else if (action === 'deleteBanner') {
    if (current.driveFileId) {
      try {
        DriveApp.getFileById(current.driveFileId).setTrashed(true);
      } catch (error) {
        console.warn(`File banner gagal dihapus dari Drive: ${error.message}`);
      }
    }
    sheet.deleteRow(row);
    syncHeroPropertiesFromBanners_();
    return json_({ ok: true, banners: readBannerSheet_(), heroImageUrls: getPublishedBannerUrls_() });
  }

  syncHeroPropertiesFromBanners_();
  return json_({ ok: true, banner: readBannerByRow_(sheet, row), banners: readBannerSheet_(), heroImageUrls: getPublishedBannerUrls_() });
}

function getHeroImageUrl_() {
  return getPublishedBannerUrls_()[0] || '';
}

function getHeroImageUrls_() {
  return getPublishedBannerUrls_();
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
