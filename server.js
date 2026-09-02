const express = require('express');
const multer = require('multer');
const path = require('path');
const mime = require('mime-types');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');
const mammoth = require('mammoth');
const puppeteer = require('puppeteer');
const { PDFDocument, PageSizes } = require('pdf-lib');
const {
  COUNTRY_ALIASES,
  parseSearchRequest,
  getLatestCsvUrl,
  searchCompanyInNetherlandsByQuery,
  searchCompanyByCsv
} = require('./search');

const app = express();
const PORT = Number(process.env.PORT) || 3002;
const publicDir = path.join(__dirname, 'public');
const delhiDir = path.join(publicDir, 'delhi');
const maxFileSize = 25 * 1024 * 1024;
const maxFiles = 30;
const allowedTypes = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: maxFiles, fileSize: maxFileSize },
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith('image/') || allowedTypes.has(file.mimetype)) {
      return callback(null, true);
    }
    return callback(new Error(`Unsupported file type: ${file.mimetype || 'unknown'}`));
  }
});

app.use(express.static(publicDir));
app.use(express.static(delhiDir, { index: false }));
app.use('/delhi', express.static(delhiDir));
for (const directory of [
  '@embroider', 'art', 'assets', 'characters', 'compress', 'data', 'flags',
  'fonts', 'heroes', 'jxl', 'lib', 'mediainfo', 'mupdf', 'pdfjs-wasm',
  'stickers', 'substrata', 'tiles'
]) {
  app.use(`/${directory}`, express.static(path.join(delhiDir, directory)));
}

function resolveCountry(value) {
  const normalized = String(value || '').trim().toLowerCase().replace(/[^a-z]/g, '');
  return COUNTRY_ALIASES[normalized] || 'uk';
}

async function executeSearch(countryInput, searchTerm) {
  const query = String(searchTerm || '').trim();
  const country = resolveCountry(countryInput);
  if (!query) {
    return { country, query, total: 0, matches: [], error: 'Please enter a company name.' };
  }

  if (country === 'netherlands') {
    const matches = await searchCompanyInNetherlandsByQuery(query);
    return {
      country, query, total: matches.length, matches,
      source: 'IND public register',
      sourceDate: matches[0] ? matches[0].date : null,
      error: matches.length ? null : `No companies matching "${query}" were found in the Netherlands register.`
    };
  }

  const csvUrl = await getLatestCsvUrl();
  if (!csvUrl) {
    return { country: 'uk', query, total: 0, matches: [], error: 'Unable to load the current UK sponsor list.' };
  }

  const matches = await searchCompanyByCsv(csvUrl, query);
  return {
    country: 'uk', query, total: matches.length, matches,
    source: 'GOV.UK sponsor list',
    sourceDate: matches[0] ? matches[0].date : null,
    error: matches.length ? null : `No companies matching "${query}" were found in the UK register.`
  };
}

function isImage(mimetype) { return Boolean(mimetype && mimetype.startsWith('image/')); }
function isPdf(mimetype) { return mimetype === 'application/pdf'; }
function isDocx(mimetype) { return mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; }

async function embedImage(pdfDoc, file) {
  const ext = mime.extension(file.mimetype);
  if (!['png', 'jpg', 'jpeg'].includes(ext)) throw new Error('Only PNG and JPG images are supported.');
  const embedded = ext === 'png' ? await pdfDoc.embedPng(file.buffer) : await pdfDoc.embedJpg(file.buffer);
  const { width, height } = embedded.scale(1);
  const [pageWidth, pageHeight] = width >= height ? [PageSizes.A4[1], PageSizes.A4[0]] : PageSizes.A4;
  const page = pdfDoc.addPage([pageWidth, pageHeight]);
  const margin = 20;
  const scale = Math.min((pageWidth - margin * 2) / width, (pageHeight - margin * 2) / height);
  const renderWidth = width * scale;
  const renderHeight = height * scale;
  page.drawImage(embedded, {
    x: (pageWidth - renderWidth) / 2,
    y: (pageHeight - renderHeight) / 2,
    width: renderWidth,
    height: renderHeight
  });
}

