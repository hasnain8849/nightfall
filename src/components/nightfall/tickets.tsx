'use client'

import { motion } from 'framer-motion'
import { Check, Crown, Star, Ticket as TicketIcon } from 'lucide-react'
import { toast } from 'sonner'
import { TICKETS } from '@/lib/event-data'
import { SectionHeading } from './section-heading'
import { cn } from '@/lib/utils'

const ICONS = {
  ticket: TicketIcon,
  crown: Crown,
  star: Star,
} as const

export function Tickets() {
  const handleBuy = (tier: string, price: string) => {
    toast.success(`${tier} ticket reserved — PKR ${price}`, {
      description: 'Your seat is locked for 15 minutes. Complete payment via the e-ticket link sent to your email.',
    })
  }

  return (
    <section id="tickets" className="relative border-t border-spooky-purple/20 bg-night-850 py-24 md:py-28">
      <div
        className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-crimson-700/10 blur-[110px]"
        aria-hidden
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Secure your spot"
          title="Choose Your Ticket"
          subtitle="Different experiences. Same unforgettable night."
        />

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {TICKETS.map((tier, i) => {
            const Icon = ICONS[tier.icon]
            return (
              <motion.article
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                className={cn(
                  'glass-card relative flex flex-col rounded-2xl p-7 text-center transition-all duration-300',
                  tier.featured
                    ? 'border-crimson-500/60 shadow-[0_0_55px_-12px_rgba(230,30,56,0.55)] md:-translate-y-3 md:scale-[1.04]'
                    : 'hover:-translate-y-1.5 hover:border-spooky-purple/40'
                )}
                aria-label={`${tier.name} ticket, PKR ${tier.price}`}
              >
                {tier.featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-crimson-600 to-crimson-400 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-[0_0_20px_rgba(230,30,56,0.7)]">
                    Most Popular
                  </span>
                )}

                <div
                  className={cn(
                    'mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border',
                    tier.featured
                      ? 'border-crimson-500/50 bg-crimson-600/15 text-crimson-400'
                      : 'border-spooky-purple/40 bg-spooky-purple/12 text-spooky-purple'
                  )}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </div>

                <h3 className="mt-5 font-cinzel text-xl font-bold uppercase tracking-[0.14em] text-white">
                  {tier.name}
                </h3>

                <div className="mt-4 flex items-end justify-center gap-1.5">
                  <span className="pb-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500">
                    PKR
                  </span>
                  <span
                    className={cn(
                      'font-cinzel text-5xl font-black leading-none tabular-nums',
                      tier.featured ? 'text-blood-gradient' : 'text-white'
                    )}
                  >
                    {tier.price}
                  </span>
                </div>

                <ul className="mt-7 flex-1 space-y-3 text-left" role="list">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-3 text-sm text-gray-300">
                      <span
                        className={cn(
                          'flex h-5 w-5 flex-none items-center justify-center rounded-full',
                          tier.featured
                            ? 'bg-crimson-600/25 text-crimson-400'
                            : 'bg-spooky-purple/20 text-spooky-purple'
                        )}
                      >
                        <Check className="h-3 w-3" aria-hidden />
                      </span>
                      {perk}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleBuy(tier.name, tier.price)}
                  className={cn(
                    'mt-8 w-full rounded-full py-3 text-xs font-bold uppercase tracking-[0.22em] transition-all duration-300',
                    tier.featured
                      ? 'blood-border-btn text-white'
                      : 'ghost-btn text-gray-100'
                  )}
                >
                  Buy Now
                </button>
              </motion.article>
            )
          })}
        </div>

        <p className="mt-10 text-center text-xs text-gray-500">
          All passes are digital e-tickets delivered by email. 18+ only — CNIC required at the gate.
        </p>
      </div>
    </section>
  )
}
