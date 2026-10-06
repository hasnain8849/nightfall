'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/event-data'
import { SectionHeading } from './section-heading'
import { cn } from '@/lib/utils'

const AVATAR_COLORS = {
  crimson: 'border-crimson-500/50 bg-crimson-600/25 text-crimson-300',
  purple: 'border-spooky-purple/50 bg-spooky-purple/25 text-spooky-purple',
  orange: 'border-spooky-orange/50 bg-spooky-orange/20 text-spooky-amber',
} as const

export function Testimonials() {
  return (
    <section className="relative border-t border-spooky-purple/20 bg-night-850 py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Aftermath"
          title="What Our Guests Say"
          subtitle="Real people. Real experiences."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="glass-card glass-card-hover flex flex-col rounded-2xl p-7"
              cite={t.name}
            >
              {/* Stars */}
              <div className="flex gap-1" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-spooky-amber text-spooky-amber" aria-hidden />
                ))}
              </div>

              <p className="mt-5 flex-1 text-sm italic leading-relaxed text-gray-300">
                &ldquo;{t.quote}&rdquo;
              </p>

              <footer className="mt-7 flex items-center gap-3.5 border-t border-spooky-purple/15 pt-5">
                <span
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-full border text-xs font-black tracking-wider',
                    AVATAR_COLORS[t.color]
                  )}
                  aria-hidden
                >
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
