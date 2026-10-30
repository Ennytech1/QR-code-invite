import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Smartphone, ShieldCheck, Zap, AlertOctagon, CheckCircle2,
  Clock, ArrowRight, RefreshCw, Volume2, Wifi, WifiOff,
  Lock, QrCode, Camera, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';

const GateTechPage = () => {
  // Live Simulator state
  const [simStatus, setSimStatus] = useState(null); // 'SUCCESS' | 'DUPLICATE' | 'FORGED' | null
  const [isScanning, setIsScanning] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('valid');

  const handleRunSimulator = (scenario) => {
    setIsScanning(true);
    setSimStatus(null);

    setTimeout(() => {
      setIsScanning(false);
      setSimStatus(scenario);
      if (scenario === 'SUCCESS') {
        toast.success('Simulation: Access Granted! Guest verified in 14ms.');
      } else if (scenario === 'DUPLICATE') {
        toast.error('Simulation: Duplicate Alert! Screenshot rejected.');
      } else {
        toast.error('Simulation: Cryptographic signature mismatch!');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200 overflow-x-hidden">
      
      <LandingNavbar />

      {/* ─── Hero Header ─── */}
      <section className="relative pt-12 pb-16 bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
            <Zap size={13} /> Sub-Second Verification Architecture
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)] leading-tight">
            The Gate Scanner Terminal
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Eliminate gate bottlenecks, uninvited screenshot freeloaders, and paper checklists with our cryptographic zero double-spend scanner engine.
          </p>
          <div className="pt-2">
            <Link
              to="/scanner"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Smartphone size={15} />
              <span>Launch Full Gate Scanner Terminal</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── LIVE INTERACTIVE SCANNER SIMULATOR ─── */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Interactive Test Sandbox
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
            Test the Gate Scanner Live
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Select a real-world scenario below and see how the scanner behaves in under 100 milliseconds.
          </p>
        </div>

        {/* Simulator Box */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-2xl">
          
          {/* Controls */}
          <div className="md:col-span-5 space-y-4 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)] block">
              Choose Test Scenario:
            </label>

            <div className="space-y-2.5">
              <button
                onClick={() => handleRunSimulator('SUCCESS')}
                className="w-full text-left p-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-emerald-400">1. Legitimate Guest Arrival</div>
                  <div className="text-[11px] text-slate-400">Valid pass, never checked in</div>
                </div>
                <CheckCircle2 size={16} className="text-emerald-400" />
              </button>

              <button
                onClick={() => handleRunSimulator('DUPLICATE')}
                className="w-full text-left p-3 rounded-2xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-red-400">2. Duplicate Screenshot Attempt</div>
                  <div className="text-[11px] text-slate-400">Guest shared pass with friend</div>
                </div>
                <AlertOctagon size={16} className="text-red-400" />
              </button>

              <button
                onClick={() => handleRunSimulator('FORGED')}
                className="w-full text-left p-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-amber-400">3. Forged / Tampered Pass</div>
                  <div className="text-[11px] text-slate-400">Fake QR or altered signature</div>
                </div>
                <AlertTriangle size={16} className="text-amber-400" />
              </button>
            </div>

            <div className="pt-2 text-[11px] text-[var(--text-tertiary)] leading-relaxed">
              Tip: The scanner runs locally in the operator’s mobile browser, with optical recognition (<span className="text-emerald-400 font-bold">&lt;100ms</span>).
            </div>
          </div>

          {/* Scanner Viewport Display */}
          <div className="md:col-span-7 flex justify-center">
            <div className="w-full max-w-sm rounded-3xl p-6 bg-slate-950 border border-slate-800 text-white shadow-2xl relative overflow-hidden text-center space-y-4">
              
              {/* Status Header */}
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-b border-slate-800 pb-3">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  OPTICAL SENSOR ACTIVE
                </span>
                <span className="font-mono">GATE NORTH #1</span>
              </div>

              {/* Viewport Frame */}
              <div className="relative aspect-[4/3] rounded-2xl bg-black border border-slate-800 flex flex-col items-center justify-center p-4">
                
                {isScanning ? (
                  <div className="space-y-2">
                    <RefreshCw size={28} className="animate-spin text-indigo-400 mx-auto" />
                    <span className="text-xs font-mono text-indigo-300">Evaluating Token...</span>
                  </div>
                ) : simStatus === 'SUCCESS' ? (
                  <div className="space-y-2 animate-fade-in text-emerald-400">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <div className="text-xs font-black uppercase tracking-wider">ACCESS GRANTED</div>
                    <div className="text-base font-black text-white">Chief Kelechi Okafor</div>
                    <div className="text-[10px] text-emerald-300 font-mono">VIP High Table • Checked In Just Now</div>
                  </div>
                ) : simStatus === 'DUPLICATE' ? (
                  <div className="space-y-2 animate-fade-in text-red-400">
                    <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto animate-bounce">
                      <AlertOctagon size={32} />
                    </div>
                    <div className="text-xs font-black uppercase tracking-wider">DUPLICATE PASS BLOCKED</div>
                    <div className="text-sm font-bold text-white">Already Scanned at 18:14</div>
                    <div className="text-[10px] text-red-300 font-mono">First used at Gate West • Lock Denied</div>
                  </div>
                ) : simStatus === 'FORGED' ? (
                  <div className="space-y-2 animate-fade-in text-amber-400">
                    <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
                      <AlertTriangle size={32} />
                    </div>
                    <div className="text-xs font-black uppercase tracking-wider">INVALID SIGNATURE</div>
                    <div className="text-sm font-bold text-white">Unrecognized Token</div>
                    <div className="text-[10px] text-amber-300 font-mono">Cryptographic hash mismatch</div>
                  </div>
                ) : (
                  <div className="space-y-2 text-slate-500">
                    <Camera size={32} className="mx-auto text-slate-600" />
                    <p className="text-xs">Tap a scenario on the left to simulate a gate scan.</p>
                  </div>
                )}

                {/* Reticle brackets */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-indigo-400" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-indigo-400" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-indigo-400" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-indigo-400" />
              </div>

              <div className="text-[10px] text-slate-500 flex items-center justify-between font-mono">
                <span>Atomic Concurrency Lock: ACTIVE</span>
                <span>Latency: 14ms</span>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* ─── TECHNICAL SPECIFICATIONS ─── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 border-t border-[var(--border)]">
        
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
            Enterprise Grade Security
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[var(--text-primary)]">
            Under the Hood Architecture
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Built to survive cellular dead zones and high-throughput gate crushes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-glow rounded-3xl p-7 border border-[var(--border)] bg-[var(--bg-surface)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black">
              01
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Ed25519 Asymmetric Signatures
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Every digital ticket and WhatsApp invite pass is signed using an elliptic curve algorithm (RFC 8032). Passes cannot be forged, manipulated, or altered by anyone without the private key.
            </p>
          </div>

          <div className="card-glow rounded-3xl p-7 border border-[var(--border)] bg-[var(--bg-surface)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-black">
              02
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Zero Double-Spend Mutex
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              When two attendees present the same pass at Gate 1 and Gate 2 simultaneously, distributed atomic locks guarantee only the first scanner succeeds, immediately rejecting the duplicate.
            </p>
          </div>

          <div className="card-glow rounded-3xl p-7 border border-[var(--border)] bg-[var(--bg-surface)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black">
              03
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Offline PWA Synchronization
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Gate operators download a cached roster snapshot upon login. If the venue Wi-Fi or cellular service dies completely, the scanner continues verifying passes and syncs automatically once reconnected.
            </p>
          </div>
        </div>

      </section>

      {/* ─── Terminal Launch CTA ─── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-5">
          <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to scan attendees at your door?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Open the scanner in your mobile browser or connect a handheld USB barcode gun.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/scanner"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg"
            >
              Open Gate Scanner Terminal
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />

    </div>
  );
};

export default GateTechPage;
