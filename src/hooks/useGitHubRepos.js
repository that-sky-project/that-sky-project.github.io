import { useState, useEffect, startTransition } from 'react'

const CACHE_VERSION = 1
const CACHE_KEY_PREFIX = 'github-repos-cache'

function fnv1a32(value) {
  let hash = 0x811c9dc5

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }

  return (hash >>> 0).toString()
}

function getCacheKey(org) {
  return `${CACHE_KEY_PREFIX}:${org}`
}

function createRepoSignaturePayload(repos) {
  return repos
    .map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description || '',
      language: repo.language || '',
      stargazers_count: repo.stargazers_count || 0,
      forks_count: repo.forks_count || 0,
      pushed_at: repo.pushed_at || '',
      owner: repo.owner?.login || '',
      topics: [...(repo.topics || [])].sort(),
    }))
    .sort((a, b) => a.id - b.id)
}

function createReposSignature(repos) {
  return fnv1a32(JSON.stringify(createRepoSignaturePayload(repos)))
}

function readReposCache(org) {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(getCacheKey(org))
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (
      parsed?.version !== CACHE_VERSION ||
      !Array.isArray(parsed.repos) ||
      typeof parsed.signature !== 'string'
    ) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

function scheduleCacheWrite(callback) {
  if (typeof window === 'undefined') return

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(() => {
      callback()
    })
    return
  }

  window.setTimeout(() => {
    callback()
  }, 0)
}

function syncReposCache(org, repos) {
  if (typeof window === 'undefined') return

  const signature = createReposSignature(repos)
  const cached = readReposCache(org)

  if (cached?.signature === signature) return

  scheduleCacheWrite(() => {
    try {
      window.localStorage.setItem(
        getCacheKey(org),
        JSON.stringify({
          version: CACHE_VERSION,
          signature,
          repos,
          updatedAt: Date.now(),
        })
      )
    } catch {
      // Ignore storage quota and privacy mode failures.
    }
  })
}

function normalizeRepos(data) {
  return data.filter(repo => !repo.fork && !repo.archived)
}

export function useGitHubRepos(org) {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const cached = readReposCache(org)

    if (cached?.repos?.length) {
      setRepos(cached.repos)
      setLoading(false)
    } else {
      setLoading(true)
    }

    async function fetchRepos() {
      setError(null)

      try {
        const res = await fetch(
          `https://api.github.com/orgs/${org}/repos?sort=updated&per_page=50`,
          { signal: controller.signal }
        )

        if (!res.ok) {
          throw new Error(`Failed to fetch repos: ${res.status}`)
        }

        const data = await res.json()
        const nextRepos = normalizeRepos(data)

        startTransition(() => {
          setRepos(nextRepos)
        })
        syncReposCache(org, nextRepos)
      } catch (err) {
        if (err.name === 'AbortError') return

        if (cached) {
          startTransition(() => {
            setRepos(cached.repos)
          })
          return
        }

        setError(err.message)
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchRepos()

    return () => {
      controller.abort()
    }
  }, [org])

  return { repos, loading, error }
}
