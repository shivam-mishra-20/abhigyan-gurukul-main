/* eslint-disable no-unused-vars */
/* eslint-env node */
/* global process */
import http from "http";
import admin from "firebase-admin";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import multer from "multer";
import pdf from "pdf-parse";

// Read Firebase Admin JSON credentials
const serviceAccount = JSON.parse(fs.readFileSync("firebase-admin.json", "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Multer setup (memory storage; PDFs are small enough typically)
const upload = multer({ storage: multer.memoryStorage() });

// Utilities
const toDocId = (name, Class) =>
  `${(name || "").replace(/\s+/g, "").toLowerCase()}_${(Class || "")
    .replace(/\s+/g, "")
    .toLowerCase()}`;

// Convert various date inputs to YYYY-MM-DD if possible; otherwise empty string
const toISODate = (raw) => {
  if (!raw) return "";
  // already in YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  // DD/MM/YYYY or DD-MM-YYYY
  let m = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (m) {
    const [_, d, mo, y] = m;
    const dd = String(d).padStart(2, "0");
    const mm = String(mo).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  }
  // Month name D, YYYY
  // e.g., "Oct 2, 2024" or "October 02, 2024"
  const tryDate = new Date(raw);
  if (!isNaN(tryDate)) return tryDate.toISOString().split("T")[0];
  return "";
};

// Try to parse a time string to a normalized "H:MM AM/PM"
const normalizeTime = (t) => {
  if (!t) return "";
  const str = String(t).trim();
  // If already like 9:30 AM
  if (/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(str)) {
    const [hm, ap] = str.split(/\s+/);
    const [h, m] = hm.split(":");
    return `${Number(h)}:${m} ${ap.toUpperCase()}`;
  }
  // 24h like 14:05
  if (/^\d{1,2}:\d{2}$/.test(str)) {
    const [hh, mm] = str.split(":");
    let h = Number(hh);
    const ap = h >= 12 ? "PM" : "AM";
    if (h === 0) h = 12;
    if (h > 12) h -= 12;
    return `${h}:${mm} ${ap}`;
  }
  // 9 AM or 9PM
  if (/^\d{1,2}\s?(AM|PM)$/i.test(str)) {
    const [h, ap] = str.split(/\s*/);
    return `${Number(h)}:00 ${ap.toUpperCase()}`;
  }
  return str; // fallback
};

// Heuristic extractors for rows from plaintext
function extractAttendanceRowsFromText(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const rows = [];

  // Strategy A: CSV-like lines: Name, Class, Clock In, Clock Out, Date
  for (const line of lines) {
    const parts = line.split(/\s*,\s*/);
    if (parts.length >= 5) {
      const [name, Class, clockIn, clockOut, dateStr] = parts;
      if (name && Class && clockIn && clockOut) {
        const d = toISODate(dateStr);
        if (d) {
          rows.push({ name, Class, clockIn: normalizeTime(clockIn), clockOut: normalizeTime(clockOut), dayAndDate: d });
          continue;
        }
      }
    }
  }

  // Strategy B: Table with headers in nearby lines
  // Find header indices (Name|Student, Class, Clock In, Clock Out, Date)
  const headerIdx = lines.findIndex((l) => /name|student/i.test(l) && /class/i.test(l));
  if (headerIdx !== -1) {
    for (let i = headerIdx + 1; i < lines.length; i++) {
      const l = lines[i];
      const cols = l.split(/\s{2,}|\t|\s\|\s/).filter(Boolean);
      if (cols.length >= 4) {
        // try to guess mapping
        let name = "";
        let Class = "";
        let clockIn = "";
        let clockOut = "";
        let dateStr = "";

        // Heuristic: if one col matches a date -> dateStr
        for (const c of cols) {
          if (toISODate(c)) {
            dateStr = toISODate(c);
            break;
          }
        }
        // Remaining: try time cols
        const timeCols = cols.filter((c) => !dateStr || c !== dateStr).filter((c) => /\d{1,2}:\d{2}|AM|PM/i.test(c));
        if (timeCols.length >= 2) {
          clockIn = normalizeTime(timeCols[0]);
          clockOut = normalizeTime(timeCols[1]);
        }
        // Name + Class as the first two non-time, non-date columns
        const other = cols.filter(
          (c) => c !== dateStr && !/\d{1,2}:\d{2}|AM|PM/i.test(c)
        );
        if (other.length >= 2) {
          name = other[0];
          Class = other[1];
        }
        if (name && Class && clockIn && clockOut && dateStr) {
          rows.push({ name, Class, clockIn, clockOut, dayAndDate: dateStr });
        }
      }
    }
  }

  // Strategy C: Month summary: Name, Class, Date: 2024-10, Present Days: 12
  // We'll expand each day as a record with clockIn/clockOut as "--:--" (counted but not hours)
  for (const line of lines) {
  const m = line.match(/^(.*?),\s*Class\s*[:-]\s*(.*?),\s*Month\s*[:-]\s*(\d{4}-\d{2}),\s*Days\s*[:-]\s*(\d{1,2})/i);
    if (m) {
      const [, name, Class, ym, days] = m;
      const [y, mo] = ym.split("-");
      const count = Number(days);
      // create day entries numbered 1..count within that month (best effort)
      for (let d = 1; d <= count; d++) {
        const dateStr = `${y}-${mo}-${String(d).padStart(2, "0")}`;
        rows.push({ name: name.trim(), Class: Class.trim(), clockIn: "--:--", clockOut: "--:--", dayAndDate: dateStr });
      }
    }
  }

  // Strategy D: Yearly summary: Name, Class, Year: 2024, Days: 180
  for (const line of lines) {
  const m = line.match(/^(.*?),\s*Class\s*[:-]\s*(.*?),\s*Year\s*[:-]\s*(\d{4}),\s*Days\s*[:-]\s*(\d{1,3})/i);
    if (m) {
      const [, name, Class, y, days] = m;
      const count = Number(days);
      // Best-effort: spread days from Jan 01 onwards as placeholders
      let date = new Date(`${y}-01-01T00:00:00Z`);
      for (let i = 0; i < count; i++) {
        const dateStr = date.toISOString().split("T")[0];
        rows.push({ name: name.trim(), Class: Class.trim(), clockIn: "--:--", clockOut: "--:--", dayAndDate: dateStr });
        date.setDate(date.getDate() + 1);
      }
    }
  }

  // Deduplicate identical rows
  const key = (r) => `${r.name}|${r.Class}|${r.dayAndDate}`;
  const map = new Map();
  for (const r of rows) {
    const k = key(r);
    if (!map.has(k)) map.set(k, r);
  }
  return Array.from(map.values());
}

// Specialized parser for monthly per-student report like the screenshot:
// Header contains: "Report Month:- August-2025" and a line with "Name Hriday Jaiswal"
// Then a table with columns: Date, Shift, IN, Out1, In2, ... Out, Work+OT, OT, Break
// We take the first time on the row as IN and the last time BEFORE the 3 duration columns as Out
function extractRowsMonthlyPerStudent(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const rows = [];
  let currentName = "";

  const setNameFromLine = (line, nextLine) => {
    // Try formats: "Name Hriday Jaiswal" OR a two-line cell where nextLine has the value
    let m = line.match(/\bName\b[:\-\s]*([^|]+)/i);
    if (m) {
      const val = m[1].trim();
      if (val && !/^(Report|Dept|Students|Empcode)/i.test(val)) {
        return val;
      }
      if (nextLine && nextLine.length < 80) return nextLine.trim();
    }
    return "";
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Capture Name
    if (/\bName\b/i.test(line)) {
      const candidate = setNameFromLine(line, lines[i + 1]);
      if (candidate) {
        currentName = candidate;
        continue;
      }
    }

    // Table rows start with a date like 01/08/2025
    const dm = line.match(/^(\d{2}\/\d{2}\/\d{4})\b/);
    if (!dm) continue;
    const rawDate = dm[1];

    // All HH:MM occurrences on the row
    const timeMatches = line.match(/\b(\d{1,2}:\d{2})\b/g) || [];

    // Remove the last 3 times as likely Work+OT, OT, Break durations
    let clockTokens = timeMatches.slice();
    if (clockTokens.length >= 3) {
      clockTokens = clockTokens.slice(0, clockTokens.length - 3);
    }

    let clockIn = "";
    let clockOut = "";
    if (clockTokens.length >= 1) {
      clockIn = clockTokens[0];
      if (clockTokens.length >= 2) {
        clockOut = clockTokens[clockTokens.length - 1];
      }
    }

    const dayAndDate = toISODate(rawDate);
    if (!dayAndDate) continue;

    rows.push({
      name: currentName || "",
      Class: "", // will be looked up later from Users/studentLeaves
      clockIn: clockIn || "--:--",
      clockOut: clockOut || "--:--",
      dayAndDate,
    });
  }

  // Filter out entries without name or date
  return rows.filter((r) => r.name && r.dayAndDate);
}

app.post(
  "/attendance/upload-pdf",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const data = await pdf(req.file.buffer);
      const text = data.text || "";
      // Prefer specialized parser for monthly per-student layout
      let rows = extractRowsMonthlyPerStudent(text);
      if (!rows || rows.length === 0) {
        rows = extractAttendanceRowsFromText(text);
      }

      if (rows.length === 0) {
        return res.status(422).json({ error: "Could not parse any attendance rows from PDF." });
      }

      let updated = 0;
      // Cache name->Class resolution to reduce queries
      const classCache = new Map();
      for (const row of rows) {
        const { name, Class, clockIn, clockOut, dayAndDate } = row;
        if (!name || !dayAndDate) continue;

        let resolvedClass = Class;
        if (!resolvedClass) {
          if (classCache.has(name)) {
            resolvedClass = classCache.get(name);
          } else {
            // Try find in Users first
            const usersSnap = await db
              .collection("Users")
              .where("name", "==", name)
              .limit(1)
              .get();
            if (!usersSnap.empty) {
              resolvedClass = usersSnap.docs[0].data().Class || usersSnap.docs[0].data().class || "";
            }
            // If still not found, try existing studentLeaves entries by name
            if (!resolvedClass) {
              const slSnap = await db
                .collection("studentLeaves")
                .where("name", "==", name)
                .limit(1)
                .get();
              if (!slSnap.empty) {
                resolvedClass = slSnap.docs[0].data().Class || "";
              }
            }
            classCache.set(name, resolvedClass || "");
          }
        }

        if (!resolvedClass) {
          // Skip if we can't determine class; alternatively could write to a fallback collection/log
          continue;
        }

        const docId = toDocId(name, resolvedClass);
        const ref = db.collection("studentLeaves").doc(docId);
        const snap = await ref.get();
        if (!snap.exists) {
          await ref.set({ name, Class: resolvedClass, attendance: [] });
        }
        const current = (await ref.get()).data() || {};
        const arr = current.attendance || [];
        if (!arr.some((e) => e.dayAndDate === dayAndDate)) {
          arr.push({ clockIn: normalizeTime(clockIn || "--:--"), clockOut: normalizeTime(clockOut || "--:--"), dayAndDate });
          await ref.update({ attendance: arr });
          updated++;
        }
      }

      return res.status(200).json({ message: "Attendance updated", parsedRows: rows.length, updated });
    } catch (err) {
      console.error("/attendance/upload-pdf error", err);
      return res.status(500).json({ error: "Failed to process PDF" });
    }
  }
);

// Handle form submission
app.post("/submit", async (req, res) => {
  try {
    await db.collection("form-submissions").add(req.body);
    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
