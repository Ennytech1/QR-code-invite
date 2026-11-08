import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Download, Search, CheckCircle2, AlertTriangle,
  Clock, Send, Sparkles, ChevronRight, Award, Crown, UserCheck
} from 'lucide-react';

/* ─── Premium Tier Badges ─── */
export const TierBadge = ({ tier = '' }) => {
  const t = String(tier).toUpperCase();
  if (t.includes('VVIP') || t.includes('DIGNITARY') || t.includes('HIGH TABLE') || t.includes('CABANA')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
        <Crown size={11} className="text-purple-500" />
        <span>{tier}</span>
      </span>
    );
  }
  if (t.includes('VIP') || t.includes('EXECUTIVE') || t.includes('SPONSOR')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
        <Sparkles size={11} className="text-amber-500" />
        <span>{tier}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-medium uppercase tracking-wider bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border)]">
      <span>{tier || 'REGULAR'}</span>
    </span>
  );
};

/* ─── Status Indicator ─── */
export const StatusDot = ({ status, time }) => {
  if (status === 'CHECKED_IN') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Checked In</span>
        {time && <span className="opacity-70 font-mono text-[10px] ml-0.5 font-normal">· {time}</span>}
      </span>
    );
  }
  if (status === 'REVOKED') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
        <AlertTriangle size={12} strokeWidth={2.2} />
        <span>Revoked</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-subtle)] px-2.5 py-0.5 rounded-full border border-[var(--border)]">
      <Clock size={11} className="text-[var(--text-tertiary)]" />
      <span>Awaiting Gate</span>
    </span>
  );
};

const AttendeeRosterSection = ({
  filteredGuests = [],
  events = [],
  searchQuery,
  setSearchQuery,
  selectedEventFilter,
  setSelectedEventFilter,
  guestFilterTab,
  setGuestFilterTab,
  onOpenBulk,
  onExportCSV,
  onWhatsAppDispatch,
  onQuickCheckIn,
  onOpenCardForGuest,
}) => {
  const navigate = useNavigate();

  const filterTabs = [
    { id: 'ALL', label: 'All Attendees' },
    { id: 'CHECKED_IN', label: 'Checked In' },
    { id: 'AWAITING', label: 'Awaiting Gate' },
    { id: 'VIP', label: 'VIP Guests' },
  ];

  return (
    <section className="space-y-4">
      {/* ─── Top Heading & Action Strip ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] font-heading tracking-tight">
              Guest Roster & Verification Desk
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-mono-numbers">
              {filteredGuests.length}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-body mt-0.5">
            Deliver personalized WhatsApp card passes or execute door admissions with sub-second optical lookup.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBulk}
            className="h-8.5 px-3 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--accent)] text-[var(--text-primary)] hover:text-[var(--accent)] text-xs font-semibold font-heading transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
          >
            <Plus size={13} />
            <span>Import CSV</span>
          </button>
          <button
            onClick={onExportCSV}
            className="h-8.5 px-3 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold font-heading transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ─── Search & Filter Controls ─── */}
      <div className="rounded-2xl p-3.5 border border-[var(--border)] bg-[var(--bg-surface)] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by attendee name, email, phone, or tier..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)] font-body transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Event Filter Selector */}
          <div className="sm:w-60 shrink-0">
            <select
              value={selectedEventFilter}
              onChange={(e) => setSelectedEventFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text-primary)] font-heading font-medium focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
            >
              <option value="ALL">All Event Rosters</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name.length > 28 ? e.name.slice(0, 28) + '...' : e.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs font-medium">
          {filterTabs.map((tab) => {
            const isActive = guestFilterTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setGuestFilterTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Attendees Table ─── */}
      <div className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-body">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] text-[11px] font-semibold font-heading uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Attendee</th>
                <th className="py-3 px-4 font-semibold">Tier & Table</th>
                <th className="py-3 px-4 font-semibold">Gate Status</th>
                <th className="py-3 px-4 font-semibold">WhatsApp Pass</th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[var(--text-secondary)] font-body">
                    No attendees match this filter or search query.
                  </td>
                </tr>
              ) : (
                filteredGuests.slice(0, 7).map((g) => {
                  const initials = g.name
                    ? g.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
                    : 'G';

                  return (
                    <tr
                      key={g.id}
                      className="hover:bg-[var(--bg-subtle)] transition-colors duration-150 group"
                    >
                      {/* Identity */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0 font-heading shadow-xs">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-[13px] text-[var(--text-primary)] font-heading truncate">
                              {g.name}
                            </div>
                            <div className="text-[11px] text-[var(--text-secondary)] truncate">
                              {g.email || g.phone || 'No direct contact'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tier & Table */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <TierBadge tier={g.tier} />
                          {g.table && (
                            <div className="text-[10.5px] text-[var(--text-secondary)] font-mono-numbers">
                              {g.table}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <StatusDot
                          status={g.status}
                          time={
                            g.checkInTime
                              ? new Date(g.checkInTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : null
                          }
                        />
                      </td>

                      {/* Dispatch Status */}
                      <td className="py-3 px-4">
                        {g.dispatched ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 size={13} />
                            <span>Delivered</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => onWhatsAppDispatch(g)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold font-heading transition-colors cursor-pointer border border-emerald-500/20 active:scale-95"
                          >
                            <Send size={11} />
                            <span>Dispatch</span>
                          </button>
                        )}
                      </td>

                      {/* Pass Studio & Quick Checkin */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {g.status !== 'CHECKED_IN' ? (
                            <button
                              onClick={() => onQuickCheckIn(g)}
                              className="h-7 px-2.5 rounded-lg border border-[var(--border)] hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-semibold text-[var(--text-secondary)] transition-all cursor-pointer font-heading"
                              title="Manually mark checked in"
                            >
                              Check In
                            </button>
                          ) : (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold px-2">
                              Admitted
                            </span>
                          )}

                          <button
                            onClick={() => onOpenCardForGuest(g)}
                            className="h-7 px-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 text-xs font-semibold font-heading transition-all cursor-pointer flex items-center gap-1 border border-indigo-200 dark:border-indigo-500/20"
                            title="Open digital card and encrypted QR pass"
                          >
                            <Sparkles size={11} />
                            <span>Pass</span>
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

        {/* Footer info & Link */}
        <div className="p-3.5 border-t border-[var(--border)] bg-[var(--bg-subtle)] flex items-center justify-between text-xs font-body text-[var(--text-secondary)]">
          <span>
            Displaying {Math.min(7, filteredGuests.length)} of {filteredGuests.length} attendees
          </span>
          <button
            onClick={() => navigate('/guests')}
            className="font-semibold text-[var(--accent)] hover:underline flex items-center gap-1 font-heading cursor-pointer"
          >
            <span>Open Full Guest Roster</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AttendeeRosterSection;