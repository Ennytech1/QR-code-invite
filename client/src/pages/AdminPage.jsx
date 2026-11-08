import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

// Dedicated Admin Layout & Sub-Components
import AdminLayout from '../components/layout/AdminLayout';
import AdminHeader from './admin/AdminHeader';
import PlatformPulseTab from './admin/PlatformPulseTab';
import UsersAccountsTab from './admin/UsersAccountsTab';
import EventsModerationTab from './admin/EventsModerationTab';
import TicketsVaultTab from './admin/TicketsVaultTab';
import GateFleetTab from './admin/GateFleetTab';
import TreasuryPayoutsTab from './admin/TreasuryPayoutsTab';
import CryptographicMeshTab from './admin/CryptographicMeshTab';
import SystemHealthTab from './admin/SystemHealthTab';
import PayoutApprovalModal from './admin/PayoutApprovalModal';

const ADMIN_API = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/admin` 
  : 'http://localhost:5000/api/admin';

const AdminPage = () => {
  const { user, loginAsDemo } = useAuth();

  // Active admin section
  const [activeSection, setActiveSection] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Platform Metrics
  const [metrics, setMetrics] = useState({
    totalGrossVolume: 12750000,
    platformEarnings: 191250,
    platformFeeRate: '1.5%',
    escrowReserve: 8208750,
    pendingPayoutsCount: 2,
    pendingPayoutTotal: 3600000,
    totalUsers: 142,
    totalOrganizers: 38,
    totalScanners: 64,
    totalEvents: 26,
    activeEvents: 9,
    totalPassesIssued: 3420,
    totalPassesCheckedIn: 2180,
    turnstileReplayBlocked: 47,
    turnstileSuccessRate: '97.89%',
    cryptographicHealth: {
      algorithm: 'Ed25519 (RFC 8032)',
      keyPairStatus: 'OPERATIONAL',
      turnstileLatency: '< 18ms',
      webSocketHub: 'ONLINE (RFC 6455)',
    }
  });

  // Users & Organizers list
  const [usersList, setUsersList] = useState([
    {
      _id: 'usr_chief_kelechi',
      name: 'Chief Kelechi Okafor',
      email: 'kelechi@qrinvite.io',
      role: 'admin',
      subscriptionTier: 'enterprise',
      status: 'ACTIVE',
      eventsHosted: 6,
      grossVolume: 4500000,
      createdAt: '2026-01-15T10:00:00Z',
    },
    {
      _id: 'usr_sarah_jenkins',
      name: 'Sarah Jenkins',
      email: 'sarah.j@foundersgala.com',
      role: 'organizer',
      subscriptionTier: 'pro',
      status: 'ACTIVE',
      eventsHosted: 3,
      grossVolume: 2400000,
      createdAt: '2026-03-22T14:30:00Z',
    },
    {
      _id: 'usr_babatunde_adewale',
      name: 'Babatunde Adewale',
      email: 'ade@charityball.org',
      role: 'organizer',
      subscriptionTier: 'pro',
      status: 'ACTIVE',
      eventsHosted: 4,
      grossVolume: 3500000,
      createdAt: '2026-02-10T09:15:00Z',
    },
    {
      _id: 'usr_gate_usher_1',
      name: 'Eko Gate Security #1',
      email: 'usher1@eko-hotel.com',
      role: 'scanner_operator',
      subscriptionTier: 'free',
      status: 'ACTIVE',
      eventsHosted: 0,
      scansProcessed: 890,
      createdAt: '2026-05-18T16:45:00Z',
    },
    {
      _id: 'usr_gate_usher_2',
      name: 'Gate Turnstile #4 Officer',
      email: 'gate4@landmarklagos.com',
      role: 'scanner_operator',
      subscriptionTier: 'free',
      status: 'ACTIVE',
      eventsHosted: 0,
      scansProcessed: 642,
      createdAt: '2026-06-01T11:20:00Z',
    },
    {
      _id: 'usr_suspect_organizer',
      name: 'Suspicious Tickets LLC',
      email: 'suspicious@unknown.net',
      role: 'organizer',
      subscriptionTier: 'free',
      status: 'SUSPENDED',
      eventsHosted: 1,
      grossVolume: 0,
      createdAt: '2026-10-02T19:00:00Z',
    }
  ]);

  // Events list
  const [eventsList, setEventsList] = useState([
    {
      _id: 'evt_tech_summit_2026',
      name: 'Lagos Tech Summit 2026',
      type: 'PUBLIC',
      category: 'Technology',
      venue: 'Landmark Centre, Victoria Island, Lagos',
      date: '2026-11-20',
      capacity: 1200,
      issued: 840,
      checkedIn: 612,
      status: 'ACTIVE',
      isFeatured: true,
      isFrozen: false,
      hostName: 'Chief Kelechi Okafor',
      grossRevenue: 4500000,
      createdAt: '2026-10-01T10:00:00Z',
    },
    {
      _id: 'evt_founders_gala',
      name: 'Private Founders VIP Gala',
      type: 'PRIVATE',
      category: 'VIP Gala',
      venue: 'The Sky Restaurant, Eko Hotel & Suites',
      date: '2026-11-25',
      capacity: 150,
      issued: 142,
      checkedIn: 98,
      status: 'ACTIVE',
      isFeatured: false,
      isFrozen: false,
      hostName: 'Sarah Jenkins',
      grossRevenue: 2400000,
      createdAt: '2026-10-08T15:20:00Z',
    },
    {
      _id: 'evt_charity_ball',
      name: 'Annual Charity Ball 2026',
      type: 'PUBLIC',
      category: 'Charity',
      venue: 'Eko Convention Centre, Lagos',
      date: '2026-12-05',
      capacity: 800,
      issued: 520,
      checkedIn: 0,
      status: 'UPCOMING',
      isFeatured: true,
      isFrozen: false,
      hostName: 'Babatunde Adewale',
      grossRevenue: 3500000,
      createdAt: '2026-10-12T11:00:00Z',
    },
    {
      _id: 'evt_afro_jazz',
      name: 'Acoustic Afro-Jazz Sunset',
      type: 'PUBLIC',
      category: 'Concert',
      venue: 'Tarkwa Bay Beachfront Pavilion',
      date: '2026-11-30',
      capacity: 350,
      issued: 280,
      checkedIn: 0,
      status: 'ACTIVE',
      isFeatured: false,
      isFrozen: false,
      hostName: 'Dr. Amara Nwosu',
      grossRevenue: 850000,
      createdAt: '2026-10-14T17:30:00Z',
    },
    {
      _id: 'evt_flagged_scam',
      name: 'Unverified VIP Investment Summit',
      type: 'PUBLIC',
      category: 'Crypto & Forex',
      venue: 'Secret Hotel Suite, Ikeja',
      date: '2026-11-18',
      capacity: 100,
      issued: 12,
      checkedIn: 0,
      status: 'ACTIVE',
      isFeatured: false,
      isFrozen: true,
      freezeReason: 'Suspicious activities reported: Unverified organizer identity and fake gate turnstiles.',
      hostName: 'Suspicious Tickets LLC',
      grossRevenue: 150000,
      createdAt: '2026-10-25T14:10:00Z',
    }
  ]);

  // Payouts list
  const [payoutsList, setPayoutsList] = useState([
    {
      id: 'PO_90412',
      organizerId: 'usr_chief_kelechi',
      organizerName: 'Chief Kelechi Okafor',
      organizerEmail: 'kelechi@qrinvite.io',
      eventTitle: 'Lagos Tech Summit 2026',
      bankName: 'Access Bank Nigeria',
      accountNumber: '0124892110',
      accountName: 'Kelechi Okafor & Associates Ltd',
      amount: 1200000,
      feeDeducted: 18000,
      netAmount: 1182000,
      currency: 'NGN',
      status: 'PENDING_APPROVAL',
      requestedAt: '4 hours ago',
      channel: 'NIBSS Instant Payment',
    },
    {
      id: 'PO_90413',
      organizerId: 'usr_sarah_jenkins',
      organizerName: 'Sarah Jenkins',
      organizerEmail: 'sarah.j@foundersgala.com',
      eventTitle: 'Private Founders VIP Gala',
      bankName: 'Guaranty Trust Bank (GTBank)',
      accountNumber: '0249811902',
      accountName: 'Founders Collective International',
      amount: 2400000,
      feeDeducted: 36000,
      netAmount: 2364000,
      currency: 'NGN',
      status: 'PENDING_APPROVAL',
      requestedAt: '12 hours ago',
      channel: 'NIBSS Instant Payment',
    },
    {
      id: 'PO_90410',
      organizerId: 'usr_babatunde_adewale',
      organizerName: 'Babatunde Adewale',
      organizerEmail: 'ade@charityball.org',
      eventTitle: 'Annual Charity Ball 2026',
      bankName: 'Zenith Bank Plc',
      accountNumber: '2009182341',
      accountName: 'Adewale Foundation Escrow',
      amount: 3500000,
      feeDeducted: 52500,
      netAmount: 3447500,
      currency: 'NGN',
      status: 'APPROVED',
      requestedAt: '2 days ago',
      approvedAt: 'Yesterday',
      approvedBy: 'Admin Treasury Dispatcher',
      reference: 'NIP_SETTLE_ZEN_981290481',
      channel: 'NIBSS Instant Payment',
    },
    {
      id: 'PO_90409',
      organizerId: 'usr_amara_nwosu',
      organizerName: 'Dr. Amara Nwosu',
      organizerEmail: 'amara@soundofflagos.live',
      eventTitle: 'Acoustic Afro-Jazz Sunset',
      bankName: 'First Bank of Nigeria',
      accountNumber: '3091820491',
      accountName: 'Nwosu Acoustic Productions',
      amount: 850000,
      feeDeducted: 12750,
      netAmount: 837250,
      currency: 'NGN',
      status: 'APPROVED',
      requestedAt: '5 days ago',
      approvedAt: '4 days ago',
      approvedBy: 'Admin Treasury Dispatcher',
      reference: 'NIP_SETTLE_FBN_491028301',
      channel: 'NIBSS Instant Payment',
    }
  ]);

  // Security Audit Logs
  const [securityLogs, setSecurityLogs] = useState([
    {
      id: 'SEC_LOG_101',
      result: 'DUPLICATE',
      ticketToken: 'TKT_e381a9f0b2',
      guestName: 'Chinedu Eze (Attempted Replay)',
      gateName: 'Gate 2 - VIP Turnstile North',
      scannerDeviceId: 'scanner_terminal_ipad_4',
      reason: 'Duplicate QR presentation detected: Pass was already checked in 4 minutes ago at Gate 1.',
      scannedAt: '2 mins ago',
      severity: 'HIGH_INTERCEPT',
    },
    {
      id: 'SEC_LOG_102',
      result: 'FORGED',
      ticketToken: 'TKT_bad_sig_4821',
      guestName: 'Unknown Attendee (Tampered Pass)',
      gateName: 'Gate 1 - Main Entrance',
      scannerDeviceId: 'scanner_terminal_android_1',
      reason: 'Ed25519 signature mismatch: Cryptographic payload was altered or forged with invalid private key.',
      scannedAt: '14 mins ago',
      severity: 'CRITICAL_SECURITY',
    },
    {
      id: 'SEC_LOG_103',
      result: 'REVOKED',
      ticketToken: 'TKT_revoked_8819',
      guestName: 'Lateef Sanusi (Disputed Chargeback)',
      gateName: 'Gate 3 - Vendor Ingress',
      scannerDeviceId: 'scanner_terminal_handheld_2',
      reason: 'Ticket was revoked due to payment dispute on Paystack.',
      scannedAt: '1 hour ago',
      severity: 'MEDIUM_INTERCEPT',
    },
    {
      id: 'SEC_LOG_104',
      result: 'DUPLICATE',
      ticketToken: 'TKT_photo_screenshot_99',
      guestName: 'Olumide Jacobs (Screenshot Share)',
      gateName: 'Gate 1 - Main Entrance',
      scannerDeviceId: 'scanner_terminal_android_1',
      reason: 'Duplicate pass scanned: Initial guest already admitted to Event Hall.',
      scannedAt: '2 hours ago',
      severity: 'HIGH_INTERCEPT',
    }
  ]);

  // Modal State
  const [payoutModal, setPayoutModal] = useState(null);
  const [payoutActionLoading, setPayoutActionLoading] = useState(false);

  // Synchronize backend admin data
  const fetchAdminData = async () => {
    try {
      setRefreshing(true);
      const token = user?.token;
      const headers = {
        Authorization: `Bearer ${token}`,
        'x-admin-demo': 'true'
      };

      const [resMetrics, resUsers, resEvents, resPayouts, resSec] = await Promise.allSettled([
        axios.get(`${ADMIN_API}/metrics`, { headers, timeout: 3000 }),
        axios.get(`${ADMIN_API}/users`, { headers, timeout: 3000 }),
        axios.get(`${ADMIN_API}/events`, { headers, timeout: 3000 }),
        axios.get(`${ADMIN_API}/payouts`, { headers, timeout: 3000 }),
        axios.get(`${ADMIN_API}/security-audit`, { headers, timeout: 3000 }),
      ]);

      if (resMetrics.status === 'fulfilled' && resMetrics.value.data?.data?.overview) {
        setMetrics(resMetrics.value.data.data.overview);
      }
      if (resUsers.status === 'fulfilled' && resUsers.value.data?.data) {
        setUsersList(resUsers.value.data.data);
      }
      if (resEvents.status === 'fulfilled' && resEvents.value.data?.data) {
        setEventsList(resEvents.value.data.data);
      }
      if (resPayouts.status === 'fulfilled' && resPayouts.value.data?.data) {
        setPayoutsList(resPayouts.value.data.data);
      }
      if (resSec.status === 'fulfilled' && resSec.value.data?.data) {
        setSecurityLogs(resSec.value.data.data);
      }
      toast.success('Admin telemetry synchronized with platform ledger');
    } catch (err) {
      console.warn('Backend sync note: operating with active in-memory admin store', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Handlers for User Actions
  const handleToggleUserStatus = (userId) => {
    setUsersList(prev => prev.map(u => {
      if (u._id === userId) {
        const nextStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        toast.success(`Account ${u.name} is now ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleToggleUserRole = (userId) => {
    setUsersList(prev => prev.map(u => {
      if (u._id === userId) {
        const nextRole = u.role === 'admin' ? 'organizer' : 'admin';
        toast.success(`User role updated to ${nextRole.toUpperCase()}`);
        return { ...u, role: nextRole };
      }
      return u;
    }));
  };

  // Handlers for Event Moderation
  const handleToggleFeatured = (eventId) => {
    setEventsList(prev => prev.map(e => {
      if (e._id === eventId) {
        const nextFeatured = !e.isFeatured;
        toast.success(nextFeatured ? 'Event featured on Public Box Office!' : 'Event removed from featured section.');
        return { ...e, isFeatured: nextFeatured };
      }
      return e;
    }));
  };

  const handleToggleFreeze = (eventId) => {
    setEventsList(prev => prev.map(e => {
      if (e._id === eventId) {
        const nextFrozen = !e.isFrozen;
        if (nextFrozen) {
          toast.error('EVENT FROZEN! Turnstile verification halted.', { icon: '🔒' });
        } else {
          toast.success('Event un-frozen. Gate access resumed.', { icon: '🔓' });
        }
        return { ...e, isFrozen: nextFrozen };
      }
      return e;
    }));
  };

  // Payout Approval Execution
  const handleExecutePayoutAction = (action) => {
    if (!payoutModal) return;
    setPayoutActionLoading(true);

    setTimeout(() => {
      if (action === 'APPROVE') {
        const ref = `NIP_SETTLE_${Date.now()}_${Math.floor(Math.random() * 90000 + 10000)}`;
        setPayoutsList(prev => prev.map(p => {
          if (p.id === payoutModal.id) {
            return {
              ...p,
              status: 'APPROVED',
              approvedAt: 'Just now',
              approvedBy: user?.name || 'Super Admin',
              reference: ref
            };
          }
          return p;
        }));
        setMetrics(m => ({
          ...m,
          pendingPayoutsCount: Math.max(0, m.pendingPayoutsCount - 1),
          pendingPayoutTotal: Math.max(0, m.pendingPayoutTotal - payoutModal.amount),
        }));
        toast.success(`Payout Approved! Instant NIP reference: ${ref}`, { duration: 4500 });
      } else {
        setPayoutsList(prev => prev.map(p => {
          if (p.id === payoutModal.id) {
            return {
              ...p,
              status: 'REJECTED',
              rejectedReason: 'Discrepancy in event ticket revenue ledger'
            };
          }
          return p;
        }));
        toast.error(`Payout request ${payoutModal.id} placed on hold / rejected.`);
      }

      setPayoutActionLoading(false);
      setPayoutModal(null);
    }, 600);
  };

  return (
    <AdminLayout
      activeSection={activeSection}
      onSelectSection={setActiveSection}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      onSync={fetchAdminData}
      refreshing={refreshing}
    >
      <div className="space-y-8 pb-16">
        
        {/* Top Banner Header */}
        <AdminHeader
          user={user}
          loginAsDemo={loginAsDemo}
          refreshing={refreshing}
          onSync={fetchAdminData}
        />

        {/* Section Viewport based on active AdminSidebar selection */}
        {activeSection === 'overview' && (
          <PlatformPulseTab
            metrics={metrics}
            onSwitchTab={setActiveSection}
          />
        )}

        {activeSection === 'users' && (
          <UsersAccountsTab
            users={usersList}
            onToggleStatus={handleToggleUserStatus}
            onToggleRole={handleToggleUserRole}
          />
        )}

        {activeSection === 'events' && (
          <EventsModerationTab
            events={eventsList}
            onToggleFeatured={handleToggleFeatured}
            onToggleFreeze={handleToggleFreeze}
          />
        )}

        {activeSection === 'tickets' && (
          <TicketsVaultTab />
        )}

        {activeSection === 'gates' && (
          <GateFleetTab />
        )}

        {activeSection === 'security' && (
          <CryptographicMeshTab
            securityLogs={securityLogs}
          />
        )}

        {activeSection === 'payouts' && (
          <TreasuryPayoutsTab
            metrics={metrics}
            payouts={payoutsList}
            onOpenPayoutModal={setPayoutModal}
          />
        )}

        {activeSection === 'system' && (
          <SystemHealthTab />
        )}

        {/* Payout Approval Modal */}
        <PayoutApprovalModal
          payout={payoutModal}
          loading={payoutActionLoading}
          onClose={() => setPayoutModal(null)}
          onAction={handleExecutePayoutAction}
        />

      </div>
    </AdminLayout>
  );
};

export default AdminPage;
