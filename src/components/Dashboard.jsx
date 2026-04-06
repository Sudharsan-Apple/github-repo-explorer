import React, { useState, useEffect, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Github, Sun, Moon, AlertCircle, RefreshCw, ArrowUp, GitCompare } from 'lucide-react'
import FilterBar from './FilterBar'
import SearchBar from './SearchBar'
import RepoCard from './RepoCard'
import RepoDetailModal from './RepoDetailModal'
import CompareModal from './CompareModal'
import StatsPanel from './StatsPanel'
import { LanguagePie, TopStarsBar, TopicComparisonBar } from './Charts'
import Pagination from './Pagination'
import { useGitHubSearch } from '../hooks/useGitHubSearch'
import { ITEMS_PER_PAGE } from '../utils/categories'

const FAVORITES_KEY = 'github-explorer-favorites'

const Dashboard = ({ darkMode, onToggleDark }) => {
  const [activeChip, setActiveChip] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sort, setSort] = useState('stars')
  const [page, setPage] = useState(1)
  const [selectedRepo, setSelectedRepo] = useState(null)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [compareIds, setCompareIds] = useState([])
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [favorites, setFavorites] = useState(() => {
    const raw = localStorage.getItem(FAVORITES_KEY)
    return raw ? JSON.parse(raw) : {}
  })

  const queryClient = useQueryClient()

  const {
    repos,
    loading,
    isFetching,
    isStale,
    error,
    rateLimited,
    retryAfter,
    totalCount,
    rateLimitRemaining,
    rateLimitLimit,
    search,
  } = useGitHubSearch()

  const triggerSearch = (chip, query, sortBy, targetPage = 1) => {
    if (!chip && !query) return
    const isNameSort = sortBy === 'name'
    search({
      topic: chip || '',
      query: query || '',
      sort: isNameSort ? 'stars' : sortBy,
      order: 'desc',
      perPage: 100,
      page: targetPage,
    })
    setPage(targetPage)
  }

  const handleChipClick = (topic) => {
    setFavoritesOnly(false)
    setActiveChip(topic)
    setSearchQuery('')
    if (topic) triggerSearch(topic, '', sort)
  }

  const handleSearch = (q) => {
    setFavoritesOnly(false)
    setSearchQuery(q)
    setActiveChip(null)
    if (q) triggerSearch(null, q, sort)
  }

  const handleSortChange = (newSort) => {
    setSort(newSort)
    if (activeChip || searchQuery) {
      triggerSearch(activeChip, searchQuery, newSort)
    }
  }

  const toggleFavorite = (repo) => {
    setFavorites((prev) => {
      const next = { ...prev }
      if (next[repo.id]) {
        delete next[repo.id]
      } else {
        next[repo.id] = repo
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
      return next
    })
  }

  const filteredRepos = useMemo(() => {
    if (favoritesOnly) {
      return Object.values(favorites)
    }
    return repos
  }, [favoritesOnly, favorites, repos])

  const sortedRepos = useMemo(() => {
    const arr = [...filteredRepos]
    if (sort === 'stars') arr.sort((a, b) => b.stargazers_count - a.stargazers_count)
    else if (sort === 'forks') arr.sort((a, b) => b.forks_count - a.forks_count)
    else if (sort === 'updated') arr.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    else if (sort === 'name') arr.sort((a, b) => a.full_name.localeCompare(b.full_name))
    return arr
  }, [filteredRepos, sort])

  const comparedRepos = useMemo(
    () => sortedRepos.filter((repo) => compareIds.includes(repo.id)),
    [sortedRepos, compareIds],
  )

  const totalPages = Math.ceil(sortedRepos.length / ITEMS_PER_PAGE)
  const pagedRepos = sortedRepos.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const isRateLimitNear = rateLimitRemaining !== null && rateLimitLimit !== null && rateLimitRemaining <= 10
  const cacheIsCached = !isFetching && isStale

  useEffect(() => {
    triggerSearch('openai', '', 'stars')
    setActiveChip('openai')
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 350)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setCompareIds((prev) => prev.filter((id) => sortedRepos.some((repo) => repo.id === id)))
  }, [sortedRepos])

  const toggleCompare = (repo) => {
    setCompareIds((prev) => {
      if (prev.includes(repo.id)) return prev.filter((id) => id !== repo.id)
      if (prev.length >= 3) return prev
      return [...prev, repo.id]
    })
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-slate-800 rounded-lg border border-slate-700">
                <Github size={22} className="text-slate-200" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white leading-tight">GitHub Repo Explorer</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Explore public repositories</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1 justify-center max-w-xl">
              <SearchBar onSearch={handleSearch} loading={loading} />
            </div>

            <button
              onClick={onToggleDark}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 transition-colors"
              title="Toggle dark/light mode"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
          <FilterBar
            activeChip={activeChip}
            onChipClick={handleChipClick}
            sort={sort}
            onSortChange={handleSortChange}
            favoriteCount={Object.keys(favorites).length}
            favoritesOnly={favoritesOnly}
            onToggleFavorites={() => {
              setFavoritesOnly((prev) => !prev)
              setActiveChip(null)
              setSearchQuery('')
              setPage(1)
            }}
            onClearCache={() => queryClient.clear()}
          />

          <div className="flex justify-end">
            <span
              className={`text-xs px-2.5 py-1 rounded-full border ${
                cacheIsCached
                  ? 'text-emerald-300 border-emerald-600/40 bg-emerald-900/20'
                  : 'text-blue-300 border-blue-600/40 bg-blue-900/20'
              }`}
            >
              {cacheIsCached ? '⚡ Cached' : '🔄 Live'}
            </span>
          </div>

          {isRateLimitNear && !rateLimited && (
            <div className="flex items-center gap-3 bg-amber-900/20 border border-amber-700/50 rounded-xl p-4 text-amber-300 text-sm">
              <AlertCircle size={18} />
              <span>
                API rate limit running low: {rateLimitRemaining}/{rateLimitLimit} requests left this hour.
              </span>
            </div>
          )}

          {rateLimited && (
            <div className="flex items-center gap-3 bg-amber-900/20 border border-amber-700/50 rounded-xl p-4 text-amber-400 text-sm">
              <AlertCircle size={18} />
              <span>
                GitHub API rate limit reached. Please wait {retryAfter > 0 ? `~${retryAfter}s` : 'a moment'} before trying again.
              </span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 bg-red-900/20 border border-red-700/50 rounded-xl p-4 text-red-400 text-sm">
              <AlertCircle size={18} />
              <span>Error: {error}</span>
              <button
                onClick={() => triggerSearch(activeChip, searchQuery, sort)}
                className="ml-auto flex items-center gap-1 text-red-300 hover:text-red-200 transition-colors"
              >
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          )}

          {sortedRepos.length > 0 && <StatsPanel repos={sortedRepos} totalCount={favoritesOnly ? sortedRepos.length : totalCount} />}

          {sortedRepos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LanguagePie repos={sortedRepos} />
              <TopStarsBar repos={sortedRepos} />
              <TopicComparisonBar repos={sortedRepos} />
            </div>
          )}

          {sortedRepos.length > 0 && (
            <p className="text-sm text-slate-400">
              Showing <span className="text-white font-semibold">{pagedRepos.length}</span> of{' '}
              <span className="text-white font-semibold">{sortedRepos.length}</span> repos
              {!favoritesOnly && totalCount > 0 && <span className="text-slate-600"> ({totalCount.toLocaleString()} total on GitHub)</span>}
            </p>
          )}

          {(loading || isFetching) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 animate-pulse space-y-3">
                  <div className="h-4 bg-slate-700 rounded w-2/3" />
                  <div className="h-3 bg-slate-700 rounded w-full" />
                  <div className="h-3 bg-slate-700 rounded w-5/6" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-5 w-16 bg-slate-700 rounded-full" />
                    <div className="h-5 w-14 bg-slate-700 rounded-full" />
                  </div>
                  <div className="h-8 bg-slate-700 rounded mt-2" />
                </div>
              ))}
            </div>
          )}

          {!loading && !isFetching && !error && sortedRepos.length === 0 && (activeChip || searchQuery || favoritesOnly) && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="text-5xl">🔍</div>
              <p className="text-slate-300 text-lg font-medium">No repositories found</p>
              <p className="text-slate-500 text-sm max-w-md">
                Try a different keyword/topic or disable favorites filter.
              </p>
            </div>
          )}

          {!loading && !isFetching && !error && sortedRepos.length === 0 && !activeChip && !searchQuery && !favoritesOnly && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Github size={48} className="text-slate-700" />
              <p className="text-slate-400 text-base font-medium">Explore GitHub repos</p>
              <p className="text-slate-600 text-sm">Click a topic chip or type a search query to get started.</p>
            </div>
          )}

          {!loading && !isFetching && pagedRepos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative">
              {pagedRepos.map((repo) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                  onOpenDetails={setSelectedRepo}
                  isFavorite={Boolean(favorites[repo.id])}
                  onToggleFavorite={toggleFavorite}
                  isComparing={compareIds.includes(repo.id)}
                  onToggleCompare={toggleCompare}
                  compareDisabled={compareIds.length >= 3}
                />
              ))}
            </div>
          )}

          {!loading && !isFetching && totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => {
                setPage(p)
                if (!favoritesOnly) {
                  triggerSearch(activeChip, searchQuery, sort, p)
                }
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          )}
        </div>

        <footer className="border-t border-slate-800 mt-10 py-6 text-center text-slate-400 text-xs space-y-1">
          <p>Built with ⚡ Jarvis + OpenClaw</p>
          <p>
            <a
              href="https://github.com/Sudharsan-Apple/github-repo-explorer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              GitHub Repository
            </a>
            {' · '}Powered by GitHub API
          </p>
        </footer>

        {compareIds.length >= 2 && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl bg-slate-900/95 border border-slate-700 rounded-xl p-3 flex items-center justify-between gap-3 shadow-xl">
            <div className="text-xs text-slate-300 flex items-center gap-2 flex-wrap">
              <GitCompare size={14} className="text-indigo-400" />
              {comparedRepos.map((repo) => (
                <span key={repo.id} className="px-2 py-1 rounded bg-slate-800 border border-slate-700">
                  {repo.name}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                className="text-xs px-2.5 py-1.5 border border-slate-600 rounded-lg hover:border-slate-500"
                onClick={() => setCompareIds([])}
              >
                Clear
              </button>
              <button
                className="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white"
                onClick={() => setShowCompareModal(true)}
              >
                Compare
              </button>
            </div>
          </div>
        )}

        {showBackToTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/40"
            title="Back to top"
          >
            <ArrowUp size={16} />
          </button>
        )}

        {selectedRepo && <RepoDetailModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />}

        {showCompareModal && comparedRepos.length >= 2 && (
          <CompareModal
            repos={comparedRepos}
            onClose={() => setShowCompareModal(false)}
            onClear={() => {
              setCompareIds([])
              setShowCompareModal(false)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Dashboard
