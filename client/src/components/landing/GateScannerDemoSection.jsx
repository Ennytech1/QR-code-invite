import React, { useState } from 'react';
import { Smartphone, QrCode, CheckCircle2, Lock, ShieldAlert, Cpu, AlertOctagon, RefreshCw, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const playDemoAudio = (isSuccess) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (isSuccess) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } else {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    }
  } catch (e) {
    // Ignore audio permission errors
  }
};

const GateScannerDemoSection = () => {
  const [simTier, setSimTier] = useState('VVIP');
  const [gateScanning, setGateScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleValidScan = () => {
    setGateScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setGateScanning(false);
      playDemoAudio(true);
      setScanResult({
        status: 'VERIFIED',
        name: 'Chief Kelechi Okafor',
        tier: simTier,
        latency: '12ms',
        table: 'Table 1 • High Table VIP',
        gate: 'GATE-01',
        time: new Date().toLocaleTimeString()
      });
      toast.success('Optical Scan: 12ms latency. Pass Verified & Atomic Lock Acquired!');
    }, 700);
  };

  const handleDuplicateScan = () => {
    setGateScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setGateScanning(false);
      playDemoAudio(false);
      setScanResult({
        status: 'DUPLICATE',
        name: 'Chief Kelechi Okafor',
        tier: simTier,
        latency: '15ms',
        firstScanned: '3 mins ago at Gate 2 (West Turnstile)',
        time: new Date().toLocaleTimeString()
      });
      toast.error('Anti-Replay Lock: Duplicate Pass Screenshot Detected!');
    }, 700);
  };

  return (
    <section id="scanner-demo" className="py-20 bg-[var(--bg-subtle)]/40 border-y border-[var(--border)] relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            <Zap size={12} />
            <span>Interactive Gate Security Terminal</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Experience Sub-20ms Optical Scanning
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Test how door security officers verify attendees in real time. Signed with RFC 8032 Ed25519 cryptography to guarantee zero duplicate pass screenshot fraud.
          </p>
        </div>

        {/* Scanner Terminal Card */}
        <div className="max-w-4xl mx-auto">
          <div className="card-glow rounded-3xl p-6 sm:p-8 border border-[var(--border)] bg-[var(--bg-surface)] shadow-2xl relative">
            
            {/* Terminal Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-[var(--border)] gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[var(--text-primary)]">
                    Gate Terminal PWA Simulation
                  </h4>
                  <span className="text-[11px] text-[var(--text-tertiary)] font-mono">
                    Terminal #GATE-01 • Offline IndexedDB Active • Mutex Enabled
                  </span>
                </div>
              </div>

              {/* Tier Switcher for Demo */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]">
                {['REGULAR', 'VIP', 'VVIP'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSimTier(tier)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      simTier === tier
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Interactive Demo Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 items-center">
              
              {/* Left: Mobile Digital Ticket Pass */}
              <div className="space-y-4">
                <div className="rounded-2xl p-5 border border-indigo-500/30 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-black text-white relative shadow-xl overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">QRInvite Secured Pass</span>
                      <h4 className="text-[15px] font-bold">The Adeleke Royal Banquet</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {simTier} ACCESS
                    </span>
                  </div>

                  <div className="py-4 space-y-1">
                    <div className="text-[12px] text-white font-semibold">Chief Kelechi Okafor</div>
                    <div className="text-[11px] text-zinc-400 font-mono">Table 1 • High Table VIP Dignitary</div>
                    <div className="text-[10px] text-cyan-400 font-mono truncate pt-1">
                      Payload: tid_9981a|eid_77b2|t_VVIP|iat_1761800
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono truncate">
                      Sig: ed25519:7b9a2c...8f1d (Tamper Proof)
                    </div>
                  </div>

                  {/* Barcode & Hologram footer */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Lock size={11} /> ATOMIC ANTI-REPLAY
                    </span>
                    <span>ADMIT ONE</span>
                  </div>
                </div>

                <p className="text-[11px] text-[var(--text-tertiary)] text-center">
                  Passes dispatched directly via WhatsApp or synced to Apple & Google Wallet.
                </p>
              </div>

              {/* Right: Optical Camera Scanner Viewport */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-60 h-60 rounded-2xl bg-zinc-950 border-2 border-dashed border-indigo-500/40 relative flex items-center justify-center overflow-hidden shadow-2xl">
                  
                  {/* Corner Target Markers */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-indigo-400" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-indigo-400" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-indigo-400" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-indigo-400" />

                  {/* Laser scanning beam */}
                  {gateScanning && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 shadow-[0_0_12px_#34d399] animate-laser" />
                  )}

                  {/* Scanned QR Mockup */}
                  <div className="p-3 rounded-2xl bg-white shadow-lg">
                    <svg className="w-24 h-24 text-zinc-950" viewBox="0 0 100 100" fill="currentColor">
                      <rect x="10" y="10" width="26" height="26" />
                      <rect x="64" y="10" width="26" height="26" />
                      <rect x="10" y="64" width="26" height="26" />
                      <rect x="42" y="10" width="16" height="16" />
                      <rect x="42" y="42" width="16" height="16" />
                      <rect x="10" y="42" width="16" height="16" />
                      <rect x="64" y="42" width="16" height="16" />
                      <rect x="42" y="64" width="16" height="16" />
                      <rect x="64" y="64" width="26" height="26" />
                    </svg>
                  </div>

                  {/* Scan Verified Flash Overlay */}
                  {scanResult && scanResult.status === 'VERIFIED' && (
                    <div className="absolute inset-0 bg-emerald-600/95 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4 text-center animate-fade-in space-y-1">
                      <CheckCircle2 size={36} className="text-white animate-bounce" />
                      <span className="font-extrabold text-[15px] tracking-wide">ACCESS GRANTED</span>
                      <span className="text-[12px] font-bold">{scanResult.name}</span>
                      <span className="text-[10px] font-mono text-emerald-100">{scanResult.table}</span>
                      <span className="text-[9px] font-mono bg-black/30 px-2 py-0.5 rounded mt-1">
                        Latency: {scanResult.latency} • {scanResult.tier}
                      </span>
                    </div>
                  )}

                  {/* Duplicate Scan Rejection Overlay */}
                  {scanResult && scanResult.status === 'DUPLICATE' && (
                    <div className="absolute inset-0 bg-rose-600/95 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4 text-center animate-fade-in space-y-1">
                      <AlertOctagon size={36} className="text-white animate-bounce" />
                      <span className="font-extrabold text-[14px] tracking-wide">DOUBLE-SPEND DETECTED</span>
                      <span className="text-[11px] font-bold text-rose-100">Pass Already Checked In</span>
                      <span className="text-[10px] font-mono bg-black/40 px-2 py-1 rounded text-rose-200 mt-1 max-w-[200px] leading-tight">
                        {scanResult.firstScanned}
                      </span>
                      <span className="text-[9px] font-bold text-amber-200 uppercase mt-0.5">
                        ENTRY REJECTED
                      </span>
                    </div>
                  )}
                </div>

                {/* Interactive Dual Triggers */}
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                  <button
                    onClick={handleValidScan}
                    disabled={gateScanning}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-[12px] font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                  >
                    <CheckCircle2 size={14} />
                    <span>Test Valid Scan (&lt;15ms)</span>
                  </button>

                  <button
                    onClick={handleDuplicateScan}
                    disabled={gateScanning}
                    className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-[12px] font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-rose-600/20 transition-all active:scale-95"
                  >
                    <AlertOctagon size={14} />
                    <span>Simulate Duplicate Pass</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default GateScannerDemoSection;
