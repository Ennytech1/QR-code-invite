import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { useEvents } from '../../context/EventContext';

const CATEGORIES = ['All', 'Concerts', 'Festivals', 'Conferences', 'Galas'];

const TrendingEventsSection = ({ onBuyTicket }) => {
  const { events } = useEvents();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered public events
  const publicEvents = useMemo(() => {
    return events.filter((e) => {
      const isPublic = e.type === 'PUBLIC' || !e.type;
      const matchesCat =
        selectedCategory === 'All' ||
        (e.category && e.category.toLowerCase().includes(selectedCategory.toLowerCase()));
      const matchesSearch =
        !searchQuery ||
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchQuery.toLowerCase());
      return isPublic && matchesCat && matchesSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 border-t border-slate-200/80 dark:border-slate-800/80">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
              <Flame size={12} /> Live Box Office
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Trending Public Events
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Get verified digital passes to top concerts, conferences, and beachside festivals.
          </p>
        </div>

        <Link
          to="/explore"
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          <span>View All Events ({events.length})</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search events or venues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicEvents.slice(0, 6).map((evt) => {
          const minPrice = evt.ticketTiers && evt.ticketTiers.length > 0
            ? Math.min(...evt.ticketTiers.map((t) => t.price || 0))
            : 0;

          return (
            <div
              key={evt.id}
              className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#10131c] flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 shadow-sm"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                <img
                  src={evt.banner || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80'}
                  alt={evt.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {evt.category || 'Event'}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-baseline">
                  <span className="text-white font-black text-xs font-mono bg-black/70 px-2 py-0.5 rounded-md border border-white/10">
                    From {minPrice === 0 ? 'Free' : `₦${minPrice.toLocaleString()}`}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    {evt.issued || 120} passes issued
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5 text-left">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight line-clamp-2">
                    {evt.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Calendar size={12} className="text-indigo-500 shrink-0" />
                    {evt.date} • {evt.time || '1:00 PM'}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate flex items-center gap-1">
                    <MapPin size={11} className="shrink-0" />
                    <span>{evt.venue}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => onBuyTicket && onBuyTicket(evt)}
                    className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20 transition-all"
                  >
                    <span>Get Ticket</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default TrendingEventsSection;
