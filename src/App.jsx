import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { About, Manifesto, Philosophy } from './components/AboutPhilosophy'
import Projects from './components/Projects'
import Footer from './components/Footer'
import ToastViewport from './components/ToastViewport'
import { useLocale } from './i18n'

export default function App() {
  const { locale } = useLocale()
  const reduce = useReducedMotion()

  return (
    <div className="site-shell">
      <ToastViewport />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={locale}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <Hero />
          <About />
          <Manifesto />
          <Philosophy />
          <Projects />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}
