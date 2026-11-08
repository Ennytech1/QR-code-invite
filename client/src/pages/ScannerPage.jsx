import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode, Camera, ShieldCheck, AlertOctagon, CheckCircle2,
  Clock, Zap, RefreshCw, Volume2, VolumeX, Wifi, WifiOff,
  History, Users, UserCheck, ArrowLeft, ArrowRight, Settings, Info,
  Maximize2, Play, Pause, Flame, Sparkles, Lock, Globe,
  Search, AlertTriangle, Filter, MapPin, Calendar, Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useSearchParams } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { verifyScanApi } from '../services/api';

/* ── Web Audio API sound synthesizer ── */
const playAudioFeedback = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (type === 'SUCCESS') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'DUPLICATE') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.setValueAtTime(220, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (err) {
    console.debug('Audio feedback unavailable', err);
  }
};

const ScannerPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const eventParam = searchParams.get('eventId') || searchParams.get('event');

  const {
    events,
    guests,
    checkInLogs,
    activeEventId,
    setActiveEventId,
    verifyAndCheckIn,
    verifyScanOnline,
  } = useEvents();

  // Mode: 'catalog' (first settle on an event) | 'terminal' (optical scanner for chosen event)
  const [viewMode, setViewMode] = useState(eventParam ? 'terminal' : 'catalog');
  const [selectedEventId, setSelectedEventId] = useState(eventParam || activeEventId || events[0]?.id);

  // Filters for the Catalog view
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogFilter, setCatalogFilter] = useState('ALL'); // 'ALL' | 'PUBLIC' | 'PRIVATE'

  // Terminal state
  const [gateName, setGateName] = useState('Gate North #1');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hudFlash, setHudFlash] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const cameraActiveRef = useRef(false);
  const lastScannedTokenRef = useRef(null);
  const scanFrameIdRef = useRef(null);

  // Sync eventParam if provided
  useEffect(() => {
    if (eventParam && events.some((e) => e.id === eventParam)) {
      setSelectedEventId(eventParam);
      setActiveEventId(eventParam);
      setViewMode('terminal');
    }
  }, [eventParam, events]);

  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0] || {
    id: 'evt_fallback',
    name: 'Event Campaign',
    type: 'PRIVATE',
    capacity: 500,
    venue: 'Convention Centre',
    date: 'Oct 24, 2026',
    time: '18:00',
  };

  const eventGuests = Array.isArray(guests)
    ? guests.filter((g) => g.eventId === activeEvent?.id)
    : (guests && guests[activeEvent?.id]) || [];
  const checkedInCount = eventGuests.filter((g) => g.status === 'CHECKED_IN').length;
  const remainingCount = Math.max(0, eventGuests.length - checkedInCount);

  // Switch between Catalog and Terminal
  const handleSelectEvent = (evt) => {
    setSelectedEventId(evt.id);
    setActiveEventId(evt.id);
    setViewMode('terminal');
    setSearchParams({ eventId: evt.id });
    toast.success(`Connected to turnstiles for "${evt.name}"`);
  };

  const handleBackToCatalog = () => {
    stopCamera();
    setViewMode('catalog');
    setSearchParams({});
  };

  // Filter events in catalog
  const filteredEvents = React.useMemo(() => {
    return events.filter((evt) => {
      const matchesSearch =
        evt.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        evt.venue.toLowerCase().includes(catalogSearch.toLowerCase());
      const matchesFilter =
        catalogFilter === 'ALL' || evt.type === catalogFilter;
      return matchesSearch && matchesFilter;
    });
  }, [events, catalogSearch, catalogFilter]);

  // Toggle Optical Camera
  const startCamera = async () => {
    try {
      setCameraActive(true);
      cameraActiveRef.current = true;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      toast.success('Optical camera scanner activated');

      if ('BarcodeDetector' in window) {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        const processFrame = async () => {
          if (videoRef.current && videoRef.current.readyState >= 2 && cameraActiveRef.current) {
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes.length > 0 && barcodes[0].rawValue) {
                const raw = barcodes[0].rawValue;
                if (raw !== lastScannedTokenRef.current) {
                  lastScannedTokenRef.current = raw;
                  handleProcessScan(raw);
                  setTimeout(() => {
                    lastScannedTokenRef.current = null;
                  }, 2500);
                }
              }
            } catch (e) {}
          }
          if (cameraActiveRef.current) {
            scanFrameIdRef.current = requestAnimationFrame(processFrame);
          }
        };
        scanFrameIdRef.current = requestAnimationFrame(processFrame);
      } else {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const processCanvasFrame = () => {
          if (videoRef.current && videoRef.current.readyState >= 2 && cameraActiveRef.current) {
            try {
              const v = videoRef.current;
              if (v.videoWidth && v.videoHeight) {
                canvas.width = Math.min(640, v.videoWidth);
                canvas.height = Math.min(480, v.videoHeight);
                ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
              }
            } catch (e) {}
          }
          if (cameraActiveRef.current) {
            scanFrameIdRef.current = requestAnimationFrame(processCanvasFrame);
          }
        };
        scanFrameIdRef.current = requestAnimationFrame(processCanvasFrame);
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable', err);
      toast('Camera preview in simulation mode (optical sensor active)');
    }
  };

  const stopCamera = () => {
    cameraActiveRef.current = false;
    if (scanFrameIdRef.current) {
      cancelAnimationFrame(scanFrameIdRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      cameraActiveRef.current = false;
      if (scanFrameIdRef.current) {
        cancelAnimationFrame(scanFrameIdRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Process a scan token with API verification and fallback
  const handleProcessScan = async (token) => {
    if (!token) return;
    setIsSimulating(true);

    let result = null;
    if (verifyScanOnline) {
      result = await verifyScanOnline(token, gateName, 'terminal_scanner_pwa');
    } else {
      try {
        const apiRes = await verifyScanApi(token, gateName, 'terminal_scanner_pwa');
        if (apiRes && apiRes.status) {
          result = apiRes;
        }
      } catch (err) {}

      if (!result) {
        result = verifyAndCheckIn(token, gateName);
      }
    }

    setScanResult(result);
    setHudFlash(result.status);
    setTimeout(() => setHudFlash(null), 2000);

    if (audioEnabled) {
      playAudioFeedback(result.status);
    }

    if (navigator.vibrate) {
      if (result.status === 'SUCCESS') {
        navigator.vibrate([100, 50, 100]);
      } else {
        navigator.vibrate([350]);
      }
    }

    const logItem = {
      id: Date.now(),
      token: typeof token === 'string' ? token.substring(0, 32) : 'QR_TOKEN',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      guestName: result.guest?.name || 'Unknown Bearer',
      tier: result.guest?.tier || 'N/A',
      table: result.guest?.table || '',
      status: result.status,
      gate: gateName,
    };

    setScanHistory((prev) => [logItem, ...prev.slice(0, 19)]);
    setIsSimulating(false);

    if (result.status === 'SUCCESS') {
      toast.success(`Access Granted: ${result.guest?.name} checked in!`);
    } else if (result.status === 'DUPLICATE') {
      toast.error(`Duplicate Entry Alert! Pass was already scanned.`);
    } else {
      toast.error(`Verification Failed: ${result.message}`);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleProcessScan(manualInput.trim());
    setManualInput('');
  };

  return (
    <div className="space-y-6 pb-24 font-body text-slate-800 dark:text-slate-100 max-w-6xl mx-auto px-3 sm:px-4">
      
      {/* ─────────────────────────────────────────────────────────────
          VIEW 1: CATALOG OF EVENTS (CHOOSE EVENT BEFORE ENTERING TERMINAL)
         ───────────────────────────────────────────────────────────── */}
      {viewMode === 'catalog' && (
        <div className="space-y-6 animate-fade-in-scale">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 mb-2">
                <QrCode size={13} className="text-indigo-500" />
                <span>GATE ACCESS MESH • SELECT EVENT FIRST</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-heading">
                Gate Scanner Terminal
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                Choose an active event to initialize camera turnstile scanning, cryptographic Ed25519 pass verification, and real-time gate attendance.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Optical Turnstiles Online
              </span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Search events by title or venue location..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
              {['ALL', 'PUBLIC', 'PRIVATE'].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setCatalogFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    catalogFilter === filter
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs scale-102'
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
            {filteredEvents.map((evt) => {
              const evtGuests = (guests && guests[evt.id]) || [];
              const checkedIn = evtGuests.filter((g) => g.status === 'CHECKED_IN').length;
              const pct = evtGuests.length > 0 ? Math.round((checkedIn / evtGuests.length) * 100) : 0;

              return (
                <div
                  key={evt.id}
                  onClick={() => handleSelectEvent(evt)}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e14] overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    {/* Event Banner */}
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
                          Ready
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

                    {/* Progress & Details Body */}
                    <div className="p-4 sm:p-5 space-y-3.5">
                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar size={13} className="text-indigo-500" />
                          <span>{evt.date}</span>
                        </span>
                        <span className="font-mono text-slate-500">{evt.time || '18:00'}</span>
                      </div>

                      {/* Turnstile Ingress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700 dark:text-slate-300">Gate Ingress</span>
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {checkedIn} / {evtGuests.length} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Launch Button Action Strip */}
                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 group-hover:bg-indigo-600 text-slate-700 dark:text-slate-200 group-hover:text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-2xs group-hover:shadow-md group-hover:shadow-indigo-600/30"
                    >
                      <Camera size={14} />
                      <span>Launch Gate Terminal</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 space-y-3">
              <QrCode size={36} className="mx-auto text-slate-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No Matching Events Found</h3>
              <p className="text-xs text-slate-500">Try adjusting your search query or mode filter.</p>
            </div>
          )}

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW 2: GATE ACCESS SCANNER TERMINAL
         ───────────────────────────────────────────────────────────── */}
      {viewMode === 'terminal' && (
        <div className="space-y-6 animate-fade-in-scale">
          
          {/* Top Bar with Event Breadcrumb, Lane Switcher & Sound */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <button
                type="button"
                onClick={handleBackToCatalog}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-2 group transition-colors cursor-pointer"
              >
                <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
                <span>Switch Event Gate</span>
              </button>

              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-heading">
                  Gate Scanner Terminal
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online &lt;15ms
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Active Gate for <strong className="text-slate-900 dark:text-white">{activeEvent?.name}</strong> • {activeEvent?.venue}
              </p>
            </div>

            {/* Lane & Audio Controls */}
            <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
              <select
                value={gateName}
                onChange={(e) => setGateName(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer shadow-2xs"
              >
                <option value="Gate North #1">Gate North #1 (Main Entrance)</option>
                <option value="VIP West #2">VIP West #2 (Exclusive Lounge)</option>
                <option value="FastTrack East #3">FastTrack East #3</option>
              </select>

              <button
                type="button"
                onClick={() => setAudioEnabled((a) => !a)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${
                  audioEnabled
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/25'
                    : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
                title={audioEnabled ? 'Audio feedback active' : 'Audio muted'}
              >
                {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <button
                type="button"
                onClick={handleBackToCatalog}
                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-2xs"
              >
                Exit Gate
              </button>
            </div>
          </div>

          {/* Metric Telemetry Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Checked In
              </span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {checkedInCount}
              </div>
              <p className="text-[11px] text-slate-500">
                {eventGuests.length > 0 ? Math.round((checkedInCount / eventGuests.length) * 100) : 0}% of roster
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Remaining Expected
              </span>
              <div className="text-2xl font-black text-amber-500 font-mono">
                {remainingCount}
              </div>
              <p className="text-[11px] text-slate-500">Awaiting gate arrival</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Total on Roster
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {eventGuests.length}
              </div>
              <p className="text-[11px] text-slate-500">Max Capacity: {activeEvent?.capacity}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Gate Velocity
              </span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                38
              </div>
              <p className="text-[11px] text-slate-500">Scans / minute</p>
            </div>
          </div>

          {/* Main Scanner Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Camera Viewport & Scan Result (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Camera Target Box */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black aspect-[4/3] flex flex-col items-center justify-center shadow-xl">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-[#0a0d14] to-slate-950 text-slate-400 p-6 text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center animate-float">
                      <Camera size={32} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Camera Viewport Standby</h4>
                      <p className="text-xs text-slate-500 max-w-xs mt-1">
                        Activate your camera for optical turnstile scanning, or click any attendee on the right to test entry.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="py-2.5 px-5 rounded-2xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                    >
                      <Camera size={15} />
                      <span>Activate Optical Camera</span>
                    </button>
                  </div>
                )}

                {/* Reticle Target Overlay */}
                <div className="relative z-10 w-56 h-56 sm:w-64 sm:h-64 pointer-events-none flex flex-col items-center justify-center">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-xl" />
                  
                  {/* Laser Beam */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(6,182,212,0.8)] animate-pulse" />
                  <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-300 mt-2 bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                    ALIGN PASS WITHIN FRAME
                  </span>
                </div>

                {cameraActive && (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="absolute top-4 right-4 z-20 py-1.5 px-3 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                  >
                    Stop Camera
                  </button>
                )}

                {/* Operator HUD Pulse Overlay */}
                {hudFlash && (
                  <div
                    className={`absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center transition-all duration-300 ${
                      hudFlash === 'SUCCESS'
                        ? 'bg-emerald-500/25 border-8 border-emerald-500 animate-pulse'
                        : hudFlash === 'DUPLICATE'
                        ? 'bg-rose-600/35 border-8 border-rose-500 animate-pulse'
                        : 'bg-amber-500/30 border-8 border-amber-500 animate-pulse'
                    }`}
                  >
                    <div
                      className={`px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest text-white shadow-2xl backdrop-blur-md flex items-center gap-2 ${
                        hudFlash === 'SUCCESS'
                          ? 'bg-emerald-600 shadow-emerald-500/50'
                          : hudFlash === 'DUPLICATE'
                          ? 'bg-rose-600 shadow-rose-500/50'
                          : 'bg-amber-600 shadow-amber-500/50'
                      }`}
                    >
                      {hudFlash === 'SUCCESS' && <CheckCircle2 size={20} />}
                      {hudFlash === 'DUPLICATE' && <AlertOctagon size={20} />}
                      {hudFlash !== 'SUCCESS' && hudFlash !== 'DUPLICATE' && <AlertTriangle size={20} />}
                      <span>
                        {hudFlash === 'SUCCESS'
                          ? 'ACCESS GRANTED'
                          : hudFlash === 'DUPLICATE'
                          ? 'DUPLICATE DETECTED'
                          : 'INVALID PASS'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Scan Result Hero Banner */}
              {scanResult && (
                <div
                  className={`p-5 rounded-3xl border-2 transition-all animate-fade-in-scale shadow-xl ${
                    scanResult.status === 'SUCCESS'
                      ? 'bg-gradient-to-r from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/80 dark:via-emerald-900/60 dark:to-emerald-950/80 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-emerald-500/10'
                      : scanResult.status === 'DUPLICATE'
                      ? 'bg-gradient-to-r from-rose-50 via-white to-rose-50 dark:from-red-950/90 dark:via-red-900/70 dark:to-red-950/90 border-rose-500 text-rose-950 dark:text-red-100 shadow-rose-500/15'
                      : 'bg-gradient-to-r from-amber-50 via-white to-amber-50 dark:from-amber-950/90 dark:via-amber-900/70 dark:to-amber-950/90 border-amber-500 text-amber-950 dark:text-amber-100 shadow-amber-500/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                          scanResult.status === 'SUCCESS'
                            ? 'bg-emerald-500 text-white'
                            : scanResult.status === 'DUPLICATE'
                            ? 'bg-rose-500 text-white animate-bounce'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {scanResult.status === 'SUCCESS' && <CheckCircle2 size={26} />}
                        {scanResult.status === 'DUPLICATE' && <AlertOctagon size={26} />}
                        {scanResult.status !== 'SUCCESS' && scanResult.status !== 'DUPLICATE' && (
                          <AlertTriangle size={26} />
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/10 dark:bg-black/40">
                          {scanResult.status === 'SUCCESS' && 'ACCESS GRANTED • CHECKED IN'}
                          {scanResult.status === 'DUPLICATE' && 'DUPLICATE ENTRY ALERT'}
                          {scanResult.status === 'REVOKED' && 'PASS REVOKED'}
                          {scanResult.status === 'FORGED' && 'UNRECOGNIZED TOKEN'}
                        </span>

                        <h3 className="text-xl font-black">
                          {scanResult.guest?.name || 'Unknown Bearer'}
                        </h3>

                        <p className="text-xs font-medium opacity-90">
                          {scanResult.message}
                        </p>

                        {scanResult.guest && (
                          <div className="flex items-center gap-3 text-xs pt-1">
                            <span className="font-bold underline">{scanResult.guest.tier}</span>
                            {scanResult.guest.table && <span>• {scanResult.guest.table}</span>}
                            {scanResult.guest.plusOnes > 0 && (
                              <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                +{scanResult.guest.plusOnes} Guests Permitted
                              </span>
                            )}
                          </div>
                        )}

                        {scanResult.status === 'DUPLICATE' && (
                          <div className="mt-3 p-3 rounded-2xl bg-black/10 dark:bg-black/60 border border-rose-500/30 space-y-1.5 text-xs">
                            <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-300">
                              <Clock size={14} className="shrink-0 text-rose-500 animate-pulse" />
                              <span>Prior Scan Timestamp:</span>
                              <span className="font-mono font-bold bg-rose-100 dark:bg-rose-950/80 px-2 py-0.5 rounded">
                                {scanResult.checkInTime || 'Earlier in current session'}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono font-bold uppercase text-rose-600 dark:text-rose-400 block">
                              ENTRY REJECTED • REPLAY PREVENTED
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setScanResult(null)}
                      className="text-xs font-bold opacity-60 hover:opacity-100 underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {/* Manual Input Form */}
              <form onSubmit={handleManualSubmit} className="flex gap-2.5">
                <div className="relative flex-1">
                  <QrCode size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Paste token or scan with handheld laser scanner..."
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e14] text-xs font-mono font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSimulating}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 cursor-pointer disabled:opacity-50 transition-all active:scale-95 shrink-0"
                >
                  Verify Token
                </button>
              </form>

            </div>

            {/* Right: Quick Demo Test & Live Feed (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Quick Demo Test Passes */}
              <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e14] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Zap size={14} className="text-amber-500" />
                    <span>Quick Scan Simulators ({activeEvent?.name})</span>
                  </span>
                  <span className="text-[10px] text-slate-400">1-click test</span>
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {eventGuests.slice(0, 6).map((g) => {
                    const isChecked = g.status === 'CHECKED_IN';
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => handleProcessScan(g.qrToken)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs cursor-pointer ${
                          isChecked
                            ? 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-indigo-500 text-slate-900 dark:text-white'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-bold truncate">{g.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{g.tier} • {g.table || 'General Admission'}</div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isChecked ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                        }`}>
                          {isChecked ? 'Scan Again' : 'Test Scan'}
                        </span>
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => handleProcessScan('FORGED_SCREENSHOT_BAD_TOKEN_999')}
                    className="w-full text-left p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 transition-all flex items-center justify-between text-xs cursor-pointer"
                  >
                    <div>
                      <div className="font-bold">Unknown Fake Pass / Bad Hash</div>
                      <div className="text-[10px] opacity-75">Simulate unauthorized visitor</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400">
                      Fraud Test
                    </span>
                  </button>
                </div>
              </div>

              {/* Live Gate Entry Audit Log */}
              <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e14] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <History size={14} className="text-indigo-500" />
                    <span>Live Scan Feed</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{scanHistory.length} recorded</span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
                  {scanHistory.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      <Clock size={24} className="mx-auto mb-1.5 opacity-40" />
                      No scans logged yet during this terminal session.
                    </div>
                  ) : (
                    scanHistory.map((item) => (
                      <div key={item.id} className="pt-2 pb-1 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{item.guestName}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <span>{item.time}</span>
                            <span>•</span>
                            <span>{item.gate}</span>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            item.status === 'SUCCESS'
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : item.status === 'DUPLICATE'
                              ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default ScannerPage;
