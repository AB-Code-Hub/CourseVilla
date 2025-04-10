import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const PrivateRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, userRole } = useAuth();

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/notfound" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;