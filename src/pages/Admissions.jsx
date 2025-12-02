import React, { useState } from "react";
import SEO from "../components/SEO";
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
    { grade: "7th", seats: 20, stream: "" },
    { grade: "8th", seats: 30, stream: "" },
    { grade: "9th", seats: 40, stream: "" },
    { grade: "10th", seats: 50, stream: "" },
    { grade: "11th", seats: 30, stream: "Science" },
    { grade: "11th", seats: 30, stream: "Commerce" },
    { grade: "12th", seats: 7, stream: "Science" },
    { grade: "12th", seats: 7, stream: "Commerce" },
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
        "Transform your academic journey with our comprehensive scholarship program! We offer UP TO 30% OFF on tuition fees based on your test performance, PLUS an additional 10% Early Bird Discount for early registration. Our ₹50 Lakh scholarship pool rewards both merit and prompt decision-making. Simply register for our Scholarship Test cum Admission (7th December 2025 - 11th January 2026), excel in the test to earn merit-based discounts up to 30%, and register early to secure your bonus 10% Early Bird Discount. The higher you score and the earlier you register, the greater your savings!",
    },
    {
      question: "Can current students also appear for the scholarship test?",
      answer:
        "Yes! Current students have a dedicated test date on 28th December 2025 at 10:00 AM. They can appear for the test to upgrade their current scholarship benefits. This is an excellent opportunity to improve your scholarship percentage based on your current performance and potential.",
    },
    {
      question: "How is the ₹50 Lakh scholarship pool distributed?",
      answer:
        "Our scholarship model is designed to maximize value for deserving students: (1) Merit-Based Scholarships: Earn UP TO 30% OFF on tuition fees based on your test performance. Top scorers receive maximum discounts. (2) Early Bird Discount: Secure an ADDITIONAL 10% OFF by registering for earlier test dates. (3) Total Savings: Combine both benefits to receive substantial reductions on your educational investment. The ₹50 Lakh pool ensures multiple students benefit, with individual scholarships varying according to test merit and registration timing. This dual-benefit model rewards both academic excellence and prompt action.",
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

  // FAQ Schema for Rich Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="bg-gray-50">
      <SEO
        title={
          "Scholarship Test Abhigyan Gurukul 2026 | Admissions | Up to 30% OFF"
        }
        metas={[
          {
            name: "description",
            content:
              "Scholarship Test Abhigyan Gurukul 2026-27: Get UP TO 30% scholarship + 10% Early Bird Discount. ₹50 Lakh merit-based scholarship pool. Admission open for grades 6-12. Register now for scholarship test cum admission Dec 7, 2025 to Jan 11, 2026. Limited 217 seats.",
          },
          {
            name: "keywords",
            content:
              "scholarship test abhigyan gurukul, abhigyan gurukul scholarship, scholarship abhigyan, abhigyan gurukul admissions 2026, merit scholarship test, school scholarship exam, ₹50 lakh scholarship pool, scholarship test cum admission, early bird scholarship discount, merit based scholarship India",
          },
          { property: "og:type", content: "website" },
          {
            property: "og:url",
            content: "https://abhigyan-gurukul.com/admissions",
          },
          {
            property: "og:title",
            content:
              "Scholarship Test Abhigyan Gurukul 2026 | Up to 30% OFF + Early Bird Discount",
          },
          {
            property: "og:description",
            content:
              "Scholarship Test Abhigyan Gurukul: Merit-based scholarships up to 30% OFF + 10% Early Bird Discount. ₹50 Lakh scholarship pool for grades 6-12. Register for scholarship test cum admission now!",
          },
          { property: "og:site_name", content: "Abhigyan Gurukul" },
          { property: "og:image", content: "/ABHIGYAN_GURUKUL_logo.svg" },
          { name: "twitter:card", content: "summary_large_image" },
          {
            name: "twitter:title",
            content:
              "Scholarship Test Abhigyan Gurukul 2026 | Up to 30% OFF Scholarship",
          },
          {
            name: "twitter:description",
            content:
              "Scholarship Test Abhigyan Gurukul: Get up to 30% scholarship + 10% Early Bird Discount. ₹50L pool. Register now!",
          },
          {
            name: "robots",
            content:
              "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
          },
          { name: "googlebot", content: "index, follow" },
          { name: "bingbot", content: "index, follow" },
          { name: "author", content: "Abhigyan Gurukul" },
          { name: "revisit-after", content: "7 days" },
          { name: "geo.region", content: "IN" },
          { name: "geo.placename", content: "Vadodara" },
          { name: "geo.position", content: "25.594095;85.137566" },
          { name: "ICBM", content: "25.594095, 85.137566" },
        ]}
        links={[
          { rel: "canonical", href: "https://abhigyan-gurukul.com/admissions" },
        ]}
        scripts={[
          { type: "application/ld+json", innerHTML: JSON.stringify(faqSchema) },
          {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "Abhigyan Gurukul",
              description:
                "Premier educational institution offering quality education with merit-based scholarships",
              url: "https://abhigyan-gurukul.com",
              logo: "https://abhigyan-gurukul.com/ABHIGYAN_GURUKUL_logo.svg",
              address: { "@type": "PostalAddress", addressCountry: "IN" },
            }),
          },
          {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://abhigyan-gurukul.com/",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Admissions",
                  item: "https://abhigyan-gurukul.com/admissions",
                },
              ],
            }),
          },
          {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              name: "Scholarship Test Abhigyan Gurukul 2026-27 | Merit-Based Admission",
              alternateName: "Abhigyan Gurukul Scholarship Exam",
              description:
                "Scholarship Test Abhigyan Gurukul for grades 6-12. Merit-based scholarship up to 30% OFF on tuition fees + 10% Early Bird Discount. ₹50 Lakh scholarship pool. Test cum admission with 217 limited seats.",
              startDate: "2025-12-07T10:00:00+05:30",
              endDate: "2026-01-11T13:00:00+05:30",
              eventStatus: "https://schema.org/EventScheduled",
              eventAttendanceMode:
                "https://schema.org/OfflineEventAttendanceMode",
              location: {
                "@type": "Place",
                name: "Abhigyan Gurukul",
                address: {
                  "@type": "PostalAddress",
                  addressCountry: "IN",
                  addressRegion: "Vadodara",
                },
              },
              organizer: {
                "@type": "EducationalOrganization",
                name: "Abhigyan Gurukul",
                url: "https://abhigyan-gurukul.com",
                sameAs: "https://abhigyan-gurukul.com/admissions",
              },
              offers: {
                "@type": "Offer",
                name: "Merit-Based Scholarship - Up to 30% OFF",
                price: "0",
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
                url: "https://abhigyan-gurukul.com/admissions",
                validFrom: "2025-11-27",
                priceValidUntil: "2026-01-11",
              },
              keywords:
                "scholarship test abhigyan gurukul, abhigyan gurukul scholarship, merit scholarship, admission test, early bird discount",
            }),
          },
          {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOccupationalProgram",
              name: "Abhigyan Gurukul Scholarship Program 2026-27",
              description:
                "Merit-based scholarship program offering up to 30% tuition fee discount plus early bird benefits. ₹50 Lakh scholarship pool for deserving students.",
              provider: {
                "@type": "EducationalOrganization",
                name: "Abhigyan Gurukul",
                url: "https://abhigyan-gurukul.com/admissions",
              },
              offers: {
                "@type": "Offer",
                category: "Scholarship",
                priceSpecification: {
                  "@type": "PriceSpecification",
                  price: "5000000",
                  priceCurrency: "INR",
                },
              },
              educationalProgramMode: "OnSite",
              timeToComplete: "P1Y",
              numberOfCredits: "Grades 6-12",
            }),
          },
        ]}
      />
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

        <div className="container mx-auto max-w-6xl relative z-10 ">
          <motion.div
            className="inline-block bg-yellow-400 text-green-800 px-4 py-2 rounded-full text-sm font-bold mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            🎓 ADMISSIONS OPEN 2026-27
          </motion.div>

          <div className="text-center mb-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25, type: "spring" }}
              className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-green-800 px-6 md:px-8 py-3 md:py-4 rounded-2xl text-2xl md:text-4xl font-black shadow-2xl border-4 border-yellow-300"
            >
              ⚡ UP TO 30% OFF ⚡
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-lg md:text-2xl font-bold text-yellow-300 mt-2"
            >
              + Early Bird Discounts!
            </motion.p>
          </div>

          <motion.h1
            className="text-3xl md:text-5xl font-bold mb-4"
            {...fadeInUp}
          >
            Admissions Open 2026-27 | Scholarship Test & Enrollment
          </motion.h1>
          <motion.h2
            className="text-xl md:text-2xl mb-3 opacity-95 font-semibold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Transform Your Future with Merit-Based Scholarships at Abhigyan
            Gurukul
          </motion.h2>
          <motion.p
            className="text-base md:text-lg mb-2 opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <strong>
              Test Your Potential, Unlock Premium Education at Reduced Cost
            </strong>
          </motion.p>
          <motion.p
            className="text-sm md:text-base mb-8 opacity-85"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            Up to 30% OFF on Test Merit + Additional 10% Early Bird Discount |
            Grades 6-12 | ₹50L Scholarship Pool |{" "}
            <a
              href="/about"
              className="text-yellow-300 font-bold hover:underline"
            >
              Learn about us
            </a>
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
              aria-label="Register for Abhigyan Gurukul Scholarship Test 2026"
            >
              Register for Scholarship Test
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition"
              onClick={() => {
                const datesElement = document.getElementById("test-dates");
                datesElement.scrollIntoView({ behavior: "smooth" });
              }}
              aria-label="View scholarship test dates and early bird discounts"
            >
              View Test Dates & Discounts
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Scholarship Highlights Section - Quick Benefits */}
      <section className="py-12 px-4 md:px-8 bg-gradient-to-r from-green-50 to-emerald-50 border-y-4 border-green-600">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              🎓 Why Choose Abhigyan Gurukul Scholarship Program?
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              India&apos;s Most Rewarding Merit-Based Scholarship for School
              Students
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerAnimation}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-600"
              variants={itemAnimation}
            >
              <div className="flex items-start">
                <FaTrophy className="text-3xl text-yellow-500 mr-4 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    ₹50 Lakh Scholarship Pool
                  </h3>
                  <p className="text-sm text-gray-600">
                    Generous financial aid for deserving students across grades
                    6-12. Merit-based rewards up to 30% tuition fee discount.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500"
              variants={itemAnimation}
            >
              <div className="flex items-start">
                <FaBolt className="text-3xl text-orange-500 mr-4 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    Early Bird Bonus Discounts
                  </h3>
                  <p className="text-sm text-gray-600">
                    Register early and get flat 5-10% additional discount!
                    Combine with merit scholarship for maximum savings on
                    education.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-600"
              variants={itemAnimation}
            >
              <div className="flex items-start">
                <FaGraduationCap className="text-3xl text-blue-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    Quality Education Guaranteed
                  </h3>
                  <p className="text-sm text-gray-600">
                    Expert faculty, modern facilities, and proven track record.
                    Join 217 students getting premium education at reduced cost.{" "}
                    <a
                      href="/courses"
                      className="text-green-600 font-semibold hover:underline"
                    >
                      View programs
                    </a>
                    .
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

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
              📅 Scholarship Test Dates 2026 & Early Bird Benefits
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              <strong>Earn up to 30% OFF based on test performance</strong> +
              secure an additional 10% Early Bird Discount! Register for earlier
              dates to maximize your total savings.
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
                <div className="mb-3">
                  <div className="flex items-center mb-2">
                    <FaCalendarAlt className="text-green-600 text-2xl mr-2" />
                    <h3 className="font-bold text-gray-800 text-lg">
                      {item.date}
                    </h3>
                  </div>
                  {item.special && (
                    <p className="text-xs text-blue-600 font-semibold mb-2">
                      {item.special}
                    </p>
                  )}
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-3 mb-2">
                    <p className="text-2xl font-bold text-center">
                      Up to 30% OFF
                    </p>
                    <p className="text-xs text-center opacity-90">
                      Merit-Based Scholarship
                    </p>
                  </div>
                  <div className="bg-yellow-400 text-green-800 rounded-lg p-2 mb-2">
                    <p className="text-xl font-bold text-center">
                      + Flat {item.discount}
                    </p>
                    <p className="text-xs text-center font-semibold">
                      Early Bird Discount
                    </p>
                  </div>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <p className="text-sm text-gray-700 flex items-center justify-center">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    10:00 AM - 1:00 PM
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
              Beyond the early bird discount, you&apos;ll receive additional OFF
              based on your test performance. Top performers can receive
              significant additional benefits!
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
              <strong>Up to 30% OFF on tuition fees</strong> based on your test
              merit, plus an additional 10% Early Bird Discount. Total
              scholarship pool of ₹50,00,000 available for deserving students.
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
                    Early Bird Discounts
                  </h3>
                  <p className="text-yellow-600 font-semibold">
                    Additional 10% OFF
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Secure your seat early and save more! Register for the earliest
                test dates to receive an{" "}
                <strong>additional 10% Early Bird Discount</strong> on top of
                your merit-based scholarship.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span>
                    <strong>7th Dec:</strong> 10% additional OFF
                  </span>
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span>
                    <strong>14th Dec:</strong> 9% additional OFF
                  </span>
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span>
                    <strong>21st Dec:</strong> 8% additional OFF
                  </span>
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-blue-500 mr-3 flex-shrink-0" />
                  <span>
                    <strong>28th Dec:</strong> 7% additional OFF (Current
                    Students)
                  </span>
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span>
                    <strong>4th Jan:</strong> 6% additional OFF
                  </span>
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span>
                    <strong>11th Jan:</strong> 5% additional OFF
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
                    Merit-Based Scholarships
                  </h3>
                  <p className="text-green-600 font-semibold">
                    Up to 30% OFF on Tuition Fees
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Excel in the scholarship test and earn{" "}
                <strong>up to 30% OFF</strong> on your tuition fees! Your
                performance determines your discount from our ₹50 lakh
                scholarship pool. Top achievers receive maximum benefits.
                Explore our{" "}
                <a
                  href="/courses"
                  className="text-green-600 font-semibold hover:underline"
                >
                  academic programs
                </a>{" "}
                to see scholarship-eligible courses.
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
                  📊 How Your Scholarship is Calculated
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  <strong>
                    Maximize your savings with our dual-benefit scholarship
                    model!
                  </strong>{" "}
                  Your total discount depends on:
                </p>
                <div className="space-y-2 text-white/90">
                  <p className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>
                      <strong>Test Performance (Primary):</strong> Score high to
                      earn
                      <strong> up to 30% OFF</strong> on tuition fees based on
                      merit
                    </span>
                  </p>
                  <p className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>
                      <strong>Early Bird Discount (Bonus):</strong> Register for
                      earlier test dates to secure an{" "}
                      <strong>additional 10% OFF</strong>
                    </span>
                  </p>
                  <p className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>
                      <strong>Total Potential Savings:</strong> Combine both
                      benefits for maximum value from our ₹50 Lakh scholarship
                      pool
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
              Available Admission Seats 2026-27 | Limited Vacancies
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Total <span className="font-bold text-green-600">217 seats</span>{" "}
              available across all grades. Apply early to secure your seat!
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
              Scholarship Test Syllabus 2026 | Grade-wise Exam Pattern
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
            {/* Grade 6th Syllabus */}
            <motion.div
              className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border-2 border-cyan-200 p-6 shadow-lg hover:shadow-xl transition-all"
              variants={itemAnimation}
            >
              <div className="flex items-center mb-4">
                <div className="bg-cyan-500 text-white rounded-full p-3 mr-3">
                  <FaGraduationCap className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    6th → 7th Grade
                  </h3>
                  <p className="text-xs text-gray-600">
                    Syllabus: Current 6th Grade
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-cyan-700 mb-2 flex items-center">
                    <span className="bg-cyan-200 px-2 py-1 rounded text-sm mr-2">
                      MATHS
                    </span>
                  </h4>
                  <ul className="space-y-1 text-gray-700 text-sm ml-4">
                    <li>• Decimals</li>
                    <li>• Fraction</li>
                    <li>• Algebra</li>
                    <li>• Mensuration</li>
                    <li>• Ratio and proportion</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-green-700 mb-2 flex items-center">
                    <span className="bg-green-200 px-2 py-1 rounded text-sm mr-2">
                      SCIENCE
                    </span>
                  </h4>
                  <ul className="space-y-1 text-gray-700 text-sm ml-4">
                    <li>• Diversity in Living World</li>
                    <li>• Materials around us</li>
                    <li>• Temperature and its measurement</li>
                    <li>• Measurement of Length and Motion</li>
                    <li>• Mindful Eating: A path to Healthy Body</li>
                    <li>• A journey through states of water</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Grade 7th Syllabus */}
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6 shadow-lg hover:shadow-xl transition-all"
              variants={itemAnimation}
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 text-white rounded-full p-3 mr-3">
                  <FaGraduationCap className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    7th → 8th Grade
                  </h3>
                  <p className="text-xs text-gray-600">
                    Syllabus: Current 7th Grade
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-blue-700 mb-2 flex items-center">
                    <span className="bg-blue-200 px-2 py-1 rounded text-sm mr-2">
                      MATHS
                    </span>
                  </h4>
                  <ul className="space-y-1 text-gray-700 text-sm ml-4">
                    <li>• Exponents and powers</li>
                    <li>• Algebric expressions</li>
                    <li>• Triangle and its properties</li>
                    <li>• Perimeter and area</li>
                    <li>• Rational numbers</li>
                    <li>• Comparing quantities</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-green-700 mb-2 flex items-center">
                    <span className="bg-green-200 px-2 py-1 rounded text-sm mr-2">
                      SCIENCE
                    </span>
                  </h4>
                  <ul className="space-y-1 text-gray-700 text-sm ml-4">
                    <li>• Light</li>
                    <li>• Acid, base & salts</li>
                    <li>• Motion and time</li>
                    <li>• Physical & chemical changes</li>
                    <li>• Transportation in plants & animals</li>
                    <li>• Electric current and its effects</li>
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
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    8th → 9th Grade
                  </h3>
                  <p className="text-xs text-gray-600">
                    Syllabus: Current 8th Grade
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-purple-700 mb-2 flex items-center">
                    <span className="bg-purple-200 px-2 py-1 rounded text-sm mr-2">
                      MATHS
                    </span>
                  </h4>
                  <ul className="space-y-1 text-gray-700 text-sm ml-4">
                    <li>• Factorisation</li>
                    <li>• Algebraic expressions</li>
                    <li>• Mensuration</li>
                    <li>• Exponents and power</li>
                    <li>• Understanding quadrilaterals</li>
                    <li>• Linear equations</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-green-700 mb-2 flex items-center">
                    <span className="bg-green-200 px-2 py-1 rounded text-sm mr-2">
                      SCIENCE
                    </span>
                  </h4>
                  <ul className="space-y-1 text-gray-700 text-sm ml-4">
                    <li>• Force & pressure</li>
                    <li>• Friction</li>
                    <li>• Sound</li>
                    <li>• Coal & petroleum</li>
                    <li>• Combustion & flame</li>
                    <li>• Reaching the age of adolescence</li>
                    <li>• Reproduction in animals</li>
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
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    9th → 10th Grade
                  </h3>
                  <p className="text-xs text-gray-600">
                    Syllabus: Current 9th Grade
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-orange-700 mb-2 flex items-center">
                    <span className="bg-orange-200 px-2 py-1 rounded text-sm mr-2">
                      MATHS
                    </span>
                  </h4>
                  <ul className="space-y-1 text-gray-700 text-sm ml-4">
                    <li>• Number system</li>
                    <li>• polynomials</li>
                    <li>• coordinate geometry</li>
                    <li>• Linear equations</li>
                    <li>• Triangles</li>
                    <li>• Surface areas and volumes</li>
                    <li>• Herons formula</li>
                    <li>• Circles</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-green-700 mb-2 flex items-center">
                    <span className="bg-green-200 px-2 py-1 rounded text-sm mr-2">
                      SCIENCE
                    </span>
                  </h4>
                  <ul className="space-y-1 text-gray-700 text-sm ml-4">
                    <li>• Atoms & molecules</li>
                    <li>• Structure of atom</li>
                    <li>• Motion</li>
                    <li>• Gravitation</li>
                    <li>• Force & laws of motion</li>
                    <li>• work & energy</li>
                    <li>• Sound</li>
                    <li>• Fundamental unit of life</li>
                    <li>• Tissues</li>
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
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    10th → 11th Grade
                  </h3>
                  <p className="text-xs text-gray-600">
                    Syllabus: Current 10th Grade
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-green-700 mb-2 flex items-center">
                    <span className="bg-green-200 px-2 py-1 rounded text-sm mr-2">
                      MATHS (10th)
                    </span>
                  </h4>
                  <p className="text-sm text-gray-700 font-medium mb-2">
                    Maths full syllabus (Std)
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-green-700 mb-2 flex items-center">
                    <span className="bg-green-200 px-2 py-1 rounded text-sm mr-2">
                      SCIENCE
                    </span>
                  </h4>
                  <p className="text-sm text-gray-700 font-medium mb-2">
                    Full syllabus (chemistry + physics)
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-blue-700 mb-2 flex items-center">
                    <span className="bg-blue-200 px-2 py-1 rounded text-sm mr-2">
                      BIOLOGY (10th)
                    </span>
                  </h4>
                  <p className="text-sm text-gray-700 font-medium mb-2">
                    Maths full syllabus (Basics)
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-green-700 mb-2 flex items-center">
                    <span className="bg-green-200 px-2 py-1 rounded text-sm mr-2">
                      SCIENCE (Bio)
                    </span>
                  </h4>
                  <p className="text-sm text-gray-700 font-medium">
                    Full syllabus (chemistry + physics + bio)
                  </p>
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

      {/* Terms and Conditions Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              📋 Scholarship Terms & Conditions | Admission Guidelines
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Please read the following terms carefully before registering for
              the scholarship test. Contact us at{" "}
              <a
                href="/admissions#inquiry-form"
                className="text-green-600 font-semibold hover:underline"
              >
                admissions
              </a>{" "}
              for clarifications.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                  <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
                    1
                  </span>
                  Scholarship Eligibility
                </h3>
                <ul className="ml-11 space-y-2 text-sm md:text-base">
                  <li>
                    • Scholarships are awarded based on test performance and
                    registration date
                  </li>
                  <li>
                    • Merit-based discount (up to 30% OFF) is determined by test
                    scores
                  </li>
                  <li>
                    • Early Bird Discount (10%) is available for registrations
                    on or before the first test date
                  </li>
                  <li>
                    • Scholarships are applicable only for the academic year
                    2026-27
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                  <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
                    2
                  </span>
                  Test Registration
                </h3>
                <ul className="ml-11 space-y-2 text-sm md:text-base">
                  <li>
                    • Students must register before their chosen test date
                  </li>
                  <li>
                    • Registration is subject to seat availability (217 total
                    seats)
                  </li>
                  <li>• Students can appear for only one test date</li>
                  <li>
                    • Minimum 70% marks in the previous academic year required
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                  <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
                    3
                  </span>
                  Scholarship Distribution
                </h3>
                <ul className="ml-11 space-y-2 text-sm md:text-base">
                  <li>
                    • Total scholarship pool of ₹50,00,000 will be distributed
                    among deserving students
                  </li>
                  <li>
                    • Individual scholarship amounts vary based on test merit
                    and registration timing
                  </li>
                  <li>
                    • Scholarship percentages are calculated on annual tuition
                    fees only
                  </li>
                  <li>
                    • Scholarships cannot be transferred or exchanged for cash
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                  <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
                    4
                  </span>
                  Test Guidelines
                </h3>
                <ul className="ml-11 space-y-2 text-sm md:text-base">
                  <li>• Test duration: 3 hours (10:00 AM - 1:00 PM)</li>
                  <li>• No negative marking in the scholarship test</li>
                  <li>
                    • Students must arrive 30 minutes before the test start time
                  </li>
                  <li>• Valid ID proof and admit card are mandatory</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                  <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
                    5
                  </span>
                  Admission Confirmation
                </h3>
                <ul className="ml-11 space-y-2 text-sm md:text-base">
                  <li>
                    • Admission is subject to document verification and
                    availability of seats
                  </li>
                  <li>
                    • Selected students must complete admission formalities
                    within the specified timeframe
                  </li>
                  <li>
                    • Scholarship benefits will be reflected in the fee
                    structure upon admission
                  </li>
                  <li>
                    • The institution reserves the right to modify terms as
                    necessary
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mt-6">
                <p className="text-sm text-gray-800">
                  <strong className="text-yellow-800">Important:</strong> By
                  registering for the scholarship test, applicants agree to
                  abide by all terms and conditions set forth by Abhigyan
                  Gurukul. The institution reserves the right to make final
                  decisions on all scholarship-related matters.
                </p>
              </div>
            </div>
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
              Admission FAQs | Scholarship & Enrollment Questions Answered
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to commonly asked questions about our admission
              process, scholarship eligibility, and test details. Still have
              questions?{" "}
              <a
                href="#inquiry-form"
                className="text-green-600 font-semibold hover:underline"
              >
                Contact us
              </a>
              .
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
