import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  CreditCardIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    darkMode: false,
    notifications: true,
    language: 'en',
    timezone: 'UTC',
    twoFactor: false
  });
  const [isSaving, setIsSaving] = useState(false);

  // Animation variants
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Settings saved successfully!', {
        position: 'top-right',
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
        }
      });
    } catch (error) {
      toast.error('Failed to save settings', {
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

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
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
                Admin Settings
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Configure your admin panel preferences and security settings
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
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
                    Save Settings
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            {/* Sidebar Navigation */}
            <motion.aside 
              variants={itemVariants}
              className="py-6 px-2 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0"
            >
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group rounded-md px-3 py-2 flex items-center text-sm font-medium w-full ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700'
                        : 'text-slate-900 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <tab.icon
                      className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 ${
                        activeTab === tab.id
                          ? 'text-blue-500 group-hover:text-blue-500'
                          : 'text-slate-400 group-hover:text-slate-500'
                      }`}
                    />
                    <span className="truncate">{tab.name}</span>
                  </motion.button>
                ))}
              </nav>
            </motion.aside>

            {/* Main Content */}
            <motion.div 
              variants={itemVariants}
              className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0"
            >
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-5 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-900 capitalize">
                    {activeTab} Settings
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* General Settings */}
                  {activeTab === 'general' && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="general"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        

                        <div>
                          <label htmlFor="language" className="block text-sm font-medium text-slate-700 mb-1">
                            Language
                          </label>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <select
                              id="language"
                              name="language"
                              value={formData.language}
                              onChange={handleChange}
                              className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            >
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                              <option value="de">German</option>
                            </select>
                          </motion.div>
                        </div>

                        <div>
                          <label htmlFor="timezone" className="block text-sm font-medium text-slate-700 mb-1">
                            Timezone
                          </label>
                          <motion.div whileHover={{ scale: 1.01 }}>
                            <select
                              id="timezone"
                              name="timezone"
                              value={formData.timezone}
                              onChange={handleChange}
                              className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            >
                              <option value="UTC">UTC</option>
                              <option value="EST">Eastern Time (EST)</option>
                              <option value="PST">Pacific Time (PST)</option>
                              <option value="CET">Central European Time (CET)</option>
                            </select>
                          </motion.div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}

                  {/* Security Settings */}
                  {activeTab === 'security' && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="security"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        <div className="flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="twoFactor"
                              name="twoFactor"
                              type="checkbox"
                              checked={formData.twoFactor}
                              onChange={handleChange}
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="twoFactor" className="font-medium text-slate-700">
                              Two-Factor Authentication
                            </label>
                            <p className="text-slate-500">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-slate-700 mb-2">
                            Active Sessions
                          </h3>
                          <div className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-slate-900">
                                  Chrome on Windows
                                </p>
                                <p className="text-sm text-slate-500">
                                  Last active: 2 hours ago
                                </p>
                              </div>
                              <button className="text-sm font-medium text-red-600 hover:text-red-500">
                                Revoke
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}

                  {/* Notification Settings */}
                  {activeTab === 'notifications' && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="notifications"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        <div className="flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="notifications"
                              name="notifications"
                              type="checkbox"
                              checked={formData.notifications}
                              onChange={handleChange}
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="notifications" className="font-medium text-slate-700">
                              Email Notifications
                            </label>
                            <p className="text-slate-500">
                              Receive email notifications for important updates
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-slate-700 mb-2">
                            Notification Preferences
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <div className="flex h-5 items-center">
                                <input
                                  id="newUsers"
                                  name="newUsers"
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="newUsers" className="font-medium text-slate-700">
                                  New User Registrations
                                </label>
                                <p className="text-slate-500">
                                  Get notified when new users sign up
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="flex h-5 items-center">
                                <input
                                  id="systemAlerts"
                                  name="systemAlerts"
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="systemAlerts" className="font-medium text-slate-700">
                                  System Alerts
                                </label>
                                <p className="text-slate-500">
                                  Receive critical system notifications
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}

                  {/* Billing Settings */}
                  {activeTab === 'billing' && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="billing"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        <div className="rounded-md bg-blue-50 p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <CreditCardIcon className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-blue-800">
                                Premium Plan
                              </h3>
                              <div className="mt-2 text-sm text-blue-700">
                                <p>
                                  Your next billing date is January 15, 2024
                                </p>
                              </div>
                              <div className="mt-4">
                                <button
                                  type="button"
                                  className="rounded-md bg-blue-50 px-2 py-1.5 text-sm font-medium text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-blue-50"
                                >
                                  Update payment method
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-slate-700 mb-2">
                            Billing History
                          </h3>
                          <div className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="text-sm font-medium text-slate-900">
                                  December 2023
                                </p>
                                <p className="text-sm text-slate-500">
                                  Paid on Dec 15, 2023
                                </p>
                              </div>
                              <p className="text-sm font-medium text-slate-900">
                                $49.00
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-slate-900">
                                  November 2023
                                </p>
                                <p className="text-sm text-slate-500">
                                  Paid on Nov 15, 2023
                                </p>
                              </div>
                              <p className="text-sm font-medium text-slate-900">
                                $49.00
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdminSettings;