import React from 'react'
import { Star, GitFork, Clock, ExternalLink, Tag } from 'lucide-react'
import { getLanguageColor, getStarTier, formatNumber, formatDate } from '../utils/categories'

const RepoCard = ({ repo }) => {
  const starTier = getStarTier(repo.stargazers_count)
  const langColor = getLanguageColor(repo.language)

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 hover:bg-slate-800/80 transition-all duration-200 flex flex-col gap-3 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 font-semibold text-sm leading-tight line-clamp-2 flex-1 group-hover:underline underline-offset-2 transition-colors"
        >
          {repo.full_name}
        </a>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-slate-300 shrink-0 mt-0.5 transition-colors"
          title="Open on GitHub"
        >
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 flex-1">
        {repo.description || <span className="italic text-slate-600">No description provided.</span>}
      </p>

      {/* Topics */}
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

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-700/40">
        <div className="flex items-center gap-3 text-xs">
          {/* Stars */}
          <span className={`flex items-center gap-1 font-semibold ${starTier.color}`}>
            <Star size={12} fill="currentColor" />
            {formatNumber(repo.stargazers_count)}
          </span>

          {/* Forks */}
          <span className="flex items-center gap-1 text-slate-400">
            <GitFork size={12} />
            {formatNumber(repo.forks_count)}
          </span>

          {/* Updated */}
          <span className="flex items-center gap-1 text-slate-500">
            <Clock size={10} />
            {formatDate(repo.updated_at)}
          </span>
        </div>

        {/* Language */}
        {repo.language && (
          <span
            className="flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border"
            style={{
              color: langColor,
              borderColor: `${langColor}40`,
              backgroundColor: `${langColor}15`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: langColor }}
            />
            {repo.language}
          </span>
        )}
      </div>

      {/* Star tier badge */}
      <div className={`absolute top-3 right-10 px-1.5 py-0.5 rounded text-xs border ${starTier.bg} ${starTier.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
        {starTier.label}
      </div>
    </div>
  )
}

export default RepoCard
