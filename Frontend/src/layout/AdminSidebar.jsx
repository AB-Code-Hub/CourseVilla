import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ChartBarIcon, 
  UsersIcon, 
  BookOpenIcon, 
  CogIcon, 
  DocumentTextIcon,
  AcademicCapIcon,
  ArrowLeftEndOnRectangleIcon
} from '@heroicons/react/24/outline';
// import logo from '../assets/logo-admin.svg';

const AdminSidebar = () => {
  const navigate = useNavigate();
  
  const navItems = [
    { name: 'Dashboard', icon: ChartBarIcon, path: '/admin' },
    { name: 'Users', icon: UsersIcon, path: '/admin/users' },
    { name: 'Courses', icon: BookOpenIcon, path: '/admin/courses' },
    { name: 'Certificates', icon: DocumentTextIcon, path: '/admin/certificates' },
    { name: 'Instructors', icon: AcademicCapIcon, path: '/admin/instructors' },
    { name: 'Settings', icon: CogIcon, path: '/admin/settings' }
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <img 
            src={""} 
            alt="Admin Logo" 
            className="h-8 w-auto"
            onClick={() => navigate('/admin')}
          />
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
          
          {/* Logout */}
          <button
            onClick={() => {
              // Add logout logic here
              navigate('/login');
            }}
            className="w-full group flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 mt-8"
          >
            <ArrowLeftEndOnRectangleIcon className="mr-3 h-5 w-5 flex-shrink-0" />
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;