import React, { useState } from 'react';
import { Radio, RefreshCw, Cpu, Activity, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const GATE_TERMINALS = [
  {
    id: 'TRM_01',
    gateName: 'Gate 1 - Main Public Turnstile',
    venue: 'Landmark Centre, Victoria Island',
    eventName: 'Lagos Tech Summit 2026',
    operator: 'Eko Gate Security #1',
    device: 'Apple iPad Pro (M2) • iOS 18.2',
    ip: '192.168.1.104',
    latency: '12ms',
    battery: '94%',
    status: 'ONLINE',
    totalScans: 412,
    rejectedDuplications: 8,
  },
  {
    id: 'TRM_02',
    gateName: 'Gate 2 - VIP Turnstile North',
    venue: 'Landmark Centre, Victoria Island',
    eventName: 'Lagos Tech Summit 2026',
    operator: 'Chief Gate Officer Tunde',
    device: 'Samsung Galaxy Tab S9 Ultra',
    ip: '192.168.1.108',
    latency: '15ms',
    battery: '88%',
    status: 'ONLINE',
    totalScans: 284,
    rejectedDuplications: 3,
  },
  {
    id: 'TRM_03',
    gateName: 'Gate 3 - Vendor Ingress',
    venue: 'Landmark Centre, Victoria Island',
    eventName: 'Lagos Tech Summit 2026',
    operator: 'Gate Security #3',
    device: 'Zebra TC52x Rugged Android PDA',
    ip: '192.168.1.112',
    latency: '18ms',
    battery: '76%',
    status: 'ONLINE',
    totalScans: 98,
    rejectedDuplications: 0,
  },
  {
    id: 'TRM_04',
    gateName: 'Grand Ballroom VIP Entrance',
    venue: 'The Sky Restaurant, Eko Hotel',
    eventName: 'Private Founders VIP Gala',
    operator: 'Sarah Jenkins Usher Lead',
    device: 'Apple iPhone 16 Pro Max',
    ip: '10.0.4.52',
    latency: '22ms',
    battery: '98%',
    status: 'ONLINE',
    totalScans: 98,
    rejectedDuplications: 1,
  },
  {
    id: 'TRM_05',
    gateName: 'Beachfront Pavilion Turnstile A',
    venue: 'Tarkwa Bay Beach Pavilion',
    eventName: 'Acoustic Afro-Jazz Sunset',
    operator: 'Gate Security Unassigned',
    device: 'Rugged Turnstile Scanner Hub #4',
    ip: '172.16.0.40',
    latency: '45ms',
    battery: 'Connected AC',
    status: 'STANDBY',
    totalScans: 0,
    rejectedDuplications: 0,
  }
];

const GateFleetTab = () => {
  const [terminals, setTerminals] = useState(GATE_TERMINALS);

  const handlePingTerminal = (id) => {
    toast.success(`Ping signal transmitted to terminal ${id}: Round-trip 14ms (RFC 6455 OK).`);
  };

  const handleFlushCache = (id) => {
    toast.success(`Turnstile pass cache synchronized & flushed for terminal ${id}.`, {
      icon: '🔄'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* ─── Top Telemetry Banner ─── */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Radio size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Turnstile Fleet Mesh</h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time WebSocket telemetry from all gate scanner hardware across all events</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>5/5 Terminals Active</span>
          </div>

          <button
            onClick={() => toast.success('Broadcast ping sent to all 5 gate terminals (Avg latency 16ms).')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw size={13} />
            <span>Ping All Terminals</span>
          </button>
        </div>
      </div>

      {/* ─── Terminals Cards Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {terminals.map((t) => (
          <div
            key={t.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {t.id}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.status === 'ONLINE'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {t.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2">{t.gateName}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{t.venue}</p>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{t.latency}</div>
                  <div className="text-[10px] text-slate-400">WebSocket Ping</div>
                </div>
              </div>

              {/* Hardware & Operator Info */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Assigned Event:</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{t.eventName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Terminal Operator:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{t.operator}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Device Hardware:</span>
                  <span className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">{t.device}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">IP & Power:</span>
                  <span className="text-slate-600 dark:text-slate-400">{t.ip} • Battery {t.battery}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-[10px] text-slate-400 font-semibold">Total Scans</div>
                  <div className="text-base font-black text-slate-900 dark:text-white">{t.totalScans}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-[10px] text-slate-400 font-semibold">Duplications Blocked</div>
                  <div className="text-base font-black text-rose-600 dark:text-rose-400">{t.rejectedDuplications}</div>
                </div>
              </div>
            </div>

            {/* Action Tools */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => handleFlushCache(t.id)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Sync Token Vault
              </button>
              <button
                onClick={() => handlePingTerminal(t.id)}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 text-xs font-bold transition-all cursor-pointer"
              >
                Send Ping
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default GateFleetTab;

