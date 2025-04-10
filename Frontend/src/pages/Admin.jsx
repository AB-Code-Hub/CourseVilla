import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Admin = () => {
  const { userRole, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4">Welcome, Admin!</p>
        <p>Your role: <span className="font-semibold">{userRole}</span></p>
        {/* Add admin-specific content here */}
      </div>
    </div>
  );
};

export default Admin;