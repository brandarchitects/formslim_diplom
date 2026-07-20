'use strict';

/* =====================================================================
   Diplom Builder – FormSlim & selbergesundwerden
   Layout-Masse exakt aus der verbindlichen Vorlage «Zertifikat_neu.pdf»
   (A4 hoch, 595.276 × 841.89 pt) extrahiert.
   ===================================================================== */

const { PDFDocument, StandardFonts, rgb } = PDFLib;

const PAGE_W = 595.276;
const PAGE_H = 841.89;

const PASS_HASH = '7aade3fbde58db389df0912772770a51959adf095ca3dd8a491d3d6a1dbba92c';
const LS_TEMPLATES = 'fsd_templates_v1';
const LS_CERTS = 'fsd_certs_v1';
const SS_AUTH = 'fsd_auth';

const COL_TEXT = '#1e3a2a';   // FormSlim Dunkelgrün (aus PDF gesampelt)
const COL_SOFT = '#6b7f72';   // abgeschwächtes Grün für die Zertifikat-ID

const DESIGNS = {
  formslim: {
    label: 'FormSlim',
    logo: 'assets/logos/FormSlim.png',
    background: 'assets/backgrounds/Background_Template.jpg',
  },
  selbergesund: {
    label: 'selbergesundwerden',
    logo: 'assets/logos/selbergesund.png',
    background: 'assets/backgrounds/Background_Template_green.jpg',
  },
};

const FONT_CANDIDATES = {
  regular: ['FS Joey-Regular', 'FSJoey-Regular', 'FSJoey', 'FS-Joey-Regular', 'FSJoey_Regular', 'FS Joey Regular', 'fsjoey-regular', 'FSJoeyPro-Regular'],
  bold: ['FS Joey-Bold', 'FSJoey-Bold', 'FS-Joey-Bold', 'FSJoey_Bold', 'FS Joey Bold', 'fsjoey-bold', 'FSJoeyPro-Bold'],
  heavy: ['FS Joey-Heavy', 'FSJoey-Heavy', 'FS-Joey-Heavy', 'FSJoey_Heavy', 'FS Joey Heavy', 'fsjoey-heavy', 'FSJoeyPro-Heavy'],
};
const FONT_EXTS = ['otf', 'ttf', 'OTF', 'TTF', 'woff'];

/* ---------- Layout-Varianten & Felder ---------- */

const VARIANTS = {
  kurs: {
    label: 'Kurs-Zertifikat (Vorlage Zertifikat_neu.pdf)',
    textFields: [
      ['title', 'Titel', 'text'],
      ['intro', 'Zeile unter Titel', 'text'],
      ['courseName', 'Kursname', 'text'],
      ['presentedTo', 'Übergabe-Zeile', 'text'],
      ['kurstage', 'Kurstage ({{datum1}} / {{datum2}} = Datumsfelder)', 'textarea'],
      ['inhaltTitle', 'Überschrift Inhalt', 'text'],
      ['inhalt', 'Inhalt (eine Zeile pro Punkt)', 'textarea'],
      ['labelKursleiter', 'Label Kursleitung', 'text'],
      ['labelOrtDatum', 'Label Ort/Datum', 'text'],
      ['labelUnterschrift', 'Label Unterschrift', 'text'],
      ['footerAddress', 'Fusszeile Adresse', 'textarea'],
      ['footerNote', 'Fusszeile Hinweis (fett)', 'text'],
      ['idLabel', 'Label Zertifikat-ID', 'text'],
    ],
    personFields: [
      ['datum1', 'Datum Kurstag 1', 'date'],
      ['datum2', 'Datum Kurstag 2', 'date'],
      ['ausstellungsdatum', 'Ausstellungsdatum', 'date'],
      ['ort', 'Ort', 'text'],
      ['kursleiter', 'Kursleiter*in (leer = handschriftlich)', 'text'],
    ],
  },
  verleihung: {
    label: 'Verleihungs-Zertifikat',
    textFields: [
      ['headline', 'Überschrift', 'text'],
      ['midline', 'Zwischenzeile', 'text'],
      ['courseName', 'Kursname', 'text'],
      ['subtitle', 'Zertifikatszeile', 'text'],
      ['issuedLabel', 'Label Ausstellungsdatum', 'text'],
      ['idLabel', 'Label Zertifikat-ID', 'text'],
      ['footerAddress', 'Fusszeile Adresse (optional)', 'textarea'],
      ['footerNote', 'Fusszeile Hinweis (optional, fett)', 'text'],
    ],
    personFields: [
      ['ausstellungsdatum', 'Ausstellungsdatum', 'date'],
    ],
  },
};

/* ---------- Standard-Vorlagen ---------- */

const KURS_COMMON = {
  title: 'Kurs-Zertifikat',
  intro: 'für',
  presentedTo: 'Übergeben an:',
  kurstage: 'Kurstag 1, 6,5 Stunden am {{datum1}}\nKurstag 2, 4,5 Stunden am {{datum2}}',
  inhaltTitle: 'Inhalt',
  labelKursleiter: 'Kursleiter*in:',
  labelOrtDatum: 'Ort und Datum:',
  labelUnterschrift: 'Unterschrift:',
  footerAddress: 'FormSlim UG (haftungsbeschränkt)\nRathausplatz 21, D-87435 Kempten',
  footerNote: 'Das unterschriebene Zertifikat bestätigt nur die Kursteilnahme.',
  idLabel: 'Zertifikat-ID',
  ort: 'Kempten',
};

