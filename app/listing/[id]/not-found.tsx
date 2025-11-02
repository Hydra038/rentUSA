/**
 * Listing Not Found Page
 * Custom 404 for listing pages
 */

import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function ListingNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
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

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Listing Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          This property listing is no longer available. It may have been rented or removed by the landlord.
        </p>

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
      </div>
    </div>
  )
}
