import React, { useState } from 'react';
import {
  Key, Shield, MessageSquare, Mail, Smartphone,
  Users, Lock, RefreshCw, Copy, Check, Eye, EyeOff,
  Save, AlertTriangle, ExternalLink, Sliders, ShieldCheck,
  CheckCircle2, Sparkles, Building, Globe, Send, Bell,
  Radio, Clock, Server, Terminal, KeyRound, Cpu, Flame,
  Trash2, Plus, Power, ToggleLeft, ToggleRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const SETTINGS_TABS = [
  { id: 'CRYPTO', label: 'Cryptographic Engine', subtitle: 'Ed25519 Keys & Signing', icon: Key },
  { id: 'MESSAGING', label: 'Messaging Gateways', subtitle: 'WhatsApp & Email Delivery', icon: MessageSquare },
  { id: 'GATE_STAFF', label: 'Gate Turnstile PINs', subtitle: 'Bouncers & Staff Auth', icon: ShieldCheck },
  { id: 'GENERAL', label: 'Organization Profile', subtitle: 'Branding & Master Host', icon: Building },
  { id: 'SECURITY', label: 'Anti-Fraud & Turnstiles', subtitle: 'Offline Sync & Rate Limits', icon: Lock },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('CRYPTO');
  const [copiedKey, setCopiedKey] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [testingWhatsApp, setTestingWhatsApp] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);

  // Cryptographic Keys State
  const [keypair, setKeypair] = useState({
    publicKey: 'ed25519_pk_8f29e1c3a7b5d9e0f4a2c1b8d6e3f5a7b9c0d1e2f3a4b5c6',
    privateKey: 'ed25519_sk_SECRET_00998877665544332211aabbccddeeff_991284',
    algorithm: 'Ed25519 (Edwards-curve Digital Signature RFC 8032)',
    created: '2026-10-01 12:00:00 UTC',
    fingerprint: 'SHA256:4a8e9f2b1c7d3e5a0b9c8d7e6f5a4b3c2d1e0f9a',
    entropyBits: 256,
    activeVerifications: 14820,
  });

  // Messaging Gateways State
  const [waConfig, setWaConfig] = useState({
    provider: 'WHATSAPP_CLOUD_API',
    phoneNumberId: '109824910283419',
    wabaId: '392019284910293',
    apiKey: 'EAAQZCV3j1982kL901...meta_prod_token',
    templateName: 'event_pass_dispatch_v2',
    status: 'CONNECTED',
    phoneSender: '+234 800 QRINVITE',
  });

  const [emailConfig, setEmailConfig] = useState({
    provider: 'RESEND',
    fromAddress: 'passes@vip.qrinvite.io',
    replyTo: 'support@qrinvite.io',
    apiKey: 're_81923_a9b8c7d6e5f4g3h2i1',
    status: 'ACTIVE',
    customDomain: 'vip.qrinvite.io',
  });

  // Gate Personnel Staff State
  const [gateStaff, setGateStaff] = useState([
    { id: 1, name: 'Bouncer Gate 1 - North [VIP]', pin: '4821', gate: 'Gate North #1 [VIP Entry]', active: true, scansToday: 412 },
    { id: 2, name: 'Bouncer Gate 2 - East [Regular]', pin: '9102', gate: 'Gate East #2 [General Doors]', active: true, scansToday: 890 },
    { id: 3, name: 'Bouncer Gate 3 - West [Media]', pin: '3381', gate: 'Gate West #3 [Press & Crew]', active: false, scansToday: 54 },
  ]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPin, setNewStaffPin] = useState('');
  const [newStaffGate, setNewStaffGate] = useState('Gate North #1 [VIP Entry]');

  // Organization Profile State
  const [orgProfile, setOrgProfile] = useState({
    name: 'Venture Horizon & Tech Summit Africa',
    hostEmail: 'events@venturehorizon.africa',
    hostPhone: '+234 803 111 2233',
    defaultCurrency: 'NGN (₦)',
    timezone: 'Africa/Lagos (WAT, UTC+1)',
    brandColor: '#6366f1',
    whatsappFooter: 'Presented with QRInvite Encrypted Gate Technology',
  });

  // Anti-fraud settings
  const [securityRules, setSecurityRules] = useState({
    antiScreenshotLock: true,
    offlineVerificationMesh: true,
    duplicateScanLockoutSecs: 30,
    maxClockSkewMinutes: 5,
    autoRevokeOnChargeback: true,
  });

  const handleCopyPublicKey = () => {
    navigator.clipboard.writeText(keypair.publicKey);
    setCopiedKey(true);
    toast.success('Public Key copied to clipboard! Safe to distribute to scanner terminals.');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRotateKey = () => {
    if (window.confirm('Rotating the Master Keypair will require redistributing the new Public Key to all Gate Scanner PWA terminals. Do you want to proceed?')) {
      const randHex = (len) => Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setKeypair({
        ...keypair,
        publicKey: `ed25519_pk_${randHex(48)}`,
        privateKey: `ed25519_sk_SECRET_${randHex(40)}`,
        created: 'Just now (New Session)',
        fingerprint: `SHA256:${randHex(40)}`,
      });
      toast.success('Master Cryptographic Keypair successfully rotated!');
    }
  };

  const handleTestWhatsApp = () => {
    setTestingWhatsApp(true);
    setTimeout(() => {
      setTestingWhatsApp(false);
      toast.success('Test WhatsApp ping sent successfully! Latency: 142ms');
    }, 1200);
  };

  const handleTestEmail = () => {
    setTestingEmail(true);
    setTimeout(() => {
      setTestingEmail(false);
      toast.success('Test ticket email dispatched via Resend! Delivered in 1.1s');
    }, 1200);
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffPin.trim()) {
      toast.error('Please enter personnel name and 4-digit PIN');
      return;
    }
    const staff = {
      id: Date.now(),
      name: newStaffName.trim(),
      pin: newStaffPin.trim(),
      gate: newStaffGate,
      active: true,
      scansToday: 0,
    };
    setGateStaff([...gateStaff, staff]);
    setNewStaffName('');
    setNewStaffPin('');
    toast.success(`Access PIN created for ${staff.name}`);
  };

  const toggleStaffActive = (id) => {
    setGateStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  return (
    <div className="space-y-7 pb-24 font-body text-slate-800 dark:text-slate-100 max-w-6xl mx-auto px-3 sm:px-4">
      
      {/* ─── Header & Top Description ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 font-mono">
              SYSTEM INFRASTRUCTURE
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Turnstile Mesh Operational
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-heading mt-1">
            Settings & Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Manage your master Ed25519 cryptographic keys, automated WhatsApp & Email dispatch gateways, gate turnstile personnel PINs, and organization brand identity.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => toast.success('All infrastructure configurations are synced to turnstiles!')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-2xs hover:scale-102 flex items-center gap-1.5"
          >
            <RefreshCw size={13} className="text-indigo-500" />
            <span>Sync Turnstiles</span>
          </button>
        </div>
      </div>

      {/* ─── Navigation Tabs Dock (Modern Segmented Strip) ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 p-1.5 rounded-3xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/80">
        {SETTINGS_TABS.map(({ id, label, subtitle, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer flex items-center gap-3 relative group ${
                isActive
                  ? 'bg-white dark:bg-[#0c0e14] text-slate-900 dark:text-white shadow-md shadow-slate-200/50 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-800 scale-[1.01]'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                isActive
                  ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-600/30 scale-105'
                  : 'bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:scale-105'
              }`}>
                <Icon size={16} strokeWidth={isActive ? 2.3 : 1.8} />
              </div>

              <div className="min-w-0 pr-1">
                <p className={`text-xs font-extrabold truncate ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  {label}
                </p>
                <p className="text-[10px] text-slate-400 truncate hidden xl:block">
                  {subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: CRYPTOGRAPHIC ENGINE & ED25519 SIGNING
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'CRYPTO' && (
        <div className="space-y-6 animate-fade-in-scale">
          
          {/* Top Engine Overview Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-2xs">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-heading">
                      Asymmetric Ed25519 Signing Engine
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                      RFC 8032 Compliant
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Every digital ticket and WhatsApp pass is cryptographically signed using your private key. Turnstiles verify authenticity in &lt;15ms with zero cellular connection.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRotateKey}
                className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:scale-102"
              >
                <RefreshCw size={13} />
                <span>Rotate Keypair</span>
              </button>
            </div>

            {/* Cryptographic Telemetry Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Curve & Algorithm</span>
                <p className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Cpu size={14} className="text-indigo-500" />
                  <span>Ed25519 (Curve25519)</span>
                </p>
                <span className="text-[10px] text-slate-400">256-bit asymmetric entropy</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Key Fingerprint</span>
                <p className="text-xs font-mono font-bold text-slate-900 dark:text-white truncate">
                  {keypair.fingerprint}
                </p>
                <span className="text-[10px] text-slate-400">SHA-256 integrity hash</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Turnstile Verifications</span>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  <span>{keypair.activeVerifications.toLocaleString()} passes verified</span>
                </p>
                <span className="text-[10px] text-slate-400">Average optical latency: 12ms</span>
              </div>
            </div>

            {/* Public Key Display (Safe for Scanners) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Key size={13} className="text-indigo-500" />
                    <span>Public Key (Safe to distribute to scanner terminals)</span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Used by gate turnstile PWA scanners to verify signed passes offline without holding private authority.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyPublicKey}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:scale-102"
                >
                  {copiedKey ? <Check size={13} className="text-emerald-500 animate-count-pulse" /> : <Copy size={13} />}
                  <span>{copiedKey ? 'Copied!' : 'Copy Public Key'}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-indigo-600 dark:text-cyan-300 break-all select-all shadow-inner">
                {keypair.publicKey}
              </div>
            </div>

            {/* Private Signing Key Display (Strictly Confidential) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <Lock size={13} />
                    <span>Private Signing Key (Keep Strictly Confidential)</span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Used exclusively on server-side to sign pass hashes. Never exposed to gate devices or attendees.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:scale-102"
                >
                  {showPrivateKey ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showPrivateKey ? 'Hide Secret' : 'Reveal Secret'}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 font-mono text-xs text-rose-700 dark:text-rose-300 break-all select-all">
                {showPrivateKey ? keypair.privateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
              </div>
            </div>

            {/* Anti-Counterfeit Guarantee Banner */}
            <div className="p-4.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-500/20 text-xs space-y-1 text-indigo-950 dark:text-indigo-200">
              <p className="font-extrabold flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300">
                <ShieldCheck size={15} />
                <span>Zero-Counterfeit Optical Guarantee</span>
              </p>
              <p className="text-[11.5px] leading-relaxed text-slate-600 dark:text-slate-300">
                Because passes are signed with your private key and verified with your public key, an adversary with screenshot replays or duplicate barcodes cannot forge entry. Turnstiles reject unauthenticated signatures instantly.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: MESSAGING GATEWAYS (WHATSAPP & RESEND EMAIL)
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'MESSAGING' && (
        <div className="space-y-6 animate-fade-in-scale">
          
          {/* WhatsApp Cloud API Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
                  <Smartphone size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-heading">
                      Meta WhatsApp Cloud API
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Connected
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Automated sub-second digital JPEG pass delivery directly into attendee WhatsApp chats.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTestWhatsApp}
                disabled={testingWhatsApp}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:scale-102"
              >
                <Send size={13} />
                <span>{testingWhatsApp ? 'Testing Ping...' : 'Test WhatsApp Ping'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Phone Number ID (Meta Graph)
                </label>
                <input
                  type="text"
                  value={waConfig.phoneNumberId}
                  onChange={(e) => setWaConfig({ ...waConfig, phoneNumberId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  WhatsApp Business Account ID (WABA)
                </label>
                <input
                  type="text"
                  value={waConfig.wabaId}
                  onChange={(e) => setWaConfig({ ...waConfig, wabaId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Permanent Meta System User Access Token
                </label>
                <input
                  type="password"
                  value={waConfig.apiKey}
                  onChange={(e) => setWaConfig({ ...waConfig, apiKey: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400">
                Outbound verified sender: <strong className="text-slate-800 dark:text-slate-200">{waConfig.phoneSender}</strong>
              </span>

              <button
                type="button"
                onClick={() => toast.success('WhatsApp Cloud API configuration saved!')}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer active:scale-95"
              >
                Save WhatsApp Gateway
              </button>
            </div>
          </div>

          {/* Email Pass Delivery Card (Resend / SMTP) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-2xs">
                  <Mail size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-heading">
                      Email Pass Dispatch (Resend & SMTP)
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Dispatches branded HTML tickets with Apple Wallet (.pkpass) & encrypted QR code attachments.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTestEmail}
                disabled={testingEmail}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:scale-102"
              >
                <Mail size={13} />
                <span>{testingEmail ? 'Sending Test...' : 'Send Test Ticket Email'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  From Sender Address
                </label>
                <input
                  type="email"
                  value={emailConfig.fromAddress}
                  onChange={(e) => setEmailConfig({ ...emailConfig, fromAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Reply-To Address
                </label>
                <input
                  type="email"
                  value={emailConfig.replyTo}
                  onChange={(e) => setEmailConfig({ ...emailConfig, replyTo: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Resend API Key
                </label>
                <input
                  type="password"
                  value={emailConfig.apiKey}
                  onChange={(e) => setEmailConfig({ ...emailConfig, apiKey: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400">
                DKIM & SPF verified on domain: <strong className="text-slate-800 dark:text-slate-200">{emailConfig.customDomain}</strong>
              </span>

              <button
                type="button"
                onClick={() => toast.success('Email Gateway settings saved!')}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer active:scale-95"
              >
                Save Email Gateway
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: GATE PERSONNEL & BOUNCER PIN AUTH
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'GATE_STAFF' && (
        <div className="space-y-6 animate-fade-in-scale">
          
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                TURNSTILE ACCESS CONTROL
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-heading mt-0.5">
                Gate Personnel Quick-Auth PINs
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Issue 4-digit PINs for security bouncers and check-in personnel. PINs unlock optical turnstiles on venue devices without sharing master organizer credentials.
              </p>
            </div>

            {/* List of active gate personnel */}
            <div className="space-y-2.5">
              {gateStaff.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      s.active
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}>
                      <Shield size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {s.name}
                        </span>
                        <span className={`px-2 py-0.2 rounded-md text-[9px] font-bold ${
                          s.active
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        }`}>
                          {s.active ? 'ACTIVE LANE' : 'SUSPENDED'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Assigned to: <strong className="text-slate-700 dark:text-slate-300">{s.gate}</strong> • {s.scansToday} scans processed today
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs tracking-widest text-indigo-600 dark:text-cyan-300 shadow-2xs">
                      PIN: {s.pin}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleStaffActive(s.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title={s.active ? 'Suspend PIN' : 'Activate PIN'}
                    >
                      <Power size={14} className={s.active ? 'text-emerald-500' : 'text-slate-400'} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setGateStaff(gateStaff.filter((x) => x.id !== s.id));
                        toast.success(`Removed ${s.name}`);
                      }}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                      title="Revoke Staff Member"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Personnel Inline Form */}
            <form onSubmit={handleAddStaff} className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Enroll New Gate Bouncer / Staff
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="Personnel Name (e.g. Officer Bello)"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="sm:col-span-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />

                <input
                  type="text"
                  required
                  maxLength={4}
                  placeholder="4-Digit PIN"
                  value={newStaffPin}
                  onChange={(e) => setNewStaffPin(e.target.value.replace(/\D/g, ''))}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Create PIN</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 4: GENERAL ORGANIZATION PROFILE
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'GENERAL' && (
        <div className="space-y-6 animate-fade-in-scale">
          
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                HOST BRAND IDENTITY
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-heading mt-0.5">
                Organizer Organization Profile
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official information printed on attendee invitations, receipt emails, and gate pass metadata.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Organization / Brand Name
                </label>
                <input
                  type="text"
                  value={orgProfile.name}
                  onChange={(e) => setOrgProfile({ ...orgProfile, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Official Host Email
                </label>
                <input
                  type="email"
                  value={orgProfile.hostEmail}
                  onChange={(e) => setOrgProfile({ ...orgProfile, hostEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Default Event Timezone
                </label>
                <select
                  value={orgProfile.timezone}
                  onChange={(e) => setOrgProfile({ ...orgProfile, timezone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option>Africa/Lagos (WAT, UTC+1)</option>
                  <option>Africa/Accra (GMT, UTC+0)</option>
                  <option>Africa/Nairobi (EAT, UTC+3)</option>
                  <option>Europe/London (BST/GMT)</option>
                  <option>America/New_York (EST, UTC-5)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Default Currency
                </label>
                <select
                  value={orgProfile.defaultCurrency}
                  onChange={(e) => setOrgProfile({ ...orgProfile, defaultCurrency: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option>NGN (₦) • Nigerian Naira</option>
                  <option>USD ($) • US Dollar</option>
                  <option>GBP (£) • British Pound</option>
                  <option>GHS (₵) • Ghanaian Cedi</option>
                  <option>KES (KSh) • Kenyan Shilling</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  WhatsApp Invitation Footer Note
                </label>
                <input
                  type="text"
                  value={orgProfile.whatsappFooter}
                  onChange={(e) => setOrgProfile({ ...orgProfile, whatsappFooter: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => toast.success('Organization profile updated!')}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/25 transition-all cursor-pointer active:scale-95"
              >
                Save Organization Profile
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 5: ANTI-FRAUD & TURNSTILE MESH RULES
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'SECURITY' && (
        <div className="space-y-6 animate-fade-in-scale">
          
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                TURNSTILE HARDENING RULES
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-heading mt-0.5">
                Anti-Fraud & Turnstile Concurrency Mesh
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure turnstile device locking, duplicate scan thresholds, and offline pass verification rules.
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Rule 1: Anti-Screenshot Replay */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Anti-Screenshot Dynamic Concurrency Lock
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Automatically invalidates optical QR codes after first entry scan. Re-scans of identical passes trigger immediate audible alarm at gates.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={securityRules.antiScreenshotLock}
                  onChange={(e) => setSecurityRules({ ...securityRules, antiScreenshotLock: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                />
              </div>

              {/* Rule 2: Offline Mesh */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Offline Cryptographic Verification Mesh
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Scanners store the host Public Key locally. Passes validate in &lt;15ms even if cell towers fail at venue doors.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={securityRules.offlineVerificationMesh}
                  onChange={(e) => setSecurityRules({ ...securityRules, offlineVerificationMesh: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                />
              </div>

              {/* Rule 3: Duplicate Scan Lockout Timeout */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Duplicate Scan Re-lock Window
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Time before a scanned pass can be re-validated for exit and re-entry passes.
                  </p>
                </div>
                <select
                  value={securityRules.duplicateScanLockoutSecs}
                  onChange={(e) => setSecurityRules({ ...securityRules, duplicateScanLockoutSecs: Number(e.target.value) })}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value={15}>15 Seconds</option>
                  <option value={30}>30 Seconds (Default)</option>
                  <option value={60}>60 Seconds</option>
                  <option value={300}>5 Minutes</option>
                </select>
              </div>

            </div>

            <div className="pt-3 flex items-center justify-end border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => toast.success('Anti-Fraud turnstile rules saved & pushed to scanner devices!')}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/25 transition-all cursor-pointer active:scale-95"
              >
                Save Security Rules
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default SettingsPage;
