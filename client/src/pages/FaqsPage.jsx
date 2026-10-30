import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle,
  Mail, ShieldCheck, Zap, QrCode, Sparkles, ArrowRight
} from 'lucide-react';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';

const FAQ_CATEGORIES = [
  {
    name: 'Private WhatsApp Invites',
    questions: [
      {
        q: 'How does the WhatsApp JPEG Invitation Card work?',
        a: 'When you create a private event (e.g. Wedding or Gala), you can upload your guest list (names, phones, VIP tiers). The platform automatically generates a custom, high-resolution JPEG invitation card for each guest featuring their name, table number, and a unique cryptographic QR code. With one tap, you can launch WhatsApp to send the image and personal pass link directly to them.',
      },
      {
        q: 'Can guests scan their JPEG card from their phone screen?',
        a: 'Yes! Gate ushers simply point their camera scanner at the guest’s phone screen (showing the WhatsApp JPEG image or digital pass link). It verifies in under 100 milliseconds and marks them as checked in.',
      },
      {
        q: 'Is there any fee for hosting private or RSVP events?',
        a: 'None at all. Private events, weddings, family banquets, and non-ticketed gatherings are 100% free with unlimited guest passes and full gate scanner access.',
      },
      {
        q: 'Can I upload a CSV spreadsheet of my 200 wedding guests?',
        a: 'Yes. In the Guest Roster dashboard, simply paste your CSV or click "Upload CSV". The system parses your columns (Name, Phone, Email, Tier, Table, PlusOnes) and generates cryptographic passes for everyone in one click.',
      },
    ],
  },
  {
    name: 'Gate Scanner & Security',
    questions: [
      {
        q: 'How does QRInvite prevent guests from sharing screenshot passes to uninvited friends?',
        a: 'We use atomic concurrency locks and asymmetric Ed25519 digital signatures. The moment a pass is scanned at any gate, it transitions to "CHECKED_IN" with the exact timestamp and gate operator ID. If an uninvited friend tries to use a screenshot of that same pass at another gate, the screen immediately flashes RED and sounds an alarm showing: "Duplicate Entry Blocked: Already scanned at 18:14 at Gate 1".',
      },
      {
        q: 'Do I need to buy or rent special handheld scanner machines?',
        a: 'No! You can open the Gate Scanner on any modern smartphone (iPhone or Android) directly in Chrome or Safari. You can also connect standard USB handheld optical barcode guns to a laptop.',
      },
      {
        q: 'What happens if the venue loses Wi-Fi or cellular service during the event?',
        a: 'The gate scanner is an offline-first Progressive Web App (PWA). When the gate operator logs in, the public keys and guest roster snapshot are saved locally in the browser’s IndexedDB. The scanner verifies cryptographic signatures locally offline and syncs check-in logs back to the cloud as soon as network is restored.',
      },
    ],
  },
  {
    name: 'Public Ticket Sales & Payouts',
    questions: [
      {
        q: 'How do attendees pay for tickets?',
        a: 'Buyers can pay seamlessly via Nigerian Debit Cards (Mastercard, Visa, Verve), Direct Bank Transfer, or USSD. Passes are generated and delivered to their WhatsApp and Email immediately after payment.',
      },
      {
        q: 'When and how do organizers receive their ticket revenue payout?',
        a: 'Ticket earnings are available for same-day or next-day bank settlement directly to your registered Nigerian bank account (GTBank, Access, Zenith, Kuda, etc.) through the Organizer Wallet in your dashboard.',
      },
      {
        q: 'What is the fee for selling public tickets?',
        a: 'We charge a simple, transparent fee of 3.5% + ₦100 per paid ticket. Organizers can choose to absorb this fee or pass it on to ticket buyers at checkout.',
      },
    ],
  },
];

const FaqsPage = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState(0);
  const [search, setSearch] = useState('');

  const currentQuestions = FAQ_CATEGORIES[activeCategory].questions.filter(
    (item) =>
      !search ||
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200 overflow-x-hidden">
      
      <LandingNavbar />

      {/* ─── Hero ─── */}
      <section className="relative pt-12 pb-16 bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent border-b border-[var(--border)] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
            <HelpCircle size={13} /> Support & Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)] leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
            Everything you need to know about setting up public ticket sales, private WhatsApp cards, and gate scanner security.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto relative pt-2">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-indigo-500 shadow-md"
            />
          </div>
        </div>
      </section>

      {/* ─── FAQ Accordion Section ─── */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {FAQ_CATEGORIES.map((cat, idx) => (
            <button
              key={cat.name}
              onClick={() => {
                setActiveCategory(idx);
                setOpenIndex(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === idx
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Questions Accordion List */}
        <div className="space-y-3">
          {currentQuestions.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-500">
              No questions found matching "{search}".
            </div>
          ) : (
            currentQuestions.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={item.q}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg-subtle)]/50 transition-colors"
                  >
                    <span className="text-sm font-bold text-[var(--text-primary)]">
                      {item.q}
                    </span>
                    <div className="p-1.5 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-secondary)] shrink-0">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)] pt-3 animate-fade-in">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </section>

      {/* ─── Contact Banner ─── */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
            <Mail size={22} />
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            Still have questions about your event?
          </h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
            Our event technical team is available 24/7 to assist with guest list ingestion, custom invitation card branding, and gate setup.
          </p>
          <a
            href="mailto:support@qrinvite.io"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            <MessageCircle size={14} />
            <span>Chat With Our Event Operations Team</span>
          </a>
        </div>
      </section>

      <LandingFooter />

    </div>
  );
};

export default FaqsPage;
