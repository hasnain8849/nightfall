'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  once?: boolean
}

/** Fade-up on scroll into view. */
export function Reveal({ children, delay = 0, y = 28, className, once = true }: RevealProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.65, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

type StaggerProps = {
  children: ReactNode[]
  className?: string
  gap?: number
}

/** Container that staggers its children in. */
export function StaggerGroup({ children, className, gap = 0.12 }: StaggerProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap } },
      }}
    >
      {children}
    </motion.div>
  )
}

export const staggerItem = {
  hidden: reduceSafe(),
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.65, 0.36, 1] as const },
  },
}

function reduceSafe() {
  return { opacity: 0, y: 26 }
}
