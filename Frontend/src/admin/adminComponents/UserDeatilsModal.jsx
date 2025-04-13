import { XMarkIcon, EnvelopeIcon, PhoneIcon, UserCircleIcon, CalendarIcon, IdentificationIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getUserDetails } from "../../service/UserService";

const UserDetailsModal = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await getUserDetails(userId);
        if (response.status === 200) {
          setUser(response?.data?.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserDetails();
  }, [userId]);

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const modalVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    },
    exit: { y: 50, opacity: 0 }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  if (!userId) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-y-auto"
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {/* Overlay */}
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50"
          variants={backdropVariants}
          onClick={onClose}
        />

        {/* Modal container */}
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <motion.div
            className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl"
            variants={modalVariants}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 sm:flex sm:items-center sm:justify-between">
              <h3 className="text-xl font-semibold leading-6 text-white">
                User Details
              </h3>
              <button
                type="button"
                className="rounded-md bg-white/10 p-1 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                onClick={onClose}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="bg-white px-6 py-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <motion.div 
                    className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              ) : error ? (
                <motion.div 
                  className="rounded-xl bg-red-50 p-4"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error loading user details
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : user ? (
                <motion.div 
                  className="space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* User Profile Section */}
                  <motion.div 
                    className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl"
                    variants={itemVariants}
                    custom={0}
                  >
                    <motion.div 
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        className="h-20 w-20 rounded-full border-4 border-white shadow-md"
                        src={
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`
                        }
                        alt={user.firstName}
                      />
                      <motion.span 
                        className={`absolute bottom-0 right-0 inline-flex items-center justify-center h-6 w-6 rounded-full border-2 border-white ${
                          user?.role === "admin" ? "bg-green-500" : "bg-blue-500"
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <span className="text-xs font-bold text-white">
                          {user.role.charAt(0).toUpperCase()}
                        </span>
                      </motion.span>
                    </motion.div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {user.firstName} {user?.lastName}
                      </h2>
                      <p className="text-sm text-gray-600 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                        {user.email}
                      </p>
                      <motion.span
                        className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium mt-2 ${
                          user?.role === "admin"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        {user.role}
                      </motion.span>
                    </div>
                  </motion.div>

                  {/* Details Grid */}
                  <motion.div 
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                    variants={itemVariants}
                    custom={1}
                  >
                    <motion.div 
                      className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
                      variants={itemVariants}
                      custom={2}
                    >
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3">
                          <UserCircleIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Role</h4>
                          <p className="mt-1 text-sm font-medium text-gray-900 capitalize">
                            {user.role.toLowerCase()}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
                      variants={itemVariants}
                      custom={3}
                    >
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-purple-100 text-purple-600 mr-3">
                          <CalendarIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Last Updated</h4>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {new Date(user.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
                      variants={itemVariants}
                      custom={4}
                    >
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-green-100 text-green-600 mr-3">
                          <CalendarIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Account Created</h4>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
                      variants={itemVariants}
                      custom={5}
                    >
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600 mr-3">
                          <IdentificationIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">User ID</h4>
                          <p className="mt-1 text-sm font-medium text-gray-900 font-mono truncate">
                            {user?._id}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Additional Information */}
                  {user.bio && (
                    <motion.div 
                      className="bg-gray-50 p-4 rounded-xl border border-gray-100"
                      variants={itemVariants}
                      custom={6}
                    >
                      <h4 className="text-sm font-medium text-gray-700 mb-2">About</h4>
                      <p className="text-sm text-gray-700">{user.bio}</p>
                    </motion.div>
                  )}
                </motion.div>
              ) : null}
            </div>

            {/* Footer */}
            <motion.div 
              className="bg-gray-50 px-6 py-4 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <button
                type="button"
                className="inline-flex justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                onClick={onClose}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserDetailsModal;