import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  EnvelopeIcon,
  PencilSquareIcon,
  CheckIcon,
  ShieldCheckIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { updateUserDetails } from '../../service/UserService';

const AdminProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { userData } = useAuth();
  const userDetails = userData?.user;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    role: '',
    lastLogin: new Date().toISOString()
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [hoveredField, setHoveredField] = useState(null);

  useEffect(() => {
    if (userDetails) {
      setFormData({
        name: `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim(),
        email: userDetails.email || '',
        role: userDetails.role || 'user',
        lastLogin: userDetails.updatedAt || new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${userDetails?.firstName?.charAt(0)}${userDetails?.lastName?.charAt(0)}&background=random` || userDetails.profilePic 
      });
      setLoading(false);
    }
  }, [userDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const [firstName, ...lastNameParts] = formData.name.split(' ');
      const lastName = lastNameParts.join(' ');

      const updateData = {
        firstName,
        lastName,
        email: formData.email,
      };

      const response = await updateUserDetails(userDetails._id, updateData);
      
      if (response?.status === 200) {
        toast.success('Profile updated successfully!', {
          position: 'top-right',
          duration: 3000,
          style: {
            background: 'linear-gradient(90deg, #10B981 0%, #3B82F6 100%)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(5px)'
          }
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile', {
        position: 'top-right',
        duration: 3000,
        style: {
          background: 'linear-gradient(90deg, #EF4444 0%, #F59E0B 100%)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(5px)'
        }
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Animation variants matching UserDetailsModal
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
    }
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
    }),
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const inputVariants = {
    rest: { scale: 1 },
    focus: { 
      scale: 1.02,
      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)"
    },
    hover: {
      scale: 1.01,
      boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.3)"
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <AnimatePresence>
        <motion.div 
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          {/* Header Section */}
          <motion.div 
            variants={itemVariants} 
            custom={0}
            className="mb-8"
          >
            <motion.button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeftIcon className="h-5 w-5 text-blue-500 group-hover:text-blue-400 mr-1" />
              Back to Dashboard
            </motion.button>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            custom={0.5}
            className="sm:flex sm:items-center mb-8"
          >
            <div className="sm:flex-auto">
              <h1 className="text-3xl font-bold text-gray-900">
                Your Profile
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage your personal information and account details
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              {isEditing ? (
                <div className="flex space-x-3">
                  <motion.button
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
                    whileHover={{ scale: isSaving ? 1 : 1.05 }}
                    whileTap={{ scale: isSaving ? 1 : 0.95 }}
                  >
                    {isSaving ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="-ml-1 mr-2 h-5 w-5" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PencilSquareIcon className="-ml-1 mr-2 h-5 w-5" />
                  Edit Profile
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Profile Content */}
          <motion.div 
            variants={modalVariants}
            className="rounded-2xl bg-gray-100 shadow-xl overflow-hidden"
          >
            {/* Header matching UserDetailsModal */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
              <h2 className="text-xl font-semibold leading-6 text-white">
                Personal Information
              </h2>
            </div>

            <div className="px-6 py-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar Section */}
                <motion.div 
                  className="flex-shrink-0"
                  variants={itemVariants}
                  custom={1}
                >
                  <div className="relative group">
                    <motion.div
                      className="h-32 w-32 rounded-full border-4 border-white shadow-md"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        className="h-full w-full rounded-full object-cover"
                        src={formData.avatar}
                        alt="Profile"
                      />
                    </motion.div>
                    {isEditing && (
                      <motion.div 
                        className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isEditing ? 0.3 : 0 }}
                        whileHover={{ opacity: 0.3 }}
                      >
                        <button className="text-white bg-blue-600 p-2 rounded-full shadow-md">
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                      </motion.div>
                    )}
                    <motion.span 
                      className={`absolute bottom-0 right-0 inline-flex items-center justify-center h-6 w-6 rounded-full border-2 border-white ${
                        formData?.role === "admin" ? "bg-green-500" : "bg-blue-500"
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="text-xs font-bold text-white">
                        {formData.role.charAt(0).toUpperCase()}
                      </span>
                    </motion.span>
                  </div>
                </motion.div>

                {/* Profile Details */}
                <div className="flex-1 space-y-6">
                  <motion.div
                    variants={itemVariants}
                    custom={1.5}
                    onHoverStart={() => setHoveredField('name')}
                    onHoverEnd={() => setHoveredField(null)}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <>
                        <motion.div 
                          variants={inputVariants}
                          initial="rest"
                          whileHover="hover"
                          whileFocus="focus"
                        >
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`block w-full rounded-lg bg-gray-50 border ${
                              errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            } shadow-sm sm:text-sm py-2 px-3`}
                            placeholder="Enter your full name"
                          />
                        </motion.div>
                        {errors.name && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1 text-sm text-red-600"
                          >
                            {errors.name}
                          </motion.p>
                        )}
                      </>
                    ) : (
                      <motion.p 
                        className="text-lg font-medium text-gray-900"
                        animate={{
                          color: hoveredField === 'name' ? '#3B82F6' : '#111827'
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {formData.name}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    custom={2}
                    onHoverStart={() => setHoveredField('email')}
                    onHoverEnd={() => setHoveredField(null)}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <>
                        <motion.div 
                          variants={inputVariants}
                          initial="rest"
                          whileHover="hover"
                          whileFocus="focus"
                        >
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`block w-full rounded-lg bg-gray-50 border ${
                              errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            } shadow-sm sm:text-sm py-2 px-3`}
                            placeholder="Enter your email"
                          />
                        </motion.div>
                        {errors.email && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1 text-sm text-red-600"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center">
                        <motion.div
                          animate={{
                            color: hoveredField === 'email' ? '#3B82F6' : '#6B7280'
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <EnvelopeIcon className="h-5 w-5 mr-2" />
                        </motion.div>
                        <motion.p 
                          className="text-lg text-gray-900"
                          animate={{
                            color: hoveredField === 'email' ? '#3B82F6' : '#111827'
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {formData.email}
                        </motion.p>
                      </div>
                    )}
                  </motion.div>

                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    variants={itemVariants}
                    custom={2.5}
                  >
                    <motion.div
                      variants={itemVariants}
                      custom={3}
                      onHoverStart={() => setHoveredField('role')}
                      onHoverEnd={() => setHoveredField(null)}
                      className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3">
                          <ShieldCheckIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Role</h4>
                          <motion.p 
                            className="mt-1 text-sm font-medium text-gray-900 capitalize"
                            animate={{
                              color: hoveredField === 'role' ? '#3B82F6' : '#111827'
                            }}
                          >
                            {formData.role.toLowerCase()}
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      custom={3.5}
                      onHoverStart={() => setHoveredField('lastLogin')}
                      onHoverEnd={() => setHoveredField(null)}
                      className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-purple-100 text-purple-600 mr-3">
                          <CalendarIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Last Login</h4>
                          <motion.p 
                            className="mt-1 text-sm font-medium text-gray-900"
                            animate={{
                              color: hoveredField === 'lastLogin' ? '#3B82F6' : '#111827'
                            }}
                          >
                            {formatDate(formData.lastLogin)}
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdminProfile;