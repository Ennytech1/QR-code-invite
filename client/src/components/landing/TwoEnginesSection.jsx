import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';

const TwoEnginesSection = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 border-t border-slate-200/80 dark:border-slate-800/80">
      
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Engineered For Excellence
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Two Powerful Engines in One Platform
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Whether you are hosting a ticketed public concert or a private 200-guest wedding banquet, QRInvite gives you total control.
        </p>
      </div>

      {/* 3 Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Pillar 1 */}
        <div className="rounded-3xl p-7 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#10131c] space-y-4 flex flex-col justify-between hover:-translate-y-1 transition-transform shadow-sm hover:shadow-md">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Globe size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Engine 01 • Ticketing
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Public Ticket Sales & Box Office
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Sell tickets to the public with tiered pricing (Early Bird, Regular, VIP, Table Packages). Accept debit cards and bank transfers, with automated ticket delivery to attendee WhatsApp and email.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/explore"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Browse live ticket sales</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="rounded-3xl p-7 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#10131c] space-y-4 flex flex-col justify-between hover:-translate-y-1 transition-transform shadow-sm hover:shadow-md">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
              Engine 02 • Invitations
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Private WhatsApp VIP Passes (100% Free)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              For weddings, private dinners, and executive galas. Upload your guest list (CSV or manual), customize your invitation card theme, and export high-resolution JPEG images sent straight via WhatsApp.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/dashboard"
              className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1"
            >
              <span>Launch card designer</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="rounded-3xl p-7 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#10131c] space-y-4 flex flex-col justify-between hover:-translate-y-1 transition-transform shadow-sm hover:shadow-md">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
              The Security Moat • Hardware
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Sub-15ms Gate Scanner Terminal
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Turn any phone into a high-speed gate scanner. Verifies cryptographically signed passes in under 15 milliseconds and instantly flags duplicate screenshot attempts across multiple entrances.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/gate-tech"
              className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1"
            >
              <span>Inspect gate security specs</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>

      </div>

    </section>
  );
};

export default TwoEnginesSection;

