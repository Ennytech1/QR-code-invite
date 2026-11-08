import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, ShieldCheck, Globe, Flame,
  Zap, ChevronRight, ChevronLeft, Play, Pause, Check,
  ChevronDown, Radio, Smartphone, QrCode
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const HERO_SLIDES = [
  {
    id: 'concerts',
    title: 'Festivals & Concerts',
    badge: 'Dual-Engine v2.5 • High-Throughput',
    headlinePrefix: 'Host Any Event.',
    headlineHighlight: 'Sell Tickets & Pack Venues.',
    description: 'Sell out massive public concerts and music festivals with sub-15ms optical QR gate turnstiles, offline cellular resilience, and zero duplicate ticket fraud.',
    image: '/images/hero/hero_concert.jpg',
    tag: 'Live Turnstile Mesh',
    statBadge: '1,400+ Scans/min',
    themeAccent: 'from-indigo-400 via-violet-300 to-purple-200',
    glowColor: 'rgba(99,102,241,0.35)',
    icon: Flame,
    metric: '99.98% Fraud Rejection'
  },
  {
    id: 'conferences',
    title: 'Tech Summits & Keynotes',
    badge: 'Enterprise Grade • NFC & QR Mesh',
    headlinePrefix: 'Host Global Summits.',
    headlineHighlight: 'Manage Keynotes & Expos.',
    description: 'Empower conventions and multi-track conferences with fast delegate check-in, real-time attendance telemetry, and multi-gate scanner synchronization.',
    image: '/images/hero/hero_conference.jpg',
    tag: 'Cryptographic Ed25519 Pass',
    statBadge: '<12ms Instant Scan',
    themeAccent: 'from-cyan-400 via-sky-300 to-indigo-200',
    glowColor: 'rgba(6,182,212,0.35)',
    icon: Zap,
    metric: 'Zero Gate Bottlenecks'
  },
  {
    id: 'galas',
    title: 'VIP Galas & Private Events',
    badge: '100% Free For Private Celebrations',
    headlinePrefix: 'Host Luxury Galas.',
    headlineHighlight: 'Personalized WhatsApp Passes.',
    description: 'Invite dignitary guests to private weddings and banquets with luxury custom JPEG cards sent straight to WhatsApp, protected by screenshot anti-replay locks.',
    image: '/images/hero/hero_gala.jpg',
    tag: 'Anti-Screenshot Verification',
    statBadge: 'Free RSVP Tier',
    themeAccent: 'from-amber-300 via-rose-300 to-violet-200',
    glowColor: 'rgba(245,158,11,0.35)',
    icon: Sparkles,
    metric: 'Zero Uninvited Plus-Ones'
  }
];

