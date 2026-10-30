import React, { useState, useMemo } from 'react';
import {
  TrendingUp, Wallet, Calendar, Ticket, CheckCircle2,
  ArrowRight, QrCode, Plus, Users, Clock, ShieldCheck,
  Send, Activity, Zap, AlertTriangle, ExternalLink,
  ChevronRight, Lock, Globe, Sparkles, Search, Filter,
  Download, ArrowUpRight, Copy, Check, RefreshCw,
  Smartphone, Building2, ChevronDown, Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import NewEventModal from '../components/modals/NewEventModal';
import ScannerModal from '../components/modals/ScannerModal';
import BulkGuestModal from '../components/modals/BulkGuestModal';
import InvitationCardModal from '../components/modals/InvitationCardModal';

/* ─── Tier Badge Component ─── */
const TierBadge = ({ tier = '' }) => {
  const t = String(tier).toUpperCase();
  if (t.includes('VVIP') || t.includes('DIGNITARY') || t.includes('HIGH TABLE') || t.includes('INVESTOR')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/25">
        <Award size={10} className="text-purple-500" />
        {tier}
      </span>
    );
  }
  if (t.includes('VIP') || t.includes('EXECUTIVE')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/25">
        <Sparkles size={10} className="text-indigo-500" />
        {tier}
      </span>
    );
  }
  if (t.includes('TABLE') || t.includes('CABANA')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/25">
        {tier}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
      {tier || 'REGULAR'}
    </span>
  );
};

/* ─── Pass Mode Badge ─── */
const PassModeBadge = ({ type }) => {
  if (type === 'PRIVATE') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
        <Lock size={9} /> Private RSVP
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
      <Globe size={9} /> Public Ticket
    </span>
  );
};

/* ─── Status Indicator ─── */
const StatusDot = ({ status, time }) => {
  if (status === 'CHECKED_IN') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
        <CheckCircle2 size={12} strokeWidth={2.5} />
        <span>Checked In</span>
        {time && <span className="opacity-75 font-mono text-[10px]">({time})</span>}
      </span>
    );
  }
  if (status === 'REVOKED') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
        <AlertTriangle size={12} strokeWidth={2} /> Revoked
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
      <Clock size={12} strokeWidth={2} /> Awaiting Gate
    </span>
  );
};

