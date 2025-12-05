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

const SyllabusClass6to7 = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const mathTopics = [
    {
      topic: "Decimals",
      description: "Understanding decimal numbers, operations, and conversions",
    },
    {
      topic: "Fractions",
      description: "Types of fractions, operations, and applications",
    },
    {
      topic: "Algebra",
      description: "Basic algebraic expressions and equations",
    },
    { topic: "Mensuration", description: "Perimeter and area of basic shapes" },
    {
      topic: "Ratio and Proportion",
      description: "Understanding ratios and solving proportion problems",
    },
  ];

  const scienceTopics = [
    {
      topic: "Diversity in Living World",
      description: "Classification and characteristics of living organisms",
    },
    {
      topic: "Materials Around Us",
      description: "Types of materials and their properties",
    },
    {
      topic: "Temperature and Its Measurement",
      description: "Understanding temperature scales and measurement",
    },
    {
      topic: "Measurement of Length and Motion",
      description: "Units of measurement and types of motion",
    },
    {
      topic: "Mindful Eating: A Path to Healthy Body",
      description: "Nutrition and healthy eating habits",
    },
    {
      topic: "A Journey Through States of Water",
      description: "Water cycle and states of matter",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <SEO
        title="Class 6th to 7th Syllabus | Scholarship Test | Abhigyan Gurukul"
        metas={[
          {
            name: "description",
            content:
              "Complete syllabus for Class 6th to 7th scholarship test at Abhigyan Gurukul. Covers Mathematics and Science topics from current 6th grade curriculum.",
          },
          {
            name: "keywords",
            content:
              "class 6 syllabus, 7th grade admission test, scholarship test syllabus, abhigyan gurukul syllabus",
          },
        ]}
      />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 text-white py-16 px-4 md:px-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <Link
            to="/admissions"
            className="inline-flex items-center text-cyan-100 hover:text-white mb-6 transition-colors"
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
                6th → 7th Grade
              </h1>
              <p className="text-cyan-100 text-lg mt-1">
                Scholarship Test Syllabus 2026
              </p>
            </div>
          </motion.div>

          <motion.p
            className="text-lg text-cyan-100 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Based on Current 6th Grade Curriculum • Test Duration: 3 Hours
          </motion.p>
        </div>
      </motion.section>

      {/* Content Section */}
      <section className="py-12 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mathematics */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-cyan-100 overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-6">
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
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-cyan-50 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <span className="bg-cyan-100 text-cyan-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
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
            className="mt-10 bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500 p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaBook className="text-cyan-600" />
              Important Notes
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Test is based on the syllabus of current 6th grade</li>
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
              className="inline-block bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Register for Scholarship Test
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SyllabusClass6to7;
