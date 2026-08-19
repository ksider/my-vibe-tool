# Multitool

One Express application for sponsor search, QR generation and server-side PDF/DOCX merging.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:3000`.

Tabs are available at `/?tab=search`, `/?tab=qr` and `/?tab=pdf`.

## API

- `GET /api/health`
- `GET /api/search?country=uk|netherlands&q=company`
- `POST /api/merge` with repeated multipart field `files`

The merger accepts PNG/JPG images, PDF and DOCX. Files are held in memory for the request and are not persisted. Each file is limited to 25 MB and a request can contain up to 30 files.

DOCX conversion uses LibreOffice first and Puppeteer as a fallback. The Docker image includes both runtimes.

## Docker

```bash
docker compose up --build
```

Open `http://localhost:3000`.
# my-vibe-tool
