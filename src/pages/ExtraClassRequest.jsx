import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const ExtraClassRequest = () => {
  const userRole = localStorage.getItem("userRole");
  const studentName = localStorage.getItem("studentName");
  const studentClass = localStorage.getItem("studentClass");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState("");
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (userRole !== "student") {
      // Teachers/Admins: fetch all requests
      getDocs(collection(db, "ExtraClassRequests")).then((snapshot) => {
        setRequests(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      });
    }
  }, [userRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docId = `${studentName}_${studentClass}`;
    await setDoc(doc(db, "ExtraClassRequests", docId), {
      studentName,
      studentClass,
      subject,
      topic,
      reason,
      createdAt: new Date(),
    });
    setSuccess("Request submitted!");
    setSubject("");
    setTopic("");
    setReason("");
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "ExtraClassRequests", id));
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  if (userRole === "student") {
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">Request Extra Class</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
          <textarea
            className="w-full border px-3 py-2 rounded"
            placeholder="Reason/Details"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            type="submit"
          >
            Submit
          </button>
        </form>
        {success && <div className="mt-4 text-blue-600">{success}</div>}
      </div>
    );
  }

  // Teacher/Admin view
  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Extra Class Requests</h2>
      <ul className="divide-y">
        {requests.map((r) => (
          <li key={r.id} className="py-3 flex justify-between items-center">
            <div>
              <div className="font-semibold">
                {r.studentName} ({r.studentClass})
              </div>
              <div>Subject: {r.subject}</div>
              <div>Topic: {r.topic}</div>
              <div className="text-gray-600">{r.reason}</div>
              <div className="text-xs text-gray-400">
                {r.createdAt?.toDate?.().toLocaleString?.() || ""}
              </div>
            </div>
            {userRole === "admin" && (
              <button
                className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={() => handleDelete(r.id)}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExtraClassRequest;
