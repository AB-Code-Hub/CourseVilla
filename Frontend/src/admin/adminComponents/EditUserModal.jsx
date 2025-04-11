import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getUserDetails, updateUserDetails } from "../../service/UserService";

const EditUserModal = ({ userId, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch user data when modal opens
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const responsedata = await getUserDetails(userId);
            
        const response = responsedata?.data?.data
        

        if (responsedata.status === 200) {
            setFormData({
                firstName: response?.firstName,
                lastName: response?.lastName,
                email: response?.email,
                role: response?.role,
              });
        }

      
      } catch (err) {
        toast.error(err.message);
        onClose();
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserData();
  }, [userId, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.firstName && formData.firstName.trim().length < 3) {
      newErrors.firstName = "First name must be at least 3 characters";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.password && formData.password.trim().length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await updateUserDetails(userId, formData);
      if (response) {
        onUserUpdated({ id: userId, ...formData });
        onClose();
      }
    } catch (error) {
      toast.error(error.message || "Error updating user");
    } finally {
      setSaving(false);
    }
  };

  if (!userId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          {/* Header */}
          <div className="bg-white px-4 py-3 sm:flex sm:items-start sm:justify-between border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Edit User
            </h3>
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 py-5 sm:p-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      first Name 
                    </label>
                   
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData?.firstName}
                      
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        errors.name ? "border-red-300" : "border-gray-300"
                      } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Name 
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        errors.name ? "border-red-300" : "border-gray-300"
                      } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email 
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="admin">Administrator</option>
                      <option value="user">User</option>
                    </select>
                  </div>

                  {/* Status Selection */}
                </div>
              )}
            </div>

            {/* Footer with action buttons */}
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckIcon className="-ml-1 mr-2 h-5 w-5" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
