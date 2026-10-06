'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Mail, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Reveal } from './reveal'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your email address.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = (await res.json()) as {
        ok: boolean
        message?: string
        error?: string
        alreadySubscribed?: boolean
      }
      if (res.ok && data.ok) {
        if (data.alreadySubscribed) {
          toast.info('Already on the list', { description: data.message })
        } else {
          toast.success('Welcome to the shadows!', { description: data.message })
        }
        setEmail('')
      } else {
        toast.error('Subscription failed', { description: data.error })
      }
    } catch {
      toast.error('Network error', {
        description: 'Could not reach the server. Please check your connection and try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="newsletter" className="relative border-t border-spooky-purple/20 bg-night-900 py-24 md:py-28">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[42rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-crimson-700/12 blur-[120px]"
        aria-hidden
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <div className="glass-card relative overflow-hidden rounded-3xl border-crimson-500/25 px-6 py-14 text-center shadow-[0_0_70px_-20px_rgba(230,30,56,0.45)] sm:px-14">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson-500/70 to-transparent"
              aria-hidden
            />
            <Mail className="mx-auto h-10 w-10 text-crimson-400" aria-hidden />
            <h2 className="mt-5 font-cinzel text-3xl font-bold tracking-wide text-white sm:text-4xl">
              Stay In The Loop
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-400">
              Get the latest artist line-up announcements, special flash deals, and insider event
              news before anyone else.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              noValidate
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                autoComplete="email"
                disabled={loading}
                className="h-12 flex-1 rounded-full border border-spooky-purple/30 bg-night-950/80 px-5 text-sm text-gray-100 placeholder:text-gray-500 focus:border-crimson-500/60 focus:outline-none focus:ring-2 focus:ring-crimson-500/30 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading}
                className="blood-border-btn inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-xs font-bold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Send className="h-4 w-4" aria-hidden />
                )}
                {loading ? 'Joining…' : 'Subscribe'}
              </button>
            </form>

            <p className="mt-5 text-[11px] text-gray-500">
              No spam — only nightmares. Unsubscribe anytime.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
