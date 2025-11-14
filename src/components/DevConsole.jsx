import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const KNOWN_COLLECTIONS = [
  "Users",
  "studentLeaves",
  "Results",
  "ActualStudentResults",
  "Complaints",
  "HomeworkStatus",
  "SyllabusReport",
  "syllabus",
  "Logs",
  "TimeTable",
  "PastTests",
  "UpcomingTests",
  "teacherLeaves",
];

const DevConsole = () => {
  const [collections] = useState(KNOWN_COLLECTIONS);
  const [selectedCol, setSelectedCol] = useState("Users");
  const [docsList, setDocsList] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [docJson, setDocJson] = useState("{}");
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  // Fetch docs of selected collection
  const refreshDocs = async () => {
    if (!selectedCol) return;
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, selectedCol));
      const list = snap.docs.map((d) => ({ id: d.id, data: d.data() }));
      setDocsList(list);
      if (list.length > 0) {
        setSelectedDocId(list[0].id);
        setDocJson(JSON.stringify(list[0].data, null, 2));
      } else {
        setSelectedDocId("");
        setDocJson("{}");
      }
    } catch (err) {
      toast.error(`Failed to list ${selectedCol}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCol]);

  const handlePickDoc = async (id) => {
    setSelectedDocId(id);
    try {
      const d = await getDoc(doc(db, selectedCol, id));
      setDocJson(JSON.stringify(d.data() || {}, null, 2));
    } catch {
      toast.error("Failed to fetch document");
    }
  };

  const handleSaveDoc = async () => {
    try {
      const parsed = JSON.parse(docJson);
      if (!selectedDocId) {
        const newRef = await addDoc(collection(db, selectedCol), parsed);
        toast.success(`Created new doc ${newRef.id}`);
        await refreshDocs();
        setSelectedDocId(newRef.id);
      } else {
        await setDoc(doc(db, selectedCol, selectedDocId), parsed, {
          merge: false,
        });
        toast.success("Document saved");
        await refreshDocs();
      }
    } catch (e) {
      toast.error(`Invalid JSON or save failed: ${e.message}`);
    }
  };

  const handleDeleteDoc = async () => {
    if (!selectedDocId) return toast.info("Select a document first");
    if (!window.confirm(`Delete document ${selectedDocId}?`)) return;
    try {
      await deleteDoc(doc(db, selectedCol, selectedDocId));
      toast.success("Document deleted");
      await refreshDocs();
    } catch (e) {
      toast.error(`Delete failed: ${e.message}`);
    }
  };

  const performDeleteCollection = async () => {
    try {
      const snap = await getDocs(collection(db, selectedCol));
      let count = 0;
      for (const d of snap.docs) {
        await deleteDoc(doc(db, selectedCol, d.id));
        count++;
      }
      toast.success(`Deleted ${count} docs from ${selectedCol}`);
      setShowDeleteConfirm(false);
      setConfirmText("");
      await refreshDocs();
    } catch (e) {
      toast.error(`Delete collection failed: ${e.message}`);
    }
  };

  const handleDeleteCollection = async () => {
    if (!selectedCol) return;
    // First click reveals the safeguard panel
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      setConfirmText("");
      return;
    }
    // Enforce typed confirmation (must match collection name exactly)
    if (confirmText.trim() !== selectedCol) {
      toast.error("Type the collection name exactly to confirm.");
      return;
    }
    // Second confirmation dialog for extra safety
    const ok = window.confirm(
      `⚠️ Permanently delete ALL documents in '${selectedCol}'? This cannot be undone.`
    );
    if (!ok) return;
    await performDeleteCollection();
  };

  // Lightweight connection guide (static mapping we know in this app)
  const connections = useMemo(
    () => ({
      Users: [
        "studentLeaves (name+Class → docId)",
        "Results (name/class)",
        "Complaints (name/class/batch)",
        "HomeworkStatus (Name/Class)",
        "ActualStudentResults (name/class/batch)",
        "teacherLeaves (uid for teachers)",
      ],
      studentLeaves: ["Users (name/Class)"],
      Results: ["ActualStudentResults (grouped by name/class/batch)"],
      Complaints: ["Users (name/class/batch)"],
      HomeworkStatus: ["Users (Name/Class/Batch)"],
      SyllabusReport: ["syllabus (by class/batch/subject)"],
    }),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sidebar */}
        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <h2 className="text-lg font-semibold">Developer Dashboard</h2>
          <select
            className="w-full border rounded p-2"
            value={selectedCol}
            onChange={(e) => setSelectedCol(e.target.value)}
          >
            {collections.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            onClick={refreshDocs}
            className="w-full bg-indigo-600 text-white rounded p-2"
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
          <button
            onClick={handleDeleteCollection}
            className="w-full bg-red-600 text-white rounded p-2"
          >
            {showDeleteConfirm ? "Confirm Delete" : "Delete Entire Collection"}
          </button>
          {showDeleteConfirm && (
            <div className="border rounded p-2 space-y-2">
              <p className="text-xs text-red-700">
                Type the collection name{" "}
                <span className="font-semibold">{selectedCol}</span> to confirm.
              </p>
              <input
                className="w-full border rounded p-2 text-sm"
                placeholder={selectedCol}
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  className="flex-1 bg-gray-200 rounded p-2 text-sm"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setConfirmText("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className={`flex-1 rounded p-2 text-sm ${
                    confirmText.trim() === selectedCol
                      ? "bg-red-600 text-white"
                      : "bg-red-200 text-red-700 cursor-not-allowed"
                  }`}
                  disabled={confirmText.trim() !== selectedCol}
                  onClick={handleDeleteCollection}
                >
                  Permanently Delete
                </button>
              </div>
            </div>
          )}

          <div className="mt-4">
            <h3 className="font-semibold text-sm mb-1">Connections</h3>
            <ul className="text-xs list-disc pl-5 space-y-1">
              {(connections[selectedCol] || ["No known connections"]).map(
                (s, i) => (
                  <li key={i}>{s}</li>
                )
              )}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-sm mb-1">
              Features → Collections
            </h3>
            <ul className="text-xs list-disc pl-5 space-y-1">
              <li>Attendance Dashboard → studentLeaves, Users</li>
              <li>Results → Results, ActualStudentResults</li>
              <li>Complaints → Complaints, Users</li>
              <li>Homework → HomeworkStatus, Users</li>
              <li>Syllabus Manager → syllabus, SyllabusReport</li>
              <li>Feedbacks → Feedbacks</li>
              <li>Time Table → TimeTable</li>
              <li>Teacher Leaves → teacherLeaves</li>
              <li>Leaderboards → ActualStudentResults</li>
              <li>Logs → Logs</li>
              <li>Tests → PastTests, UpcomingTests</li>
            </ul>
          </div>
        </div>

        {/* Documents list */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">Documents</h3>
          <div className="max-h-[60vh] overflow-auto border rounded">
            {docsList.length === 0 ? (
              <div className="p-3 text-sm text-gray-500">No documents</div>
            ) : (
              <ul>
                {docsList.map((d) => (
                  <li
                    key={d.id}
                    className={`px-3 py-2 border-b hover:bg-gray-50 cursor-pointer ${
                      selectedDocId === d.id ? "bg-gray-100" : ""
                    }`}
                    onClick={() => handlePickDoc(d.id)}
                  >
                    <div className="text-sm font-mono">{d.id}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {JSON.stringify(d.data)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => {
                setSelectedDocId("");
                setDocJson('{\n  "example": "value"\n}');
              }}
              className="bg-green-600 text-white rounded px-3 py-2"
            >
              New Document
            </button>
            <button
              onClick={handleDeleteDoc}
              className="bg-red-600 text-white rounded px-3 py-2"
            >
              Delete Selected
            </button>
          </div>
        </div>

        {/* JSON Editor */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">
            Editor {selectedDocId && `(id: ${selectedDocId})`}
          </h3>
          <textarea
            className="w-full h-[60vh] border rounded font-mono text-sm p-2"
            value={docJson}
            onChange={(e) => setDocJson(e.target.value)}
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSaveDoc}
              className="bg-indigo-600 text-white rounded px-4 py-2"
            >
              Save
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default DevConsole;
