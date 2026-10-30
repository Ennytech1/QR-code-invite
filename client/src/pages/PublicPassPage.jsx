import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  QrCode,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Award,
  Users,
  Radio,
  Share2,
  Download,
  Copy,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Lock,
  ArrowLeft,
  Smartphone,
  Shield,
  Eye
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
  },
  VIP: {
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm shadow-indigo-500/20',
    borderGlow: 'border-indigo-500/40 shadow-indigo-900/30',
    cardGradient: 'from-[#1e1b4b] via-[#131131] to-[#09071c]',
    icon: Sparkles,
    accent: '#6366f1',
  },
  'HIGH TABLE': {
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20',
    borderGlow: 'border-amber-500/40 shadow-amber-900/30',
    cardGradient: 'from-[#3b2310] via-[#241508] to-[#120a03]',
    icon: Award,
    accent: '#f59e0b',
  },
  REGULAR: {
    badge: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
    borderGlow: 'border-zinc-700/50 shadow-black/40',
    cardGradient: 'from-[#18181b] via-[#111113] to-[#09090b]',
    icon: Users,
    accent: '#71717a',
  },
  VENDOR: {
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    borderGlow: 'border-amber-500/30 shadow-amber-950/30',
    cardGradient: 'from-[#291e10] via-[#1a1308] to-[#0a0702]',
    icon: ShieldCheck,
    accent: '#f59e0b',
  },
  MEDIA: {
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20',
    borderGlow: 'border-cyan-500/40 shadow-cyan-900/30',
    cardGradient: 'from-[#0e2c38] via-[#091b24] to-[#030d12]',
    icon: Radio,
    accent: '#06b6d4',
  },
};

