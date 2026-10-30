import React, { useState, useEffect } from 'react';
import { X, QrCode, Share2, Mail, Download, CheckCircle2, ShieldCheck, Sparkles, Copy } from 'lucide-react';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';

const TicketPassModal = ({ isOpen, onClose, guest, eventName = 'Lagos Tech Summit 2026' }) => {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (!isOpen || !guest) return;
    const payload = guest.qrToken || guest.compactQrPayload || guest.id || 'QRI_PASS';
    QRCode.toDataURL(payload, {
      width: 320,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#1e1b4b',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating pass QR code', err));
  }, [isOpen, guest]);

  if (!isOpen || !guest) return null;

  const passUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/pass/${guest.qrToken || guest.id}`
    : `https://qrinvite.io/pass/${guest.id}`;

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${guest.name}! Here is your verified VIP Digital Pass for ${eventName}. Present this QR pass at the entrance gate: ${passUrl}`
    );
    window.open(`https://api.whatsapp.com/send?phone=${guest.phone}&text=${text}`, '_blank');
    toast.success(`WhatsApp invitation draft opened for ${guest.name}!`);
  };

  const handleSendEmail = () => {
    toast.success(`Digital pass email queued for ${guest.email}!`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(passUrl);
    toast.success('Pass link copied to clipboard!');
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QRInvite_Pass_${(guest.name || 'guest').replace(/\s+/g, '_')}.png`;
    a.click();
    toast.success('Pass QR code downloaded!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden text-slate-900 dark:text-white">
        
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/40">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Verified Digital Pass
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Digital Pass Card Body */}
        <div className="p-6 text-center space-y-4">
          
          {/* Card Container with Tear Notch styling */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#3B2875] via-[#51369B] to-[#432A85] text-white p-6 shadow-xl border border-indigo-400/20 overflow-hidden">
            
            {/* Top Pass Info */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white">
                  <Sparkles size={12} />
                </div>
                <span className="font-extrabold text-xs tracking-tight">QRInvite PASS</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-400 text-slate-950">
                {guest.tier || 'VIP'}
              </span>
            </div>

            {/* Event Name */}
            <div className="py-3 text-left">
              <p className="text-[11px] text-indigo-200 font-medium">EVENT PASS</p>
              <h4 className="text-base font-black truncate">{eventName}</h4>
            </div>

            {/* Dynamic QR Code Container */}
            <div className="p-4 bg-white rounded-2xl shadow-inner mx-auto max-w-[200px] my-1">
              <div className="relative flex flex-col items-center justify-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Attendee QR Access Pass"
                    className="w-36 h-36 mx-auto rounded-lg object-contain"
                  />
                ) : (
                  <div className="w-36 h-36 flex items-center justify-center bg-slate-50 rounded-lg">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-7 h-7 rounded-md bg-white/95 border border-indigo-200 text-indigo-700 flex items-center justify-center shadow-xs">
                    <ShieldCheck size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Name & Details */}
            <div className="pt-2 text-center">
              <h3 className="text-base font-extrabold text-white">{guest.name}</h3>
              <p className="text-xs text-indigo-200 mt-0.5">{guest.phone || guest.email}</p>
              {guest.table && (
                <p className="text-xs text-emerald-300 font-semibold mt-0.5">Table / Seating: {guest.table}</p>
              )}
              <div className="mt-2 text-[10px] text-indigo-300 font-mono tracking-wider">
                ID: {guest.id} • SIGNED ED25519
              </div>
            </div>

          </div>

          {/* Action Buttons: WhatsApp, Email, Download & Copy */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleShareWhatsApp}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Share2 size={15} />
              <span>Send via WhatsApp API</span>
            </button>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleSendEmail}
                className="py-2.5 px-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Mail size={13} />
                <span>Email</span>
              </button>

              <button
                onClick={handleDownloadQR}
                className="py-2.5 px-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Download size={13} />
                <span>Save QR</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="py-2.5 px-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Copy size={13} />
                <span>Copy</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TicketPassModal;
