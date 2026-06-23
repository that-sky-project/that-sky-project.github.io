import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { SectionLabel } from './SectionLabel'

function useReveal(threshold = 0.2) {
  return useInView({ triggerOnce: true, threshold })
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }
}

export function About() {
  const [ref, inView] = useReveal(0.2)

  return (
    <section id="about" className="relative py-28 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] md:items-end">
        {inView && (
          <>
            <div className="text-center md:text-left">
              <motion.div {...fadeUp(0)}>
                <SectionLabel align="start">About Us</SectionLabel>
              </motion.div>
              <motion.h2
                {...fadeUp(0.1)}
                className="mt-4 text-4xl md:text-5xl font-bold text-white leading-tight"
                style={{ fontFamily: 'Space Grotesk' }}
              >
                Built Around{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-violet-400">
                  Curiosity
                </span>
              </motion.h2>
            </div>
            <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
              <motion.p
                {...fadeUp(0.2)}
                className="max-w-xl text-base md:text-lg text-slate-400 leading-relaxed"
              >
                We are a group of independent enthusiasts who believe knowledge should be shared
                freely. Through collaboration and open discussion, we explore ideas, create
                projects, and encourage learning in and around the Sky universe.
              </motion.p>
              <motion.div
                {...fadeUp(0.28)}
                className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-slate-500"
                style={{ fontFamily: 'Space Grotesk' }}
              >
                <span className="h-px w-12 bg-gradient-to-r from-sky-400/50 to-transparent" />
                Independent, open, player-made
              </motion.div>
            </div>
          </>
        )}
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
  const [ref, inView] = useReveal(0.15)

  return (
    <section id="manifesto" className="relative py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-14 grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] md:items-end">
          {inView && (
            <>
              <div>
                <motion.div {...fadeUp(0)}>
                  <SectionLabel align="start">Manifesto</SectionLabel>
                </motion.div>
                <motion.h2
                  {...fadeUp(0.1)}
                  className="mt-4 max-w-3xl text-4xl md:text-5xl font-bold text-white leading-tight"
                  style={{ fontFamily: 'Space Grotesk' }}
                >
                  A Project Group
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-sky-400 to-violet-400">
                    Manifesto
                  </span>
                </motion.h2>
              </div>
              <motion.p
                {...fadeUp(0.18)}
                className="max-w-md text-sm md:text-base text-slate-400 leading-relaxed md:justify-self-end"
              >
                This is the posture behind the work: public by default, practical in execution, and
                open enough that new people can still find a way in.
              </motion.p>
            </>
          )}
        </div>

        <div className="relative border-y border-white/8 py-10 md:py-14">
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/20 to-transparent" />
          <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent" />

          {inView && (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.18fr)_minmax(18rem,0.82fr)] lg:gap-14">
              <motion.div {...fadeUp(0.22)} className="space-y-6">
                <div className="text-[11px] uppercase tracking-[0.32em] text-slate-600" style={{ fontFamily: 'Space Grotesk' }}>
                  We believe
                </div>
                <p
                  className="max-w-4xl text-2xl md:text-4xl font-semibold leading-[1.2] text-white"
                  style={{ fontFamily: 'Space Grotesk' }}
                >
                  We talk only about tech; we do only real work.
                </p>
                <p className="max-w-2xl text-sm md:text-base text-slate-400 leading-relaxed">
                  A small set of principles keeps the project clear, public, and worth contributing
                  to.
                </p>
              </motion.div>

              <div className="flex flex-col">
                {MANIFESTO_POINTS.map((point, index) => (
                  <motion.div
                    key={point.title}
                    {...fadeUp(0.3 + index * 0.08)}
                    className="grid gap-3 border-t border-white/8 py-5 first:border-t-0 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-slate-600">
                      <span className="text-sky-400/70" style={{ fontFamily: 'Space Grotesk' }}>
                        0{index + 1}
                      </span>
                      <span>Statement</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{point}</p>
                  </motion.div>
                ))}
                <motion.div
                  {...fadeUp(0.72)}
                  className="border-t border-white/8 pt-5 text-right"
                >
                  <p
                    className="text-xs uppercase tracking-[0.3em] text-slate-500"
                    style={{ fontFamily: 'Space Grotesk' }}
                  >
                    -- That Sky Project
                  </p>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

const PRINCIPLES = [
  {
    title: 'Independent',
    desc: 'Operated entirely by individuals with no external affiliations or corporate backing.',
    accent: '#7dd3fc',
    keyword: 'No strings attached.',
  },
  {
    title: 'Open',
    desc: 'Every insight, tool, and discovery is shared openly with the broader community.',
    accent: '#a78bfa',
    keyword: 'Knowledge wants to be free.',
  },
  {
    title: 'Passionate',
    desc: 'Driven by genuine love for Sky and the joy of creative exploration.',
    accent: '#34d399',
    keyword: 'Built with care.',
  },
  {
    title: 'Curious',
    desc: "We dig deep, ask hard questions, and celebrate what we don't yet know.",
    accent: '#fbbf24',
    keyword: 'Always asking why.',
  },
]

export function Philosophy() {
  const [ref, inView] = useReveal(0.1)

  return (
    <section id="philosophy" className="relative py-24 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        {/* header */}
        <div className="mb-16 grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] md:items-end">
          {inView && (
            <>
              <div>
                <motion.div {...fadeUp(0)}>
                  <SectionLabel align="start">Philosophy</SectionLabel>
                </motion.div>
                <motion.h2
                  {...fadeUp(0.1)}
                  className="mt-4 max-w-3xl text-4xl md:text-5xl font-bold text-white leading-tight"
                  style={{ fontFamily: 'Space Grotesk' }}
                >
                  What We Stand For
                </motion.h2>
              </div>
              <motion.div
                {...fadeUp(0.18)}
                className="md:pb-2"
              >
                <p className="max-w-md text-sm md:text-base text-slate-400 leading-relaxed">
                  Four principles shape how we build, share, and explore. They keep the work open,
                  self-directed, and grounded in real curiosity.
                </p>
              </motion.div>
            </>
          )}
        </div>

        {/* list */}
        <div className="relative">
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="flex flex-col">
            {PRINCIPLES.map((p, i) => (
              <PrincipleBand key={p.title} {...p} index={i} inView={inView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PrincipleBand({ title, desc, accent, keyword, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.35 + index * 0.13, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="group relative grid gap-5 border-b border-white/8 py-8 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-8 md:py-10"
    >
      <div
        className="pointer-events-none absolute left-0 top-0 h-px transition-all duration-300 group-hover:w-full"
        style={{
          width: '5.5rem',
          background: `linear-gradient(90deg, ${accent}, transparent)`,
        }}
      />

      <div className="flex items-start gap-3 md:gap-4">
        <div
          className="mt-1 h-12 w-px shrink-0 rounded-full"
          style={{ background: `linear-gradient(180deg, ${accent}, transparent)` }}
        />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: accent }}
            />
            <span
              className="text-[11px] uppercase tracking-[0.26em]"
              style={{
                color: `${accent}cc`,
                fontFamily: 'Space Grotesk',
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <div
            className="text-[11px] font-medium uppercase tracking-[0.3em] text-slate-600"
            style={{ fontFamily: 'Space Grotesk' }}
          >
            Principle
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h3
            className="text-2xl md:text-[2rem] font-semibold text-white leading-tight"
            style={{ fontFamily: 'Space Grotesk' }}
          >
            {title}
          </h3>
          <span
            className="text-[11px] uppercase tracking-[0.28em]"
            style={{ color: `${accent}cc` }}
          >
            {keyword}
          </span>
        </div>
        <p className="max-w-2xl text-sm md:text-[15px] text-slate-400 leading-relaxed">
          {desc}
        </p>
      </div>
    </motion.div>
  )
}
