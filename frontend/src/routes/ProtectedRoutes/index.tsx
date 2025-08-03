import { Outlet, Navigate } from 'react-router-dom';
import { LOGIN_PATH } from '../../constant';
import { useUserStore } from '../../store';

const ProtectedRoutes = () => {
  const { isLoggedIn } = useUserStore();
  if (!isLoggedIn) {
    return <Navigate to={LOGIN_PATH()} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
