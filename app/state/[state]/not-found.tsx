/**
 * State Not Found Page
 * Custom 404 for state pages
 */

import Link from 'next/link'
import { Home, MapPin } from 'lucide-react'

export default function StateNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <MapPin className="mx-auto h-32 w-32 text-gray-400" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          State Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          The state you're looking for doesn't exist. Please check the URL or browse our available states.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Go Home
          </Link>
        </div>

        {/* Popular States */}
        <div className="mt-12">
          <p className="text-sm text-gray-500 mb-4">Browse Popular States:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { name: 'California', code: 'ca' },
              { name: 'Texas', code: 'tx' },
              { name: 'Florida', code: 'fl' },
              { name: 'New York', code: 'ny' },
              { name: 'Illinois', code: 'il' },
              { name: 'Pennsylvania', code: 'pa' },
            ].map((state) => (
              <Link
                key={state.code}
                href={`/state/${state.code}`}
                className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 hover:border-primary-300 transition-colors"
              >
                {state.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
