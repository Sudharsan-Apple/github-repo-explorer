import React from 'react'
import { Star, GitFork, Code, Database } from 'lucide-react'
import { formatNumber } from '../utils/categories'

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex items-center gap-4">
    <div className={`p-2.5 rounded-lg ${color}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-slate-400 text-xs font-medium">{label}</p>
      <p className="text-white text-xl font-bold mt-0.5">{value}</p>
    </div>
  </div>
)

const StatsPanel = ({ repos, totalCount }) => {
  const totalRepos = repos.length
  const avgStars = totalRepos > 0
    ? Math.round(repos.reduce((s, r) => s + (r.stargazers_count || 0), 0) / totalRepos)
    : 0
  const avgForks = totalRepos > 0
    ? Math.round(repos.reduce((s, r) => s + (r.forks_count || 0), 0) / totalRepos)
    : 0

  const langCounts = {}
  repos.forEach((r) => {
    if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1
  })
  const topLang = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        icon={Database}
        label="Total Results"
        value={formatNumber(totalCount || totalRepos)}
        color="bg-blue-600/20 text-blue-400"
      />
      <StatCard
        icon={Star}
        label="Avg Stars"
        value={formatNumber(avgStars)}
        color="bg-yellow-500/20 text-yellow-400"
      />
      <StatCard
        icon={GitFork}
        label="Avg Forks"
        value={formatNumber(avgForks)}
        color="bg-purple-500/20 text-purple-400"
      />
      <StatCard
        icon={Code}
        label="Top Language"
        value={topLang}
        color="bg-green-500/20 text-green-400"
      />
    </div>
  )
}

export default StatsPanel
