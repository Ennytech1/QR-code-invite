import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CtaBannerSection = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white text-center space-y-6 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-300">
            Ready to Upgrade Your Event Access?
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Start Free Today. No Setup Fees.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Create your event in under 2 minutes. Design custom JPEG passes, dispatch on WhatsApp, and scan your entrance gate with zero latency.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 pt-2">
          <Link
            to="/signup"
            className="w-full sm:w-auto h-12 px-8 rounded-xl bg-white text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl hover:bg-slate-100 transition-all cursor-pointer"
          >
            <span>Create Free Account</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/pricing"
            className="w-full sm:w-auto h-12 px-7 rounded-xl border border-white/20 hover:bg-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>View Pricing Plans</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaBannerSection;

