import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const FacultyCard = ({ faculty, index, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.4 }}
      onClick={onClick}
      className="bg-white/15 backdrop-blur-md rounded-2xl p-8 hover:bg-white/25 transition-all cursor-pointer hover:scale-105 transform w-80 shadow-2xl"
    >
      <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white/70 shadow-xl">
        <img
          src={faculty.image}
          alt={faculty.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-bold text-center text-2xl mb-2 text-white">
        {faculty.name}
      </h3>
      <p className="text-lg text-center opacity-90 font-medium text-white">
        {faculty.subject}
      </p>
      <p className="text-sm text-center mt-2 opacity-75 text-white">
        {faculty.experience}
      </p>
      <div className="mt-4 text-center">
        <button className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-semibold transition-all text-white">
          View Details
        </button>
      </div>
    </motion.div>
  );
};

FacultyCard.propTypes = {
  faculty: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    experience: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default FacultyCard;
