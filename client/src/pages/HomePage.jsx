import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, ShieldCheck, QrCode, Smartphone,
  Users, Calendar, CheckCircle2, MessageCircle, Download,
  Lock, Globe, Flame, Zap, ChevronRight, Play, Eye,
  Share2, Award, Clock, AlertOctagon, Check, Star,
  ShieldAlert, RefreshCw, Layers, Sliders, XCircle, ArrowUpRight,
  Send, Copy, Hash, MapPin, Tag
} from 'lucide-react';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';

import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';
import StatsSection from '../components/landing/StatsSection';
import MarqueeReelSection from '../components/landing/MarqueeReelSection';
import GateScannerDemoSection from '../components/landing/GateScannerDemoSection';
import LiveUpdatesSection from '../components/landing/LiveUpdatesSection';
import LiveTelemetryTicker from '../components/landing/LiveTelemetryTicker';
import CalculatorSection from '../components/landing/CalculatorSection';
import FaqSection from '../components/landing/FaqSection';

import { useEvents } from '../context/EventContext';
import BuyTicketModal from '../components/modals/BuyTicketModal';
import InvitationCardModal from '../components/modals/InvitationCardModal';

const TESTIMONIALS = [
  {
    quote: "We hosted over 1,400 executives at the Eko Convention Centre. Gate check-in was instantaneous (<12ms) with zero bottlenecks. The WhatsApp invitation JPEG cards made attendees feel like true dignitaries.",
    author: "Bayo Adeleke",
    role: "Lead Convener, West Africa Executive Summit",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    event: "Lagos Tech & Executive Gala"
  },
  {
    quote: "Our wedding had strictly 250 VIPs. Previously, uninvited friends would screenshot passes to gain entry. QRInvite's Ed25519 anti-replay lock caught 12 duplicate screenshot attempts at the door. Absolutely priceless.",
    author: "Folashade Balogun",
    role: "Private Wedding Host",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    event: "The Adeleke Royal Banquet"
  },
  {
    quote: "We sold out 3,000 festival passes online with instant bank settlement. Even when the beach cellular network crashed, the offline PWA scanner kept turnstiles moving seamlessly.",
    author: "Emeka Okonkwo",
    role: "Festival Operations Director",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    event: "Atlantis Beach Festival"
  }
];

const COMPARISON_POINTS = [
  {
    feature: 'Entry Speed & Gate Throughput',
    traditional: '20–45s per attendee with paper lists or manual check-offs',
    qrinvite: '< 15ms optical scan with instant audio-visual cues',
    highlight: true,
  },
  {
    feature: 'Duplicate & Screenshot Fraud',
    traditional: 'Unrestricted screenshot forwarding across multiple gates',
    qrinvite: 'Zero Double-Spend: Asymmetric Ed25519 & Redis atomic locks',
    highlight: true,
  },
  {
    feature: 'Flaky or Congested Cell Networks',
    traditional: 'System hangs when venue cellular signal drops',
    qrinvite: 'Offline-First PWA: Local IndexedDB verification with auto-sync',
    highlight: false,
  },
  {
    feature: 'Pass Delivery Channel',
    traditional: 'Slow physical printed cards or spam-filtered PDF attachments',
    qrinvite: 'Direct WhatsApp JPEG cards + Apple & Google Wallet passes',
    highlight: true,
  },
  {
    feature: 'Private & RSVP Event Pricing',
    traditional: 'Expensive monthly subscriptions or high flat fees',
    qrinvite: '100% Free Forever for private and RSVP celebrations',
    highlight: false,
  },
];

