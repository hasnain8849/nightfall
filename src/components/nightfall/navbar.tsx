'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Ghost, Menu, Ticket, X } from 'lucide-react'
import { NAV_LINKS } from '@/lib/event-data'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-all duration-300',
        scrolled
          ? 'border-spooky-purple/25 bg-night-950/85 backdrop-blur-md'
          : 'border-transparent bg-night-950/60 backdrop-blur-sm'
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <a href="#event" className="group flex items-center gap-3" aria-label="Nightfall home">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-crimson-500/50 bg-crimson-600/20 text-crimson-400 shadow-[0_0_18px_-4px_rgba(230,30,56,0.6)] transition-transform duration-300 group-hover:scale-105">
            <Ghost className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-cinzel-deco text-xl font-bold tracking-[0.18em] text-white sm:text-2xl">
            NIGHT<span className="text-crimson-500">FALL</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium uppercase tracking-wider text-gray-300 transition-colors duration-200 hover:text-crimson-400"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden sm:block">
          <a
            href="#tickets"
            className="blood-border-btn inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white"
          >
            <Ticket className="h-4 w-4" aria-hidden />
            Buy Tickets
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-white/5 hover:text-white focus:outline-none md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-x-0 top-20 z-40 border-t border-spooky-purple/25 bg-night-950 md:hidden"
              style={{ height: 'calc(100vh - 5rem)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            >
              <nav className="flex h-full flex-col gap-2 px-8 py-10" aria-label="Mobile">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-spooky-purple/15 py-4 font-cinzel text-lg uppercase tracking-[0.2em] text-gray-200 transition-colors hover:text-crimson-400"
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.a
                  href="#tickets"
                  onClick={() => setOpen(false)}
                  className="blood-border-btn mt-8 inline-flex items-center justify-center gap-2 rounded-full py-3.5 text-xs font-bold uppercase tracking-widest text-white"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Ticket className="h-4 w-4" aria-hidden />
                  Buy Tickets
                </motion.a>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
