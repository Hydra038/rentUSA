/**
 * Search Page
 * Main search interface for finding listings
 */

import { supabaseAdmin } from '@/lib/supabase'
import ListingCard from '@/components/ListingCard'
import ListingFilters from '@/components/ListingFilters'
import Pagination from '@/components/Pagination'
import { getPaginationMeta } from '@/lib/utils'
import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface SearchParams {
  q?: string
  location?: string
  state?: string
  city?: string
  zip?: string
  minPrice?: string
  maxPrice?: string
  bedrooms?: string
  bathrooms?: string
  propertyType?: string
  page?: string
  sort?: string
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const query = searchParams.q || ''
  const location = searchParams.location || ''
  const stateFilter = searchParams.state
  const cityFilter = searchParams.city
  const zipFilter = searchParams.zip
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined
  const bedrooms = searchParams.bedrooms ? Number(searchParams.bedrooms) : undefined
  const bathrooms = searchParams.bathrooms ? Number(searchParams.bathrooms) : undefined
  const propertyType = searchParams.propertyType
  const page = Number(searchParams.page) || 1
  const limit = 12
  const offset = (page - 1) * limit
  const sort = searchParams.sort || 'newest'

  let listings: any[] = []
  let total = 0

  // Parse location query for city, state, or ZIP code
  let parsedCity: string | undefined
  let parsedState: string | undefined
  let parsedZip: string | undefined

  if (location) {
    // Check if it's a ZIP code (5 digits)
    const zipMatch = location.match(/\b\d{5}\b/)
    if (zipMatch) {
      parsedZip = zipMatch[0]
    }
    
    // Parse "City, State" format (e.g., "Chicago, IL" or "New York, NY")
    const cityStateMatch = location.match(/^([^,]+),\s*([A-Z]{2})$/i)
    if (cityStateMatch) {
      parsedCity = cityStateMatch[1].trim()
      parsedState = cityStateMatch[2].trim().toUpperCase()
    } else {
      // Check if it's just a state code (2 letters)
      const stateOnlyMatch = location.match(/^[A-Z]{2}$/i)
      if (stateOnlyMatch) {
        parsedState = location.trim().toUpperCase()
      } else {
        // Assume it's a city name
        parsedCity = location.trim()
      }
    }
  }

  try {
    // Build the query
    let queryBuilder = supabaseAdmin
      .from('Listing')
      .select(`
        id,
        title,
        description,
        address,
        zipCode,
        price,
        bedrooms,
        bathrooms,
        sqft,
        createdAt,
        city:City(id, name, slug),
        state:State(id, name, code),
        photos:Photo(id, url, isPrimary)
      `, { count: 'exact' })
      .eq('published', true)

    // Apply general search query (title, description, address)
    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%,address.ilike.%${query}%`)
    }

    // Apply ZIP code filter (from location or direct zip param)
    const zipToSearch = parsedZip || zipFilter
    if (zipToSearch) {
      queryBuilder = queryBuilder.eq('zipCode', zipToSearch)
    }

    // Apply state filter (from location, direct state param, or stateFilter)
    const stateToSearch = parsedState || stateFilter
    if (stateToSearch) {
      const { data: states } = await supabaseAdmin
        .from('State')
        .select('id')
        .eq('code', stateToSearch.toUpperCase())
        .single()
      
      if (states) {
        queryBuilder = queryBuilder.eq('stateId', states.id)
      }
    }

    // Apply city filter (from location or direct city param)
    const cityToSearch = parsedCity || cityFilter
    if (cityToSearch) {
      // Try exact slug match first
      let cityData = await supabaseAdmin
        .from('City')
        .select('id')
        .eq('slug', cityToSearch.toLowerCase().replace(/\s+/g, '-'))
        .single()
      
      // If no exact match, try name match (case insensitive)
      if (!cityData.data) {
        cityData = await supabaseAdmin
          .from('City')
          .select('id')
          .ilike('name', cityToSearch)
          .limit(1)
          .single()
      }
      
      if (cityData.data) {
        queryBuilder = queryBuilder.eq('cityId', cityData.data.id)
      }
    }

    if (minPrice !== undefined) {
      queryBuilder = queryBuilder.gte('price', minPrice)
    }

    if (maxPrice !== undefined) {
      queryBuilder = queryBuilder.lte('price', maxPrice)
    }

    if (bedrooms) {
      queryBuilder = queryBuilder.gte('bedrooms', bedrooms)
    }

    if (bathrooms) {
      queryBuilder = queryBuilder.gte('bathrooms', bathrooms)
    }

    // Apply sorting
    switch (sort) {
      case 'price-asc':
        queryBuilder = queryBuilder.order('price', { ascending: true })
        break
      case 'price-desc':
        queryBuilder = queryBuilder.order('price', { ascending: false })
        break
      case 'newest':
        queryBuilder = queryBuilder.order('createdAt', { ascending: false })
        break
      default:
        queryBuilder = queryBuilder.order('createdAt', { ascending: false })
    }

    // Apply pagination
    queryBuilder = queryBuilder.range(offset, offset + limit - 1)

    const { data, error, count } = await queryBuilder

    if (error) {
      console.error('Search error:', error)
    } else {
      listings = data || []
      total = count || 0
    }
  } catch (error) {
    console.error('Search error:', error)
  }

  const pagination = getPaginationMeta(total, page, limit)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back/Home Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {location ? `Rentals in ${location}` : query ? `Search results for "${query}"` : 'Search Listings'}
          </h1>
          <p className="text-gray-600">
            {total} {total === 1 ? 'listing' : 'listings'} found
            {parsedCity && ` in ${parsedCity}`}
            {parsedState && ` ${parsedCity ? ',' : 'in'} ${parsedState}`}
            {parsedZip && ` (ZIP: ${parsedZip})`}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <ListingFilters />
        </div>

        {/* Results */}
        {listings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {listings.map((listing) => {
                // Get the primary photo or first photo
                const primaryPhoto = listing.photos?.find((p: any) => p.isPrimary) || listing.photos?.[0]
                
                return (
                  <ListingCard
                    key={listing.id}
                    listing={{
                      id: listing.id,
                      title: listing.title,
                      address: listing.address,
                      city: listing.city,
                      state: listing.state,
                      price: Number(listing.price),
                      bedrooms: listing.bedrooms,
                      bathrooms: Number(listing.bathrooms),
                      sqft: listing.sqft ?? undefined,
                      featured: false,
                      photos: primaryPhoto ? [primaryPhoto] : []
                    }}
                  />
                )
              })}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No listings found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search filters or browse all states
            </p>
          </div>
        )}
      </div>

      {/* Floating Home Button for Mobile */}
      <Link
        href="/"
        className="fixed bottom-20 right-4 lg:hidden bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors z-30"
        aria-label="Go to Home"
      >
        <Home className="h-6 w-6" />
      </Link>
    </div>
  )
}
