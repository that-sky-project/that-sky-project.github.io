import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, GitFork, Search, Star } from 'lucide-react'
import { useGitHubRepos } from '../hooks/useGitHubRepos'
import { useT } from '../i18n'
import { Reveal } from './Reveal'

const PAGE_SIZE = 7
const EASE = [0.22, 0.61, 0.36, 1]
const SORTERS = {
  updated: (a, b) => new Date(b.pushed_at) - new Date(a.pushed_at),
  stars: (a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0),
  name: (a, b) => a.name.localeCompare(b.name),
}

function SortSelect({ value, onChange, options, label }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!open) return

    function onOutside(e) {
      const isClickInTrigger = ref.current && ref.current.contains(e.target)
      const isClickInDropdown = dropdownRef.current && dropdownRef.current.contains(e.target)
      if (!isClickInTrigger && !isClickInDropdown) {
        setOpen(false)
      }
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onOutside)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const current = options.find(o => o.value === value)

  return (
    <div className="sort-select" ref={ref}>
      <button
        className="sort-trigger"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
      >
        {current?.label}
        <ChevronDown size={12} className={open ? 'sort-chevron open' : 'sort-chevron'} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={dropdownRef}
            className="sort-dropdown"
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97, transition: { duration: 0.16, ease: 'easeIn' } }}
            transition={{ duration: 0.24, ease: EASE }}
            style={{ transformOrigin: 'top right' }}
          >
            {options.map(opt => (
              <button
                key={opt.value}
                className={`sort-option${opt.value === value ? ' active' : ''}`}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FeaturedProject({ repo, t }) {
  return (
    <article className="featured-project">
      <div className="featured-topline">
        <span>{t('projects.recentlyUpdated')}</span>
        <a href={repo.html_url} target="_blank" rel="noreferrer" aria-label={t('projects.openRepo', { name: repo.name })}>
          <ArrowUpRight size={20} />
        </a>
      </div>
      <div className="featured-copy">
        <span className="repo-language">{repo.language || t('projects.fallbackLanguage')}</span>
        <h3>{repo.name}</h3>
        <p>{repo.description || t('projects.noDescription')}</p>
      </div>
      <div className="repo-stats">
        <span><Star size={13} /> {repo.stargazers_count || 0}</span>
        <span><GitFork size={13} /> {repo.forks_count || 0}</span>
      </div>
    </article>
  )
}

function ProjectRow({ repo, t }) {
  return (
    <article className="project-row">
      <div className="project-row-main">
        <span className="repo-language">{repo.language || t('projects.fallbackLanguage')}</span>
        <h3>{repo.name}</h3>
        <p>{repo.description || t('projects.noDescription')}</p>
      </div>
      <div className="repo-stats">
        <span><Star size={12} /> {repo.stargazers_count || 0}</span>
        <span><GitFork size={12} /> {repo.forks_count || 0}</span>
      </div>
      <a href={repo.html_url} target="_blank" rel="noreferrer" aria-label={t('projects.openRepo', { name: repo.name })}>
        <ArrowUpRight size={17} />
      </a>
    </article>
  )
}

export default function Projects() {
  const t = useT()
  const reduce = useReducedMotion()
  const { repos, loading, error } = useGitHubRepos('that-sky-project')
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState('All')
  const [sort, setSort] = useState('updated')
  const [page, setPage] = useState(1)

  const languages = useMemo(
    () => ['All', ...new Set(repos.map(repo => repo.language).filter(Boolean))],
    [repos]
  )

  const filtered = useMemo(
    () => repos
      .filter(repo => {
        const matchesLanguage = language === 'All' || repo.language === language
        const searchable = [repo.name, repo.description, ...(repo.topics || [])].join(' ').toLowerCase()
        return matchesLanguage && searchable.includes(query.toLowerCase())
      })
      .sort(SORTERS[sort]),
    [repos, language, query, sort]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const featured = visible[0]
  const remaining = visible.slice(1)
  const updateFilter = setter => value => {
    setter(value)
    setPage(1)
  }

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <div className="projects-header">
          <Reveal className="section-intro">
            <div className="section-index">
              <span className="index-num">04</span>
              <span className="index-label">{t('projects.kicker')}</span>
            </div>
            <h2>{t('projects.titleLead')} {t('projects.titleAccent')}</h2>
          </Reveal>
          <Reveal as="p" delay={0.1}>{t('projects.intro')}</Reveal>
        </div>

        <Reveal className="project-controls" delay={0.05}>
          <label>
            <Search size={16} />
            <input
              value={query}
              onChange={event => {
                const value = event.target.value
                setQuery(value)
                setPage(1)
              }}
              placeholder={t('projects.searchPlaceholder')}
              aria-label={t('projects.searchLabel')}
            />
          </label>
          <LayoutGroup>
            <div className="language-filter">
              {languages.map(item => (
                <button
                  className={language === item ? 'active' : ''}
                  onClick={() => updateFilter(setLanguage)(item)}
                  aria-pressed={language === item}
                  key={item}
                >
                  {item === 'All' ? t('projects.filterAll') : item}
                  {language === item && (
                    <motion.span
                      layoutId="lang-underline"
                      className="lang-underline"
                      transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </LayoutGroup>
          <SortSelect
            value={sort}
            onChange={updateFilter(setSort)}
            label={t('projects.sortLabel')}
            options={[
              { value: 'updated', label: t('projects.sort.updated') },
              { value: 'stars',   label: t('projects.sort.stars') },
              { value: 'name',    label: t('projects.sort.name') },
            ]}
          />
        </Reveal>

        {loading && (
          <>
            <div className="project-skeleton" aria-hidden="true">
              {Array.from({ length: 4 }).map((_, index) => <span key={index} className="skeleton-row" />)}
            </div>
            <span className="visually-hidden" role="status">{t('projects.state.loading')}</span>
          </>
        )}
        {error && !repos.length && <div className="project-state">{t(`projects.state.${error}`)}</div>}
        {!loading && !error && !visible.length && <div className="project-state">{t('projects.state.empty')}</div>}

        {featured && (
          <Reveal className="project-directory" delay={0.05}>
            {/* 翻页 / 筛选切换：整组快速淡入淡出，替代逐行重播的拖沓感 */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${language}-${sort}-${currentPage}`}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: EASE }}
              >
                <div className="project-directory-inner">
                  <FeaturedProject repo={featured} t={t} />
                  <div className="project-list">
                    {remaining.map(repo => <ProjectRow key={repo.id} repo={repo} t={t} />)}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </Reveal>
        )}

        {totalPages > 1 && (
          <div className="pagination" aria-live="polite">
            <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
              <ChevronLeft size={16} /> {t('projects.pagination.previous')}
            </button>
            <span>{t('projects.pagination.status', { current: currentPage, total: totalPages })}</span>
            <button disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>
              {t('projects.pagination.next')} <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
