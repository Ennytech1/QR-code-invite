import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, ShieldCheck, Smartphone, Zap, MessageCircle } from 'lucide-react';

const FAQS = [
  {
    category: 'Security & Anti-Fraud',
    icon: ShieldCheck,
    question: 'How does QRInvite prevent people from screenshotting and sharing passes?',
    answer: 'Every QRInvite ticket is signed using RFC 8032 Ed25519 asymmetric cryptography containing a unique ticket ID, event ID, issue timestamp, and digital signature. When scanned at the entrance, our atomic lock immediately flags the ticket as CHECKED_IN. If another person presents a screenshot of the same pass at any gate, the scanner instantly flashes crimson with an audio buzzer, displaying the exact previous check-in timestamp and gate identifier.'
  },
  {
    category: 'Offline Operations',
    icon: Zap,
    question: 'What happens if venue cellular data or Wi-Fi drops completely?',
    answer: 'QRInvite is engineered offline-first. The gate scanner runs as a Progressive Web App (PWA) with a local IndexedDB cache of your event’s public key and attendee manifest. It continues scanning and validating passes locally in under 15ms without any internet connection. Once cellular or Wi-Fi connectivity returns, the local check-in logs synchronize automatically with zero data loss.'
  },
  {
    category: 'WhatsApp VIP Passes',
    icon: MessageCircle,
    question: 'How do WhatsApp VIP invitations work for weddings, galas, and private dinners?',
    answer: 'You can upload your guest roster via CSV or enter guests manually. Select a luxury card design (Royal Gold, Midnight Executive, Emerald Gala, or Ruby Sovereign). QRInvite generates a crisp 2x Retina JPEG invitation card customized with each guest’s full name, table number, and unique QR code. You can dispatch these cards directly to their WhatsApp chat with a single tap, with pre-filled greeting text and zero app download required for the guest.'
  },
  {
    category: 'Pricing & Fees',
    icon: Sparkles,
    question: 'Is QRInvite really 100% free for private and RSVP celebrations?',
    answer: 'Yes! Private celebrations, weddings, birthday dinners, executive galas, and RSVP events are 100% Free Forever with zero platform fees and no credit card required. For public ticket sales where you charge attendees, we charge a simple transparent fee of 5% + ₦100 per paid ticket sold.'
  },
  {
    category: 'Payouts & Banking',
    icon: Sparkles,
    question: 'When and how do organizers receive payouts for public ticket sales?',
    answer: 'All revenue from public ticket sales is tracked in your real-time Box Office dashboard. You can request payouts directly to any Nigerian commercial bank (GTBank, Access Bank, Zenith Bank, Kuda, etc.), with automatic settlements initiated next business day.'
  },
  {
    category: 'Hardware & Setup',
    icon: Smartphone,
    question: 'Do bouncers and gate staff need special barcode scanners or equipment?',
    answer: 'No special hardware is required. Any smartphone camera (iPhone or Android) running Chrome or Safari can instantly be used as a high-speed gate scanner. For stadium-level volume, QRInvite also supports standard USB and Bluetooth 2D barcode scanners running in keyboard emulation mode.'
  }
];

const FaqSection = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faqs" className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 border-t border-[var(--border)]">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[11px] font-bold uppercase tracking-wider">
          <HelpCircle size={13} />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Everything You Need to Know
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Clear answers regarding gate cryptography, offline scanning, WhatsApp cards, and settlements.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          const Icon = faq.icon;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-indigo-500/40 bg-[var(--bg-surface)] shadow-md shadow-indigo-500/5'
                  : 'border-[var(--border)] bg-[var(--bg-surface)]/60 hover:border-[var(--border-strong)]'
              }`}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full py-4.5 px-5 sm:px-6 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : 'bg-[var(--bg-subtle)] text-[var(--text-tertiary)]'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 block mb-0.5">
                      {faq.category}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                      {faq.question}
                    </h4>
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-indigo-500/10 text-indigo-400' : 'text-[var(--text-tertiary)]'
                  }`}
                >
                  <ChevronDown size={16} />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)]/60 animate-fade-in pl-14 sm:pl-16">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Need more help banner */}
      <div className="rounded-2xl p-6 bg-[var(--bg-subtle)] border border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="font-bold text-sm text-[var(--text-primary)]">Have a custom event requirement?</h4>
          <p className="text-xs text-[var(--text-secondary)]">Our technical team can help you configure turnstiles, RFID tags, or private WhatsApp templates.</p>
        </div>
        <a
          href="https://wa.me/2348000000000?text=Hello%20QRInvite,%20I%20have%20a%20question%20about%20event%20access"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors whitespace-nowrap cursor-pointer"
        >
          <MessageCircle size={14} />
          <span>Chat with Support</span>
        </a>
      </div>

    </section>
  );
};

export default FaqSection;
