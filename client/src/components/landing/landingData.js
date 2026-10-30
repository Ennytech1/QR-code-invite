export const STATS_DATA = [
  {
    label: 'Events Hosted',
    value: '3,800+',
    change: '+48% this quarter',
    trend: 'up',
    detail: 'Festivals, concerts & galas'
  },
  {
    label: 'Tickets Processed',
    value: '185K+',
    change: '100% verified gate entry',
    trend: 'check',
    detail: 'Zero duplicate screenshot fraud'
  },
  {
    label: 'Gross Volume Processed',
    value: '₦240M+',
    change: 'Next-day bank settlement',
    trend: 'payout',
    detail: 'GTBank, Access, Zenith & Kuda'
  },
  {
    label: 'Average Gate Latency',
    value: '< 15ms',
    change: 'RFC 8032 Ed25519 offline',
    trend: 'speed',
    detail: 'Works with zero cell signal'
  }
];

export const TRENDING_EVENTS = [
  {
    id: 'evt_wet_party',
    title: 'The Wet Party 2.0 (Pool Edition)',
    category: 'Pool Party',
    date: 'Sat, 17 Oct 2026',
    time: '9:00 PM',
    venue: 'Lotus Lounge, 1st Avenue, Festac Town, Lagos',
    city: 'Lagos',
    price: 3000,
    priceLabel: '₦3,000',
    originalPrice: '₦5,000',
    organizer: 'Wet Party Collective',
    badge: 'Popular Now',
    badgeVariant: 'amber',
    soldCount: '840 sold',
    capacityPct: 88,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=900&q=80',
    tags: ['Pool Party', 'Afrobeats', 'Nightlife'],
    description: 'The wildest water & sound experience in Festac. Unmatched vibes, top guest DJs, pool floaties, and neon energy all night.',
    tiers: [
      { name: 'Female Ticket', price: 3000, desc: 'Full pool access & 1 free welcome cocktail' },
      { name: 'Male Ticket', price: 5000, desc: 'Full general pool & lounge access' },
      { name: 'VIP Cabana (Table of 5)', price: 35000, desc: 'Dedicated cabana, premium bottle & express gate access' }
    ]
  },
  {
    id: 'evt_groove_rules',
    title: 'My Groove My Rules Series IV',
    category: 'Music',
    date: 'Sat, 17 Oct 2026',
    time: '5:00 PM',
    venue: 'Adrenaline Lounge, Victoria Island, Lagos',
    city: 'Lagos',
    price: 5000,
    priceLabel: '₦5,000',
    originalPrice: null,
    organizer: 'Groove House Global',
    badge: 'Selling Fast',
    badgeVariant: 'rose',
    soldCount: '1,240 sold',
    capacityPct: 94,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
    tags: ['Underground', 'Alté', 'Rave'],
    description: 'An unapologetic electronic and afrobeats sonic playground. High bass, moody crimson illumination, and world-class guest DJs.',
    tiers: [
      { name: 'General Admission', price: 5000, desc: 'Access to main dance floor' },
      { name: 'VIP Mezzanine', price: 15000, desc: 'Elevated view, private bar & queue skip' }
    ]
  },
  {
    id: 'evt_atlantis_4',
    title: 'Atlantis: The Party 4.0',
    category: 'Festivals',
    date: 'Wed, 30 Dec 2026',
    time: '1:00 PM',
    venue: 'Eko Atlantic Beachfront, Victoria Island',
    city: 'Lagos',
    price: 15000,
    priceLabel: '₦15,000',
    originalPrice: '₦20,000',
    organizer: 'Westhan Entertainment',
    badge: 'Detty December',
    badgeVariant: 'indigo',
    soldCount: '3,100 sold',
    capacityPct: 78,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
    tags: ['Mega Festival', 'Coastal', 'Live Artists'],
    description: 'The monumental return of West Africa’s premier coastal music gathering. 3 live stages, 24 headline artists, and non-stop fireworks.',
    tiers: [
      { name: 'Early Bird Pass', price: 15000, desc: 'General festival grounds entry' },
      { name: 'VIP Golden Circle', price: 45000, desc: 'Front-stage access, private restrooms & open cocktail bar' },
      { name: 'VVIP Artist Cabana', price: 180000, desc: 'Exclusive backstage artist lounge access & dedicated butler' }
    ]
  },
  {
    id: 'evt_house_cassettes',
    title: 'House of Cassettes: Blonde Session',
    category: 'Acoustic',
    date: 'Sun, 18 Oct 2026',
    time: '4:00 PM',
    venue: 'U&I Lounge, Opp. Idia Hall, University of Ibadan',
    city: 'Ibadan',
    price: 2500,
    priceLabel: '₦2,500',
    originalPrice: null,
    organizer: 'Cassette Tape Sessions',
    badge: 'Indie Vibe',
    badgeVariant: 'emerald',
    soldCount: '410 sold',
    capacityPct: 72,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80',
    tags: ['Vinyl', 'Acoustic', 'College'],
    description: 'Intimate listening session celebrating blonde, nostalgic R&B, vinyl pressings, artisan coffee, and live acoustic covers.',
    tiers: [
      { name: 'Student Pass', price: 2500, desc: 'Standard entry with student ID' },
      { name: 'Collector Pass + Mixtape', price: 9000, desc: 'Standard entry + commemorative mixtape tape' }
    ]
  }
];

