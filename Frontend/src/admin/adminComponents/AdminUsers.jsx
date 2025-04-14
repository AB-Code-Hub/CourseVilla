import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  ArrowLeftIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import { getAllUsers } from "../../service/UserService";
import UserDetailsModal from "./UserDeatilsModal";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DelteUserModal";
import debounce from "lodash.debounce"; 

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [deleteState, setDeleteState] = useState({
    userId: null,
    userName: "",
  });

  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

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
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.5
      }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98
    }
  };

  const fetchUsers = useCallback(async (page, size, search) => {
    try {
      setLoading(true);
      const response = await getAllUsers(page, size, search);

      if (!response || !response.data) {
        toast.error("No users found");
        return;
      }

      const formattedUsers = response.data.map((user) => ({
        id: user?._id,
        name: `${user?.firstName} ${user?.lastName}`,
        email: user?.email,
        role: user?.role || "user",
        lastLogin: user.createdAt || new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}&background=random`,
      }));

      setUsers(formattedUsers);
      setTotalUsers(response.pagination.totalUsers);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      toast.error("Failed to fetch users", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#EF4444",
          color: "#fff",
        }
      });
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, fetchUsers]);

  // Handle search with debounce
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
      fetchUsers(1, pageSize, value);
    }, 500),
    [fetchUsers, pageSize]
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Sort users
  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Request sort
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewUser = (userId) => {
    setSelectedUserId(userId);
  };

  const handleEditUser = (userId) => {
    setEditingUserId(userId);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers(
      users.map((user) =>
        user.id === updatedUser.id
          ? {
              ...user,
              name: updatedUser.firstName,
              email: updatedUser.email,
              role: updatedUser.role || user.role,
              avatar: updatedUser.avatar || user.avatar,
            }
          : user
      )
    );
    setEditingUserId(null);
    toast.success("User updated successfully", {
      position: "top-right",
      duration: 3000,
      style: {
        background: "#10B981",
        color: "#fff",
      }
    });
  };

  const handleDeleteClick = (userId, userName) => {
    setDeleteState({ userId, userName });
  };

  const handleUserDelete = (deleteUserId) => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== deleteUserId)
    );
   
  };

  if (loading && !users.length) return <LoadingSpinner fullScreen />;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <AnimatePresence>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="sm:flex sm:items-center mb-8">
            <div className="sm:flex-auto">
            
              <h1 className="text-2xl font-extrabold text-slate-900">
                User Management
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                A list of all registered users including their details and permissions.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/admin/users/addUser"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <PlusIcon className="h-5 w-5 mr-1" />
                  Add user
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div variants={itemVariants} className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
              </div>
              <motion.div whileHover={{ scale: 1.01 }}>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="block w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  onChange={handleSearchChange}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Users Table */}
          <motion.div variants={itemVariants} className="mt-8 flow-root">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <motion.div 
                  whileHover={{ scale: 1.005 }}
                  className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg"
                >
                  <table className="min-w-full divide-y divide-slate-300">
                    <thead className="bg-slate-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6 cursor-pointer"
                          onClick={() => requestSort("name")}
                        >
                          <div className="flex items-center">
                            User
                            {sortConfig.key === "name" && (
                              <span className="ml-1">
                                {sortConfig.direction === "asc" ? "↑" : "↓"}
                              </span>
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 cursor-pointer"
                          onClick={() => requestSort("role")}
                        >
                          <div className="flex items-center">
                            Role
                            {sortConfig.key === "role" && (
                              <span className="ml-1">
                                {sortConfig.direction === "asc" ? "↑" : "↓"}
                              </span>
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 cursor-pointer"
                          onClick={() => requestSort("lastLogin")}
                        >
                          <div className="flex items-center">
                            Account Created
                            {sortConfig.key === "lastLogin" && (
                              <span className="ml-1">
                                {sortConfig.direction === "asc" ? "↑" : "↓"}
                              </span>
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {sortedUsers.length > 0 ? (
                        sortedUsers.map((user) => (
                          <motion.tr 
                            key={user.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ backgroundColor: "#f8fafc" }}
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={user.avatar}
                                    alt={user.name}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="font-medium text-slate-900">
                                    {user.name}
                                  </div>
                                  <div className="text-slate-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                  user.role === "admin"
                                    ? "bg-purple-100 text-purple-800"
                                    : user?.role === "user"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {user?.role}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                              {formatDate(user?.lastLogin)}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <div className="flex items-center space-x-2 justify-end sm:justify-center">
                                <motion.button
                                  type="button"
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => handleViewUser(user?.id)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <EyeIcon className="h-5 w-5" />
                                </motion.button>
                                <motion.button
                                  type="button"
                                  className="text-slate-600 hover:text-slate-900"
                                  onClick={() => handleEditUser(user?.id)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <PencilSquareIcon className="h-5 w-5" />
                                </motion.button>
                                <motion.button
                                  type="button"
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => handleDeleteClick(user?.id, user?.name)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <td
                            colSpan="5"
                            className="px-6 py-4 text-center text-sm text-slate-500"
                          >
                            No users found
                          </td>
                        </motion.tr>
                      )}
                    </tbody>
                  </table>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div 
              variants={itemVariants}
              className="mt-6 flex items-center justify-between"
            >
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-700">
                    Showing{" "}
                    <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * pageSize, totalUsers)}
                    </span>{" "}
                    of <span className="font-medium">{totalUsers}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <motion.button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                      whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <motion.button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === pageNumber
                              ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                              : "text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:outline-offset-0"
                          }`}
                          whileHover={{ scale: currentPage === pageNumber ? 1 : 1.05 }}
                          whileTap={{ scale: currentPage === pageNumber ? 1 : 0.95 }}
                        >
                          {pageNumber}
                        </motion.button>
                      );
                    })}

                    <motion.button
                      onClick={() =>
                        paginate(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                      whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l4.5-4.25a.75.75 0 01-1.06.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.button>
                  </nav>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modals */}
      <UserDetailsModal
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />

      <EditUserModal
        userId={editingUserId}
        onClose={() => setEditingUserId(null)}
        onUserUpdated={handleUserUpdated}
      />

      <DeleteUserModal
        userId={deleteState.userId}
        userName={deleteState.userName}
        onClose={() => setDeleteState({ userId: null, userName: "" })}
        onUserDeleted={handleUserDelete}
      />
    </div>
  );
};

export default AdminUsers;