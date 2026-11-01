import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, GraduationCap, LogOut, UserRound } from 'lucide-react';
import { useAuth } from '../features/auth/context/AuthContext';

function AccountMenu() {
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const outside = (event) => { if (ref.current && !ref.current.contains(event.target)) setOpen(false); };
    const escape = (event) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  if (loading) return <span className="h-10 w-10 animate-pulse rounded-full bg-[#e8ece8]" aria-label="Loading account" />;
  if (!user) return (
    <div className="flex items-center gap-2">
      <Link to="/login" className="rounded-xl border border-[#dfe5df] px-4 py-2.5 text-sm font-semibold text-[#263b32] hover:bg-[#f5f7f4]">Login</Link>
      <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-[#203f35] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#163129]">Register <ArrowUpRight size={16} /></Link>
    </div>
  );

  const initial = (user.fullName || user.name || user.email || 'U').trim().charAt(0).toUpperCase();
  const destination = user.role === 'admin' ? '/admin' : '/profile';

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(value => !value)} aria-label="Open account menu" aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-[#dfe5df] bg-white p-1.5 pr-3 hover:border-[#203f35] focus:outline-none focus:ring-4 focus:ring-[#203f35]/10">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#203f35] text-sm font-bold text-white">{initial}</span>
        <ChevronDown size={16} className={`text-[#53645b] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="absolute right-0 top-full z-[100] mt-3 w-60 overflow-hidden rounded-2xl border border-[#e3e7e1] bg-white py-2 shadow-xl">
        <div className="border-b border-[#edf0eb] px-4 py-3">
          <p className="truncate text-sm font-semibold text-[#203f35]">{user.fullName || user.name || 'Account'}</p>
          <p className="truncate text-xs text-[#77827a]">{user.email}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#8c3b30]">{user.role === 'admin' ? 'Administrator' : 'Alumni member'}</p>
        </div>
        <Link to={destination} onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#34483e] hover:bg-[#f4f6f2]">
          <UserRound size={17} /> {user.role === 'admin' ? 'Admin dashboard' : 'My profile'}
        </Link>
        <button type="button" onClick={() => { setOpen(false); signOut(); navigate('/login', { replace: true }); }}
          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50">
          <LogOut size={17} /> Logout
        </button>
      </div>}
    </div>
  );
}

export default function PublicLayout() {
  const location = useLocation();
  const authPage = ['/login', '/register', '/auth/admin/login'].includes(location.pathname);
  return <div className="flex min-h-screen flex-col bg-white">
    {!authPage && <header className="sticky top-0 z-50 border-b border-[#e8ece7] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#203f35] text-white"><GraduationCap size={25} /></span>
          <span><span className="block font-serif text-xl font-bold tracking-tight text-[#203f35]">Alumni Connect</span><span className="block text-[10px] font-semibold uppercase tracking-[.2em] text-[#8b958c]">Stay Connected</span></span>
        </Link>
        <AccountMenu />
      </div>
    </header>}
    <main className="flex-1"><Outlet /></main>
    {!authPage && <footer className="border-t border-[#e8ece7] bg-white px-5 py-6 text-center text-xs text-[#77827a]">
      © {new Date().getFullYear()} Alumni Connect. Building connections. Celebrating achievements.
    </footer>}
  </div>;
}
