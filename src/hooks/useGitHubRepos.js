import { useState, useEffect, startTransition } from 'react'

const CACHE_VERSION = 3
const CACHE_KEY_PREFIX = 'github-repos-cache'
const reposRequests = new Map()

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

function removeReposCache(org) {
  try {
    window.localStorage.removeItem(getCacheKey(org))
  } catch {
    // Ignore storage privacy mode failures.
  }
}

function createReposSignature(repos) {
  return fnv1a32(JSON.stringify(repos))
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
      removeReposCache(org)
      return null
    }

    return parsed
  } catch {
    removeReposCache(org)
    return null
  }
}

function syncReposCache(org, repos) {
  if (typeof window === 'undefined') return

  const signature = createReposSignature(repos)

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
}

function normalizeRepos(data) {
  //return data.filter(repo => !repo.fork && !repo.archived)
  return Array.isArray(data) ? data : []
}

function fetchReposForOrg(org) {
  if (reposRequests.has(org)) return reposRequests.get(org)

  const request = fetch(`https://api.github.com/orgs/${org}/repos?sort=updated&per_page=50`)
    .then(res => {
      if (!res.ok) {
        const error = new Error(`Failed to fetch repos: ${res.status}`)
        error.status = res.status
        throw error
      }

      return res.json()
    })
    .then(data => {
      const nextRepos = normalizeRepos(data)

      syncReposCache(org, nextRepos)

      return nextRepos
    })
    .finally(() => {
      reposRequests.delete(org)
    })

  reposRequests.set(org, request)

  return request
}

export function useGitHubRepos(org) {
  const [repos, setRepos] = useState(() => readReposCache(org)?.repos || [])
  const [loading, setLoading] = useState(() => !readReposCache(org)?.repos?.length)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    const cached = readReposCache(org)

    async function fetchRepos() {
      setError(null)

      try {
        const nextRepos = await fetchReposForOrg(org)

        if (!active) return
        startTransition(() => {
          setRepos(nextRepos)
        })
      } catch (err) {
        if (!active) return

        if (cached) {
          startTransition(() => {
            setRepos(cached.repos)
          })
          return
        }

        setError(err.status === 403 ? 'rateLimited' : 'error')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchRepos()

    return () => {
      active = false
    }
  }, [org])

  return { repos, loading, error }
}
