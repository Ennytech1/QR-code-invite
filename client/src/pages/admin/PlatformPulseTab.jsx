import React from 'react';
import {
  TrendingUp, ArrowUpRight, DollarSign, Building2, Clock, ShieldCheck,
  CheckCircle2, Key, Radio, Cpu, ChevronRight, BarChart3
} from 'lucide-react';

const WEEKLY_TREND = [
  { day: 'Mon', vol: 1400000, height: '45%', passes: 240 },
  { day: 'Tue', vol: 1850000, height: '58%', passes: 310 },
  { day: 'Wed', vol: 1200000, height: '38%', passes: 190 },
  { day: 'Thu', vol: 2300000, height: '72%', passes: 480 },
  { day: 'Fri', vol: 3800000, height: '95%', passes: 760 },
  { day: 'Sat', vol: 4100000, height: '100%', passes: 890 },
  { day: 'Sun', vol: 2100000, height: '64%', passes: 410 },
];

const PlatformPulseTab = ({ metrics, onSwitchTab }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* ─── 4 Primary KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Gross Ticket Volume */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden group hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Gross Ticket Volume
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-4 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            ₦{(metrics.totalGrossVolume || 12750000).toLocaleString()}
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <ArrowUpRight size={14} />
            <span>+24.6% platform growth vs last mo</span>
          </div>
        </div>

        {/* Card 2: Platform 1.5% Commission */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden group hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Platform Fee (1.5%)
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-4 text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
            ₦{(metrics.platformEarnings || 191250).toLocaleString()}
          </div>
          <div className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">
            Net commission cut retained in treasury
          </div>
        </div>

        {/* Card 3: Escrow Reserve Balance */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden group hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Escrow Float Reserve
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Building2 size={18} />
            </div>
          </div>
          <div className="mt-4 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            ₦{(metrics.escrowReserve || 8208750).toLocaleString()}
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
            <Clock size={13} />
            <span>{metrics.pendingPayoutsCount} withdrawal requests pending</span>
          </div>
        </div>

        {/* Card 4: Turnstile Fraud Blocked */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden group hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Fraud Intercepted
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="mt-4 text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
            {metrics.turnstileReplayBlocked} Passes Blocked
          </div>
          <div className="mt-2.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 size={13} />
            <span>100% duplicate replays stopped</span>
          </div>
        </div>

      </div>

      {/* ─── Platform Analytics Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Ingress & Volume Trend */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Platform Volume & Gate Ingress Trend</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Weekly ticket sales & gate check-ins across all events</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
              Last 7 Days
            </span>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800/80">
            {WEEKLY_TREND.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100">
                  ₦{(item.vol / 1000000).toFixed(1)}M
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl h-32 flex items-end overflow-hidden p-1">
                  <div
                    style={{ height: item.height }}
                    className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-lg group-hover:from-indigo-500 group-hover:to-violet-400 transition-all shadow-sm"
                  />
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.day}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-1 text-center">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Passes Issued</div>
              <div className="text-base font-black text-slate-900 dark:text-white mt-1">{(metrics.totalPassesIssued || 3420).toLocaleString()}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Check-Ins</div>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">{(metrics.totalPassesCheckedIn || 2180).toLocaleString()}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Admission Ratio</div>
              <div className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-1">{metrics.turnstileSuccessRate || '97.89%'}</div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Platform Engine Health */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Core Engine Health</h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time gateway status</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-3.5">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key size={17} className="text-indigo-600 dark:text-indigo-400" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Ed25519 Engine</div>
                  <div className="text-[10px] text-slate-400">RFC 8032 Asymmetric Keys</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Radio size={17} className="text-violet-600 dark:text-violet-400" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Turnstile WebSocket</div>
                  <div className="text-[10px] text-slate-400">RFC 6455 Real-time Mesh</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                &lt; 18ms
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 size={17} className="text-amber-600 dark:text-amber-400" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">NIBSS / Stripe Rail</div>
                  <div className="text-[10px] text-slate-400">Direct Bank Settlement Gateway</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Connected
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck size={17} className="text-rose-600 dark:text-rose-400" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Anti-Replay Mutex</div>
                  <div className="text-[10px] text-slate-400">Atomic lock validation</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                100% Guard
              </span>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => onSwitchTab('payouts')}
              className="w-full py-2.5 px-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
            >
              <span>Review {metrics.pendingPayoutsCount} Pending Withdrawals</span>
              <ChevronRight size={14} />
            </button>
            <button
              onClick={() => onSwitchTab('security')}
              className="w-full py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
            >
              <span>Inspect Turnstile Intercept Logs</span>
              <ChevronRight size={14} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PlatformPulseTab;

