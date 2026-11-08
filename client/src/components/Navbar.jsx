import React, { useState, useRef, useEffect } from 'react';
import {
  Bell, Menu, X, Search, Moon, Sun, Command
} from 'lucide-react';
import Notification, { INITIAL_NOTIFICATIONS } from './Notification';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const notifRef = useRef(null);

  const unread = notifications.filter((n) => !n.read).length;

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
    <header className="sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-2.5 bg-white/85 dark:bg-[#0c0e14]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">

        {/* Left: Mobile Toggle & Search Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Quick Search Bar */}
          <div className="flex items-center gap-2 h-9 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guests, events, or token..."
              className="bg-transparent border-none outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 w-44 sm:w-64 text-xs font-medium"
            />
            <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-slate-400 font-mono bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300/60 dark:border-slate-700">
              <Command size={10} />K
            </kbd>
          </div>
        </div>

        {/* Right: Theme Toggle & Notifications */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun size={15} className="text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
            ) : (
              <Moon size={15} className="text-slate-700 transition-transform duration-300 rotate-0 hover:-rotate-12" />
            )}
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
