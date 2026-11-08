import React from 'react';
import { Activity, Users, Calendar, Wallet, ShieldCheck } from 'lucide-react';

const TABS_CONFIG = [
  { id: 'overview', label: 'Platform Pulse', icon: Activity, getBadge: (m) => null },
  { id: 'users', label: 'Organizers & Accounts', icon: Users, getBadge: (m) => m.totalUsers },
  { id: 'events', label: 'Global Events Moderation', icon: Calendar, getBadge: (m) => m.totalEvents },
  {
    id: 'payouts',
    label: 'Treasury & Payouts',
    icon: Wallet,
    getBadge: (m) => (m.pendingPayoutsCount > 0 ? `${m.pendingPayoutsCount} Pending` : null),
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  },
  {
    id: 'security',
    label: 'Ed25519 Cryptographic Mesh',
    icon: ShieldCheck,
    getBadge: (m) => `${m.turnstileReplayBlocked} Intercepts`,
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  },
];

const AdminNavTabs = ({ activeTab, onSelectTab, metrics }) => {
  return (
    <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto select-none no-scrollbar">
      {TABS_CONFIG.map(({ id, label, icon: Icon, getBadge, badgeColor }) => {
        const isActive = activeTab === id;
        const badge = getBadge(metrics);
        return (
          <button
            key={id}
            onClick={() => onSelectTab(id)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
            <span>{label}</span>
            {badge && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isActive
                    ? 'bg-white/20 text-white border-white/30'
                    : badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default AdminNavTabs;

