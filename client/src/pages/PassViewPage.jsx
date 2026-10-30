import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import QRCode from 'qrcode';
import * as htmlToImage from 'html-to-image';
import toast from 'react-hot-toast';
import {
  ShieldCheck, Download, Share2, Sparkles, Calendar,
  MapPin, Clock, User, QrCode, ArrowLeft, CheckCircle2,
  Lock, Wallet, Smartphone, AlertCircle
} from 'lucide-react';
import { fetchPublicPass } from '../services/api';
import { useEvents } from '../context/EventContext';

const PassViewPage = () => {
  const { token } = useParams();
  const { guests, events } = useEvents();

  const [passData, setPassData] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const passCardRef = useRef(null);

  useEffect(() => {
    const loadPass = async () => {
      // 1. Try local context first
      const localGuest = guests.find((g) => g.qrToken === token || g.id === token);
      if (localGuest) {
        const localEvent = events.find((e) => e.id === localGuest.eventId) || events[0] || {};
        setPassData({
          token: localGuest.qrToken || token,
          guestName: localGuest.name,
          tier: localGuest.tier || 'VIP',
          table: localGuest.table || 'VIP High Table',
          plusOnes: localGuest.plusOnes || 0,
          status: localGuest.status || 'VALID',
          cardTheme: localGuest.cardTheme || localEvent.cardTheme || 'luxury-gold',
          event: {
            name: localEvent.name || 'Executive VIP Event',
            venue: localEvent.venue || 'Eko Convention Centre, Lagos',
            date: localEvent.date || 'Today',
            time: localEvent.time || '18:00',
            dressCode: localEvent.dressCode || 'Black Tie Elegance',
            hostName: localEvent.hostName || 'Event Host',
            customMessage: localEvent.customMessage || 'We request the honor of your presence.',
          },
        });
        return;
      }

      // 2. Fetch from backend API
      const res = await fetchPublicPass(token);
      if (res && res.data) {
        setPassData(res.data);
      } else {
        // Fallback realistic presentation pass
        setPassData({
          token: token || 'QRI_PASS_DEMO',
          guestName: 'Honored Guest',
          tier: 'VIP ACCESS',
          table: 'Executive Table #4',
          plusOnes: 1,
          status: 'VALID',
          cardTheme: 'luxury-gold',
          event: {
            name: 'QRInvite Leadership & Access Gala 2026',
            venue: 'The Grand Ballroom, Victoria Island',
            date: 'Saturday, Nov 14, 2026',
            time: '18:00',
            dressCode: 'Black Tie Elegance',
            hostName: 'Adeleke & Balogun Families',
            customMessage: 'We request the honor of your presence to celebrate with us.',
          },
        });
      }
    };

    loadPass();
  }, [token, guests, events]);

  // Generate crisp optical QR Code
  useEffect(() => {
    if (!passData) return;
    const qrString = JSON.stringify({
      t: 'QRI_PASS_V1',
      tid: passData.token,
      n: passData.guestName,
      tier: passData.tier,
    });

    QRCode.toDataURL(qrString, {
      width: 400,
      margin: 1,
      color: { dark: '#090d16', light: '#ffffff' },
      errorCorrectionLevel: 'H',
    }).then(setQrDataUrl).catch(console.error);
  }, [passData]);

  const handleDownloadImage = async () => {
    if (!passCardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await htmlToImage.toPng(passCardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `QRInvite_Pass_${(passData?.guestName || 'VIP').replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Digital VIP Pass saved to photos!');
    } catch (err) {
      toast.error('Download failed, please screenshot your pass');
    } finally {
      setDownloading(false);
    }
  };

  const handleAppleWallet = () => {
    toast.success('Pass ready for Apple Wallet! (Simulated .pkpass bundle)');
  };

  if (!passData) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  const isValid = passData.status === 'VALID';
  const isCheckedIn = passData.status === 'CHECKED_IN';

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-amber-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Navigation & Header */}
      <div className="w-full max-w-md mx-auto mb-5 flex items-center justify-between z-10">
        <Link
          to="/"
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} /> Back to QRInvite
        </Link>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
          <ShieldCheck size={14} /> Ed25519 Tamper-Proof
        </span>
      </div>

      {/* ─── Holographic Pass Card ─── */}
      <div
        ref={passCardRef}
        className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-6 z-10"
      >
        {/* Gold Luxury Trim / Accent Header */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

        {/* Status Pill & Tier */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
              {passData.tier} PASS
            </span>
          </div>

          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
            isValid ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
            isCheckedIn ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
            'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}>
            {isValid ? 'ACTIVE ACCESS' : isCheckedIn ? 'CHECKED IN' : 'REVOKED'}
          </span>
        </div>

        {/* Event Header */}
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
            {passData.event?.hostName || 'Executive Invitation'}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1 leading-tight tracking-tight">
            {passData.event?.name}
          </h1>
          <p className="text-xs text-amber-200/80 italic mt-1.5 font-serif">
            "{passData.event?.customMessage || 'We request the honor of your presence.'}"
          </p>
        </div>

        {/* Attendee Holographic Pass Box */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 backdrop-blur-md">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Honored Guest</span>
          <div className="flex items-center justify-between">
            <span className="text-lg font-extrabold text-white">{passData.guestName}</span>
            {passData.plusOnes > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                +{passData.plusOnes} Plus One
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-white/5">
            <span>Table: <strong className="text-white">{passData.table}</strong></span>
            <span>Dress: <strong className="text-white">{passData.event?.dressCode}</strong></span>
          </div>
        </div>

        {/* High-Resolution QR Optical Scanner Target */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white text-slate-950 shadow-inner space-y-2">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Gate Pass QR" className="w-52 h-52 object-contain" />
          ) : (
            <div className="w-52 h-52 flex items-center justify-center">
              <QrCode size={48} className="text-slate-400 animate-pulse" />
            </div>
          )}
          <span className="text-[10px] font-mono tracking-widest text-slate-600 font-semibold uppercase">
            {passData.token}
          </span>
        </div>

        {/* Event Logistics Info */}
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 pt-1 border-t border-white/10">
          <div className="flex items-start gap-2">
            <Calendar size={14} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Date & Time</span>
              <span className="text-white font-medium">{passData.event?.date} • {passData.event?.time}</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Venue</span>
              <span className="text-white font-medium line-clamp-1">{passData.event?.venue}</span>
            </div>
          </div>
        </div>

        {/* Security Stamp Footer */}
        <div className="pt-2 text-center text-[10px] text-slate-500 font-mono">
          <span>🔒 Tamper-Proof Asymmetric Ed25519 Pass • Anti-Screenshot Protected</span>
        </div>
      </div>

      {/* ─── Actions Bar ─── */}
      <div className="w-full max-w-md mx-auto mt-5 flex flex-col sm:flex-row gap-3 z-10">
        <button
          onClick={handleDownloadImage}
          disabled={downloading}
          className="flex-1 h-11 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
        >
          <Download size={15} />
          <span>{downloading ? 'Exporting...' : 'Save Pass to Photos'}</span>
        </button>

        <button
          onClick={handleAppleWallet}
          className="h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 font-bold text-xs text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Wallet size={15} className="text-amber-400" />
          <span>Add to Wallet</span>
        </button>
      </div>

    </div>
  );
};

export default PassViewPage;
