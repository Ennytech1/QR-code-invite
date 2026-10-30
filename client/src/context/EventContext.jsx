import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  fetchEvents,
  fetchGuests,
  createEventApi,
  createGuestApi,
  bulkAddGuestsApi,
  verifyScanApi,
} from '../services/api';

const EventContext = createContext();

const STORAGE_KEYS = {
  EVENTS: 'qrinvite_events_v2',
  GUESTS: 'qrinvite_guests_v2',
  TICKETS: 'qrinvite_tickets_v2',
  CHECKIN_LOGS: 'qrinvite_checkins_v2',
};

// Initial realistic seed events
const DEFAULT_EVENTS = [
  {
    id: 'evt_leadership_summit_2026',
    type: 'PUBLIC',
    name: 'Annual Leadership Summit 2026',
    category: 'Executive & Leadership',
    venue: 'Grand Convention Center, Hall A & B',
    date: 'Today, Oct 14',
    time: '08:30',
    banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    description: 'The premier global leadership summit bringing together executive directors, operations leaders, and innovators.',
    status: 'ACTIVE',
    capacity: 1250,
    target: 1116,
    issued: 1250,
    checkedIn: 842,
    gateVelocity: 24,
    revenue: 62500000,
    currency: 'USD',
    gatesCount: 6,
    latency: '8ms',
    ticketTiers: [
      { id: 'tier_vip', name: 'VIP Pass', price: 1500, perks: 'VIP Executive Lounge & Priority Gate 1 Fast-track' },
      { id: 'tier_del', name: 'Delegate Pass', price: 650, perks: 'All keynotes, breakout sessions & expo floor' },
      { id: 'tier_spk', name: 'Speaker', price: 0, perks: 'Speaker Greenroom, Press Briefing & Backstage' },
    ],
    publicKey: 'ed25519_pk_leadershipsummit2026_pub',
    hostName: 'Security Operations & Executive Council',
  },
  {
    id: 'evt_public_1',
    type: 'PUBLIC', // 'PUBLIC' or 'PRIVATE'
    name: 'Lagos Tech Summit 2026',
    category: 'Conference & Tech',
    venue: 'Eko Convention Centre, Victoria Island, Lagos',
    date: '2026-10-24',
    time: '09:00',
    banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    description: 'The premier gathering of African technology founders, venture capitalists, and global engineering innovators.',
    status: 'ACTIVE',
    capacity: 1250,
    issued: 842,
    checkedIn: 618,
    gateVelocity: 34,
    revenue: 14850000,
    currency: 'NGN',
    ticketTiers: [
      { id: 'tier_reg', name: 'General Delegate', price: 15000, perks: 'Access to all keynotes and expo hall' },
      { id: 'tier_vip', name: 'VIP Executive Pass', price: 50000, perks: 'VIP Lounge access, lunch, and networking dinner' },
      { id: 'tier_vvip', name: 'Investor & Speaker Pass', price: 120000, perks: 'All-access, Speaker greenroom, 1-on-1 pitch room' },
    ],
    publicKey: 'ed25519_pk_techsummit2026_pub',
    hostName: 'Future Africa Ventures',
  },
  {
    id: 'evt_private_1',
    type: 'PRIVATE',
    name: 'The Adeleke Royal Wedding & Banquet',
    category: 'Wedding & Gala',
    venue: 'The Grand Ballroom, Eko Hotel & Suites, VI',
    date: '2026-11-14',
    time: '14:00',
    banner: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
    description: 'Strictly Invitation Only. An evening of celebration, live orchestral symphony, and royal banquet.',
    status: 'ACTIVE',
    capacity: 250,
    issued: 198,
    checkedIn: 112,
    gateVelocity: 18,
    revenue: 0,
    currency: 'NGN',
    dressCode: 'Black Tie / Royal Traditional Regal',
    cardTheme: 'luxury-gold',
    customMessage: 'We request the honor of your presence to celebrate the union of Bayo & Folashade.',
    publicKey: 'ed25519_pk_adeleke_royal_pub',
    hostName: 'Adeleke & Balogun Families',
    ticketTiers: [
      { id: 'tier_vvip_table', name: 'High Table / Dignitary', price: 0, perks: 'Table 1-3 Front Row' },
      { id: 'tier_vip_fam', name: 'Family & Friends VIP', price: 0, perks: 'Reserved Table 4-15' },
      { id: 'tier_regular_inv', name: 'Honored Guest', price: 0, perks: 'General Banquet Seating' },
    ],
  },
  {
    id: 'evt_public_2',
    type: 'PUBLIC',
    name: 'Oasis Sunset Neon Pool Party',
    category: 'Nightlife & Pool Party',
    venue: 'Sol On The Beach, Landmark Beach, VI',
    date: '2026-10-31',
    time: '16:00',
    banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
    description: 'Electrifying sunset vibes, world-class Afrobeat DJs, tropical cocktails, and VIP cabanas.',
    status: 'ACTIVE',
    capacity: 600,
    issued: 480,
    checkedIn: 215,
    gateVelocity: 42,
    revenue: 7200000,
    currency: 'NGN',
    ticketTiers: [
      { id: 'pool_early', name: 'Early Bird Pass', price: 10000, perks: 'Entry before 6 PM + 1 complimentary drink' },
      { id: 'pool_vip', name: 'VIP Deck Pass', price: 25000, perks: 'VIP bar access, pool towel, fast-track entrance' },
      { id: 'pool_cabana', name: 'Private Cabana (Table for 6)', price: 250000, perks: 'Private Cabana, 2 Premium Bottles, Dedicated Waiter' },
    ],
    publicKey: 'ed25519_pk_oasissunset_pub',
    hostName: 'Vibe Tribe Lagos',
  },
  {
    id: 'evt_private_2',
    type: 'PRIVATE',
    name: 'Founders & Angels Private Dinner',
    category: 'VIP Dinner',
    venue: 'The Wings Towers, Penthouse Level, Ozumba Mbadiwe',
    date: '2026-11-20',
    time: '19:00',
    banner: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    description: 'Chatham House rule private dinner for seed and Series A founders meeting top global angels.',
    status: 'UPCOMING',
    capacity: 60,
    issued: 48,
    checkedIn: 0,
    gateVelocity: 0,
    revenue: 0,
    currency: 'NGN',
    dressCode: 'Smart Executive Elegance',
    cardTheme: 'midnight-vip',
    customMessage: 'Join us for an off-the-record evening of strategic dinner discussions.',
    publicKey: 'ed25519_pk_founders_dinner_pub',
    hostName: 'Ventures Platform',
    ticketTiers: [
      { id: 'tier_angel', name: 'Angel Investor', price: 0, perks: 'Private dining salon' },
      { id: 'tier_founder', name: 'Featured Founder', price: 0, perks: 'Spotlight demo dinner' },
    ],
  },
];

