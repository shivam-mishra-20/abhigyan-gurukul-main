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
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaCheckCircle,
  FaUsers,
  FaHome,
  FaRocket,
  FaFlask,
  FaMedal,
  FaLightbulb,
  FaGlobe,
  FaChartLine,
} from "react-icons/fa";
import "../styles/MarketingSlideEngine.css";
import FacultyCard from "../components/FacultyCard";
import FacultyModal from "../components/FacultyModal";

const MarketingHub = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [detailView, setDetailView] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const slideRef = useRef(null);

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
      id: "introduction",
      type: "introduction",
      title: "Our Vision & Mission",
      subtitle: "Building Future Leaders",
      icon: <FaRocket className="text-5xl" />,
      bgColor: "bg-gradient-to-br from-green-50 via-emerald-50 to-green-100",
    },
    {
      id: "features",
      type: "features",
      title: "Our Key Features",
      subtitle: "Why Choose Us",
      icon: <FaStar className="text-5xl" />,
      bgColor: "bg-gray-50",
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
    {
      id: "fees",
      type: "fees",
      title: "Fee Structure",
      subtitle: "Affordable Quality Education",
      icon: <FaRupeeSign className="text-5xl" />,
      bgColor: "bg-gray-50",
      packages: [
        {
          name: "Class 9-10 (CBSE/GSEB)",
          price: "₹8,000",
          duration: "per year",
          features: [
            "All subjects covered",
            "Weekly tests",
            "Study materials included",
            "Doubt clearing sessions",
            "Progress tracking",
          ],
          popular: false,
        },
        {
          name: "Class 11-12 (Science)",
          price: "₹15,000",
          duration: "per year",
          features: [
            "PCM/PCB streams",
            "JEE/NEET preparation",
            "Daily practice sessions",
            "Mock tests",
            "Career counseling",
            "Scholarship opportunities",
          ],
          popular: true,
        },
        {
          name: "Competitive Exams",
          price: "₹20,000",
          duration: "per year",
          features: [
            "JEE Main & Advanced",
            "NEET preparation",
            "Previous year papers",
            "Expert mentorship",
            "Online test series",
            "Interview preparation",
          ],
          popular: false,
        },
      ],
    },
    {
      id: "achievements",
      type: "achievements",
      title: "Our Achievements",
      subtitle: "Success Stories",
      icon: <FaTrophy className="text-5xl" />,
      bgColor: "bg-white",
      stats: [
        { value: "5000+", label: "Students Taught" },
        { value: "98%", label: "Success Rate" },
        { value: "15+", label: "Years Experience" },
        { value: "50+", label: "Selections in IIT/NIT" },
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
    if (!isAutoScrolling || detailView) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % marketingSlides.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoScrolling, detailView, marketingSlides.length]);

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

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoScrolling(false);
    setTimeout(() => setIsAutoScrolling(true), 3000);
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

      case "introduction":
        return (
          <div className="h-full flex flex-col justify-center px-4 md:px-8 py-6">
            {/* Header - Compact */}
            <div className="text-center mb-4">
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
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold text-gray-800"
              >
                {slide.title}
              </motion.h2>
              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl mt-1 text-green-600 font-semibold"
              >
                {slide.subtitle}
              </motion.p>
            </div>
            {/* Emotional Impact - Two Column Layout */}
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
              {/* LEFT SECTION - Headline & Transformation */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col justify-center"
              >
                {/* Main Headline */}
                <div className="mb-3">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 leading-tight">
                    Your Child&apos;s Dreams Deserve More
                    <span className="block text-green-600 mt-1">
                      Than Just Coaching
                    </span>
                  </h2>
                  <p className="text-lg md:text-xl text-gray-600 font-medium">
                    We Build Futures, Not Just Grades
                  </p>
                </div>

                {/* Before - Struggling Student */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-3 border-2 border-gray-300 mb-2"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="bg-gray-600 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      Before
                    </div>
                    <FaUserGraduate className="text-2xl text-gray-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700 mb-1.5">
                    Struggling Student
                  </h3>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">✗</span>
                      <span>Confused & Overwhelmed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">✗</span>
                      <span>Lack of Proper Guidance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">✗</span>
                      <span>Fear of Competitive Exams</span>
                    </li>
                  </ul>
                </motion.div>

                {/* After - Confident Achiever */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border-2 border-green-400 shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="bg-green-600 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      After
                    </div>
                    <FaTrophy className="text-2xl text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-green-800 mb-1.5">
                    Confident Achiever
                  </h3>
                  <ul className="space-y-1 text-green-800 text-sm">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Clear Goals & Strategy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Expert Personal Mentorship</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Consistent Top Performance</span>
                    </li>
                  </ul>
                </motion.div>
              </motion.div>

              {/* RIGHT SECTION - Success Proof & Testimonial */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col justify-center"
              >
                {/* Success Numbers */}
                <div className="mb-2">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                    Our Success Speaks
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 }}
                      className="bg-white rounded-xl p-3 text-center border-2 border-green-200 shadow-md"
                    >
                      <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1">
                        95%
                      </div>
                      <div className="text-sm md:text-base text-gray-600 font-medium">
                        Success Rate
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 }}
                      className="bg-white rounded-xl p-3 text-center border-2 border-green-200 shadow-md"
                    >
                      <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1">
                        500+
                      </div>
                      <div className="text-sm md:text-base text-gray-600 font-medium">
                        IIT/NEET Selections
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 }}
                      className="bg-white rounded-xl p-3 text-center border-2 border-green-200 shadow-md"
                    >
                      <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1">
                        10,000+
                      </div>
                      <div className="text-sm md:text-base text-gray-600 font-medium">
                        Success Stories
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Testimonial */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-3 border border-green-200"
                >
                  <div className="text-center">
                    <div className="text-green-600 text-3xl mb-1">&ldquo;</div>
                    <p className="text-sm md:text-base text-gray-700 italic font-medium mb-1.5 leading-relaxed">
                      They didn&apos;t just teach my son, they believed in him
                      when he didn&apos;t believe in himself
                    </p>
                    <p className="text-xs text-gray-600 font-semibold">
                      — Parent of JEE Advanced 2024 Qualifier
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        );

      case "features":
        return (
          <div
            className="h-full overflow-y-auto cursor-pointer px-4 md:px-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onClick={() => openDetailView(slide.id)}
          >
            <style>{`
              .h-full::-webkit-scrollbar { display: none; }
            `}</style>
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto pb-8">
              {slide.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white border-2 border-green-100 rounded-2xl p-4 md:p-6 hover:border-green-400 hover:shadow-xl transition-all shadow-md"
                >
                  <div className="text-3xl md:text-4xl mb-2 flex justify-center text-green-600">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-base md:text-lg text-center text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm mt-1 text-gray-600 text-center">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
            <p className="text-center pb-6 text-sm text-gray-500">
              Click to view detailed features
            </p>
          </div>
        );

      case "faculties":
        return (
          <div className="h-full flex flex-col justify-center px-4 md:px-8">
            <div className="text-center mb-12">
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
            <div className="flex justify-center items-center gap-8 px-4 md:px-12">
              {slide.data.map((faculty, idx) => (
                <div
                  key={faculty.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFaculty(faculty);
                    setIsAutoScrolling(false);
                  }}
                  className="bg-white border-2 border-green-100 rounded-2xl p-6 md:p-8 hover:border-green-400 hover:shadow-xl transition-all shadow-md cursor-pointer hover:scale-105 transform w-full max-w-sm"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.2, duration: 0.4 }}
                  >
                    <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-green-200">
                      <img
                        src={faculty.image}
                        alt={faculty.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-center text-xl md:text-2xl text-gray-800 mb-2">
                      {faculty.name}
                    </h3>
                    <p className="text-base md:text-lg text-center text-green-600 font-medium">
                      {faculty.subject}
                    </p>
                    <p className="text-sm text-center mt-2 text-gray-500">
                      {faculty.experience}
                    </p>
                    <div className="mt-4 text-center">
                      <button className="px-6 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-full text-sm font-semibold transition-all">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
            <p className="text-center mt-8 text-sm text-gray-500">
              Click on any faculty to view their complete profile
            </p>
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
          <div className="h-full flex flex-col justify-center px-4 md:px-8">
            <div className="text-center mb-8">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
              {slide.stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.2, type: "spring" }}
                  className="bg-white border-2 border-green-100 rounded-2xl p-6 hover:border-green-400 hover:shadow-xl transition-all shadow-md"
                >
                  <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-base md:text-lg text-gray-700 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
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
              className={`absolute inset-0 ${marketingSlides[currentSlide].bgColor} p-6 md:p-12`}
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
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:flex space-x-3 z-10">
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
          </div>

          {/* Auto-scroll indicator */}
          <div className="absolute top-6 left-6 z-10">
            <button
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              className="bg-white hover:bg-gray-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-lg border-2 border-green-100"
            >
              {isAutoScrolling ? "⏸ Pause" : "▶ Play"}
            </button>
          </div>
        </div>
      </div>

      {/* Detail View Modal */}
      <AnimatePresence>{detailView && renderDetailView()}</AnimatePresence>

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