/* ─── Settlement Withdrawal Modal ─── */
const WithdrawModal = ({ isOpen, onClose, balance, currency }) => {
  const [bank, setBank] = useState('GTBank Nigeria (•••• 4819)');
  const [amount, setAmount] = useState(balance);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleWithdraw = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(
        `Disbursement of ${currency === 'NGN' ? '₦' : '$'}${Number(amount).toLocaleString()} initiated to ${bank}! Expected in your account within 10 minutes.`
      );
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#11131a] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 animate-fade-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Building2 size={18} />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-[16px] text-slate-900 dark:text-white">
                Bank Settlement Transfer
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-body">
                Instant clearing via NIBSS / Paystack Direct
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-4 font-body">
          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Destination Bank Account
            </label>
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="GTBank Nigeria (•••• 4819)">GTBank — 0123844819 (EnnyTech Ent.)</option>
              <option value="Access Bank (•••• 9920)">Access Bank — 0098199920 (QInvite Events)</option>
              <option value="Zenith Bank (•••• 3314)">Zenith Bank — 2100883314 (Corporate)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Transfer Amount ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono text-xs">
                {currency === 'NGN' ? '₦' : '$'}
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={balance}
                min={1000}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold font-mono-numbers focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Max available: {currency === 'NGN' ? '₦' : '$'}{balance.toLocaleString()}</span>
              <button
                type="button"
                onClick={() => setAmount(balance)}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
              >
                Withdraw Max
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <div className="flex justify-between font-medium">
              <span>Settlement Fee (0% subsidized)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Estimated Delivery</span>
              <span className="text-slate-900 dark:text-white font-bold">&lt; 10 Minutes</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing || amount <= 0}
            className="w-full py-3 rounded-xl text-white font-heading font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Authorizing Bank Disburse...
              </>
            ) : (
              <>
                <Building2 size={14} />
                Confirm Transfer {currency === 'NGN' ? '₦' : '$'}{Number(amount).toLocaleString()}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ─── Main Executive Dashboard ─── */
const Home = ({ onOpenNewEvent, onOpenScanner }) => {
  const navigate = useNavigate();
  const { events, guests, activeEventId, setActiveEventId, verifyAndCheckIn, markDispatched } = useEvents();

  // State
  const [currency, setCurrency] = useState('NGN');
  const [selectedEventFilter, setSelectedEventFilter] = useState('ALL');
  const [campaignTab, setCampaignTab] = useState('ALL'); // 'ALL', 'PUBLIC', 'PRIVATE'
  const [guestFilterTab, setGuestFilterTab] = useState('ALL'); // 'ALL', 'CHECKED_IN', 'AWAITING', 'VIP'
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Modals state
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [viewPassGuest, setViewPassGuest] = useState(null);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  // Filtered events
  const displayEvents = useMemo(() => {
    if (campaignTab === 'PUBLIC') return events.filter((e) => e.type === 'PUBLIC');
    if (campaignTab === 'PRIVATE') return events.filter((e) => e.type === 'PRIVATE');
    return events;
  }, [events, campaignTab]);

  // Calculations across events
  const totalRevenue = useMemo(() => events.reduce((sum, e) => sum + (e.revenue || 0), 0), [events]);
  const totalCapacity = useMemo(() => events.reduce((sum, e) => sum + (e.capacity || 0), 0), [events]);
  const totalIssued = useMemo(() => {
    return guests.length + events.reduce((sum, e) => sum + (e.issued || 0), 0);
  }, [guests, events]);

  const totalCheckedIn = useMemo(() => {
    const fromGuests = guests.filter((g) => g.status === 'CHECKED_IN').length;
    const fromEvents = events.reduce((sum, e) => sum + (e.checkedIn || 0), 0);
    return fromGuests + fromEvents;
  }, [guests, events]);

  const publicTicketsCount = useMemo(() => {
    return events.filter((e) => e.type === 'PUBLIC').reduce((sum, e) => sum + (e.issued || 0), 0);
  }, [events]);

  const privateInvitesCount = useMemo(() => {
    return guests.length + events.filter((e) => e.type === 'PRIVATE').reduce((sum, e) => sum + (e.issued || 0), 0);
  }, [guests, events]);

  const settlementBalance = Math.round(totalRevenue * 0.95);

  // Filtered guests table
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      // Event filter
      if (selectedEventFilter !== 'ALL' && g.eventId !== selectedEventFilter) {
        return false;
      }
      // Status/Tier tab
      if (guestFilterTab === 'CHECKED_IN' && g.status !== 'CHECKED_IN') return false;
      if (guestFilterTab === 'AWAITING' && g.status === 'CHECKED_IN') return false;
      if (guestFilterTab === 'VIP') {
        const t = (g.tier || '').toUpperCase();
        if (!t.includes('VIP') && !t.includes('TABLE') && !t.includes('DIGNITARY')) return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          g.name.toLowerCase().includes(q) ||
          g.email.toLowerCase().includes(q) ||
          (g.phone && g.phone.toLowerCase().includes(q)) ||
          (g.tier && g.tier.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [guests, selectedEventFilter, guestFilterTab, searchQuery]);

  // Active event for card preview
  const activeEventForPass = useMemo(() => {
    if (viewPassGuest) {
      return events.find((e) => e.id === viewPassGuest.eventId) || events[0];
    }
    return events.find((e) => e.id === activeEventId) || events[0];
  }, [viewPassGuest, events, activeEventId]);

  // Handlers
  const handleCopyLink = (evt) => {
    const url = `${window.location.origin}/explore?event=${evt.id}`;
    navigator.clipboard?.writeText(url);
    setCopiedId(evt.id);
    toast.success(`Public Box Office link copied for "${evt.name}"!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleQuickCheckIn = (guest) => {
    const res = verifyAndCheckIn(guest.qrToken || guest.id, 'Dashboard Terminal #1');
    if (res.status === 'SUCCESS') {
      toast.success(`${guest.name} checked in successfully!`);
    } else {
      toast.error(res.message);
    }
  };

  const handleWhatsAppDispatch = (guest) => {
    const evt = events.find((e) => e.id === guest.eventId) || events[0];
    markDispatched(guest.id);
    const msg = encodeURIComponent(
      `Hello ${guest.name}! You are cordially invited to ${evt?.name || 'our event'}.\nVenue: ${evt?.venue || 'TBA'}\nTier: ${guest.tier}\nView your VIP Access Pass & QR code here: ${window.location.origin}/dashboard`
    );
    window.open(`https://wa.me/${(guest.phone || '').replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Tier', 'Status', 'Event ID', 'CheckIn Time'];
    const rows = guests.map((g) => [
      g.id,
      `"${g.name}"`,
      g.email,
      g.phone || '',
      `"${g.tier}"`,
      g.status,
      g.eventId,
      g.checkInTime || '',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `qrinvite_attendees_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Attendee roster exported as CSV!');
  };

  // Recent simulated check-in stream
  const liveCheckinStream = useMemo(() => {
    const checked = guests.filter((g) => g.status === 'CHECKED_IN');
    if (checked.length > 0) {
      return checked.slice(0, 4).map((g, idx) => ({
        id: g.id,
        name: g.name,
        tier: g.tier,
        gate: g.gate || 'Gate North [VIP]',
        time: idx === 0 ? '24s ago' : idx === 1 ? '1m ago' : idx === 2 ? '3m ago' : '5m ago',
        isDuplicateBlocked: false,
      }));
    }
    return [
      { id: 'sim_1', name: 'Alhaji Aliko Dangote', tier: 'Dignitary High Table', gate: 'Gate North [VIP]', time: '42s ago', isDuplicateBlocked: false },
      { id: 'sim_2', name: 'Ngozi Okonjo-Iweala', tier: 'Speaker VIP', gate: 'Gate West #1', time: '1m ago', isDuplicateBlocked: false },
      { id: 'sim_3', name: 'Screenshot Duplicate', tier: 'Replay Attempt #8892', gate: 'Gate North #2', time: '2m ago', isDuplicateBlocked: true },
      { id: 'sim_4', name: 'Chidi Mokeme', tier: 'VIP Executive', gate: 'Gate North [VIP]', time: '4m ago', isDuplicateBlocked: false },
    ];
  }, [guests]);

  return (
    <div className="space-y-8 pb-20 animate-fade-up">

      {/* ── Top Executive Header & Command Strip ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-heading">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Gate Mesh Online • Sub-100ms Optical
            </span>
            <span className="text-slate-400 dark:text-slate-600 text-xs">•</span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-body">
              Zero Replay Fraud Mutex Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
            Executive Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-body mt-0.5">
            Real-time synchronization across Box Office ticket sales, WhatsApp VIP invitations, and cryptographic gate scanners.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Currency Toggle */}
          <button
            onClick={() => setCurrency((c) => (c === 'NGN' ? 'USD' : 'NGN'))}
            className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] text-slate-700 dark:text-slate-300 text-xs font-bold font-mono-numbers hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <RefreshCw size={12} className="text-indigo-500" />
            <span>{currency === 'NGN' ? '₦ NGN (Lagos)' : '$ USD (Global)'}</span>
          </button>

          {/* Quick Scanner */}
          <button
            onClick={() => setScannerOpen(true)}
            className="h-9 px-3.5 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-bold font-heading hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <QrCode size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span>Gate Terminal</span>
          </button>

          {/* New Event Button */}
          <button
            onClick={() => setNewEventOpen(true)}
            className="h-9 px-4 rounded-xl text-white text-xs font-bold font-heading uppercase tracking-wider bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* ── 4 Executive KPI Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* 1. Gross Box Office Sales */}
        <div className="card-glow rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11131a] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-heading">
              Gross Box Office & Passes
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono-numbers tracking-tight">
              {currency === 'NGN' ? `₦${totalRevenue.toLocaleString()}` : `$${Math.round(totalRevenue / 1500).toLocaleString()}`}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-body">
              <TrendingUp size={12} />
              <span>+24.8% gate velocity this week</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-body">
            <span>Public Tickets & VIP Tables</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono-numbers">{events.length} active</span>
          </div>
        </div>

        {/* 2. Available Settlement Balance */}
        <div className="card-glow rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11131a] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-heading">
              Settlement Reserve
            </span>
            <button
              onClick={() => setWithdrawModalOpen(true)}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-heading"
            >
              Transfer <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono-numbers tracking-tight">
              {currency === 'NGN' ? `₦${settlementBalance.toLocaleString()}` : `$${Math.round(settlementBalance / 1500).toLocaleString()}`}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-body">
              95% Cleared • Instant same-day payout
            </div>
          </div>

          {/* Mini clearance progress */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex justify-between text-[10px] font-bold mb-1 text-slate-500 dark:text-slate-400">
              <span>Clearing Cycle</span>
              <span className="text-slate-900 dark:text-white font-mono-numbers">GTBank •••4819</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: '95%', background: 'linear-gradient(90deg,#6366f1,#10b981)' }}
              />
            </div>
          </div>
        </div>

        {/* 3. Total Passes Issued & Utilization */}
        <div className="card-glow rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11131a] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-heading">
              Total Passes & Capacity
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Ticket size={16} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono-numbers tracking-tight">
              {totalIssued.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-body">
              {publicTicketsCount} Public Tickets • {privateInvitesCount} Private RSVPs
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-body">
            <span className="text-slate-500 dark:text-slate-400">Venue Fill Rate</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono-numbers">
              {Math.round((totalIssued / (totalCapacity || 1)) * 100)}% of {totalCapacity.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 4. Gate Verification & Optical Speed */}
        <div className="card-glow rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11131a] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-heading">
              Gate Velocity & Security
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Zap size={16} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono-numbers tracking-tight flex items-baseline gap-2">
              <span>{totalCheckedIn.toLocaleString()}</span>
              <span className="text-xs font-semibold text-slate-400 font-body">checked in</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-body">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>&lt; 86ms avg latency • 42 scans/min</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-body">
            <span className="text-slate-500 dark:text-slate-400">Fraud Protection</span>
            <span className="font-bold text-purple-600 dark:text-purple-400 font-mono-numbers">19 Replays Blocked</span>
          </div>
        </div>

      </div>

      {/* ── Main Structured 2-Column Command Workspace ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── Left Area: Active Campaigns & Attendee Roster (8 cols) ── */}
        <div className="lg:col-span-8 space-y-8 min-w-0">

          {/* 1. Active Campaigns Showcase */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-heading tracking-tight flex items-center gap-2">
                  <span>Live Event Campaigns</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {displayEvents.length} Active
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-body">
                  Dual-mode access: public box-office ticketing or private VIP guest invitations.
                </p>
              </div>

              {/* Segmented Filter Pills */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-[11px] font-bold font-heading">
                <button
                  onClick={() => setCampaignTab('ALL')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    campaignTab === 'ALL'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All ({events.length})
                </button>
                <button
                  onClick={() => setCampaignTab('PUBLIC')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    campaignTab === 'PUBLIC'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Public Tickets
                </button>
                <button
                  onClick={() => setCampaignTab('PRIVATE')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    campaignTab === 'PRIVATE'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Private RSVP
                </button>
              </div>
            </div>

            {/* Campaign Cards List */}
            <div className="space-y-3.5">
              {displayEvents.map((evt) => {
                const eventGuests = guests.filter((g) => g.eventId === evt.id);
                const checkedIn = eventGuests.filter((g) => g.status === 'CHECKED_IN').length + (evt.checkedIn || 0);
                const issued = eventGuests.length + (evt.issued || 0);
                const pct = Math.min(100, Math.round((checkedIn / (evt.capacity || 1)) * 100));

                return (
                  <div
                    key={evt.id}
                    className="card-glow rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11131a] hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row gap-5 shadow-xs"
                  >
                    {/* Event Banner Thumbnail */}
                    <div className="w-full md:w-36 h-28 rounded-xl overflow-hidden shrink-0 relative bg-slate-900">
                      <img
                        src={evt.banner}
                        alt={evt.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[10px] font-bold">
                        <span className="font-mono-numbers">{evt.date}</span>
                        <span>{evt.time}</span>
                      </div>
                    </div>

                    {/* Middle Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <PassModeBadge type={evt.type} />
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-body">
                          {evt.category}
                        </span>
                        {evt.revenue > 0 && (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono-numbers bg-emerald-500/10 px-2 py-0.2 rounded-md">
                            ₦{evt.revenue.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 
                          onClick={() => {
                            setActiveEventId(evt.id);
                            navigate(`/events/${evt.id}`);
                          }}
                          className="font-heading font-extrabold text-[15px] sm:text-[16px] text-slate-900 dark:text-white tracking-tight truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="View Event Manage Overview"
                        >
                          {evt.name}
                        </h3>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 font-body truncate mt-0.5">
                          {evt.venue}
                        </p>
                      </div>

                      {/* Capacity progress */}
                      <div className="pt-1 max-w-md">
                        <div className="flex justify-between text-[11px] font-semibold mb-1">
                          <span className="text-slate-600 dark:text-slate-300 font-body">
                            {checkedIn} checked in / {issued} issued ({evt.capacity} cap)
                          </span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-mono-numbers font-bold">
                            {pct}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${pct}%`,
                              background: evt.type === 'PRIVATE'
                                ? 'linear-gradient(90deg,#f59e0b,#fbbf24)'
                                : 'linear-gradient(90deg,#6366f1,#06b6d4)'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons Column */}
                    <div className="flex md:flex-col gap-2 md:w-36 shrink-0 justify-end md:justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800/80 pt-3 md:pt-0 md:pl-4">
                      {/* Manage Overview button */}
                      <button
                        onClick={() => {
                          setActiveEventId(evt.id);
                          navigate(`/events/${evt.id}`);
                        }}
                        className="flex-1 md:flex-none h-8 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold font-heading flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <Activity size={13} />
                        <span>Manage Overview</span>
                      </button>

                      {/* Gate Scan button */}
                      <button
                        onClick={() => {
                          setActiveEventId(evt.id);
                          setScannerOpen(true);
                        }}
                        className="flex-1 md:flex-none h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-heading"
                      >
                        <QrCode size={13} className="text-indigo-500" />
                        <span>Gate Scan</span>
                      </button>

                      {/* Manage Guests */}
                      <button
                        onClick={() => {
                          setActiveEventId(evt.id);
                          navigate('/guests');
                        }}
                        className="flex-1 md:flex-none h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-bold font-heading flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Users size={13} />
                        <span>Guest List</span>
                      </button>

                      {/* Public Link / WhatsApp Card preview */}
                      {evt.type === 'PUBLIC' ? (
                        <button
                          onClick={() => handleCopyLink(evt)}
                          className="hidden md:flex h-7 px-2 rounded-lg text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors items-center justify-center gap-1 cursor-pointer"
                        >
                          {copiedId === evt.id ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                          <span>{copiedId === evt.id ? 'Copied' : 'Share Link'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveEventId(evt.id);
                            setViewPassGuest(eventGuests[0] || guests[0]);
                          }}
                          className="hidden md:flex h-7 px-2 rounded-lg text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline transition-colors items-center justify-center gap-1 cursor-pointer"
                        >
                          <Sparkles size={11} />
                          <span>Card Designer</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Real-Time Attendee Roster & Pass Dispatch Desk */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-heading tracking-tight flex items-center gap-2">
                  <span>Guest Roster & Verification Desk</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono-numbers">
                    {filteredGuests.length} Loaded
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-body">
                  Issue luxury WhatsApp card invitations with embedded Ed25519 QR codes or verify gate entry.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBulkOpen(true)}
                  className="h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] text-slate-700 dark:text-slate-300 text-xs font-bold font-heading hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus size={13} />
                  <span>Import CSV</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131a] text-slate-700 dark:text-slate-300 text-xs font-bold font-heading hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download size={13} />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="card-glow rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11131a] shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5">
                {/* Search */}
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search attendee name, email, phone, or tier..."
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-body"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter by event selector */}
                <div className="sm:w-56 shrink-0">
                  <select
                    value={selectedEventFilter}
                    onChange={(e) => setSelectedEventFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white font-heading font-semibold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ALL">All Event Rosters</option>
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name.length > 24 ? e.name.slice(0, 24) + '...' : e.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-heading font-bold">
                {[
                  { id: 'ALL', label: 'All Attendees' },
                  { id: 'CHECKED_IN', label: 'Checked In' },
                  { id: 'AWAITING', label: 'Awaiting Gate' },
                  { id: 'VIP', label: 'VIP & High Tables' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setGuestFilterTab(tab.id)}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                      guestFilterTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Attendees Table */}
            <div className="card-glow rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11131a] shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-body">
                  <thead>
                    <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 uppercase text-[10px] font-bold font-heading tracking-wider">
                      <th className="py-3 px-4">Attendee Identity</th>
                      <th className="py-3 px-4">Access Tier</th>
                      <th className="py-3 px-4">Gate Status</th>
                      <th className="py-3 px-4">WhatsApp Dispatch</th>
                      <th className="py-3 px-4 text-right">Pass Studio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {filteredGuests.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400 font-body">
                          No attendees match this filter or search query.
                        </td>
                      </tr>
                    ) : (
                      filteredGuests.slice(0, 6).map((g) => {
                        const evt = events.find((e) => e.id === g.eventId);
                        const initials = g.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase();

                        return (
                          <tr
                            key={g.id}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                          >
                            {/* Identity */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 font-heading">
                                  {initials}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-[13px] text-slate-900 dark:text-white font-heading truncate">
                                    {g.name}
                                  </div>
                                  <div className="text-[11px] text-slate-400 truncate">
                                    {g.email}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Tier & Table */}
                            <td className="py-3.5 px-4">
                              <div className="space-y-1">
                                <TierBadge tier={g.tier} />
                                {g.table && (
                                  <div className="text-[10px] text-slate-400 font-mono-numbers">
                                    {g.table}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Gate Status */}
                            <td className="py-3.5 px-4">
                              <StatusDot status={g.status} time={g.checkInTime ? new Date(g.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null} />
                            </td>

                            {/* Dispatch */}
                            <td className="py-3.5 px-4">
                              {g.dispatched ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-body">
                                  <CheckCircle2 size={13} />
                                  <span>Sent to WhatsApp</span>
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleWhatsAppDispatch(g)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-bold font-heading transition-colors cursor-pointer border border-emerald-500/20"
                                >
                                  <Send size={11} /> 1-Click Send
                                </button>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {g.status !== 'CHECKED_IN' ? (
                                  <button
                                    onClick={() => handleQuickCheckIn(g)}
                                    className="h-7 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 text-[11px] font-bold text-slate-600 dark:text-slate-300 transition-all cursor-pointer font-heading"
                                    title="Manually mark checked in"
                                  >
                                    Check In
                                  </button>
                                ) : (
                                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold px-2">
                                    Gate In
                                  </span>
                                )}

                                <button
                                  onClick={() => {
                                    setActiveEventId(g.eventId);
                                    setViewPassGuest(g);
                                  }}
                                  className="h-7 px-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 text-[11px] font-bold font-heading transition-all cursor-pointer flex items-center gap-1 border border-indigo-200 dark:border-indigo-500/20"
                                >
                                  <Sparkles size={11} />
                                  <span>Card & QR</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-[11px] font-body text-slate-500 dark:text-slate-400">
                <span>Showing first {Math.min(6, filteredGuests.length)} of {filteredGuests.length} attendees</span>
                <button
                  onClick={() => navigate('/guests')}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-heading cursor-pointer"
                >
                  View Full Roster & Bulk Dispatches <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ── Right Rail: Gate Mesh & Real-Time Intelligence (4 cols) ── */}
        <div className="lg:col-span-4 space-y-6">

          {/* 1. Gate Hardware Terminal Nodes & Anti-Fraud */}
          <div className="card-glow rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11131a] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-[15px] text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span>Gate Scanner Mesh</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-body">
                  Sub-100ms optical decode with zero double-spend
                </p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Terminal Nodes */}
            <div className="space-y-2.5">
              {[
                { name: 'Gate North (Main Arena & Tables)', scans: 618, status: 'Online • 4G LTE', color: 'emerald' },
                { name: 'Gate West (VIP & Dignitaries)', scans: 112, status: 'Online • Optical Camera', color: 'cyan' },
                { name: 'Gate South (Media & Production)', scans: 84, status: 'Online • Handheld Scanner', color: 'indigo' },
              ].map((term) => (
                <div
                  key={term.name}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-xs text-slate-900 dark:text-white font-heading truncate">
                      {term.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-body flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      <span>{term.status}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-black font-mono-numbers text-slate-900 dark:text-white">
                      {term.scans}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold font-heading">
                      Scanned
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Security Mutex Stats */}
            <div className="p-3 rounded-xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-heading">
                <span className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                  <ShieldCheck size={13} /> Screenshot Replay Lock
                </span>
                <span className="font-black font-mono-numbers text-purple-600 dark:text-purple-400">
                  19 REJECTED
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-body">
                Concurrent entry attempts with identical QR tokens were neutralized in &lt; 50ms.
              </p>
            </div>

            {/* Launch Scanner CTA */}
            <button
              onClick={() => setScannerOpen(true)}
              className="w-full py-2.5 rounded-xl text-white font-heading font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <QrCode size={14} /> Launch Gate Scanner Terminal
            </button>
          </div>

          {/* 2. Live Check-In Activity Stream */}
          <div className="card-glow rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11131a] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-[15px] text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Activity size={16} className="text-cyan-500" />
                  <span>Real-time Gate Feed</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-body">
                  Live verification pulse at event entrances
                </p>
              </div>
              <span className="text-[10px] font-bold font-mono-numbers text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                LIVE
              </span>
            </div>

            {/* Stream List */}
            <div className="space-y-2.5">
              {liveCheckinStream.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border transition-all ${
                    item.isDuplicateBlocked
                      ? 'bg-red-500/5 dark:bg-red-500/10 border-red-500/25'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-white font-heading truncate">
                          {item.name}
                        </span>
                        {item.isDuplicateBlocked && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-500/20 text-red-500 uppercase">
                            Blocked
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-body mt-0.5">
                        {item.tier} • {item.gate}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono-numbers text-slate-400 shrink-0">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Organizer Launchpad Shortcuts */}
          <div className="card-glow rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11131a] shadow-xs space-y-3">
            <h3 className="font-heading font-extrabold text-[14px] text-slate-900 dark:text-white tracking-tight">
              Organizer Quick Actions
            </h3>

            <div className="grid grid-cols-1 gap-2 text-xs font-heading font-bold">
              <button
                onClick={() => {
                  setViewPassGuest(guests[0] || null);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Design WhatsApp VIP Card</span>
                </div>
                <ChevronRight size={13} className="text-slate-400" />
              </button>

              <button
                onClick={() => setBulkOpen(true)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-indigo-500" />
                  <span>Ingest 100+ CSV Guest List</span>
                </div>
                <ChevronRight size={13} className="text-slate-400" />
              </button>

              <button
                onClick={handleExportCSV}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Download size={14} className="text-cyan-500" />
                  <span>Download Gate Audit CSV</span>
                </div>
                <ChevronRight size={13} className="text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/explore')}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-emerald-500" />
                  <span>Public Box Office Discovery</span>
                </div>
                <ExternalLink size={13} className="text-slate-400" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ── Modals ── */}
      <NewEventModal
        isOpen={newEventOpen}
        onClose={() => setNewEventOpen(false)}
      />
      <ScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />
      <BulkGuestModal
        isOpen={bulkOpen}
        onClose={() => setBulkOpen(false)}
      />
      <InvitationCardModal
        isOpen={Boolean(viewPassGuest)}
        onClose={() => setViewPassGuest(null)}
        guest={viewPassGuest}
        event={activeEventForPass}
      />
      <WithdrawModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        balance={settlementBalance}
        currency={currency}
      />

    </div>
  );
};

export default Home;