const DEFAULT_TEMPLATES = [
  {
    id: 'kurs-testen',
    name: 'Kinesiologisches Testen',
    design: 'formslim',
    variant: 'kurs',
    idPrefix: 'FS-KT',
    values: Object.assign({}, KURS_COMMON, {
      courseName: 'Kinesiologisches Testen',
      inhalt: [
        'Theoretische Kenntnisse der Kinesiologie',
        'Theoretische Kenntnisse der Resonanz',
        'Theoretische Kenntnisse der Schwingungen und Frequenzen',
        'Praktische Erfahrung in der Kinesiologie',
        'Praktische Gruppenarbeit in der Kinesiologie',
        'Praktische Einzelarbeit in der Kinesiologie',
      ].join('\n'),
    }),
  },
  {
    id: 'kurs-profi',
    name: 'Kinesiologischer FormSlim-Profi',
    design: 'formslim',
    variant: 'kurs',
    idPrefix: 'FS-PR',
    values: Object.assign({}, KURS_COMMON, {
      courseName: 'Kinesiologischen FormSlim-Profi',
      inhalt: [
        'Theoretische Kenntnisse des Resonanzkonzeptes',
        'Theoretische Kenntnisse des NanoCampo-Systems',
        'Theoretische Kenntnisse des FormSlim-Konzeptes',
        'Praktische Kinesiologie-Erfahrung mit dem Resonanzraster',
        'Praktische Kinesiologie-Gruppenarbeit mit dem Resonanzraster',
        'Praktische Kinesiologie-Einzelarbeit mit dem Resonanzraster',
      ].join('\n'),
    }),
  },
  {
    id: 'sgw-nanocampo',
    name: 'NanoCampo-Stoffwechselberater:in',
    design: 'selbergesund',
    variant: 'verleihung',
    idPrefix: 'SGW-NC',
    values: {
      headline: 'DIESES ZERTIFIKAT WIRD VERLIEHEN AN',
      midline: 'FÜR DEN ERFOLGREICHEN ABSCHLUSS DES KURSES',
      courseName: 'NanoCampo-Stoffwechselberater:in',
      subtitle: 'Zertifikat – Ausbildung zum NanoCampo-Stoffwechselberater:in',
      issuedLabel: 'Ausgestellt am',
      idLabel: 'Zertifikat-ID',
      footerAddress: '',
      footerNote: '',
    },
  },
  {
    id: 'sgw-formslim-berater',
    name: 'FormSlim Stoffwechsel-Berater:in',
    design: 'selbergesund',
    variant: 'verleihung',
    idPrefix: 'SGW-FS',
    values: {
      headline: 'DIESES ZERTIFIKAT WIRD VERLIEHEN AN',
      midline: 'FÜR DEN ERFOLGREICHEN ABSCHLUSS DES KURSES',
      courseName: 'FormSlim Stoffwechsel-Berater:in',
      subtitle: 'Zertifikat – FormSlim Stoffwechsel-Berater:in',
      issuedLabel: 'Ausgestellt am',
      idLabel: 'Zertifikat-ID',
      footerAddress: '',
      footerNote: '',
    },
  },
];

/* =====================================================================
   State
   ===================================================================== */

const state = {
  templates: [],
  certs: [],
  fonts: {},            // weight -> { bytes, pdfFont, asc, desc, isFallback }
  images: {},           // designKey -> { logo: {bytes,url,type} | null, background: {...} | null }
  metricsDoc: null,
  editingCertId: null,
  missingAssets: [],
  fontCssReady: false,
};

/* =====================================================================
   Helpers
   ===================================================================== */

const $ = (id) => document.getElementById(id);

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function uid() {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function hexToRgb01(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function formatDate(iso) {
  if (!iso) return '';
  const p = iso.split('-');
  return p.length === 3 ? `${p[2]}.${p[1]}.${p[0]}` : iso;
}

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const ID_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function generateCertId(prefix) {
  let id;
  const year = new Date().getFullYear();
  do {
    let rand = '';
    const buf = new Uint32Array(5);
    crypto.getRandomValues(buf);
    for (let i = 0; i < 5; i++) rand += ID_ALPHABET[buf[i] % ID_ALPHABET.length];
    id = `${prefix || 'ZERT'}-${year}-${rand}`;
  } while (state.certs.some((c) => c.certId === id));
  return id;
}

let toastTimer = null;
function toast(msg, isError) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.toggle('error', !!isError);
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2600);
}

function download(bytes, filename, mime) {
  const blob = new Blob([bytes], { type: mime || 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/* =====================================================================
   Storage
   ===================================================================== */

function loadTemplates() {
  let stored = [];
  try { stored = JSON.parse(localStorage.getItem(LS_TEMPLATES) || '[]'); } catch (e) { stored = []; }
  if (!Array.isArray(stored)) stored = [];
  // Fehlende Standard-Vorlagen ergänzen (bei Erststart oder neuen Defaults)
  for (const def of DEFAULT_TEMPLATES) {
    if (!stored.some((t) => t.id === def.id)) stored.push(JSON.parse(JSON.stringify(def)));
  }
  state.templates = stored;
  saveTemplates();
}

function saveTemplates() {
  localStorage.setItem(LS_TEMPLATES, JSON.stringify(state.templates));
}

function loadCerts() {
  try { state.certs = JSON.parse(localStorage.getItem(LS_CERTS) || '[]'); } catch (e) { state.certs = []; }
  if (!Array.isArray(state.certs)) state.certs = [];
}

function saveCerts() {
  localStorage.setItem(LS_CERTS, JSON.stringify(state.certs));
  updateSavedCount();
}

function updateSavedCount() {
  $('saved-count').textContent = state.certs.length || '';
}

/* =====================================================================
   Assets (Fonts, Logos, Backgrounds)
   ===================================================================== */

async function tryFetch(url) {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return await r.arrayBuffer();
  } catch (e) { return null; }
}

async function loadFonts() {
  const fallbacks = { regular: null, bold: null, heavy: null };
  for (const weight of ['regular', 'bold', 'heavy']) {
    let bytes = null;
    outer:
    for (const name of FONT_CANDIDATES[weight]) {
      for (const ext of FONT_EXTS) {
        bytes = await tryFetch(`assets/fonts/${name}.${ext}`);
        if (bytes) break outer;
      }
    }
    fallbacks[weight] = bytes;
  }
  // Fallback-Kette: heavy -> bold -> regular
  if (!fallbacks.bold && fallbacks.regular) fallbacks.bold = null; // bold fällt auf Helvetica-Bold zurück, nicht auf regular
  if (!fallbacks.heavy) fallbacks.heavy = fallbacks.bold;

  state.metricsDoc = await PDFDocument.create();
  state.metricsDoc.registerFontkit(fontkit);

  const cssWeights = { regular: '400', bold: '700', heavy: '900' };
  let anyCss = false;

  for (const weight of ['regular', 'bold', 'heavy']) {
    const bytes = fallbacks[weight];
    let pdfFont, asc = 0.75, desc = 0.25, isFallback = false;
    if (bytes) {
      pdfFont = await state.metricsDoc.embedFont(bytes, { subset: false });
      try {
        const fk = pdfFont.embedder.font;
        asc = fk.ascent / fk.unitsPerEm;
        desc = Math.abs(fk.descent) / fk.unitsPerEm;
      } catch (e) { /* Defaults behalten */ }
      try {
        const ff = new FontFace('FS Joey', bytes.slice(0), { weight: cssWeights[weight] });
        await ff.load();
        document.fonts.add(ff);
        anyCss = true;
      } catch (e) { /* Preview nutzt Fallback-Font */ }
    } else {
      isFallback = true;
      const std = weight === 'regular' ? StandardFonts.Helvetica : StandardFonts.HelveticaBold;
      pdfFont = await state.metricsDoc.embedFont(std);
      asc = 0.718; desc = 0.207;
    }
    state.fonts[weight] = { bytes, pdfFont, asc, desc, isFallback };
  }
  state.fontCssReady = anyCss;
  if (state.fonts.regular.isFallback) {
    state.missingAssets.push('FS Joey Schriften (assets/fonts/FSJoey-Regular.ttf, FSJoey-Bold.ttf, FSJoey-Heavy.ttf) – aktuell wird eine Ersatzschrift verwendet');
  }
}

function sniffImageType(bytes) {
  const b = new Uint8Array(bytes);
  if (b[0] === 0x89 && b[1] === 0x50) return 'png';
  if (b[0] === 0xff && b[1] === 0xd8) return 'jpg';
  return null;
}

// JPEGs (z. B. CMYK/progressiv aus Photoshop) über Canvas zu Standard-RGB
// re-kodieren – pdf-lib kann sonst nicht alle Varianten einbetten.
async function normalizeJpeg(bytes) {
  const blob = new Blob([bytes], { type: 'image/jpeg' });
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext('2d').drawImage(bitmap, 0, 0);
  const outBlob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.9));
  if (!outBlob) throw new Error('Canvas-Konvertierung fehlgeschlagen');
  return await outBlob.arrayBuffer();
}

