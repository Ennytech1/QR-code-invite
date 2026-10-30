import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Lock, Smartphone, ArrowRight, Sparkles,
  QrCode, Mail, Heart, Globe, Award
} from 'lucide-react';

const LandingFooter = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 pt-16 pb-12 bg-slate-50/50 dark:bg-[#07090e] text-[13px] text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 5 Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col (2 span) */}
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <QrCode size={19} strokeWidth={2.3} />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                QR<span className="text-indigo-600 dark:text-indigo-400">Invite</span>
              </span>
            </Link>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              The tamper-resistant digital access platform built for public ticketed events and private RSVP gatherings. Design personalized WhatsApp invitation cards, issue secure QR passes, and verify entry with sub-second gate scanning.
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck size={12} /> RFC 8032 Cryptography
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Lock size={12} /> Zero Double-Spend
              </span>
            </div>
          </div>

          {/* Col 2: Discover */}
          <div className="space-y-3">
            <h4 className="font-bold text-[12px] text-slate-900 dark:text-white uppercase tracking-wider">
              Explore & Attend
            </h4>
            <ul className="space-y-2 text-[12px] text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/explore" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  All Public Events
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Concerts & Nightlife
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Festivals & Pool Parties
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Conferences & Galas
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Organizers */}
          <div className="space-y-3">
            <h4 className="font-bold text-[12px] text-slate-900 dark:text-white uppercase tracking-wider">
              For Organizers
            </h4>
            <ul className="space-y-2 text-[12px] text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-semibold text-indigo-600 dark:text-indigo-400">
                  Host an Event →
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/gate-tech" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Gate Scanner Technology
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Pricing & Payouts
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Support */}
          <div className="space-y-3">
            <h4 className="font-bold text-[12px] text-slate-900 dark:text-white uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-[12px] text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/faqs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/scanner" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Gate Scanner Terminal
                </Link>
              </li>
              <li>
                <a href="mailto:support@qrinvite.io" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <span className="text-[11px] text-slate-400">Status: All Systems Operational 🟢</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <div>
            © 2026 QRInvite Platform. Built for authentic celebrations & zero gate fraud.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors">How It Works</Link>
            <Link to="/pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</Link>
            <Link to="/faqs" className="hover:text-slate-900 dark:hover:text-white transition-colors">FAQs</Link>
            <Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-colors">Organizer Portal</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default LandingFooter;
