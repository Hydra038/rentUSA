/**
 * ListingCard Component - Apartments.com Style
 * Display a single listing in grid view
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import SaveButton from './SaveButton'

interface ListingCardProps {
  listing: {
    id: string
    title: string
    address: string
    city: { name: string }
    state: { code: string }
    price: number
    bedrooms: number
    bathrooms: number
    sqft?: number
    featured: boolean
    published?: boolean
    photos: Array<{ url: string; isPrimary: boolean }>
  }
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [imageError, setImageError] = useState(false)
  const primaryPhoto = listing.photos?.find(p => p.isPrimary) || listing.photos?.[0]
  
  // Format bedroom info like Apartments.com
  const bedroomText = listing.bedrooms === 0 
    ? 'Studio' 
    : listing.bedrooms === 1 
    ? '1 Bed' 
    : `${listing.bedrooms} Beds`

  return (
    <Link 
      href={`/listing/${listing.id}`}
      className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group active:scale-[0.98]"
    >
      {/* Image */}
      <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden bg-gray-200">
        {/* Save Button */}
        <div className="absolute top-3 left-3 z-20">
          <SaveButton listingId={listing.id} showText={false} size="sm" />
        </div>
        
        {/* Status Badge */}
        {listing.published !== undefined && (
          <div className="absolute top-3 right-3 z-10">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                listing.published
                  ? 'bg-green-500 text-white'
                  : 'bg-yellow-500 text-white'
              }`}
            >
              {listing.published ? '✓ Published' : '⏳ Pending'}
            </span>
          </div>
        )}
        
        {/* Featured Badge */}
        {listing.featured && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-600 text-white shadow-lg">
              ⭐ Featured
            </span>
          </div>
        )}
        
        {primaryPhoto && !imageError ? (
          <Image
            src={primaryPhoto.url}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImageError(true)}
            unoptimized={primaryPhoto.url.includes('unsplash.com')}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs sm:text-sm">No image available</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Property Name */}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
          {listing.title}
        </h3>

        {/* Address */}
        <p className="text-xs sm:text-sm text-gray-600 mb-1 line-clamp-1">
          {listing.address}
        </p>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
          {listing.city.name}, {listing.state.code.toUpperCase()}
        </p>

        {/* Price Range */}
        <p className="text-base sm:text-lg font-bold text-gray-900 mb-2">
          ${listing.price.toLocaleString()} - ${(listing.price + 500).toLocaleString()}
        </p>

        {/* Bedroom Info */}
        <p className="text-xs sm:text-sm text-gray-600">
          {bedroomText}
        </p>
      </div>
    </Link>
  )
}