async function loadImages() {
  for (const key of Object.keys(DESIGNS)) {
    const d = DESIGNS[key];
    state.images[key] = { logo: null, background: null };
    for (const part of ['logo', 'background']) {
      let bytes = await tryFetch(d[part]);
      if (bytes) {
        const type = sniffImageType(bytes);
        if (type === 'jpg') {
          try { bytes = await normalizeJpeg(bytes); } catch (e) { console.warn('JPEG-Normalisierung fehlgeschlagen', d[part], e); }
        }
        if (type) {
          const url = URL.createObjectURL(new Blob([bytes], { type: type === 'png' ? 'image/png' : 'image/jpeg' }));
          const dims = await new Promise((res) => {
            const img = new Image();
            img.onload = () => res({ w: img.naturalWidth, h: img.naturalHeight });
            img.onerror = () => res(null);
            img.src = url;
          });
          if (dims) {
            state.images[key][part] = { bytes, url, type, w: dims.w, h: dims.h };
            continue;
          }
        }
      }
      state.missingAssets.push(`${d.label}: ${d[part]}`);
    }
  }
}

function showAssetBanner() {
  if (!state.missingAssets.length) return;
  $('asset-banner-text').textContent =
    'Folgende Dateien fehlen noch im Projekt und werden mit Platzhaltern ersetzt: ' +
    state.missingAssets.join(' · ');
  $('asset-banner').classList.remove('hidden');
}

/* =====================================================================
   Text-Vermessung (mit den eingebetteten PDF-Fonts als Referenz)
   ===================================================================== */

function safeText(text, weight) {
  // Ersatzschrift (WinAnsi) kann nicht alle Zeichen – im Zweifel ersetzen
  const f = state.fonts[weight];
  if (!f.isFallback) return text;
  let out = '';
  for (const ch of text) {
    try { f.pdfFont.widthOfTextAtSize(ch, 10); out += ch; } catch (e) { out += '?'; }
  }
  return out;
}

function measure(text, weight, size, ls) {
  const f = state.fonts[weight];
  let w = 0;
  try { w = f.pdfFont.widthOfTextAtSize(text, size); }
  catch (e) { w = f.pdfFont.widthOfTextAtSize(safeText(text, weight), size); }
  if (ls) w += ls * Math.max(0, text.length - 1);
  return w;
}

