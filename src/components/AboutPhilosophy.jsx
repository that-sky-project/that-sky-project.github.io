import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useT } from '../i18n'
import { Reveal, RevealGroup, RevealItem } from './Reveal'

const EASE = [0.22, 0.61, 0.36, 1]

export function About() {
  const t = useT()
  return (
    <section id="about" className="about-section">
      <div className="container">
        <Reveal className="section-intro">
          <p className="section-kicker">{t('about.kicker')}</p>
          <h2>{t('about.titleLead')} <span>{t('about.titleAccent')}</span></h2>
        </Reveal>

        <div className="about-body">
          <Reveal as="p" className="about-lead">{t('about.lead')}</Reveal>
          <Reveal className="about-detail" delay={0.1}>
            <p>{t('about.detail')}</p>
            <p className="about-signature">{t('about.signature')}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

const MANIFESTO_LAYOUT = [
  { key: 'respect' },
  { key: 'exchange' },
  { key: 'sharing' },
  { key: 'together', emphasis: true },
  { key: 'door' },
]

export function Manifesto() {
  const t = useT()
  const listRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 80%', 'end 60%'] })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="manifesto" className="manifesto-section">
      <div className="container manifesto-inner">
        <div className="manifesto-heading">
          <p className="section-kicker">{t('manifesto.kicker')}</p>
          <h2>{t('manifesto.title')}</h2>
          <p className="manifesto-belief">{t('manifesto.belief')}</p>
        </div>

        <RevealGroup className="manifesto-statements" ref={listRef}>
          <motion.span className="manifesto-line" style={{ scaleY: lineScale }} aria-hidden="true" />
          {MANIFESTO_LAYOUT.map(point => (
            <RevealItem as="p" key={point.key} className={point.emphasis ? 'is-emphasis' : ''}>
              {t(`manifesto.points.${point.key}`)}
            </RevealItem>
          ))}
          <span className="manifesto-signature">{t('manifesto.signature')}</span>
        </RevealGroup>
      </div>
    </section>
  )
}

const PRINCIPLE_LAYOUT = [
  { key: 'independent', tone: 'teal' },
  { key: 'open', tone: 'violet' },
  { key: 'passionate', tone: 'coral' },
  { key: 'curious', tone: 'gold' },
]

export function Philosophy() {
  const t = useT()
  const reduce = useReducedMotion()

  return (
    <section id="philosophy" className="philosophy-section">
      <div className="container">
        <div className="philosophy-header">
          <Reveal className="section-intro">
            <p className="section-kicker">{t('philosophy.kicker')}</p>
            <h2>{t('philosophy.titleLead')}<br />{t('philosophy.titleAccent')}</h2>
          </Reveal>
          <Reveal as="p" delay={0.1}>{t('philosophy.intro')}</Reveal>
        </div>

        <RevealGroup className="principles">
          {PRINCIPLE_LAYOUT.map(principle => (
            <RevealItem as="article" className={`principle principle-${principle.tone}`} key={principle.key}>
              <motion.span
                className="principle-mark"
                aria-hidden="true"
                initial={{ scaleX: reduce ? 1 : 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
                style={{ transformOrigin: 'left' }}
              />
              <h3>{t(`philosophy.principles.${principle.key}.title`)}</h3>
              <p>{t(`philosophy.principles.${principle.key}.desc`)}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
