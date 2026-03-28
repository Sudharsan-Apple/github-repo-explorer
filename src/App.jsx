import React, { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'

const App = () => {
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    // Apply/remove dark class on <html>
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <Dashboard
      darkMode={darkMode}
      onToggleDark={() => setDarkMode((d) => !d)}
    />
  )
}

export default App