function wrapText(text, weight, size, maxWidth) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  for (const word of words) {
    const cand = cur ? cur + ' ' + word : word;
    if (cur && measure(cand, weight, size) > maxWidth) {
      lines.push(cur);
      cur = word;
    } else {
      cur = cand;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
}

function shrinkToFit(text, weight, size, maxWidth, minSize) {
  let s = size;
  while (s > (minSize || 10) && measure(text, weight, s) > maxWidth) s -= 0.5;
  return s;
}

/* =====================================================================
   Layout – exakte Masse aus Zertifikat_neu.pdf
   Alle Angaben in pt, y = Abstand von der Seiten-Oberkante (Baseline).
   ===================================================================== */

function layoutCertificate(c) {
  const items = [];
  const cx = PAGE_W / 2;
  const v = c.values;

  items.push({ type: 'logo', design: c.design, cx, yTop: 92, boxW: 190, boxH: 82 });

  const T = (text, opts) => {
    if (text == null || text === '') return;
    items.push(Object.assign({ type: 'text', text: String(text), align: 'center', x: cx, weight: 'regular', color: COL_TEXT, ls: 0 }, opts));
  };
  const R = (x0, x1, y, lw) => items.push({ type: 'rule', x0, x1, y, lw: lw || 0.5, color: COL_TEXT });

  if (c.variant === 'kurs') {
    /* --- Variante A: Kurs-Zertifikat (1:1 gemäss Vorlage) --- */
    T(v.title, { size: 48, y: 239.39 });
    T(v.intro, { size: 18, y: 281.39 });

    // Kursname, fett 24pt – bei Überlänge automatisch verkleinern
    const courseSize = shrinkToFit(v.courseName || '', 'bold', 24, 470, 15);
    T(v.courseName, { weight: 'bold', size: courseSize, y: 325.89 });

    T(v.presentedTo, { size: 18, y: 378.39 });

    // Name über der Linie
    if (c.person.name) {
      const nameWeight = state.fonts.heavy && !state.fonts.heavy.isFallback ? 'heavy' : 'bold';
      const nameSize = shrinkToFit(c.person.name, nameWeight, 22, 286, 12);
      T(c.person.name, { weight: nameWeight, size: nameSize, y: 412.5 });
    }
    R(151, 447, 418, 0.5);

    // Kurstage: {{datum1}}/{{datum2}} ersetzen; ohne Datum bleibt die Linie leer
    const dates = { datum1: formatDate(c.person.datum1), datum2: formatDate(c.person.datum2) };
    let ky = 454.08;
    for (const rawLine of String(v.kurstage || '').split('\n')) {
      let line = rawLine;
      let blank = false;
      line = line.replace(/\{\{\s*(datum1|datum2)\s*\}\}/g, (m, key) => {
        if (dates[key]) return dates[key];
        blank = true;
        return '';
      });
      line = line.replace(/\s+$/, '');
      if (line) {
        T(line, { size: 13, y: ky });
        if (blank) {
          const w = measure(line, 'regular', 13);
          R(cx + w / 2 + 4.3, cx + w / 2 + 83.3, ky, 0.5);
        }
      }
      ky += 18;
    }

    T(v.inhaltTitle, { weight: 'bold', size: 13, y: 508.4 });
    let iy = 526.09;
    for (const line of String(v.inhalt || '').split('\n')) {
      if (line.trim()) T(line.trim(), { size: 13, y: iy });
      iy += 18;
    }

    // Signaturblock (linksbündig ab x=206.7, Linien wie in der Vorlage)
    const sig = [
      [v.labelKursleiter, c.person.kursleiter || ''],
      [v.labelOrtDatum, c.person.ausstellungsdatum ? `${c.person.ort ? c.person.ort + ', ' : ''}${formatDate(c.person.ausstellungsdatum)}` : ''],
      [v.labelUnterschrift, ''],
    ];
    let sy = 648.92;
    for (const [label, value] of sig) {
      if (label) {
        T(label, { align: 'left', x: 206.67, size: 12, y: sy });
        const lw = measure(label, 'regular', 12);
        const rx0 = 206.67 + lw + 4.3;
        const rx1 = rx0 + 124.5;
        R(rx0, rx1, sy + 2.1, 0.3);
        if (value) {
          const vs = shrinkToFit(value, 'regular', 12, 120, 8);
          const vw = measure(value, 'regular', vs);
          T(value, { align: 'left', x: rx0 + (124.5 - vw) / 2, size: vs, y: sy });
        }
      }
      sy += 20;
    }

    // Fusszeilen
    let fy = 717.92;
    for (const line of String(v.footerAddress || '').split('\n')) {
      if (line.trim()) T(line.trim(), { size: 9, y: fy });
      fy += 12;
    }
    T(v.footerNote, { weight: 'bold', size: 10, y: 752.54 });

    T(`${v.idLabel || 'Zertifikat-ID'}: ${c.certId}`, { size: 8, y: 766, color: COL_SOFT });

  } else {
    /* --- Variante B: Verleihungs-Zertifikat (Design-Sprache der Vorlage) --- */
    T(v.headline, { weight: 'bold', size: 13, ls: 2.6, y: 258 });

    if (c.person.name) {
      const nameSize = shrinkToFit(c.person.name, 'regular', 40, 470, 20);
      T(c.person.name, { size: nameSize, y: 330 });
    }
    R(151, 447, 348, 0.5);

    T(v.midline, { weight: 'bold', size: 13, ls: 2.6, y: 412 });

    let cy = 462;
    const courseLines = wrapText(v.courseName || '', 'bold', 24, 470);
    for (const line of courseLines) {
      T(line, { weight: 'bold', size: 24, y: cy });
      cy += 30;
    }

    let suy = cy + 12;
    for (const line of wrapText(v.subtitle || '', 'regular', 14, 470)) {
      T(line, { size: 14, y: suy });
      suy += 19;
    }

    if (c.person.ausstellungsdatum) {
      T(`${v.issuedLabel || 'Ausgestellt am'}: ${formatDate(c.person.ausstellungsdatum)}`, { size: 13, y: 610 });
    }
    T(`${v.idLabel || 'Zertifikat-ID'}: ${c.certId}`, { size: 11, y: 636, color: COL_SOFT });

    let fy = 717.92;
    for (const line of String(v.footerAddress || '').split('\n')) {
      if (line.trim()) T(line.trim(), { size: 9, y: fy });
      fy += 12;
    }
    T(v.footerNote, { weight: 'bold', size: 10, y: 752.54 });
  }

  return items;
}

/* =====================================================================
   Vorschau (HTML)
   ===================================================================== */

function renderPreview() {
  if (!state.fonts.regular) return; // Assets noch nicht geladen
  const c = collectCertFromForm();
  if (!c) return;

  const page = $('preview-page');
  const wrap = $('preview-wrap');
  const s = Math.max(1, wrap.clientWidth) / PAGE_W; // px pro pt
  page.style.width = wrap.clientWidth + 'px';
  page.style.height = PAGE_H * s + 'px';

  const design = DESIGNS[c.design];
  const img = state.images[c.design];
  page.style.backgroundImage = img && img.background ? `url("${img.background.url}")` : 'none';
  page.style.backgroundColor = '#fdfdfb';

  const badge = $('preview-design-badge');
  badge.textContent = design.label;
  badge.className = 'design-badge ' + c.design;

  const fontFamily = state.fontCssReady
    ? "'FS Joey', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
    : "'Helvetica Neue', Helvetica, Arial, sans-serif";
  const cssWeight = { regular: 400, bold: 700, heavy: 900 };

  page.innerHTML = '';
  for (const it of layoutCertificate(c)) {
    if (it.type === 'logo') {
      const div = document.createElement('div');
      div.className = 'pv-logo';
      div.style.left = (it.cx - it.boxW / 2) * s + 'px';
      div.style.top = it.yTop * s + 'px';
      div.style.width = it.boxW * s + 'px';
      div.style.height = it.boxH * s + 'px';
      if (img && img.logo) {
        const im = document.createElement('img');
        im.src = img.logo.url;
        im.alt = '';
        div.appendChild(im);
      } else {
        const ph = document.createElement('div');
        ph.className = 'pv-logo-placeholder';
        ph.textContent = design.label + ' Logo';
        div.appendChild(ph);
      }
      page.appendChild(div);
    } else if (it.type === 'rule') {
      const div = document.createElement('div');
      div.className = 'pv-rule';
      div.style.left = it.x0 * s + 'px';
      div.style.top = (it.y - it.lw / 2) * s + 'px';
      div.style.width = (it.x1 - it.x0) * s + 'px';
      div.style.height = Math.max(1, it.lw * s) + 'px';
      div.style.background = it.color;
      page.appendChild(div);
    } else {
      const f = state.fonts[it.weight];
      const div = document.createElement('div');
      div.className = 'pv-item';
      const fs = it.size * s;
      const lh = (f.asc + f.desc) * fs;
      div.style.top = (it.y - f.asc * it.size) * s + 'px';
      div.style.fontSize = fs + 'px';
      div.style.lineHeight = lh + 'px';
      div.style.fontFamily = fontFamily;
      div.style.fontWeight = cssWeight[it.weight];
      div.style.color = it.color;
      if (it.ls) div.style.letterSpacing = it.ls * s + 'px';
      if (it.align === 'left') {
        div.style.left = it.x * s + 'px';
        div.style.width = 'auto';
        div.style.textAlign = 'left';
      }
      div.textContent = it.text;
      page.appendChild(div);
    }
  }
}

/* =====================================================================
   PDF-Export (mit eingebetteten Schriften)
   ===================================================================== */

async function buildPdf(c) {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  const fonts = {};
  for (const weight of ['regular', 'bold', 'heavy']) {
    const f = state.fonts[weight];
    // Vollständig einbetten (kein Subsetting): fontkit-Subsetting ist mit
    // manchen OTF/CFF-Fonts fehlerhaft, und die FS-Joey-Dateien sind klein.
    fonts[weight] = f.bytes
      ? await doc.embedFont(f.bytes, { subset: false })
      : await doc.embedFont(weight === 'regular' ? StandardFonts.Helvetica : StandardFonts.HelveticaBold);
  }

  const page = doc.addPage([PAGE_W, PAGE_H]);
  const img = state.images[c.design];

  // Hintergrund flächendeckend (cover)
  if (img && img.background) {
    const bg = img.background.type === 'png'
      ? await doc.embedPng(img.background.bytes)
      : await doc.embedJpg(img.background.bytes);
    const scale = Math.max(PAGE_W / bg.width, PAGE_H / bg.height);
    const w = bg.width * scale, h = bg.height * scale;
    page.drawImage(bg, { x: (PAGE_W - w) / 2, y: (PAGE_H - h) / 2, width: w, height: h });
  }

  for (const it of layoutCertificate(c)) {
    if (it.type === 'logo') {
      if (!(img && img.logo)) continue;
      const lg = img.logo.type === 'png'
        ? await doc.embedPng(img.logo.bytes)
        : await doc.embedJpg(img.logo.bytes);
      const k = Math.min(it.boxW / lg.width, it.boxH / lg.height);
      const w = lg.width * k, h = lg.height * k;
      page.drawImage(lg, {
        x: it.cx - w / 2,
        y: PAGE_H - it.yTop - it.boxH + (it.boxH - h) / 2,
        width: w,
        height: h,
      });
    } else if (it.type === 'rule') {
      const [r, g, b] = hexToRgb01(it.color);
      page.drawLine({
        start: { x: it.x0, y: PAGE_H - it.y },
        end: { x: it.x1, y: PAGE_H - it.y },
        thickness: it.lw,
        color: rgb(r, g, b),
      });
    } else {
      const font = fonts[it.weight];
      const stateFont = state.fonts[it.weight];
      const text = safeText(it.text, it.weight);
      const size = it.size;
      const [r, g, b] = hexToRgb01(it.color);
      const color = rgb(r, g, b);
      const width = measure(text, it.weight, size, it.ls);
      let x = it.align === 'left' ? it.x : it.x - width / 2;
      const y = PAGE_H - it.y;
      if (it.ls) {
        for (const ch of text) {
          page.drawText(ch, { x, y, size, font, color });
          x += stateFont.pdfFont.widthOfTextAtSize(ch, size) + it.ls;
        }
      } else {
        page.drawText(text, { x, y, size, font, color });
      }
    }
  }

  doc.setTitle(`Zertifikat – ${c.person.name || ''}`.trim());
  doc.setSubject(c.values.courseName || '');
  doc.setAuthor(DESIGNS[c.design].label);
  doc.setCreator('Diplom Builder');
  doc.setKeywords([c.certId]);

  return doc.save();
}

function pdfFilename(c) {
  const name = (c.person.name || 'Zertifikat').replace(/[^\wäöüÄÖÜß -]/g, '').trim().replace(/\s+/g, '_');
  return `Zertifikat_${name}_${c.certId}.pdf`;
}

async function exportCurrentPdf() {
  const c = collectCertFromForm();
  if (!c) return;
  if (!c.person.name) { toast('Bitte zuerst einen Namen erfassen.', true); $('f-name').focus(); return; }
  try {
    const bytes = await buildPdf(c);
    download(bytes, pdfFilename(c));
    toast('PDF exportiert.');
  } catch (e) {
    console.error(e);
    toast('PDF-Export fehlgeschlagen: ' + e.message, true);
  }
}

/* =====================================================================
   Formular (Builder)
   ===================================================================== */

function currentTemplate() {
  return state.templates.find((t) => t.id === $('f-template').value) || state.templates[0];
}

function populateTemplateSelect() {
  const sel = $('f-template');
  const groups = {};
  for (const t of state.templates) {
    (groups[t.design] = groups[t.design] || []).push(t);
  }
  sel.innerHTML = '';
  for (const key of Object.keys(groups)) {
    const og = document.createElement('optgroup');
    og.label = DESIGNS[key] ? DESIGNS[key].label : key;
    for (const t of groups[key]) {
      const o = document.createElement('option');
      o.value = t.id;
      o.textContent = t.name;
      og.appendChild(o);
    }
    sel.appendChild(og);
  }
}

function buildDynamicFields(tpl, values, person) {
  const variant = VARIANTS[tpl.variant];

  const pWrap = $('dyn-person-fields');
  pWrap.innerHTML = '';
  for (const [key, label, type] of variant.personFields) {
    const lab = document.createElement('label');
    lab.className = 'field';
    lab.innerHTML = `<span>${esc(label)}</span>`;
    const inp = document.createElement('input');
    inp.type = type;
    inp.className = 'input';
    inp.id = 'p-' + key;
    inp.value = person && person[key] != null ? person[key] : (key === 'ort' ? (tpl.values.ort || '') : (type === 'date' ? todayIso() : ''));
    lab.appendChild(inp);
    pWrap.appendChild(lab);
  }

  const tWrap = $('dyn-text-fields');
  tWrap.innerHTML = '';
  for (const [key, label, type] of variant.textFields) {
    const lab = document.createElement('label');
    lab.className = 'field';
    lab.innerHTML = `<span>${esc(label)}</span>`;
    let inp;
    if (type === 'textarea') {
      inp = document.createElement('textarea');
      inp.rows = 3;
    } else {
      inp = document.createElement('input');
      inp.type = 'text';
    }
    inp.className = 'input';
    inp.id = 'v-' + key;
    inp.value = values && values[key] != null ? values[key] : (tpl.values[key] || '');
    lab.appendChild(inp);
    tWrap.appendChild(lab);
  }
}

function resetFormForTemplate(tpl, keepName) {
  const name = keepName ? $('f-name').value : '';
  buildDynamicFields(tpl, null, null);
  $('f-name').value = name;
  $('f-certid').value = generateCertId(tpl.idPrefix);
  renderPreview();
}

function collectCertFromForm() {
  const tpl = currentTemplate();
  if (!tpl) return null;
  const variant = VARIANTS[tpl.variant];

  const values = {};
  for (const [key] of variant.textFields) {
    const el = $('v-' + key);
    values[key] = el ? el.value : (tpl.values[key] || '');
  }
  const person = { name: $('f-name').value.trim() };
  for (const [key] of variant.personFields) {
    const el = $('p-' + key);
    person[key] = el ? el.value : '';
  }

  return {
    id: state.editingCertId || null,
    certId: $('f-certid').value.trim() || generateCertId(tpl.idPrefix),
    templateId: tpl.id,
    design: tpl.design,
    variant: tpl.variant,
    values,
    person,
  };
}

function saveCurrentCert() {
  const c = collectCertFromForm();
  if (!c) return null;
  if (!c.person.name) { toast('Bitte zuerst einen Namen erfassen.', true); $('f-name').focus(); return null; }

  if (state.editingCertId) {
    const idx = state.certs.findIndex((x) => x.id === state.editingCertId);
    if (idx >= 0) {
      c.id = state.editingCertId;
      c.createdAt = state.certs[idx].createdAt;
      c.updatedAt = Date.now();
      state.certs[idx] = c;
    }
  } else {
    c.id = uid();
    c.createdAt = Date.now();
    c.updatedAt = c.createdAt;
    state.certs.unshift(c);
    state.editingCertId = c.id;
    $('edit-mode-banner').classList.remove('hidden');
  }
  saveCerts();
  renderSavedList();
  toast('Zertifikat gespeichert.');
  return c;
}

function loadCertIntoForm(cert) {
  const tpl = state.templates.find((t) => t.id === cert.templateId);
  // Vorlage könnte gelöscht sein – dann synthetische Vorlage aus dem Zertifikat
  if (tpl) {
    $('f-template').value = tpl.id;
    buildDynamicFields(tpl, cert.values, cert.person);
  } else {
    const synth = { id: cert.templateId, variant: cert.variant, design: cert.design, values: cert.values, idPrefix: 'ZERT' };
    state.templates.push(synth);
    populateTemplateSelect();
    $('f-template').value = synth.id;
    buildDynamicFields(synth, cert.values, cert.person);
  }
  $('f-name').value = cert.person.name || '';
  $('f-certid').value = cert.certId;
  state.editingCertId = cert.id;
  $('edit-mode-banner').classList.remove('hidden');
  switchTab('builder');
  renderPreview();
}

function exitEditMode() {
  state.editingCertId = null;
  $('edit-mode-banner').classList.add('hidden');
  resetFormForTemplate(currentTemplate(), false);
}

/* =====================================================================
   Gespeicherte Zertifikate
   ===================================================================== */

function renderSavedList() {
  const list = $('saved-list');
  const q = ($('saved-search').value || '').toLowerCase();
  const certs = state.certs.filter((c) => {
    if (!q) return true;
    return [c.person.name, c.values.courseName, c.certId].join(' ').toLowerCase().includes(q);
  });

  $('saved-empty').classList.toggle('hidden', state.certs.length > 0);
  list.innerHTML = '';

  for (const c of certs) {
    const card = document.createElement('div');
    card.className = 'saved-card';
    const design = DESIGNS[c.design] || { label: c.design };
    const date = c.person.ausstellungsdatum ? formatDate(c.person.ausstellungsdatum) : '';
    card.innerHTML = `
      <div class="saved-card-main">
        <div class="saved-card-name">${esc(c.person.name)}</div>
        <div class="saved-card-meta">${esc(c.values.courseName || '')}${date ? ' · ' + esc(date) : ''} · <span class="design-badge ${esc(c.design)}">${esc(design.label)}</span></div>
      </div>
      <span class="saved-card-id">${esc(c.certId)}</span>
      <div class="saved-card-actions">
        <button class="btn btn-secondary btn-sm" data-act="pdf">PDF</button>
        <button class="btn btn-ghost btn-sm" data-act="edit">Bearbeiten</button>
        <button class="btn btn-ghost btn-sm" data-act="dup">Duplizieren</button>
        <button class="btn btn-danger-ghost btn-sm" data-act="del">Löschen</button>
      </div>`;
    card.addEventListener('click', async (ev) => {
      const act = ev.target.dataset && ev.target.dataset.act;
      if (!act) return;
      if (act === 'pdf') {
        try {
          const bytes = await buildPdf(c);
          download(bytes, pdfFilename(c));
        } catch (e) { console.error(e); toast('PDF-Export fehlgeschlagen.', true); }
      } else if (act === 'edit') {
        loadCertIntoForm(c);
      } else if (act === 'dup') {
        const copy = JSON.parse(JSON.stringify(c));
        copy.id = null;
        const tpl = state.templates.find((t) => t.id === c.templateId);
        copy.certId = generateCertId(tpl ? tpl.idPrefix : 'ZERT');
        state.editingCertId = null;
        loadCertIntoFormAsNew(copy);
      } else if (act === 'del') {
        if (confirm(`Zertifikat von «${c.person.name}» (${c.certId}) wirklich löschen?`)) {
          state.certs = state.certs.filter((x) => x.id !== c.id);
          if (state.editingCertId === c.id) exitEditMode();
          saveCerts();
          renderSavedList();
          toast('Zertifikat gelöscht.');
        }
      }
    });
    list.appendChild(card);
  }
}

function loadCertIntoFormAsNew(cert) {
  const tpl = state.templates.find((t) => t.id === cert.templateId);
  if (tpl) {
    $('f-template').value = tpl.id;
    buildDynamicFields(tpl, cert.values, cert.person);
  }
  $('f-name').value = cert.person.name || '';
  $('f-certid').value = cert.certId;
  state.editingCertId = null;
  $('edit-mode-banner').classList.add('hidden');
  switchTab('builder');
  renderPreview();
}

/* ---------- Backup ---------- */

function exportBackup() {
  const data = { exportedAt: new Date().toISOString(), templates: state.templates, certs: state.certs };
  download(new TextEncoder().encode(JSON.stringify(data, null, 2)), `diplom-builder-backup-${todayIso()}.json`, 'application/json');
  toast('Backup exportiert.');
}

function importBackup(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || !Array.isArray(data.certs)) throw new Error('Ungültiges Format');
      let added = 0;
      for (const c of data.certs) {
        if (!state.certs.some((x) => x.certId === c.certId)) { state.certs.push(c); added++; }
      }
      if (Array.isArray(data.templates)) {
        for (const t of data.templates) {
          if (!state.templates.some((x) => x.id === t.id)) state.templates.push(t);
        }
        saveTemplates();
        populateTemplateSelect();
        renderTemplatesList();
      }
      saveCerts();
      renderSavedList();
      toast(`Backup importiert (${added} neue Zertifikate).`);
    } catch (e) {
      toast('Import fehlgeschlagen: ' + e.message, true);
    }
  };
  reader.readAsText(file);
}

