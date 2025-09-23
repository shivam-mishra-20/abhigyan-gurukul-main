# Abhigyan Gurukul

React + Vite front-end with Firebase (client + admin SDK) and a small Express server for admin utilities.

## Setup

1. Install dependencies
2. Configure Firebase client in `.env` with values for `VITE_FIREBASE_*` (see `src/firebaseConfig.js`).
3. Ensure `firebase-admin.json` exists at project root (service account for Firestore Admin). Do not commit it.

## Scripts

- `npm run dev` — Start Vite dev server
- `npm run build` — Build client
- `npm run preview` — Preview built client
- `npm run server` — Start Express server (`server.js`)

## Attendance PDF Ingestion

Upload attendance in any PDF format (daily, monthly, yearly). The server parses the PDF and updates Firestore `studentLeaves` with normalized records `{ clockIn, clockOut, dayAndDate }`.

### Configure client → server base URL

Create `.env` in project root and set:

```
VITE_API_BASE=http://localhost:3000
```

Then run:

```
npm run server
npm run dev
```

### How it works

- Daily/tabular PDFs: rows like Name, Class, Clock In, Clock Out, Date.
- Monthly summaries: e.g. `Name, Class: 8A, Month: 2025-07, Days: 20` → creates 20 placeholder day entries (`--:--` times).
- Yearly summaries: e.g. `Name, Class: 8A, Year: 2025, Days: 180` → spreads placeholders from Jan 1.
- Duplicates for same student+class+date are skipped.
- Existing Excel upload flow remains available.

### Using the UI

- Visit Attendance Dashboard (non-student role)
- Select PDF and click "Process PDF & Upload"
- Status will show parsed rows and updated records

### Notes

- Parsing is heuristic; if a novel layout appears, share a sample to improve extractors.
- Time formats are normalized to `H:MM AM/PM`; placeholders use `--:--`.
