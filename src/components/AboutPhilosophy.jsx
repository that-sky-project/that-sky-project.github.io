export function About() {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="section-intro">
          <p className="section-kicker">About Us</p>
          <h2>Built Around <span>Curiosity</span></h2>
        </div>

        <div className="about-body">
          <p className="about-lead">
            We are a group of independent enthusiasts who believe knowledge should be shared freely.
          </p>
          <div className="about-detail">
            <p>
              Through collaboration and open discussion, we explore ideas, create projects, and
              encourage learning in and around the Sky universe.
            </p>
            <p className="about-signature">Independent, open, player-made</p>
          </div>
        </div>
      </div>
    </section>
  )
}

const MANIFESTO_POINTS = [
  'We respect every individual; we seek common ground while embracing differences.',
  'We welcome technical exchange; we reject freeloading.',
  'We live by knowledge sharing; we keep it strictly non-commercial.',
  'Together, a blazing fire; apart, stars across the sky. The community will remember your contributions.',
  'We hold the door open wide, the world behind it is yours to write.',
]

export function Manifesto() {
  return (
    <section id="manifesto" className="manifesto-section">
      <div className="container manifesto-inner">
        <div className="manifesto-heading">
          <p className="section-kicker">Manifesto</p>
          <h2>A Project Group<br />Manifesto</h2>
          <p className="manifesto-belief">We talk only about tech; we do only real work.</p>
        </div>

        <div className="manifesto-statements">
          {MANIFESTO_POINTS.map(point => <p key={point}>{point}</p>)}
          <span className="manifesto-signature">That Sky Project</span>
        </div>
      </div>
    </section>
  )
}

const PRINCIPLES = [
  {
    title: 'Independent',
    desc: 'Operated entirely by individuals with no external affiliations or corporate backing.',
    tone: 'teal',
  },
  {
    title: 'Open',
    desc: 'Every insight, tool, and discovery is shared openly with the broader community.',
    tone: 'violet',
  },
  {
    title: 'Passionate',
    desc: 'Driven by genuine love for Sky and the joy of creative exploration.',
    tone: 'coral',
  },
  {
    title: 'Curious',
    desc: "We dig deep, ask hard questions, and celebrate what we don't yet know.",
    tone: 'gold',
  },
]

export function Philosophy() {
  return (
    <section id="philosophy" className="philosophy-section">
      <div className="container">
        <div className="philosophy-header">
          <div className="section-intro">
            <p className="section-kicker">Philosophy</p>
            <h2>What We<br />Stand For</h2>
          </div>
          <p>
            Four principles shape how we build, share, and explore. They keep the work open,
            self-directed, and grounded in real curiosity.
          </p>
        </div>

        <div className="principles">
          {PRINCIPLES.map(principle => (
            <article className={`principle principle-${principle.tone}`} key={principle.title}>
              <span className="principle-mark" aria-hidden="true" />
              <h3>{principle.title}</h3>
              <p>{principle.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
