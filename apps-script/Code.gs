/**
 * Estudio TME – UCSS 2026 · Base de datos en Google Sheets y Google Drive
 *
 * Tabla «Encuestas»:  una fila por participante con los valores cuantitativos y cualitativos
 *                     (ficha, NASA-TLX, SUSESO/ISTAS21, Warr-Cook-Wall, Nórdico, REBA y puntajes).
 * Tabla «Multimedia»: una fila por foto; el archivo se guarda en la carpeta Drive del estudio
 *                     (Multimedia/Egresado y Multimedia/Interno) y se enlaza con id_encuesta.
 *
 * Instalación: ver apps-script/LEEME.md. Primero ejecute configurar() una vez.
 */
const NOMBRE_CARPETA = "Estudio TME – UCSS 2026";
const ID_CARPETA = ""; // opcional: id de una carpeta de Drive ya creada (lo que sigue a /folders/ en su enlace)
const HOJA_ENC = "Encuestas";
const HOJA_MM = "Multimedia";
const MM_COLS = ["id_archivo", "id_encuesta", "codigo", "estrato", "fecha", "observacion", "tipo", "nombre_archivo", "tamano_kb", "id_drive", "url_drive", "capturada", "registrada"];
const ALFA = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // sin O/0, I/1 ni L
const SESION_SEG = 6 * 60 * 60;
const PROPS = PropertiesService.getScriptProperties();

/* ---------------------------------------------------------------------------
   Configuración (se ejecuta a mano una vez desde el editor de Apps Script)
   --------------------------------------------------------------------------- */
function configurar() {
  let carpeta = null;
  if (ID_CARPETA) carpeta = DriveApp.getFolderById(ID_CARPETA);
  else if (PROPS.getProperty("CARPETA")) { try { carpeta = DriveApp.getFolderById(PROPS.getProperty("CARPETA")); } catch (e) { carpeta = null; } }
  if (!carpeta) carpeta = DriveApp.createFolder(NOMBRE_CARPETA);

  let ss = null;
  if (PROPS.getProperty("HOJA")) { try { ss = SpreadsheetApp.openById(PROPS.getProperty("HOJA")); } catch (e) { ss = null; } }
  if (!ss) { ss = SpreadsheetApp.create("TME – Base de datos"); DriveApp.getFileById(ss.getId()).moveTo(carpeta); }

  const enc = ss.getSheetByName(HOJA_ENC) || ss.insertSheet(HOJA_ENC);
  const mm = ss.getSheetByName(HOJA_MM) || ss.insertSheet(HOJA_MM);
  ss.getSheets().forEach(h => { if (h.getName() !== HOJA_ENC && h.getName() !== HOJA_MM && h.getLastRow() === 0) ss.deleteSheet(h); });
  if (enc.getLastRow() === 0) enc.appendRow(["id_encuesta", "registrado"]);
  if (mm.getLastRow() === 0) mm.appendRow(MM_COLS);
  [enc, mm].forEach(h => { h.setFrozenRows(1); h.getRange(1, 1, 1, h.getLastColumn()).setFontWeight("bold").setBackground("#FFE8EC"); });

  const fotos = subcarpeta(carpeta, "Multimedia");
  PROPS.setProperties({ CARPETA: carpeta.getId(), HOJA: ss.getId(), FOTOS: fotos.getId() });

  let codigo = "";
  if (!PROPS.getProperty("COD_HASH")) codigo = fijarCodigo();
  Logger.log("Carpeta de Drive: " + carpeta.getUrl());
  Logger.log("Hoja de cálculo: " + ss.getUrl());
  Logger.log(codigo ? "CÓDIGO DE ACCESO AL PANEL: " + codigo + "  (anótelo; no se volverá a mostrar)" : "El código de acceso ya existía. Para cambiarlo ejecute nuevoCodigoAcceso().");
}

// por si se pierde el código: genera otro y lo muestra en el registro de ejecución
function nuevoCodigoAcceso() { Logger.log("NUEVO CÓDIGO DE ACCESO AL PANEL: " + fijarCodigo()); }

/* ---------------------------------------------------------------------------
   Puntos de entrada
   --------------------------------------------------------------------------- */
function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("Estudio TME · UCSS 2026")
    .addMetaTag("viewport", "width=device-width, initial-scale=1, viewport-fit=cover")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// para la página abierta fuera de Apps Script (GS_URL en el HTML)
function doPost(e) {
  let req = null;
  try { req = JSON.parse(e.postData.contents); } catch (err) { req = null; }
  return ContentService.createTextOutput(JSON.stringify(api(req))).setMimeType(ContentService.MimeType.JSON);
}

