import { Link, Outlet, useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../features/auth/context/AuthContext';

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const initial = (user?.fullName || user?.email || 'A').trim().charAt(0).toUpperCase();
  return <div className="min-h-screen bg-[#f5f3eb]">
    <header className="sticky top-0 z-50 border-b border-[#dedfd5] bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 sm:px-7">
        <Link to="/admin" className="flex items-center gap-3 font-serif text-lg font-bold text-[#203f35]">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#203f35] text-white"><GraduationCap size={23}/></span>
          <span>Alumni Connect <span className="ml-1 hidden text-xs font-medium text-[#8c3b30] sm:inline">ADMIN</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-right sm:block"><span className="block text-sm font-semibold text-[#263b32]">{user?.fullName || 'Administrator'}</span><span className="block text-xs text-[#7b857d]">Administrator</span></span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#203f35] text-sm font-bold text-white">{initial}</span>
          <button type="button" onClick={() => { signOut(); navigate('/auth/admin/login', { replace: true }); }}
            className="inline-flex items-center gap-2 rounded-lg border border-[#e5e5e5] px-3 py-2 text-sm font-semibold text-[#8c3b30] hover:bg-[#fff7f5]">
            <LogOut size={16}/><span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
    <main><Outlet /></main>
  </div>;
}
