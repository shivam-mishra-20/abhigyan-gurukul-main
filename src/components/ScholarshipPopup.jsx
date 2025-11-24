import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrophy,
  FaCalendarAlt,
  FaGraduationCap,
  FaTimes,
  FaClock,
  FaCheckCircle,
  FaStar,
  FaArrowRight,
  FaBolt,
} from "react-icons/fa";
import { useNavigate } from "react-router";

const ScholarshipPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show popup after a short delay for better UX
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleEnrollNow = () => {
    handleClose();
    navigate("/enrollnow");
  };

  const handleLearnMore = () => {
    handleClose();
    navigate("/admissions");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-y-auto scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="absolute top-4 right-4 z-[100] bg-white hover:bg-gray-100 text-gray-700 hover:text-red-500 p-3 rounded-full transition-all shadow-xl border-2 border-gray-200"
              aria-label="Close"
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 text-white p-4 sm:p-6 md:p-8 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-block bg-yellow-400 text-green-800 px-4 py-2 rounded-full text-sm font-bold mb-4"
                >
                  <FaStar className="inline mr-2" />
                  LIMITED TIME OFFER
                </motion.div>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3"
                >
                  Scholarship Test cum Admission 2026-27
                </motion.h2>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="inline-block bg-yellow-400 text-green-800 px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base md:text-lg font-bold mb-3 shadow-lg"
                >
                  💰 Scholarship Pool: ₹50 Lakhs
                </motion.div>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/90 text-base sm:text-lg mb-2"
                >
                  Additional OFF Based on Early-Bird & Performance Merit
                </motion.p>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="text-sm mt-2 opacity-90"
                >
                  For Grades 6th to 12th | Multiple Test Dates Available
                </motion.p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 md:p-6">
              {/* Test Dates & Early Bird Scholarships */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaCalendarAlt className="text-green-600 mr-3 text-2xl" />
                  Test Dates & Early Bird Scholarships
                </h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    {
                      date: "7th December",
                      discount: "10%",
                      label: "additional OFF",
                      highlight: true,
                    },
                    {
                      date: "14th December",
                      discount: "9%",
                      label: "additional OFF",
                    },
                    {
                      date: "21st December",
                      discount: "8%",
                      label: "additional OFF",
                    },
                    {
                      date: "28th December",
                      discount: "7%",
                      label: "additional OFF",
                      special: "Current Students",
                    },
                    {
                      date: "4th January",
                      discount: "6%",
                      label: "additional OFF",
                    },
                    {
                      date: "11th January",
                      discount: "5%",
                      label: "additional OFF",
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      className={`bg-gradient-to-br ${
                        item.highlight
                          ? "from-yellow-50 to-orange-50 border-yellow-400 border-4"
                          : "from-green-50 to-emerald-50 border-green-200 border-2"
                      } p-3 sm:p-4 rounded-2xl hover:shadow-xl transition-all`}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      {item.highlight && (
                        <div className="inline-block bg-yellow-400 text-green-800 px-2 py-1 rounded-full text-[9px] sm:text-[10px] font-bold mb-2">
                          ⭐ BEST OFFER
                        </div>
                      )}
                      <div className="mb-2">
                        <div className="flex items-center mb-2">
                          <FaCalendarAlt className="text-green-600 text-lg sm:text-xl mr-2" />
                          <h4 className="font-bold text-gray-800 text-xs sm:text-sm">
                            {item.date}
                          </h4>
                        </div>
                        {item.special && (
                          <p className="text-[9px] sm:text-[10px] text-blue-600 font-semibold mb-2">
                            {item.special}
                          </p>
                        )}
                        <div className="text-center bg-white/50 rounded-lg p-2 mb-2">
                          <p className="text-2xl sm:text-3xl font-bold text-green-600">
                            {item.discount}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-700 font-semibold">
                            {item.label}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white/70 rounded-lg p-2">
                        <p className="text-[10px] sm:text-[11px] text-gray-700 flex items-center justify-center">
                          <FaCheckCircle className="text-green-500 mr-1 text-xs" />
                          10:00 AM - 1:00 PM
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Available Seats */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaGraduationCap className="text-green-600 mr-3 text-2xl" />
                  Available Seats (New Admissions)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { grade: "6th → 7th", seats: 20, stream: "" },
                    { grade: "7th → 8th", seats: 30, stream: "" },
                    { grade: "8th → 9th", seats: 40, stream: "" },
                    { grade: "9th → 10th", seats: 50, stream: "" },
                    { grade: "10th → 11th", seats: 30, stream: "Science" },
                    { grade: "10th → 11th", seats: 30, stream: "Commerce" },
                    { grade: "11th → 12th", seats: 7, stream: "Science" },
                    { grade: "11th → 12th", seats: 7, stream: "Commerce" },
                  ].map((item, idx) => {
                    const isLimited = item.seats <= 7;
                    return (
                      <motion.div
                        key={idx}
                        className={`relative bg-white rounded-xl shadow-md p-4 border-2 transition-all ${
                          isLimited
                            ? "border-red-400 bg-gradient-to-br from-red-50 to-orange-50"
                            : "border-green-200 hover:border-green-400"
                        } hover:shadow-xl`}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        {isLimited && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                            LIMITED!
                          </div>
                        )}
                        <div className="flex items-center justify-center mb-2">
                          <div
                            className={`p-2 rounded-full ${
                              isLimited ? "bg-red-100" : "bg-green-100"
                            }`}
                          >
                            <FaGraduationCap
                              className={`text-xl ${
                                isLimited ? "text-red-600" : "text-green-600"
                              }`}
                            />
                          </div>
                        </div>
                        <h4 className="text-sm font-bold text-center mb-1 text-gray-800">
                          {item.grade}
                        </h4>
                        {item.stream && (
                          <p className="text-center text-[10px] text-gray-600 mb-2 font-medium">
                            {item.stream}
                          </p>
                        )}
                        <div className="text-center">
                          <span
                            className={`text-3xl font-bold ${
                              isLimited ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {item.seats}
                          </span>
                          <p className="text-gray-500 text-[10px] mt-1">
                            seats
                          </p>
                        </div>
                        {isLimited && (
                          <div className="mt-2 text-center">
                            <span className="inline-block bg-yellow-100 text-yellow-800 text-[9px] font-semibold px-2 py-1 rounded-full">
                              Register Early!
                            </span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 text-center">
                  <FaBolt className="text-2xl text-yellow-600 mx-auto mb-2" />
                  <h4 className="text-base font-bold text-gray-800 mb-1">
                    ⚠️ Limited Seats Alert!
                  </h4>
                  <p className="text-xs text-gray-700">
                    11th → 12th seats extremely limited with only{" "}
                    <span className="font-bold text-red-600">7 seats each</span>
                    !
                  </p>
                </div>
              </motion.div>

              {/* Scholarship Benefits */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mb-6"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                  <FaTrophy className="text-yellow-500 mr-3" />
                  Scholarship Benefits
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start bg-green-50 p-3 rounded-lg">
                    <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">
                        Early Bird Scholarships
                      </p>
                      <p className="text-sm text-gray-600">
                        5% to 10% additional OFF on tuition fees
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start bg-yellow-50 p-3 rounded-lg">
                    <FaCheckCircle className="text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">
                        Performance-Based Scholarship
                      </p>
                      <p className="text-sm text-gray-600">
                        Additional OFF based on test results
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start bg-blue-50 p-3 rounded-lg">
                    <FaCheckCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">
                        Priority Benefits
                      </p>
                      <p className="text-sm text-gray-600">
                        Batch selection & mentorship sessions
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Important Notices */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-3 mb-6"
              >
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>For Current Students:</strong> Separate test on 28th
                    December for all grades
                  </p>
                </div>
                <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>For New Admissions:</strong> Choose any test date
                    from 7th Dec to 11th Jan - earlier you register, higher the
                    early bird discount!
                  </p>
                </div>
              </motion.div>

              {/* Call to Action Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={handleEnrollNow}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
                >
                  Register Now for Test
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleLearnMore}
                  className="flex-1 bg-white hover:bg-gray-50 text-green-600 px-8 py-4 rounded-xl font-bold text-lg border-2 border-green-600 hover:border-green-700 transition-all flex items-center justify-center"
                >
                  Learn More
                </button>
              </motion.div>

              {/* Footer Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="text-center text-sm text-gray-500 mt-6"
              >
                Don&apos;t miss this opportunity to get quality education at a
                reduced cost!
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScholarshipPopup;
