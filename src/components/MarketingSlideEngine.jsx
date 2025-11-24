import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "react-icons/fa";
import "../styles/MarketingSlideEngine.css";

const MarketingSlideEngine = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [detailView, setDetailView] = useState(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const slideRef = useRef(null);

  const marketingSlides = [
    {
      id: "hero",
      type: "hero",
      title: "Welcome to Abhigyan Gurukul",
      subtitle: "Excellence in Education",
      description: "Transform your academic journey with us",
      icon: <FaGraduationCap className="text-6xl" />,
      gradient: "from-emerald-500 to-green-600",
    },
    {
      id: "features",
      type: "features",
      title: "Our Key Features",
      subtitle: "Why Choose Us",
      icon: <FaStar className="text-5xl" />,
      gradient: "from-green-600 to-emerald-500",
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
    {
      id: "faculties",
      type: "faculties",
      title: "Meet Our Expert Faculty",
      subtitle: "Learn from the Best",
      icon: <FaUsers className="text-5xl" />,
      gradient: "from-emerald-600 to-green-500",
      data: facultyMembers.slice(0, 6),
    },
    {
      id: "fees",
      type: "fees",
      title: "Fee Structure",
      subtitle: "Affordable Quality Education",
      icon: <FaRupeeSign className="text-5xl" />,
      gradient: "from-green-500 to-emerald-600",
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
      gradient: "from-emerald-500 to-green-600",
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
      gradient: "from-green-600 to-emerald-500",
    },
  ];

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling || detailView) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % marketingSlides.length);
    }, 5000);

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

  // Render individual slide types
  const renderSlideContent = (slide) => {
    switch (slide.type) {
      case "hero":
        return (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {slide.icon}
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold mt-6 text-center"
            >
              {slide.title}
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl mt-4 text-center opacity-90"
            >
              {slide.subtitle}
            </motion.p>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg mt-2 text-center opacity-75"
            >
              {slide.description}
            </motion.p>
          </div>
        );

      case "features":
        return (
          <div
            className="h-full text-white overflow-y-auto cursor-pointer"
            onClick={() => openDetailView(slide.id)}
          >
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">{slide.icon}</div>
              <h2 className="text-4xl font-bold">{slide.title}</h2>
              <p className="text-xl mt-2 opacity-90">{slide.subtitle}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-6">
              {slide.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="feature-card bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all"
                >
                  <div className="text-3xl mb-2 flex justify-center">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-center">
                    {item.title}
                  </h3>
                  <p className="text-sm mt-1 opacity-75 text-center">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
            <p className="text-center mt-6 text-sm opacity-75">
              Click to view detailed features
            </p>
          </div>
        );

      case "faculties":
        return (
          <div
            className="h-full text-white overflow-y-auto cursor-pointer"
            onClick={() => openDetailView(slide.id)}
          >
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">{slide.icon}</div>
              <h2 className="text-4xl font-bold">{slide.title}</h2>
              <p className="text-xl mt-2 opacity-90">{slide.subtitle}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 px-6">
              {slide.data.map((faculty, idx) => (
                <motion.div
                  key={faculty.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all"
                >
                  <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-4 border-white/50">
                    <img
                      src={faculty.image}
                      alt={faculty.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-center text-lg">
                    {faculty.name}
                  </h3>
                  <p className="text-sm text-center opacity-75">
                    {faculty.subject}
                  </p>
                  <p className="text-xs text-center mt-1 opacity-60">
                    {faculty.experience}
                  </p>
                </motion.div>
              ))}
            </div>
            <p className="text-center mt-6 text-sm opacity-75">
              Click to view all faculty members
            </p>
          </div>
        );

      case "fees":
        return (
          <div
            className="h-full text-white overflow-y-auto cursor-pointer"
            onClick={() => openDetailView(slide.id)}
          >
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">{slide.icon}</div>
              <h2 className="text-4xl font-bold">{slide.title}</h2>
              <p className="text-xl mt-2 opacity-90">{slide.subtitle}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 px-6">
              {slide.packages.map((pkg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all relative ${
                    pkg.popular ? "ring-4 ring-yellow-400" : ""
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-green-800 px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  )}
                  <h3 className="font-bold text-xl text-center mb-2">
                    {pkg.name}
                  </h3>
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold">{pkg.price}</span>
                    <span className="text-sm opacity-75 ml-2">
                      {pkg.duration}
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {pkg.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <FaCheckCircle className="mr-2 text-green-300" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
            <p className="text-center mt-6 text-sm opacity-75">
              Click to view complete fee structure
            </p>
          </div>
        );

      case "achievements":
        return (
          <div className="h-full text-white flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">{slide.icon}</div>
              <h2 className="text-4xl font-bold">{slide.title}</h2>
              <p className="text-xl mt-2 opacity-90">{slide.subtitle}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
              {slide.stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.2, type: "spring" }}
                  className="text-center"
                >
                  <div className="text-5xl font-bold text-yellow-300 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case "enroll":
        return (
          <div
            className="h-full text-white cursor-pointer"
            onClick={() => openDetailView(slide.id)}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {slide.icon}
              </motion.div>
              <h2 className="text-5xl font-bold mt-6 text-center">
                {slide.title}
              </h2>
              <p className="text-2xl mt-4 text-center opacity-90">
                {slide.subtitle}
              </p>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 px-12 py-4 bg-white text-green-600 rounded-full text-xl font-bold shadow-2xl hover:shadow-white/50 transition-all pulse-green"
              >
                Enroll Now
              </motion.button>
              <p className="text-sm mt-4 opacity-75">
                Limited seats available!
              </p>
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
          className={`bg-gradient-to-br ${slide.gradient} rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto p-8 relative`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={closeDetailView}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors z-10"
          >
            <FaTimes className="text-3xl" />
          </button>

          {slide.type === "features" && (
            <div className="text-white">
              <h2 className="text-5xl font-bold text-center mb-8">
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
                    <div className="text-5xl mb-4">{item.icon}</div>
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-lg opacity-90">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {slide.type === "faculties" && (
            <div className="text-white">
              <h2 className="text-5xl font-bold text-center mb-8">
                Our Complete Faculty Team
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {facultyMembers.map((faculty, idx) => (
                  <motion.div
                    key={faculty.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/20 backdrop-blur-md rounded-2xl p-6 hover:bg-white/30 transition-all"
                  >
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/50">
                      <img
                        src={faculty.image}
                        alt={faculty.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-center">
                      {faculty.name}
                    </h3>
                    <p className="text-center opacity-90 mt-1">
                      {faculty.subject}
                    </p>
                    <p className="text-center text-sm opacity-75 mt-1">
                      {faculty.experience}
                    </p>
                    <p className="text-center text-sm mt-2 opacity-80">
                      {faculty.education}
                    </p>
                    <p className="text-center text-sm mt-2 italic">
                      {faculty.specialty}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {slide.type === "fees" && (
            <div className="text-white">
              <h2 className="text-5xl font-bold text-center mb-8">
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
                    <button className="w-full mt-6 py-3 bg-white text-green-600 rounded-full font-bold hover:bg-gray-100 transition-all">
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

          {slide.type === "enroll" && (
            <div className="text-white">
              <h2 className="text-5xl font-bold text-center mb-8">
                Enroll Now - Admission Form
              </h2>
              <div className="max-w-2xl mx-auto bg-white/20 backdrop-blur-md rounded-2xl p-8">
                <form className="space-y-4">
                  <div>
                    <label className="block mb-2 font-semibold">
                      Student Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="form-input-glow w-full px-4 py-3 rounded-lg bg-white/30 border border-white/50 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white transition-all"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-semibold">
                        Class *
                      </label>
                      <select
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white"
                      >
                        <option value="">Select Class</option>
                        <option value="9">Class 9</option>
                        <option value="10">Class 10</option>
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold">Stream</label>
                      <select className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white">
                        <option value="">Select Stream</option>
                        <option value="science">Science</option>
                        <option value="commerce">Commerce</option>
                        <option value="arts">Arts</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-semibold">
                        Parent Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/50 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white"
                        placeholder="Father/Mother name"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold">
                        Contact Number *
                      </label>
                      <input
                        type="tel"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/50 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white"
                        placeholder="10-digit mobile"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/50 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold">Address</label>
                    <textarea
                      className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/50 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white"
                      rows="3"
                      placeholder="Complete address"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold">
                      Course Interested In *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <option value="">Select Course</option>
                      <option value="board">Board Exam Preparation</option>
                      <option value="jee">JEE Preparation</option>
                      <option value="neet">NEET Preparation</option>
                      <option value="foundation">Foundation Course</option>
                    </select>
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-white text-green-600 rounded-full text-xl font-bold shadow-2xl hover:shadow-white/50 transition-all"
                  >
                    Submit Application
                  </motion.button>
                </form>
                <p className="text-center mt-4 text-sm opacity-75">
                  Our team will contact you within 24 hours
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl overflow-hidden marketing-slide-engine">
      {/* Main Carousel */}
      <div
        ref={slideRef}
        className="relative h-[600px] overflow-hidden"
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
            className={`absolute inset-0 bg-gradient-to-br ${marketingSlides[currentSlide].gradient} p-8`}
          >
            {renderSlideContent(marketingSlides[currentSlide])}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="nav-button absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-4 rounded-full transition-all z-10"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="text-2xl" />
        </button>
        <button
          onClick={nextSlide}
          className="nav-button absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-4 rounded-full transition-all z-10"
          aria-label="Next slide"
        >
          <FaChevronRight className="text-2xl" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {marketingSlides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`slide-indicator transition-all rounded-full ${
                currentSlide === index
                  ? "w-12 h-3 bg-white"
                  : "w-3 h-3 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-scroll indicator */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className="bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm transition-all"
          >
            {isAutoScrolling ? "⏸ Pause" : "▶ Play"}
          </button>
        </div>
      </div>

      {/* Quick Navigation Menu */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-4">
        <div className="flex flex-wrap justify-center gap-3">
          {marketingSlides.slice(1, -1).map((slide, index) => (
            <motion.button
              key={slide.id}
              onClick={() => goToSlide(index + 1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                currentSlide === index + 1
                  ? "bg-white text-green-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {slide.title}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Detail View Modal */}
      <AnimatePresence>{detailView && renderDetailView()}</AnimatePresence>
    </div>
  );
};

export default MarketingSlideEngine;
