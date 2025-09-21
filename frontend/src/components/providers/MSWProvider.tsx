'use client'

import { useEffect, useState } from 'react'

interface MSWProviderProps {
  children: React.ReactNode
}

export function MSWProvider({ children }: MSWProviderProps) {
  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@/mocks/browser').then(({ worker }) => {
        worker.start({
          onUnhandledRequest: 'warn',
        }).then(() => {
          setMswReady(true)
        })
      })
    } else {
      setMswReady(true)
    }
  }, [])

  if (!mswReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Mock 서버를 시작하는 중...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
