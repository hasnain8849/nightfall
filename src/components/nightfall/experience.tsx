'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { EXPERIENCES } from '@/lib/event-data'
import { SectionHeading } from './section-heading'
import { cn } from '@/lib/utils'

const HOVER_GLOWS = [
  'hover:shadow-[0_0_45px_-10px_rgba(230,30,56,0.45)] hover:border-crimson-500/50',
  'hover:shadow-[0_0_45px_-10px_rgba(157,78,221,0.5)] hover:border-spooky-purple/50',
  'hover:shadow-[0_0_45px_-10px_rgba(255,98,0,0.45)] hover:border-spooky-orange/50',
]

export function Experience() {
  return (
    <section
      id="experience"
      className="relative z-20 border-t border-spooky-purple/20 bg-night-900 py-24 md:py-28"
    >
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-spooky-violet/10 blur-[100px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Explore the experience"
          title="Step Into The Dark"
          subtitle="A world of thrills, mystery and unforgettable moments."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {EXPERIENCES.map((exp, i) => (
            <motion.article
              key={exp.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className={cn(
                'glass-card group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2',
                HOVER_GLOWS[i]
              )}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden sm:h-64">
                <img
                  src={exp.image}
                  alt={exp.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/35 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-night-950/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 backdrop-blur">
                  {exp.tag}
                </span>
              </div>

              {/* Body */}
              <div className="relative p-6 pt-2">
                <h3 className="font-cinzel text-xl font-bold tracking-wider text-white">
                  {exp.title}
                </h3>
                <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-crimson-400">
                  {exp.hook}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">{exp.text}</p>
                <a
                  href="#tickets"
                  className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-spooky-purple transition-colors hover:text-crimson-400"
                >
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
