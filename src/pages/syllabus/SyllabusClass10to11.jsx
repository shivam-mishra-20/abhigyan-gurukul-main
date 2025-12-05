/* eslint-disable react/react-in-jsx-scope */
import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaArrowLeft,
  FaBook,
  FaCalculator,
  FaFlask,
  FaLeaf,
} from "react-icons/fa";
import { Link } from "react-router";
import SEO from "../../components/SEO";

const SyllabusClass10to11 = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <SEO
        title="Class 10th to 11th Syllabus | Scholarship Test | Abhigyan Gurukul"
        metas={[
          {
            name: "description",
            content:
              "Complete syllabus for Class 10th to 11th scholarship test at Abhigyan Gurukul. Covers full Mathematics (Standard/Basic) and Science (Physics, Chemistry, Biology) from 10th grade curriculum.",
          },
          {
            name: "keywords",
            content:
              "class 10 syllabus, 11th grade admission test, scholarship test syllabus, abhigyan gurukul syllabus, science stream, commerce stream",
          },
        ]}
      />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-700 text-white py-16 px-4 md:px-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <Link
            to="/admissions"
            className="inline-flex items-center text-green-100 hover:text-white mb-6 transition-colors"
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
                10th → 11th Grade
              </h1>
              <p className="text-green-100 text-lg mt-1">
                Scholarship Test Syllabus 2026
              </p>
            </div>
          </motion.div>

          <motion.p
            className="text-lg text-green-100 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Based on Current 10th Grade Curriculum • Test Duration: 3 Hours
          </motion.p>

          <motion.div
            className="mt-4 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bg-yellow-400 text-green-800 px-4 py-2 rounded-full text-sm font-bold">
              Science Stream Available
            </span>
            <span className="bg-blue-400 text-white px-4 py-2 rounded-full text-sm font-bold">
              Commerce Stream Available
            </span>
          </motion.div>
        </div>
      </motion.section>

      {/* Content Section */}
      <section className="py-12 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Stream Selection Info */}
          <motion.div
            className="mb-10 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Stream Selection
            </h3>
            <p className="text-gray-700">
              Students appearing for 10th → 11th admission can choose between{" "}
              <strong>Science</strong> or <strong>Commerce</strong> streams. The
              test syllabus varies based on the chosen stream:
            </p>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-green-200">
                <h4 className="font-bold text-green-700 mb-2">
                  🔬 Science Stream
                </h4>
                <p className="text-sm text-gray-600">
                  Maths (Standard) + Physics + Chemistry
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-700 mb-2">
                  📊 Commerce/Bio Stream
                </h4>
                <p className="text-sm text-gray-600">
                  Maths (Basic) + Physics + Chemistry + Biology
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mathematics - Science Stream */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                <div className="flex items-center gap-3">
                  <FaCalculator className="text-3xl text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Mathematics
                    </h2>
                    <p className="text-green-100 text-sm">
                      Science Stream - Standard
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="font-bold text-green-700 mb-2">
                    Full Syllabus Coverage
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Complete 10th grade Mathematics (Standard) syllabus
                    including:
                  </p>
                  <ul className="mt-3 space-y-2 text-gray-600 text-sm">
                    <li>• Real Numbers & Polynomials</li>
                    <li>• Pair of Linear Equations</li>
                    <li>• Quadratic Equations</li>
                    <li>• Arithmetic Progressions</li>
                    <li>• Coordinate Geometry</li>
                    <li>• Triangles & Circles</li>
                    <li>• Trigonometry & Applications</li>
                    <li>• Surface Areas & Volumes</li>
                    <li>• Statistics & Probability</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Mathematics - Bio/Commerce Stream */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <div className="flex items-center gap-3">
                  <FaCalculator className="text-3xl text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Mathematics
                    </h2>
                    <p className="text-blue-100 text-sm">
                      Bio/Commerce Stream - Basic
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-bold text-blue-700 mb-2">
                    Full Syllabus Coverage
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Complete 10th grade Mathematics (Basic) syllabus including:
                  </p>
                  <ul className="mt-3 space-y-2 text-gray-600 text-sm">
                    <li>• Real Numbers</li>
                    <li>• Polynomials</li>
                    <li>• Linear Equations in Two Variables</li>
                    <li>• Quadratic Equations</li>
                    <li>• Arithmetic Progressions</li>
                    <li>• Basic Trigonometry</li>
                    <li>• Statistics</li>
                    <li>• Basic Geometry</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Science - Physics & Chemistry */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
                <div className="flex items-center gap-3">
                  <FaFlask className="text-3xl text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Science</h2>
                    <p className="text-purple-100 text-sm">
                      Physics + Chemistry
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <h4 className="font-bold text-purple-700 mb-2">
                      Physics Topics
                    </h4>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>• Light - Reflection & Refraction</li>
                      <li>• Human Eye & Colourful World</li>
                      <li>• Electricity & Magnetic Effects</li>
                      <li>• Sources of Energy</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl">
                    <h4 className="font-bold text-orange-700 mb-2">
                      Chemistry Topics
                    </h4>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>• Chemical Reactions & Equations</li>
                      <li>• Acids, Bases & Salts</li>
                      <li>• Metals & Non-metals</li>
                      <li>• Carbon Compounds</li>
                      <li>• Periodic Classification</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Biology - For Bio Stream */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-teal-100 overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6">
                <div className="flex items-center gap-3">
                  <FaLeaf className="text-3xl text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Biology</h2>
                    <p className="text-teal-100 text-sm">For Bio Stream Only</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-teal-50 p-4 rounded-xl">
                  <h4 className="font-bold text-teal-700 mb-2">
                    Full Syllabus Coverage
                  </h4>
                  <p className="text-gray-700 text-sm mb-3">
                    Complete 10th grade Biology syllabus:
                  </p>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Life Processes</li>
                    <li>• Control & Coordination</li>
                    <li>• How Do Organisms Reproduce</li>
                    <li>• Heredity & Evolution</li>
                    <li>• Our Environment</li>
                    <li>• Management of Natural Resources</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Important Notes */}
          <motion.div
            className="mt-10 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaBook className="text-green-600" />
              Important Notes
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Test is based on the complete syllabus of 10th grade</li>
              <li>
                • Choose your stream (Science/Commerce) during registration
              </li>
              <li>• Science stream: Maths (Std) + Physics + Chemistry</li>
              <li>
                • Bio/Commerce stream: Maths (Basic) + Physics + Chemistry +
                Biology
              </li>
              <li>• No negative marking in the scholarship test</li>
              <li>• Test duration: 3 hours (10:00 AM - 1:00 PM)</li>
              <li>• Limited seats available: 30 Science + 30 Commerce</li>
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
              className="inline-block bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Register for Scholarship Test
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SyllabusClass10to11;