/* =====================================================================
   Vorlagen-Verwaltung
   ===================================================================== */

function renderTemplatesList() {
  const list = $('templates-list');
  list.innerHTML = '';

  for (const tpl of state.templates) {
    const variant = VARIANTS[tpl.variant];
    if (!variant) continue;
    const isDefault = DEFAULT_TEMPLATES.some((d) => d.id === tpl.id);
    const card = document.createElement('div');
    card.className = 'template-card';

    let fieldsHtml = '';
    for (const [key, label, type] of variant.textFields) {
      const val = tpl.values[key] || '';
      fieldsHtml += `<label class="field"><span>${esc(label)}</span>` +
        (type === 'textarea'
          ? `<textarea class="input" rows="3" data-key="${esc(key)}">${esc(val)}</textarea>`
          : `<input type="text" class="input" data-key="${esc(key)}" value="${esc(val)}">`) +
        '</label>';
    }
    if (tpl.variant === 'kurs') {
      fieldsHtml += `<label class="field"><span>Standard-Ort</span><input type="text" class="input" data-key="ort" value="${esc(tpl.values.ort || '')}"></label>`;
    }

    card.innerHTML = `
      <div class="template-card-head">
        <input type="text" class="input" data-meta="name" value="${esc(tpl.name)}" title="Name der Vorlage">
        <span class="design-badge ${esc(tpl.design)}">${esc(DESIGNS[tpl.design] ? DESIGNS[tpl.design].label : tpl.design)}</span>
      </div>
      <div class="field-row">
        <label class="field"><span>Design</span>
          <select class="input" data-meta="design">
            ${Object.keys(DESIGNS).map((k) => `<option value="${k}" ${tpl.design === k ? 'selected' : ''}>${esc(DESIGNS[k].label)}</option>`).join('')}
          </select></label>
        <label class="field"><span>Layout</span>
          <select class="input" data-meta="variant">
            ${Object.keys(VARIANTS).map((k) => `<option value="${k}" ${tpl.variant === k ? 'selected' : ''}>${esc(VARIANTS[k].label)}</option>`).join('')}
          </select></label>
        <label class="field"><span>ID-Präfix</span>
          <input type="text" class="input" data-meta="idPrefix" value="${esc(tpl.idPrefix || '')}"></label>
      </div>
      ${fieldsHtml}
      <div class="template-card-foot">
        <button class="btn btn-primary btn-sm" data-act="save">Vorlage speichern</button>
        ${isDefault ? '<button class="btn btn-ghost btn-sm" data-act="reset">Auf Standard zurücksetzen</button>' : ''}
        <span class="spacer"></span>
        ${!isDefault ? '<button class="btn btn-danger-ghost btn-sm" data-act="del">Löschen</button>' : ''}
      </div>`;

    card.addEventListener('click', (ev) => {
      const act = ev.target.dataset && ev.target.dataset.act;
      if (!act) return;
      if (act === 'save') {
        tpl.name = card.querySelector('[data-meta="name"]').value.trim() || tpl.name;
        tpl.design = card.querySelector('[data-meta="design"]').value;
        const newVariant = card.querySelector('[data-meta="variant"]').value;
        tpl.idPrefix = card.querySelector('[data-meta="idPrefix"]').value.trim() || tpl.idPrefix;
        for (const inp of card.querySelectorAll('[data-key]')) {
          tpl.values[inp.dataset.key] = inp.value;
        }
        if (newVariant !== tpl.variant) {
          tpl.variant = newVariant;
          // fehlende Feldwerte der neuen Variante mit Defaults auffüllen
          const source = DEFAULT_TEMPLATES.find((d) => d.variant === newVariant);
          if (source) {
            for (const [key] of VARIANTS[newVariant].textFields) {
              if (tpl.values[key] == null) tpl.values[key] = source.values[key] || '';
            }
          }
          renderTemplatesList();
        }
        saveTemplates();
        populateTemplateSelect();
        $('f-template').value = tpl.id;
        resetFormForTemplate(tpl, true);
        toast('Vorlage gespeichert.');
      } else if (act === 'reset') {
        const def = DEFAULT_TEMPLATES.find((d) => d.id === tpl.id);
        if (def && confirm(`Vorlage «${tpl.name}» auf den Standard zurücksetzen?`)) {
          Object.assign(tpl, JSON.parse(JSON.stringify(def)));
          saveTemplates();
          renderTemplatesList();
          populateTemplateSelect();
          toast('Vorlage zurückgesetzt.');
        }
      } else if (act === 'del') {
        if (confirm(`Vorlage «${tpl.name}» löschen? Gespeicherte Zertifikate bleiben erhalten.`)) {
          state.templates = state.templates.filter((t) => t.id !== tpl.id);
          saveTemplates();
          renderTemplatesList();
          populateTemplateSelect();
          resetFormForTemplate(currentTemplate(), false);
          toast('Vorlage gelöscht.');
        }
      }
    });

    list.appendChild(card);
  }
}