// Initial realistic guests for private & public events
const DEFAULT_GUESTS = [
  {
    id: 'gst_summit_01',
    eventId: 'evt_leadership_summit_2026',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@meridian.io',
    phone: '+1 (555) 234-5678',
    tier: 'VIP',
    table: 'VIP Executive Lounge',
    plusOnes: 0,
    status: 'CHECKED_IN',
    checkInTime: new Date(Date.now() - 15000).toISOString(),
    gate: 'Gate 1 • Main Entrance',
    dispatched: true,
    cardTheme: 'midnight-vip',
    qrToken: 'QRI_SUMMIT_SARAH_J_9821',
  },
  {
    id: 'gst_summit_02',
    eventId: 'evt_leadership_summit_2026',
    name: 'David Chen',
    email: 'd.chen@apextechnologies.com',
    phone: '+1 (555) 345-6789',
    tier: 'Delegate',
    table: 'Auditorium Hall A',
    plusOnes: 0,
    status: 'CHECKED_IN',
    checkInTime: new Date(Date.now() - 45000).toISOString(),
    gate: 'Gate 3 • West Wing',
    dispatched: true,
    cardTheme: 'midnight-vip',
    qrToken: 'QRI_SUMMIT_DAVID_C_3321',
  },
  {
    id: 'gst_summit_03',
    eventId: 'evt_leadership_summit_2026',
    name: 'Marcus Vance',
    email: 'm.vance@sentinelcapital.com',
    phone: '+1 (555) 456-7890',
    tier: 'VIP',
    table: 'VIP Executive Lounge',
    plusOnes: 1,
    status: 'CHECKED_IN',
    checkInTime: new Date(Date.now() - 120000).toISOString(),
    gate: 'Gate 1 • Main Entrance',
    dispatched: true,
    cardTheme: 'luxury-gold',
    qrToken: 'QRI_SUMMIT_MARCUS_V_7741',
  },
  {
    id: 'gst_summit_04',
    eventId: 'evt_leadership_summit_2026',
    name: 'Elena Rostova',
    email: 'elena.rostova@cybergrid.eu',
    phone: '+1 (555) 567-8901',
    tier: 'Speaker',
    table: 'Speaker Greenroom',
    plusOnes: 0,
    status: 'CHECKED_IN',
    checkInTime: new Date(Date.now() - 180000).toISOString(),
    gate: 'Gate 4 • VIP Expedited',
    dispatched: true,
    cardTheme: 'cyber-neon',
    qrToken: 'QRI_SUMMIT_ELENA_R_5129',
  },
  {
    id: 'gst_summit_05',
    eventId: 'evt_leadership_summit_2026',
    name: 'Chloe Martin',
    email: 'chloe.martin@vanguard.org',
    phone: '+1 (555) 678-9012',
    tier: 'Delegate',
    table: 'Auditorium Hall B',
    plusOnes: 0,
    status: 'CHECKED_IN',
    checkInTime: new Date(Date.now() - 300000).toISOString(),
    gate: 'Gate 2 • East Wing',
    dispatched: true,
    cardTheme: 'midnight-vip',
    qrToken: 'QRI_SUMMIT_CHLOE_M_4482',
  },
  {
    id: 'gst_summit_06',
    eventId: 'evt_leadership_summit_2026',
    name: 'Alexander Kim',
    email: 'a.kim@solaris-defense.com',
    phone: '+1 (555) 789-0123',
    tier: 'VIP',
    table: 'VIP Executive Lounge',
    plusOnes: 1,
    status: 'CHECKED_IN',
    checkInTime: new Date(Date.now() - 420000).toISOString(),
    gate: 'Gate 1 • Main Entrance',
    dispatched: true,
    cardTheme: 'luxury-gold',
    qrToken: 'QRI_SUMMIT_ALEX_K_6631',
  },
  {
    id: 'gst_101',
    eventId: 'evt_private_1',
    name: 'Chief Kelechi Okafor',
    email: 'k.okafor@venture.ng',
    phone: '+2348031112233',
    tier: 'High Table / Dignitary',
    table: 'Table 1 • High Table',
    plusOnes: 1,
    status: 'CHECKED_IN',
    checkInTime: '2026-10-23T12:15:00.000Z',
    gate: 'Gate North #1',
    dispatched: true,
    cardTheme: 'luxury-gold',
    qrToken: 'QRI_ADELEKE_GST101_KELECHI',
  },
  {
    id: 'gst_102',
    eventId: 'evt_private_1',
    name: 'Dr. Amina Yusuf',
    email: 'amina@acme.ng',
    phone: '+2348023334455',
    tier: 'Family & Friends VIP',
    table: 'Table 4 • VIP Regal',
    plusOnes: 2,
    status: 'CHECKED_IN',
    checkInTime: '2026-10-23T12:22:00.000Z',
    gate: 'VIP West #2',
    dispatched: true,
    cardTheme: 'luxury-gold',
    qrToken: 'QRI_ADELEKE_GST102_AMINA',
  },
  {
    id: 'gst_103',
    eventId: 'evt_private_1',
    name: 'Bayo Adeleke Snr.',
    email: 'bayo.snr@adeleke.com',
    phone: '+2348095556677',
    tier: 'High Table / Dignitary',
    table: 'Table 2 • Family Patriarch',
    plusOnes: 1,
    status: 'VALID',
    checkInTime: null,
    gate: null,
    dispatched: true,
    cardTheme: 'luxury-gold',
    qrToken: 'QRI_ADELEKE_GST103_BAYOSNR',
  },
  {
    id: 'gst_104',
    eventId: 'evt_private_1',
    name: 'Chinedu Eze',
    email: 'c.eze@innovate.org',
    phone: '+2348147778899',
    tier: 'Honored Guest',
    table: 'Table 8 • Friends of Bride',
    plusOnes: 0,
    status: 'VALID',
    checkInTime: null,
    gate: null,
    dispatched: false,
    cardTheme: 'luxury-gold',
    qrToken: 'QRI_ADELEKE_GST104_CHINEDU',
  },
  {
    id: 'gst_105',
    eventId: 'evt_private_1',
    name: 'Fatima Aliyu',
    email: 'f.aliyu@fintech.io',
    phone: '+2348079990011',
    tier: 'Honored Guest',
    table: 'Table 9 • Colleagues',
    plusOnes: 1,
    status: 'VALID',
    checkInTime: null,
    gate: null,
    dispatched: true,
    cardTheme: 'luxury-gold',
    qrToken: 'QRI_ADELEKE_GST105_FATIMA',
  },
  {
    id: 'gst_106',
    eventId: 'evt_public_1',
    name: 'Emeka Oduya',
    email: 'emeka@mediapulse.ng',
    phone: '+2348132223344',
    tier: 'VIP Executive Pass',
    table: 'Executive Row B',
    plusOnes: 0,
    status: 'VALID',
    checkInTime: null,
    gate: null,
    dispatched: true,
    cardTheme: 'midnight-vip',
    qrToken: 'QRI_TECH_GST106_EMEKA',
  },
  {
    id: 'gst_107',
    eventId: 'evt_public_1',
    name: 'Ngozi Nnaji',
    email: 'ngozi@nnaji-group.com',
    phone: '+2348034445566',
    tier: 'Investor & Speaker Pass',
    table: 'Speaker Greenroom',
    plusOnes: 0,
    status: 'REVOKED',
    checkInTime: null,
    gate: null,
    dispatched: true,
    cardTheme: 'cyber-neon',
    qrToken: 'QRI_TECH_GST107_NGOZI',
  },
  {
    id: 'gst_108',
    eventId: 'evt_public_2',
    name: 'Tunde Fashola',
    email: 'tunde.f@lifestyle.ng',
    phone: '+2348076667788',
    tier: 'Private Cabana (Table for 6)',
    table: 'Cabana 03 Poolside',
    plusOnes: 5,
    status: 'VALID',
    checkInTime: null,
    gate: null,
    dispatched: true,
    cardTheme: 'cyber-neon',
    qrToken: 'QRI_POOL_GST108_TUNDE',
  },
];

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.some((e) => e.id === 'evt_leadership_summit_2026')) {
          return [DEFAULT_EVENTS[0], ...parsed];
        }
        return parsed;
      }
      return DEFAULT_EVENTS;
    } catch {
      return DEFAULT_EVENTS;
    }
  });

  const [guests, setGuests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GUESTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        const summitGuests = DEFAULT_GUESTS.filter((g) => g.eventId === 'evt_leadership_summit_2026');
        const hasSummit = parsed.some((g) => g.eventId === 'evt_leadership_summit_2026');
        if (!hasSummit) {
          return [...summitGuests, ...parsed];
        }
        return parsed;
      }
      return DEFAULT_GUESTS;
    } catch {
      return DEFAULT_GUESTS;
    }
  });

  const [checkInLogs, setCheckInLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHECKIN_LOGS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active selected event for workspace filtering (default to Summit)
  const [activeEventId, setActiveEventId] = useState(DEFAULT_EVENTS[0].id);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHECKIN_LOGS, JSON.stringify(checkInLogs));
  }, [checkInLogs]);

  // Hydrate from backend REST API if online (offline fallback preserves cached data)
  useEffect(() => {
    let active = true;
    fetchEvents()
      .then((data) => {
        if (!active || !data) return;
        const apiEvents = Array.isArray(data) ? data : data.events;
        if (apiEvents && apiEvents.length > 0) {
          setEvents((prev) => {
            const map = new Map();
            prev.forEach((e) => map.set(e.id || e._id, e));
            apiEvents.forEach((e) => {
              const id = e._id || e.id;
              map.set(id, { ...e, id });
            });
            return Array.from(map.values());
          });
        }
      })
      .catch(() => {});

    fetchGuests()
      .then((data) => {
        if (!active || !data) return;
        const apiGuests = Array.isArray(data) ? data : data.guests;
        if (apiGuests && apiGuests.length > 0) {
          setGuests((prev) => {
            const map = new Map();
            prev.forEach((g) => map.set(g.id || g._id, g));
            apiGuests.forEach((g) => {
              const id = g._id || g.id;
              map.set(id, { ...g, id });
            });
            return Array.from(map.values());
          });
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  // Create New Event (Public or Private)
  const createEvent = (newEventData) => {
    const eventId = 'evt_' + (newEventData.type === 'PRIVATE' ? 'private_' : 'public_') + Date.now().toString(36);
    const event = {
      id: eventId,
      type: newEventData.type || 'PUBLIC',
      name: newEventData.name,
      category: newEventData.category || (newEventData.type === 'PRIVATE' ? 'Private Celebration' : 'General Event'),
      venue: newEventData.venue,
      date: newEventData.date,
      time: newEventData.time || '18:00',
      banner: newEventData.banner || (newEventData.type === 'PRIVATE' 
        ? 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'),
      description: newEventData.description || '',
      status: 'ACTIVE',
      capacity: Number(newEventData.capacity) || (newEventData.type === 'PRIVATE' ? 150 : 500),
      issued: 0,
      checkedIn: 0,
      gateVelocity: 0,
      revenue: 0,
      currency: newEventData.currency || 'NGN',
      ticketTiers: newEventData.ticketTiers || [
        { id: 'tier_1', name: 'VIP Pass', price: 0, perks: 'All Access' }
      ],
      dressCode: newEventData.dressCode || 'Smart / Casual Elegance',
      cardTheme: newEventData.cardTheme || 'luxury-gold',
      customMessage: newEventData.customMessage || 'You are cordially invited to celebrate with us.',
      hostName: newEventData.hostName || 'Event Host',
      publicKey: 'ed25519_pk_' + Math.random().toString(36).substring(2, 14),
      createdAt: new Date().toISOString(),
    };

    setEvents((prev) => [event, ...prev]);
    setActiveEventId(event.id);
    createEventApi(event)
      .then((res) => {
        if (res && res.event) {
          setEvents((prev) =>
            prev.map((e) => (e.id === event.id ? { ...e, ...res.event, id: e.id } : e))
          );
        }
      })
      .catch(() => {});
    return event;
  };

  // Add a single guest (for private or public VIP registration)
  const addGuest = (eventId, guestData) => {
    const token = 'QRI_' + (guestData.name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6).toUpperCase()) + '_' + Date.now().toString(36).toUpperCase();
    const targetEvent = events.find((e) => e.id === eventId);
    
    const newGuest = {
      id: 'gst_' + Date.now().toString(36),
      eventId,
      name: guestData.name,
      email: guestData.email || '',
      phone: guestData.phone || '',
      tier: guestData.tier || 'VIP',
      table: guestData.table || 'General Seating',
      plusOnes: Number(guestData.plusOnes) || 0,
      status: 'VALID',
      checkInTime: null,
      gate: null,
      dispatched: false,
      cardTheme: guestData.cardTheme || targetEvent?.cardTheme || 'luxury-gold',
      qrToken: token,
      createdAt: new Date().toISOString(),
    };

    setGuests((prev) => [newGuest, ...prev]);

    // Update event issued count
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === eventId ? { ...evt, issued: (evt.issued || 0) + 1 } : evt
      )
    );

    createGuestApi({
      eventId,
      name: guestData.name,
      email: guestData.email,
      phone: guestData.phone,
      tier: guestData.tier,
      table: guestData.table,
      plusOnes: guestData.plusOnes,
    })
      .then((res) => {
        if (res && (res.ticket || res.guest)) {
          setGuests((prev) =>
            prev.map((g) =>
              g.id === newGuest.id
                ? {
                    ...g,
                    qrToken: res.ticket?.qrToken || res.ticket?.compactQrPayload || g.qrToken,
                    compactQrPayload: res.ticket?.compactQrPayload,
                    signature: res.ticket?.signature,
                    ticketId: res.ticket?._id,
                    backendGuestId: res.guest?._id,
                  }
                : g
            )
          );
        }
      })
      .catch(() => {});

    return newGuest;
  };

  // Bulk add guests (e.g. from CSV)
  const bulkAddGuests = (eventId, guestList) => {
    const targetEvent = events.find((e) => e.id === eventId);
    const formatted = guestList.map((g, idx) => ({
      id: 'gst_' + Date.now().toString(36) + '_' + idx,
      eventId,
      name: g.name,
      email: g.email || '',
      phone: g.phone || '',
      tier: g.tier || 'VIP',
      table: g.table || 'Table Reserved',
      plusOnes: Number(g.plusOnes) || 0,
      status: 'VALID',
      checkInTime: null,
      gate: null,
      dispatched: false,
      cardTheme: targetEvent?.cardTheme || 'luxury-gold',
      qrToken: 'QRI_' + (g.name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5).toUpperCase()) + '_' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      createdAt: new Date().toISOString(),
    }));

    setGuests((prev) => [...formatted, ...prev]);

    // Update event issued count
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === eventId ? { ...evt, issued: (evt.issued || 0) + formatted.length } : evt
      )
    );

    bulkAddGuestsApi(eventId, guestList)
      .then((res) => {
        if (res && res.guests && Array.isArray(res.guests)) {
          setGuests((prev) => {
            const updated = [...prev];
            res.guests.forEach((bg) => {
              const matchIdx = updated.findIndex(
                (g) => g.eventId === eventId && g.name?.toLowerCase() === bg.name?.toLowerCase()
              );
              if (matchIdx !== -1 && bg.qrToken) {
                updated[matchIdx] = {
                  ...updated[matchIdx],
                  qrToken: bg.qrToken,
                  compactQrPayload: bg.compactQrPayload,
                  signature: bg.signature,
                };
              }
            });
            return updated;
          });
        }
      })
      .catch(() => {});

    return formatted;
  };

  // Mark guest as dispatched
  const markDispatched = (guestId) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, dispatched: true } : g))
    );
  };

  // Purchase public ticket (Checkout flow)
  const purchaseTicket = (eventId, { buyerName, buyerEmail, buyerPhone, tierId, quantity = 1 }) => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) throw new Error('Event not found');

    const tier = targetEvent.ticketTiers.find((t) => t.id === tierId) || targetEvent.ticketTiers[0];
    const totalAmount = tier.price * quantity;
    const issuedGuests = [];

    for (let i = 0; i < quantity; i++) {
      const suffix = quantity > 1 ? ` #${i + 1}` : '';
      const guest = addGuest(eventId, {
        name: `${buyerName}${suffix}`,
        email: buyerEmail,
        phone: buyerPhone,
        tier: tier.name,
        table: 'General Admission',
        plusOnes: 0,
        cardTheme: 'midnight-vip',
      });
      issuedGuests.push(guest);
    }

    // Update revenue
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === eventId ? { ...evt, revenue: (evt.revenue || 0) + totalAmount } : evt
      )
    );

    return { success: true, guests: issuedGuests, totalAmount, event: targetEvent };
  };

  // Check-in & Gate Verification Engine (Anti-Replay / Sub-second latency with offline fallback)
  const verifyAndCheckIn = (qrPayloadOrToken, gateName = 'Gate North #1', scannerDeviceId = 'terminal_scanner_pwa') => {
    const cleanToken = (typeof qrPayloadOrToken === 'string' ? qrPayloadOrToken : (qrPayloadOrToken?.tid || qrPayloadOrToken?.token || '')).trim();

    // Match by token or guest id or partial payload
    const guest = guests.find((g) => {
      if (g.qrToken === cleanToken) return true;
      if (g.id === cleanToken) return true;
      if (cleanToken && (cleanToken.includes(g.id) || (g.qrToken && cleanToken.includes(g.qrToken)))) return true;
      return false;
    });

    let result;

    if (!guest) {
      result = {
        success: false,
        status: 'FORGED',
        message: 'Unrecognized Token or Untrusted Signature',
        guest: null,
      };
    } else if (guest.status === 'REVOKED') {
      result = {
        success: false,
        status: 'REVOKED',
        message: 'This pass has been formally REVOKED by event security',
        guest,
      };
    } else if (guest.status === 'CHECKED_IN') {
      result = {
        success: false,
        status: 'DUPLICATE',
        message: `Already checked in at ${new Date(guest.checkInTime).toLocaleTimeString()} at ${guest.gate || 'another gate'}! Possible screenshot or duplicate attempt.`,
        guest,
        firstUsed: `${new Date(guest.checkInTime).toLocaleTimeString()} at ${guest.gate || 'Gate 1'}`,
        checkInTime: guest.checkInTime,
        gateScanned: guest.gate || gateName,
        scanCount: (guest.scanCount || 1) + 1,
      };
    } else {
      // Valid check-in!
      const checkInTime = new Date().toISOString();

      setGuests((prev) =>
        prev.map((g) =>
          g.id === guest.id
            ? { ...g, status: 'CHECKED_IN', checkInTime, gate: gateName, scanCount: 1 }
            : g
        )
      );

      // Update event checkedIn count
      setEvents((prev) =>
        prev.map((evt) =>
          evt.id === guest.eventId
            ? { ...evt, checkedIn: (evt.checkedIn || 0) + 1 }
            : evt
        )
      );

      // Append to live checkin log
      const logEntry = {
        id: 'log_' + Date.now(),
        guestId: guest.id,
        guestName: guest.name,
        tier: guest.tier,
        eventId: guest.eventId,
        gate: gateName,
        timestamp: checkInTime,
      };
      setCheckInLogs((prev) => [logEntry, ...prev]);

      result = {
        success: true,
        status: 'SUCCESS',
        message: 'Access Granted! Welcome to the event.',
        guest: { ...guest, status: 'CHECKED_IN', checkInTime, gate: gateName },
      };
    }

    // Fire non-blocking background synchronization to backend REST API
    verifyScanApi(qrPayloadOrToken, gateName, scannerDeviceId).catch(() => {});

    // Dual promise-like object: supports synchronous .status immediately as well as async await
    const dualResult = Promise.resolve(result);
    Object.assign(dualResult, result);
    return dualResult;
  };

  // Online-first Gate Verification with full Offline Fallback
  const verifyScanOnline = async (qrPayloadOrToken, gateName = 'Gate North #1', scannerDeviceId = 'terminal_scanner_pwa') => {
    try {
      const apiRes = await verifyScanApi(qrPayloadOrToken, gateName, scannerDeviceId);
      if (apiRes && apiRes.status) {
        if (apiRes.status === 'SUCCESS' && apiRes.guest) {
          const checkInTime = apiRes.ticket?.checkedInAt || new Date().toISOString();
          setGuests((prev) =>
            prev.map((g) =>
              g.id === apiRes.guest._id || g.qrToken === apiRes.ticket?.qrToken || g.id === apiRes.guest.id
                ? { ...g, status: 'CHECKED_IN', checkInTime, gate: gateName, scanCount: 1 }
                : g
            )
          );
          setEvents((prev) =>
            prev.map((evt) =>
              evt.id === apiRes.guest.eventId || evt.id === apiRes.guest.event
                ? { ...evt, checkedIn: (evt.checkedIn || 0) + 1 }
                : evt
            )
          );
          const logEntry = {
            id: 'log_' + Date.now(),
            guestId: apiRes.guest._id || apiRes.guest.id,
            guestName: apiRes.guest.name,
            tier: apiRes.guest.tier || apiRes.ticket?.tier,
            eventId: apiRes.guest.eventId,
            gate: gateName,
            timestamp: checkInTime,
          };
          setCheckInLogs((prev) => [logEntry, ...prev]);
        } else if (apiRes.status === 'DUPLICATE') {
          setGuests((prev) =>
            prev.map((g) => {
              const matched =
                g.id === apiRes.guest?._id ||
                g.name === apiRes.guestName ||
                (apiRes.ticket?.qrToken && g.qrToken === apiRes.ticket.qrToken);
              return matched
                ? {
                    ...g,
                    status: 'CHECKED_IN',
                    checkInTime: apiRes.checkInTime || g.checkInTime || new Date().toISOString(),
                    gate: apiRes.gateScanned || g.gate || gateName,
                    scanCount: apiRes.scanCount || (g.scanCount || 1) + 1,
                  }
                : g;
            })
          );
        }
        return apiRes;
      }
    } catch (err) {
      console.warn('[EventContext] Online verification network error, activating offline fallback:', err);
    }

    // Offline / Local Fallback
    return verifyAndCheckIn(qrPayloadOrToken, gateName, scannerDeviceId);
  };

  // Revoke pass
  const revokeGuest = (guestId) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, status: 'REVOKED' } : g))
    );
    toast.error('Pass has been revoked');
  };

  // Delete guest
  const deleteGuest = (guestId) => {
    const target = guests.find((g) => g.id === guestId);
    setGuests((prev) => prev.filter((g) => g.id !== guestId));
    if (target) {
      setEvents((prev) =>
        prev.map((evt) =>
          evt.id === target.eventId
            ? { ...evt, issued: Math.max(0, (evt.issued || 0) - 1) }
            : evt
        )
      );
    }
    toast.success('Guest removed');
  };

  return (
    <EventContext.Provider
      value={{
        events,
        guests,
        checkInLogs,
        activeEventId,
        setActiveEventId,
        createEvent,
        addGuest,
        bulkAddGuests,
        markDispatched,
        purchaseTicket,
        verifyAndCheckIn,
        verifyScanOnline,
        revokeGuest,
        deleteGuest,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
