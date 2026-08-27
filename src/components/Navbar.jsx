import { useEffect, useState } from 'react'
import { ArrowUpRight, GitBranch, Scale } from 'lucide-react'

const SECTIONS = [
  { href: '#about', id: 'about', label: 'About' },
  { href: '#manifesto', id: 'manifesto', label: 'Manifesto' },
  { href: '#philosophy', id: 'philosophy', label: 'Philosophy' },
  { href: '#projects', id: 'projects', label: 'Projects' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('about')

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
          <a href="#top" className="brand" aria-label="That Sky Project home">
            <span className="brand-symbol">✦</span>
            <span>That Sky Project</span>
          </a>

          <nav className="top-jumps" aria-label="External links">
            <a href="https://github.com/that-sky-project" target="_blank" rel="noreferrer">
              <GitBranch size={15} />
              GitHub
              <ArrowUpRight size={13} />
            </a>
            <a href="https://github.com/that-sky-project/.github/blob/main/profile/LEGAL_NOTICE.md" target="_blank" rel="noreferrer">
              <Scale size={15} />
              Legal Notice
              <ArrowUpRight size={13} />
            </a>
          </nav>
        </div>
      </header>

      <aside className="section-sidebar" aria-label="Page sections">
        <span className="sidebar-caption">Explore</span>
        <nav>
          {SECTIONS.map(section => (
            <a
              key={section.id}
              href={section.href}
              className={activeSection === section.id ? 'active' : ''}
              aria-current={activeSection === section.id ? 'location' : undefined}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="sidebar-dot" />
              <span className="sidebar-label">{section.label}</span>
            </a>
          ))}
        </nav>
        <span className="sidebar-progress">
          {SECTIONS.findIndex(section => section.id === activeSection) + 1} / {SECTIONS.length}
        </span>
      </aside>

      <nav className="mobile-sections" aria-label="Page sections">
        {SECTIONS.map(section => (
          <a
            key={section.id}
            href={section.href}
            className={activeSection === section.id ? 'active' : ''}
            aria-current={activeSection === section.id ? 'location' : undefined}
            onClick={() => setActiveSection(section.id)}
          >
            {section.label}
          </a>
        ))}
      </nav>
    </>
  )
}
