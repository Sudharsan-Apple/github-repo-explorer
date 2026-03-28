import { useState, useCallback, useRef } from 'react'

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN

const buildHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`
  }
  return headers
}

export const useGitHubSearch = () => {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [rateLimited, setRateLimited] = useState(false)
  const [retryAfter, setRetryAfter] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const abortRef = useRef(null)

  const search = useCallback(async ({ query, topic, sort = 'stars', order = 'desc', page = 1, perPage = 100 }) => {
    // Cancel previous request
    if (abortRef.current) {
      abortRef.current.abort()
    }
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)
    setRateLimited(false)

    let q = ''
    if (topic) {
      q = `topic:${topic}`
    } else if (query) {
      q = query
    } else {
      setLoading(false)
      return
    }

    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=${sort}&order=${order}&per_page=${perPage}&page=${page}`

    try {
      const res = await fetch(url, {
        headers: buildHeaders(),
        signal: controller.signal,
      })

      if (res.status === 403 || res.status === 429) {
        const retryHeader = res.headers.get('Retry-After') || res.headers.get('X-RateLimit-Reset')
        let waitSeconds = 60
        if (retryHeader) {
          const resetTime = parseInt(retryHeader, 10)
          if (resetTime > 1000000000) {
            // Unix timestamp
            waitSeconds = Math.max(0, resetTime - Math.floor(Date.now() / 1000))
          } else {
            waitSeconds = resetTime
          }
        }
        setRateLimited(true)
        setRetryAfter(waitSeconds)
        setLoading(false)
        return
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || `GitHub API error: ${res.status}`)
      }

      const data = await res.json()
      setTotalCount(data.total_count ?? 0)
      setRepos(data.items ?? [])
    } catch (err) {
      if (err.name === 'AbortError') return
      setError(err.message)
      setRepos([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { repos, loading, error, rateLimited, retryAfter, totalCount, search }
}
