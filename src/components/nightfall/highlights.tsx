'use client'

import { motion } from 'framer-motion'
import { Ghost, Martini, Music4, Theater } from 'lucide-react'
import { HIGHLIGHTS } from '@/lib/event-data'
import { SectionHeading } from './section-heading'

const ICONS = {
  ghost: Ghost,
  music: Music4,
  masks: Theater,
  drink: Martini,
} as const

const ACCENTS = {
  purple: {
    iconBox: 'border-spooky-purple/40 bg-spooky-purple/15 text-spooky-purple',
    glow: 'group-hover:shadow-[0_0_35px_-8px_rgba(157,78,221,0.55)]',
    border: 'group-hover:border-spooky-purple/50',
  },
  crimson: {
    iconBox: 'border-crimson-500/40 bg-crimson-600/15 text-crimson-400',
    glow: 'group-hover:shadow-[0_0_35px_-8px_rgba(230,30,56,0.55)]',
    border: 'group-hover:border-crimson-500/50',
  },
  orange: {
    iconBox: 'border-spooky-orange/40 bg-spooky-orange/15 text-spooky-orange',
    glow: 'group-hover:shadow-[0_0_35px_-8px_rgba(255,98,0,0.5)]',
    border: 'group-hover:border-spooky-orange/50',
  },
} as const

export function Highlights() {
  return (
    <section id="highlights" className="relative border-t border-spooky-purple/20 bg-night-900 py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="What awaits you"
          title="Event Highlights"
          subtitle="More than just a party — it's an experience."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((h, i) => {
            const Icon = ICONS[h.icon]
            const accent = ACCENTS[h.accent]
            return (
              <motion.article
                key={h.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className={`glass-card group rounded-2xl p-7 text-center transition-all duration-300 hover:-translate-y-1.5 ${accent.glow} ${accent.border}`}
              >
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border ${accent.iconBox} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-7 w-7" aria-hidden />
                </div>
                <h3 className="mt-6 font-cinzel text-lg font-bold tracking-wider text-white">
                  {h.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">{h.text}</p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
