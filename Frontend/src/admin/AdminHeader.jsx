import { BellIcon, MagnifyingGlassIcon, Bars3Icon } from '@heroicons/react/24/outline';
import UserDropdown from './UserDropdown';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AdminHeader = ({ toggleSidebar }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Sample notifications - in a real app, these would come from an API
  useEffect(() => {
    // Simulating notifications from backend
    const sampleNotifications = [
      { id: 1, message: 'New user registered', time: '5m ago', read: false },
      { id: 2, message: 'New course added', time: '10m ago', read: false },
      { id: 3, message: 'System update', time: '1h ago', read: true },
    ];
    setNotifications(sampleNotifications);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // You can implement actual search logic here
    if (e.key === 'Enter' && query.trim()) {
      toast.success(`Searching for: ${query}`);
      // Implement your search logic here
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    toast.success('All notifications marked as read');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-sm z-10 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Mobile menu button and logo */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={toggleSidebar}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="block h-6 w-6" />
            </button>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 items-center max-w-md">
            <div className="w-full">
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
                  value={searchQuery}
                  onChange={handleSearch}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                />
              </div>
            </div>
          </div>

          {/* Search Bar - Mobile (only appears when clicked) */}
          {searchOpen && (
            <div className="absolute inset-x-0 top-16 bg-white px-4 py-2 shadow-md md:hidden z-20">
              <div className="relative">
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search..."
                  type="search"
                  value={searchQuery}
                  onChange={handleSearch}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                  autoFocus
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-4 ml-auto">
            <button 
              className="p-1 relative rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <span className="sr-only">Search</span>
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {/* Notification Button */}
            <div className="relative">
              <button 
                className="p-1 relative rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"/>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;