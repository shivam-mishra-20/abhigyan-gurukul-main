import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaChalkboardTeacher,
  FaStar,
  FaClock,
  FaTimes,
} from "react-icons/fa";

const FacultyModal = ({ faculty, onClose }) => {
  if (!faculty) return null;

  console.log("FacultyModal rendering for:", faculty.name);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-gradient-to-br from-emerald-600 to-green-500 rounded-3xl max-w-2xl w-full p-8 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors z-10"
        >
          <FaTimes className="text-3xl" />
        </button>

        <div className="text-white">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/70 shadow-2xl flex-shrink-0"
            >
              <img
                src={faculty.image}
                alt={faculty.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="flex-1 text-center md:text-left">
              <motion.h2
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold mb-2"
              >
                {faculty.name}
              </motion.h2>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-2xl opacity-95 mb-3 font-medium"
              >
                {faculty.subject}
              </motion.p>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center md:justify-start gap-2 text-lg opacity-90"
              >
                <FaClock className="text-xl" />
                <span>{faculty.experience}</span>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="bg-white/20 backdrop-blur-md rounded-2xl p-6 space-y-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FaGraduationCap className="text-2xl" />
                <h3 className="text-xl font-semibold">Education</h3>
              </div>
              <p className="text-lg opacity-90 pl-8">{faculty.education}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <FaStar className="text-2xl" />
                <h3 className="text-xl font-semibold">Specialization</h3>
              </div>
              <p className="text-lg opacity-90 pl-8">{faculty.specialty}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <FaChalkboardTeacher className="text-2xl" />
                <h3 className="text-xl font-semibold">Teaching Experience</h3>
              </div>
              <p className="text-lg opacity-90 pl-8">
                {faculty.experience} of dedicated teaching in {faculty.subject}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

FacultyModal.propTypes = {
  faculty: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    experience: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    education: PropTypes.string.isRequired,
    specialty: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
};

export default FacultyModal;
