import { ArrowDown, ArrowUpRight, GitBranch } from 'lucide-react'
import { notify } from '../lib/toast'

export default function Hero() {
  function handleJoin(event) {
    event.preventDefault()
    notify.show({
      id: 'join-us',
      description: 'Please contact via Github email.',
      descriptionSize: 15,
      radius: 8,
      paddingX: 18,
      paddingY: 10,
      blur: 10,
      backgroundOpacity: 0.72,
    })
  }

  return (
    <section id="top" className="hero">
      <div className="hero-sky" aria-hidden="true">
        <span className="sky-arc sky-arc-one" />
        <span className="sky-arc sky-arc-two" />
        <span className="sky-star">✦</span>
      </div>

      <div className="container hero-inner">
        <p className="hero-label">Open Source Community</p>
        <h1>That Sky <span>Project</span></h1>

        <div className="hero-lower">
          <p className="hero-community">
            A community of <strong>developers, creators, researchers, players, explorers.</strong>
          </p>
          <p className="hero-description">
            Brought together by a shared passion for Sky: Children of the Light, we turn research,
            experiments, and open-source tools into something the wider community can actually use.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#projects"><GitBranch size={16} /> View Projects</a>
            <a className="secondary-action" href="#" onClick={handleJoin}>Join Us <ArrowUpRight size={16} /></a>
          </div>
        </div>
      </div>

      <a className="hero-scroll" href="#about"><ArrowDown size={16} /> Explore</a>
    </section>
  )
}
