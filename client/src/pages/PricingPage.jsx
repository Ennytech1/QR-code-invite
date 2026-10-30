import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign, Check, ArrowRight, ShieldCheck, Zap,
  Sparkles, HelpCircle, Calculator, Building2, Heart
} from 'lucide-react';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';

const PricingPage = () => {
  // Calculator state
  const [ticketPrice, setTicketPrice] = useState(10000);
  const [attendees, setAttendees] = useState(250);

  const grossRevenue = ticketPrice * attendees;
  const platformFee = Math.round(grossRevenue * 0.035 + attendees * 100);
  const netEarnings = Math.max(0, grossRevenue - platformFee);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200 overflow-x-hidden">
      
      <LandingNavbar />

      {/* ─── Hero ─── */}
      <section className="relative pt-12 pb-16 bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent border-b border-[var(--border)] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
            <DollarSign size={13} /> Clear, Honest Pricing
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)] leading-tight">
            Transparent Pricing. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
              Free for Private & RSVP Events.
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
            No monthly subscription fees. No hidden setup costs. Only pay when you sell paid public tickets.
          </p>
        </div>
      </section>

      {/* ─── 3 PRICING TIERS ─── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Plan 1: Private & Free */}
          <div className="card-glow rounded-3xl p-7 border border-[var(--border)] bg-[var(--bg-surface)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  Private & RSVP Events
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Always Free
                </span>
              </div>
              <div>
                <div className="text-3xl font-black text-[var(--text-primary)]">₦0</div>
                <div className="text-xs text-[var(--text-secondary)] mt-0.5">Free forever for non-ticketed events</div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Perfect for weddings, private VIP dinners, corporate galas, and birthdays.
              </p>
              <ul className="space-y-2.5 text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--border)]">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Unlimited RSVP guest list ingestion (CSV/Manual)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Visual Invitation Card Designer (5 luxury themes)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>High-resolution JPEG export with embedded QR</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>1-Click WhatsApp direct invite links</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Gate Scanner terminal with anti-duplicate lock</span>
                </li>
              </ul>
            </div>

            <Link
              to="/dashboard"
              className="w-full py-3 rounded-2xl border border-[var(--border)] hover:bg-[var(--bg-subtle)] font-bold text-xs text-[var(--text-primary)] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Create Private Event Free</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Plan 2: Public Ticketed Events (POPULAR) */}
          <div className="card-glow rounded-3xl p-7 border-2 border-indigo-500 bg-[var(--bg-surface)] flex flex-col justify-between space-y-6 relative shadow-2xl shadow-indigo-500/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md">
              Most Popular for Organizers
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">
                  Public Ticket Sales
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Pay as you sell
                </span>
              </div>
              <div>
                <div className="text-3xl font-black text-[var(--text-primary)]">3.5% + ₦100</div>
                <div className="text-xs text-[var(--text-secondary)] mt-0.5">Per successful paid ticket sale</div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                For public concerts, nightlife pool parties, raves, and conferences.
              </p>
              <ul className="space-y-2.5 text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--border)]">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-indigo-400 shrink-0" />
                  <span>Everything in Private Plan</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-indigo-400 shrink-0" />
                  <span>Public Event Discovery listing on Box Office</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-indigo-400 shrink-0" />
                  <span>Tiered ticketing (Early Bird, VIP, Table Packages)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-indigo-400 shrink-0" />
                  <span>Online card & bank transfer checkout</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-indigo-400 shrink-0" />
                  <span>Same-day payouts to all Nigerian banks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-indigo-400 shrink-0" />
                  <span>Real-time gate arrival telemetry</span>
                </li>
              </ul>
            </div>

            <Link
              to="/dashboard"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/25 transition-all"
            >
              <span>Start Selling Tickets</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Plan 3: Enterprise & Mega Festivals */}
          <div className="card-glow rounded-3xl p-7 border border-[var(--border)] bg-[var(--bg-surface)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400">
                  Mega Festivals & Stadiums
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Custom
                </span>
              </div>
              <div>
                <div className="text-3xl font-black text-[var(--text-primary)]">Custom Volume</div>
                <div className="text-xs text-[var(--text-secondary)] mt-0.5">For 5,000+ attendees</div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                For stadium tours, multi-day music festivals, and international summits.
              </p>
              <ul className="space-y-2.5 text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--border)]">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-purple-400 shrink-0" />
                  <span>Dedicated Onsite Technical Support & Bouncer training</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-purple-400 shrink-0" />
                  <span>Rented handheld optical barcode terminals</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-purple-400 shrink-0" />
                  <span>Private offline cellular sync mesh</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-purple-400 shrink-0" />
                  <span>Custom white-label branding & domain</span>
                </li>
              </ul>
            </div>

            <a
              href="mailto:enterprise@qrinvite.io"
              className="w-full py-3 rounded-2xl border border-[var(--border)] hover:bg-[var(--bg-subtle)] font-bold text-xs text-[var(--text-primary)] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Contact Enterprise Sales</span>
              <ArrowRight size={13} />
            </a>
          </div>

        </div>
      </section>

      {/* ─── INTERACTIVE EARNINGS CALCULATOR ─── */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 border-t border-[var(--border)]">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
            <Calculator size={13} /> Revenue Estimator
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[var(--text-primary)]">
            Calculate Your Organizer Payout
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Adjust the sliders below to see your estimated revenue and net payout.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-xl space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Slider 1: Ticket Price */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[var(--text-secondary)]">Average Ticket Price</span>
                <span className="text-lg font-black text-indigo-400 font-mono">
                  ₦{ticketPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--text-tertiary)]">
                <span>₦1,000</span>
                <span>₦100,000</span>
              </div>
            </div>

            {/* Slider 2: Attendees */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[var(--text-secondary)]">Expected Ticket Buyers</span>
                <span className="text-lg font-black text-indigo-400 font-mono">
                  {attendees.toLocaleString()} Attendees
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="3000"
                step="20"
                value={attendees}
                onChange={(e) => setAttendees(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--text-tertiary)]">
                <span>20</span>
                <span>3,000</span>
              </div>
            </div>
          </div>

          {/* Results Summary Strip */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-indigo-950/40 border border-indigo-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase">Gross Sales</div>
              <div className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-mono mt-1">
                ₦{grossRevenue.toLocaleString()}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase">Platform & Security Fee</div>
              <div className="text-xl sm:text-2xl font-black text-slate-400 font-mono mt-1">
                -₦{platformFee.toLocaleString()}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-emerald-400 uppercase">Your Net Take-Home Payout</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-1">
                ₦{netEarnings.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              <span>Publish Event & Start Earning</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>

      </section>

      <LandingFooter />

    </div>
  );
};

export default PricingPage;
