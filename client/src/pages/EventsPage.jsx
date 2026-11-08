import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Filter, Calendar, MapPin, Users,
  QrCode, MoreHorizontal, CheckCircle2, Clock, Zap,
  TrendingUp, Archive, Trash2, ExternalLink, ChevronRight,
  Activity, ArrowUpRight, Lock, Globe, Sparkles, DollarSign,
  Ticket, MessageCircle, LayoutGrid, ArrowLeft, ArrowRight,
  ShieldCheck, Radio
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import EventManageOverview from '../components/events/EventManageOverview';
import NewEventModal from '../components/modals/NewEventModal';
import BuyTicketModal from '../components/modals/BuyTicketModal';
import InvitationCardModal from '../components/modals/InvitationCardModal';

const EventsPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const { events, guests, activeEventId, setActiveEventId } = useEvents();

  // Mode: First view is 'catalog' when entering /events, or 'overview' if a specific eventId is in URL
  const initialMode = (eventId || searchParams.get('event')) ? 'overview' : 'catalog';
  const [viewMode, setViewMode] = useState(initialMode);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'PUBLIC' | 'PRIVATE'
  const [searchQuery, setSearchQuery] = useState('');
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [buyTicketModalOpen, setBuyTicketModalOpen] = useState(false);
  const [selectedEventForBuy, setSelectedEventForBuy] = useState(null);

  // Invitation card modal for quick preview
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [selectedGuestForCard, setSelectedGuestForCard] = useState(null);
  const [selectedEventForCard, setSelectedEventForCard] = useState(null);

  // Synchronize URL parameters with view state
  useEffect(() => {
    const urlEventId = eventId || searchParams.get('event');
    if (urlEventId && events.some((e) => e.id === urlEventId)) {
      setActiveEventId(urlEventId);
      setViewMode('overview');
    } else if (!eventId && !searchParams.get('event')) {
      // When on /events without param, user first sees all events to settle on one
      setViewMode('catalog');
    }
  }, [eventId, searchParams, events, setActiveEventId]);

  const filteredEvents = events.filter((evt) => {
    const matchTab = activeTab === 'ALL' || evt.type === activeTab;
    const matchSearch =
      !searchQuery ||
      evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.hostName && evt.hostName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchTab && matchSearch;
  });

  const handleOpenBuy = (evt, e) => {
    if (e) e.stopPropagation();
    setSelectedEventForBuy(evt);
    setBuyTicketModalOpen(true);
  };

  const handleGoToGuests = (evt, e) => {
    if (e) e.stopPropagation();
    setActiveEventId(evt.id);
    navigate('/guests');
  };

  const handleGoToScanner = (evt, e) => {
    if (e) e.stopPropagation();
    setActiveEventId(evt.id);
    navigate('/scanner');
  };

  const handleManageOverview = (evt) => {
    setActiveEventId(evt.id);
    setViewMode('overview');
    navigate(`/events/${evt.id}`);
    toast.success(`Entered overview for "${evt.name}"`);
  };

  const handleBackToCatalog = () => {
    setViewMode('catalog');
    navigate('/events');
  };

  const activeEvent = events.find((e) => e.id === activeEventId) || events[0];

  return (
    <div className="space-y-6">

      {/* ─── Top Switcher & Workspace Bar ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-xs">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-subtle)]">
          
          <button
            onClick={handleBackToCatalog}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === 'catalog'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <LayoutGrid size={14} />
            <span>All Events ({events.length})</span>
          </button>

          {activeEvent && (
            <button
              onClick={() => {
                setViewMode('overview');
                navigate(`/events/${activeEvent.id}`);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 max-w-[220px] sm:max-w-xs truncate ${
                viewMode === 'overview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Activity size={14} className="shrink-0" />
              <span className="truncate">Overview: {activeEvent.name}</span>
            </button>
          )}

        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {viewMode === 'overview' && (
            <button
              onClick={handleBackToCatalog}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-[var(--border)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Switch Event</span>
            </button>
          )}

          <button
            onClick={() => navigate('/events/create')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#1d4ed8] hover:bg-[#1e40af] text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>New Event</span>
          </button>
        </div>
      </div>

      {/* ─── View 1: Event Manage Overview (When an event is settled) ─── */}
      {viewMode === 'overview' && (
        <EventManageOverview
          selectedEventId={activeEventId}
          onSelectEvent={(id) => {
            setActiveEventId(id);
            navigate(`/events/${id}`);
          }}
          onBackToCatalog={handleBackToCatalog}
          onOpenNewEvent={() => navigate('/events/create')}
        />
      )}

      {/* ─── View 2: All Events Catalog Grid (User selects / settles event first) ─── */}
      {viewMode === 'catalog' && (
        <div className="space-y-6 animate-fade-in">

          {/* Section Hero Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-900/15 via-indigo-900/10 to-transparent border border-blue-500/20 shadow-xs relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <Radio size={11} className="animate-pulse text-blue-500" />
                  <span>Events Workspace Directory</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                  Select an Event to Manage
                </h1>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
                  Choose any active campaign below to enter its live gate overview, monitor arrival velocity, check in attendees, and control WhatsApp digital passes.
                </p>
              </div>

              {/* Quick Summary Counter Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="px-3.5 py-2 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] text-center shadow-xs">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-tertiary)]">Total Events</p>
                  <p className="text-base font-extrabold text-[var(--text-primary)]">{events.length}</p>
                </div>
                <div className="px-3.5 py-2 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] text-center shadow-xs">
                  <p className="text-[10px] uppercase font-bold text-amber-500">Private VIP</p>
                  <p className="text-base font-extrabold text-[var(--text-primary)]">
                    {events.filter((e) => e.type === 'PRIVATE').length}
                  </p>
                </div>
                <div className="px-3.5 py-2 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] text-center shadow-xs">
                  <p className="text-[10px] uppercase font-bold text-blue-500">Public Tickets</p>
                  <p className="text-base font-extrabold text-[var(--text-primary)]">
                    {events.filter((e) => e.type === 'PUBLIC').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Tab Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Tab Filters */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)]">
              {[
                { id: 'ALL', label: 'All Events', count: events.length },
                { id: 'PUBLIC', label: 'Public Ticketed', count: events.filter((e) => e.type === 'PUBLIC').length },
                { id: 'PRIVATE', label: 'Private / RSVP Only', count: events.filter((e) => e.type === 'PRIVATE').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-[var(--bg-subtle)]'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Search event name, host, or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Events Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => {
              const eventGuests = guests.filter((g) => g.eventId === evt.id);
              const checkedIn = eventGuests.filter((g) => g.status === 'CHECKED_IN').length || evt.checkedIn || 0;
              const totalIssued = eventGuests.length || evt.issued || 0;
              const pct = Math.round((checkedIn / (evt.capacity || 1)) * 100);
              const isCurrentActive = evt.id === activeEventId;

              return (
                <div
                  key={evt.id}
                  onClick={() => handleManageOverview(evt)}
                  className={`rounded-3xl overflow-hidden border bg-[var(--bg-surface)] flex flex-col justify-between group hover:-translate-y-1.5 transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer ${
                    isCurrentActive
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-[var(--border)] hover:border-blue-400/50'
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
                            : 'bg-blue-600/90 text-white border-blue-400'
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
                      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
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
                        <Calendar size={13} className="text-blue-500 shrink-0" />
                        <span>{evt.date} • {evt.time}</span>
                      </div>

                      <div className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                        <MapPin size={13} className="text-blue-500 shrink-0 mt-0.5" />
                        <span className="truncate">{evt.venue}</span>
                      </div>

                      {/* Turnout Progress Bar */}
                      <div className="pt-2">
                        <div className="flex justify-between text-[11px] font-bold text-[var(--text-tertiary)] mb-1">
                          <span>Check-in Progress</span>
                          <span className="text-[var(--text-primary)] font-extrabold font-mono-numbers">
                            {checkedIn} / {evt.capacity} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-400 transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(3, pct))}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-[var(--border)] flex flex-col gap-2">
                      
                      {/* Manage Overview Primary Action */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleManageOverview(evt);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-blue-700/25 cursor-pointer transition-all active:scale-[0.99] group/btn"
                      >
                        <Activity size={14} className="text-blue-200" />
                        <span>Enter Event Overview</span>
                        <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>

                      {/* Secondary Quick Action Row */}
                      <div className="flex gap-2">
                        {evt.type === 'PUBLIC' ? (
                          <button
                            onClick={(e) => handleOpenBuy(evt, e)}
                            className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                          >
                            <Ticket size={13} />
                            <span>Issue Pass</span>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => handleGoToGuests(evt, e)}
                            className="flex-1 py-1.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                          >
                            <Sparkles size={13} />
                            <span>Guest Roster</span>
                          </button>
                        )}

                        <button
                          onClick={(e) => handleGoToScanner(evt, e)}
                          className="p-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-blue-500/10 text-blue-500 border border-[var(--border)] transition-all cursor-pointer flex items-center justify-center"
                          title="Open Gate Scanner for this event"
                        >
                          <QrCode size={15} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)] pt-1 px-1">
                        <span>{eventGuests.length || totalIssued} verified attendees</span>
                        <button
                          onClick={(e) => handleGoToGuests(evt, e)}
                          className="text-blue-500 hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                        >
                          Manage roster <ChevronRight size={12} />
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

      {/* ─── Global Modals ─── */}
      <NewEventModal
        isOpen={newEventOpen}
        onClose={() => setNewEventOpen(false)}
      />

      <BuyTicketModal
        isOpen={buyTicketModalOpen}
        onClose={() => {
          setBuyTicketModalOpen(false);
          setSelectedEventForBuy(null);
        }}
        event={selectedEventForBuy}
        onTicketPurchased={(guest, evt) => {
          setSelectedGuestForCard(guest);
          setSelectedEventForCard(evt);
          setCardModalOpen(true);
        }}
      />

      <InvitationCardModal
        isOpen={cardModalOpen}
        onClose={() => {
          setCardModalOpen(false);
          setSelectedGuestForCard(null);
          setSelectedEventForCard(null);
        }}
        guest={selectedGuestForCard}
        event={selectedEventForCard}
      />

    </div>
  );
};

export default EventsPage;