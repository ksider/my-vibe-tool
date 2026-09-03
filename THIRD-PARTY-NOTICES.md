# Third-party notices

This repository contains original Multitool code and redistributed third-party
software. The 0BSD license in `LICENSE` applies only to the original
Multitool code.

## Runtime dependencies

- `express`: MIT
- `axios`: MIT
- `cheerio`: BSD-2-Clause
- `multer`: MIT
- `mime-types`: MIT
- `mammoth`: BSD-2-Clause
- `pdf-lib`: MIT
- `libreoffice-convert`: MIT
- `puppeteer`: Apache-2.0

The complete dependency lockfile includes the licenses of transitive
packages. Dependency licenses are not replaced by the Multitool license.

## Bundled delphitools

`public/delhi/` is a production build of the separate `delphitools` project.
Its original code is 0BSD, but the build contains components under their own
licenses. The source project license and acknowledgements are in:

- `public/delhi/LICENSE.delphitools.txt`
- `public/delhi/ACKNOWLEDGEMENTS.delphitools.md`

Important bundled components include:

- MuPDF: AGPL-3.0-or-later. Full notice: `public/delhi/mupdf/LICENSE.mupdf.txt`.
- MediaInfoLib: BSD-2-Clause. Full notice: `public/delhi/mediainfo/LICENSE.mediainfo.txt`.
- Image codecs in `public/delhi/compress/`: Apache-2.0, BSD-style and zlib notices in the `LICENSE.*.md` files.
- libjxl in `public/delhi/jxl/`: Apache-2.0 wrapper and BSD-3-Clause library.
- Fonts in `public/delhi/fonts/`: SIL Open Font License 1.1.
- ImageTracer: Unlicense. The notice is included in its source file.
- Other bundled JavaScript and data retain their upstream MIT, Apache-2.0, BSD, MPL-2.0, CC BY, CC BY-SA or other applicable licenses.

For the full upstream inventory, see `public/delhi/ACKNOWLEDGEMENTS.delphitools.md`.

## External runtime resources

Some applications may load external resources such as Google Fonts or
browser-side models/CDNs. Those resources remain subject to their providers'
terms and licenses. The GOV.UK and IND public-register endpoints used by the
sponsor search are external services, not part of this repository.
