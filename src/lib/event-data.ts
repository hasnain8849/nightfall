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
  { label: 'Experience', href: '#experience' },
  { label: 'Tickets', href: '#tickets' },
  { label: 'Gallery', href: '#gallery' },
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

/* --------------------------- Experience --------------------------- */

export const EXPERIENCES = [
  {
    image: '/assets/img_06.jpg',
    title: 'The Haunted Mansion',
    hook: 'Can you survive the darkness?',
    text: 'A pitch-black labyrinth of cursed corridors, secret passages and things that follow you. Guided only by candlelight — if you dare to light one.',
    tag: 'Attraction 01',
  },
  {
    image: '/assets/img_07.jpg',
    title: 'The Rave Zone',
    hook: 'Music. Lights. Madness.',
    text: 'The main stage drops beats till 2 AM with laser storms, CO₂ cannons and a sea of glowing pumpkins. This is where the night loses control.',
    tag: 'Attraction 02',
  },
  {
    image: '/assets/img_08.jpg',
    title: 'The Cursed Forest',
    hook: 'Not everything is harmless.',
    text: 'A fog-drenched woodland trail where whispers call your name. Follow the lanterns, but never leave the path — the forest keeps what it catches.',
    tag: 'Attraction 03',
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

export type Reel = {
  id: string
  title: string
  subtitle: string
  image: string
  duration: string
  badge?: string
}

export const FEATURED_REELS: Reel[] = [
  {
    id: 'aftermovie',
    title: 'Official Aftermovie: Into The Shadows',
    subtitle:
      "Experience the heart-racing beats, sinister labyrinth screams, and pyrotechnic ecstasy from last year's sold-out nightfall celebration.",
    image: '/assets/img_01.jpg',
    duration: '04:28',
    badge: '4K ULTRA HD',
  },
  {
    id: 'rave',
    title: 'Main Stage Rave Sets',
    subtitle: 'Laser storms, live drops and 10,000 hands in the air — the full rave chaos, uncut.',
    image: '/assets/img_10.jpg',
    duration: '03:15',
  },
  {
    id: 'maze',
    title: 'Haunted Maze Night-Cam',
    subtitle: 'Screams & live jump scares recorded on the infrared night-cams inside the maze.',
    image: '/assets/img_03.jpg',
    duration: '02:40',
  },
  {
    id: 'costume',
    title: 'Costume Championship',
    subtitle: 'Top awards & cosplay walk — the most diabolical outfits of the night battle for glory.',
    image: '/assets/img_13.jpg',
    duration: '01:55',
  },
  {
    id: 'bloodbar',
    title: 'Blood Bar & Lounges',
    subtitle: 'VIP potions & mixes — smoking cocktails poured by our resident alchemists.',
    image: '/assets/img_05.jpg',
    duration: '02:18',
  },
]

export const GALLERY_IMAGES = [
  { src: '/assets/img_09.jpg', alt: 'Costumed crowd celebrating at Nightfall' },
  { src: '/assets/img_14.jpg', alt: 'DJ set with laser lights at Euphoria stage' },
  { src: '/assets/img_11.jpg', alt: 'Carved jack-o-lanterns glowing on stone steps' },
  { src: '/assets/img_02.jpg', alt: 'DJ performing in front of festival crowd' },
  { src: '/assets/img_12.jpg', alt: 'Moody horror-themed bar lounge interior' },
  { src: '/assets/img_04.jpg', alt: 'Costume contest winners on stage' },
  { src: '/assets/img_03.jpg', alt: 'Haunted pumpkin display wall' },
  { src: '/assets/img_10.jpg', alt: 'Laser storm over the main stage' },
] as const

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
    { label: 'Experience', href: '#experience' },
    { label: 'Tickets', href: '#tickets' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'FAQ', href: '#faq' },
  ],
  support: [
    { label: 'Contact Us', href: '#newsletter' },
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Refund Policy', href: '#' },
  ],
} as const
