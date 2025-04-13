import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  PencilSquareIcon,
  ClockIcon,
  CurrencyDollarIcon,
  TagIcon,
  BookOpenIcon,
  TrophyIcon,
  StarIcon,
  UsersIcon,
  ChartBarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getCourseByCourseId } from '../../service/CourseService';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await getCourseByCourseId(id);
        setCourse(response);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load course');
        toast.error(err.response?.data?.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!course) return null;

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
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto"
    >
      {/* Header with back button */}
      <motion.div variants={itemVariants} className="mb-8">
        <button 
          onClick={() => navigate('/admin/courses')}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to courses
        </button>
      </motion.div>

      {/* Course Header */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{course.title}</h1>
          <div className="flex items-center mt-3 space-x-4">
            {course.isFeatured && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md">
                <StarIcon className="h-4 w-4 mr-1" />
                Featured Course
              </span>
            )}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-slate-700 border border-slate-200">
              {course.category}
            </span>
          </div>
        </div>
        
        <Link
          to={`/admin/courses/${id}/edit`}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          <PencilSquareIcon className="h-5 w-5 mr-2" />
          Edit Course
        </Link>
      </motion.div>

      {/* Course Thumbnail */}
      {course.thumbnail && (
        <motion.div variants={itemVariants} className="mb-8 rounded-xl overflow-hidden shadow-lg">
          <img 
            src={course.thumbnail} 
            alt={`${course.title} thumbnail`} 
            className="w-full h-72 object-cover object-center transition-transform duration-500 hover:scale-105"
          />
        </motion.div>
      )}

      {/* Course Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3">
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Price</p>
              <p className="text-lg font-semibold text-gray-900">
                {course.price ? `$${course.price}` : 'Free'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600 mr-3">
              <ClockIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="text-lg font-semibold text-gray-900">
                {course.duration ? `${course.duration} hours` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-100 text-green-600 mr-3">
              <UserIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Instructer</p>
              <p className="text-lg font-semibold capitalize text-gray-900">{course.userId?.firstName}</p>
            </div>
          </div>
        </div>
        
       
      </motion.div>

      {/* Course Details */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <BookOpenIcon className="h-6 w-6 text-blue-500 mr-2" />
              Course Description
            </h2>
            <div className="prose prose-blue max-w-none text-gray-700">
              {course.description || 'No description provided'}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <TrophyIcon className="h-6 w-6 text-purple-500 mr-2" />
              What You'll Learn
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Master key concepts in {course.topic || 'this field'}</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Hands-on projects and exercises</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Professional certification</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Lifetime access to materials</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Course Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Instructor</h3>
                <div className="flex items-center mt-1">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-blue-600 text-lg capitalize font-medium">
                      {course.userId?.firstName?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {course.userId?.firstName || 'Anonymous'} {course.userId?.lastName}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="mt-1 text-sm text-gray-900">{course.category || 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Topic</h3>
                <p className="mt-1 text-sm text-gray-900">{course.topic || 'General'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Created</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(course.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

         
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CourseDetail;