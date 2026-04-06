import { useEffect, useState } from 'react'
import {
  persistQueryClientRestore,
  persistQueryClientSubscribe,
} from '@tanstack/query-persist-client-core'

const noopUnsubscribe = () => {}

const PersistQueryClientProvider = ({ queryClient, persister, maxAge, children }) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let unsubscribe = noopUnsubscribe

    const restore = async () => {
      await persistQueryClientRestore({ queryClient, persister, maxAge })
      unsubscribe = persistQueryClientSubscribe({ queryClient, persister, maxAge })
      setReady(true)
    }

    restore()

    return () => {
      unsubscribe()
    }
  }, [queryClient, persister, maxAge])

  if (!ready) return null

  return children
}

export default PersistQueryClientProvider
