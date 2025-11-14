import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaCalendarAlt,
  FaHome,
  FaUserFriends,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

const AdmissionInquiryForm = () => {
  const [formData, setFormData] = useState({
    enquiryDate: new Date().toISOString().split("T")[0],
    studentName: "",
    dateOfBirth: "",
    seekingAdmissionClass: "",
    schoolName: "",
    previousExamResult: "",
    mathMarks: "",
    mathOutOf: "",
    scienceMarks: "",
    scienceOutOf: "",
    ssMarks: "",
    ssOutOf: "",
    englishMarks: "",
    englishOutOf: "",
    boardName: "",
    fatherName: "",
    fatherOccupation: "",
    fatherCompanyName: "",
    fatherOfficeAddress: "",
    fatherContactNo: "",
    fatherDesignation: "",
    motherName: "",
    motherOccupation: "",
    motherContactNo: "",
    motherDesignation: "",
    homeAddress: "",
    query: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.studentName.trim())
        newErrors.studentName = "Student name is required";
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.seekingAdmissionClass)
        newErrors.seekingAdmissionClass = "Class is required";
      if (!formData.schoolName.trim())
        newErrors.schoolName = "School name is required";
    }

    if (step === 2) {
      if (!formData.boardName) newErrors.boardName = "Board name is required";
      if (!formData.fatherName.trim())
        newErrors.fatherName = "Father's name is required";
      if (!formData.fatherContactNo.trim()) {
        newErrors.fatherContactNo = "Contact number is required";
      } else if (
        !/^\d{10}$/.test(formData.fatherContactNo.replace(/[-\s]/g, ""))
      ) {
        newErrors.fatherContactNo = "Phone number must be 10 digits";
      }
      if (!formData.fatherOccupation)
        newErrors.fatherOccupation = "Father's occupation is required";
    }

    if (step === 3) {
      if (!formData.motherName.trim())
        newErrors.motherName = "Mother's name is required";
      if (!formData.motherContactNo.trim()) {
        newErrors.motherContactNo = "Contact number is required";
      } else if (
        !/^\d{10}$/.test(formData.motherContactNo.replace(/[-\s]/g, ""))
      ) {
        newErrors.motherContactNo = "Phone number must be 10 digits";
      }
      if (!formData.motherOccupation)
        newErrors.motherOccupation = "Mother's occupation is required";
      if (!formData.homeAddress.trim())
        newErrors.homeAddress = "Home address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) return;

    setLoading(true);
    setSuccessMessage("");

    try {
      // Save to Firebase
      await addDoc(collection(db, "admissionInquiries"), {
        ...formData,
        timestamp: serverTimestamp(),
        status: "pending",
      });

      setSuccessMessage(
        "Your admission inquiry has been submitted successfully! Our team will contact you soon."
      );

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          enquiryDate: new Date().toISOString().split("T")[0],
          studentName: "",
          dateOfBirth: "",
          seekingAdmissionClass: "",
          schoolName: "",
          previousExamResult: "",
          mathMarks: "",
          mathOutOf: "",
          scienceMarks: "",
          scienceOutOf: "",
          ssMarks: "",
          ssOutOf: "",
          englishMarks: "",
          englishOutOf: "",
          boardName: "",
          fatherName: "",
          fatherOccupation: "",
          fatherCompanyName: "",
          fatherOfficeAddress: "",
          fatherContactNo: "",
          fatherDesignation: "",
          motherName: "",
          motherOccupation: "",
          motherContactNo: "",
          motherDesignation: "",
          homeAddress: "",
          query: "",
        });
        setSuccessMessage("");
        setCurrentStep(1);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({
        submit: "Failed to submit. Please try again or contact us directly.",
      });
    } finally {
      setLoading(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-green-600 mb-3"
          >
            Admission Inquiry Form
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-lg"
          >
            Join Abhigyan Gurukul - Where Excellence Meets Education
          </motion.p>
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= 1
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                    : "bg-gray-200 text-gray-500"
                } font-bold transition-all duration-300`}
              >
                1
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-700">
                Student Info
              </span>
            </div>

            <div className="flex-1 mx-2 sm:mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-green-500"
                initial={{ width: 0 }}
                animate={{ width: currentStep >= 2 ? "100%" : "0%" }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="flex items-center space-x-2">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= 2
                    ? "bg-gradient-to-r from-purple-500 to-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                } font-bold transition-all duration-300`}
              >
                2
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-700">
                Father&apos;s Info
              </span>
            </div>

            <div className="flex-1 mx-2 sm:mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-green-600"
                initial={{ width: 0 }}
                animate={{ width: currentStep >= 3 ? "100%" : "0%" }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="flex items-center space-x-2">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= 3
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                    : "bg-gray-200 text-gray-500"
                } font-bold transition-all duration-300`}
              >
                3
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-700">
                Mother&apos;s Info
              </span>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-green-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10">
            <AnimatePresence mode="wait">
              {/* Step 1: Student & Academic Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaUser className="mr-3 text-purple-600" />
                    Student & Academic Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Enquiry Date */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Enquiry Date
                      </label>
                      <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          name="enquiryDate"
                          value={formData.enquiryDate}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50"
                          readOnly
                        />
                      </div>
                    </div>

                    {/* Empty space for layout */}
                    <div></div>
                    {/* Name of Student */}
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Name of Student *
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="studentName"
                          value={formData.studentName}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border ${
                            errors.studentName
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                          placeholder="Enter student's full name"
                        />
                      </div>
                      {errors.studentName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.studentName}
                        </p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border ${
                            errors.dateOfBirth
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                        />
                      </div>
                      {errors.dateOfBirth && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.dateOfBirth}
                        </p>
                      )}
                    </div>

                    {/* Empty space for Age (can be calculated automatically) */}
                    <div></div>

                    {/* Seeking Admission in Class */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Seeking Admission in Class *
                      </label>
                      <select
                        name="seekingAdmissionClass"
                        value={formData.seekingAdmissionClass}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${
                          errors.seekingAdmissionClass
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                      >
                        <option value="">Select Class</option>

                        <option value="Class 6">Class 6</option>
                        <option value="Class 7">Class 7</option>
                        <option value="Class 8">Class 8</option>
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10</option>
                        <option value="Class 11">Class 11</option>
                        <option value="Class 12">Class 12</option>
                      </select>
                      {errors.seekingAdmissionClass && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.seekingAdmissionClass}
                        </p>
                      )}
                    </div>

                    {/* School Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        School Name *
                      </label>
                      <input
                        type="text"
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${
                          errors.schoolName
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                        placeholder="Current/Previous school name"
                      />
                      {errors.schoolName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.schoolName}
                        </p>
                      )}
                    </div>

                    {/* Result in previous exam */}
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Result in previous exam
                      </label>
                      <input
                        type="text"
                        name="previousExamResult"
                        value={formData.previousExamResult}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="e.g., 85%, A Grade, Pass, etc."
                      />
                    </div>

                    {/* Math marks */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Math marks
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="number"
                          name="mathMarks"
                          value={formData.mathMarks}
                          onChange={handleChange}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Marks"
                        />
                        <span className="hidden sm:flex items-center px-2 text-gray-600">
                          out of
                        </span>
                        <span className="sm:hidden text-center text-sm text-gray-600 py-1">
                          out of
                        </span>
                        <input
                          type="number"
                          name="mathOutOf"
                          value={formData.mathOutOf}
                          onChange={handleChange}
                          className="sm:w-24 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Total"
                        />
                      </div>
                    </div>

                    {/* Science marks */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Science marks
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="number"
                          name="scienceMarks"
                          value={formData.scienceMarks}
                          onChange={handleChange}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Marks"
                        />
                        <span className="hidden sm:flex items-center px-2 text-gray-600">
                          out of
                        </span>
                        <span className="sm:hidden text-center text-sm text-gray-600 py-1">
                          out of
                        </span>
                        <input
                          type="number"
                          name="scienceOutOf"
                          value={formData.scienceOutOf}
                          onChange={handleChange}
                          className="sm:w-24 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Total"
                        />
                      </div>
                    </div>

                    {/* SS marks */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        SS (Social Science) marks
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="number"
                          name="ssMarks"
                          value={formData.ssMarks}
                          onChange={handleChange}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Marks"
                        />
                        <span className="hidden sm:flex items-center px-2 text-gray-600">
                          out of
                        </span>
                        <span className="sm:hidden text-center text-sm text-gray-600 py-1">
                          out of
                        </span>
                        <input
                          type="number"
                          name="ssOutOf"
                          value={formData.ssOutOf}
                          onChange={handleChange}
                          className="sm:w-24 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Total"
                        />
                      </div>
                    </div>

                    {/* English marks */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        English marks
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="number"
                          name="englishMarks"
                          value={formData.englishMarks}
                          onChange={handleChange}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Marks"
                        />
                        <span className="hidden sm:flex items-center px-2 text-gray-600">
                          out of
                        </span>
                        <span className="sm:hidden text-center text-sm text-gray-600 py-1">
                          out of
                        </span>
                        <input
                          type="number"
                          name="englishOutOf"
                          value={formData.englishOutOf}
                          onChange={handleChange}
                          className="sm:w-24 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Total"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Father's Information */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaUserFriends className="mr-3 text-green-600" />
                    Father&apos;s Information & Board Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Board Name */}
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Board Name *
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="boardName"
                            value="CBSE"
                            checked={formData.boardName === "CBSE"}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-gray-700">CBSE</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="boardName"
                            value="GSEB"
                            checked={formData.boardName === "GSEB"}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-gray-700">GSEB</span>
                        </label>
                      </div>
                      {errors.boardName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.boardName}
                        </p>
                      )}
                    </div>

                    {/* Father's Name */}
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Father&apos;s Name *
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border ${
                            errors.fatherName
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                          placeholder="Enter father's full name"
                        />
                      </div>
                      {errors.fatherName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fatherName}
                        </p>
                      )}
                    </div>

                    {/* Father's Occupation */}
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Father&apos;s Occupation *
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="fatherOccupation"
                            value="Business"
                            checked={formData.fatherOccupation === "Business"}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-gray-700">Business</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="fatherOccupation"
                            value="Service"
                            checked={formData.fatherOccupation === "Service"}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-gray-700">Service</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="fatherOccupation"
                            value="Govt. Employee"
                            checked={
                              formData.fatherOccupation === "Govt. Employee"
                            }
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-gray-700">Govt. Employee</span>
                        </label>
                      </div>
                      {errors.fatherOccupation && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fatherOccupation}
                        </p>
                      )}
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="fatherCompanyName"
                        value={formData.fatherCompanyName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Company/Business name"
                      />
                    </div>

                    {/* Designation */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Designation
                      </label>
                      <input
                        type="text"
                        name="fatherDesignation"
                        value={formData.fatherDesignation}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Job title/position"
                      />
                    </div>

                    {/* Office Address */}
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Office Address
                      </label>
                      <div className="relative">
                        <FaHome className="absolute left-3 top-3 text-gray-400" />
                        <textarea
                          name="fatherOfficeAddress"
                          value={formData.fatherOfficeAddress}
                          onChange={handleChange}
                          rows="2"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          placeholder="Office/Business address"
                        />
                      </div>
                    </div>

                    {/* Contact No */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contact No. *
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="fatherContactNo"
                          value={formData.fatherContactNo}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border ${
                            errors.fatherContactNo
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                          placeholder="10-digit number"
                        />
                      </div>
                      {errors.fatherContactNo && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fatherContactNo}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Mother's Information & Home Address */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaUserFriends className="mr-3 text-purple-600" />
                    Mother&apos;s Information & Home Address
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mother's Name */}
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mother&apos;s Name *
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="motherName"
                          value={formData.motherName}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border ${
                            errors.motherName
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                          placeholder="Enter mother's full name"
                        />
                      </div>
                      {errors.motherName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.motherName}
                        </p>
                      )}
                    </div>

                    {/* Mother's Occupation */}
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mother&apos;s Occupation *
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="motherOccupation"
                            value="Business"
                            checked={formData.motherOccupation === "Business"}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-gray-700">Business</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="motherOccupation"
                            value="Service"
                            checked={formData.motherOccupation === "Service"}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-gray-700">Service</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="motherOccupation"
                            value="House Wife"
                            checked={formData.motherOccupation === "House Wife"}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-gray-700">House Wife</span>
                        </label>
                      </div>
                      {errors.motherOccupation && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.motherOccupation}
                        </p>
                      )}
                    </div>

                    {/* Mother's Contact No */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contact No. *
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="motherContactNo"
                          value={formData.motherContactNo}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border ${
                            errors.motherContactNo
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                          placeholder="10-digit number"
                        />
                      </div>
                      {errors.motherContactNo && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.motherContactNo}
                        </p>
                      )}
                    </div>

                    {/* Mother's Designation */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Designation
                      </label>
                      <input
                        type="text"
                        name="motherDesignation"
                        value={formData.motherDesignation}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Job title/position"
                      />
                    </div>

                    {/* Home Address */}
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Home Address *
                      </label>
                      <div className="relative">
                        <FaHome className="absolute left-3 top-3 text-gray-400" />
                        <textarea
                          name="homeAddress"
                          value={formData.homeAddress}
                          onChange={handleChange}
                          rows="3"
                          className={`w-full pl-10 pr-4 py-3 border ${
                            errors.homeAddress
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                          placeholder="Full residential address"
                        />
                      </div>
                      {errors.homeAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.homeAddress}
                        </p>
                      )}
                    </div>

                    {/* Query (if any) */}
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Query (if any)
                      </label>
                      <textarea
                        name="query"
                        value={formData.query}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Any questions or special requirements..."
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              {currentStep > 1 && (
                <motion.button
                  type="button"
                  onClick={handlePrevious}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-200"
                >
                  Previous
                </motion.button>
              )}

              {currentStep < 3 ? (
                <motion.button
                  type="button"
                  onClick={handleNext}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-green-700 transition-all duration-200 shadow-lg"
                >
                  Next Step
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`ml-auto px-8 py-3 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  } text-white font-semibold rounded-lg transition-all duration-200 shadow-lg flex items-center`}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="mr-2" />
                      Submit
                    </>
                  )}
                </motion.button>
              )}
            </div>

            {/* Error Message */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
              >
                {errors.submit}
              </motion.div>
            )}
          </form>
        </motion.div>

        {/* Success Message Modal */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setSuccessMessage("")}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <FaCheckCircle className="text-5xl text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Success!
                  </h3>
                  <p className="text-gray-600">{successMessage}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdmissionInquiryForm;
