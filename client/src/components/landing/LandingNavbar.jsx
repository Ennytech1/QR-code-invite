import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  QrCode, ArrowRight, Sun, Moon, Smartphone, Menu, X,
  Sparkles, ShieldCheck
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/explore', label: 'Explore Events', badge: 'Live' },
  { path: '/how-it-works', label: 'How It Works' },
  { path: '/gate-tech', label: 'Gate Scanner Tech' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/faqs', label: 'FAQs' },
];

const LandingNavbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* ─── Ultra-Sleek Ambient Announcement Bar ─── */}
      <div className="bg-slate-900/90 dark:bg-black/95 text-slate-300 text-[11px] font-medium py-2 px-4 border-b border-slate-800/80 backdrop-blur-md relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">
            <strong className="text-white font-semibold">Dual Engine v2.5:</strong> Sell public tickets or design custom WhatsApp JPEG invites with zero gate fraud.
          </span>
          <Link
            to="/how-it-works"
            className="hidden sm:inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 ml-1 transition-colors"
          >
            <span>See how it works</span>
            <ArrowRight size={11} />
          </Link>
        </div>
      </div>

      {/* ─── Modern Sticky Glass Navbar ─── */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-[#0a0c10]/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-all duration-300">
              <QrCode size={19} strokeWidth={2.3} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[17px] tracking-tight text-slate-900 dark:text-white">
                  QR<span className="text-indigo-600 dark:text-indigo-400">Invite</span>
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 uppercase tracking-wider">
                  Pass & Gate
                </span>
              </div>
              <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest -mt-0.5">
                Event Access Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-[13px] font-medium text-slate-600 dark:text-slate-300">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800/80 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                      : 'hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-2xs hover:border-slate-300 dark:hover:border-slate-700"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-700" />}
            </button>

            {/* Gate Scanner Terminal Link */}
            <Link
              to="/scanner"
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-300 dark:hover:border-slate-700 transition-all shadow-2xs"
            >
              <Smartphone size={13} className="text-indigo-500" />
              <span>Gate Terminal</span>
            </Link>

            {/* Primary Action Button: Host Dashboard */}
            <Link
              to="/dashboard"
              className="h-9 px-4 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <span>Host Dashboard</span>
              <ArrowRight size={13} strokeWidth={2.5} />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-1.5 shadow-xl animate-fade-in">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {link.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <Link
                to="/scanner"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 text-center rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Gate Terminal
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 text-center rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
              >
                Host Dashboard
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default LandingNavbar;
