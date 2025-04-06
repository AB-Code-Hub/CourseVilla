import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Courses = ({ courses = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Reset currentIndex when courses change
  useEffect(() => {
    setCurrentIndex(0);
  }, [courses]);

  // Auto-advance slides every 5 seconds if there are courses
  useEffect(() => {
    if (courses.length === 0) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, courses.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === courses.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? courses.length - 1 : prevIndex - 1
    );
  };

  // Touch handling for mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const difference = touchStart - touchEnd;
    if (difference > 5) nextSlide();
    if (difference < -5) prevSlide();
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (courses.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-gray-600">
          No courses available at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Featured Courses</h2>
      
      <div 
        className="relative overflow-hidden rounded-xl shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides container */}
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="w-full flex-shrink-0 relative"
            >
              <div className="md:flex bg-white">
                {/* Course Image */}
                <div className="md:w-1/2 h-64 md:h-auto relative">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Course Details */}
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full mb-2">
                    {course.category}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-lg font-semibold text-blue-600">
                      {course.price}
                    </span>
                    <Link 
                      to={`/course/${course.id}`}
                      className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows - Only show if there's more than one course */}
        {courses.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
              aria-label="Previous course"
            >
              <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
              aria-label="Next course"
            >
              <ChevronRightIcon className="h-6 w-6 text-gray-800" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {courses.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Course Grid (for smaller screens) */}
      <div className="mt-12 md:hidden grid grid-cols-1 gap-6 sm:grid-cols-2">
        {courses.slice(0, 4).map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-40 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-blue-600 font-semibold">
                  {course.price}
                </span>
                <Link 
                  to={`/course/${course.id}`}
                  className="text-blue-600 font-medium text-sm hover:text-blue-700"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;