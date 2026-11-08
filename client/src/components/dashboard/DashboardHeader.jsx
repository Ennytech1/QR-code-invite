import React from 'react';
import { RefreshCw, QrCode, Plus, Zap, ArrowRight } from 'lucide-react';

const DashboardHeader = ({
  currency,
  onToggleCurrency,
  onOpenScanner,
  onOpenNewEvent,
}) => {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
      <div className="space-y-1.5">
        <p className="text-sm text-[var(--text-secondary)] font-body">
          {greeting} 👋
        </p>
        <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-[var(--text-primary)] font-heading leading-tight">
          Dashboard
        </h1>
        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] font-body">
          <span className="inline-flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            All gates online
          </span>
          <span className="text-[var(--border-strong)]">•</span>
          <span>{now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          onClick={onToggleCurrency}
          className="h-9 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] text-xs font-semibold hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw size={12} className="text-[var(--accent)]" />
          {currency === 'NGN' ? '₦ NGN' : '$ USD'}
        </button>

        <button
          onClick={onOpenScanner}
          className="h-9 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <QrCode size={14} className="text-[var(--accent)]" />
          Gate Scanner
        </button>

        <button
          onClick={onOpenNewEvent}
          className="h-9 px-4.5 rounded-xl text-white text-xs font-bold bg-[var(--accent)] hover:opacity-90 shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-[0.97] btn-accent"
        >
          <Plus size={15} strokeWidth={2.5} />
          New Event
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
