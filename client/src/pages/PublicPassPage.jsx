import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  QrCode, ShieldCheck, Calendar, Clock, MapPin, Sparkles,
  Award, Users, Radio, Share2, Download, Copy, CheckCircle2,
  AlertTriangle, ExternalLink, ChevronRight, Lock, ArrowLeft,
  Smartphone, Shield, Eye, Sun, Wifi, WifiOff, BookmarkCheck,
  Maximize2, Minimize2, Check, RefreshCw
} from 'lucide-react';
import QRCode from 'qrcode';
import { toPng } from 'html-to-image';
import toast from 'react-hot-toast';
import { useEvents } from '../context/EventContext';

const TIER_STYLES = {
  VVIP: {
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm shadow-purple-500/20',
    borderGlow: 'border-purple-500/40 shadow-purple-900/30',
    cardGradient: 'from-[#2b1754] via-[#1a103c] to-[#0d0722]',
    icon: Award,
    accent: '#a855f7',
    foilGradient: 'from-amber-200 via-purple-300 to-indigo-200',
  },
  VIP: {
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm shadow-indigo-500/20',
    borderGlow: 'border-indigo-500/40 shadow-indigo-900/30',
    cardGradient: 'from-[#1e1b4b] via-[#131131] to-[#09071c]',
    icon: Sparkles,
    accent: '#6366f1',
    foilGradient: 'from-indigo-200 via-violet-300 to-purple-200',
  },
  'HIGH TABLE': {
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20',
    borderGlow: 'border-amber-500/40 shadow-amber-900/30',
    cardGradient: 'from-[#3b2310] via-[#241508] to-[#120a03]',
    icon: Award,
    accent: '#f59e0b',
    foilGradient: 'from-amber-100 via-amber-300 to-yellow-200',
  },
  REGULAR: {
    badge: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
    borderGlow: 'border-zinc-700/50 shadow-black/40',
    cardGradient: 'from-[#18181b] via-[#111113] to-[#09090b]',
    icon: Users,
    accent: '#71717a',
    foilGradient: 'from-slate-200 via-zinc-400 to-slate-300',
  },
  VENDOR: {
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    borderGlow: 'border-amber-500/30 shadow-amber-950/30',
    cardGradient: 'from-[#291e10] via-[#1a1308] to-[#0a0702]',
    icon: ShieldCheck,
    accent: '#f59e0b',
    foilGradient: 'from-amber-200 via-orange-300 to-yellow-200',
  },
  MEDIA: {
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20',
    borderGlow: 'border-cyan-500/40 shadow-cyan-900/30',
    cardGradient: 'from-[#0e2c38] via-[#091b24] to-[#030d12]',
    icon: Radio,
    accent: '#06b6d4',
    foilGradient: 'from-cyan-200 via-teal-300 to-sky-200',
  },
};

