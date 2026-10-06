'use client'

import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { DEFAULT_VIDEOS, type VideoSlide } from '@/lib/event-data'
import { SectionHeading } from './section-heading'
import { cn } from '@/lib/utils'

export function Gallery({ videos }: { videos?: VideoSlide[] }) {
  const slides = videos && videos.length > 0 ? videos : DEFAULT_VIDEOS
  const [active, setActive] = useState(0)
  const [muted, setMuted] = useState(true)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  const reel = slides[active]

  const prev = useCallback(() => {
    setActive((a) => (a - 1 + slides.length) % slides.length)
    setPaused(false)
    setProgress(0)
  }, [slides.length])

  const next = useCallback(() => {
    setActive((a) => (a + 1) % slides.length)
    setPaused(false)
    setProgress(0)
  }, [slides.length])

  const goTo = (i: number) => {
    setActive(i)
    setPaused(false)
    setProgress(0)
  }

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play().catch(() => {})
      setPaused(false)
    } else {
      v.pause()
      setPaused(true)
    }
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
    if (!v.muted) v.play().catch(() => {})
  }

  const goFullscreen = () => {
    stageRef.current?.requestFullscreen?.().catch(() => {})
  }

  return (
    <section id="gallery" className="relative border-t border-spooky-purple/20 bg-night-900 py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="2025 recap"
          title="Event Gallery"
          subtitle="Relive the moments. Feel the energy."
        />

        {/* -------- Featured video stage (16:9) -------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-crimson-500/25 shadow-[0_0_70px_-18px_rgba(230,30,56,0.5)]"
        >
          <div
            ref={stageRef}
            className="group relative aspect-video max-h-[620px] w-full overflow-hidden bg-night-950"
          >
            <AnimatePresence mode="wait">
              <motion.video
                key={reel.id}
                ref={videoRef}
                src={reel.videoUrl}
                poster={reel.posterUrl ?? undefined}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55 }}
                autoPlay
                loop
                muted={muted}
                playsInline
                preload="metadata"
                onTimeUpdate={(e) => {
                  const v = e.currentTarget
                  if (v.duration > 0) setProgress((v.currentTime / v.duration) * 100)
                }}
                onClick={togglePlay}
                className="h-full w-full cursor-pointer object-cover"
                aria-label={reel.title}
              />
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/10 to-night-950/25" />

            {/* Playback progress bar */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[3px] bg-night-800/70">
              <div
                className="h-full bg-gradient-to-r from-crimson-600 to-spooky-orange transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Top controls */}
            <div className="absolute left-4 top-4 z-20 flex items-center gap-2 sm:left-6 sm:top-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" aria-hidden />
                Now Playing
              </span>
              {reel.badge && (
                <span className="hidden rounded-full border border-white/15 bg-night-950/60 px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] text-gray-300 backdrop-blur sm:inline-block">
                  {reel.badge}
                </span>
              )}
            </div>
            <div className="absolute right-4 top-4 z-20 flex gap-2 sm:right-6 sm:top-6">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? 'Unmute video' : 'Mute video'}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-night-950/60 text-gray-300 backdrop-blur transition hover:border-crimson-500/50 hover:text-white"
              >
                {muted ? <VolumeX className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
              </button>
              <button
                type="button"
                onClick={goFullscreen}
                aria-label="Fullscreen"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-night-950/60 text-gray-300 backdrop-blur transition hover:border-crimson-500/50 hover:text-white"
              >
                <Maximize2 className="h-4 w-4" aria-hidden />
              </button>
            </div>

            {/* Center play / pause feedback */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={paused ? `Play ${reel.title}` : `Pause ${reel.title}`}
              className={cn(
                'absolute left-1/2 top-1/2 z-20 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-crimson-400/60 bg-crimson-600/30 backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-crimson-600/60 sm:h-24 sm:w-24',
                paused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}
            >
              <span className="radar-ping absolute inset-0 rounded-full border border-crimson-400/50" aria-hidden />
              {paused ? (
                <Play className="ml-1 h-8 w-8 fill-white text-white" aria-hidden />
              ) : (
                <Pause className="h-8 w-8 fill-white text-white" aria-hidden />
              )}
            </button>

            {/* Caption */}
            <AnimatePresence mode="wait">
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 p-5 pb-6 sm:p-8"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-crimson-400">
                  Edition 2025 Recap
                </p>
                <h3 className="mt-2 max-w-xl font-cinzel text-xl font-bold leading-snug text-white sm:text-3xl">
                  {reel.title}
                </h3>
                {reel.subtitle && (
                  <p className="mt-2 hidden max-w-lg text-xs leading-relaxed text-gray-300 sm:block sm:text-sm">
                    {reel.subtitle}
                  </p>
                )}
                {reel.duration && (
                  <span className="mt-3 inline-block rounded-md bg-night-950/80 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-spooky-amber">
                    {reel.duration}
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Carousel controls */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2" role="tablist" aria-label="Gallery videos">
            {slides.map((v, i) => (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show video ${i + 1}`}
                onClick={() => goTo(i)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i === active ? 'w-7 bg-crimson-500' : 'w-2 bg-gray-600 hover:bg-gray-500'
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
              Video {String(active + 1).padStart(2, '0')} of {String(slides.length).padStart(2, '0')}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous video"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-spooky-purple/30 bg-night-850 text-gray-300 transition hover:border-crimson-500/50 hover:text-crimson-400"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next video"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-spooky-purple/30 bg-night-850 text-gray-300 transition hover:border-crimson-500/50 hover:text-crimson-400"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>

        {/* -------- 16:9 video thumbnails -------- */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {slides.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Watch ${v.title}`}
              className={cn(
                'glass-card group relative overflow-hidden rounded-xl text-left transition-all duration-300 hover:-translate-y-1',
                active === i
                  ? 'border-crimson-500/60 shadow-[0_0_30px_-8px_rgba(230,30,56,0.5)]'
                  : 'hover:border-crimson-500/40'
              )}
            >
              <div className="relative aspect-video overflow-hidden">
                {v.posterUrl ? (
                  <img
                    src={v.posterUrl}
                    alt={v.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <video
                    src={v.videoUrl}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-night-950/35 transition-colors group-hover:bg-night-950/15" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-night-950/70 backdrop-blur transition-transform duration-300 group-hover:scale-110">
                    <Play className="ml-0.5 h-4 w-4 fill-white text-white" aria-hidden />
                  </span>
                </span>
                {v.duration && (
                  <span className="absolute bottom-2 right-2 rounded bg-night-950/85 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-gray-200">
                    {v.duration}
                  </span>
                )}
                {active === i && (
                  <span className="absolute left-2 top-2 rounded-full bg-crimson-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                    Now Playing
                  </span>
                )}
              </div>
              <div className="p-3">
                <h4 className="truncate font-cinzel text-xs font-bold uppercase tracking-wider text-white">
                  {v.title}
                </h4>
                {v.badge && (
                  <p className="mt-1 truncate text-[11px] text-gray-500">{v.badge}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
