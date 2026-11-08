import React, { useState, useMemo } from 'react';
import { Search, Ticket, CheckCircle2, XCircle, ShieldAlert, Key, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEvents } from '../../context/EventContext';

const INITIAL_PASSES = [
  {
    id: 'TKT_9901',
    qrToken: 'TKT_e381a9f0b2',
    guestName: 'Dr. Kelechi Nnamdi',
    email: 'kelechi.n@lagoshealth.ng',
    phone: '+234 803 112 4910',
    eventName: 'Lagos Tech Summit 2026',
    tier: 'VVIP',
    table: 'Table 1 - Founders Row',
    status: 'CHECKED_IN',
    checkInTime: '14:22',
    gateScanned: 'Gate 2 - VIP Turnstile North',
    signatureValid: true,
  },
  {
    id: 'TKT_9902',
    qrToken: 'TKT_84f9102c11',
    guestName: 'Chief Emeka Okonkwo',
    email: 'emeka@oilandgas.com',
    phone: '+234 802 998 1234',
    eventName: 'Private Founders VIP Gala',
    tier: 'VIP',
    table: 'Table 4 - Executive Circle',
    status: 'VALID',
    checkInTime: null,
    gateScanned: null,
    signatureValid: true,
  },
  {
    id: 'TKT_9903',
    qrToken: 'TKT_bad_sig_4821',
    guestName: 'Unknown Attendee (Tampered Pass)',
    email: 'suspicious@mailinator.com',
    phone: '+234 701 000 0000',
    eventName: 'Lagos Tech Summit 2026',
    tier: 'REGULAR',
    table: 'General Seating',
    status: 'REVOKED',
    checkInTime: null,
    gateScanned: 'Gate 1 - Main Entrance (Rejected)',
    signatureValid: false,
  },
  {
    id: 'TKT_9904',
    qrToken: 'TKT_1928374650',
    guestName: 'Folake Adeleke',
    email: 'folake@ventures.africa',
    phone: '+234 814 555 7890',
    eventName: 'Annual Charity Ball 2026',
    tier: 'VIP',
    table: 'Table 8',
    status: 'VALID',
    checkInTime: null,
    gateScanned: null,
    signatureValid: true,
  },
  {
    id: 'TKT_9905',
    qrToken: 'TKT_photo_screenshot_99',
    guestName: 'Olumide Jacobs (Duplicate Scan)',
    email: 'olumide@jacobs.io',
    phone: '+234 809 444 3210',
    eventName: 'Lagos Tech Summit 2026',
    tier: 'REGULAR',
    table: 'General Seating',
    status: 'CHECKED_IN',
    checkInTime: '12:05',
    gateScanned: 'Gate 1 - Main Entrance',
    signatureValid: true,
  }
];

const TicketsVaultTab = () => {
  const { guests: contextGuests = [], events: contextEvents = [] } = useEvents();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [revokedTokens, setRevokedTokens] = useState({});

  // Merge real context guests with demo catalog
  const allPasses = useMemo(() => {
    const fromContext = contextGuests.map((g) => {
      const parentEvent = contextEvents.find((e) => e.id === g.eventId);
      const isRevoked = revokedTokens[g.qrToken] !== undefined ? revokedTokens[g.qrToken] : (g.status === 'REVOKED');
      return {
        id: g.id || `TKT_${g.qrToken}`,
        qrToken: g.qrToken || `QRI_${g.id}`,
        guestName: g.name,
        email: g.email || 'guest@ticketing.io',
        phone: g.phone || '+2348000000000',
        eventName: parentEvent?.name || 'Lagos Tech Summit 2026',
        tier: g.tier || 'REGULAR',
        table: g.table || 'General Admission',
        status: isRevoked ? 'REVOKED' : (g.status || 'VALID'),
        checkInTime: g.checkInTime ? new Date(g.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
        gateScanned: g.gate || null,
        signatureValid: true,
        isLiveUserPass: true,
      };
    });

    // Deduplicate against INITIAL_PASSES
    const existingTokens = new Set(fromContext.map((p) => p.qrToken));
    const demoOnly = INITIAL_PASSES.filter((p) => !existingTokens.has(p.qrToken)).map((p) => {
      if (revokedTokens[p.qrToken] !== undefined) {
        return { ...p, status: revokedTokens[p.qrToken] ? 'REVOKED' : 'VALID' };
      }
      return p;
    });

    return [...fromContext, ...demoOnly];
  }, [contextGuests, contextEvents, revokedTokens]);

  const filteredPasses = useMemo(() => {
    return allPasses.filter((p) => {
      const matchesSearch =
        p.guestName.toLowerCase().includes(search.toLowerCase()) ||
        p.qrToken.toLowerCase().includes(search.toLowerCase()) ||
        p.eventName.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'ALL' ||
        p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allPasses, search, statusFilter]);

  const handleToggleRevoke = (qrToken, currentStatus) => {
    const willRevoke = currentStatus !== 'REVOKED';
    setRevokedTokens((prev) => ({
      ...prev,
      [qrToken]: willRevoke,
    }));

    toast.success(`Pass ${qrToken} ${willRevoke ? 'REVOKED (Turnstile Denied)' : 'Re-Validated'}`, {
      icon: willRevoke ? '🚫' : '✅'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* ─── Search & Status Filters ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search passes across entire platform by attendee name, email, or token hash..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {['ALL', 'VALID', 'CHECKED_IN', 'REVOKED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {s === 'ALL' ? 'All Passes' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Tickets Vault Table ─── */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Pass Holder & Contact</th>
                <th className="py-3.5 px-5">Event & Tier</th>
                <th className="py-3.5 px-5">Cryptographic Token</th>
                <th className="py-3.5 px-5">Ed25519 Sig</th>
                <th className="py-3.5 px-5">Turnstile Status</th>
                <th className="py-3.5 px-5 text-right">Root Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              {filteredPasses.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-bold text-slate-900 dark:text-white text-xs">{p.guestName}</div>
                    <div className="text-[11px] text-slate-400">{p.email}</div>
                    <div className="text-[10px] text-slate-400">{p.phone}</div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">{p.eventName}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                        {p.tier}
                      </span>
                      <span className="text-[10px] text-slate-400">{p.table}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                    {p.qrToken}
                  </td>
                  <td className="py-4 px-5">
                    {p.signatureValid ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 size={12} />
                        VERIFIED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                        <XCircle size={12} />
                        FORGED
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5">
                    {p.status === 'CHECKED_IN' ? (
                      <div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          CHECKED IN
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {p.checkInTime} @ {p.gateScanned}
                        </div>
                      </div>
                    ) : p.status === 'REVOKED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                        REVOKED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                        VALID (READY)
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => handleToggleRevoke(p.qrToken, p.status)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        p.status === 'REVOKED'
                          ? 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                          : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                      }`}
                    >
                      {p.status === 'REVOKED' ? 'Re-Validate' : 'Revoke Pass'}
                    </button>
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

export default TicketsVaultTab;

