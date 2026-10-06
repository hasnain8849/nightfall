'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CarFront, Clock, ExternalLink, MapPin, Navigation } from 'lucide-react'
import { DEFAULT_LOCATIONS, type LocationItem } from '@/lib/event-data'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'
import { cn } from '@/lib/utils'

/** Pin positions (percent) on the stylized map, cycled per location */
const PIN_SPOTS = [
  { left: 50, top: 48 },
  { left: 32, top: 38 },
  { left: 68, top: 58 },
  { left: 42, top: 30 },
  { left: 58, top: 66 },
  { left: 28, top: 55 },
]

export function Location({ locations }: { locations?: LocationItem[] }) {
  const list = locations && locations.length > 0 ? locations : DEFAULT_LOCATIONS
  const [active, setActive] = useState(0)
  const venue = list[Math.min(active, list.length - 1)]
  const pin = PIN_SPOTS[active % PIN_SPOTS.length]

  const directions =
    venue.directionsUrl ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${venue.name} ${venue.city}`
    )}`

  const DETAILS = [
    { icon: Clock, label: 'Gates Open:', value: venue.gatesOpen || 'TBA' },
    { icon: Clock, label: 'Event Time:', value: venue.eventTime || 'TBA' },
    {
      icon: CarFront,
      label: 'Parking:',
      value: venue.parking || 'TBA',
      highlight: true,
    },
  ]

  return (
    <section id="location" className="relative border-t border-spooky-purple/20 bg-night-900 py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Getting there"
          title="Event Locations"
          subtitle="Choose your hunting ground. Find us at the heart of the scary."
        />

        <Reveal>
          <div className="glass-card grid grid-cols-1 overflow-hidden rounded-3xl lg:grid-cols-5">
            {/* -------- Venue selector + details -------- */}
            <div className="p-6 sm:p-8 lg:col-span-2 lg:p-10">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-crimson-400">
                <Navigation className="h-4 w-4" aria-hidden />
                {list.length} Venue{list.length > 1 ? 's' : ''} · Pick Yours
              </span>

              {/* Location cards */}
              <div className="mt-5 space-y-3" role="tablist" aria-label="Event locations">
                {list.map((loc, i) => (
                  <button
                    key={loc.id}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    onClick={() => setActive(i)}
                    className={cn(
                      'group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-300',
                      i === active
                        ? 'border-crimson-500/60 bg-crimson-600/10 shadow-[0_0_25px_-8px_rgba(230,30,56,0.55)]'
                        : 'border-spooky-purple/15 bg-night-850/60 hover:border-crimson-500/40 hover:bg-night-850'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors',
                        i === active
                          ? 'border-crimson-400/60 bg-crimson-600/25 text-crimson-400'
                          : 'border-spooky-purple/25 bg-night-900 text-spooky-purple group-hover:text-crimson-400'
                      )}
                    >
                      <MapPin className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-cinzel text-sm font-bold uppercase tracking-wider text-white">
                        {loc.name}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-gray-400">
                        {loc.address ? `${loc.address} · ` : ''}
                        {loc.city}
                      </span>
                    </span>
                    <span
                      className={cn(
                        'font-cinzel text-xs font-bold tabular-nums',
                        i === active ? 'text-crimson-400' : 'text-gray-600'
                      )}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active venue details */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={venue.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <dl className="mt-8 space-y-4">
                    {DETAILS.map((d) => (
                      <div
                        key={d.label}
                        className="flex items-center justify-between border-b border-spooky-purple/12 pb-3.5"
                      >
                        <dt className="flex items-center gap-2.5 text-sm text-gray-400">
                          <d.icon className="h-4 w-4 text-spooky-purple" aria-hidden />
                          {d.label}
                        </dt>
                        <dd
                          className={
                            d.highlight
                              ? 'text-sm font-bold text-spooky-amber'
                              : 'text-sm font-bold text-white'
                          }
                        >
                          {d.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <a
                    href={directions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="blood-border-btn mt-8 inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white"
                  >
                    <MapPin className="h-4 w-4" aria-hidden />
                    Get Directions
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* -------- Stylized dark map -------- */}
            <div className="relative min-h-[380px] overflow-hidden border-t border-spooky-purple/20 bg-night-950 lg:col-span-3 lg:border-l lg:border-t-0">
              <div className="map-dots absolute inset-0" aria-hidden />
              {/* faux streets */}
              <svg
                className="absolute inset-0 h-full w-full opacity-25"
                aria-hidden
                viewBox="0 0 600 400"
                preserveAspectRatio="none"
              >
                <g stroke="#7b2cbf" strokeWidth="1.5" fill="none">
                  <path d="M-10 90 C 150 70, 300 130, 610 95" />
                  <path d="M-10 210 C 180 190, 350 260, 610 215" />
                  <path d="M-10 320 C 140 300, 380 350, 610 315" />
                  <path d="M110 -10 C 130 120, 90 260, 130 410" />
                  <path d="M300 -10 C 280 140, 330 280, 290 410" />
                  <path d="M470 -10 C 490 130, 440 270, 490 410" />
                </g>
                <g stroke="#ff3b56" strokeWidth="1" strokeDasharray="6 8" fill="none" opacity="0.6">
                  <path d="M0 150 L600 150" />
                  <path d="M390 0 L390 400" />
                </g>
              </svg>

              {/* venue count chip */}
              <div className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-night-950/70 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 backdrop-blur">
                Venue {String(active + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
              </div>

              {/* animated pin for the active venue */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={venue.id}
                  initial={{ opacity: 0, x: '-50%', y: '-38%', scale: 0.7 }}
                  animate={{ opacity: 1, x: '-50%', y: '-50%', scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="absolute z-10"
                  style={{ left: `${pin.left}%`, top: `${pin.top}%` }}
                >
                  <div className="relative flex flex-col items-center">
                    <span className="radar-ping absolute -top-2 h-14 w-14 rounded-full bg-crimson-500/25" aria-hidden />
                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-crimson-400/60 bg-crimson-600/30 backdrop-blur">
                      <MapPin className="h-6 w-6 fill-crimson-500 text-white" aria-hidden />
                    </span>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="mt-4 rounded-xl border border-crimson-500/40 bg-night-900/90 px-5 py-3 text-center shadow-[0_0_30px_-8px_rgba(230,30,56,0.6)] backdrop-blur"
                    >
                      <p className="font-cinzel text-sm font-bold tracking-wider text-white">
                        {venue.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-gray-400">{venue.city}</p>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
