import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../features/auth/context/AuthContext';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import HomePage from '../features/home/pages/HomePage';
import { RegisterPage, LoginPage, AdminLoginPage } from '../features/auth/pages/AuthPages';
import { ProfilePage, AdminDashboard } from '../features/portal/pages/PortalPages';
import '../styles.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

function AppRoutes() {
  return <Routes>
    <Route element={<PublicLayout/>}>
      <Route index element={<HomePage/>}/>
      <Route path="register" element={<RegisterPage/>}/>
      <Route path="login" element={<LoginPage/>}/>
      <Route path="auth/admin/login" element={<AdminLoginPage/>}/>
      <Route element={<ProtectedRoute role="alumni"/>}>
        <Route path="profile" element={<ProfilePage/>}/>
      </Route>
    </Route>
    <Route element={<ProtectedRoute role="admin"/>}>
      <Route element={<AdminLayout/>}>
        <Route path="admin" element={<AdminDashboard/>}/>
        <Route path="admin/*" element={<Navigate to="/admin" replace/>}/>
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}

export default function App() {
  return <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider><AppRoutes/></AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>;
}
