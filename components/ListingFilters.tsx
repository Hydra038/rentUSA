/**
 * ListingFilters Component
 * Advanced filtering sidebar for search results
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X } from 'lucide-react'

interface FilterOptions {
  state?: string
  city?: string
  zip?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  petsAllowed?: boolean
}

export default function ListingFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  
  const [filters, setFilters] = useState<FilterOptions>({
    state: searchParams.get('state') || undefined,
    city: searchParams.get('city') || undefined,
    zip: searchParams.get('zip') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
    bathrooms: searchParams.get('bathrooms') ? Number(searchParams.get('bathrooms')) : undefined,
    petsAllowed: searchParams.get('petsAllowed') === 'true',
  })

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Remove old filter params
    params.delete('state')
    params.delete('city')
    params.delete('zip')
    params.delete('minPrice')
    params.delete('maxPrice')
    params.delete('bedrooms')
    params.delete('bathrooms')
    params.delete('petsAllowed')
    
    // Add new filter params
    if (filters.state) params.set('state', filters.state)
    if (filters.city) params.set('city', filters.city)
    if (filters.zip) params.set('zip', filters.zip)
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString())
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString())
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms.toString())
    if (filters.bathrooms) params.set('bathrooms', filters.bathrooms.toString())
    if (filters.petsAllowed) params.set('petsAllowed', 'true')
    
    router.push(`/search?${params.toString()}`)
    setIsOpen(false)
  }

  const clearFilters = () => {
    setFilters({})
    const params = new URLSearchParams(searchParams.toString())
    params.delete('state')
    params.delete('city')
    params.delete('zip')
    params.delete('minPrice')
    params.delete('maxPrice')
    params.delete('bedrooms')
    params.delete('bathrooms')
    params.delete('petsAllowed')
    router.push(`/search?${params.toString()}`)
  }

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-4 right-4 bg-primary-600 text-white px-4 py-2 rounded-full shadow-lg z-40 flex items-center space-x-2"
      >
        <Filter className="h-5 w-5" />
        <span>Filters</span>
      </button>

      {/* Filter Panel */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-xl lg:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto p-6
      `}>
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <button onClick={clearFilters} className="text-sm text-primary-600 hover:underline">
            Clear All
          </button>
        </div>

        {/* Location Filters */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          
          {/* State Input */}
          <input
            type="text"
            placeholder="State (e.g., CA, NY, TX)"
            value={filters.state || ''}
            onChange={(e) => setFilters({ ...filters, state: e.target.value.toUpperCase() })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-2"
            maxLength={2}
          />
          
          {/* City Input */}
          <input
            type="text"
            placeholder="City (e.g., Los Angeles)"
            value={filters.city || ''}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-2"
          />
          
          {/* ZIP Code Input */}
          <input
            type="text"
            placeholder="ZIP Code (e.g., 90001)"
            value={filters.zip || ''}
            onChange={(e) => setFilters({ ...filters, zip: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            maxLength={5}
            pattern="[0-9]*"
          />
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) || undefined })}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) || undefined })}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bedrooms
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => setFilters({ ...filters, bedrooms: num })}
                className={`
                  border rounded-md py-2 text-sm font-medium transition-colors
                  ${filters.bedrooms === num
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'border-gray-300 text-gray-700 hover:border-primary-600'
                  }
                `}
              >
                {num}+
              </button>
            ))}
          </div>
        </div>

        {/* Bathrooms */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bathrooms
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 1.5, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => setFilters({ ...filters, bathrooms: num })}
                className={`
                  border rounded-md py-2 text-sm font-medium transition-colors
                  ${filters.bathrooms === num
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'border-gray-300 text-gray-700 hover:border-primary-600'
                  }
                `}
              >
                {num}+
              </button>
            ))}
          </div>
        </div>

        {/* Pets Allowed */}
        <div className="mb-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.petsAllowed || false}
              onChange={(e) => setFilters({ ...filters, petsAllowed: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Pets Allowed</span>
          </label>
        </div>

        {/* Apply Button */}
        <button
          onClick={applyFilters}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-md font-medium transition-colors"
        >
          Apply Filters
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}
    </>
  )
}