// la página la llama con google.script.run.api(req) o mediante doPost
function api(req) {
  try {
    switch (req && req.action) {
      case "estado": return { ok: true, configurado: !!PROPS.getProperty("HOJA"), codigo: !!PROPS.getProperty("COD_HASH") };
      case "guardarEncuesta": return guardarEncuesta(req);
      case "subirFoto": return subirFoto(req);
      case "login": return login(req);
      case "listar": auth(req); return listar();
      case "foto": auth(req); return foto(req);
      case "nuevoCodigo": { auth(req); const codigo = fijarCodigo(); return { ok: true, codigo: codigo, token: nuevoToken() }; }
      default: return { ok: false, error: "Acción desconocida" };
    }
  } catch (e) {
    return { ok: false, error: String((e && e.message) || e), code: (e && e.code) || "" };
  }
}

/* ---------------------------------------------------------------------------
   Tabla «Encuestas»
   --------------------------------------------------------------------------- */
function guardarEncuesta(req) {
  const rec = req.rec, fila = req.fila;
  if (!rec || typeof rec.id !== "string" || !/^[EI]-\d{1,4}_\d+$/.test(rec.id)) throw falla("Registro inválido", "datos");
  if (!fila || !Array.isArray(fila.cols) || !Array.isArray(fila.vals) || fila.cols.length !== fila.vals.length) throw falla("Fila inválida", "datos");
  const lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    const sh = tabla(HOJA_ENC);
    if (buscar(sh, "id_encuesta", rec.id)) return { ok: true, id: rec.id, repetida: true };
    const vals = { id_encuesta: rec.id, registrado: new Date(), datos_json: JSON.stringify(rec) };
    fila.cols.forEach((c, i) => { if (c !== "id_encuesta") vals[c] = fila.vals[i]; });
    escribir(sh, ["id_encuesta", "registrado"].concat(fila.cols.filter(c => c !== "id_encuesta"), ["datos_json"]), vals);
    return { ok: true, id: rec.id };
  } finally { lock.releaseLock(); }
}

function listar() {
  const sh = tabla(HOJA_ENC), n = sh.getLastRow(), head = encabezado(sh), j = head.indexOf("datos_json");
  const encuestas = [];
  if (n > 1 && j >= 0) sh.getRange(2, j + 1, n - 1, 1).getValues().forEach(r => { try { if (r[0]) encuestas.push(JSON.parse(r[0])); } catch (e) { /* fila editada a mano */ } });
  return { ok: true, encuestas: encuestas, hoja: libro().getUrl(), carpeta: DriveApp.getFolderById(PROPS.getProperty("CARPETA")).getUrl() };
}

/* ---------------------------------------------------------------------------
   Tabla «Multimedia» y archivos en Drive
   --------------------------------------------------------------------------- */
function subirFoto(req) {
  const f = req.foto || {};
  const m = typeof f.data === "string" ? f.data.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/) : null;
  if (!m || typeof f.id !== "string" || !/^[EI]-\d{1,4}_\d+_[\w-]+$/.test(f.id)) throw falla("Foto inválida", "datos");
  const lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    const sh = tabla(HOJA_MM);
    const prev = buscar(sh, "id_archivo", f.id);
    if (prev) return { ok: true, id: f.id, archivo: String(prev.id_drive), url: String(prev.url_drive), repetida: true };
    const ext = m[1] === "image/png" ? "png" : m[1] === "image/webp" ? "webp" : "jpg";
    const nombre = f.codigo + "_obs" + f.obs + "_" + f.id.split("_").pop() + "." + ext;
    const bytes = Utilities.base64Decode(m[2]);
    const carpeta = subcarpeta(DriveApp.getFolderById(PROPS.getProperty("FOTOS")), f.estrato === "Interno" ? "Interno" : "Egresado");
    const file = carpeta.createFile(Utilities.newBlob(bytes, m[1], nombre));
    escribir(sh, MM_COLS, {
      id_archivo: f.id, id_encuesta: f.encuesta, codigo: f.codigo, estrato: f.estrato, fecha: f.fecha, observacion: f.obs,
      tipo: m[1], nombre_archivo: nombre, tamano_kb: Math.round(bytes.length / 102.4) / 10, id_drive: file.getId(), url_drive: file.getUrl(),
      capturada: f.ts || "", registrada: new Date()
    });
    return { ok: true, id: f.id, archivo: file.getId(), url: file.getUrl() };
  } finally { lock.releaseLock(); }
}

// solo entrega archivos registrados en la tabla «Multimedia»
function foto(req) {
  const id = String(req.archivo || "");
  if (!id || !buscar(tabla(HOJA_MM), "id_drive", id)) throw falla("Foto no encontrada", "datos");
  const blob = DriveApp.getFileById(id).getBlob();
  return { ok: true, data: "data:" + blob.getContentType() + ";base64," + Utilities.base64Encode(blob.getBytes()) };
}

