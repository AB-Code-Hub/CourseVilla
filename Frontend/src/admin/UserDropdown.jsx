import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion
import toast from 'react-hot-toast';
const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userData, logout } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate

  // Animation variants for the dropdown
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="relative ml-3">
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <img
            className="h-8 w-8 rounded-full"
            src={
              userData?.user?.profilePic ||
              `https://ui-avatars.com/api/?name=${userData?.user?.firstName?.charAt(0)}${userData?.user?.lastName?.charAt(0)}&background=random`
            }
            alt="User profile"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">
            {userData?.user?.firstName}
          </span>
          <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-500" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <div className="py-1">
              <Link
                to="/admin/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Your Profile
              </Link>
              <Link
                to="/admin/adminsettings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </Link>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  logout();
                  navigate('/login');
                  toast.success('Log out successfully');
                }}
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDropdown;