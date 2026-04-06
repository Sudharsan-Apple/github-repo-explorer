import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

const buildHeaders = () => ({
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
})

const fetchGitHubRepos = async ({ queryKey }) => {
  const [, params] = queryKey
  const { query, topic, sort, order, page, perPage } = params

  const q = topic ? `topic:${topic}` : query
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=${sort}&order=${order}&per_page=${perPage}&page=${page}`

  const res = await fetch(url, { headers: buildHeaders() })

  const rateLimitRemaining = Number(res.headers.get('X-RateLimit-Remaining'))
  const rateLimitLimit = Number(res.headers.get('X-RateLimit-Limit'))

  if (res.status === 403 || res.status === 429) {
    const retryHeader = res.headers.get('Retry-After') || res.headers.get('X-RateLimit-Reset')
    let retryAfter = 60

    if (retryHeader) {
      const resetTime = parseInt(retryHeader, 10)
      if (resetTime > 1000000000) {
        retryAfter = Math.max(0, resetTime - Math.floor(Date.now() / 1000))
      } else {
        retryAfter = resetTime
      }
    }

    const error = new Error('GitHub API rate limit reached')
    error.code = 'RATE_LIMITED'
    error.retryAfter = retryAfter
    error.rateLimitRemaining = Number.isNaN(rateLimitRemaining) ? null : rateLimitRemaining
    error.rateLimitLimit = Number.isNaN(rateLimitLimit) ? null : rateLimitLimit
    throw error
  }

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}))
    const error = new Error(errData.message || `GitHub API error: ${res.status}`)
    error.rateLimitRemaining = Number.isNaN(rateLimitRemaining) ? null : rateLimitRemaining
    error.rateLimitLimit = Number.isNaN(rateLimitLimit) ? null : rateLimitLimit
    throw error
  }

  const data = await res.json()

  return {
    repos: data.items ?? [],
    totalCount: data.total_count ?? 0,
    rateLimitRemaining: Number.isNaN(rateLimitRemaining) ? null : rateLimitRemaining,
    rateLimitLimit: Number.isNaN(rateLimitLimit) ? null : rateLimitLimit,
  }
}

export const useGitHubSearch = () => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    topic: '',
    sort: 'stars',
    order: 'desc',
    page: 1,
    perPage: 100,
  })

  const enabled = Boolean(searchParams.query || searchParams.topic)

  const queryKey = useMemo(
    () => [
      'github-repos',
      {
        query: searchParams.query || '',
        topic: searchParams.topic || '',
        sort: searchParams.sort,
        order: searchParams.order,
        page: searchParams.page,
        perPage: searchParams.perPage,
      },
    ],
    [searchParams],
  )

  const queryResult = useQuery({
    queryKey,
    queryFn: fetchGitHubRepos,
    enabled,
    placeholderData: (prev) => prev,
  })

  const search = (params) => {
    setSearchParams((prev) => ({ ...prev, ...params }))
  }

  const error = queryResult.error || null
  const rateLimited = error?.code === 'RATE_LIMITED'

  return {
    repos: queryResult.data?.repos ?? [],
    totalCount: queryResult.data?.totalCount ?? 0,
    loading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    isStale: queryResult.isStale,
    error: rateLimited ? null : error?.message ?? null,
    rateLimited,
    retryAfter: error?.retryAfter ?? 0,
    rateLimitRemaining: queryResult.data?.rateLimitRemaining ?? error?.rateLimitRemaining ?? null,
    rateLimitLimit: queryResult.data?.rateLimitLimit ?? error?.rateLimitLimit ?? null,
    search,
  }
}
