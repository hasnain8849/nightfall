'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, ChevronDown, Clock, MapPin, MoonStar, Ticket } from 'lucide-react'

const TARGET = new Date('2026-10-31T20:00:00+05:00').getTime()

function getRemaining() {
  const diff = Math.max(0, TARGET - Date.now())
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  }
}

function useCountdown() {
  const [time, setTime] = useState<ReturnType<typeof getRemaining> | null>(null)
  useEffect(() => {
    const update = () => setTime(getRemaining())
    const first = setTimeout(update, 0)
    const id = setInterval(update, 1000)
    return () => {
      clearTimeout(first)
      clearInterval(id)
    }
  }, [])
  return time
}

const pad = (n: number) => String(n).padStart(2, '0')

export function Hero() {
  const countdown = useCountdown()

  const units = useMemo(
    () => [
      { label: 'Days', value: countdown ? String(countdown.days) : '--' },
      { label: 'Hours', value: countdown ? pad(countdown.hours) : '--' },
      { label: 'Minutes', value: countdown ? pad(countdown.minutes) : '--' },
      { label: 'Seconds', value: countdown ? pad(countdown.seconds) : '--' },
    ],
    [countdown]
  )

  return (
    <section
      id="event"
      className="bg-radial-vignette relative flex min-h-screen items-center justify-center overflow-hidden pb-24 pt-32"
    >
      {/* Video atmosphere layer */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/img_00.jpg"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          aria-hidden
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-smoke-and-lights-in-a-dark-background-42996-large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0612]/80 via-[#0a0612]/55 to-night-950" />
      </div>

      {/* Castle silhouette */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-screen"
        style={{ backgroundImage: "url('/assets/img_00.jpg')" }}
        aria-hidden
      />

      {/* Ambient orbs */}
      <div
        className="pulse-glow pointer-events-none absolute -left-24 top-1/4 z-0 h-72 w-72 rounded-full bg-spooky-violet/20 blur-[110px]"
        aria-hidden
      />
      <div
        className="pulse-glow pointer-events-none absolute -right-24 top-1/3 z-0 h-80 w-80 rounded-full bg-crimson-600/20 blur-[120px]"
        style={{ animationDelay: '1.2s' }}
        aria-hidden
      />

      {/* Fog */}
      <div
        className="fog-layer pointer-events-none absolute bottom-0 left-0 z-0 h-48 w-[120%] bg-gradient-to-t from-night-950 via-night-900/60 to-transparent"
        aria-hidden
      />

      {/* Floating bats */}
      <motion.div
        className="float-y pointer-events-none absolute left-[12%] top-[22%] z-0 hidden text-night-700 md:block"
        aria-hidden
      >
        <svg width="42" height="24" viewBox="0 0 42 24" fill="currentColor">
          <path d="M21 6c-2-3-6-5-9-5 1 2 1 4 0 6-3-1-7-1-12 2 4 0 7 1 9 3 2 2 3 5 3 8 1-3 3-6 5-7h8c2 1 4 4 5 7 0-3 1-6 3-8 2-2 5-3 9-3-5-3-9-3-12-2-1-2-1-4 0-6-3 0-7 2-9 5Z" />
        </svg>
      </motion.div>
      <motion.div
        className="float-y pointer-events-none absolute right-[14%] top-[16%] z-0 hidden text-night-700 md:block"
        style={{ animationDelay: '1.6s' }}
        aria-hidden
      >
        <svg width="30" height="17" viewBox="0 0 42 24" fill="currentColor">
          <path d="M21 6c-2-3-6-5-9-5 1 2 1 4 0 6-3-1-7-1-12 2 4 0 7 1 9 3 2 2 3 5 3 8 1-3 3-6 5-7h8c2 1 4 4 5 7 0-3 1-6 3-8 2-2 5-3 9-3-5-3-9-3-12-2-1-2-1-4 0-6-3 0-7 2-9 5Z" />
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-spooky-purple/40 bg-night-900/70 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-spooky-purple backdrop-blur">
            <MoonStar className="h-4 w-4 text-spooky-amber" aria-hidden />
            Welcome to
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.25 }}
          className="mt-6 font-cinzel-deco text-[13vw] font-black leading-[1.02] tracking-wide sm:text-7xl md:text-8xl"
        >
          <span className="text-blood-gradient flicker block">HAUNTED</span>
          <span className="font-horror-title block text-white">NIGHT 2026</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-5 text-sm font-medium uppercase tracking-[0.28em] text-gray-300 sm:text-base"
        >
          The City&rsquo;s Ultimate Halloween Experience
        </motion.p>

        {/* Date & location pills */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-crimson-500/30 bg-night-900/70 px-5 py-2.5 text-xs uppercase tracking-wider text-gray-300 backdrop-blur">
            <CalendarDays className="h-4 w-4 text-crimson-400" aria-hidden />
            <span className="font-bold text-white">31 October 2026</span>
            <span className="hidden h-3 w-px bg-gray-600 sm:block" aria-hidden />
            <span className="hidden sm:inline">8:00 PM – 2:00 AM</span>
          </span>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-spooky-purple/30 bg-night-900/70 px-5 py-2.5 text-xs uppercase tracking-wider text-gray-300 backdrop-blur">
            <MapPin className="h-4 w-4 text-spooky-orange" aria-hidden />
            <span className="font-bold text-white">The Grand Arena</span>
            <span className="hidden h-3 w-px bg-gray-600 sm:block" aria-hidden />
            <span className="hidden sm:inline">Lahore, Pakistan</span>
          </span>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mt-10 grid max-w-lg grid-cols-4 gap-3 sm:gap-4"
          role="timer"
          aria-label="Countdown to event"
        >
          {units.map((u) => (
            <div
              key={u.label}
              className="glass-card rounded-xl px-2 py-4 sm:py-5"
            >
              <div className="font-cinzel text-2xl font-bold tabular-nums text-white sm:text-4xl">
                {u.value}
              </div>
              <div className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-crimson-400 sm:text-[10px]">
                {u.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-10"
        >
          <a
            href="#tickets"
            className="blood-border-btn inline-flex items-center gap-2.5 rounded-full px-10 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white"
          >
            <Ticket className="h-5 w-5" aria-hidden />
            Get Your Tickets
          </a>
        </motion.div>

        <motion.a
          href="#highlights"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-14 inline-flex flex-col items-center gap-1.5 text-gray-500 transition-colors hover:text-crimson-400"
          aria-label="Scroll to event highlights"
        >
          <span className="h-8 w-px bg-gradient-to-b from-transparent via-current to-transparent" aria-hidden />
          <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden />
        </motion.a>
      </div>
    </section>
  )
}
