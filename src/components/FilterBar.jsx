import React from 'react'
import { FILTER_CHIPS, SORT_OPTIONS } from '../utils/categories'
import { Tag, ArrowUpDown, Heart, Trash2 } from 'lucide-react'

const FilterBar = ({
  activeChip,
  onChipClick,
  sort,
  onSortChange,
  favoriteCount,
  favoritesOnly,
  onToggleFavorites,
  onClearCache,
}) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Tag size={14} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Topics</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            type="button"
            onClick={onClearCache}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border border-slate-700 text-slate-300 hover:border-slate-500"
          >
            <Trash2 size={12} />
            Clear Cache
          </button>

          <ArrowUpDown size={14} className="text-slate-400" />
          <label htmlFor="sort-select" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Sort by
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-100 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onToggleFavorites}
          className={`chip ${favoritesOnly ? 'chip-active' : 'chip-inactive'} inline-flex items-center gap-1.5`}
        >
          <Heart size={14} fill={favoritesOnly ? 'currentColor' : 'none'} />
          Favorites
          <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-black/25">{favoriteCount}</span>
        </button>

        {FILTER_CHIPS.map((chip) => {
          const isActive = activeChip === chip.topic
          return (
            <button
              key={chip.topic}
              onClick={() => onChipClick(isActive ? null : chip.topic)}
              className={`chip ${isActive ? 'chip-active' : 'chip-inactive'}`}
            >
              {chip.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default FilterBar
