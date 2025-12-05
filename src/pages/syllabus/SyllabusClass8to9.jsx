/* eslint-disable react/react-in-jsx-scope */
import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaArrowLeft,
  FaBook,
  FaCalculator,
  FaFlask,
} from "react-icons/fa";
import { Link } from "react-router";
import SEO from "../../components/SEO";

const SyllabusClass8to9 = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const mathTopics = [
    {
      topic: "Factorisation",
      description: "Factoring algebraic expressions and polynomials",
    },
    {
      topic: "Algebraic Expressions",
      description: "Operations and simplification of expressions",
    },
    {
      topic: "Mensuration",
      description: "Surface area and volume of 3D shapes",
    },
    {
      topic: "Exponents and Power",
      description: "Advanced exponent rules and applications",
    },
    {
      topic: "Understanding Quadrilaterals",
      description: "Properties of different quadrilaterals",
    },
    {
      topic: "Linear Equations",
      description: "Solving linear equations in one variable",
    },
  ];

  const scienceTopics = [
    {
      topic: "Force & Pressure",
      description: "Types of forces and pressure concepts",
    },
    {
      topic: "Friction",
      description: "Types of friction and its applications",
    },
    {
      topic: "Sound",
      description: "Production, propagation, and properties of sound",
    },
    {
      topic: "Coal & Petroleum",
      description: "Fossil fuels and their conservation",
    },
    {
      topic: "Combustion & Flame",
      description: "Types of combustion and fire safety",
    },
    {
      topic: "Reaching the Age of Adolescence",
      description: "Changes during puberty",
    },
    {
      topic: "Reproduction in Animals",
      description: "Sexual and asexual reproduction",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <SEO
        title="Class 8th to 9th Syllabus | Scholarship Test | Abhigyan Gurukul"
        metas={[
          {
            name: "description",
            content:
              "Complete syllabus for Class 8th to 9th scholarship test at Abhigyan Gurukul. Covers Mathematics and Science topics from current 8th grade curriculum.",
          },
          {
            name: "keywords",
            content:
              "class 8 syllabus, 9th grade admission test, scholarship test syllabus, abhigyan gurukul syllabus",
          },
        ]}
      />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 text-white py-16 px-4 md:px-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <Link
            to="/admissions"
            className="inline-flex items-center text-purple-100 hover:text-white mb-6 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Admissions
          </Link>

          <motion.div className="flex items-center gap-4 mb-4" {...fadeInUp}>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <FaGraduationCap className="text-4xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold">
                8th → 9th Grade
              </h1>
              <p className="text-purple-100 text-lg mt-1">
                Scholarship Test Syllabus 2026
              </p>
            </div>
          </motion.div>

          <motion.p
            className="text-lg text-purple-100 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Based on Current 8th Grade Curriculum • Test Duration: 3 Hours
          </motion.p>
        </div>
      </motion.section>

      {/* Content Section */}
      <section className="py-12 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mathematics */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
                <div className="flex items-center gap-3">
                  <FaCalculator className="text-3xl text-white" />
                  <h2 className="text-2xl font-bold text-white">Mathematics</h2>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  {mathTopics.map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <span className="bg-purple-100 text-purple-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {item.topic}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Science */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                <div className="flex items-center gap-3">
                  <FaFlask className="text-3xl text-white" />
                  <h2 className="text-2xl font-bold text-white">Science</h2>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  {scienceTopics.map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {item.topic}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Important Notes */}
          <motion.div
            className="mt-10 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaBook className="text-purple-600" />
              Important Notes
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Test is based on the syllabus of current 8th grade</li>
              <li>
                • Questions test conceptual understanding and problem-solving
                skills
              </li>
              <li>• No negative marking in the scholarship test</li>
              <li>• Test duration: 3 hours (10:00 AM - 1:00 PM)</li>
              <li>• Arrive 30 minutes before test time for registration</li>
            </ul>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link
              to="/enrollnow"
              className="inline-block bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Register for Scholarship Test
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SyllabusClass8to9;
