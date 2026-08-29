import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.22, 0.61, 0.36, 1]
const VIEWPORT = { once: true, margin: '0px 0px -10% 0px' }

export function Reveal({ as = 'div', children, className, delay = 0, y = 22, ...rest }) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

export function RevealGroup({ as = 'div', children, className, stagger = 0.08, ...rest }) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ show: { transition: { staggerChildren: reduce ? 0 : stagger } }, hidden: {} }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

export function RevealItem({ as = 'div', children, className, y = 20, ...rest }) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
