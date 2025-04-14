import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilSquareIcon,
  CheckIcon
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
            background: '#10B981',
            color: '#fff',
          }
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile', {
        position: 'top-right',
        duration: 3000,
        style: {
          background: '#EF4444',
          color: '#fff',
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.5
      }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
      <AnimatePresence>
        <motion.div 
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              Back to Dashboard
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="sm:flex sm:items-center mb-8">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-extrabold text-slate-900">
                Your Profile
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage your personal information and account details
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              {isEditing ? (
                <div className="flex space-x-3">
                  <motion.button
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
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
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
          <motion.div variants={itemVariants} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-900">
                Personal Information
              </h2>
            </div>

            <div className="px-6 py-5">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar Section */}
                <div className="flex-shrink-0">
                  <div className="relative group">
                    <img
                      className="h-32 w-32 rounded-full object-cover"
                      src={formData.avatar}
                      alt="Profile"
                    />
                    {isEditing && (
                      <motion.div 
                        className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isEditing ? 0.3 : 0 }}
                        whileHover={{ opacity: 0.3 }}
                      >
                        <button className="text-white bg-blue-600 bg-opacity-80 p-2 rounded-full">
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Profile Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <>
                        <motion.div whileHover={{ scale: 1.01 }}>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`block w-full rounded-md border ${
                              errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                            } shadow-sm sm:text-sm py-2 px-3`}
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
                      <p className="text-slate-900">{formData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <>
                        <motion.div whileHover={{ scale: 1.01 }}>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`block w-full rounded-md border ${
                              errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                            } shadow-sm sm:text-sm py-2 px-3`}
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
                        <EnvelopeIcon className="h-5 w-5 text-slate-400 mr-2" />
                        <p className="text-slate-900">{formData.email}</p>
                      </div>
                    )}
                  </div>

                

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Role
                      </label>
                      <div className="flex items-center">
                        <UserIcon className="h-5 w-5 text-slate-400 mr-2" />
                        <p className="text-slate-900 capitalize">{formData.role.toLowerCase()}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Last Login
                      </label>
                      <p className="text-slate-900">{formatDate(formData.lastLogin)}</p>
                    </div>
                  </div>
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