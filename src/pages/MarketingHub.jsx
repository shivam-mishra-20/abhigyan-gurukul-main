import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { facultyMembers } from "../data/facultyData";

import {
  FaGraduationCap,
  FaChalkboardTeacher,
  FaRupeeSign,
  FaUserGraduate,
  FaStar,
  FaTrophy,
  FaLaptop,
  FaBook,
  FaClock,
  FaAward,
  FaTimes,
  FaCheckCircle,
  FaUsers,
  FaBolt,
  FaCalendarAlt,
  FaGift,
  FaClipboardList,
  FaPercent,
  FaInfoCircle,
} from "react-icons/fa";
import "../styles/MarketingSlideEngine.css";
import FacultyCard from "../components/FacultyCard";
import FacultyModal from "../components/FacultyModal";
import FeatureVideoShowcase from "../components/FeatureVideoShowcase";

// Scholarship Data
const scholarshipTestDates = [
  { date: "7th Dec", day: "Saturday", discount: "10%", best: true, seats: 7 },
  { date: "14th Dec", day: "Saturday", discount: "9%", seats: 7 },
  { date: "21st Dec", day: "Saturday", discount: "8%", seats: 7 },
  {
    date: "28th Dec",
    day: "Saturday",
    discount: "7%",
    special: "Current Students",
    seats: 7,
  },
  { date: "4th Jan", day: "Saturday", discount: "6%", seats: 7 },
  { date: "11th Jan", day: "Saturday", discount: "5%", seats: 7 },
];

const syllabusData = [
  {
    grade: "6th → 7th",
    color: "cyan",
    maths: [
      "Decimals",
      "Fraction",
      "Algebra",
      "Mensuration",
      "Ratio and proportion",
    ],
    science: [
      "Diversity in Living World",
      "Materials around us",
      "Temperature and its measurement",
      "Measurement of Length and Motion",
      "Mindful Eating: A path to Healthy Body",
      "A journey through states of water",
    ],
  },
  {
    grade: "7th → 8th",
    color: "blue",
    maths: [
      "Exponents and powers",
      "Algebraic expressions",
      "Triangle and its properties",
      "Perimeter and area",
      "Rational numbers",
      "Comparing quantities",
    ],
    science: [
      "Light",
      "Acid, base & salts",
      "Motion and time",
      "Physical & chemical changes",
      "Transportation in plants & animals",
      "Electric current and its effects",
    ],
  },
  {
    grade: "8th → 9th",
    color: "purple",
    maths: [
      "Factorisation",
      "Algebraic expressions",
      "Mensuration",
      "Exponents and power",
      "Understanding quadrilaterals",
      "Linear equations",
    ],
    science: [
      "Force & pressure",
      "Friction",
      "Sound",
      "Coal & petroleum",
      "Combustion & flame",
      "Reaching the age of adolescence",
      "Reproduction in animals",
    ],
  },
  {
    grade: "9th → 10th",
    color: "orange",
    maths: [
      "Number system",
      "Polynomials",
      "Coordinate geometry",
      "Linear equations",
      "Triangles",
      "Surface areas and volumes",
      "Heron's formula",
      "Circles",
    ],
    science: [
      "Atoms & molecules",
      "Structure of atom",
      "Motion",
      "Gravitation",
      "Force & laws of motion",
      "Work & energy",
      "Sound",
      "Fundamental unit of life",
      "Tissues",
    ],
  },
  {
    grade: "10th → 11th",
    color: "green",
    maths: ["Full syllabus (Std)", "Full syllabus (Basics)"],
    science: [
      "Full syllabus (Chemistry + Physics)",
      "Full syllabus (Chemistry + Physics + Bio)",
    ],
  },
];

const MarketingHub = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [detailView, setDetailView] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const slideRef = useRef(null);

  // Scholarship modal states
  const [scholarshipModal, setScholarshipModal] = useState(null);

  // Generate faculty slides - 2 faculty members per slide
  const facultySlides = Array.from(
    { length: Math.ceil(facultyMembers.length / 2) },
    (_, i) => ({
      id: `faculties-${i}`,
      type: "faculties",
      title: "Meet Our Expert Faculty",
      subtitle: `Part ${i + 1} of ${Math.ceil(facultyMembers.length / 2)}`,
      icon: <FaUsers className="text-5xl" />,
      bgColor: "bg-white",
      data: facultyMembers.slice(i * 2, i * 2 + 2),
    })
  );

  const marketingSlides = [
    {
      id: "hero",
      type: "hero",
      title: "Welcome to Abhigyan Gurukul",
      subtitle: "Excellence in Education",
      description: "Transform your academic journey with us",
      icon: (
        <img
          src="/ABHIGYAN_GURUKUL_logo.png"
          alt="Abhigyan Gurukul"
          className="w-48 h-48 object-contain"
        />
      ),
      bgColor: "bg-white",
    },
    {
      id: "scholarship",
      type: "scholarship",
      title: "Scholarship Program 2026",
      subtitle: "Up to 30% OFF + Early Bird Discounts",
      icon: <FaGift className="text-5xl" />,
      bgColor: "bg-gradient-to-br from-yellow-50 via-orange-50 to-green-50",
    },
    {
      id: "features",
      type: "features",
      title: "Our Key Features",
      subtitle: "Why Choose Us",
      icon: <FaStar className="text-5xl" />,
      bgColor: "bg-gradient-to-br from-white via-green-50 to-emerald-50",
      items: [
        {
          icon: <FaChalkboardTeacher />,
          title: "Expert Faculty",
          description: "Learn from IIT & PhD qualified teachers",
        },
        {
          icon: <FaLaptop />,
          title: "Smart Classes",
          description: "Digital learning with interactive tools",
        },
        {
          icon: <FaTrophy />,
          title: "Proven Results",
          description: "98% success rate in board exams",
        },
        {
          icon: <FaBook />,
          title: "Comprehensive Study Material",
          description: "Well-structured notes and practice sets",
        },
        {
          icon: <FaClock />,
          title: "Flexible Timings",
          description: "Choose slots that fit your schedule",
        },
        {
          icon: <FaAward />,
          title: "Doubt Clearing Sessions",
          description: "Personal attention to every student",
        },
      ],
    },
    // Insert faculty slides
    ...facultySlides,
    // {
    //   id: "fees",
    //   type: "fees",
    //   title: "Fee Structure",
    //   subtitle: "Affordable Quality Education",
    //   icon: <FaRupeeSign className="text-5xl" />,
    //   bgColor: "bg-gray-50",
    //   packages: [
    //     {
    //       name: "Class 9-10 (CBSE/GSEB)",
    //       price: "₹8,000",
    //       duration: "per year",
    //       features: [
    //         "All subjects covered",
    //         "Weekly tests",
    //         "Study materials included",
    //         "Doubt clearing sessions",
    //         "Progress tracking",
    //       ],
    //       popular: false,
    //     },
    //     {
    //       name: "Class 11-12 (Science)",
    //       price: "₹15,000",
    //       duration: "per year",
    //       features: [
    //         "PCM/PCB streams",
    //         "JEE/NEET preparation",
    //         "Daily practice sessions",
    //         "Mock tests",
    //         "Career counseling",
    //         "Scholarship opportunities",
    //       ],
    //       popular: true,
    //     },
    //     {
    //       name: "Competitive Exams",
    //       price: "₹20,000",
    //       duration: "per year",
    //       features: [
    //         "JEE Main & Advanced",
    //         "NEET preparation",
    //         "Previous year papers",
    //         "Expert mentorship",
    //         "Online test series",
    //         "Interview preparation",
    //       ],
    //       popular: false,
    //     },
    //   ],
    // },
    {
      id: "achievements",
      type: "achievements",
      title: "Our Achievements",
      subtitle: "Excellence in Education Since 2020",
      icon: <FaTrophy className="text-5xl" />,
      bgColor: "bg-gradient-to-br from-white via-green-50 to-emerald-50",
      stats: [
        {
          value: "500+",
          label: "Students Enrolled",
          icon: <FaUsers className="text-2xl" />,
          description: "Pursuing excellence in various courses",
          color: "blue",
        },
        {
          value: "95%",
          label: "Success Rate",
          icon: <FaGraduationCap className="text-2xl" />,
          description: "Students achieving academic goals",
          color: "green",
        },
        {
          value: "120+",
          label: "Award Winners",
          icon: <FaTrophy className="text-2xl" />,
          description: "Excelling in competitions",
          color: "yellow",
        },
        {
          value: "25+",
          label: "Expert Teachers",
          icon: <FaChalkboardTeacher className="text-2xl" />,
          description: "Dedicated to student success",
          color: "purple",
        },
      ],
      highlights: [
        "1:1 Mentoring for personalized guidance",
        "15-18 students per batch for focused learning",
        "AC classrooms with smart boards",
        "Regular parent-teacher meetings",
        "Digital exam system & study materials",
      ],
    },
    {
      id: "enroll",
      type: "enroll",
      title: "Start Your Journey Today",
      subtitle: "Enroll Now",
      icon: <FaUserGraduate className="text-5xl" />,
      bgColor: "bg-gradient-to-br from-green-600 via-emerald-600 to-green-700",
    },
  ];

  // Auto-scroll functionality
  useEffect(() => {
    // Don't auto-scroll on features slide (video showcase handles its own timing)
    const isOnFeaturesSlide =
      marketingSlides[currentSlide]?.type === "features";
    if (!isAutoScrolling || detailView || isOnFeaturesSlide) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % marketingSlides.length);
    }, 8000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoScrolling, detailView, marketingSlides.length, currentSlide]);

  // Touch handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoScrolling(false);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
    setTimeout(() => setIsAutoScrolling(true), 3000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % marketingSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? marketingSlides.length - 1 : prev - 1
    );
  };

  const openDetailView = (slideId) => {
    setDetailView(slideId);
    setIsAutoScrolling(false);
  };

  const closeDetailView = () => {
    setDetailView(null);
    setIsAutoScrolling(true);
  };

  const handleEnrollNow = () => {
    navigate("/enrollnow");
  };

  // Render individual slide types
  const renderSlideContent = (slide) => {
    switch (slide.type) {
      case "hero":
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-green-600"
            >
              {slide.icon}
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold mt-6 text-center text-gray-800"
            >
              {slide.title}
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl mt-4 text-center text-green-600 font-semibold"
            >
              {slide.subtitle}
            </motion.p>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl mt-2 text-center text-gray-600"
            >
              {slide.description}
            </motion.p>
          </div>
        );

      case "scholarship":
        return (
          <div className="h-full flex flex-col justify-center px-2 sm:px-4 md:px-8 lg:px-12 py-4 md:py-6 overflow-hidden">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-green-800 px-8 py-2.5 rounded-full text-xl md:text-2xl font-black shadow-xl mb-3"
              >
                ⚡ UP TO 30% OFF ⚡
              </motion.div>
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-5xl font-bold text-gray-800"
              >
                Scholarship Test 2026-27
              </motion.h2>
              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-base md:text-xl mt-2 text-green-600 font-semibold"
              >
                ₹50 Lakh Scholarship Pool | Limited 217 Seats | Grades 6-12
              </motion.p>
            </div>

            {/* 3 Large Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 flex-1"
            >
              {/* Test Dates Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setScholarshipModal("dates");
                  setIsAutoScrolling(false);
                }}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-green-200 cursor-pointer hover:border-green-500 hover:shadow-2xl transition-all group flex flex-col"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <FaCalendarAlt className="text-2xl md:text-3xl text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg md:text-xl">
                      Test Dates
                    </h3>
                    <p className="text-sm text-green-600 font-medium">
                      6 Saturdays Available
                    </p>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-xl border border-yellow-200">
                    <span className="font-semibold text-gray-700">7th Dec</span>
                    <span className="bg-yellow-400 text-green-800 px-2 py-0.5 rounded-full text-xs font-bold">
                      +10% OFF
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                    <span className="font-medium text-gray-600">
                      14th Dec - 11th Jan
                    </span>
                    <span className="text-green-600 text-sm font-semibold">
                      +5-9% OFF
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaClock className="text-green-500" />
                      <span>10 AM - 1 PM</span>
                    </div>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-semibold group-hover:bg-green-600 group-hover:text-white transition-colors">
                      View All →
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Discounts Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setScholarshipModal("details");
                  setIsAutoScrolling(false);
                }}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-yellow-200 cursor-pointer hover:border-yellow-500 hover:shadow-2xl transition-all group flex flex-col"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <FaPercent className="text-2xl md:text-3xl text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg md:text-xl">
                      Discounts
                    </h3>
                    <p className="text-sm text-orange-600 font-medium">
                      Merit + Early Bird
                    </p>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="bg-green-50 p-3 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Merit Based</span>
                      <span className="font-bold text-green-600">
                        Up to 30%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Top scorers get maximum discount
                    </div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-xl border border-orange-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Early Bird</span>
                      <span className="font-bold text-orange-600">+5-10%</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Register early, save more
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-black text-green-600">
                      = 40% MAX
                    </div>
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-sm font-semibold group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                      Details →
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Syllabus Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setScholarshipModal("syllabus");
                  setIsAutoScrolling(false);
                }}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-blue-200 cursor-pointer hover:border-blue-500 hover:shadow-2xl transition-all group flex flex-col"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <FaClipboardList className="text-2xl md:text-3xl text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg md:text-xl">
                      Test Syllabus
                    </h3>
                    <p className="text-sm text-blue-600 font-medium">
                      Previous Class Topics
                    </p>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                    <span>Maths & Science only</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                    <span>No negative marking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                    <span>3 hours duration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                    <span>MCQs + Short answers</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Grades 6-12</div>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-semibold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      View Syllabus →
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Bottom Register Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/admissions#scholarship")}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
              >
                Register for Scholarship Test →
              </motion.button>
            </motion.div>
          </div>
        );

      case "features":
        return (
          <FeatureVideoShowcase
            onAllVideosPlayed={() => {
              // Auto-advance to next slide after all videos are played
              nextSlide();
            }}
          />
        );

      case "faculties":
        return (
          <div className="h-full flex flex-col justify-center px-4 md:px-8 overflow-hidden">
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="flex justify-center mb-2 text-green-600"
              >
                {slide.icon}
              </motion.div>
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl md:text-4xl font-bold text-gray-800"
              >
                {slide.title}
              </motion.h2>
              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-lg md:text-xl mt-1 text-green-600 font-semibold"
              >
                IIT & PhD Qualified Experts
              </motion.p>
            </div>

            {/* Faculty Cards - Enhanced Design */}
            <div className="flex justify-center items-stretch gap-6 md:gap-10 px-4 md:px-12 flex-1">
              {slide.data.map((faculty, idx) => (
                <motion.div
                  key={faculty.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: idx * 0.2,
                    duration: 0.5,
                    type: "spring",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFaculty(faculty);
                    setIsAutoScrolling(false);
                  }}
                  className="relative bg-gradient-to-br from-white to-green-50 border-2 border-green-200 rounded-3xl p-6 md:p-8 hover:border-green-500 hover:shadow-2xl transition-all shadow-xl cursor-pointer hover:scale-105 transform w-full max-w-md group"
                >
                  {/* Decorative Badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    ⭐ Expert Faculty
                  </div>

                  {/* Profile Image with Ring */}
                  <div className="relative w-36 h-36 md:w-44 md:h-44 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 animate-pulse opacity-30"></div>
                    <div className="absolute inset-1 rounded-full overflow-hidden border-4 border-white shadow-xl">
                      <img
                        src={faculty.image}
                        alt={faculty.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Faculty Info */}
                  <div className="text-center">
                    <h3 className="font-bold text-xl md:text-2xl text-gray-800 mb-1">
                      {faculty.name}
                    </h3>
                    <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold mb-2">
                      {faculty.subject}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {faculty.experience}
                    </p>

                    {/* Stats Row */}
                    <div className="flex justify-center gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">500+</p>
                        <p className="text-xs text-gray-500">Students</p>
                      </div>
                      <div className="w-px bg-gray-200"></div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">98%</p>
                        <p className="text-xs text-gray-500">Success</p>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      View Profile →
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-4 text-sm text-gray-500"
            >
              🎓 Click on any faculty card to view their complete profile &
              achievements
            </motion.p>
          </div>
        );

      case "fees":
        return (
          <div
            className="h-full overflow-y-auto cursor-pointer px-4 md:px-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onClick={() => openDetailView(slide.id)}
          >
            <div className="text-center mb-8 pt-8">
              <div className="flex justify-center mb-4 text-green-600">
                {slide.icon}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                {slide.title}
              </h2>
              <p className="text-xl md:text-2xl mt-2 text-green-600 font-semibold">
                {slide.subtitle}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto pb-8">
              {slide.packages.map((pkg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  className={`bg-white border-2 rounded-2xl p-4 md:p-6 hover:shadow-xl transition-all shadow-md relative ${
                    pkg.popular
                      ? "border-yellow-400 ring-4 ring-yellow-200"
                      : "border-green-100 hover:border-green-400"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-green-800 px-4 py-1 rounded-full text-xs md:text-sm font-bold">
                      Most Popular
                    </div>
                  )}
                  <h3 className="font-bold text-lg md:text-xl text-center mb-2 text-gray-800">
                    {pkg.name}
                  </h3>
                  <div className="text-center mb-4">
                    <span className="text-2xl md:text-3xl font-bold text-green-600">
                      {pkg.price}
                    </span>
                    <span className="text-xs md:text-sm text-gray-500 ml-2">
                      {pkg.duration}
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs md:text-sm">
                    {pkg.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <FaCheckCircle className="mr-2 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
            <p className="text-center pb-6 text-sm text-gray-500">
              Click to view complete fee structure
            </p>
          </div>
        );

      case "achievements":
        return (
          <div className="h-full flex flex-col justify-center px-2 sm:px-4 md:px-8 py-4 overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-4 md:mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="flex justify-center mb-3 text-green-600"
              >
                {slide.icon}
              </motion.div>
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-5xl font-bold text-gray-800"
              >
                {slide.title}
              </motion.h2>
              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl mt-2 text-green-600 font-semibold"
              >
                {slide.subtitle}
              </motion.p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-6xl mx-auto mb-4 md:mb-6">
              {slide.stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15, type: "spring" }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`bg-white rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all border-2 ${
                    stat.color === "blue"
                      ? "border-blue-200 hover:border-blue-400"
                      : stat.color === "green"
                      ? "border-green-200 hover:border-green-400"
                      : stat.color === "yellow"
                      ? "border-yellow-200 hover:border-yellow-400"
                      : "border-purple-200 hover:border-purple-400"
                  }`}
                >
                  <div
                    className={`flex justify-center mb-2 md:mb-3 ${
                      stat.color === "blue"
                        ? "text-blue-500"
                        : stat.color === "green"
                        ? "text-green-500"
                        : stat.color === "yellow"
                        ? "text-yellow-500"
                        : "text-purple-500"
                    }`}
                  >
                    {stat.icon}
                  </div>
                  <div
                    className={`text-3xl md:text-4xl font-bold mb-1 text-center ${
                      stat.color === "blue"
                        ? "text-blue-600"
                        : stat.color === "green"
                        ? "text-green-600"
                        : stat.color === "yellow"
                        ? "text-yellow-600"
                        : "text-purple-600"
                    }`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-gray-700 font-semibold text-center">
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-1 hidden md:block">
                    {stat.description}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Highlights Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-4 md:p-6 text-white">
                <h3 className="text-lg md:text-xl font-bold mb-3 text-center">
                  Why Parents Trust Us
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                  {slide.highlights?.map((highlight, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + idx * 0.1 }}
                      className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2"
                    >
                      <FaCheckCircle className="text-green-300 flex-shrink-0 text-sm" />
                      <span className="text-xs md:text-sm">{highlight}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        );

      case "enroll":
        return (
          <div className="h-full text-white">
            <div className="flex flex-col items-center justify-center h-full px-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {slide.icon}
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-bold mt-6 text-center">
                {slide.title}
              </h2>
              <p className="text-xl md:text-3xl mt-4 text-center">
                {slide.subtitle}
              </p>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEnrollNow}
                className="mt-8 px-12 py-4 bg-white text-green-600 rounded-full text-xl font-bold shadow-2xl hover:shadow-white/50 transition-all pulse-green"
              >
                Enroll Now
              </motion.button>
              <p className="text-sm mt-4">Limited seats available!</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render detail view
  const renderDetailView = () => {
    const slide = marketingSlides.find((s) => s.id === detailView);
    if (!slide) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={closeDetailView}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          className={`bg-gradient-to-br ${slide.gradient} rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={closeDetailView}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors z-10 bg-black/20 rounded-full p-2"
          >
            <FaTimes className="text-2xl md:text-3xl" />
          </button>

          {slide.type === "features" && (
            <div className="text-white">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
                Complete Feature List
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {slide.items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/20 backdrop-blur-md rounded-2xl p-6 hover:bg-white/30 transition-all"
                  >
                    <div className="text-4xl md:text-5xl mb-4">{item.icon}</div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-base md:text-lg opacity-90">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {slide.type === "fees" && (
            <div className="text-white">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
                Complete Fee Structure
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {slide.packages.map((pkg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className={`bg-white/20 backdrop-blur-md rounded-2xl p-8 hover:bg-white/30 transition-all relative ${
                      pkg.popular ? "ring-4 ring-yellow-400" : ""
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-green-800 px-6 py-2 rounded-full font-bold">
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-center mb-4">
                      {pkg.name}
                    </h3>
                    <div className="text-center mb-6">
                      <span className="text-5xl font-bold">{pkg.price}</span>
                      <span className="text-lg opacity-75 ml-2">
                        {pkg.duration}
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <FaCheckCircle className="mr-3 mt-1 text-green-300 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={handleEnrollNow}
                      className="w-full mt-6 py-3 bg-white text-green-600 rounded-full font-bold hover:bg-gray-100 transition-all"
                    >
                      Select Plan
                    </button>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8 bg-white/20 backdrop-blur-md rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-4">Additional Benefits</h3>
                <ul className="grid md:grid-cols-2 gap-3">
                  <li className="flex items-center">
                    <FaCheckCircle className="mr-2 text-green-300" />
                    Sibling discount: 10% off
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="mr-2 text-green-300" />
                    Early bird discount available
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="mr-2 text-green-300" />
                    Flexible payment options
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="mr-2 text-green-300" />
                    Scholarship for meritorious students
                  </li>
                </ul>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white overflow-hidden">
      {/* Full Screen Carousel */}
      <div className="h-screen w-screen marketing-slide-engine">
        <div
          ref={slideRef}
          className="relative h-full w-full overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 ${
                marketingSlides[currentSlide].bgColor
              } ${
                marketingSlides[currentSlide].type === "features"
                  ? "p-1 sm:p-2 md:p-3"
                  : "p-2 sm:p-4 md:p-8 lg:p-12"
              }`}
            >
              {renderSlideContent(marketingSlides[currentSlide])}
            </motion.div>
          </AnimatePresence>

          {/* Close/Back Button - Top Right */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="absolute top-6 right-6 z-20 bg-white/90 hover:bg-white text-green-700 p-4 rounded-full shadow-2xl transition-all"
            aria-label="Back to Dashboard"
          >
            <FaTimes className="text-2xl" />
          </motion.button>

          {/* Slide Indicators (hidden on mobile) */}
          {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:flex space-x-3 z-10">
            {marketingSlides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                className={`slide-indicator transition-all rounded-full shadow-lg ${
                  currentSlide === index
                    ? "w-12 h-3 bg-green-600"
                    : "w-3 h-3 bg-gray-300 hover:bg-green-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div> */}

          {/* Auto-scroll indicator */}
          <div className="absolute top-6 left-6 z-10">
            {/* <button
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              className="bg-white hover:bg-gray-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-lg border-2 border-green-100"
            >
              {isAutoScrolling ? "⏸ Pause" : "▶ Play"}
            </button> */}
          </div>
        </div>
      </div>

      {/* Detail View Modal */}
      <AnimatePresence>{detailView && renderDetailView()}</AnimatePresence>

      {/* Scholarship Modal */}
      <AnimatePresence>
        {scholarshipModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setScholarshipModal(null);
              setIsAutoScrolling(true);
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 md:p-6 text-white relative">
                <button
                  onClick={() => {
                    setScholarshipModal(null);
                    setIsAutoScrolling(true);
                  }}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
                <h2 className="text-2xl md:text-3xl font-bold">
                  {scholarshipModal === "dates" && "📅 Test Dates & Schedule"}
                  {scholarshipModal === "details" && "💰 Scholarship Details"}
                  {scholarshipModal === "syllabus" && "📚 Grade-wise Syllabus"}
                </h2>
                <p className="text-green-100 mt-1">Scholarship Test 2026-27</p>
              </div>

              {/* Modal Content */}
              <div
                className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
                style={{ scrollbarWidth: "thin" }}
              >
                {/* TEST DATES CONTENT */}
                {scholarshipModal === "dates" && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-4 mb-6">
                      <p className="text-center text-gray-700 font-medium">
                        <FaClock className="inline mr-2 text-orange-500" />
                        All tests are from <strong>
                          10:00 AM to 1:00 PM
                        </strong>{" "}
                        (3 hours)
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {scholarshipTestDates.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`p-5 rounded-2xl border-2 ${
                            item.best
                              ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400 ring-4 ring-yellow-100"
                              : "bg-white border-gray-200 hover:border-green-300"
                          } transition-all shadow-lg`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              {item.best && (
                                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">
                                  ⭐ BEST VALUE
                                </span>
                              )}
                              <h3 className="text-xl font-bold text-gray-800">
                                {item.date}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {item.day}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-2xl font-black text-green-600">
                                +{item.discount}
                              </span>
                              <p className="text-xs text-gray-500">
                                Early Bird OFF
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FaUsers className="text-green-500" />
                              <span>
                                Only{" "}
                                <strong className="text-red-600">
                                  {item.seats} seats
                                </strong>{" "}
                                per grade
                              </span>
                            </div>
                            {item.special && (
                              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                                {item.special}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl mt-6">
                      <h4 className="font-bold text-green-800 mb-2">
                        💡 Pro Tip
                      </h4>
                      <p className="text-sm text-gray-700">
                        Register for the earliest test date (7th Dec) to get
                        maximum 10% early bird discount on top of your merit
                        scholarship!
                      </p>
                    </div>
                  </div>
                )}

                {/* SCHOLARSHIP DETAILS CONTENT */}
                {scholarshipModal === "details" && (
                  <div className="space-y-6">
                    {/* Merit Based Section */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-500 p-3 rounded-full">
                          <FaTrophy className="text-2xl text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            Merit-Based Scholarship
                          </h3>
                          <p className="text-green-600 font-semibold">
                            Up to 30% OFF on Tuition Fees
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-white rounded-xl p-4 shadow">
                          <h4 className="font-bold text-gray-700 mb-3">
                            Discount Slabs:
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                              <span>Top 10% Scorers</span>
                              <span className="font-bold text-green-600">
                                30% OFF
                              </span>
                            </li>
                            <li className="flex justify-between items-center p-2 bg-green-50/70 rounded-lg">
                              <span>Top 11-25% Scorers</span>
                              <span className="font-bold text-green-600">
                                25% OFF
                              </span>
                            </li>
                            <li className="flex justify-between items-center p-2 bg-green-50/50 rounded-lg">
                              <span>Top 26-40% Scorers</span>
                              <span className="font-bold text-green-600">
                                20% OFF
                              </span>
                            </li>
                            <li className="flex justify-between items-center p-2 bg-green-50/30 rounded-lg">
                              <span>Top 41-60% Scorers</span>
                              <span className="font-bold text-green-600">
                                15% OFF
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow">
                          <h4 className="font-bold text-gray-700 mb-3">
                            Key Benefits:
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Fair distribution from ₹50 Lakh pool</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Score higher = Get more discount</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Valid for full academic year</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Applicable on all courses</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Early Bird Section */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-300">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-orange-500 p-3 rounded-full">
                          <FaBolt className="text-2xl text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            Early Bird Bonus
                          </h3>
                          <p className="text-orange-600 font-semibold">
                            Additional 5-10% OFF on top of merit!
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                        {scholarshipTestDates.slice(0, 6).map((item, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl text-center ${
                              item.best
                                ? "bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-400"
                                : "bg-white border border-gray-200"
                            }`}
                          >
                            <p className="font-bold text-gray-800">
                              {item.date}
                            </p>
                            <p className="text-xl font-black text-green-600">
                              +{item.discount}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Combined Example */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
                      <h3 className="text-xl font-bold mb-3">
                        📊 Example Calculation
                      </h3>
                      <div className="bg-white/20 rounded-xl p-4">
                        <p className="mb-2">
                          If you score in <strong>Top 10%</strong> and register
                          for <strong>7th Dec</strong> test:
                        </p>
                        <div className="flex items-center gap-2 text-lg">
                          <span className="bg-white/30 px-3 py-1 rounded-lg">
                            30% Merit
                          </span>
                          <span>+</span>
                          <span className="bg-white/30 px-3 py-1 rounded-lg">
                            10% Early Bird
                          </span>
                          <span>=</span>
                          <span className="bg-yellow-400 text-green-800 px-4 py-1 rounded-lg font-black">
                            40% OFF!
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SYLLABUS CONTENT */}
                {scholarshipModal === "syllabus" && (
                  <div className="space-y-2">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl mb-6">
                      <p className="text-gray-700">
                        <FaInfoCircle className="inline mr-2 text-blue-500" />
                        Test is based on{" "}
                        <strong>previous class syllabus</strong>. Students
                        applying for 8th grade will be tested on 7th grade
                        topics.
                      </p>
                    </div>

                    <div className="grid gap-4">
                      {syllabusData.map((grade, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`bg-gradient-to-br from-${grade.color}-50 to-${grade.color}-100 rounded-2xl p-5 border-2 border-${grade.color}-200 shadow-lg`}
                          style={{
                            background: `linear-gradient(135deg, ${
                              grade.color === "cyan"
                                ? "#ecfeff, #cffafe"
                                : grade.color === "blue"
                                ? "#eff6ff, #dbeafe"
                                : grade.color === "purple"
                                ? "#faf5ff, #f3e8ff"
                                : grade.color === "orange"
                                ? "#fff7ed, #ffedd5"
                                : "#f0fdf4, #dcfce7"
                            })`,
                          }}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div
                              className={`p-3 rounded-full`}
                              style={{
                                background:
                                  grade.color === "cyan"
                                    ? "#06b6d4"
                                    : grade.color === "blue"
                                    ? "#3b82f6"
                                    : grade.color === "purple"
                                    ? "#a855f7"
                                    : grade.color === "orange"
                                    ? "#f97316"
                                    : "#22c55e",
                              }}
                            >
                              <FaGraduationCap className="text-xl text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">
                              Grade {grade.grade}
                            </h3>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white/70 rounded-xl p-4">
                              <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-xs">
                                  MATHS
                                </span>
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-600">
                                {grade.maths.map((topic, i) => (
                                  <li
                                    key={i}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                    {topic}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-white/70 rounded-xl p-4">
                              <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded text-xs">
                                  SCIENCE
                                </span>
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-600">
                                {grade.science.map((topic, i) => (
                                  <li
                                    key={i}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                    {topic}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl mt-6">
                      <h4 className="font-bold text-green-800 mb-2">
                        📝 Important Notes:
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• No negative marking in the test</li>
                        <li>• Test duration: 3 hours (10 AM - 1 PM)</li>
                        <li>• MCQs and short answer questions</li>
                        <li>• Focus on conceptual understanding</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  <FaInfoCircle className="inline mr-1" />
                  Limited 217 seats across all grades
                </p>
                <button
                  onClick={() => navigate("/enrollnow")}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all"
                >
                  Register Now →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Individual Faculty Modal */}
      <AnimatePresence>
        {selectedFaculty && (
          <FacultyModal
            faculty={selectedFaculty}
            onClose={() => {
              setSelectedFaculty(null);
              setIsAutoScrolling(true);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketingHub;
