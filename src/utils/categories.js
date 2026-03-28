export const FILTER_CHIPS = [
  { label: 'SharePoint', topic: 'sharepoint', color: 'blue' },
  { label: 'SPFx', topic: 'spfx', color: 'indigo' },
  { label: 'Agent Development', topic: 'ai-agents', color: 'purple' },
  { label: 'Copilot', topic: 'copilot', color: 'cyan' },
  { label: 'Anthropic', topic: 'anthropic', color: 'orange' },
  { label: 'Gemini', topic: 'google-gemini', color: 'blue' },
  { label: 'AI Agents', topic: 'autonomous-agents', color: 'violet' },
  { label: 'OpenAI', topic: 'openai', color: 'green' },
  { label: 'Claude', topic: 'claude', color: 'amber' },
  { label: 'LangChain', topic: 'langchain', color: 'teal' },
]

export const SORT_OPTIONS = [
  { label: 'Stars', value: 'stars' },
  { label: 'Forks', value: 'forks' },
  { label: 'Updated', value: 'updated' },
]

export const LANGUAGE_COLORS = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  default: '#6b7280',
}

export const getLanguageColor = (lang) => {
  return LANGUAGE_COLORS[lang] || LANGUAGE_COLORS.default
}

export const getStarTier = (stars) => {
  if (stars >= 1000) return { label: 'gold', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' }
  if (stars >= 100) return { label: 'silver', color: 'text-slate-300', bg: 'bg-slate-400/10 border-slate-400/30' }
  return { label: 'bronze', color: 'text-amber-600', bg: 'bg-amber-700/10 border-amber-700/30' }
}

export const formatNumber = (n) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n?.toString() ?? '0'
}

export const formatDate = (iso) => {
  if (!iso) return 'N/A'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export const ITEMS_PER_PAGE = 12
