import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Home from "./pages/Home";
import About from "./pages/About";
import Course from "./pages/course";
import Contact from "./pages/Contact";
import Certificate from "./pages/certificate";
import { Toaster } from "react-hot-toast";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLayout from "./admin/AdminLayout";
import AdminUsers from "./admin/adminComponents/AdminUsers";
import AddUser from "./admin/adminComponents/AddUser";
import UserDetailsModal from "./admin/adminComponents/UserDeatilsModal";
import AddCourse from "./admin/pages/AddCourse";
import Courses from "./admin/pages/Courses";
import CourseDetail from "./admin/pages/CourseDetail";
import EditCourse from "./admin/pages/EditCourse";

// Wrapper component to conditionally render Navbar
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  

  return (
    <div className="min-h-screen bg-slate-50">
      {!isAdminRoute && <Navbar />}
      <main className={!isAdminRoute ? "pt-20 pb-10" : ""}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes (for all authenticated users) */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/course" element={<Course />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/certificate" element={<Certificate />} />
          </Route>

          {/* Admin-only Route */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/addUser" element={ <AddUser />} />
              <Route path="courses" element={ <Courses />} />
              <Route path="courses/new" element={<AddCourse />} />
              <Route path="courses/:id" element={<CourseDetail />} />
              <Route path="courses/:id/edit" element={<EditCourse />} />
              {/* <Route path="users/userdetails" element={ <UserDetailsModal />} /> */}
              {/* <Route path="courses" element={<AdminCourses />} />
              <Route path="certificates" element={<AdminCertificates />} />
              <Route path="instructors" element={<AdminInstructors />} />
              <Route path="settings" element={<AdminSettings />} /> */}
            </Route>
          </Route>

          {/* 404 Handling */}
          <Route path="/notfound" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
