import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  QrCode, ArrowRight, Sun, Moon, Menu, X,
  Compass, HelpCircle, CreditCard, Sparkles, ChevronRight,
  LogIn, LogOut, LayoutDashboard
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { path: '/', label: 'Home', icon: null },
  { path: '/explore', label: 'Explore Events', badge: 'Live', icon: Compass },
  { path: '/how-it-works', label: 'How It Works', icon: HelpCircle },
  { path: '/pricing', label: 'Pricing', icon: CreditCard },
  { path: '/faqs', label: 'FAQs', icon: HelpCircle },
];

const LandingNavbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll for sticky backdrop blur elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when screen is resized to desktop (lg+)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <>
      {/* ─── Sleek Ambient Announcement Bar ─── */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0e1322] to-slate-950 text-slate-300 text-xs border-b border-indigo-500/15 py-2 px-3 sm:px-4 backdrop-blur-md relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 text-center flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold tracking-wide uppercase font-mono">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            Dual Engine v2.5
          </span>
          <span className="text-slate-300 text-[11px] sm:text-xs">
            Sell public tickets or design custom WhatsApp JPEG invites with zero gate fraud.
          </span>
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold text-[11px] sm:text-xs transition-colors group/link ml-0.5"
          >
            <span className="underline underline-offset-4 decoration-indigo-400/50 group-hover/link:decoration-indigo-300">
              See how it works
            </span>
            <ArrowRight size={11} className="group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ─── Ultra-Refined Modern Sticky Navbar ─── */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'backdrop-blur-2xl bg-white/85 dark:bg-[#080a10]/85 border-b border-slate-200/80 dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-2 sm:py-2.5'
            : 'backdrop-blur-xl bg-white/80 dark:bg-[#080a10]/80 border-b border-slate-200/60 dark:border-white/[0.06] py-2.5 sm:py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-[0_2px_10px_rgba(99,102,241,0.35)] ring-1 ring-white/20 group-hover:scale-105 group-hover:shadow-[0_4px_16px_rgba(99,102,241,0.5)] transition-all duration-300">
              <QrCode size={18} strokeWidth={2.3} className="relative z-10 sm:scale-105" />
              <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-[16px] sm:text-[18px] tracking-tight text-slate-900 dark:text-white">
                  QR<span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">Invite</span>
                </span>
                <span className="hidden xs:inline-block text-[8.5px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-500/20 uppercase tracking-wider font-mono">
                  Pass & Gate
                </span>
              </div>
              <span className="hidden sm:block text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.18em] -mt-0.5">
                Event Access Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links — Floating Dock Pill */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-100/70 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.06] backdrop-blur-md">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white dark:bg-slate-800/90 text-indigo-600 dark:text-indigo-400 font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.06]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun size={15} className="text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
              ) : (
                <Moon size={15} className="text-slate-700 transition-transform duration-300 rotate-0 hover:-rotate-12" />
              )}
            </button>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="relative group overflow-hidden h-8.5 sm:h-9 px-3 sm:px-4 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-[0_2px_8px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_16px_rgba(99,102,241,0.45)] ring-1 ring-white/20 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <LayoutDashboard size={13} className="shrink-0 hidden xs:inline" />
                  <span>Host Dashboard</span>
                  <ArrowRight size={13} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <button
                  onClick={logout}
                  className="hidden md:inline-flex items-center justify-center w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl border border-slate-200/80 dark:border-white/[0.08] text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-colors"
                  title="Sign out"
                >
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                {/* Log In Link */}
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 h-8.5 sm:h-9 px-2.5 sm:px-3.5 rounded-xl border border-slate-200/90 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all duration-200 shadow-2xs"
                >
                  <LogIn size={13} className="hidden xs:inline" />
                  <span>Log In</span>
                </Link>

                {/* Sign Up Free Action */}
                <Link
                  to="/signup"
                  className="relative group overflow-hidden h-8.5 sm:h-9 px-3 sm:px-4 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-[0_2px_8px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_16px_rgba(99,102,241,0.45)] ring-1 ring-white/20 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <span>Sign Up</span>
                  <span className="hidden sm:inline">Free</span>
                  <ArrowRight size={13} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="lg:hidden w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-white/[0.04] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>

        </div>

        {/* ─── Mobile Dropdown Menu with Frosted Glass ─── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/80 dark:border-white/[0.08] bg-white/95 dark:bg-[#080a10]/95 backdrop-blur-2xl px-4 py-4 space-y-3 shadow-2xl transition-all animate-fade-down">
            
            {/* Nav Links Stack */}
            <div className="grid gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200/50 dark:border-indigo-500/20'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {IconComponent && <IconComponent size={14} className="text-slate-400 dark:text-slate-500" />}
                      <span>{link.label}</span>
                    </div>
                    {link.badge ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {link.badge}
                      </span>
                    ) : (
                      <ChevronRight size={14} className="text-slate-400 opacity-60" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth Actions */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-white/[0.08] flex flex-col gap-2">
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold shadow-md shadow-indigo-600/25"
                  >
                    <LayoutDashboard size={14} />
                    <span>Open Host Dashboard</span>
                    <ArrowRight size={13} />
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.04] text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors"
                  >
                    <LogIn size={13} />
                    <span>Log In</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold shadow-md shadow-indigo-600/25"
                  >
                    <span>Sign Up Free</span>
                  </Link>
                </div>
              )}
            </div>

          </div>
        )}
      </header>
    </>
  );
};

export default LandingNavbar;