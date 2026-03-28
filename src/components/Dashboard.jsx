import React, { useState, useEffect, useMemo } from 'react'
import { Github, Sun, Moon, SortAsc, AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import FilterBar from './FilterBar'
import SearchBar from './SearchBar'
import RepoCard from './RepoCard'
import StatsPanel from './StatsPanel'
import { LanguagePie, TopStarsBar, TopicComparisonBar } from './Charts'
import Pagination from './Pagination'
import { useGitHubSearch } from '../hooks/useGitHubSearch'
import { SORT_OPTIONS, ITEMS_PER_PAGE } from '../utils/categories'

const Dashboard = ({ darkMode, onToggleDark }) => {
  const [activeChip, setActiveChip] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sort, setSort] = useState('stars')
  const [page, setPage] = useState(1)

  const { repos, loading, error, rateLimited, retryAfter, totalCount, search } = useGitHubSearch()

  const triggerSearch = (chip, query, sortBy) => {
    if (!chip && !query) return
    search({ topic: chip, query, sort: sortBy, order: 'desc', perPage: 100, page: 1 })
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

  // Sort repos client-side for the current page
  const sortedRepos = useMemo(() => {
    const arr = [...repos]
    if (sort === 'stars') arr.sort((a, b) => b.stargazers_count - a.stargazers_count)
    else if (sort === 'forks') arr.sort((a, b) => b.forks_count - a.forks_count)
    else if (sort === 'updated') arr.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    return arr
  }, [repos, sort])

  const totalPages = Math.ceil(sortedRepos.length / ITEMS_PER_PAGE)
  const pagedRepos = sortedRepos.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  // Load default on mount
  useEffect(() => {
    search({ topic: 'openai', sort: 'stars', order: 'desc', perPage: 100 })
    setActiveChip('openai')
  }, [])

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        {/* Header */}
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

        {/* Main layout */}
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
          {/* Filter chips */}
          <FilterBar activeChip={activeChip} onChipClick={handleChipClick} />

          {/* Rate limit warning */}
          {rateLimited && (
            <div className="flex items-center gap-3 bg-amber-900/20 border border-amber-700/50 rounded-xl p-4 text-amber-400 text-sm">
              <AlertCircle size={18} />
              <span>
                GitHub API rate limit reached. Please wait {retryAfter > 0 ? `~${retryAfter}s` : 'a moment'} before trying again.
                {!import.meta.env.VITE_GITHUB_TOKEN && (
                  <span className="ml-1 text-amber-500">
                    Tip: Add a <code className="bg-amber-900/30 px-1 rounded">VITE_GITHUB_TOKEN</code> in <code className="bg-amber-900/30 px-1 rounded">.env</code> for higher limits.
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Error */}
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

          {/* Stats */}
          {repos.length > 0 && (
            <StatsPanel repos={repos} totalCount={totalCount} />
          )}

          {/* Charts */}
          {repos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LanguagePie repos={repos} />
              <TopStarsBar repos={repos} />
              <TopicComparisonBar repos={repos} />
            </div>
          )}

          {/* Sort + count */}
          {repos.length > 0 && (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-slate-400">
                Showing <span className="text-white font-semibold">{pagedRepos.length}</span> of{' '}
                <span className="text-white font-semibold">{sortedRepos.length}</span> repos
                {totalCount > 0 && (
                  <span className="text-slate-600"> ({totalCount.toLocaleString()} total on GitHub)</span>
                )}
              </p>

              <div className="flex items-center gap-2">
                <SortAsc size={14} className="text-slate-400" />
                <span className="text-xs text-slate-400">Sort:</span>
                <div className="flex gap-1">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSortChange(opt.value)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        sort === opt.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <Loader2 size={40} className="text-blue-500 animate-spin" />
                <p className="text-slate-400 text-sm">Searching GitHub repositories…</p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && repos.length === 0 && (activeChip || searchQuery) && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Github size={48} className="text-slate-700" />
              <p className="text-slate-500 text-sm">No repositories found. Try a different search or filter.</p>
            </div>
          )}

          {/* Welcome state */}
          {!loading && !error && repos.length === 0 && !activeChip && !searchQuery && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Github size={48} className="text-slate-700" />
              <p className="text-slate-400 text-base font-medium">Explore GitHub repos</p>
              <p className="text-slate-600 text-sm">Click a topic chip or type a search query to get started.</p>
            </div>
          )}

          {/* Repo grid */}
          {!loading && pagedRepos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative">
              {pagedRepos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          )}

          {/* Pagination */}
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

        {/* Footer */}
        <footer className="border-t border-slate-800 mt-10 py-6 text-center text-slate-600 text-xs">
          GitHub Repo Explorer · Built with React + Vite + TailwindCSS + Recharts
        </footer>
      </div>
    </div>
  )
}

export default Dashboard
