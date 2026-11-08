import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, Filter, Plus, QrCode, Send, Download, Upload,
  CheckCircle2, Clock, AlertTriangle, MoreHorizontal,
  Users, Mail, Phone, Shield, Trash2, Eye,
  ChevronUp, ChevronDown, X, UserCheck, MessageCircle,
  Sparkles, Lock, Globe, Share2, Calendar, MapPin,
  ChevronRight, ExternalLink, RefreshCw, Layers, LayoutGrid,
  ArrowLeft, ArrowRight, Radio, Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEvents } from '../context/EventContext';
import BulkGuestModal from '../components/modals/BulkGuestModal';
import InvitationCardModal from '../components/modals/InvitationCardModal';

const TIERS = ['ALL', 'VVIP', 'VIP', 'REGULAR', 'HIGH TABLE', 'VENDOR', 'MEDIA'];
const STATUSES = ['ALL', 'CHECKED_IN', 'VALID', 'REVOKED'];

const TIER_STYLE = {
  VVIP: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
  VIP: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
  REGULAR: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
  'HIGH TABLE': 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  VENDOR: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  MEDIA: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
};

const STATUS_STYLE = {
  CHECKED_IN: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2, label: 'Checked In' },
  VALID: { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20', icon: Clock, label: 'Awaiting Gate' },
  REVOKED: { color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', icon: AlertTriangle, label: 'Revoked' },
};

const GuestsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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

  // Mode: 'catalog' (first view to settle on an event) | 'roster' (management for chosen event)
  const initialMode = eventParam ? 'roster' : 'catalog';
  const [viewMode, setViewMode] = useState(initialMode);
  const [selectedEventId, setSelectedEventId] = useState(eventParam || activeEventId || events[0]?.id);

  // Filters for the Event Catalog View
  const [catalogTab, setCatalogTab] = useState('ALL'); // 'ALL' | 'PUBLIC' | 'PRIVATE'
  const [catalogSearch, setCatalogSearch] = useState('');

  // Filters for the Roster View
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [rosterSearch, setRosterSearch] = useState('');

  // Dropdown switcher inside Roster view
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Modal states
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [targetEventForAdd, setTargetEventForAdd] = useState(null);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [activeCardGuest, setActiveCardGuest] = useState(null);
  const [activeCardEvent, setActiveCardEvent] = useState(null);

  // Multi-select for batch actions on current settled event
  const [selectedGuestIds, setSelectedGuestIds] = useState(new Set());

  // Global counts across all events
  const totalGuestsCount = guests.length;
  const totalCheckedIn = guests.filter((g) => g.status === 'CHECKED_IN').length;
  const totalDispatched = guests.filter((g) => g.dispatched).length;

  // Synchronize URL param with state
  useEffect(() => {
    const param = searchParams.get('eventId') || searchParams.get('event');
    if (param && events.some((e) => e.id === param)) {
      setSelectedEventId(param);
      setActiveEventId(param);
      setViewMode('roster');
    } else if (!param) {
      setViewMode('catalog');
    }
  }, [searchParams, events, setActiveEventId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setEventDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Current settled event object
  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0] || {};
  }, [events, selectedEventId]);

  // Filtered events for Catalog view
  const filteredCatalogEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchTab = catalogTab === 'ALL' || evt.type === catalogTab;
      const matchSearch =
        !catalogSearch ||
        evt.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        evt.venue.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        (evt.hostName && evt.hostName.toLowerCase().includes(catalogSearch.toLowerCase()));
      return matchTab && matchSearch;
    });
  }, [events, catalogTab, catalogSearch]);

  // Guests for the settled event
  const currentEventGuests = useMemo(() => {
    return guests.filter((g) => g.eventId === currentEvent.id);
  }, [guests, currentEvent.id]);

  // Filtered guests for current event's table
  const filteredGuests = useMemo(() => {
    return currentEventGuests.filter((guest) => {
      const matchStatus = selectedStatus === 'ALL' || guest.status === selectedStatus;
      const matchTier = selectedTier === 'ALL' || (guest.tier || '').toUpperCase().includes(selectedTier);
      const matchSearch =
        !rosterSearch ||
        guest.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
        (guest.email && guest.email.toLowerCase().includes(rosterSearch.toLowerCase())) ||
        (guest.phone && guest.phone.includes(rosterSearch)) ||
        (guest.table && guest.table.toLowerCase().includes(rosterSearch.toLowerCase())) ||
        (guest.qrToken && guest.qrToken.toLowerCase().includes(rosterSearch.toLowerCase()));

      return matchStatus && matchTier && matchSearch;
    });
  }, [currentEventGuests, selectedStatus, selectedTier, rosterSearch]);

  // Settle on an event and enter its roster
  const handleSettleEvent = (evt) => {
    setSelectedEventId(evt.id);
    setActiveEventId(evt.id);
    setViewMode('roster');
    setSearchParams({ eventId: evt.id });
    setSelectedGuestIds(new Set());
    toast.success(`Entered guest list for "${evt.name}"`);
  };

  // Back to All Events Catalog
  const handleBackToCatalog = () => {
    setViewMode('catalog');
    setSearchParams({});
  };

  // Open Add Guests Studio Page pre-targeted to current event
  const handleOpenAddForEvent = (eventObj) => {
    const target = eventObj || currentEvent;
    if (target?.id) {
      setActiveEventId(target.id);
      navigate(`/guests/add?eventId=${target.id}`);
    } else {
      navigate('/guests/add');
    }
  };

  // Open Card Designer for a specific guest
  const handleOpenCardDesigner = (guest, eventObj) => {
    setActiveCardGuest(guest);
    setActiveCardEvent(eventObj || currentEvent);
    setCardModalOpen(true);
  };

  // WhatsApp quick dispatch
  const handleQuickWhatsApp = (guest, eventObj) => {
    const targetEvt = eventObj || currentEvent;
    const passUrl = `${window.location.origin}/pass/${guest.qrToken || guest.id}`;
    const text = encodeURIComponent(
      `Hello ${guest.name}!\n\n` +
      `You are cordially invited to *${targetEvt.name}*.\n\n` +
      `📅 Date: ${targetEvt.date} at ${targetEvt.time || '14:00'}\n` +
      `📍 Venue: ${targetEvt.venue}\n` +
      `🎟️ Access Tier: ${guest.tier || 'VIP'} (${guest.table || 'Reserved Seating'})\n\n` +
      `View & save your digital QR pass here:\n` +
      `${passUrl}`
    );

    const cleanPhone = (guest.phone || '').replace(/[^0-9]/g, '');
    const url = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`
      : `https://api.whatsapp.com/send?text=${text}`;

    window.open(url, '_blank');
    markDispatched(guest.id);
    toast.success(`WhatsApp launched for ${guest.name}! Marked as dispatched.`);
  };

  // Batch Select Checkboxes
  const handleSelectAll = () => {
    if (selectedGuestIds.size === filteredGuests.length) {
      setSelectedGuestIds(new Set());
    } else {
      setSelectedGuestIds(new Set(filteredGuests.map((g) => g.id)));
    }
  };

  const toggleSelectGuest = (guestId) => {
    setSelectedGuestIds((prev) => {
      const next = new Set(prev);
      if (next.has(guestId)) next.delete(guestId);
      else next.add(guestId);
      return next;
    });
  };

  // Export current event roster as CSV
  const handleExportCSV = () => {
    const headers = ['Full Name', 'Phone', 'Email', 'Tier', 'Table', 'Plus Ones', 'Status', 'Dispatched', 'QR Token'];
    const rows = filteredGuests.map((g) => [
      g.name,
      g.phone || '',
      g.email || '',
      g.tier || 'REGULAR',
      g.table || '',
      g.plusOnes || 0,
      g.status || 'VALID',
      g.dispatched ? 'YES' : 'NO',
      g.qrToken || g.id,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${currentEvent.name.replace(/\s+/g, '_')}_Guest_Roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredGuests.length} guests for "${currentEvent.name}"`);
  };

  return (
    <div className="space-y-6 pb-12 font-body">

      {/* ─── Top Switcher Strip (All Events ⇄ Settle Event Roster) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-xs">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-subtle)]">
          
          <button
            onClick={handleBackToCatalog}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === 'catalog'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <LayoutGrid size={14} />
            <span>All Events ({events.length})</span>
          </button>

          {currentEvent && (
            <button
              onClick={() => setViewMode('roster')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 max-w-[220px] sm:max-w-xs truncate ${
                viewMode === 'roster'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Users size={14} className="shrink-0" />
              <span className="truncate">Roster: {currentEvent.name}</span>
            </button>
          )}

        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {viewMode === 'roster' && (
            <button
              onClick={handleBackToCatalog}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-[var(--border)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Switch Event</span>
            </button>
          )}

          <button
            onClick={() => handleOpenAddForEvent(currentEvent)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Add Guests / Ingest CSV</span>
          </button>
        </div>
      </div>

      {/* ─── VIEW 1: CATALOG OF ALL EVENTS (User settles on which event to manage first) ─── */}
      {viewMode === 'catalog' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Section Hero Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-900/15 via-purple-900/10 to-transparent border border-indigo-500/20 shadow-xs relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <Users size={11} className="text-indigo-500" />
                  <span>Guest Lists & Invitation Hub</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                  Select an Event to Manage Its Guest Roster
                </h1>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
                  Choose any active campaign below to view its registered attendees, batch issue personalized WhatsApp digital passes, import CSV lists, or verify gate credentials.
                </p>
              </div>

              {/* Quick Overall Summary Stats */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="px-3.5 py-2 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] text-center shadow-xs">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-tertiary)]">Total Guests</p>
                  <p className="text-base font-extrabold text-[var(--text-primary)] font-mono">{totalGuestsCount}</p>
                </div>
                <div className="px-3.5 py-2 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] text-center shadow-xs">
                  <p className="text-[10px] uppercase font-bold text-emerald-500">Passes Sent</p>
                  <p className="text-base font-extrabold text-emerald-500 font-mono">{totalDispatched}</p>
                </div>
                <div className="px-3.5 py-2 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] text-center shadow-xs">
                  <p className="text-[10px] uppercase font-bold text-cyan-500">Checked In</p>
                  <p className="text-base font-extrabold text-cyan-500 font-mono">{totalCheckedIn}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Category Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)]">
              {[
                { id: 'ALL', label: 'All Events', count: events.length },
                { id: 'PRIVATE', label: 'Private RSVP Lists', count: events.filter((e) => e.type === 'PRIVATE').length },
                { id: 'PUBLIC', label: 'Public Ticketed', count: events.filter((e) => e.type === 'PUBLIC').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCatalogTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    catalogTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${catalogTab === tab.id ? 'bg-white/20' : 'bg-[var(--bg-subtle)]'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative max-w-xs w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Search event name, host, or venue..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Events Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCatalogEvents.map((evt) => {
              const eventGuests = guests.filter((g) => g.eventId === evt.id);
              const count = eventGuests.length;
              const dispatched = eventGuests.filter((g) => g.dispatched).length;
              const checkedIn = eventGuests.filter((g) => g.status === 'CHECKED_IN').length;
              const checkInPct = count > 0 ? Math.round((checkedIn / count) * 100) : 0;
              const dispatchPct = count > 0 ? Math.round((dispatched / count) * 100) : 0;
              const isCurrentActive = evt.id === selectedEventId;

              return (
                <div
                  key={evt.id}
                  onClick={() => handleSettleEvent(evt)}
                  className={`rounded-3xl overflow-hidden border bg-[var(--bg-surface)] flex flex-col justify-between group hover:-translate-y-1.5 transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer ${
                    isCurrentActive
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'border-[var(--border)] hover:border-indigo-400/50'
                  }`}
                >
                  {/* Event Image Banner */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                    <img
                      src={evt.banner}
                      alt={evt.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${
                          evt.type === 'PRIVATE'
                            ? 'bg-amber-500/85 text-black border-amber-400'
                            : 'bg-indigo-600/90 text-white border-indigo-400'
                        }`}
                      >
                        {evt.type === 'PRIVATE' ? '🔒 PRIVATE RSVP' : '🌍 PUBLIC TICKETED'}
                      </span>

                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Gate Active
                      </span>
                    </div>

                    {/* Bottom Overlay Title */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                        {evt.category || evt.hostName || 'Event Campaign'}
                      </p>
                      <h3 className="text-base font-extrabold text-white truncate drop-shadow-md">
                        {evt.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <Calendar size={13} className="text-indigo-500 shrink-0" />
                        <span>{evt.date} • {evt.time || '14:00'}</span>
                      </div>

                      <div className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                        <MapPin size={13} className="text-rose-500 shrink-0 mt-0.5" />
                        <span className="truncate">{evt.venue}</span>
                      </div>

                      {/* Roster Stats Grid */}
                      <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                        <div className="p-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]">
                          <span className="text-[10px] uppercase font-bold text-[var(--text-tertiary)] block">Roster</span>
                          <span className="text-xs font-black text-[var(--text-primary)] font-mono">{count}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <span className="text-[10px] uppercase font-bold text-emerald-500 block">Sent</span>
                          <span className="text-xs font-black text-emerald-500 font-mono">{dispatched}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                          <span className="text-[10px] uppercase font-bold text-cyan-500 block">Arrived</span>
                          <span className="text-xs font-black text-cyan-500 font-mono">{checkedIn}</span>
                        </div>
                      </div>

                      {/* Attendance Progress Bar */}
                      <div className="pt-1">
                        <div className="flex justify-between text-[11px] font-bold text-[var(--text-tertiary)] mb-1">
                          <span>Gate Turnout</span>
                          <span className="text-[var(--text-primary)] font-extrabold font-mono">
                            {checkInPct}% verified
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(3, checkInPct))}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-[var(--border)] flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSettleEvent(evt);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/25 cursor-pointer transition-all active:scale-[0.99] group/btn"
                      >
                        <Users size={14} className="text-indigo-200" />
                        <span>Manage Guest List & Passes</span>
                        <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAddForEvent(evt);
                          }}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Plus size={13} />
                          <span>Add to Roster</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveEventId(evt.id);
                            navigate('/scanner');
                          }}
                          className="p-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-indigo-500/10 text-indigo-500 border border-[var(--border)] transition-all cursor-pointer flex items-center justify-center"
                          title="Open Gate Scanner for this event"
                        >
                          <QrCode size={15} />
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ─── VIEW 2: DEDICATED EVENT GUEST ROSTER WORKSPACE (When an event is settled) ─── */}
      {viewMode === 'roster' && (
        <div className="space-y-6 animate-fade-in">

          {/* Settled Event Header Banner */}
          <div className="card-glow rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-lg overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-[var(--border)] bg-gradient-to-r from-[var(--bg-subtle)]/70 via-[var(--bg-surface)] to-[var(--bg-subtle)]/50">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Event Identity with Dropdown Switcher */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      currentEvent.type === 'PRIVATE'
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {currentEvent.type === 'PRIVATE' ? <Lock size={11} /> : <Globe size={11} />}
                      <span>{currentEvent.type === 'PRIVATE' ? 'Private VIP Invitation Roster' : 'Public Ticketed Roster'}</span>
                    </span>

                    <button
                      onClick={handleBackToCatalog}
                      className="text-[11px] font-bold text-indigo-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft size={11} />
                      <span>Back to All Events</span>
                    </button>
                  </div>

                  {/* Settled Event Dropdown Switcher */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
                      className="text-lg sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight hover:text-indigo-500 transition-colors flex items-center gap-2 cursor-pointer text-left"
                      title="Click to switch event"
                    >
                      <span>{currentEvent.name}</span>
                      <ChevronDown size={18} className={`text-[var(--text-tertiary)] transition-transform ${eventDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {eventDropdownOpen && (
                      <div className="absolute left-0 top-full mt-2 z-50 w-80 sm:w-96 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-2xl p-2.5 animate-fade-down space-y-1">
                        <div className="px-2 py-1.5 text-[11px] font-bold uppercase text-[var(--text-tertiary)] border-b border-[var(--border)] flex justify-between">
                          <span>Switch Event Roster</span>
                          <span className="text-indigo-500">{events.length} Events</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-1 pt-1">
                          {events.map((evt) => {
                            const isSelected = evt.id === currentEvent.id;
                            const evtGuestCount = guests.filter((g) => g.eventId === evt.id).length;
                            return (
                              <button
                                key={evt.id}
                                onClick={() => {
                                  handleSettleEvent(evt);
                                  setEventDropdownOpen(false);
                                }}
                                className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-indigo-500/10 text-indigo-500 font-bold border border-indigo-500/20'
                                    : 'hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                                }`}
                              >
                                <div className="truncate pr-2">
                                  <div className="truncate text-slate-900 dark:text-white font-semibold">{evt.name}</div>
                                  <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{evt.date} • {evtGuestCount} guests</div>
                                </div>
                                {isSelected && <Check size={14} className="text-indigo-500 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                        <div className="pt-2 border-t border-[var(--border)]">
                          <button
                            onClick={() => {
                              setEventDropdownOpen(false);
                              handleBackToCatalog();
                            }}
                            className="w-full text-center py-1.5 text-xs font-bold text-indigo-500 hover:underline cursor-pointer"
                          >
                            Browse All Events Directory →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-indigo-500" />
                      <span>{currentEvent.date} • {currentEvent.time || '14:00'}</span>
                    </span>
                    <span className="flex items-center gap-1 truncate max-w-xs">
                      <MapPin size={13} className="text-rose-500" />
                      <span>{currentEvent.venue}</span>
                    </span>
                  </div>
                </div>

                {/* Event Actions & Stat Chips */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="px-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] text-center">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-tertiary)] block">Roster</span>
                    <span className="text-xs font-black text-[var(--text-primary)] font-mono">
                      {currentEventGuests.length}
                    </span>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-500 block">Sent</span>
                    <span className="text-xs font-black text-emerald-500 font-mono">
                      {currentEventGuests.filter((g) => g.dispatched).length}
                    </span>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                    <span className="text-[10px] uppercase font-bold text-cyan-500 block">Checked In</span>
                    <span className="text-xs font-black text-cyan-500 font-mono">
                      {currentEventGuests.filter((g) => g.status === 'CHECKED_IN').length}
                    </span>
                  </div>

                  <button
                    onClick={handleExportCSV}
                    className="h-9 px-3 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Export attendee roster as CSV"
                  >
                    <Download size={13} />
                    <span className="hidden sm:inline">Export CSV</span>
                  </button>

                  <button
                    onClick={() => handleOpenAddForEvent(currentEvent)}
                    className="h-9 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer active:scale-95"
                  >
                    <Plus size={14} />
                    <span>Add Guests</span>
                  </button>
                </div>

              </div>
            </div>

            {/* ─── Search, Tier & Status Filters for Settled Event ─── */}
            <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-surface)] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                <input
                  type="text"
                  placeholder="Search guests by name, phone, table, or QR token..."
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--text-primary)] text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {TIERS.map((t) => (
                    <option key={t} value={t}>Tier: {t}</option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--text-primary)] text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>Status: {s}</option>
                  ))}
                </select>

                <span className="text-xs text-[var(--text-tertiary)] font-mono pl-2">
                  Showing {filteredGuests.length} of {currentEventGuests.length}
                </span>
              </div>

            </div>

            {/* ─── Attendee Table for Settled Event ─── */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[var(--border)] bg-[var(--bg-subtle)]/70 text-[var(--text-tertiary)] font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 pl-5 pr-2 w-8">
                      <input
                        type="checkbox"
                        checked={selectedGuestIds.size > 0 && selectedGuestIds.size === filteredGuests.length}
                        onChange={handleSelectAll}
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
                  {filteredGuests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[var(--text-tertiary)]">
                        <Users size={32} className="mx-auto mb-2 opacity-40 text-indigo-500" />
                        <p className="font-semibold text-xs text-[var(--text-primary)]">
                          {rosterSearch || selectedTier !== 'ALL' || selectedStatus !== 'ALL'
                            ? `No guests in "${currentEvent.name}" match your filters.`
                            : `No guests have been registered for "${currentEvent.name}" yet.`}
                        </p>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                          Click "Add Guests" above to create digital QR passes or ingest a CSV spreadsheet.
                        </p>
                        <div className="mt-4">
                          <button
                            onClick={() => handleOpenAddForEvent(currentEvent)}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                          >
                            <Plus size={14} />
                            <span>Add First Guest to {currentEvent.name}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredGuests.map((guest) => {
                      const st = STATUS_STYLE[guest.status] || STATUS_STYLE.VALID;
                      const StIcon = st.icon;
                      const isSelected = selectedGuestIds.has(guest.id);

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
                              onChange={() => toggleSelectGuest(guest.id)}
                              className="w-3.5 h-3.5 rounded border border-[var(--border)] bg-[var(--bg-subtle)] text-indigo-500 cursor-pointer accent-indigo-500"
                            />
                          </td>

                          {/* Attendee Info */}
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

                          {/* Table Seating */}
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
                            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${st.color} ${st.bg}`}>
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
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                                <CheckCircle2 size={12} /> Dispatched ✓
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--text-tertiary)]">
                                <Clock size={12} /> Pending Send
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 pr-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenCardDesigner(guest, currentEvent)}
                                title="Open Holographic Pass Preview & Designer"
                                className="px-2.5 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 border border-indigo-500/25 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                              >
                                <Sparkles size={12} />
                                <span>Card & QR</span>
                              </button>

                              <button
                                onClick={() => handleQuickWhatsApp(guest, currentEvent)}
                                title="Send Pass via WhatsApp"
                                className="p-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/25 transition-all cursor-pointer"
                              >
                                <MessageCircle size={14} />
                              </button>

                              <button
                                onClick={() => deleteGuest(guest.id)}
                                title="Revoke / Delete Pass"
                                className="p-1.5 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all cursor-pointer"
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

          </div>

        </div>
      )}

      {/* ─── Global Modals ─── */}
      <BulkGuestModal
        isOpen={bulkModalOpen}
        onClose={() => {
          setBulkModalOpen(false);
          setTargetEventForAdd(null);
        }}
        defaultEventId={targetEventForAdd || currentEvent.id}
      />

      <InvitationCardModal
        isOpen={cardModalOpen}
        onClose={() => {
          setCardModalOpen(false);
          setActiveCardGuest(null);
          setActiveCardEvent(null);
        }}
        guest={activeCardGuest}
        event={activeCardEvent || currentEvent}
      />

    </div>
  );
};

export default GuestsPage;