import React from 'react';
import { Flame } from 'lucide-react';
import { VIBE_GALLERY } from './landingData';

const MarqueeReelSection = () => {
  return (
    <section className="py-8 overflow-hidden relative border-y border-[var(--border)] bg-[var(--bg-subtle)]/30">
      
      {/* Header Label */}
      <div className="max-w-7xl mx-auto px-4 mb-4 flex items-center justify-between text-[12px] font-semibold text-[var(--text-tertiary)]">
        <span className="flex items-center gap-2 text-indigo-400 uppercase tracking-widest font-mono text-[11px]">
          <Flame size={14} className="text-amber-500" /> Real Events • Real Energy • Verified Gates
        </span>
        <span className="hidden sm:inline-block font-mono text-[11px]">Hover to pause</span>
      </div>

      {/* Marquee Wrapper */}
      <div className="relative w-full overflow-hidden flex">
        {/* Edge Gradient Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[var(--bg-base)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[var(--bg-base)] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex gap-5 py-2">
          {[...VIBE_GALLERY, ...VIBE_GALLERY].map((item, idx) => (
            <div
              key={idx}
              className="w-72 sm:w-80 h-48 rounded-2xl relative overflow-hidden group shrink-0 border border-white/10 shadow-lg cursor-pointer transform hover:scale-[1.03] transition-all duration-300"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                <div>
                  <h4 className="text-[13px] font-bold drop-shadow-sm">{item.title}</h4>
                  <span className="text-[10px] text-zinc-300 font-mono">{item.stat}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold">
                  Popout
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarqueeReelSection;
