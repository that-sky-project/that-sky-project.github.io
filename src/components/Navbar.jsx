import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitBranch, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#manifesto', label: 'Manifesto' },
  { href: '#philosophy', label: 'Philosophy' },
  { href: '#projects', label: 'Projects' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoClicks, setLogoClicks] = useState(0)
  const [eggActive, setEggActive] = useState(false)
  const eggTimer = useRef(null)

  function handleLogoClick(event) {
    event.preventDefault()
    const next = logoClicks + 1
    setLogoClicks(next)

    if (next >= 5) {
      setLogoClicks(0)
      setEggActive(true)
      clearTimeout(eggTimer.current)
      eggTimer.current = setTimeout(() => setEggActive(false), 2200)
    }
  }

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-[rgba(125,211,252,0.08)] bg-[#060810]/80 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <motion.a
          href="#"
          className="group relative flex items-center gap-2.5"
          whileHover={{ scale: 1.03 }}
          onClick={handleLogoClick}
        >
          <div className="relative flex h-7 w-7 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400/30 to-violet-500/20 blur-sm transition-all duration-400 group-hover:from-sky-400/50" />
            <motion.svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              className="relative z-10"
              animate={eggActive ? { rotate: [0, 180, 360, 540], scale: [1, 1.6, 0.8, 1] } : { rotate: 0, scale: 1 }}
              transition={eggActive ? { duration: 0.7, ease: 'easeInOut' } : {}}
            >
              <path
                d="M11 1 L12.5 9.5 L21 11 L12.5 12.5 L11 21 L9.5 12.5 L1 11 L9.5 9.5 Z"
                fill="url(#starGrad)"
              />
              <defs>
                <linearGradient id="starGrad" x1="1" y1="1" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7dd3fc" />
                  <stop offset="1" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </motion.svg>
          </div>

          <span className="font-semibold tracking-wide text-white" style={{ fontFamily: 'Space Grotesk' }}>
            That Sky
          </span>

          <AnimatePresence>
            {eggActive && (
              <motion.span
                initial={{ opacity: 0, y: 4, x: -4 }}
                animate={{ opacity: 1, y: -24, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="pointer-events-none absolute left-0 top-0 whitespace-nowrap text-[11px] font-medium"
                style={{
                  background: 'linear-gradient(90deg,#7dd3fc,#a78bfa,#34d399)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Space Grotesk',
                }}
              >
                you found it ✦
              </motion.span>
            )}
          </AnimatePresence>
        </motion.a>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(link => (
            <motion.a
              key={link.href}
              href={link.href}
              className="group relative rounded-lg px-4 py-2 text-sm text-slate-400 transition-colors hover:text-white"
              whileHover={{ backgroundColor: 'rgba(125,211,252,0.06)' }}
            >
              {link.label}
              <span className="absolute bottom-1 left-4 right-4 h-px scale-x-0 bg-gradient-to-r from-sky-400/0 via-sky-400/60 to-sky-400/0 transition-transform duration-300 group-hover:scale-x-100" />
            </motion.a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <motion.a
            href="https://github.com/that-sky-project"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:border-sky-400/30 hover:bg-white/10"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <GitBranch size={16} />
            GitHub
          </motion.a>
        </div>

        <button
          onClick={() => setMobileOpen(value => !value)}
          className="p-2 text-slate-400 transition-colors hover:text-white md:hidden"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-b border-[rgba(125,211,252,0.08)] bg-[#060810]/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-2 px-6 py-4">
              {NAV_LINKS.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-white/5 py-3 text-slate-300 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://github.com/that-sky-project"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-2 text-sky-400"
              >
                <GitBranch size={16} /> GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
