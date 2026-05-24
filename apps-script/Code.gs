const ALLOWED_DOMAIN = 'unesum.edu.ec';
const SPREADSHEET_ID = '1Juf-kboGLYMiuuJsipB6s2cKXFinx5kcv2_tKJtev_o';
const SHEETS = {
  articulo: 'REVISTAS',
  libro: 'LIBROS',
  capitulo: 'CAPITULOS'
};
const HEADERS = {
  REVISTAS: ['ID', 'CODIGO_IES', 'TIPO_PUBLICACION', 'TIPO_ARTICULO', 'CODIGO_PUBLICACION', 'TITULO_PUBLICACION', 'BASE_DATOS_INDEXADA', 'TIPO_BASE_DATOS_INDEXADA', 'CODIGO_ISSN', 'NOMBRE_REVISTA', 'FECHA_PUBLICACION', 'CAMPO_DETALLADO', 'ESTADO', 'LINK_PUBLICACION', 'LINK_REVISTA', 'FILIACION', 'IDENTIFICACION_PARTICIPANTE', 'PARTICIPACION', 'CUARTIL', 'LINEA_INVESTIGACION', 'APELLIDOS_NOMBRES', 'RELACION_LABORAL', 'GRADO ACADEMICO', 'CARRERA', 'FACULTAD', 'NUMERO_REVISTA', 'SJR', 'INTERCULTURALIDAD (SI o NO)', 'POSICION', 'PERIODO_ACADEMICO', 'RESULTADO DE PROYECTO DE INVESTIGACION', 'TITULO_PROYECTO_INVESTIGACION', 'ESTADO_PROYECTO_INVESTIGACION', 'RESULTADO DE PROYECTO DE VINCULACION', 'TITULO_PROYECTO_VINCULACION', 'ESTADO_PROYECTO_VINCULACION', 'PDF_AVAL_CARTA_CERTIFICADO-PUBLICACION', 'DOCENTE_EMAIL', 'DOCENTE_NOMBRE', 'FECHA_REGISTRO', 'ESTADO_REGISTRO'],
  LIBROS: ['ID', 'CODIGO_IES', 'TIPO_PUBLICACION', 'TITULO_LIBRO', 'CODIGO_ISBN', 'FECHA_PUBLICACION', 'CAMPO_DETALLADO', 'REVISADO_PARES', 'FILIACION', 'IDENTIFICACION_PARTICIPANTE', 'PARTICIPACION', 'LINEA_INVESTIGACION', 'APELLIDOS_NOMBRES', 'POSICION', 'ENLACE_LIBRO', 'PERIODO_ACADEMICO', 'FACULTAD', 'CARRERA', 'RESULTADO DE PROYECTO DE INVESTIGACION', 'TITULO_PROYECTO_INVESTIGACION', 'ESTADO_PROYECTO_INVESTIGACION', 'RESULTADO DE PROYECTO DE VINCULACION', 'TITULO_PROYECTO_VINCULACION', 'ESTADO_PROYECTO_VINCULACION', 'PDF_AVAL_CARTA_CERTIFICADO-PUBLICACION', 'DOCENTE_EMAIL', 'DOCENTE_NOMBRE', 'FECHA_REGISTRO', 'ESTADO_REGISTRO'],
  CAPITULOS: ['ID', 'CODIGO_IES', 'TIPO_PUBLICACION', 'TITULO_CAPITULO', 'TITULO_LIBRO', 'CODIGO_ISBN', 'EDITOR_COMPILADOR', 'PAGINAS (DESDE_23-45)', 'FECHA_PUBLICACION', 'LINK DEL CAPITULO DE LIBRO', 'CAMPO_DETALLADO', 'FILIACION', 'IDENTIFICACION_PARTICIPANTE', 'PARTICIPACION', 'LINEA_INVESTIGACION', 'APELLIDOS_NOMBRES', 'PERIODO_ACADEMICO', 'FACULTAD', 'CARRERA', 'RESULTADO DE PROYECTO DE INVESTIGACION', 'TITULO_PROYECTO_INVESTIGACION', 'ESTADO_PROYECTO_INVESTIGACION', 'RESULTADO DE PROYECTO DE VINCULACION', 'TITULO_PROYECTO_VINCULACION', 'ESTADO_PROYECTO_VINCULACION', 'PDF_AVAL_CARTA_CERTIFICADO-PUBLICACION', 'DOCENTE_EMAIL', 'DOCENTE_NOMBRE', 'FECHA_REGISTRO', 'ESTADO_REGISTRO']
};