function createNewTemplate() {
  const base = DEFAULT_TEMPLATES[2]; // Verleihungs-Layout als Ausgangspunkt
  const tpl = JSON.parse(JSON.stringify(base));
  tpl.id = 't' + Date.now().toString(36);
  tpl.name = 'Neue Vorlage';
  tpl.idPrefix = 'ZERT';
  state.templates.push(tpl);
  saveTemplates();
  renderTemplatesList();
  populateTemplateSelect();
  toast('Neue Vorlage angelegt.');
}

/* =====================================================================
   Tabs, Login, Events
   ===================================================================== */

function switchTab(tab) {
  for (const btn of document.querySelectorAll('.tab-btn')) {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  }
  for (const panel of document.querySelectorAll('.tab-panel')) {
    panel.classList.toggle('active', panel.id === 'tab-' + tab);
  }
  if (tab === 'builder') renderPreview();
}

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function handleLogin(ev) {
  ev.preventDefault();
  const pw = $('login-password').value;
  const hash = await sha256Hex(pw);
  if (hash === PASS_HASH) {
    sessionStorage.setItem(SS_AUTH, '1');
    $('login-screen').classList.add('hidden');
    $('app').classList.remove('hidden');
    renderPreview();
  } else {
    $('login-error').classList.remove('hidden');
    const card = document.querySelector('.login-card');
    card.classList.remove('shake');
    void card.offsetWidth;
    card.classList.add('shake');
  }
}

