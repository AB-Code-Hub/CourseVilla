import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { deleteUser } from '../../service/UserService';

const DeleteUserModal = ({ userId, userName, onClose, onUserDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // API call with Axios
      const response = await deleteUser(userId);

      console.log(response);
      
      
      if (response.status === 200) {
        toast.success(`User "${userName}" deleted successfully`);
        onUserDeleted(userId); // Notify parent component
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

  if (!userId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          {/* Header */}
          <div className="bg-white px-4 py-3 sm:flex sm:items-start sm:justify-between border-b border-gray-200">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-medium leading-6 text-gray-900">Confirm Deletion</h3>
            </div>
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
              disabled={isDeleting}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Content */}
          <div className="bg-white px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete <span className="font-semibold text-gray-900">{userName}</span>?
                </p>
                <p className="mt-2 text-sm text-red-600">
                  This action cannot be undone. All associated data will be permanently removed.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:gap-4 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
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
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;