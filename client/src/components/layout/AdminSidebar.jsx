import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  Activity,
  Users,
  Calendar,
  Ticket,
  Radio,
  Wallet,
  ShieldCheck,
  Server,
  LogOut,
  Moon,
  Sun,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Layers
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const ADMIN_NAV_SECTIONS = [
  {
    title: 'Platform Oversight',
    items: [
      { id: 'overview', name: 'Command Center', icon: Activity, badge: 'Live' },
      { id: 'users', name: 'All Users & Organizers', icon: Users, badge: '142' },
      { id: 'events', name: 'Global Events Registry', icon: Calendar, badge: '26' },
      { id: 'tickets', name: 'All Passes & Tickets', icon: Ticket, badge: '3.4k' },
    ]
  },
  {
    title: 'Gate Hardware & Fleet',
    items: [
      { id: 'gates', name: 'Turnstiles & Terminals', icon: Radio, badge: '14 Online', badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
      { id: 'security', name: 'Anti-Fraud & Ed25519', icon: ShieldCheck, badge: '47 Intercepts', badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
    ]
  },
  {
    title: 'Finance & Treasury',
    items: [
      { id: 'payouts', name: 'Treasury & NIP Payouts', icon: Wallet, badge: '2 Pending', badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
    ]
  },
  {
    title: 'Infrastructure',
    items: [
      { id: 'system', name: 'System & API Health', icon: Server, badge: '99.98%' },
    ]
  }
];

const AdminSidebar = ({ activeSection, onSelectSection }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-[260px] shrink-0 hidden md:flex flex-col sticky top-0 h-screen z-30 bg-slate-900 text-slate-100 border-r border-slate-800 shadow-xl select-none">
      
      {/* ─── Super Admin Brand Header ─── */}
      <div className="px-5 py-5 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <ShieldAlert size={22} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[15px] tracking-tight text-white">
                QR<span className="text-amber-400">Invite</span>
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                ROOT
              </span>
            </div>
            <span className="text-[9px] block font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Super Admin Console
            </span>
          </div>
        </div>
      </div>

      {/* ─── Navigation Sections ─── */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto no-scrollbar">
        {ADMIN_NAV_SECTIONS.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {section.title}
            </div>

            {section.items.map(({ id, name, icon: Icon, badge, badgeColor }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => onSelectSection(id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold shadow-md shadow-indigo-600/30 scale-[1.01]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      size={16}
                      strokeWidth={isActive ? 2.4 : 1.8}
                      className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}
                    />
                    <span>{name}</span>
                  </div>
                  {badge && (
                    <span
                      className={`text-[9px] font-bold px-2 py-0.2 rounded-full border ${
                        isActive
                          ? 'bg-white/20 text-white border-white/30'
                          : badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ─── Return to Organizer Suite / Quick Switch ─── */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-2">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all text-xs font-semibold cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <ArrowLeft size={14} className="text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Organizer Portal</span>
          </div>
          <span className="text-[10px] text-slate-400">Exit Admin</span>
        </button>

        {/* User Badge & Actions */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">Platform Super Admin</div>
            <div className="text-[10px] text-amber-400/90 truncate font-mono">root@qrinvite.internal</div>
          </div>
        </div>

        <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            {isDark ? <Sun size={13} className="text-amber-400" /> : <Moon size={13} />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-1 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

    </aside>
  );
};

export default AdminSidebar;

