// src/components/Page-Specific-Components/DashboardAttendance.jsx
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  writeBatch,
  documentId,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFileExcel,
  FaSync,
  FaUpload,
  FaFilter,
  FaCalendarAlt,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaRegCalendarCheck,
  FaTrash,
  FaUserCheck,
} from "react-icons/fa";
import { logEvent } from "../../utils/logEvent";
// Client-side PDF parsing
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
try {
  GlobalWorkerOptions.workerSrc = workerSrc;
} catch {
  // ignore worker setup issues in environments where not supported
}

export default function DashboardAttendance() {
  // — state —
  const [file, setFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [status, setStatus] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(""); // "YYYY-MM"
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showClassAttendance, setShowClassAttendance] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [leaveData, setLeaveData] = useState([]);
  const [studentSort, setStudentSort] = useState("latest"); // 'latest'|'oldest'
  const [adminSort, setAdminSort] = useState("latest"); // 'latest'|'name'
  const recordsPerPage = 6;

  const userRole = localStorage.getItem("userRole");
  const studentName = localStorage.getItem("studentName") || "";
  const studentClass = localStorage.getItem("studentClass") || "";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 15 },
    },
  };

  // tableRowVariants reserved for future animations

  // — helpers —
  // small helpers
  const chunk = (arr, size) => {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  };

  const buildDocId = (name, cls) =>
    `${name.replace(/\s+/g, "").toLowerCase()}_${cls
      .replace(/\s+/g, "")
      .toLowerCase()}`;

  // PDF to text
  const pdfToText = async (file) => {
    const buf = await file.arrayBuffer();
    const pdf = await getDocument({ data: new Uint8Array(buf) }).promise;
    const pageIndexes = Array.from({ length: pdf.numPages }, (_, i) => i + 1);
    // Parallelize page extraction for speed
    const pageTexts = await Promise.all(
      pageIndexes.map(async (pageNum) => {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const yMap = new Map();
        for (const item of content.items) {
          const y = Math.round(item.transform?.[5] || 0);
          if (!yMap.has(y)) yMap.set(y, []);
          yMap.get(y).push({ x: item.transform?.[4] || 0, s: item.str });
        }
        const ys = Array.from(yMap.keys()).sort((a, b) => b - a);
        const lines = [];
        for (const y of ys) {
          const parts = yMap
            .get(y)
            .sort((a, b) => a.x - b.x)
            .map((t) => t.s.trim())
            .filter(Boolean);
          if (parts.length) lines.push(parts.join(" "));
        }
        return lines.join("\n");
      })
    );
    return pageTexts.join("\n\n");
  };

  // Normalizers / parsers (mirror server-side)
  const toISODate = (raw) => {
    if (!raw) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
    const m = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (m) {
      const [, d, mo, y] = m;
      return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(
        2,
        "0"
      )}`;
    }
    const t = new Date(raw);
    if (!isNaN(t)) return t.toISOString().split("T")[0];
    return "";
  };

  const normalizeTime = (t) => {
    if (!t) return "";
    const s = String(t).trim();
    if (/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(s)) {
      const [hm, ap] = s.split(/\s+/);
      const [h, m] = hm.split(":");
      return `${Number(h)}:${m} ${ap.toUpperCase()}`;
    }
    if (/^\d{1,2}:\d{2}$/.test(s)) {
      let [h, m] = s.split(":");
      let hh = Number(h);
      const ap = hh >= 12 ? "PM" : "AM";
      if (hh === 0) hh = 12;
      if (hh > 12) hh -= 12;
      return `${hh}:${m} ${ap}`;
    }
    if (/^\d{1,2}\s?(AM|PM)$/i.test(s)) {
      const [h, ap] = s.split(/\s*/);
      return `${Number(h)}:00 ${ap.toUpperCase()}`;
    }
    return s;
  };

  const extractRowsMonthlyPerStudent = (text) => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const rows = [];
    let currentName = "";
    const setNameFromLine = (line, nextLine) => {
      const m = line.match(/\bName\b[:\-\s]*([^|]+)/i);
      if (m) {
        const val = m[1].trim();
        if (val && !/^(Report|Dept|Students|Empcode)/i.test(val)) return val;
        if (nextLine && nextLine.length < 80) return nextLine.trim();
      }
      return "";
    };
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/\bName\b/i.test(line)) {
        const c = setNameFromLine(line, lines[i + 1]);
        if (c) currentName = c;
      }
      const dm = line.match(/^(\d{2}\/\d{2}\/\d{4})\b/);
      if (!dm) continue;
      const rawDate = dm[1];
      const timeMatches = line.match(/\b(\d{1,2}:\d{2})\b/g) || [];
      let clockTokens = timeMatches.slice();
      if (clockTokens.length >= 3)
        clockTokens = clockTokens.slice(0, clockTokens.length - 3);
      let clockIn = "";
      let clockOut = "";
      if (clockTokens.length >= 1) {
        clockIn = clockTokens[0];
        if (clockTokens.length >= 2)
          clockOut = clockTokens[clockTokens.length - 1];
      }
      const dayAndDate = toISODate(rawDate);
      if (!dayAndDate) continue;
      rows.push({
        name: currentName || "",
        Class: "",
        clockIn: clockIn || "--:--",
        clockOut: clockOut || "--:--",
        dayAndDate,
      });
    }
    return rows.filter((r) => r.name && r.dayAndDate);
  };

  const extractAttendanceRowsGeneric = (text) => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const rows = [];
    for (const line of lines) {
      const parts = line.split(/\s*,\s*/);
      if (parts.length >= 5) {
        const [name, Class, clockIn, clockOut, dateStr] = parts;
        const d = toISODate(dateStr);
        if (name && Class && d)
          rows.push({ name, Class, clockIn, clockOut, dayAndDate: d });
      }
    }
    return rows;
  };

  // Efficient class lookups for a set of names using chunked 'in' queries
  const fetchClassesForNames = async (names) => {
    const result = new Map();
    if (!names || names.size === 0) return result;
    const unique = Array.from(names);
    // Query Users collection first (authoritative)
    for (const group of chunk(unique, 10)) {
      const snap = await getDocs(
        query(collection(db, "Users"), where("name", "in", group))
      );
      snap.forEach((d) => {
        const data = d.data();
        const cls = data.Class || data.class || "";
        if (data.name) result.set(data.name, cls);
      });
    }
    // For any not found, fall back to studentLeaves
    const notFound = unique.filter((n) => !result.has(n));
    for (const group of chunk(notFound, 10)) {
      if (group.length === 0) break;
      const snap = await getDocs(
        query(collection(db, "studentLeaves"), where("name", "in", group))
      );
      snap.forEach((d) => {
        const data = d.data();
        if (data.name) result.set(data.name, data.Class || "");
      });
    }
    return result;
  };
  const excelDateToISO = (value) => {
    if (!value) return "";
    // Excel serial?
    if (!isNaN(value)) {
      const d = new Date(Math.round((value - 25569) * 86400 * 1000));
      return d.toISOString().split("T")[0];
    }
    const parsed = new Date(value);
    return !isNaN(parsed) ? parsed.toISOString().split("T")[0] : "";
  };

  // — Admin/Teacher: handle file selection —
  const handleFileChange = (e) => {
    setStatus("");
    setShowStatus(false);
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handlePdfChange = (e) => {
    setStatus("");
    setShowStatus(false);
    if (e.target.files[0]) setPdfFile(e.target.files[0]);
  };

  // — Admin/Teacher: process & upload Excel —
  const handleUpload = async () => {
    if (!file) {
      setStatus("⚠️ Please select an Excel file first.");
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
      return;
    }
    try {
      setIsSubmitting(true);
      setStatus("⏳ Processing...");
      setShowStatus(true);

      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { cellDates: true });
      const sheet = wb.Sheets[wb.SheetNames[0]];

      const rows = XLSX.utils.sheet_to_json(sheet, { raw: false, defval: "" });

      // Group rows by docId and dedupe by day within this upload
      const grouped = new Map(); // docId -> { name, Class, entries: Map(day->entry) }
      for (let row of rows) {
        const norm = {};
        Object.entries(row).forEach(([k, v]) => {
          norm[k.trim().toLowerCase()] = v;
        });
        const cls = norm["class"]?.toString().trim();
        const name = norm["name"]?.toString().trim();
        const clockIn = norm["clock in"]?.toString().trim();
        const clockOut = norm["clock out"]?.toString().trim();
        const rawDate = norm["day and date"];
        const dayAndDate = excelDateToISO(rawDate);
        if (!cls || !name || !clockIn || !clockOut || !dayAndDate) continue;
        const docId = buildDocId(name, cls);
        if (!grouped.has(docId))
          grouped.set(docId, {
            name,
            Class: cls,
            entries: new Map(),
          });
        const g = grouped.get(docId);
        if (!g.entries.has(dayAndDate))
          g.entries.set(dayAndDate, { clockIn, clockOut, dayAndDate });
      }

      const docIds = Array.from(grouped.keys());
      // Read existing docs in chunks of 10 using documentId() "in" queries
      const existing = new Map(); // docId -> Set(day)
      for (const ids of chunk(docIds, 10)) {
        const snap = await getDocs(
          query(collection(db, "studentLeaves"), where(documentId(), "in", ids))
        );
        snap.forEach((d) => {
          const data = d.data();
          const days = new Set(
            (data.attendance || []).map((e) => e.dayAndDate)
          );
          existing.set(d.id, days);
        });
      }

      // Prepare batched writes (limit ~500 ops per batch for safety)
      const batches = [];
      let batch = writeBatch(db);
      let ops = 0;
      let updatedCount = 0;
      const flush = async () => {
        if (ops === 0) return;
        batches.push(batch.commit());
        batch = writeBatch(db);
        ops = 0;
      };

      for (const [docId, info] of grouped.entries()) {
        const ref = doc(db, "studentLeaves", docId);
        const daysExisting = existing.get(docId) || new Set();
        const allEntries = Array.from(info.entries.values());
        const newEntries = allEntries.filter(
          (e) => !daysExisting.has(e.dayAndDate)
        );
        if (existing.has(docId)) {
          if (newEntries.length > 0) {
            // Chunk updates to avoid very large arrayUnion payloads
            for (const part of chunk(newEntries, 100)) {
              batch.update(ref, { attendance: arrayUnion(...part) });
              ops++;
              updatedCount += part.length;
              if (ops >= 450) await flush();
            }
          }
        } else {
          // New doc: set all entries at once
          batch.set(ref, {
            name: info.name,
            Class: info.Class,
            attendance: allEntries,
          });
          ops++;
          updatedCount += allEntries.length;
          if (ops >= 450) await flush();
        }
      }

      await flush();
      await Promise.all(batches);

      // Report to console for debugging/confirmation
      console.log(
        `Attendance upload complete: parsed ${rows.length} rows, added ${updatedCount} new entries to studentLeaves.`
      );

      setStatus("✅ Attendance uploaded successfully!");
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
      setFile(null);
      document.getElementById("attendance-upload").value = "";
      await logEvent("Attendance uploaded via Excel");
    } catch (e) {
      console.error(e);
      setStatus("❌ Failed to upload attendance.");
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // — Admin/Teacher: process PDF entirely on the client (no server) —
  const handleUploadPdf = async () => {
    if (!pdfFile) {
      setStatus("⚠️ Please select a PDF file first.");
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
      return;
    }
    try {
      setIsSubmitting(true);
      setStatus("⏳ Processing PDF in browser...");
      setShowStatus(true);
      const text = await pdfToText(pdfFile);
      // Prefer monthly per-student format, then fallback
      let rows = extractRowsMonthlyPerStudent(text);
      if (!rows || rows.length === 0) rows = extractAttendanceRowsGeneric(text);
      if (!rows || rows.length === 0)
        throw new Error("No attendance rows found in PDF");

      // Resolve missing Classes in bulk
      const namesNeedingClass = new Set(
        rows
          .filter((r) => !r.Class)
          .map((r) => r.name?.trim())
          .filter(Boolean)
      );
      const classMap = await fetchClassesForNames(namesNeedingClass);

      // Group by docId and dedupe by day
      const grouped = new Map(); // docId -> { name, Class, entries: Map(day->entry) }
      for (const r of rows) {
        const name = r.name?.trim();
        const dayAndDate = r.dayAndDate;
        if (!name || !dayAndDate) continue;
        const cls = r.Class?.trim() || classMap.get(name) || "";
        if (!cls) continue;
        const docId = buildDocId(name, cls);
        if (!grouped.has(docId))
          grouped.set(docId, { name, Class: cls, entries: new Map() });
        const g = grouped.get(docId);
        if (!g.entries.has(dayAndDate))
          g.entries.set(dayAndDate, {
            clockIn: normalizeTime(r.clockIn || "--:--"),
            clockOut: normalizeTime(r.clockOut || "--:--"),
            dayAndDate,
          });
      }

      const docIds = Array.from(grouped.keys());
      const existing = new Map(); // docId -> Set(day)
      for (const ids of chunk(docIds, 10)) {
        const snap = await getDocs(
          query(collection(db, "studentLeaves"), where(documentId(), "in", ids))
        );
        snap.forEach((d) => {
          const data = d.data();
          const days = new Set(
            (data.attendance || []).map((e) => e.dayAndDate)
          );
          existing.set(d.id, days);
        });
      }

      // Batched writes
      const batches = [];
      let batch = writeBatch(db);
      let ops = 0;
      const flush = async () => {
        if (ops === 0) return;
        batches.push(batch.commit());
        batch = writeBatch(db);
        ops = 0;
      };

      let updatedCount = 0;
      for (const [docId, info] of grouped.entries()) {
        const ref = doc(db, "studentLeaves", docId);
        const daysExisting = existing.get(docId) || new Set();
        const allEntries = Array.from(info.entries.values());
        const newEntries = allEntries.filter(
          (e) => !daysExisting.has(e.dayAndDate)
        );
        if (existing.has(docId)) {
          if (newEntries.length > 0) {
            for (const part of chunk(newEntries, 100)) {
              batch.update(ref, { attendance: arrayUnion(...part) });
              ops++;
              updatedCount += part.length;
              if (ops >= 450) await flush();
            }
          }
        } else {
          batch.set(ref, {
            name: info.name,
            Class: info.Class,
            attendance: allEntries,
          });
          ops++;
          updatedCount += allEntries.length;
          if (ops >= 450) await flush();
        }
      }

      await flush();
      await Promise.all(batches);

      setStatus(
        `✅ PDF processed on client. Parsed: ${rows.length}, Updated: ${updatedCount}`
      );
      // Console confirmation
      console.log(
        `PDF attendance upload complete: parsed ${rows.length} rows, added ${updatedCount} new entries to studentLeaves.`
      );
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
      setPdfFile(null);
      const input = document.getElementById("attendance-upload-pdf");
      if (input) input.value = "";
      await logEvent("Attendance uploaded via PDF (client)");
    } catch (e) {
      console.error(e);
      setStatus("❌ Failed to process PDF.");
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // — Admin/Teacher: sync all students into studentLeaves (no overwrite) —
  // 🔄 Sync student entries from Users → studentLeaves (without wiping existing attendance)
  const handleSyncStudents = async () => {
    setIsLoading(true);
    setStatus("⏳ Syncing students...");
    setShowStatus(true);

    try {
      const snap = await getDocs(
        query(collection(db, "Users"), where("role", "==", "student"))
      );

      let batch = writeBatch(db);
      let ops = 0;
      let syncedCount = 0;
      const commits = [];
      const flush = async () => {
        if (ops === 0) return;
        commits.push(batch.commit());
        batch = writeBatch(db);
        ops = 0;
      };

      for (let u of snap.docs) {
        const { name, Class, batch: studentBatch } = u.data();
        if (!name || !Class) continue;
        const docId = buildDocId(name, Class);
        const ref = doc(db, "studentLeaves", docId);
        // No read: merge write will create if missing and preserve existing attendance
        batch.set(
          ref,
          { name, Class, ...(studentBatch ? { batch: studentBatch } : {}) },
          { merge: true }
        );
        syncedCount++;
        ops++;
        if (ops >= 450) await flush();
      }

      await flush();
      await Promise.all(commits);

      console.log(`Synced ${syncedCount} students to 'studentLeaves'.`);

      setStatus("✅ Synced students to 'studentLeaves'.");
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
      await logEvent("Synced students to studentLeaves");
    } catch (e) {
      console.error(e);
      setStatus("❌ Sync failed.");
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // — Student: load their attendance via query on name & class —
  useEffect(() => {
    if (userRole === "student") {
      (async () => {
        setIsLoading(true);
        try {
          const q = query(
            collection(db, "studentLeaves"),
            where("name", "==", studentName),
            where("Class", "==", studentClass)
          );
          const snap = await getDocs(q);
          if (!snap.empty) {
            setAttendanceRecords(snap.docs[0].data().attendance || []);
          } else {
            setAttendanceRecords([]);
          }
        } catch (e) {
          console.error("Error loading attendance:", e);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [userRole, studentName, studentClass]);

  // Fetch classes and batches from 'Users' and map them with 'studentLeaves' to display cumulative leave data for students.
  // Removed redundant/incorrect initial fetch to reduce startup cost

  // Fetch attendance data from 'studentLeaves' collection and calculate total attendance days for each student based on valid clockIn and clockOut times.
  useEffect(() => {
    // Load summary for modal only when needed
    if (!showClassAttendance) return;
    let cancelled = false;
    (async () => {
      try {
        const leavesSnapshot = await getDocs(collection(db, "studentLeaves"));
        if (cancelled) return;
        const attendanceData = leavesSnapshot.docs.map((docu) => {
          const data = docu.data();
          const attendance = data.attendance || [];
          const totalAttendanceDays = attendance.filter(
            (entry) => entry.clockIn !== "--:--" && entry.clockOut !== "--:--"
          ).length;
          const lastAttendanceDate =
            attendance
              .map((a) => a.dayAndDate)
              .filter(Boolean)
              .sort()
              .reverse()[0] || null;
          return {
            name: data.name,
            class: data.Class,
            batch: data.batch || "Unknown",
            totalAttendanceDays,
            lastAttendanceDate,
          };
        });
        setLeaveData(attendanceData);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showClassAttendance]);

  // — Filtering by month —
  const filtered = attendanceRecords.filter((rec) => {
    if (!selectedMonth) return true;
    const d = new Date(rec.dayAndDate);
    const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return m === selectedMonth;
  });

  // Sorting for student view (default: latest first)
  const sortedFiltered = filtered.slice().sort((a, b) => {
    const da = new Date(a.dayAndDate).getTime();
    const db = new Date(b.dayAndDate).getTime();
    return studentSort === "latest" ? db - da : da - db;
  });

  // — Attendance analytics —
  const getTotalDays = () => filtered.length;
  const getTotalHours = () => {
    return filtered
      .reduce((acc, rec) => {
        if (!rec.clockIn || !rec.clockOut) return acc;

        // Parse time formats like "9:30 AM" and "4:00 PM"
        const [inHour, inMinute] = rec.clockIn
          .replace(/\s*(AM|PM)$/i, "")
          .split(":")
          .map(Number);
        const [outHour, outMinute] = rec.clockOut
          .replace(/\s*(AM|PM)$/i, "")
          .split(":")
          .map(Number);

        const inPeriod = rec.clockIn.match(/PM$/i) ? "PM" : "AM";
        const outPeriod = rec.clockOut.match(/PM$/i) ? "PM" : "AM";

        // Convert to 24-hour format
        let startHour = inHour;
        if (inPeriod === "PM" && inHour !== 12) startHour += 12;
        if (inPeriod === "AM" && inHour === 12) startHour = 0;

        let endHour = outHour;
        if (outPeriod === "PM" && outHour !== 12) endHour += 12;
        if (outPeriod === "AM" && outHour === 12) endHour = 0;

        // Calculate duration
        const startMinutes = startHour * 60 + inMinute;
        const endMinutes = endHour * 60 + outMinute;
        const durationHours = (endMinutes - startMinutes) / 60;

        return acc + (durationHours > 0 ? durationHours : 0);
      }, 0)
      .toFixed(1);
  };

  // — Pagination setup —
  const totalPages = Math.ceil(sortedFiltered.length / recordsPerPage) || 1;
  const paginated = sortedFiltered.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Format date in a more readable way
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Prepare class attendance data for the modal
  // const classAttendanceList = attendanceRecords
  //   .filter((rec) => selectedClass && rec.Class === selectedClass)
  //   .map((rec) => ({
  //     name: rec.name,
  //     totalDays: rec.attendance ? rec.attendance.length : 0,
  //   }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-md max-w-4xl mx-auto p-6 md:p-8"
    >
      <motion.div
        className="flex items-center justify-center gap-3 mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <FaRegCalendarCheck className="text-blue-600 text-2xl" />
        <h2 className="text-2xl font-bold text-gray-800">
          Attendance Dashboard
        </h2>
      </motion.div>

      <AnimatePresence>
        {showStatus && status && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 p-4 rounded-lg flex items-center shadow-sm border ${
              status.startsWith("❌")
                ? "bg-red-50 border-red-200 text-red-700"
                : status.startsWith("⚠️")
                ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                : status.startsWith("⏳")
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-green-50 border-green-200 text-green-700"
            }`}
          >
            <span className="text-lg mr-2">{status.charAt(0)}</span>
            <span>{status.substring(1).trim()}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin/Teacher Controls */}
      {userRole !== "student" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6"
        >
          <motion.h3
            variants={itemVariants}
            className="text-lg font-semibold mb-4 flex items-center text-gray-700"
          >
            <FaUpload className="mr-2 text-indigo-600" />
            Upload Attendance Records
          </motion.h3>

          <motion.div variants={itemVariants} className="space-y-4">
            <div className="relative">
              <input
                id="attendance-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex items-center border-2 border-dashed border-indigo-300 bg-indigo-50 rounded-lg p-4">
                <FaFileExcel className="text-indigo-500 text-xl mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-indigo-700">
                    {file ? file.name : "Select Excel File"}
                  </p>
                  <p className="text-sm text-indigo-600 opacity-70">
                    {file
                      ? `${(file.size / 1024).toFixed(1)} KB`
                      : "Click or drag file here"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                onClick={handleUpload}
                className={`${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                } text-white py-3 px-4 rounded-lg shadow transition flex items-center justify-center`}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FaUpload className="mr-2" />
                    <span>Process & Upload</span>
                  </>
                )}
              </motion.button>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                onClick={handleSyncStudents}
                className={`${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                } text-white py-3 px-4 rounded-lg shadow transition flex items-center justify-center`}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <FaSync className="mr-2" />
                    <span>Sync Students</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* PDF uploader */}
            <div className="mt-4 space-y-3">
              <div className="relative">
                <input
                  id="attendance-upload-pdf"
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex items-center border-2 border-dashed border-indigo-300 bg-indigo-50 rounded-lg p-4">
                  <FaFileExcel className="text-indigo-500 text-xl mr-3 rotate-90" />
                  <div className="flex-1">
                    <p className="font-medium text-indigo-700">
                      {pdfFile
                        ? pdfFile.name
                        : "Select Attendance PDF (any format)"}
                    </p>
                    <p className="text-sm text-indigo-600 opacity-70">
                      {pdfFile
                        ? `${(pdfFile.size / 1024).toFixed(1)} KB`
                        : "Click or drag PDF here"}
                    </p>
                  </div>
                </div>
              </div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                onClick={handleUploadPdf}
                className={`${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
                } text-white py-3 px-4 rounded-lg shadow transition flex items-center justify-center`}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    <span>Processing PDF...</span>
                  </>
                ) : (
                  <>
                    <FaUpload className="mr-2" />
                    <span>Process PDF & Upload</span>
                  </>
                )}
              </motion.button>
            </div>

            <motion.div
              variants={itemVariants}
              className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100"
            >
              <p className="font-medium text-blue-700 mb-1">Instructions:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-800">
                <li>
                  Upload Excel file with columns: Name, Class, Clock In, Clock
                  Out, Day and Date
                </li>
                <li>Ensure all required fields are filled correctly</li>
                <li>
                  Use the &#39;Sync Students&#39; button to sync student
                  database with attendance records
                </li>
                <li>
                  You can also upload a PDF (daily, monthly or yearly). The
                  system will auto-parse and update.
                </li>
              </ol>
            </motion.div>
          </motion.div>

          <div className="flex flex-wrap gap-3 mt-4">
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white py-3 px-4 rounded-lg shadow transition flex items-center justify-center"
              onClick={() => setShowClassAttendance(true)}
            >
              <FaFilter className="mr-2" /> View Class Attendance
            </motion.button>
          </div>

          {/* Modal for class attendance */}
          {showClassAttendance && (
            <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
                <h3 className="text-lg font-bold mb-4 text-indigo-700">
                  View Class Attendance
                </h3>
                <div className="flex gap-2 mb-4">
                  <select
                    className="w-1/2 border border-gray-300 rounded-lg px-4 py-2"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">Select Class</option>
                    {Array.from(
                      new Set(leaveData.map((data) => data.class))
                    ).map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                  <select
                    className="w-1/2 border border-gray-300 rounded-lg px-4 py-2"
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    disabled={!selectedClass}
                  >
                    <option value="">Select Batch</option>
                    {Array.from(
                      new Set(
                        leaveData
                          .filter((data) => data.class === selectedClass)
                          .map((data) => data.batch)
                      )
                    ).map((batch) => (
                      <option key={batch} value={batch}>
                        {batch}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 mb-4">
                  <div className="w-1/2">
                    <label className="sr-only">Sort By</label>
                    <select
                      value={adminSort}
                      onChange={(e) => setAdminSort(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    >
                      <option value="latest">Latest updates</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-indigo-100">
                        <th className="px-3 py-2 text-left">Name</th>
                        <th className="px-3 py-2 text-left">
                          Total Attendance Days
                        </th>
                        <th className="px-3 py-2 text-left">Last Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveData
                        .filter(
                          (data) =>
                            (!selectedClass || data.class === selectedClass) &&
                            (!selectedBatch || data.batch === selectedBatch)
                        )
                        .slice()
                        .sort((a, b) => {
                          if (adminSort === "name")
                            return (a.name || "").localeCompare(b.name || "");
                          // latest
                          const da = a.lastAttendanceDate
                            ? new Date(a.lastAttendanceDate).getTime()
                            : 0;
                          const db = b.lastAttendanceDate
                            ? new Date(b.lastAttendanceDate).getTime()
                            : 0;
                          return db - da;
                        })
                        .map((data, idx) => (
                          <tr
                            key={idx}
                            className={idx % 2 === 0 ? "bg-gray-50" : ""}
                          >
                            <td className="px-3 py-2">{data.name}</td>
                            <td className="px-3 py-2">
                              {data.totalAttendanceDays}
                            </td>
                            <td className="px-3 py-2">
                              {data.lastAttendanceDate
                                ? formatDate(data.lastAttendanceDate)
                                : "—"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
                    onClick={() => setShowClassAttendance(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Student View */}
      {userRole === "student" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Analytics Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2"
          >
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center"
            >
              <div className="bg-blue-500 p-3 rounded-lg mr-3">
                <FaUserCheck className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-blue-700">Total Days Present</p>
                <p className="text-2xl font-bold text-blue-800">
                  {getTotalDays()}
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center"
            >
              <div className="bg-green-500 p-3 rounded-lg mr-3">
                <FaClock className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-green-700">Total Hours</p>
                <p className="text-2xl font-bold text-green-800">
                  {getTotalHours()}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Filter Controls */}
          <motion.div variants={itemVariants}>
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
              <h3 className="text-md font-medium text-indigo-800 mb-3 flex items-center">
                <FaFilter className="text-indigo-600 mr-2" /> Filter Attendance
                Records
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-4 py-2 w-full border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                  />
                </div>
                <div className="w-44">
                  <label className="sr-only">Sort</label>
                  <select
                    value={studentSort}
                    onChange={(e) => setStudentSort(e.target.value)}
                    className="w-full border border-indigo-200 rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="latest">Latest first</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedMonth("");
                    setCurrentPage(1);
                  }}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-5 py-2 rounded-lg text-white shadow flex items-center justify-center"
                >
                  <FaTrash className="mr-2" /> Clear Filter
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Attendance Display */}
          <motion.div variants={itemVariants}>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <motion.div
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"
                />
                <span className="ml-3 text-indigo-600 font-medium">
                  Loading records...
                </span>
              </div>
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center"
              >
                <img
                  src="https://illustrations.popsy.co/amber/hourglass.svg"
                  alt="No records"
                  className="h-32 mx-auto mb-4"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <p className="text-gray-600 font-medium mb-1">
                  No attendance records found
                </p>
                <p className="text-gray-500 text-sm">
                  {selectedMonth
                    ? "Try selecting a different month"
                    : "Your attendance records will appear here"}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <motion.div
                  className="rounded-lg overflow-hidden border border-gray-200 shadow"
                  whileHover={{
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                          Clock In
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                          Clock Out
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {paginated.map((rec, i) => (
                          <tr
                            key={`${rec.dayAndDate}-${i}`}
                            className={
                              i % 2 === 0
                                ? "bg-gray-50"
                                : "bg-white hover:bg-indigo-50 transition"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                              {(currentPage - 1) * recordsPerPage + i + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {formatDate(rec.dayAndDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {rec.clockIn}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {rec.clockOut}
                            </td>
                          </tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </motion.div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    variants={itemVariants}
                    className="flex justify-center mt-6"
                  >
                    <div className="inline-flex rounded-md shadow-sm">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-blue-600 hover:bg-blue-50"
                        } border border-gray-300`}
                      >
                        <FaChevronLeft />
                      </motion.button>

                      {Array.from({ length: Math.min(5, totalPages) }).map(
                        (_, idx) => {
                          let pageNumber;

                          // Calculate which page numbers to show
                          if (totalPages <= 5) {
                            pageNumber = idx + 1;
                          } else if (currentPage <= 3) {
                            pageNumber = idx + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + idx;
                          } else {
                            pageNumber = currentPage - 2 + idx;
                          }

                          if (pageNumber > totalPages) return null;

                          return (
                            <motion.button
                              key={idx}
                              whileHover={{
                                scale: currentPage !== pageNumber ? 1.05 : 1,
                              }}
                              whileTap={{
                                scale: currentPage !== pageNumber ? 0.95 : 1,
                              }}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`px-4 py-2 text-sm font-medium border-t border-b border-gray-300 ${
                                currentPage === pageNumber
                                  ? "bg-blue-600 text-white"
                                  : "bg-white text-blue-600 hover:bg-blue-50"
                              } ${
                                idx === 0 && currentPage > 3 && totalPages > 5
                                  ? "border-l"
                                  : ""
                              } 
                              ${
                                idx === 4 &&
                                currentPage < totalPages - 2 &&
                                totalPages > 5
                                  ? "border-r"
                                  : ""
                              }`}
                            >
                              {pageNumber}
                            </motion.button>
                          );
                        }
                      )}

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                          currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-blue-600 hover:bg-blue-50"
                        } border border-gray-300`}
                      >
                        <FaChevronRight />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
