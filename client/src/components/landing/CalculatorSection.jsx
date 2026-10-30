import React, { useState } from 'react';
import { Calculator, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CalculatorSection = () => {
  const [calcTicketPrice, setCalcTicketPrice] = useState(7500);
  const [calcAttendees, setCalcAttendees] = useState(350);

  // Fee calculation (5% + ₦100)
  const calcGross = calcTicketPrice * calcAttendees;
  const calcFee = Math.round(calcGross * 0.05 + calcAttendees * 100);
  const calcNet = Math.max(0, calcGross - calcFee);
  const traditionalFee = Math.round(calcGross * 0.10); // Competitors charge 10%
  const savings = Math.max(0, traditionalFee - calcFee);

  return (
    <section id="calculator" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 border-t border-[var(--border)]">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold uppercase tracking-wider">
          <Calculator size={13} />
          <span>Interactive Payout Calculator</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Predictable Math. Instant Settlements.
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Calculate your exact bank settlement with our standard 5% + ₦100 public ticket fee.
        </p>
      </div>

      {/* Main Calculator Card */}
      <div className="card-glow rounded-3xl p-6 sm:p-10 border border-[var(--border)] bg-[var(--bg-surface)] max-w-4xl mx-auto shadow-2xl space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Sliders (7 cols) */}
          <div className="md:col-span-7 space-y-7">
            
            {/* Slider 1: Ticket Price */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-[var(--text-secondary)]">Average Ticket Price</span>
                <span className="font-mono text-base font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20">
                  ₦{calcTicketPrice.toLocaleString()}
                </span>
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
              <div className="flex justify-between text-[10px] text-[var(--text-tertiary)] font-mono">
                <span>₦1,000</span>
                <span>₦25,000</span>
                <span>₦50,000</span>
              </div>
            </div>

            {/* Slider 2: Attendees */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-[var(--text-secondary)]">Expected Ticket Sales</span>
                <span className="font-mono text-base font-bold text-purple-500 bg-purple-500/10 px-2.5 py-0.5 rounded-lg border border-purple-500/20">
                  {calcAttendees.toLocaleString()} tickets
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="2500"
                step="10"
                value={calcAttendees}
                onChange={(e) => setCalcAttendees(Number(e.target.value))}
                className="w-full accent-purple-600 h-2 bg-[var(--bg-subtle)] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--text-tertiary)] font-mono">
                <span>20 tickets</span>
                <span>1,250 tickets</span>
                <span>2,500 tickets</span>
              </div>
            </div>

            {/* Private Event Free Callout */}
            <div className="rounded-2xl p-4 bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
              <Sparkles size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-amber-500">Hosting a Private Wedding, Dinner or Gala?</span>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Private RSVP guest passes and luxury WhatsApp invitations are <strong>100% Free Forever with ₦0 platform fees</strong>.
                </p>
              </div>
            </div>

          </div>

          {/* Result Card (5 cols) */}
          <div className="md:col-span-5 rounded-2xl p-6 bg-[var(--bg-subtle)] border border-[var(--border)] space-y-5">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Gross Ticket Sales:</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  ₦{calcGross.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-rose-400">
                <span>Platform Fee (5% + ₦100):</span>
                <span className="font-mono font-semibold">-₦{calcFee.toLocaleString()}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between items-center text-emerald-400 text-[11px] font-mono">
                  <span>Saved vs traditional 10% fee:</span>
                  <span>+₦{savings.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[var(--border)] space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Your Direct Bank Payout
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 tracking-tight">
                ₦{calcNet.toLocaleString()}
              </div>
              <p className="text-[10px] text-[var(--text-tertiary)]">
                Settles automatically to any Nigerian commercial bank next day.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <span>Launch Event & Sell Tickets</span>
              <ArrowRight size={13} />
            </Link>
          </div>

        </div>

      </div>

    </section>
  );
};

export default CalculatorSection;
