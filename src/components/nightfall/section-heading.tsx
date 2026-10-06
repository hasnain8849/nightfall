import { Reveal } from './reveal'
import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  kicker?: string
  title: string
  subtitle?: string
  className?: string
}

/** Shared centered section heading with crimson divider. */
export function SectionHeading({ kicker, title, subtitle, className }: SectionHeadingProps) {
  return (
    <Reveal className={cn('mx-auto mb-12 max-w-3xl text-center md:mb-16', className)}>
      {kicker ? (
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-spooky-purple/30 bg-spooky-purple/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-spooky-purple">
          {kicker}
        </span>
      ) : null}
      <h2 className="font-cinzel text-3xl font-bold tracking-wide text-white sm:text-4xl md:text-[2.75rem] md:leading-tight">
        {title}
      </h2>
      <div className="mx-auto mt-5 h-[3px] w-16 rounded-full bg-gradient-to-r from-transparent via-crimson-500 to-transparent" />
      {subtitle ? (
        <p className="mt-4 text-sm uppercase tracking-[0.18em] text-gray-400">{subtitle}</p>
      ) : null}
    </Reveal>
  )
}