// Interactive Card Themes for Hero Demo
const CARD_THEMES = {
  gold: {
    name: 'Royal Gold',
    badge: 'HIGH TABLE VIP',
    bg: 'from-[#1a1610] via-[#0d0c0a] to-[#1a140b]',
    border: 'border-[#d4af37]/80',
    accentText: 'text-[#d4af37]',
    badgeBg: 'bg-[#d4af37] text-slate-950 font-black',
    glow: 'shadow-amber-500/10'
  },
  emerald: {
    name: 'Emerald Gala',
    badge: 'PLATINUM GALA',
    bg: 'from-[#081a14] via-[#040e0b] to-[#091a13]',
    border: 'border-emerald-500/80',
    accentText: 'text-emerald-400',
    badgeBg: 'bg-emerald-500 text-slate-950 font-black',
    glow: 'shadow-emerald-500/10'
  },
  midnight: {
    name: 'Midnight VIP',
    badge: 'EXECUTIVE SUITE',
    bg: 'from-[#12122b] via-[#080816] to-[#120f26]',
    border: 'border-indigo-500/80',
    accentText: 'text-indigo-400',
    badgeBg: 'bg-indigo-500 text-white font-black',
    glow: 'shadow-indigo-500/10'
  },
  ruby: {
    name: 'Ruby Sovereign',
    badge: 'VVIP DIGNITARY',
    bg: 'from-[#230b13] via-[#120409] to-[#200a11]',
    border: 'border-rose-500/80',
    accentText: 'text-rose-400',
    badgeBg: 'bg-rose-500 text-white font-black',
    glow: 'shadow-rose-500/10'
  }
};

