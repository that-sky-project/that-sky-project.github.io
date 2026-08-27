import { useMemo, useState } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, GitFork, Search, Star } from 'lucide-react'
import { useGitHubRepos } from '../hooks/useGitHubRepos'

const PAGE_SIZE = 7
const SORTERS = {
  updated: (a, b) => new Date(b.pushed_at) - new Date(a.pushed_at),
  stars: (a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0),
  name: (a, b) => a.name.localeCompare(b.name),
}

function FeaturedProject({ repo }) {
  return (
    <article className="featured-project">
      <div className="featured-topline">
        <span>Recently updated</span>
        <a href={repo.html_url} target="_blank" rel="noreferrer" aria-label={`Open ${repo.name}`}>
          <ArrowUpRight size={20} />
        </a>
      </div>
      <div className="featured-copy">
        <span className="repo-language">{repo.language || 'Open source'}</span>
        <h3>{repo.name}</h3>
        <p>{repo.description || 'No description provided.'}</p>
      </div>
      <div className="repo-stats">
        <span><Star size={13} /> {repo.stargazers_count || 0}</span>
        <span><GitFork size={13} /> {repo.forks_count || 0}</span>
      </div>
    </article>
  )
}

function ProjectRow({ repo }) {
  return (
    <article className="project-row">
      <div className="project-row-main">
        <span className="repo-language">{repo.language || 'Open source'}</span>
        <h3>{repo.name}</h3>
        <p>{repo.description || 'No description provided.'}</p>
      </div>
      <div className="repo-stats">
        <span><Star size={12} /> {repo.stargazers_count || 0}</span>
        <span><GitFork size={12} /> {repo.forks_count || 0}</span>
      </div>
      <a href={repo.html_url} target="_blank" rel="noreferrer" aria-label={`Open ${repo.name}`}>
        <ArrowUpRight size={17} />
      </a>
    </article>
  )
}

export default function Projects() {
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
          <div className="section-intro">
            <p className="section-kicker">Projects</p>
            <h2>Ancestor<br />Spirits</h2>
          </div>
          <p>
            A living archive of experiments, tools, and code. Each repository is surfaced
            immediately, with a calmer interface that keeps the work readable and within reach.
          </p>
        </div>

        <div className="project-controls">
          <label>
            <Search size={16} />
            <input
              value={query}
              onChange={event => updateFilter(setQuery)(event.target.value)}
              placeholder="Search repositories"
              aria-label="Search repositories"
            />
          </label>
          <div className="language-filter">
            {languages.map(item => (
              <button
                className={language === item ? 'active' : ''}
                onClick={() => updateFilter(setLanguage)(item)}
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={event => updateFilter(setSort)(event.target.value)}
            aria-label="Sort repositories"
          >
            <option value="updated">Updated</option>
            <option value="stars">Stars</option>
            <option value="name">Name</option>
          </select>
        </div>

        {loading && <div className="project-state">Loading repositories...</div>}
        {error && !repos.length && <div className="project-state">Failed to load repositories.</div>}
        {!loading && !error && !visible.length && <div className="project-state">No projects found.</div>}

        {featured && (
          <div className="project-directory">
            <FeaturedProject repo={featured} />
            <div className="project-list">
              {remaining.map(repo => <ProjectRow key={repo.id} repo={repo} />)}
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
              <ChevronLeft size={16} /> Previous
            </button>
            <span>{currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
