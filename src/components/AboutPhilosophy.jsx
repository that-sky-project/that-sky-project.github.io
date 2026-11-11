import { useT } from '../i18n'
import { Reveal, RevealGroup, RevealItem } from './Reveal'

export function About() {
  const t = useT()
  return (
    <section id="about" className="about-section">
      <div className="container">
        <Reveal className="section-index">
          <span className="index-num">01</span>
          <span className="index-label">{t('about.kicker')}</span>
        </Reveal>

        <Reveal as="p" className="about-lead" y={26}>
          {t('about.lead')}
        </Reveal>

        <div className="about-body">
          <Reveal as="p" className="about-detail" delay={0.08}>
            {t('about.detail')}
          </Reveal>
          <Reveal className="about-signature" delay={0.16}>
            {t('about.signature')}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

const MANIFESTO_LAYOUT = [
  { key: 'tech' },
  { key: 'respect' },
  { key: 'exchange' },
  { key: 'sharing' },
  { key: 'together', emphasis: true },
  { key: 'door' },
]

export function Manifesto() {
  const t = useT()

  return (
    <section id="manifesto" className="manifesto-section">
      <div className="container manifesto-inner">
        <div className="manifesto-heading">
          <Reveal>
            <div className="section-index index-dark">
              <span className="index-num">02</span>
              <span className="index-label">{t('manifesto.kicker')}</span>
            </div>
            <h2>{t('manifesto.title')}</h2>
            <p className="manifesto-belief">{t('manifesto.belief')}</p>
          </Reveal>
        </div>

        <RevealGroup className="manifesto-statements">
          {MANIFESTO_LAYOUT.map((point, index) => (
            <RevealItem as="div" key={point.key} className={`manifesto-statement${point.emphasis ? ' is-emphasis' : ''}`}>
              <span className="statement-index">{String(index + 1).padStart(2, '0')}</span>
              <p>{t(`manifesto.points.${point.key}`)}</p>
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

  return (
    <section id="philosophy" className="philosophy-section">
      <div className="container">
        <div className="philosophy-header">
          <Reveal className="section-intro">
            <div className="section-index">
              <span className="index-num">03</span>
              <span className="index-label">{t('philosophy.kicker')}</span>
            </div>
            <h2>{t('philosophy.titleLead')} {t('philosophy.titleAccent')}</h2>
          </Reveal>
          <Reveal as="p" delay={0.1}>{t('philosophy.intro')}</Reveal>
        </div>

        <RevealGroup className="principles">
          {PRINCIPLE_LAYOUT.map((principle, index) => (
            <RevealItem as="article" className={`principle principle-${principle.tone}`} key={principle.key}>
              <span className="principle-index">{String(index + 1).padStart(2, '0')}</span>
              <div className="principle-body">
                <h3>{t(`philosophy.principles.${principle.key}.title`)}</h3>
                <p>{t(`philosophy.principles.${principle.key}.desc`)}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
