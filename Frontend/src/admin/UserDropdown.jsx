import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userData } = useAuth()

  return (
    <div className="relative ml-3">
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <img
            className="h-8 w-8 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User profile"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">{userData?.user?.firstName}</span>
          <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-500" />
        </button>
      </div>
      
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Your Profile
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Settings
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;