export const FEATURED_EVENTS = [
  {
    id: 'evt_dobe',
    title: 'Dobe! Afrobeats Experience Live',
    category: 'Concert',
    date: 'Sat, 24 Oct 2026',
    time: '10:00 PM',
    venue: 'Hard Rock Stage, Oniru, Victoria Island',
    city: 'Lagos',
    price: 7500,
    priceLabel: '₦7,500',
    badge: 'Live Concert',
    badgeVariant: 'rose',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80',
    description: 'Electrifying live stage showcase with top Nigerian breakout vocalists and live instrumental band orchestra.',
    tiers: [
      { name: 'Floor Standing', price: 7500, desc: 'Main floor standing area' },
      { name: 'VIP Seated', price: 20000, desc: 'Reserved table seat with complimentary drinks' }
    ]
  },
  {
    id: 'evt_suavee_cookout',
    title: 'Suavee Cookout & Beach Jam ’26',
    category: 'Festivals',
    date: 'Sat, 28 Nov 2026',
    time: '2:00 PM',
    venue: 'Elegushi Royal Beach Park, Lekki',
    city: 'Lagos',
    price: 4000,
    priceLabel: '₦4,000',
    badge: 'Food & Vibes',
    badgeVariant: 'cyan',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80',
    description: 'The mega outdoor barbecue festival. 30 culinary grill masters, craft cocktail popups, games arena, and beach party.',
    tiers: [
      { name: 'Taster Pass', price: 4000, desc: 'Entry + 2 food tasting coupons' },
      { name: 'Feast VIP', price: 12000, desc: 'Unlimited grill sampling & exclusive VIP lounge' }
    ]
  },
  {
    id: 'evt_new_wave',
    title: 'NEW WAVE FEST: Streetwear & Sound',
    category: 'Festivals',
    date: 'Sun, 29 Nov 2026',
    time: '4:00 PM',
    venue: 'Federal University Arena, Minna',
    city: 'Minna',
    price: 3500,
    priceLabel: '₦3,500',
    badge: 'Campus Fest',
    badgeVariant: 'purple',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80',
    description: 'Where streetwear fashion meets emerging alté soundscapes and skate culture. Built for the new youth generation.',
    tiers: [
      { name: 'Regular Entry', price: 3500, desc: 'Full festival and gaming lounge access' },
      { name: 'Squad Pack (4 Tickets)', price: 12000, desc: 'Entry for 4 friends at a discounted rate' }
    ]
  },
  {
    id: 'evt_louzze_asaba',
    title: 'ON THE LOUZZE ASABA: Gala Night',
    category: 'Nightlife',
    date: 'Sat, 05 Dec 2026',
    time: '6:30 PM',
    venue: 'Grand Hotel & Convention Center, Asaba',
    city: 'Asaba',
    price: 10000,
    priceLabel: '₦10,000',
    badge: 'VIP Gala',
    badgeVariant: 'amber',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=900&q=80',
    description: 'Delta State’s most anticipated year-end elite celebration. Red carpet welcome, celebrity appearances, and luxury lounges.',
    tiers: [
      { name: 'Silver Pass', price: 10000, desc: 'Access to general ballroom party' },
      { name: 'Gold VIP', price: 30000, desc: 'Reserved VIP seating & premium champagne' }
    ]
  }
];

export const VIBE_GALLERY = [
  { img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=700&q=80', title: 'Lagos Beachfront Rave', stat: '🔥 2,400 checked in' },
  { img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=700&q=80', title: 'Festival Main Stage', stat: '⚡ 14ms gate speed' },
  { img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=700&q=80', title: 'Red Light Club Series', stat: '🎫 Sold Out VIP' },
  { img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=700&q=80', title: 'Summer Poolside Jam', stat: '💦 800+ attendees' },
  { img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=700&q=80', title: 'Alté Sound Experience', stat: '🎵 Live DJ Sets' },
  { img: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=700&q=80', title: 'Headline Concert Hall', stat: '🛡️ 0 Duplicate Passes' }
];

export const FAQS = [
  {
    q: 'How fast do ticket revenues land in my bank account?',
    a: 'All ticket revenues clear via automated direct bank transfers. Organizers receive payouts into their commercial Nigerian bank accounts (GTBank, Access Bank, Zenith Bank, Kuda, etc.) the next business day. Verified enterprise organizers also have access to same-day settlement.'
  },
  {
    q: 'How does gate access work if there is no internet or cell network at the arena?',
    a: 'Our Gate Scanner PWA is built on RFC 8032 Ed25519 asymmetric cryptography and IndexedDB offline manifests. The organizer public key verifies the optical QR signature entirely on the bouncer’s mobile device in <15ms without sending a single database request.'
  },
  {
    q: 'Can attendees cheat by sharing screenshots of their QR tickets?',
    a: 'No. When an attendee pass is scanned at the entrance, our distributed Redis atomic lock (SET ticket:lock NX EX 5) immediately consumes the token. Any subsequent attempt to present the same QR code at another gate terminal will trigger an instant red REPLAY REJECTED alarm.'
  },
  {
    q: 'How do attendees receive their tickets after paying?',
    a: 'Attendees receive their tickets instantly via both WhatsApp Cloud API and email. The message includes an encrypted optical QR code, calendar link, and a one-tap button to save the digital pass into Apple Wallet or Google Wallet.'
  },
  {
    q: 'Are there any hidden fees or monthly subscription costs?',
    a: 'None. Free events are 100% free with unlimited attendees and zero service charges. For paid ticketed events, our simple transparent pricing is 5% + ₦100 per paid ticket sold. You only pay when you actually sell tickets.'
  }
];
