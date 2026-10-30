import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { EventProvider } from './context/EventContext';

// Public Marketing & Event Discovery Pages
import HomePage from './pages/HomePage';
import ExploreEventsPage from './pages/ExploreEventsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import GateTechPage from './pages/GateTechPage';
import PricingPage from './pages/PricingPage';
import FaqsPage from './pages/FaqsPage';
import PublicPassPage from './pages/PublicPassPage';
import NotFoundPage from './pages/NotFoundPage';

// Organizer Portal Pages
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EventsPage from './pages/EventsPage';
import GuestsPage from './pages/GuestsPage';
import ScannerPage from './pages/ScannerPage';
import LiveGatesPage from './pages/LiveGatesPage';
import WalletPage from './pages/WalletPage';
import SettingsPage from './pages/SettingsPage';

// Modals
import NewEventModal from './components/modals/NewEventModal';
import ScannerModal from './components/modals/ScannerModal';

const AppLayout = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);

  // Check if current route is a public marketing/discovery page or public pass presentation
  const publicRoutes = ['/', '/explore', '/how-it-works', '/gate-tech', '/pricing', '/faqs', '/pass/:id'];
  const isPublicRoute =
    publicRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/pass/') ||
    location.pathname.startsWith('/ticket/');

  return (
    <>
      {isPublicRoute ? (
        // Public Experience (Clean Landing, Explore, Guides & Docs, Public Pass)
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExploreEventsPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/gate-tech" element={<GateTechPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faqs" element={<FaqsPage />} />
          <Route path="/pass/:id" element={<PublicPassPage />} />
          <Route path="/pass/:token" element={<PublicPassPage />} />
          <Route path="/ticket/:id" element={<PublicPassPage />} />
          <Route path="/ticket/:token" element={<PublicPassPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        // Organizer Portal Shell
        <div className={`flex min-h-screen ${isDark ? 'dark' : ''} bg-[var(--bg-base)]`}>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Navbar
              onOpenNewEvent={() => setNewEventOpen(true)}
              onOpenScanner={() => setScannerModalOpen(true)}
            />
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 md:py-8 max-w-7xl w-full mx-auto">
              <Routes>
                <Route path="/dashboard" element={<Home onOpenNewEvent={() => setNewEventOpen(true)} onOpenScanner={() => setScannerModalOpen(true)} />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:eventId" element={<EventsPage />} />
                <Route path="/guests" element={<GuestsPage />} />
                <Route path="/scanner" element={<ScannerPage />} />
                <Route path="/live" element={<LiveGatesPage />} />
                <Route path="/gates" element={<LiveGatesPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>

          {/* Global Modals triggered from Top Navbar in Organizer Portal */}
          <NewEventModal
            isOpen={newEventOpen}
            onClose={() => setNewEventOpen(false)}
          />
          <ScannerModal
            isOpen={scannerModalOpen}
            onClose={() => setScannerModalOpen(false)}
          />
        </div>
      )}

      {/* Global Toaster for instant feedback */}
      <Toaster
        position="bottom-right"
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: '10px',
            backdropFilter: 'blur(20px)',
            padding: '10px 14px',
          },
          success: { iconTheme: { primary: '#34d399', secondary: 'white' } },
          error: { iconTheme: { primary: '#f87171', secondary: 'white' } },
        }}
      />
    </>
  );
};

const App = () => (
  <ThemeProvider>
    <EventProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </EventProvider>
  </ThemeProvider>
);

export default App;
