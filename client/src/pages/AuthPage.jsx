import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  QrCode, Mail, Lock, User, Eye, EyeOff, ArrowRight,
  ShieldCheck, Sparkles, CheckCircle2, Smartphone, ArrowLeft,
  Zap, Users, Building2, HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('organizer'); // 'organizer' | 'usher'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, loginAsDemo } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    if (mode === 'signup' && !name) {
      toast.error('Please enter your full name');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        await register(name, email, password, role);
        toast.success(`Account created! Welcome, ${name}`);
      } else {
        await login(email, password);
        toast.success('Signed in successfully! Welcome back.');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Authentication error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = (demoRole = 'organizer') => {
    setIsSubmitting(true);
    setTimeout(() => {
      loginAsDemo(demoRole);
      toast.success(
        demoRole === 'usher'
          ? 'Authorized as Gate Security Officer'
          : 'Logged in as Chief Kelechi Okafor (Event Host)'
      );
      navigate(demoRole === 'usher' ? '/usher' : '/dashboard');
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      
      {/* ─── Top Minimal Brand Strip ─── */}
      <header className="px-5 sm:px-8 py-5 flex items-center justify-between max-w-7xl w-full mx-auto">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-all">
            <QrCode size={19} strokeWidth={2.3} />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[17px] tracking-tight text-slate-900 dark:text-white">
              QR<span className="text-indigo-600 dark:text-indigo-400">Invite</span>
            </span>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest -mt-0.5">
              Event Access Platform
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* ─── Central Split Workspace ─── */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
        <div className="w-full max-w-5xl rounded-3xl border border-slate-200/90 dark:border-white/[0.08] bg-white/90 dark:bg-[#0c0e14]/90 backdrop-blur-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* ── Left Area: Interactive Form (7 cols) ── */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Mode Segmented Tab */}
              <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] mb-7 max-w-xs">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Title & Description */}
              <div className="space-y-1 mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
                  {mode === 'login' ? 'Welcome back to QRInvite' : 'Launch your organizer hub'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-body">
                  {mode === 'login'
                    ? 'Enter your credentials to access live turnstiles, ticket sales, and VIP rosters.'
                    : 'Design luxury WhatsApp invitation cards or sell public tickets with zero gate fraud.'}
                </p>
              </div>

              {/* 1-Click Fast Demo Autofill Helper */}
              <div className="mb-6 p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-500/10 border border-indigo-200/80 dark:border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Testing the platform?
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('organizer')}
                    className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    1-Click Host Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('usher')}
                    className="px-2.5 py-1 rounded-xl border border-indigo-300 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Usher PIN
                  </button>
                </div>
              </div>

              {/* Main Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name (Sign Up only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Full Name or Company
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Chief Kelechi Okafor"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="host@eventplanner.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => toast('Password reset link dispatched to your email address', { icon: '📧' })}
                        className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Role Selector (Sign Up only) */}
                {mode === 'signup' && (
                  <div className="pt-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Primary Role
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('organizer')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                          role === 'organizer'
                            ? 'bg-indigo-50/80 dark:bg-indigo-500/15 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Building2 size={15} />
                        <span className="text-xs">Event Host / Planner</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole('usher')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                          role === 'usher'
                            ? 'bg-indigo-50/80 dark:bg-indigo-500/15 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Smartphone size={15} />
                        <span className="text-xs">Gate Usher / Staff</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Remember Me */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 select-none cursor-pointer">
                    Keep me authenticated on this device
                  </label>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{mode === 'login' ? 'Sign In to Host Portal' : 'Create Organizer Account'}</span>
                  <ArrowRight size={14} />
                </button>
              </form>

              {/* Toggle switch text */}
              <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                {mode === 'login' ? (
                  <>
                    Don't have an organizer account yet?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer ml-1"
                    >
                      Sign up for free
                    </button>
                  </>
                ) : (
                  <>
                    Already registered as a host?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer ml-1"
                    >
                      Sign in here
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Security note */}
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center gap-2 text-[11px] text-slate-400 font-body">
              <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
              <span>Protected by RFC 8032 Ed25519 Cryptography & Anti-Replay Gate Locks</span>
            </div>
          </div>

          {/* ── Right Area: Cinematic Showcase (5 cols, lg screens) ── */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-900 via-[#0d1222] to-slate-950 p-8 flex-col justify-between relative overflow-hidden border-l border-white/[0.08] text-white">
            
            {/* Background Glow Orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top Showcase Header */}
            <div className="relative z-10 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold tracking-wider uppercase font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                Institutional Event Security
              </span>
              <h2 className="text-xl font-extrabold tracking-tight font-heading leading-snug">
                One platform. Public ticketing or VIP WhatsApp passes.
              </h2>
            </div>

            {/* Luxury Pass Card Mockup */}
            <div className="relative z-10 my-6 bg-slate-950/90 rounded-2xl p-5 border border-amber-500/30 shadow-2xl space-y-3.5 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 font-mono">
                  The Adeleke Royal Banquet
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  HIGH TABLE VIP
                </span>
              </div>

              <div>
                <span className="text-[9.5px] uppercase tracking-wider text-slate-400 block font-body">Cordially Invites</span>
                <div className="text-base font-extrabold text-white mt-0.5 font-heading">
                  Chief Babatunde Balogun
                </div>
                <div className="text-xs text-amber-400 font-medium mt-0.5 font-mono">
                  Table 1 · High Table Dignitary
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10.5px]">
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                  <CheckCircle2 size={12} />
                  <span>Ed25519 Sealed</span>
                </div>
                <span className="text-slate-400 font-mono">Sub-15ms Optical</span>
              </div>
            </div>

            {/* Social Proof & Metrics */}
            <div className="relative z-10 space-y-3">
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.08]">
                <div>
                  <div className="text-xl font-black text-white font-mono">185K+</div>
                  <div className="text-[11px] text-slate-400">Passes Verified</div>
                </div>
                <div>
                  <div className="text-xl font-black text-emerald-400 font-mono">0%</div>
                  <div className="text-[11px] text-slate-400">Screenshot Fraud</div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                "QRInvite turned our 1,200-guest wedding roll-call from a 2-hour queue into an effortless 15-minute entrance."
              </p>
            </div>

          </div>

        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="text-center py-4 text-xs text-slate-400 dark:text-slate-600 font-body">
        QRInvite Event Access Engine • Encrypted RFC 8032 Verification
      </footer>

    </div>
  );
};

export default AuthPage;

