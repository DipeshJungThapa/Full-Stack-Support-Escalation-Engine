import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Ticket,
  Settings,
  LogOut,
  PlusCircle,
  Bell,
  Search,
  User,
  ShieldCheck,
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Ticket, label: 'My Tickets', path: '/tickets' },
    ...(user?.role === 'ADMIN' ? [{ icon: ShieldCheck, label: 'Admin Rules', path: '/dashboard?tab=RULES' }] : []),
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center gap-3 mb-8 group cursor-pointer">
            <div className="bg-primary-600 p-2 rounded-lg group-hover:bg-primary-700 transition-colors">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-primary-600 transition-colors">EscalatePro</h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide">Internal System</p>
            </div>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'bg-blue-50 text-primary-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center border border-slate-200">
              <User className="text-slate-400 w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.email?.split('@')[0]}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto animate-slide-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
