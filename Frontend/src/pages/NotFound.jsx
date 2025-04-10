import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaceFrownIcon,  HomeIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  useEffect(() => {
    document.title = "CourseVilla";
    
  }, []);
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-xl shadow-2xl text-center transform transition-all duration-500 hover:scale-[1.02]">
        <div className="flex justify-center">
          <FaceFrownIcon className="h-16 w-16 text-indigo-500 animate-bounce" />
        </div>
        
        <h1 className="mt-6 text-5xl font-extrabold text-gray-900">
          404
        </h1>
        
        <p className="mt-4 text-xl text-gray-600">
          Oops! The page you're looking for doesn't exist.
        </p>
        
        {isAuthenticated ? (<>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-1 gap-4">
          <Link
            to="/"
            className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Go Home
          </Link>
        
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500">
            Still lost? Try these helpful links:
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <Link to="/courses" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
              Courses
            </Link>
           
            <Link to="/contact" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
              Contact
            </Link>
          </div>
        </div>
        </>
        ) : (
          <>
             <div className="mt-10 grid grid-cols-1 sm:grid-cols-1 gap-4">
          <Link
            to="/login"
            className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <UserIcon className="h-5 w-5 mr-2" />
            Go to Login
          </Link>
        
        </div>
          
          </>
        )}
      </div>
    </div>
  );
};

export default NotFound;