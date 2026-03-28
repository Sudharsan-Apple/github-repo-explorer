import React, { useState } from 'react'
import { Search, X } from 'lucide-react'

const SearchBar = ({ onSearch, loading }) => {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim()) {
      onSearch(value.trim())
    }
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
      <div className="relative flex items-center">
        <Search size={18} className="absolute left-3 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search any keyword, technology, or topic..."
          className="w-full pl-10 pr-12 py-3 bg-navy-700 border border-navy-500 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 text-sm"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-10 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={16} />
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="absolute right-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white p-1.5 rounded-lg transition-colors duration-200"
        >
          <Search size={14} />
        </button>
      </div>
    </form>
  )
}

export default SearchBar
