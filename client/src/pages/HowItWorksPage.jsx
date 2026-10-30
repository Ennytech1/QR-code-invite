import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, CreditCard, QrCode, Smartphone, Sparkles,
  ArrowRight, ShieldCheck, CheckCircle2, Send, MessageCircle,
  Users, Lock, Globe, Clock, AlertTriangle, Layers
} from 'lucide-react';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200 overflow-x-hidden">
      
      <LandingNavbar />

      {/* ─── Hero ─── */}
      <section className="relative pt-12 pb-16 bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
            <Layers size={13} /> The Complete Operating Manual
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)] leading-tight">
            How QRInvite Works
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            From creating your event to dispatching personalized WhatsApp cards and scanning guests at the door with sub-second optical verification.
          </p>
        </div>
      </section>

      {/* ─── WORKFLOW A: PUBLIC TICKETED EVENTS ─── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="border-b border-[var(--border)] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
              <Globe size={11} /> WORKFLOW 01
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              Public Ticket Sales & Box Office
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              For concerts, music festivals, pool parties, campus events, and tech conferences.
            </p>
          </div>
          <Link
            to="/explore"
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>See live public events</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-glow rounded-3xl p-7 border border-[var(--border)] bg-[var(--bg-surface)] space-y-4">
            <span className="text-4xl font-black text-indigo-500/30 font-mono">01</span>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Setup Ticket Tiers</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Upload your event flyer, describe the experience, and configure ticket tiers (e.g. Early Bird ₦5k, VIP ₦25k, Table for 8 ₦200k). Set maximum capacities per tier.
            </p>
          </div>

          <div className="card-glow rounded-3xl p-7 border border-[var(--border)] bg-[var(--bg-surface)] space-y-4">
            <span className="text-4xl font-black text-indigo-500/30 font-mono">02</span>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Share Link & Sell</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Share your event checkout link on WhatsApp, Instagram & X. Attendees buy smoothly via Card or Bank Transfer and receive instant cryptographically signed QR passes.
            </p>
          </div>

          <div className="card-glow rounded-3xl p-7 border border-[var(--border)] bg-[var(--bg-surface)] space-y-4">
            <span className="text-4xl font-black text-indigo-500/30 font-mono">03</span>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Track Revenue & Payouts</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Monitor live ticket sales, gate arrival velocity, and gross revenue in your Organizer Dashboard. Initiate same-day bank settlements to any Nigerian bank.
            </p>
          </div>
        </div>
      </section>

      {/* ─── WORKFLOW B: PRIVATE VIP INVITATIONS & WHATSAPP CARDS ─── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 border-t border-[var(--border)] bg-amber-500/[0.01]">
        <div className="border-b border-[var(--border)] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
              <Sparkles size={11} /> WORKFLOW 02
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              Private Guest Lists & WhatsApp Invitation Cards
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              For weddings, private dinners, high-society galas, executive birthdays, and VIP retreats.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Launch card designer in Dashboard</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-glow rounded-3xl p-7 border border-amber-500/20 bg-[var(--bg-surface)] space-y-4">
            <span className="text-4xl font-black text-amber-500/30 font-mono">01</span>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Upload Guest Roster</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Add your guest list individually or paste a bulk CSV spreadsheet (e.g. 100+ guests). Assign access tiers (High Table, VVIP, Family VIP) and table numbers.
            </p>
          </div>

          <div className="card-glow rounded-3xl p-7 border border-amber-500/20 bg-[var(--bg-surface)] space-y-4">
            <span className="text-4xl font-black text-amber-500/30 font-mono">02</span>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Design Custom JPEG Cards</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Choose from luxury card styles: Royal Gold & Black, Midnight VIP, Emerald Prestige, or Minimalist Ivory. Cards automatically embed the guest's name, seat, and personal QR pass.
            </p>
          </div>

          <div className="card-glow rounded-3xl p-7 border border-amber-500/20 bg-[var(--bg-surface)] space-y-4">
            <span className="text-4xl font-black text-amber-500/30 font-mono">03</span>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">1-Click WhatsApp Dispatch</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Send directly to each guest's WhatsApp with a personalized invitation message. Guests simply save the JPEG card or present it on their phone screen at the gate entrance!
            </p>
          </div>
        </div>
      </section>

      {/* ─── WORKFLOW C: GATE SCANNER & ACCESS CONTROL ─── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 border-t border-[var(--border)]">
        <div className="border-b border-[var(--border)] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              <ShieldCheck size={11} /> WORKFLOW 03
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              Entrance Gate Verification & Anti-Fraud
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              For event bouncers, protocol officers, gate ushers, and venue security staff.
            </p>
          </div>
          <Link
            to="/gate-tech"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Learn about the cryptographic engine</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-glow rounded-3xl p-7 border border-emerald-500/20 bg-[var(--bg-surface)] space-y-4">
            <span className="text-4xl font-black text-emerald-500/30 font-mono">01</span>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Open Scanner on Any Phone</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              No expensive scanner hardware needed. Open the Gate Scanner URL in any mobile browser (Safari/Chrome). The optical camera sensor activates immediately.
            </p>
          </div>

          <div className="card-glow rounded-3xl p-7 border border-emerald-500/20 bg-[var(--bg-surface)] space-y-4">
            <span className="text-4xl font-black text-emerald-500/30 font-mono">02</span>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Sub-100ms Instant Check-in</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Guest presents the JPEG card on WhatsApp or printed pass. Scanner reads the QR code in under 100ms. Displays green screen, sounds entrance chime, and displays table/seat assignment.
            </p>
          </div>

          <div className="card-glow rounded-3xl p-7 border border-emerald-500/20 bg-[var(--bg-surface)] space-y-4">
            <span className="text-4xl font-black text-emerald-500/30 font-mono">03</span>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Zero Double-Spend Mutex</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              If an attendee takes a screenshot and sends it to uninvited friends, any subsequent scan immediately flashes RED and alerts: *"Already checked in at 18:14 at Gate North!"*.
            </p>
          </div>
        </div>
      </section>

      {/* ─── COMPARISON TABLE: QRINVITE VS TRADITIONAL ─── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 border-t border-[var(--border)]">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black text-[var(--text-primary)]">
            How QRInvite Solves Traditional Event Chaos
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            See the difference between old manual checklists and our modern cryptographic pass platform.
          </p>
        </div>

        <div className="border border-[var(--border)] rounded-3xl overflow-hidden bg-[var(--bg-surface)] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border)] bg-[var(--bg-subtle)]/70 text-[var(--text-tertiary)] uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-4 px-5">Event Challenge</th>
                  <th className="py-4 px-5 text-red-400">Traditional Event Method</th>
                  <th className="py-4 px-5 text-emerald-400">QRInvite Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                <tr>
                  <td className="py-4 px-5 font-bold text-[var(--text-primary)]">Gate Check-in Speed</td>
                  <td className="py-4 px-5 text-[var(--text-secondary)]">20–45s per guest searching printed paper lists</td>
                  <td className="py-4 px-5 text-emerald-400 font-semibold">&lt;100ms instant optical camera scan</td>
                </tr>
                <tr>
                  <td className="py-4 px-5 font-bold text-[var(--text-primary)]">Screenshot Fraud</td>
                  <td className="py-4 px-5 text-[var(--text-secondary)]">Anyone can screenshot and share PDF or paper passes</td>
                  <td className="py-4 px-5 text-emerald-400 font-semibold">Atomic lock: second scan triggers instant duplicate alert</td>
                </tr>
                <tr>
                  <td className="py-4 px-5 font-bold text-[var(--text-primary)]">VIP Invitation Cards</td>
                  <td className="py-4 px-5 text-[var(--text-secondary)]">Expensive printed cards delivered days late</td>
                  <td className="py-4 px-5 text-emerald-400 font-semibold">Personalized JPEG cards delivered in 1-click on WhatsApp</td>
                </tr>
                <tr>
                  <td className="py-4 px-5 font-bold text-[var(--text-primary)]">Venue Network Outages</td>
                  <td className="py-4 px-5 text-[var(--text-secondary)]">Cloud-only scanners freeze when Wi-Fi drops</td>
                  <td className="py-4 px-5 text-emerald-400 font-semibold">Offline PWA queue: scans locally, syncs when reconnected</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-5">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            Ready to upgrade your next event?
          </h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
            Set up an event in 2 minutes. Publish public tickets or design luxury private WhatsApp invites.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/dashboard"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
            >
              Get Started in Dashboard
            </Link>
            <Link
              to="/gate-tech"
              className="px-6 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-white font-bold text-xs"
            >
              See Scanner Demo
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />

    </div>
  );
};

export default HowItWorksPage;
