import React, { useState, useRef, useEffect } from 'react';
import {
  Bell, Plus, QrCode, Menu, X, Search, Moon, Sun,
  Command, Sparkles, CheckCircle2, ChevronDown
} from 'lucide-react';
import Notification, { INITIAL_NOTIFICATIONS } from './Notification';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard Overview',
  '/events': 'Events Manager',
  '/guests': 'Guest Roster & Pass Dispatch',
  '/scanner': 'Gate Access Terminal',
  '/wallet': 'Revenue & Settlements',
  '/settings': 'Account & Gateway Settings',
};

const Navbar = ({ onOpenNewEvent, onOpenScanner }) => {
  const { isDark, toggleTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const notifRef = useRef(null);
  const location = useLocation();

  const unread = notifications.filter((n) => !n.read).length;
  const title = PAGE_TITLES[location.pathname] || 'Organizer Workspace';

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-3 bg-white/85 dark:bg-[#0c0e14]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">

        {/* Left: Breadcrumb / Title & Gate Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 hidden sm:block">
              Host Workspace
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{title}</span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Gate Mesh
              </span>
            </h1>
          </div>
        </div>

        {/* Right: Actions & Tools */}
        <div className="flex items-center gap-2.5">

          {/* Quick Search Bar */}
          <div className="hidden lg:flex items-center gap-2 h-9 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guests, events, or token..."
              className="bg-transparent border-none outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 w-48 text-xs font-medium"
            />
            <kbd className="flex items-center gap-0.5 text-[10px] text-slate-400 font-mono bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300/60 dark:border-slate-700">
              <Command size={10} />K
            </kbd>
          </div>

          {/* Gate Scanner Launch */}
          <button
            onClick={onOpenScanner}
            className="h-9 px-3.5 flex items-center gap-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-indigo-600 dark:hover:text-white transition-all cursor-pointer shadow-2xs"
            title="Open Gate Scanner Terminal"
          >
            <QrCode size={14} strokeWidth={2.3} className="text-indigo-500" />
            <span className="hidden sm:inline">Gate Scanner</span>
          </button>

          {/* Create New Event Action */}
          <button
            onClick={onOpenNewEvent}
            className="h-9 px-4 flex items-center gap-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/25 transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Create Event</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer relative shadow-2xs"
              title="Notifications"
            >
              <Bell size={16} />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-11 z-50 w-80">
                <Notification
                  notifications={notifications}
                  onClose={() => setNotifOpen(false)}
                />
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;
