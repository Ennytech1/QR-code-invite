import React from 'react';
import { Activity, ShieldAlert, CheckCircle2, User, Clock } from 'lucide-react';

const RealtimeGateFeedSection = ({ liveCheckinStream = [] }) => {
  return (
    <div className="rounded-2xl p-5 border border-[var(--border)] bg-[var(--bg-surface)] shadow-xs space-y-3.5 card-lift">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-cyan-500" />
            <h3 className="font-heading font-bold text-sm sm:text-[15px] text-[var(--text-primary)] tracking-tight">
              Live Door Stream
            </h3>
          </div>
          <p className="text-[11.5px] text-[var(--text-secondary)] font-body">
            Real-time access events as passes are scanned
          </p>
        </div>

        <span className="text-[10px] font-bold font-mono-numbers text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          PULSE
        </span>
      </div>

      {/* ─── Stream Items ─── */}
      <div className="space-y-2">
        {liveCheckinStream.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--text-secondary)] font-body">
            Waiting for next gate scan...
          </div>
        ) : (
          liveCheckinStream.map((item) => {
            const isBlocked = item.isDuplicateBlocked;
            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  isBlocked
                    ? 'bg-red-500/5 dark:bg-red-500/10 border-red-500/25'
                    : 'bg-[var(--bg-base)] border-[var(--border)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex items-start gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isBlocked
                          ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {isBlocked ? <ShieldAlert size={14} /> : <CheckCircle2 size={14} />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-[var(--text-primary)] font-heading truncate">
                          {item.name}
                        </span>
                        {isBlocked && (
                          <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-red-500/20 text-red-600 dark:text-red-400 uppercase tracking-wide">
                            Duplicate Blocked
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)] font-body mt-0.5 truncate">
                        {item.tier} · {item.gate}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono-numbers text-[var(--text-tertiary)] shrink-0 mt-0.5">
                    {item.time}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RealtimeGateFeedSection;