import { useState, useEffect } from 'react'

export function useGitHubRepos(org) {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchRepos() {
      try {
        const res = await fetch(
          `https://api.github.com/orgs/${org}/repos?sort=updated&per_page=50`
        )
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setRepos(data.filter(r => !r.fork && !r.archived))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchRepos()
  }, [org])

  return { repos, loading, error }
}
