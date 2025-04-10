import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ArrowLeftEndOnRectangleIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { navItems } from "./adminComponents/constants";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { userData } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        toggleSidebar();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile menu button */}
      <div className={`md:hidden fixed ${isOpen ? 'left-52' : 'left-4'} top-4 z-40 transition-all duration-200`}>
        <button
          onClick={toggleSidebar}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <span className="sr-only">Open sidebar</span>
          {isOpen ? (
            <XMarkIcon className="block h-6 w-6" />
          ) : (
            <Bars3Icon className="block h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative inset-y-0 left-0 z-30 w-64 transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 flex flex-col flex-shrink-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b gap-4 border-gray-200">
          <img
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjU2M2ViIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDJhMTAgMTAgMCAxIDAgMTAgMTAgNCA0IDAgMCAxLTUtMSA1LjUgNS41IDAgMCAwLS42LTMuNCA1LjUgNS41IDAgMCAwLS45NS0xLjEgNS41IDUuNSA0IDAgMCAtMS4xLS45NSA1LjUgNS41IDQgMCAwIDAtMy40LS42IDQgNCAwIDAgMS0xLTV6Ii8+PC9zdmc+"
            alt={`${userData?.user?.firstName}`}
            className="h-8 cursor-pointer w-auto"
            onClick={() => {
              navigate("/admin");
              if (isMobile) toggleSidebar();
            }}
          />
          <h3 className="text-xl font-bold text-slate-800">CourseVilla</h3>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => isMobile && toggleSidebar()}
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
              navigate("/login");
              toggleSidebar();
            }}
            className="w-full group flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 mt-8"
          >
            <ArrowLeftEndOnRectangleIcon className="mr-3 h-5 w-5 flex-shrink-0" />
            Logout
          </button>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default AdminSidebar;