const HeroSection = () => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Auto-advance slideshow with smooth cross-fade
  useEffect(() => {
    if (!isAutoplay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoplay]);

  const active = HERO_SLIDES[currentSlide];

  return (
    <section
      className="relative w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden bg-slate-950 text-white select-none transition-all"
      onMouseEnter={() => setIsAutoplay(false)}
      onMouseLeave={() => setIsAutoplay(true)}
    >
      {/* ─── 1. Cinematic Background Image Slideshow Layer ─── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === idx ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover object-center transition-transform duration-[8000ms] ease-out ${
                currentSlide === idx ? 'scale-105' : 'scale-100'
              }`}
            />
          </div>
        ))}

        {/* Cinematic Multi-layer Gradient Vignette (Crystal-clear readable text with vibrant visual punch) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80" />
        <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[1.5px]" />

        {/* Dynamic Colored Radial Ambient Aura */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] rounded-full blur-[120px] opacity-40 transition-colors duration-1000 pointer-events-none"
          style={{ background: active.glowColor }}
        />

        {/* Subtle Tech Grid Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:32px_32px] opacity-60 pointer-events-none" />

        {/* Seamless bottom fade into page */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[var(--bg-base)] via-[var(--bg-base)]/80 to-transparent" />
      </div>

      {/* ─── 2. Top Segment: Mode Switcher Bar ─── */}
      <div className="relative z-10 pt-6 sm:pt-8 px-4 max-w-7xl mx-auto w-full flex items-center justify-center">
        <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl max-w-full overflow-x-auto no-scrollbar">
          {HERO_SLIDES.map((slide, idx) => {
            const IconComp = slide.icon;
            const isCurrent = currentSlide === idx;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(idx)}
                className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  isCurrent
                    ? 'bg-white text-slate-950 shadow-lg shadow-white/15 scale-100'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <IconComp
                  size={13}
                  className={isCurrent ? 'text-indigo-600' : 'text-indigo-400'}
                />
                <span>{slide.title}</span>
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
                )}
                {/* Active progress indicator */}
                {isCurrent && isAutoplay && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-indigo-600 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 3. Center Hero Stage (Balanced 100vh Centerpiece) ─── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto py-6 sm:py-8 space-y-6 sm:space-y-7">
        
        {/* Dynamic High-Throughput Live Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 backdrop-blur-xl text-xs font-semibold text-slate-200 shadow-xl transition-all duration-300 group">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-emerald-300 font-bold font-mono tracking-tight">
            {active.badge}
          </span>
          <span className="text-white/20">|</span>
          <span className="text-slate-300 font-medium">
            {active.tag}
          </span>
        </div>

        {/* Magnetic Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.05] drop-shadow-2xl">
          <span className="block drop-shadow-md text-white">{active.headlinePrefix}</span>
          <span className={`block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r ${active.themeAccent} drop-shadow-lg`}>
            {active.headlineHighlight}
          </span>
        </h1>

        {/* Crisp Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-3xl mx-auto font-normal leading-relaxed drop-shadow-md">
          {active.description}
        </p>

        {/* High-Converting CTA Action Cluster */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 pt-2">
          <Link
            to={user ? "/dashboard" : "/signup"}
            className="w-full sm:w-auto h-12 sm:h-13 px-8 rounded-2xl text-sm font-extrabold text-white flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 shadow-[0_4px_24px_rgba(99,102,241,0.45)] hover:shadow-[0_8px_32px_rgba(99,102,241,0.6)] ring-1 ring-white/25 transition-all duration-200 active:scale-95 cursor-pointer group"
          >
            <Sparkles size={16} className="text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>{user ? "Go to Dashboard" : "Get Started Free"}</span>
            <ArrowRight size={15} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/explore"
            className="w-full sm:w-auto h-12 sm:h-13 px-7 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/15 backdrop-blur-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
          >
            <Globe size={16} className="text-indigo-400" />
            <span>Explore Live Events</span>
          </Link>
        </div>

        {/* Live Metrics Proof Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 pt-1 text-xs text-slate-300">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold backdrop-blur-md">
            <Check size={12} strokeWidth={3} className="text-emerald-400" />
            <span>{active.statBadge}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold backdrop-blur-md">
            <ShieldCheck size={13} className="text-indigo-400" />
            <span>{active.metric}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold backdrop-blur-md">
            <Smartphone size={12} className="text-purple-400" />
            <span>WhatsApp Pass Dispatch</span>
          </span>
        </div>

      </div>

      {/* ─── 4. Bottom Dock: Floating Telemetry Bar & Scroll Cue ─── */}
      <div className="relative z-10 pb-4 sm:pb-6 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/75 border border-white/10 backdrop-blur-2xl shadow-2xl">
          
          {/* Left: Quick Features Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 text-left w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <QrCode size={14} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white">Dynamic Passes</p>
                <p className="text-[10px] text-slate-400">Encrypted Ed25519</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Radio size={14} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white">Offline Turnstiles</p>
                <p className="text-[10px] text-slate-400">Zero network dependency</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Smartphone size={14} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white">WhatsApp Native</p>
                <p className="text-[10px] text-slate-400">No app download</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Zap size={14} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white">Instant Box Office</p>
                <p className="text-[10px] text-slate-400">Split payment settlement</p>
              </div>
            </div>
          </div>

          {/* Right: Slideshow Controls & Scroll Down Prompt */}
          <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10 w-full sm:w-auto justify-between sm:justify-end">
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-white/5 border border-white/10">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Previous slide"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                onClick={() => setIsAutoplay(!isAutoplay)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={isAutoplay ? "Pause rotation" : "Resume rotation"}
              >
                {isAutoplay ? <Pause size={12} /> : <Play size={12} />}
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Next slide"
              >
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <span>Scroll to explore</span>
              <ChevronDown size={14} className="text-indigo-400 animate-bounce" />
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default HeroSection;