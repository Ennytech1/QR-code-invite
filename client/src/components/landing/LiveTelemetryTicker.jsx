import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, Radio, Activity, CheckCircle2, Lock, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const INITIAL_GATES = [
  { id: 'GATE-01', name: 'Gate 1 (VIP & High Table)', checkedIn: 184, capacity: 200, latency: '11ms', status: 'ACTIVE' },
  { id: 'GATE-02', name: 'Gate 2 (General Turnstiles)', checkedIn: 928, capacity: 1200, latency: '14ms', status: 'ACTIVE' },
  { id: 'GATE-03', name: 'Gate 3 (East Arena Deck)', checkedIn: 412, capacity: 500, latency: '12ms', status: 'ACTIVE' },
  { id: 'GATE-04', name: 'Gate 4 (Backstage & Crew)', checkedIn: 46, capacity: 50, latency: '9ms', status: 'ACTIVE' },
];

const LiveTelemetryTicker = () => {
  const [gates, setGates] = useState(INITIAL_GATES);
  const [lastCheckIn, setLastCheckIn] = useState({
    name: 'Chief Kelechi Okafor',
    gate: 'GATE-01',
    tier: 'VVIP High Table',
    time: 'Just now'
  });

  // Periodically increment a simulated gate counter to give authentic live feel
  useEffect(() => {
    const interval = setInterval(() => {
      setGates((prev) => {
        const randIdx = Math.floor(Math.random() * prev.length);
        const updated = [...prev];
        const target = updated[randIdx];
        if (target.checkedIn < target.capacity) {
          updated[randIdx] = {
            ...target,
            checkedIn: target.checkedIn + 1,
            latency: `${Math.floor(Math.random() * 6) + 10}ms`
          };
        }
        return updated;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 sm:p-5 shadow-sm space-y-4">
        
        {/* Ticker Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono font-bold text-[var(--text-primary)] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Activity size={13} className="text-emerald-500" />
              Live Turnstile Telemetry Radar
            </span>
            <span className="text-[var(--text-tertiary)]">•</span>
            <span className="text-emerald-500 font-semibold text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              4 Concurrent Gates Streaming
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[var(--text-secondary)]">
            <span className="flex items-center gap-1 font-mono">
              <Lock size={12} className="text-indigo-400" />
              <span>Anti-Replay Mutex: <strong className="text-emerald-400">ACTIVE</strong></span>
            </span>
            <Link
              to="/live"
              className="font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1 transition-colors"
            >
              <span>Full Gate Radar</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        {/* 4 Gates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {gates.map((g) => {
            const pct = Math.round((g.checkedIn / g.capacity) * 100);
            return (
              <div
                key={g.id}
                className="rounded-xl p-3 bg-[var(--bg-subtle)] border border-[var(--border)] space-y-2 hover:border-indigo-500/40 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-[var(--text-primary)]">{g.id}</span>
                  <span className="font-mono text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                    {g.latency}
                  </span>
                </div>

                <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
                  {g.name}
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full bg-[var(--bg-base)] h-1.5 rounded-full overflow-hidden border border-[var(--border)]">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[var(--text-tertiary)] font-mono">
                    <span>{g.checkedIn} checked in</span>
                    <span>{pct}% cap</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default LiveTelemetryTicker;
