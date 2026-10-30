import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Users, Check, FileSpreadsheet, Plus, Trash2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEvents } from '../../context/EventContext';

const BulkGuestModal = ({ isOpen, onClose, defaultEventId }) => {
  const { events, activeEventId, addGuest, bulkAddGuests } = useEvents();

  const [selectedEventId, setSelectedEventId] = useState(defaultEventId || activeEventId || events[0]?.id);
  const [activeTab, setActiveTab] = useState('single'); // 'single' | 'csv'
  const [singleName, setSingleName] = useState('');
  const [singleEmail, setSingleEmail] = useState('');
  const [singlePhone, setSinglePhone] = useState('');
  const [singleTier, setSingleTier] = useState('VIP');
  const [singleTable, setSingleTable] = useState('');

  useEffect(() => {
    if (defaultEventId) {
      setSelectedEventId(defaultEventId);
    } else if (activeEventId) {
      setSelectedEventId(activeEventId);
    } else if (events[0]?.id) {
      setSelectedEventId(events[0].id);
    }
  }, [defaultEventId, activeEventId, isOpen, events]);
  const [plusOnes, setPlusOnes] = useState(0);

  const [csvText, setCsvText] = useState('');
  const [sampleLoaded, setSampleLoaded] = useState(false);

  if (!isOpen) return null;

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const handleSingleSubmit = (e) => {
    e.preventDefault();
    if (!singleName) {
      toast.error('Guest name is required');
      return;
    }

    try {
      addGuest(currentEvent.id, {
        name: singleName,
        email: singleEmail,
        phone: singlePhone,
        tier: singleTier,
        table: singleTable || (currentEvent.type === 'PRIVATE' ? 'Table Reserved' : 'General Admission'),
        plusOnes,
      });

      toast.success(`Guest "${singleName}" added! Invitation card with QR pass ready.`);
      onClose();
    } catch (err) {
      toast.error('Failed to add guest: ' + err.message);
    }
  };

  const handleLoadSampleBatch = () => {
    const demoBatch = `Dr. Amina Yusuf, amina.yusuf@acme.ng, +2348031234567, VVIP, Table 1 High Table, 1
Chinedu Eze, chinedu.eze@lagos.org, +2348059876543, VIP, Table 4 VIP, 0
Fatima Aliyu, fatima.aliyu@fintech.io, +2348071122334, Regular, Table 8 Colleagues, 1
Olumide Bakare, o.bakare@media.ng, +2348123344556, Media, Press Gallery, 0
Hajiya Zainab Bello, z.bello@invest.ng, +2348099887766, VVIP, Table 2 High Table, 1`;

    setCsvText(demoBatch);
    setSampleLoaded(true);
    toast.success('Sample guest list loaded (5 attendees)! Click "Import All" below.');
  };

  const handleCsvSubmit = (e) => {
    e.preventDefault();
    if (!csvText.trim()) {
      toast.error('Please paste CSV text or load a sample batch');
      return;
    }

    const lines = csvText.trim().split('\n');
    const parsedGuests = [];

    for (const line of lines) {
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length > 0 && parts[0]) {
        parsedGuests.push({
          name: parts[0],
          email: parts[1] || '',
          phone: parts[2] || '',
          tier: parts[3] || 'VIP',
          table: parts[4] || 'Reserved',
          plusOnes: Number(parts[5]) || 0,
        });
      }
    }

    if (parsedGuests.length === 0) {
      toast.error('No valid guest records found in CSV');
      return;
    }

    try {
      bulkAddGuests(currentEvent.id, parsedGuests);
      toast.success(`Successfully imported ${parsedGuests.length} guests! Cryptographic QR passes generated.`);
      onClose();
    } catch (err) {
      toast.error('Failed to import CSV: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#121622] border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100 my-auto">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3B2875] to-[#7C5CFC] text-white flex items-center justify-center shadow-md">
              <Users size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                Add Guests & Generate Passes
              </h3>
              <p className="text-xs text-slate-400">Individual entry or bulk CSV/Excel import</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Event Selector Pill */}
        <div className="px-6 pt-4">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Target Event
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
          >
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                [{evt.type}] {evt.name} ({evt.date})
              </option>
            ))}
          </select>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 flex gap-4 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('single')}
            className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === 'single'
                ? 'text-indigo-400 border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Single Guest
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === 'csv'
                ? 'text-indigo-400 border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bulk CSV Ingestion (100+ Guests)
          </button>
        </div>

        {/* Form Body */}
        {activeTab === 'single' ? (
          <form onSubmit={handleSingleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Guest Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Chief Kelechi Okafor & Wife"
                value={singleName}
                onChange={(e) => setSingleName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-sm focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  WhatsApp Phone
                </label>
                <input
                  type="text"
                  placeholder="+234 803 000 0000"
                  value={singlePhone}
                  onChange={(e) => setSinglePhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Access Tier
                </label>
                <select
                  value={singleTier}
                  onChange={(e) => setSingleTier(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="VIP">VIP</option>
                  <option value="VVIP">VVIP / High Table</option>
                  <option value="REGULAR">Regular / Honored Guest</option>
                  <option value="VENDOR">Vendor / Staff</option>
                  <option value="MEDIA">Press / Media</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Table / Seat Assignment
                </label>
                <input
                  type="text"
                  placeholder="e.g. Table 4 • VIP"
                  value={singleTable}
                  onChange={(e) => setSingleTable(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Plus Ones Allowed
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={plusOnes}
                  onChange={(e) => setPlusOnes(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                value={singleEmail}
                onChange={(e) => setSingleEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 cursor-pointer"
              >
                Add Guest & Sign Pass
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCsvSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Paste CSV Records (Format: Name, Email, Phone, Tier, Table, PlusOnes)
                </label>
                <button
                  type="button"
                  onClick={handleLoadSampleBatch}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                >
                  Load 5 Sample Guests
                </button>
              </div>

              <textarea
                rows={5}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="Chief Kelechi Okafor, k.okafor@venture.ng, +2348031112233, VVIP, Table 1, 1&#10;Dr. Amina Yusuf, amina@acme.ng, +2348023334455, VIP, Table 4, 2"
                className="w-full p-3 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {sampleLoaded && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 font-semibold flex items-center justify-between">
                <span>5 records formatted & ready for cryptographic token signing</span>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">READY</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 cursor-pointer"
              >
                Import All & Sign Passes
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default BulkGuestModal;
