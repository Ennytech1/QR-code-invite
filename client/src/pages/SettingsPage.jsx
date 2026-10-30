import React, { useState } from 'react';
import {
  Key, Shield, MessageSquare, Mail, Smartphone,
  Users, Lock, RefreshCw, Copy, Check, Eye, EyeOff,
  Save, AlertTriangle, ExternalLink, Sliders
} from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('CRYPTO'); // CRYPTO | MESSAGING | GATE_STAFF | GENERAL
  const [copiedKey, setCopiedKey] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  // Crypto state
  const [keypair, setKeypair] = useState({
    publicKey: 'ed25519_pk_8f29e1c3a7b5d9e0f4a2c1b8d6e3f5a7b9c0d1e2f3a4b5c6',
    privateKey: 'ed25519_sk_SECRET_00998877665544332211aabbccddeeff',
    algorithm: 'Ed25519 (Edwards-curve Digital Signature Algorithm RFC 8032)',
    created: '2026-10-01 12:00:00 UTC',
    fingerprint: 'SHA256:4a8e9f2b1c7d3e5a0b9c8d7e6f5a4b3c2d1e0f9a',
  });

  // Messaging Gateways
  const [waConfig, setWaConfig] = useState({
    provider: 'WHATSAPP_CLOUD_API',
    phoneNumberId: '109824910283419',
    wabaId: '392019284910293',
    apiKey: 'EAAQZCV3j1...hidden_token',
    templateName: 'event_pass_dispatch_v2',
  });

  const [emailConfig, setEmailConfig] = useState({
    provider: 'RESEND',
    fromAddress: 'tickets@vip.qrinvite.io',
    replyTo: 'support@qrinvite.io',
    apiKey: 're_81923_a9b8c7d6e5',
  });

  // Gate Staff PINs
  const [gateStaff, setGateStaff] = useState([
    { id: 1, name: 'Bouncer Gate 1 - North', pin: '4821', gate: 'Gate North #1 [VIP]', active: true },
    { id: 2, name: 'Bouncer Gate 2 - East',  pin: '9102', gate: 'Gate East #2 [Regular]', active: true },
    { id: 3, name: 'Bouncer Gate 3 - West',  pin: '3381', gate: 'Gate West #3 [General]', active: false },
  ]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPin, setNewStaffPin] = useState('');
  const [newStaffGate, setNewStaffGate] = useState('Gate North #1 [VIP]');

  const handleCopyPublicKey = () => {
    navigator.clipboard.writeText(keypair.publicKey);
    setCopiedKey(true);
    toast.success('Public Key copied to clipboard');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRotateKey = () => {
    if (window.confirm('Rotating the Master Keypair will require redistributing the Public Key to all Gate Scanner PWA terminals. Are you sure?')) {
      const randHex = (len) => Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setKeypair({
        ...keypair,
        publicKey: `ed25519_pk_${randHex(48)}`,
        privateKey: `ed25519_sk_SECRET_${randHex(40)}`,
        created: 'Just now',
        fingerprint: `SHA256:${randHex(40)}`,
      });
      toast.success('Master Cryptographic Keypair successfully rotated!');
    }
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaffName || !newStaffPin) {
      toast.error('Enter staff name and 4-digit PIN');
      return;
    }
    const staff = {
      id: Date.now(),
      name: newStaffName,
      pin: newStaffPin,
      gate: newStaffGate,
      active: true,
    };
    setGateStaff([...gateStaff, staff]);
    setNewStaffName('');
    setNewStaffPin('');
    toast.success(`Access PIN created for ${newStaffName}`);
  };

  return (
    <div className="space-y-6 animate-fade-up pb-16">

      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-[var(--text-primary)]">Settings & Infrastructure</h1>
        <p className="text-[13px] text-[var(--text-tertiary)] mt-0.5">
          Configure cryptographic asymmetric keys, messaging delivery APIs, and gate personnel access
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] max-w-fit">
        {[
          { id: 'CRYPTO',     label: 'Cryptographic Keys',   icon: Key },
          { id: 'MESSAGING',  label: 'Messaging Gateways',   icon: MessageSquare },
          { id: 'GATE_STAFF', label: 'Gate Bouncer PINs',    icon: Shield },
          { id: 'GENERAL',    label: 'Organization Profile', icon: Sliders },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`h-8 px-3.5 rounded-lg text-[12px] font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === id
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-xs'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
          >
            <Icon size={13} strokeWidth={2} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Cryptography & Ed25519 Keys */}
      {activeTab === 'CRYPTO' && (
        <div className="space-y-4 max-w-4xl">
          <div className="card-glow rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Shield size={16} className="text-indigo-400" />
                  Asymmetric Ed25519 Signing Engine
                </h3>
                <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">
                  Every issued QR ticket is cryptographically signed using this private key. Scanner terminals verify passes using only the public key in &lt;20ms.
                </p>
              </div>
              <button
                onClick={handleRotateKey}
                className="h-8 px-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw size={12} /> Rotate Keypair
              </button>
            </div>

            {/* Algorithm info pill */}
            <div className="p-3 rounded-lg bg-[var(--bg-subtle)] text-[11px] font-mono text-[var(--text-secondary)] space-y-1">
              <div><strong className="text-[var(--text-primary)]">Algorithm:</strong> {keypair.algorithm}</div>
              <div><strong className="text-[var(--text-primary)]">Key Fingerprint:</strong> {keypair.fingerprint}</div>
              <div><strong className="text-[var(--text-primary)]">Provisioned:</strong> {keypair.created}</div>
            </div>

            {/* Public Key Export */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[12px]">
                <label className="font-semibold text-[var(--text-primary)]">Public Key (Safe to distribute to scanners)</label>
                <button
                  onClick={handleCopyPublicKey}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedKey ? 'Copied!' : 'Copy Public Key'}</span>
                </button>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-[var(--border)] font-mono text-[11px] text-cyan-300 break-all select-all">
                {keypair.publicKey}
              </div>
            </div>

            {/* Private Signing Key */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[12px]">
                <label className="font-semibold text-red-400 flex items-center gap-1">
                  <Lock size={12} /> Private Signing Key (Keep Strictly Confidential)
                </label>
                <button
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  {showPrivateKey ? <EyeOff size={12} /> : <Eye size={12} />}
                  <span>{showPrivateKey ? 'Hide Secret' : 'Reveal Secret'}</span>
                </button>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-red-500/20 font-mono text-[11px] text-red-300/80 break-all">
                {showPrivateKey ? keypair.privateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-start gap-2">
              <Shield size={14} className="shrink-0 mt-0.5 text-indigo-400" />
              <span>
                <strong>Anti-Counterfeit Guarantee:</strong> Even if an adversary possesses a high-resolution screenshot or full database read access to the guest list, they cannot forge a valid pass without your private key.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Messaging Gateways */}
      {activeTab === 'MESSAGING' && (
        <div className="space-y-5 max-w-4xl">
          {/* WhatsApp API Configuration */}
          <div className="card-glow rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Smartphone size={18} />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[var(--text-primary)]">WhatsApp Cloud API (Meta)</h3>
                  <p className="text-[11px] text-[var(--text-tertiary)]">Automated sub-second pass delivery directly into attendee WhatsApp chats</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Connected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px]">
              <div>
                <label className="block label-xs text-[var(--text-tertiary)] mb-1">Phone Number ID</label>
                <input
                  type="text"
                  value={waConfig.phoneNumberId}
                  onChange={(e) => setWaConfig({ ...waConfig, phoneNumberId: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-primary)] font-mono outline-none"
                />
              </div>
              <div>
                <label className="block label-xs text-[var(--text-tertiary)] mb-1">WhatsApp Business Account ID (WABA)</label>
                <input
                  type="text"
                  value={waConfig.wabaId}
                  onChange={(e) => setWaConfig({ ...waConfig, wabaId: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-primary)] font-mono outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => toast.success('WhatsApp API credentials saved!')}
              className="h-8 px-3 rounded-lg text-[12px] font-semibold text-white cursor-pointer btn-accent flex items-center gap-1.5"
              style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}
            >
              <Save size={13} /> Save WhatsApp Config
            </button>
          </div>

          {/* Email Gateway (Resend / SendGrid) */}
          <div className="card-glow rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Mail size={18} />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[var(--text-primary)]">Email Pass Delivery (Resend / SMTP)</h3>
                  <p className="text-[11px] text-[var(--text-tertiary)]">Delivers branded HTML tickets with Apple Wallet & Google Wallet pkpass attachments</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px]">
              <div>
                <label className="block label-xs text-[var(--text-tertiary)] mb-1">From Sender Address</label>
                <input
                  type="text"
                  value={emailConfig.fromAddress}
                  onChange={(e) => setEmailConfig({ ...emailConfig, fromAddress: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-primary)] outline-none"
                />
              </div>
              <div>
                <label className="block label-xs text-[var(--text-tertiary)] mb-1">Resend API Key</label>
                <input
                  type="password"
                  value={emailConfig.apiKey}
                  onChange={(e) => setEmailConfig({ ...emailConfig, apiKey: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-primary)] font-mono outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => toast.success('Email Gateway settings updated!')}
              className="h-8 px-3 rounded-lg text-[12px] font-semibold text-white cursor-pointer btn-accent flex items-center gap-1.5"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
            >
              <Save size={13} /> Save Email Config
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Gate Staff Access PINs */}
      {activeTab === 'GATE_STAFF' && (
        <div className="space-y-5 max-w-4xl">
          <div className="card-glow rounded-xl p-5 space-y-4">
            <div>
              <h3 className="text-[14px] font-bold text-[var(--text-primary)]">Gate Personnel Quick-Auth PINs</h3>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Provide temporary 4-digit PINs for security personnel and bouncers to unlock PWA scanner terminals without sharing organizer master passwords.
              </p>
            </div>

            {/* List of current staff */}
            <div className="space-y-2">
              {gateStaff.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-subtle)] text-[12px]">
                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">{s.name}</div>
                    <div className="text-[11px] text-[var(--text-tertiary)]">{s.gate}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold tracking-widest px-2.5 py-1 rounded bg-black/40 text-cyan-300 border border-[var(--border)]">
                      {s.pin}
                    </span>
                    <button
                      onClick={() => {
                        setGateStaff(gateStaff.filter(x => x.id !== s.id));
                        toast.success(`Removed ${s.name}`);
                      }}
                      className="text-red-400 hover:text-red-300 font-semibold text-[11px] cursor-pointer"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new staff form */}
            <form onSubmit={handleAddStaff} className="pt-2 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-4 gap-2 text-[12px]">
              <input
                type="text"
                placeholder="Staff / Bouncer Name"
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                className="h-9 px-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-primary)] outline-none"
              />
              <input
                type="text"
                maxLength={4}
                placeholder="4-Digit PIN"
                value={newStaffPin}
                onChange={(e) => setNewStaffPin(e.target.value)}
                className="h-9 px-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-primary)] font-mono outline-none"
              />
              <select
                value={newStaffGate}
                onChange={(e) => setNewStaffGate(e.target.value)}
                className="h-9 px-2.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-primary)] outline-none"
              >
                <option>Gate North #1 [VIP]</option>
                <option>Gate East #2 [Regular]</option>
                <option>Gate West #3 [General]</option>
              </select>
              <button
                type="submit"
                className="h-9 rounded-lg text-white font-semibold cursor-pointer btn-accent"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
              >
                Create PIN
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: General Organization Profile */}
      {activeTab === 'GENERAL' && (
        <div className="card-glow rounded-xl p-5 space-y-4 max-w-2xl text-[13px]">
          <div>
            <h3 className="font-bold text-[15px] text-[var(--text-primary)]">Organizer Organization Profile</h3>
            <p className="text-[11px] text-[var(--text-tertiary)]">Public information displayed on attendee digital invite passes</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block label-xs text-[var(--text-tertiary)] mb-1">Organization / Brand Name</label>
              <input
                type="text"
                defaultValue="Venture Horizon & Tech Summit Africa"
                className="w-full h-9 px-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-primary)] outline-none"
              />
            </div>

            <div>
              <label className="block label-xs text-[var(--text-tertiary)] mb-1">Official Host Email</label>
              <input
                type="email"
                defaultValue="events@venturehorizon.africa"
                className="w-full h-9 px-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-primary)] outline-none"
              />
            </div>

            <div>
              <label className="block label-xs text-[var(--text-tertiary)] mb-1">Default Event Timezone</label>
              <select className="w-full h-9 px-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-primary)] outline-none">
                <option>Africa/Lagos (WAT, UTC+1)</option>
                <option>Africa/Accra (GMT, UTC+0)</option>
                <option>Africa/Nairobi (EAT, UTC+3)</option>
                <option>Europe/London (BST/GMT)</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => toast.success('Organization profile updated!')}
            className="h-9 px-4 rounded-lg text-white font-semibold cursor-pointer btn-accent"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
          >
            Save Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
