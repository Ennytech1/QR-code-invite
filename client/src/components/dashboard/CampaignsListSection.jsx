import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Users, Ticket, ArrowUpRight, Copy, Check,
  Sparkles, Lock, Globe, ChevronRight, SlidersHorizontal, Layers
} from 'lucide-react';

/* ─── Mode Badge Component ─── */
const EventModeBadge = ({ type }) => {
  if (type === 'PRIVATE') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
        <Lock size={10} className="text-amber-500" />
        <span>Private Guest List</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
      <Globe size={10} className="text-indigo-500" />
      <span>Public Box Office</span>
    </span>
  );
};

const CampaignsListSection = ({
  events = [],
  displayEvents = [],
  guests = [],
  campaignTab,
  setCampaignTab,
  copiedId,
  onCopyLink,
  onOpenScannerForEvent,
  onOpenCardForEvent,
  setActiveEventId,
}) => {
  const navigate = useNavigate();
  const [hoveredEventId, setHoveredEventId] = useState(null);

  const tabs = [
    { id: 'ALL', label: 'All Campaigns', count: events.length },
    { id: 'PUBLIC', label: 'Public Tickets', count: events.filter(e => e.type === 'PUBLIC').length },
    { id: 'PRIVATE', label: 'Private Guestlists', count: events.filter(e => e.type === 'PRIVATE').length },
  ];

  return (
    <section className="space-y-4">
      {/* ─── Header & Mode Filter ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] font-heading tracking-tight">
              Active Campaigns
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-medium font-mono-numbers">
              {displayEvents.length}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-body mt-0.5">
            Monitor real-time box office sell-through and private invitation RSVP turnouts.
          </p>
        </div>

        {/* Tactile Tab Segment */}
        <div className="flex items-center p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-xs font-medium">
          {tabs.map((tab) => {
            const isActive = campaignTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCampaignTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[var(--bg-base)] text-[var(--text-primary)] font-semibold shadow-xs border border-[var(--border)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] font-mono-numbers px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Cards Grid / Feed ─── */}
      <div className="space-y-3.5">
        {displayEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center bg-[var(--bg-surface)]">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-3">
              <Layers size={22} />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] font-heading">
              No campaigns in this view
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm mx-auto font-body">
              Switch filter tabs above or click Create Campaign to launch your next social gala or ticketed event.
            </p>
          </div>
        ) : (
          displayEvents.map((evt) => {
            const eventGuests = guests.filter((g) => g.eventId === evt.id);
            const checkedIn =
              eventGuests.filter((g) => g.status === 'CHECKED_IN').length + (evt.checkedIn || 0);
            const issued = eventGuests.length + (evt.issued || 0);
            const capacity = evt.capacity || 500;
            const pct = Math.min(100, Math.round((checkedIn / (capacity || 1)) * 100));
            const isHovered = hoveredEventId === evt.id;

            return (
              <div
                key={evt.id}
                onMouseEnter={() => setHoveredEventId(evt.id)}
                onMouseLeave={() => setHoveredEventId(null)}
                className="group rounded-2xl p-4 sm:p-5 bg-[var(--bg-surface)] border border-[var(--border)] card-lift transition-all duration-300 flex flex-col md:flex-row gap-5 items-stretch relative overflow-hidden"
              >
                {/* Subtle left border accent depending on event type */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${
                    evt.type === 'PRIVATE'
                      ? 'bg-gradient-to-b from-amber-400 to-amber-600'
                      : 'bg-gradient-to-b from-indigo-500 to-violet-600'
                  }`}
                />

                {/* Event Visual Thumbnail */}
                <div className="w-full md:w-44 h-32 md:h-auto rounded-xl overflow-hidden shrink-0 relative bg-slate-900 shadow-sm">
                  <img
                    src={evt.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80'}
                    alt={evt.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Category Pill Over Image */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md uppercase tracking-wider">
                      {evt.category || 'Celebration'}
                    </span>
                  </div>

                  {/* Schedule Details */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-semibold">
                    <span className="font-mono-numbers">{evt.date}</span>
                    <span className="opacity-80">{evt.time || '18:00'}</span>
                  </div>
                </div>

                {/* Center Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <EventModeBadge type={evt.type} />
                      {evt.revenue > 0 && (
                        <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono-numbers bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          ₦{evt.revenue.toLocaleString()} collected
                        </span>
                      )}
                    </div>

                    <h3
                      onClick={() => {
                        setActiveEventId(evt.id);
                        navigate(`/events/${evt.id}`);
                      }}
                      className="text-base sm:text-[17px] font-bold text-[var(--text-primary)] font-heading tracking-tight truncate cursor-pointer hover:text-[var(--accent)] transition-colors flex items-center gap-1.5"
                      title={evt.name}
                    >
                      <span>{evt.name}</span>
                      <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--accent)]" />
                    </h3>

                    <p className="text-xs text-[var(--text-secondary)] font-body truncate mt-1 flex items-center gap-1.5">
                      <MapPin size={12} className="shrink-0 text-[var(--text-tertiary)]" />
                      <span className="truncate">{evt.venue}</span>
                    </p>
                  </div>

                  {/* Turnout Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-xs font-body">
                      <span className="text-[var(--text-secondary)] text-[11.5px]">
                        <strong className="text-[var(--text-primary)] font-semibold">{checkedIn}</strong> checked in · {issued} issued
                      </span>
                      <span className="font-bold text-[var(--accent)] font-mono-numbers text-[11px]">
                        {pct}% capacity
                      </span>
                    </div>

                    <div className="h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${Math.max(4, pct)}%`,
                          background:
                            evt.type === 'PRIVATE'
                              ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                              : 'linear-gradient(90deg, #6366f1, #06b6d4)',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Action Rail */}
                <div className="flex md:flex-col gap-2 md:w-40 shrink-0 justify-end md:justify-center border-t md:border-t-0 md:border-l border-[var(--border)] pt-3 md:pt-0 md:pl-5">
                  <button
                    onClick={() => {
                      setActiveEventId(evt.id);
                      navigate(`/events/${evt.id}`);
                    }}
                    className="flex-1 md:flex-none h-8.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold font-heading flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    <span>Manage Hub</span>
                    <ChevronRight size={13} />
                  </button>

                  <button
                    onClick={() => onOpenScannerForEvent(evt.id)}
                    className="flex-1 md:flex-none h-8.5 px-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] bg-[var(--bg-base)] text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Ticket size={13} className="text-[var(--accent)]" />
                    <span>Gate Scanner</span>
                  </button>

                  {/* Mode-specific action button */}
                  {evt.type === 'PUBLIC' ? (
                    <button
                      onClick={() => onCopyLink(evt)}
                      className="hidden md:flex h-7 px-2.5 rounded-lg text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedId === evt.id ? (
                        <>
                          <Check size={12} className="text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Link Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Share Checkout</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenCardForEvent(evt.id, eventGuests[0] || guests[0])}
                      className="hidden md:flex h-7 px-2.5 rounded-lg text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors items-center justify-center gap-1.5 cursor-pointer rounded-lg"
                    >
                      <Sparkles size={12} />
                      <span>WhatsApp Pass Studio</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default CampaignsListSection;