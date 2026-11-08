import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar, MapPin, Users, Ticket, ArrowLeft, ArrowRight,
  Sparkles, Lock, Globe, Plus, Trash2, Check, DollarSign,
  Palette, ShieldCheck, QrCode, Smartphone, Eye, MessageCircle,
  HelpCircle, ExternalLink, Image as ImageIcon, ChevronRight,
  Clock, CheckCircle2, AlertCircle, Radio, Upload, UploadCloud,
  FileImage, RefreshCw, Zap, Shield, Flame, CheckCircle,
  Building, CheckSquare
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEvents } from '../context/EventContext';

const BANNER_PRESETS = [
  { id: 'concert', label: 'Concert & Music Festival', tag: 'High Voltage', url: '/images/hero/hero_concert.jpg' },
  { id: 'summit', label: 'Tech Summit & Keynote', tag: 'Enterprise', url: '/images/hero/hero_conference.jpg' },
  { id: 'gala', label: 'VIP Gala & Royal Banquet', tag: 'Black Tie', url: '/images/hero/hero_gala.jpg' },
  { id: 'networking', label: 'Executive Leadership', tag: 'Summit Deck', url: '/images/wide_hero_bg.jpg' },
  { id: 'celebration', label: 'Celebration & Party Night', tag: 'Social', url: '/images/album_events.jpg' },
];

