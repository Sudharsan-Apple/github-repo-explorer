import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from 'recharts'
import { X, Star, GitFork, AlertCircle, Clock } from 'lucide-react'
import { formatDate, formatNumber } from '../utils/categories'

const CHART_TOOLTIP_STYLE = {
  backgroundColor: '#1c2128',
  border: '1px solid #30363d',
  borderRadius: '8px',
  color: '#e2e8f0',
  fontSize: '12px',
}

const CompareModal = ({ repos, onClose, onClear }) => {
  const chartData = repos.map((repo) => ({
    name: repo.name.length > 12 ? `${repo.name.slice(0, 12)}…` : repo.name,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
  }))

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="max-w-6xl w-full mx-auto mt-8 bg-slate-900 border border-slate-700 rounded-2xl p-5 max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-white">Compare Repositories</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-600 text-slate-300 hover:border-slate-500"
            >
              Clear compare
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {repos.map((repo) => (
            <div key={repo.id} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 space-y-2">
              <h3 className="font-semibold text-blue-300 text-sm">{repo.full_name}</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Info icon={Star} label="Stars" value={formatNumber(repo.stargazers_count)} />
                <Info icon={GitFork} label="Forks" value={formatNumber(repo.forks_count)} />
                <Info icon={AlertCircle} label="Open Issues" value={formatNumber(repo.open_issues_count)} />
                <Info icon={Clock} label="Updated" value={formatDate(repo.updated_at)} />
              </div>
              <p className="text-xs text-slate-400">Language: {repo.language || 'N/A'}</p>
              <div className="flex flex-wrap gap-1">
                {(repo.topics || []).slice(0, 6).map((topic) => (
                  <span key={topic} className="px-2 py-0.5 bg-blue-900/25 border border-blue-800/40 text-blue-300 text-xs rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Stars vs Forks</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend />
              <Bar dataKey="stars" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="forks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

const Info = ({ icon: Icon, label, value }) => (
  <div className="bg-slate-900/40 rounded p-2 border border-slate-700/40">
    <div className="text-slate-400 flex items-center gap-1 mb-0.5">
      <Icon size={11} />
      <span>{label}</span>
    </div>
    <p className="text-slate-100 font-semibold">{value}</p>
  </div>
)

export default CompareModal
