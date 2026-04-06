import React, { useState, useEffect, useMemo } from 'react'
import { Github, Sun, Moon, AlertCircle, RefreshCw, ArrowUp } from 'lucide-react'
import FilterBar from './FilterBar'
import SearchBar from './SearchBar'
import RepoCard from './RepoCard'
import RepoDetailModal from './RepoDetailModal'
import StatsPanel from './StatsPanel'
import { LanguagePie, TopStarsBar, TopicComparisonBar } from './Charts'
import Pagination from './Pagination'
import { useGitHubSearch } from '../hooks/useGitHubSearch'
import { ITEMS_PER_PAGE } from '../utils/categories'

const Dashboard = ({ darkMode, onToggleDark }) => {
  const [activeChip, setActiveChip] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sort, setSort] = useState('stars')
  const [page, setPage] = useState(1)
  const [selectedRepo, setSelectedRepo] = useState(null)
  const [showBackToTop, setShowBackToTop] = useState(false)

  const {
    repos,
    loading,
    error,
    rateLimited,
    retryAfter,
    totalCount,
    rateLimitRemaining,
    rateLimitLimit,
    search,
  } = useGitHubSearch()

  const triggerSearch = (chip, query, sortBy) => {
    if (!chip && !query) return
    const isNameSort = sortBy === 'name'
    search({
      topic: chip,
      query,
      sort: isNameSort ? 'stars' : sortBy,
      order: 'desc',
      perPage: 100,
      page: 1,
    })
    setPage(1)
  }

  const handleChipClick = (topic) => {
    setActiveChip(topic)
    setSearchQuery('')
    if (topic) triggerSearch(topic, '', sort)
  }

  const handleSearch = (q) => {
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

  const sortedRepos = useMemo(() => {
    const arr = [...repos]
    if (sort === 'stars') arr.sort((a, b) => b.stargazers_count - a.stargazers_count)
    else if (sort === 'forks') arr.sort((a, b) => b.forks_count - a.forks_count)
    else if (sort === 'updated') arr.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    else if (sort === 'name') arr.sort((a, b) => a.full_name.localeCompare(b.full_name))
    return arr
  }, [repos, sort])

  const totalPages = Math.ceil(sortedRepos.length / ITEMS_PER_PAGE)
  const pagedRepos = sortedRepos.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const isRateLimitNear = rateLimitRemaining !== null && rateLimitLimit !== null && rateLimitRemaining <= 10

  useEffect(() => {
    search({ topic: 'openai', sort: 'stars', order: 'desc', perPage: 100 })
    setActiveChip('openai')
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 350)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
          <FilterBar activeChip={activeChip} onChipClick={handleChipClick} sort={sort} onSortChange={handleSortChange} />

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

          {repos.length > 0 && <StatsPanel repos={repos} totalCount={totalCount} />}

          {repos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LanguagePie repos={repos} />
              <TopStarsBar repos={repos} />
              <TopicComparisonBar repos={repos} />
            </div>
          )}

          {repos.length > 0 && (
            <p className="text-sm text-slate-400">
              Showing <span className="text-white font-semibold">{pagedRepos.length}</span> of{' '}
              <span className="text-white font-semibold">{sortedRepos.length}</span> repos
              {totalCount > 0 && <span className="text-slate-600"> ({totalCount.toLocaleString()} total on GitHub)</span>}
            </p>
          )}

          {loading && (
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

          {!loading && !error && repos.length === 0 && (activeChip || searchQuery) && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="text-5xl">🔍</div>
              <p className="text-slate-300 text-lg font-medium">No repositories found</p>
              <p className="text-slate-500 text-sm max-w-md">
                Try a different keyword, broader topic, or switch sorting. Some niche searches may return zero results.
              </p>
            </div>
          )}

          {!loading && !error && repos.length === 0 && !activeChip && !searchQuery && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Github size={48} className="text-slate-700" />
              <p className="text-slate-400 text-base font-medium">Explore GitHub repos</p>
              <p className="text-slate-600 text-sm">Click a topic chip or type a search query to get started.</p>
            </div>
          )}

          {!loading && pagedRepos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative">
              {pagedRepos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} onOpenDetails={setSelectedRepo} />
              ))}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => {
                setPage(p)
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
      </div>
    </div>
  )
}

export default Dashboard
