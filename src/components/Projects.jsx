import { memo, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronDown, ChevronLeft, ChevronRight, Clock, GitFork, Search, Star } from 'lucide-react'
import { useGitHubRepos } from '../hooks/useGitHubRepos'

const PAGE_SIZE = 6
const PAGE_WINDOW_SIZE = 5

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

const SORT_OPTIONS = [
  { value: 'updated', label: 'Updated' },
  { value: 'published', label: 'Published' },
  { value: 'stars', label: 'Stars' },
  { value: 'forks', label: 'Forks' },
]

function getRepoDate(repo, key) {
  const value = key === 'published' ? repo.created_at : repo.pushed_at
  const time = Date.parse(value || '')

  return Number.isNaN(time) ? 0 : time
}

function getSortValue(repo, sortKey) {
  if (sortKey === 'stars') return repo.stargazers_count || 0
  if (sortKey === 'forks') return repo.forks_count || 0

  return getRepoDate(repo, sortKey)
}

function getPageWindow(currentPage, totalPages) {
  const halfWindow = Math.floor(PAGE_WINDOW_SIZE / 2)
  let start = Math.max(1, currentPage - halfWindow)
  let end = Math.min(totalPages, start + PAGE_WINDOW_SIZE - 1)

  start = Math.max(1, end - PAGE_WINDOW_SIZE + 1)

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
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

function formatCount(value) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(
    value
  )
}