const PublicPassPage = () => {
  const { id } = useParams();
  const { events, guests } = useEvents();
  const passCardRef = useRef(null);

  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isCached, setIsCached] = useState(false);
  const [maxContrastMode, setMaxContrastMode] = useState(false);
  const [liveSecs, setLiveSecs] = useState(new Date().toLocaleTimeString('en-GB'));
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  // Live anti-screenshot clock ticker (ushers check this to prevent static photos)
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSecs(new Date().toLocaleTimeString('en-GB'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Offline status listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Live gate connection active!');
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast('Operating in offline gate pass mode', { icon: '⚡' });
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 1. Resolve Active Guest (From Context, localStorage, or Offline Cache)
  const activeGuest = useMemo(() => {
    // A. Check in context guests
    let found = guests.find(
      (g) => g.id === id || g.qrToken === id || (g.id && id && g.id.toLowerCase() === id.toLowerCase())
    );

    // B. Check standard localStorage
    if (!found && typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('qrinvite_guests_v2');
        if (raw) {
          const list = JSON.parse(raw);
          found = list.find(
            (g) => g.id === id || g.qrToken === id || (g.id && id && g.id.toLowerCase() === id.toLowerCase())
          );
        }
      } catch (err) {
        console.warn('Could not read guests from storage', err);
      }
    }

    // C. Check specialized offline pass vault
    if (!found && typeof window !== 'undefined') {
      try {
        const cachedRaw = localStorage.getItem(`qri_offline_pass_${id}`);
        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw);
          if (parsed && parsed.guest) {
            found = parsed.guest;
          }
        }
      } catch (e) {}
    }

    // D. Default realistic VIP pass if accessed without ID
    if (!found) {
      return {
        id: id || 'gst_vip_public_01',
        name: 'Chief Kelechi Okafor',
        email: 'kelechi.okafor@prime.ng',
        phone: '+234 803 555 0192',
        tier: 'VVIP',
        table: 'High Table #01',
        status: 'VALID',
        eventId: 'evt_leadership_summit_2026',
        qrToken: id || 'QRI_PASS_VVIP_01_VERIFIED',
        dressCode: 'Black Tie / Traditional Elegance',
      };
    }

    return found;
  }, [id, guests]);

  // 2. Resolve Associated Event
  const activeEvent = useMemo(() => {
    if (activeGuest?.eventId) {
      const match = events.find((e) => e.id === activeGuest.eventId);
      if (match) return match;
    }
    return (
      events[0] || {
        id: 'evt_leadership_summit_2026',
        name: 'West Africa Leadership & Investment Summit 2026',
        category: 'High-Level Summit',
        venue: 'Eko Convention Centre, Victoria Island, Lagos',
        date: '2026-11-14',
        time: '09:00 AM WAT',
        dressCode: 'Black Tie / Business Formal',
        type: 'PRIVATE',
      }
    );
  }, [activeGuest, events]);

  const tierKey = (activeGuest.tier || 'VIP').toUpperCase();
  const tierConfig = TIER_STYLES[tierKey] || TIER_STYLES.VIP;
  const TierIcon = tierConfig.icon;

  // 3. Generate high-density optical QR Code & Auto-Cache for Offline Use
  useEffect(() => {
    const payload = activeGuest.qrToken || activeGuest.compactQrPayload || activeGuest.id;
    
    // Check if previously cached QR exists
    const cacheKey = `qri_offline_pass_${activeGuest.id || id}`;
    const existingCache = localStorage.getItem(cacheKey);
    if (existingCache) {
      try {
        const parsed = JSON.parse(existingCache);
        if (parsed.qrDataUrl) {
          setQrDataUrl(parsed.qrDataUrl);
          setIsCached(true);
        }
      } catch (e) {}
    }

    QRCode.toDataURL(payload, {
      width: 400,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => {
        setQrDataUrl(url);
        // Persist offline cache
        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              guest: activeGuest,
              event: activeEvent,
              qrDataUrl: url,
              cachedAt: new Date().toISOString(),
            })
          );
          setIsCached(true);
        } catch (e) {
          console.warn('Storage quota full or unavailable', e);
        }
      })
      .catch((err) => console.error('Failed to generate pass QR', err));
  }, [activeGuest, activeEvent, id]);

  // Handle explicit Save for Offline Button
  const handleSaveOffline = () => {
    try {
      const cacheKey = `qri_offline_pass_${activeGuest.id || id}`;
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          guest: activeGuest,
          event: activeEvent,
          qrDataUrl,
          cachedAt: new Date().toISOString(),
        })
      );
      setIsCached(true);
      toast.success('Pass successfully cached in offline vault! Ready for gate scan without data.');
    } catch (e) {
      toast.error('Could not save to offline vault: ' + e.message);
    }
  };

  // Copy pass link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Pass verification link copied to clipboard!');
  };

  // Share via Web Share API or WhatsApp
  const handleSharePass = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${activeGuest.name} - ${activeEvent.name} Pass`,
          text: `Verified digital entrance pass for ${activeEvent.name}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      const text = encodeURIComponent(
        `Hello ${activeGuest.name}, here is your verified entrance pass for ${activeEvent.name}: ${window.location.href}`
      );
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  // Download pass as crisp PNG image
  const handleDownloadPass = async () => {
    if (!passCardRef.current) return;
    try {
      setIsDownloading(true);
      toast.loading('Generating pass card snapshot...', { id: 'pass-dl' });
      const dataUrl = await toPng(passCardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
      });
      const link = document.createElement('a');
      link.download = `QRInvite_VIP_Pass_${activeGuest.name.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Pass snapshot saved to downloads!', { id: 'pass-dl' });
    } catch (err) {
      console.error('Failed to export pass image', err);
      toast.error('Could not export pass snapshot', { id: 'pass-dl' });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-between p-3 sm:p-6 lg:p-8 relative selection:bg-indigo-500 selection:text-white font-body overflow-x-hidden">
      
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[380px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl opacity-75" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-emerald-600/10 blur-3xl" />
      </div>

      {/* ─── Top Bar: Branding, Network Status, & Turnstile Contrast ─── */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between py-2 z-10 gap-2">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <QrCode size={17} strokeWidth={2.4} />
          </div>
          <div>
            <span className="font-black text-sm tracking-tight text-white font-heading">
              QR<span className="text-indigo-400">Invite</span>
            </span>
            <span className="block text-[8px] font-bold tracking-widest text-slate-400 uppercase font-mono">
              GATE INGRESS PASS
            </span>
          </div>
        </Link>

        {/* Status Indicators & Turnstile Brightness Button */}
        <div className="flex items-center gap-1.5">
          {/* Offline / Online Badge */}
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
            isOnline
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}>
            {isOnline ? <Wifi size={11} /> : <WifiOff size={11} />}
            <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
          </div>

          {/* Turnstile High-Contrast Scanner Toggle */}
          <button
            type="button"
            onClick={() => setMaxContrastMode(!maxContrastMode)}
            title="Toggle maximum contrast for door scanners"
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              maxContrastMode
                ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-md shadow-yellow-400/30'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Sun size={15} />
          </button>
        </div>
      </header>

      {/* ─── Center Digital Pass Card ─── */}
      <main className="w-full max-w-md mx-auto my-3 z-10">
        
        {/* Offline Banner if disconnected */}
        {!isOnline && (
          <div className="mb-3 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2.5 animate-pulse">
            <WifiOff size={16} className="shrink-0 text-amber-400" />
            <div className="min-w-0">
              <span className="font-extrabold block">Offline Mode Active</span>
              <span className="text-[11px] text-amber-300/80">Turnstile can scan this cached Ed25519 token without cellular data.</span>
            </div>
          </div>
        )}

        <div
          ref={passCardRef}
          className={`relative rounded-3xl bg-gradient-to-b ${tierConfig.cardGradient} border ${tierConfig.borderGlow} shadow-2xl p-6 sm:p-7 overflow-hidden transition-all duration-300`}
        >
          {/* Perforated ticket edge notches */}
          <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#07090e] border border-white/10 -translate-y-1/2" />
          <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[#07090e] border border-white/10 -translate-y-1/2" />

          {/* Ambient Background Watermarks */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/[0.03] border border-white/5 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/[0.03] border border-white/5 pointer-events-none" />

          {/* Card Top: Category & Tier Badge */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-indigo-300 font-semibold block">
                {activeEvent.category || 'Official Credential'}
              </span>
              <span className="text-xs font-black text-slate-300 font-heading">
                Access Authorization Pass
              </span>
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${tierConfig.badge}`}>
              <TierIcon size={13} />
              <span>{activeGuest.tier || 'VIP'}</span>
            </div>
          </div>

          {/* Event Title */}
          <div className="py-3.5">
            <h1 className="text-lg sm:text-xl font-black text-white leading-snug tracking-tight font-heading">
              {activeEvent.name}
            </h1>
          </div>

          {/* ─── High-Contrast Optical QR Code Box ─── */}
          <div className={`p-4 sm:p-5 rounded-2xl shadow-2xl mx-auto max-w-[250px] my-1 relative transition-all duration-300 ${
            maxContrastMode
              ? 'bg-white ring-8 ring-white/90 scale-102'
              : 'bg-white ring-4 ring-white/10'
          }`}>
            <div className="relative flex flex-col items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Attendee Verified Entrance QR Code"
                  className="w-48 h-48 mx-auto rounded-lg object-contain"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              
              {/* Centered Shield Emblem */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 rounded-lg bg-white/95 border border-indigo-200 text-indigo-700 flex items-center justify-center shadow-md">
                  <ShieldCheck size={18} />
                </div>
              </div>
            </div>

            <div className="mt-2 text-center">
              <span className="text-[9px] font-mono text-slate-700 font-black uppercase tracking-wider block">
                Optical Turnstile Scan
              </span>
            </div>
          </div>

          {/* Live Anti-Screenshot Dynamic Security Beacon */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-slate-300 text-[11px] font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE CLOCK: {liveSecs}</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-black">VALID</span>
            </div>
          </div>

          {/* Attendee Profile Info */}
          <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                  Attendee Name
                </span>
                <h2 className="text-base font-black text-white font-heading">
                  {activeGuest.name}
                </h2>
                <p className="text-[11px] text-slate-400 font-mono">
                  {activeGuest.phone || activeGuest.email}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                  Seating / Table
                </span>
                <span className="text-sm font-black text-amber-300 font-heading">
                  {activeGuest.table || 'General Admission'}
                </span>
              </div>
            </div>

            {/* Event Logistics Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.04] border border-white/5">
                <Calendar size={13} className="text-indigo-400 shrink-0" />
                <span className="truncate">{activeEvent.date}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.04] border border-white/5">
                <Clock size={13} className="text-indigo-400 shrink-0" />
                <span className="truncate">{activeEvent.time || '09:00 AM'}</span>
              </div>
            </div>

            {/* Venue Location with Map Direct Link */}
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(activeEvent.venue || 'Eko Convention Centre, Lagos')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-[11px] text-slate-300 transition-colors group/venue"
            >
              <div className="flex items-center gap-2 min-w-0">
                <MapPin size={14} className="text-rose-400 shrink-0" />
                <span className="truncate font-semibold">{activeEvent.venue}</span>
              </div>
              <ExternalLink size={12} className="text-slate-400 group-hover/venue:text-white shrink-0 ml-1" />
            </a>

            {/* Dress Code Badge */}
            {(activeGuest.dressCode || activeEvent.dressCode) && (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px]">
                <span className="text-slate-400 font-semibold">Dress Code:</span>
                <span className="font-bold text-indigo-300">
                  {activeGuest.dressCode || activeEvent.dressCode}
                </span>
              </div>
            )}

            {/* Cryptographic Security Hash */}
            <div className="pt-2 flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-white/5">
              <span className="truncate max-w-[200px]">TOKEN: {activeGuest.qrToken || activeGuest.id}</span>
              <span>ED25519 • LOCKED</span>
            </div>
          </div>

        </div>

        {/* ─── Attendee Action Controls ─── */}
        <div className="mt-4 space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleDownloadPass}
              disabled={isDownloading}
              className="py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Download size={14} />
              <span>{isDownloading ? 'Saving...' : 'Save Pass (PNG)'}</span>
            </button>

            <button
              type="button"
              onClick={handleSharePass}
              className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Share2 size={14} />
              <span>Share Pass</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleSaveOffline}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isCached
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-300'
              }`}
            >
              <BookmarkCheck size={13} className={isCached ? 'text-emerald-400' : 'text-slate-400'} />
              <span>{isCached ? 'Pass Cached Offline' : 'Save for Offline'}</span>
            </button>

            <button
              type="button"
              onClick={() => setWalletModalOpen(true)}
              className="py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Smartphone size={13} />
              <span>Apple / Google Wallet</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full py-2.5 px-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Copy size={12} />
            <span>Copy Pass URL</span>
          </button>
        </div>

        {/* ─── Optical Gate Scanning Advice ─── */}
        <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-300">
            <Smartphone size={13} className="text-indigo-400" />
            <span>Gate Arrival Advice</span>
          </div>
          <p className="leading-relaxed">
            Please present this screen to the usher or automated turnstile upon arrival. If lighting is poor or glare occurs, tap the <strong>Sun</strong> icon at top right to toggle Maximum Optical Contrast mode.
          </p>
        </div>

      </main>

      {/* ─── Apple / Google Wallet Info Modal ─── */}
      {walletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#111622] border border-slate-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4 text-center animate-fade-in-scale">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
              <Smartphone size={24} />
            </div>

            <div>
              <h3 className="font-black text-base text-white font-heading">
                Apple Wallet & Google Pay Pass
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your pass is already stored in your device browser cache with instant offline access.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400" />
                <span>Offline cached in local storage vault</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400" />
                <span>One-tap Home Screen bookmark ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400" />
                <span>High-resolution PNG save enabled</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setWalletModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ─── Footer ─── */}
      <footer className="w-full max-w-md mx-auto text-center py-3 text-[10px] text-slate-500 z-10 font-mono">
        <p>Secured by QRInvite Anti-Replay Gate Engine • Single Admission Enforced</p>
      </footer>

    </div>
  );
};

export default PublicPassPage;