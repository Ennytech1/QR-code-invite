import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, Calendar, MapPin, ShieldCheck, Ticket, Users,
  CheckCircle2, CreditCard, ArrowRight, Sparkles, AlertCircle,
  ExternalLink, Smartphone, Lock, ChevronRight, Check,
  QrCode, Copy, Share2, Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEvents } from '../../context/EventContext';

const PAYMENT_METHODS = [
  {
    id: 'card',
    name: 'Debit / Credit Card',
    badge: 'Instant',
    description: 'Paystack • Visa, Mastercard, Verve',
    icon: CreditCard,
  },
  {
    id: 'nip',
    name: 'Bank Transfer (NIP)',
    badge: 'Zero Fee',
    description: 'Instant dynamic virtual account',
    icon: ShieldCheck,
  },
  {
    id: 'apple',
    name: 'Apple / Google Pay',
    badge: '1-Tap',
    description: 'Biometric authorization',
    icon: Smartphone,
  },
];

const BuyTicketModal = ({ isOpen, onClose, event, onTicketPurchased }) => {
  const navigate = useNavigate();
  const { purchaseTicket } = useEvents();

  const [selectedTierId, setSelectedTierId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [step, setStep] = useState('select'); // 'select' | 'details' | 'payment' | 'success'
  const [isProcessing, setIsProcessing] = useState(false);
  const [issuedResult, setIssuedResult] = useState(null);

  if (!isOpen || !event) return null;

  const tiers = event.ticketTiers && event.ticketTiers.length > 0
    ? event.ticketTiers
    : [
        { id: 't_reg', name: 'Regular Entry', price: 10000, perks: 'General Admission & Open Floor' },
        { id: 't_vip', name: 'VIP Pass', price: 35000, perks: 'Fast-track gate & VIP Lounge Access' },
      ];

  const currentTier = tiers.find((t) => t.id === selectedTierId) || tiers[0];
  const unitPrice = currentTier.price || 0;
  const subtotal = unitPrice * quantity;
  const processingFee = subtotal > 0 ? Math.round(subtotal * 0.015) : 0;
  const grandTotal = subtotal + processingFee;

  const handleProceedToDetails = () => {
    setStep('details');
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail) {
      toast.error('Please enter your full name and email address');
      return;
    }
    // If phone number does not start with +, default to Nigeria +234
    if (buyerPhone && !buyerPhone.startsWith('+')) {
      const cleaned = buyerPhone.replace(/^0/, '');
      setBuyerPhone(`+234${cleaned}`);
    }
    // If event is free, directly complete purchase
    if (grandTotal === 0) {
      executeCheckout();
    } else {
      setStep('payment');
    }
  };

  const executeCheckout = () => {
    setIsProcessing(true);
    toast.loading('Securing tickets & generating cryptographic passes...', { id: 'purchase-tkt' });

    setTimeout(() => {
      try {
        const result = purchaseTicket(event.id, {
          buyerName,
          buyerEmail,
          buyerPhone: buyerPhone || '+2348000000000',
          tierId: currentTier.id,
          quantity,
        });

        setIsProcessing(false);
        setIssuedResult(result);
        setStep('success');
        toast.success(`Successfully registered ${quantity} verified pass(es)!`, { id: 'purchase-tkt' });
      } catch (err) {
        setIsProcessing(false);
        toast.error('Failed to issue tickets: ' + err.message, { id: 'purchase-tkt' });
      }
    }, 1200);
  };

  const handleClose = () => {
    setStep('select');
    setQuantity(1);
    setBuyerName('');
    setBuyerEmail('');
    setBuyerPhone('');
    setSelectedPayment('card');
    setIssuedResult(null);
    onClose();
  };

  const handleOpenMobilePass = (guest) => {
    const targetGuest = guest || issuedResult?.guests?.[0];
    if (!targetGuest) return;
    const token = targetGuest.qrToken || targetGuest.id;
    handleClose();
    navigate(`/pass/${token}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 dark:bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 my-auto transition-all animate-fade-in-scale">
        
        {/* Header with Event Banner */}
        <div className="relative h-36 w-full overflow-hidden bg-slate-900">
          <img
            src={event.banner}
            alt={event.name}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0c0e14] via-black/40 to-transparent" />

          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 hover:bg-black text-slate-300 hover:text-white backdrop-blur-md transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>

          {/* Event Badge & Title */}
          <div className="absolute bottom-3 left-5 right-5">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow-sm inline-block">
              {event.type === 'PUBLIC' ? 'Public Event Box Office' : 'VIP RSVP Registration'}
            </span>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white dark:text-white mt-1 truncate drop-shadow-sm">
              {event.name}
            </h3>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-400">
          <div className={`flex items-center gap-1.5 ${step === 'select' ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono ${step === 'select' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>1</span>
            <span>Tickets</span>
          </div>
          <ChevronRight size={12} className="text-slate-300 dark:text-slate-700" />
          <div className={`flex items-center gap-1.5 ${step === 'details' ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono ${step === 'details' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>2</span>
            <span>Attendee</span>
          </div>
          <ChevronRight size={12} className="text-slate-300 dark:text-slate-700" />
          <div className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono ${step === 'payment' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>3</span>
            <span>Payment</span>
          </div>
          <ChevronRight size={12} className="text-slate-300 dark:text-slate-700" />
          <div className={`flex items-center gap-1.5 ${step === 'success' ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono ${step === 'success' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>✓</span>
            <span>Pass</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* ──── STEP 1: SELECT TICKET TIER & QUANTITY ──── */}
          {step === 'select' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-indigo-500" />
                  {event.date} • {event.time}
                </span>
                <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                  <MapPin size={13} className="text-rose-500 shrink-0" />
                  {event.venue}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Select Ticket Tier
                </label>
                <div className="space-y-2.5">
                  {tiers.map((tier) => {
                    const isSelected = (selectedTierId || tiers[0].id) === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTierId(tier.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/30 dark:border-indigo-500 shadow-md shadow-indigo-600/10'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-extrabold ${isSelected ? 'text-indigo-950 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                              {tier.name}
                            </span>
                            {isSelected && (
                              <span className="px-1.5 py-0.2 rounded-md bg-indigo-600 text-white text-[9px] font-bold uppercase">
                                Selected
                              </span>
                            )}
                          </div>
                          {tier.perks && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                              {tier.perks}
                            </div>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-base font-black font-mono text-slate-900 dark:text-white">
                            {tier.price > 0 ? `₦${tier.price.toLocaleString()}` : 'Free'}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {tier.price > 0 ? 'per attendee' : 'complimentary'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Number of Passes
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Each pass receives a separate anti-replay QR code
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-white hover:bg-slate-100 disabled:opacity-30 cursor-pointer shadow-2xs"
                  >
                    -
                  </button>
                  <span className="font-mono font-black text-base text-slate-900 dark:text-white w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    disabled={quantity >= 10}
                    className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-white hover:bg-slate-100 disabled:opacity-30 cursor-pointer shadow-2xs"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-500/20 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal ({quantity}x {currentTier.name})</span>
                  <span className="text-slate-900 dark:text-slate-200 font-bold font-mono">₦{subtotal.toLocaleString()}</span>
                </div>
                {processingFee > 0 && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Gate Access & Security Clearing (1.5%)</span>
                    <span className="text-slate-900 dark:text-slate-200 font-bold font-mono">₦{processingFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-900 dark:text-white font-black text-sm pt-2 border-t border-indigo-200/60 dark:border-indigo-500/20">
                  <span>Total Amount</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                type="button"
                onClick={handleProceedToDetails}
                className="w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <span>Continue to Attendee Details</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* ──── STEP 2: ATTENDEE & DISPATCH DETAILS ──── */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Order:</span>{' '}
                  <span className="font-extrabold text-slate-900 dark:text-white">{quantity}x {currentTier.name}</span>
                </div>
                <div className="font-black text-indigo-600 dark:text-indigo-400 text-sm font-mono">
                  ₦{grandTotal.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Attendee / Buyer Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Babatunde Lawal"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address (Receipt & Pass PDF) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="babatunde@company.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  WhatsApp Phone Number (Direct Pass Delivery)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                    🇳🇬
                  </span>
                  <input
                    type="tel"
                    placeholder="+234 803 000 0000"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 shadow-2xs"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  We send a high-resolution pass image with scannable QR directly to WhatsApp.
                </p>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs">
                <ShieldCheck size={16} className="shrink-0" />
                <span>Passes are signed with Ed25519 digital cryptography. Instant gate ingress guarantee.</span>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="py-2.5 px-4 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl font-black text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <span>{grandTotal === 0 ? 'Register Free Pass' : 'Proceed to Payment'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}

          {/* ──── STEP 3: PAYMENT GATEWAY (PAYSTACK / NIP / CARD) ──── */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block">
                    Total Amount Due
                  </span>
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                    ₦{grandTotal.toLocaleString()}
                  </span>
                </div>
                <div className="text-right text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{quantity}x {currentTier.name}</span>
                  <span className="block font-semibold text-slate-700 dark:text-slate-300">{buyerName}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {PAYMENT_METHODS.map((pm) => {
                    const isSel = selectedPayment === pm.id;
                    const Icon = pm.icon;
                    return (
                      <div
                        key={pm.id}
                        onClick={() => setSelectedPayment(pm.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSel
                            ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 dark:border-indigo-500 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:bg-slate-50 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSel ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}>
                            <Icon size={17} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                                {pm.name}
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                {pm.badge}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {pm.description}
                            </span>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSel ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 dark:border-slate-700'
                        }`}>
                          {isSel && <Check size={11} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Security info */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <Lock size={14} className="text-indigo-500 shrink-0" />
                <span>256-bit SSL encrypted • Instant turnstile admission authorization.</span>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="py-2.5 px-4 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={executeCheckout}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-4 rounded-xl font-black text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  <ShieldCheck size={16} />
                  <span>{isProcessing ? 'Authorizing & Issuing Passes...' : `Pay ₦${grandTotal.toLocaleString()} Now`}</span>
                </button>
              </div>
            </div>
          )}

          {/* ──── STEP 4: PURCHASE SUCCESS & INSTANT PASS HUB ──── */}
          {step === 'success' && issuedResult && (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl animate-fade-in-scale">
                <CheckCircle2 size={30} strokeWidth={2.5} />
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white font-heading">
                  Pass Confirmed & Issued!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Issued to <strong className="text-slate-900 dark:text-white">{buyerName}</strong> ({buyerEmail})
                </p>
              </div>

              {/* Pass details summary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Target Event</span>
                  <span className="text-slate-900 dark:text-white font-bold">{event.name}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Passes Issued</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{issuedResult.guests.length} Verified QR Pass(es)</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Gate Security Token</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold truncate max-w-[180px]">
                    {issuedResult.guests[0]?.qrToken}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenMobilePass(issuedResult.guests[0])}
                  className="w-full py-3 px-4 rounded-xl font-black text-xs bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <Smartphone size={16} />
                  <span>Open Mobile Pass & QR Screen</span>
                  <ExternalLink size={13} />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onTicketPurchased && issuedResult.guests[0]) {
                        onTicketPurchased(issuedResult.guests[0], event);
                      }
                      handleClose();
                    }}
                    className="py-2.5 px-3 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Download size={13} />
                    <span>Download Pass Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default BuyTicketModal;