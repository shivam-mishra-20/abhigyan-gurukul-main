/* eslint-disable react/prop-types */

/* eslint-disable react/react-in-jsx-scope */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router";
import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";
// removed react-helmet-async dependency; using local SEO helper
import SEO from "./components/SEO";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingLeaderboardButton from "./components/FloatingLeaderboardButton";
import trackVisit from "./utils/trackVisit";

// Desktop Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Faculties from "./pages/Faculties";
import EnrollNow from "./pages/EnrollNow";
import AdminDashboard from "./pages/Admin";
import Login from "./pages/Login";
import StudentRegister from "./pages/StudentRegister";
import ProtectedStudentRoute from "./components/ProtectedStudentRoute";
import StudentDashboard from "./pages/StudentDashboard";
import DashboardAttendance from "./components/Page-Specific-Components/DashboardAttendance";

// Mobile Version of Home Page
import MobileHome from "./pages/MobileHome";
import StudentLogin from "./pages/StudentLogin";
import DashboardResult from "./components/Page-Specific-Components/DashboardResult";
import DashboardHome from "./pages/DashboardHome"; // ✅ use this one

// New Pages
import Admissions from "./pages/Admissions";
import Courses from "./pages/Courses";
import Events from "./pages/Events";
import TestManagement from "./pages/TestManagement";
import MarketingHub from "./pages/MarketingHub";

// Syllabus Pages
import SyllabusClass6to7 from "./pages/syllabus/SyllabusClass6to7";
import SyllabusClass7to8 from "./pages/syllabus/SyllabusClass7to8";
import SyllabusClass8to9 from "./pages/syllabus/SyllabusClass8to9";
import SyllabusClass9to10 from "./pages/syllabus/SyllabusClass9to10";
import SyllabusClass10to11 from "./pages/syllabus/SyllabusClass10to11";

// TrackingWrapper component to handle visit tracking on route changes
const TrackingWrapper = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Track page visit when route changes
    trackVisit();
  }, [location.pathname]);

  return <>{children}</>;
};

const AppContent = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const location = useLocation();
  const isMarketingHub = location.pathname === "/marketing-hub";

  return (
    <>
      {!isMarketingHub && <Navbar />}
      <Routes>
        {/* Render "MobileHome" instead of "Home" on mobile */}
        <Route path="/" element={isMobile ? <MobileHome /> : <Home />} />

        <Route path="/about" element={<About />} />
        <Route path="/faculties" element={<Faculties />} />
        <Route path="/enrollnow" element={<EnrollNow />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/adminlogin" element={<Login />} />
        {/* <Route path="/verysecretregister" element={<StudentRegister />} /> */}
        <Route path="/login" element={<StudentLogin />} />

        {/* New Routes */}
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/events" element={<Events />} />
        <Route path="/marketing-hub" element={<MarketingHub />} />

        {/* Syllabus Routes */}
        <Route path="/syllabus/class-6-to-7" element={<SyllabusClass6to7 />} />
        <Route path="/syllabus/class-7-to-8" element={<SyllabusClass7to8 />} />
        <Route path="/syllabus/class-8-to-9" element={<SyllabusClass8to9 />} />
        <Route
          path="/syllabus/class-9-to-10"
          element={<SyllabusClass9to10 />}
        />
        <Route
          path="/syllabus/class-10-to-11"
          element={<SyllabusClass10to11 />}
        />

        {/* Protected student route */}
        <Route
          path="/student-dashboard/*"
          element={
            <ProtectedStudentRoute roles={["student", "teacher", "admin"]}>
              <Routes>
                <Route path="/" element={<StudentDashboard />} />
                {/* Add Traffic dashboard as a nested route within student-dashboard */}
                <Route
                  path="/student-dashboard/test-management"
                  element={
                    ["admin", "teacher"].includes(
                      localStorage.getItem("userRole")
                    ) ? (
                      <TestManagement />
                    ) : (
                      <Navigate to="/student-dashboard" />
                    )
                  }
                />

                {/* Add other nested routes if needed */}
                <Route path="*" element={<StudentDashboard />} />
              </Routes>
            </ProtectedStudentRoute>
          }
        />
      </Routes>
      {!isMarketingHub && (
        <>
          <hr className="mt-30 mb-30 border-t-1 border-black opacity-[18%] my-4" />
          <Footer />
          <FloatingLeaderboardButton />
        </>
      )}
    </>
  );
};

function App() {
  return (
    <>
      <Router>
        <TrackingWrapper>
          <AppContent />
        </TrackingWrapper>
      </Router>
    </>
  );
}

export default App;
