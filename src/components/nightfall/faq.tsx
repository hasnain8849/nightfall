'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { motion } from 'framer-motion'
import { FAQS } from '@/lib/event-data'
import { SectionHeading } from './section-heading'

export function Faq() {
  return (
    <section id="faq" className="relative border-t border-spooky-purple/20 bg-night-850 py-24 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Need answers?"
          title="Frequently Asked Questions"
          subtitle="Got questions? We've got answers."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <Accordion type="single" collapsible className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={faq.question}
                value={`faq-${i}`}
                className="glass-card overflow-hidden rounded-xl border-0 px-5 transition-colors data-[state=open]:border-crimson-500/40"
              >
                <AccordionTrigger className="py-5 text-left text-sm font-semibold text-gray-100 hover:text-crimson-400 hover:no-underline [&>svg]:text-spooky-purple">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-gray-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
