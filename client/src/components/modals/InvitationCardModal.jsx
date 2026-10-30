import React, { useState, useEffect, useRef } from 'react';
import {
  X, Download, Share2, Mail, MessageCircle, Copy, Check,
  Sparkles, Calendar, MapPin, Users, ShieldCheck, Palette,
  QrCode, RefreshCw, Send, CheckCircle2, Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import { toJpeg } from 'html-to-image';
import { useEvents } from '../../context/EventContext';

// Theme Presets for Cards
const CARD_THEMES = [
  {
    id: 'luxury-gold',
    name: 'Royal Gold & Black',
    description: 'Weddings, VIP Galas & Banquets',
    bgClass: 'bg-gradient-to-b from-[#181512] via-[#0d0c0a] to-[#1a140b] text-[#f7e7c4]',
    borderClass: 'border-2 border-[#d4af37]/60 shadow-[0_0_30px_rgba(212,175,55,0.2)]',
    accentText: 'text-[#d4af37]',
    badgeBg: 'bg-[#d4af37] text-black font-black',
    subText: 'text-[#c2ab82]',
    divider: 'border-[#d4af37]/30',
    qrBg: 'bg-[#fffaf0]',
    qrFg: '#120f0a',
    pillBg: 'bg-[#d4af37]/15 text-[#f5d77f] border border-[#d4af37]/30',
  },
  {
    id: 'midnight-vip',
    name: 'Midnight & Violet VIP',
    description: 'Nightlife, Exclusive Clubs & Concerts',
    bgClass: 'bg-gradient-to-b from-[#160b2b] via-[#0e071e] to-[#080312] text-white',
    borderClass: 'border-2 border-violet-500/50 shadow-[0_0_30px_rgba(139,92,246,0.25)]',
    accentText: 'text-violet-400',
    badgeBg: 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-black',
    subText: 'text-violet-200/70',
    divider: 'border-violet-500/20',
    qrBg: 'bg-white',
    qrFg: '#160b2b',
    pillBg: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
  },
  {
    id: 'emerald-prestige',
    name: 'Emerald Prestige',
    description: 'High-Society Dinners & Corporate Retreats',
    bgClass: 'bg-gradient-to-b from-[#082218] via-[#051811] to-[#020b08] text-[#d1fae5]',
    borderClass: 'border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]',
    accentText: 'text-emerald-400',
    badgeBg: 'bg-emerald-500 text-slate-950 font-black',
    subText: 'text-emerald-200/70',
    divider: 'border-emerald-500/20',
    qrBg: 'bg-[#f0fdf4]',
    qrFg: '#051811',
    pillBg: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Wave',
    description: 'Tech Afterparties & Electronic Festivals',
    bgClass: 'bg-gradient-to-b from-[#081528] via-[#060e1b] to-[#02060d] text-cyan-50',
    borderClass: 'border-2 border-cyan-400/60 shadow-[0_0_35px_rgba(6,182,212,0.25)]',
    accentText: 'text-cyan-400',
    badgeBg: 'bg-cyan-400 text-slate-950 font-black',
    subText: 'text-cyan-200/70',
    divider: 'border-cyan-500/25',
    qrBg: 'bg-white',
    qrFg: '#081528',
    pillBg: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
  },
  {
    id: 'minimal-ivory',
    name: 'Minimalist Ivory & Slate',
    description: 'Executive Conferences & Art Exhibitions',
    bgClass: 'bg-gradient-to-b from-[#fafaf9] via-[#f5f5f4] to-[#e7e5e4] text-slate-900',
    borderClass: 'border-2 border-slate-300 shadow-xl',
    accentText: 'text-indigo-900',
    badgeBg: 'bg-slate-900 text-white font-bold',
    subText: 'text-slate-600',
    divider: 'border-slate-300',
    qrBg: 'bg-white',
    qrFg: '#0f172a',
    pillBg: 'bg-slate-200 text-slate-800 border border-slate-300',
  },
];

const InvitationCardModal = ({ isOpen, onClose, guest, event }) => {
  const { markDispatched } = useEvents();
  const cardRef = useRef(null);

  const [selectedThemeId, setSelectedThemeId] = useState('luxury-gold');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [customGreeting, setCustomGreeting] = useState('');

  // Fallbacks if not provided
  const activeEvent = event || {
    name: 'The Adeleke Royal Wedding & Banquet',
    venue: 'The Grand Ballroom, Eko Hotel & Suites, Victoria Island',
    date: '2026-11-14',
    time: '14:00',
    dressCode: 'Black Tie / Royal Traditional Regal',
    customMessage: 'We request the honor of your presence to celebrate with us.',
    hostName: 'Adeleke & Balogun Families',
    type: 'PRIVATE',
  };

  const activeGuest = guest || {
    id: 'gst_demo',
    name: 'Chief Kelechi Okafor & Guest',
    email: 'k.okafor@venture.ng',
    phone: '+2348031112233',
    tier: 'High Table / VIP Dignitary',
    table: 'Table 1 • High Table',
    qrToken: 'QRI_DEMO_INVITATION_PASS_2026',
  };

  // Sync initial theme from event or guest
  useEffect(() => {
    if (activeGuest?.cardTheme) {
      setSelectedThemeId(activeGuest.cardTheme);
    } else if (activeEvent?.cardTheme) {
      setSelectedThemeId(activeEvent.cardTheme);
    }
    setCustomGreeting(activeEvent.customMessage || 'We request the honor of your presence to celebrate with us.');
  }, [guest, event]);

  const currentTheme = CARD_THEMES.find((t) => t.id === selectedThemeId) || CARD_THEMES[0];

  // Generate Real High-Resolution QR Code
  useEffect(() => {
    if (!isOpen) return;

    const payload = JSON.stringify({
      t: 'QRI_PASS_V1',
      tid: activeGuest.qrToken || activeGuest.id,
      gid: activeGuest.id,
      eid: activeEvent.id || 'evt_general',
      name: activeGuest.name,
      tier: activeGuest.tier,
      table: activeGuest.table || 'General',
      sig: 'ed25519_' + (activeGuest.id || 'sec').substring(0, 10),
    });

    QRCode.toDataURL(payload, {
      width: 320,
      margin: 1,
      color: {
        dark: currentTheme.qrFg,
        light: currentTheme.qrBg,
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR', err));
  }, [isOpen, activeGuest, activeEvent, currentTheme]);

  if (!isOpen) return null;

  // Export card as crisp JPEG image
  const handleDownloadJPEG = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      toast.loading('Rendering high-res JPEG invitation...', { id: 'render-card' });

      // Generate pristine 2x resolution JPEG
      const dataUrl = await toJpeg(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
      });

      const sanitizedName = activeGuest.name.replace(/[^a-zA-Z0-9]/g, '_');
      const link = document.createElement('a');
      link.download = `${sanitizedName}_Invitation_Pass.jpg`;
      link.href = dataUrl;
      link.click();

      toast.success('Invitation Card downloaded as high-res JPEG!', { id: 'render-card' });
    } catch (err) {
      console.error('Failed to export card', err);
      toast.error('Failed to export card image. Please try again.', { id: 'render-card' });
    } finally {
      setIsExporting(false);
    }
  };

  // WhatsApp One-Click Share with Personal Link
  const handleWhatsAppShare = () => {
    const passUrl = `${window.location.origin}/pass/${activeGuest.qrToken || activeGuest.id}`;
    const text = encodeURIComponent(
      `Hello ${activeGuest.name}!\n\n` +
      `You are cordially invited to *${activeEvent.name}*.\n\n` +
      `📅 Date: ${activeEvent.date} at ${activeEvent.time}\n` +
      `📍 Venue: ${activeEvent.venue}\n` +
      `👔 Dress Code: ${activeEvent.dressCode || 'Formal / Elegant'}\n` +
      `🎟️ Access Tier: ${activeGuest.tier} (${activeGuest.table || 'General Seating'})\n\n` +
      `Your personal digital QR pass is ready. Please present this card or QR at the gate entrance for immediate check-in:\n` +
      `${passUrl}\n\n` +
      `Warm regards,\n` +
      `*${activeEvent.hostName || 'Event Host'}*`
    );

    const cleanPhone = (activeGuest.phone || '').replace(/[^0-9]/g, '');
    const whatsappUrl = cleanPhone 
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`
      : `https://api.whatsapp.com/send?text=${text}`;

    window.open(whatsappUrl, '_blank');
    markDispatched(activeGuest.id);
    toast.success(`WhatsApp invitation launched for ${activeGuest.name}! Marked as sent.`);
  };

  // Email Share
  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Exclusive Invitation: ${activeEvent.name}`);
    const passUrl = `${window.location.origin}/pass/${activeGuest.qrToken || activeGuest.id}`;
    const body = encodeURIComponent(
      `Dear ${activeGuest.name},\n\n` +
      `${customGreeting}\n\n` +
      `EVENT DETAILS:\n` +
      `Event: ${activeEvent.name}\n` +
      `Date & Time: ${activeEvent.date} at ${activeEvent.time}\n` +
      `Venue: ${activeEvent.venue}\n` +
      `Access Level: ${activeGuest.tier}\n` +
      `Seating / Table: ${activeGuest.table || 'Reserved'}\n` +
      `Dress Code: ${activeEvent.dressCode || 'Formal'}\n\n` +
      `VIEW YOUR DIGITAL QR PASS:\n` +
      `${passUrl}\n\n` +
      `Please save this email or present your QR pass at the gate for rapid optical check-in.\n\n` +
      `Sincerely,\n${activeEvent.hostName || 'The Organizers'}`
    );

    window.open(`mailto:${activeGuest.email || ''}?subject=${subject}&body=${body}`, '_blank');
    markDispatched(activeGuest.id);
    toast.success('Email draft opened. Marked as dispatched!');
  };

  const handleCopyLink = () => {
    const passUrl = `${window.location.origin}/pass/${activeGuest.qrToken || activeGuest.id}`;
    navigator.clipboard.writeText(passUrl);
    setCopiedLink(true);
    toast.success('Invitation pass link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#121620] border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden text-slate-100 my-auto flex flex-col md:flex-row">
        
        {/* ─── LEFT: Theme & Customization Controls ─── */}
        <div className="md:w-5/12 p-5 sm:p-6 border-b md:border-b-0 md:border-r border-slate-800/80 bg-slate-950/60 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                  <Palette size={16} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                    Invitation Designer
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Design & dispatch personalized passes
                  </p>
                </div>
              </div>

              {/* Close Button on mobile */}
              <button
                onClick={onClose}
                className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Theme Selector Pills */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-400" /> Card Theme Style
              </label>
              <div className="grid grid-cols-1 gap-2">
                {CARD_THEMES.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedThemeId(theme.id)}
                      className={`text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/10 shadow-md shadow-indigo-500/10'
                          : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-400'
                      }`}
                    >
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {theme.name}
                        </div>
                        <div className="text-[10px] text-slate-500">{theme.description}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-full ${theme.badgeBg}`} />
                        {isSelected && <Check size={14} className="text-indigo-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Guest Summary Info */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Recipient Details
              </div>
              <div className="font-semibold text-white">{activeGuest.name}</div>
              <div className="text-slate-400 text-[11px] flex items-center justify-between">
                <span>{activeGuest.phone || 'No phone'}</span>
                <span className="text-indigo-400 font-medium">{activeGuest.tier}</span>
              </div>
              {activeGuest.table && (
                <div className="text-slate-400 text-[11px]">
                  Assigned: <span className="text-slate-200">{activeGuest.table}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            {/* WhatsApp Direct Share Button */}
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageCircle size={15} />
              Share via WhatsApp
            </button>

            {/* Download JPEG Button */}
            <button
              onClick={handleDownloadJPEG}
              disabled={isExporting}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download size={15} />
              {isExporting ? 'Generating JPEG...' : 'Download High-Res JPEG Card'}
            </button>

            {/* Email & Link row */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleEmailShare}
                className="py-2 px-3 rounded-xl font-semibold text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Mail size={13} />
                Send Email
              </button>

              <button
                onClick={handleCopyLink}
                className="py-2 px-3 rounded-xl font-semibold text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedLink ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: The Visual Invitation Card (Render Target for JPEG) ─── */}
        <div className="md:w-7/12 p-6 sm:p-8 bg-[#090c13] flex flex-col items-center justify-center relative overflow-hidden">
          
          {/* Top Close Button for Desktop */}
          <button
            onClick={onClose}
            className="hidden md:flex absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors z-10"
          >
            <X size={18} />
          </button>

          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <QrCode size={13} /> Live Scannable Gate Preview
          </p>

          {/* ══════════ THE RENDERED INVITATION CARD ══════════ */}
          <div
            ref={cardRef}
            className={`w-full max-w-[360px] rounded-3xl p-6 sm:p-7 relative transition-all duration-300 ${currentTheme.bgClass} ${currentTheme.borderClass}`}
          >
            {/* Top Ornamental Bar */}
            <div className="flex items-center justify-between border-b pb-3.5 mb-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-2">
                <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${currentTheme.badgeBg}`}>
                  {activeEvent.type === 'PRIVATE' ? 'PRIVATE INVITATION' : 'VERIFIED PASS'}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck size={13} className={currentTheme.accentText} />
                <span className="text-[10px] font-bold tracking-wider opacity-80">ED25519 SECURE</span>
              </div>
            </div>

            {/* Host & Event Headline */}
            <div className="text-center space-y-1.5 mb-4">
              <p className={`text-[10px] font-bold tracking-widest uppercase ${currentTheme.accentText}`}>
                {activeEvent.hostName || 'OFFICIAL INVITATION'}
              </p>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight leading-tight">
                {activeEvent.name}
              </h2>
              <p className={`text-[11px] italic font-medium max-w-[280px] mx-auto leading-relaxed ${currentTheme.subText}`}>
                "{customGreeting}"
              </p>
            </div>

            {/* Recipient Spotlight */}
            <div className={`my-4 p-3 rounded-2xl text-center ${currentTheme.pillBg}`}>
              <div className="text-[9px] font-bold uppercase tracking-widest opacity-80">
                HONORED ATTENDEE
              </div>
              <div className="text-base font-black tracking-tight mt-0.5">
                {activeGuest.name}
              </div>
              <div className="text-[10px] font-bold opacity-90 mt-0.5">
                {activeGuest.tier} • {activeGuest.table || 'Reserved Seating'}
              </div>
            </div>

            {/* High-Contrast Scannable QR Code */}
            <div className="my-4 flex flex-col items-center justify-center">
              <div className="p-3 rounded-2xl bg-white shadow-xl relative group">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Gate QR Code"
                    className="w-36 h-36 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-36 h-36 flex items-center justify-center text-slate-400">
                    <RefreshCw className="animate-spin" size={24} />
                  </div>
                )}
                {/* Center Badge Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center shadow-lg">
                    <ShieldCheck size={14} className="text-amber-400" />
                  </div>
                </div>
              </div>
              <span className={`text-[9px] font-mono font-bold tracking-wider mt-2 opacity-75 ${currentTheme.subText}`}>
                TOKEN: {activeGuest.qrToken || activeGuest.id}
              </span>
            </div>

            {/* Event Logistics Grid */}
            <div className="border-t pt-3.5 space-y-2" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <div className="flex items-start gap-2 text-left">
                <Calendar size={13} className={`mt-0.5 shrink-0 ${currentTheme.accentText}`} />
                <div className="text-[11px] leading-tight">
                  <span className="font-bold">{activeEvent.date}</span> at <span className="font-semibold">{activeEvent.time}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-left">
                <MapPin size={13} className={`mt-0.5 shrink-0 ${currentTheme.accentText}`} />
                <div className="text-[11px] leading-tight opacity-90">
                  {activeEvent.venue}
                </div>
              </div>

              {activeEvent.dressCode && (
                <div className="flex items-center justify-between text-[10px] pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <span className="opacity-70 font-medium">Dress Code:</span>
                  <span className={`font-bold ${currentTheme.accentText}`}>{activeEvent.dressCode}</span>
                </div>
              )}
            </div>

            {/* Bottom Footer Note */}
            <div className="mt-4 pt-2 text-center text-[9px] opacity-60 font-medium">
              Present this digital pass at the entrance gate for sub-second verification.
            </div>
          </div>
          {/* ══════════ END INVITATION CARD ══════════ */}

          <div className="text-center mt-3 text-xs text-slate-400">
            Tip: Ushers at the gate can scan this directly from WhatsApp or your phone screen.
          </div>
        </div>

      </div>
    </div>
  );
};

export default InvitationCardModal;
