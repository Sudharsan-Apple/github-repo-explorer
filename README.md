# GitHub Repo Explorer Dashboard

A beautiful, feature-rich GitHub repository explorer built with React 18, Vite, TailwindCSS, and Recharts.

![GitHub Repo Explorer](https://img.shields.io/badge/React-18-blue?logo=react) ![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan?logo=tailwindcss) ![Recharts](https://img.shields.io/badge/Recharts-2-red)

## Features

- **Filter Chips** — Click to search GitHub by topic: SharePoint, SPFx, Agent Development, Copilot, Anthropic, Gemini, AI Agents, OpenAI, Claude, LangChain
- **Search Bar** — Custom keyword search across all public GitHub repos
- **Repo Cards** — Name, description, stars, forks, language badge, last updated, topics, direct repo link
- **Star Tier Visual** — Color-coded: 🥇 Gold (>1000 stars), 🥈 Silver (>100), 🥉 Bronze (rest)
- **Charts (Recharts)**:
  - 🍩 Pie: Language distribution
  - 📊 Bar: Top 10 repos by stars
  - 📊 Bar: Topic frequency comparison
- **Stats Panel** — Total repos, avg stars, avg forks, most common language
- **Pagination** — 12 repos per page
- **Sort** — By stars, forks, or last updated
- **Dark/Light Mode Toggle** — Dark navy/slate default

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/Sudharsan-Apple/github-repo-explorer.git
cd github-repo-explorer

# 2. Install dependencies
npm install

# 3. Set up environment (optional but recommended for higher rate limits)
cp .env.example .env
# Edit .env and add your GitHub Personal Access Token

# 4. Run dev server
npm run dev
```

## Environment Variables

```env
VITE_GITHUB_TOKEN=your_github_personal_access_token_here
```

Without a token, the GitHub API allows 10 requests/min. With a token (no extra scopes needed for public repos), you get 30 requests/min.

## Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18 | UI framework |
| Vite | 5 | Build tool |
| TailwindCSS | 3 | Styling (darkMode: 'class') |
| Recharts | 2 | Charts & visualizations |
| Lucide React | latest | Icons |

## GitHub API

Uses `https://api.github.com/search/repositories` with:
- Topic search: `?q=topic:{TOPIC}&sort=stars&order=desc`
- Keyword search: `?q={QUERY}&sort=stars&order=desc`
- Rate limit handling with retry-after display

## License

MIT