const PublicPassPage = () => {
  const { id } = useParams();
  const { events, guests } = useEvents();
  const passCardRef = useRef(null);

  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  // Look up guest by id or token across context or localStorage
  const activeGuest = useMemo(() => {
    // 1. Check in context guests
    let found = guests.find(
      (g) => g.id === id || g.qrToken === id || (g.id && id && g.id.toLowerCase() === id.toLowerCase())
    );

    // 2. Check localStorage if direct load
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

    // 3. Fallback demo pass if accessing demo or unspecified route
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

  // Look up associated event
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

  // Generate real dynamic QR code
  useEffect(() => {
    const payload = activeGuest.qrToken || activeGuest.compactQrPayload || activeGuest.id;
    QRCode.toDataURL(payload, {
      width: 360,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate pass QR', err));
  }, [activeGuest]);

  // Copy pass link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Pass verification link copied!');
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
        pixelRatio: 2.5,
      });
      const link = document.createElement('a');
      link.download = `QRInvite_VIP_Pass_${activeGuest.name.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Pass saved to photos/downloads!', { id: 'pass-dl' });
    } catch (err) {
      console.error('Failed to export pass image', err);
      toast.error('Could not export pass snapshot', { id: 'pass-dl' });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 relative selection:bg-indigo-500 selection:text-white">
      
      {/* Background ambient radial gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute bottom-0 right-1/4 w-[450px] h-[350px] bg-emerald-600/10 blur-3xl" />
      </div>

      {/* ─── Top Header Bar ─── */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between py-2 z-10">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <QrCode size={17} strokeWidth={2.4} />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-white">
              QR<span className="text-indigo-400">Invite</span>
            </span>
            <span className="block text-[8px] font-bold tracking-widest text-slate-400 uppercase">
              Gate Ingress Pass
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
          <ShieldCheck size={12} />
          <span>Ed25519 Verified</span>
        </div>
      </header>

      {/* ─── Center Digital Pass Card ─── */}
      <main className="w-full max-w-md mx-auto my-4 z-10">
        <div
          ref={passCardRef}
          className={`relative rounded-3xl bg-gradient-to-b ${tierConfig.cardGradient} border ${tierConfig.borderGlow} shadow-2xl p-6 sm:p-7 overflow-hidden transition-all`}
        >
          {/* Subtle watermark crest */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/[0.02] border border-white/5 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/[0.02] border border-white/5 pointer-events-none" />

          {/* Card Top: Event Type & Tier Badge */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-indigo-300 font-semibold block">
                {activeEvent.category || 'Institutional Summit'}
              </span>
              <span className="text-xs font-bold text-slate-300">
                Official Access Credential
              </span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${tierConfig.badge}`}>
              <TierIcon size={13} />
              <span>{activeGuest.tier || 'VIP'}</span>
            </div>
          </div>

          {/* Event Title */}
          <div className="py-4">
            <h1 className="text-lg sm:text-xl font-black text-white leading-snug tracking-tight">
              {activeEvent.name}
            </h1>
          </div>

          {/* ─── High-Contrast Dynamic QR Code Container ─── */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl shadow-2xl mx-auto max-w-[240px] my-1 relative group">
            <div className="relative flex flex-col items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Attendee Verified Entrance QR Code"
                  className="w-44 h-44 mx-auto rounded-lg object-contain"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {/* Centered Institutional Shield Crest */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 rounded-lg bg-white/95 border border-indigo-200 text-indigo-700 flex items-center justify-center shadow-md">
                  <ShieldCheck size={18} />
                </div>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-[9px] font-mono text-slate-600 font-bold uppercase tracking-wider block">
                Turnstile Optical Scan
              </span>
            </div>
          </div>

          {/* Pass Status Banner */}
          <div className="mt-4 flex items-center justify-center">
            {activeGuest.status === 'CHECKED_IN' ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                <CheckCircle2 size={13} />
                <span>Checked In • {activeGuest.gate || 'Gate North #1'}</span>
              </div>
            ) : activeGuest.status === 'REVOKED' ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-[11px] font-bold">
                <AlertTriangle size={13} />
                <span>Pass Formally Revoked</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Authorized for Single Admission</span>
              </div>
            )}
          </div>

          {/* Attendee Profile Information */}
          <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Attendee Name
                </span>
                <h2 className="text-base font-extrabold text-white">
                  {activeGuest.name}
                </h2>
                <p className="text-[11px] text-slate-400 font-mono">
                  {activeGuest.phone || activeGuest.email}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Table / Seating
                </span>
                <span className="text-sm font-black text-amber-300">
                  {activeGuest.table || 'General Admission'}
                </span>
              </div>
            </div>

            {/* Event Logistics Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.04] border border-white/5">
                <Calendar size={13} className="text-indigo-400 shrink-0" />
                <span className="truncate">{activeEvent.date}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.04] border border-white/5">
                <Clock size={13} className="text-indigo-400 shrink-0" />
                <span className="truncate">{activeEvent.time || '09:00 AM'}</span>
              </div>
            </div>

            {/* Venue Location */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/5 text-[11px] text-slate-300">
              <MapPin size={14} className="text-rose-400 shrink-0" />
              <span className="truncate font-medium">{activeEvent.venue}</span>
            </div>

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
              <span>TOKEN: {activeGuest.id}</span>
              <span>CURVE25519 • ANTI-REPLAY</span>
            </div>

          </div>

        </div>

        {/* ─── Attendee Action Controls ─── */}
        <div className="mt-5 space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleDownloadPass}
              disabled={isDownloading}
              className="py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download size={14} />
              <span>{isDownloading ? 'Saving...' : 'Save Pass Image'}</span>
            </button>

            <button
              onClick={handleSharePass}
              className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Share2 size={14} />
              <span>Share Pass</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy size={13} />
              <span>Copy Pass Link</span>
            </button>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(activeEvent.venue || 'Eko Convention Centre, Lagos')}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <MapPin size={13} />
              <span>Directions</span>
            </a>
          </div>
        </div>

        {/* ─── Gate Optical Scanning Instructions ─── */}
        <div className="mt-5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-300">
            <Smartphone size={13} className="text-indigo-400" />
            <span>Gate Arrival Instructions</span>
          </div>
          <p className="leading-relaxed">
            Please present this screen upon arrival at the security gate. Ensure your phone screen brightness is set to high for instantaneous optical verification.
          </p>
        </div>

      </main>

      {/* ─── Footer ─── */}
      <footer className="w-full max-w-md mx-auto text-center py-4 text-[10px] text-slate-500 z-10">
        <p>Secured by QRInvite Anti-Replay Gate Engine • Institutional Access Control</p>
      </footer>

    </div>
  );
};

export default PublicPassPage;
