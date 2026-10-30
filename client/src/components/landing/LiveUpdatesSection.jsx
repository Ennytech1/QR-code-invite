import React from 'react';
import { BadgePercent, Sparkles, Zap, ArrowRight } from 'lucide-react';

const LIVE_PULSES = [
  { text: 'Tunde O. purchased 2x VIP for The Wet Party 2.0', time: 'Just now', icon: '🎟️' },
  { text: 'Gate 01 scanned & verified Kelechi O. in 12ms', time: '1m ago', icon: '⚡' },
  { text: 'Atlantis: The Party 4.0 reached 78% capacity', time: '3m ago', icon: '🔥' },
  { text: 'David K. redeemed promo code POPOUT50 for 50% off', time: '5m ago', icon: '🎉' }
];

const LiveUpdatesSection = () => {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[11px] font-bold uppercase tracking-wider">
          Live Updates
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
          Events Happening on Popout Tickets
        </h2>
        <p className="text-[13px] text-[var(--text-secondary)]">
          Real events, real energy. See what organizers and attendees are creating every day.
        </p>
      </div>

      {/* Main Spotlight Banner: Discount Codes (Directly from Screenshot 5) */}
      <div className="max-w-4xl mx-auto">
        <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-violet-950/40 border border-purple-500/30 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-md">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
              NEW FEATURE
            </span>
            <h3 className="text-3xl font-black tracking-tight">
              We added Discount Codes & Group Bundles.
            </h3>
            <p className="text-zinc-300 text-[13px] leading-relaxed">
              Give your loyal attendees percentage or flat discounts off ticket prices. Set usage limits, expiration dates, and secret VIP codes.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-lg bg-black/50 border border-white/20 font-mono text-xs text-amber-300 font-bold">
                Code: POPOUT50 (50% Off)
              </span>
              <span className="text-[11px] text-zinc-400">Test it in the ticket checkout modal!</span>
            </div>
          </div>

          {/* Graphic Badge */}
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-center space-y-2 shadow-2xl shrink-0 w-64">
            <div className="w-12 h-12 mx-auto rounded-xl bg-purple-500 flex items-center justify-center text-white shadow-lg">
              <BadgePercent size={26} />
            </div>
            <div className="font-extrabold text-xl">Get 50% Off</div>
            <div className="text-[11px] text-purple-200">
              Instant checkout promotion applied on tickets.
            </div>
          </div>

        </div>
      </div>

      {/* Live Activity Ticker Stream */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {LIVE_PULSES.map((pulse, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-between text-[12px]"
          >
            <div className="flex items-center gap-2 truncate pr-2">
              <span className="text-sm shrink-0">{pulse.icon}</span>
              <span className="truncate text-[var(--text-primary)] font-medium">{pulse.text}</span>
            </div>
            <span className="text-[10px] text-[var(--text-tertiary)] font-mono whitespace-nowrap">
              {pulse.time}
            </span>
          </div>
        ))}
      </div>

    </section>
  );
};

export default LiveUpdatesSection;
