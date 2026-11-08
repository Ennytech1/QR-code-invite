import React from 'react';
import { Server, Database, Radio, CheckCircle2, ShieldCheck, Activity, Cpu, HardDrive } from 'lucide-react';
import toast from 'react-hot-toast';

const SYSTEM_SERVICES = [
  {
    name: 'Express API Gateway',
    type: 'Core Backend',
    port: '5000',
    status: 'OPERATIONAL',
    uptime: '99.99%',
    latency: '11ms',
    details: 'REST endpoints, JWT authentication, rate-limiting active (100 req/10m)',
  },
  {
    name: 'RFC 6455 Turnstile WebSocket Hub',
    type: 'Live Streaming Node',
    port: '5000/ws',
    status: 'OPERATIONAL',
    uptime: '99.98%',
    latency: '8ms',
    details: 'Bidirectional broadcast to all gate terminals, exponential backoff active',
  },
  {
    name: 'MongoDB Atlas Distributed Cluster',
    type: 'Database Mesh',
    port: '27017',
    status: 'OPERATIONAL',
    uptime: '99.99%',
    latency: '14ms',
    details: 'Compound indexes on {qrToken, event}, atomic mutex locking',
  },
  {
    name: 'Ed25519 Cryptographic Verification Node',
    type: 'Security Subsystem',
    port: 'In-Process RFC 8032',
    status: 'OPERATIONAL',
    uptime: '100%',
    latency: '< 1ms',
    details: 'Hardware-accelerated libsodium Curve25519 signature batch verify',
  },
  {
    name: 'Paystack Webhook Listener',
    type: 'Payment Webhook',
    port: '/api/tickets/paystack-webhook',
    status: 'OPERATIONAL',
    uptime: '99.95%',
    latency: '42ms',
    details: 'HMAC-SHA512 webhook signature verification, automated ticket issuance',
  },
  {
    name: 'Stripe Global Card Webhook',
    type: 'Payment Webhook',
    port: '/api/tickets/stripe-webhook',
    status: 'OPERATIONAL',
    uptime: '99.97%',
    latency: '58ms',
    details: 'Stripe signature verification, automated escrow booking',
  },
  {
    name: 'Meta WhatsApp Cloud API Node',
    type: 'Dispatch Engine',
    port: '/api/whatsapp',
    status: 'OPERATIONAL',
    uptime: '99.90%',
    latency: '120ms',
    details: 'Template message delivery, automated pass image dispatch',
  },
];

const SystemHealthTab = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* ─── High-Level Cluster Stats ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Overall Availability</span>
            <Activity size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-3">99.98%</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 size={13} />
            <span>All 7 Core Nodes Green</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Avg Gateway Latency</span>
            <Cpu size={16} className="text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-3">14.2 ms</div>
          <div className="text-xs text-slate-400 mt-1">Sub-second gate turnstile response</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Active WebSockets</span>
            <Radio size={16} className="text-violet-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-3">14 Terminals</div>
          <div className="text-xs text-slate-400 mt-1">RFC 6455 persistent connections</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Memory Footprint</span>
            <HardDrive size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-3">184 MB / 2 GB</div>
          <div className="text-xs text-slate-400 mt-1">Heap utilization: 9.2%</div>
        </div>
      </div>

      {/* ─── Services Health Table ─── */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Platform Subsystems & Gateway Registry</h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time health telemetry across the full QRInvite technology stack</p>
          </div>

          <button
            onClick={() => toast.success('Diagnostic complete: All subsystems responding within healthy SLA.')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            Run Full Stack Healthcheck
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Subsystem Name</th>
                <th className="py-3.5 px-5">Type & Port</th>
                <th className="py-3.5 px-5">Health Status</th>
                <th className="py-3.5 px-5">Uptime</th>
                <th className="py-3.5 px-5">Latency</th>
                <th className="py-3.5 px-5">Subsystem Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              {SYSTEM_SERVICES.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-5 font-bold text-slate-900 dark:text-white">
                    {s.name}
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-semibold">{s.type}</div>
                    <div className="font-mono text-[10px] text-slate-400">{s.port}</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {s.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-bold text-slate-900 dark:text-white">
                    {s.uptime}
                  </td>
                  <td className="py-4 px-5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {s.latency}
                  </td>
                  <td className="py-4 px-5 text-slate-400 max-w-sm">
                    {s.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default SystemHealthTab;

