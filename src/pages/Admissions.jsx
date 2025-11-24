import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import {
  FaClipboardList,
  FaUserGraduate,
  FaCalendarAlt,
  FaCheckCircle,
  FaFileAlt,
  FaUserCheck,
  FaChevronDown,
  FaChevronUp,
  FaEnvelope,
  FaSpinner,
  FaGraduationCap,
  FaBolt,
  FaTrophy,
  FaStar,
} from "react-icons/fa";

const Admissions = () => {
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    class: "",
    message: "",
  });

  // Form validation state
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Email address is invalid";

    if (!formData.class) newErrors.class = "Please select a class";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Set submitting state to show loading spinner
    setIsSubmitting(true);

    // Create form data for FormSubmit
    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("class", formData.class);
    formDataToSend.append(
      "message",
      formData.message || "No additional message provided"
    );
    formDataToSend.append(
      "_subject",
      `Admission Inquiry from ${formData.fullName}`
    );
    // Add a honeypot field to prevent spam
    formDataToSend.append("_honey", "");
    // Disable captcha
    formDataToSend.append("_captcha", "false");
    // Add redirect URL (optional - remove if not needed)
    // formDataToSend.append('_next', 'https://yourwebsite.com/thanks');

    // Send using FormSubmit with obfuscated email
    fetch("https://formsubmit.co/38cf222be60a9d293a62f4f037c17e69", {
      method: "POST",
      body: formDataToSend,
    })
      .then((response) => {
        if (response.ok) {
          setSubmitMessage(
            "Thank you! Your admission inquiry has been submitted successfully. We'll get back to you soon."
          );
          setFormData({
            fullName: "",
            email: "",
            class: "",
            message: "",
          });
        } else {
          throw new Error("Form submission failed");
        }
      })
      .catch((error) => {
        console.error("Error sending form:", error);
        setSubmitMessage(
          "Something went wrong! Please try again later or contact us directly."
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Toggle FAQ accordion
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Admission process steps
  // const admissionSteps = [
  //   {
  //     icon: <FaClipboardList className="text-green-500 text-2xl" />,
  //     title: "Submit Application",
  //     description:
  //       "Complete the online application form with all required information and documentation.",
  //   },
  //   {
  //     icon: <FaFileAlt className="text-green-500 text-2xl" />,
  //     title: "Document Verification",
  //     description:
  //       "Our team will verify all submitted documents and academic records.",
  //   },
  //   {
  //     icon: <FaUserGraduate className="text-green-500 text-2xl" />,
  //     title: "Admission Test",
  //     description:
  //       "Qualified candidates will be invited to take an admission test to assess knowledge level.",
  //   },
  //   {
  //     icon: <FaUserCheck className="text-green-500 text-2xl" />,
  //     title: "Interview",
  //     description:
  //       "Selected students will have a personal interview with our academic council.",
  //   },
  //   {
  //     icon: <FaCheckCircle className="text-green-500 text-2xl" />,
  //     title: "Final Selection",
  //     description:
  //       "Based on test results and interview, final selections will be announced.",
  //   },
  // ];

  // Available Seats Data
  const availableSeats = [
    { grade: "6th → 7th", seats: 20, stream: "" },
    { grade: "7th → 8th", seats: 30, stream: "" },
    { grade: "8th → 9th", seats: 40, stream: "" },
    { grade: "9th → 10th", seats: 50, stream: "" },
    { grade: "10th → 11th", seats: 30, stream: "Science" },
    { grade: "10th → 11th", seats: 30, stream: "Commerce" },
    { grade: "11th → 12th", seats: 7, stream: "Science" },
    { grade: "11th → 12th", seats: 7, stream: "Commerce" },
  ];

  // Key dates
  const keyDates = [
    { event: "First Test Date", date: "7th December 2025" },
    { event: "Current Students Test", date: "28th December 2025" },
    { event: "Last Test Date", date: "11th January 2026" },
    { event: "Session Begins", date: "6th April 2026" },
  ];

  // FAQ data
  const faqData = [
    {
      question: "How can I get a scholarship at Abhigyan Gurukul?",
      answer:
        "We have a total scholarship pool of ₹50,00,000 for deserving students! This is distributed through our Scholarship Test cum Admission program based on two factors: (1) Early Bird Scholarships ranging from 5% to 10% based on your test registration date between 7th December 2025 and 11th January 2026, and (2) Performance-Based Merit scholarships awarded based on your test performance. Individual scholarships vary according to merit and registration timing. The earlier you register and the better you perform, the higher your scholarship benefits. Register early to maximize your benefits from this ₹50 lakh scholarship pool!",
    },
    {
      question: "Can current students also appear for the scholarship test?",
      answer:
        "Yes! Current students have a dedicated test date on 28th December 2025 at 10:00 AM. They can appear for the test to upgrade their current scholarship or avail additional benefits. The early bird discount for this date is 7%.",
    },
    {
      question: "How is the ₹50 Lakh scholarship pool distributed?",
      answer:
        "The overall scholarship value of up to ₹50,00,000 will be awarded to deserving students based on two key criteria: Early Admission Dates (5-10% early bird discount based on when you register) and Performance Merit (additional scholarships based on test scores). Individual scholarships vary according to merit - top performers in early test dates receive maximum benefits. The scholarship is designed to reward both prompt decision-making and academic excellence. All 217 seats have potential scholarship benefits, but the amount varies per student based on their performance and registration date.",
    },
    {
      question: "How many seats are available for admission?",
      answer:
        "We have a total of 217 seats available for the 2026-27 academic session across all grades. The distribution varies by grade, with limited seats (only 7 each) for 11th → 12th in both Science and Commerce streams. We recommend registering for early test dates to secure your preferred seat.",
    },
    {
      question: "What is the syllabus for the scholarship test?",
      answer:
        "The test syllabus is based on the previous class curriculum. For example, students applying for 8th grade will be tested on 7th grade Maths and Science topics. The test focuses on conceptual understanding and problem-solving skills. There is no negative marking. Detailed syllabus for each grade is available on this page.",
    },
    {
      question: "What are the minimum grade requirements?",
      answer:
        "Students must have a minimum of 70% marks in their previous academic year. For advanced courses, minimum 80% marks in relevant subjects may be required. However, exceptional performance in the scholarship test can be considered for admission.",
    },
    {
      question: "What documents are needed for the application?",
      answer:
        "You will need to provide previous academic transcripts, proof of identity, address proof, passport-sized photographs, birth certificate, transfer certificate from the previous institution, and residential proof of parents/guardians.",
    },
    {
      question: "What is the duration of the scholarship test?",
      answer:
        "The scholarship test is 3 hours long, from 10:00 AM to 1:00 PM. All test dates follow the same timing. Students should arrive 30 minutes before the test begins for registration and orientation.",
    },
    {
      question: "Is there a waiting list if classes are full?",
      answer:
        "Yes, we maintain a waiting list for all our programs. If a spot becomes available, we'll contact waitlisted applicants in order of merit.",
    },
    {
      question: "What are the fee payment options?",
      answer:
        "We offer various payment options including lump sum payment with a discount, semester-wise payment, and monthly installments for select courses. We accept online transfers, credit/debit cards, and bank drafts.",
    },
    {
      question: "Is there a scholarship program available?",
      answer:
        "Yes, we offer merit-based and need-based scholarships. Students can apply during the admission process by submitting the scholarship application form along with supporting documents.",
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 text-white py-20 px-4 md:px-8 relative overflow-hidden"
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            className="inline-block bg-yellow-400 text-green-800 px-4 py-2 rounded-full text-sm font-bold mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            🎓 ADMISSIONS OPEN 2026-27
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            {...fadeInUp}
          >
            Scholarship Test cum Admission 2026-27
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-4 opacity-95"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Early Bird Scholarships + Performance-Based Rewards
          </motion.p>
          <motion.p
            className="text-lg mb-8 opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            For Grades 6th to 12th | Multiple Test Dates | Up to 10% Early Bird
            + Additional Performance Bonus
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-400 text-green-800 px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-yellow-300 transition"
              onClick={() => navigate("/enrollnow")}
            >
              Register Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition"
              onClick={() => {
                const datesElement = document.getElementById("test-dates");
                datesElement.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Test Dates
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Test Dates & Early Bird Scholarships Section */}
      <section id="test-dates" className="py-16 px-4 md:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              📅 Test Dates & Early Bird Scholarships
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Register early to maximize your scholarship benefits! Earlier test
              dates offer higher discounts.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            variants={containerAnimation}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              { date: "7th December", discount: "10%", highlight: true },
              { date: "14th December", discount: "9%" },
              { date: "21st December", discount: "8%" },
              {
                date: "28th December",
                discount: "7%",
                special: "Current Students Test",
              },
              { date: "4th January", discount: "6%" },
              { date: "11th January", discount: "5%" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-br ${
                  item.highlight
                    ? "from-yellow-50 to-orange-50 border-yellow-400 border-4"
                    : "from-green-50 to-emerald-50 border-green-200 border-2"
                } p-6 rounded-2xl hover:shadow-xl transition-all`}
                variants={itemAnimation}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                {item.highlight && (
                  <div className="inline-block bg-yellow-400 text-green-800 px-3 py-1 rounded-full text-xs font-bold mb-3">
                    ⭐ BEST OFFER
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <FaCalendarAlt className="text-green-600 text-2xl mb-2" />
                    <h3 className="font-bold text-gray-800 text-lg">
                      {item.date}
                    </h3>
                    {item.special && (
                      <p className="text-xs text-blue-600 font-semibold mt-1">
                        {item.special}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">
                      {item.discount}
                    </p>
                    <p className="text-sm text-gray-600">Early Bird</p>
                  </div>
                </div>
                <div className="bg-white/50 rounded-lg p-3 mt-4">
                  <p className="text-sm text-gray-700 flex items-center">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    Exam: 10:00 AM - 1:00 PM
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-bold text-gray-800 mb-2 flex items-center">
              <FaCheckCircle className="text-blue-500 mr-2" />
              Additional Performance-Based Scholarship
            </h4>
            <p className="text-gray-700">
              Beyond the early bird discount, you&apos;ll receive variable
              scholarship based on your test performance. Top performers can
              receive significant additional benefits!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Scholarship Pool Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-yellow-50 via-orange-50 to-green-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-full text-lg md:text-xl font-bold mb-4 shadow-2xl"
            >
              💰 Total Scholarship Pool: ₹50,00,000
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Scholarship Distribution Model
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Overall scholarship value up to ₹50,00,000 will be awarded to
              deserving students based on performance and early admission dates
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Early Bird Component */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8 border-2 border-yellow-300 hover:shadow-2xl transition-all"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-6">
                <div className="bg-yellow-100 p-4 rounded-full mr-4">
                  <FaCalendarAlt className="text-4xl text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Early Bird Scholarships
                  </h3>
                  <p className="text-yellow-600 font-semibold">
                    5% - 10% Discount
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Register early to secure higher scholarship percentages! The
                earlier you register, the more you save from the scholarship
                pool.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span>
                    <strong>7th Dec:</strong> 10% Early Bird Discount
                  </span>
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span>
                    <strong>14th Dec:</strong> 9% Early Bird Discount
                  </span>
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span>
                    <strong>21st Dec:</strong> 8% Early Bird Discount
                  </span>
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-blue-500 mr-3 flex-shrink-0" />
                  <span>
                    <strong>28th Dec:</strong> 7% (Current Students)
                  </span>
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span>
                    <strong>4th Jan:</strong> 6% Early Bird Discount
                  </span>
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span>
                    <strong>11th Jan:</strong> 5% Early Bird Discount
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Performance Merit Component */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-300 hover:shadow-2xl transition-all"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-4 rounded-full mr-4">
                  <FaTrophy className="text-4xl text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Performance Merit
                  </h3>
                  <p className="text-green-600 font-semibold">
                    Variable Based on Score
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Excel in the scholarship test to earn additional merit-based
                scholarships from the ₹50 lakh pool. Top performers receive
                maximum benefits!
              </p>
              <ul className="space-y-3">
                <li className="flex items-start text-gray-700">
                  <FaStar className="text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <span>
                    <strong>Top 10%:</strong> Highest performance scholarships
                    awarded
                  </span>
                </li>
                <li className="flex items-start text-gray-700">
                  <FaStar className="text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <span>
                    <strong>Merit-Based:</strong> Individual scholarships vary
                    according to test performance
                  </span>
                </li>
                <li className="flex items-start text-gray-700">
                  <FaStar className="text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <span>
                    <strong>Combined Benefits:</strong> Early bird + Performance
                    merit can be stacked
                  </span>
                </li>
                <li className="flex items-start text-gray-700">
                  <FaStar className="text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <span>
                    <strong>All Grades:</strong> Scholarships available for
                    grades 6th to 12th
                  </span>
                </li>
                <li className="flex items-start text-gray-700">
                  <FaStar className="text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <span>
                    <strong>Fair Distribution:</strong> ₹50 lakh pool ensures
                    multiple deserving students benefit
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Important Note Box */}
          <motion.div
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold mb-3">
                  📊 How Individual Scholarships Are Calculated
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  <strong>
                    Individual scholarships vary according to merit.
                  </strong>{" "}
                  Your final scholarship amount depends on:
                </p>
                <div className="space-y-2 text-white/90">
                  <p className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>
                      <strong>Test Date Selection:</strong> Earlier dates =
                      Higher early bird percentage (5-10%)
                    </span>
                  </p>
                  <p className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>
                      <strong>Test Performance:</strong> Your score determines
                      additional merit scholarship from the ₹50L pool
                    </span>
                  </p>
                  <p className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>
                      <strong>Combined Benefits:</strong> Both early bird and
                      performance scholarships are awarded together
                    </span>
                  </p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center min-w-[200px] border-2 border-white/30">
                <p className="text-yellow-300 text-sm font-semibold mb-2">
                  MAXIMUM POSSIBLE
                </p>
                <p className="text-5xl font-bold mb-2">₹50L</p>
                <p className="text-white/80 text-sm">Total Scholarship Pool</p>
                <div className="mt-4 pt-4 border-t border-white/30">
                  <p className="text-yellow-300 text-xs font-semibold mb-1">
                    YOUR SHARE
                  </p>
                  <p className="text-white/90 text-sm">
                    Based on Merit & Timing
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Available Seats Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Available Seats for 2026-27
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Total <span className="font-bold text-green-600">217 seats</span>{" "}
              available across all grades
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerAnimation}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {availableSeats.map((item, index) => {
              const isLimited = item.seats <= 7;
              return (
                <motion.div
                  key={index}
                  className={`relative bg-white rounded-xl shadow-md p-6 border-2 transition-all ${
                    isLimited
                      ? "border-red-400 bg-gradient-to-br from-red-50 to-orange-50"
                      : "border-green-200 hover:border-green-400"
                  } hover:shadow-xl`}
                  variants={itemAnimation}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  {isLimited && (
                    <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                      LIMITED!
                    </div>
                  )}
                  <div className="flex items-center justify-center mb-4">
                    <div
                      className={`p-4 rounded-full ${
                        isLimited ? "bg-red-100" : "bg-green-100"
                      }`}
                    >
                      <FaGraduationCap
                        className={`text-3xl ${
                          isLimited ? "text-red-600" : "text-green-600"
                        }`}
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2 text-gray-800">
                    {item.grade}
                  </h3>
                  {item.stream && (
                    <p className="text-center text-sm text-gray-600 mb-3 font-medium">
                      {item.stream}
                    </p>
                  )}
                  <div className="text-center">
                    <span
                      className={`text-4xl font-bold ${
                        isLimited ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {item.seats}
                    </span>
                    <p className="text-gray-500 text-sm mt-1">
                      seats available
                    </p>
                  </div>
                  {isLimited && (
                    <div className="mt-4 text-center">
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                        Register Early!
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            className="mt-12 text-center bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <FaBolt className="text-4xl text-yellow-600 mx-auto mb-3" />
            <h4 className="text-xl font-bold text-gray-800 mb-2">
              ⚠️ Limited Seats Alert!
            </h4>
            <p className="text-gray-700">
              Seats for{" "}
              <span className="font-bold">
                11th → 12th (Science & Commerce)
              </span>{" "}
              are extremely limited with only{" "}
              <span className="font-bold text-red-600">7 seats each</span>.
              Register for the earliest test date to secure your spot!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Syllabus Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Scholarship Test Syllabus
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Prepare for the test with our detailed grade-wise syllabus
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerAnimation}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {/* Grade 7th Syllabus */}
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6 shadow-lg hover:shadow-xl transition-all"
              variants={itemAnimation}
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 text-white rounded-full p-3 mr-3">
                  <FaGraduationCap className="text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Grade 7th</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-blue-700 mb-2 flex items-center">
                    <span className="bg-blue-200 px-2 py-1 rounded text-sm mr-2">
                      MATHS
                    </span>
                  </h4>
                  <ul className="space-y-1 text-gray-700 text-sm ml-4">
                    <li>• Integers</li>
                    <li>• Fractions and Decimals</li>
                    <li>• Data Handling</li>
                    <li>• Simple Equations</li>
                    <li>• Lines and Angles</li>
                    <li>• Triangles</li>
                    <li>• Perimeter and Area</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-green-700 mb-2 flex items-center">
                    <span className="bg-green-200 px-2 py-1 rounded text-sm mr-2">
                      SCIENCE
                    </span>
                  </h4>
                  <ul className="space-y-1 text-gray-700 text-sm ml-4">
                    <li>• Nutrition in Plants</li>
                    <li>• Heat</li>
                    <li>• Acids, Bases and Salts</li>
                    <li>• Physical and Chemical Changes</li>
                    <li>• Weather, Climate</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Grade 8th Syllabus */}
            <motion.div
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-6 shadow-lg hover:shadow-xl transition-all"
              variants={itemAnimation}
            >
              <div className="flex items-center mb-4">
                <div className="bg-purple-500 text-white rounded-full p-3 mr-3">
                  <FaGraduationCap className="text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Grade 8th</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-purple-700 mb-2 flex items-center">
                    <span className="bg-purple-200 px-2 py-1 rounded text-sm mr-2">
                      MATHS
                    </span>
                  </h4>
                  <ul className="space-y-1 text-gray-700 text-sm ml-4">
                    <li>• Rational Numbers</li>
                    <li>• Linear Equations in One Variable</li>
                    <li>• Quadrilaterals</li>
                    <li>• Data Handling</li>
                    <li>• Squares and Square Roots</li>
                    <li>• Cubes and Cube Roots</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-green-700 mb-2 flex items-center">
                    <span className="bg-green-200 px-2 py-1 rounded text-sm mr-2">
                      SCIENCE
                    </span>
                  </h4>
                  <ul className="space-y-1 text-gray-700 text-sm ml-4">
                    <li>• Crop Production and Management</li>
                    <li>• Microorganisms</li>
                    <li>• Force and Pressure</li>
                    <li>• Friction</li>
                    <li>• Chemical Effects of Electric Current</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Grade 9th Syllabus */}
            <motion.div
              className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200 p-6 shadow-lg hover:shadow-xl transition-all"
              variants={itemAnimation}
            >
              <div className="flex items-center mb-4">
                <div className="bg-orange-500 text-white rounded-full p-3 mr-3">
                  <FaGraduationCap className="text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Grade 9th</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-orange-700 mb-2 flex items-center">
                    <span className="bg-orange-200 px-2 py-1 rounded text-sm mr-2">
                      MATHS
                    </span>
                  </h4>
                  <ul className="space-y-1 text-gray-700 text-sm ml-4">
                    <li>• Number Systems</li>
                    <li>• Polynomials</li>
                    <li>• Linear Equations in Two Variables</li>
                    <li>• Triangles</li>
                    <li>• Quadrilaterals</li>
                    <li>• Statistics</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-green-700 mb-2 flex items-center">
                    <span className="bg-green-200 px-2 py-1 rounded text-sm mr-2">
                      SCIENCE
                    </span>
                  </h4>
                  <ul className="space-y-1 text-gray-700 text-sm ml-4">
                    <li>• Matter in Our Surroundings</li>
                    <li>• Atoms and Molecules</li>
                    <li>• Motion</li>
                    <li>• Force and Laws of Motion</li>
                    <li>• Work and Energy</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Grade 10th Syllabus */}
            <motion.div
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 p-6 shadow-lg hover:shadow-xl transition-all"
              variants={itemAnimation}
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-600 text-white rounded-full p-3 mr-3">
                  <FaGraduationCap className="text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Grade 10th</h3>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700 font-medium">
                  <FaCheckCircle className="inline text-yellow-600 mr-2" />
                  Full syllabus of Class 10th will be covered
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-green-700 mb-2 flex items-center">
                    <span className="bg-green-200 px-2 py-1 rounded text-sm mr-2">
                      MATHS
                    </span>
                  </h4>
                  <ul className="space-y-1 text-gray-700 text-sm ml-4">
                    <li>• Real Numbers</li>
                    <li>• Polynomials</li>
                    <li>• Pair of Linear Equations</li>
                    <li>• Quadratic Equations</li>
                    <li>• Arithmetic Progressions</li>
                    <li>• Triangles, Circles</li>
                    <li>• Trigonometry</li>
                    <li>• Statistics, Probability</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-green-700 mb-2 flex items-center">
                    <span className="bg-green-200 px-2 py-1 rounded text-sm mr-2">
                      SCIENCE
                    </span>
                  </h4>
                  <ul className="space-y-1 text-gray-700 text-sm ml-4">
                    <li>• Chemical Reactions</li>
                    <li>• Acids, Bases and Salts</li>
                    <li>• Metals and Non-metals</li>
                    <li>• Life Processes</li>
                    <li>• Electricity</li>
                    <li>• Magnetic Effects</li>
                    <li>• Light - Reflection & Refraction</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-8 bg-gradient-to-r from-green-100 to-emerald-100 border-l-4 border-green-600 p-6 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-bold text-gray-800 mb-2 flex items-center">
              <FaCheckCircle className="text-green-600 mr-2" />
              Important Notes:
            </h4>
            <ul className="space-y-1 text-gray-700 text-sm ml-6">
              <li>
                • Test will be based on the syllabus of the previous class
              </li>
              <li>
                • Questions will test conceptual understanding and
                problem-solving skills
              </li>
              <li>• No negative marking in the scholarship test</li>
              <li>• Test duration: 3 hours (10:00 AM - 1:00 PM)</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Admission Process Section */}
      {/* <section className="py-16 px-4 md:px-8 bg-green-50">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Admission Process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our streamlined admission process ensures a fair and comprehensive
              evaluation of each applicant to find the perfect fit for our
              academic community.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
            variants={containerAnimation}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {admissionSteps.map((step, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col items-center text-center hover:border-green-300 hover:shadow-lg transition-all"
                variants={itemAnimation}
                whileHover={{ y: -5 }}
              >
                <div className="bg-green-50 p-3 rounded-full mb-4">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
                <div className="mt-4 text-green-600 font-bold text-lg">
                  Step {index + 1}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* Eligibility & Requirements Section */}
      {/* <section className="py-16 px-4 md:px-8 bg-green-50">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Eligibility & Requirements
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Make sure you meet our eligibility criteria and have all the
              required documents before applying.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-bold mb-4 text-green-700">
                Eligibility Criteria
              </h3>
              <ul className="space-y-3">
                {[
                  "Minimum 70% aggregate in previous academic year",
                  "Age-appropriate for the applied grade level",
                  "Basic English language proficiency",
                  "Successful performance in admission test",
                  "Satisfactory performance in personal interview",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4 text-green-700">
                Required Documents
              </h3>
              <ul className="space-y-3">
                {[
                  "Completed application form",
                  "Birth certificate",
                  "Previous academic records/transcripts",
                  "Transfer certificate from previous school",
                  "4 passport-sized photographs",
                  "Residential proof of parents/guardians",
                  "Identity proof of parents/guardians",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FaFileAlt className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section> */}

      {/* Important Dates Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-white via-gray-50 to-green-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Important Dates to Remember
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Mark your calendars with these critical dates for admission
              2026-27
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerAnimation}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {keyDates.map((item, index) => {
              const isFirst = index === 0;
              const isCurrent = item.event.includes("Current");
              return (
                <motion.div
                  key={index}
                  className={`relative bg-white rounded-xl shadow-lg p-6 border-2 transition-all ${
                    isFirst
                      ? "border-green-400 bg-gradient-to-br from-green-50 to-emerald-50"
                      : isCurrent
                      ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                  variants={itemAnimation}
                  whileHover={{ y: -8, scale: 1.03 }}
                >
                  {isFirst && (
                    <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      FIRST TEST
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute -top-3 -right-3 bg-yellow-500 text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      CURRENT STUDENTS
                    </div>
                  )}
                  <div
                    className={`flex items-center justify-center mb-4 p-4 rounded-full ${
                      isFirst
                        ? "bg-green-100"
                        : isCurrent
                        ? "bg-yellow-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <FaCalendarAlt
                      className={`text-3xl ${
                        isFirst
                          ? "text-green-600"
                          : isCurrent
                          ? "text-yellow-600"
                          : "text-gray-600"
                      }`}
                    />
                  </div>
                  <h3 className="font-bold text-gray-800 text-center mb-3 text-lg">
                    {item.event}
                  </h3>
                  <div
                    className={`px-4 py-3 rounded-lg text-center font-bold text-lg ${
                      isFirst
                        ? "bg-green-100 text-green-800"
                        : isCurrent
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.date}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            className="mt-10 bg-gradient-to-r from-green-100 via-emerald-100 to-green-100 border-2 border-green-300 rounded-xl p-6 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-bold text-gray-800 mb-2 text-xl">
              📅 All Tests: 10:00 AM - 1:00 PM
            </h4>
            <p className="text-gray-700">
              Choose any test date between 7th December 2025 and 11th January
              2026 based on your convenience
            </p>
          </motion.div>
        </div>
      </section>

      {/* Admission Form Section */}
      <section id="admission-form" className="py-16 px-4 md:px-8 bg-green-50">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Request More Information
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Fill out the form below and our admissions team will get back to
              you with more information.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {submitMessage ? (
              <div className="text-center p-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-center mb-4"
                >
                  <div
                    className={`p-3 rounded-full ${
                      submitMessage.includes("Something went wrong")
                        ? "bg-red-100"
                        : "bg-green-100"
                    }`}
                  >
                    <FaCheckCircle
                      className={`text-4xl ${
                        submitMessage.includes("Something went wrong")
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    />
                  </div>
                </motion.div>
                <h3
                  className={`text-xl font-bold mb-2 ${
                    submitMessage.includes("Something went wrong")
                      ? "text-red-700"
                      : "text-green-700"
                  }`}
                >
                  {submitMessage.includes("Something went wrong")
                    ? "Oops!"
                    : "Thank You!"}
                </h3>
                <p className="text-gray-600">{submitMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Hidden honeypot field for spam protection */}
                <input type="text" name="_honey" style={{ display: "none" }} />

                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="class"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Class Interested In
                  </label>
                  <select
                    id="class"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.class ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Class</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                  {errors.class && (
                    <p className="text-red-500 text-sm mt-1">{errors.class}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Any specific questions or information you need?"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />{" "}
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to commonly asked questions about our admission
              process.
            </p>
          </motion.div>

          <motion.div
            className="space-y-4"
            variants={containerAnimation}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
                variants={itemAnimation}
              >
                <button
                  className="flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-gray-800">
                    {faq.question}
                  </span>
                  {openFaq === index ? (
                    <FaChevronUp className="text-green-600" />
                  ) : (
                    <FaChevronDown className="text-gray-400" />
                  )}
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-gray-50 border-t border-gray-200"
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 px-4 md:px-8 bg-green-600 text-white text-center">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-lg mb-8 opacity-90">
              Our admissions team is here to help you through every step of the
              process.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="tel:+919829491219"
                className="flex items-center bg-white text-green-700 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEnvelope className="mr-2" />
                Contact Admissions
              </motion.a>
              <motion.a
                href="/enrollnow"
                className="flex items-center bg-green-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-800 transition border border-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule Campus Visit
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Admissions;