const HomePage = () => {
  const { events } = useEvents();

  // Interactive Demo Tab in Hero
  const [activeTab, setActiveTab] = useState('private'); // 'private' | 'public' | 'scanner'

  // Hero Sandbox Interactive State (Private Invites)
  const [demoGuestName, setDemoGuestName] = useState('Chief Babatunde Balogun');
  const [demoTier, setDemoTier] = useState('High Table VIP');
  const [demoTheme, setDemoTheme] = useState('gold');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [showWhatsAppBubble, setShowWhatsAppBubble] = useState(false);

  // Hero Sandbox Interactive State (Public Ticket)
  const [publicTicketQty, setPublicTicketQty] = useState(1);
  const [publicTierPrice, setPublicTierPrice] = useState(45000);

  // Modals
  const [selectedEventForBuy, setSelectedEventForBuy] = useState(null);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [issuedGuest, setIssuedGuest] = useState(null);
  const [cardModalOpen, setCardModalOpen] = useState(false);

  // Events Category Filter in Landing
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically generate QR Code in Hero Sandbox
  useEffect(() => {
    const payload = JSON.stringify({
      app: 'QRInvite',
      guest: demoGuestName,
      tier: demoTier,
      sig: 'ed25519:8f3c7e91...a14b',
      iat: Math.floor(Date.now() / 1000)
    });

    QRCode.toDataURL(payload, {
      width: 240,
      margin: 1,
      color: { dark: '#09090b', light: '#ffffff' }
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch(() => {});
  }, [demoGuestName, demoTier]);

  const handleOpenBuy = (evt) => {
    setSelectedEventForBuy(evt);
    setBuyModalOpen(true);
  };

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

  const themeConfig = CARD_THEMES[demoTheme] || CARD_THEMES.gold;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* ─── Premium Sticky Navbar ─── */}
      <LandingNavbar />

      {/* ─── HERO SECTION: Apple & Linear Level Polish ─── */}
      <section className="relative pt-16 pb-16 md:pt-24 md:pb-24 overflow-hidden">
        
        {/* Ambient Radial Gradient Mesh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-10 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Subtle Background Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(99,102,241,0.06)_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          
          {/* Header Typography & Badges */}
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Elegant Sub-Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">The Dual-Engine Platform v2.5</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-slate-600 dark:text-slate-400 font-normal">Public Sales + Private WhatsApp Passes</span>
            </div>

            {/* Main Balanced Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.08]">
              Host Any Event.{' '}
              <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-300">
                Sell Tickets & Send VIP Passes.
              </span>
            </h1>

            {/* Refined Sub-paragraph */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
              Sell out public concerts and conferences, or invite guests to private celebrations with personalized WhatsApp JPEG passes—guaranteed with sub-15ms optical gate scanning and zero duplicate screenshot fraud.
            </p>

            {/* High-Converting CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto h-12 px-7 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles size={16} className="text-amber-300" />
                <span>Host Event Free</span>
                <ArrowRight size={15} />
              </Link>

              <Link
                to="/explore"
                className="w-full sm:w-auto h-12 px-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <Globe size={16} className="text-indigo-500" />
                <span>Explore Live Events</span>
              </Link>
            </div>

            {/* Trust Indicator Micro-Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-[12px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-emerald-500" /> 100% Free for Private Celebrations
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-emerald-500" /> &lt;15ms Optical Camera Scanning
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-emerald-500" /> Zero Double-Spend Anti-Replay
              </span>
            </div>

          </div>

          {/* ─── HERO LIVE INTERACTIVE PRODUCT SHOWCASE ─── */}
          <div className="max-w-5xl mx-auto rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#10131c] border border-slate-200/90 dark:border-slate-800/90 shadow-2xl space-y-6">
            
            {/* Interactive Mode Switcher Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Sparkles size={11} /> Live Platform Interactive Sandbox
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Test Both Event Modes & Gate Security Below
                </h3>
              </div>

              {/* 3 Tab Switchers */}
              <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('private')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'private'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  🔒 Private WhatsApp Pass
                </button>

                <button
                  onClick={() => setActiveTab('public')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'public'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  🌍 Public Box Office
                </button>

                <button
                  onClick={() => setActiveTab('scanner')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'scanner'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  ⚡ Gate Scanner
                </button>
              </div>
            </div>

            {/* TAB 1: PRIVATE WHATSAPP INVITATION CARDS (INTERACTIVE CUSTOMIZER) */}
            {activeTab === 'private' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in pt-2">
                
                {/* Left: Interactive Controls */}
                <div className="lg:col-span-6 space-y-4 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20">
                    <Sparkles size={12} /> Mode 1: Personalized VIP WhatsApp Passes
                  </div>
                  <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    Custom 2x JPEG Cards with Cryptographic QR
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Type an attendee name below and switch themes to watch the invitation pass update live:
                  </p>
                  
                  {/* Interactive Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Attendee Name on Pass:
                    </label>
                    <input
                      type="text"
                      value={demoGuestName}
                      onChange={(e) => setDemoGuestName(e.target.value)}
                      placeholder="e.g. Chief Babatunde Balogun"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  {/* Theme Switcher Pills */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Luxury Card Theme:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {Object.entries(CARD_THEMES).map(([k, t]) => (
                        <button
                          key={k}
                          onClick={() => setDemoTheme(k)}
                          className={`py-1.5 px-2.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                            demoTheme === k
                              ? 'border-amber-500 bg-amber-500/10 text-amber-500 shadow-sm'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggle WhatsApp View vs Card View */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => setShowWhatsAppBubble(!showWhatsAppBubble)}
                      className="px-4 py-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageCircle size={13} />
                      <span>{showWhatsAppBubble ? 'View Card Artwork' : 'Preview WhatsApp Bubble'}</span>
                    </button>

                    <Link
                      to="/dashboard"
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Sparkles size={13} />
                      <span>Open Studio in Dashboard</span>
                    </Link>
                  </div>
                </div>

                {/* Right: Dynamic Pass Preview or WhatsApp Chat Bubble */}
                <div className="lg:col-span-6 flex justify-center">
                  {showWhatsAppBubble ? (
                    /* Mock WhatsApp Chat Bubble */
                    <div className="w-full max-w-[340px] rounded-3xl p-4 bg-[#0b141a] border border-emerald-500/30 text-white shadow-2xl space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-semibold text-emerald-400">
                        <MessageCircle size={14} />
                        <span>WhatsApp Message Preview</span>
                      </div>
                      <div className="bg-[#005c4b] p-3.5 rounded-2xl rounded-tl-none space-y-2 text-xs shadow-md">
                        <p className="font-bold text-emerald-100">
                          🎉 You are invited to The Adeleke Royal Banquet!
                        </p>
                        <p className="text-[11px] text-emerald-50 leading-relaxed">
                          Hello <strong>{demoGuestName || 'Honored Guest'}</strong>, your VIP Digital Pass is attached below. Present this QR at Gate 1 for instant turnstile check-in.
                        </p>
                        <div className="rounded-xl overflow-hidden bg-black/40 p-2 border border-emerald-400/20 flex items-center gap-3">
                          <img
                            src={qrCodeDataUrl}
                            alt="Pass QR"
                            className="w-12 h-12 rounded bg-white p-1"
                          />
                          <div className="text-[10px] space-y-0.5">
                            <span className="font-bold text-white block">VIP_PASS_{demoTheme.toUpperCase()}.JPEG</span>
                            <span className="text-emerald-200 block">Table 1 • High Table VIP</span>
                            <span className="text-[9px] text-emerald-300 font-mono">Ed25519 Sealed</span>
                          </div>
                        </div>
                        <span className="text-[9px] text-emerald-200 text-right block">10:42 AM ✓✓</span>
                      </div>
                    </div>
                  ) : (
                    /* Holographic VIP Card Artwork */
                    <div className={`w-full max-w-[330px] rounded-3xl p-6 bg-gradient-to-b ${themeConfig.bg} border-2 ${themeConfig.border} text-white shadow-2xl ${themeConfig.glow} space-y-3.5 text-center relative overflow-hidden transition-all duration-300`}>
                      
                      {/* Top Header */}
                      <div className="flex justify-between items-center text-[9px] uppercase font-bold border-b border-white/15 pb-2.5">
                        <span className={themeConfig.accentText}>THE ADELEKE ROYAL BANQUET</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] ${themeConfig.badgeBg}`}>
                          {themeConfig.badge}
                        </span>
                      </div>

                      {/* Guest Details */}
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-slate-300 italic">Cordially invites</p>
                        <h5 className="text-lg font-black text-white truncate">
                          {demoGuestName || 'Distinguished Guest'}
                        </h5>
                        <p className={`text-[10px] font-semibold ${themeConfig.accentText}`}>
                          Table 1 • High Table Dignitary
                        </p>
                      </div>

                      {/* Dynamic Real QR Code */}
                      <div className="p-2.5 bg-white rounded-2xl w-32 h-32 mx-auto flex items-center justify-center shadow-inner my-1">
                        {qrCodeDataUrl ? (
                          <img
                            src={qrCodeDataUrl}
                            alt="Dynamic QR Code"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <QrCode size={105} className="text-slate-950" />
                        )}
                      </div>

                      {/* Cryptographic Footer */}
                      <div className="text-[9px] text-slate-300 space-y-1 border-t border-white/15 pt-2.5 text-left font-mono">
                        <div className="flex items-center gap-1 text-white">
                          <Calendar size={11} className={themeConfig.accentText} />
                          <span>Sat, 14 Nov 2026 • 2:00 PM</span>
                        </div>
                        <div className="flex justify-between items-center text-[8px] text-slate-400">
                          <span>The Grand Ballroom, Eko Hotel</span>
                          <span className="text-emerald-400 font-bold">RFC 8032 SEALED</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: PUBLIC TICKET SALES (INTERACTIVE PREVIEW) */}
            {activeTab === 'public' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in pt-2">
                <div className="lg:col-span-6 space-y-4 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    <Globe size={12} /> Mode 2: Multi-Tiered Public Ticket Sales
                  </div>
                  <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    Instant Bank & Card Checkout with Pass Issuance
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Attendees purchase tickets online via debit cards, bank transfers, or Apple Pay. Passes are dispatched immediately to attendee WhatsApp and email with zero spam delay.
                  </p>

                  <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                        <Check size={11} strokeWidth={3} />
                      </div>
                      <span>Early Bird, Regular, VIP & Platinum Table Packages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                        <Check size={11} strokeWidth={3} />
                      </div>
                      <span>Automatic settlement to Nigerian commercial banks next day</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                        <Check size={11} strokeWidth={3} />
                      </div>
                      <span>Automatic listing on the QRInvite Public Discovery feed</span>
                    </div>
                  </div>

                  <div className="pt-3 flex gap-3">
                    <Link
                      to="/explore"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                    >
                      <Globe size={13} />
                      <span>Browse Public Events Feed</span>
                    </Link>
                  </div>
                </div>

                {/* Perforated Public Ticket Graphic */}
                <div className="lg:col-span-6 flex justify-center">
                  <div className="w-full max-w-[330px] rounded-3xl p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/40 text-white shadow-2xl space-y-3.5 text-left relative overflow-hidden">
                    <div className="flex justify-between items-center border-b border-indigo-500/30 pb-2.5">
                      <span className="text-[10px] font-bold text-indigo-300 uppercase">PUBLIC TICKET PASS</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-indigo-500 text-white">VIP ENTRY</span>
                    </div>
                    <div>
                      <h5 className="text-base font-extrabold truncate">Lagos Tech Summit 2026</h5>
                      <p className="text-[11px] text-slate-400">Eko Convention Centre, Lagos</p>
                    </div>
                    <div className="p-3 bg-white rounded-2xl w-32 h-32 mx-auto flex items-center justify-center">
                      <QrCode size={105} className="text-slate-950" />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-300 font-mono pt-1">
                      <span>Attendee: Kelechi O.</span>
                      <span className="text-emerald-400 font-bold">₦45,000 PAID</span>
                    </div>
                    <div className="text-[9px] text-center text-slate-400 font-mono border-t border-indigo-500/30 pt-2">
                      TID: #TKT-88492 • GATE 1 & 2
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: GATE SCANNER (INTERACTIVE PREVIEW) */}
            {activeTab === 'scanner' && (
              <div className="animate-fade-in">
                <GateScannerDemoSection />
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ─── LIVE TURNSTILE TELEMETRY RADAR ─── */}
      <LiveTelemetryTicker />

      {/* ─── PLATFORM STATS & TRUST METRICS SECTION ─── */}
      <StatsSection />

      {/* ─── REAL EVENT ENERGY MARQUEE REEL ─── */}
      <MarqueeReelSection />

      {/* ─── THE TWO CORE ENGINES ARCHITECTURAL BREAKDOWN ─── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 border-t border-slate-200/80 dark:border-slate-800/80">
        
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Engineered For Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Two Powerful Engines in One Platform
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Whether you are hosting a ticketed public concert or a private 200-guest wedding banquet, QRInvite gives you total control.
          </p>
        </div>

        {/* 3 Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1 */}
          <div className="rounded-3xl p-7 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#10131c] space-y-4 flex flex-col justify-between hover:-translate-y-1 transition-transform shadow-sm hover:shadow-md">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Globe size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Engine 01 • Ticketing
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Public Ticket Sales & Box Office
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Sell tickets to the public with tiered pricing (Early Bird, Regular, VIP, Table Packages). Accept debit cards and bank transfers, with automated ticket delivery to attendee WhatsApp and email.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/explore"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Browse live ticket sales</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-3xl p-7 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#10131c] space-y-4 flex flex-col justify-between hover:-translate-y-1 transition-transform shadow-sm hover:shadow-md">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Sparkles size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                Engine 02 • Invitations
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Private WhatsApp VIP Passes (100% Free)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                For weddings, private dinners, and executive galas. Upload your guest list (CSV or manual), customize your invitation card theme, and export high-resolution JPEG images sent straight via WhatsApp.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/dashboard"
                className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1"
              >
                <span>Launch card designer</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-3xl p-7 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#10131c] space-y-4 flex flex-col justify-between hover:-translate-y-1 transition-transform shadow-sm hover:shadow-md">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                The Security Moat • Hardware
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Sub-15ms Gate Scanner Terminal
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Turn any phone into a high-speed gate scanner. Verifies cryptographically signed passes in under 15 milliseconds and instantly flags duplicate screenshot attempts across multiple entrances.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/gate-tech"
                className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1"
              >
                <span>Inspect gate security specs</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>

        </div>

      </section>

      {/* ─── INTERACTIVE GATE SCANNER DEMO SECTION ─── */}
      <GateScannerDemoSection />

      {/* ─── INTERACTIVE ORGANIZER EARNINGS CALCULATOR ─── */}
      <CalculatorSection />

      {/* ─── COMPARISON MATRIX: Traditional Event Check-in vs QRInvite ─── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Why Upgrade?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Traditional Gate Entry vs. QRInvite Dual-Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            See how cryptographic passes and atomic locks permanently eliminate entrance fraud and delays.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#10131c] shadow-lg">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
                <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Feature / Dimension</th>
                <th className="py-4 px-6 font-bold text-rose-500 uppercase tracking-wider text-[11px]">Traditional Event Solutions</th>
                <th className="py-4 px-6 font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[11px] bg-indigo-50/50 dark:bg-indigo-950/20">
                  QRInvite Platform
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {COMPARISON_POINTS.map((point, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                    {point.feature}
                  </td>
                  <td className="py-4 px-6 text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <XCircle size={15} className="text-rose-500 shrink-0" />
                    <span>{point.traditional}</span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-900 dark:text-white bg-indigo-50/30 dark:bg-indigo-950/10">
                    <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 size={15} className="shrink-0" />
                      <span>{point.qrinvite}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── LIVE UPDATES & PROMO CODE SPOTLIGHT ─── */}
      <LiveUpdatesSection />

      {/* ─── TRENDING PUBLIC EVENTS PREVIEW (CONNECTED TO EVENT CONTEXT) ─── */}
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
            {['All', 'Concerts', 'Festivals', 'Conferences', 'Galas'].map((cat) => (
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
                      onClick={() => handleOpenBuy(evt)}
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

      {/* ─── TESTIMONIALS & TRUSTED ORGANIZERS ─── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Trusted By The Best
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Loved By Event Planners, Couples & Festivals
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            See how event creators power their entrances with zero fraud and 5-star attendee experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-7 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#10131c] flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-10 h-10 rounded-full object-cover border border-indigo-500/30"
                />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{t.author}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── INTERACTIVE FAQ ACCORDION ─── */}
      <FaqSection />

      {/* ─── HIGH-CONVERTING CLOSING CALL TO ACTION BANNER ─── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-300">
              Ready to Upgrade Your Event Access?
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Start Free Today. No Setup Fees.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Create your event in under 2 minutes. Design custom JPEG passes, dispatch on WhatsApp, and scan your entrance gate with zero latency.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 pt-2">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-white text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl hover:bg-slate-100 transition-all cursor-pointer"
            >
              <span>Launch Organizer Portal</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/pricing"
              className="w-full sm:w-auto h-12 px-7 rounded-xl border border-white/20 hover:bg-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>View Pricing Plans</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <LandingFooter />

      {/* ─── Modals ─── */}
      <BuyTicketModal
        isOpen={buyModalOpen}
        onClose={() => {
          setBuyModalOpen(false);
          setSelectedEventForBuy(null);
        }}
        event={selectedEventForBuy}
        onTicketPurchased={(guest, evt) => {
          setIssuedGuest(guest);
          setSelectedEventForBuy(evt);
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
        event={selectedEventForBuy}
      />

    </div>
  );
};

export default HomePage;
