import { useMemo, useState } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, GitFork, Search, Star } from 'lucide-react'
import { useGitHubRepos } from '../hooks/useGitHubRepos'
import { useT } from '../i18n'
import { Reveal, RevealGroup, RevealItem } from './Reveal'

const PAGE_SIZE = 7
const SORTERS = {
  updated: (a, b) => new Date(b.pushed_at) - new Date(a.pushed_at),
  stars: (a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0),
  name: (a, b) => a.name.localeCompare(b.name),
}

function FeaturedProject({ repo, t }) {
  return (
    <Reveal as="article" className="featured-project">
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
    </Reveal>
  )
}

function ProjectRow({ repo, t }) {
  return (
    <RevealItem as="article" className="project-row">
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
    </RevealItem>
  )
}

export default function Projects() {
  const t = useT()
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
            <p className="section-kicker">{t('projects.kicker')}</p>
            <h2>{t('projects.titleLead')}<br />{t('projects.titleAccent')}</h2>
          </Reveal>
          <Reveal as="p" delay={0.1}>{t('projects.intro')}</Reveal>
        </div>

        <Reveal className="project-controls">
          <label>
            <Search size={16} />
            <input
              value={query}
              onChange={event => updateFilter(setQuery)(event.target.value)}
              placeholder={t('projects.searchPlaceholder')}
              aria-label={t('projects.searchLabel')}
            />
          </label>
          <div className="language-filter">
            {languages.map(item => (
              <button
                className={language === item ? 'active' : ''}
                onClick={() => updateFilter(setLanguage)(item)}
                aria-pressed={language === item}
                key={item}
              >
                {item === 'All' ? t('projects.filterAll') : item}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={event => updateFilter(setSort)(event.target.value)}
            aria-label={t('projects.sortLabel')}
          >
            <option value="updated">{t('projects.sort.updated')}</option>
            <option value="stars">{t('projects.sort.stars')}</option>
            <option value="name">{t('projects.sort.name')}</option>
          </select>
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
          <div className="project-directory" key={`${language}-${sort}-${currentPage}`}>
            <FeaturedProject repo={featured} t={t} />
            <RevealGroup className="project-list">
              {remaining.map(repo => <ProjectRow key={repo.id} repo={repo} t={t} />)}
            </RevealGroup>
          </div>
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
