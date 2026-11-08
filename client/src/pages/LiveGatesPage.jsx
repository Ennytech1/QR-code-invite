import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Activity,
  Zap,
  ShieldCheck,
  AlertOctagon,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Radio,
  ArrowUpRight,
  Download,
  Search,
  Filter,
  RefreshCw,
  Play,
  Pause,
  TrendingUp,
  Server,
  Wifi,
  Users,
  Award,
  Sparkles,
  ChevronDown,
  Layers,
  BarChart3,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Calendar,
  Lock,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEvents } from '../context/EventContext';

// Distinctive badge styling matching QRInvite design system
const TIER_BADGES = {
  VVIP: {
    bg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    icon: Award,
  },
  VIP: {
    bg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    icon: Sparkles,
  },
  'HIGH TABLE': {
    bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    icon: Award,
  },
  REGULAR: {
    bg: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/25',
    icon: Users,
  },
  VENDOR: {
    bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    icon: ShieldCheck,
  },
  MEDIA: {
    bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    icon: Radio,
  },
};

const GATE_CONFIG = [
  {
    id: 'gate_north_1',
    name: 'Gate North #1',
    role: 'Main General Ingress',
    scanners: 4,
    status: 'ONLINE',
    accentColor: 'indigo',
    colorClass: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    terminalId: 'TRM-N1',
  },
  {
    id: 'gate_vip_east',
    name: 'VIP Gate East',
    role: 'Executive & High Table Priority',
    scanners: 2,
    status: 'ONLINE',
    accentColor: 'purple',
    colorClass: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    terminalId: 'TRM-VE',
  },
  {
    id: 'gate_press_west',
    name: 'Press & Media Gate',
    role: 'Accredited Media & Broadcasters',
    scanners: 1,
    status: 'ONLINE',
    accentColor: 'cyan',
    colorClass: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    terminalId: 'TRM-PW',
  },
  {
    id: 'gate_south_svc',
    name: 'South Service & Vendor',
    role: 'Staff, Catering & Logistics',
    scanners: 2,
    status: 'ONLINE',
    accentColor: 'amber',
    colorClass: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    terminalId: 'TRM-SS',
  },
];

const INITIAL_HOURLY_RUSH = [
  { time: '16:00', scans: 18, isPeak: false },
  { time: '16:30', scans: 34, isPeak: false },
  { time: '17:00', scans: 62, isPeak: false },
  { time: '17:30', scans: 110, isPeak: false },
  { time: '18:00', scans: 185, isPeak: true },
  { time: '18:30', scans: 240, isPeak: true },
  { time: '19:00', scans: 215, isPeak: true },
  { time: '19:30', scans: 140, isPeak: false },
  { time: '20:00', scans: 85, isPeak: false },
  { time: '20:30', scans: 42, isPeak: false },
];

const LiveGatesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const eventParam = searchParams.get('eventId') || searchParams.get('event');

  const { events, guests, checkInLogs, activeEventId, setActiveEventId } = useEvents();

  // Mode: 'catalog' (choose which event gate to monitor) | 'telemetry' (live ingress feed)
  const [viewMode, setViewMode] = useState(eventParam ? 'telemetry' : 'catalog');
  const [selectedEventId, setSelectedEventId] = useState(eventParam || activeEventId || events[0]?.id);

  // Filters for the Catalog view
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogFilter, setCatalogFilter] = useState('ALL'); // 'ALL' | 'PUBLIC' | 'PRIVATE'

  // Sync eventParam if provided
  useEffect(() => {
    if (eventParam && events.some((e) => e.id === eventParam)) {
      setSelectedEventId(eventParam);
      setActiveEventId(eventParam);
      setViewMode('telemetry');
    }
  }, [eventParam, events]);

  // Active event selection
  const selectedEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0] || {
      id: 'evt_general',
      name: 'All Events Ingress',
      capacity: 2500,
      checkedIn: 120,
    };
  }, [events, selectedEventId]);

  const handleSelectEvent = (evt) => {
    setSelectedEventId(evt.id);
    setActiveEventId(evt.id);
    setViewMode('telemetry');
    setSearchParams({ eventId: evt.id });
    toast.success(`Connected to Live Gates Telemetry for "${evt.name}"`);
  };

  const handleBackToCatalog = () => {
    setViewMode('catalog');
    setSearchParams({});
  };

  const filteredCatalogEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesSearch =
        evt.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        evt.venue.toLowerCase().includes(catalogSearch.toLowerCase());
      const matchesFilter =
        catalogFilter === 'ALL' || evt.type === catalogFilter;
      return matchesSearch && matchesFilter;
    });
  }, [events, catalogSearch, catalogFilter]);

  // Live telemetry streaming toggle
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [selectedGateFilter, setSelectedGateFilter] = useState('ALL');
  const [outcomeFilter, setOutcomeFilter] = useState('ALL'); // ALL | SUCCESS | DUPLICATE | INVALID
  const [searchQuery, setSearchQuery] = useState('');
  const [realtimeVelocity, setRealtimeVelocity] = useState(48); // scans/min
  const [simulatedLogs, setSimulatedLogs] = useState([]);

  // Generate initial simulated telemetry audit feed blended with context checkInLogs
  useEffect(() => {
    const defaultAuditLogs = [
      {
        id: 'aud_1',
        timestamp: new Date(Date.now() - 1000 * 20).toISOString(),
        guestName: 'Dr. Ngozi Okonjo-Iweala',
        guestId: 'gst_vvip_002',
        tier: 'VVIP',
        table: 'Presidency Table A',
        gate: 'VIP Gate East',
        scannerId: 'TRM-VE-01',
        outcome: 'SUCCESS',
        latencyMs: 38,
      },
      {
        id: 'aud_2',
        timestamp: new Date(Date.now() - 1000 * 55).toISOString(),
        guestName: 'Olumide Bakare',
        guestId: 'gst_reg_044',
        tier: 'REGULAR',
        table: 'Zone B - Row 12',
        gate: 'Gate North #1',
        scannerId: 'TRM-N1-02',
        outcome: 'SUCCESS',
        latencyMs: 44,
      },
      {
        id: 'aud_3',
        timestamp: new Date(Date.now() - 1000 * 95).toISOString(),
        guestName: 'Screenshot Replay Pass (Tid: 8841)',
        guestId: 'gst_dup_099',
        tier: 'VIP',
        table: 'Table 4',
        gate: 'Gate North #1',
        scannerId: 'TRM-N1-03',
        outcome: 'DUPLICATE',
        message: 'Anti-Replay Triggered: Prior scan 18:14 at Gate North #1',
        latencyMs: 29,
      },
      {
        id: 'aud_4',
        timestamp: new Date(Date.now() - 1000 * 140).toISOString(),
        guestName: 'Arise News Media Crew',
        guestId: 'gst_med_012',
        tier: 'MEDIA',
        table: 'Press Deck 02',
        gate: 'Press & Media Gate',
        scannerId: 'TRM-PW-01',
        outcome: 'SUCCESS',
        latencyMs: 32,
      },
      {
        id: 'aud_5',
        timestamp: new Date(Date.now() - 1000 * 190).toISOString(),
        guestName: 'Chief Kelechi Okafor',
        guestId: 'gst_vvip_001',
        tier: 'VVIP',
        table: 'High Table 01',
        gate: 'VIP Gate East',
        scannerId: 'TRM-VE-02',
        outcome: 'SUCCESS',
        latencyMs: 35,
      },
      {
        id: 'aud_6',
        timestamp: new Date(Date.now() - 1000 * 240).toISOString(),
        guestName: 'Counterfeit / Unsigned QR',
        guestId: 'gst_bad_77',
        tier: 'REGULAR',
        table: '-',
        gate: 'Gate North #1',
        scannerId: 'TRM-N1-01',
        outcome: 'INVALID',
        message: 'Ed25519 signature validation failed: Untrusted issuer',
        latencyMs: 22,
      },
      {
        id: 'aud_7',
        timestamp: new Date(Date.now() - 1000 * 300).toISOString(),
        guestName: 'Fola Adeola',
        guestId: 'gst_vip_007',
        tier: 'VIP',
        table: 'Executive Lounge',
        gate: 'VIP Gate East',
        scannerId: 'TRM-VE-01',
        outcome: 'SUCCESS',
        latencyMs: 41,
      },
      {
        id: 'aud_8',
        timestamp: new Date(Date.now() - 1000 * 370).toISOString(),
        guestName: 'Chuka Ebi',
        guestId: 'gst_ven_003',
        tier: 'VENDOR',
        table: 'Backstage Hub',
        gate: 'South Service & Vendor',
        scannerId: 'TRM-SS-01',
        outcome: 'SUCCESS',
        latencyMs: 30,
      },
    ];

    setSimulatedLogs(defaultAuditLogs);
  }, []);

  // Live real-time simulation interval (tick every 4-6 seconds if live streaming is enabled)
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      // Fluctuate velocity slightly between 42 and 58 scans/min
      setRealtimeVelocity(Math.floor(40 + Math.random() * 20));

      // 10% chance of duplicate scan, 5% invalid, 85% valid
      const rand = Math.random();
      let outcome = 'SUCCESS';
      let name = 'Attendee ' + Math.floor(100 + Math.random() * 900);
      let tier = 'REGULAR';
      let gate = 'Gate North #1';
      let table = 'Zone A';
      let message = undefined;

      const gates = ['Gate North #1', 'VIP Gate East', 'Press & Media Gate', 'South Service & Vendor'];
      gate = gates[Math.floor(Math.random() * gates.length)];

      if (gate.includes('VIP')) {
        tier = Math.random() > 0.4 ? 'VVIP' : 'VIP';
        table = 'Presidency ' + Math.floor(1 + Math.random() * 5);
      } else if (gate.includes('Press')) {
        tier = 'MEDIA';
        table = 'Press Corps';
      } else if (gate.includes('Service')) {
        tier = 'VENDOR';
        table = 'Logistics';
      }

      if (rand < 0.1) {
        outcome = 'DUPLICATE';
        name = 'Replay Detected (Token QRI-' + Math.floor(1000 + Math.random() * 9000) + ')';
        message = 'Anti-Replay Concurrency Alert: Second entry attempt';
      } else if (rand < 0.15) {
        outcome = 'INVALID';
        name = 'Untrusted Signature Token';
        message = 'Ed25519 cryptographic mismatch';
      }

      const newLog = {
        id: 'live_' + Date.now(),
        timestamp: new Date().toISOString(),
        guestName: name,
        guestId: 'gst_dyn_' + Math.floor(1000 + Math.random() * 9000),
        tier,
        table,
        gate,
        scannerId: 'TRM-' + gate.substring(0, 2).toUpperCase() + '-0' + Math.floor(1 + Math.random() * 3),
        outcome,
        message,
        latencyMs: Math.floor(25 + Math.random() * 35),
      };

      setSimulatedLogs((prev) => [newLog, ...prev.slice(0, 49)]);
    }, 5500);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Combine real checkInLogs from context with simulated audit entries
  const allAuditLogs = useMemo(() => {
    const fromContext = (checkInLogs || []).map((log) => ({
      id: log.id,
      timestamp: log.timestamp || new Date().toISOString(),
      guestName: log.guestName || 'Attendee',
      guestId: log.guestId || 'gst_001',
      tier: log.tier || 'REGULAR',
      table: log.table || 'General',
      gate: log.gate || 'Gate North #1',
      scannerId: 'TRM-LIVE-01',
      outcome: 'SUCCESS',
      latencyMs: 32,
    }));

    return [...fromContext, ...simulatedLogs];
  }, [checkInLogs, simulatedLogs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return allAuditLogs.filter((log) => {
      const matchGate = selectedGateFilter === 'ALL' || log.gate === selectedGateFilter;
      const matchOutcome = outcomeFilter === 'ALL' || log.outcome === outcomeFilter;
      const matchSearch =
        !searchQuery ||
        log.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.guestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.gate.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGate && matchOutcome && matchSearch;
    });
  }, [allAuditLogs, selectedGateFilter, outcomeFilter, searchQuery]);

  // Outcomes breakdown calculations
  const breakdownStats = useMemo(() => {
    const total = allAuditLogs.length || 1;
    const success = allAuditLogs.filter((l) => l.outcome === 'SUCCESS').length;
    const duplicate = allAuditLogs.filter((l) => l.outcome === 'DUPLICATE').length;
    const invalid = allAuditLogs.filter((l) => l.outcome === 'INVALID').length;

    return {
      total,
      success,
      duplicate,
      invalid,
      successRate: ((success / total) * 100).toFixed(1),
      dupRate: ((duplicate / total) * 100).toFixed(1),
      invRate: ((invalid / total) * 100).toFixed(1),
    };
  }, [allAuditLogs]);

  // Gate breakdown statistics
  const gateStats = useMemo(() => {
    return GATE_CONFIG.map((g) => {
      const gateLogs = allAuditLogs.filter((l) => l.gate === g.name);
      const totalScans = gateLogs.length;
      const successCount = gateLogs.filter((l) => l.outcome === 'SUCCESS').length;
      const duplicateCount = gateLogs.filter((l) => l.outcome === 'DUPLICATE').length;
      const lastScan = gateLogs[0]?.timestamp
        ? new Date(gateLogs[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        : 'Awaiting';
      const approxVelocity = Math.max(2, Math.floor(realtimeVelocity * (g.scanners / 9)));

      return {
        ...g,
        totalScans,
        successCount,
        duplicateCount,
        lastScan,
        velocity: approxVelocity,
      };
    });
  }, [allAuditLogs, realtimeVelocity]);

  // Manual trigger to simulate scan
  const handleSimulateScan = () => {
    const sampleGuests = [
      { name: 'Simulated Ingress: Aliko Dangote', tier: 'VVIP', gate: 'VIP Gate East', table: 'Presidency 01' },
      { name: 'Simulated Ingress: Mitchell Elegbe', tier: 'VIP', gate: 'VIP Gate East', table: 'Executive Deck' },
      { name: 'Simulated Ingress: Techpoint Reporter', tier: 'MEDIA', gate: 'Press & Media Gate', table: 'Press 01' },
      { name: 'Simulated Ingress: Standard Attendee', tier: 'REGULAR', gate: 'Gate North #1', table: 'Zone B' },
    ];
    const pick = sampleGuests[Math.floor(Math.random() * sampleGuests.length)];
    const newEntry = {
      id: 'sim_' + Date.now(),
      timestamp: new Date().toISOString(),
      guestName: pick.name,
      guestId: 'gst_sim_' + Math.floor(100 + Math.random() * 900),
      tier: pick.tier,
      table: pick.table,
      gate: pick.gate,
      scannerId: 'TRM-SIM-01',
      outcome: 'SUCCESS',
      latencyMs: 28,
    };
    setSimulatedLogs((prev) => [newEntry, ...prev]);
    toast.success(`Access Granted: ${pick.name} passed through ${pick.gate}!`);
  };

  // Export audit log to CSV
  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Guest Name', 'Guest ID', 'Tier', 'Table', 'Gate', 'Scanner ID', 'Outcome', 'Latency (ms)'];
    const rows = filteredLogs.map((l) => [
      `"${new Date(l.timestamp).toLocaleString()}"`,
      `"${l.guestName}"`,
      `"${l.guestId}"`,
      `"${l.tier}"`,
      `"${l.table}"`,
      `"${l.gate}"`,
      `"${l.scannerId}"`,
      `"${l.outcome}"`,
      l.latencyMs || 30,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Gate_Telemetry_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Gate telemetry audit exported to CSV');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-slate-900 dark:text-white max-w-7xl mx-auto">
      
      {/* ─────────────────────────────────────────────────────────────
          VIEW 1: EVENT TELEMETRY CATALOG (SELECT EVENT FIRST)
         ───────────────────────────────────────────────────────────── */}
      {viewMode === 'catalog' && (
        <div className="space-y-6 animate-fade-in-scale">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 mb-2">
                <Activity size={13} className="text-indigo-500 animate-pulse" />
                <span>REAL-TIME TELEMETRY • SELECT EVENT FIRST</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-heading">
                Gate Telemetry & Ingress Mesh
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                Choose an active event to open live turnstile lane velocities, sub-15ms optical scan streams, and cryptographic replay defense audit logs.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Turnstile Mesh Online
              </span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 shadow-xs">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Search events by name or venue..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 self-start sm:self-auto">
              {['ALL', 'PUBLIC', 'PRIVATE'].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setCatalogFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    catalogFilter === filter
                      ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-2xs scale-102'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {filter === 'ALL' ? 'All Events' : filter === 'PUBLIC' ? 'Public' : 'Private'}
                </button>
              ))}
            </div>
          </div>

          {/* Event Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCatalogEvents.map((evt) => {
              const evtGuests = (guests && guests[evt.id]) || [];
              const checkedIn = evtGuests.filter((g) => g.status === 'CHECKED_IN').length;
              const pct = evtGuests.length > 0 ? Math.round((checkedIn / evtGuests.length) * 100) : 0;

              return (
                <div
                  key={evt.id}
                  onClick={() => handleSelectEvent(evt)}
                  className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111113] overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                      <img
                        src={evt.banner || '/images/hero/hero_concert.jpg'}
                        alt={evt.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border backdrop-blur-md ${
                          evt.type === 'PRIVATE'
                            ? 'bg-amber-500/90 text-black border-amber-400'
                            : 'bg-indigo-600/90 text-white border-indigo-400'
                        }`}>
                          {evt.type === 'PRIVATE' ? '🔒 PRIVATE VIP' : '🌍 PUBLIC TICKETED'}
                        </span>

                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live Stream
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-base font-extrabold text-white truncate drop-shadow-md">
                          {evt.name}
                        </h3>
                        <p className="text-[11px] text-slate-300 truncate flex items-center gap-1 mt-0.5">
                          <MapPin size={11} className="text-rose-400 shrink-0" />
                          <span>{evt.venue}</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 space-y-3.5">
                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar size={13} className="text-indigo-500" />
                          <span>{evt.date}</span>
                        </span>
                        <span className="font-mono text-slate-500">4 Active Lanes</span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700 dark:text-slate-300">Turnstile Ingress</span>
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {checkedIn} / {evtGuests.length} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 group-hover:bg-indigo-600 text-slate-700 dark:text-slate-200 group-hover:text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-2xs group-hover:shadow-md group-hover:shadow-indigo-600/30"
                    >
                      <Activity size={14} />
                      <span>Open Live Telemetry</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW 2: REAL-TIME TELEMETRY STREAM & AUDIT DASHBOARD
         ───────────────────────────────────────────────────────────── */}
      {viewMode === 'telemetry' && (
        <div className="space-y-6 animate-fade-in-scale">
          {/* Top Telemetry Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 shadow-xs">
            <div>
              <button
                type="button"
                onClick={handleBackToCatalog}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-2 group transition-colors cursor-pointer"
              >
                <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
                <span>Switch Event Telemetry</span>
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-500 dark:text-indigo-400 flex items-center justify-center">
                  <Activity size={18} className="animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-extrabold tracking-tight">Gate Telemetry & Real-Time Ingress</h1>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Live Feed
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Monitoring: <strong className="text-slate-900 dark:text-white">{selectedEvent?.name}</strong> • {selectedEvent?.venue}
                  </p>
                </div>
              </div>
            </div>

            {/* Header Controls: Stream Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleBackToCatalog}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Switch Event
              </button>

              <button
                onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isLiveStreaming
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs shadow-indigo-500/20'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                }`}
              >
                {isLiveStreaming ? <Pause size={13} /> : <Play size={13} />}
                <span>{isLiveStreaming ? 'Stream Active' : 'Stream Paused'}</span>
              </button>

              <button
                onClick={handleSimulateScan}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Zap size={13} className="text-amber-400" />
                <span>Simulate Scan</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download size={13} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
            }`}
          >
            {isLiveStreaming ? <Pause size={13} /> : <Play size={13} />}
            <span>{isLiveStreaming ? 'Stream Active' : 'Stream Paused'}</span>
          </button>

          <button
            onClick={handleSimulateScan}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Zap size={13} className="text-amber-400" />
            <span>Simulate Scan</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ─── Telemetry KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Check-in Velocity */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Ingress Velocity</span>
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
              <Zap size={15} />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono-numbers text-slate-900 dark:text-white">
              {realtimeVelocity}
            </span>
            <span className="text-xs font-semibold text-slate-400">scans / min</span>
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-emerald-500">
            <TrendingUp size={12} />
            <span>+16.4% peak throughput surge</span>
          </div>
          {/* Animated mini bar */}
          <div className="mt-3 w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (realtimeVelocity / 75) * 100)}%` }}
            />
          </div>
        </div>

        {/* Card 2: Peak Rush Indicator */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Peak Rush Window</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400">
              <Clock size={15} />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              18:00 - 19:30
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>High Load: 240 max scans/hour</span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-[82%]" />
          </div>
        </div>

        {/* Card 3: Cryptographic Pass Success Rate */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Valid Pass Admissions</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
              <ShieldCheck size={15} />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono-numbers text-slate-900 dark:text-white">
              {breakdownStats.success}
            </span>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded-md">
              {breakdownStats.successRate}%
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <span>Verified Ed25519 signatures</span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${breakdownStats.successRate}%` }}
            />
          </div>
        </div>

        {/* Card 4: Anti-Replay & Rejections */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Blocked Replays & Invalid</span>
            <span className="p-1.5 rounded-lg bg-red-500/10 text-red-500 dark:text-red-400">
              <AlertOctagon size={15} />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono-numbers text-red-500">
              {breakdownStats.duplicate + breakdownStats.invalid}
            </span>
            <span className="text-xs font-medium text-slate-400">
              ({breakdownStats.duplicate} dups, {breakdownStats.invalid} inv)
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span>Anti-replay concurrency lock active</span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full"
              style={{ width: `${Math.min(100, (Number(breakdownStats.dupRate) + Number(breakdownStats.invRate)) * 5)}%` }}
            />
          </div>
        </div>

      </div>

      {/* ─── Peak Rush Curve Chart & Outcome Distribution ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left (2 cols): Hourly Ingress Rush Curve */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-indigo-400" />
              <h2 className="text-sm font-extrabold tracking-tight">Timeline Check-In Rush Density</h2>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /> Normal Flow
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Peak Surge
              </span>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="pt-6 pb-2">
            <div className="h-44 flex items-end justify-between gap-2 sm:gap-3 px-2">
              {INITIAL_HOURLY_RUSH.map((item, idx) => {
                const heightPct = Math.round((item.scans / 250) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono-numbers font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.scans}
                    </span>
                    <div className="w-full bg-slate-100 dark:bg-zinc-800/80 rounded-t-lg relative flex items-end overflow-hidden h-full">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          item.isPeak
                            ? 'bg-gradient-to-t from-amber-500 to-orange-400 shadow-sm shadow-amber-500/20'
                            : 'bg-gradient-to-t from-indigo-600 to-violet-500'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 tracking-tight">
                      {item.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pt-2 text-right">
            <span className="text-[10px] text-slate-500">Times displayed in local organizer venue timezone (GMT+1)</span>
          </div>
        </div>

        {/* Right (1 col): Verification Outcomes Breakdown */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <h2 className="text-sm font-extrabold tracking-tight">Security Breakdown</h2>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Total: {breakdownStats.total}</span>
            </div>

            <div className="space-y-4 pt-4">
              
              {/* Valid Outcomes */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-emerald-500 flex items-center gap-1.5">
                    <CheckCircle2 size={13} />
                    Valid Check-Ins
                  </span>
                  <span className="font-mono-numbers">{breakdownStats.success} ({breakdownStats.successRate}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${breakdownStats.successRate}%` }} />
                </div>
              </div>

              {/* Duplicate Replays */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-amber-500 flex items-center gap-1.5">
                    <AlertOctagon size={13} />
                    Duplicate Replays Intercepted
                  </span>
                  <span className="font-mono-numbers">{breakdownStats.duplicate} ({breakdownStats.dupRate}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${breakdownStats.dupRate}%` }} />
                </div>
              </div>

              {/* Invalid Signatures */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-red-500 flex items-center gap-1.5">
                    <ShieldAlert size={13} />
                    Invalid / Forged Signatures
                  </span>
                  <span className="font-mono-numbers">{breakdownStats.invalid} ({breakdownStats.invRate}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${breakdownStats.invRate}%` }} />
                </div>
              </div>

            </div>
          </div>

          {/* Anti-Replay Shield Status Box */}
          <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-white/5 text-[11px] space-y-1">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Distributed Lock Engine: ACTIVE
            </div>
            <p className="text-slate-400 leading-relaxed">
              Atomic Redis token mutex preventing sub-second multi-turnstile pass re-entry across all terminals.
            </p>
          </div>

        </div>

      </div>

      {/* ─── Active Gates Grid ─── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Server size={17} className="text-indigo-400" />
            <h2 className="text-base font-extrabold tracking-tight">Active Gate Ingress Stations</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            4 Gates Operational • 9 Scanning Terminals Connected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {gateStats.map((gate) => {
            const isSelected = selectedGateFilter === gate.name;
            return (
              <div
                key={gate.id}
                onClick={() => setSelectedGateFilter(isSelected ? 'ALL' : gate.name)}
                className={`p-4 rounded-2xl bg-white dark:bg-[#111113] border transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20 shadow-md'
                    : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                {/* Top Badge & Status */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${gate.colorClass}`}>
                    {gate.terminalId}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {gate.status}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                    {gate.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate">{gate.role}</p>
                </div>

                {/* Gate KPIs */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Scans Ingress</span>
                    <span className="font-extrabold font-mono-numbers text-slate-900 dark:text-white">
                      {gate.totalScans}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Velocity</span>
                    <span className="font-extrabold font-mono-numbers text-indigo-500 dark:text-indigo-400">
                      ~{gate.velocity} / min
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Terminals</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {gate.scanners} active
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Last Scan</span>
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                      {gate.lastScan}
                    </span>
                  </div>
                </div>

                {/* Click to filter hint */}
                <div className="mt-3 pt-2 text-[10px] font-semibold text-center text-slate-400 group-hover:text-indigo-400 transition-colors">
                  {isSelected ? '✓ Filtering Live Audit' : 'Click to filter audit feed'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Live Check-In Audit Feed ─── */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/10 shadow-xs">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Radio size={16} className="text-indigo-400 animate-pulse" />
              <h2 className="text-base font-extrabold tracking-tight">Real-Time Ingress Audit Feed</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 font-mono">
                {filteredLogs.length} events
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Continuous live stream of gate transactions, signature validations, and access approvals.
            </p>
          </div>

          {/* Search & Outcome Filtering */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search guest or token..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44"
              />
            </div>

            {/* Outcome Filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-900 p-0.5 rounded-xl border border-slate-200 dark:border-zinc-800">
              {['ALL', 'SUCCESS', 'DUPLICATE', 'INVALID'].map((outcome) => (
                <button
                  key={outcome}
                  onClick={() => setOutcomeFilter(outcome)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    outcomeFilter === outcome
                      ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {outcome}
                </button>
              ))}
            </div>

            {/* Gate Filter Reset if active */}
            {selectedGateFilter !== 'ALL' && (
              <button
                onClick={() => setSelectedGateFilter('ALL')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors cursor-pointer"
              >
                Clear Gate Filter ({selectedGateFilter})
              </button>
            )}
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-2.5 pr-4">Timestamp</th>
                <th className="py-2.5 pr-4">Attendee / Bearer</th>
                <th className="py-2.5 pr-4">Tier Badge</th>
                <th className="py-2.5 pr-4">Seating / Table</th>
                <th className="py-2.5 pr-4">Gate Station</th>
                <th className="py-2.5 pr-4">Terminal</th>
                <th className="py-2.5 pr-4">Security Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No ingress audit logs match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.slice(0, 25).map((log) => {
                  const tierConfig = TIER_BADGES[log.tier] || TIER_BADGES.REGULAR;
                  const TierIcon = tierConfig.icon;

                  let outcomeBadge;
                  if (log.outcome === 'SUCCESS') {
                    outcomeBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                        <CheckCircle2 size={11} />
                        Valid Pass
                      </span>
                    );
                  } else if (log.outcome === 'DUPLICATE') {
                    outcomeBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/30">
                        <AlertOctagon size={11} />
                        Duplicate Replay Blocked
                      </span>
                    );
                  } else {
                    outcomeBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <ShieldAlert size={11} />
                        Invalid / Forged
                      </span>
                    );
                  }

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-zinc-900/50 transition-colors group"
                    >
                      {/* Timestamp */}
                      <td className="py-3 pr-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>

                      {/* Attendee */}
                      <td className="py-3 pr-4">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{log.guestName}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {log.guestId}
                        </div>
                      </td>

                      {/* Tier Badge */}
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${tierConfig.bg}`}>
                          <TierIcon size={10} />
                          {log.tier}
                        </span>
                      </td>

                      {/* Seating / Table */}
                      <td className="py-3 pr-4 text-slate-600 dark:text-slate-300 font-medium">
                        {log.table || 'General'}
                      </td>

                      {/* Gate Station */}
                      <td className="py-3 pr-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {log.gate}
                      </td>

                      {/* Terminal ID */}
                      <td className="py-3 pr-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {log.scannerId}
                      </td>

                      {/* Security Result */}
                      <td className="py-3 pr-4 whitespace-nowrap">
                        {outcomeBadge}
                        {log.message && (
                          <div className="text-[9px] text-red-400/90 mt-0.5 font-mono">
                            {log.message}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
      )}

    </div>
  );
};

export default LiveGatesPage;