const RepoCard = memo(function RepoCard({ repo, index }) {
  const color = LANG_COLORS[repo.language] || '#94a3b8'
  const author = repo.owner?.login

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{
        layout: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
        opacity: { delay: index * 0.02, duration: 0.24 },
        y: { delay: index * 0.02, duration: 0.3, ease: [0.16, 1, 0.3, 1] },
      }}
      whileHover={{ y: -2 }}
      className="group relative h-full overflow-hidden rounded-[18px] border border-white/8 bg-[#0d1318]/88 p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.14)] transition-colors duration-300 hover:border-white/14 hover:bg-[#11181f]/92"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-x-3.5 top-0 h-px opacity-65"
          style={{ background: `linear-gradient(90deg, transparent, ${color}42, transparent)` }}
        />
      </div>

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-[0.14em] text-slate-500">
              <span className="text-slate-300" style={{ fontFamily: 'Space Grotesk' }}>
                {repo.language || 'Unknown'}
              </span>
              <span className="h-3 w-px bg-white/10" />
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                <Clock size={11} />
                {timeSince(repo.pushed_at)}
              </span>
            </div>

            <h3
              className="truncate text-[14px] font-semibold tracking-tight text-slate-50"
              style={{ fontFamily: 'Space Grotesk' }}
            >
              {repo.name}
            </h3>

            {author && <p className="mt-0.5 text-[11px] text-slate-500">by {author}</p>}
          </div>

          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 pb-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 transition-colors duration-300 hover:text-slate-200"
            style={{ fontFamily: 'Space Grotesk' }}
            aria-label={`Open ${repo.name} on GitHub`}
          >
            View
          </a>
        </div>

        <p className="mt-2 line-clamp-2 min-h-[2.4rem] text-[13px] leading-5 text-slate-400">
          {repo.description || 'No description provided.'}
        </p>

        {repo.topics?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {repo.topics.slice(0, 2).map((topic, topicIndex) => (
              <span
                key={`${repo.id}-${topic}-${topicIndex}`}
                className="rounded-full border border-white/8 bg-white/[0.025] px-2 py-0.5 text-[10px] text-slate-400 transition-colors duration-300 group-hover:border-white/12 group-hover:text-slate-300"
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center gap-3 border-t border-white/6 pt-2.5 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <Star size={11} className="text-amber-500" />
            {formatCount(repo.stargazers_count || 0)}
          </span>
          <span className="flex items-center gap-1.5">
            <GitFork size={11} />
            {formatCount(repo.forks_count || 0)}
          </span>
          <span className="ml-auto text-slate-500 transition-colors duration-300 group-hover:text-slate-300">
            GitHub
          </span>
        </div>
      </div>
    </motion.article>
  )
})

export default function Projects() {
  const { repos, loading, error } = useGitHubRepos('that-sky-project')
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('updated')
  const [sortDirection, setSortDirection] = useState('desc')
  const [sortMenuOpen, setSortMenuOpen] = useState(false)
  const [page, setPage] = useState(1)

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
        (repo.topics || []).some(topic => topic.toLowerCase().includes(query))
      )
    }

    return result
  }, [repos, activeFilter, search])

  const sorted = useMemo(() => {
    const direction = sortDirection === 'asc' ? 1 : -1

    return filtered
      .map((repo, index) => ({ repo, index }))
      .sort((a, b) => {
        const valueA = getSortValue(a.repo, sortKey)
        const valueB = getSortValue(b.repo, sortKey)

        if (valueA === valueB) return a.index - b.index

        return (valueA - valueB) * direction
      })
      .map(item => item.repo)
  }, [filtered, sortKey, sortDirection])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const visibleRepos = useMemo(
    () => sorted.slice(pageStart, pageStart + PAGE_SIZE),
    [sorted, pageStart]
  )
  const pageNumbers = useMemo(() => getPageWindow(currentPage, totalPages), [currentPage, totalPages])
  const pageEnd = Math.min(pageStart + visibleRepos.length, sorted.length)
  const activeSort = SORT_OPTIONS.find(option => option.value === sortKey) || SORT_OPTIONS[0]

  return (
    <section id="projects" className="relative py-24 px-6" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
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
            A living archive of experiments, tools, and code. Each repository is surfaced
            immediately, with a calmer interface that keeps the work readable and within reach.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="relative w-full max-w-sm">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={event => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder="Search repositories..."
                className="w-full rounded-full border border-white/8 bg-black/10 py-3 pl-11 pr-4 text-sm text-white transition-colors placeholder:text-slate-600 focus:border-sky-400/30 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-4 lg:items-end">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {languages.map(lang => {
                  const active = activeFilter === lang

                  return (
                    <motion.button
                      key={lang}
                      onClick={() => {
                        setActiveFilter(lang)
                        setPage(1)
                      }}
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

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <motion.button
                    type="button"
                    onClick={() => setSortMenuOpen(open => !open)}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex h-7 items-center gap-1.5 border-b border-white/10 px-1 text-[11px] text-slate-400 transition-colors hover:border-white/20 hover:text-slate-200"
                    style={{ fontFamily: 'Space Grotesk' }}
                    aria-haspopup="menu"
                    aria-expanded={sortMenuOpen}
                  >
                    <span>{activeSort.label}</span>
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${sortMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {sortMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.16 }}
                        className="absolute right-0 top-9 z-20 min-w-32 border border-white/10 bg-[#0b1015]/95 py-1 shadow-[0_10px_30px_rgba(0,0,0,0.26)]"
                        role="menu"
                      >
                        {SORT_OPTIONS.map(option => {
                          const active = option.value === sortKey

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setSortKey(option.value)
                                setSortMenuOpen(false)
                                setPage(1)
                              }}
                              className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-[11px] transition-colors ${
                                active
                                  ? 'text-slate-100'
                                  : 'text-slate-500 hover:bg-white/[0.035] hover:text-slate-300'
                              }`}
                              style={{ fontFamily: 'Space Grotesk' }}
                              role="menuitem"
                            >
                              {option.label}
                              {active && <span className="h-1 w-1 rounded-full bg-sky-300/80" />}
                            </button>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  type="button"
                  onClick={() => {
                    setSortDirection(direction => (direction === 'desc' ? 'asc' : 'desc'))
                    setPage(1)
                  }}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-7 border-b border-white/10 px-1 text-sm leading-none text-slate-400 transition-colors hover:border-white/20 hover:text-slate-200"
                  style={{ fontFamily: 'Space Grotesk' }}
                  aria-label={`Sort ${sortDirection === 'desc' ? 'descending' : 'ascending'}`}
                >
                  {sortDirection === 'desc' ? '↓' : '↑'}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {!loading && (
          <p className="mb-6 text-xs uppercase tracking-[0.2em] text-slate-600">
            {sorted.length} {sorted.length === 1 ? 'spirit' : 'spirits'}
            {activeFilter !== 'All' ? ` / ${activeFilter}` : ''}
            {sorted.length > 0 ? ` / ${pageStart + 1}-${pageEnd}` : ''}
          </p>
        )}

        {loading && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-36 rounded-[18px] border border-white/6 bg-white/[0.025] animate-pulse"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="py-16 text-center text-sm text-slate-600">Failed to load spirits.</div>
        )}

        {!loading && !error && (
          <>
            <motion.div layout className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {visibleRepos.map((repo, index) => (
                  <RepoCard key={repo.id} repo={repo} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>

            {sorted.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center text-sm text-slate-600"
              >
                No spirits found.
              </motion.div>
            )}

            {sorted.length > PAGE_SIZE && (
              <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Repository pages">
                <motion.button
                  type="button"
                  onClick={() => setPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  whileHover={currentPage === 1 ? undefined : { y: -1 }}
                  whileTap={currentPage === 1 ? undefined : { scale: 0.98 }}
                  className="flex h-7 w-7 items-center justify-center text-slate-500 transition-colors hover:text-slate-200 disabled:pointer-events-none disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={14} />
                </motion.button>

                {pageNumbers.map(pageNumber => {
                  const active = pageNumber === currentPage

                  return (
                    <motion.button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className={`h-7 min-w-7 border-b px-1.5 text-[11px] transition-colors ${
                        active
                          ? 'border-sky-300/70 text-white'
                          : 'border-transparent text-slate-500 hover:border-white/14 hover:text-slate-200'
                      }`}
                      style={{ fontFamily: 'Space Grotesk' }}
                      aria-label={`Page ${pageNumber}`}
                      aria-current={active ? 'page' : undefined}
                    >
                      {pageNumber}
                    </motion.button>
                  )
                })}

                <motion.button
                  type="button"
                  onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  whileHover={currentPage === totalPages ? undefined : { y: -1 }}
                  whileTap={currentPage === totalPages ? undefined : { scale: 0.98 }}
                  className="flex h-7 w-7 items-center justify-center text-slate-500 transition-colors hover:text-slate-200 disabled:pointer-events-none disabled:opacity-30"
                  aria-label="Next page"
                >
                  <ChevronRight size={14} />
                </motion.button>
              </nav>
            )}
          </>
        )}
      </div>
    </section>
  )
}
