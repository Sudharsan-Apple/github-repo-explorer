import React from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { getLanguageColor } from '../utils/categories'

const CHART_TOOLTIP_STYLE = {
  backgroundColor: '#1c2128',
  border: '1px solid #30363d',
  borderRadius: '8px',
  color: '#e2e8f0',
  fontSize: '12px',
}

// Language Distribution Pie
export const LanguagePie = ({ repos }) => {
  const counts = {}
  repos.forEach((r) => {
    if (r.language) counts[r.language] = (counts[r.language] || 0) + 1
  })
  const data = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }))

  if (data.length === 0) return <EmptyChart label="No language data" />

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Language Distribution</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={getLanguageColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
          <Legend
            formatter={(value) => (
              <span style={{ color: '#94a3b8', fontSize: '11px' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// Top 10 by Stars Bar
export const TopStarsBar = ({ repos }) => {
  const data = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
    .map((r) => ({
      name: r.name.length > 14 ? r.name.slice(0, 14) + '…' : r.name,
      stars: r.stargazers_count,
    }))

  if (data.length === 0) return <EmptyChart label="No star data" />

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Top 10 by Stars</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 0, right: 10, left: -10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <Tooltip contentStyle={CHART_TOOLTIP_STYLE} cursor={{ fill: '#ffffff10' }} />
          <Bar dataKey="stars" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Topic Comparison Bar
export const TopicComparisonBar = ({ repos }) => {
  const topicCounts = {}
  repos.forEach((r) => {
    (r.topics || []).forEach((t) => {
      topicCounts[t] = (topicCounts[t] || 0) + 1
    })
  })
  const data = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([topic, count]) => ({
      topic: topic.length > 12 ? topic.slice(0, 12) + '…' : topic,
      count,
    }))

  if (data.length === 0) return <EmptyChart label="No topic data" />

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Topic Frequency</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 0, right: 10, left: -10, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
          <XAxis
            dataKey="topic"
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            angle={-40}
            textAnchor="end"
            interval={0}
          />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <Tooltip contentStyle={CHART_TOOLTIP_STYLE} cursor={{ fill: '#ffffff10' }} />
          <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const EmptyChart = ({ label }) => (
  <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex items-center justify-center h-[280px]">
    <span className="text-slate-500 text-sm">{label}</span>
  </div>
)
