import React from 'react';
import { Calendar, Ticket, TrendingUp, Zap, CheckCircle2, Building2 } from 'lucide-react';
import { STATS_DATA } from './landingData';

const ICONS = [Calendar, Ticket, TrendingUp, Zap];

const StatsSection = () => {
  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {STATS_DATA.map((stat, idx) => {
          const Icon = ICONS[idx] || Ticket;
          return (
            <div
              key={idx}
              className="card-glow rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm hover:shadow-md"
            >
              {/* Subtle Ambient Corner Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <Icon size={18} strokeWidth={2.3} />
                </div>
                <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {stat.change}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight font-mono">
                  {stat.value}
                </div>
                <div className="text-[13px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  {stat.label}
                </div>
                <div className="text-[11px] text-[var(--text-tertiary)] pt-1">
                  {stat.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StatsSection;
