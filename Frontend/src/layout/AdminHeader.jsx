import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import UserDropdown from './UserDropdown';

const AdminHeader = () => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Search Bar */}
          <div className="flex-1 flex items-center">
            <div className="w-full max-w-md">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search..."
                  type="search"
                />
              </div>
            </div>
          </div>
          
          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;