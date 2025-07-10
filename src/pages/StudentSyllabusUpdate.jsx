import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { FaBook, FaTrashAlt } from "react-icons/fa";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};

const StudentSyllabusUpdate = () => {
  const userRole = localStorage.getItem("userRole");
  const studentName = localStorage.getItem("studentName");
  const studentClass = localStorage.getItem("studentClass");
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [success, setSuccess] = useState("");
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDocs(collection(db, "StudentSyllabusUpdates")).then((snapshot) => {
      setUpdates(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
  }, [userRole, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create docId as StudentName_Class_Topic (sanitize for spaces)
    const docId = `${studentName}_${studentClass}_${topic}`.replace(
      /\s+/g,
      "_"
    );
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
    setTimeout(() => setSuccess(""), 2000);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "StudentSyllabusUpdates", id));
    setUpdates((prev) => prev.filter((u) => u.id !== id));
  };

  if (userRole === "student") {
    return (
      <motion.div
        className="bg-white rounded-xl shadow-lg p-8 max-w-lg mx-auto mt-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        <div className="flex items-center mb-6 gap-2">
          <FaBook className="text-green-600 text-2xl" />
          <h2 className="text-2xl font-bold text-green-700">
            Update Syllabus Progress
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border border-green-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              placeholder="e.g. Science"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Topic Completed <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border border-green-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              placeholder="e.g. Photosynthesis"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Details/Notes
            </label>
            <textarea
              className="w-full border border-green-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              placeholder="Any additional details..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
            type="submit"
          >
            Submit Update
          </motion.button>
        </form>
        <AnimatePresence>
          {success && (
            <motion.div
              className="mt-6 text-green-600 font-semibold text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Teacher/Admin view
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto mt-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring" }}
    >
      <div className="flex items-center mb-6 gap-2">
        <FaBook className="text-green-600 text-2xl" />
        <h2 className="text-2xl font-bold text-green-700">
          Student Syllabus Updates
        </h2>
      </div>
      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading...</div>
      ) : (
        <ul className="divide-y">
          <AnimatePresence>
            {updates.length === 0 && (
              <motion.li
                className="py-8 text-center text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                No updates found.
              </motion.li>
            )}
            {updates.map((u) => (
              <motion.li
                key={u.id}
                className="py-5 flex justify-between items-center"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <div>
                  <div className="font-semibold text-lg text-gray-800">
                    {u.studentName}{" "}
                    <span className="text-gray-500">({u.studentClass})</span>
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="font-medium text-green-700">Subject:</span>{" "}
                    {u.subject}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-green-700">Topic:</span>{" "}
                    {u.topic}
                  </div>
                  <div className="text-gray-600 text-sm mt-1">{u.details}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {u.createdAt?.toDate?.().toLocaleString?.() ||
                      (typeof u.createdAt === "string" ? u.createdAt : "")}
                  </div>
                </div>
                {userRole === "admin" && (
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    className="ml-4 px-3 py-2 bg-red-500 text-white rounded shadow hover:bg-red-700 flex items-center gap-2 transition"
                    onClick={() => handleDelete(u.id)}
                  >
                    <FaTrashAlt />
                    Delete
                  </motion.button>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </motion.div>
  );
};

export default StudentSyllabusUpdate;
