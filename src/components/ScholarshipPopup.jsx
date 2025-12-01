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

                <div className="text-center mb-3">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.25, type: "spring" }}
                    className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-green-800 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl text-xl sm:text-2xl md:text-3xl font-black shadow-2xl border-4 border-yellow-300"
                  >
                    🎓 UP TO 30% OFF 🎓
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.5 }}
                    className="text-base sm:text-lg md:text-xl font-bold text-yellow-400 mt-2"
                  >
                    + Early Bird Discounts!
                  </motion.p>
                </div>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl sm:text-2xl md:text-3xl font-bold mb-3"
                >
                  Scholarship Test cum Admission 2026-27
                </motion.h2>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base md:text-lg font-bold mb-3 border-2 border-white/40"
                >
                  💰 ₹50 Lakh Scholarship Pool
                </motion.div>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/95 text-base sm:text-lg mb-2 font-semibold"
                >
                  Merit-Based Scholarships + Early Bird Discounts
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
                      label: "Early Bird OFF",
                      highlight: true,
                    },
                    {
                      date: "14th December",
                      discount: "9%",
                      label: "Early Bird OFF",
                    },
                    {
                      date: "21st December",
                      discount: "8%",
                      label: "Early Bird OFF",
                    },
                    {
                      date: "28th December",
                      discount: "7%",
                      label: "Early Bird OFF",
                      special: "Current Students",
                    },
                    {
                      date: "4th January",
                      discount: "6%",
                      label: "Early Bird OFF",
                    },
                    {
                      date: "11th January",
                      discount: "5%",
                      label: "Early Bird OFF",
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
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-2 mb-2">
                          <p className="text-base sm:text-lg font-bold text-center">
                            Up to 30% OFF
                          </p>
                          <p className="text-[9px] sm:text-[10px] text-center opacity-90">
                            Merit-Based Scholarship
                          </p>
                        </div>
                        <div className="bg-yellow-400 text-green-800 rounded-lg p-2 mb-2">
                          <p className="text-sm sm:text-base font-bold text-center">
                            + Flat {item.discount}
                          </p>
                          <p className="text-[9px] sm:text-[10px] text-center font-semibold">
                            Early Bird Discount
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
                    { grade: "7th", seats: 20, stream: "" },
                    { grade: "8th", seats: 30, stream: "" },
                    { grade: "9th", seats: 40, stream: "" },
                    { grade: "10th", seats: 50, stream: "" },
                    { grade: "11th", seats: 30, stream: "Science" },
                    { grade: "11th", seats: 30, stream: "Commerce" },
                    { grade: "12th", seats: 7, stream: "Science" },
                    { grade: "12th", seats: 7, stream: "Commerce" },
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

              {/* Premium Features Highlight */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="mb-6"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                  <span className="text-2xl mr-2">✨</span>
                  Premium Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1:1 Mentoring Highlight */}
                  <div className="relative bg-gradient-to-br from-pink-100 via-pink-50 to-white rounded-xl p-5 border-4 border-pink-300 shadow-xl">
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full shadow-lg text-xs font-black animate-pulse">
                      ⭐ PREMIUM
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-3 rounded-xl text-3xl shadow-lg">
                        👨‍🏫
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-pink-900 mb-2 flex items-center gap-2">
                          1:1 Mentoring
                          <span className="text-lg">✨</span>
                        </h4>
                        <p className="text-sm text-pink-800 font-semibold leading-relaxed">
                          Personalized guidance from experienced faculty with
                          individual attention for focused learning
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Limited Batch Size Highlight */}
                  <div className="relative bg-gradient-to-br from-orange-100 via-orange-50 to-white rounded-xl p-5 border-4 border-orange-300 shadow-xl">
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full shadow-lg text-xs font-black animate-pulse">
                      ⭐ PREMIUM
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-3 rounded-xl text-3xl shadow-lg">
                        🎯
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-orange-900 mb-2 flex items-center gap-2">
                          Limited Batch Size
                          <span className="text-lg">✨</span>
                        </h4>
                        <p className="text-sm text-orange-800 font-semibold leading-relaxed">
                          Exclusive batches of{" "}
                          <span className="text-orange-600 font-black text-base">
                            15-18 students
                          </span>{" "}
                          ensuring optimal teacher-student ratio
                        </p>
                      </div>
                    </div>
                  </div>
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
                  <div className="flex items-start bg-yellow-50 p-3 rounded-lg border-2 border-yellow-300">
                    <FaCheckCircle className="text-yellow-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">
                        Merit-Based Scholarship
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Up to 30% OFF</strong> based on test performance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start bg-green-50 p-3 rounded-lg">
                    <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">
                        Early Bird Discount (Bonus)
                      </p>
                      <p className="text-sm text-gray-600">
                        Additional 10% OFF for early registration
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

              {/* Important Highlights */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-3 mb-6"
              >
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                  <p className="text-sm text-gray-800 font-semibold">
                    🎯 <strong>Maximize Your Savings:</strong> Score high to
                    earn up to 30% OFF + secure your spot early for an
                    additional 10% Early Bird Discount!
                  </p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>For Current Students:</strong> Upgrade your
                    scholarship benefits on 28th December
                  </p>
                </div>
                <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>For New Admissions:</strong> Multiple test dates
                    from 7th Dec to 11th Jan - register early to maximize
                    benefits!
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
                  Register Now - Save Up To 30%
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleLearnMore}
                  className="flex-1 bg-white hover:bg-gray-50 text-green-600 px-8 py-4 rounded-xl font-bold text-lg border-2 border-green-600 hover:border-green-700 transition-all flex items-center justify-center"
                >
                  View Details
                </button>
              </motion.div>

              {/* Terms and Conditions */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200"
              >
                <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center">
                  <span className="text-green-600 mr-2">ℹ️</span>
                  Terms & Conditions
                </h3>
                <div className="space-y-2 text-xs text-gray-700">
                  <p>
                    • <strong>Scholarship Eligibility:</strong> Based on test
                    merit (up to 30% OFF) + Early Bird Discount (10%)
                  </p>
                  <p>
                    • <strong>Test Registration:</strong> Register before chosen
                    test date. Minimum 70% marks required
                  </p>
                  <p>
                    • <strong>Distribution:</strong> ₹50L pool distributed among
                    deserving students. Individual amounts vary
                  </p>
                  <p>
                    • <strong>Test Guidelines:</strong> 3-hour test (10 AM-1
                    PM). No negative marking. ID proof mandatory
                  </p>
                  <p>
                    • <strong>Admission:</strong> Subject to document
                    verification and seat availability (217 total seats)
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-300">
                  <p className="text-xs text-gray-600 italic">
                    By registering, you agree to abide by all terms. Institution
                    reserves right to make final decisions.
                  </p>
                </div>
              </motion.div>

              {/* Footer Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7 }}
                className="text-center text-sm text-gray-600 mt-6 font-medium"
              >
                <strong>Limited Seats Available!</strong> Secure premium
                education with substantial savings. Register today and unlock
                your potential!
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScholarshipPopup;
