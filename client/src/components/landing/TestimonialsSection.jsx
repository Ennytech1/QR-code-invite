import React from 'react';
import { Star } from 'lucide-react';

export const TESTIMONIALS = [
  {
    quote: "We hosted over 1,400 executives at the Eko Convention Centre. Gate check-in was instantaneous (<12ms) with zero bottlenecks. The WhatsApp invitation JPEG cards made attendees feel like true dignitaries.",
    author: "Bayo Adeleke",
    role: "Lead Convener, West Africa Executive Summit",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    event: "Lagos Tech & Executive Gala"
  },
  {
    quote: "Our wedding had strictly 250 VIPs. Previously, uninvited friends would screenshot passes to gain entry. QRInvite's Ed25519 anti-replay lock caught 12 duplicate screenshot attempts at the door. Absolutely priceless.",
    author: "Folashade Balogun",
    role: "Private Wedding Host",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    event: "The Adeleke Royal Banquet"
  },
  {
    quote: "We sold out 3,000 festival passes online with instant bank settlement. Even when the beach cellular network crashed, the offline PWA scanner kept turnstiles moving seamlessly.",
    author: "Emeka Okonkwo",
    role: "Festival Operations Director",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    event: "Atlantis Beach Festival"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Trusted By The Best
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Loved By Event Planners, Couples & Festivals
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          See how event creators power their entrances with zero fraud and 5-star attendee experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, idx) => (
          <div
            key={idx}
            className="rounded-3xl p-7 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#10131c] flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "{t.quote}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <img
                src={t.avatar}
                alt={t.author}
                className="w-10 h-10 rounded-full object-cover border border-indigo-500/30"
              />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{t.author}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;

