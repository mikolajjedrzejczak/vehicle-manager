import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

const PublicRoute = () => {
  const isAuth = useAuthStore((state) => state.isAuth());

  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
