import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Search, Filter, Plus, QrCode, Send, Download, Upload,
  CheckCircle2, Clock, AlertTriangle, MoreHorizontal,
  Users, Mail, Phone, Shield, Trash2, Eye,
  ChevronUp, ChevronDown, X, UserCheck, MessageCircle,
  Sparkles, Lock, Globe, Share2, Calendar, MapPin,
  ChevronRight, ExternalLink, RefreshCw, Layers
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEvents } from '../context/EventContext';
import BulkGuestModal from '../components/modals/BulkGuestModal';
import InvitationCardModal from '../components/modals/InvitationCardModal';

const TIERS = ['ALL', 'VVIP', 'VIP', 'REGULAR', 'HIGH TABLE', 'VENDOR', 'MEDIA'];
const STATUSES = ['ALL', 'CHECKED_IN', 'VALID', 'REVOKED'];

const TIER_STYLE = {
  VVIP: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  VIP: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
  REGULAR: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  'HIGH TABLE': 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  VENDOR: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  MEDIA: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
};

const STATUS_STYLE = {
  CHECKED_IN: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle2, label: 'Checked In' },
  VALID: { color: 'text-zinc-400', bg: 'bg-zinc-500/10', icon: Clock, label: 'Awaiting' },
  REVOKED: { color: 'text-red-400', bg: 'bg-red-500/10', icon: AlertTriangle, label: 'Revoked' },
};

const GuestsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const eventParam = searchParams.get('eventId') || searchParams.get('event');

  const {
    events,
    guests,
    activeEventId,
    setActiveEventId,
    revokeGuest,
    deleteGuest,
    markDispatched,
  } = useEvents();

  // Active tab filter: 'ALL' (grouped view) or specific event.id
  const [activeTab, setActiveTab] = useState(eventParam || 'ALL');
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Set of collapsed event IDs
  const [collapsedEvents, setCollapsedEvents] = useState(new Set());

  // Modal states
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [targetEventForAdd, setTargetEventForAdd] = useState(null);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [activeCardGuest, setActiveCardGuest] = useState(null);
  const [activeCardEvent, setActiveCardEvent] = useState(null);

  // Selected guests per event for batch actions: { [eventId]: Set<guestId> }
  const [selectedGuestsByEvent, setSelectedGuestsByEvent] = useState({});

  // Global counts
  const totalGuestsCount = guests.length;
  const totalCheckedIn = guests.filter((g) => g.status === 'CHECKED_IN').length;
  const totalDispatched = guests.filter((g) => g.dispatched).length;

  // Toggle collapse for an event section
  const toggleCollapseEvent = (eventId) => {
    setCollapsedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  };

  const collapseAll = () => {
    setCollapsedEvents(new Set(events.map((e) => e.id)));
  };

  const expandAll = () => {
    setCollapsedEvents(new Set());
  };

  // Open Add Guests modal pre-targeted to a specific event
  const handleOpenAddForEvent = (eventObj) => {
    setTargetEventForAdd(eventObj.id);
    setActiveEventId(eventObj.id);
    setBulkModalOpen(true);
  };

  // Open Card Designer for a specific guest
  const handleOpenCardDesigner = (guest, eventObj) => {
    setActiveCardGuest(guest);
    setActiveCardEvent(eventObj);
    setCardModalOpen(true);
  };

  // WhatsApp quick dispatch
  const handleQuickWhatsApp = (guest, eventObj) => {
    const passUrl = `${window.location.origin}/pass/${guest.qrToken || guest.id}`;
    const text = encodeURIComponent(
      `Hello ${guest.name}!\n\n` +
      `You are cordially invited to *${eventObj.name}*.\n\n` +
      `📅 Date: ${eventObj.date} at ${eventObj.time || '14:00'}\n` +
      `📍 Venue: ${eventObj.venue}\n` +
      `🎟️ Access Tier: ${guest.tier} (${guest.table || 'Reserved Seating'})\n\n` +
      `View & save your digital QR pass here:\n` +
      `${passUrl}`
    );

    const cleanPhone = (guest.phone || '').replace(/[^0-9]/g, '');
    const url = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`
      : `https://api.whatsapp.com/send?text=${text}`;

    window.open(url, '_blank');
    markDispatched(guest.id);
    toast.success(`WhatsApp launched for ${guest.name}! Marked as sent.`);
  };

  // Multi-select helpers for a specific event
  const handleSelectAllForEvent = (eventId, eventGuestsList) => {
    setSelectedGuestsByEvent((prev) => {
      const current = prev[eventId] || new Set();
      const allSelected = current.size === eventGuestsList.length;
      return {
        ...prev,
        [eventId]: allSelected ? new Set() : new Set(eventGuestsList.map((g) => g.id)),
      };
    });
  };

  const toggleSelectGuest = (eventId, guestId) => {
    setSelectedGuestsByEvent((prev) => {
      const current = new Set(prev[eventId] || []);
      if (current.has(guestId)) current.delete(guestId);
      else current.add(guestId);
      return {
        ...prev,
        [eventId]: current,
      };
    });
  };

  // Filtered Events list according to top tab selection
  const visibleEvents = useMemo(() => {
    if (activeTab === 'ALL') return events;
    return events.filter((e) => e.id === activeTab);
  }, [events, activeTab]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* ─── Top Header & Primary Actions ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Guest List & Invitations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Organized by Event
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Personalized guest rosters, WhatsApp invitation cards, and gate access grouped under each event.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleOpenAddForEvent(events[0] || { id: activeEventId })}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Guests / Ingest CSV</span>
          </button>
        </div>
      </div>

      {/* ─── Top Platform Metrics Across All Events ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card-glow p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] flex items-center justify-between">
            <span>Total Events</span>
            <Calendar size={14} className="text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-[var(--text-primary)] mt-1">{events.length}</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Active event rosters</div>
        </div>

        <div className="card-glow p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] flex items-center justify-between">
            <span>Total Registered Guests</span>
            <Users size={14} className="text-purple-400" />
          </div>
          <div className="text-2xl font-black text-[var(--text-primary)] mt-1">{totalGuestsCount}</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Across all invitations</div>
        </div>

        <div className="card-glow p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] flex items-center justify-between">
            <span>WhatsApp / Email Passes Sent</span>
            <Send size={14} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{totalDispatched}</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
            {totalGuestsCount > 0 ? Math.round((totalDispatched / totalGuestsCount) * 100) : 0}% delivery rate
          </div>
        </div>

        <div className="card-glow p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] flex items-center justify-between">
            <span>Gate Check-Ins Verified</span>
            <CheckCircle2 size={14} className="text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 mt-1">{totalCheckedIn}</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
            {totalGuestsCount > 0 ? Math.round((totalCheckedIn / totalGuestsCount) * 100) : 0}% attendance verified
          </div>
        </div>
      </div>

      {/* ─── Event Navigation Pills Bar ─── */}
      <div className="p-2 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'ALL'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
          }`}
        >
          <Layers size={13} />
          <span>All Events ({events.length})</span>
        </button>

        {events.map((evt) => {
          const count = guests.filter((g) => g.eventId === evt.id).length;
          const isSelected = activeTab === evt.id;

          return (
            <button
              key={evt.id}
              onClick={() => setActiveTab(evt.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              <span>{evt.type === 'PRIVATE' ? '🔒' : '🌍'}</span>
              <span className="truncate max-w-[160px]">{evt.name}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isSelected ? 'bg-white/20 text-white' : 'bg-[var(--bg-subtle)] text-[var(--text-tertiary)]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── Search, Tier & Status Filter Bar ─── */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            placeholder="Search guests by name, phone, table number, or token..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Tier & Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          
          {/* Tier Dropdown */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--text-primary)] text-xs font-semibold focus:outline-none focus:border-indigo-500"
          >
            {TIERS.map((t) => (
              <option key={t} value={t}>Tier: {t}</option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--text-primary)] text-xs font-semibold focus:outline-none focus:border-indigo-500"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>Status: {s}</option>
            ))}
          </select>

          {/* Expand/Collapse All */}
          {activeTab === 'ALL' && (
            <div className="flex items-center gap-1 border-l border-[var(--border)] pl-2">
              <button
                onClick={expandAll}
                className="px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Collapse
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ─── DEDICATED SECTIONS: GUEST LIST UNDER EACH EVENT ─── */}
      <div className="space-y-8">
        {visibleEvents.map((evt) => {
          const isCollapsed = collapsedEvents.has(evt.id);

          // Get guests strictly for this event
          const eventAllGuests = guests.filter((g) => g.eventId === evt.id);
          
          // Apply search and status filters for this event's list
          const eventFilteredGuests = eventAllGuests.filter((guest) => {
            const matchStatus = selectedStatus === 'ALL' || guest.status === selectedStatus;
            const matchTier = selectedTier === 'ALL' || (guest.tier || '').toUpperCase().includes(selectedTier);
            const matchSearch =
              !searchQuery ||
              guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (guest.email && guest.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (guest.phone && guest.phone.includes(searchQuery)) ||
              (guest.table && guest.table.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (guest.qrToken && guest.qrToken.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchStatus && matchTier && matchSearch;
          });

          // Metrics for this event
          const evtGuestsCount = eventAllGuests.length;
          const evtCheckedIn = eventAllGuests.filter((g) => g.status === 'CHECKED_IN').length;
          const evtDispatched = eventAllGuests.filter((g) => g.dispatched).length;
          const checkInPct = evtGuestsCount > 0 ? Math.round((evtCheckedIn / evtGuestsCount) * 100) : 0;

          const selectedInEvt = selectedGuestsByEvent[evt.id] || new Set();

          return (
            <div
              key={evt.id}
              className="card-glow rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-xl overflow-hidden transition-all duration-200"
            >
              
              {/* ─── Event Header Banner ─── */}
              <div className="p-5 sm:p-6 border-b border-[var(--border)] bg-gradient-to-r from-[var(--bg-subtle)]/70 via-[var(--bg-surface)] to-[var(--bg-subtle)]/50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Event Meta Details */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        evt.type === 'PRIVATE'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {evt.type === 'PRIVATE' ? <Lock size={11} /> : <Globe size={11} />}
                        <span>{evt.type === 'PRIVATE' ? 'Private VIP Invitation Roster' : 'Public Ticketed Roster'}</span>
                      </span>

                      <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
                        ID: {evt.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <h2 className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                        {evt.name}
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-indigo-400" />
                        <span>{evt.date} • {evt.time || '14:00'}</span>
                      </span>
                      <span className="flex items-center gap-1 truncate max-w-xs">
                        <MapPin size={13} className="text-rose-400" />
                        <span>{evt.venue}</span>
                      </span>
                    </div>
                  </div>

                  {/* Event Stats Pills & Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    
                    {/* Guest Count Pill */}
                    <div className="px-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] text-center">
                      <span className="text-[10px] uppercase font-bold text-[var(--text-tertiary)] block">Guests</span>
                      <span className="text-xs font-black text-[var(--text-primary)] font-mono">
                        {evtGuestsCount}
                      </span>
                    </div>

                    {/* Dispatched Pill */}
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block">Sent</span>
                      <span className="text-xs font-black text-emerald-400 font-mono">
                        {evtDispatched}
                      </span>
                    </div>

                    {/* Checked In Pill */}
                    <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 block">Checked In</span>
                      <span className="text-xs font-black text-cyan-400 font-mono">
                        {evtCheckedIn} ({checkInPct}%)
                      </span>
                    </div>

                    {/* Action: Add Guest to this specific event */}
                    <button
                      onClick={() => handleOpenAddForEvent(evt)}
                      className="h-9 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer active:scale-95"
                    >
                      <Plus size={14} />
                      <span>Add to Event</span>
                    </button>

                    {/* Action: Collapse/Expand */}
                    <button
                      onClick={() => toggleCollapseEvent(evt.id)}
                      className="h-9 w-9 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition-colors cursor-pointer"
                      title={isCollapsed ? 'Expand guest list' : 'Collapse guest list'}
                    >
                      {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </button>

                  </div>

                </div>
              </div>

              {/* ─── Dedicated Guest Table Under This Event ─── */}
              {!isCollapsed && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-[var(--border)] bg-[var(--bg-subtle)]/70 text-[var(--text-tertiary)] font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 pl-5 pr-2 w-8">
                          <input
                            type="checkbox"
                            checked={selectedInEvt.size > 0 && selectedInEvt.size === eventFilteredGuests.length}
                            onChange={() => handleSelectAllForEvent(evt.id, eventFilteredGuests)}
                            className="w-3.5 h-3.5 rounded border border-[var(--border)] bg-[var(--bg-subtle)] text-indigo-500 cursor-pointer accent-indigo-500"
                          />
                        </th>
                        <th className="py-3 pr-4">Invited Attendee</th>
                        <th className="py-3 pr-4">Access Tier</th>
                        <th className="py-3 pr-4">Table / Seating</th>
                        <th className="py-3 pr-4">Gate Status</th>
                        <th className="py-3 pr-4">WhatsApp / Pass</th>
                        <th className="py-3 pr-5 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[var(--border)]">
                      {eventFilteredGuests.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-[var(--text-tertiary)]">
                            <Users size={28} className="mx-auto mb-2 opacity-40 text-indigo-400" />
                            <p className="font-semibold text-xs text-[var(--text-primary)]">
                              {searchQuery || selectedTier !== 'ALL' || selectedStatus !== 'ALL'
                                ? `No guests in "${evt.name}" match your filters.`
                                : `No guests have been registered for "${evt.name}" yet.`}
                            </p>
                            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                              Click "Add to Event" above to create guest passes or ingest a CSV roster.
                            </p>
                            <div className="mt-3">
                              <button
                                onClick={() => handleOpenAddForEvent(evt)}
                                className="px-3.5 py-1.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                              >
                                <Plus size={13} />
                                <span>Add First Guest to {evt.name}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        eventFilteredGuests.map((guest) => {
                          const st = STATUS_STYLE[guest.status] || STATUS_STYLE.VALID;
                          const StIcon = st.icon;
                          const isSelected = selectedInEvt.has(guest.id);

                          return (
                            <tr
                              key={guest.id}
                              className={`hover:bg-[var(--bg-subtle)]/50 transition-colors ${
                                isSelected ? 'bg-indigo-500/5' : ''
                              }`}
                            >
                              {/* Checkbox */}
                              <td className="py-3.5 pl-5 pr-2">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelectGuest(evt.id, guest.id)}
                                  className="w-3.5 h-3.5 rounded border border-[var(--border)] bg-[var(--bg-subtle)] text-indigo-500 cursor-pointer accent-indigo-500"
                                />
                              </td>

                              {/* Guest Attendee Info */}
                              <td className="py-3.5 pr-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center text-[11px] font-bold text-indigo-400 shrink-0">
                                    {guest.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                  </div>
                                  <div>
                                    <div className="font-bold text-xs text-[var(--text-primary)]">
                                      {guest.name}
                                    </div>
                                    <div className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-2">
                                      {guest.phone && <span>{guest.phone}</span>}
                                      {guest.email && <span className="hidden sm:inline">• {guest.email}</span>}
                                      {guest.plusOnes > 0 && (
                                        <span className="text-indigo-400 font-semibold">
                                          +{guest.plusOnes} guest
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Access Tier */}
                              <td className="py-3.5 pr-4">
                                <div className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                  TIER_STYLE[guest.tier] || TIER_STYLE.REGULAR
                                }`}>
                                  {guest.tier || 'REGULAR'}
                                </div>
                              </td>

                              {/* Table / Seating */}
                              <td className="py-3.5 pr-4 font-mono text-[11px] text-[var(--text-secondary)]">
                                {guest.table ? (
                                  <span className="text-[var(--text-primary)] font-semibold">
                                    {guest.table}
                                  </span>
                                ) : (
                                  <span className="text-[var(--text-tertiary)] italic">Open Seating</span>
                                )}
                              </td>

                              {/* Gate Status */}
                              <td className="py-3.5 pr-4">
                                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${st.color} ${st.bg}`}>
                                  <StIcon size={11} strokeWidth={2.5} />
                                  <span>{st.label}</span>
                                </div>
                                {guest.checkInTime && (
                                  <div className="text-[10px] text-[var(--text-tertiary)] font-mono mt-0.5">
                                    {new Date(guest.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {guest.gate || 'Gate 1'}
                                  </div>
                                )}
                              </td>

                              {/* WhatsApp Delivery */}
                              <td className="py-3.5 pr-4">
                                {guest.dispatched ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                                    <CheckCircle2 size={12} /> Dispatched ✓
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--text-tertiary)]">
                                    <Clock size={12} /> Pending Send
                                  </span>
                                )}
                              </td>

                              {/* Action Buttons */}
                              <td className="py-3.5 pr-5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Card Designer & JPEG Export */}
                                  <button
                                    onClick={() => handleOpenCardDesigner(guest, evt)}
                                    title="Open Holographic Card Designer"
                                    className="px-2.5 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/25 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                                  >
                                    <Sparkles size={12} />
                                    <span>Card & QR</span>
                                  </button>

                                  {/* Quick WhatsApp Dispatch */}
                                  <button
                                    onClick={() => handleQuickWhatsApp(guest, evt)}
                                    title="Send Pass via WhatsApp"
                                    className="p-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 transition-all cursor-pointer"
                                  >
                                    <MessageCircle size={14} />
                                  </button>

                                  {/* Delete */}
                                  <button
                                    onClick={() => deleteGuest(guest.id)}
                                    title="Revoke / Delete Pass"
                                    className="p-1.5 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
                                  >
                                    <Trash2 size={14} />
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
              )}

            </div>
          );
        })}
      </div>

      {/* ─── Global Modals ─── */}
      <BulkGuestModal
        isOpen={bulkModalOpen}
        onClose={() => {
          setBulkModalOpen(false);
          setTargetEventForAdd(null);
        }}
        defaultEventId={targetEventForAdd || (events[0] && events[0].id)}
      />

      <InvitationCardModal
        isOpen={cardModalOpen}
        onClose={() => {
          setCardModalOpen(false);
          setActiveCardGuest(null);
          setActiveCardEvent(null);
        }}
        guest={activeCardGuest}
        event={activeCardEvent || events[0]}
      />

    </div>
  );
};

export default GuestsPage;
