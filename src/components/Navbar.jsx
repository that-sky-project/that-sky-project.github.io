import { useEffect, useState } from 'react'
import { ArrowUpRight, GitBranch, Scale } from 'lucide-react'
import { LayoutGroup, motion, useScroll, useSpring } from 'framer-motion'
import { useT } from '../i18n'
import LocaleToggle from './LocaleToggle'

const SECTIONS = [
  { href: '#about', id: 'about', key: 'sections.about' },
  { href: '#manifesto', id: 'manifesto', key: 'sections.manifesto' },
  { href: '#philosophy', id: 'philosophy', key: 'sections.philosophy' },
  { href: '#projects', id: 'projects', key: 'sections.projects' },
]

export default function Navbar() {
  const t = useT()
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('about')
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  useEffect(() => {
    let frame = 0

    const updateNavigation = () => {
      frame = 0
      setScrolled(window.scrollY > 24)

      const readingLine = Math.min(window.innerHeight * 0.34, 300)
      let current = SECTIONS[0].id

      SECTIONS.forEach(section => {
        const element = document.getElementById(section.id)
        if (element && element.getBoundingClientRect().top <= readingLine) {
          current = section.id
        }
      })

      setActiveSection(previous => previous === current ? previous : current)
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateNavigation)
    }

    updateNavigation()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <>
      <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container nav-inner">
          <a href="#top" className="brand" aria-label={t('nav.home')}>
            <span className="brand-symbol">✦</span>
            <span>That Sky Project</span>
          </a>

          <nav className="top-jumps" aria-label={t('nav.externalLinks')}>
            <a href="https://github.com/that-sky-project" target="_blank" rel="noreferrer">
              <GitBranch size={15} />
              <span className="jump-label">{t('nav.github')}</span>
              <ArrowUpRight size={13} />
            </a>
            <a href="https://github.com/that-sky-project/.github/blob/main/profile/LEGAL_NOTICE.md" target="_blank" rel="noreferrer">
              <Scale size={15} />
              <span className="jump-label">{t('nav.legal')}</span>
              <ArrowUpRight size={13} />
            </a>
            <LocaleToggle />
          </nav>
        </div>
        <motion.span className="nav-progress" style={{ scaleX: progress }} aria-hidden="true" />
      </header>

      <aside className="section-sidebar" aria-label={t('nav.sectionsLabel')}>
        <span className="sidebar-caption">{t('nav.explore')}</span>
        <LayoutGroup>
          <nav>
            {SECTIONS.map(section => (
              <a
                key={section.id}
                href={section.href}
                className={activeSection === section.id ? 'active' : ''}
                aria-current={activeSection === section.id ? 'location' : undefined}
                onClick={() => setActiveSection(section.id)}
              >
                {activeSection === section.id
                  ? <motion.span layoutId="sidebar-active" className="sidebar-dot" />
                  : <span className="sidebar-dot" />}
                <span className="sidebar-label">{t(section.key)}</span>
              </a>
            ))}
          </nav>
        </LayoutGroup>
        <span className="sidebar-progress">
          {SECTIONS.findIndex(section => section.id === activeSection) + 1} / {SECTIONS.length}
        </span>
      </aside>

      <nav className="mobile-sections" aria-label={t('nav.sectionsLabel')}>
        {SECTIONS.map(section => (
          <a
            key={section.id}
            href={section.href}
            className={activeSection === section.id ? 'active' : ''}
            aria-current={activeSection === section.id ? 'location' : undefined}
            onClick={() => setActiveSection(section.id)}
          >
            {t(section.key)}
          </a>
        ))}
      </nav>
    </>
  )
}
