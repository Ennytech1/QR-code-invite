import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  QrCode,
  Wallet,
  Settings,
  Headphones,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
  Zap,
  Globe,
  Sparkles,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Events Manager', icon: Calendar, path: '/events', badge: 'Active' },
  { name: 'Guest Roster & Invites', icon: Users, path: '/guests' },
  { name: 'Gate Scanner Terminal', icon: QrCode, path: '/scanner' },
  { name: 'Gate Telemetry', icon: Activity, path: '/gates', badge: 'Live' },
  { name: 'Wallet & Payouts', icon: Wallet, path: '/wallet' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = user?.name || 'Chief Kelechi Okafor';
  const displayRole = user?.organization || 'Verified Host • Level 3';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className="w-[240px] shrink-0 hidden md:flex flex-col sticky top-0 h-screen z-30 bg-white dark:bg-[#0c0e14] border-r border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200 select-none">
      
      {/* ─── Brand Identity Header ─── */}
      <div className="px-5 py-5 border-b border-slate-100 dark:border-slate-800/80">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-all">
            <QrCode size={19} strokeWidth={2.3} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[16px] tracking-tight text-slate-900 dark:text-white">
                QR<span className="text-indigo-600 dark:text-indigo-400">Invite</span>
              </span>
              <span className="text-[8px] font-bold px-1.5 py-0.2 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                PRO
              </span>
            </div>
            <span className="text-[9px] block font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest -mt-0.5">
              Organizer Suite
            </span>
          </div>
        </NavLink>
      </div>

      {/* ─── Navigation Links ─── */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Management
        </div>

        {NAV_ITEMS.map(({ name, icon: Icon, path, badge }) => {
          const isActive =
            location.pathname === path ||
            (path !== '/' && location.pathname.startsWith(path)) ||
            (path === '/gates' && location.pathname.startsWith('/live'));
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  size={16}
                  strokeWidth={isActive ? 2.3 : 1.8}
                  className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}
                />
                <span>{name}</span>
              </div>
              {badge && !isActive && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {badge}
                </span>
              )}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
            </NavLink>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Public Portal
        </div>
        <NavLink
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all"
        >
          <Globe size={15} className="text-slate-400" />
          <span>Public Website</span>
        </NavLink>
      </nav>

      {/* ─── Bottom User Profile / Security Badge ─── */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{displayName}</div>
            <div className="text-[10px] text-slate-400 truncate">{displayRole}</div>
          </div>
        </div>

        <div className="flex items-center justify-between px-1 text-[11px] text-slate-500 dark:text-slate-400">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 text-xs font-medium hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            {isDark ? <Sun size={13} className="text-amber-400" /> : <Moon size={13} />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
