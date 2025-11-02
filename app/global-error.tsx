/**
 * Global Error Boundary
 * Catches errors in the root layout
 */

'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-lg w-full text-center">
            <AlertTriangle className="mx-auto h-24 w-24 text-red-500 mb-8" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Critical Error
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              A critical error occurred. Please refresh the page.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Retry
              </button>
              <Link
                href="/"
                className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Home className="inline h-5 w-5 mr-2" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
