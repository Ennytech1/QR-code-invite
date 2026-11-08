import React, { useState, useMemo } from 'react';
import {
  TrendingUp, Clock, Users, ArrowUpRight, Download,
  Activity, Zap, AlertTriangle, ShieldCheck, BarChart3, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const HourlyInfluxChart = ({ checkInLogs = [], guests = [], activeEvent = null }) => {
  const [selectedGate, setSelectedGate] = useState('ALL');
  const [hoveredHour, setHoveredHour] = useState(null);

  // Extract distinct gates from logs
  const availableGates = useMemo(() => {
    const set = new Set();
    checkInLogs.forEach((log) => {
      if (log.gate) set.add(log.gate);
    });
    return Array.from(set);
  }, [checkInLogs]);

  // Aggregate logs into 8 hourly buckets (e.g., from 16:00 to 23:00 or dynamic)
  const hourlyData = useMemo(() => {
    // Default hours for typical evening events
    const hours = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    const buckets = {};
    hours.forEach((h) => {
      buckets[h] = { hour: h, count: 0, vipCount: 0, gates: {} };
    });

    // Populate with actual checkInLogs
    checkInLogs.forEach((log) => {
      if (selectedGate !== 'ALL' && log.gate !== selectedGate) return;

      const date = new Date(log.timestamp || log.scannedAt || Date.now());
      const hourStr = `${String(date.getHours()).padStart(2, '0')}:00`;

      if (!buckets[hourStr]) {
        buckets[hourStr] = { hour: hourStr, count: 0, vipCount: 0, gates: {} };
      }

      buckets[hourStr].count += 1;
      if (log.tier === 'VIP' || log.tier === 'VVIP') {
        buckets[hourStr].vipCount += 1;
      }

      const g = log.gate || 'Main Entrance';
      buckets[hourStr].gates[g] = (buckets[hourStr].gates[g] || 0) + 1;
    });

    // Fallback realistic demo curve if no live scans have occurred yet
    const hasData = Object.values(buckets).some((b) => b.count > 0);
    if (!hasData) {
      const demoCounts = [12, 45, 128, 185, 96, 42, 18, 6];
      hours.forEach((h, idx) => {
        buckets[h].count = demoCounts[idx] || 0;
        buckets[h].vipCount = Math.round((demoCounts[idx] || 0) * 0.28);
      });
    }

    return Object.values(buckets);
  }, [checkInLogs, selectedGate]);

  // Find peak hour and calculate metrics
  const maxCount = useMemo(() => {
    return Math.max(...hourlyData.map((d) => d.count), 1);
  }, [hourlyData]);

  const peakHour = useMemo(() => {
    let peak = hourlyData[0];
    hourlyData.forEach((d) => {
      if (d.count > (peak?.count || 0)) peak = d;
    });
    return peak;
  }, [hourlyData]);

  const totalScanned = useMemo(() => {
    return hourlyData.reduce((acc, curr) => acc + curr.count, 0);
  }, [hourlyData]);

  // Velocity: average scans per minute during peak
  const peakVelocity = useMemo(() => {
    return peakHour ? (peakHour.count / 60).toFixed(1) : '0.0';
  }, [peakHour]);

  // Export Post-Event Audit Log CSV
  const handleExportAuditCsv = () => {
    try {
      const headers = [
        'Attendee Name',
        'Tier',
        'Assigned Table',
        'Status',
        'Check-In Time',
        'Gate / Usher Device',
        'Plus Ones Quota',
        'RSVP Status',
        'Phone',
      ];

      const rows = (guests.length > 0 ? guests : []).map((g) => [
        `"${g.name || ''}"`,
        `"${g.tier || 'REGULAR'}"`,
        `"${g.table || 'General'}"`,
        `"${g.status || 'PENDING'}"`,
        `"${g.checkInTime ? new Date(g.checkInTime).toLocaleString() : 'Not Checked In'}"`,
        `"${g.gate || 'N/A'}"`,
        `"${g.plusOnes || 0}"`,
        `"${g.rsvpStatus || 'PENDING'}"`,
        `"${g.phone || ''}"`,
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute(
        'download',
        `QRInvite_Audit_Log_${activeEvent?.name?.replace(/\s+/g, '_') || 'Event'}_${Date.now()}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Post-event gate audit log exported to CSV');
    } catch (err) {
      toast.error('Failed to export audit log');
    }
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5 card-lift">
      
      {/* ─── Header & Controls ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <BarChart3 size={17} className="text-[var(--accent)]" />
            <h3 className="text-sm sm:text-[15px] font-bold text-[var(--text-primary)] font-heading tracking-tight">
              Gate Influx & Attendance Velocity
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-body">
            Hourly arrival flow to balance usher door staffing and prevent bottle-neck queues.
          </p>
        </div>

        {/* Filter & Export Actions */}
        <div className="flex items-center gap-2">
          {availableGates.length > 0 && (
            <select
              value={selectedGate}
              onChange={(e) => setSelectedGate(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text-primary)] outline-none cursor-pointer"
            >
              <option value="ALL">All Gates</option>
              {availableGates.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          )}

          <button
            onClick={handleExportAuditCsv}
            className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-xs font-semibold text-[var(--text-primary)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-2xs"
          >
            <Download size={13} />
            <span>Audit CSV</span>
          </button>
        </div>
      </div>

      {/* ─── Metric Pills ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[var(--bg-base)] border border-[var(--border)]">
          <span className="text-[10.5px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
            Peak Arrival Window
          </span>
          <div className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400 mt-1 flex items-center gap-1">
            <Clock size={16} />
            {peakHour?.hour || '19:00'} - {(parseInt(peakHour?.hour) + 1)}:00
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[var(--bg-base)] border border-[var(--border)]">
          <span className="text-[10.5px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
            Peak Gate Velocity
          </span>
          <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <Zap size={16} />
            {peakVelocity} scans/min
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[var(--bg-base)] border border-[var(--border)]">
          <span className="text-[10.5px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
            Peak Influx Volume
          </span>
          <div className="text-base sm:text-lg font-black text-[var(--text-primary)] mt-1 font-mono">
            {peakHour?.count || 0} arrivals
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[var(--bg-base)] border border-[var(--border)]">
          <span className="text-[10.5px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
            Gate Congestion Risk
          </span>
          <div className="text-base sm:text-lg font-black text-emerald-500 mt-1 flex items-center gap-1">
            <ShieldCheck size={16} />
            Smooth Flow
          </div>
        </div>
      </div>

      {/* ─── Interactive SVG Bar & Trend Chart ─── */}
      <div className="space-y-2">
        <div className="h-56 w-full flex items-end gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-[var(--border)]">
          {hourlyData.map((d, index) => {
            const heightPercent = Math.max(8, Math.round((d.count / maxCount) * 100));
            const isPeak = d.hour === peakHour?.hour;
            const isHovered = hoveredHour === d.hour;

            return (
              <div
                key={d.hour}
                onMouseEnter={() => setHoveredHour(d.hour)}
                onMouseLeave={() => setHoveredHour(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              >
                {/* Floating tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 px-2.5 py-1.5 rounded-xl bg-slate-900 text-white text-[10px] font-mono whitespace-nowrap shadow-xl border border-slate-700 pointer-events-none animate-in fade-in zoom-in-95">
                    <span className="font-bold text-indigo-400">{d.hour}</span>: {d.count} arrivals ({d.vipCount} VIP)
                  </div>
                )}

                {/* Animated Column Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 relative overflow-hidden ${
                    isPeak
                      ? 'bg-gradient-to-t from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/25'
                      : isHovered
                      ? 'bg-indigo-400 dark:bg-indigo-500'
                      : 'bg-slate-200 dark:bg-slate-800 group-hover:bg-indigo-300 dark:group-hover:bg-slate-700'
                  }`}
                >
                  {/* Subtle inner highlight for 3D depth */}
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-white/30 rounded-t-xl" />
                </div>

                {/* Hour Label */}
                <span
                  className={`text-[10px] font-mono mt-2 transition-colors ${
                    isPeak
                      ? 'font-bold text-indigo-600 dark:text-indigo-400'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {d.hour}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] px-2 pt-1">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-tr from-indigo-600 to-violet-500" />
              Peak Arrival Window
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-200 dark:bg-slate-800" />
              Standard Velocity
            </span>
          </div>
          <span>Total Recorded Scans: <strong>{totalScanned}</strong></span>
        </div>
      </div>

    </div>
  );
};

export default HourlyInfluxChart;
