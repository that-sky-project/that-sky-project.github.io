import { ArrowDown, ArrowUpRight, GitBranch } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { notify } from '../lib/toast'
import { useT } from '../i18n'

const EASE = [0.22, 0.61, 0.36, 1]

export default function Hero() {
  const t = useT()
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()

  const smoothScroll = useSpring(scrollY, { stiffness: 90, damping: 26, mass: 0.6 })

  const skyY = useTransform(smoothScroll, [0, 940], [0, 140], { clamp: true })
  const skyScale = useTransform(smoothScroll, [0, 940], [1, 0.92], { clamp: true })
  const skyOpacity = useTransform(smoothScroll, [0, 700], [1, 0.6], { clamp: true })
  const starY = useTransform(smoothScroll, [0, 940], [0, -90], { clamp: true })
  const contentY = useTransform(smoothScroll, [0, 940], [0, 60], { clamp: true })
  const contentOpacity = useTransform(smoothScroll, [0, 520], [1, 0], { clamp: true })

  function handleJoin(event) {
    event.preventDefault()
    notify.show({
      id: 'join-us',
      description: t('hero.joinToast'),
      descriptionSize: 15,
      radius: 8,
      paddingX: 18,
      paddingY: 10,
      blur: 10,
      backgroundOpacity: 0.72,
    })
  }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.11, delayChildren: 0.15 } },
  }
  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.05, ease: EASE },
    },
  }
  const divider = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, scaleX: 0 },
    show: { opacity: 1, scaleX: 1, transition: { duration: 1.1, ease: EASE, delay: 0.35 } },
  }

  const drift = reduce ? undefined : {
    x: [0, -14, 10, -6, 0],
    y: [0, 12, -16, 7, 0],
    rotate: [0, 0.45, -0.4, 0.2, 0],
    transition: { duration: 38, repeat: Infinity, ease: 'easeInOut', times: [0, 0.3, 0.62, 0.85, 1] },
  }

  return (
    <section id="top" className="hero">
      <motion.div
        className="hero-sky"
        aria-hidden="true"
        style={reduce ? undefined : { y: skyY, scale: skyScale, opacity: skyOpacity }}
        animate={drift}
      >
        <span className="sky-arc sky-arc-one" />
        <span className="sky-arc sky-arc-two" />
        <motion.span className="sky-star" style={reduce ? undefined : { y: starY }}>✦</motion.span>
      </motion.div>

      <motion.div
        className="container hero-inner"
        variants={container}
        initial="hidden"
        animate="show"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.p className="hero-label" variants={item}>{t('hero.kicker')}</motion.p>
        <motion.h1 variants={item}>{t('hero.titleLead')} <span>{t('hero.titleAccent')}</span></motion.h1>

        <motion.span className="hero-divider" aria-hidden="true" variants={divider} style={{ transformOrigin: 'left' }} />

        <motion.div className="hero-lower" variants={item}>
          <p className="hero-community">
            {t('hero.communityLead')} <strong>{t('hero.communityRoles')}</strong>
          </p>
          <p className="hero-description">{t('hero.description')}</p>
          <div className="hero-actions">
            <a className="primary-action" href="#projects"><GitBranch size={16} /> {t('hero.viewProjects')}</a>
            <a className="secondary-action" href="#" onClick={handleJoin}>{t('hero.join')} <ArrowUpRight size={16} /></a>
          </div>
        </motion.div>
      </motion.div>

      <a className="hero-scroll" href="#about"><ArrowDown size={16} /> {t('hero.scroll')}</a>
    </section>
  )
}