let previewTimer = null;
function schedulePreview() {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(renderPreview, 120);
}

function bindEvents() {
  $('login-form').addEventListener('submit', handleLogin);
  $('logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem(SS_AUTH);
    location.reload();
  });

  for (const btn of document.querySelectorAll('.tab-btn')) {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  }

  $('f-template').addEventListener('change', () => {
    state.editingCertId = null;
    $('edit-mode-banner').classList.add('hidden');
    resetFormForTemplate(currentTemplate(), true);
  });

  $('f-certid-regen').addEventListener('click', () => {
    $('f-certid').value = generateCertId(currentTemplate().idPrefix);
    schedulePreview();
  });

  document.querySelector('.builder-form').addEventListener('input', schedulePreview);

  $('btn-export').addEventListener('click', exportCurrentPdf);
  $('btn-save').addEventListener('click', saveCurrentCert);
  $('btn-save-export').addEventListener('click', async () => {
    const c = saveCurrentCert();
    if (c) {
      try {
        const bytes = await buildPdf(c);
        download(bytes, pdfFilename(c));
      } catch (e) { console.error(e); toast('PDF-Export fehlgeschlagen.', true); }
    }
  });

  $('edit-mode-cancel').addEventListener('click', exitEditMode);

  $('saved-search').addEventListener('input', renderSavedList);
  $('btn-backup-export').addEventListener('click', exportBackup);
  $('btn-backup-import').addEventListener('click', () => $('backup-file-input').click());
  $('backup-file-input').addEventListener('change', (ev) => {
    if (ev.target.files[0]) importBackup(ev.target.files[0]);
    ev.target.value = '';
  });

  $('btn-template-new').addEventListener('click', createNewTemplate);

  $('asset-banner-close').addEventListener('click', () => $('asset-banner').classList.add('hidden'));

  window.addEventListener('resize', schedulePreview);
}

/* =====================================================================
   Init
   ===================================================================== */

async function init() {
  bindEvents();
  loadTemplates();
  loadCerts();
  updateSavedCount();

  // Bestehende Session sofort wiederherstellen (Assets laden im Hintergrund)
  if (sessionStorage.getItem(SS_AUTH) === '1') {
    $('login-screen').classList.add('hidden');
    $('app').classList.remove('hidden');
  }

  // Formular sofort aufbauen – Assets (Fonts/Bilder) laden danach im
  // Hintergrund, damit frühe Eingaben nicht überschrieben werden.
  populateTemplateSelect();
  resetFormForTemplate(currentTemplate(), false);
  renderSavedList();
  renderTemplatesList();

  await loadFonts();
  await loadImages();
  showAssetBanner();
  renderPreview();
}

// Für automatisierte Tests
window.__diplomBuilder = { buildPdf, collectCertFromForm, layoutCertificate, state };

init();
