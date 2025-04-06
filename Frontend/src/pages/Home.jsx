import { useEffect, useState } from "react";
import Courses from "../components/Courses";
import { getAllCourses } from "../service/UserService";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAllCourses();
        if (response.success) {
          setCourses(response.data.courseList || []);
        } else {
          setError(response.message || 'Failed to fetch courses');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading courses...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  // Transform course data to match the expected format for the Courses component
  const formattedCourses = courses.map(course => ({
    id: course._id,
    title: course.name,
    description: course.description || 'No description available',
    image: course.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    price: course.price ? `${course.price}` : 'Free',
    category: course.category || 'Development'
  }));

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-700 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Start Learning Today</h1>
        <p className="text-xl md:text-2xl mb-8">Browse our collection of professional courses</p>
        <button className="px-8 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-gray-100 transition-colors">
          Explore All Courses
        </button>
      </div>

      {/* Featured Courses Slider */}
      <Courses courses={formattedCourses} />

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Course Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Development', 'Design', 'Business', 'Marketing'].map((category) => (
            <div 
              key={category} 
              className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 text-2xl">📚</span>
              </div>
              <h3 className="font-bold text-lg">{category}</h3>
              <button className="mt-3 text-blue-600 text-sm font-medium">
                View Courses
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;