import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { deleteUser } from '../../service/UserService';

const DeleteUserModal = ({ userId, userName, onClose, onUserDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteUser(userId);
      
      if (response.status === 200) {
        toast.success(`User "${userName}" deleted successfully`);
        onUserDeleted(userId);
        onClose();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        `Failed to delete user "${userName}"`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      y: -20,
      opacity: 0,
      scale: 0.95
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    },
    exit: {
      y: 20,
      opacity: 0,
      scale: 0.95
    }
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
            className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            variants={modalVariants}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-white mr-2" />
                <h3 className="text-lg font-semibold text-white">Confirm Deletion</h3>
              </div>
              <button
                type="button"
                className="rounded-md bg-white/10 p-1 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                onClick={onClose}
                disabled={isDeleting}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="bg-white px-6 py-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg font-medium text-gray-900">
                    Delete "{userName}"?
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this user? This action cannot be undone. All user data will be permanently removed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse sm:justify-start sm:px-6 gap-3">
              <motion.button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                whileHover={!isDeleting ? { scale: 1.03 } : {}}
                whileTap={!isDeleting ? { scale: 0.98 } : {}}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : 'Delete'}
              </motion.button>
              <motion.button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
                whileHover={!isDeleting ? { scale: 1.03 } : {}}
                whileTap={!isDeleting ? { scale: 0.98 } : {}}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeleteUserModal;