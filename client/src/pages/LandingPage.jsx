import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, QrCode, ShieldCheck, Smartphone, WifiOff,
  CheckCircle2, ArrowRight, Sparkles, ChevronRight,
  TrendingUp, Users, Lock, Clock, Send, Eye,
  Building2, Globe, Star, Play, Check, Flame,
  Sun, Moon, ShieldAlert, Calendar, MapPin, Tag,
  Search, Filter, X, ChevronDown, ChevronUp, Share2,
  Download, CreditCard, Ticket, BadgePercent, ArrowUpRight,
  Award, Compass, RefreshCw, Layers
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

// ─── High-Res Event Data Inspired by Popout Tickets ───
const TRENDING_EVENTS = [
  {
    id: 'evt_wet_party',
    title: 'Female ticket 2.0 The Wet Party',
    category: 'Pool Party',
    date: 'Sat, 17 Oct 2026',
    time: '9:26 pm',
    venue: 'Lotus Lounge, 1st Ave, Festac, Lagos',
    price: 3000,
    priceLabel: '₦3,000',
    originalPrice: '₦5,000',
    organizer: 'Wet Party Collective',
    badge: 'Popular now',
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    soldCount: '840 sold',
    capacityPct: 88,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80',
    tags: ['Pool Party', 'Nightlife', 'Lagos'],
    description: 'The wildest water & sound experience in Festac. Unmatched vibes, top guest DJs, pool floaties, and neon energy all night.',
    tiers: [
      { name: 'Female Ticket', price: 3000, desc: 'Full pool access & 1 free cocktail' },
      { name: 'Male Ticket', price: 5000, desc: 'Full general pool & lounge access' },
      { name: 'VIP Cabana (Table of 5)', price: 35000, desc: 'Dedicated cabana, premium bottle & VIP gate entry' }
    ]
  },
  {
    id: 'evt_groove_rules',
    title: 'My Groove My Rules Series',
    category: 'Music',
    date: 'Sat, 17 Oct 2026',
    time: '5:00 pm',
    venue: 'Adrenaline Lounge, Victoria Island, Lagos',
    price: 5000,
    priceLabel: '₦5,000',
    originalPrice: null,
    organizer: 'Groove House Global',
    badge: 'Selling Fast',
    badgeColor: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    soldCount: '1.2k sold',
    capacityPct: 92,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    tags: ['Underground', 'Afrobeats', 'Rave'],
    description: 'An unapologetic electronic and afrobeats sonic playground. High bass, red mood lights, and zero restrictions.',
    tiers: [
      { name: 'Regular Entry', price: 5000, desc: 'Access to main dance floor' },
      { name: 'VIP Balcony', price: 15000, desc: 'Elevated view, express bar & queue skip' }
    ]
  },
  {
    id: 'evt_atlantis_4',
    title: 'Atlantis The Party 4.0',
    category: 'Festivals',
    date: 'Wed, 30 Dec 2026',
    time: '1:00 pm',
    venue: 'Eko Atlantic Beachfront, Lagos',
    price: 15000,
    priceLabel: '₦15,000',
    originalPrice: '₦20,000',
    organizer: 'Westhan Entertainment',
    badge: 'Detty December',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    soldCount: '3.1k sold',
    capacityPct: 76,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    tags: ['Mega Festival', 'Beachfront', 'Concert'],
    description: 'The monumental return of West Africa’s premier coastal festival. 3 live stages, 24 headline artists, and non-stop fireworks.',
    tiers: [
      { name: 'Early Bird Pass', price: 15000, desc: 'General festival grounds access' },
      { name: 'VIP Golden Circle', price: 45000, desc: 'Front-stage access, private restrooms & open bar' },
      { name: 'VVIP Backstage Cabana', price: 180000, desc: 'Exclusive artist lounge access & bottle service' }
    ]
  },
  {
    id: 'evt_house_cassettes',
    title: 'House of Cassettes (Frank Ocean Tribute)',
    category: 'Family-friendly',
    date: 'Sun, 18 Oct 2026',
    time: '4:00 pm',
    venue: 'U&I, Opp. Idia Hall, University of Ibadan',
    price: 2500,
    priceLabel: '₦2,500',
    originalPrice: null,
    organizer: 'Cassette Tape Sessions',
    badge: 'Indie Vibe',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    soldCount: '410 sold',
    capacityPct: 65,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    tags: ['Vinyl', 'Acoustic', 'College'],
    description: 'Intimate listening session celebrating blonde, nostalgic R&B, vinyl pressings, artisan coffee, and live acoustic covers.',
    tiers: [
      { name: 'Student Pass', price: 2500, desc: 'Standard entry with student ID' },
      { name: 'Collector Pass + Vinyl', price: 9000, desc: 'Standard entry + commemorative mixtape tape' }
    ]
  }
];

const FEATURED_EVENTS = [
  {
    id: 'evt_dobe',
    title: 'Dobe! Afrobeats Live',
    category: 'Music',
    date: 'Sat, 24 Oct 2026',
    time: '10:00 pm',
    venue: 'Hard Rock Cafe Stage, Oniru, Lagos',
    price: 7500,
    priceLabel: '₦7,500',
    badge: 'Live Concert',
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
    description: 'Electrifying live stage showcase with top Nigerian breakout vocalists and live instrumental band orchestra.',
    tiers: [
      { name: 'Standard Standing', price: 7500, desc: 'Main floor standing area' },
      { name: 'VIP Seated', price: 20000, desc: 'Reserved table seat with complimentary drinks' }
    ]
  },
  {
    id: 'evt_suavee_cookout',
    title: 'Suavee Cookout ’26',
    category: 'Festivals',
    date: 'Sat, 28 Nov 2026',
    time: '2:00 pm',
    venue: 'Elegushi Beach Park, Lekki, Lagos',
    price: 4000,
    priceLabel: '₦4,000',
    badge: 'Food & Music',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    description: 'The mega outdoor barbecue festival. 30 culinary grill masters, craft cocktail popups, games arena, and beach party.',
    tiers: [
      { name: 'Taster Pass', price: 4000, desc: 'Entry + 2 food tasting coupons' },
      { name: 'Feast VIP', price: 12000, desc: 'Unlimited grill sampling & exclusive VIP lounge' }
    ]
  },
  {
    id: 'evt_new_wave',
    title: 'NEW WAVE FEST: Youth Culture',
    category: 'Festivals',
    date: 'Sun, 29 Nov 2026',
    time: '4:00 pm',
    venue: 'Federal University Arena, Minna',
    price: 3500,
    priceLabel: '₦3,500',
    badge: 'Campus Fest',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    description: 'Where streetwear fashion meets emerging alté soundscapes and skate culture. Built for the new youth generation.',
    tiers: [
      { name: 'Regular Entry', price: 3500, desc: 'Full festival and gaming lounge access' },
      { name: 'Squad Pack (4 Tickets)', price: 12000, desc: 'Entry for 4 friends at a discounted rate' }
    ]
  },
  {
    id: 'evt_louzze_asaba',
    title: 'ON THE LOUZZE ASABA',
    category: 'Nightlife',
    date: 'Sat, 05 Dec 2026',
    time: '6:30 pm',
    venue: 'Grand Hotel & Convention, Asaba',
    price: 10000,
    priceLabel: '₦10,000',
    badge: 'Exclusive',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=800&q=80',
    description: 'Delta State’s most anticipated year-end elite celebration. Red carpet welcome, celebrity appearances, and luxury lounges.',
    tiers: [
      { name: 'Silver Pass', price: 10000, desc: 'Access to general ballroom party' },
      { name: 'Gold VIP', price: 30000, desc: 'Reserved VIP seating & premium champagne' }
    ]
  }
];

