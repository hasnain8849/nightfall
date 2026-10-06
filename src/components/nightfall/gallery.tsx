'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2, Play, Volume2 } from 'lucide-react'
import { FEATURED_REELS } from '@/lib/event-data'
import { SectionHeading } from './section-heading'
import { GALLERY_IMAGES } from '@/lib/event-data'
import { cn } from '@/lib/utils'

export function Gallery() {
  const [active, setActive] = useState(0)
  const reel = FEATURED_REELS[active]

  const prev = () => setActive((a) => (a - 1 + FEATURED_REELS.length) % FEATURED_REELS.length)
  const next = () => setActive((a) => (a + 1) % FEATURED_REELS.length)

  return (
    <section id="gallery" className="relative border-t border-spooky-purple/20 bg-night-900 py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="2025 recap"
          title="Event Gallery"
          subtitle="Relive the moments. Feel the energy."
        />

        {/* -------- Featured reel -------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-crimson-500/25 shadow-[0_0_70px_-18px_rgba(230,30,56,0.5)]"
        >
          <div className="relative aspect-video max-h-[560px] w-full overflow-hidden bg-night-950">
            <AnimatePresence mode="wait">
              <motion.img
                key={reel.id}
                src={reel.image}
                alt={reel.title}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/25 to-night-950/30" />

            {/* Top controls */}
            <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-6 sm:top-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" aria-hidden />
                Featured Reel
              </span>
              {reel.badge && (
                <span className="hidden rounded-full border border-white/15 bg-night-950/60 px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] text-gray-300 backdrop-blur sm:inline-block">
                  {reel.badge}
                </span>
              )}
            </div>
            <div className="absolute right-4 top-4 flex gap-2 sm:right-6 sm:top-6">
              <button
                type="button"
                aria-label="Toggle sound"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-night-950/60 text-gray-300 backdrop-blur transition hover:text-white"
              >
                <Volume2 className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Fullscreen"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-night-950/60 text-gray-300 backdrop-blur transition hover:text-white"
              >
                <Maximize2 className="h-4 w-4" aria-hidden />
              </button>
            </div>

            {/* Play button */}
            <button
              type="button"
              aria-label={`Play ${reel.title}`}
              className="group absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-crimson-400/60 bg-crimson-600/30 backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-crimson-600/60 sm:h-24 sm:w-24"
            >
              <span className="radar-ping absolute inset-0 rounded-full border border-crimson-400/50" aria-hidden />
              <Play className="ml-1 h-8 w-8 fill-white text-white" aria-hidden />
            </button>

            {/* Caption */}
            <AnimatePresence mode="wait">
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="absolute bottom-0 left-0 right-0 p-5 sm:p-8"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-crimson-400">
                  Edition 2025 Recap
                </p>
                <h3 className="mt-2 max-w-xl font-cinzel text-xl font-bold leading-snug text-white sm:text-3xl">
                  {reel.title}
                </h3>
                <p className="mt-2 max-w-lg text-xs leading-relaxed text-gray-300 sm:text-sm">
                  {reel.subtitle}
                </p>
                <span className="mt-3 inline-block rounded-md bg-night-950/80 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-spooky-amber">
                  {reel.duration}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Carousel controls */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2" role="tablist" aria-label="Featured reels">
            {FEATURED_REELS.map((r, i) => (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show reel ${i + 1}`}
                onClick={() => setActive(i)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i === active ? 'w-7 bg-crimson-500' : 'w-2 bg-gray-600 hover:bg-gray-500'
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
              Reel {String(active + 1).padStart(2, '0')} of {String(FEATURED_REELS.length).padStart(2, '0')}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous reel"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-spooky-purple/30 bg-night-850 text-gray-300 transition hover:border-crimson-500/50 hover:text-crimson-400"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next reel"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-spooky-purple/30 bg-night-850 text-gray-300 transition hover:border-crimson-500/50 hover:text-crimson-400"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>

        {/* -------- Reel thumbnails -------- */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {FEATURED_REELS.slice(1).map((r, i) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setActive(i + 1)}
              aria-label={`Watch ${r.title}`}
              className={cn(
                'glass-card group relative overflow-hidden rounded-xl text-left transition-all duration-300 hover:-translate-y-1',
                active === i + 1
                  ? 'border-crimson-500/60 shadow-[0_0_30px_-8px_rgba(230,30,56,0.5)]'
                  : 'hover:border-crimson-500/40'
              )}
            >
              <div className="relative aspect-video overflow-hidden">
                { }
                <img
                  src={r.image}
                  alt={r.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-night-950/35 transition-colors group-hover:bg-night-950/15" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-night-950/70 backdrop-blur transition-transform duration-300 group-hover:scale-110">
                    <Play className="ml-0.5 h-4 w-4 fill-white text-white" aria-hidden />
                  </span>
                </span>
                <span className="absolute bottom-2 right-2 rounded bg-night-950/85 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-gray-200">
                  {r.duration}
                </span>
                {active === i + 1 && (
                  <span className="absolute left-2 top-2 rounded-full bg-crimson-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                    Now Playing
                  </span>
                )}
              </div>
              <div className="p-3">
                <h4 className="truncate font-cinzel text-xs font-bold uppercase tracking-wider text-white">
                  {r.title}
                </h4>
                <p className="mt-1 truncate text-[11px] text-gray-500">{r.subtitle}</p>
              </div>
            </button>
          ))}
        </div>

        {/* -------- Photo mosaic -------- */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.figure
              key={img.src + i}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.08 }}
              className={cn(
                'group relative overflow-hidden rounded-xl border border-spooky-purple/15',
                i % 5 === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
              )}
            >
              { }
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
