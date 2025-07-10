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
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};

const ExtraClassRequest = () => {
  const userRole = localStorage.getItem("userRole");
  const studentName = localStorage.getItem("studentName");
  const studentClass = localStorage.getItem("studentClass");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDocs(collection(db, "ExtraClassRequests")).then((snapshot) => {
      setRequests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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
    setTimeout(() => setSuccess(""), 2000);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "ExtraClassRequests", id));
    setRequests((prev) => prev.filter((r) => r.id !== id));
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
          <FaPlusCircle className="text-blue-600 text-2xl" />
          <h2 className="text-2xl font-bold text-blue-700">
            Request Extra Class
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="e.g. Mathematics"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Topic <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="e.g. Algebra"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Reason/Details
            </label>
            <textarea
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Why do you need an extra class?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
            type="submit"
          >
            Submit Request
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
        <FaPlusCircle className="text-blue-600 text-2xl" />
        <h2 className="text-2xl font-bold text-blue-700">
          Extra Class Requests
        </h2>
      </div>
      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading...</div>
      ) : (
        <ul className="divide-y">
          <AnimatePresence>
            {requests.length === 0 && (
              <motion.li
                className="py-8 text-center text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                No requests found.
              </motion.li>
            )}
            {requests.map((r) => (
              <motion.li
                key={r.id}
                className="py-5 flex justify-between items-center"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <div>
                  <div className="font-semibold text-lg text-gray-800">
                    {r.studentName}{" "}
                    <span className="text-gray-500">({r.studentClass})</span>
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="font-medium text-blue-700">Subject:</span>{" "}
                    {r.subject}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-blue-700">Topic:</span>{" "}
                    {r.topic}
                  </div>
                  <div className="text-gray-600 text-sm mt-1">{r.reason}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {r.createdAt?.toDate?.().toLocaleString?.() ||
                      (typeof r.createdAt === "string" ? r.createdAt : "")}
                  </div>
                </div>
                {userRole === "admin" && (
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    className="ml-4 px-3 py-2 bg-red-500 text-white rounded shadow hover:bg-red-700 flex items-center gap-2 transition"
                    onClick={() => handleDelete(r.id)}
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

export default ExtraClassRequest;
