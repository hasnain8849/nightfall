/* ------------------------------------------------------------------ */
/*  Nightfall — Haunted Night 2026 : central content & design tokens  */
/*  Extracted from the Stitch project (desktop + mobile screens)      */
/* ------------------------------------------------------------------ */

export const EVENT = {
  name: 'Nightfall',
  title: 'Haunted Night 2026',
  tagline: "The City's Ultimate Halloween Experience",
  date: '31 October 2026',
  time: '8:00 PM – 2:00 AM',
  venue: 'The Grand Arena',
  city: 'Lahore, Pakistan',
  /** Lahore is UTC+5 — countdown target: Oct 31 2026, 8:00 PM PKT */
  countdownTargetIso: '2026-10-31T20:00:00+05:00',
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Grand+Arena+Lahore+Pakistan',
} as const

export const NAV_LINKS = [
  { label: 'Event', href: '#event' },
  { label: 'Tickets', href: '#tickets' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Location', href: '#location' },
  { label: 'FAQ', href: '#faq' },
] as const

/* --------------------------- Highlights --------------------------- */

export const HIGHLIGHTS = [
  {
    icon: 'ghost',
    accent: 'purple',
    title: 'Haunted House',
    text: 'Face your fears in our immersive haunted maze with live performers.',
  },
  {
    icon: 'music',
    accent: 'crimson',
    title: 'Live DJ',
    text: 'Top DJs, non-stop beats, bass drops and hypnotic lighting all night long.',
  },
  {
    icon: 'masks',
    accent: 'purple',
    title: 'Costume Contest',
    text: 'Best creative, scary, and couple costumes win huge cash prizes.',
  },
  {
    icon: 'drink',
    accent: 'orange',
    title: 'Food & Drinks',
    text: 'Spooky cocktails, smoking blood potions, and gourmet festival street eats.',
  },
] as const

/* ----------------------------- Tickets ---------------------------- */

export const TICKETS = [
  {
    name: 'Regular',
    price: '1,500',
    icon: 'ticket',
    featured: false,
    perks: ['Event Entry', 'Access to all areas', 'Standard queue'],
  },
  {
    name: 'VIP',
    price: '3,000',
    icon: 'crown',
    featured: true,
    perks: ['Event Entry', 'VIP Lounge Access', 'Priority Queue', 'Exclusive Perks'],
  },
  {
    name: 'Premium',
    price: '5,000',
    icon: 'star',
    featured: false,
    perks: ['Event Entry', 'VIP Lounge Access', 'Priority Queue', 'Free Drink Voucher'],
  },
] as const

/* ----------------------------- Gallery ---------------------------- */

export type HeroMedia = {
  mediaType: 'video' | 'image'
  mediaUrl: string
  posterUrl: string | null
}

export type VideoSlide = {
  id: string
  title: string
  subtitle: string | null
  videoUrl: string
  posterUrl: string | null
  duration: string | null
  badge: string | null
}

export type LocationItem = {
  id: string
  name: string
  address: string | null
  city: string
  gatesOpen: string | null
  eventTime: string | null
  parking: string | null
  directionsUrl: string | null
}

export const DEFAULT_HERO: HeroMedia = {
  mediaType: 'video',
  mediaUrl: '/assets/videos/hero-moon.mp4',
  posterUrl: '/assets/img_00.jpg',
}

export const DEFAULT_VIDEOS: VideoSlide[] = [
  {
    id: 'aftermovie',
    title: 'Official Aftermovie: Into The Shadows',
    subtitle:
      "Heart-racing lasers, sinister maze screams and pyrotechnic ecstasy from last year's sold-out Nightfall.",
    videoUrl: '/assets/videos/g-laser-green.mp4',
    posterUrl: '/assets/videos/posters/g-laser-green.jpg',
    duration: '04:28',
    badge: '4K ULTRA HD',
  },
  {
    id: 'rave',
    title: 'Main Stage Rave Sets',
    subtitle: 'Laser storms, live drops and 10,000 hands in the air — the full rave chaos, uncut.',
    videoUrl: '/assets/videos/g-laser-blue.mp4',
    posterUrl: '/assets/videos/posters/g-laser-blue.jpg',
    duration: '03:15',
    badge: 'MAIN STAGE',
  },
  {
    id: 'forest-rave',
    title: 'Cursed Forest Rave',
    subtitle: 'Deep in the woods the beat never stops. Lanterns, fog and a crowd that lost track of midnight.',
    videoUrl: '/assets/videos/g-forest-rave.mp4',
    posterUrl: '/assets/videos/posters/g-forest-rave.jpg',
    duration: '02:40',
    badge: 'FOREST ZONE',
  },
]

export const DEFAULT_LOCATIONS: LocationItem[] = [
  {
    id: 'grand-arena',
    name: 'The Grand Arena',
    address: 'Expo Centre, Ferozepur Road',
    city: 'Lahore, Pakistan',
    gatesOpen: '8:00 PM',
    eventTime: '8:00 PM – 2:00 AM',
    parking: 'Available On-site',
    directionsUrl:
      'https://www.google.com/maps/search/?api=1&query=Expo+Centre+Ferozepur+Road+Lahore+Pakistan',
  },
]

/* --------------------------- Testimonials ------------------------- */

export const TESTIMONIALS = [
  {
    initials: 'AS',
    color: 'crimson',
    name: 'Areeba S.',
    role: 'Verified Attendee',
    quote:
      "Best Halloween event I've ever been to! The atmosphere was insane and the team did an amazing job!",
  },
  {
    initials: 'HK',
    color: 'purple',
    name: 'Hamza K.',
    role: 'Verified Attendee',
    quote:
      'The haunted house was next level. Loved the whole experience. Definitely coming back next year!',
  },
  {
    initials: 'ST',
    color: 'orange',
    name: 'Sara T.',
    role: 'Verified Attendee',
    quote:
      'Great music, amazing crowd and super well organized. Totally worth it!',
  },
] as const

/* ------------------------------- FAQ ------------------------------ */

export const FAQS = [
  {
    question: 'What is the age limit for the event?',
    answer:
      'The event is strictly 18+. Valid CNIC or government-issued photo ID is required at the entry gates for verification.',
  },
  {
    question: 'Are costumes mandatory?',
    answer:
      'Costumes are not strictly mandatory but are strongly encouraged! Wearing one automatically enters you into the costume prize contest.',
  },
  {
    question: 'Is the event rain or shine?',
    answer:
      "Yes! The Grand Arena features both fully covered mega-hangars and sheltered arenas, ensuring bad weather won't spoil the night.",
  },
  {
    question: 'Will there be parking available?',
    answer:
      'Yes, ample secure on-site parking is available for all attendees. Valet parking is included complimentary with VIP and Premium passes.',
  },
  {
    question: "Can I get a refund if I can't attend?",
    answer:
      'Tickets are non-refundable. However, tickets are fully transferable to another person up to 48 hours prior to the event date.',
  },
  {
    question: 'How do I receive my ticket?',
    answer:
      'Your digital e-ticket containing a unique secure QR code will be dispatched to your registered email immediately after booking confirmation.',
  },
] as const

/* ------------------------------ Footer ---------------------------- */

export const FOOTER_LINKS = {
  quick: [
    { label: 'Event', href: '#event' },
    { label: 'Tickets', href: '#tickets' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Location', href: '#location' },
    { label: 'FAQ', href: '#faq' },
  ],
  support: [
    { label: 'Contact Us', href: '#newsletter' },
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Refund Policy', href: '#' },
  ],
} as const
