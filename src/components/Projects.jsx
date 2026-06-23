import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, GitFork, ExternalLink, Clock, Search, Flame } from 'lucide-react'
import { useGitHubRepos } from '../hooks/useGitHubRepos'
import { SectionLabel } from './SectionLabel'

const LANG_COLORS = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3572a5',
  Rust: '#dea584',
  Go: '#00add8',
  Java: '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
}

function timeSince(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - d) / 1000)

  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`
  return `${Math.floor(diff / 31536000)}y ago`
}

function spiritColor(lang) {
  const map = {
    TypeScript: ['rgba(125,211,252,', 'rgba(99,179,237,'],
    JavaScript: ['rgba(251,191,36,', 'rgba(245,158,11,'],
    Python: ['rgba(52,211,153,', 'rgba(16,185,129,'],
    Rust: ['rgba(222,165,132,', 'rgba(194,120,80,'],
    Go: ['rgba(0,173,216,', 'rgba(0,140,180,'],
    CSS: ['rgba(167,139,250,', 'rgba(139,92,246,'],
    HTML: ['rgba(251,113,133,', 'rgba(244,63,94,'],
  }

  return map[lang] || ['rgba(180,220,255,', 'rgba(147,197,253,']
}

function BeamPortal({ x, y, sc1, sc2 }) {
  return createPortal(
    <div
      className="fixed pointer-events-none"
      style={{ left: x, top: y, zIndex: 9999, transform: 'translateX(-50%)' }}
    >
      <motion.div
        className="absolute"
        style={{
          borderRadius: '50%',
          background: `radial-gradient(circle, ${sc1}0.6), transparent 70%)`,
          left: '50%',
          top: 0,
        }}
        initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0.9 }}
        animate={{ width: 100, height: 100, x: -50, y: -50, opacity: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
      />
      <motion.div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 0,
          transform: 'translateX(-50%)',
          width: 5,
          height: 180,
          borderRadius: 3,
          transformOrigin: 'bottom center',
          background: `linear-gradient(to top, ${sc1}1), ${sc1}0.65), ${sc2}0.2), transparent)`,
          boxShadow: `0 0 18px 6px ${sc1}0.3)`,
        }}
        initial={{ scaleY: 0, opacity: 1 }}
        animate={{ scaleY: 16, opacity: 0 }}
        transition={{ duration: 1, ease: [0.06, 0.88, 0.22, 1] }}
      />
    </div>,
    document.body
  )
}

function RepoCard({ repo, index, onRegister, onUnregister }) {
  const [awakened, setAwakened] = useState(false)
  const [beamOrigin, setBeamOrigin] = useState(null)
  const cardRef = useRef(null)
  const awakenedRef = useRef(false)
  const color = LANG_COLORS[repo.language] || '#94a3b8'
  const [sc1, sc2] = spiritColor(repo.language)

  function spawnBeam() {
    if (awakenedRef.current) return
    awakenedRef.current = true

    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setBeamOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    }

    setTimeout(() => {
      setBeamOrigin(null)
      setAwakened(true)
    }, 950)
  }

  const spawnRef = useRef(spawnBeam)
  spawnRef.current = spawnBeam

  useEffect(() => {
    onRegister?.(() => spawnRef.current())
    return () => onUnregister?.()
  }, [onRegister, onUnregister])

  function touch() {
    if (awakened || beamOrigin) return
    spawnBeam()
  }

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ delay: index * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {beamOrigin && <BeamPortal x={beamOrigin.x} y={beamOrigin.y} sc1={sc1} sc2={sc2} />}

      <motion.div
        onClick={!awakened ? touch : undefined}
        className="group relative overflow-hidden rounded-2xl border-b border-white/8 bg-white/[0.02] select-none"
        style={{
          cursor: awakened ? 'default' : 'pointer',
          background: awakened ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.015)',
          borderColor: awakened ? `${sc1}0.14)` : 'rgba(255,255,255,0.05)',
          transition: 'border-color 0.5s, background 0.5s',
        }}
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-6 right-6 top-0 h-px transition-opacity duration-500"
            style={{
              background: `linear-gradient(90deg, transparent, ${sc1}0.7), transparent)`,
              opacity: awakened ? 1 : 0.35,
            }}
          />
        </div>

        <div className="relative p-5 md:px-6">
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <h3
                    className="truncate text-base font-semibold text-white"
                    style={{ fontFamily: 'Space Grotesk' }}
                  >
                    {repo.name}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                      {repo.language || 'Unknown'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {timeSince(repo.pushed_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span>{awakened ? 'Open on GitHub' : 'Tap to expand'}</span>
                  {awakened ? (
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={event => event.stopPropagation()}
                      className="transition-colors hover:text-white"
                    >
                      <ExternalLink size={13} />
                    </a>
                  ) : (
                    <motion.div
                      animate={{ rotate: awakened ? 45 : 0 }}
                      transition={{ duration: 0.35 }}
                      className="text-slate-400"
                    >
                      +
                    </motion.div>
                  )}
                </div>
              </div>

              <AnimatePresence initial={false}>
                {awakened && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4">
                      <p className="max-w-3xl text-sm leading-relaxed text-slate-400">
                        {repo.description || 'No description provided.'}
                      </p>

                      {repo.topics?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {repo.topics.slice(0, 5).map(topic => (
                            <span
                              key={topic}
                              className="rounded-full border border-white/8 px-2.5 py-1 text-[10px] text-slate-400"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/8 pt-4 text-[11px] text-slate-500">
                        {repo.stargazers_count > 0 && (
                          <span className="flex items-center gap-1.5">
                            <Star size={12} className="text-amber-400" />
                            {repo.stargazers_count} stars
                          </span>
                        )}
                        {repo.forks_count > 0 && (
                          <span className="flex items-center gap-1.5">
                            <GitFork size={12} />
                            {repo.forks_count} forks
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const { repos, loading, error } = useGitHubRepos('that-sky-project')
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [ignitingAll, setIgnitingAll] = useState(false)
  const awakenMap = useRef(new Map())

  const languages = useMemo(() => {
    const langs = repos.map(repo => repo.language).filter(Boolean)
    return ['All', ...Array.from(new Set(langs)).sort()]
  }, [repos])

  const filtered = useMemo(() => {
    let result = repos

    if (activeFilter !== 'All') {
      result = result.filter(repo => repo.language === activeFilter)
    }

    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter(repo =>
        repo.name.toLowerCase().includes(query) ||
        (repo.description || '').toLowerCase().includes(query) ||
        (repo.topics || []).some(topic => topic.includes(query))
      )
    }

    return result
  }, [repos, activeFilter, search])

  function igniteAll() {
    if (ignitingAll) return

    setIgnitingAll(true)
    const fns = Array.from(awakenMap.current.values())
    fns.forEach((fn, index) => {
      setTimeout(fn, index * 120)
    })
    setTimeout(() => setIgnitingAll(false), fns.length * 120 + 1200)
  }

  return (
    <section id="projects" className="relative py-24 px-6" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel align="start">Open Source</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl"
              style={{ fontFamily: 'Space Grotesk' }}
            >
              Ancestor Spirits
            </motion.h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-md text-sm leading-relaxed text-slate-400 md:justify-self-end md:text-base"
          >
            A living archive of experiments, tools, and code. Touch each spirit to awaken its
            memory and step through the work behind it.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mb-8 flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative w-full max-w-xs">
            <Search size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search spirits..."
              className="w-full border-b border-white/8 bg-transparent py-2 pl-7 pr-2 text-sm text-white transition-colors placeholder:text-slate-700 focus:border-sky-400/30 focus:outline-none"
            />
          </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {languages.map(lang => {
                const active = activeFilter === lang

                return (
                  <motion.button
                    key={lang}
                    onClick={() => setActiveFilter(lang)}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center gap-1.5 pb-1 text-xs transition-colors ${
                      active ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    style={{ fontFamily: 'Space Grotesk' }}
                  >
                    {lang !== 'All' && (
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: LANG_COLORS[lang] || '#94a3b8' }}
                      />
                    )}
                    <span>{lang}</span>
                    <span
                      className={`absolute bottom-0 left-0 h-px transition-all duration-300 ${
                        active ? 'w-full opacity-100' : 'w-0 opacity-0'
                      }`}
                      style={{ background: active ? 'rgba(125,211,252,0.8)' : 'rgba(125,211,252,0)' }}
                    />
                  </motion.button>
                )
              })}
            </div>
          </div>

          {!loading && filtered.length > 0 && (
            <motion.button
              onClick={igniteAll}
              disabled={ignitingAll}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] transition-colors"
              style={{
                background: 'transparent',
                borderColor: ignitingAll ? 'rgba(255,200,80,0.12)' : 'rgba(255,200,80,0.22)',
                color: ignitingAll ? 'rgba(255,200,80,0.4)' : 'rgba(255,220,120,0.88)',
                cursor: ignitingAll ? 'default' : 'pointer',
              }}
            >
              <Flame size={11} />
              <span style={{ fontFamily: 'Space Grotesk' }}>
                {ignitingAll ? 'Awakening...' : 'Awaken All'}
              </span>
            </motion.button>
          )}
        </motion.div>

        {!loading && (
          <p className="mb-6 text-xs uppercase tracking-[0.2em] text-slate-600">
            {filtered.length} {filtered.length === 1 ? 'spirit' : 'spirits'}
            {activeFilter !== 'All' ? ` / ${activeFilter}` : ''}
          </p>
        )}

        {loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-36 rounded-2xl border border-white/5 bg-white/[0.02] p-5 animate-pulse"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="py-16 text-center text-sm text-slate-600">Failed to load spirits.</div>
        )}

        {!loading && !error && (
          <LayoutGroup>
            <motion.div className="flex flex-col divide-y divide-white/6 rounded-2xl border border-white/6 bg-white/[0.015]" layout>
              <AnimatePresence mode="popLayout">
                {filtered.map((repo, index) => (
                  <RepoCard
                    key={repo.id}
                    repo={repo}
                    index={index}
                    onRegister={fn => awakenMap.current.set(repo.id, fn)}
                    onUnregister={() => awakenMap.current.delete(repo.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center text-sm text-slate-600"
              >
                No spirits found.
              </motion.div>
            )}
          </LayoutGroup>
        )}
      </div>
    </section>
  )
}
