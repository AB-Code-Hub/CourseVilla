import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAllUsers } from '../../service/UserService';
import Modal from '../adminComponents/Modal';

const Certificates = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

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
    }
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers();
        
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load users', {
          position: 'top-right',
          duration: 3000,
          style: {
            background: '#EF4444',
            color: '#fff',
          }
        });
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = Array.isArray(users) ? users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  

  const handleGenerateCertificate = (user) => {
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  const confirmGenerateCertificate = () => {
    navigate(`/admin/certificates/generate/${selectedUser._id}`);
    setShowConfirmModal(false);
  };

  if (loading) return <LoadingSpinner fullScreen />;

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
          <motion.div variants={itemVariants} className="sm:flex sm:items-center mb-8">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-extrabold text-slate-900">
                Users
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Select a user to generate a certificate
              </p>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div variants={itemVariants} className="mt-6">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="block w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Users List */}
          <motion.div variants={itemVariants} className="mt-8 bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-900">
                All Users
              </h2>
            </div>

            <ul className="divide-y divide-slate-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <motion.li 
                    key={user._id}
                    variants={itemVariants}
                    whileHover={{ backgroundColor: '#f8fafc' }}
                    className="px-6 py-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`}
                            alt={`${user.firstName} ${user.lastName}`}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-slate-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => handleGenerateCertificate(user)}
                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5" />
                        Generate Certificate
                      </motion.button>
                    </div>
                  </motion.li>
                ))
              ) : (
                <motion.li 
                  variants={itemVariants}
                  className="px-6 py-4 text-center text-sm text-slate-500"
                >
                  No users found
                </motion.li>
              )}
            </ul>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Generate Certificate"
      >
        <div className="mt-4">
          <p className="text-sm text-slate-500">
            Are you sure you want to generate a certificate for {selectedUser?.firstName} {selectedUser?.lastName}?
          </p>
        </div>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
          <motion.button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
            onClick={confirmGenerateCertificate}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Generate
          </motion.button>
          <motion.button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:col-start-1 sm:mt-0"
            onClick={() => setShowConfirmModal(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
        </div>
      </Modal>
    </div>
  );
};

export default Certificates;