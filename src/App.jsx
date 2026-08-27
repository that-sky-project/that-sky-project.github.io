import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { About, Manifesto, Philosophy } from './components/AboutPhilosophy'
import Projects from './components/Projects'
import Footer from './components/Footer'
import ToastViewport from './components/ToastViewport'
import PageMotion from './components/PageMotion'

export default function App() {
  return (
    <div className="site-shell">
      <ToastViewport />
      <PageMotion />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Manifesto />
        <Philosophy />
        <Projects />
      </main>
      <Footer />
    </div>
  )
}
