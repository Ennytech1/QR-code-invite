import React from 'react';
import { ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminHeader = ({ user, loginAsDemo, refreshing, onSync }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/20 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-start sm:items-center gap-4">
        <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 shrink-0">
          <ShieldAlert size={28} strokeWidth={2.3} />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
              Platform Super Admin Suite
            </h1>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              Root Authority
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Platform-wide telemetry, global organizer moderation, NIBSS treasury disbursements, and Ed25519 turnstile fraud defense.
          </p>
        </div>
      </div>

      {/* Right Action Tools */}
      <div className="relative z-10 flex flex-wrap items-center gap-3">
        {user?.role !== 'admin' && (
          <button
            onClick={() => {
              loginAsDemo('admin');
              toast.success('Switched to Platform Super Admin profile');
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md hover:shadow-amber-500/25 flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Sparkles size={14} />
            <span>Simulate Super Admin</span>
          </button>
        )}

        <button
          onClick={onSync}
          disabled={refreshing}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          <span>{refreshing ? 'Syncing...' : 'Sync Data'}</span>
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;

