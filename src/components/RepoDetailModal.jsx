import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X, Star, GitFork, AlertCircle, ExternalLink, Home } from 'lucide-react'
import { formatDate, formatNumber } from '../utils/categories'

const buildHeaders = () => ({
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
})

const decodeBase64Utf8 = (encoded) => {
  try {
    const binary = window.atob(encoded)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch {
    return 'Unable to decode README content.'
  }
}

const fetchReadme = async ({ queryKey }) => {
  const [, owner, repo] = queryKey
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
    headers: buildHeaders(),
  })

  if (res.status === 404) return 'README not found for this repository.'
  if (!res.ok) throw new Error('Failed to load README')

  const data = await res.json()
  if (!data?.content) return 'README is empty.'

  return decodeBase64Utf8(data.content.replace(/\n/g, ''))
}

const RepoDetailModal = ({ repo, onClose }) => {
  const { data: readme, isFetching } = useQuery({
    queryKey: ['repo-readme', repo?.owner?.login, repo?.name],
    queryFn: fetchReadme,
    enabled: Boolean(repo?.owner?.login && repo?.name),
    staleTime: 15 * 60 * 1000,
  })

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!repo) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60" onClick={onClose}>
      <aside
        className="absolute right-0 top-0 h-full w-full sm:w-[38rem] bg-slate-900 border-l border-slate-700 shadow-2xl p-5 overflow-y-auto animate-[slideIn_.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">{repo.full_name}</h2>
            <p className="text-slate-400 text-sm mt-1">Updated {formatDate(repo.updated_at)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          {repo.description || 'No description provided for this repository.'}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <Stat icon={Star} label="Stars" value={formatNumber(repo.stargazers_count)} />
          <Stat icon={GitFork} label="Forks" value={formatNumber(repo.forks_count)} />
          <Stat icon={AlertCircle} label="Open Issues" value={formatNumber(repo.open_issues_count)} />
          <Stat label="Language" value={repo.language || 'N/A'} />
        </div>

        <div className="space-y-2 text-sm mb-5">
          <Row label="License" value={repo.license?.name || 'No license listed'} />
          <Row
            label="Homepage"
            value={repo.homepage ? <a className="text-blue-400 hover:text-blue-300" href={repo.homepage} target="_blank" rel="noreferrer">{repo.homepage}</a> : 'No homepage'}
          />
        </div>

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

        <div className="flex flex-wrap gap-3 mb-5">
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

        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-2">README</h3>
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
            {isFetching ? (
              <p className="text-slate-400 text-sm">Loading README...</p>
            ) : (
              <pre className="text-xs leading-relaxed whitespace-pre-wrap break-words text-slate-200 max-h-[28rem] overflow-auto">{readme || 'No README content found.'}</pre>
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}

const Row = ({ label, value }) => (
  <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-2">
    <span className="text-slate-500">{label}</span>
    <span className="text-slate-200 text-right">{value}</span>
  </div>
)

const Stat = ({ icon: Icon, label, value }) => (
  <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3">
    <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
      {Icon ? <Icon size={12} /> : null}
      {label}
    </div>
    <div className="text-white font-semibold">{value}</div>
  </div>
)

export default RepoDetailModal
