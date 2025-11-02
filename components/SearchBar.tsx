/**
 * SearchBar Component - Apartments.com Style
 * Main search interface for filtering listings
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

interface SearchBarProps {
  defaultQuery?: string
  className?: string
}

export default function SearchBar({ defaultQuery = '', className = '' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultQuery)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?location=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-3xl ${className}`}>
      <div className="relative flex items-stretch bg-white rounded-full shadow-xl overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="City, State or ZIP Code (e.g., Chicago, IL or 60601)"
          className="flex-1 px-8 py-4 text-lg text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
        />
        <button
          type="submit"
          className="px-6 py-4 bg-transparent hover:bg-gray-50 transition-colors flex items-center justify-center"
          aria-label="Search"
        >
          <Search className="h-6 w-6 text-green-600" />
        </button>
      </div>
    </form>
  )
}
