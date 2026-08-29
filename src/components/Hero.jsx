import { useRef } from 'react'
import { ArrowDown, ArrowUpRight, GitBranch } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { notify } from '../lib/toast'
import { useT } from '../i18n'

const EASE = [0.22, 0.61, 0.36, 1]

export default function Hero() {
  const t = useT()
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const skyY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%'])
  const skyScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12])

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
    show: { transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: 0.1 } },
  }
  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  }
  const divider = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, scaleX: 0 },
    show: { opacity: 1, scaleX: 1, transition: { duration: 0.9, ease: EASE } },
  }

  return (
    <section id="top" className="hero" ref={ref}>
      <motion.div className="hero-sky" aria-hidden="true" style={{ y: skyY, scale: skyScale }}>
        <span className="sky-arc sky-arc-one" />
        <span className="sky-arc sky-arc-two" />
        <span className="sky-star">✦</span>
      </motion.div>

      <motion.div className="container hero-inner" variants={container} initial="hidden" animate="show">
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
