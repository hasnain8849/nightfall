'use client'

import { motion } from 'framer-motion'
import { CarFront, Clock, ExternalLink, MapPin } from 'lucide-react'
import { EVENT } from '@/lib/event-data'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'

const DETAILS = [
  { icon: Clock, label: 'Gates Open:', value: '8:00 PM' },
  { icon: Clock, label: 'Event Time:', value: '8:00 PM – 2:00 AM' },
  { icon: CarFront, label: 'Parking:', value: 'Available On-site', highlight: true },
]

export function Location() {
  return (
    <section id="location" className="relative border-t border-spooky-purple/20 bg-night-900 py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Getting there"
          title="Event Location"
          subtitle="Find us at the heart of the scary."
        />

        <Reveal>
          <div className="glass-card grid grid-cols-1 overflow-hidden rounded-3xl lg:grid-cols-5">
            {/* Venue info */}
            <div className="p-8 sm:p-10 lg:col-span-2">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-crimson-400">
                <MapPin className="h-4 w-4" aria-hidden />
                Venue Partner
              </span>
              <h3 className="mt-4 font-cinzel text-3xl font-bold tracking-wide text-white">
                {EVENT.venue.toUpperCase()}
              </h3>
              <p className="mt-2 text-sm text-gray-400">{EVENT.city}</p>

              <dl className="mt-9 space-y-5">
                {DETAILS.map((d) => (
                  <div
                    key={d.label}
                    className="flex items-center justify-between border-b border-spooky-purple/12 pb-4"
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
                href={EVENT.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="blood-border-btn mt-9 inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white"
              >
                <MapPin className="h-4 w-4" aria-hidden />
                Get Directions
                <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
              </a>
            </div>

            {/* Stylized dark map */}
            <div className="relative min-h-[320px] overflow-hidden border-t border-spooky-purple/20 bg-night-950 lg:col-span-3 lg:border-l lg:border-t-0">
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

              {/* pin */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative flex flex-col items-center">
                  <span className="radar-ping absolute -top-2 h-14 w-14 rounded-full bg-crimson-500/25" aria-hidden />
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-crimson-400/60 bg-crimson-600/30 backdrop-blur">
                    <MapPin className="h-6 w-6 fill-crimson-500 text-white" aria-hidden />
                  </span>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 rounded-xl border border-crimson-500/40 bg-night-900/90 px-5 py-3 text-center shadow-[0_0_30px_-8px_rgba(230,30,56,0.6)] backdrop-blur"
                  >
                    <p className="font-cinzel text-sm font-bold tracking-wider text-white">
                      {EVENT.venue}
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-400">{EVENT.city}</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
