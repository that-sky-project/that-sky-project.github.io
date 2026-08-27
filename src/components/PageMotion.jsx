import { useEffect } from 'react'

const REVEAL_SELECTOR = [
  '.section-intro',
  '.about-lead',
  '.about-detail',
  '.manifesto-heading',
  '.manifesto-statements > p',
  '.philosophy-header > p',
  '.principle',
  '.projects-header > p',
  '.project-controls',
  '.featured-project',
  '.project-row',
  '.footer-main',
].join(', ')

export default function PageMotion() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(REVEAL_SELECTOR))

    elements.forEach((element, index) => {
      element.classList.add('reveal-item')
      element.style.setProperty('--reveal-order', String(index % 4))
    })

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(element => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
    )

    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return null
}
