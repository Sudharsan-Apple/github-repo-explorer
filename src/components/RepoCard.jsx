import React, { useState } from 'react'
import { Star, GitFork, Clock, ExternalLink, Tag, Clipboard, Check, Bookmark, Scale } from 'lucide-react'
import { getLanguageColor, getStarTier, formatNumber, formatDate } from '../utils/categories'

const RepoCard = ({
  repo,
  onOpenDetails,
  isFavorite,
  onToggleFavorite,
  isComparing,
  onToggleCompare,
  compareDisabled,
}) => {
  const starTier = getStarTier(repo.stargazers_count)
  const langColor = getLanguageColor(repo.language)
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(repo.html_url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => onOpenDetails(repo)}
      className="text-left relative bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 hover:bg-slate-800/80 transition-all duration-200 flex flex-col gap-3 group w-full"
    >
      <div className="flex items-start justify-between gap-2">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-blue-400 hover:text-blue-300 font-semibold text-sm leading-tight line-clamp-2 flex-1 group-hover:underline underline-offset-2 transition-colors"
        >
          {repo.full_name}
        </a>

        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite(repo)
            }}
            className={`transition-colors ${isFavorite ? 'text-yellow-400' : 'text-slate-500 hover:text-yellow-400'}`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Bookmark size={14} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="text-slate-500 hover:text-emerald-400 transition-colors"
            title="Copy repository link"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Clipboard size={14} />}
          </button>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-slate-500 hover:text-slate-300 transition-colors"
            title="Open on GitHub"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 flex-1">
        {repo.description || <span className="italic text-slate-600">No description provided.</span>}
      </p>

      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {repo.topics.slice(0, 4).map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-blue-900/30 border border-blue-800/40 text-blue-400 text-xs rounded-full"
            >
              <Tag size={9} />
              {t}
            </span>
          ))}
          {repo.topics.length > 4 && (
            <span className="px-2 py-0.5 bg-slate-700/50 text-slate-500 text-xs rounded-full">
              +{repo.topics.length - 4}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggleCompare(repo)
        }}
        disabled={compareDisabled && !isComparing}
        className={`inline-flex items-center justify-center gap-1 text-xs px-2 py-1 rounded-lg border w-fit transition-colors ${
          isComparing
            ? 'border-indigo-500 text-indigo-300 bg-indigo-900/20'
            : 'border-slate-600 text-slate-300 hover:border-slate-500'
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <Scale size={12} />
        {isComparing ? 'Comparing' : 'Compare'}
      </button>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-700/40">
        <div className="flex items-center gap-3 text-xs">
          <span className={`flex items-center gap-1 font-semibold ${starTier.color}`}>
            <Star size={12} fill="currentColor" />
            {formatNumber(repo.stargazers_count)}
          </span>

          <span className="flex items-center gap-1 text-slate-400">
            <GitFork size={12} />
            {formatNumber(repo.forks_count)}
          </span>

          <span className="flex items-center gap-1 text-slate-500">
            <Clock size={10} />
            {formatDate(repo.updated_at)}
          </span>
        </div>

        {repo.language && (
          <span
            className="flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border"
            style={{
              color: langColor,
              borderColor: `${langColor}40`,
              backgroundColor: `${langColor}15`,
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langColor }} />
            {repo.language}
          </span>
        )}
      </div>

      <div className={`absolute top-3 right-10 px-1.5 py-0.5 rounded text-xs border ${starTier.bg} ${starTier.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
        {starTier.label}
      </div>
    </button>
  )
}

export default RepoCard
