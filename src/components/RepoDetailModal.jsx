import React, { useEffect, useState } from 'react'
import { X, Star, GitFork, Eye, AlertCircle, ExternalLink, Home } from 'lucide-react'
import { formatDate, formatNumber, getLanguageColor } from '../utils/categories'

const RepoDetailModal = ({ repo, onClose }) => {
  const [languages, setLanguages] = useState({})

  useEffect(() => {
    const fetchLanguages = async () => {
      if (!repo?.languages_url) return
      try {
        const res = await fetch(repo.languages_url, {
          headers: {
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        })
        if (!res.ok) return
        const data = await res.json()
        setLanguages(data || {})
      } catch {
        setLanguages({})
      }
    }

    fetchLanguages()
  }, [repo])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!repo) return null

  const totalBytes = Object.values(languages).reduce((sum, value) => sum + value, 0)

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">{repo.full_name}</h2>
            <p className="text-slate-400 text-sm mt-1">Last updated: {formatDate(repo.updated_at)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed mb-5">
          {repo.description || 'No description provided for this repository.'}
        </p>

        {repo.topics?.length > 0 && (
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Topics</h3>
            <div className="flex flex-wrap gap-2">
              {repo.topics.map((topic) => (
                <span key={topic} className="px-2.5 py-1 rounded-full bg-blue-900/30 border border-blue-800/40 text-blue-300 text-xs">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Stat icon={Star} label="Stars" value={formatNumber(repo.stargazers_count)} />
          <Stat icon={GitFork} label="Forks" value={formatNumber(repo.forks_count)} />
          <Stat icon={Eye} label="Watchers" value={formatNumber(repo.watchers_count)} />
          <Stat icon={AlertCircle} label="Open Issues" value={formatNumber(repo.open_issues_count)} />
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Language Breakdown</h3>
          {Object.keys(languages).length === 0 ? (
            <p className="text-slate-500 text-sm">No language breakdown available.</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(languages)
                .sort((a, b) => b[1] - a[1])
                .map(([language, bytes]) => {
                  const percent = totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0
                  const color = getLanguageColor(language)
                  return (
                    <div key={language}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">{language}</span>
                        <span className="text-slate-400">{percent}%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full" style={{ width: `${percent}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            <ExternalLink size={14} />
            Open on GitHub
          </a>

          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-200 text-sm"
            >
              <Home size={14} />
              Open Homepage
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

const Stat = ({ icon: Icon, label, value }) => (
  <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3">
    <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
      <Icon size={12} />
      {label}
    </div>
    <div className="text-white font-semibold">{value}</div>
  </div>
)

export default RepoDetailModal
