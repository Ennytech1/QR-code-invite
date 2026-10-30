import React, { useState } from 'react';
import {
  X, Calendar, MapPin, ShieldCheck, Ticket, Users,
  CheckCircle2, CreditCard, ArrowRight, Sparkles, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEvents } from '../../context/EventContext';

const BuyTicketModal = ({ isOpen, onClose, event, onTicketPurchased }) => {
  const { purchaseTicket } = useEvents();

  const [selectedTierId, setSelectedTierId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('select'); // 'select' | 'details' | 'success'
  const [issuedResult, setIssuedResult] = useState(null);

  if (!isOpen || !event) return null;

  const tiers = event.ticketTiers && event.ticketTiers.length > 0
    ? event.ticketTiers
    : [
        { id: 't_reg', name: 'Regular Entry', price: 10000, perks: 'General Admission' },
        { id: 't_vip', name: 'VIP Pass', price: 35000, perks: 'Fast-track gate & VIP Area' },
      ];

  const currentTier = tiers.find((t) => t.id === selectedTierId) || tiers[0];
  const unitPrice = currentTier.price || 0;
  const subtotal = unitPrice * quantity;
  const processingFee = subtotal > 0 ? Math.round(subtotal * 0.015) : 0;
  const grandTotal = subtotal + processingFee;

  const handleProceedToDetails = () => {
    setStep('details');
  };

  const handleCompletePurchase = (e) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail) {
      toast.error('Please enter your full name and email address');
      return;
    }

    setIsProcessing(true);
    toast.loading('Securing tickets & generating cryptographic passes...', { id: 'purchase-tkt' });

    setTimeout(() => {
      try {
        const result = purchaseTicket(event.id, {
          buyerName,
          buyerEmail,
          buyerPhone,
          tierId: currentTier.id,
          quantity,
        });

        setIsProcessing(false);
        setIssuedResult(result);
        setStep('success');
        toast.success(`Successfully registered ${quantity} ticket(s)!`, { id: 'purchase-tkt' });
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
    setIssuedResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#111622] border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100 my-auto">
        
        {/* Header with Event Banner */}
        <div className="relative h-32 w-full overflow-hidden bg-slate-900">
          <img
            src={event.banner}
            alt={event.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111622] via-[#111622]/60 to-transparent" />

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 hover:bg-black text-slate-300 hover:text-white backdrop-blur-md transition-colors"
          >
            <X size={18} />
          </button>

          {/* Event Badge & Title */}
          <div className="absolute bottom-3 left-5 right-5">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500 text-white shadow-sm">
              {event.type === 'PUBLIC' ? 'Public Event Ticket' : 'RSVP Registration'}
            </span>
            <h3 className="text-lg font-black tracking-tight text-white mt-1 truncate">
              {event.name}
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* ──── STEP 1: SELECT TICKET TIER & QUANTITY ──── */}
          {step === 'select' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-xs text-slate-400 border-b border-slate-800/80 pb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-indigo-400" />
                  {event.date} • {event.time}
                </span>
                <span className="flex items-center gap-1.5 truncate">
                  <MapPin size={13} className="text-indigo-400 shrink-0" />
                  {event.venue}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Select Ticket Tier
                </label>
                <div className="space-y-2.5">
                  {tiers.map((tier) => {
                    const isSelected = (selectedTierId || tiers[0].id) === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTierId(tier.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-500/10 shadow-md shadow-indigo-500/10'
                            : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-400'
                        }`}
                      >
                        <div>
                          <div className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                            {tier.name}
                          </div>
                          {tier.perks && (
                            <div className="text-[11px] text-slate-400 mt-0.5">{tier.perks}</div>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-black text-white">
                            {tier.price > 0 ? `₦${tier.price.toLocaleString()}` : 'Free / Complimentary'}
                          </div>
                          <span className={`text-[10px] font-bold ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`}>
                            {isSelected ? 'Selected' : 'Tap to select'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-slate-300">Number of Passes</div>
                  <div className="text-[11px] text-slate-500">Each pass gets a unique secure QR code</div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-base text-white w-5 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    disabled={quantity >= 10}
                    className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({quantity}x {currentTier.name})</span>
                  <span className="text-slate-200 font-semibold">₦{subtotal.toLocaleString()}</span>
                </div>
                {processingFee > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>Gate Access & Security Fee (1.5%)</span>
                    <span className="text-slate-200 font-semibold">₦{processingFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-extrabold text-sm pt-2 border-t border-indigo-500/20">
                  <span>Total Amount</span>
                  <span className="text-indigo-400">₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={handleProceedToDetails}
                className="w-full py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* ──── STEP 2: BUYER DETAILS & CONFIRMATION ──── */}
          {step === 'details' && (
            <form onSubmit={handleCompletePurchase} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Selected:</span>{' '}
                  <span className="font-bold text-white">{quantity}x {currentTier.name}</span>
                </div>
                <div className="font-extrabold text-indigo-400 text-sm">
                  ₦{grandTotal.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Attendee / Buyer Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Babatunde Lawal"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-sm focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address (Pass will be sent here)
                </label>
                <input
                  type="email"
                  required
                  placeholder="babatunde@gmail.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-sm focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  WhatsApp Phone Number (For Mobile Pass)
                </label>
                <input
                  type="tel"
                  placeholder="+234 803 000 0000"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-sm focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                <ShieldCheck size={16} className="shrink-0" />
                <span>Encrypted with Ed25519 digital signature. One-time scan lock at venue gate.</span>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="py-2.5 px-4 rounded-xl font-semibold text-xs border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <CreditCard size={15} />
                  {isProcessing ? 'Processing Payment & Issuing...' : `Pay & Get Passes (₦${grandTotal.toLocaleString()})`}
                </button>
              </div>
            </form>
          )}

          {/* ──── STEP 3: PURCHASE SUCCESS & INSTANT PASS DISPLAY ──── */}
          {step === 'success' && issuedResult && (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 size={32} />
              </div>

              <div>
                <h4 className="text-xl font-black text-white">Tickets Confirmed!</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Issued to <span className="text-white font-bold">{buyerName}</span> ({buyerEmail})
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-2">
                <div className="text-xs text-slate-400 flex justify-between">
                  <span>Event</span>
                  <span className="text-white font-semibold">{event.name}</span>
                </div>
                <div className="text-xs text-slate-400 flex justify-between">
                  <span>Passes Generated</span>
                  <span className="text-indigo-400 font-bold">{issuedResult.guests.length} Verified QR Pass(es)</span>
                </div>
                <div className="text-xs text-slate-400 flex justify-between">
                  <span>Primary Token</span>
                  <span className="font-mono text-emerald-400">{issuedResult.guests[0]?.qrToken}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    if (onTicketPurchased && issuedResult.guests[0]) {
                      onTicketPurchased(issuedResult.guests[0], event);
                    }
                    handleClose();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Ticket size={15} />
                  View & Download Pass Image
                </button>

                <button
                  onClick={handleClose}
                  className="py-2.5 px-4 rounded-xl font-semibold text-xs border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BuyTicketModal;
