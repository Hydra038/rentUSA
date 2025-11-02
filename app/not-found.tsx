/**
 * Not Found Page (404)
 * Custom 404 page for the application
 */

import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <div className="mt-4">
            <svg
              className="mx-auto h-32 w-32 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. The listing may have been removed or the URL might be incorrect.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Go Home
          </Link>
          <Link
            href="/state/ca"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Search className="h-5 w-5 mr-2" />
            Browse Listings
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12">
          <p className="text-sm text-gray-500 mb-4">Popular States:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['California', 'Texas', 'Florida', 'New York', 'Illinois', 'Pennsylvania'].map((state) => (
              <Link
                key={state}
                href={`/state/${state.toLowerCase().replace(' ', '-').slice(0, 2)}`}
                className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 hover:border-primary-300 transition-colors"
              >
                {state}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
