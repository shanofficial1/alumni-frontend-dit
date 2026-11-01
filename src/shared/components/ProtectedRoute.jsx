import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';

export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="grid min-h-screen place-items-center bg-[#f5f3eb]"><div className="text-center"><span className="mx-auto mb-3 block h-9 w-9 animate-spin rounded-full border-2 border-[#dedfd5] border-t-[#203f35]"/><p className="text-sm text-[#687169]">Checking your session…</p></div></div>;
  if (!user) return <Navigate to={role === 'admin' ? '/auth/admin/login' : '/login'} state={{ from: location }} replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/profile'} replace />;
  return <Outlet />;
}
