import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Camera, CheckCircle2, AlertTriangle, AlertOctagon,
  Volume2, VolumeX, ShieldCheck, Zap, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEvents } from '../../context/EventContext';

// Web Audio API Synthesizer
const playAudioTone = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'SUCCESS') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (err) {
    console.warn('Audio tone failed:', err);
  }
};

const ScannerModal = ({ isOpen, onClose }) => {
  const { events, guests, verifyAndCheckIn } = useEvents();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleProcessScan = (token) => {
    if (!token) return;
    const result = verifyAndCheckIn(token, 'Quick Gate Scanner');
    setScanResult(result);

    if (soundEnabled) {
      playAudioTone(result.status);
    }

    if (result.status === 'SUCCESS') {
      toast.success(`Access Granted: ${result.guest?.name} checked in!`);
    } else if (result.status === 'DUPLICATE') {
      toast.error('Duplicate Entry Alert! Pass was already scanned.');
    } else {
      toast.error(`Verification Failed: ${result.message}`);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleProcessScan(manualCode.trim());
    setManualCode('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#121622] border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100 my-auto">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3B2875] to-[#7C5CFC] text-white flex items-center justify-center shadow-md">
              <Camera size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                Quick Gate Scanner
              </h3>
              <p className="text-xs text-slate-400">Rapid optical verification & check-in</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled((s) => !s)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          
          {/* Scan Result Banner */}
          {scanResult && (
            <div
              className={`p-4 rounded-2xl border-2 transition-all animate-fade-in ${
                scanResult.status === 'SUCCESS'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100'
                  : scanResult.status === 'DUPLICATE'
                  ? 'bg-red-950/90 border-red-500 text-red-100'
                  : 'bg-amber-950/90 border-amber-500 text-amber-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    scanResult.status === 'SUCCESS' ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'
                  }`}
                >
                  {scanResult.status === 'SUCCESS' ? <CheckCircle2 size={24} /> : <AlertOctagon size={24} />}
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider">
                    {scanResult.status === 'SUCCESS' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
                  </div>
                  <div className="text-base font-black text-white">
                    {scanResult.guest?.name || 'Unknown Bearer'}
                  </div>
                  <div className="text-xs opacity-90 mt-0.5">{scanResult.message}</div>
                </div>
              </div>
            </div>
          )}

          {/* Manual Input Form */}
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Paste token or enter ticket code..."
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              Verify
            </button>
          </form>

          {/* Quick Demo Test Buttons */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Zap size={12} className="text-amber-400" />
              Quick Tap to Simulate Gate Scans:
            </span>

            <div className="grid grid-cols-2 gap-2">
              {guests.slice(0, 4).map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleProcessScan(g.qrToken)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-indigo-500/10 border border-slate-800 hover:border-indigo-500/40 text-left text-xs transition-all cursor-pointer"
                >
                  <div className="font-bold text-white truncate">{g.name}</div>
                  <div className="text-[10px] text-slate-400">{g.tier}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => handleProcessScan('FORGED_TOKEN_XYZ')}
              className="w-full p-2 rounded-xl bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 text-red-400 text-xs font-bold text-center cursor-pointer transition-colors"
            >
              Test Fraud / Screenshot Reject
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ScannerModal;
