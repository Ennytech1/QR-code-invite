import React, { useState } from 'react';
import {
  Search, Command, Moon, Sun, ShieldCheck, Radio, Server,
  Sparkles, Bell, ArrowLeft, RefreshCw
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = ({ onSearchChange, searchTerm, onSync, refreshing }) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Left: Global Omni-Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="flex items-center gap-2.5 h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-400 text-xs focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/15 transition-all w-full">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Omni-Search: Search users, events, passes, gates, or bank payouts..."
              className="bg-transparent border-none outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 w-full text-xs font-medium"
            />
            <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-slate-400 font-mono bg-slate-200/60 dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-300/60 dark:border-slate-600 shrink-0">
              <Command size={10} />K
            </kbd>
          </div>
        </div>

        {/* Right: Environment, Turnstiles Live Status, Actions */}
        <div className="flex items-center gap-3">
          
          {/* Cluster Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>CLUSTER: AF-WEST-1</span>
          </div>

          {/* Turnstile Mesh Live Counter */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold">
            <Radio size={13} className="animate-pulse" />
            <span>14 Gates Streaming</span>
          </div>

          {/* Sync Trigger */}
          <button
            onClick={onSync}
            disabled={refreshing}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
            title="Synchronize Platform Ledger"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin text-indigo-500' : ''} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
            title="Toggle theme"
          >
            {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
          </button>

          {/* Return to Organizer Suite Link */}
          <button
            onClick={() => navigate('/dashboard')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <ArrowLeft size={13} />
            <span>Organizer Portal</span>
          </button>

        </div>

      </div>
    </header>
  );
};

export default AdminNavbar;

