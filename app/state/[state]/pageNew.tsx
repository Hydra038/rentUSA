/**
 * State Page - Apartments.com Style
 * Display all listings in a specific US state
 */

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ListingCard from '@/components/ListingCard'
import ListingFilters from '@/components/ListingFilters'
import Pagination from '@/components/Pagination'
import { getPaginationMeta } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface StatePageProps {
  params: { state: string }
  searchParams: {
    page?: string
    minPrice?: string
    maxPrice?: string
    bedrooms?: string
    bathrooms?: string
    propertyType?: string
    sort?: string
  }
}

export default async function StatePage({ params, searchParams }: StatePageProps) {
  const stateCode = params.state.toLowerCase()
  const page = Number(searchParams.page) || 1
  const limit = 12
  const offset = (page - 1) * limit

  // Get state data
  const stateData = await prisma.state.findUnique({
    where: { code: stateCode },
  })

  if (!stateData) {
    notFound()
  }

  // Build filter conditions
  const where: any = {
    stateId: stateData.id,
    published: true,
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {}
    if (searchParams.minPrice) where.price.gte = Number(searchParams.minPrice)
    if (searchParams.maxPrice) where.price.lte = Number(searchParams.maxPrice)
  }

  if (searchParams.bedrooms) {
    where.bedrooms = { gte: Number(searchParams.bedrooms) }
  }

  if (searchParams.bathrooms) {
    where.bathrooms = { gte: Number(searchParams.bathrooms) }
  }

  if (searchParams.propertyType) {
    where.propertyType = searchParams.propertyType
  }

  // Build orderBy
  let orderBy: any = { createdAt: 'desc' }
  if (searchParams.sort === 'price-asc') {
    orderBy = { price: 'asc' }
  } else if (searchParams.sort === 'price-desc') {
    orderBy = { price: 'desc' }
  }

  let listings: any[] = []
  let total = 0

  try {
    // Fetch listings
    ;[listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          city: true,
          state: true,
          photos: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy,
        skip: offset,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ])
  } catch (error) {
    console.error('Database error:', error)
    listings = []
    total = 0
  }

  const pagination = getPaginationMeta(total, page, limit)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="bg-gray-50 border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Explore Rentals in {stateData.name}
          </h1>
          <p className="text-gray-600 text-lg">
            {total} {total === 1 ? 'Rental' : 'Rentals'} Available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <ListingFilters />
        </div>

        {/* Listings Grid */}
        {listings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
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
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No rentals found in {stateData.name}.</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search in a different location.</p>
          </div>
        )}
      </div>
    </div>
  )
}
