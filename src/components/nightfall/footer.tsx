'use client'

import { useState } from 'react'
import { Ghost, Send } from 'lucide-react'
import { toast } from 'sonner'
import { EVENT, FOOTER_LINKS } from '@/lib/event-data'

const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    path: 'M13.5 9H16l.5-3h-3V4.5c0-.9.3-1.5 1.6-1.5H16.6V.2C16.3.2 15.3 0 14.1 0 11.6 0 10 1.5 10 4.3V6H7v3h3v9h3.5V9Z',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    path: 'M7 2C4.2 2 2 4.2 2 7v6c0 2.8 2.2 5 5 5h6c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7Zm0 2h6c1.7 0 3 1.3 3 3v6c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3Zm7.2 1.1a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM10 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z',
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com',
    path: 'M3 3l6.6 8.6L3.4 21h2.4l4.9-6.9L15.9 21H21l-6.9-9L20 3h-2.4l-4.5 6.3L8.1 3H3Z',
  },
  {
    label: 'Discord',
    href: 'https://discord.com',
    path: 'M19.3 5.3A16.9 16.9 0 0 0 15.1 4l-.2.4c1.5.4 2.9 1 4.2 1.9A13.7 13.7 0 0 0 7 6.2c1.3-.9 2.7-1.5 4.2-1.9L11 4a16.9 16.9 0 0 0-4.2 1.3C4.1 9.2 3.4 13 3.7 16.7A17 17 0 0 0 8.9 20l1.1-1.8c-.9-.3-1.8-.8-2.6-1.4l.6-.5a12.2 12.2 0 0 0 10.4 0l.6.5c-.8.6-1.7 1.1-2.6 1.4l1.1 1.8a17 17 0 0 0 5.2-3.3c.4-4.3-.7-8-3.4-11.4ZM9.7 14.4c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7Zm6.6 0c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7Z',
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com',
    path: 'M16.6 3c.3 2.3 1.7 3.7 4 3.9v2.7c-1.4.1-2.7-.3-4-1.1v5.8c0 4-2.9 6.3-6.1 5.6-2.4-.5-4.2-2.7-4.2-5.1 0-3.6 3.2-6 6.7-5.4v2.8c-.4-.1-.8-.2-1.2-.2-1.4 0-2.5 1.1-2.5 2.6 0 1.4 1.1 2.6 2.5 2.6 1.5 0 2.6-1.2 2.6-2.8V3h2.2Z',
  },
]

export function Footer() {
  const [email, setEmail] = useState('')

  const quickSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your email address.')
      return
    }
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        toast.success(data.alreadySubscribed ? 'Already subscribed' : 'Subscribed!', {
          description: data.message,
        })
        setEmail('')
      } else {
        toast.error('Subscription failed', { description: data.error })
      }
    } catch {
      toast.error('Network error. Please try again.')
    }
  }

  return (
    <footer className="mt-auto border-t border-spooky-purple/20 bg-night-950 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <a href="#event" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-crimson-500/50 bg-crimson-600/20 text-crimson-400">
                <Ghost className="h-4 w-4" aria-hidden />
              </span>
              <span className="font-cinzel-deco text-lg font-bold tracking-[0.18em] text-white">
                NIGHT<span className="text-crimson-500">FALL</span>
              </span>
            </a>
            <p className="mt-5 max-w-xs text-sm italic leading-relaxed text-gray-500">
              More than an event, it&rsquo;s a night to remember.{' '}
              <span className="text-gray-400">Turn your nightmares into memories.</span>
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-spooky-purple/25 bg-night-900 text-gray-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-crimson-500/60 hover:text-crimson-400"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Quick links">
            <h3 className="font-cinzel text-sm font-bold uppercase tracking-[0.22em] text-white">
              Quick Links
            </h3>
            <ul className="mt-6 space-y-3.5">
              {FOOTER_LINKS.quick.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-gray-400 transition-colors hover:text-crimson-400"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support */}
          <nav aria-label="Support">
            <h3 className="font-cinzel text-sm font-bold uppercase tracking-[0.22em] text-white">
              Support
            </h3>
            <ul className="mt-6 space-y-3.5">
              {FOOTER_LINKS.support.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-gray-400 transition-colors hover:text-crimson-400"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Subscribe */}
          <div>
            <h3 className="font-cinzel text-sm font-bold uppercase tracking-[0.22em] text-white">
              Subscribe
            </h3>
            <p className="mt-6 text-sm text-gray-500">
              Get updates &amp; exclusive offers directly.
            </p>
            <form onSubmit={quickSubscribe} className="mt-4 flex overflow-hidden rounded-full border border-spooky-purple/30 bg-night-900 focus-within:border-crimson-500/60">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm text-gray-100 placeholder:text-gray-600 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe from footer"
                className="blood-border-btn flex w-12 flex-none items-center justify-center rounded-full text-white"
              >
                <Send className="h-4 w-4" aria-hidden />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-spooky-purple/15 pt-8 sm:flex-row">
          <p className="text-xs text-gray-600">
            © 2026 {EVENT.name}. All rights reserved.
          </p>
          <p className="font-cinzel text-[11px] uppercase tracking-[0.3em] text-gray-600">
            Turn Your Nightmares Into Memories
          </p>
        </div>
      </div>
    </footer>
  )
}
