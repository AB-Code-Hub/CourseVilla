import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 py-3'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img
                className="mx-auto h-12 w-auto"
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjU2M2ViIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDJhMTAgMTAgMCAxIDAgMTAgMTAgNCA0IDAgMCAxLTUtMSA1LjUgNS41IDAgMCAwLS42LTMuNCA1LjUgNS41IDAgMCAwLS45NS0xLjEgNS41IDUuNSA0IDAgMCAwLTEuMS0uOTUgNS41IDUuNSA0IDAgMCAwLTMuNC0uNiA0IDQgMCAwIDEtMS01eiIvPjwvc3ZnPg=="
                alt="Company Logo"
              />
              <span className="ml-2 text-xl font-bold text-slate-800">CourseVilla</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 text-sm font-medium ${location.pathname === '/' ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600'}`}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className={`px-3 py-2 text-sm font-medium ${location.pathname === '/about' ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600'}`}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className={`px-3 py-2 text-sm font-medium ${location.pathname === '/contact' ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600'}`}
                >
                  Contact
                </Link>

                <Link
                  to="/course"
                  className={`px-3 py-2 text-sm font-medium ${location.pathname === '/course' ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600'}`}
                >
                  Course
                </Link>

                <Link
                  to="/certificate"
                  className={`px-3 py-2 text-sm font-medium ${location.pathname === '/certificate' ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600'}`}
                >
                  Certificate
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-blue-600 hover:bg-slate-100 focus:outline-none transition-colors"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          {isAuthenticated ? (
            <>
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'}`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/about' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'}`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/contact' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'}`}
              >
                Contact
              </Link>

              <Link
                  to="/course"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/course' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'}`}
                >
                  Course
                </Link>

                <Link
                  to="/certificate"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/certificate' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'}`}
                >
                  Certificate
                </Link>

              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="pt-2 space-y-2 border-t border-slate-200">
              <Link
                to="/login"
                className="block w-full px-4 py-2 text-center text-base font-medium text-blue-600 hover:text-blue-700"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block w-full px-4 py-2 text-center text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;