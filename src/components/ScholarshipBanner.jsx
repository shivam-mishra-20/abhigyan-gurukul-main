import React from "react";
import { motion } from "framer-motion";
import {
  FaTrophy,
  FaCalendarAlt,
  FaGraduationCap,
  FaStar,
  FaBolt,
  FaArrowRight,
  FaClock,
} from "react-icons/fa";
import { useNavigate } from "react-router";

const ScholarshipBanner = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 overflow-hidden"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48 animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Section - Main Message */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center bg-yellow-400 text-green-800 px-4 py-2 rounded-full text-xs md:text-sm font-bold mb-3 shadow-lg"
            >
              <FaBolt className="mr-2 animate-pulse" />
              SCHOLARSHIP TEST 2026-27 - REGISTER NOW!
            </motion.div>

            <motion.h2
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2"
            >
              Scholarship Test cum Admission 2026-27
            </motion.h2>

            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/90 text-sm md:text-base mb-2"
            >
              💰 Scholarship Pool: ₹50 Lakhs – Early-Bird & Performance Merit
            </motion.p>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-white/80 text-xs md:text-sm mb-4 lg:mb-0"
            >
              Early Bird: 5-10% Off • Performance Bonus • Grades 6-12
            </motion.p>
          </div>

          {/* Middle Section - Key Dates */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 lg:gap-6"
          >
            {/* First Test Date */}
            <div className="bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl p-4 min-w-[160px] hover:bg-white/20 transition-all">
              <div className="flex items-center justify-center mb-2">
                <FaCalendarAlt className="text-yellow-300 text-xl mr-2" />
                <span className="text-white/80 text-xs font-semibold uppercase">
                  First Test
                </span>
              </div>
              <p className="text-white font-bold text-lg md:text-xl text-center">
                7th Dec
              </p>
              <p className="text-white/70 text-xs text-center flex items-center justify-center mt-1">
                <FaClock className="mr-1" /> 10:00 AM
              </p>
            </div>

            {/* Early Bird Discount */}
            <div className="bg-yellow-400 border-2 border-yellow-300 rounded-2xl p-4 min-w-[160px] hover:scale-105 transition-transform shadow-lg">
              <div className="flex items-center justify-center mb-2">
                <FaTrophy className="text-green-700 text-xl mr-2" />
                <span className="text-green-800 text-xs font-semibold uppercase">
                  Early Bird
                </span>
              </div>
              <p className="text-green-800 font-bold text-lg md:text-xl text-center">
                Up to 10%
              </p>
              <p className="text-green-700 text-xs text-center mt-1">
                + Performance Bonus
              </p>
            </div>

            {/* Available Seats */}
            <div className="bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl p-4 min-w-[160px] hover:bg-white/20 transition-all">
              <div className="flex items-center justify-center mb-2">
                <FaGraduationCap className="text-yellow-300 text-xl mr-2" />
                <span className="text-white/80 text-xs font-semibold uppercase">
                  Seats
                </span>
              </div>
              <p className="text-white font-bold text-lg md:text-xl text-center">
                217 Total
              </p>
              <p className="text-white/70 text-xs text-center mt-1">
                Multiple Grades
              </p>
            </div>
          </motion.div>

          {/* Right Section - CTA Button */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col gap-3"
          >
            <button
              onClick={() => navigate("/enrollnow")}
              className="group bg-white hover:bg-gray-50 text-green-600 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center whitespace-nowrap"
            >
              Register Now
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate("/admissions")}
              className="text-white hover:text-yellow-300 text-sm font-semibold underline underline-offset-4 transition-colors text-center"
            >
              View Complete Details →
            </button>
          </motion.div>
        </div>

        {/* Bottom Ticker - Mobile Friendly */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 pt-4 border-t border-white/20"
        >
          <div className="flex items-center justify-center gap-2 text-white/90 text-xs md:text-sm flex-wrap">
            <FaStar className="text-yellow-300" />
            <span className="font-semibold">6 Test Dates Available</span>
            <span className="hidden md:inline">•</span>
            <span>217 Seats Across All Grades</span>
            <span className="hidden md:inline">•</span>
            <span className="text-yellow-300 font-bold animate-pulse">
              Register Early for Higher Discount!
            </span>
          </div>
        </motion.div>
      </div>

      {/* Decorative Corner Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 border-r-4 border-t-4 border-white/20 rounded-tr-3xl"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 border-l-4 border-b-4 border-white/20 rounded-bl-3xl"></div>
    </motion.div>
  );
};

export default ScholarshipBanner;
