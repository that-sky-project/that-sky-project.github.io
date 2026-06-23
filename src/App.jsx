import StarField from './components/StarField'
import CursorLight from './components/CursorLight'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { About, Manifesto, Philosophy } from './components/AboutPhilosophy'
import Projects from './components/Projects'
import Footer from './components/Footer'
import ToastViewport from './components/ToastViewport'

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#060810]">
      <StarField />
      <CursorLight />
      <ToastViewport />

      <div className="relative z-10">
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
    </div>
  )
}