function doPost(e) {
  let request = {};
  try {
    request = parseRequest(e);
    const user = verifyUser(request.idToken);

    if (request.action === 'create') {
      const id = createRecord(request.type, request.values, user, request.status);
      return respond({ ok: true, id: id }, request);
    }

    if (request.action === 'list') {
      return respond({ ok: true, records: listRecords(user.email) }, request);
    }

    throw new Error('Accion no soportada.');
  } catch (error) {
    return respond({ ok: false, error: error.message }, request);
  }
}

function parseRequest(e) {
  if (e.parameter && e.parameter.payload) {
    return JSON.parse(e.parameter.payload);
  }
  return JSON.parse(e.postData.contents);
}

function verifyUser(idToken) {
  if (!idToken) throw new Error('Token de Google requerido.');
  const response = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken), {
    muteHttpExceptions: true
  });
  if (response.getResponseCode() !== 200) throw new Error('No se pudo verificar la cuenta de Google.');

  const profile = JSON.parse(response.getContentText());
  if (profile.hd !== ALLOWED_DOMAIN || !String(profile.email || '').endsWith('@' + ALLOWED_DOMAIN)) {
    throw new Error('Solo se permiten cuentas del dominio ' + ALLOWED_DOMAIN + '.');
  }
  return { email: profile.email, name: profile.name || profile.email };
}

function createRecord(type, values, user, status) {
  const sheetName = SHEETS[type];
  if (!sheetName) throw new Error('Tipo de publicacion invalido.');

  const sheet = getOrCreateSheet(sheetName);
  const headerInfo = ensureHeaders(sheet, sheetName);
  const headers = headerInfo.headers;
  const recordStatus = status === 'INCOMPLETO' ? 'INCOMPLETO' : 'COMPLETO';
  if (recordStatus === 'COMPLETO') validateRequired(headers, values);

  const id = values.ID || Utilities.getUuid();
  const now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  const rowData = Object.assign({}, values, {
    ID: id,
    DOCENTE_EMAIL: user.email,
    DOCENTE_NOMBRE: user.name,
    FECHA_REGISTRO: now,
    ESTADO_REGISTRO: recordStatus
  });
  const rowNumber = findEditableRow(sheet, headerInfo.row, headers, id, user.email);
  const row = headers.map((header) => rowData[header] || '');
  if (rowNumber) {
    sheet.getRange(rowNumber, 1, 1, headers.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }
  return id;
}

function listRecords(email) {
  const spreadsheet = getSpreadsheet();
  const records = [];

  Object.keys(SHEETS).forEach((type) => {
    const sheetName = SHEETS[type];
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet || sheet.getLastRow() < 2) return;

    const headerInfo = findHeaderRow(sheet, sheetName);
    if (!headerInfo) return;
    if (sheet.getLastRow() <= headerInfo.row) return;
    const headers = headerInfo.headers;
    const values = sheet.getRange(headerInfo.row + 1, 1, sheet.getLastRow() - headerInfo.row, headers.length).getValues();
    const emailIndex = headers.indexOf('DOCENTE_EMAIL');
    if (emailIndex === -1) return;

    values.forEach((row) => {
      if (row[emailIndex] !== email) return;
      const item = Object.fromEntries(headers.map((header, index) => [header, row[index]]));
      records.push({
        id: item.ID || '',
        values: item,
        type: item.TIPO_PUBLICACION || type,
        publicationType: type,
        title: item.TITULO_PUBLICACION || item.TITULO_LIBRO || item.TITULO_CAPITULO || 'Sin titulo',
        date: item.FECHA_PUBLICACION || '',
        career: item.CARRERA || '',
        status: item.ESTADO_REGISTRO || 'COMPLETO'
      });
    });
  });

  return records.reverse();
}

