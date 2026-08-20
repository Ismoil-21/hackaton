import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@shared/context/AuthContext';
import { LoadingState } from './ui/States';

/**
 * <ProtectedRoute /> — login talab qiladi
 * <ProtectedRoute roles={['admin']} fallback="/forbidden" /> — rol talab qiladi
 */
export function ProtectedRoute({ roles, fallback = '/' }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) return <LoadingState label="Tekshirilmoqda..." />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={fallback} replace />;

  return <Outlet />;
}

/** Login bo'lganlarni /login va /register dan qaytaradi */
export function GuestRoute({ to = '/' }) {
  const { user, ready } = useAuth();
  if (!ready) return <LoadingState label="Tekshirilmoqda..." />;
  return user ? <Navigate to={to} replace /> : <Outlet />;
}
