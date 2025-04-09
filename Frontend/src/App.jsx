import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
              <Route path="/notfound" element={<NotFound />} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/course" element={<Course />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/certificate" element={<Certificate />} />
                 <Route  path='/admin' element={<Admin />}/>
              </Route>

              {/* 404 Page */}
              <Route 
            path="*" 
            element={
              <Navigate to={
                localStorage.getItem  ('token') ? '/notfound' : '/notfound'
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
