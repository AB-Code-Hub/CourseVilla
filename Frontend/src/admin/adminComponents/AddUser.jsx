import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { userRoles } from "./constants.js"; // Define your roles
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { addUser  } from "../../service/UserService.jsx";

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      newErrors.password = "password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password is must be at least 6 character long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Replace with your actual API call
      const response = await addUser(formData);

      console.log(response);

      toast.success("User added successfully!", {
        icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
      });

      // Redirect after success
      navigate("/admin/users");
    } catch (error) {
      toast.error(error.message || "Failed to add user");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) return <LoadingSpinner fullScreen />;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          to="/admin/users"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to users
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Add New User</h2>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the details below to create a new user account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-slate-700"
              >
                First name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.firstName ? "border-red-300" : "border-slate-300"
                } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-slate-700"
              >
                Last name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.email ? "border-red-300" : "border-slate-300"
              } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              set password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.email ? "border-red-300" : "border-slate-300"
              } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-slate-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              {userRoles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Options */}
        

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="rounded-md border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