async function appendPdf(pdfDoc, buffer) {
  const source = await PDFDocument.load(buffer);
  const pages = await pdfDoc.copyPages(source, source.getPageIndices());
  pages.forEach(page => pdfDoc.addPage(page));
}

function convertWithSoffice(file) {
  const sofficePath = process.env.SOFFICE_PATH || process.env.LIBREOFFICE_PATH || 'soffice';
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'multitool-docx-'));
  const docxPath = path.join(tempDir, 'input.docx');
  const pdfPath = path.join(tempDir, 'input.pdf');
  fs.writeFileSync(docxPath, file.buffer);

  return new Promise((resolve, reject) => {
    const proc = spawn(sofficePath, ['--headless', '--convert-to', 'pdf', '--outdir', tempDir, docxPath]);
    let stderr = '';
    proc.stderr.on('data', data => { stderr += data.toString(); });
    proc.on('error', reject);
    proc.on('close', code => {
      if (code !== 0 || !fs.existsSync(pdfPath)) {
        reject(new Error(stderr || `soffice exited with code ${code}`));
        return;
      }
      resolve(fs.readFileSync(pdfPath));
    });
  }).finally(() => fs.rmSync(tempDir, { recursive: true, force: true }));
}

async function convertWithPuppeteer(file) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'multitool-docx-'));
  let browser;
  try {
    const { value: html } = await mammoth.convertToHtml({ buffer: file.buffer });
    const htmlPath = path.join(tempDir, 'document.html');
    fs.writeFileSync(htmlPath, `<!doctype html><html><head><meta charset="UTF-8"><style>@page{size:A4;margin:20mm}body{font-family:Arial,sans-serif}</style></head><body>${html}</body></html>`);
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: 'load' });
    return await page.pdf({ format: 'A4', printBackground: true });
  } finally {
    if (browser) await browser.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

async function convertDocxToPdf(file) {
  try { return await convertWithSoffice(file); } catch (error) {
    console.warn(`LibreOffice conversion failed, using Puppeteer fallback: ${error.message}`);
    return convertWithPuppeteer(file);
  }
}

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/search', async (req, res, next) => {
  try {
    const { country, query } = parseSearchRequest([req.query.country || 'uk', req.query.q || '']);
    res.json(await executeSearch(country, query));
  } catch (error) { next(error); }
});

app.post('/api/merge', (req, res, next) => {
  upload.array('files', maxFiles)(req, res, async error => {
    if (error) return next(error);
    const files = req.files || [];
    if (!files.length) return res.status(400).send('No files uploaded');

    try {
      const pdfDoc = await PDFDocument.create();
      for (const file of files) {
        if (isImage(file.mimetype)) await embedImage(pdfDoc, file);
        else if (isPdf(file.mimetype)) await appendPdf(pdfDoc, file.buffer);
        else if (isDocx(file.mimetype)) await appendPdf(pdfDoc, await convertDocxToPdf(file));
      }
      const merged = await pdfDoc.save();
      res.type('application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="merged.pdf"');
      res.send(Buffer.from(merged));
    } catch (mergeError) {
      res.status(400).send(`Failed to merge files: ${mergeError.message}`);
    }
  });
});

app.get('/delhi/{*splat}', (req, res) => res.sendFile(path.join(delhiDir, 'index.html')));
app.get('/{*splat}', (req, res) => res.sendFile(path.join(publicDir, 'index.html')));

app.use((error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') return res.status(413).send(`Each file must be smaller than ${maxFileSize / 1024 / 1024} MB.`);
  if (error.code === 'LIMIT_FILE_COUNT') return res.status(413).send(`You can upload up to ${maxFiles} files.`);
  res.status(400).send(error.message || 'Request failed.');
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => console.log(`Multitool running at http://0.0.0.0:${PORT}`));
}

module.exports = app;
