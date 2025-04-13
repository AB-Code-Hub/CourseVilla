import {
  ChartBarIcon,
  UsersIcon,
  BookOpenIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import {  getAllUsers } from "../service/UserService";
import { getAllCourses } from "../service/CourseService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";
const recentActivities = [
  {
    id: 1,
    user: "John Doe",
    action: "completed",
    course: "React Fundamentals",
    time: "2h ago",
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "enrolled in",
    course: "Advanced JavaScript",
    time: "5h ago",
  },
  {
    id: 3,
    user: "Alex Johnson",
    action: "completed",
    course: "UI/UX Design",
    time: "1d ago",
  },
  {
    id: 4,
    user: "Sarah Williams",
    action: "started",
    course: "Node.js Backend",
    time: "2d ago",
  },
];

export default function AdminDashboard() {
  const [usersData, setUsersData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [usersResponse, coursesResponse] = await Promise.all([
          getAllUsers(),
          getAllCourses(),
        ]);

        if (usersResponse) {
          setUsersData(usersResponse);
        }

        console.log(usersResponse);
        

        if (coursesResponse?.data?.courseList) {
          setCoursesData(coursesResponse.data.courseList);
        }
      } catch (error) {
        toast.error("Failed to fetch dashboard data");
        console.error("Dashboard error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      id: 1,
      name: "Total Students",
      value: isLoading ? <LoadingSpinner /> : usersData?.length || 0,
      icon: UsersIcon,
      change: "+12%",
      changeType: "increase",
    },
    {
      id: 2,
      name: "Total Courses",
      value: isLoading ?  <LoadingSpinner /> : coursesData?.length || 0,
      icon: BookOpenIcon,
      change: "+5",
      changeType: "increase",
    },
 
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon
                    className="h-6 w-6 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>{" "}
                <span className="text-sm text-gray-500">since last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Activity 
          </h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {recentActivities.map((activity) => (
            <li key={activity.id} className="px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={`https://ui-avatars.com/api/?name=${activity.user.replace(
                      " ",
                      "+"
                    )}`}
                    alt=""
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.user} {activity.action} {activity.course}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {activity.time}
                  </p>
                </div>
                <div>
                  <button className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50">
                    View
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Quick Actions
          </h3>
        </div>
        <div className="px-6 py-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Link to='/admin/courses/new' className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Add New Course
          </Link>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Invite Instructor
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Generate Reports
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Manage Certificates
          </button>
        </div>
      </div>
    </div>
  );
}
