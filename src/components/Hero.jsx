import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { GitBranch, ChevronDown } from 'lucide-react'
import { notify } from '../lib/toast'

function TypewriterText({ texts }) {
  const elRef = useRef(null)

  useEffect(() => {
    let i = 0
    let ti = 0
    let deleting = false
    let timer

    function tick() {
      const el = elRef.current
      if (!el) return
      const current = texts[i]

      if (!deleting) {
        el.textContent = current.slice(0, ti + 1)
        ti++
        if (ti >= current.length) {
          deleting = true
          timer = setTimeout(tick, 1800)
          return
        }
      } else {
        el.textContent = current.slice(0, ti - 1)
        ti--
        if (ti <= 0) {
          deleting = false
          i = (i + 1) % texts.length
        }
      }

      timer = setTimeout(tick, deleting ? 40 : 70)
    }

    tick()
    return () => clearTimeout(timer)
  }, [texts])

  return (
    <span
      ref={elRef}
      className="bg-gradient-to-r from-sky-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent"
    />
  )
}

export default function Hero() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 })

  const blob1X = useTransform(springX, value => value * 0.05)
  const blob1Y = useTransform(springY, value => value * 0.05)
  const blob2X = useTransform(springX, value => value * -0.03)
  const blob2Y = useTransform(springY, value => value * -0.03)

  function handleMouseMove(event) {
    mouseX.set(event.clientX - window.innerWidth / 2)
    mouseY.set(event.clientY - window.innerHeight / 2)
  }

  function handleJoinUs(event) {
    event.preventDefault()

    // notify.show({
    //   id: 'join-us',
    //   title: 'Join Us',
    //   description:
    //     'Please contact via Github email.',
    //   action: {
    //     label: 'View Projects',
    //     onClick: () => {
    //       window.location.hash = '#projects'
    //       notify.dismiss('join-us')
    //     },
    //   },
    // })
    notify.show({
      id: 'join-us',
      description:
        'Please contact via Github email.',
      descriptionSize: 16,
      radius: 10,
      paddingX: 18,
      paddingY: 9,
      blur: 2,
      backgroundOpacity: 0.28,
      surfaceFadeDuration: 0.3,
      textFadeDuration: 0.24,
    })
  }

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute left-[10%] top-[-20%] h-[600px] w-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(125,211,252,0.12) 0%, transparent 70%)',
            x: blob1X,
            y: blob1Y,
          }}
        />
        <motion.div
          className="absolute right-[5%] top-[10%] h-[500px] w-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)',
            x: blob2X,
            y: blob2Y,
          }}
        />
        <div
          className="absolute bottom-0 left-[30%] h-[400px] w-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-8 flex items-center gap-3"
      >
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-sky-400/50" />
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          className="select-none text-xs leading-none text-sky-400"
        >
          ✦
        </motion.span>
        <span
          className="text-xs font-medium uppercase tracking-[0.25em] text-sky-400/70"
          style={{ fontFamily: 'Space Grotesk' }}
        >
          Open Source Community
        </span>
        <motion.span
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          className="select-none text-xs leading-none text-violet-400"
        >
          ✦
        </motion.span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-violet-400/50" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-4 max-w-5xl text-5xl font-bold leading-[1.04] tracking-tight md:text-7xl lg:text-8xl"
        style={{ fontFamily: 'Space Grotesk' }}
      >
        <span className="text-white">That Sky</span>
        <br />
        <span className="shimmer bg-gradient-to-r from-sky-400 via-violet-400 to-sky-400 bg-[length:200%] bg-clip-text text-transparent">
          Project
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.7 }}
        className="mb-4 h-9 text-xl text-slate-400 md:text-2xl"
      >
        A community of{' '}
        <TypewriterText texts={['developers', 'creators', 'researchers', 'players', 'explorers']} />
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.7 }}
        className="mb-10 max-w-2xl text-base leading-relaxed text-slate-500 md:text-lg"
      >
        Brought together by a shared passion for Sky: Children of the Light, we turn research,
        experiments, and open-source tools into something the wider community can actually use.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.7 }}
        className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
      >
        <motion.a
          href="#projects"
          className="group relative flex items-center gap-2 pb-1 text-sm text-white/88 transition-colors hover:text-white"
          style={{ fontFamily: 'Space Grotesk' }}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <GitBranch size={16} />
          View Projects
          <span className="text-slate-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate-300">
            →
          </span>
          <span className="absolute bottom-0 left-0 h-px w-full bg-sky-400/70" />
        </motion.a>

        <motion.a
          href="#"
          onClick={handleJoinUs}
          className="group relative flex items-center gap-2 pb-1 text-sm text-slate-400 transition-colors hover:text-white"
          style={{ fontFamily: 'Space Grotesk' }}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          Join Us
          <span className="absolute bottom-0 left-0 h-px w-0 bg-white/70 transition-all duration-300 group-hover:w-full" />
        </motion.a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-slate-600"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  )
}
