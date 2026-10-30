import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, MapPin, ArrowRight, Search,
  Filter, Flame, ChevronRight, Sparkles, Tag,
  Lock, Globe, Ticket
} from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import BuyTicketModal from '../modals/BuyTicketModal';
import InvitationCardModal from '../modals/InvitationCardModal';

const CATEGORIES = ['All', 'Conference', 'Wedding & Gala', 'Pool Party', 'VIP Dinner'];

const TrendingEventsSection = () => {
  const { events } = useEvents();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals for purchasing and viewing generated pass
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedBuyEvent, setSelectedBuyEvent] = useState(null);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [issuedGuest, setIssuedGuest] = useState(null);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        (evt.category && evt.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
        (evt.type && evt.type.toLowerCase().includes(selectedCategory.toLowerCase()));

      const matchesSearch =
        !searchQuery ||
        evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (evt.hostName && evt.hostName.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  const handleOpenBuy = (evt) => {
    setSelectedBuyEvent(evt);
    setBuyModalOpen(true);
  };

  return (
    <section id="events" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* ─── Trending Events Header & Filters ─── */}
      <div className="space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border)] pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Trending Events
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                <Flame size={12} />
                Popular now
              </span>
            </div>
            <p className="text-[13px] text-[var(--text-secondary)]">
              Discover top celebrations, ticketed pool parties, private galas, and conferences.
            </p>
          </div>

          {/* Search Input & Category Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Search event or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] text-[12px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-indigo-500 transition-colors w-full sm:w-56"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trending Events 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredEvents.map((evt) => {
            const minPrice = evt.ticketTiers && evt.ticketTiers.length > 0
              ? Math.min(...evt.ticketTiers.map((t) => t.price || 0))
              : 0;

            const priceLabel = minPrice === 0 ? 'Free / RSVP' : `₦${minPrice.toLocaleString()}`;

            return (
              <div
                key={evt.id}
                className="card-glow rounded-3xl overflow-hidden flex flex-col justify-between border border-[var(--border)] bg-[var(--bg-surface)] group hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300"
              >
                {/* Event Flyer with Gradient & Badges */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
                  <img
                    src={evt.banner}
                    alt={evt.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                        evt.type === 'PRIVATE'
                          ? 'bg-amber-500/80 text-black border-amber-400'
                          : 'bg-black/60 text-white border-white/10'
                      }`}
                    >
                      {evt.type === 'PRIVATE' ? '🔒 PRIVATE / RSVP' : evt.category || 'PUBLIC'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-md bg-amber-500/20 text-amber-300 border-amber-500/30">
                      {evt.type === 'PRIVATE' ? 'Guest List Only' : 'Popular now'}
                    </span>
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-2.5 left-2.5">
                    <div className="flex items-baseline gap-1.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15">
                      <span className="text-[10px] text-zinc-300">From</span>
                      <span className="text-white font-black text-[14px] font-mono">{priceLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-[15px] text-[var(--text-primary)] leading-snug line-clamp-2 group-hover:text-indigo-400 transition-colors">
                      {evt.name}
                    </h3>

                    {/* Date & Time */}
                    <div className="flex items-center gap-2 text-[12px] text-[var(--text-secondary)] font-medium">
                      <Calendar size={13} className="text-indigo-400 shrink-0" />
                      <span>{evt.date} • {evt.time}</span>
                    </div>

                    {/* Venue */}
                    <div className="flex items-center gap-2 text-[11px] text-[var(--text-tertiary)] truncate">
                      <MapPin size={13} className="text-zinc-400 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>

                  {/* Bottom Action: Get Ticket / RSVP Button */}
                  <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-emerald-500 font-mono">
                      {evt.issued || 120} passes issued
                    </span>
                    <button
                      onClick={() => handleOpenBuy(evt)}
                      className="h-8 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all"
                    >
                      <span>{evt.type === 'PRIVATE' ? 'RSVP Pass' : 'Get Ticket'}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

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

    </section>
  );
};

export default TrendingEventsSection;
