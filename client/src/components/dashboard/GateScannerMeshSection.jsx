import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, QrCode, Smartphone, Zap, Radio, CheckCircle2 } from 'lucide-react';

const TERMINALS = [
  { id: 'gate_1', name: 'Gate 01 — Main Arch', scans: 618, latency: '12ms', status: 'Online • 5G', color: 'emerald' },
  { id: 'gate_2', name: 'Gate 02 — VIP Red Carpet', scans: 142, latency: '9ms', status: 'Online • Optical HD', color: 'cyan' },
  { id: 'gate_3', name: 'Gate 03 — Backstage & Crew', scans: 84, latency: '14ms', status: 'Online • Offline PWA', color: 'indigo' },
];

const GateScannerMeshSection = ({ onOpenScanner }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl p-5 border border-[var(--border)] bg-[var(--bg-surface)] shadow-xs space-y-4 card-lift">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            <h3 className="font-heading font-bold text-sm sm:text-[15px] text-[var(--text-primary)] tracking-tight">
              Gate Scanner Mesh
            </h3>
          </div>
          <p className="text-[11.5px] text-[var(--text-secondary)] font-body">
            3 door terminals synchronized via peer mutex
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          Active
        </span>
      </div>

      {/* ─── Terminal Items ─── */}
      <div className="space-y-2">
        {TERMINALS.map((term) => (
          <div
            key={term.id}
            className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] flex items-center justify-between hover:border-[var(--accent)] transition-colors group cursor-default"
          >
            <div className="min-w-0 pr-2">
              <div className="font-semibold text-xs text-[var(--text-primary)] font-heading truncate">
                {term.name}
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] font-body flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {term.status}
                </span>
                <span>·</span>
                <span className="font-mono-numbers text-[10.5px] text-[var(--text-tertiary)]">{term.latency}</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-sm font-bold font-mono-numbers text-[var(--text-primary)]">
                {term.scans}
              </div>
              <div className="text-[9.5px] uppercase tracking-wider text-[var(--text-secondary)] font-medium">
                Passes In
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Anti-Replay Mutex Callout ─── */}
      <div className="p-3 rounded-xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/15 space-y-1">
        <div className="flex items-center justify-between text-xs font-heading">
          <span className="font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
            <Radio size={13} className="text-purple-500" />
            <span>Anti-Duplicate Mutex</span>
          </span>
          <span className="font-bold font-mono-numbers text-purple-600 dark:text-purple-400 text-[11px]">
            19 Intercepted
          </span>
        </div>
        <p className="text-[11px] text-[var(--text-secondary)] font-body leading-relaxed">
          Concurrent duplicate screenshot scans are instantly blocked across all connected turnstiles.
        </p>
      </div>

      {/* ─── Fast Actions Dual Buttons ─── */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={onOpenScanner}
          className="py-2.5 px-3 rounded-xl text-white font-heading font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <QrCode size={13} />
          <span>Launch Scanner</span>
        </button>

        <button
          onClick={() => navigate('/usher')}
          className="py-2.5 px-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] bg-[var(--bg-base)] text-[var(--text-primary)] hover:text-[var(--accent)] font-heading font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Smartphone size={13} className="text-[var(--accent)]" />
          <span>Usher PIN App</span>
        </button>
      </div>
    </div>
  );
};

export default GateScannerMeshSection;