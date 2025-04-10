import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./layout/AdminDashboard";
import AdminLayout from "./layout/AdminLayout";

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <main className="pt-20 pb-10">
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
                // Add these admin routes
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  {/* <Route path="users" element={<AdminUsers />} />
                  <Route path="courses" element={<AdminCourses />} />
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
      </Router>
    </AuthProvider>
  );
}

export default App;
