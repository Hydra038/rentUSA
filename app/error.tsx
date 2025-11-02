/**
 * Global Error Page
 * Handles runtime errors in the application
 */

'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <AlertTriangle className="mx-auto h-24 w-24 text-red-500" />
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Something Went Wrong
        </h2>
        <p className="text-lg text-gray-600 mb-2">
          We encountered an unexpected error. Please try again.
        </p>
        {error.message && (
          <p className="text-sm text-gray-500 mb-8 font-mono bg-gray-100 p-3 rounded">
            {error.message}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Go Home
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-12 text-sm text-gray-500">
          <p>If this problem persists, please contact support.</p>
          {error.digest && (
            <p className="mt-2">
              Error ID: <span className="font-mono">{error.digest}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
