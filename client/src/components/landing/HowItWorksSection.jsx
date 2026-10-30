import React, { useState } from 'react';
import { Calendar, CreditCard, QrCode, Smartphone, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'Create Event & Guest Roster in 60s',
    desc: 'Set up public ticket sales with multi-tiered pricing, or upload your private guest list (CSV or manual) to generate luxury personalized VIP passes.',
    icon: Calendar,
    color: 'from-indigo-500 to-violet-600',
    iconColor: 'text-indigo-400',
    highlightTitle: 'Dual-Engine Architecture',
    highlightDesc: 'qrinvite.io/e/grand-executive-gala-2026',
    pill: '60s Setup',
    pillColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
  },
  {
    num: '02',
    title: 'Sell Tickets Online & WhatsApp Passes',
    desc: 'Public attendees pay smoothly via Bank Transfer or Card. Private VIPs receive customized 2x Retina JPEG cards with their name and table number directly on WhatsApp.',
    icon: CreditCard,
    color: 'from-purple-500 to-pink-600',
    iconColor: 'text-purple-400',
    highlightTitle: 'Direct WhatsApp Delivery',
    highlightDesc: 'Zero spam • 1-tap Apple & Google Wallet pass sync',
    pill: 'Multi-Channel',
    pillColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  },
  {
    num: '03',
    title: 'Scan Turnstiles & Zero Double-Spend',
    desc: 'Bouncers scan QR passes in <15ms with any phone camera or USB barcode scanner. Cryptographic Ed25519 signatures and atomic locks permanently block screenshot forwarding.',
    icon: QrCode,
    color: 'from-emerald-500 to-teal-600',
    iconColor: 'text-emerald-400',
    highlightTitle: 'RFC 8032 Anti-Replay Mutex',
    highlightDesc: 'Zero duplicate screenshot fraud across all gates',
    pill: 'Next-Day Payouts',
    pillColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  }
];

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[11px] font-bold uppercase tracking-wider">
          How It Works
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)]">
          Three steps to a <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            stronger event launch.
          </span>
        </h2>
        <p className="text-[15px] text-[var(--text-secondary)]">
          No technical skills required. If you can share a link, you can sell tickets and protect your doors.
        </p>
      </div>

      {/* 3 Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="card-glow rounded-3xl p-7 space-y-6 flex flex-col justify-between border border-[var(--border)] relative group hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 bg-[var(--bg-surface)]"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-5xl font-black text-indigo-500/20 group-hover:text-indigo-500/40 transition-colors font-mono">
                    {step.num}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                    <Icon size={22} strokeWidth={2.2} />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${step.pillColor}`}>
                    {step.pill}
                  </span>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Bottom Feature Teaser Box */}
              <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    {step.highlightTitle}
                  </span>
                </div>
                <div className="font-mono text-[10px] text-[var(--text-secondary)] truncate bg-[var(--bg-base)] p-1.5 rounded border border-[var(--border)]">
                  {step.highlightDesc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default HowItWorksSection;