const VIBE_GALLERY = [
  { img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80', caption: 'Lagos Beachfront Rave', stat: '🔥 2,400 checked in' },
  { img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80', caption: 'Festival Main Stage', stat: '⚡ 14ms gate speed' },
  { img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80', caption: 'Red Light Club Series', stat: '🎫 Sold Out VIP' },
  { img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80', caption: 'Summer Poolside Jam', stat: '💦 800+ attendees' },
  { img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80', caption: 'Alté Sound Experience', stat: '🎵 Live DJ Sets' },
  { img: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80', caption: 'Headline Concert Hall', stat: '🛡️ 0 Duplicate Passes' }
];

const LandingPage = () => {
  const { isDark, toggleTheme } = useTheme();

  // Active Category Filter
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Interactive Ticket Checkout Modal State
  const [checkoutEvent, setCheckoutEvent] = useState(null);
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isProcessingBuy, setIsProcessingBuy] = useState(false);
  const [purchasedPass, setPurchasedPass] = useState(null);

  // Interactive Live Gate Scanner Simulator
  const [simTier, setSimTier] = useState('VVIP');
  const [gateScanning, setGateScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Revenue Calculator State
  const [calcTicketPrice, setCalcTicketPrice] = useState(5000);
  const [calcAttendees, setCalcAttendees] = useState(350);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Calculate gross, platform fee (5% + ₦100) and net payout
  const calcGross = calcTicketPrice * calcAttendees;
  const calcFee = Math.round(calcGross * 0.05 + calcAttendees * 100);
  const calcNet = Math.max(0, calcGross - calcFee);

  // Filter events
  const allEvents = useMemo(() => [...TRENDING_EVENTS, ...FEATURED_EVENTS], []);
  const displayedEvents = useMemo(() => {
    if (selectedCategory === 'All') return TRENDING_EVENTS;
    return allEvents.filter(e => e.category.toLowerCase().includes(selectedCategory.toLowerCase()));
  }, [selectedCategory, allEvents]);

  // Handle Checkout Modal Trigger
  const handleOpenCheckout = (event) => {
    setCheckoutEvent(event);
    setSelectedTierIndex(0);
    setTicketQuantity(1);
    setPromoCodeInput('');
    setAppliedDiscount(0);
    setPurchasedPass(null);
  };

  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (code === 'POPOUT50' || code === 'QRINVITE50' || code === 'DISCOUNT') {
      setAppliedDiscount(50);
      toast.success('🎉 50% Promo code applied!');
    } else if (code === 'EARLYBIRD' || code === 'VIP10') {
      setAppliedDiscount(20);
      toast.success('🎉 20% Early Bird discount applied!');
    } else {
      toast.error('Invalid promo code. Try "POPOUT50"');
    }
  };

  const handleSimulatePurchase = () => {
    setIsProcessingBuy(true);
    setTimeout(() => {
      setIsProcessingBuy(false);
      const tier = checkoutEvent.tiers[selectedTierIndex];
      const passId = 'QRI-' + Math.floor(100000 + Math.random() * 900000);
      setPurchasedPass({
        passId,
        eventName: checkoutEvent.title,
        venue: checkoutEvent.venue,
        date: checkoutEvent.date,
        tierName: tier.name,
        qty: ticketQuantity,
        buyerName: 'Kelechi Okafor',
        code: `ed25519:sig_${Math.random().toString(36).substring(2, 10)}`
      });
      toast.success('Payment verified! Digital QR Pass generated.');
    }, 1200);
  };

  // Simulate Gate Scanner
  const handleGateScanTrigger = () => {
    setGateScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setGateScanning(false);
      setScanResult({
        status: 'VERIFIED',
        name: 'Chief Kelechi Okafor',
        tier: simTier,
        latency: '14ms',
        time: new Date().toLocaleTimeString()
      });
      toast.success('Gate Verification: <15ms latency. Access Granted!');
    }, 900);
  };

  return (
    <div className={`min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200 select-none overflow-x-hidden ${isDark ? 'dark' : ''}`}>

      {/* ─── Top Floating Ambient Banner ─── */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 text-white text-[11px] font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 relative z-50">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>⚡ <strong>POPULAR NOW:</strong> Discount Codes & Instant Bank Payouts are live across all events</span>
        <span className="hidden sm:inline-block px-1.5 py-0.2 bg-white/20 rounded text-[9px] uppercase tracking-wider font-mono">v2.4</span>
      </div>

      {/* ─── Glassmorphism Sticky Navbar ─── */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[var(--bg-base)]/80 border-b border-[var(--border)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-17 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700 shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl tracking-tighter">P</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-[var(--text-primary)]">
                  Popout<span className="text-indigo-500">Tickets</span>
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  QRInvite Engine
                </span>
              </div>
              <span className="text-[10px] block font-medium text-[var(--text-tertiary)] -mt-1 tracking-wider uppercase">
                Zero-Fraud Event Access
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-[var(--text-secondary)]">
            <a href="#events" className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5">
              <span>Events</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            </a>
            <a href="#how-it-works" className="hover:text-[var(--text-primary)] transition-colors">How It Works</a>
            <a href="#scanner-demo" className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
              <QrCode size={14} className="text-indigo-400" />
              <span>Gate Tech</span>
            </a>
            <a href="#pricing" className="hover:text-[var(--text-primary)] transition-colors">Pricing</a>
            <a href="#faqs" className="hover:text-[var(--text-primary)] transition-colors">FAQs</a>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="h-9 w-9 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all cursor-pointer shadow-sm"
              title="Toggle Theme"
              aria-label="Toggle Light/Dark Theme"
            >
              {isDark ? <Sun size={16} className="text-amber-400 rotate-0 transition-transform" /> : <Moon size={16} className="text-slate-700" />}
            </button>

            {/* Gate Scanner Direct Link */}
            <Link
              to="/scanner"
              className="hidden sm:flex h-9 px-3.5 items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] text-[13px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all shadow-sm"
            >
              <Smartphone size={14} className="text-indigo-400" />
              <span>Gate Terminal</span>
            </Link>

            {/* Launch / Sign In CTA */}
            <Link
              to="/dashboard"
              className="h-9 sm:h-10 px-4 sm:px-5 rounded-xl text-[13px] font-bold text-white flex items-center gap-2 cursor-pointer btn-accent shadow-lg shadow-indigo-500/25 transition-transform active:scale-95"
              style={{ background: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%)' }}
            >
              <span>Get Started</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero Section with Visual Radiance & Modern Atmosphere ─── */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        
        {/* Dynamic Glow Orbs Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-pink-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 left-10 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />

        {/* Subtle Geometric Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(99,102,241,0.06)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">

            {/* Floating Live Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-strong)] text-[12px] font-semibold text-[var(--text-primary)] shadow-sm hover:border-indigo-500/50 transition-all cursor-default animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-indigo-400">⚡ LIVE ACCESS</span>
              <span className="text-[var(--text-tertiary)]">•</span>
              <span>Sub-20ms Cryptographic Gate Engine</span>
              <ChevronRight size={13} className="text-[var(--text-tertiary)]" />
            </div>

            {/* Main Headline - Upgraded Typography */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[var(--text-primary)] leading-[1.08]">
              Your front row seat <br className="hidden sm:inline" />
              to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500">
                life’s best moments.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed font-normal">
              Sell tickets seamlessly, track every sale in real-time, scan attendees with zero latency, and run high-energy events with the confidence world-class organizers expect.
            </p>

            {/* High-Converting CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
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

            {/* Elevated 3-Card Stat Grid (Direct Upgrade from Screenshot 1) */}
            <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              
              {/* Stat 1: Events Hosted */}
              <div className="card-glow rounded-2xl p-5 text-center space-y-2 relative overflow-hidden group hover:-translate-y-1 transition-all border border-[var(--border)]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors" />
                <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shadow-inner">
                  <Calendar size={18} strokeWidth={2.3} />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
                  2,800+
                </div>
                <div className="label-xs text-[var(--text-secondary)] font-bold tracking-wider uppercase">
                  Events Hosted
                </div>
                <div className="text-[11px] font-medium text-emerald-500 flex items-center justify-center gap-1">
                  <TrendingUp size={12} /> +45% this quarter
                </div>
              </div>

              {/* Stat 2: Tickets Sold */}
              <div className="card-glow rounded-2xl p-5 text-center space-y-2 relative overflow-hidden group hover:-translate-y-1 transition-all border border-indigo-500/30 shadow-lg shadow-indigo-500/5">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-colors" />
                <div className="w-10 h-10 mx-auto rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shadow-inner">
                  <Ticket size={18} strokeWidth={2.3} />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
                  142K+
                </div>
                <div className="label-xs text-[var(--text-secondary)] font-bold tracking-wider uppercase">
                  Tickets Sold
                </div>
                <div className="text-[11px] font-medium text-emerald-500 flex items-center justify-center gap-1">
                  <CheckCircle2 size={12} /> 100% verified gate entry
                </div>
              </div>

              {/* Stat 3: Organizers */}
              <div className="card-glow rounded-2xl p-5 text-center space-y-2 relative overflow-hidden group hover:-translate-y-1 transition-all border border-[var(--border)]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-colors" />
                <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shadow-inner">
                  <Users size={18} strokeWidth={2.3} />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
                  3,200+
                </div>
                <div className="label-xs text-[var(--text-secondary)] font-bold tracking-wider uppercase">
                  Verified Organizers
                </div>
                <div className="text-[11px] font-medium text-indigo-400 flex items-center justify-center gap-1">
                  <Building2 size={12} /> Across 12 cities
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Party Energy Marquee Strip (Upgrade from Screenshot 2) ─── */}
      <section className="py-6 overflow-hidden relative border-y border-[var(--border)] bg-[var(--bg-subtle)]/40">
        <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-between text-[12px] font-semibold text-[var(--text-tertiary)]">
          <span className="flex items-center gap-2 text-indigo-400 uppercase tracking-widest font-mono text-[11px]">
            <Flame size={14} className="text-amber-500" /> Real Events • Real Energy • Verified Gates
          </span>
          <span className="hidden sm:inline-block">Hover to inspect vibe</span>
        </div>

        {/* Marquee Wrapper */}
        <div className="relative w-full overflow-hidden flex">
          {/* Edge Gradient Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[var(--bg-base)] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[var(--bg-base)] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex gap-5 py-2">
            {[...VIBE_GALLERY, ...VIBE_GALLERY].map((item, idx) => (
              <div
                key={idx}
                className="w-72 sm:w-80 h-48 rounded-2xl relative overflow-hidden group shrink-0 border border-white/10 shadow-lg cursor-pointer transform hover:scale-[1.03] transition-all duration-300"
              >
                <img
                  src={item.img}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                  <div>
                    <h4 className="text-[13px] font-bold drop-shadow-sm">{item.caption}</h4>
                    <span className="text-[10px] text-zinc-300 font-mono">{item.stat}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold">
                    Popout
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works: Three Steps to a Stronger Launch (Upgrade from Screenshot 3) ─── */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[11px] font-bold uppercase tracking-wider">
            How It Works
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)]">
            Three steps to a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              stronger event launch.
            </span>
          </h2>
          <p className="text-[15px] text-[var(--text-secondary)]">
            No technical skills required. If you can share a link, you can sell tickets and protect your door.
          </p>
        </div>

        {/* 3 Step Cards with Premium Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Step 1 */}
          <div className="card-glow rounded-3xl p-7 space-y-6 flex flex-col justify-between border border-[var(--border)] relative group hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-5xl font-black text-indigo-500/30 group-hover:text-indigo-500/60 transition-colors font-mono">
                  01
                </span>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar size={22} strokeWidth={2.2} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                Create Your Event
              </h3>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                Add your flyer, write your event story, set up multi-tiered tickets (Early Bird, VIP, Table packages), and publish with a branded custom public link in under 2 minutes.
              </p>
            </div>

            {/* Interactive Feature Teaser Box */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] space-y-2 text-[11px]">
              <div className="flex items-center justify-between text-[var(--text-tertiary)]">
                <span className="font-semibold text-indigo-400">⚡ Smart Flyer Sync</span>
                <span>Ready to share</span>
              </div>
              <div className="font-mono text-[10px] text-[var(--text-secondary)] truncate bg-[var(--bg-base)] p-1.5 rounded border border-[var(--border)]">
                popouttickets.com/e/wet-party-2026
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="card-glow rounded-3xl p-7 space-y-6 flex flex-col justify-between border border-purple-500/30 relative group hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/10 transition-all shadow-lg shadow-purple-500/5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-5xl font-black text-purple-500/30 group-hover:text-purple-500/60 transition-colors font-mono">
                  02
                </span>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CreditCard size={22} strokeWidth={2.2} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                Sell Tickets Online
              </h3>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                Share your link on WhatsApp, Instagram & X. Attendees pay smoothly via Bank Transfer, Card, or Apple Pay and receive cryptographically signed QR tickets directly in WhatsApp & email.
              </p>
            </div>

            {/* Interactive Feature Teaser Box */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] space-y-2 text-[11px]">
              <div className="flex items-center justify-between text-[var(--text-tertiary)]">
                <span className="font-semibold text-emerald-400">💬 WhatsApp Cloud Dispatch</span>
                <span className="text-emerald-500 font-bold">100% Delivered</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)]">
                <Smartphone size={14} className="text-purple-400" />
                <span>One-tap Apple & Google Wallet pass addition</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="card-glow rounded-3xl p-7 space-y-6 flex flex-col justify-between border border-[var(--border)] relative group hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-5xl font-black text-emerald-500/30 group-hover:text-emerald-500/60 transition-colors font-mono">
                  03
                </span>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <QrCode size={22} strokeWidth={2.2} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                Check In & Get Paid
              </h3>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                Scan attendees at the door in &lt;15ms with any phone camera—even when the venue has zero network connection. Request bank withdrawal anytime and receive settlements next day.
              </p>
            </div>

            {/* Interactive Feature Teaser Box */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] space-y-2 text-[11px]">
              <div className="flex items-center justify-between text-[var(--text-tertiary)]">
                <span className="font-semibold text-cyan-400">🛡️ Anti-Replay Mutex</span>
                <span>0 duplicate screenshots</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-emerald-500 font-mono">
                <span>GTBank / Access Payouts</span>
                <span className="font-bold">Next Day Settled</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── Trending Events Showcase (Upgrade from Screenshot 4) ─── */}
      <section id="events" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header with Category Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border)] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Trending Events
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Popular now
              </span>
            </div>
            <p className="text-[13px] text-[var(--text-secondary)]">
              Discover high-demand tickets, guest lists, and concerts selling right now.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {['All', 'Pool Party', 'Music', 'Festivals', 'Nightlife'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
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

        {/* 4 Cards Grid - Modern, High Energy Event Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedEvents.map((evt) => (
            <div
              key={evt.id}
              className="card-glow rounded-2xl overflow-hidden flex flex-col justify-between border border-[var(--border)] group hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300"
            >
              {/* Event Flyer with Gradient & Badges */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {evt.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-md ${evt.badgeColor}`}>
                    {evt.badge}
                  </span>
                </div>

                {/* Price Tag Overlay */}
                <div className="absolute bottom-2.5 left-2.5">
                  <div className="flex items-baseline gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15">
                    <span className="text-[10px] text-zinc-300">From</span>
                    <span className="text-white font-extrabold text-[15px]">{evt.priceLabel}</span>
                    {evt.originalPrice && (
                      <span className="text-[11px] text-zinc-400 line-through">{evt.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-extrabold text-[15px] text-[var(--text-primary)] leading-snug line-clamp-2 group-hover:text-indigo-400 transition-colors">
                    {evt.title}
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

                {/* Bottom Action: Get Ticket Button */}
                <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-emerald-500">
                    {evt.soldCount}
                  </span>
                  <button
                    onClick={() => handleOpenCheckout(evt)}
                    className="h-8 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow transition-all"
                  >
                    <span>Get Ticket</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Featured Events Showcase (Upgrade from Screenshot 5) ─── */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Featured Events
            </h2>
            <p className="text-[13px] text-[var(--text-secondary)]">
              Curated celebrations, festival experiences, and nightlife takeovers.
            </p>
          </div>
          <Link
            to="/events"
            className="text-[12px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Featured Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_EVENTS.map((evt) => (
            <div
              key={evt.id}
              className="card-glow rounded-2xl overflow-hidden flex flex-col justify-between border border-[var(--border)] group hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {evt.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-md ${evt.badgeColor}`}>
                    {evt.badge}
                  </span>
                </div>
                <div className="absolute bottom-2.5 left-2.5">
                  <span className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 text-white font-extrabold text-[14px]">
                    {evt.priceLabel}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-[15px] text-[var(--text-primary)] leading-snug truncate group-hover:text-indigo-400 transition-colors">
                    {evt.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[12px] text-[var(--text-secondary)] font-medium">
                    <Calendar size={13} className="text-indigo-400 shrink-0" />
                    <span>{evt.date} • {evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[var(--text-tertiary)] truncate">
                    <MapPin size={13} className="text-zinc-400 shrink-0" />
                    <span className="truncate">{evt.venue}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--border)] flex items-center justify-end">
                  <button
                    onClick={() => handleOpenCheckout(evt)}
                    className="w-full h-8 rounded-lg bg-[var(--bg-subtle)] hover:bg-indigo-600 hover:text-white border border-[var(--border)] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Get Ticket</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Interactive Live Gate Terminal Simulator (QRInvite Signature Tech) ─── */}
      <section id="scanner-demo" className="py-20 bg-[var(--bg-subtle)]/40 border-y border-[var(--border)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-bold uppercase tracking-wider">
              Gate Cryptography
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Experience the Sub-20ms Gate Scanner
            </h2>
            <p className="text-[14px] text-[var(--text-secondary)]">
              Test how bouncers scan tickets at the door. Signed with RFC 8032 Ed25519 cryptography to guarantee zero duplicate pass screenshot fraud.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="card-glow rounded-3xl p-6 sm:p-8 border border-[var(--border)] bg-[var(--bg-surface)] shadow-2xl relative">
              
              {/* Terminal Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-[var(--border)] gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[16px] text-[var(--text-primary)]">Gate Terminal PWA Simulation</h4>
                    <span className="text-[11px] text-[var(--text-tertiary)] font-mono">Terminal #GATE-02 • 100% Offline Mode</span>
                  </div>
                </div>

                {/* Tier Switcher for Demo */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]">
                  {['REGULAR', 'VIP', 'VVIP'].map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setSimTier(tier)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        simTier === tier
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Interactive Demo Container */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 items-center">
                
                {/* Left: Mobile Digital Ticket Pass */}
                <div className="space-y-4">
                  <div className="rounded-2xl p-5 border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-black text-white relative shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Popout Pass</span>
                        <h4 className="text-[15px] font-bold">Lagos Tech Summit & Rave</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {simTier} ACCESS
                      </span>
                    </div>

                    <div className="py-4 space-y-1">
                      <div className="text-[11px] text-zinc-400 font-mono">Holder: Chief Kelechi Okafor</div>
                      <div className="text-[11px] text-zinc-400 font-mono">Gate ID: #QRI-88219</div>
                      <div className="text-[10px] text-cyan-400 font-mono truncate">
                        Sig: ed25519:7b9a2c...8f1d (Tamper Proof)
                      </div>
                    </div>

                    {/* Barcode & Hologram footer */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                      <span>VERIFIED TICKET</span>
                      <span>1 PASS • ADMIT ONE</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[var(--text-tertiary)] text-center">
                    Tickets sync into Apple Wallet or WhatsApp with encrypted optical QR codes.
                  </p>
                </div>

                {/* Right: Optical Camera Scanner Viewport */}
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-56 h-56 rounded-2xl bg-zinc-950 border-2 border-dashed border-indigo-500/40 relative flex items-center justify-center overflow-hidden shadow-inner">
                    
                    {/* Corner Target Markers */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-indigo-400" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-indigo-400" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-indigo-400" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-indigo-400" />

                    {/* Laser scanning beam */}
                    {gateScanning && (
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 shadow-[0_0_12px_#34d399] animate-laser" />
                    )}

                    {/* Scanned QR Mockup */}
                    <div className="p-2 rounded-xl bg-white shadow-lg">
                      <svg className="w-24 h-24 text-zinc-950" viewBox="0 0 100 100" fill="currentColor">
                        <rect x="10" y="10" width="26" height="26" />
                        <rect x="64" y="10" width="26" height="26" />
                        <rect x="10" y="64" width="26" height="26" />
                        <rect x="42" y="10" width="16" height="16" />
                        <rect x="42" y="42" width="16" height="16" />
                        <rect x="10" y="42" width="16" height="16" />
                        <rect x="64" y="42" width="16" height="16" />
                        <rect x="42" y="64" width="16" height="16" />
                        <rect x="64" y="64" width="26" height="26" />
                      </svg>
                    </div>

                    {/* Scan Verified Flash Overlay */}
                    {scanResult && (
                      <div className="absolute inset-0 bg-emerald-600/95 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4 text-center animate-fade-in space-y-1">
                        <CheckCircle2 size={36} className="text-white animate-bounce" />
                        <span className="font-extrabold text-[15px] tracking-wide">VERIFIED PASS</span>
                        <span className="text-[11px] font-mono">{scanResult.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 uppercase">
                          {scanResult.tier} TIER
                        </span>
                        <span className="text-[9px] font-mono text-emerald-200">
                          Gate Latency: {scanResult.latency}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Trigger Scan Button */}
                  <button
                    onClick={handleGateScanTrigger}
                    disabled={gateScanning}
                    className="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[13px] font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20 transition-transform active:scale-95"
                  >
                    <QrCode size={16} />
                    <span>{gateScanning ? 'Verifying Ed25519...' : 'Simulate Door Scan'}</span>
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─── Clear Pricing. No Mystery Math (Upgrade from Screenshot 5) ─── */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[11px] font-bold uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)]">
            Clear pricing. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              No mystery math.
            </span>
          </h2>
          <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
            Free events stay free; normal ticketed events are charged at <strong>5% + ₦100</strong>; and voting events are charged at <strong>8%</strong>. If you need on-ground support, printing, or custom operations, we can quote for that too.
          </p>
        </div>

        {/* 4 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Tier 1: Free Events */}
          <div className="card-glow rounded-3xl p-6 sm:p-7 space-y-6 flex flex-col justify-between border border-[var(--border)] group hover:border-[var(--border-strong)] transition-all">
            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                FREE EVENTS
              </span>
              <div className="space-y-1">
                <div className="text-4xl font-black text-[var(--text-primary)]">
                  ₦0
                </div>
                <div className="text-[12px] text-[var(--text-secondary)]">
                  Per ticket, always.
                </div>
              </div>
              <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                Hosting a free event? We don’t charge a single kobo. Create, share, and fill your seats completely free — no catch.
              </p>

              <div className="pt-2 border-t border-[var(--border)] space-y-2 text-[12px] text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-indigo-400" />
                  <span>Unlimited Free Attendees</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-indigo-400" />
                  <span>WhatsApp & Email Passes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-indigo-400" />
                  <span>Mobile Camera Scanner App</span>
                </div>
              </div>
            </div>

            <Link
              to="/dashboard"
              className="w-full h-10 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-subtle)] text-[13px] font-bold text-[var(--text-primary)] flex items-center justify-center transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Tier 2: Ticket Events (MOST POPULAR) */}
          <div className="card-glow rounded-3xl p-6 sm:p-7 space-y-6 flex flex-col justify-between border-2 border-indigo-500 relative shadow-2xl shadow-indigo-500/10 transform lg:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
              Most Popular
            </div>

            <div className="space-y-4 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                TICKET EVENTS
              </span>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-[var(--text-primary)]">
                  5% <span className="text-[18px] font-bold text-[var(--text-secondary)]">+ ₦100</span>
                </div>
                <div className="text-[12px] text-[var(--text-secondary)]">
                  Per paid ticket sold.
                </div>
              </div>
              <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                For regular ticketed events. We keep this predictable so organizers earn clean profits, slowly.
              </p>

              <div className="pt-2 border-t border-[var(--border)] space-y-2 text-[12px] text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Instant Next-Day Bank Payouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Zero Screenshot Duplicate Lock</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Discount & Promo Codes Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Unlimited Concurrent Door Gates</span>
                </div>
              </div>
            </div>

            <Link
              to="/dashboard"
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-bold flex items-center justify-center transition-colors shadow-lg shadow-indigo-500/25"
            >
              Get Started
            </Link>
          </div>

          {/* Tier 3: Voting Events */}
          <div className="card-glow rounded-3xl p-6 sm:p-7 space-y-6 flex flex-col justify-between border border-[var(--border)] group hover:border-[var(--border-strong)] transition-all">
            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                VOTING EVENTS
              </span>
              <div className="space-y-1">
                <div className="text-4xl font-black text-[var(--text-primary)]">
                  8%
                </div>
                <div className="text-[12px] text-[var(--text-secondary)]">
                  Per vote purchase.
                </div>
              </div>
              <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                Built for paid voting experiences with transparent fee handling and live vote tallying.
              </p>

              <div className="pt-2 border-t border-[var(--border)] space-y-2 text-[12px] text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-indigo-400" />
                  <span>Live Public Leaderboards</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-indigo-400" />
                  <span>Anti-Bot Fraud Screening</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-indigo-400" />
                  <span>Instant Automated Tallying</span>
                </div>
              </div>
            </div>

            <Link
              to="/dashboard"
              className="w-full h-10 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-subtle)] text-[13px] font-bold text-[var(--text-primary)] flex items-center justify-center transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Tier 4: Custom Services */}
          <div className="card-glow rounded-3xl p-6 sm:p-7 space-y-6 flex flex-col justify-between border border-[var(--border)] group hover:border-[var(--border-strong)] transition-all">
            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                CUSTOM SERVICES
              </span>
              <div className="space-y-1">
                <div className="text-3xl font-black text-[var(--text-primary)]">
                  Tailored Quote
                </div>
                <div className="text-[12px] text-[var(--text-secondary)]">
                  For advanced event operations.
                </div>
              </div>
              
              <div className="pt-2 border-t border-[var(--border)] space-y-2.5 text-[12px] text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-purple-400" />
                  <span>Fabric wrist tags & RFID printing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-purple-400" />
                  <span>On-site physical gate bouncer support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-purple-400" />
                  <span>Turnstile API hardware integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-purple-400" />
                  <span>Custom event operations setup</span>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/2348000000000?text=Hello%20Popout%20Tickets,%20I%20need%20a%20tailored%20quote"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-10 rounded-xl border border-[var(--border)] hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-500 text-[13px] font-bold text-[var(--text-primary)] flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Smartphone size={14} className="text-emerald-500" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

        </div>

        {/* ─── Interactive Organizer Earnings Calculator ─── */}
        <div className="card-glow rounded-3xl p-6 sm:p-8 border border-[var(--border)] bg-[var(--bg-surface)] max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-4">
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Interactive Earnings Calculator
              </h3>
              <p className="text-[12px] text-[var(--text-secondary)]">
                Drag to calculate your payout with 5% + ₦100 transparent pricing.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              NEXT-DAY SETTLEMENT
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Sliders */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[13px] font-semibold">
                  <span className="text-[var(--text-secondary)]">Average Ticket Price</span>
                  <span className="font-mono text-indigo-400 font-bold">₦{calcTicketPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="500"
                  value={calcTicketPrice}
                  onChange={(e) => setCalcTicketPrice(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-[var(--bg-subtle)] rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[13px] font-semibold">
                  <span className="text-[var(--text-secondary)]">Expected Ticket Sales</span>
                  <span className="font-mono text-purple-400 font-bold">{calcAttendees} tickets</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="2000"
                  step="10"
                  value={calcAttendees}
                  onChange={(e) => setCalcAttendees(Number(e.target.value))}
                  className="w-full accent-purple-600 h-2 bg-[var(--bg-subtle)] rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Breakdown Card */}
            <div className="rounded-2xl p-5 bg-[var(--bg-subtle)] border border-[var(--border)] space-y-4">
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[var(--text-secondary)]">Gross Ticket Revenue:</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">₦{calcGross.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[var(--text-secondary)]">Platform Fee (5% + ₦100):</span>
                <span className="font-mono text-rose-400">-₦{calcFee.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-[var(--border)] flex justify-between items-center">
                <span className="font-bold text-[14px] text-[var(--text-primary)]">Your Net Bank Payout:</span>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  ₦{calcNet.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ─── Live Updates & Platform Innovations (Upgrade from Screenshot 5 bottom) ─── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[11px] font-bold uppercase tracking-wider">
            Live Updates
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            Events Happening on Popout Tickets
          </h2>
          <p className="text-[13px] text-[var(--text-secondary)]">
            Real events, real energy. See what organizers and attendees are creating every day.
          </p>
        </div>

        {/* Feature Spotlight Card: Discount Codes */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-violet-950/40 border border-purple-500/30 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-md">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
                NEW FEATURE
              </span>
              <h3 className="text-3xl font-black tracking-tight">
                We added Discount Codes & Group Bundles.
              </h3>
              <p className="text-zinc-300 text-[13px] leading-relaxed">
                Give your loyal attendees percentage or flat discounts off ticket prices. Set usage limits, expiration dates, and secret VIP codes.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <span className="px-3 py-1 rounded-lg bg-black/40 border border-white/20 font-mono text-xs text-amber-300 font-bold">
                  Code: POPOUT50 (50% Off)
                </span>
                <span className="text-[11px] text-zinc-400">Test it in the ticket checkout!</span>
              </div>
            </div>

            {/* Flyer Graphic Pill */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-center space-y-2 shadow-2xl shrink-0 w-64">
              <div className="w-12 h-12 mx-auto rounded-xl bg-purple-500 flex items-center justify-center text-white shadow-lg">
                <BadgePercent size={26} />
              </div>
              <div className="font-extrabold text-xl">Get 50% Off</div>
              <div className="text-[11px] text-purple-200">
                Instant checkout promotion applied on tickets.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Frequently Asked Questions (FAQ Accordion) ─── */}
      <section id="faqs" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[11px] font-bold uppercase tracking-wider">
            Common Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How quickly do ticket sale proceeds reach my bank account?',
              a: 'All ticket revenues process via automated clearing and settle directly into your registered Nigerian bank account (GTBank, Access, Zenith, Kuda, etc.) the next business day. Instant settlement requests are also supported for verified pro organizers.'
            },
            {
              q: 'What happens if venue cellular network drops completely during check-in?',
              a: 'Our Gate Scanner PWA uses RFC 8032 Ed25519 asymmetric cryptography and IndexedDB local caching. Because the cryptographic signature is verified against the organizer’s public key locally on the bouncer’s phone, ticket validation works 100% offline with zero internet.'
            },
            {
              q: 'Can attendees cheat by sharing ticket screenshots with their friends?',
              a: 'No. Our distributed Redis atomic concurrency mutex locks passes upon initial optical gate entry. If an adversary attempts to present the same QR screenshot at another gate terminal, the scanner immediately rejects it with a red DUPLICATE REPLAY error.'
            },
            {
              q: 'How does WhatsApp delivery work for tickets?',
              a: 'Once an attendee completes payment, our Meta Cloud API integration automatically sends a branded WhatsApp message containing their digital pass, calendar invite, and one-tap Apple/Google Wallet file.'
            },
            {
              q: 'Is there any monthly subscription fee for hosting events?',
              a: 'Zero monthly subscriptions. You only pay when you sell paid tickets (5% + ₦100). If your event is free, Popout Tickets is 100% free with unlimited attendees.'
            }
          ].map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="card-glow rounded-2xl border border-[var(--border)] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-[14px] text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-subtle)] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} className="text-indigo-400 shrink-0" /> : <ChevronDown size={18} className="text-[var(--text-tertiary)] shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-[13px] text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)] pt-3 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Final High-Converting Call to Action ─── */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-3xl p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)' }}
        >
          {/* Subtle Ambient Orbs */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="px-3 py-1 rounded-full bg-white/10 text-indigo-200 border border-white/20 text-[11px] font-bold uppercase tracking-wider">
              Launch Today
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to eliminate ticket fraud and sell out your event?
            </h2>
            <p className="text-indigo-200 text-[14px] sm:text-base leading-relaxed">
              Create your event in 60 seconds, accept instant payments, and protect your doors with Africa’s most advanced gate access engine.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto h-12 px-8 rounded-xl text-[14px] font-extrabold text-indigo-950 bg-white hover:bg-zinc-100 transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                <span>Launch Organizer Portal</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/scanner"
                className="w-full sm:w-auto h-12 px-6 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-[14px] font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <QrCode size={16} />
                <span>Test Gate Terminal</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Interactive Ticket Checkout Modal ─── */}
      {checkoutEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="card-glow rounded-3xl max-w-lg w-full bg-[var(--bg-surface)] border border-[var(--border)] shadow-2xl overflow-hidden relative animate-fade-up max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Instant Checkout
                </span>
                <h3 className="font-bold text-[16px] text-[var(--text-primary)] truncate max-w-xs sm:max-w-sm">
                  {checkoutEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setCheckoutEvent(null)}
                className="w-8 h-8 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {!purchasedPass ? (
                <>
                  {/* Event Snippet */}
                  <div className="flex gap-4 p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border)]">
                    <img
                      src={checkoutEvent.image}
                      alt={checkoutEvent.title}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="text-[12px] space-y-1">
                      <div className="font-bold text-[var(--text-primary)]">{checkoutEvent.title}</div>
                      <div className="text-[var(--text-secondary)]">{checkoutEvent.date} • {checkoutEvent.time}</div>
                      <div className="text-[var(--text-tertiary)] truncate max-w-[200px]">{checkoutEvent.venue}</div>
                    </div>
                  </div>

                  {/* Tier Selection */}
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                      Select Ticket Tier
                    </label>
                    <div className="space-y-2">
                      {checkoutEvent.tiers.map((t, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedTierIndex(idx)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            selectedTierIndex === idx
                              ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                              : 'border-[var(--border)] bg-[var(--bg-subtle)] hover:border-[var(--border-strong)]'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-[13px] text-[var(--text-primary)]">{t.name}</div>
                            <div className="text-[11px] text-[var(--text-secondary)]">{t.desc}</div>
                          </div>
                          <span className="font-extrabold text-[14px] text-indigo-400 font-mono">
                            ₦{t.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]">
                    <div>
                      <span className="font-bold text-[13px] text-[var(--text-primary)]">Ticket Quantity</span>
                      <p className="text-[11px] text-[var(--text-secondary)]">Max 10 tickets per order</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setTicketQuantity(q => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] font-bold text-[14px] flex items-center justify-center cursor-pointer hover:bg-[var(--bg-subtle)]"
                      >
                        -
                      </button>
                      <span className="font-bold text-[14px] font-mono">{ticketQuantity}</span>
                      <button
                        onClick={() => setTicketQuantity(q => Math.min(10, q + 1))}
                        className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] font-bold text-[14px] flex items-center justify-center cursor-pointer hover:bg-[var(--bg-subtle)]"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Promo Code Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                      Discount Code (Try "POPOUT50")
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. POPOUT50"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        className="flex-1 h-10 px-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] text-[13px] uppercase font-mono font-bold focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="h-10 px-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:bg-[var(--bg-subtle)] text-[12px] font-bold cursor-pointer transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Price Calculation Summary */}
                  {(() => {
                    const rawSubtotal = checkoutEvent.tiers[selectedTierIndex].price * ticketQuantity;
                    const discountAmt = Math.round(rawSubtotal * (appliedDiscount / 100));
                    const finalTotal = Math.max(0, rawSubtotal - discountAmt);

                    return (
                      <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] space-y-2 text-[12px]">
                        <div className="flex justify-between text-[var(--text-secondary)]">
                          <span>Subtotal ({ticketQuantity}x {checkoutEvent.tiers[selectedTierIndex].name}):</span>
                          <span className="font-mono font-bold">₦{rawSubtotal.toLocaleString()}</span>
                        </div>
                        {appliedDiscount > 0 && (
                          <div className="flex justify-between text-emerald-500 font-bold">
                            <span>Promo Discount ({appliedDiscount}% Off):</span>
                            <span className="font-mono">-₦{discountAmt.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-[var(--text-tertiary)] text-[11px]">
                          <span>Gate Security & Access Fee:</span>
                          <span className="font-mono">₦0 (Covered by host)</span>
                        </div>
                        <div className="pt-2 border-t border-[var(--border)] flex justify-between items-center text-[14px]">
                          <span className="font-bold text-[var(--text-primary)]">Total Amount:</span>
                          <span className="text-xl font-black text-indigo-500 font-mono">
                            ₦{finalTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </>
              ) : (
                /* Ticket Issued Success Screen */
                <div className="space-y-6 text-center py-2 animate-fade-in">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 size={36} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[var(--text-primary)]">Pass Issued & Confirmed!</h4>
                    <p className="text-[12px] text-[var(--text-secondary)]">
                      Your tamper-proof digital ticket was sent to WhatsApp and Email.
                    </p>
                  </div>

                  {/* Digital Pass Preview */}
                  <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border border-indigo-500/40 text-white space-y-4 text-left shadow-2xl">
                    <div className="flex justify-between items-start border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-300">CONFIRMED PASS</span>
                        <h5 className="font-extrabold text-[14px]">{purchasedPass.eventName}</h5>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 border border-indigo-400/40 uppercase">
                        {purchasedPass.tierName}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div>
                        <span className="text-zinc-400 block text-[9px]">ATTENDEE</span>
                        <span>{purchasedPass.buyerName}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[9px]">TICKET ID</span>
                        <span className="text-indigo-300">{purchasedPass.passId}</span>
                      </div>
                    </div>

                    {/* QR Code SVG */}
                    <div className="flex items-center justify-center p-3 bg-white rounded-xl shadow-inner">
                      <svg className="w-28 h-28 text-zinc-950" viewBox="0 0 100 100" fill="currentColor">
                        <rect x="10" y="10" width="26" height="26" />
                        <rect x="64" y="10" width="26" height="26" />
                        <rect x="10" y="64" width="26" height="26" />
                        <rect x="42" y="10" width="16" height="16" />
                        <rect x="42" y="42" width="16" height="16" />
                        <rect x="10" y="42" width="16" height="16" />
                        <rect x="64" y="42" width="16" height="16" />
                        <rect x="42" y="64" width="16" height="16" />
                        <rect x="64" y="64" width="26" height="26" />
                      </svg>
                    </div>

                    <div className="text-center font-mono text-[9px] text-cyan-300">
                      RFC 8032 Signature: {purchasedPass.code}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 border-t border-[var(--border)] bg-[var(--bg-subtle)] flex items-center justify-end gap-3">
              {!purchasedPass ? (
                <>
                  <button
                    onClick={() => setCheckoutEvent(null)}
                    className="h-10 px-4 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-surface)] text-[12px] font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSimulatePurchase}
                    disabled={isProcessingBuy}
                    className="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[13px] font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20"
                  >
                    {isProcessingBuy ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Verifying Card...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay Securely & Get QR Pass</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setCheckoutEvent(null)}
                  className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-bold flex items-center justify-center cursor-pointer shadow-md"
                >
                  Done
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ─── Modern Public Footer (Upgrade from Screenshot 5) ─── */}
      <footer className="border-t border-[var(--border)] py-14 bg-[var(--bg-base)] text-[13px] text-[var(--text-tertiary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Brand Info */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[14px] font-black">
                  P
                </div>
                <span className="font-extrabold text-[16px] text-[var(--text-primary)]">
                  Popout<span className="text-indigo-500">Tickets</span>
                </span>
              </div>
              <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                Africa’s premier event ticketing, gate access, and organizer platform powered by cryptographic Ed25519 tokens.
              </p>
              <div className="pt-1 flex items-center gap-2 text-emerald-500 text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>All Gate Gateways 100% Operational</span>
              </div>
            </div>

            {/* Col 2: Discover */}
            <div className="space-y-3">
              <h4 className="font-bold text-[13px] text-[var(--text-primary)] uppercase tracking-wider">
                Discover
              </h4>
              <ul className="space-y-2 text-[12px] text-[var(--text-secondary)]">
                <li><a href="#events" className="hover:text-indigo-400 transition-colors">Trending Events</a></li>
                <li><a href="#events" className="hover:text-indigo-400 transition-colors">Concerts & Nightlife</a></li>
                <li><a href="#events" className="hover:text-indigo-400 transition-colors">Festivals & Raves</a></li>
                <li><a href="#events" className="hover:text-indigo-400 transition-colors">Campus Experiences</a></li>
              </ul>
            </div>

            {/* Col 3: Organizers */}
            <div className="space-y-3">
              <h4 className="font-bold text-[13px] text-[var(--text-primary)] uppercase tracking-wider">
                Organizers
              </h4>
              <ul className="space-y-2 text-[12px] text-[var(--text-secondary)]">
                <li><Link to="/dashboard" className="hover:text-indigo-400 transition-colors">Host an Event</Link></li>
                <li><Link to="/scanner" className="hover:text-indigo-400 transition-colors">Gate Scanner Terminal</Link></li>
                <li><a href="#pricing" className="hover:text-indigo-400 transition-colors">Transparent Pricing</a></li>
                <li><a href="#pricing" className="hover:text-indigo-400 transition-colors">Earnings Calculator</a></li>
              </ul>
            </div>

            {/* Col 4: Trust & Compliance */}
            <div className="space-y-3">
              <h4 className="font-bold text-[13px] text-[var(--text-primary)] uppercase tracking-wider">
                Security & Legal
              </h4>
              <ul className="space-y-2 text-[12px] text-[var(--text-secondary)]">
                <li className="flex items-center gap-1.5"><Lock size={12} className="text-indigo-400" /> RFC 8032 Cryptography</li>
                <li className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-400" /> PCI-DSS Level 1 Banking</li>
                <li><a href="#faqs" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                <li><a href="#faqs" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[var(--text-tertiary)] gap-3">
            <div>
              © 2026 Popout Tickets & QRInvite Engine. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <a href="#how-it-works" className="hover:text-[var(--text-primary)] transition-colors">How It Works</a>
              <a href="#pricing" className="hover:text-[var(--text-primary)] transition-colors">Pricing Matrix</a>
              <Link to="/dashboard" className="hover:text-[var(--text-primary)] transition-colors">Organizer Portal</Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
