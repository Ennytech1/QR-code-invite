import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Users, UserPlus, ArrowLeft, ArrowRight, Sparkles, Check,
  QrCode, Smartphone, MessageCircle, FileSpreadsheet, Upload,
  UploadCloud, Trash2, CheckCircle2, ShieldCheck, Calendar,
  MapPin, Clock, Eye, AlertCircle, Copy, HelpCircle, Layers,
  ExternalLink, FileText, CheckCircle, Flame
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEvents } from '../context/EventContext';

const TIERS = [
  { id: 'VVIP', label: 'VVIP', color: 'from-purple-500 to-indigo-600', badge: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30' },
  { id: 'VIP', label: 'VIP', color: 'from-indigo-500 to-violet-600', badge: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30' },
  { id: 'REGULAR', label: 'Regular', color: 'from-slate-500 to-slate-700', badge: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30' },
  { id: 'HIGH TABLE', label: 'High Table', color: 'from-amber-500 to-amber-600', badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' },
  { id: 'MEDIA', label: 'Media / Press', color: 'from-cyan-500 to-blue-600', badge: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30' },
  { id: 'VENDOR', label: 'Vendor / Crew', color: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' },
];

const AddGuestPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventParam = searchParams.get('eventId') || searchParams.get('event');

  const { events, activeEventId, setActiveEventId, addGuest, bulkAddGuests, guests } = useEvents();

  // Selected Target Event
  const [selectedEventId, setSelectedEventId] = useState(
    eventParam || activeEventId || events[0]?.id || ''
  );

  // Tab mode: 'single' | 'bulk'
  const [activeTab, setActiveTab] = useState('single');
  const [previewTab, setPreviewTab] = useState('pass'); // 'pass' | 'whatsapp'

  // Single Guest form state
  const [singleName, setSingleName] = useState('');
  const [singlePhone, setSinglePhone] = useState('+234 ');
  const [singleEmail, setSingleEmail] = useState('');
  const [singleTier, setSingleTier] = useState('VIP');
  const [singleTable, setSingleTable] = useState('Table 4 • VIP Deck');
  const [plusOnes, setPlusOnes] = useState(0);
  const [autoDispatchWhatsApp, setAutoDispatchWhatsApp] = useState(true);

  // Bulk CSV state
  const [csvText, setCsvText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (eventParam && events.some((e) => e.id === eventParam)) {
      setSelectedEventId(eventParam);
      setActiveEventId(eventParam);
    } else if (!selectedEventId && events[0]?.id) {
      setSelectedEventId(events[0].id);
    }
  }, [eventParam, events]);

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0] || {
    id: 'evt_fallback',
    name: 'Event Campaign',
    type: 'PRIVATE',
    date: 'Oct 24, 2026',
    time: '18:00',
    venue: 'Eko Convention Centre, Lagos',
    capacity: 500,
    banner: '/images/hero/hero_gala.jpg',
    hostName: 'Organizer',
    cardTheme: 'luxury-gold',
    dressCode: 'Black Tie',
    customMessage: 'We cordially request the honor of your presence.',
  };

  const eventGuestCount = guests[currentEvent.id]?.length || 0;
  const capacityPct = Math.min(100, Math.round((eventGuestCount / (currentEvent.capacity || 500)) * 100));

  // Handle Single Guest Submission
  const handleSingleSubmit = (e) => {
    e.preventDefault();
    if (!singleName.trim()) {
      toast.error('Please enter the guest full name');
      return;
    }

    try {
      const newGuest = addGuest(currentEvent.id, {
        name: singleName.trim(),
        email: singleEmail.trim(),
        phone: singlePhone.trim(),
        tier: singleTier,
        table: singleTable.trim() || (currentEvent.type === 'PRIVATE' ? 'Table Reserved' : 'General Admission'),
        plusOnes: Number(plusOnes) || 0,
      });

      toast.success(`Guest "${singleName}" enrolled! Cryptographic QR Pass signed.`);

      if (autoDispatchWhatsApp && singlePhone && singlePhone.length > 5) {
        toast(`WhatsApp invitation card ready for dispatch to ${singlePhone}`, {
          icon: '💬',
        });
      }

      // Reset form or navigate to guests roster
      setSingleName('');
      setSingleEmail('');
      setSinglePhone('+234 ');
      navigate(`/guests?eventId=${currentEvent.id}`);
    } catch (err) {
      toast.error('Failed to add guest: ' + err.message);
    }
  };

  // Parse CSV records in real-time
  const parsedRecords = React.useMemo(() => {
    if (!csvText.trim()) return [];
    const lines = csvText.trim().split('\n');
    const records = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      // Skip header if first line looks like header
      if (i === 0 && line.toLowerCase().includes('name') && line.toLowerCase().includes('phone')) {
        continue;
      }
      const parts = line.split(',').map((p) => p.trim());
      if (parts[0]) {
        records.push({
          id: 'row_' + i,
          name: parts[0] || '',
          email: parts[1] || '',
          phone: parts[2] || '',
          tier: (parts[3] || 'VIP').toUpperCase(),
          table: parts[4] || 'Table Reserved',
          plusOnes: Number(parts[5]) || 0,
        });
      }
    }
    return records;
  }, [csvText]);

  // Load sample demo batch
  const handleLoadSampleBatch = () => {
    const demoBatch = `Dr. Amina Yusuf, amina.yusuf@acme.ng, +2348031234567, VVIP, Table 1 High Table, 1
Chief Chinedu Eze, chinedu.eze@lagos.org, +2348059876543, VIP, Table 4 VIP Deck, 0
Fatima Aliyu, fatima.aliyu@fintech.io, +2348071122334, Regular, Table 8 Colleagues, 1
Olumide Bakare, o.bakare@media.ng, +2348123344556, Media, Press Gallery Desk, 0
Hajiya Zainab Bello, z.bello@invest.ng, +2348099887766, VVIP, Table 2 High Table, 1`;

    setCsvText(demoBatch);
    toast.success('Loaded 5 sample attendees! Inspect the table preview below.');
  };

  // Handle CSV file upload
  const handleFileUpload = (file) => {
    if (!file) return;
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      toast.error('Please upload a valid .csv file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (text) {
        setCsvText(text);
        toast.success(`Imported "${file.name}" with ${text.split('\n').filter(Boolean).length} lines!`);
      }
    };
    reader.readAsText(file);
  };

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    if (parsedRecords.length === 0) {
      toast.error('No valid guest records found to import');
      return;
    }

    try {
      bulkAddGuests(currentEvent.id, parsedRecords);
      toast.success(`Successfully enrolled ${parsedRecords.length} attendees with signed QR passes!`);
      navigate(`/guests?eventId=${currentEvent.id}`);
    } catch (err) {
      toast.error('Failed to import guest list: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-24 font-body text-slate-800 dark:text-slate-100 max-w-6xl mx-auto px-3 sm:px-4">
      
      {/* ─── Breadcrumb & Top Bar ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <Link
            to={`/guests?eventId=${currentEvent.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-2 group transition-colors"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Guest Roster</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-heading">
              Add Guests & Generate Passes
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 font-mono shadow-2xs">
              Studio Page
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enroll individual VIP guests or batch import 500+ attendees via CSV with automatic Ed25519 cryptographic pass generation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/guests?eventId=${currentEvent.id}`)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
        >
          Cancel & Exit
        </button>
      </div>

      {/* ─── Target Event Hero Selector Strip ─── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0c0e14] border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-13 h-13 rounded-2xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-800 shadow-sm relative">
            <img src={currentEvent.banner || '/images/hero/hero_concert.jpg'} alt="Event Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/25" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                currentEvent.type === 'PRIVATE'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                  : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30'
              }`}>
                {currentEvent.type === 'PRIVATE' ? '🔒 PRIVATE VIP' : '🌍 PUBLIC'}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                {currentEvent.date} • {currentEvent.time}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate font-heading mt-0.5">
              {currentEvent.name}
            </h2>
            <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
              <MapPin size={11} className="text-rose-500 shrink-0" />
              <span>{currentEvent.venue}</span>
            </p>
          </div>
        </div>

        {/* Change Target Event Dropdown */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-full sm:w-64">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Change Target Event
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                setActiveEventId(e.target.value);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer shadow-2xs"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  [{evt.type}] {evt.name} ({evt.date})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ─── Mode Switcher Tabs (Single vs Bulk) ─── */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('single')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === 'single'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm scale-102'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus size={14} />
            <span>Single Guest Entry</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bulk')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === 'bulk'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm scale-102'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileSpreadsheet size={14} />
            <span>Bulk CSV Import (100+ Guests)</span>
            <span className="px-1.5 py-0.2 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
              Fast
            </span>
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden md:block">
          Enrolled: <strong className="text-slate-900 dark:text-white">{eventGuestCount}</strong> / {currentEvent.capacity} ({capacityPct}%)
        </span>
      </div>

      {/* ─── Main Content Grid: Form (Col-7) + Live Preview Dock (Col-5) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: FORM CONTROLS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* TAB 1: SINGLE GUEST FORM */}
          {activeTab === 'single' && (
            <form onSubmit={handleSingleSubmit} className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 animate-fade-in-scale">
              
              <div>
                <span className="text-[11px] font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                  INDIVIDUAL VIP ENROLLMENT
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5 font-heading">
                  Attendee Identity & Access Level
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Fill in the guest credentials to generate their encrypted mobile pass.
                </p>
              </div>

              {/* Guest Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Guest Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Kelechi Okafor & Spouse"
                    value={singleName}
                    onChange={(e) => setSingleName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-semibold transition-all"
                  />
                  {singleName && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {singleName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    WhatsApp Phone Number <span className="text-emerald-500">• Direct Pass Delivery</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+234 803 000 0000"
                    value={singlePhone}
                    onChange={(e) => setSinglePhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={singleEmail}
                    onChange={(e) => setSingleEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
              </div>

              {/* Access Tier Chips */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Select Access Tier
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TIERS.map((tier) => {
                    const isSelected = singleTier === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setSingleTier(tier.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-xs scale-102'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {tier.label}
                        </span>
                        {isSelected && <Check size={14} className="text-indigo-600 dark:text-indigo-400 animate-count-pulse" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Table / Seating & Plus-Ones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Table / Seat Assignment
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Table 4 • VIP Deck"
                    value={singleTable}
                    onChange={(e) => setSingleTable(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Plus-One Allowance
                  </label>
                  <select
                    value={plusOnes}
                    onChange={(e) => setPlusOnes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 cursor-pointer transition-all"
                  >
                    <option value={0}>Strictly 1 Pass (No Plus-Ones)</option>
                    <option value={1}>1 Guest Allowed (+1)</option>
                    <option value={2}>2 Guests Allowed (+2)</option>
                    <option value={3}>3 Guests Allowed (+3)</option>
                  </select>
                </div>
              </div>

              {/* Auto WhatsApp Dispatch Checkbox */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MessageCircle size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                      Auto-generate WhatsApp Card
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Creates the luxury JPEG pass ready for 1-click dispatch to this phone number.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={autoDispatchWhatsApp}
                  onChange={(e) => setAutoDispatchWhatsApp(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => navigate(`/guests?eventId=${currentEvent.id}`)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102"
                >
                  <ArrowLeft size={13} />
                  <span>Cancel</span>
                </button>

                <button
                  type="submit"
                  className="px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition-all cursor-pointer active:scale-95 group"
                >
                  <Sparkles size={15} className="text-amber-300 group-hover:rotate-12 transition-transform" />
                  <span>Add Guest & Sign Cryptographic Pass</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </form>
          )}

          {/* TAB 2: BULK CSV INGESTION */}
          {activeTab === 'bulk' && (
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-fade-in-scale">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                    BULK CSV INGESTION (500+ ATTENDEES)
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5 font-heading">
                    Import Roster Spreadsheet
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload or paste CSV rows in the format: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">Name, Email, Phone, Tier, Table, PlusOnes</code>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLoadSampleBatch}
                  className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 transition-all cursor-pointer shadow-2xs hover:scale-102 shrink-0 flex items-center gap-1.5"
                >
                  <Copy size={13} />
                  <span>Load 5-VIP Demo Sample</span>
                </button>
              </div>

              {/* Drag & Drop File Zone */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, text/plain"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
                className="hidden"
              />

              <div
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFileUpload(e.dataTransfer.files?.[0]);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`rounded-2xl border-2 border-dashed p-6 sm:p-7 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[1.01]'
                    : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50/70 dark:bg-slate-900/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-2.5 shadow-xs animate-float">
                  <UploadCloud size={24} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  <span className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2">Click to browse file</span> or drop your CSV document here
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Standard comma-separated format (.csv) • UTF-8 encoded
                </p>
              </div>

              {/* CSV Raw Text Area */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Or Paste CSV Content Directly
                  </label>
                  {csvText && (
                    <button
                      type="button"
                      onClick={() => setCsvText('')}
                      className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Clear Input
                    </button>
                  )}
                </div>
                <textarea
                  rows={5}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder={`Dr. Amina Yusuf, amina.yusuf@acme.ng, +2348031234567, VVIP, Table 1 High Table, 1\nChief Chinedu Eze, chinedu.eze@lagos.org, +2348059876543, VIP, Table 4 VIP Deck, 0`}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>

              {/* Real-time Parsed Table Preview */}
              {parsedRecords.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500 animate-count-pulse" />
                      <span>Parsed Records Ready ({parsedRecords.length})</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Review column data before submitting
                    </span>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
                    <div className="max-h-56 overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="sticky top-0 bg-slate-100 dark:bg-slate-900 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="py-2 px-3">Name</th>
                            <th className="py-2 px-3">Phone</th>
                            <th className="py-2 px-3">Tier</th>
                            <th className="py-2 px-3">Table</th>
                            <th className="py-2 px-3 text-center">+1s</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-[#0c0e14]">
                          {parsedRecords.map((r, i) => (
                            <tr key={r.id || i} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                              <td className="py-2 px-3 font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                                {r.name}
                              </td>
                              <td className="py-2 px-3 font-mono text-[11px] text-slate-500">
                                {r.phone || '—'}
                              </td>
                              <td className="py-2 px-3">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40">
                                  {r.tier}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-slate-600 dark:text-slate-300 truncate max-w-[120px]">
                                {r.table}
                              </td>
                              <td className="py-2 px-3 text-center font-bold text-slate-700 dark:text-slate-300">
                                {r.plusOnes}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Bulk Submit CTA */}
              <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => navigate(`/guests?eventId=${currentEvent.id}`)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102"
                >
                  <ArrowLeft size={13} />
                  <span>Cancel</span>
                </button>

                <button
                  type="button"
                  onClick={handleBulkSubmit}
                  disabled={parsedRecords.length === 0}
                  className={`px-7 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xl transition-all cursor-pointer active:scale-95 group ${
                    parsedRecords.length > 0
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-600/30'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Sparkles size={15} className="text-amber-300 group-hover:rotate-12 transition-transform" />
                  <span>Import {parsedRecords.length} Attendees & Sign Passes</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: REAL-TIME PASS & WHATSAPP PREVIEW DOCK */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          
          {/* Preview Mode Switcher */}
          <div className="p-1 rounded-2xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 pl-3 uppercase tracking-wider flex items-center gap-1.5">
              <Eye size={13} className="text-indigo-500" />
              <span>Real-time Pass Dock</span>
            </span>

            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setPreviewTab('pass')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  previewTab === 'pass'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Holographic Pass
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('whatsapp')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  previewTab === 'whatsapp'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                WhatsApp Card
              </button>
            </div>
          </div>

          {/* VIEW 1: MOBILE HOLOGRAPHIC PASS WITH SHIMMER FOIL */}
          {previewTab === 'pass' && (
            <div className="rounded-3xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e14] shadow-xl flex justify-center">
              <div className="w-full max-w-[280px] rounded-2xl p-4 bg-gradient-to-b from-amber-900/60 via-black to-slate-950 border border-amber-500/50 text-white shadow-2xl space-y-3 relative overflow-hidden transition-all duration-500 animate-float">
                
                {/* Dynamic Holographic Foil Light Sweep */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-foil-shimmer" />

                <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-300">
                    VIP Digital Gate Pass
                  </span>
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-emerald-300">
                    ED25519 VERIFIED
                  </span>
                </div>

                <div className="text-center py-1 relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                    {currentEvent.name}
                  </p>
                  <h4 className="text-sm font-extrabold text-white truncate drop-shadow-md">
                    {singleName.trim() || 'Attendee Name'}
                  </h4>
                  <p className="text-[10px] text-white/80 mt-0.5">
                    {currentEvent.date} • {currentEvent.venue}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white text-slate-900 flex flex-col items-center justify-center space-y-1 shadow-md relative z-10">
                  <QrCode size={110} strokeWidth={2} className="text-slate-900" />
                  <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500">
                    SECURE-PASS-{Math.abs((singleName || 'pass').split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString().slice(0, 4)}
                  </span>
                </div>

                <div className="pt-1 text-center space-y-0.5 relative z-10">
                  <p className="text-[11px] font-extrabold text-white">
                    {singleTier} Access • {singleTable || 'Table Reserved'}
                  </p>
                  <p className="text-[10px] font-bold text-amber-300">
                    {plusOnes > 0 ? `+${plusOnes} Plus-One Allowance` : 'Single Admission (No Plus-Ones)'}
                  </p>
                  <p className="text-[9px] text-white/50 italic">
                    Anti-screenshot replay lock enabled
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: WHATSAPP MESSAGE DISPATCH PREVIEW */}
          {previewTab === 'whatsapp' && (
            <div className="rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e14] shadow-xl space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                  <MessageCircle size={15} />
                  <span>WhatsApp Message Template</span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900 text-slate-800 dark:text-slate-200 font-sans space-y-2 shadow-2xs">
                  <p className="font-bold">
                    Hello {singleName.trim() || 'Honored Guest'},
                  </p>
                  <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                    {currentEvent.customMessage || 'We cordially request the honor of your presence.'}
                  </p>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-mono text-[10.5px] space-y-0.5">
                    <p>📍 <strong>Event:</strong> {currentEvent.name}</p>
                    <p>📅 <strong>Date:</strong> {currentEvent.date} ({currentEvent.time})</p>
                    <p>🪑 <strong>Seating:</strong> {singleTable || 'Table Reserved'}</p>
                    <p>👔 <strong>Dress Code:</strong> {currentEvent.dressCode || 'Formal'}</p>
                  </div>
                  <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold underline cursor-pointer">
                    👉 Tap here to reveal your dynamic gate pass
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cryptographic Gate Verification Pill */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-500/20 text-xs space-y-1.5 text-indigo-950 dark:text-indigo-200 shadow-2xs">
            <p className="font-bold flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300">
              <ShieldCheck size={15} />
              <span>Cryptographic Ed25519 Gate Verification</span>
            </p>
            <p className="text-[11.5px] leading-relaxed text-slate-600 dark:text-slate-300">
              Pass tokens are digitally signed with your organizer private key. Venue turnstiles scan and validate passes in &lt;15ms even completely offline without internet.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AddGuestPage;