const CARD_THEME_OPTIONS = [
  { id: 'luxury-gold', name: 'Royal Gold & Black', desc: 'Weddings & Royal Galas', bg: 'from-amber-900/50 via-black to-slate-950', border: 'border-amber-500/50', text: 'text-amber-300', dot: 'bg-amber-400' },
  { id: 'midnight-vip', name: 'Midnight Violet VIP', desc: 'Nightlife & Private Parties', bg: 'from-purple-950 via-slate-950 to-black', border: 'border-purple-500/50', text: 'text-purple-300', dot: 'bg-purple-400' },
  { id: 'emerald-prestige', name: 'Emerald Prestige', desc: 'VIP Dinners & Retreats', bg: 'from-emerald-950 via-slate-950 to-black', border: 'border-emerald-500/50', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  { id: 'cyber-neon', name: 'Cyber Wave', desc: 'Tech & Rave Festivals', bg: 'from-cyan-950 via-slate-950 to-black', border: 'border-cyan-500/50', text: 'text-cyan-300', dot: 'bg-cyan-400' },
  { id: 'minimal-ivory', name: 'Minimalist Ivory', desc: 'Exhibitions & Summits', bg: 'from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:to-black', border: 'border-slate-300 dark:border-slate-700', text: 'text-slate-800 dark:text-slate-200', dot: 'bg-slate-400' },
];

const STEPS = [
  { step: 1, title: 'Choose Mode', subtitle: 'Public or Private Engine' },
  { step: 2, title: 'Event Details', subtitle: 'Artwork, Venue & Time' },
  { step: 3, title: 'Tickets & Passes', subtitle: 'Pricing & Visual Theme' },
  { step: 4, title: 'Review & Launch', subtitle: 'Cryptographic Verification' },
];

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { createEvent } = useEvents();

  // Wizard step state: 1, 2, 3, or 4
  const [currentStep, setCurrentStep] = useState(1);

  // Engine Mode: 'PUBLIC' | 'PRIVATE'
  const [eventType, setEventType] = useState('PUBLIC');
  const [previewTab, setPreviewTab] = useState('card'); // 'card' | 'pass'
  const [bannerMode, setBannerMode] = useState('template'); // 'template' | 'upload'
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Music & Concert',
    venue: '',
    date: '',
    time: '18:00',
    capacity: 500,
    banner: BANNER_PRESETS[0].url,
    hostName: 'Chief Kelechi Okafor',
    // Private mode fields
    dressCode: 'Black Tie / Formal Elegance',
    cardTheme: 'luxury-gold',
    customMessage: 'We cordially request the honor of your presence to celebrate with us.',
    plusOnesAllowed: 1,
    // Public mode fields
    currency: 'NGN',
    ticketTiers: [
      { id: 'tier_1', name: 'Early Bird Regular', price: 10000, capacity: 300, perks: 'General Admission' },
      { id: 'tier_2', name: 'VIP Pass', price: 35000, capacity: 150, perks: 'VIP Fast-track Gate & Lounge' },
      { id: 'tier_3', name: 'Executive Table (8 Guests)', price: 250000, capacity: 50, perks: 'Reserved Table & Champagne' },
    ],
  });

  const handleFileUpload = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image file must be under 10MB');
      return;
    }

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        setFormData((prev) => ({ ...prev, banner: base64 }));
        toast.success(`Artwork "${file.name}" uploaded and synced!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleAddTier = () => {
    setFormData((prev) => ({
      ...prev,
      ticketTiers: [
        ...prev.ticketTiers,
        {
          id: 'tier_' + Date.now(),
          name: 'VVIP All-Access',
          price: 75000,
          capacity: 50,
          perks: 'Backstage Access & Hospitality Lounge',
        },
      ],
    }));
  };

  const handleRemoveTier = (index) => {
    if (formData.ticketTiers.length <= 1) {
      toast.error('Event must have at least one ticket tier');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      ticketTiers: prev.ticketTiers.filter((_, idx) => idx !== index),
    }));
  };

  const handleTierChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.ticketTiers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, ticketTiers: updated };
    });
  };

  // Step 2 validation before proceeding
  const handleProceedFromStep2 = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter the event title');
      return;
    }
    if (!formData.venue.trim()) {
      toast.error('Please enter the venue address');
      return;
    }
    if (!formData.date) {
      toast.error('Please select the event date');
      return;
    }
    setCurrentStep(3);
  };

  // Final Publish Handler
  const handleFinalPublish = (e) => {
    if (e) e.preventDefault();
    if (!formData.name.trim() || !formData.venue.trim() || !formData.date) {
      toast.error('Please fill in all required event details');
      setCurrentStep(2);
      return;
    }

    try {
      const newEvent = createEvent({
        ...formData,
        type: eventType,
        capacity: Number(formData.capacity) || (eventType === 'PRIVATE' ? 100 : 500),
      });

      toast.success(
        eventType === 'PRIVATE'
          ? `Private Event "${formData.name}" created! Ready to dispatch WhatsApp invites.`
          : `Public Event "${formData.name}" published! Tickets are live.`
      );

      navigate(`/events/${newEvent.id}`);
    } catch (err) {
      toast.error('Failed to create event: ' + err.message);
    }
  };

  const currentTheme = CARD_THEME_OPTIONS.find((t) => t.id === formData.cardTheme) || CARD_THEME_OPTIONS[0];

  return (
    <div className="space-y-6 pb-24 font-body text-slate-800 dark:text-slate-100 max-w-6xl mx-auto px-3 sm:px-4">
      
      {/* ─── Breadcrumb & Top Bar ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-2 group transition-colors"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Events</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-heading">
              Create New Event
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 font-mono shadow-2xs">
              Step {currentStep} of 4
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete the 4-step wizard below to configure tickets, custom passes, and turnstile gate security.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/events')}
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
        >
          Cancel & Exit
        </button>
      </div>

      {/* ─── Standard Stepper Progress Bar ─── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0c0e14] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3.5">
        
        {/* Sleek Top Progress Bar Track */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-500 rounded-full transition-all duration-500 ease-out shadow-xs shadow-indigo-500/50"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STEPS.map((s) => {
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => {
                  if (isCompleted) setCurrentStep(s.step);
                }}
                disabled={!isCompleted && !isCurrent}
                className={`p-3 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3 relative group ${
                  isCurrent
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/25 shadow-md shadow-indigo-500/10 scale-[1.02]'
                    : isCompleted
                    ? 'bg-white dark:bg-slate-900 border-emerald-500/40 cursor-pointer hover:border-emerald-500 hover:scale-[1.01]'
                    : 'bg-slate-50 dark:bg-slate-900/30 border-slate-200/80 dark:border-slate-800/60 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-all duration-300 ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/35 scale-105 animate-pulse-beacon'
                    : isCompleted
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  {isCompleted ? <Check size={16} strokeWidth={3} className="animate-count-pulse" /> : s.step}
                </div>

                <div className="min-w-0 pr-1">
                  <p className={`text-xs font-bold truncate transition-colors ${
                    isCurrent ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : isCompleted ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {s.title}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate hidden sm:block">
                    {s.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          STEP 1: CHOOSE EVENT MODE (FIRST THING SHOWN)
         ───────────────────────────────────────────────────────────── */}
      {currentStep === 1 && (
        <div className="p-6 sm:p-9 rounded-3xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-7 animate-fade-in-scale">
          
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 mb-2">
              <Sparkles size={13} className="animate-pulse text-indigo-500" />
              <span>STEP 1: EVENT ARCHITECTURE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
              Select Your Event Access Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Choose the access model for your attendees. You can configure multi-tier ticket pricing, luxury WhatsApp passes, and gate scanners in the next steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-1">
            
            {/* Mode B: Public Ticketed Event */}
            <div
              onClick={() => {
                setEventType('PUBLIC');
                if (formData.banner === BANNER_PRESETS[2].url) {
                  setFormData((p) => ({ ...p, banner: BANNER_PRESETS[0].url }));
                }
              }}
              className={`p-6 sm:p-7 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between relative group overflow-hidden ${
                eventType === 'PUBLIC'
                  ? 'bg-gradient-to-b from-indigo-50/90 via-white to-indigo-50/30 dark:from-indigo-950/40 dark:via-slate-900/60 dark:to-slate-950 border-indigo-600 shadow-2xl shadow-indigo-600/15 ring-4 ring-indigo-500/15 scale-[1.01]'
                  : 'bg-slate-50/40 dark:bg-slate-900/40 border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 hover:bg-slate-50/80 hover:-translate-y-1'
              }`}
            >
              {/* Subtle Ambient Radial Glow */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
                eventType === 'PUBLIC' ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
              }`} />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      eventType === 'PUBLIC'
                        ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-600/35 scale-105'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:scale-105'
                    }`}>
                      <Globe size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-heading">
                          Mode B: Public Ticketed Event
                        </h3>
                      </div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
                        ⚡ Full Box Office Engine
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Concerts, Festivals, Conferences, Club Nights & Expos
                      </p>
                    </div>
                  </div>

                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    eventType === 'PUBLIC'
                      ? 'border-indigo-600 bg-indigo-600 text-white scale-110 shadow-md shadow-indigo-600/30'
                      : 'border-slate-300 dark:border-slate-700 group-hover:border-indigo-400'
                  }`}>
                    {eventType === 'PUBLIC' && <Check size={16} strokeWidth={3} className="animate-count-pulse" />}
                  </div>
                </div>

                <div className="mt-5 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="w-5 h-5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-2xs">
                      <CheckCircle2 size={13} strokeWidth={2.5} />
                    </div>
                    <span>Public self-service ticket landing & checkout portal</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="w-5 h-5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-2xs">
                      <CheckCircle2 size={13} strokeWidth={2.5} />
                    </div>
                    <span>Multi-tier pricing (Early Bird, General, VIP Deck, Tables)</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="w-5 h-5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-2xs">
                      <CheckCircle2 size={13} strokeWidth={2.5} />
                    </div>
                    <span>Instant debit card & bank transfer payment callback</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="w-5 h-5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-2xs">
                      <CheckCircle2 size={13} strokeWidth={2.5} />
                    </div>
                    <span>Sub-15ms optical QR turnstiles with offline resilience</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 text-[11.5px]">
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400">Includes:</span>
                <span className="text-slate-500 dark:text-slate-400">Self-service sales portal, multi-tier pricing, Paystack/Stripe checkout, instant QR pass delivery.</span>
              </div>
            </div>

            {/* Mode A: Private VIP Guestlist */}
            <div
              onClick={() => {
                setEventType('PRIVATE');
                setFormData((p) => ({ ...p, banner: BANNER_PRESETS[2].url }));
              }}
              className={`p-6 sm:p-7 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between relative group overflow-hidden ${
                eventType === 'PRIVATE'
                  ? 'bg-gradient-to-b from-amber-50/90 via-white to-amber-50/30 dark:from-amber-950/40 dark:via-slate-900/60 dark:to-slate-950 border-amber-500 shadow-2xl shadow-amber-500/15 ring-4 ring-amber-500/15 scale-[1.01]'
                  : 'bg-slate-50/40 dark:bg-slate-900/40 border-slate-200/90 dark:border-slate-800 hover:border-amber-300 dark:hover:border-slate-700 hover:bg-slate-50/80 hover:-translate-y-1'
              }`}
            >
              {/* Subtle Ambient Radial Glow */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
                eventType === 'PRIVATE' ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
              }`} />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      eventType === 'PRIVATE'
                        ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-black shadow-xl shadow-amber-500/35 scale-105'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:scale-105'
                    }`}>
                      <Lock size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-heading">
                          Mode A: Private VIP Guestlist
                        </h3>
                      </div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                        🔒 Luxury WhatsApp Engine
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Weddings, Galas, Listening Parties, Private Banquets
                      </p>
                    </div>
                  </div>

                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    eventType === 'PRIVATE'
                      ? 'border-amber-500 bg-amber-500 text-black scale-110 shadow-md shadow-amber-500/30'
                      : 'border-slate-300 dark:border-slate-700 group-hover:border-amber-400'
                  }`}>
                    {eventType === 'PRIVATE' && <Check size={16} strokeWidth={3} className="animate-count-pulse" />}
                  </div>
                </div>

                <div className="mt-5 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="w-5 h-5 rounded-md bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 shadow-2xs">
                      <CheckCircle2 size={13} strokeWidth={2.5} />
                    </div>
                    <span>Personalized luxury JPEG passes generated for each guest</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="w-5 h-5 rounded-md bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 shadow-2xs">
                      <CheckCircle2 size={13} strokeWidth={2.5} />
                    </div>
                    <span>Bulk WhatsApp API dispatch with 1-click delivery</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="w-5 h-5 rounded-md bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 shadow-2xs">
                      <CheckCircle2 size={13} strokeWidth={2.5} />
                    </div>
                    <span>Table allocation, seating assignments, plus-one limits</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="w-5 h-5 rounded-md bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 shadow-2xs">
                      <CheckCircle2 size={13} strokeWidth={2.5} />
                    </div>
                    <span>Anti-screenshot replay locks to prevent unverified gatecrashers</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 text-[11.5px]">
                <span className="font-extrabold text-amber-600 dark:text-amber-400">Includes:</span>
                <span className="text-slate-500 dark:text-slate-400">100% Free, custom WhatsApp JPEG cards, RSVP confirmation, table mapping, anti-screenshot locks.</span>
              </div>
            </div>

          </div>

          {/* Step 1 Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
              Engine selected: <strong className="text-slate-900 dark:text-white font-extrabold">{eventType === 'PUBLIC' ? 'Public Ticketed Event' : 'Private VIP Guestlist'}</strong>
            </span>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/45 transition-all duration-200 cursor-pointer active:scale-95 group"
            >
              <span>Continue to Event Details</span>
              <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 2: EVENT DETAILS & SCHEDULE
         ───────────────────────────────────────────────────────────── */}
      {currentStep === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in-scale">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              <div>
                <span className="text-[11px] font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                  STEP 2 OF 4 • ESSENTIALS
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5 font-heading">
                  Event Identity & Schedule
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Provide your event title, organizing entity, venue location, and capacity.
                </p>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Event Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={eventType === 'PRIVATE' ? 'e.g. Folashade & Bayo Royal Wedding Reception' : 'e.g. Lagos Neon Sunset Music Festival 2026'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-semibold transition-all"
                />
              </div>

              {/* Host & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Host / Organizing Entity
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. LiveNation Africa or The Adeleke Family"
                    value={formData.hostName}
                    onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 cursor-pointer transition-all"
                  >
                    <option value="Music & Concert">Music & Concert</option>
                    <option value="Tech Summit & Keynote">Tech Summit & Keynote</option>
                    <option value="Wedding & Social Gala">Wedding & Social Gala</option>
                    <option value="VIP Gala & Private Dinner">VIP Gala & Private Dinner</option>
                    <option value="Club & Nightlife">Club & Nightlife</option>
                  </select>
                </div>
              </div>

              {/* ─── Cover Banner Selection & Upload Hub ─── */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Cover Banner Image <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Upload your custom artwork or pick from curated templates
                    </span>
                  </div>

                  {/* Segmented Switcher: Upload ⇄ Templates */}
                  <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-auto shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setBannerMode('template')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                        bannerMode === 'template'
                          ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm scale-102'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <ImageIcon size={13} />
                      <span>Choose Template</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBannerMode('upload')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                        bannerMode === 'upload'
                          ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm scale-102'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Upload size={13} />
                      <span>Upload Artwork</span>
                    </button>
                  </div>
                </div>

                {/* TAB 1: CHOOSE FROM CURATED TEMPLATES */}
                {bannerMode === 'template' && (
                  <div className="space-y-3 animate-fade-in-scale">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {BANNER_PRESETS.map((preset) => {
                        const isSelected = formData.banner === preset.url;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              setUploadedFileName('');
                              setFormData({ ...formData, banner: preset.url });
                            }}
                            className={`relative aspect-[16/9] rounded-2xl overflow-hidden border-2 text-left transition-all duration-300 cursor-pointer group ${
                              isSelected
                                ? 'border-indigo-600 ring-4 ring-indigo-500/25 shadow-lg shadow-indigo-500/10 scale-[1.02]'
                                : 'border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700 hover:scale-[1.01]'
                            }`}
                          >
                            <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-2.5">
                              <span className="text-[9px] font-mono text-indigo-300 font-bold uppercase tracking-wider">{preset.tag}</span>
                              <span className="text-xs font-bold text-white leading-tight drop-shadow-md">{preset.label}</span>
                            </div>
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md animate-count-pulse">
                                <Check size={12} strokeWidth={3} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Direct URL input fallback */}
                    <div className="relative pt-1">
                      <input
                        type="text"
                        placeholder="Or enter external image web URL (https://...)"
                        value={formData.banner.startsWith('data:') ? '' : formData.banner}
                        onChange={(e) => {
                          setUploadedFileName('');
                          setFormData({ ...formData, banner: e.target.value });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 font-mono transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: DIRECT FILE UPLOAD ZONE */}
                {bannerMode === 'upload' && (
                  <div className="space-y-3 animate-fade-in-scale">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={(e) => handleFileUpload(e.target.files?.[0])}
                      className="hidden"
                    />

                    {formData.banner && uploadedFileName ? (
                      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3.5 flex flex-col sm:flex-row items-center gap-3.5 shadow-sm">
                        <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-800 shadow-2xs">
                          <img src={formData.banner} alt="Uploaded Cover" className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 min-w-0 text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-slate-900 dark:text-white truncate">
                            <CheckCircle2 size={13} className="text-emerald-500 shrink-0 animate-count-pulse" />
                            <span className="truncate">{uploadedFileName}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Custom artwork uploaded & synced to live card and pass preview.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs hover:scale-102"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedFileName('');
                              setFormData((p) => ({ ...p, banner: BANNER_PRESETS[0].url }));
                            }}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                            title="Remove uploaded image"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current?.click()}
                        className={`rounded-2xl border-2 border-dashed p-7 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group ${
                          isDragging
                            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[1.01]'
                            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50/70 dark:bg-slate-900/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20'
                        }`}
                      >
                        <div className="w-13 h-13 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-3 shadow-xs animate-float">
                          <UploadCloud size={26} />
                        </div>

                        <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                          <span className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2">Click to upload</span> or drag and drop artwork here
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                          PNG, JPG, WEBP or JPEG (Recommended 16:9 • 1200 × 675px • Max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Venue */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Venue Location & Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eko Convention Centre, Victoria Island, Lagos"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium transition-all"
                  />
                </div>
              </div>

              {/* Date, Time, Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Event Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Doors Open Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Total Capacity Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono font-bold transition-all"
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102"
                >
                  <ArrowLeft size={13} />
                  <span>Back to Mode</span>
                </button>

                <button
                  type="button"
                  onClick={handleProceedFromStep2}
                  className="px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition-all cursor-pointer active:scale-95 group"
                >
                  <span>Continue to Tickets & Passes</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          </div>

          {/* Right Live Preview Dock */}
          <div className="lg:col-span-5 sticky top-20">
            <PreviewCardDock
              formData={formData}
              eventType={eventType}
              previewTab={previewTab}
              setPreviewTab={setPreviewTab}
              currentTheme={currentTheme}
            />
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 3: TICKETS & PASSES CONFIGURATION
         ───────────────────────────────────────────────────────────── */}
      {currentStep === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in-scale">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              <div>
                <span className="text-[11px] font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                  STEP 3 OF 4 • ACCESS TIERS
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5 font-heading">
                  {eventType === 'PUBLIC' ? 'Ticket Tiers & Pricing' : 'WhatsApp Pass & RSVP Customization'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {eventType === 'PUBLIC'
                    ? 'Set up multiple ticket pricing tiers, quotas, and perks for your public checkout page.'
                    : 'Configure luxury card theme, custom host message, dress code, and plus-one limits for WhatsApp digital passes.'}
                </p>
              </div>

              {/* Public Mode: Ticket Tiers */}
              {eventType === 'PUBLIC' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Configured Ticket Tiers ({formData.ticketTiers.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddTier}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102 shadow-2xs"
                    >
                      <Plus size={13} />
                      <span>Add Tier</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.ticketTiers.map((tier, idx) => (
                      <div
                        key={tier.id}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 space-y-2.5 transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Tier Name (e.g. Early Bird, VIP)"
                            value={tier.name}
                            onChange={(e) => handleTierChange(idx, 'name', e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                          />

                          <div className="relative w-36">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₦</span>
                            <input
                              type="number"
                              placeholder="Price"
                              value={tier.price}
                              onChange={(e) => handleTierChange(idx, 'price', Number(e.target.value))}
                              className="w-full pl-6 pr-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                            />
                          </div>

                          {formData.ticketTiers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveTier(idx)}
                              className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                              title="Remove tier"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          placeholder="Perks & Privileges (e.g. VIP express turnstile & complimentary drink)"
                          value={tier.perks || ''}
                          onChange={(e) => handleTierChange(idx, 'perks', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] text-slate-600 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Private Mode: WhatsApp Pass Customization */
                <div className="space-y-4">
                  {/* Theme Picker */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Select Card Design Theme
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {CARD_THEME_OPTIONS.map((t) => {
                        const isSelected = formData.cardTheme === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, cardTheme: t.id })}
                            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                              isSelected
                                ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 ring-2 ring-amber-500/25 shadow-md scale-[1.01]'
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={`w-3.5 h-3.5 rounded-full ${t.dot} shrink-0 shadow-xs`} />
                              <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</p>
                                <p className="text-[10px] text-slate-400">{t.desc}</p>
                              </div>
                            </div>
                            {isSelected && <Check size={14} className="text-amber-500 animate-count-pulse" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dress Code & Plus One */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Dress Code Instruction
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Black Tie / Formal Elegance"
                        value={formData.dressCode}
                        onChange={(e) => setFormData({ ...formData, dressCode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Default Plus-One Allowance
                      </label>
                      <select
                        value={formData.plusOnesAllowed}
                        onChange={(e) => setFormData({ ...formData, plusOnesAllowed: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value={0}>Strictly 1 Pass (No Plus-Ones)</option>
                        <option value={1}>1 Guest Allowed (+1)</option>
                        <option value={2}>2 Guests Allowed (+2)</option>
                      </select>
                    </div>
                  </div>

                  {/* Host Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Host Message Printed on WhatsApp Invite
                    </label>
                    <textarea
                      rows={2}
                      value={formData.customMessage}
                      onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102"
                >
                  <ArrowLeft size={13} />
                  <span>Back to Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition-all cursor-pointer active:scale-95 group"
                >
                  <span>Continue to Final Review</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          </div>

          {/* Right Live Preview Dock */}
          <div className="lg:col-span-5 sticky top-20">
            <PreviewCardDock
              formData={formData}
              eventType={eventType}
              previewTab={previewTab}
              setPreviewTab={setPreviewTab}
              currentTheme={currentTheme}
            />
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 4: FINAL REVIEW & PUBLISH LAUNCHPAD
         ───────────────────────────────────────────────────────────── */}
      {currentStep === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in-scale">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              <div>
                <span className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                  STEP 4 OF 4 • FINAL CONFIRMATION
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5 font-heading">
                  Review & Publish Campaign
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verify your event configuration before activating the turnstile mesh and digital pass engine.
                </p>
              </div>

              {/* Summary Review Grid */}
              <div className="grid grid-cols-2 gap-3 p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Access Engine</span>
                  <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                    {eventType === 'PUBLIC' ? <Globe size={13} className="text-indigo-500" /> : <Lock size={13} className="text-amber-500" />}
                    <span>{eventType === 'PUBLIC' ? 'Public Box Office' : 'Private VIP Guestlist'}</span>
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Event Title</span>
                  <span className="font-extrabold text-slate-900 dark:text-white truncate block mt-0.5">
                    {formData.name || 'Untitled Event'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Date & Time</span>
                  <span className="font-extrabold text-slate-900 dark:text-white block mt-0.5">
                    {formData.date} • {formData.time}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Venue Address</span>
                  <span className="font-extrabold text-slate-900 dark:text-white truncate block mt-0.5">
                    {formData.venue}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Capacity</span>
                  <span className="font-extrabold font-mono text-indigo-600 dark:text-indigo-400 block mt-0.5">
                    {formData.capacity} attendees max
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {eventType === 'PUBLIC' ? 'Pricing Tiers' : 'Pass Theme'}
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white block mt-0.5">
                    {eventType === 'PUBLIC' ? `${formData.ticketTiers.length} tiers configured` : currentTheme.name}
                  </span>
                </div>
              </div>

              {/* Gate Security Notice */}
              <div className="p-4.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 text-xs space-y-1.5 text-emerald-950 dark:text-emerald-200">
                <p className="font-extrabold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck size={16} />
                  <span>Turnstile Hardware & Offline Resilience Ready</span>
                </p>
                <p className="text-[11.5px] leading-relaxed text-slate-600 dark:text-slate-300">
                  Upon publishing, all gate turnstiles will sync cryptographic Ed25519 public keys to prevent counterfeit passes. Passes validate in &lt;15ms even without internet at venue doors.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102"
                >
                  <ArrowLeft size={13} />
                  <span>Back to Pricing</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalPublish}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-sm flex items-center gap-2.5 shadow-xl shadow-indigo-600/35 hover:shadow-indigo-600/50 transition-all cursor-pointer active:scale-95 group"
                >
                  <Sparkles size={16} className="text-amber-300 group-hover:rotate-12 transition-transform" />
                  <span>{eventType === 'PUBLIC' ? 'Publish Public Event Campaign' : 'Launch Private RSVP Event'}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>

            </div>
          </div>

          {/* Right Live Preview Dock */}
          <div className="lg:col-span-5 sticky top-20">
            <PreviewCardDock
              formData={formData}
              eventType={eventType}
              previewTab={previewTab}
              setPreviewTab={setPreviewTab}
              currentTheme={currentTheme}
            />
          </div>

        </div>
      )}

    </div>
  );
};

/* ─── Modular Right-Side Preview Component with Holographic Sheen ─── */
const PreviewCardDock = ({ formData, eventType, previewTab, setPreviewTab, currentTheme }) => {
  return (
    <div className="space-y-4">
      {/* Preview Switcher */}
      <div className="p-1 rounded-2xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
        <span className="text-[11px] font-bold text-slate-400 pl-3 uppercase tracking-wider flex items-center gap-1.5">
          <Eye size={13} className="text-indigo-500" />
          <span>Real-time Preview</span>
        </span>

        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setPreviewTab('card')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              previewTab === 'card'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Catalog Card
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab('pass')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              previewTab === 'pass'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Mobile Pass
          </button>
        </div>
      </div>

      {/* VIEW 1: EVENT CATALOG CARD */}
      {previewTab === 'card' && (
        <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e14] shadow-xl space-y-0 transition-all card-lift">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
            <img
              src={formData.banner}
              alt={formData.name || 'Event Preview'}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border backdrop-blur-md ${
                eventType === 'PRIVATE'
                  ? 'bg-amber-500/90 text-black border-amber-400'
                  : 'bg-indigo-600/90 text-white border-indigo-400'
              }`}>
                {eventType === 'PRIVATE' ? '🔒 PRIVATE RSVP' : '🌍 PUBLIC TICKETED'}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Preview
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                {formData.category} • Hosted by {formData.hostName || 'Organizer'}
              </p>
              <h3 className="text-base font-extrabold text-white truncate drop-shadow-md">
                {formData.name || 'Untitled Event Campaign'}
              </h3>
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar size={13} className="text-indigo-500 shrink-0" />
                <span>{formData.date || 'Event Date'} • {formData.time || '18:00'}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={13} className="text-rose-500 shrink-0 mt-0.5" />
                <span className="truncate">{formData.venue || 'Venue Address'}</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              {eventType === 'PUBLIC' ? (
                <>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Starts at</span>
                    <span className="font-black text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                      ₦{(formData.ticketTiers[0]?.price || 10000).toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {formData.ticketTiers.length} Ticket Tiers
                  </span>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-[10px] text-amber-500 uppercase font-bold block">Guestlist Access</span>
                    <span className="font-extrabold text-slate-800 dark:text-white text-xs">
                      {formData.dressCode}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    WhatsApp Pass
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: MOBILE HOLOGRAPHIC PASS WITH SHIMMER FOIL */}
      {previewTab === 'pass' && (
        <div className="rounded-3xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e14] shadow-xl flex justify-center">
          <div className={`w-full max-w-[280px] rounded-2xl p-4 bg-gradient-to-b ${currentTheme.bg} border ${currentTheme.border} text-white shadow-2xl space-y-3 relative overflow-hidden transition-all duration-500 animate-float`}>
            
            {/* Dynamic Holographic Foil Light Sweep */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-foil-shimmer" />

            <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-white/70">
                Digital Gate Pass
              </span>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/10 border border-white/20">
                ED25519 VERIFIED
              </span>
            </div>

            <div className="text-center py-1 relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                {formData.category}
              </p>
              <h4 className="text-sm font-extrabold text-white truncate drop-shadow-md">
                {formData.name || 'Event Title'}
              </h4>
              <p className="text-[10px] text-white/80 mt-0.5">
                {formData.date || 'Date'} • {formData.venue || 'Venue'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white text-slate-900 flex flex-col items-center justify-center space-y-1 shadow-md relative z-10">
              <QrCode size={110} strokeWidth={2} className="text-slate-900" />
              <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500">
                SECURE-PASS-8841
              </span>
            </div>

            <div className="pt-1 text-center space-y-0.5 relative z-10">
              <p className="text-[11px] font-extrabold text-white">Chief Kelechi Okafor</p>
              <p className={`text-[10px] font-bold ${currentTheme.text}`}>VIP Access • Table 04</p>
              <p className="text-[9px] text-white/50 italic">Anti-screenshot concurrency enabled</p>
            </div>
          </div>
        </div>
      )}

      {/* Security Info Card */}
      <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-500/20 text-xs space-y-1.5 text-indigo-950 dark:text-indigo-200 shadow-2xs">
        <p className="font-bold flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300">
          <ShieldCheck size={14} />
          <span>Dual-Engine Gate Security</span>
        </p>
        <p className="text-[11.5px] leading-relaxed text-slate-600 dark:text-slate-300">
          Every pass generated contains an encrypted cryptographic token that validates instantly under 15ms at your gates, even when offline with no cellular network.
        </p>
      </div>
    </div>
  );
};

export default CreateEventPage;
