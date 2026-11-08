import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEvents } from '../context/EventContext';

// Modular Dashboard Sections
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardKpiCards from '../components/dashboard/DashboardKpiCards';
import CampaignsListSection from '../components/dashboard/CampaignsListSection';
import GateScannerMeshSection from '../components/dashboard/GateScannerMeshSection';
import RealtimeGateFeedSection from '../components/dashboard/RealtimeGateFeedSection';
import OrganizerQuickActions from '../components/dashboard/OrganizerQuickActions';
import WithdrawModal from '../components/dashboard/WithdrawModal';

// Modals
import NewEventModal from '../components/modals/NewEventModal';
import ScannerModal from '../components/modals/ScannerModal';
import BulkGuestModal from '../components/modals/BulkGuestModal';
import InvitationCardModal from '../components/modals/InvitationCardModal';

const Home = ({ onOpenNewEvent, onOpenScanner }) => {
  const navigate = useNavigate();
  const {
    events,
    guests,
    activeEventId,
    setActiveEventId,
  } = useEvents();

  // Local filtering & currency state
  const [currency, setCurrency] = useState('NGN');
  const [campaignTab, setCampaignTab] = useState('ALL'); // 'ALL', 'PUBLIC', 'PRIVATE'
  const [copiedId, setCopiedId] = useState(null);

  // Modals state
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [viewPassGuest, setViewPassGuest] = useState(null);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  // Filtered campaigns
  const displayEvents = useMemo(() => {
    if (campaignTab === 'PUBLIC') return events.filter((e) => e.type === 'PUBLIC');
    if (campaignTab === 'PRIVATE') return events.filter((e) => e.type === 'PRIVATE');
    return events;
  }, [events, campaignTab]);

  // Aggregated KPIs across events
  const totalRevenue = useMemo(
    () => events.reduce((sum, e) => sum + (e.revenue || 0), 0),
    [events]
  );
  const totalCapacity = useMemo(
    () => events.reduce((sum, e) => sum + (e.capacity || 0), 0),
    [events]
  );
  const totalIssued = useMemo(() => {
    return guests.length + events.reduce((sum, e) => sum + (e.issued || 0), 0);
  }, [guests, events]);

  const totalCheckedIn = useMemo(() => {
    const fromGuests = guests.filter((g) => g.status === 'CHECKED_IN').length;
    const fromEvents = events.reduce((sum, e) => sum + (e.checkedIn || 0), 0);
    return fromGuests + fromEvents;
  }, [guests, events]);

  const publicTicketsCount = useMemo(() => {
    return events
      .filter((e) => e.type === 'PUBLIC')
      .reduce((sum, e) => sum + (e.issued || 0), 0);
  }, [events]);

  const privateInvitesCount = useMemo(() => {
    return (
      guests.length +
      events
        .filter((e) => e.type === 'PRIVATE')
        .reduce((sum, e) => sum + (e.issued || 0), 0)
    );
  }, [guests, events]);

  const settlementBalance = Math.round(totalRevenue * 0.95);

  // Active event for card preview
  const activeEventForPass = useMemo(() => {
    if (viewPassGuest) {
      return events.find((e) => e.id === viewPassGuest.eventId) || events[0];
    }
    return events.find((e) => e.id === activeEventId) || events[0];
  }, [viewPassGuest, events, activeEventId]);

  // Action handlers
  const handleCopyLink = (evt) => {
    const url = `${window.location.origin}/explore?event=${evt.id}`;
    navigator.clipboard?.writeText(url);
    setCopiedId(evt.id);
    toast.success(`Public Box Office link copied for "${evt.name}"!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Tier',
      'Table',
      'Status',
      'Event ID',
      'CheckIn Time',
    ];
    const rows = guests.map((g) => [
      g.id,
      `"${g.name}"`,
      g.email,
      g.phone || '',
      `"${g.tier}"`,
      `"${g.table || ''}"`,
      g.status,
      g.eventId,
      g.checkInTime || '',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `qrinvite_attendees_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Attendee roster exported as CSV!');
  };

  // Live simulated check-in stream
  const liveCheckinStream = useMemo(() => {
    const checked = guests.filter((g) => g.status === 'CHECKED_IN');
    if (checked.length > 0) {
      return checked.slice(0, 4).map((g, idx) => ({
        id: g.id,
        name: g.name,
        tier: g.tier,
        gate: g.gate || 'Gate North [VIP]',
        time:
          idx === 0
            ? '24s ago'
            : idx === 1
            ? '1m ago'
            : idx === 2
            ? '3m ago'
            : '5m ago',
        isDuplicateBlocked: false,
      }));
    }
    return [
      {
        id: 'sim_1',
        name: 'Alhaji Aliko Dangote',
        tier: 'Dignitary High Table',
        gate: 'Gate North [VIP]',
        time: '42s ago',
        isDuplicateBlocked: false,
      },
      {
        id: 'sim_2',
        name: 'Ngozi Okonjo-Iweala',
        tier: 'Speaker VIP',
        gate: 'Gate West #1',
        time: '1m ago',
        isDuplicateBlocked: false,
      },
      {
        id: 'sim_3',
        name: 'Screenshot Duplicate',
        tier: 'Replay Attempt #8892',
        gate: 'Gate North #2',
        time: '2m ago',
        isDuplicateBlocked: true,
      },
      {
        id: 'sim_4',
        name: 'Chidi Mokeme',
        tier: 'VIP Executive',
        gate: 'Gate North [VIP]',
        time: '4m ago',
        isDuplicateBlocked: false,
      },
    ];
  }, [guests]);

  return (
    <div className="space-y-6 pb-16 animate-fade-up">
      {/* ── Top Executive Header & Command Strip ── */}
      <DashboardHeader
        currency={currency}
        onToggleCurrency={() => setCurrency((c) => (c === 'NGN' ? 'USD' : 'NGN'))}
        onOpenScanner={() => setScannerOpen(true)}
        onOpenNewEvent={() => navigate('/events/create')}
      />

      {/* ── 4 Executive KPI Metric Cards ── */}
      <DashboardKpiCards
        currency={currency}
        totalRevenue={totalRevenue}
        settlementBalance={settlementBalance}
        totalIssued={totalIssued}
        totalCapacity={totalCapacity}
        publicTicketsCount={publicTicketsCount}
        privateInvitesCount={privateInvitesCount}
        totalCheckedIn={totalCheckedIn}
        eventsCount={events.length}
        onOpenWithdraw={() => setWithdrawModalOpen(true)}
      />

      {/* ── Balanced 2-Column Command Workspace ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── Left Area: Active Event Campaigns (7 cols) ── */}
        <div className="lg:col-span-7 space-y-6 min-w-0">
          <CampaignsListSection
            events={events}
            displayEvents={displayEvents}
            guests={guests}
            campaignTab={campaignTab}
            setCampaignTab={setCampaignTab}
            copiedId={copiedId}
            onCopyLink={handleCopyLink}
            onOpenScannerForEvent={(evtId) => {
              setActiveEventId(evtId);
              setScannerOpen(true);
            }}
            onOpenCardForEvent={(evtId, guest) => {
              setActiveEventId(evtId);
              setViewPassGuest(guest || guests[0]);
            }}
            setActiveEventId={setActiveEventId}
          />
        </div>

        {/* ── Right Rail: Gate Mesh & Live Telemetry & Quick Actions (5 cols) ── */}
        <div className="lg:col-span-5 space-y-5">
          <GateScannerMeshSection onOpenScanner={() => setScannerOpen(true)} />

          <RealtimeGateFeedSection liveCheckinStream={liveCheckinStream} />

          <OrganizerQuickActions
            onOpenCardForFirstGuest={() => setViewPassGuest(guests[0] || null)}
            onOpenBulk={() => navigate('/guests/add')}
            onExportCSV={handleExportCSV}
          />
        </div>
      </div>

      {/* ── Modals ── */}
      <NewEventModal
        isOpen={newEventOpen}
        onClose={() => setNewEventOpen(false)}
      />
      <ScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />
      <BulkGuestModal
        isOpen={bulkOpen}
        onClose={() => setBulkOpen(false)}
      />
      <InvitationCardModal
        isOpen={Boolean(viewPassGuest)}
        onClose={() => setViewPassGuest(null)}
        guest={viewPassGuest}
        event={activeEventForPass}
      />
      <WithdrawModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        balance={settlementBalance}
        currency={currency}
      />
    </div>
  );
};

export default Home;