/* ---------------------------------------------------------------------------
   Acceso al panel: el código no se guarda, solo su huella
   --------------------------------------------------------------------------- */
function login(req) {
  const cache = CacheService.getScriptCache();
  const fallos = Number(cache.get("fallos") || 0);
  if (fallos >= 10) throw falla("Demasiados intentos", "bloqueado");
  const sal = PROPS.getProperty("COD_SAL"), hash = PROPS.getProperty("COD_HASH");
  if (!sal || !hash) throw falla("Sin código asignado", "config");
  if (huella(String(req.codigo || "").trim().toUpperCase(), sal) !== hash) { cache.put("fallos", String(fallos + 1), 600); throw falla("Código incorrecto", "codigo"); }
  return { ok: true, token: nuevoToken() };
}

function auth(req) {
  const ver = req && req.token ? CacheService.getScriptCache().get("tk_" + req.token) : null;
  if (!ver || ver !== PROPS.getProperty("COD_VER")) throw falla("Sesión vencida", "auth");
}

function nuevoToken() {
  const t = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "");
  CacheService.getScriptCache().put("tk_" + t, PROPS.getProperty("COD_VER"), SESION_SEG);
  return t;
}

// genera el código TME-XXXX-XXXX, guarda sal y huella, e invalida las sesiones anteriores
function fijarCodigo() {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, Utilities.getUuid() + Utilities.getUuid() + Date.now());
  let c = "";
  for (let i = 0; i < 8; i++) c += ALFA[(bytes[i] + 256) % ALFA.length];
  const codigo = "TME-" + c.slice(0, 4) + "-" + c.slice(4);
  const sal = Utilities.getUuid();
  PROPS.setProperties({ COD_SAL: sal, COD_HASH: huella(codigo, sal), COD_VER: String(Number(PROPS.getProperty("COD_VER") || 0) + 1) });
  return codigo;
}

function huella(codigo, sal) {
  let h = sal + "|" + codigo;
  for (let i = 0; i < 300; i++) h = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, h + sal, Utilities.Charset.UTF_8));
  return h;
}

/* ---------------------------------------------------------------------------
   Utilidades
   --------------------------------------------------------------------------- */
function libro() {
  const id = PROPS.getProperty("HOJA");
  if (!id) throw falla("La base de datos no está configurada: ejecute configurar() en Apps Script", "config");
  return SpreadsheetApp.openById(id);
}
function tabla(nombre) { const h = libro().getSheetByName(nombre); if (!h) throw falla("Falta la tabla «" + nombre + "»: ejecute configurar()", "config"); return h; }
function encabezado(sh) { const n = sh.getLastColumn(); return n ? sh.getRange(1, 1, 1, n).getValues()[0].map(String) : []; }

// busca una fila por el valor de una columna y la devuelve como objeto
function buscar(sh, col, valor) {
  const head = encabezado(sh), j = head.indexOf(col), n = sh.getLastRow();
  if (j < 0 || n < 2) return null;
  const vals = sh.getRange(2, j + 1, n - 1, 1).getValues();
  for (let i = 0; i < vals.length; i++) {
    if (String(vals[i][0]) === String(valor)) { const row = sh.getRange(i + 2, 1, 1, head.length).getValues()[0]; const o = {}; head.forEach((h, k) => { o[h] = row[k]; }); return o; }
  }
  return null;
}

// agrega una fila ordenada por nombre de columna; crea las columnas que falten
function escribir(sh, cols, vals) {
  let head = encabezado(sh);
  const faltan = cols.filter(c => head.indexOf(c) < 0);
  if (faltan.length) {
    const need = head.length + faltan.length - sh.getMaxColumns();
    if (need > 0) sh.insertColumnsAfter(sh.getMaxColumns(), need);
    sh.getRange(1, head.length + 1, 1, faltan.length).setValues([faltan]).setFontWeight("bold").setBackground("#FFE8EC");
    head = head.concat(faltan);
  }
  sh.appendRow(head.map(h => celda(vals[h])));
}

// textos que empiezan con = + - @ se guardan como texto (no como fórmula)
function celda(v) {
  if (v === undefined || v === null) return "";
  if (typeof v === "string" && /^[=+\-@]/.test(v)) return "'" + v;
  return v;
}

function subcarpeta(padre, nombre) { const it = padre.getFoldersByName(nombre); return it.hasNext() ? it.next() : padre.createFolder(nombre); }
function falla(msg, code) { const e = new Error(msg); e.code = code; return e; }
