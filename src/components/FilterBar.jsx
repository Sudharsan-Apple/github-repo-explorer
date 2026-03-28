import React from 'react'
import { FILTER_CHIPS } from '../utils/categories'
import { Tag } from 'lucide-react'

const FilterBar = ({ activeChip, onChipClick }) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <Tag size={14} className="text-slate-400" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Topics</span>
      </div>
      <div className="flex flex-wrap gap-2">
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
