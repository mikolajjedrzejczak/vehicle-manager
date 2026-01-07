import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

const ProtectedRoute = () => {
  const isAuth = useAuthStore((state) => state.isAuth());
  
  if (isAuth) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
