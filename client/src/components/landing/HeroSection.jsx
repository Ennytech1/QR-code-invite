import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Compass, ShieldCheck, Sparkles,
  Zap, Calendar, MapPin, CheckCircle2, Ticket,
  Flame, Clock, ChevronRight
} from 'lucide-react';

const HeroSection = ({ onSelectEvent }) => {
  const [selectedHeroTier, setSelectedHeroTier] = useState('early_bird');

  // Featured hero event
  const heroEvent = {
    id: 'evt_atlantis_4',
    title: 'Atlantis: The Party 4.0',
    venue: 'Eko Atlantic Beachfront, Victoria Island',
    date: 'Wed, 30 Dec 2026',
    time: '1:00 PM',
    price: selectedHeroTier === 'early_bird' ? 15000 : 45000,
    priceLabel: selectedHeroTier === 'early_bird' ? '₦15,000' : '₦45,000',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
    tiers: [
      { name: 'Early Bird Pass', price: 15000, desc: 'General festival grounds entry' },
      { name: 'VIP Golden Circle', price: 45000, desc: 'Front-stage access, private restrooms & open cocktail bar' }
    ]
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-pink-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Grid Pattern Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(99,102,241,0.06)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Value Proposition & Actions */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            
            {/* Live Micro Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-strong)] text-[12px] font-semibold text-[var(--text-primary)] shadow-sm hover:border-indigo-500/50 transition-all cursor-default">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-indigo-400">⚡ LIVE ACCESS</span>
              <span className="text-[var(--text-tertiary)]">•</span>
              <span>Sub-20ms Cryptographic Gate Engine</span>
              <ChevronRight size={13} className="text-[var(--text-tertiary)]" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[var(--text-primary)] leading-[1.06]">
              Your front row seat <br className="hidden sm:inline" />
              to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500">
                life’s best moments.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Sell tickets seamlessly, track every sale in real-time, scan attendees with zero latency, and run high-energy events with the confidence world-class organizers expect.
            </p>

            {/* CTA Button Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto h-12 px-8 rounded-xl text-[15px] font-bold text-white flex items-center justify-center gap-2.5 cursor-pointer btn-accent shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-95"
                style={{ background: 'linear-gradient(135deg,#6366f1 0%,#7c3aed 50%,#9333ea 100%)' }}
              >
                <span>Start Selling Tickets</span>
                <ArrowRight size={17} strokeWidth={2.5} />
              </Link>

              <a
                href="#events"
                className="w-full sm:w-auto h-12 px-7 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[15px] font-semibold text-[var(--text-primary)] flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Compass size={17} className="text-indigo-400" />
                <span>Browse Live Events</span>
              </a>
            </div>

            {/* Social Proof Avatars & Trust Pill */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-[12px] text-[var(--text-secondary)]">
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
                  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
                  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
                  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80',
                ].map((avatar, idx) => (
                  <img
                    key={idx}
                    src={avatar}
                    alt="Attendee avatar"
                    className="w-7 h-7 rounded-full border-2 border-[var(--bg-base)] object-cover shadow-sm"
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="font-bold text-[var(--text-primary)]">185,000+</span> attendees verified across Nigeria & Africa
              </div>
            </div>

            {/* Quick Keyword Tags */}
            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-[11px] text-[var(--text-tertiary)]">
              <span className="font-semibold text-[var(--text-secondary)]">Trending:</span>
              {['#DettyDecember', '#BeachParty', '#AfrobeatsLive', '#TechSummit2026', '#RooftopVibes'].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] border border-[var(--border)] font-mono text-[10px] text-[var(--text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>

          </div>

          {/* Right Column: Hero Live Event Card Showcase (Visual WOW Factor) */}
          <div className="lg:col-span-5 relative">
            
            {/* Ambient Background Glow behind Card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl -z-10 transform rotate-1" />

            {/* Main Interactive Event Card */}
            <div className="card-glow rounded-3xl overflow-hidden border border-indigo-500/30 bg-[var(--bg-surface)] shadow-2xl relative group transform hover:-translate-y-1 transition-all duration-300">
              
              {/* Event Image Banner with Overlay */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
                <img
                  src={heroEvent.image}
                  alt={heroEvent.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/30" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE ON SALE
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 backdrop-blur-md flex items-center gap-1">
                    <Flame size={12} />
                    78% Sold Out
                  </span>
                </div>

                {/* Countdown Timer Banner */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 text-white">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-300">
                    <Clock size={13} className="text-indigo-400" />
                    <span>Starts in:</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[12px] font-bold text-amber-400">
                    <span>02d</span> : <span>14h</span> : <span>22m</span> : <span className="text-white">45s</span>
                  </div>
                </div>
              </div>

              {/* Event Card Content */}
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">
                    FEATURED EXPERIENCE
                  </div>
                  <h3 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                    {heroEvent.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[12px] text-[var(--text-secondary)]">
                    <Calendar size={13} className="text-indigo-400 shrink-0" />
                    <span>{heroEvent.date} • {heroEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[var(--text-tertiary)] truncate">
                    <MapPin size={13} className="text-zinc-400 shrink-0" />
                    <span className="truncate">{heroEvent.venue}</span>
                  </div>
                </div>

                {/* Interactive Tier Switcher */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setSelectedHeroTier('early_bird')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedHeroTier === 'early_bird'
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                        : 'border-[var(--border)] bg-[var(--bg-subtle)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase">General</div>
                    <div className="font-extrabold text-[13px] text-[var(--text-primary)]">Early Bird</div>
                    <div className="font-mono text-indigo-400 font-bold text-[12px] mt-0.5">₦15,000</div>
                  </button>

                  <button
                    onClick={() => setSelectedHeroTier('vip')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedHeroTier === 'vip'
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                        : 'border-[var(--border)] bg-[var(--bg-subtle)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-amber-500 uppercase">Express Gate</div>
                    <div className="font-extrabold text-[13px] text-[var(--text-primary)]">VIP Golden</div>
                    <div className="font-mono text-indigo-400 font-bold text-[12px] mt-0.5">₦45,000</div>
                  </button>
                </div>

                {/* Action Row */}
                <div className="pt-2 flex items-center justify-between gap-3 border-t border-[var(--border)]">
                  <div className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>WhatsApp Pass included</span>
                  </div>

                  <button
                    onClick={() => onSelectEvent && onSelectEvent(heroEvent)}
                    className="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02]"
                  >
                    <span>Get Ticket</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Floating Mini Tech Pill */}
              <div className="absolute -bottom-3 -right-3 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 text-white border border-indigo-500/40 shadow-xl text-[11px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-cyan-300">RFC 8032</span>
                <span className="text-zinc-400">|</span>
                <span className="text-emerald-300">14ms offline gate</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;
