import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Search, Filter, Flame, ArrowRight,
  Sparkles, Globe, Lock, Ticket, Tag, ChevronDown, CheckCircle2,
  Users, ShieldCheck, Clock, ExternalLink, Zap
} from 'lucide-react';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';
import { useEvents } from '../context/EventContext';
import BuyTicketModal from '../components/modals/BuyTicketModal';
import InvitationCardModal from '../components/modals/InvitationCardModal';

const CATEGORIES = [
  'All',
  'Conferences & Tech',
  'Nightlife & Club',
  'Festivals & Raves',
  'Pool Parties',
  'Weddings & Galas',
  'VIP Dinners',
];

const ExploreEventsPage = () => {
  const { events } = useEvents();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('ALL'); // 'ALL' | 'PUBLIC' | 'PRIVATE'
  const [filterPrice, setFilterPrice] = useState('ALL'); // 'ALL' | 'FREE' | 'PAID'

  // Modals for ticket purchase
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedBuyEvent, setSelectedBuyEvent] = useState(null);
  const [issuedGuest, setIssuedGuest] = useState(null);
  const [cardModalOpen, setCardModalOpen] = useState(false);

  // Dynamic category count calculation
  const categoryCounts = useMemo(() => {
    const counts = { All: events.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = events.filter(
          (e) => e.category && e.category.toLowerCase().includes(cat.toLowerCase())
        ).length;
      }
    });
    return counts;
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchType = selectedType === 'ALL' || evt.type === selectedType;
      const matchCat =
        selectedCategory === 'All' ||
        (evt.category && evt.category.toLowerCase().includes(selectedCategory.toLowerCase()));
      const matchSearch =
        !searchQuery ||
        evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (evt.hostName && evt.hostName.toLowerCase().includes(searchQuery.toLowerCase()));

      const minPrice = evt.ticketTiers && evt.ticketTiers.length > 0
        ? Math.min(...evt.ticketTiers.map((t) => t.price || 0))
        : 0;

      const matchPrice =
        filterPrice === 'ALL' ||
        (filterPrice === 'FREE' && minPrice === 0) ||
        (filterPrice === 'PAID' && minPrice > 0);

      return matchType && matchCat && matchSearch && matchPrice;
    });
  }, [events, selectedType, selectedCategory, searchQuery, filterPrice]);

  const handleOpenBuy = (evt) => {
    setSelectedBuyEvent(evt);
    setBuyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200 overflow-x-hidden font-body">
      
      <LandingNavbar />

      {/* ─── Hero Header & Real-Time Discovery ─── */}
      <section className="relative pt-12 pb-14 bg-gradient-to-b from-indigo-950/15 via-transparent to-transparent border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-black uppercase tracking-wider shadow-2xs">
            <Globe size={13} /> Official Box Office & Event Discovery
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-heading">
            Explore Events & Verified Passes
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Discover upcoming tech summits, music festivals, private galas, and VIP parties. Get your cryptographically signed QR ticket delivered instantly to WhatsApp and mobile pass wallet.
          </p>

          {/* Search Bar & Instant Filter */}
          <div className="max-w-xl mx-auto relative pt-2">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by event title, venue, or host organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e14] text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 shadow-md focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
          </div>

        </div>
      </section>

      {/* ─── Category & Type Filters Toolbar ─── */}
      <section className="py-4 border-b border-[var(--border)] bg-white/60 dark:bg-[#0c0e14]/60 backdrop-blur-md sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-102'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span>{cat}</span>
                  {categoryCounts[cat] > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-mono font-black ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {categoryCounts[cat]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mode & Pricing Toggle Docks */}
          <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
            {/* Event Type Filter */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              {[
                { id: 'ALL', label: 'All Modes' },
                { id: 'PUBLIC', label: 'Public Tickets' },
                { id: 'PRIVATE', label: 'VIP RSVP' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedType(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedType === t.id
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs font-extrabold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Price Filter */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              {[
                { id: 'ALL', label: 'All Prices' },
                { id: 'FREE', label: 'Free RSVP' },
                { id: 'PAID', label: 'Ticketed' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setFilterPrice(p.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    filterPrice === p.id
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs font-extrabold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ─── Main Event Grid ─── */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Showing {filteredEvents.length} Verified Events
          </span>
          <Link
            to="/events/create"
            className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 group"
          >
            <span>Host or Publish an Event</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="py-24 text-center space-y-3 bg-white dark:bg-[#0c0e14] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <Globe size={42} className="mx-auto text-slate-400 opacity-40 animate-pulse" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">
              No events found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              No events match your current combination of keywords and filters. Try clearing the filter or search query.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedType('ALL');
                setFilterPrice('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-md shadow-indigo-600/20"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => {
              const minPrice = evt.ticketTiers && evt.ticketTiers.length > 0
                ? Math.min(...evt.ticketTiers.map((t) => t.price || 0))
                : 0;
              const isFree = minPrice === 0;
              const priceLabel = isFree ? 'Free / Complimentary' : `₦${minPrice.toLocaleString()}`;
              const issuedCount = evt.issued || 0;
              const capacity = evt.capacity || 1000;
              const percentFilled = Math.min(100, Math.round((issuedCount / capacity) * 100));

              return (
                <div
                  key={evt.id}
                  className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e14] flex flex-col justify-between group hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300 shadow-sm"
                >
                  {/* Event Artwork Header */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <img
                      src={evt.banner}
                      alt={evt.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${
                          evt.type === 'PRIVATE'
                            ? 'bg-amber-500/90 text-slate-950 border-amber-300'
                            : 'bg-black/60 text-white border-white/20'
                        }`}
                      >
                        {evt.type === 'PRIVATE' ? '🔒 PRIVATE VIP' : evt.category || 'PUBLIC PASS'}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black uppercase bg-emerald-500/90 text-slate-950 backdrop-blur-md border border-emerald-400">
                        {issuedCount} Passes Active
                      </span>
                    </div>

                    {/* Bottom Price Tag */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-white font-black text-xs sm:text-sm font-mono bg-black/75 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20">
                        From {priceLabel}
                      </span>

                      {evt.hostName && (
                        <span className="text-[10px] text-white/80 font-bold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md truncate max-w-[140px]">
                          {evt.hostName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Event Details Content */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2 text-left">
                      <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight line-clamp-2 font-heading">
                        {evt.name}
                      </h3>

                      <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <p className="flex items-center gap-1.5 font-medium">
                          <Calendar size={13} className="text-indigo-500 shrink-0" />
                          <span>{evt.date} • {evt.time}</span>
                        </p>
                        <p className="flex items-center gap-1.5 truncate">
                          <MapPin size={13} className="text-rose-500 shrink-0" />
                          <span className="truncate">{evt.venue}</span>
                        </p>
                      </div>

                      {/* Capacity progress */}
                      <div className="pt-1 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Gate Capacity</span>
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{percentFilled}% allocated</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                            style={{ width: `${percentFilled}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenBuy(evt)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/25 transition-all active:scale-98"
                      >
                        <Ticket size={14} />
                        <span>{evt.type === 'PRIVATE' ? 'Register VIP Pass' : 'Get Tickets / Pass'}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </section>

      <LandingFooter />

      {/* ─── Modals ─── */}
      <BuyTicketModal
        isOpen={buyModalOpen}
        onClose={() => {
          setBuyModalOpen(false);
          setSelectedBuyEvent(null);
        }}
        event={selectedBuyEvent}
        onTicketPurchased={(guest, evt) => {
          setIssuedGuest(guest);
          setSelectedBuyEvent(evt);
          setCardModalOpen(true);
        }}
      />

      <InvitationCardModal
        isOpen={cardModalOpen}
        onClose={() => {
          setCardModalOpen(false);
          setIssuedGuest(null);
        }}
        guest={issuedGuest}
        event={selectedBuyEvent}
      />

    </div>
  );
};

export default ExploreEventsPage;