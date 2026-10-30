import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Smartphone, Calculator, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const PricingSection = () => {
  const [calcTicketPrice, setCalcTicketPrice] = useState(5000);
  const [calcAttendees, setCalcAttendees] = useState(400);

  // Fee calculation (5% + ₦100)
  const calcGross = calcTicketPrice * calcAttendees;
  const calcFee = Math.round(calcGross * 0.05 + calcAttendees * 100);
  const calcNet = Math.max(0, calcGross - calcFee);

  return (
    <section id="pricing" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
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
          Free and private RSVP events stay 100% free; public ticketed events are charged at <strong>5% + ₦100</strong> with next-day bank settlements. If you need on-ground support or custom turnstiles, we provide tailored quotes.
        </p>
      </div>

      {/* 4 Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* Tier 1: Free Events */}
        <div className="card-glow rounded-3xl p-6 sm:p-7 space-y-6 flex flex-col justify-between border border-[var(--border)] group hover:border-[var(--border-strong)] transition-all bg-[var(--bg-surface)]">
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
              FREE EVENTS
            </span>
            <div className="space-y-1">
              <div className="text-4xl font-black text-[var(--text-primary)] font-mono">
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
                <Check size={14} className="text-indigo-400 shrink-0" />
                <span>Unlimited Free Attendees</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-indigo-400 shrink-0" />
                <span>WhatsApp & Email Passes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-indigo-400 shrink-0" />
                <span>Mobile Camera Scanner App</span>
              </div>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="w-full h-10 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-subtle)] text-[13px] font-bold text-[var(--text-primary)] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          >
            Get Started
          </Link>
        </div>

        {/* Tier 2: Ticket Events (MOST POPULAR) */}
        <div className="card-glow rounded-3xl p-6 sm:p-7 space-y-6 flex flex-col justify-between border-2 border-indigo-500 relative shadow-2xl shadow-indigo-500/10 transform lg:-translate-y-2 bg-[var(--bg-surface)]">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-md whitespace-nowrap">
            Most Popular
          </div>

          <div className="space-y-4 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              TICKET EVENTS
            </span>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] font-mono">
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
                <Check size={14} className="text-emerald-400 shrink-0" />
                <span>Instant Next-Day Bank Payouts</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400 shrink-0" />
                <span>Zero Screenshot Duplicate Lock</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400 shrink-0" />
                <span>Discount & Promo Codes Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400 shrink-0" />
                <span>Unlimited Concurrent Door Gates</span>
              </div>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-bold flex items-center justify-center transition-colors shadow-lg shadow-indigo-500/25 cursor-pointer"
          >
            Get Started
          </Link>
        </div>

        {/* Tier 3: VIP & RSVP Events */}
        <div className="card-glow rounded-3xl p-6 sm:p-7 space-y-6 flex flex-col justify-between border border-[var(--border)] group hover:border-amber-500/40 transition-all bg-[var(--bg-surface)]">
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
              PRIVATE & VIP INVITES
            </span>
            <div className="space-y-1">
              <div className="text-4xl font-black text-[var(--text-primary)] font-mono">
                ₦0
              </div>
              <div className="text-[12px] text-amber-500 font-semibold">
                100% Free Forever.
              </div>
            </div>
            <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
              For weddings, birthdays, executive banquets, and private RSVP guest lists.
            </p>

            <div className="pt-2 border-t border-[var(--border)] space-y-2 text-[12px] text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-amber-500 shrink-0" />
                <span>Custom JPEG WhatsApp Passes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-amber-500 shrink-0" />
                <span>Seating & Table Assignments</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-amber-500 shrink-0" />
                <span>Bulk CSV Guest Import</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-amber-500 shrink-0" />
                <span>Sub-100ms Gate Verification</span>
              </div>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="w-full h-10 rounded-xl border border-amber-500/30 hover:bg-amber-500/10 text-[13px] font-bold text-amber-500 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          >
            Launch Designer
          </Link>
        </div>

        {/* Tier 4: Custom Services */}
        <div className="card-glow rounded-3xl p-6 sm:p-7 space-y-6 flex flex-col justify-between border border-[var(--border)] group hover:border-[var(--border-strong)] transition-all bg-[var(--bg-surface)]">
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
              ENTERPRISE & GATES
            </span>
            <div className="space-y-1">
              <div className="text-3xl font-black text-[var(--text-primary)]">
                Tailored Quote
              </div>
              <div className="text-[12px] text-[var(--text-secondary)]">
                For stadium & multi-gate access.
              </div>
            </div>
            
            <div className="pt-2 border-t border-[var(--border)] space-y-2.5 text-[12px] text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-purple-400 shrink-0" />
                <span>Fabric wrist tags & RFID printing</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-purple-400 shrink-0" />
                <span>On-site physical gate bouncer support</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-purple-400 shrink-0" />
                <span>Turnstile API hardware integration</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-purple-400 shrink-0" />
                <span>Custom SLA & offline sync server</span>
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/2348000000000?text=Hello%20QRInvite,%20I%20need%20a%20tailored%20quote%20for%20my%20event"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-10 rounded-xl border border-[var(--border)] hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-500 text-[13px] font-bold text-[var(--text-primary)] flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
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
            <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Calculator size={18} className="text-indigo-400" />
              <span>Interactive Earnings Calculator</span>
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
  );
};

export default PricingSection;