function findEditableRow(sheet, headerRow, headers, id, email) {
  if (!id || sheet.getLastRow() <= headerRow) return null;

  const idIndex = headers.indexOf('ID');
  const emailIndex = headers.indexOf('DOCENTE_EMAIL');
  if (idIndex === -1 || emailIndex === -1) return null;

  const values = sheet.getRange(headerRow + 1, 1, sheet.getLastRow() - headerRow, headers.length).getValues();
  for (let index = 0; index < values.length; index++) {
    const row = values[index];
    if (row[idIndex] === id && row[emailIndex] === email) {
      return headerRow + index + 1;
    }
  }
  return null;
}

function getOrCreateSheet(sheetName) {
  const spreadsheet = getSpreadsheet();
  return spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
}

function getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID !== 'PEGA_AQUI_EL_ID_DE_TU_HOJA') {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActive();
}

function ensureHeaders(sheet, sheetName) {
  const expected = HEADERS[sheetName];
  const found = findHeaderRow(sheet, sheetName);

  if (!found) {
    sheet.getRange(1, 1, 1, expected.length).setValues([expected]);
    return { row: 1, headers: expected };
  }

  const headers = found.headers.slice();
  const missing = expected.filter((header) => !headers.includes(header));
  if (missing.length) {
    const nextHeaders = headers.concat(missing);
    sheet.getRange(found.row, 1, 1, nextHeaders.length).setValues([nextHeaders]);
    return { row: found.row, headers: nextHeaders };
  }

  return found;
}

function findHeaderRow(sheet, sheetName) {
  if (sheet.getLastRow() === 0) return null;

  const expected = HEADERS[sheetName];
  const rowsToCheck = Math.min(sheet.getLastRow(), 5);
  const width = Math.max(sheet.getLastColumn(), expected.length);
  const rows = sheet.getRange(1, 1, rowsToCheck, width).getValues();

  for (let index = 0; index < rows.length; index++) {
    const headers = rows[index].map(String).map((value) => value.trim()).filter(Boolean);
    if (headers.includes('CODIGO_IES') && headers.includes('TIPO_PUBLICACION')) {
      return { row: index + 1, headers: headers };
    }
  }

  return null;
}

function validateRequired(headers, values) {
  const ignored = ['ID', 'DOCENTE_EMAIL', 'DOCENTE_NOMBRE', 'FECHA_REGISTRO', 'ESTADO_REGISTRO', 'TITULO_PROYECTO', 'ESTADO_PROYECTO'];
  const requiresInvestigation = values['RESULTADO DE PROYECTO DE INVESTIGACION'] === 'SI';
  const requiresVinculation = values['RESULTADO DE PROYECTO DE VINCULACION'] === 'SI';
  const missing = headers.filter((header) => !ignored.includes(header) && !String(values[header] || '').trim());
  const conditionalMissing = missing.filter((header) => {
    if (header === 'TITULO_PROYECTO_INVESTIGACION' || header === 'ESTADO_PROYECTO_INVESTIGACION') return requiresInvestigation;
    if (header === 'TITULO_PROYECTO_VINCULACION' || header === 'ESTADO_PROYECTO_VINCULACION') return requiresVinculation;
    return true;
  });
  if (conditionalMissing.length) {
    throw new Error('Faltan campos obligatorios: ' + conditionalMissing.join(', '));
  }
}

function json(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function respond(payload, request) {
  if (!request || !request.requestId) return json(payload);

  const envelope = {
    requestId: request.requestId,
    payload: payload
  };
  const html = '<!doctype html><html><body><script>' +
    'window.top.postMessage(' + JSON.stringify(envelope) + ',"*");' +
    '</script></body></html>';

  return HtmlService
    .createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
