import React, { useState } from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';
import HeroSection from '../components/landing/HeroSection';
import MarqueeReelSection from '../components/landing/MarqueeReelSection';
import TwoEnginesSection from '../components/landing/TwoEnginesSection';
import ComparisonSection from '../components/landing/ComparisonSection';
import TrendingEventsSection from '../components/landing/TrendingEventsSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FaqSection from '../components/landing/FaqSection';
import CtaBannerSection from '../components/landing/CtaBannerSection';

import BuyTicketModal from '../components/modals/BuyTicketModal';
import InvitationCardModal from '../components/modals/InvitationCardModal';

const HomePage = () => {
  // Ticket checkout & pass issuance modal states
  const [selectedEventForBuy, setSelectedEventForBuy] = useState(null);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [issuedGuest, setIssuedGuest] = useState(null);
  const [cardModalOpen, setCardModalOpen] = useState(false);

  const handleOpenBuy = (evt) => {
    setSelectedEventForBuy(evt);
    setBuyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* ─── Premium Sticky Navbar ─── */}
      <LandingNavbar />

      {/* ─── Hero Section with Cinematic Background Slideshow ─── */}
      <HeroSection />

      {/* ─── Event Energy Marquee Reel ─── */}
      <MarqueeReelSection />

      {/* ─── The Two Core Engines Architectural Breakdown ─── */}
      <TwoEnginesSection />

      {/* ─── Comparison Matrix: Traditional vs QRInvite ─── */}
      <ComparisonSection />

      {/* ─── Trending Public Events Discovery Feed ─── */}
      <TrendingEventsSection onBuyTicket={handleOpenBuy} />

      {/* ─── Testimonials & Trusted Organizers ─── */}
      <TestimonialsSection />

      {/* ─── Interactive FAQ Accordion ─── */}
      <FaqSection />

      {/* ─── Closing Call To Action Banner ─── */}
      <CtaBannerSection />

      {/* ─── Footer ─── */}
      <LandingFooter />

      {/* ─── Interactive Modals ─── */}
      <BuyTicketModal
        isOpen={buyModalOpen}
        onClose={() => {
          setBuyModalOpen(false);
          setSelectedEventForBuy(null);
        }}
        event={selectedEventForBuy}
        onTicketPurchased={(guest, evt) => {
          setIssuedGuest(guest);
          setSelectedEventForBuy(evt);
          setCardModalOpen(true);
        }}
      />

      <InvitationCardModal
        isOpen={cardModalOpen}
        onClose={() => {
          setCardModalOpen(false);
          setIssuedGuest(null);
        }}
        guest={issuedGuest}
        event={selectedEventForBuy}
      />
    </div>
  );
};

export default HomePage;
