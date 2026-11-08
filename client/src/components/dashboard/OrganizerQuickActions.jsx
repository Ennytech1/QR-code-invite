import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Users, Download, Globe, ChevronRight, ExternalLink
} from 'lucide-react';

const OrganizerQuickActions = ({
  onOpenCardForFirstGuest,
  onOpenBulk,
  onExportCSV,
}) => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Design WhatsApp VIP Pass',
      desc: 'Customize luxury gold, emerald or onyx cards',
      icon: Sparkles,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      onClick: onOpenCardForFirstGuest,
    },
    {
      label: 'Batch Import Guestlist (CSV)',
      desc: 'Upload 500+ attendees with table & seat quotas',
      icon: Users,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      onClick: onOpenBulk,
    },
    {
      label: 'Download Gate Audit CSV',
      desc: 'Full log of check-in timestamps and no-shows',
      icon: Download,
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
      onClick: onExportCSV,
    },
    {
      label: 'Public Box Office Hub',
      desc: 'Preview what ticket buyers see online',
      icon: Globe,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      onClick: () => navigate('/explore'),
      isExternal: true,
    },
  ];

  return (
    <div className="rounded-2xl p-5 border border-[var(--border)] bg-[var(--bg-surface)] shadow-xs space-y-3 card-lift">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-sm sm:text-[15px] text-[var(--text-primary)] tracking-tight">
          Host Quick Actions
        </h3>
        <span className="text-[11px] text-[var(--text-secondary)] font-body">Shortcuts</span>
      </div>

      <div className="space-y-2">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              onClick={act.onClick}
              className="w-full p-2.5 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] bg-[var(--bg-base)] hover:bg-[var(--bg-subtle)] text-left transition-all duration-200 flex items-center justify-between group cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${act.color} transition-transform group-hover:scale-105 duration-200`}>
                  <Icon size={15} />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-[var(--text-primary)] font-heading truncate group-hover:text-[var(--accent)] transition-colors">
                    {act.label}
                  </div>
                  <div className="text-[10.5px] text-[var(--text-secondary)] font-body truncate">
                    {act.desc}
                  </div>
                </div>
              </div>

              {act.isExternal ? (
                <ExternalLink size={13} className="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors shrink-0" />
              ) : (
                <ChevronRight size={14} className="text-[var(--text-tertiary)] group-hover:translate-x-0.5 group-hover:text-[var(--text-primary)] transition-all shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OrganizerQuickActions;