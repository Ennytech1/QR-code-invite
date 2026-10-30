import React, { useState } from 'react';
import {
  X, Calendar, MapPin, Users, Key, Sparkles, Check,
  Lock, Globe, DollarSign, Palette, Plus, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEvents } from '../../context/EventContext';

const CARD_THEME_OPTIONS = [
  { id: 'luxury-gold', name: 'Royal Gold & Black', desc: 'Weddings & Royal Galas' },
  { id: 'midnight-vip', name: 'Midnight & Violet VIP', desc: 'Nightlife & Private Parties' },
  { id: 'emerald-prestige', name: 'Emerald Prestige', desc: 'VIP Dinners & Retreats' },
  { id: 'cyber-neon', name: 'Cyber Wave', desc: 'Tech & Rave Festivals' },
  { id: 'minimal-ivory', name: 'Minimalist Ivory', desc: 'Executive & Exhibitions' },
];

const NewEventModal = ({ isOpen, onClose, onEventCreated }) => {
  const { createEvent } = useEvents();

  // Mode: 'PUBLIC' or 'PRIVATE'
  const [eventType, setEventType] = useState('PUBLIC');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    venue: '',
    date: '',
    time: '18:00',
    capacity: 500,
    banner: '',
    hostName: '',
    // Private options
    dressCode: 'Black Tie / Formal Elegance',
    cardTheme: 'luxury-gold',
    customMessage: 'We request the honor of your presence to celebrate with us.',
    // Public options
    ticketTiers: [
      { id: 'tier_1', name: 'Regular Entry', price: 10000, perks: 'General Access' },
      { id: 'tier_2', name: 'VIP Pass', price: 35000, perks: 'VIP fast-track gate & lounge' },
    ],
  });

  const handleAddTier = () => {
    setFormData((prev) => ({
      ...prev,
      ticketTiers: [
        ...prev.ticketTiers,
        { id: 'tier_' + Date.now(), name: 'VVIP Pass', price: 75000, perks: 'All-access' },
      ],
    }));
  };

  const handleRemoveTier = (index) => {
    if (formData.ticketTiers.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      ticketTiers: prev.ticketTiers.filter((_, idx) => idx !== index),
    }));
  };

  const handleTierChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.ticketTiers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, ticketTiers: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.venue || !formData.date) {
      toast.error('Please enter the event title, venue, and date');
      return;
    }

    try {
      const created = createEvent({
        ...formData,
        type: eventType,
        capacity: Number(formData.capacity) || (eventType === 'PRIVATE' ? 100 : 500),
      });

      if (onEventCreated) onEventCreated(created);

      toast.success(
        eventType === 'PRIVATE'
          ? `Private Event "${formData.name}" created! Ready to design and dispatch guest invites.`
          : `Public Event "${formData.name}" published! Tickets are now ready for purchase.`
      );
      onClose();
    } catch (err) {
      toast.error('Failed to create event: ' + err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#121622] border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-100 my-auto">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3B2875] to-[#7C5CFC] text-white flex items-center justify-center shadow-md">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                Create New Event
              </h3>
              <p className="text-xs text-slate-400">
                Choose between public ticket sales or private invitation dispatch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* ──── DUAL MODE SELECTOR PILL ──── */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Event Access Model
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setEventType('PUBLIC')}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  eventType === 'PUBLIC'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe size={15} />
                <span>Public Ticketed</span>
              </button>

              <button
                type="button"
                onClick={() => setEventType('PRIVATE')}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  eventType === 'PRIVATE'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock size={15} />
                <span>Private / RSVP Only</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 px-1">
              {eventType === 'PUBLIC'
                ? '🌍 Public events are listed on the discovery feed so attendees can buy tickets online.'
                : '🔒 Private events are strictly invitation-only (e.g. Weddings, VIP Galas). You design and send custom JPEG cards via WhatsApp.'}
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Event Title
            </label>
            <input
              type="text"
              required
              placeholder={eventType === 'PUBLIC' ? 'e.g. Lagos Neon Sunset Party' : 'e.g. Folashade & Bayo Royal Wedding'}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-sm focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          {/* Host / Organizer Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Host / Organizing Entity
            </label>
            <input
              type="text"
              placeholder={eventType === 'PUBLIC' ? 'e.g. LiveNation Africa' : 'e.g. The Adeleke Family'}
              value={formData.hostName}
              onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-sm focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          {/* Venue */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Venue Location
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                required
                placeholder="e.g. Eko Convention Centre, Victoria Island"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-sm focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
          </div>

          {/* Date, Time, Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Start Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {eventType === 'PRIVATE' ? 'Guest Limit' : 'Total Capacity'}
              </label>
              <input
                type="number"
                min="1"
                placeholder={eventType === 'PRIVATE' ? '100' : '500'}
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
          </div>

          {/* ──── CONDITIONAL OPTIONS: PRIVATE EVENT (CARD THEME & DRESS CODE) ──── */}
          {eventType === 'PRIVATE' && (
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-400">
                <Palette size={15} />
                <span>Invitation Card Designer Settings</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Default Invitation Card Theme
                </label>
                <select
                  value={formData.cardTheme}
                  onChange={(e) => setFormData({ ...formData, cardTheme: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  {CARD_THEME_OPTIONS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.desc})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Dress Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. Royal Traditional Regal / Black Tie"
                  value={formData.dressCode}
                  onChange={(e) => setFormData({ ...formData, dressCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Custom Invitation Message (Printed on Card)
                </label>
                <textarea
                  rows={2}
                  value={formData.customMessage}
                  onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-amber-400"
                  placeholder="e.g. We request the honor of your presence to celebrate with us."
                />
              </div>
            </div>
          )}

          {/* ──── CONDITIONAL OPTIONS: PUBLIC EVENT (TICKET TIERS) ──── */}
          {eventType === 'PUBLIC' && (
            <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-400">
                  <DollarSign size={15} />
                  <span>Ticket Pricing Tiers</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddTier}
                  className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={13} /> Add Tier
                </button>
              </div>

              <div className="space-y-2">
                {formData.ticketTiers.map((tier, idx) => (
                  <div key={tier.id || idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Tier Name (e.g. VIP)"
                      value={tier.name}
                      onChange={(e) => handleTierChange(idx, 'name', e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-white text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Price (₦)"
                      value={tier.price}
                      onChange={(e) => handleTierChange(idx, 'price', Number(e.target.value))}
                      className="w-28 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-white text-xs font-mono"
                    />
                    {formData.ticketTiers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTier(idx)}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles size={16} />
              {eventType === 'PUBLIC' ? 'Publish Public Event' : 'Create Private Guest Event'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default NewEventModal;
