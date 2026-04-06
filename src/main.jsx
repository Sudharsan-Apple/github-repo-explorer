import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import App from './App.jsx'
import PersistQueryClientProvider from './lib/PersistQueryClientProvider'
import { queryClient } from './lib/queryClient'
import './index.css'

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'github-explorer-cache',
  throttleTime: 1000,
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PersistQueryClientProvider
        queryClient={queryClient}
        persister={persister}
        maxAge={60 * 60 * 1000}
      >
        <App />
      </PersistQueryClientProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </React.StrictMode>,
)
