import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Home from "./pages/Home";
import Logout from "./pages/Logout";
import About from "./pages/About";
import Course from "./pages/course";
import Contact from "./pages/Contact";
import Certificate from "./pages/certificate";


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <main className="pt-20 pb-10">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/logout" element={<Logout />} />
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/course" element={<Course />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/certificate" element={<Certificate />} />
              </Route>

              {/* 404 Page */}
              <Route 
            path="*" 
            element={
              <Navigate to={
                localStorage.getItem('token') ? '/' : '/login'
              } 
              />
            } 
          />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
