import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, MapPin, Search, Filter, Flame, ArrowRight,
  Sparkles, Globe, Lock, Ticket, Tag, ChevronDown, CheckCircle2
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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('ALL'); // 'ALL' | 'PUBLIC' | 'PRIVATE'

  // Modals for ticket purchase
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedBuyEvent, setSelectedBuyEvent] = useState(null);
  const [issuedGuest, setIssuedGuest] = useState(null);
  const [cardModalOpen, setCardModalOpen] = useState(false);

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

      return matchType && matchCat && matchSearch;
    });
  }, [events, selectedType, selectedCategory, searchQuery]);

  const handleOpenBuy = (evt) => {
    setSelectedBuyEvent(evt);
    setBuyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200 overflow-x-hidden">
      
      <LandingNavbar />

      {/* ─── Hero Header ─── */}
      <section className="relative pt-12 pb-16 bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
            <Globe size={13} /> Official Box Office & Event Discovery
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)]">
            Explore Events & Verified Passes
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto">
            Discover upcoming concerts, tech conferences, beach parties, and VIP galas. Get your cryptographically signed QR ticket delivered instantly to WhatsApp.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative pt-2">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by event title, venue, or host name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-indigo-500 shadow-lg"
            />
          </div>

        </div>
      </section>

      {/* ─── Category & Type Filters ─── */}
      <section className="py-6 border-b border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Type Toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] self-start md:self-auto">
            {[
              { id: 'ALL', label: 'All Events' },
              { id: 'PUBLIC', label: 'Public Ticketed' },
              { id: 'PRIVATE', label: 'Private RSVP' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedType === t.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ─── Event Grid ─── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
            Showing {filteredEvents.length} Verified Events
          </span>
          <Link
            to="/dashboard"
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Host Your Own Event</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <Globe size={40} className="mx-auto text-slate-500 opacity-40" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">No events match your search</h3>
            <p className="text-xs text-[var(--text-secondary)]">Try resetting the category filters or search term.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedType('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
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
              const priceLabel = minPrice === 0 ? 'Free / RSVP' : `₦${minPrice.toLocaleString()}`;

              return (
                <div
                  key={evt.id}
                  className="card-glow rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)] flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 shadow-md"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <img
                      src={evt.banner}
                      alt={evt.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${
                          evt.type === 'PRIVATE'
                            ? 'bg-amber-500/80 text-black border-amber-400'
                            : 'bg-black/60 text-white border-white/10'
                        }`}
                      >
                        {evt.type === 'PRIVATE' ? '🔒 PRIVATE RSVP' : evt.category || 'PUBLIC'}
                      </span>

                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                        {evt.issued || 140} Passes
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <span className="text-white font-black text-sm font-mono bg-black/70 px-2.5 py-1 rounded-lg border border-white/10">
                        From {priceLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5 text-left">
                      <h3 className="font-extrabold text-base text-[var(--text-primary)] leading-tight line-clamp-2">
                        {evt.name}
                      </h3>
                      <p className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1.5">
                        <Calendar size={12} className="text-indigo-400 shrink-0" />
                        {evt.date} • {evt.time}
                      </p>
                      <p className="text-[11px] text-[var(--text-tertiary)] truncate">
                        {evt.venue}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[var(--border)]">
                      <button
                        onClick={() => handleOpenBuy(evt)}
                        className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20 transition-all"
                      >
                        <Ticket size={14} />
                        <span>{evt.type === 'PRIVATE' ? 'Register RSVP Pass' : 'Buy / Get Pass'}</span>
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

      {/* Modals */}
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
