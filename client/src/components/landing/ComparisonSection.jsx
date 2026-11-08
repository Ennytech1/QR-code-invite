import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export const COMPARISON_POINTS = [
  {
    feature: 'Entry Speed & Gate Throughput',
    traditional: '20–45s per attendee with paper lists or manual check-offs',
    qrinvite: '< 15ms optical scan with instant audio-visual cues',
    highlight: true,
  },
  {
    feature: 'Duplicate Screenshot Protection',
    traditional: 'Screenshots can be shared across multiple friends',
    qrinvite: 'Atomic database locking rejects duplicate QR scans instantly',
    highlight: true,
  },
  {
    feature: 'Offline Turnstile Resilience',
    traditional: 'Fails or freezes when cellular network drops at venue',
    qrinvite: 'Local IndexedDB cache & PWA terminal sync without internet',
    highlight: true,
  },
  {
    feature: 'WhatsApp Direct JPEG Passes',
    traditional: 'Requires clunky PDF download or external app install',
    qrinvite: 'Personalized high-res JPEG cards sent straight to WhatsApp',
    highlight: false,
  },
  {
    feature: 'Multi-Entrance Synchronization',
    traditional: 'Paper lists cannot communicate across multiple gates',
    qrinvite: 'Live WebSocket mesh connects all gates concurrently',
    highlight: false,
  },
  {
    feature: 'Private Party Pricing',
    traditional: 'High upfront platform software subscriptions ($99+/mo)',
    qrinvite: '100% Free Forever for private and RSVP celebrations',
    highlight: false,
  },
];

const ComparisonSection = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Why Upgrade?
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Traditional Gate Entry vs. QRInvite Dual-Engine
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          See how cryptographic passes and atomic locks permanently eliminate entrance fraud and delays.
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#10131c] shadow-lg">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Feature / Dimension</th>
              <th className="py-4 px-6 font-bold text-rose-500 uppercase tracking-wider text-[11px]">Traditional Event Solutions</th>
              <th className="py-4 px-6 font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[11px] bg-indigo-50/50 dark:bg-indigo-950/20">
                QRInvite Platform
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {COMPARISON_POINTS.map((point, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                  {point.feature}
                </td>
                <td className="py-4 px-6 text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <XCircle size={15} className="text-rose-500 shrink-0" />
                  <span>{point.traditional}</span>
                </td>
                <td className="py-4 px-6 font-medium text-slate-900 dark:text-white bg-indigo-50/30 dark:bg-indigo-950/10">
                  <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 size={15} className="shrink-0" />
                    <span>{point.qrinvite}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ComparisonSection;

