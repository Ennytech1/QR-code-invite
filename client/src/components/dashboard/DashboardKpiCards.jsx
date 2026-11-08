import React, { useEffect, useState } from 'react';
import { TrendingUp, Ticket, Zap, ArrowUpRight, Banknote } from 'lucide-react';

/* Animated counter hook for smooth number transitions */
const useCountUp = (target, duration = 800) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target <= 0) { setCount(0); return; }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

const KpiCard = ({ label, value, subtitle, icon: Icon, color, action, delay = 0 }) => {
  const colorMap = {
    indigo:  { bg: 'bg-indigo-50 dark:bg-indigo-500/8', text: 'text-indigo-600 dark:text-indigo-400', ring: 'ring-indigo-100 dark:ring-indigo-500/15' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/8', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-100 dark:ring-emerald-500/15' },
    cyan:    { bg: 'bg-cyan-50 dark:bg-cyan-500/8', text: 'text-cyan-600 dark:text-cyan-400', ring: 'ring-cyan-100 dark:ring-cyan-500/15' },
    violet:  { bg: 'bg-violet-50 dark:bg-violet-500/8', text: 'text-violet-600 dark:text-violet-400', ring: 'ring-violet-100 dark:ring-violet-500/15' },
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className="group rounded-2xl p-5 bg-[var(--bg-surface)] border border-[var(--border)] card-lift relative overflow-hidden">
      {/* Decorative corner accent */}
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full ${c.bg} opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500`} />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            {label}
          </span>
          <div className={`w-9 h-9 rounded-xl ${c.bg} ring-1 ${c.ring} ${c.text} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
            <Icon size={17} />
          </div>
        </div>

        <div className="text-[26px] font-extrabold text-[var(--text-primary)] tracking-tight font-heading leading-none">
          {value}
        </div>

        <p className="text-[12px] text-[var(--text-secondary)] mt-2 font-body leading-relaxed">
          {subtitle}
        </p>

        {action && (
          <div className="mt-3.5 pt-3 border-t border-[var(--border)]">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardKpiCards = ({
  currency,
  totalRevenue,
  settlementBalance,
  totalIssued,
  totalCapacity,
  publicTicketsCount,
  privateInvitesCount,
  totalCheckedIn,
  eventsCount,
  onOpenWithdraw,
}) => {
  const animatedRevenue = useCountUp(totalRevenue);
  const animatedCheckedIn = useCountUp(totalCheckedIn);
  const animatedIssued = useCountUp(totalIssued);
  const fillRate = Math.round((totalIssued / (totalCapacity || 1)) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-in">
      <KpiCard
        label="Total Revenue"
        value={currency === 'NGN'
          ? `₦${animatedRevenue.toLocaleString()}`
          : `$${Math.round(animatedRevenue / 1500).toLocaleString()}`}
        subtitle={`${eventsCount} active event${eventsCount !== 1 ? 's' : ''} generating revenue`}
        icon={TrendingUp}
        color="indigo"
      />

      <KpiCard
        label="Available Balance"
        value={currency === 'NGN'
          ? `₦${settlementBalance.toLocaleString()}`
          : `$${Math.round(settlementBalance / 1500).toLocaleString()}`}
        subtitle="Cleared for instant bank transfer"
        icon={Banknote}
        color="emerald"
        action={
          <button
            onClick={onOpenWithdraw}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--accent)] hover:underline cursor-pointer"
          >
            Withdraw funds <ArrowUpRight size={13} />
          </button>
        }
      />

      <KpiCard
        label="Passes Issued"
        value={animatedIssued.toLocaleString()}
        subtitle={`${publicTicketsCount} tickets · ${privateInvitesCount} invites · ${fillRate}% fill`}
        icon={Ticket}
        color="cyan"
        action={
          <div className="h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 progress-fill"
              style={{ width: `${Math.min(fillRate, 100)}%` }}
            />
          </div>
        }
      />

      <KpiCard
        label="Gate Check-Ins"
        value={animatedCheckedIn.toLocaleString()}
        subtitle="Sub-100ms avg latency · 0 fraud incidents"
        icon={Zap}
        color="violet"
        action={
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Scanner mesh active
          </div>
        }
      />
    </div>
  );
};

export default DashboardKpiCards;
