import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Calendar, MapPin, Users, Ticket, ArrowUpRight, TrendingUp,
  Download, QrCode, Search, Filter, CheckCircle2, Clock,
  Zap, Radio, ChevronDown, Check, Sparkles, ExternalLink,
  ChevronRight, RefreshCw, AlertTriangle, ChevronsUpDown,
  Bell, Plus, Command, FileSpreadsheet, Activity, Flame,
  Share2, Shield, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import ScannerModal from '../modals/ScannerModal';
import NewEventModal from '../modals/NewEventModal';

const EventManageOverview = ({ 
  selectedEventId, 
  onSelectEvent, 
  onBackToCatalog, 
  onOpenNewEvent 
}) => {
  const navigate = useNavigate();
  const { 
    events, 
    guests, 
    activeEventId, 
    setActiveEventId, 
    checkInLogs 
  } = useEvents();

  // Active event resolution
  const currentEventId = selectedEventId || activeEventId || events[0]?.id;
  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === currentEventId) || events[0] || {};
  }, [events, currentEventId]);

  // UI Interactive States
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('1h'); // '15m' | '1h' | 'full'
  const [selectedGateFilter, setSelectedGateFilter] = useState('ALL'); // 'ALL' | '1' | '2' | '3' | '4' | '5' | '6'
  const [recentSearchQuery, setRecentSearchQuery] = useState('');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [newEventModalOpen, setNewEventModalOpen] = useState(false);
  const [viewAllModalOpen, setViewAllModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setEventDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered events for top switcher
  const switcherEvents = useMemo(() => {
    if (!eventSearchQuery.trim()) return events;
    const q = eventSearchQuery.toLowerCase();
    return events.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        (e.category && e.category.toLowerCase().includes(q))
    );
  }, [events, eventSearchQuery]);

  // Event specific guests
  const eventGuests = useMemo(() => {
    return guests.filter((g) => g.eventId === currentEvent.id);
  }, [guests, currentEvent.id]);

  const checkedInGuests = useMemo(() => {
    return eventGuests.filter((g) => g.status === 'CHECKED_IN');
  }, [eventGuests]);

  // Derived metrics (with fallback to reference screenshot values if seed event)
  const isLeadershipSummit = currentEvent.id === 'evt_leadership_summit_2026';
  const totalInvited = currentEvent.capacity || (isLeadershipSummit ? 1250 : 500);
  const targetInvited = currentEvent.target || (isLeadershipSummit ? 1116 : Math.round(totalInvited * 0.9));
  const checkedInCount = isLeadershipSummit 
    ? (currentEvent.checkedIn || 842)
    : (checkedInGuests.length || currentEvent.checkedIn || Math.round(totalInvited * 0.65));
  
  const checkInPercent = Math.min(100, Math.round((checkedInCount / (totalInvited || 1)) * 100));
  const exactPercent = ((checkedInCount / (totalInvited || 1)) * 100).toFixed(1);
  const gateVelocity = currentEvent.gateVelocity || (isLeadershipSummit ? 24 : 18);
  const gatesCount = currentEvent.gatesCount || 6;

  // Recent activity stream
  const baseRecentActivity = useMemo(() => {
    // If it's the leadership summit or we have real checked in guests
    if (isLeadershipSummit) {
      return [
        {
          id: 'rec_1',
          name: 'Sarah Jenkins',
          initials: 'SJ',
          tier: 'VIP',
          tierType: 'vip',
          gate: 'Gate 1 • Main Entrance',
          time: 'Just now',
          verified: true,
          avatarBg: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
        },
        {
          id: 'rec_2',
          name: 'David Chen',
          initials: 'DC',
          tier: 'Delegate',
          tierType: 'delegate',
          gate: 'Gate 3 • West Wing',
          time: '45s ago',
          verified: true,
          avatarBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
        },
        {
          id: 'rec_3',
          name: 'Marcus Vance',
          initials: 'MV',
          tier: 'VIP',
          tierType: 'vip',
          gate: 'Gate 1 • Main Entrance',
          time: '2m ago',
          verified: true,
          avatarBg: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
        },
        {
          id: 'rec_4',
          name: 'Elena Rostova',
          initials: 'ER',
          tier: 'Speaker',
          tierType: 'speaker',
          gate: 'Gate 4 • VIP Expedited',
          time: '3m ago',
          verified: true,
          avatarBg: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
        },
        {
          id: 'rec_5',
          name: 'Chloe Martin',
          initials: 'CM',
          tier: 'Delegate',
          tierType: 'delegate',
          gate: 'Gate 2 • East Wing',
          time: '5m ago',
          verified: true,
          avatarBg: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
        },
        {
          id: 'rec_6',
          name: 'Alexander Kim',
          initials: 'AK',
          tier: 'VIP',
          tierType: 'vip',
          gate: 'Gate 1 • Main Entrance',
          time: '7m ago',
          verified: true,
          avatarBg: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
        },
      ];
    }

    if (checkedInGuests.length > 0) {
      return checkedInGuests.slice(0, 6).map((g, idx) => {
        const initials = g.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();
        const tierName = g.tier || 'VIP';
        const isVip = tierName.toUpperCase().includes('VIP');
        const isSpeaker = tierName.toUpperCase().includes('SPEAKER');
        return {
          id: g.id,
          name: g.name,
          initials: initials || 'GU',
          tier: isVip ? 'VIP' : isSpeaker ? 'Speaker' : 'Delegate',
          tierType: isVip ? 'vip' : isSpeaker ? 'speaker' : 'delegate',
          gate: g.gate || `Gate ${(idx % 4) + 1} • Main Entrance`,
          time: idx === 0 ? 'Just now' : `${idx * 2}m ago`,
          verified: true,
          avatarBg: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
        };
      });
    }

    // Default simulated stream for other events
    return [
      {
        id: 'rec_def_1',
        name: 'Chief Kelechi Okafor',
        initials: 'KO',
        tier: 'VIP',
        tierType: 'vip',
        gate: 'Gate 1 • Main Entrance',
        time: 'Just now',
        verified: true,
        avatarBg: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
      },
      {
        id: 'rec_def_2',
        name: 'Dr. Amina Yusuf',
        initials: 'AY',
        tier: 'Delegate',
        tierType: 'delegate',
        gate: 'Gate 3 • West Wing',
        time: '1m ago',
        verified: true,
        avatarBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
      },
      {
        id: 'rec_def_3',
        name: 'Emeka Oduya',
        initials: 'EO',
        tier: 'VIP',
        tierType: 'vip',
        gate: 'Gate 1 • Main Entrance',
        time: '3m ago',
        verified: true,
        avatarBg: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
      },
      {
        id: 'rec_def_4',
        name: 'Fatima Aliyu',
        initials: 'FA',
        tier: 'Speaker',
        tierType: 'speaker',
        gate: 'Gate 4 • VIP Expedited',
        time: '6m ago',
        verified: true,
        avatarBg: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
      },
    ];
  }, [isLeadershipSummit, checkedInGuests]);

  // Filtered recent activity
  const filteredRecentActivity = useMemo(() => {
    if (!recentSearchQuery.trim()) return baseRecentActivity;
    const q = recentSearchQuery.toLowerCase();
    return baseRecentActivity.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.tier.toLowerCase().includes(q) ||
        item.gate.toLowerCase().includes(q)
    );
  }, [baseRecentActivity, recentSearchQuery]);

  // Export handlers
  const handleExportReport = () => {
    const reportData = [
      ['Metric', 'Value'],
      ['Event Name', currentEvent.name],
      ['Date', currentEvent.date],
      ['Venue', currentEvent.venue],
      ['Total Invited', totalInvited],
      ['Checked In', checkedInCount],
      ['Arrival Rate', `${exactPercent}%`],
      ['Gate Velocity', `${gateVelocity} scans/min`],
      ['Active Gates', `${gatesCount} Gates Live`],
      ['Average Latency', '8ms'],
      ['Export Timestamp', new Date().toISOString()],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      reportData.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${currentEvent.name.replace(/\s+/g, '_')}_Overview_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Executive overview report downloaded for "${currentEvent.name}"!`);
  };

  const handleDownloadCheckinLog = () => {
    const headers = ['Guest Name', 'Badge Tier', 'Gate Terminal', 'Status', 'Timestamp'];
    const rows = filteredRecentActivity.map((item) => [
      item.name,
      item.tier,
      item.gate,
      'VERIFIED_ACTIVE',
      item.time,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${currentEvent.name.replace(/\s+/g, '_')}_Checkin_Log.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Attendee check-in log exported as CSV!');
  };

  // Event switch handler
  const handleSwitchEvent = (evt) => {
    setActiveEventId(evt.id);
    if (onSelectEvent) onSelectEvent(evt.id);
    setEventDropdownOpen(false);
    toast.success(`Switched to "${evt.name}" overview`);
  };

  return (
    <div className="space-y-6 animate-fade-in font-body text-slate-800 dark:text-slate-100">

      {/* ─────────────────────────────────────────────────────────────
          1. TOP APP BAR & EVENT SWITCHER (Matching Reference Image)
         ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#0c0e14] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl shadow-xs px-4 sm:px-6 pt-3.5 pb-0 transition-colors">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3.5">
          
          {/* Left: Brand Logo & Event Selector Dropdown */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            
            {/* QRInvite Brand Symbol */}
            <div className="flex items-center gap-2 pr-3 border-r border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
                <div className="grid grid-cols-2 gap-0.5 p-1.5">
                  <span className="w-1.5 h-1.5 rounded-[1px] bg-white"></span>
                  <span className="w-1.5 h-1.5 rounded-[1px] bg-white"></span>
                  <span className="w-1.5 h-1.5 rounded-[1px] bg-white"></span>
                  <span className="w-1.5 h-1.5 rounded-[1px] bg-white"></span>
                </div>
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                QR<span className="text-blue-600 dark:text-blue-400">Invite</span>
              </span>
            </div>

            {/* Dropdown Event Selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
                className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-900 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                title="Switch active event workspace"
              >
                <Calendar size={14} className="text-emerald-500 shrink-0" />
                <span className="max-w-[200px] sm:max-w-[280px] truncate font-bold">
                  {currentEvent.name || 'Annual Leadership Summit 2026'}
                </span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${eventDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Event Switcher Menu Popover */}
              {eventDropdownOpen && (
                <div className="absolute left-0 top-11 z-50 w-84 sm:w-96 rounded-2xl bg-white dark:bg-[#11131a] border border-slate-200 dark:border-slate-800 shadow-2xl p-2.5 animate-fade-down space-y-2">
                  <div className="p-1">
                    <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Switch Event Workspace
                      </span>
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                        {events.length} Events
                      </span>
                    </div>

                    {/* Filter Input */}
                    <div className="relative my-2">
                      <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={eventSearchQuery}
                        onChange={(e) => setEventSearchQuery(e.target.value)}
                        placeholder="Search event name or venue..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Events List */}
                  <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                    {switcherEvents.map((evt) => {
                      const isSelected = evt.id === currentEvent.id;
                      return (
                        <button
                          key={evt.id}
                          onClick={() => handleSwitchEvent(evt)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between group cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-900/80 border border-transparent'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                              <span>{evt.name}</span>
                              {evt.type === 'PRIVATE' ? (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 font-bold">
                                  RSVP
                                </span>
                              ) : (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-bold">
                                  TICKETED
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate mt-0.5">
                              {evt.date} • {evt.venue}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 px-1">
                    <button
                      onClick={() => {
                        setEventDropdownOpen(false);
                        if (onBackToCatalog) onBackToCatalog();
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold flex items-center gap-1"
                    >
                      <Eye size={12} />
                      <span>Browse Catalog</span>
                    </button>
                    <button
                      onClick={() => {
                        setEventDropdownOpen(false);
                        setNewEventModalOpen(true);
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={13} strokeWidth={2.5} />
                      <span>Create New Event</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right: Search, Create Event, Notifications, Alex Vance Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3 justify-end flex-wrap">
            
            {/* Search Attendees & Credentials */}
            <div className="hidden lg:flex items-center gap-2 h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs text-slate-400 w-64 focus-within:w-72 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
              <Search size={14} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search attendees, credentials, scanners..."
                className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 text-xs font-medium"
              />
              <kbd className="text-[10px] text-slate-400 font-mono bg-slate-200/60 dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-300/50 dark:border-slate-700 shrink-0">
                ⌘K
              </kbd>
            </div>

            {/* Create Event (Deep Blue Primary Button from Image) */}
            <button
              onClick={() => {
                if (onOpenNewEvent) onOpenNewEvent();
                else setNewEventModalOpen(true);
              }}
              className="h-9 px-3.5 sm:px-4 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-blue-700/20 active:scale-98 transition-all cursor-pointer"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Create Event</span>
            </button>

            {/* Notification Bell with Red Badge Dot */}
            <button
              onClick={() => toast('No unread gate breach alerts', { icon: '🔔' })}
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer relative shadow-2xs"
              title="Alert Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            </button>

            {/* User Profile: Dir. Alex Vance / Security Operations */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 cursor-pointer group">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                alt="Dir. Alex Vance"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 group-hover:ring-blue-500 transition-all"
              />
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Dir. Alex Vance
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  Security Operations
                </div>
              </div>
              <ChevronsUpDown size={14} className="text-slate-400 hidden sm:block group-hover:text-slate-600" />
            </div>

          </div>

        </div>

        {/* Secondary Navigation Tabs Row (Underline active indicator) */}
        <div className="flex items-center gap-6 sm:gap-8 border-t border-slate-100 dark:border-slate-800/80 pt-2 text-xs font-semibold overflow-x-auto no-scrollbar">
          {[
            { id: 'Dashboard', label: 'Dashboard', action: () => setActiveTab('Dashboard') },
            { id: 'Scanners', label: 'Scanners', action: () => setScannerOpen(true) },
            { id: 'Guest List', label: 'Guest List', action: () => navigate('/guests') },
            { id: 'Analytics', label: 'Analytics', action: () => toast('Analytics report view active', { icon: '📊' }) },
            { id: 'Settings', label: 'Settings', action: () => navigate('/settings') },
          ].map((tab) => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={tab.action}
                className={`pb-2.5 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isTabActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 dark:border-blue-400 -mb-[1px]'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>


      {/* ─────────────────────────────────────────────────────────────
          2. EVENT OVERVIEW HEADER BANNER (Title, Badges, Export & Scanner)
         ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        
        {/* Title, Verification Badges & Venue Subline */}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Event Overview
            </h1>

            {/* Live Verification Pill Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#d1fae5] dark:bg-emerald-950/60 text-[#065f46] dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE VERIFICATION</span>
            </span>

            {/* Gate Latency Operational Pill Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-100/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
              <Zap size={12} className="text-amber-500 fill-amber-500" />
              <span>{currentEvent.latency || '8ms'} • All {gatesCount} Gates Operational</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-slate-400" />
              <span>{currentEvent.date || 'Today, Oct 14'}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-slate-400" />
              <span>{currentEvent.venue || 'Grand Convention Center, Hall A & B'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Export Report & Launch Live Scanner */}
        <div className="flex items-center gap-2.5 self-start md:self-center">
          <button
            onClick={handleExportReport}
            className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Export Report</span>
          </button>

          <button
            onClick={() => setScannerOpen(true)}
            className="h-10 px-5 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-700/25 active:scale-98 transition-all cursor-pointer"
          >
            <QrCode size={15} strokeWidth={2.4} />
            <span>Launch Live Scanner</span>
          </button>
        </div>

      </div>


      {/* ─────────────────────────────────────────────────────────────
          3. FOUR KPI METRIC CARDS ROW (Exact Match from Design)
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

        {/* Card 1: TOTAL INVITED */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#11131a] border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                TOTAL INVITED
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
                <Ticket size={14} />
              </div>
            </div>
            <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white font-mono-numbers my-1">
              {totalInvited.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-2.5 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[11px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50">
              <TrendingUp size={11} strokeWidth={2.5} />
              <span>+12% vs target</span>
            </span>
            <span className="text-slate-400 text-[11px]">
              Target: {targetInvited.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Card 2: CHECKED-IN (With Radial Donut Ring Chart) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#11131a] border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                CHECKED-IN
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
                <Users size={14} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white font-mono-numbers">
                {checkedInCount.toLocaleString()}
              </div>

              {/* Radial Donut Progress Ring */}
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 54 54">
                  {/* Background Track */}
                  <circle
                    cx="27"
                    cy="27"
                    r="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  {/* Active Progress Stroke (Circumference ~ 138.2) */}
                  <circle
                    cx="27"
                    cy="27"
                    r="22"
                    fill="none"
                    stroke="#1d4ed8"
                    strokeWidth="5"
                    strokeDasharray={138.2}
                    strokeDashoffset={138.2 - (138.2 * checkInPercent) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="absolute font-black text-xs text-slate-800 dark:text-white">
                  {checkInPercent}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400">
            <span className="text-blue-600 dark:text-blue-400 font-extrabold mr-1">
              {exactPercent}%
            </span>
            arrived of {totalInvited.toLocaleString()}
          </div>
        </div>

        {/* Card 3: GATE VELOCITY (With Smooth Wave Sparkline) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#11131a] border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                GATE VELOCITY
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
                <Zap size={14} />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white font-mono-numbers">
                {gateVelocity}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                scans/min
              </span>
            </div>

            <div className="text-[11px] text-slate-400 dark:text-slate-500">
              Peak arrival window active
            </div>
          </div>

          {/* Fluid Wave Sparkline SVG */}
          <div className="mt-2 pt-1">
            <svg className="w-full h-8 overflow-visible" viewBox="0 0 200 32" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveSparkle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,26 C 30,25 50,22 80,18 C 110,14 130,22 150,12 C 170,4 185,12 200,10 L 200,32 L 0,32 Z"
                fill="url(#waveSparkle)"
              />
              <path
                d="M 0,26 C 30,25 50,22 80,18 C 110,14 130,22 150,12 C 170,4 185,12 200,10"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="200" cy="10" r="3.5" fill="#1d4ed8" />
            </svg>
          </div>
        </div>

        {/* Card 4: ACTIVE SCANNERS (With Gate Pills G1-G6) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#11131a] border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                ACTIVE SCANNERS
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
                <Radio size={14} />
              </div>
            </div>

            <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white my-1">
              {gatesCount} Gates Live
            </div>

            <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>100% online • 0 dropouts</span>
            </div>
          </div>

          {/* Interactive Gate Pill Buttons: G1, G2, G3, G4, G5, G6 */}
          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 overflow-x-auto no-scrollbar">
            {['G1', 'G2', 'G3', 'G4', 'G5', 'G6'].map((gateLabel, idx) => {
              const gateNum = String(idx + 1);
              const isSelected = selectedGateFilter === gateNum;
              return (
                <button
                  key={gateLabel}
                  onClick={() => {
                    const next = isSelected ? 'ALL' : gateNum;
                    setSelectedGateFilter(next);
                    toast.success(
                      next === 'ALL'
                        ? 'Viewing all operational gates'
                        : `Filtered to Gate ${gateNum} (Terminal #${gateNum}) • 0 latency drop`
                    );
                  }}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600'
                  }`}
                  title={`Gate ${gateLabel}: Operational (100% Online)`}
                >
                  {gateLabel}
                </button>
              );
            })}
          </div>
        </div>

      </div>


      {/* ─────────────────────────────────────────────────────────────
          4. MAIN SECTION: 2 COLUMNS (Live Gate Flow & Recent Activity)
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ─── LEFT COLUMN (~68% width): Live Gate Flow ─── */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-[#11131a] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          
          {/* Card Header & Chart Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                Live Gate Flow
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Real-time guest arrivals recorded per minute
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              {/* Time Range Toggles */}
              <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold">
                {[
                  { id: '15m', label: 'Last 15m' },
                  { id: '1h', label: 'Last 1h' },
                  { id: 'full', label: 'Full Event' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTimeRange(item.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                      timeRange === item.id
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Gates Filter Dropdown */}
              <div className="relative">
                <select
                  value={selectedGateFilter}
                  onChange={(e) => setSelectedGateFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="ALL">All Gates (1-6)</option>
                  <option value="1">Gate 1 - Main</option>
                  <option value="2">Gate 2 - East</option>
                  <option value="3">Gate 3 - West</option>
                  <option value="4">Gate 4 - VIP Expedited</option>
                  <option value="5">Gate 5 - Media</option>
                  <option value="6">Gate 6 - Executive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Peak Surge Alert Bar */}
          <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Zap size={12} className="fill-amber-500" />
              </div>
              <span className="text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white font-bold">Peak Surge:</strong> 38 scans/min recorded at 19:42 (Gate 1 - Main)
              </span>
            </div>
            <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px] self-end sm:self-auto">
              Throughput headroom: <strong className="text-emerald-600 dark:text-emerald-400">+42%</strong> remaining
            </span>
          </div>

          {/* High Fidelity SVG Smooth Area Chart with Peak Tooltip */}
          <div className="relative w-full pt-4 pb-2">
            
            {/* The SVG Chart */}
            <svg
              className="w-full h-64 overflow-visible"
              viewBox="0 0 680 240"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Vibrant Blue Gradient Fill */}
                <linearGradient id="gateFlowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
                  <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>

                {/* Grid line filter */}
                <pattern id="gridPattern" width="680" height="45" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="680" y2="0" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800" />
                </pattern>
              </defs>

              {/* Horizontal Grid Guidelines (0, 10, 20, 30, 40) */}
              {[
                { y: 25, label: '40' },
                { y: 70, label: '30' },
                { y: 115, label: '20' },
                { y: 160, label: '10' },
                { y: 205, label: '0' },
              ].map((grid) => (
                <g key={grid.y}>
                  <text
                    x="10"
                    y={grid.y + 4}
                    fill="currentColor"
                    className="text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500"
                  >
                    {grid.label}
                  </text>
                  <line
                    x1="35"
                    y1={grid.y}
                    x2="680"
                    y2={grid.y}
                    stroke="currentColor"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                    className="text-slate-200/90 dark:text-slate-800/80"
                  />
                </g>
              ))}

              {/* Secondary Baseline / Target Curve (Subtle dashed curve) */}
              <path
                d="M 35,200 C 120,195 240,185 360,175 C 460,165 560,160 675,158"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                strokeOpacity="0.6"
              />

              {/* Area Gradient Under Main Curve */}
              <path
                d="M 35,192 C 85,185 140,172 200,158 C 260,144 320,118 380,82 C 410,64 430,30 450,28 C 470,28 500,80 540,118 C 585,145 625,128 675,120 L 675,205 L 35,205 Z"
                fill="url(#gateFlowGradient)"
              />

              {/* Primary Curve (Smooth bezier) */}
              <path
                d="M 35,192 C 85,185 140,172 200,158 C 260,144 320,118 380,82 C 410,64 430,30 450,28 C 470,28 500,80 540,118 C 585,145 625,128 675,120"
                fill="none"
                stroke="#1d4ed8"
                strokeWidth="3.2"
                strokeLinecap="round"
                className="drop-shadow-xs"
              />

              {/* Vertical Dashed Line at Peak (x = 450) */}
              <line
                x1="450"
                y1="28"
                x2="450"
                y2="205"
                stroke="#2563eb"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                strokeOpacity="0.7"
              />

              {/* Peak Point Dot */}
              <circle cx="450" cy="28" r="5" fill="#1d4ed8" stroke="#ffffff" strokeWidth="2" />

              {/* Current Active Dot (End of line at x = 675, y = 120) */}
              <circle cx="675" cy="120" r="5" fill="#1d4ed8" stroke="#ffffff" strokeWidth="2" />
              <circle cx="675" cy="120" r="10" fill="#1d4ed8" fillOpacity="0.2" className="animate-ping" />
            </svg>

            {/* Peak Tooltip Popover (Positioned Exactly Above the Peak, x = ~66%) */}
            <div
              className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full"
              style={{ left: '66.2%', top: '22px' }}
            >
              <div className="bg-[#0f172a] text-white px-3 py-1.5 rounded-lg shadow-xl text-left border border-slate-700/80 min-w-[170px]">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>38 scans/min • Gate 1 Surge</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  19:42 peak recorded
                </div>
              </div>
            </div>

            {/* X-Axis Labels Row */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium pt-2 px-6">
              <span>18:30</span>
              <span>19:00</span>
              <span>19:15</span>
              <span>19:30</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                19:45 (Peak)
              </span>
              <span>20:00</span>
              <span>Current</span>
            </div>

          </div>

          {/* Bottom Gate Capacity Share Breakdown & Processing Speed */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Gate Capacity Share: Gate 1 (42%) • Gate 2 (18%) • Gate 3 (15%) • Gate 4 (13%) • Other (12%)
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                Average Processing: 1.4s
              </span>
            </div>

            {/* Segmented Horizontal Progress Bar */}
            <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800">
              <div className="h-full bg-[#1d4ed8]" style={{ width: '42%' }} title="Gate 1 (42%)" />
              <div className="h-full bg-[#0ea5e9]" style={{ width: '18%' }} title="Gate 2 (18%)" />
              <div className="h-full bg-[#14b8a6]" style={{ width: '15%' }} title="Gate 3 (15%)" />
              <div className="h-full bg-[#10b981]" style={{ width: '13%' }} title="Gate 4 (13%)" />
              <div className="h-full bg-[#64748b]" style={{ width: '12%' }} title="Other (12%)" />
            </div>
          </div>

        </div>


        {/* ─── RIGHT COLUMN (~32% width): Recent Activity Stream ─── */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-[#11131a] border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  Recent Activity
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live</span>
                </span>
              </div>

              <button
                onClick={() => setViewAllModalOpen(true)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                View All ({checkedInCount})
              </button>
            </div>

            {/* Stream of Live Check-in Entries */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-1">
              {filteredRecentActivity.map((guest) => {
                return (
                  <div
                    key={guest.id}
                    className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-50/70 dark:hover:bg-slate-900/40 -mx-2 px-2 rounded-xl transition-colors"
                  >
                    {/* Left: Avatar Initials + Name & Gate */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${guest.avatarBg}`}
                      >
                        {guest.initials}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {guest.name}
                          </span>
                          
                          {/* Badge Tier: VIP, Delegate, Speaker */}
                          {guest.tierType === 'vip' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300/40 uppercase">
                              VIP
                            </span>
                          )}
                          {guest.tierType === 'speaker' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-300/40 uppercase">
                              Speaker
                            </span>
                          )}
                          {guest.tierType === 'delegate' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase">
                              Delegate
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          {guest.gate}
                        </div>
                      </div>
                    </div>

                    {/* Right: Verified Status Pill & Timestamp */}
                    <div className="flex flex-col items-end shrink-0">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                        <CheckCircle2 size={10} strokeWidth={2.5} />
                        <span>Verified</span>
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                        {guest.time}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions: Filter Input & Download Check-in Log Button */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* Filter recent check-ins input */}
            <div className="relative">
              <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={recentSearchQuery}
                onChange={(e) => setRecentSearchQuery(e.target.value)}
                placeholder="Filter recent check-ins..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Download Check-in Log (CSV) Button */}
            <button
              onClick={handleDownloadCheckinLog}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <FileSpreadsheet size={14} />
              <span>Download Check-in Log (CSV)</span>
            </button>
          </div>

        </div>

      </div>


      {/* ─────────────────────────────────────────────────────────────
          5. MODALS INTEGRATION (Live Scanner, New Event, Full List)
         ───────────────────────────────────────────────────────────── */}
      <ScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />

      <NewEventModal
        isOpen={newEventModalOpen}
        onClose={() => setNewEventModalOpen(false)}
      />

      {/* View All Roster Modal */}
      {viewAllModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#11131a] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col animate-fade-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  Checked-in Attendees ({checkedInCount})
                </h3>
                <p className="text-xs text-slate-400">
                  {currentEvent.name} • Gate verified credentials
                </p>
              </div>
              <button
                onClick={() => setViewAllModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 pr-1">
              {filteredRecentActivity.map((guest) => (
                <div key={guest.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${guest.avatarBg}`}>
                      {guest.initials}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">{guest.name}</div>
                      <div className="text-[11px] text-slate-400">{guest.gate}</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 size={11} /> Verified
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setViewAllModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EventManageOverview;
