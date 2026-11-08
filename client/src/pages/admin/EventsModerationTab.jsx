import React, { useState, useMemo } from 'react';
import { Search, Star, Lock, Unlock } from 'lucide-react';

const STATUS_FILTERS = ['ALL', 'ACTIVE', 'FEATURED', 'FROZEN'];

const EventsModerationTab = ({ events, onToggleFeatured, onToggleFreeze }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch =
        e.name?.toLowerCase().includes(search.toLowerCase()) ||
        e.venue?.toLowerCase().includes(search.toLowerCase()) ||
        e.hostName?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'FEATURED' && e.isFeatured) ||
        (statusFilter === 'FROZEN' && e.isFrozen) ||
        (statusFilter === 'ACTIVE' && e.status === 'ACTIVE' && !e.isFrozen);
      return matchesSearch && matchesStatus;
    });
  }, [events, search, statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* ─── Search & Event Filters Bar ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search global events by title, venue, host..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {s === 'ALL' ? 'All Events' : s}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Events Inventory Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((event) => (
          <div
            key={event._id}
            className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between shadow-xs relative overflow-hidden ${
              event.isFrozen
                ? 'border-rose-400/80 dark:border-rose-500/50 bg-rose-50/20 dark:bg-rose-950/10'
                : 'border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/40'
            }`}
          >
            {/* Frozen watermark banner */}
            {event.isFrozen && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                <Lock size={14} />
                <span>FROZEN BY ADMIN: Turnstiles locked</span>
              </div>
            )}

            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                    {event.category || 'Event'}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2 line-clamp-1">
                    {event.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{event.venue}</p>
                </div>

                {event.isFeatured && (
                  <span
                    className="shrink-0 p-2 rounded-xl bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-400/20 shadow-2xs"
                    title="Featured Event"
                  >
                    <Star size={15} fill="currentColor" />
                  </span>
                )}
              </div>

              {/* Host info & Gross revenue */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Host:</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                    {event.hostName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Gross Volume:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    ₦{(event.grossRevenue || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Turnstile Attendance:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {event.checkedIn} / {event.issued} passes
                  </span>
                </div>
              </div>
            </div>

            {/* Moderation Controls Footer */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => onToggleFeatured(event._id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  event.isFeatured
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Star size={14} className={event.isFeatured ? 'fill-amber-400 text-amber-400' : ''} />
                <span>{event.isFeatured ? 'Featured' : 'Feature'}</span>
              </button>

              <button
                onClick={() => onToggleFreeze(event._id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  event.isFrozen
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                }`}
              >
                {event.isFrozen ? <Unlock size={14} /> : <Lock size={14} />}
                <span>{event.isFrozen ? 'Unfreeze Gate' : 'Freeze Event'}</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default EventsModerationTab;

