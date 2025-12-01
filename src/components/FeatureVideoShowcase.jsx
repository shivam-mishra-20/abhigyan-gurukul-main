/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserTie,
  FaUsers,
  FaTrophy,
  FaCalendarAlt,
  FaUserFriends,
  FaBookOpen,
  FaChartLine,
  FaLaptop,
  FaSnowflake,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

const FeatureVideoShowcase = ({ onAllVideosPlayed }) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // New features list - Priority features first (1:1 Mentoring & Limited Seats)
  const features = [
    {
      id: 0,
      icon: <FaUserTie className="text-lg" />,
      title: "1:1 Mentoring",
      highlight: "1:1",
      subtitle: "MENTORING",
      description: "Personal guidance from dedicated mentors for your success",
      video: "/one on one mentoring.mp4",
      priority: true,
    },
    {
      id: 1,
      icon: <FaUsers className="text-lg" />,
      title: "Limited Seats",
      highlight: "15-18",
      subtitle: "STUDENTS/BATCH",
      description: "Only 15-18 students per batch for focused attention",
      video: "/limited batch.mp4",
      priority: true,
    },
    {
      id: 3,
      icon: <FaCalendarAlt className="text-lg" />,
      title: "Events & Activities",
      description: "Regular events to boost learning and engagement",
      video: "/events.mp4",
    },
    {
      id: 4,
      icon: <FaUserFriends className="text-lg" />,
      title: "Parents Portal",
      description: "Stay connected with your child's academic progress",
      video: "/student portal.mp4",
    },
    {
      id: 5,
      icon: <FaBookOpen className="text-lg" />,
      title: "Notes & Materials",
      description: "Comprehensive study materials and notes provided",
      video: "/study materials.mp4",
    },
    {
      id: 7,
      icon: <FaLaptop className="text-lg" />,
      title: "Digital Exams",
      description: "Modern digital examination system for better assessment",
      video: "/digital exams.mp4",
    },
    {
      id: 8,
      icon: <FaSnowflake className="text-lg" />,
      title: "AC Classrooms",
      description: "Comfortable air-conditioned learning environment",
      video: "/ac classrooms.mp4",
    },
  ];

  const currentFeature = features[activeVideoIndex];

  // Navigate to next video
  const goToNextVideo = useCallback(() => {
    if (activeVideoIndex < features.length - 1) {
      setIsChanging(true);
      setTimeout(() => {
        setActiveVideoIndex((prev) => prev + 1);
        setTimeout(() => setIsChanging(false), 50);
      }, 100);
    }
  }, [activeVideoIndex, features.length]);

  // Navigate to previous video
  const goToPrevVideo = useCallback(() => {
    if (activeVideoIndex > 0) {
      setIsChanging(true);
      setTimeout(() => {
        setActiveVideoIndex((prev) => prev - 1);
        setTimeout(() => setIsChanging(false), 50);
      }, 100);
    }
  }, [activeVideoIndex]);

  // Handle video end - minimal, seamless transition
  const handleVideoEnd = useCallback(() => {
    if (activeVideoIndex < features.length - 1) {
      goToNextVideo();
    } else {
      if (onAllVideosPlayed) {
        setTimeout(() => onAllVideosPlayed(), 200);
      }
    }
  }, [activeVideoIndex, features.length, onAllVideosPlayed, goToNextVideo]);

  // Play video when active index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [activeVideoIndex]);

  // Handle feature click
  const handleFeatureClick = (index) => {
    if (index !== activeVideoIndex) {
      setIsChanging(true);
      setTimeout(() => {
        setActiveVideoIndex(index);
        setTimeout(() => setIsChanging(false), 50);
      }, 100);
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Fullscreen Video View
  if (isFullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        ref={containerRef}
      >
        {/* Video - Full Screen */}
        <video
          ref={videoRef}
          src={currentFeature?.video}
          className="w-full h-full object-contain"
          playsInline
          autoPlay
          onEnded={handleVideoEnd}
        />

        {/* Top Controls Bar */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex items-center justify-between">
            {/* Feature Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white">
                {currentFeature?.icon &&
                  React.cloneElement(currentFeature.icon, {
                    className: "text-lg",
                  })}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">
                  {currentFeature?.title}
                </h3>
                <p className="text-white/70 text-sm">
                  {currentFeature?.description}
                </p>
              </div>
            </div>

            {/* Exit Fullscreen Button */}
            <motion.button
              onClick={toggleFullscreen}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
            >
              <FaCompress className="text-xl" />
            </motion.button>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/70 to-transparent">
          {/* Navigation Arrows & Progress */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.button
              onClick={goToPrevVideo}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-full bg-white/20 backdrop-blur-sm text-white transition-all ${
                activeVideoIndex === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-white/30"
              }`}
              disabled={activeVideoIndex === 0}
            >
              <FaChevronLeft className="text-lg" />
            </motion.button>

            {/* Feature Pills */}
            <div className="flex items-center gap-2">
              {features.map((feature, idx) => (
                <motion.button
                  key={feature.id}
                  onClick={() => handleFeatureClick(idx)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    idx === activeVideoIndex
                      ? "bg-white text-gray-800"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {idx + 1}
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={goToNextVideo}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-full bg-white/20 backdrop-blur-sm text-white transition-all ${
                activeVideoIndex === features.length - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-white/30"
              }`}
              disabled={activeVideoIndex === features.length - 1}
            >
              <FaChevronRight className="text-lg" />
            </motion.button>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="h-1 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={false}
                animate={{
                  width: `${((activeVideoIndex + 1) / features.length) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-center text-white/80 text-sm mt-2">
              {activeVideoIndex + 1} / {features.length} • Press ESC to exit
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden relative flex flex-col items-center justify-center px-0.5 sm:px-1 md:px-2 lg:px-4">
      {/* Centered Top Label */}
      <div className="w-full flex justify-center mb-1 sm:mb-1.5 md:mb-2 flex-shrink-0">
        <AnimatePresence mode="wait">
          {currentFeature?.priority ? (
            // Priority Feature - Elegant Animated Badge
            <motion.div
              key={`priority-${activeVideoIndex}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative"
            >
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-green-500/30 to-emerald-500/20 blur-xl rounded-full" />

              <div className="relative flex items-center gap-2 sm:gap-4 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 shadow-xl border border-green-100">
                {/* Animated sparkle icon */}
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-green-500 hidden sm:block"
                >
                  <HiSparkles className="text-xl sm:text-2xl" />
                </motion.div>

                {/* Main Content */}
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  {/* Big Highlighted Number/Text */}
                  <motion.span
                    className="text-2xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    {currentFeature.highlight}
                  </motion.span>

                  {/* Subtitle */}
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-lg md:text-xl font-bold text-gray-800 tracking-tight">
                      {currentFeature.subtitle}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                      {currentFeature.id === 0
                        ? "Personalized Guidance"
                        : "Focused Learning"}
                    </span>
                  </div>
                </div>

                {/* Animated sparkle icon */}
                <motion.div
                  animate={{ rotate: [0, -15, 15, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="text-green-500 hidden sm:block"
                >
                  <HiSparkles className="text-xl sm:text-2xl" />
                </motion.div>

                {/* Animated underline */}
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                />
              </div>
            </motion.div>
          ) : (
            // Non-Priority Feature - Clean Minimal Badge
            <motion.div
              key={`normal-${activeVideoIndex}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 sm:gap-3 bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl px-3 sm:px-5 py-2 sm:py-3 shadow-lg border border-gray-100">
                <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                  {currentFeature?.icon &&
                    React.cloneElement(currentFeature.icon, {
                      className: "text-sm sm:text-base",
                    })}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800">
                    {currentFeature?.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
                    {currentFeature?.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Area - Video with External Arrows */}
      <div className="flex items-center justify-center gap-0.5 sm:gap-1 md:gap-2 w-full flex-1 min-h-0">
        {/* Left Arrow - Outside Video */}
        <motion.button
          onClick={goToPrevVideo}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`flex-shrink-0 p-1 sm:p-1.5 md:p-2 rounded-full bg-white shadow-lg border border-gray-100 transition-all z-10 ${
            activeVideoIndex === 0
              ? "opacity-30 cursor-not-allowed"
              : "opacity-100 hover:shadow-xl hover:border-green-200"
          }`}
          disabled={activeVideoIndex === 0}
        >
          <FaChevronLeft className="text-gray-700 text-xs sm:text-sm md:text-base" />
        </motion.button>

        {/* Video Container - Larger and fills more space */}
        <div className="relative flex-1 h-full max-h-[92vh] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 bg-black">
          {/* Video */}
          <video
            ref={videoRef}
            src={currentFeature?.video}
            className={`w-full h-full object-contain transition-opacity duration-100 ${
              isChanging ? "opacity-90" : "opacity-100"
            }`}
            playsInline
            autoPlay
            onEnded={handleVideoEnd}
          />

          {/* Fullscreen Button - Top Right */}
          <motion.button
            onClick={toggleFullscreen}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 sm:p-2.5 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all z-30"
            title="Fullscreen"
          >
            <FaExpand className="text-sm sm:text-base" />
          </motion.button>

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />

          {/* Bottom Section - Feature Pills & Progress */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-1.5 sm:p-2 md:p-2">
            {/* Feature Navigation Pills */}
            <div className="flex justify-center items-center gap-0.5 sm:gap-1 md:gap-1.5 flex-wrap mb-1.5 sm:mb-2">
              {features.map((feature, idx) => (
                <motion.button
                  key={feature.id}
                  onClick={() => handleFeatureClick(idx)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-full transition-all duration-200 text-[10px] sm:text-xs backdrop-blur-sm ${
                    idx === activeVideoIndex
                      ? feature.priority
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                        : "bg-green-600 text-white shadow-lg"
                      : feature.priority
                      ? "bg-white/90 text-green-700 ring-1 ring-green-300"
                      : "bg-white/70 text-gray-700 hover:bg-white/90"
                  }`}
                >
                  {React.cloneElement(feature.icon, {
                    className: "text-[10px] sm:text-xs",
                  })}
                  <span className="hidden lg:inline text-[10px] sm:text-xs font-medium">
                    {feature.title}
                  </span>
                  {feature.priority && idx !== activeVideoIndex && (
                    <span className="absolute -top-0.5 -right-0.5 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-green-500 rounded-full animate-pulse" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="max-w-[200px] sm:max-w-xs mx-auto">
              <div className="h-0.5 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                  initial={false}
                  animate={{
                    width: `${
                      ((activeVideoIndex + 1) / features.length) * 100
                    }%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between text-[9px] sm:text-[10px] text-white/80 mt-0.5">
                <span>
                  {activeVideoIndex + 1} / {features.length}
                </span>
                <span className="font-medium">{currentFeature?.title}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Arrow - Outside Video */}
        <motion.button
          onClick={goToNextVideo}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`flex-shrink-0 p-1 sm:p-1.5 md:p-2 rounded-full bg-white shadow-lg border border-gray-100 transition-all z-10 ${
            activeVideoIndex === features.length - 1
              ? "opacity-30 cursor-not-allowed"
              : "opacity-100 hover:shadow-xl hover:border-green-200"
          }`}
          disabled={activeVideoIndex === features.length - 1}
        >
          <FaChevronRight className="text-gray-700 text-xs sm:text-sm md:text-base" />
        </motion.button>
      </div>
    </div>
  );
};

export default FeatureVideoShowcase;
