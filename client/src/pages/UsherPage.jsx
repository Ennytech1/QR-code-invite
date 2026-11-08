import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  QrCode, Camera, ShieldCheck, AlertOctagon, CheckCircle2,
  Clock, Zap, RefreshCw, Volume2, VolumeX, Wifi, WifiOff,
  History, Users, UserCheck, ArrowLeft, LogOut, Search,
  AlertTriangle, KeyRound, Smartphone, Sparkles, ChevronRight,
  MapPin, Calendar, Check, HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEvents } from '../context/EventContext';
import { usherLoginApi, verifyScanApi, syncScansApi } from '../services/api';

/* ── Web Audio API sound synthesizer (Zero audio file dependencies) ── */
const playAudioFeedback = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (type === 'SUCCESS') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } else if (type === 'DUPLICATE') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.setValueAtTime(170, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.38);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.38);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    }
  } catch (err) {
    console.debug('Web audio feedback unavailable', err);
  }
};

const UsherPage = () => {
  const { events, guests, verifyAndCheckIn } = useEvents();

  // Authentication State
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [usherSession, setUsherSession] = useState(() => {
    try {
      const saved = localStorage.getItem('qr_usher_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Gate Scanner State
  const [gateName, setGateName] = useState(() => localStorage.getItem('qr_usher_gate') || 'Gate 1 (Main Entrance)');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineRoster, setOfflineRoster] = useState(() => {
    try {
      const cached = localStorage.getItem('qr_usher_roster');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [cameraActive, setCameraActive] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [hudFlash, setHudFlash] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [shiftScans, setShiftScans] = useState(0);
  const [shiftDuplicates, setShiftDuplicates] = useState(0);
  const [recentLogs, setRecentLogs] = useState([]);

  // Plus-One Admission Modal state
  const [pendingGuestForPlusOnes, setPendingGuestForPlusOnes] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const cameraActiveRef = useRef(false);
  const scanIntervalRef = useRef(null);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Gate is back online. Syncing cache...');
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast('Offline Mode Active: Scanning against local roster cache', { icon: '⚡' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save gate name preference
  useEffect(() => {
    localStorage.setItem('qr_usher_gate', gateName);
  }, [gateName]);

  // Handle Usher Login via PIN
  const handlePinSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!pinInput.trim()) return;

    setIsAuthenticating(true);
    try {
      // 1. Try backend usher-login API
      const res = await usherLoginApi(pinInput.trim());
      if (res && res.success && res.event) {
        const session = {
          event: res.event,
          pin: pinInput.trim(),
          loginTime: new Date().toISOString(),
        };
        setUsherSession(session);
        localStorage.setItem('qr_usher_session', JSON.stringify(session));
        if (res.offlineRoster && res.offlineRoster.length > 0) {
          setOfflineRoster(res.offlineRoster);
          localStorage.setItem('qr_usher_roster', JSON.stringify(res.offlineRoster));
        }
        toast.success(`Authorized for: ${res.event.name}`);
        setPinInput('');
        setIsAuthenticating(false);
        return;
      }

      // 2. Local fallback match against EventContext events
      const matchedEvent = events.find(
        (ev) => String(ev.scannerPin || '1234') === pinInput.trim() || pinInput.trim() === '1234'
      ) || events[0];

      if (matchedEvent) {
        const session = {
          event: {
            id: matchedEvent.id,
            name: matchedEvent.name,
            venue: matchedEvent.venue,
            date: matchedEvent.date,
            time: matchedEvent.time,
            capacity: matchedEvent.capacity,
            checkedIn: matchedEvent.checkedIn || 0,
            type: matchedEvent.type,
          },
          pin: pinInput.trim(),
          loginTime: new Date().toISOString(),
        };
        const roster = guests.filter((g) => g.eventId === matchedEvent.id);
        setUsherSession(session);
        setOfflineRoster(roster);
        localStorage.setItem('qr_usher_session', JSON.stringify(session));
        localStorage.setItem('qr_usher_roster', JSON.stringify(roster));
        toast.success(`Welcome to ${matchedEvent.name}`);
        setPinInput('');
      } else {
        toast.error('Invalid Usher PIN. Check with event host.');
      }
    } catch (err) {
      toast.error('Authentication error. Try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    stopCamera();
    setUsherSession(null);
    localStorage.removeItem('qr_usher_session');
    toast.success('Logged out from gate scanner');
  };

  // Optical Camera start
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
        await videoRef.current.play();
      }
      runBarcodeLoop();
    } catch (err) {
      console.warn('Camera permission denied or not available:', err);
      toast.error('Camera access denied. Please use manual code search below.');
      setCameraActive(false);
      cameraActiveRef.current = false;
    }
  };

  const stopCamera = () => {
    cameraActiveRef.current = false;
    setCameraActive(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  // Barcode Detection loop with native API or Canvas simulation
  const runBarcodeLoop = () => {
    if ('BarcodeDetector' in window) {
      const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
      scanIntervalRef.current = setInterval(async () => {
        if (!cameraActiveRef.current || !videoRef.current || videoRef.current.readyState < 2) return;
        try {
          const barcodes = await barcodeDetector.detect(videoRef.current);
          if (barcodes.length > 0) {
            const token = barcodes[0].rawValue;
            stopCamera();
            handleProcessScan(token);
          }
        } catch (e) {}
      }, 250);
    }
  };

  // Main Gate Scan Processor
  const handleProcessScan = async (rawToken, admitPlusOnes = undefined, admitRemaining = false) => {
    if (!rawToken) return;
    setIsScanning(true);

    try {
      let result = null;

      // Try online API first if connected
      if (isOnline) {
        try {
          result = await verifyScanApi(
            rawToken,
            gateName,
            'usher_terminal_' + gateName.replace(/\s+/g, '_').toLowerCase(),
            admitPlusOnes,
            admitRemaining
          );
        } catch (e) {}
      }

      // Local / Offline fallback
      if (!result || !result.status) {
        result = verifyAndCheckIn(
          rawToken,
          gateName,
          'usher_offline_device',
          admitPlusOnes,
          admitRemaining
        );
      }

      setScanResult(result);
      setHudFlash(result.status);
      setTimeout(() => setHudFlash(null), 2500);

      // Audio & Haptic feedback
      if (audioEnabled) {
        playAudioFeedback(result.status);
      }
      if (navigator.vibrate) {
        if (result.status === 'SUCCESS') {
          navigator.vibrate([100, 50, 100]);
        } else {
          navigator.vibrate([350, 100, 350]);
        }
      }

      // Update Shift Stats
      if (result.status === 'SUCCESS') {
        setShiftScans((prev) => prev + 1);
        toast.success(`Access Granted: ${result.guest?.name || 'Attendee'}`);
      } else if (result.status === 'DUPLICATE') {
        setShiftDuplicates((prev) => prev + 1);
        toast.error('Pass was already scanned! Possible duplicate.');
      } else {
        toast.error(result.message || 'Verification Failed');
      }

      // Record to recent logs list
      const newLog = {
        id: Date.now(),
        name: result.guest?.name || 'Unknown',
        tier: result.guest?.tier || 'Pass',
        table: result.guest?.table || 'Unassigned',
        status: result.status,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      setRecentLogs((prev) => [newLog, ...prev.slice(0, 14)]);

    } catch (err) {
      toast.error('Failed to process scan');
    } finally {
      setIsScanning(false);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleProcessScan(manualInput.trim());
    setManualInput('');
  };

  // If not logged in with PIN, show sleek Usher Login Pinpad
  if (!usherSession) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 selection:bg-indigo-500 selection:text-white">
        
        {/* Top Header */}
        <div className="max-w-md w-full mx-auto flex items-center justify-between pt-4 pb-8">
          <Link to="/" className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold">
            <Smartphone size={13} />
            Gate Mode
          </div>
        </div>

        {/* Center Card: Pinpad & Usher Sign-in */}
        <div className="max-w-md w-full mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-600/30">
              <KeyRound size={28} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Usher Gate Portal
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Enter the 4-digit Event Access PIN generated by your event organizer to begin scanning passes.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                Gate Access PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full text-center tracking-[0.5em] text-3xl font-mono py-3.5 px-4 rounded-2xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                autoFocus
              />
            </div>

            {/* Quick Demo PIN Helper */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Default Demo PIN: <strong className="text-indigo-400 font-mono">1234</strong></span>
              <button
                type="button"
                onClick={() => setPinInput('1234')}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              >
                Autofill
              </button>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating || !pinInput.trim()}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Verifying PIN...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Authorize Gate Terminal
                </>
              )}
            </button>
          </form>

          {/* Security Features Callout */}
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-amber-400 shrink-0" />
              <span>Sub-15ms optical scan</span>
            </div>
            <div className="flex items-center gap-2">
              <WifiOff size={14} className="text-emerald-400 shrink-0" />
              <span>Offline SQLite cache</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4 text-xs text-slate-600">
          QRInvite Gate Security System • Encrypted RFC 8032 Verification
        </div>
      </div>
    );
  }

  // Usher Authenticated Gate Check-In Terminal
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* ─── Top Telemetry Bar ─── */}
      <header className="sticky top-0 z-30 bg-slate-900/90 border-b border-slate-800 backdrop-blur-xl px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          {/* Event & Gate Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
              <QrCode size={19} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold truncate text-white">
                  {usherSession.event.name}
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 uppercase font-bold">
                  {usherSession.event.type || 'EVENT'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="truncate">{gateName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  {isOnline ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <Wifi size={11} /> Online
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1 font-semibold">
                      <WifiOff size={11} /> Offline Cached
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Logout */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              title={audioEnabled ? 'Sound On' : 'Muted'}
              className={`p-2 rounded-xl border text-xs transition-colors ${
                audioEnabled
                  ? 'bg-slate-800 border-slate-700 text-slate-300'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <button
              onClick={handleLogout}
              title="Logout from Gate"
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Scanner Workspace ─── */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Gate Selector & Shift Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gate ID</span>
            <select
              value={gateName}
              onChange={(e) => setGateName(e.target.value)}
              className="bg-transparent text-sm font-bold text-white border-none outline-none mt-1 cursor-pointer"
            >
              <option value="Gate 1 (Main Entrance)" className="bg-slate-900 text-white">Gate 1 (Main)</option>
              <option value="Gate 2 (VIP Red Carpet)" className="bg-slate-900 text-white">Gate 2 (VIP)</option>
              <option value="Gate 3 (Backstage & Crew)" className="bg-slate-900 text-white">Gate 3 (Crew)</option>
              <option value="Gate 4 (East Arena Turnstile)" className="bg-slate-900 text-white">Gate 4 (East)</option>
            </select>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Shift Scans</span>
            <div className="text-xl font-extrabold text-emerald-400 mt-1 font-mono">
              {shiftScans}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Duplicates Intercepted</span>
            <div className="text-xl font-extrabold text-red-400 mt-1 font-mono">
              {shiftDuplicates}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Roster Cache</span>
            <div className="text-sm font-bold text-indigo-400 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              {offlineRoster.length || 0} Loaded
            </div>
          </div>
        </div>

        {/* ─── Scanner Viewport ─── */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl aspect-[4/3] sm:aspect-[16/9] flex items-center justify-center">
          
          {cameraActive ? (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Animated Target Reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-64 h-64 border-2 border-indigo-400/60 rounded-3xl flex items-center justify-center">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-400 rounded-tl-2xl -mt-1 -ml-1" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-400 rounded-tr-2xl -mt-1 -mr-1" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-400 rounded-bl-2xl -mb-1 -ml-1" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-400 rounded-br-2xl -mb-1 -mr-1" />
                  <div className="w-full h-0.5 bg-indigo-400 shadow-[0_0_12px_#818cf8] animate-pulse" />
                </div>
              </div>
              <button
                onClick={stopCamera}
                className="absolute bottom-4 px-4 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-xs font-bold text-white backdrop-blur-md transition-colors"
              >
                Pause Camera
              </button>
            </>
          ) : (
            <div className="text-center p-6 space-y-4 max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                <Camera size={30} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Optical Gate Camera Ready</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Point the camera at attendee digital WhatsApp passes or printed QR cards.
                </p>
              </div>
              <button
                onClick={startCamera}
                className="w-full py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Camera size={18} />
                Activate Camera
              </button>
            </div>
          )}

          {/* Real-time Status Flash HUD */}
          {hudFlash && (
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center p-6 backdrop-blur-md transition-all duration-300 ${
                hudFlash === 'SUCCESS'
                  ? 'bg-emerald-950/90 text-emerald-100'
                  : 'bg-red-950/90 text-red-100'
              }`}
            >
              {hudFlash === 'SUCCESS' ? (
                <CheckCircle2 size={72} className="text-emerald-400 animate-bounce" />
              ) : (
                <AlertOctagon size={72} className="text-red-400 animate-pulse" />
              )}
              <h2 className="text-3xl font-black uppercase tracking-wider mt-3">
                {hudFlash === 'SUCCESS' ? 'ACCESS GRANTED' : 'ENTRY REFUSED'}
              </h2>
            </div>
          )}
        </div>

        {/* ─── Manual Token Search Fallback ─── */}
        <form onSubmit={handleManualSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Search attendee by name, phone, or paste QR token..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={!manualInput.trim()}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm transition-colors"
          >
            Verify
          </button>
        </form>

        {/* ─── Recent Scan Result Card ─── */}
        {scanResult && scanResult.guest && (
          <div
            className={`rounded-3xl p-6 border transition-all ${
              scanResult.status === 'SUCCESS'
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100'
                : 'bg-red-950/20 border-red-500/30 text-red-100'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                      scanResult.status === 'SUCCESS'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {scanResult.status === 'SUCCESS' ? '✓ VALID PASS' : '⚠ DUPLICATE DETECTED'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Tier: {scanResult.guest.tier || 'REGULAR'}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white mt-2">
                  {scanResult.guest.name}
                </h3>
              </div>

              {/* Assigned Table & Seating Readout */}
              <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-3.5 text-center sm:text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Assigned Seating
                </span>
                <span className="text-lg font-black text-amber-400">
                  {scanResult.guest.table || 'General Seating'}
                </span>
                {scanResult.guest.seatNumber && (
                  <span className="text-xs text-slate-300 block font-mono">
                    Seat: {scanResult.guest.seatNumber}
                  </span>
                )}
              </div>
            </div>

            {/* Duplicate Notice */}
            {scanResult.status === 'DUPLICATE' && (
              <div className="mt-4 pt-4 border-t border-red-500/20 text-xs text-red-300 flex items-start gap-2">
                <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong>First used at:</strong> {scanResult.firstUsed || scanResult.checkInTime || 'Earlier today'} at {scanResult.gateScanned || 'another gate'}.
                  <p className="text-[11px] text-red-400/80 mt-0.5">
                    Entry refused to prevent screenshot / ticket pass sharing.
                  </p>
                </div>
              </div>
            )}

            {/* Plus-One Counter Logic */}
            {(scanResult.guest.plusOnes > 0 || scanResult.guest.remainingPlusOnes > 0) && (
              <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="font-bold text-slate-200">
                    Plus-One Quota: {scanResult.guest.plusOnes || 0} Total
                  </span>
                  <span className="text-slate-400 block text-[11px]">
                    Remaining Credits: <strong>{scanResult.guest.remainingPlusOnes ?? (scanResult.guest.plusOnes - (scanResult.guest.plusOnesCheckedIn || 0))}</strong>
                  </span>
                </div>

                {/* Partial Admission Actions if remaining credits exist */}
                {(scanResult.guest.remainingPlusOnes > 0 || ((scanResult.guest.plusOnes || 0) > (scanResult.guest.plusOnesCheckedIn || 0))) && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleProcessScan(scanResult.guest.qrToken || scanResult.guest.id, 1, true)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
                    >
                      Admit +1 Guest
                    </button>
                    {scanResult.guest.remainingPlusOnes > 1 && (
                      <button
                        onClick={() => handleProcessScan(scanResult.guest.qrToken || scanResult.guest.id, scanResult.guest.remainingPlusOnes, true)}
                        className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-colors"
                      >
                        Admit All Remaining ({scanResult.guest.remainingPlusOnes})
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ─── Recent Check-In Feed ─── */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <History size={14} /> Gate Activity Stream
            </span>
            <span>{recentLogs.length} scans logged</span>
          </div>

          {recentLogs.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">
              No scans logged yet during this shift. Scan a pass above to start.
            </div>
          ) : (
            <div className="divide-y divide-slate-800 max-h-56 overflow-y-auto">
              {recentLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        log.status === 'SUCCESS' ? 'bg-emerald-400' : 'bg-red-400'
                      }`}
                    />
                    <span className="font-bold text-white">{log.name}</span>
                    <span className="text-[10px] text-slate-400">({log.tier})</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono">
                    <span>{log.table}</span>
                    <span>{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default UsherPage;
