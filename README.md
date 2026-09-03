# Multitool

A small collection of browser tools served by one Node.js application.

## Applications

- `/`: Multitool launcher and shared navigation.
- `/search/`: UK and Netherlands licensed-sponsor search.
- `/qr/`: client-side QR generator.
- `/pdf/`: server-side PDF merger for images, PDF and DOCX files.
- `/badge/`: client-side badge maker.
- `/ftir/`: client-side FTIR spectrum viewer.
- `/delhi/`: embedded production build of the separate `delphitools` project.
- `/en/tools/` on `pdf.nikolaisemenov.com`: external PDFcraft application.

## Technology stack

### Multitool server

- Node.js 20 runtime.
- Express 5 HTTP server and static-file hosting.
- `axios` for public-register requests: MIT.
- `cheerio` for HTML parsing: BSD-2-Clause.
- `multer` for multipart uploads: MIT.
- `mime-types` for content detection: MIT.
- `pdf-lib` for PDF creation and merging: MIT.
- `mammoth` for DOCX-to-HTML conversion: BSD-2-Clause.
- `libreoffice-convert` for DOCX conversion: MIT.
- Puppeteer and Chromium for the DOCX conversion fallback: Apache-2.0 for Puppeteer; Chromium has its own third-party notices.

### Browser applications

- Plain HTML, CSS and JavaScript for the Multitool launcher, sponsor search
	and FTIR viewer.
- QR generation uses QR Code Styling and bundled QR libraries under their
	respective MIT licenses.
- Badge maker uses bundled client-side libraries with their own notices.
- `delphitools` is an Ember.js application built with Embroider and Vite.
	Its original project code is 0BSD.

### Embedded delphitools components

The build in `public/delhi/` contains the following notable components:

- MuPDF: AGPL-3.0-or-later.
- MediaInfoLib: BSD-2-Clause.
- PDF.js: Apache-2.0.
- Math.js: Apache-2.0.
- Fabric.js, JSZip, ProseMirror and most UI helpers: MIT.
- MediaBunny and Satori: MPL-2.0.
- `@resvg/resvg-js`: MPL-2.0.
- ImageTracer: Unlicense.
- Image codecs in `compress/`: Apache-2.0, BSD-style and zlib licenses.
- libjxl in `jxl/`: Apache-2.0 wrapper and BSD-3-Clause library.
- iA Writer Quattro and Noto Sans Shavian: SIL Open Font License 1.1.
- CMU Pronouncing Dictionary data: BSD-2-Clause.
- EFF long wordlist: CC BY 3.0.
- RawTherapee-derived LUTs: CC BY-SA 4.0.

The full notices for this embedded build are in
`public/delhi/LICENSE.delphitools.txt` and
`public/delhi/ACKNOWLEDGEMENTS.delphitools.md`. Individual codec and MuPDF
license files are kept beside their respective assets.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:3002`.

Run the tests with:

```bash
npm test
```

## Build the embedded delphitools app

The source project lives separately at
`/Users/nikolays/Library/CloudStorage/Dropbox/DSGNSITE/dephi/delphitools`.
Build it with `/delhi/` as its base path directly into this repository:

```bash
cd /Users/nikolays/Library/CloudStorage/Dropbox/DSGNSITE/dephi/delphitools
DT_BASE_PATH=/delhi/ npm run build -- \
	--outDir /Users/nikolays/Library/CloudStorage/Dropbox/DSGNSITE/Projects/multitool/public/delhi
```

## Docker

```bash
docker compose up --build
```

The image includes Node.js, LibreOffice Writer, Chromium and the fonts needed
by the PDF conversion fallback. The server listens on port `3002`.

## Privacy and external services

The PDF merger keeps uploaded files in memory for the duration of a request
and does not intentionally persist them. The sponsor search requests data
from the public GOV.UK and IND registers. Some browser tools may load Google
Fonts, public CDNs or runtime models; those resources remain subject to their
providers' terms.

## Licensing

Original Multitool code is released under the Zero-Clause BSD license in
`LICENSE`. Third-party software and bundled applications retain their own
licenses; see `THIRD-PARTY-NOTICES.md` and the notices in `public/delhi/`.
