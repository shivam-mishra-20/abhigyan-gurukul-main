import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const StudentSyllabusUpdate = () => {
  const userRole = localStorage.getItem("userRole");
  const studentName = localStorage.getItem("studentName");
  const studentClass = localStorage.getItem("studentClass");
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [success, setSuccess] = useState("");
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    if (userRole !== "student") {
      // Teachers/Admins: fetch all updates
      getDocs(collection(db, "StudentSyllabusUpdates")).then((snapshot) => {
        setUpdates(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });
    }
  }, [userRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docId = `${studentName}_${studentClass}`;
    await setDoc(doc(db, "StudentSyllabusUpdates", docId), {
      studentName,
      studentClass,
      topic,
      subject,
      details,
      createdAt: new Date(),
    });
    setSuccess("Update submitted!");
    setTopic("");
    setSubject("");
    setDetails("");
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "StudentSyllabusUpdates", id));
    setUpdates((prev) => prev.filter((u) => u.id !== id));
  };

  if (userRole === "student") {
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">Update Syllabus Progress</h2>
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
            placeholder="Topic Completed"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
          <textarea
            className="w-full border px-3 py-2 rounded"
            placeholder="Details/Notes"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            type="submit"
          >
            Submit
          </button>
        </form>
        {success && <div className="mt-4 text-green-600">{success}</div>}
      </div>
    );
  }

  // Teacher/Admin view
  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Student Syllabus Updates</h2>
      <ul className="divide-y">
        {updates.map((u) => (
          <li key={u.id} className="py-3 flex justify-between items-center">
            <div>
              <div className="font-semibold">
                {u.studentName} ({u.studentClass})
              </div>
              <div>Subject: {u.subject}</div>
              <div>Topic: {u.topic}</div>
              <div className="text-gray-600">{u.details}</div>
              <div className="text-xs text-gray-400">
                {u.createdAt?.toDate?.().toLocaleString?.() || ""}
              </div>
            </div>
            {userRole === "admin" && (
              <button
                className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={() => handleDelete(u.id)}
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

export default StudentSyllabusUpdate;
